const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('consumer'), createOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);
router.patch('/:id/status', protect, authorize('farmer', 'admin'), updateOrderStatus);

module.exports = router;
