const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

// @desc    Get Admin Dashboard metrics
// @route   GET /api/admin/stats
// @access  Private (Admin)
exports.getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalFarmers,
      totalConsumers,
      totalProducts,
      totalOrders,
      orders,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'farmer' }),
      User.countDocuments({ role: 'consumer' }),
      Product.countDocuments(),
      Order.countDocuments(),
      Order.find({ status: { $ne: 'cancelled' } }).select('totalPrice status'),
    ]);

    const totalRevenue = orders.reduce((acc, curr) => acc + (curr.totalPrice || 0), 0);
    const pendingOrders = orders.filter((o) => o.status === 'pending').length;

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalFarmers,
        totalConsumers,
        totalProducts,
        totalOrders,
        totalRevenue,
        pendingOrders,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users with filtering
// @route   GET /api/admin/users
// @access  Private (Admin)
exports.getAllUsers = async (req, res, next) => {
  try {
    const { role, search, status } = req.query;
    const query = {};

    if (role && role !== 'all') {
      query.role = role;
    }
    if (status && status !== 'all') {
      query.status = status;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { 'farmerProfile.farmName': { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user status / verification
// @route   PATCH /api/admin/users/:id
// @access  Private (Admin)
exports.updateUserStatus = async (req, res, next) => {
  try {
    const { status, isVerified } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (status) user.status = status;
    if (isVerified !== undefined && user.role === 'farmer') {
      user.farmerProfile.isVerified = isVerified;
    }

    await user.save();

    res.json({
      success: true,
      message: 'User updated successfully',
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all products for moderation
// @route   GET /api/admin/products
// @access  Private (Admin)
exports.getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find()
      .populate('farmer', 'name email phone farmerProfile')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Moderate product (Approve/Reject)
// @route   PATCH /api/admin/products/:id/approve
// @access  Private (Admin)
exports.toggleProductApproval = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    product.isApproved = !product.isApproved;
    await product.save();

    res.json({
      success: true,
      message: `Product has been ${product.isApproved ? 'approved' : 'unapproved'}`,
      isApproved: product.isApproved,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders across system
// @route   GET /api/admin/orders
// @access  Private (Admin)
exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate('farmer', 'name phone email farmerProfile')
      .populate('consumer', 'name phone email')
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
