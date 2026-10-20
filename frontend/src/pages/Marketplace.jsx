import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../store/productSlice';
import ProductCard from '../components/ProductCard';
import {
  Search,
  Filter,
  SlidersHorizontal,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Sprout,
} from 'lucide-react';

const categories = [
  'All',
  'Vegetables',
  'Fruits',
  'Grains & Cereals',
  'Pulses & Lentils',
  'Dairy & Honey',
  'Spices & Herbs',
];

const Marketplace = ({ onOrderClick, onMessageClick }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();

  const { items: products, total, totalPages, currentPage, loading } = useSelector(
    (state) => state.products
  );

  // Filter States
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get('category') || 'All'
  );
  const [organicOnly, setOrganicOnly] = useState(searchParams.get('organic') === 'true');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
  const [location, setLocation] = useState(searchParams.get('location') || '');

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync when search params or local state change
  useEffect(() => {
    const params = {
      page: searchParams.get('page') || 1,
      limit: 12,
    };

    if (search) params.search = search;
    if (selectedCategory && selectedCategory !== 'All') params.category = selectedCategory;
    if (organicOnly) params.organic = 'true';
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;
    if (sort) params.sort = sort;
    if (location) params.location = location;

    dispatch(fetchProducts(params));
  }, [dispatch, searchParams]);

  const handleApplyFilters = (e) => {
    if (e) e.preventDefault();
    const newParams = new URLSearchParams();

    if (search) newParams.set('search', search);
    if (selectedCategory && selectedCategory !== 'All') newParams.set('category', selectedCategory);
    if (organicOnly) newParams.set('organic', 'true');
    if (minPrice) newParams.set('minPrice', minPrice);
    if (maxPrice) newParams.set('maxPrice', maxPrice);
    if (sort) newParams.set('sort', sort);
    if (location) newParams.set('location', location);
    newParams.set('page', '1');

    setSearchParams(newParams);
    setMobileFilterOpen(false);
  };

  const handleResetFilters = () => {
    setSearch('');
    setSelectedCategory('All');
    setOrganicOnly(false);
    setMinPrice('');
    setMaxPrice('');
    setSort('newest');
    setLocation('');
    setSearchParams(new URLSearchParams());
  };

  const handlePageChange = (newPage) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage.toString());
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-gray-100 gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-950 tracking-tight">
            Agricultural Marketplace
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Showing {products.length} of {total} farm listings directly from verified growers
          </p>
        </div>

        {/* Sort and Mobile Filter Button */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="md:hidden flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 bg-white"
          >
            <SlidersHorizontal className="w-4 h-4 text-brand-600" />
            Filters
          </button>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500 font-medium">Sort by:</span>
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                const p = new URLSearchParams(searchParams);
                p.set('sort', e.target.value);
                setSearchParams(p);
              }}
              className="px-3 py-2 text-xs font-semibold rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="newest">Recently Harvested</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Top Rated Farmers</option>
              <option value="views">Most Popular</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pt-8">
        {/* Filters Sidebar */}
        <aside
          className={`md:block ${
            mobileFilterOpen ? 'block fixed inset-0 z-50 p-6 bg-white overflow-y-auto' : 'hidden'
          } md:relative md:p-0 md:bg-transparent`}
        >
          {mobileFilterOpen && (
            <div className="flex justify-between items-center pb-4 mb-4 border-b md:hidden">
              <h3 className="font-bold text-gray-900">Filters</h3>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="text-gray-500 hover:text-gray-800 text-sm font-semibold"
              >
                Close
              </button>
            </div>
          )}

          <form onSubmit={handleApplyFilters} className="space-y-6">
            {/* Search Box */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Search Produce
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="E.g. Wheat, Tomato..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Category
              </label>
              <div className="space-y-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                      selectedCategory === cat
                        ? 'bg-brand-50 text-brand-700 font-bold'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Price (₹)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-500"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            {/* Location Filter */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Farm Region / City
              </label>
              <input
                type="text"
                placeholder="E.g. Nashik, Ludhiana..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-500"
              />
            </div>

            {/* Organic Switch */}
            <div className="pt-2">
              <label className="flex items-center space-x-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={organicOnly}
                  onChange={(e) => setOrganicOnly(e.target.checked)}
                  className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-gray-300"
                />
                <span className="text-xs font-semibold text-gray-700">
                  Certified Organic Only 🌱
                </span>
              </label>
            </div>

            {/* Actions */}
            <div className="pt-2 space-y-2">
              <button
                type="submit"
                className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-md shadow-brand-500/20 transition-all"
              >
                Apply Filters
              </button>
              <button
                type="button"
                onClick={handleResetFilters}
                className="w-full py-2 text-gray-500 hover:text-gray-800 text-xs font-semibold transition-colors flex items-center justify-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reset Filters
              </button>
            </div>
          </form>
        </aside>

        {/* Product Grid Area */}
        <main className="md:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-80 bg-gray-100 rounded-2xl animate-pulse"></div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 p-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center mx-auto">
                <Sprout className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">No produce matched your filters</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Try clearing some filters or searching for common produce like tomatoes, rice, or mangoes.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 bg-brand-600 text-white text-xs font-bold rounded-xl hover:bg-brand-700 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onOrderClick={onOrderClick}
                    onMessageClick={onMessageClick}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 flex items-center justify-center space-x-2">
                  <button
                    disabled={currentPage <= 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <div className="flex items-center space-x-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                          page === currentPage
                            ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    disabled={currentPage >= totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Marketplace;
