const express = require('express');
const router = express.Router();
const assetController = require('../controllers/assetController');

// Standard REST endpoints for the asset workspace directory
router.post('/', assetController.createAsset);
router.get('/', assetController.getAllAssets);
router.get('/:id', assetController.getAssetById);

module.exports = router;