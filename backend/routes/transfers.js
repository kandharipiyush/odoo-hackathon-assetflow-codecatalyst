const express = require('express');
const router = express.Router();
const transferController = require('../controllers/transferController');

router.post('/', transferController.createTransferRequest);
router.patch('/:id/action', transferController.actionTransferRequest);

module.exports = router;