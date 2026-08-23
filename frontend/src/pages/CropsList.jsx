import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cropsAPI, ordersAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Search,
  Filter,
  Loader2,
  ShoppingBag,
  MapPin,
  Tag,
  Trash2,
  QrCode,
  PlusCircle,
  LayoutGrid,
  List,
  Sparkles,
  ShieldCheck,
  Truck,
  TrendingDown,
  ArrowRight,
  X,
  SlidersHorizontal,
  FileCheck2,
  Package,
  BadgeCheck,
  CheckCircle2,
  Star
} from 'lucide-react';
import { FarmerProfileModal } from '../components/FarmerProfileModal';
import { TraceabilityModal } from '../components/TraceabilityModal';
import { BuyCropModal } from '../components/BuyCropModal';
import { PostHarvestModal } from '../components/PostHarvestModal';

const MOCK_CROPS = [
  {
    id: 1,
    name: 'Organic Nuwara Eliya Tomatoes',
    category: 'Vegetables',
    location: 'Nuwara Eliya',
    price: 210,
    marketPrice: 225,
    quantity: 450,
    farmerName: 'Sunil Perera (Green Valley)',
    farmerId: 2,
    grade: 'Grade A Export',
    isOrganic: true,
    imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80',
    description: 'Fresh grade-A vine-ripened organic tomatoes grown in high-altitude soil. Zero chemical pesticides.',
    batchCode: 'BATCH-2026-NWR-0941'
  },
  {
    id: 2,
    name: 'Jaffna Red Onions (Grade A)',
    category: 'Vegetables',
    location: 'Jaffna',
    price: 340,
    marketPrice: 375,
    quantity: 800,
    farmerName: 'Kamal Fernando (Jaffna Organics)',
    farmerId: 3,
    grade: 'Grade A Supermarket',
    isOrganic: true,
    imageUrl: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=800&auto=format&fit=crop&q=80',
    description: 'Pungent, sun-cured Jaffna shallots with high oil content. Ideal for long-term commercial storage.',
    batchCode: 'BATCH-2026-JAF-0822'
  },
  {
    id: 3,
    name: 'Ceylon Organic Cinnamon Bark',
    category: 'Spices',
    location: 'Galle',
    price: 1450,
    marketPrice: 1600,
    quantity: 120,
    farmerName: 'Sunil Perera (Green Valley)',
    farmerId: 2,
    grade: 'Alba Certified',
    isOrganic: true,
    imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&auto=format&fit=crop&q=80',
    description: 'Authentic Alba-grade Ceylon quills. Hand-peeled in Southern Sri Lanka with certified low coumarin.',
    batchCode: 'BATCH-2026-GAL-0519'
  },
  {
    id: 4,
    name: 'Hambantota Sweet Watermelons',
    category: 'Fruits',
    location: 'Hambantota',
    price: 180,
    marketPrice: 200,
    quantity: 650,
    farmerName: 'Kamal Fernando (Jaffna Organics)',
    farmerId: 3,
    grade: 'Grade A Fresh',
    isOrganic: false,
    imageUrl: 'https://images.unsplash.com/photo-1589984662646-e7b2e4962f18?w=800&auto=format&fit=crop&q=80',
    description: 'Juicy, high-brix sugar-baby watermelons harvested fresh from dry zone farms. Direct dispatch.',
    batchCode: 'BATCH-2026-HMB-0312'
  },
  {
    id: 5,
    name: 'Anuradhapura White Samba Rice',
    category: 'Grains',
    location: 'Anuradhapura',
    price: 260,
    marketPrice: 285,
    quantity: 1500,
    farmerName: 'Sunil Perera (Green Valley)',
    farmerId: 2,
    grade: 'DOA Seed Certified',
    isOrganic: true,
    imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80',
    description: 'Aromatic long-grain paddy harvested from Ancient Tank Irrigation zones. Aged 6 months for premium texture.',
    batchCode: 'BATCH-2026-ANU-1104'
  },
  {
    id: 6,
    name: 'Kandy Ceylon Green Tea Leaves',
    category: 'Spices',
    location: 'Kandy',
    price: 890,
    marketPrice: 950,
    quantity: 350,
    farmerName: 'Sunil Perera (Green Valley)',
    farmerId: 2,
    grade: 'Estate Grade A',
    isOrganic: true,
    imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&auto=format&fit=crop&q=80',
    description: 'Hand-picked two-leaves-and-a-bud fresh tea flush from central hill slopes. Rich in natural antioxidants.',
    batchCode: 'BATCH-2026-KDY-0731'
  }
];

