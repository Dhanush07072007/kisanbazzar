import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchMyOrders } from '../store/orderSlice';
import { authService } from '../services/api';
import { updateCurrentUser } from '../store/authSlice';
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  Truck,
  MapPin,
  MessageSquare,
  AlertCircle,
  Package,
  User,
  Save,
} from 'lucide-react';

const ConsumerDashboard = ({ onOpenChatWithUser }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { orders, loading } = useSelector((state) => state.orders);

  const [activeTab, setActiveTab] = useState('orders');

  // Address editing
  const [deliveryAddress, setDeliveryAddress] = useState(
    user?.consumerProfile?.deliveryAddress || ''
  );
  const [city, setCity] = useState(user?.consumerProfile?.city || '');
  const [state, setState] = useState(user?.consumerProfile?.state || '');
  const [pincode, setPincode] = useState(user?.consumerProfile?.pincode || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [savingProfile, setSavingProfile] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setSaveSuccess(false);

    try {
      const response = await authService.updateProfile({
        phone,
        consumerProfile: {
          deliveryAddress,
          city,
          state,
          pincode,
        },
      });
      dispatch(updateCurrentUser(response.data.user));
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      alert('Failed to update address');
    } finally {
      setSavingProfile(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-brand-400">
            Consumer Dashboard
          </span>
          <h1 className="text-2xl sm:text-3xl font-black mt-1">Hello, {user?.name}!</h1>
          <p className="text-xs text-gray-400">
            Track farm-fresh orders and manage your direct grower deliveries.
          </p>
        </div>

        <Link
          to="/marketplace"
          className="px-5 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 self-start sm:self-auto"
        >
          Explore Marketplace Produce
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 space-x-6">
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${
            activeTab === 'orders'
              ? 'border-brand-600 text-brand-700'
              : 'border-transparent text-gray-400 hover:text-gray-700'
          }`}
        >
          My Orders ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${
            activeTab === 'profile'
              ? 'border-brand-600 text-brand-700'
              : 'border-transparent text-gray-400 hover:text-gray-700'
          }`}
        >
          Delivery Address & Profile
        </button>
      </div>

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12 text-xs text-gray-400">Loading your orders...</div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 p-8 space-y-3">
              <ShoppingBag className="w-10 h-10 text-gray-300 mx-auto" />
              <h3 className="text-base font-bold text-gray-900">No orders placed yet</h3>
              <p className="text-xs text-gray-500">
                Browse our marketplace to order straight from local farmers.
              </p>
              <Link
                to="/marketplace"
                className="inline-block px-5 py-2.5 bg-brand-600 text-white font-bold text-xs rounded-xl hover:bg-brand-700"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((ord) => (
                <div
                  key={ord._id}
                  className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gray-100 gap-2">
                    <div>
                      <span className="text-xs font-bold text-gray-400">
                        Order #{ord.orderNumber || ord._id.slice(-6)}
                      </span>
                      <h4 className="text-base font-bold text-gray-900 mt-0.5">
                        {ord.quantity} {ord.unit} × {ord.productName}
                      </h4>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-lg font-black text-brand-700">₹{ord.totalPrice}</span>
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                          ord.status === 'delivered'
                            ? 'bg-emerald-50 text-emerald-700'
                            : ord.status === 'accepted' || ord.status === 'shipped'
                            ? 'bg-sky-50 text-sky-700'
                            : ord.status === 'pending'
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {ord.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <p className="font-bold text-gray-700">Producer / Farm Details:</p>
                      <p className="text-gray-900 font-semibold mt-0.5">{ord.farmer?.name}</p>
                      <p className="text-gray-500">
                        {ord.farmer?.farmerProfile?.farmName || 'Verified Farm'} ·{' '}
                        {ord.farmer?.farmerProfile?.city || 'Regional'}
                      </p>
                      {ord.farmerNotes && (
                        <p className="text-brand-700 font-medium mt-1">
                          Farmer Update: "{ord.farmerNotes}"
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col sm:items-end justify-between gap-3">
                      <p className="text-gray-400">
                        Placed on {new Date(ord.createdAt).toLocaleDateString()}
                      </p>

                      {onOpenChatWithUser && ord.farmer && (
                        <button
                          onClick={() => onOpenChatWithUser(ord.farmer)}
                          className="px-4 py-2 bg-brand-50 text-brand-700 hover:bg-brand-100 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          Chat with Grower
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Profile & Address Tab */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 max-w-xl">
          <h3 className="text-lg font-bold text-gray-900 mb-1">Default Delivery Address</h3>
          <p className="text-xs text-gray-500 mb-6">
            This address will automatically pre-fill when requesting farm produce.
          </p>

          {saveSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Delivery address updated successfully!</span>
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Street Address / House No.
              </label>
              <input
                type="text"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  State
                </label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Pincode
                </label>
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={savingProfile}
              className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {savingProfile ? 'Saving...' : 'Save Delivery Address'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ConsumerDashboard;
