import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sprout,
  ShoppingBag,
  ShieldCheck,
  Zap,
  TrendingUp,
  ArrowRight,
  Search,
  CheckCircle2,
  MapPin,
  Sparkles,
  Award,
  ArrowUpRight,
  Package,
  Cpu,
  Scan,
  FileCheck,
  Activity,
  CloudRain,
  ShieldAlert,
  HelpCircle,
  FileText
} from 'lucide-react';
import { cropsAPI } from '../services/api';
import { BuyCropModal } from '../components/BuyCropModal';

export const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [featuredCrops, setFeaturedCrops] = useState([]);
  const [loadingCrops, setLoadingCrops] = useState(true);
  const [selectedCropForPurchase, setSelectedCropForPurchase] = useState(null);
  const [activeAiTab, setActiveAiTab] = useState('price'); // 'price', 'disease', 'contract', 'intel'
  const navigate = useNavigate();

  const MOCK_FEATURED_CROPS = [
    {
      id: 101,
      name: 'Organic Red Tomatoes (Grade A)',
      category: 'Vegetables',
      price: 185,
      quantity: 850,
      location: 'Welimada, Badulla',
      farmerName: 'K. Bandara (Welimada Farm Cooperative)',
      grade: 'Grade A Premium',
      imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80',
      description: 'Fresh field-picked Grade A organic tomatoes. High firmness, ideal for commercial supermarket distribution.'
    },
    {
      id: 102,
      name: 'Certified Polonnaruwa Samba Paddy',
      category: 'Grains',
      price: 220,
      quantity: 2500,
      location: 'Polonnaruwa Central Belt',
      farmerName: 'P. Ranasinghe (Polonnaruwa Growers)',
      grade: 'DOA Seed Certified',
      imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80',
      description: 'Aromatic high-purity Samba paddy grain. Cleaned, dried to 12% moisture content.'
    },
    {
      id: 103,
      name: 'Upcountry Red Potatoes (Fresh Harvest)',
      category: 'Vegetables',
      price: 280,
      quantity: 1200,
      location: 'Keppetipola, Nuwara Eliya',
      farmerName: 'S. Gunawardena (Upcountry Producers)',
      grade: 'Grade A Export',
      imageUrl: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&auto=format&fit=crop&q=80',
      description: 'High-density Nuwara Eliya potatoes. Uniform sizing, pest-free, directly from cold storage.'
    },
    {
      id: 104,
      name: 'Jaffna Green Chillies (High-Pungency)',
      category: 'Spices',
      price: 520,
      quantity: 450,
      location: 'Chavakachcheri, Jaffna',
      farmerName: 'T. Vigneswaran (Northern Agri Network)',
      grade: 'Grade A Supermarket',
      imageUrl: 'https://images.unsplash.com/photo-1588879462806-07a5b61f8c0d?w=800&auto=format&fit=crop&q=80',
      description: 'Sun-dusted fresh Jaffna green chillies with high pungency and extended shelf life.'
    }
  ];

  useEffect(() => {
    const fetchCrops = async () => {
      setLoadingCrops(true);
      try {
        const res = await cropsAPI.getAll();
        if (res && res.data && res.data.length > 0) {
          setFeaturedCrops(res.data.slice(0, 4));
        } else {
          setFeaturedCrops(MOCK_FEATURED_CROPS);
        }
      } catch (err) {
        console.warn('Backend API offline. Loading featured crops fallback:', err);
        setFeaturedCrops(MOCK_FEATURED_CROPS);
      } finally {
        setLoadingCrops(false);
      }
    };
    fetchCrops();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/crops?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <div className="space-y-20 py-6">
      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-7 space-y-8"
        >
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-bold uppercase tracking-wider shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            <Sprout className="w-4 h-4 text-emerald-600" />
            <span>Direct Farmer-to-Buyer Ecosystem</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15] font-display">
            Empowering Farmers. <br />
            Direct to <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-500">Your Doorstep.</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
            Bypass traditional middleman markups. AgroLink connects registered growers directly with commercial &amp; retail buyers for transparent, farm-fresh trade.
          </p>

          {/* QUICK SEARCH FORM */}
          <form onSubmit={handleSearch} className="glass p-2.5 rounded-2xl shadow-xl border border-white/80 max-w-xl flex flex-col sm:flex-row gap-2">
            <div className="relative flex-grow flex items-center px-3">
              <Search className="w-5 h-5 text-slate-400 mr-2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search crops (e.g. Organic Wheat, Tomatoes)..."
                className="w-full bg-transparent border-none text-slate-800 placeholder-slate-400 text-sm font-medium focus:outline-none focus:ring-0"
              />
            </div>
            <button
              type="submit"
              className="px-7 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-500/25 hover:from-emerald-600 hover:to-emerald-700 transition shrink-0"
            >
              Find Produce
            </button>
          </form>

          {/* TRUST BADGES */}
          <div className="pt-2 flex flex-wrap items-center gap-6 text-xs font-semibold text-slate-500">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 100% Origin Verified
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Zero Intermediary Markup
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Secure Escrow Settlement
            </div>
          </div>
        </motion.div>

        {/* HERO VISUAL CARD */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-5 relative w-full h-[460px] rounded-3xl bg-gradient-to-br from-slate-950 via-emerald-950 to-teal-950 p-8 flex flex-col justify-between overflow-hidden shadow-2xl border border-white/10 group"
        >
          <div className="absolute -right-16 -top-16 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700" />
          
          <div className="flex justify-between items-center z-10">
            <span className="px-3 py-1 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold rounded-full uppercase tracking-wider">
              Live Harvest Network
            </span>
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          <div className="space-y-3 z-10">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-3xl border border-white/10 shadow-inner">
              🌱
            </div>
            <h3 className="text-2xl font-extrabold text-white font-display">Direct Farm Trade Matrix</h3>
            <p className="text-xs text-emerald-200/80 leading-relaxed max-w-sm">
              Real-time crop inventory tracking, verified grower profiles, and automated settlement workflows.
            </p>
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-emerald-300/80 z-10 font-bold">
            <span>1,250+ Local Producers</span>
            <Link to="/crops" className="flex items-center gap-1 hover:text-white transition">
              Explore Live Feed <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* LIVE STATS TICKER BAR */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="glass rounded-3xl p-6 sm:p-8 shadow-xl border border-white/80 grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-x-0 md:divide-x divide-slate-200/60">
          <div className="space-y-1">
            <h4 className="text-3xl sm:text-4xl font-extrabold text-emerald-600 font-display">$1.8M+</h4>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Direct Harvest Traded</p>
          </div>
          <div className="space-y-1">
            <h4 className="text-3xl sm:text-4xl font-extrabold text-emerald-600 font-display">1,250+</h4>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Verified Local Farms</p>
          </div>
          <div className="space-y-1">
            <h4 className="text-3xl sm:text-4xl font-extrabold text-emerald-600 font-display">0%</h4>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Intermediary Markup</p>
          </div>
          <div className="space-y-1">
            <h4 className="text-3xl sm:text-4xl font-extrabold text-emerald-600 font-display">99.2%</h4>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">On-Time Delivery Rate</p>
          </div>
        </div>
      </section>

      {/* FEATURED LIVE PRODUCE FEED GRID */}
      <section className="max-w-7xl mx-auto px-6 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-slate-200/80">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-extrabold uppercase tracking-wider mb-2 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Real-Time Harvest Feed
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 font-display flex items-center gap-2">
              Featured Live Farm Produce 🌾
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Directly from verified Sri Lankan growers — zero middleman markups, 100% Escrow protected.
            </p>
          </div>

          <Link
            to="/crops"
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow transition flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
          >
            <span>Explore All Crop Listings →</span>
          </Link>
        </div>

        {/* CROP CARDS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredCrops.map((crop) => (
            <motion.div
              key={crop.id}
              whileHover={{ y: -4 }}
              className="premium-card bg-white border border-slate-200/80 shadow-lg rounded-3xl overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 bg-slate-100 overflow-hidden">
                  <img
                    src={crop.imageUrl || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea'}
                    alt={crop.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea';
                    }}
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 bg-slate-900/80 backdrop-blur-md text-emerald-300 text-[10px] font-black uppercase tracking-wider rounded-full border border-white/20">
                    {crop.category || 'Produce'}
                  </div>

                  {crop.grade && (
                    <div className="absolute top-3 right-3 px-2.5 py-1 bg-emerald-600/90 backdrop-blur-md text-white text-[10px] font-extrabold rounded-full border border-emerald-400/40 shadow">
                      {crop.grade}
                    </div>
                  )}
                </div>

                <div className="p-5 space-y-3">
                  <div className="space-y-1">
                    <span className="text-[11px] font-extrabold text-emerald-700 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-emerald-600" /> {crop.location || 'Sri Lanka'}
                    </span>
                    <h3 className="font-extrabold text-slate-900 text-base leading-snug font-display line-clamp-1">
                      {crop.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium line-clamp-2">{crop.description}</p>
                  </div>

                  {crop.farmerName && (
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600 font-semibold">
                      <span className="truncate">🧑‍🌾 {crop.farmerName}</span>
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold text-[10px] shrink-0">
                        📦 {crop.quantity || 500} kg
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-5 pt-0">
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Wholesale Rate</span>
                    <span className="text-xl font-black text-emerald-600 font-display">Rs. {Number(crop.price).toFixed(2)}/kg</span>
                  </div>

                  <button
                    onClick={() => setSelectedCropForPurchase(crop)}
                    className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" /> Buy 🛒
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* POWERED BY AGROLINK AI FEATURE SHOWCASE HUB */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-slate-800 space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* HEADER */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black uppercase tracking-wider mb-2 border border-emerald-500/30">
                <Cpu className="w-4 h-4 text-emerald-400 animate-spin-slow" /> AI-POWERED AGTECH MATRIX
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-display text-white">
                Powered by AgroLink AI Intelligence 🚀
              </h2>
              <p className="text-slate-300 text-sm mt-1 max-w-xl font-medium">
                Time-series market forecasting, computer vision plant pathology, and automated forward escrow agreements.
              </p>
            </div>

            <span className="px-3.5 py-1.5 rounded-full bg-emerald-900/80 text-emerald-300 border border-emerald-700/60 text-xs font-extrabold self-start md:self-auto">
              ✦ 4 AI Engines Active
            </span>
          </div>

          {/* AI INTERACTIVE TAB BAR */}
          <div className="flex items-center gap-3 overflow-x-auto pb-2 border-b border-slate-800/80 relative z-10">
            <button
              onClick={() => setActiveAiTab('price')}
              className={`px-5 py-3 rounded-2xl text-xs font-extrabold transition flex items-center gap-2 shrink-0 border ${
                activeAiTab === 'price'
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-500/30'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>1. AI Price Prediction 📈</span>
            </button>

            <button
              onClick={() => setActiveAiTab('disease')}
              className={`px-5 py-3 rounded-2xl text-xs font-extrabold transition flex items-center gap-2 shrink-0 border ${
                activeAiTab === 'disease'
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-500/30'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
              }`}
            >
              <Scan className="w-4 h-4" />
              <span>2. AI Disease Scanner 🔬</span>
            </button>

            <button
              onClick={() => setActiveAiTab('contract')}
              className={`px-5 py-3 rounded-2xl text-xs font-extrabold transition flex items-center gap-2 shrink-0 border ${
                activeAiTab === 'contract'
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-500/30'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
              }`}
            >
              <FileCheck className="w-4 h-4" />
              <span>3. Smart Contract Farming 📜</span>
            </button>

            <button
              onClick={() => setActiveAiTab('intel')}
              className={`px-5 py-3 rounded-2xl text-xs font-extrabold transition flex items-center gap-2 shrink-0 border ${
                activeAiTab === 'intel'
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-500/30'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>4. National Demand Map 🗺️</span>
            </button>
          </div>

          {/* TAB PANELS */}
          <div className="relative z-10">
            <AnimatePresence mode="wait">
              {activeAiTab === 'price' && (
                <motion.div
                  key="price"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="grid lg:grid-cols-12 gap-8 items-center bg-slate-900/90 rounded-2xl p-6 sm:p-8 border border-slate-800"
                >
                  <div className="lg:col-span-7 space-y-4">
                    <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-extrabold text-[11px] border border-emerald-500/30">
                      TIME-SERIES FORECASTING
                    </span>
                    <h3 className="text-2xl font-bold font-display text-white">
                      Target Fair Price &amp; 7-Day Trend Benchmarks 📈
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed font-medium">
                      AgroLink AI analyzes weather telemetry, Dambulla &amp; Pettah market arrivals, import tariff revisions, and fuel logistics costs to project fair crop prices.
                    </p>
                    <div className="pt-2">
                      <Link
                        to="/price-prediction"
                        className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-lg transition inline-flex items-center gap-2"
                      >
                        <span>Launch AI Price forecaster →</span>
                      </Link>
                    </div>
                  </div>

                  <div className="lg:col-span-5 bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-400">🍅 Tomato (Grade A) Benchmark:</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-extrabold text-[10px] border border-emerald-800">
                        +19.4% Surge
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between pt-1">
                      <span className="text-xs text-slate-400">Today's Wholesale:</span>
                      <span className="text-lg font-black text-slate-200 font-display">Rs. 180.00/kg</span>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs font-bold text-emerald-400">AI Target Fair Price:</span>
                      <span className="text-2xl font-black text-emerald-400 font-display">Rs. 215.00/kg</span>
                    </div>
                    <div className="p-3 bg-emerald-950/60 rounded-xl border border-emerald-800/60 text-[11px] font-bold text-emerald-300">
                      💡 Recommendation: WAIT 3–4 DAYS BEFORE SELLING (Post-Rain Quality Surge)
                    </div>
                  </div>
                </motion.div>
              )}

              {activeAiTab === 'disease' && (
                <motion.div
                  key="disease"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="grid lg:grid-cols-12 gap-8 items-center bg-slate-900/90 rounded-2xl p-6 sm:p-8 border border-slate-800"
                >
                  <div className="lg:col-span-7 space-y-4">
                    <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-extrabold text-[11px] border border-emerald-500/30">
                      COMPUTER VISION PATHOLOGY
                    </span>
                    <h3 className="text-2xl font-bold font-display text-white">
                      Instant Crop Disease Detection &amp; Treatment 🔬
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed font-medium">
                      Upload a photo of damaged leaves or crops. Our trained neural network diagnoses plant diseases instantly and suggests bio-organic treatments.
                    </p>
                    <div className="pt-2">
                      <Link
                        to="/disease-detection"
                        className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-lg transition inline-flex items-center gap-2"
                      >
                        <span>Scan Crop Leaf Now →</span>
                      </Link>
                    </div>
                  </div>

                  <div className="lg:col-span-5 bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-400">🍂 Simulated Leaf Scan:</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-extrabold text-[10px] border border-emerald-800">
                        97.4% Match
                      </span>
                    </div>
                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                      <p className="font-extrabold text-rose-400 text-sm">Tomato Early Blight (Alternaria solani)</p>
                      <p className="text-[11px] text-slate-300">Concentric dark spots identified on lower foliage.</p>
                    </div>
                    <div className="p-3 bg-emerald-950/60 rounded-xl border border-emerald-800/60 text-[11px] font-bold text-emerald-300">
                      🌿 Recommended Remedy: Spray Copper Hydroxide or Neem Extract every 7 days.
                    </div>
                  </div>
                </motion.div>
              )}

              {activeAiTab === 'contract' && (
                <motion.div
                  key="contract"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="grid lg:grid-cols-12 gap-8 items-center bg-slate-900/90 rounded-2xl p-6 sm:p-8 border border-slate-800"
                >
                  <div className="lg:col-span-7 space-y-4">
                    <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-extrabold text-[11px] border border-emerald-500/30">
                      GUARANTEED FORWARD ESCROW
                    </span>
                    <h3 className="text-2xl font-bold font-display text-white">
                      Guaranteed Purchasing Price Contracts 📜
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed font-medium">
                      Lock in guaranteed crop purchasing prices before sowing. Supermarkets and institutional buyers deposit 30% upfront escrow into smart contract vaults.
                    </p>
                    <div className="pt-2">
                      <Link
                        to="/contract-farming"
                        className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-lg transition inline-flex items-center gap-2"
                      >
                        <span>Explore Contract Farming →</span>
                      </Link>
                    </div>
                  </div>

                  <div className="lg:col-span-5 bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-400">📜 Active Buyer Agreement:</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-extrabold text-[10px] border border-emerald-800">
                        30% Escrow Locked
                      </span>
                    </div>
                    <div className="space-y-1">
                      <p className="font-extrabold text-white text-sm">Keells Supermarket Forward Contract</p>
                      <p className="text-xs text-slate-400">Produce: Organic Samba Rice (5,000 kg)</p>
                    </div>
                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                      <span className="text-slate-400">Guaranteed Floor Price:</span>
                      <span className="font-black text-emerald-400 text-base">Rs. 220.00/kg</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeAiTab === 'intel' && (
                <motion.div
                  key="intel"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="grid lg:grid-cols-12 gap-8 items-center bg-slate-900/90 rounded-2xl p-6 sm:p-8 border border-slate-800"
                >
                  <div className="lg:col-span-7 space-y-4">
                    <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-extrabold text-[11px] border border-emerald-500/30">
                      FOOD SECURITY &amp; POLICY SIMULATOR
                    </span>
                    <h3 className="text-2xl font-bold font-display text-white">
                      National Food Security Heatmaps &amp; Alerts 🗺️
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed font-medium">
                      Government officers and planners monitor district overproduction risks, buffer stock health, and simulate import tariff revisions.
                    </p>
                    <div className="pt-2">
                      <Link
                        to="/gov-intelligence"
                        className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-lg transition inline-flex items-center gap-2"
                      >
                        <span>View Gov Intelligence →</span>
                      </Link>
                    </div>
                  </div>

                  <div className="lg:col-span-5 bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-400">🚨 National Warning Alert:</span>
                      <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 font-extrabold text-[10px] border border-rose-800">
                        Supply Deficit
                      </span>
                    </div>
                    <div className="p-3 bg-rose-950/40 rounded-xl border border-rose-900/60 text-[11px] space-y-1 text-rose-200">
                      <p className="font-extrabold text-white">Potato Deficit Alert (Central Province)</p>
                      <p className="text-[10px]">Welimada deluge reduced picking by 20%. Price spike expected.</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ROLE-BASED PORTAL MATRIX SECTION */}
      <section className="py-12 bg-slate-100/70 border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto px-6 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">Tailored Ecosystem Access</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 font-display">Built for Every Agricultural Stakeholder</h2>
            <p className="text-slate-600 text-sm leading-relaxed">AgroLink provides customized tools depending on your registered account role.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* FARMERS */}
            <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-lg space-y-4 hover:border-emerald-500 transition">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl font-bold">
                🧑‍🌾
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-emerald-600 tracking-wider">Role 1: Producers</span>
                <h3 className="text-lg font-extrabold text-slate-900 font-display">Farmers &amp; Growers</h3>
              </div>
              <ul className="space-y-2 text-xs font-semibold text-slate-600">
                <li className="flex items-center gap-2">✓ Post Harvest Listings (+ Quick Modal)</li>
                <li className="flex items-center gap-2">✓ AI Disease Scanner &amp; Advisory</li>
                <li className="flex items-center gap-2">✓ Crop Price Predictor &amp; Demand Map</li>
                <li className="flex items-center gap-2">✓ Pre-Production Supplies &amp; Machinery</li>
              </ul>
              <Link to="/register" className="inline-block pt-2 text-xs font-extrabold text-emerald-600 hover:underline">
                Join as Farmer →
              </Link>
            </div>

            {/* COMMERCIAL BUYERS */}
            <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-lg space-y-4 hover:border-emerald-500 transition">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center text-2xl font-bold">
                🏬
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-teal-600 tracking-wider">Role 2: Buyers</span>
                <h3 className="text-lg font-extrabold text-slate-900 font-display">Supermarkets &amp; B2B</h3>
              </div>
              <ul className="space-y-2 text-xs font-semibold text-slate-600">
                <li className="flex items-center gap-2">✓ Bulk Quantity Escrow Orders</li>
                <li className="flex items-center gap-2">✓ B2B Purchase Request Tenders</li>
                <li className="flex items-center gap-2">✓ Live 9-Stage Fleet Tracking</li>
                <li className="flex items-center gap-2">✓ Verified Grower Origin Passports</li>
              </ul>
              <Link to="/crops" className="inline-block pt-2 text-xs font-extrabold text-teal-600 hover:underline">
                Browse Marketplace →
              </Link>
            </div>

            {/* LOGISTICS DRIVERS */}
            <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-lg space-y-4 hover:border-emerald-500 transition">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-2xl font-bold">
                🚚
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-amber-600 tracking-wider">Role 3: Logistics</span>
                <h3 className="text-lg font-extrabold text-slate-900 font-display">Fleet Drivers</h3>
              </div>
              <ul className="space-y-2 text-xs font-semibold text-slate-600">
                <li className="flex items-center gap-2">✓ Dispatch Order Assignment</li>
                <li className="flex items-center gap-2">✓ Route Pickup &amp; Transit Updates</li>
                <li className="flex items-center gap-2">✓ Escrow Delivery Settlement</li>
                <li className="flex items-center gap-2">✓ Vehicle Registration &amp; Mileage</li>
              </ul>
              <Link to="/login" className="inline-block pt-2 text-xs font-extrabold text-amber-600 hover:underline">
                Logistics Portal →
              </Link>
            </div>

            {/* GOVERNMENT ADMINS */}
            <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-lg space-y-4 hover:border-emerald-500 transition">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center text-2xl font-bold">
                🏛️
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-sky-600 tracking-wider">Role 4: Officers</span>
                <h3 className="text-lg font-extrabold text-slate-900 font-display">Gov Intelligence</h3>
              </div>
              <ul className="space-y-2 text-xs font-semibold text-slate-600">
                <li className="flex items-center gap-2">✓ District Overproduction Risk Alerts</li>
                <li className="flex items-center gap-2">✓ Tariff &amp; Policy Impact Simulator</li>
                <li className="flex items-center gap-2">✓ Buffer Stock Health Tracking</li>
                <li className="flex items-center gap-2">✓ Food Security Heatmaps</li>
              </ul>
              <Link to="/gov-intelligence" className="inline-block pt-2 text-xs font-extrabold text-sky-600 hover:underline">
                View Gov Intelligence →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-20 bg-slate-900 text-white relative overflow-hidden my-12 mx-4 sm:mx-8 rounded-3xl shadow-2xl">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-8 relative z-10">
          <span className="px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider border border-emerald-500/30">Get Started Today</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-display">
            Ready to revolutionize your farm trade?
          </h2>
          <p className="text-slate-300 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            Join thousands of growers and commercial buyers trading directly on Sri Lanka's leading agriculture ecosystem.
          </p>
          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Link
              to="/register"
              className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold rounded-xl shadow-xl shadow-emerald-500/30 hover:from-emerald-600 hover:to-emerald-700 transition inline-block text-base"
            >
              Create Free Account
            </Link>
            <Link
              to="/crops"
              className="px-8 py-4 bg-slate-800 text-white border border-slate-700 font-bold rounded-xl hover:bg-slate-700 transition inline-block text-base"
            >
              Browse Produce Marketplace
            </Link>
          </div>
        </div>
      </section>

      {/* PURCHASE MODAL TRIGGERED FROM HOME PAGE */}
      {selectedCropForPurchase && (
        <BuyCropModal
          crop={selectedCropForPurchase}
          onClose={() => setSelectedCropForPurchase(null)}
          onOrderPlaced={() => setFeaturedCrops([...featuredCrops])}
        />
      )}
    </div>
  );
};