const SRI_LANKA_DISTRICTS = [
  'Nuwara Eliya',
  'Jaffna',
  'Kandy',
  'Galle',
  'Hambantota',
  'Anuradhapura',
  'Polonnaruwa',
  'Badulla',
  'Dambulla',
  'Matale',
  'Kurunegala',
  'Ratnapura',
  'Kegalle',
  'Ampara',
  'Batticaloa',
  'Trincomalee',
  'Kilinochchi',
  'Mannar',
  'Vavuniya',
  'Mullaitivu',
  'Monaragala',
  'Puttalam',
  'Kalutara',
  'Colombo'
];

export const CropsList = () => {
  const { isFarmer } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialKeyword = searchParams.get('search') || '';

  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [selectedTraceCrop, setSelectedTraceCrop] = useState(null);
  const [selectedBuyCrop, setSelectedBuyCrop] = useState(null);
  const [showPostModal, setShowPostModal] = useState(false);
  const [showFiltersDrawer, setShowFiltersDrawer] = useState(false);

  // Filters State
  const [keyword, setKeyword] = useState(initialKeyword);
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [organicOnly, setOrganicOnly] = useState(false);
  const [gradeAOnly, setGradeAOnly] = useState(false);
  const [sortBy, setSortBy] = useState('DEFAULT');
  const [viewMode, setViewMode] = useState('grid');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const filterMockData = useCallback((kw, cat, loc, minP, maxP, orgOnly, grAOnly, sort) => {
    let result = [...MOCK_CROPS];
    if (kw) {
      result = result.filter(c => c.name.toLowerCase().includes(kw.toLowerCase()) || c.description.toLowerCase().includes(kw.toLowerCase()));
    }
    if (cat) {
      result = result.filter(c => c.category.toLowerCase() === cat.toLowerCase());
    }
    if (loc) {
      result = result.filter(c => c.location.toLowerCase().includes(loc.toLowerCase()));
    }
    if (minP) {
      result = result.filter(c => c.price >= Number(minP));
    }
    if (maxP) {
      result = result.filter(c => c.price <= Number(maxP));
    }
    if (orgOnly) {
      result = result.filter(c => c.isOrganic || c.name.toLowerCase().includes('organic'));
    }
    if (grAOnly) {
      result = result.filter(c => c.grade?.toLowerCase().includes('grade a') || c.grade?.toLowerCase().includes('certified'));
    }

    // Sorting
    if (sort === 'PRICE_LOW') {
      result.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sort === 'PRICE_HIGH') {
      result.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sort === 'QTY_HIGH') {
      result.sort((a, b) => Number(b.quantity) - Number(a.quantity));
    } else if (sort === 'NEWEST') {
      result.sort((a, b) => Number(b.id) - Number(a.id));
    }

    return result;
  }, []);

  const fetchCrops = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page,
        size: 12,
        ...(keyword && { keyword }),
        ...(category && { category }),
        ...(location && { location }),
        ...(minPrice && { minPrice }),
        ...(maxPrice && { maxPrice }),
      };
      const res = await cropsAPI.getAll(params);
      if (res && res.data && Array.isArray(res.data.content) && res.data.content.length > 0) {
        let items = res.data.content;
        if (organicOnly) items = items.filter(c => c.isOrganic || c.name?.toLowerCase().includes('organic'));
        if (gradeAOnly) items = items.filter(c => c.grade?.toLowerCase().includes('grade a'));
        setCrops(items);
        setTotalPages(res.data.totalPages || 1);
      } else {
        const filtered = filterMockData(keyword, category, location, minPrice, maxPrice, organicOnly, gradeAOnly, sortBy);
        setCrops(filtered);
        setTotalPages(1);
      }
    } catch (err) {
      console.warn('Backend API offline. Loading featured crops catalog:', err);
      const filtered = filterMockData(keyword, category, location, minPrice, maxPrice, organicOnly, gradeAOnly, sortBy);
      setCrops(filtered);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [page, keyword, category, location, minPrice, maxPrice, organicOnly, gradeAOnly, sortBy, filterMockData]);

  useEffect(() => {
    fetchCrops();
  }, [fetchCrops]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0);
    fetchCrops();
  };

  const handleResetFilters = () => {
    setKeyword('');
    setCategory('');
    setLocation('');
    setMinPrice('');
    setMaxPrice('');
    setOrganicOnly(false);
    setGradeAOnly(false);
    setSortBy('DEFAULT');
    setPage(0);
  };

  const hasActiveFilters = Boolean(keyword || category || location || minPrice || maxPrice || organicOnly || gradeAOnly);

  const handleDelete = async (cropId) => {
    if (!window.confirm('Are you sure you want to delete this crop listing?')) return;
    try {
      await cropsAPI.delete(cropId);
      fetchCrops();
    } catch (err) {
      alert('Failed to delete crop');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fade-in">
      {/* 1. HERO MARKETPLACE HEADER */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black uppercase tracking-wider border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Verified Producer Marketplace
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-display text-white">
              Available Farm Harvests 🌾
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-xl font-medium leading-relaxed">
              Direct-from-farm wholesale produce with 100% Escrow security, origin traceability passports, and zero intermediary markup.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowPostModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-500/25 flex items-center gap-2 transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Post Harvest Listing</span>
            </button>
            <Link
              to="/contracts"
              className="px-5 py-3 bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-200 font-extrabold text-xs sm:text-sm rounded-xl transition flex items-center gap-1.5"
            >
              <span>Forward Contracts</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* LIVE MICRO-STATS STRIP */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-semibold relative z-10">
          <div className="flex items-center gap-2 text-slate-300">
            <Package className="w-4 h-4 text-emerald-400 shrink-0" />
            <span><strong className="text-white font-bold">12.4 MT</strong> Active Harvest</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
            <span><strong className="text-white font-bold">25 Districts</strong> Covered</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span><strong className="text-white font-bold">100% Escrow</strong> Protected</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <Truck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span><strong className="text-white font-bold">Cold-Chain Fleet</strong> Ready</span>
          </div>
        </div>
      </div>

      {/* 2. UNIFIED SEARCH, DISTRICT & VIEW CONTROL BAR */}
      <div className="glass rounded-2xl p-4 border border-white/80 shadow-lg space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* SEARCH INPUT */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Search produce by name, crop type, or farm cooperative..."
              className="w-full pl-10 pr-20 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 bg-white transition"
            />
            {keyword && (
              <button
                type="button"
                onClick={() => { setKeyword(''); setPage(0); }}
                className="absolute right-12 top-3 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition"
            >
              Search
            </button>
          </form>

          {/* DISTRICT SELECTOR */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative min-w-[170px]">
              <select
                value={location}
                onChange={(e) => { setLocation(e.target.value); setPage(0); }}
                className="w-full pl-3 pr-8 py-2.5 rounded-xl border border-slate-200 text-xs font-bold bg-white text-slate-800 focus:outline-none focus:border-emerald-500 shadow-sm cursor-pointer"
              >
                <option value="">All Sri Lanka Districts 📍</option>
                {SRI_LANKA_DISTRICTS.map((dist) => (
                  <option key={dist} value={dist}>📍 {dist}</option>
                ))}
              </select>
            </div>

            {/* SORT SELECTOR */}
            <div className="relative min-w-[150px]">
              <select
                value={sortBy}
                onChange={(e) => { setSortBy(e.target.value); setPage(0); }}
                className="w-full pl-3 pr-8 py-2.5 rounded-xl border border-slate-200 text-xs font-bold bg-white text-slate-800 focus:outline-none focus:border-emerald-500 shadow-sm cursor-pointer"
              >
                <option value="DEFAULT">⭐ Sort: Featured</option>
                <option value="PRICE_LOW">💲 Price: Low to High</option>
                <option value="PRICE_HIGH">💲 Price: High to Low</option>
                <option value="QTY_HIGH">🌾 Stock: High to Low</option>
                <option value="NEWEST">🕒 Newest First</option>
              </select>
            </div>

            {/* ADVANCED PRICE FILTER TOGGLE */}
            <button
              type="button"
              onClick={() => setShowFiltersDrawer(!showFiltersDrawer)}
              className={`px-3.5 py-2.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 ${
                showFiltersDrawer || minPrice || maxPrice
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-600" />
              <span>Price Filters</span>
            </button>

            {/* VIEW MODE TOGGLE */}
            <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-xs font-bold transition ${
                  viewMode === 'grid' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg text-xs font-bold transition ${
                  viewMode === 'table' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Table View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* EXPANDABLE ADVANCED PRICE FILTER DRAWER */}
        <AnimatePresence>
          {showFiltersDrawer && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="pt-3 border-t border-slate-200/80 overflow-hidden"
            >
              <div className="flex flex-wrap items-center gap-4 bg-slate-50/80 p-4 rounded-xl border border-slate-200/60 text-xs">
                <span className="font-extrabold text-slate-600">Price Range (Rs./kg):</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="Min (Rs. 0)"
                    className="w-28 px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-semibold text-xs focus:outline-none focus:border-emerald-500"
                  />
                  <span className="text-slate-400 font-bold">to</span>
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="Max (Rs. 2000)"
                    className="w-28 px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-semibold text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => { setPage(0); fetchCrops(); }}
                  className="px-4 py-1.5 bg-slate-900 text-white font-bold rounded-lg text-xs hover:bg-slate-800 transition"
                >
                  Apply Price
                </button>
                {(minPrice || maxPrice) && (
                  <button
                    type="button"
                    onClick={() => { setMinPrice(''); setMaxPrice(''); setPage(0); }}
                    className="text-xs font-bold text-rose-600 hover:underline"
                  >
                    Clear Price
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CATEGORY PILLS & QUALITY QUICK TOGGLE BADGES */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { label: 'All Produce 🌾', value: '' },
              { label: '🥬 Vegetables', value: 'Vegetables' },
              { label: '🌾 Grains', value: 'Grains' },
              { label: '🍎 Fruits', value: 'Fruits' },
              { label: '🌶️ Spices', value: 'Spices' }
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => { setCategory(tab.value); setPage(0); }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition border ${
                  category === tab.value
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-500/20'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-emerald-50 hover:text-emerald-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => { setOrganicOnly(!organicOnly); setPage(0); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border flex items-center gap-1.5 ${
                organicOnly
                  ? 'bg-emerald-800 text-emerald-100 border-emerald-700'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-emerald-50'
              }`}
            >
              <span>🌱 Organic Certified</span>
            </button>

            <button
              onClick={() => { setGradeAOnly(!gradeAOnly); setPage(0); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border flex items-center gap-1.5 ${
                gradeAOnly
                  ? 'bg-amber-700 text-amber-100 border-amber-600'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-amber-50'
              }`}
            >
              <span>⭐ Grade A Export</span>
            </button>
          </div>
        </div>

        {/* ACTIVE FILTER CHIPS (IF ANY ACTIVE) */}
        {hasActiveFilters && (
          <div className="pt-2 border-t border-slate-200/60 flex flex-wrap items-center gap-2 text-xs">
            <span className="font-extrabold text-slate-400">Active Filters:</span>
            {keyword && (
              <span className="px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-700 font-bold flex items-center gap-1">
                "{keyword}" <button onClick={() => setKeyword('')}><X className="w-3 h-3 text-slate-400 hover:text-slate-600" /></button>
              </span>
            )}
            {category && (
              <span className="px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 font-bold flex items-center gap-1">
                Category: {category} <button onClick={() => setCategory('')}><X className="w-3 h-3 text-emerald-400 hover:text-emerald-700" /></button>
              </span>
            )}
            {location && (
              <span className="px-2.5 py-0.5 rounded-lg bg-teal-50 text-teal-700 font-bold flex items-center gap-1">
                District: {location} <button onClick={() => setLocation('')}><X className="w-3 h-3 text-teal-400 hover:text-teal-700" /></button>
              </span>
            )}
            {organicOnly && (
              <span className="px-2.5 py-0.5 rounded-lg bg-emerald-100 text-emerald-800 font-bold flex items-center gap-1">
                Organic Only <button onClick={() => setOrganicOnly(false)}><X className="w-3 h-3 text-emerald-600" /></button>
              </span>
            )}
            {gradeAOnly && (
              <span className="px-2.5 py-0.5 rounded-lg bg-amber-100 text-amber-800 font-bold flex items-center gap-1">
                Grade A Only <button onClick={() => setGradeAOnly(false)}><X className="w-3 h-3 text-amber-600" /></button>
              </span>
            )}
            <button
              onClick={handleResetFilters}
              className="text-xs font-black text-rose-600 hover:underline ml-2"
            >
              Clear All Filters ✕
            </button>
          </div>
        )}
      </div>

      {/* 3. CROP CATALOG DISPLAY (GRID vs TABLE VIEW) */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400 space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
          <p className="text-sm font-semibold">Loading live agricultural harvest feed...</p>
        </div>
      ) : crops.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-3xl mx-auto">
            🌾
          </div>
          <h3 className="text-lg font-bold text-slate-900 font-display">No Produce Listings Found</h3>
          <p className="text-slate-500 text-xs sm:text-sm max-w-md mx-auto">
            No crops matched your current filter criteria. Try clearing district filters or search keywords.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow transition"
          >
            Reset All Filters
          </button>
        </div>
      ) : viewMode === 'table' ? (
        /* TABLE VIEW (FOR B2B COMMERCIAL TRADERS) */
        <div className="premium-card overflow-hidden bg-white border border-slate-200/90 shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-semibold text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-black uppercase text-slate-400 tracking-wider">
                <tr>
                  <th className="px-6 py-4">Produce Harvest</th>
                  <th className="px-4 py-4">Category</th>
                  <th className="px-4 py-4">Origin District</th>
                  <th className="px-4 py-4">Verified Grower</th>
                  <th className="px-4 py-4">Direct Price</th>
                  <th className="px-4 py-4">Available Stock</th>
                  <th className="px-4 py-4">Batch Passport</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {crops.map((crop) => (
                  <tr key={crop.id} className="hover:bg-emerald-50/40 transition">
                    <td className="px-6 py-4 font-bold text-slate-900 flex items-center gap-3">
                      <img
                        src={crop.imageUrl || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea'}
                        alt={crop.name}
                        className="w-11 h-11 rounded-xl object-cover border border-slate-200 shrink-0"
                      />
                      <div>
                        <Link to={`/crops/${crop.id}`} className="hover:text-emerald-600 font-bold transition block text-sm">
                          {crop.name}
                        </Link>
                        <span className="text-[10px] text-emerald-600 font-bold">
                          {crop.grade || 'Grade A Quality'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 font-medium text-slate-600">{crop.category || 'Produce'}</td>
                    <td className="px-4 py-4 font-medium text-slate-600">📍 {crop.location || 'Sri Lanka'}</td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => setSelectedFarmer({ id: crop.farmerId, name: crop.farmerName })}
                        className="text-emerald-700 font-bold hover:underline flex items-center gap-1"
                      >
                        <span>🧑‍🌾 {crop.farmerName || 'Registered Grower'}</span>
                        <BadgeCheck className="w-3.5 h-3.5 text-emerald-600" />
                      </button>
                    </td>
                    <td className="px-4 py-4 font-black text-emerald-600 text-sm font-display">Rs. {Number(crop.price).toFixed(2)}/kg</td>
                    <td className="px-4 py-4 font-bold text-slate-700">{crop.quantity} kg</td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => setSelectedTraceCrop(crop)}
                        className="text-[10px] font-extrabold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded-lg flex items-center gap-1 transition"
                      >
                        <QrCode className="w-3 h-3 text-emerald-600" /> Batch QR
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedBuyCrop(crop)}
                          disabled={crop.quantity <= 0}
                          className="px-4 py-1.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition disabled:opacity-50"
                        >
                          Buy 🛒
                        </button>
                        <Link
                          to={`/crops/${crop.id}`}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
                        >
                          Details
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* REDESIGNED GRID VIEW WITH UNCLUTTERED CARD AESTHETICS */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {crops.map((crop) => {
            const savingsPct = crop.marketPrice
              ? Math.round(((crop.marketPrice - crop.price) / crop.marketPrice) * 100)
              : 8;

            return (
              <motion.div
                key={crop.id}
                whileHover={{ y: -5 }}
                className="premium-card bg-white border border-slate-200/90 rounded-3xl overflow-hidden flex flex-col justify-between shadow-md hover:shadow-xl transition-all duration-300 group"
              >
                {/* UNCLUTTERED CLEAN IMAGE WITH MAX 2 GLASS BADGES */}
                <div>
                  <div className="h-48 overflow-hidden bg-slate-100 relative">
                    <img
                      src={crop.imageUrl || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea'}
                      alt={crop.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea';
                      }}
                    />

                    {/* TOP-LEFT CATEGORY BADGE */}
                    <div className="absolute top-3 left-3 px-3 py-1 bg-slate-950/80 backdrop-blur-md text-emerald-300 text-[10px] font-black uppercase tracking-wider rounded-full border border-white/20 shadow-sm">
                      {crop.category || 'Produce'}
                    </div>

                    {/* TOP-RIGHT GRADE BADGE */}
                    <div className="absolute top-3 right-3 px-2.5 py-1 bg-emerald-600/95 backdrop-blur-md text-white text-[10px] font-extrabold rounded-full border border-emerald-400/40 shadow-sm">
                      {crop.grade || 'Grade A'}
                    </div>
                  </div>

                  {/* CARD BODY */}
                  <div className="p-5 space-y-3">
                    {/* ORIGIN LOCATION & BATCH CODE */}
                    <div className="flex items-center justify-between text-[11px] font-extrabold text-emerald-700">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600" /> {crop.location || 'Sri Lanka'}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        {crop.batchCode?.slice(0, 14) || 'Origin Pass'}
                      </span>
                    </div>

                    {/* CROP TITLE */}
                    <h3 className="text-base font-extrabold text-slate-900 font-display leading-snug hover:text-emerald-600 transition line-clamp-1">
                      <Link to={`/crops/${crop.id}`}>{crop.name}</Link>
                    </h3>

                    {/* VERIFIED GROWER PROFILE LINK */}
                    <div className="flex items-center justify-between text-xs pt-0.5">
                      <button
                        type="button"
                        onClick={() => setSelectedFarmer({ id: crop.farmerId, name: crop.farmerName })}
                        className="text-slate-600 hover:text-emerald-700 font-bold truncate max-w-[170px] flex items-center gap-1"
                      >
                        <span>🧑‍🌾 {crop.farmerName || 'Verified Grower'}</span>
                        <BadgeCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      </button>
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md shrink-0">
                        📦 {crop.quantity || 350} kg
                      </span>
                    </div>

                    {/* SLEEK 2-LINE FINANCIAL RATE CHIP */}
                    <div className="p-3 bg-slate-50/90 rounded-2xl border border-slate-200/70 space-y-1">
                      <div className="flex items-baseline justify-between">
                        <span className="text-xl font-black text-emerald-600 font-display">
                          Rs. {Number(crop.price).toFixed(2)}
                          <span className="text-xs text-slate-500 font-medium">/kg</span>
                        </span>
                        {savingsPct > 0 && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black border border-emerald-200">
                            -{savingsPct}% vs Retail
                          </span>
                        )}
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase">
                        <span>Direct Farm Gate</span>
                        <span className="text-emerald-700 lowercase font-medium">100% Escrow</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CARD FOOTER WITH PROMINENT ESCROW BUY BUTTON & MICRO ACTIONS */}
                <div className="p-5 pt-0 space-y-2">
                  <button
                    onClick={() => setSelectedBuyCrop(crop)}
                    disabled={crop.quantity <= 0}
                    className="w-full py-2.5 px-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white text-xs font-extrabold rounded-xl shadow-md shadow-emerald-500/20 transition flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Buy with Escrow 🛒</span>
                  </button>

                  <div className="flex items-center justify-between pt-1 text-xs">
                    <button
                      type="button"
                      onClick={() => setSelectedTraceCrop(crop)}
                      className="text-[11px] font-extrabold text-slate-600 hover:text-emerald-700 flex items-center gap-1 transition"
                    >
                      <QrCode className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Batch Passport</span>
                    </button>

                    <Link
                      to={`/crops/${crop.id}`}
                      className="text-[11px] font-extrabold text-emerald-700 hover:underline flex items-center gap-0.5"
                    >
                      <span>Full Details</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>

                    {isFarmer && (
                      <button
                        onClick={() => handleDelete(crop.id)}
                        className="p-1 text-rose-500 hover:bg-rose-50 rounded-lg transition"
                        title="Delete Listing"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* 4. B2B BULK TENDER & FORWARD CONTRACT CALLOUT BANNER */}
      <div className="p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-slate-950 to-emerald-950 text-white rounded-3xl border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1.5 text-center md:text-left">
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase tracking-wider border border-emerald-500/30">
            Institutional Procurement
          </span>
          <h3 className="text-xl sm:text-2xl font-extrabold font-display text-white">
            Need Bulk Commercial Volumes (5,000+ kg)? 🏬
          </h3>
          <p className="text-slate-300 text-xs sm:text-sm max-w-xl font-medium">
            Post an official B2B tender request or lock in guaranteed forward price agreements directly with regional grower cooperatives.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 shrink-0">
          <Link
            to="/contracts"
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow transition"
          >
            Contract Farming →
          </Link>
          <Link
            to="/negotiation"
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-extrabold text-xs rounded-xl transition"
          >
            Trade Negotiation
          </Link>
        </div>
      </div>

      {/* 5. PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 pt-4">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-bold text-xs rounded-xl disabled:opacity-50 shadow-sm hover:bg-slate-50 transition"
          >
            Previous
          </button>
          <span className="px-4 py-2 bg-emerald-50 text-emerald-700 font-bold text-xs rounded-xl border border-emerald-100">
            Page {page + 1} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-bold text-xs rounded-xl disabled:opacity-50 shadow-sm hover:bg-slate-50 transition"
          >
            Next
          </button>
        </div>
      )}

      {/* 6. MODALS */}
      {selectedFarmer && (
        <FarmerProfileModal
          farmerId={selectedFarmer.id}
          farmerName={selectedFarmer.name}
          onClose={() => setSelectedFarmer(null)}
        />
      )}

      {selectedTraceCrop && (
        <TraceabilityModal
          cropId={selectedTraceCrop.id}
          batchCode={selectedTraceCrop.batchCode}
          onClose={() => setSelectedTraceCrop(null)}
        />
      )}

      {selectedBuyCrop && (
        <BuyCropModal
          crop={selectedBuyCrop}
          onClose={() => setSelectedBuyCrop(null)}
          onOrderPlaced={fetchCrops}
        />
      )}

      {showPostModal && (
        <PostHarvestModal
          onClose={() => setShowPostModal(false)}
          onCropCreated={(newCrop) => {
            setCrops((prev) => [newCrop, ...prev]);
            fetchCrops();
          }}
        />
      )}
    </div>
  );
};
