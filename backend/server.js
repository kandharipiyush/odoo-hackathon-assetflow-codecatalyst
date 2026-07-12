const express = require('express');
const router = express.Router();

// Import the engines you just built
const allocationRoutes = require('./allocations');
const transferRoutes = require('./transfers');
const maintenanceRoutes = require('./maintenance');
const auditRoutes = require('./audits');

// Mount them to clean API endpoints
router.use('/allocations', allocationRoutes);
router.use('/transfers', transferRoutes);
router.use('/maintenance', maintenanceRoutes);
router.use('/audits', auditRoutes);

module.exports = router;