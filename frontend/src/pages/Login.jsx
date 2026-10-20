import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../store/authSlice';
import { Sprout, Lock, Mail, AlertCircle, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { isAuthenticated, user, loading, error } = useSelector((state) => state.auth);

  const from = location.state?.from?.pathname || null;

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated && user) {
      if (from) {
        navigate(from, { replace: true });
      } else if (user.role === 'farmer') {
        navigate('/farmer-dashboard');
      } else if (user.role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/consumer-dashboard');
      }
    }
  }, [isAuthenticated, user, navigate, from]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) return;
    dispatch(loginUser({ email, password }));
  };

  const handleQuickLogin = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    dispatch(loginUser({ email: demoEmail, password: demoPassword }));
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-gray-100">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-brand-600 rounded-2xl flex items-center justify-center text-white mx-auto shadow-md shadow-brand-500/20">
            <Sprout className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">
            Sign in to KisanBazar
          </h2>
          <p className="text-xs text-gray-500">
            Welcome back! Connect with growers and buyers directly.
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="you@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
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
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-md shadow-brand-500/20 transition-all active:scale-98 disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        {/* Demo Fast Login Pills */}
        <div className="pt-2 border-t border-gray-100">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider text-center mb-2.5">
            1-Click Demo Login
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('ramesh@farmer.com', 'Password123!')}
              className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-[11px] font-bold transition-colors text-center"
            >
              👨🌾 Farmer
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('priya@consumer.com', 'Password123!')}
              className="p-2 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-800 text-[11px] font-bold transition-colors text-center"
            >
              🛒 Consumer
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('admin@kisanbazar.com', 'Password123!')}
              className="p-2 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-800 text-[11px] font-bold transition-colors text-center"
            >
              🛡️ Admin
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-gray-500">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-brand-600 hover:text-brand-700">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
