const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 1. START A NEW AUDIT CYCLE
exports.startAuditCycle = async (req, res) => {
    try {
        const { title, description, end_date } = req.body;
        const auditor_id = req.user?.id || "TEST_AUDITOR_ID"; // System fallback

        if (!title) {
            return res.status(400).json({ success: false, message: "Audit title is required." });
        }

        const auditCycle = await prisma.auditCycle.create({
            data: {
                title,
                description,
                end_date: end_date ? new Date(end_date) : null,
                auditor_id,
                status: "OPEN"
            }
        });

        res.status(201).json({ success: true, data: auditCycle });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to initiate audit cycle.", error: error.message });
    }
};

// 2. LOG VERIFICATION STATUS FOR AN ASSET WITHIN AN AUDIT
exports.verifyAuditItem = async (req, res) => {
    try {
        const { audit_cycle_id, asset_id, verification_status, notes } = req.body;

        if (!audit_cycle_id || !asset_id || !verification_status) {
            return res.status(400).json({ success: false, message: "Missing required verification details." });
        }

        // Enforce specific validation values
        if (!["VERIFIED", "MISSING", "DAMAGED"].includes(verification_status)) {
            return res.status(400).json({ success: false, message: "Status must be VERIFIED, MISSING, or DAMAGED." });
        }

        // Execute changes atomically
        const auditItem = await prisma.$transaction(async (tx) => {
            const item = await tx.auditItem.create({
                data: {
                    audit_cycle_id,
                    asset_id,
                    verification_status,
                    notes,
                    verified_at: new Date()
                }
            });

            // If an asset is found to be missing or broken, automatically update its master record status
            if (verification_status === "MISSING") {
                await tx.asset.update({ where: { id: asset_id }, data: { status: "LOST" } });
            } else if (verification_status === "DAMAGED") {
                await tx.asset.update({ where: { id: asset_id }, data: { status: "UNDER_MAINTENANCE" } });
            }

            return item;
        });

        res.status(201).json({ success: true, data: auditItem });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error submitting verification details.", error: error.message });
    }
};