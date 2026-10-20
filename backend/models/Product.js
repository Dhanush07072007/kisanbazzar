const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Please provide product name'],
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
    categoryName: {
      type: String,
      required: [true, 'Please specify product category'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide product description'],
    },
    price: {
      type: Number,
      required: [true, 'Please specify price per unit'],
      min: [0, 'Price must be positive'],
    },
    unit: {
      type: String,
      enum: ['kg', 'quintal', 'dozen', 'piece', 'liter', 'crate', 'bundle', 'packet'],
      default: 'kg',
    },
    quantityAvailable: {
      type: Number,
      required: [true, 'Please provide available quantity'],
      min: [0, 'Quantity cannot be negative'],
      default: 1,
    },
    minimumOrderQuantity: {
      type: Number,
      default: 1,
    },
    harvestDate: {
      type: Date,
      default: Date.now,
    },
    isOrganic: {
      type: Boolean,
      default: false,
    },
    primaryImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600',
    },
    images: {
      type: [String],
      default: [],
    },
    location: {
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      pincode: { type: String, default: '' },
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    isApproved: {
      type: Boolean,
      default: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 4.8,
    },
  },
  {
    timestamps: true,
  }
);

productSchema.index({ name: 'text', description: 'text', categoryName: 'text' });

module.exports = mongoose.model('Product', productSchema);
