import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, Heart, ShieldCheck, Truck, RefreshCw, Award } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Value Proposition Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 mb-12 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-brand-900/50 text-brand-400 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Direct Harvest</h4>
              <p className="text-xs text-gray-400">Zero middleman margins</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-brand-900/50 text-brand-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Verified Farmers</h4>
              <p className="text-xs text-gray-400">Inspected farm profiles</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-brand-900/50 text-brand-400 flex items-center justify-center shrink-0">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Fair Pricing</h4>
              <p className="text-xs text-gray-400">Wholesale & retail rates</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-brand-900/50 text-brand-400 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Hackathon Winner</h4>
              <p className="text-xs text-gray-400">Team Terminator</p>
            </div>
          </div>
        </div>

        {/* Footer Links & Info */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center text-white">
                <Sprout className="w-6 h-6" />
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">
                Kisan<span className="text-brand-500">Bazar</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 max-w-md leading-relaxed">
              KisanBazar is an open agri-tech marketplace built to empower farmers with
              digital presence, direct consumer connection, fair price transparency,
              and seamless order management.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Explore
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/marketplace" className="hover:text-brand-400 transition-colors">
                  All Produce
                </Link>
              </li>
              <li>
                <Link to="/marketplace?category=Vegetables" className="hover:text-brand-400 transition-colors">
                  Fresh Vegetables
                </Link>
              </li>
              <li>
                <Link to="/marketplace?category=Fruits" className="hover:text-brand-400 transition-colors">
                  Seasonal Fruits
                </Link>
              </li>
              <li>
                <Link to="/marketplace?organic=true" className="hover:text-brand-400 transition-colors">
                  Certified Organic
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Portals
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/register?role=farmer" className="hover:text-brand-400 transition-colors">
                  Join as Farmer
                </Link>
              </li>
              <li>
                <Link to="/register?role=consumer" className="hover:text-brand-400 transition-colors">
                  Join as Consumer
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-brand-400 transition-colors">
                  Farmer / Consumer Login
                </Link>
              </li>
              <li>
                <Link to="/admin-dashboard" className="hover:text-brand-400 transition-colors">
                  Admin Panel
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500">
          <p>© {new Date().getFullYear()} KisanBazar. Built with ❤️ by Team Terminator.</p>
          <p className="mt-2 sm:mt-0 flex items-center gap-1">
            Empowering agricultural independence with modern full-stack tech.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
