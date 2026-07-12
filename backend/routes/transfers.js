const express = require('express');
const router = express.Router();
const transferController = require('../controllers/transferController');
const authenticate = require('../middleware/authenticate');

router.get('/', authenticate, transferController.getAllTransfers);
router.post('/', authenticate, transferController.createTransferRequest);
router.patch('/:id/action', authenticate, transferController.actionTransferRequest);

module.exports = router;