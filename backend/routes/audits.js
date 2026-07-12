const express = require('express');
const router = express.Router();
const auditController = require('../controllers/auditController');

router.get('/cycles', auditController.getAllAuditCycles);
router.post('/cycles', auditController.startAuditCycle);
router.post('/items', auditController.verifyAuditItem);

module.exports = router;