const express = require('express');
const router = express.Router();
const auditController = require('../controllers/auditController');
const authenticate = require('../middleware/authenticate');

router.get('/cycles', authenticate, auditController.getAllAuditCycles);
router.post('/cycles', authenticate, auditController.startAuditCycle);
router.post('/items', authenticate, auditController.verifyAuditItem);

module.exports = router;