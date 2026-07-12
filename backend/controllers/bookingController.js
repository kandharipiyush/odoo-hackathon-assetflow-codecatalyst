const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// CREATE A BOOKING WITH OVERLAP PROTECTION
exports.createBooking = async (req, res) => {
    try {
        const { asset_id, start_time, end_time, purpose } = req.body;
        const employee_id = req.user?.id || "TEST_EMP_ID";

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
                start_time: { lt: end },
                end_time: { gt: start }
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
                employee_id,
                start_time: start,
                end_time: end,
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
            orderBy: { start_time: 'asc' }
        });
        res.status(200).json({ success: true, data: bookings });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error pulling booking directory.", error: error.message });
    }
};