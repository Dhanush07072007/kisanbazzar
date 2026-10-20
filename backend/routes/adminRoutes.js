const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getAllUsers,
  updateUserStatus,
  getAllProducts,
  toggleProductApproval,
  getAllOrders,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.patch('/users/:id', updateUserStatus);
router.get('/products', getAllProducts);
router.patch('/products/:id/approve', toggleProductApproval);
router.get('/orders', getAllOrders);

module.exports = router;
