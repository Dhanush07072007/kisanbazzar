import React, { useEffect, useState } from 'react';
import { adminService } from '../services/api';
import {
  Users,
  Package,
  ShoppingBag,
  TrendingUp,
  ShieldCheck,
  CheckCircle,
  XCircle,
  Search,
  Check,
  X,
  AlertCircle,
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userSearch, setUserSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  useEffect(() => {
    loadAllAdminData();
  }, []);

  const loadAllAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, productsRes, ordersRes] = await Promise.all([
        adminService.getStats(),
        adminService.getUsers({ role: roleFilter, search: userSearch }),
        adminService.getAllProducts(),
        adminService.getAllOrders(),
      ]);

      setStats(statsRes.data.stats);
      setUsers(usersRes.data.users);
      setProducts(productsRes.data.products);
      setOrders(ordersRes.data.orders);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleVerification = async (userId, currentVerified) => {
    try {
      await adminService.updateUserStatus(userId, { isVerified: !currentVerified });
      loadAllAdminData();
    } catch (err) {
      alert('Failed to update verification status');
    }
  };

  const handleToggleUserStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    try {
      await adminService.updateUserStatus(userId, { status: newStatus });
      loadAllAdminData();
    } catch (err) {
      alert('Failed to update user status');
    }
  };

  const handleToggleProductApproval = async (productId) => {
    try {
      await adminService.toggleProductApproval(productId);
      loadAllAdminData();
    } catch (err) {
      alert('Failed to update product approval status');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-purple-900 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-purple-300">
            System Administration
          </span>
          <h1 className="text-2xl sm:text-3xl font-black mt-1">Admin Command Center</h1>
          <p className="text-xs text-purple-200">
            Platform governance, user verification, produce moderation, and order transparency.
          </p>
        </div>
        <div className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-white/10 rounded-2xl backdrop-blur-md">
          <ShieldCheck className="w-5 h-5 text-purple-300" />
          <span className="text-xs font-bold">Admin Privileges Active</span>
        </div>
      </div>

      {/* KPI Stats Grid */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-[10px] font-bold text-gray-400 uppercase">Total Users</p>
            <p className="text-2xl font-black text-gray-900 mt-1">{stats.totalUsers}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-[10px] font-bold text-gray-400 uppercase">Registered Farmers</p>
            <p className="text-2xl font-black text-emerald-600 mt-1">{stats.totalFarmers}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-[10px] font-bold text-gray-400 uppercase">Active Consumers</p>
            <p className="text-2xl font-black text-sky-600 mt-1">{stats.totalConsumers}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-[10px] font-bold text-gray-400 uppercase">Farm Produce</p>
            <p className="text-2xl font-black text-amber-600 mt-1">{stats.totalProducts}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-[10px] font-bold text-gray-400 uppercase">Platform Orders</p>
            <p className="text-2xl font-black text-purple-600 mt-1">{stats.totalOrders}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-[10px] font-bold text-gray-400 uppercase">Platform Volume</p>
            <p className="text-2xl font-black text-brand-700 mt-1">₹{stats.totalRevenue}</p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-gray-200 space-x-6">
        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${
            activeTab === 'users'
              ? 'border-purple-600 text-purple-700'
              : 'border-transparent text-gray-400 hover:text-gray-700'
          }`}
        >
          Manage Users ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`pb-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${
            activeTab === 'products'
              ? 'border-purple-600 text-purple-700'
              : 'border-transparent text-gray-400 hover:text-gray-700'
          }`}
        >
          Produce Listings ({products.length})
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${
            activeTab === 'orders'
              ? 'border-purple-600 text-purple-700'
              : 'border-transparent text-gray-400 hover:text-gray-700'
          }`}
        >
          All Orders ({orders.length})
        </button>
      </div>

      {/* Tab: Users */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">User</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Location / Farm</th>
                  <th className="p-4">Verification</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50/50">
                    <td className="p-4 flex items-center space-x-3">
                      <img
                        src={u.avatar}
                        alt={u.name}
                        className="w-8 h-8 rounded-full object-cover border"
                      />
                      <div>
                        <p className="font-bold text-gray-900">{u.name}</p>
                        <p className="text-[10px] text-gray-400">{u.email}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full font-bold text-[10px] uppercase ${
                          u.role === 'farmer'
                            ? 'bg-emerald-50 text-emerald-700'
                            : u.role === 'admin'
                            ? 'bg-purple-50 text-purple-700'
                            : 'bg-sky-50 text-sky-700'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4 text-gray-600">
                      {u.role === 'farmer'
                        ? `${u.farmerProfile?.farmName || 'Farm'} (${u.farmerProfile?.city || 'N/A'})`
                        : `${u.consumerProfile?.city || 'N/A'}`}
                    </td>
                    <td className="p-4">
                      {u.role === 'farmer' ? (
                        <button
                          onClick={() =>
                            handleToggleVerification(u._id, u.farmerProfile?.isVerified)
                          }
                          className={`px-2.5 py-1 rounded-full font-semibold text-[10px] flex items-center gap-1 ${
                            u.farmerProfile?.isVerified
                              ? 'bg-brand-50 text-brand-700 hover:bg-brand-100'
                              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                          }`}
                        >
                          <CheckCircle className="w-3 h-3" />
                          {u.farmerProfile?.isVerified ? 'Verified' : 'Unverified'}
                        </button>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span
                        className={`font-semibold ${
                          u.status === 'active' ? 'text-emerald-600' : 'text-rose-600'
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {u.role !== 'admin' && (
                        <button
                          onClick={() => handleToggleUserStatus(u._id, u.status)}
                          className={`text-xs font-semibold px-2 py-1 rounded hover:underline ${
                            u.status === 'active' ? 'text-rose-600' : 'text-emerald-600'
                          }`}
                        >
                          {u.status === 'active' ? 'Suspend' : 'Activate'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Products */}
      {activeTab === 'products' && (
        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Product</th>
                  <th className="p-4">Farmer</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4">Moderation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50/50">
                    <td className="p-4 flex items-center space-x-3">
                      <img
                        src={p.primaryImage}
                        alt={p.name}
                        className="w-10 h-10 rounded-xl object-cover shrink-0"
                      />
                      <span className="font-bold text-gray-900">{p.name}</span>
                    </td>
                    <td className="p-4 text-gray-600">{p.farmer?.name || 'Farmer'}</td>
                    <td className="p-4 text-gray-600">{p.categoryName}</td>
                    <td className="p-4 font-bold text-brand-700">
                      ₹{p.price} / {p.unit}
                    </td>
                    <td className="p-4 text-gray-600">
                      {p.quantityAvailable} {p.unit}
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleToggleProductApproval(p._id)}
                        className={`px-3 py-1 rounded-full font-bold text-[10px] ${
                          p.isApproved
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                        }`}
                      >
                        {p.isApproved ? 'Approved' : 'Unapproved'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Orders */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Produce</th>
                  <th className="p-4">Farmer</th>
                  <th className="p-4">Buyer</th>
                  <th className="p-4">Total Value</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((o) => (
                  <tr key={o._id} className="hover:bg-gray-50/50">
                    <td className="p-4 font-bold text-gray-500">
                      {o.orderNumber || o._id.slice(-6)}
                    </td>
                    <td className="p-4 font-bold text-gray-900">
                      {o.quantity} {o.unit} × {o.productName}
                    </td>
                    <td className="p-4 text-gray-600">{o.farmer?.name || 'Farmer'}</td>
                    <td className="p-4 text-gray-600">{o.consumer?.name || 'Consumer'}</td>
                    <td className="p-4 font-black text-brand-700">₹{o.totalPrice}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full uppercase font-bold text-[10px] bg-gray-100 text-gray-700">
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
