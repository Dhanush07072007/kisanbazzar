import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, CheckCircle2, MessageSquare, ShoppingCart, Star } from 'lucide-react';

const ProductCard = ({ product, onOrderClick, onMessageClick }) => {
  const farmer = product.farmer || {};
  const locationText =
    product.location?.city || farmer.farmerProfile?.city
      ? `${product.location?.city || farmer.farmerProfile?.city}, ${
          product.location?.state || farmer.farmerProfile?.state || ''
        }`
      : 'Direct from field';

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:border-brand-200 transition-all duration-300 flex flex-col justify-between">
      {/* Top Image & Badges */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <img
          src={product.primaryImage}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Category Badge */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-white/90 backdrop-blur-md text-gray-800 shadow-sm">
            {product.categoryName}
          </span>
          {product.isOrganic && (
            <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-brand-500 text-white shadow-sm flex items-center gap-1">
              🌱 Organic
            </span>
          )}
        </div>

        {/* Stock status badge */}
        <div className="absolute top-3 right-3">
          <span
            className={`px-2.5 py-1 text-xs font-semibold rounded-full shadow-sm ${
              product.inStock
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-rose-50 text-rose-700 border border-rose-200'
            }`}
          >
            {product.inStock ? 'In Stock' : 'Sold Out'}
          </span>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-brand-600 shrink-0" />
              <span className="truncate max-w-[140px]">{locationText}</span>
            </span>
            <span className="flex items-center gap-1 font-medium text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              {product.rating || '4.8'}
            </span>
          </div>

          <Link
            to={`/product/${product._id}`}
            className="block text-lg font-bold text-gray-900 group-hover:text-brand-600 transition-colors line-clamp-1"
          >
            {product.name}
          </Link>

          <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {/* Farmer Info */}
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <img
                src={farmer.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150'}
                alt={farmer.name || 'Farmer'}
                className="w-7 h-7 rounded-full object-cover border border-brand-300"
              />
              <div className="text-left">
                <p className="text-xs font-semibold text-gray-800 flex items-center gap-1 truncate max-w-[110px]">
                  {farmer.name || 'Local Farmer'}
                  {farmer.farmerProfile?.isVerified && (
                    <CheckCircle2 className="w-3 h-3 text-brand-600 shrink-0" />
                  )}
                </p>
                <p className="text-[10px] text-gray-400 truncate max-w-[110px]">
                  {farmer.farmerProfile?.farmName || 'Verified Farm'}
                </p>
              </div>
            </div>

            {/* Price tag */}
            <div className="text-right">
              <p className="text-lg font-extrabold text-brand-700 leading-none">
                ₹{product.price}
                <span className="text-xs font-normal text-gray-500">/{product.unit}</span>
              </p>
              <p className="text-[11px] text-gray-400 font-medium mt-0.5">
                {product.quantityAvailable} {product.unit} left
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 pt-3 grid grid-cols-2 gap-2">
          <button
            onClick={() => onMessageClick && onMessageClick(farmer, product)}
            className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Chat
          </button>

          <button
            disabled={!product.inStock}
            onClick={() => onOrderClick && onOrderClick(product)}
            className={`flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-xl transition-all shadow-sm ${
              product.inStock
                ? 'bg-brand-600 hover:bg-brand-700 text-white shadow-brand-500/20 active:scale-95'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            Order Request
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
