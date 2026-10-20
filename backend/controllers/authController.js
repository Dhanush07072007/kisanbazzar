const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Product = require('../models/Product');

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'kisanbazar_super_secure_jwt_secret_key_2026_hackathon',
    { expiresIn: '30d' }
  );
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role, phone, farmerProfile, consumerProfile } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'A user with this email address already exists',
      });
    }

    const assignedRole = ['farmer', 'consumer', 'admin'].includes(role) ? role : 'consumer';

    const user = await User.create({
      name,
      email,
      password,
      role: assignedRole,
      phone: phone || '',
      farmerProfile: assignedRole === 'farmer' ? (farmerProfile || {}) : {},
      consumerProfile: assignedRole === 'consumer' ? (consumerProfile || {}) : {},
    });

    const token = generateToken(user._id);

    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: userResponse,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password',
      });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    if (user.status === 'suspended') {
      return res.status(403).json({
        success: false,
        message: 'Account suspended. Contact platform administrator.',
      });
    }

    const token = generateToken(user._id);

    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: userResponse,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const { name, phone, avatar, farmerProfile, consumerProfile } = req.body;

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (avatar) user.avatar = avatar;

    if (user.role === 'farmer' && farmerProfile) {
      user.farmerProfile = { ...user.farmerProfile, ...farmerProfile };
    }

    if (user.role === 'consumer' && consumerProfile) {
      user.consumerProfile = { ...user.consumerProfile, ...consumerProfile };
    }

    const updatedUser = await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get public farmer profile & their products
// @route   GET /api/auth/farmer/:id
// @access  Public
exports.getFarmerProfile = async (req, res, next) => {
  try {
    const farmer = await User.findOne({ _id: req.params.id, role: 'farmer' }).select(
      'name avatar phone farmerProfile createdAt'
    );

    if (!farmer) {
      return res.status(404).json({ success: false, message: 'Farmer not found' });
    }

    const products = await Product.find({
      farmer: req.params.id,
      inStock: true,
      isApproved: true,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      farmer,
      products,
    });
  } catch (error) {
    next(error);
  }
};
