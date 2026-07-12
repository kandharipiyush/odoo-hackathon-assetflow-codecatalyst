const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 1. INITIATE A TRANSFER REQUEST
exports.createTransferRequest = async (req, res) => {
    try {
        const { asset_id, target_department_id, reason } = req.body;
        const requester_id = req.user?.id || "TEST_REQ_ID"; // System fallback

        if (!asset_id || !target_department_id) {
            return res.status(400).json({ success: false, message: "Asset ID and Target Department ID are required." });
        }

        // Verify asset exists
        const asset = await prisma.asset.findUnique({ where: { id: asset_id } });
        if (!asset) {
            return res.status(404).json({ success: false, message: "Asset not found." });
        }

        const transferRequest = await prisma.transferRequest.create({
            data: {
                asset_id,
                target_department_id,
                requester_id,
                reason,
                status: 'PENDING'
            }
        });

        res.status(201).json({ success: true, data: transferRequest });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to log transfer request.", error: error.message });
    }
};

// 2. APPROVE OR REJECT A TRANSFER REQUEST
exports.actionTransferRequest = async (req, res) => {
    try {
        const { id } = req.params; // Transfer Request ID
        const { status } = req.body; // 'APPROVED' or 'REJECTED'
        const actioned_by_id = req.user?.id || "TEST_ADMIN_ID";

        if (!['APPROVED', 'REJECTED'].includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid status. Must be APPROVED or REJECTED." });
        }

        const request = await prisma.transferRequest.findUnique({ where: { id } });
        if (!request) {
            return res.status(404).json({ success: false, message: "Transfer request not found." });
        }

        if (request.status !== 'PENDING') {
            return res.status(400).json({ success: false, message: "This request has already been actioned." });
        }

        // Use a transaction to update both the request status and the asset's location atomically
        const updatedRequest = await prisma.$transaction(async (tx) => {
            const updated = await tx.transferRequest.update({
                where: { id },
                data: { status, actioned_by_id, actioned_at: new Date() }
            });

            if (status === 'APPROVED') {
                // Permanently update the asset's master department mapping
                await tx.asset.update({
                    where: { id: request.asset_id },
                    data: { department_id: request.target_department_id }
                });
            }

            return updated;
        });

        res.status(200).json({ success: true, data: updatedRequest });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error processing transfer decision.", error: error.message });
    }
};