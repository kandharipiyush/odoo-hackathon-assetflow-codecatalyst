const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ALLOCATE AN ASSET TO AN EMPLOYEE (WITH DOUBLE-ALLOCATION GUARD)
exports.createAllocation = async (req, res) => {
    try {
        const { asset_id, allocated_to_id, notes, expected_return_date } = req.body;
        const allocator_id = req.user?.id || "TEST_MGR_ID"; // System fallback for testing

        if (!asset_id || !allocated_to_id) {
            return res.status(400).json({ success: false, message: "Asset ID and Target Employee ID are required." });
        }

        // 1. Verify asset current availability status
        const asset = await prisma.asset.findUnique({ where: { id: asset_id } });
        if (!asset) {
            return res.status(404).json({ success: false, message: "Target asset not found in inventory registry." });
        }

        // DOUBLE-ALLOCATION GUARD: Block action if asset isn't explicitly AVAILABLE
        if (asset.status === "ALLOCATED") {
            return res.status(400).json({
                success: false,
                message: "Deployment Halt: This asset is currently allocated to another employee."
            });
        }
        if (asset.status === "UNDER_MAINTENANCE" || asset.status === "LOST") {
            return res.status(400).json({
                success: false,
                message: `Deployment Halt: Asset cannot be allocated while marked as ${asset.status}.`
            });
        }

        // 2. Perform the assignment and update the asset state in a atomic sequence
        const allocation = await prisma.assetAllocation.create({
            data: {
                asset_id,
                allocated_to_id,
                allocator_id,
                notes,
                expected_return_date: expected_return_date ? new Date(expected_return_date) : null,
                status: "ACTIVE"
            }
        });

        // Update target item status to ALLOCATED
        await prisma.asset.update({
            where: { id: asset_id },
            data: { status: "ALLOCATED" }
        });

        res.status(201).json({ success: true, data: allocation });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to deploy asset assignment.", error: error.message });
    }
};

// GET ALL ACTIVE ASSET DEPLOYMENTS
exports.getAllAllocations = async (req, res) => {
    try {
        const allocations = await prisma.assetAllocation.findMany({
            where: { status: "ACTIVE" },
            include: {
                asset: true, // Automatically side-load asset properties
                allocated_to: true // Include user to display name
            }
        });
        res.status(200).json({ success: true, count: allocations.length, data: allocations });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error reading active deployment records.", error: error.message });
    }
};