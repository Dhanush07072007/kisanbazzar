const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getMyProducts,
  toggleStockStatus,
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getProducts);
router.get('/farmer/me', protect, authorize('farmer', 'admin'), getMyProducts);
router.get('/:id', getProductById);
router.post('/', protect, authorize('farmer', 'admin'), createProduct);
router.put('/:id', protect, authorize('farmer', 'admin'), updateProduct);
router.delete('/:id', protect, authorize('farmer', 'admin'), deleteProduct);
router.patch('/:id/toggle-stock', protect, authorize('farmer'), toggleStockStatus);

module.exports = router;
