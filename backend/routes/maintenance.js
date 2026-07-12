const express = require('express');
const router = express.Router();
const maintenanceController = require('../controllers/maintenanceController');

router.post('/', maintenanceController.reportMaintenance);
router.patch('/:id/resolve', maintenanceController.resolveMaintenance);

module.exports = router;