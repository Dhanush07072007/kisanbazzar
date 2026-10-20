const Product = require('../models/Product');
const Category = require('../models/Category');

// @desc    Get all products with search, filter, and pagination
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res, next) => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      organic,
      location,
      sort,
      page = 1,
      limit = 12,
    } = req.query;

    const query = { isApproved: true };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { categoryName: { $regex: search, $options: 'i' } },
        { 'location.city': { $regex: search, $options: 'i' } },
        { 'location.state': { $regex: search, $options: 'i' } },
      ];
    }

    if (category && category !== 'all') {
      query.categoryName = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (organic === 'true') {
      query.isOrganic = true;
    }

    if (location) {
      query.$or = [
        { 'location.city': { $regex: location, $options: 'i' } },
        { 'location.state': { $regex: location, $options: 'i' } },
      ];
    }

    let sortQuery = { createdAt: -1 };
    if (sort === 'price_asc') sortQuery = { price: 1 };
    if (sort === 'price_desc') sortQuery = { price: -1 };
    if (sort === 'rating') sortQuery = { rating: -1 };
    if (sort === 'views') sortQuery = { views: -1 };

    const skip = (Number(page) - 1) * Number(limit);

    const [products, total] = await Promise.all([
      Product.find(query)
        .populate('farmer', 'name avatar phone farmerProfile')
        .sort(sortQuery)
        .skip(skip)
        .limit(Number(limit)),
      Product.countDocuments(query),
    ]);

    res.json({
      success: true,
      count: products.length,
      total,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product details
// @route   GET /api/products/:id
// @access  Public
exports.getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      'farmer',
      'name avatar phone email farmerProfile createdAt'
    );

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Increment views asynchronously
    product.views += 1;
    await product.save();

    res.json({
      success: true,
      product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a product listing
// @route   POST /api/products
// @access  Private (Farmer)
exports.createProduct = async (req, res, next) => {
  try {
    const {
      name,
      category,
      categoryName,
      description,
      price,
      unit,
      quantityAvailable,
      minimumOrderQuantity,
      harvestDate,
      isOrganic,
      primaryImage,
      images,
      location,
    } = req.body;

    const product = await Product.create({
      farmer: req.user._id,
      name,
      category: category || null,
      categoryName: categoryName || 'Vegetables',
      description,
      price: Number(price),
      unit: unit || 'kg',
      quantityAvailable: Number(quantityAvailable),
      minimumOrderQuantity: minimumOrderQuantity ? Number(minimumOrderQuantity) : 1,
      harvestDate: harvestDate || Date.now(),
      isOrganic: Boolean(isOrganic),
      primaryImage:
        primaryImage ||
        'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600',
      images: images || [],
      location: location || {
        city: req.user.farmerProfile?.city || '',
        state: req.user.farmerProfile?.state || '',
        pincode: req.user.farmerProfile?.pincode || '',
      },
    });

    res.status(201).json({
      success: true,
      message: 'Product listed successfully',
      product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product listing
// @route   PUT /api/products/:id
// @access  Private (Farmer who owns it or Admin)
exports.updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Ensure user owns product or is admin
    if (
      product.farmer.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to edit this product',
      });
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      message: 'Product updated successfully',
      product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (Farmer who owns it or Admin)
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (
      product.farmer.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this product',
      });
    }

    await product.deleteOne();

    res.json({
      success: true,
      message: 'Product removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get products listed by logged-in farmer
// @route   GET /api/products/farmer/me
// @access  Private (Farmer)
exports.getMyProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ farmer: req.user._id }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle stock status
// @route   PATCH /api/products/:id/toggle-stock
// @access  Private (Farmer)
exports.toggleStockStatus = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (product.farmer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    product.inStock = !product.inStock;
    await product.save();

    res.json({
      success: true,
      message: `Product is now ${product.inStock ? 'in stock' : 'out of stock'}`,
      inStock: product.inStock,
    });
  } catch (error) {
    next(error);
  }
};
