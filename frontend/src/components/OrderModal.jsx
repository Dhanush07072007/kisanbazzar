import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { placeOrder } from '../store/orderSlice';
import { X, CheckCircle, AlertCircle, ShoppingBag, Truck } from 'lucide-react';

const OrderModal = ({ product, isOpen, onClose }) => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [quantity, setQuantity] = useState(product?.minimumOrderQuantity || 1);
  const [fullName, setFullName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [street, setStreet] = useState(user?.consumerProfile?.deliveryAddress || '');
  const [city, setCity] = useState(user?.consumerProfile?.city || '');
  const [state, setState] = useState(user?.consumerProfile?.state || '');
  const [pincode, setPincode] = useState(user?.consumerProfile?.pincode || '');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash_on_delivery');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !product) return null;

  const totalPrice = product.price * Number(quantity);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!user) {
      setError('Please sign in as a consumer to place an order request.');
      return;
    }

    if (quantity <= 0 || quantity > product.quantityAvailable) {
      setError(`Quantity must be between 1 and ${product.quantityAvailable}`);
      return;
    }

    if (!fullName || !phone || !street || !city || !pincode) {
      setError('Please fill in complete delivery details.');
      return;
    }

    setLoading(true);
    try {
      const orderPayload = {
        productId: product._id,
        quantity: Number(quantity),
        deliveryAddress: {
          fullName,
          phone,
          street,
          city,
          state,
          pincode,
        },
        notes,
        paymentMethod,
      };

      await dispatch(placeOrder(orderPayload)).unwrap();
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 2500);
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Failed to place order request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-brand-50/50">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-brand-600 text-white flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Request Farm Order</h3>
              <p className="text-xs text-gray-500">Direct from {product.farmer?.name || 'Farmer'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        {isSuccess ? (
          <div className="p-10 text-center flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center animate-bounce">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-bold text-gray-900">Order Request Sent!</h4>
            <p className="text-sm text-gray-600 max-w-xs">
              The farmer has been notified. You can track this order in your Consumer Dashboard.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
            {error && (
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Product Summary Row */}
            <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-2xl border border-gray-100">
              <img
                src={product.primaryImage}
                alt={product.name}
                className="w-16 h-16 rounded-xl object-cover"
              />
              <div className="flex-1">
                <h4 className="font-bold text-sm text-gray-900">{product.name}</h4>
                <p className="text-xs text-gray-500">
                  ₹{product.price} / {product.unit} · {product.quantityAvailable} {product.unit} available
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">Total Price</p>
                <p className="text-base font-extrabold text-brand-700">₹{totalPrice}</p>
              </div>
            </div>

            {/* Quantity Selector */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Quantity ({product.unit})
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="number"
                  min={product.minimumOrderQuantity || 1}
                  max={product.quantityAvailable}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-sm font-semibold text-gray-900"
                  required
                />
                <span className="text-xs text-gray-500 font-medium whitespace-nowrap">
                  Min: {product.minimumOrderQuantity || 1} {product.unit}
                </span>
              </div>
            </div>

            {/* Delivery Details */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-brand-600" />
                Delivery Information
              </h4>

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="px-3.5 py-2 text-xs rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-500"
                  required
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="px-3.5 py-2 text-xs rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-500"
                  required
                />
              </div>

              <input
                type="text"
                placeholder="Street Address / House No. / Landmark"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-500"
                required
              />

              <div className="grid grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="px-3.5 py-2 text-xs rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-500"
                  required
                />
                <input
                  type="text"
                  placeholder="State"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="px-3.5 py-2 text-xs rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-500"
                />
                <input
                  type="text"
                  placeholder="Pincode"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="px-3.5 py-2 text-xs rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-500"
                  required
                />
              </div>
            </div>

            {/* Notes & Payment Method */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Payment Method
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-500"
                >
                  <option value="cash_on_delivery">Cash on Delivery (Direct to Farmer)</option>
                  <option value="upi_on_delivery">UPI on Delivery</option>
                  <option value="direct_farmer_transfer">Direct Farmer Account Transfer</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Special Instructions / Notes
                </label>
                <textarea
                  rows="2"
                  placeholder="E.g., Preferred delivery slot, packaging request..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-500"
                ></textarea>
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-brand-500/25 active:scale-98 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {loading ? 'Submitting Request...' : `Confirm Order Request (₹${totalPrice})`}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default OrderModal;
