const express = require('express');
const router = express.Router();
const assetController = require('../controllers/assetController');
const authenticate = require('../middleware/authenticate');

// Standard REST endpoints for the asset workspace directory
router.post('/', authenticate, assetController.createAsset);
router.get('/', authenticate, assetController.getAllAssets);
router.get('/:id', authenticate, assetController.getAssetById);

module.exports = router;