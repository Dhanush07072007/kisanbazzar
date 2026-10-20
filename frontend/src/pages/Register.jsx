import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearError } from '../store/authSlice';
import {
  Sprout,
  Lock,
  Mail,
  User,
  Phone,
  MapPin,
  AlertCircle,
  Tractor,
  ShoppingBag,
} from 'lucide-react';

const Register = () => {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') === 'farmer' ? 'farmer' : 'consumer';

  const [role, setRole] = useState(initialRole);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

  // Farmer profile fields
  const [farmName, setFarmName] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [farmSizeAcres, setFarmSizeAcres] = useState('');
  const [bio, setBio] = useState('');
  const [isOrganicCertified, setIsOrganicCertified] = useState(false);

  // Consumer profile fields
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [pincode, setPincode] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());

    const payload = {
      name,
      email,
      password,
      role,
      phone,
      farmerProfile:
        role === 'farmer'
          ? {
              farmName,
              city,
              state,
              farmSizeAcres: Number(farmSizeAcres) || 0,
              bio,
              isOrganicCertified,
            }
          : undefined,
      consumerProfile:
        role === 'consumer'
          ? {
              deliveryAddress,
              city,
              state,
              pincode,
            }
          : undefined,
    };

    const result = await dispatch(registerUser(payload));
    if (!result.error) {
      if (role === 'farmer') {
        navigate('/farmer-dashboard');
      } else {
        navigate('/consumer-dashboard');
      }
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full space-y-6 bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-gray-100">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-brand-600 rounded-2xl flex items-center justify-center text-white mx-auto shadow-md shadow-brand-500/20">
            <Sprout className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">
            Create KisanBazar Account
          </h2>
          <p className="text-xs text-gray-500">
            Select your account type to customize your marketplace experience
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-2 gap-3 p-1.5 bg-gray-100 rounded-2xl">
          <button
            type="button"
            onClick={() => setRole('farmer')}
            className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all ${
              role === 'farmer'
                ? 'bg-white text-brand-700 shadow-md'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <Tractor className="w-4 h-4" />
            I am a Farmer / Producer
          </button>
          <button
            type="button"
            onClick={() => setRole('consumer')}
            className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all ${
              role === 'consumer'
                ? 'bg-white text-brand-700 shadow-md'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            I am a Consumer / Buyer
          </button>
        </div>

        {error && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                <User className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Phone Number
              </label>
              <div className="relative">
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="name@mail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              </div>
            </div>
          </div>

          {/* Role specific profile fields */}
          {role === 'farmer' ? (
            <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 space-y-3">
              <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                Farmer Profile Details
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Farm Name (e.g. Green Valley Agro)"
                  value={farmName}
                  onChange={(e) => setFarmName(e.target.value)}
                  className="px-3 py-2 text-xs rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-500"
                />
                <input
                  type="number"
                  placeholder="Farm Size in Acres"
                  value={farmSizeAcres}
                  onChange={(e) => setFarmSizeAcres(e.target.value)}
                  className="px-3 py-2 text-xs rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="City / District"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="px-3 py-2 text-xs rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-500"
                />
                <input
                  type="text"
                  placeholder="State"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="px-3 py-2 text-xs rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <textarea
                rows="2"
                placeholder="Brief bio about your farming methods, crops, and heritage..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-500"
              ></textarea>

              <label className="flex items-center space-x-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={isOrganicCertified}
                  onChange={(e) => setIsOrganicCertified(e.target.checked)}
                  className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-gray-300"
                />
                <span className="text-xs font-medium text-gray-700">
                  Certified Organic Farming Practice
                </span>
              </label>
            </div>
          ) : (
            <div className="p-4 bg-sky-50/50 rounded-2xl border border-sky-100 space-y-3">
              <h4 className="text-xs font-bold text-sky-800 uppercase tracking-wider">
                Consumer Delivery Address
              </h4>
              <input
                type="text"
                placeholder="Street Address / House No."
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-500"
              />
              <div className="grid grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="px-3 py-2 text-xs rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-500"
                />
                <input
                  type="text"
                  placeholder="State"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="px-3 py-2 text-xs rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-500"
                />
                <input
                  type="text"
                  placeholder="Pincode"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="px-3 py-2 text-xs rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-md shadow-brand-500/20 transition-all active:scale-98 disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : `Join as ${role === 'farmer' ? 'Farmer' : 'Consumer'}`}
          </button>
        </form>

        <p className="text-center text-xs text-gray-500">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-brand-600 hover:text-brand-700">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
