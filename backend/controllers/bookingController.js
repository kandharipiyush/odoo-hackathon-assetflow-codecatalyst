const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// CREATE A BOOKING WITH OVERLAP PROTECTION
exports.createBooking = async (req, res) => {
    try {
        const { asset_id, start_time, end_time, purpose } = req.body;
        const user_id = req.user?.id || "TEST_EMP_ID";

        if (!asset_id || !start_time || !end_time) {
            return res.status(400).json({ success: false, message: "Missing required booking details." });
        }

        const start = new Date(start_time);
        const end = new Date(end_time);

        if (start >= end) {
            return res.status(400).json({ success: false, message: "End time must be after start time." });
        }

        // Overlap math: (ExistingStart < NewEnd) AND (ExistingEnd > NewStart)
        const overlappingBooking = await prisma.booking.findFirst({
            where: {
                asset_id: asset_id,
                status: { in: ['UPCOMING', 'ONGOING'] },
                start_date: { lt: end },
                end_date: { gt: start }
            }
        });

        if (overlappingBooking) {
            return res.status(409).json({
                success: false,
                message: "Time slot conflict! This resource is already reserved for the requested window."
            });
        }

        const booking = await prisma.booking.create({
            data: {
                asset_id,
                user_id,
                start_date: start,
                end_date: end,
                purpose,
                status: 'UPCOMING'
            }
        });

        res.status(201).json({ success: true, data: booking });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error completing resource reservation.", error: error.message });
    }
};

// GET ALL BOOKINGS
exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await prisma.booking.findMany({
            include: {
                asset: true,
                user: true
            },
            orderBy: { start_date: 'desc' }
        });

        const formatted = bookings.map(b => {
            const startDate = new Date(b.start_date);
            const endDate = new Date(b.end_date);
            const startHour = startDate.getHours().toString().padStart(2, '0');
            const startMin = startDate.getMinutes().toString().padStart(2, '0');
            const endHour = endDate.getHours().toString().padStart(2, '0');
            const endMin = endDate.getMinutes().toString().padStart(2, '0');

            return {
                id: b.id,
                employee: b.user ? b.user.name : 'System User',
                assetId: b.asset_id,
                assetName: b.asset ? b.asset.name : 'Unknown Asset',
                date: b.start_date ? new Date(b.start_date).toISOString().split('T')[0] : '',
                time: `${startHour}:${startMin} - ${endHour}:${endMin}`,
                status: b.status.charAt(0).toUpperCase() + b.status.slice(1).toLowerCase(), // UPCOMING -> Upcoming
                purpose: b.purpose
            };
        });

        res.status(200).json({ success: true, data: formatted });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error pulling booking directory.", error: error.message });
    }
};