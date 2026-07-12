const express = require('express');
const router = express.Router();
const auditController = require('../controllers/auditController');

router.post('/cycles', auditController.startAuditCycle);
router.post('/items', auditController.verifyAuditItem);

module.exports = router;