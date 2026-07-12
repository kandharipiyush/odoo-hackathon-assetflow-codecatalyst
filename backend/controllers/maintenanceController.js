const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 1. REPORT A NEW MAINTENANCE DEFECT
exports.reportMaintenance = async (req, res) => {
    try {
        const { asset_id, issue_description, priority } = req.body;
        const requester_id = req.user?.id || "TEST_EMP_ID"; // System fallback

        if (!asset_id || !issue_description) {
            return res.status(400).json({ success: false, message: "Asset ID and description of issue are required." });
        }

        const request = await prisma.maintenanceRequest.create({
            data: {
                asset_id,
                requester_id,
                issue_description,
                priority: priority || "MEDIUM",
                status: "PENDING"
            }
        });

        res.status(201).json({ success: true, data: request });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to log maintenance filing.", error: error.message });
    }
};

// 2. APPROVE AND WORKLOG RESOLUTION
exports.resolveMaintenance = async (req, res) => {
    try {
        const { id } = req.params; // Maintenance Request ID
        const { action } = req.body; // 'APPROVE_REPAIR' or 'RESOLVE_FIX'
        const technician_id = req.user?.id || "TEST_TECH_ID";

        const request = await prisma.maintenanceRequest.findUnique({ where: { id } });
        if (!request) {
            return res.status(404).json({ success: false, message: "Maintenance profile record not found." });
        }

        const updatedData = await prisma.$transaction(async (tx) => {
            if (action === "APPROVE_REPAIR") {
                // Update request to assigned status
                const updatedRequest = await tx.maintenanceRequest.update({
                    where: { id },
                    data: { status: "IN_PROGRESS", assigned_to_id: technician_id }
                });

                // Flag the asset status to block usage down the line
                await tx.asset.update({
                    where: { id: request.asset_id },
                    data: { status: "UNDER_MAINTENANCE" }
                });

                return updatedRequest;
            }

            if (action === "RESOLVE_FIX") {
                const updatedRequest = await tx.maintenanceRequest.update({
                    where: { id },
                    data: { status: "RESOLVED", completed_at: new Date() }
                });

                // Restore asset back to deployment-ready pool
                await tx.asset.update({
                    where: { id: request.asset_id },
                    data: { status: "AVAILABLE" }
                });

                return updatedRequest;
            }
        });

        res.status(200).json({ success: true, data: updatedData });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error modifying maintenance state sequence.", error: error.message });
    }
};

// 3. GET ALL MAINTENANCE REQUESTS
exports.getAllRequests = async (req, res) => {
    try {
        const requests = await prisma.maintenanceRequest.findMany({
            include: { asset: true },
            orderBy: { created_at: 'desc' }
        });
        res.status(200).json({ success: true, count: requests.length, data: requests });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching maintenance requests.", error: error.message });
    }
};