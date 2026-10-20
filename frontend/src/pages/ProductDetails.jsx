import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductDetails } from '../store/productSlice';
import {
  MapPin,
  CheckCircle2,
  Calendar,
  ShieldCheck,
  MessageSquare,
  ShoppingCart,
  Star,
  ArrowLeft,
  Truck,
  Sprout,
  Share2,
} from 'lucide-react';

const ProductDetails = ({ onOrderClick, onMessageClick }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedProduct: product, loading } = useSelector((state) => state.products);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductDetails(id));
      window.scrollTo(0, 0);
    }
  }, [id, dispatch]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading || !product) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 animate-pulse space-y-6">
        <div className="h-6 w-32 bg-gray-200 rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="h-96 bg-gray-200 rounded-3xl"></div>
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const farmer = product.farmer || {};
  const harvestDateFormatted = new Date(product.harvestDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb Back */}
      <div>
        <Link
          to="/marketplace"
          className="inline-flex items-center text-xs font-semibold text-gray-500 hover:text-brand-600 transition-colors gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Marketplace
        </Link>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left: Product Image */}
        <div className="md:col-span-6 space-y-4">
          <div className="relative rounded-3xl overflow-hidden bg-gray-100 shadow-md border border-gray-100 aspect-square">
            <img
              src={product.primaryImage}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.isOrganic && (
              <span className="absolute top-4 left-4 px-3 py-1 text-xs font-bold rounded-full bg-brand-500 text-white shadow-md">
                🌱 100% Certified Organic
              </span>
            )}
            <button
              onClick={handleShare}
              className="absolute top-4 right-4 p-2.5 rounded-full bg-white/90 backdrop-blur-md text-gray-700 hover:bg-white shadow-md transition-all text-xs font-semibold flex items-center gap-1"
            >
              <Share2 className="w-4 h-4" />
              {copied && <span className="text-[10px] text-brand-600">Copied!</span>}
            </button>
          </div>
        </div>

        {/* Right: Info & Actions */}
        <div className="md:col-span-6 space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
              <span className="px-2.5 py-1 bg-brand-50 text-brand-700 font-bold rounded-full">
                {product.categoryName}
              </span>
              <span className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {product.rating} ({farmer.farmerProfile?.totalReviews || 12} reviews)
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-gray-950 tracking-tight leading-tight">
              {product.name}
            </h1>

            <div className="mt-4 flex items-baseline space-x-2">
              <span className="text-3xl font-extrabold text-brand-700">₹{product.price}</span>
              <span className="text-sm text-gray-500 font-medium">per {product.unit}</span>
            </div>
          </div>

          {/* Key Facts Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100">
              <p className="text-[10px] uppercase font-bold text-gray-400">Available Stock</p>
              <p className="text-sm font-bold text-gray-800 mt-0.5">
                {product.quantityAvailable} {product.unit}
              </p>
            </div>

            <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100">
              <p className="text-[10px] uppercase font-bold text-gray-400">Minimum Order</p>
              <p className="text-sm font-bold text-gray-800 mt-0.5">
                {product.minimumOrderQuantity || 1} {product.unit}
              </p>
            </div>

            <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100 col-span-2 sm:col-span-1">
              <p className="text-[10px] uppercase font-bold text-gray-400">Harvest Date</p>
              <p className="text-sm font-bold text-gray-800 mt-0.5 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-brand-600" />
                {harvestDateFormatted}
              </p>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">
              Produce Description
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
          </div>

          {/* Farmer Card */}
          <div className="p-4 bg-brand-50/50 rounded-2xl border border-brand-100 space-y-3">
            <div className="flex items-center space-x-3">
              <img
                src={farmer.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150'}
                alt={farmer.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-brand-300"
              />
              <div className="flex-1">
                <h4 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                  {farmer.name}
                  {farmer.farmerProfile?.isVerified && (
                    <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0" />
                  )}
                </h4>
                <p className="text-xs text-brand-700 font-semibold">
                  {farmer.farmerProfile?.farmName || 'Verified Regional Farm'}
                </p>
                <p className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-brand-600" />
                  {product.location?.city || farmer.farmerProfile?.city}, {product.location?.state || farmer.farmerProfile?.state}
                </p>
              </div>
            </div>

            {farmer.farmerProfile?.bio && (
              <p className="text-xs text-gray-600 italic border-t border-brand-100/60 pt-2">
                "{farmer.farmerProfile.bio}"
              </p>
            )}
          </div>

          {/* Action CTAs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => onMessageClick && onMessageClick(farmer, product)}
              className="py-3 px-4 rounded-xl border-2 border-brand-600 text-brand-700 hover:bg-brand-50 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              Chat With Farmer
            </button>

            <button
              disabled={!product.inStock}
              onClick={() => onOrderClick && onOrderClick(product)}
              className={`py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all ${
                product.inStock
                  ? 'bg-brand-600 hover:bg-brand-700 text-white shadow-brand-500/25 active:scale-98'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              {product.inStock ? 'Place Order Request' : 'Currently Out of Stock'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
