import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchFarmerProducts } from '../store/productSlice';
import { fetchMyOrders } from '../store/orderSlice';
import { productService, orderService } from '../services/api';
import {
  PlusCircle,
  Package,
  ShoppingBag,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  Edit2,
  Trash2,
  AlertCircle,
  Eye,
  Check,
  X,
} from 'lucide-react';

const FarmerDashboard = ({ onOpenChatWithUser }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { farmerProducts, loading: productsLoading } = useSelector((state) => state.products);
  const { orders, loading: ordersLoading } = useSelector((state) => state.orders);

  const [activeTab, setActiveTab] = useState('products');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Form State
  const [name, setName] = useState('');
  const [categoryName, setCategoryName] = useState('Vegetables');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [unit, setUnit] = useState('kg');
  const [quantityAvailable, setQuantityAvailable] = useState('');
  const [minimumOrderQuantity, setMinimumOrderQuantity] = useState('1');
  const [isOrganic, setIsOrganic] = useState(false);
  const [primaryImage, setPrimaryImage] = useState('');
  const [formError, setFormError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchFarmerProducts());
    dispatch(fetchMyOrders());
  }, [dispatch]);

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setName('');
    setCategoryName('Vegetables');
    setDescription('');
    setPrice('');
    setUnit('kg');
    setQuantityAvailable('');
    setMinimumOrderQuantity('1');
    setIsOrganic(false);
    setPrimaryImage('');
    setFormError(null);
    setShowAddModal(true);
  };

  const handleOpenEditModal = (p) => {
    setEditingProduct(p);
    setName(p.name);
    setCategoryName(p.categoryName || 'Vegetables');
    setDescription(p.description);
    setPrice(p.price);
    setUnit(p.unit);
    setQuantityAvailable(p.quantityAvailable);
    setMinimumOrderQuantity(p.minimumOrderQuantity || 1);
    setIsOrganic(p.isOrganic);
    setPrimaryImage(p.primaryImage);
    setFormError(null);
    setShowAddModal(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setFormError(null);
    setActionLoading(true);

    try {
      const payload = {
        name,
        categoryName,
        description,
        price: Number(price),
        unit,
        quantityAvailable: Number(quantityAvailable),
        minimumOrderQuantity: Number(minimumOrderQuantity) || 1,
        isOrganic,
        primaryImage:
          primaryImage ||
          'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600',
      };

      if (editingProduct) {
        await productService.updateProduct(editingProduct._id, payload);
      } else {
        await productService.createProduct(payload);
      }

      setShowAddModal(false);
      dispatch(fetchFarmerProducts());
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save product');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to remove this product listing?')) {
      try {
        await productService.deleteProduct(id);
        dispatch(fetchFarmerProducts());
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete');
      }
    }
  };

  const handleToggleStock = async (id) => {
    try {
      await productService.toggleStock(id);
      dispatch(fetchFarmerProducts());
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to toggle stock status');
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, { status: newStatus });
      dispatch(fetchMyOrders());
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update order status');
    }
  };

  const totalRevenue = orders
    .filter((o) => o.status === 'delivered' || o.status === 'accepted')
    .reduce((sum, o) => sum + (o.totalPrice || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-brand-700 to-emerald-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-200">
            Farmer Studio
          </span>
          <h1 className="text-2xl sm:text-3xl font-black">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-xs text-brand-100">
            {user?.farmerProfile?.farmName || 'Your Registered Farm'} · {user?.farmerProfile?.city || 'Local Region'}
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 px-5 py-3 bg-white text-brand-800 font-bold text-xs rounded-xl shadow-md hover:bg-brand-50 active:scale-95 transition-all self-start md:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          List New Harvest Produce
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase">My Listings</p>
          <p className="text-2xl font-black text-gray-900 mt-1">{farmerProducts.length}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase">Orders Received</p>
          <p className="text-2xl font-black text-gray-900 mt-1">{orders.length}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase">Pending Requests</p>
          <p className="text-2xl font-black text-amber-600 mt-1">
            {orders.filter((o) => o.status === 'pending').length}
          </p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase">Gross Sales Value</p>
          <p className="text-2xl font-black text-brand-700 mt-1">₹{totalRevenue}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 space-x-6">
        <button
          onClick={() => setActiveTab('products')}
          className={`pb-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${
            activeTab === 'products'
              ? 'border-brand-600 text-brand-700'
              : 'border-transparent text-gray-400 hover:text-gray-700'
          }`}
        >
          Harvest Listings ({farmerProducts.length})
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${
            activeTab === 'orders'
              ? 'border-brand-600 text-brand-700'
              : 'border-transparent text-gray-400 hover:text-gray-700'
          }`}
        >
          Incoming Orders ({orders.length})
        </button>
      </div>

      {/* Tab: Products */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          {productsLoading ? (
            <div className="text-center py-12 text-xs text-gray-400">Loading your produce...</div>
          ) : farmerProducts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 p-8 space-y-3">
              <Package className="w-10 h-10 text-gray-300 mx-auto" />
              <h3 className="text-base font-bold text-gray-900">No produce listed yet</h3>
              <p className="text-xs text-gray-500">
                Start listing your crops to receive order requests and inquiries from buyers.
              </p>
              <button
                onClick={handleOpenAddModal}
                className="px-5 py-2.5 bg-brand-600 text-white font-bold text-xs rounded-xl hover:bg-brand-700"
              >
                List First Product
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {farmerProducts.map((p) => (
                <div
                  key={p._id}
                  className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm p-4 flex flex-col justify-between space-y-4"
                >
                  <div className="flex space-x-3">
                    <img
                      src={p.primaryImage}
                      alt={p.name}
                      className="w-20 h-20 rounded-xl object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">
                          {p.categoryName}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            p.inStock
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-rose-50 text-rose-700'
                          }`}
                        >
                          {p.inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-gray-900 truncate mt-1">{p.name}</h4>
                      <p className="text-xs font-extrabold text-brand-700 mt-0.5">
                        ₹{p.price} / {p.unit}
                      </p>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        {p.quantityAvailable} {p.unit} remaining
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                    <button
                      onClick={() => handleToggleStock(p._id)}
                      className="text-gray-600 hover:text-gray-900 font-semibold"
                    >
                      {p.inStock ? 'Mark Out of Stock' : 'Mark In Stock'}
                    </button>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleOpenEditModal(p)}
                        className="p-1.5 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p._id)}
                        className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Orders */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {ordersLoading ? (
            <div className="text-center py-12 text-xs text-gray-400">Loading incoming orders...</div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 p-8 space-y-3">
              <ShoppingBag className="w-10 h-10 text-gray-300 mx-auto" />
              <h3 className="text-base font-bold text-gray-900">No order requests yet</h3>
              <p className="text-xs text-gray-500">
                When consumers order your produce, order requests with addresses will show up here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
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
                      <h4 className="text-sm font-bold text-gray-900 mt-0.5">
                        {ord.quantity} {ord.unit} × {ord.productName}
                      </h4>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-base font-black text-brand-700">₹{ord.totalPrice}</span>
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                          ord.status === 'accepted'
                            ? 'bg-emerald-50 text-emerald-700'
                            : ord.status === 'pending'
                            ? 'bg-amber-50 text-amber-700'
                            : ord.status === 'delivered'
                            ? 'bg-sky-50 text-sky-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {ord.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <p className="font-bold text-gray-700">Buyer Delivery Details:</p>
                      <p className="text-gray-600 mt-0.5 font-medium">
                        {ord.deliveryAddress?.fullName} ({ord.deliveryAddress?.phone})
                      </p>
                      <p className="text-gray-500">
                        {ord.deliveryAddress?.street}, {ord.deliveryAddress?.city},{' '}
                        {ord.deliveryAddress?.pincode}
                      </p>
                      {ord.notes && (
                        <p className="text-brand-700 italic mt-1">"Note: {ord.notes}"</p>
                      )}
                    </div>

                    <div className="flex flex-col sm:items-end justify-between gap-3">
                      <p className="text-gray-400">
                        Placed on {new Date(ord.createdAt).toLocaleDateString()}
                      </p>

                      {/* Status action buttons */}
                      <div className="flex flex-wrap gap-2">
                        {ord.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleUpdateOrderStatus(ord._id, 'accepted')}
                              className="px-3 py-1.5 bg-emerald-600 text-white rounded-xl font-bold text-xs hover:bg-emerald-700 flex items-center gap-1"
                            >
                              <Check className="w-3.5 h-3.5" /> Accept Order
                            </button>
                            <button
                              onClick={() => handleUpdateOrderStatus(ord._id, 'rejected')}
                              className="px-3 py-1.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-xl font-bold text-xs hover:bg-rose-100 flex items-center gap-1"
                            >
                              <X className="w-3.5 h-3.5" /> Reject
                            </button>
                          </>
                        )}

                        {ord.status === 'accepted' && (
                          <button
                            onClick={() => handleUpdateOrderStatus(ord._id, 'shipped')}
                            className="px-3 py-1.5 bg-brand-600 text-white rounded-xl font-bold text-xs hover:bg-brand-700 flex items-center gap-1"
                          >
                            <Truck className="w-3.5 h-3.5" /> Mark Dispatched / Shipped
                          </button>
                        )}

                        {ord.status === 'shipped' && (
                          <button
                            onClick={() => handleUpdateOrderStatus(ord._id, 'delivered')}
                            className="px-3 py-1.5 bg-sky-600 text-white rounded-xl font-bold text-xs hover:bg-sky-700 flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" /> Mark Delivered
                          </button>
                        )}

                        {onOpenChatWithUser && ord.consumer && (
                          <button
                            onClick={() => onOpenChatWithUser(ord.consumer)}
                            className="px-3 py-1.5 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-xl font-bold text-xs"
                          >
                            Chat with Buyer
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add / Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-100 flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-brand-50/50">
              <h3 className="font-bold text-gray-900">
                {editingProduct ? 'Update Produce Listing' : 'List New Farm Harvest'}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 text-gray-400 hover:text-gray-700 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 overflow-y-auto space-y-4">
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Product / Crop Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="E.g. Fresh Organic Tomatoes"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="Vegetables">Vegetables</option>
                    <option value="Fruits">Fruits</option>
                    <option value="Grains & Cereals">Grains & Cereals</option>
                    <option value="Pulses & Lentils">Pulses & Lentils</option>
                    <option value="Dairy & Honey">Dairy & Honey</option>
                    <option value="Spices & Herbs">Spices & Herbs</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Unit Type
                  </label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="kg">Kilogram (kg)</option>
                    <option value="quintal">Quintal</option>
                    <option value="dozen">Dozen</option>
                    <option value="piece">Piece</option>
                    <option value="liter">Liter</option>
                    <option value="crate">Crate</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="35"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Available Qty
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="100"
                    value={quantityAvailable}
                    onChange={(e) => setQuantityAvailable(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Min Order Qty
                  </label>
                  <input
                    type="number"
                    placeholder="1"
                    value={minimumOrderQuantity}
                    onChange={(e) => setMinimumOrderQuantity(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={primaryImage}
                  onChange={(e) => setPrimaryImage(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows="3"
                  required
                  placeholder="Describe freshness, harvest method, flavor profile..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-500"
                ></textarea>
              </div>

              <label className="flex items-center space-x-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={isOrganic}
                  onChange={(e) => setIsOrganic(e.target.checked)}
                  className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-gray-300"
                />
                <span className="text-xs font-semibold text-gray-700">
                  Certified Organic Produce
                </span>
              </label>

              <button
                type="submit"
                disabled={actionLoading}
                className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-md transition-all disabled:opacity-50"
              >
                {actionLoading ? 'Saving...' : editingProduct ? 'Save Changes' : 'Publish Produce Listing'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmerDashboard;
