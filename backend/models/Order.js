const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
    },
    consumer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    productName: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1'],
    },
    unit: {
      type: String,
      default: 'kg',
    },
    unitPrice: {
      type: Number,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    deliveryAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
    },
    notes: {
      type: String,
      default: '',
    },
    paymentMethod: {
      type: String,
      enum: ['cash_on_delivery', 'upi_on_delivery', 'direct_farmer_transfer'],
      default: 'cash_on_delivery',
    },
    farmerNotes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

orderSchema.pre('save', function (next) {
  if (!this.orderNumber) {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(1000 + Math.random() * 9000);
    this.orderNumber = `KB-${timestamp}-${random}`;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
