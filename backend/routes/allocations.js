const express = require('express');
const router = express.Router();
const allocationController = require('../controllers/allocationController');
const authenticate = require('../middleware/authenticate');

router.post('/', authenticate, allocationController.createAllocation);
router.get('/', authenticate, allocationController.getAllAllocations);

module.exports = router;