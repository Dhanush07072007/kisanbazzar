const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Create new order request
// @route   POST /api/orders
// @access  Private (Consumer)
exports.createOrder = async (req, res, next) => {
  try {
    const { productId, quantity, deliveryAddress, notes, paymentMethod } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (!product.inStock) {
      return res.status(400).json({ success: false, message: 'This product is currently out of stock' });
    }

    if (quantity > product.quantityAvailable) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.quantityAvailable} ${product.unit} available`,
      });
    }

    if (product.minimumOrderQuantity && quantity < product.minimumOrderQuantity) {
      return res.status(400).json({
        success: false,
        message: `Minimum order quantity is ${product.minimumOrderQuantity} ${product.unit}`,
      });
    }

    const unitPrice = product.price;
    const totalPrice = unitPrice * Number(quantity);

    const order = await Order.create({
      consumer: req.user._id,
      farmer: product.farmer,
      product: product._id,
      productName: product.name,
      quantity: Number(quantity),
      unit: product.unit,
      unitPrice,
      totalPrice,
      deliveryAddress,
      notes: notes || '',
      paymentMethod: paymentMethod || 'cash_on_delivery',
    });

    // Reduce product quantity available
    product.quantityAvailable = Math.max(0, product.quantityAvailable - Number(quantity));
    if (product.quantityAvailable === 0) {
      product.inStock = false;
    }
    await product.save();

    res.status(201).json({
      success: true,
      message: 'Order request placed successfully!',
      order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user's orders (Consumer sees orders placed, Farmer sees orders received)
// @route   GET /api/orders/my-orders
// @access  Private
exports.getMyOrders = async (req, res, next) => {
  try {
    let query = {};
    if (req.user.role === 'farmer') {
      query.farmer = req.user._id;
    } else {
      query.consumer = req.user._id;
    }

    const orders = await Order.find(query)
      .populate('farmer', 'name phone avatar farmerProfile')
      .populate('consumer', 'name phone email avatar consumerProfile')
      .populate('product', 'name primaryImage price unit')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('farmer', 'name phone email avatar farmerProfile')
      .populate('consumer', 'name phone email avatar consumerProfile')
      .populate('product', 'name primaryImage price unit description');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Authorization check
    const isConsumer = order.consumer._id.toString() === req.user._id.toString();
    const isFarmer = order.farmer._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isConsumer && !isFarmer && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
    }

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PATCH /api/orders/:id/status
// @access  Private (Farmer or Admin)
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status, farmerNotes } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Check authorization: farmer or admin
    if (
      order.farmer.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Only the designated farmer or admin can update order status',
      });
    }

    if (status) {
      order.status = status;
    }
    if (farmerNotes !== undefined) {
      order.farmerNotes = farmerNotes;
    }

    await order.save();

    res.json({
      success: true,
      message: `Order status updated to ${order.status}`,
      order,
    });
  } catch (error) {
    next(error);
  }
};
