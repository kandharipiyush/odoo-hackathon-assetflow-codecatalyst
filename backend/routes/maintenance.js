const express = require('express');
const router = express.Router();
const maintenanceController = require('../controllers/maintenanceController');
const authenticate = require('../middleware/authenticate');

router.get('/', authenticate, maintenanceController.getAllRequests);
router.post('/', authenticate, maintenanceController.reportMaintenance);
router.patch('/:id/resolve', authenticate, maintenanceController.resolveMaintenance);

module.exports = router;