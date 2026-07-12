
const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const authenticate = require('../middleware/authenticate');

router.post('/', authenticate, bookingController.createBooking);
router.get('/', authenticate, bookingController.getAllBookings);

module.exports = router;