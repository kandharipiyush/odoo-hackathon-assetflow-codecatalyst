const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET /api/dashboard/stats
exports.getStats = async (req, res) => {
    try {
        const assetsAvailable = await prisma.asset.count({
            where: { status: 'AVAILABLE' }
        });

        const assetsAllocated = await prisma.asset.count({
            where: { status: 'ALLOCATED' }
        });

        const maintenanceToday = await prisma.maintenanceRequest.count({
            where: {
                status: { in: ['PENDING', 'APPROVED', 'ASSIGNED', 'IN_PROGRESS'] }
            }
        });

        const activeBookings = await prisma.booking.count({
            where: {
                status: { in: ['UPCOMING', 'ONGOING'] }
            }
        });

        const pendingTransfers = await prisma.transferRequest.count({
            where: { status: 'PENDING' }
        });

        const upcomingReturns = await prisma.assetAllocation.count({
            where: {
                status: 'ACTIVE',
                due_date: { gte: new Date() }
            }
        });

        res.status(200).json({
            success: true,
            data: {
                assetsAvailable,
                assetsAllocated,
                maintenanceToday,
                activeBookings,
                pendingTransfers,
                upcomingReturns
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to load dashboard metrics.",
            error: error.message
        });
    }
};
