const express = require('express');
const router = express.Router();
const orgController = require('../controllers/orgController');
const authenticate = require('../middleware/authenticate');
const checkRole = require('../middleware/checkRole');

// Departments Routes (Only accessible by ADMIN)
router.get('/departments', authenticate, checkRole(['ADMIN']), orgController.getDepartments);
router.post('/departments', authenticate, checkRole(['ADMIN']), orgController.createDepartment);

// Asset Categories Routes (Only accessible by ADMIN)
router.get('/asset-categories', authenticate, checkRole(['ADMIN']), orgController.getAssetCategories);
router.post('/asset-categories', authenticate, checkRole(['ADMIN']), orgController.createAssetCategory);

// Promote User Route (Only accessible by ADMIN)
router.patch('/users/:id/promote', authenticate, checkRole(['ADMIN']), orgController.promoteUser);

module.exports = router;
