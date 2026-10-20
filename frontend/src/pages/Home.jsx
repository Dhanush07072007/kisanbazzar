import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../store/productSlice';
import ProductCard from '../components/ProductCard';
import {
  Sprout,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  MessageSquare,
  Users,
  Search,
  CheckCircle2,
  Trophy,
  Sparkles,
} from 'lucide-react';

const categoriesList = [
  {
    name: 'Vegetables',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=400',
    tag: 'Fresh Daily',
  },
  {
    name: 'Fruits',
    image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&q=80&w=400',
    tag: 'Tree-ripened',
  },
  {
    name: 'Grains & Cereals',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=400',
    tag: 'Farm Direct',
  },
  {
    name: 'Pulses & Lentils',
    image: 'https://images.unsplash.com/photo-1585849834908-3481231155e8?auto=format&fit=crop&q=80&w=400',
    tag: 'Unpolished',
  },
  {
    name: 'Dairy & Honey',
    image: 'https://images.unsplash.com/photo-1589927986086-3d10fb595e8b?auto=format&fit=crop&q=80&w=400',
    tag: 'Pure & Raw',
  },
  {
    name: 'Spices & Herbs',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=400',
    tag: 'Sun-dried',
  },
];

const Home = ({ onOrderClick, onMessageClick }) => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items: products, loading } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts({ limit: 4 }));
  }, [dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchKeyword.trim()) {
      navigate(`/marketplace?search=${encodeURIComponent(searchKeyword.trim())}`);
    } else {
      navigate('/marketplace');
    }
  };

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 bg-gradient-to-b from-brand-50/70 via-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Winner Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 border border-amber-200/80 text-amber-800 text-xs font-bold shadow-sm">
                <Trophy className="w-4 h-4 text-amber-600" />
                <span>Winner: Full Stack Hackathon · Team Terminator</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-black text-gray-950 tracking-tight leading-[1.1]">
                Bridging the Gap Between{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-emerald-500">
                  Farmers & Consumers
                </span>
              </h1>

              <p className="text-base sm:text-lg text-gray-600 max-w-2xl leading-relaxed">
                Eliminate unnecessary middlemen. KisanBazar provides farmers with a direct digital
                presence, transparent pricing, and instant real-time messaging with buyers.
              </p>

              {/* Quick Search */}
              <form onSubmit={handleSearch} className="max-w-xl mx-auto lg:mx-0">
                <div className="relative flex items-center shadow-lg rounded-2xl bg-white border border-gray-200 p-2">
                  <Search className="w-5 h-5 text-gray-400 ml-3 shrink-0" />
                  <input
                    type="text"
                    placeholder="Search organic tomatoes, basmati rice, farm honey..."
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    className="w-full px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-brand-500/20 active:scale-95 shrink-0"
                  >
                    Find Produce
                  </button>
                </div>
              </form>

              {/* Quick Trust Metrics */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-gray-600 font-semibold">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-600" />
                  <span>100% Direct Harvest</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-600" />
                  <span>Fair Farmer Incomes</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-600" />
                  <span>Verified Farm Profiles</span>
                </div>
              </div>
            </div>

            {/* Right Column / Hero Visual */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="absolute -inset-4 bg-gradient-to-r from-brand-300 to-emerald-300 rounded-3xl blur-2xl opacity-30 transform -rotate-3"></div>
                <div className="relative bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 p-3">
                  <img
                    src="https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&q=80&w=800"
                    alt="Indian Farmer Smiling with produce"
                    className="w-full h-80 sm:h-96 object-cover rounded-2xl"
                  />
                  {/* Floating Notification */}
                  <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-gray-100 flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 shrink-0">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900">Direct Farmer Revenue</p>
                      <p className="text-[11px] text-gray-500">Farmers take home up to 40% more margin</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold tracking-wider uppercase text-brand-600">
              Browse Categories
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
              Fresh From Regional Fields
            </h2>
          </div>
          <Link
            to="/marketplace"
            className="mt-3 sm:mt-0 text-sm font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1 group"
          >
            Explore all produce
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categoriesList.map((cat) => (
            <Link
              key={cat.name}
              to={`/marketplace?category=${encodeURIComponent(cat.name)}`}
              className="group relative rounded-2xl overflow-hidden aspect-square border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-3">
                <span className="text-[10px] font-semibold text-brand-300 uppercase tracking-wider">
                  {cat.tag}
                </span>
                <span className="text-xs sm:text-sm font-bold text-white group-hover:text-brand-200 transition-colors">
                  {cat.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* The Problem vs Solution Interactive Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 sm:p-12 text-white shadow-xl">
          <div className="max-w-3xl mb-10">
            <span className="text-brand-400 font-bold text-xs uppercase tracking-widest">
              Why KisanBazar Exists
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold mt-2 leading-tight">
              Solving the Agricultural Middleman Dilemma
            </h2>
            <p className="text-gray-400 text-sm sm:text-base mt-2">
              Traditional supply chains involve 3 to 5 intermediaries before farm goods reach the kitchen.
              Here is how KisanBazar transforms the equation:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* The Old Problem */}
            <div className="bg-white/5 border border-red-500/20 rounded-2xl p-6 space-y-4">
              <div className="flex items-center space-x-2 text-rose-400 font-bold text-sm">
                <span>❌ The Traditional Dilemma</span>
              </div>
              <ul className="space-y-3 text-xs sm:text-sm text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">•</span>
                  <span>Middlemen slash farmer earnings while marking up retail prices for consumers.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">•</span>
                  <span>Zero direct communication or trust connection between buyers and growers.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">•</span>
                  <span>Small-holder farmers lack digital storefronts to showcase their seasonal crops.</span>
                </li>
              </ul>
            </div>

            {/* KisanBazar Solution */}
            <div className="bg-brand-950/40 border border-brand-500/30 rounded-2xl p-6 space-y-4">
              <div className="flex items-center space-x-2 text-brand-400 font-bold text-sm">
                <span>✅ The KisanBazar Solution</span>
              </div>
              <ul className="space-y-3 text-xs sm:text-sm text-gray-200">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                  <span>Direct farmer listing with customized unit pricing & minimum order options.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                  <span>Real-time in-app messaging to negotiate and build long-term relationships.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                  <span>Transparent farm profiles with location verification and direct order tracking.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Fresh Harvest Listings Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold tracking-wider uppercase text-brand-600">
              Fresh Harvest
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
              Trending Produce Right Now
            </h2>
          </div>
          <Link
            to="/marketplace"
            className="mt-3 sm:mt-0 text-sm font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1 group"
          >
            View all listings
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-80 bg-gray-100 animate-pulse rounded-2xl"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(0, 4).map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onOrderClick={onOrderClick}
                onMessageClick={onMessageClick}
              />
            ))}
          </div>
        )}
      </section>

      {/* Role CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Farmer Card */}
          <div className="bg-gradient-to-br from-brand-600 to-brand-800 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-200">
                Are you a farmer?
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold leading-tight">
                Sell Directly to Thousands of Conscious Consumers
              </h3>
              <p className="text-sm text-brand-100 leading-relaxed">
                List your grains, vegetables, and fruit harvests. Set your own prices and talk directly
                to verified buyers.
              </p>
            </div>
            <div className="mt-8">
              <Link
                to="/register?role=farmer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-brand-800 font-bold text-xs rounded-xl hover:bg-brand-50 transition-colors shadow-md"
              >
                Register as Farmer
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Consumer Card */}
          <div className="bg-gradient-to-br from-earth-700 to-earth-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-earth-200">
                Are you a consumer or restaurant?
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold leading-tight">
                Source Pristine Produce at Authentic Farm Rates
              </h3>
              <p className="text-sm text-earth-100 leading-relaxed">
                Know where your food comes from. Enjoy naturally ripened, organic farm products
                delivered from regional farms.
              </p>
            </div>
            <div className="mt-8">
              <Link
                to="/register?role=consumer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-earth-900 font-bold text-xs rounded-xl hover:bg-earth-50 transition-colors shadow-md"
              >
                Start Shopping Produce
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
