import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import {
  Sprout,
  ShoppingBag,
  User,
  LogOut,
  Menu,
  X,
  MessageSquare,
  ShieldCheck,
  ChevronDown,
} from 'lucide-react';

const Navbar = ({ onOpenChat }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    setUserDropdownOpen(false);
    navigate('/');
  };

  const getDashboardLink = () => {
    if (!user) return '/login';
    if (user.role === 'farmer') return '/farmer-dashboard';
    if (user.role === 'admin') return '/admin-dashboard';
    return '/consumer-dashboard';
  };

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 bg-gradient-to-tr from-brand-600 to-brand-400 rounded-2xl flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <Sprout className="w-7 h-7" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-gray-900 group-hover:text-brand-700 transition-colors">
                Kisan<span className="text-brand-600">Bazar</span>
              </span>
              <p className="text-xs text-gray-400 font-medium tracking-wide">
                Direct Farm-to-Consumer
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/marketplace"
              className="text-gray-600 hover:text-brand-600 font-medium transition-colors flex items-center gap-1.5"
            >
              <ShoppingBag className="w-4 h-4" />
              Marketplace
            </Link>

            {isAuthenticated && (
              <Link
                to={getDashboardLink()}
                className="text-gray-600 hover:text-brand-600 font-medium transition-colors"
              >
                {user?.role === 'farmer' && '🌾 Farmer Studio'}
                {user?.role === 'consumer' && '🛒 Consumer Dashboard'}
                {user?.role === 'admin' && '🛡️ Admin Center'}
              </Link>
            )}

            {isAuthenticated && onOpenChat && (
              <button
                onClick={onOpenChat}
                className="text-gray-600 hover:text-brand-600 font-medium transition-colors flex items-center gap-1.5"
              >
                <MessageSquare className="w-4 h-4" />
                Messages
              </button>
            )}
          </div>

          {/* Auth Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-3 p-1.5 rounded-full hover:bg-gray-100 transition-colors focus:outline-none"
                >
                  <img
                    src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'}
                    alt={user?.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-brand-500"
                  />
                  <div className="text-left pr-2">
                    <p className="text-sm font-semibold text-gray-800 leading-tight">
                      {user?.name}
                    </p>
                    <p className="text-xs capitalize font-medium text-brand-600">
                      {user?.role}
                    </p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-xs text-gray-400">Signed in as</p>
                      <p className="text-sm font-semibold text-gray-800 truncate">
                        {user?.email}
                      </p>
                    </div>

                    <Link
                      to={getDashboardLink()}
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-brand-50 hover:text-brand-700"
                    >
                      <User className="w-4 h-4 mr-2.5 text-brand-500" />
                      Dashboard
                    </Link>

                    {user?.role === 'admin' && (
                      <Link
                        to="/admin-dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-brand-50 hover:text-brand-700"
                      >
                        <ShieldCheck className="w-4 h-4 mr-2.5 text-brand-500" />
                        Admin Controls
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4 mr-2.5" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-5 py-2.5 text-sm font-semibold text-gray-700 hover:text-brand-600 hover:bg-gray-100/70 rounded-xl transition-all"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 active:scale-95 shadow-md shadow-brand-500/25 rounded-xl transition-all"
                >
                  Join KisanBazar
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu trigger button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 pt-3 pb-6 space-y-3">
          <Link
            to="/marketplace"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-gray-700 rounded-lg hover:bg-brand-50 hover:text-brand-700"
          >
            Marketplace
          </Link>
          {isAuthenticated ? (
            <>
              <Link
                to={getDashboardLink()}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-base font-medium text-gray-700 rounded-lg hover:bg-brand-50 hover:text-brand-700"
              >
                Dashboard ({user?.role})
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-left px-3 py-2 text-base font-medium text-red-600 rounded-lg hover:bg-red-50"
              >
                Sign Out
              </button>
            </>
          ) : (
            <div className="pt-2 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 text-center text-sm font-semibold text-gray-700 border border-gray-200 rounded-xl"
              >
                Log In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 text-center text-sm font-semibold text-white bg-brand-600 rounded-xl"
              >
                Join KisanBazar
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
