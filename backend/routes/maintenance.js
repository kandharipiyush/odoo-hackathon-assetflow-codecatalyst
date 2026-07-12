const express = require('express');
const router = express.Router();
const maintenanceController = require('../controllers/maintenanceController');

router.get('/', maintenanceController.getAllRequests);
router.post('/', maintenanceController.reportMaintenance);
router.patch('/:id/resolve', maintenanceController.resolveMaintenance);

module.exports = router;