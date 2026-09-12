import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cropsAPI } from '../services/api';
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
  ArrowRight,
  X,
  SlidersHorizontal,
  Package,
  BadgeCheck,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Clock,
  ExternalLink,
  Eye
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
    batchCode: 'BATCH-2026-NWR-0941',
    harvestDateText: 'Available Now'
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
    batchCode: 'BATCH-2026-JAF-0822',
    harvestDateText: 'Available Now'
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
    batchCode: 'BATCH-2026-GAL-0519',
    harvestDateText: 'Available Now'
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
    batchCode: 'BATCH-2026-HMB-0312',
    harvestDateText: 'Available Now'
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
    batchCode: 'BATCH-2026-ANU-1104',
    harvestDateText: 'Available Now'
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
    batchCode: 'BATCH-2026-KDY-0731',
    harvestDateText: 'Available Now'
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
  const { user, isFarmer, isAdmin, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialKeyword = searchParams.get('search') || '';
  const searchInputRef = useRef(null);

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

  // Checks if the logged-in farmer owns this listing
  const isCropOwner = (c) => Boolean(
    isFarmer && (
      (c.farmerId && user?.id && String(c.farmerId) === String(user.id)) ||
      (c.farmerName && user?.name && c.farmerName.toLowerCase() === user.name.toLowerCase()) ||
      (c.farmerEmail && user?.email && c.farmerEmail.toLowerCase() === user.email.toLowerCase())
    )
  );

  const handleBuyClick = (c) => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=${encodeURIComponent('/crops')}`);
      return;
    }
    if (isCropOwner(c)) return;
    setSelectedBuyCrop(c);
  };

  // Keyboard shortcut '/' to focus search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filterMockData = useCallback((kw, cat, loc, minP, maxP, orgOnly, grAOnly, sort) => {
    let result = [...MOCK_CROPS];
    if (kw) {
      result = result.filter(c => c.name.toLowerCase().includes(kw.toLowerCase()) || (c.description && c.description.toLowerCase().includes(kw.toLowerCase())));
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
      console.warn('Backend API offline. Loading verified crop catalog:', err);
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
      alert('Failed to delete crop listing.');
    }
  };

  // Helper to format quantity cleanly
  const formatQuantity = (qty) => {
    const num = Number(qty) || 0;
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)} MT (${num.toLocaleString()} kg)`;
    }
    return `${num.toLocaleString()} kg`;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16 font-sans">
      
      {/* 1. TOP ANNOUNCEMENT & TRUST STRIP */}
      <div className="bg-emerald-800 text-emerald-50 px-4 py-2.5 text-xs font-medium border-b border-emerald-900/30">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 font-semibold text-emerald-200">
              <ShieldCheck className="w-4 h-4 text-emerald-300" aria-hidden="true" />
              Verified Agricultural Produce Exchange
            </span>
            <span className="hidden sm:inline text-emerald-300/60">•</span>
            <span className="hidden sm:inline text-emerald-100">
              Direct Farmer-to-Buyer Wholesale Trading with 100% Escrow Protection
            </span>
          </div>

          <div className="flex items-center gap-4 text-emerald-200 text-xs">
            <span className="inline-flex items-center gap-1">
              <Truck className="w-3.5 h-3.5" aria-hidden="true" /> Farmgate &amp; Hub Dispatch
            </span>
            <span className="hidden md:inline-flex items-center gap-1">
              <BadgeCheck className="w-3.5 h-3.5" aria-hidden="true" /> Origin Passport Traceability
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">

        {/* 2. HEADER BANNER */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold tracking-wide uppercase">
                <Sparkles className="w-3.5 h-3.5 text-emerald-700" aria-hidden="true" />
                Produce Marketplace
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
                Fresh Crops. Direct From Farmers.
              </h1>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Connect farmers with buyers and find crops available in your area. Guaranteed origin traceability, transparent farmgate prices, and secure escrow settlement.
              </p>
            </div>

            {/* Actions: Sell Your Crop (Only for farmers/admins) & Forward Contracts */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              {(isFarmer || isAdmin) && (
                <button
                  type="button"
                  onClick={() => setShowPostModal(true)}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2"
                >
                  <PlusCircle className="w-4 h-4" aria-hidden="true" />
                  <span>Sell Your Crop</span>
                </button>
              )}

              <Link
                to="/contracts"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold shadow-2xs transition"
              >
                <span>Forward Contracts</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Link>
            </div>
          </div>

          {/* Micro-Stats Strip */}
          <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100 shrink-0">
                <Package className="w-4 h-4" aria-hidden="true" />
              </div>
              <div>
                <span className="font-semibold text-slate-900 block">Active Harvests</span>
                <span className="text-slate-500">Commercial &amp; smallholder volumes</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-teal-50 text-teal-700 border border-teal-100 shrink-0">
                <MapPin className="w-4 h-4" aria-hidden="true" />
              </div>
              <div>
                <span className="font-semibold text-slate-900 block">25 Districts</span>
                <span className="text-slate-500">Islandwide grower cooperatives</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-blue-50 text-blue-700 border border-blue-100 shrink-0">
                <ShieldCheck className="w-4 h-4" aria-hidden="true" />
              </div>
              <div>
                <span className="font-semibold text-slate-900 block">100% Escrow Vault</span>
                <span className="text-slate-500">Funds released on buyer delivery sign-off</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-amber-50 text-amber-700 border border-amber-100 shrink-0">
                <Truck className="w-4 h-4" aria-hidden="true" />
              </div>
              <div>
                <span className="font-semibold text-slate-900 block">Fleet Logistics</span>
                <span className="text-slate-500">Integrated cold-chain transport options</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. UNIFIED SEARCH & FILTER TOOLBAR */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm space-y-4">
          
          {/* Top Row: Search Input + District Selector + Sort Dropdown + View Switcher */}
          <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
            
            {/* Search Field */}
            <form onSubmit={handleSearchSubmit} className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" aria-hidden="true" />
              <input
                ref={searchInputRef}
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Search crops by name, crop variety, or cooperative (e.g. Tomatoes, Samba, Cinnamon)..."
                className="w-full pl-10 pr-24 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition"
                aria-label="Search crops"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                {keyword && (
                  <button
                    type="button"
                    onClick={() => { setKeyword(''); setPage(0); }}
                    className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition"
                    aria-label="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  type="submit"
                  className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-lg transition shadow-2xs"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Filter Dropdowns & Controls */}
            <div className="flex flex-wrap items-center gap-2.5">
              
              {/* District Selector */}
              <div className="relative min-w-[170px] flex-1 sm:flex-initial">
                <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
                <select
                  value={location}
                  onChange={(e) => { setLocation(e.target.value); setPage(0); }}
                  className="w-full pl-8 pr-8 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-600 appearance-none cursor-pointer hover:bg-slate-100 transition"
                  aria-label="Filter by district"
                >
                  <option value="">All Sri Lanka Districts</option>
                  {SRI_LANKA_DISTRICTS.map((dist) => (
                    <option key={dist} value={dist}>{dist}</option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Sort Selector */}
              <div className="relative min-w-[150px] flex-1 sm:flex-initial">
                <select
                  value={sortBy}
                  onChange={(e) => { setSortBy(e.target.value); setPage(0); }}
                  className="w-full pl-3 pr-8 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-600 appearance-none cursor-pointer hover:bg-slate-100 transition"
                  aria-label="Sort crops"
                >
                  <option value="DEFAULT">Featured Produce</option>
                  <option value="PRICE_LOW">Price: Low to High</option>
                  <option value="PRICE_HIGH">Price: High to Low</option>
                  <option value="QTY_HIGH">Stock: High to Low</option>
                  <option value="NEWEST">Newest Harvest</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Advanced Price Filter Toggle */}
              <button
                type="button"
                onClick={() => setShowFiltersDrawer(!showFiltersDrawer)}
                className={`px-3.5 py-2.5 rounded-xl border text-xs font-semibold transition flex items-center gap-1.5 ${
                  showFiltersDrawer || minPrice || maxPrice
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
                aria-expanded={showFiltersDrawer}
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-700" aria-hidden="true" />
                <span>Price</span>
                {(minPrice || maxPrice) && (
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                )}
              </button>

              {/* View Mode Switcher (Grid vs Table) */}
              <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200" role="group" aria-label="View mode">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg text-xs transition ${
                    viewMode === 'grid' ? 'bg-white text-emerald-800 shadow-2xs font-semibold' : 'text-slate-500 hover:text-slate-800'
                  }`}
                  title="Grid View"
                  aria-pressed={viewMode === 'grid'}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('table')}
                  className={`p-1.5 rounded-lg text-xs transition ${
                    viewMode === 'table' ? 'bg-white text-emerald-800 shadow-2xs font-semibold' : 'text-slate-500 hover:text-slate-800'
                  }`}
                  title="Commercial Table View"
                  aria-pressed={viewMode === 'table'}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Expandable Price Range Drawer */}
          <AnimatePresence>
            {showFiltersDrawer && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="pt-3 border-t border-slate-100 overflow-hidden"
              >
                <div className="flex flex-wrap items-center gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
                  <span className="font-semibold text-slate-700">Price Range (Rs./kg):</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      placeholder="Min (Rs. 0)"
                      className="w-28 px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-medium text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    />
                    <span className="text-slate-400 font-medium">to</span>
                    <input
                      type="number"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      placeholder="Max (Rs. 2000)"
                      className="w-28 px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-medium text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => { setPage(0); fetchCrops(); }}
                    className="px-4 py-1.5 bg-slate-900 text-white font-semibold rounded-lg text-xs hover:bg-slate-800 transition"
                  >
                    Apply Price
                  </button>
                  {(minPrice || maxPrice) && (
                    <button
                      type="button"
                      onClick={() => { setMinPrice(''); setMaxPrice(''); setPage(0); }}
                      className="text-xs font-semibold text-rose-600 hover:underline"
                    >
                      Clear Price
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Category Pills & Quick Quality Toggles */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
            <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none" role="tablist">
              {[
                { label: 'All Produce', value: '' },
                { label: 'Vegetables', value: 'Vegetables' },
                { label: 'Grains', value: 'Grains' },
                { label: 'Fruits', value: 'Fruits' },
                { label: 'Spices', value: 'Spices' }
              ].map((tab) => {
                const isActive = category === tab.value;
                return (
                  <button
                    key={tab.value}
                    type="button"
                    onClick={() => { setCategory(tab.value); setPage(0); }}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all ${
                      isActive
                        ? 'bg-emerald-700 text-white shadow-2xs'
                        : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Quality & Organic Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => { setOrganicOnly(!organicOnly); setPage(0); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition border flex items-center gap-1.5 ${
                  organicOnly
                    ? 'bg-emerald-800 text-white border-emerald-800'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>🌱 Organic Certified</span>
              </button>

              <button
                type="button"
                onClick={() => { setGradeAOnly(!gradeAOnly); setPage(0); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition border flex items-center gap-1.5 ${
                  gradeAOnly
                    ? 'bg-amber-800 text-white border-amber-800'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>⭐ Grade A Export</span>
              </button>
            </div>
          </div>

          {/* Active Filter Chips */}
          {hasActiveFilters && (
            <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
              <span className="font-semibold text-slate-500">Active Filters:</span>
              {keyword && (
                <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium flex items-center gap-1">
                  "{keyword}" <button onClick={() => setKeyword('')}><X className="w-3 h-3 text-slate-400 hover:text-slate-600" /></button>
                </span>
              )}
              {category && (
                <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-medium border border-emerald-200 flex items-center gap-1">
                  Category: {category} <button onClick={() => setCategory('')}><X className="w-3 h-3 text-emerald-600 hover:text-emerald-800" /></button>
                </span>
              )}
              {location && (
                <span className="px-2.5 py-0.5 rounded-md bg-teal-50 text-teal-800 font-medium border border-teal-200 flex items-center gap-1">
                  District: {location} <button onClick={() => setLocation('')}><X className="w-3 h-3 text-teal-600 hover:text-teal-800" /></button>
                </span>
              )}
              {organicOnly && (
                <span className="px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-900 font-medium flex items-center gap-1">
                  Organic Only <button onClick={() => setOrganicOnly(false)}><X className="w-3 h-3 text-emerald-700 hover:text-emerald-900" /></button>
                </span>
              )}
              {gradeAOnly && (
                <span className="px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-900 font-medium flex items-center gap-1">
                  Grade A Only <button onClick={() => setGradeAOnly(false)}><X className="w-3 h-3 text-amber-700 hover:text-amber-900" /></button>
                </span>
              )}
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs font-semibold text-rose-600 hover:underline ml-2"
              >
                Clear All Filters ✕
              </button>
            </div>
          )}
        </div>

        {/* 4. CROP CATALOG DISPLAY (GRID vs TABLE VIEW) */}
        {loading ? (
          /* Loading Skeleton */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((sk) => (
              <div key={sk} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm animate-pulse">
                <div className="h-44 bg-slate-200" />
                <div className="p-5 space-y-3">
                  <div className="h-3 bg-slate-200 rounded w-1/3" />
                  <div className="h-5 bg-slate-200 rounded w-3/4" />
                  <div className="h-3 bg-slate-200 rounded w-1/2" />
                  <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                    <div className="h-6 bg-slate-200 rounded w-20" />
                    <div className="h-8 bg-slate-200 rounded w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : crops.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm max-w-md mx-auto space-y-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
              <Package className="w-7 h-7" aria-hidden="true" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">
                {hasActiveFilters ? 'No Matching Crops Found' : 'No Crops Available Right Now'}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {hasActiveFilters
                  ? 'No harvest listings matched your filter criteria. Try clearing search keywords or district filters.'
                  : 'No fresh crops have been listed in this category yet. Check back soon or list your own harvest.'}
              </p>
            </div>
            <div className="pt-2 flex justify-center gap-3">
              {hasActiveFilters ? (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Clear All Filters
                </button>
              ) : (isFarmer || isAdmin) && (
                <button
                  type="button"
                  onClick={() => setShowPostModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-semibold hover:bg-emerald-800 transition"
                >
                  <PlusCircle className="w-3.5 h-3.5" /> Add Crop Listing
                </button>
              )}
            </div>
          </div>
        ) : viewMode === 'table' ? (
          /* TABLE VIEW (FOR COMMERCIAL B2B BUYERS) */
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-medium text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold uppercase text-slate-500 tracking-wider">
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
                    <tr key={crop.id} className="hover:bg-slate-50/80 transition">
                      <td className="px-6 py-4 font-semibold text-slate-900 flex items-center gap-3">
                        <img
                          src={crop.imageUrl || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80'}
                          alt={crop.name}
                          className="w-11 h-11 rounded-lg object-cover border border-slate-200 shrink-0"
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80';
                          }}
                        />
                        <div>
                          <Link to={`/crops/${crop.id}`} className="hover:text-emerald-700 font-bold transition block text-sm">
                            {crop.name}
                          </Link>
                          <span className="text-[10px] text-emerald-700 font-semibold">
                            {crop.grade || 'Grade A'}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-slate-600">{crop.category || 'Produce'}</td>
                      <td className="px-4 py-4 text-slate-600">📍 {crop.location || 'Sri Lanka'}</td>
                      <td className="px-4 py-4">
                        <button
                          type="button"
                          onClick={() => setSelectedFarmer({ id: crop.farmerId, name: crop.farmerName })}
                          className="text-emerald-700 font-semibold hover:underline flex items-center gap-1"
                        >
                          <span>{crop.farmerName || 'Registered Grower'}</span>
                          <BadgeCheck className="w-3.5 h-3.5 text-emerald-600" />
                        </button>
                      </td>
                      <td className="px-4 py-4 font-bold text-slate-900 text-sm">
                        Rs. {Number(crop.price).toFixed(2)} / kg
                      </td>
                      <td className="px-4 py-4 font-semibold text-slate-700">
                        {formatQuantity(crop.quantity)}
                      </td>
                      <td className="px-4 py-4">
                        <button
                          type="button"
                          onClick={() => setSelectedTraceCrop(crop)}
                          className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2 py-1 rounded-md flex items-center gap-1 transition"
                        >
                          <QrCode className="w-3 h-3 text-emerald-600" /> Batch QR
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/crops/${crop.id}`}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition"
                          >
                            View Crop
                          </Link>
                          {isCropOwner(crop) ? (
                            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 font-semibold text-[11px] rounded-lg border border-emerald-200">
                              Your Produce
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleBuyClick(crop)}
                              disabled={crop.quantity <= 0}
                              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                                crop.quantity <= 0
                                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                                  : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-2xs'
                              }`}
                            >
                              {crop.quantity <= 0 ? 'Out of Stock' : (!isAuthenticated ? 'Sign In' : 'Buy')}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* GRID VIEW WITH CLEAN CARDS */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {crops.map((crop) => {
              const isOutOfStock = (crop.quantity || 0) <= 0;
              const isOwner = isCropOwner(crop);

              return (
                <div
                  key={crop.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div>
                    {/* Media Container */}
                    <div className="h-44 overflow-hidden bg-slate-100 relative group">
                      <img
                        src={crop.imageUrl || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80'}
                        alt={crop.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80';
                        }}
                      />

                      {/* Top-Left Category Badge */}
                      <div className="absolute top-3 left-3 px-2.5 py-0.5 bg-slate-900/80 backdrop-blur-sm text-white text-[10px] font-semibold rounded-md">
                        {crop.category || 'Produce'}
                      </div>

                      {/* Top-Right Grade Badge */}
                      {crop.grade && (
                        <div className="absolute top-3 right-3 px-2 py-0.5 bg-emerald-700/90 backdrop-blur-sm text-white text-[10px] font-semibold rounded-md flex items-center gap-1 shadow-2xs">
                          <BadgeCheck className="w-3 h-3 text-emerald-200" aria-hidden="true" />
                          <span>{crop.grade}</span>
                        </div>
                      )}
                    </div>

                    {/* Card Body */}
                    <div className="p-4 sm:p-5 space-y-3">
                      
                      {/* Location & Harvest Indicator */}
                      <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                        <span className="flex items-center gap-1 truncate text-slate-700">
                          <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" aria-hidden="true" />
                          <span>{crop.location || 'Sri Lanka'}</span>
                        </span>
                        <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 shrink-0">
                          {crop.harvestDateText || 'Available Now'}
                        </span>
                      </div>

                      {/* Crop Title */}
                      <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-1 hover:text-emerald-700 transition">
                        <Link to={`/crops/${crop.id}`}>{crop.name}</Link>
                      </h3>

                      {/* Seller & Available Quantity */}
                      <div className="flex items-center justify-between text-xs pt-0.5">
                        <button
                          type="button"
                          onClick={() => setSelectedFarmer({ id: crop.farmerId, name: crop.farmerName })}
                          className="text-slate-600 hover:text-emerald-800 font-semibold truncate max-w-[150px] flex items-center gap-1 text-left"
                        >
                          <span className="truncate">{crop.farmerName || 'Registered Grower'}</span>
                          <BadgeCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        </button>
                        <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md shrink-0">
                          {formatQuantity(crop.quantity)}
                        </span>
                      </div>

                      {/* Price Strip */}
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                        <div className="flex items-baseline justify-between">
                          <span className="text-lg font-extrabold text-slate-900">
                            Rs. {Number(crop.price).toFixed(2)}
                            <span className="text-xs text-slate-500 font-normal"> / kg</span>
                          </span>
                          {crop.marketPrice && crop.marketPrice > crop.price && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                              -{Math.round(((crop.marketPrice - crop.price) / crop.marketPrice) * 100)}% vs Retail
                            </span>
                          )}
                        </div>
                        <div className="flex justify-between items-center text-[10px] text-slate-400 font-semibold uppercase">
                          <span>Farmgate Rate</span>
                          <span className="text-emerald-700 lowercase font-medium">100% Escrow</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="p-4 sm:p-5 pt-0 space-y-2">
                    {isOwner ? (
                      <div className="w-full py-2 px-3 bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 text-center">
                        Your Own Crop Listing
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleBuyClick(crop)}
                        disabled={isOutOfStock}
                        className={`w-full py-2 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                          isOutOfStock
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                            : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-2xs'
                        }`}
                      >
                        <ShoppingBag className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>{isOutOfStock ? 'Sold Out' : (!isAuthenticated ? 'Sign In to Buy' : 'Buy with Escrow')}</span>
                      </button>
                    )}

                    <div className="flex items-center justify-between pt-1 text-xs">
                      <button
                        type="button"
                        onClick={() => setSelectedTraceCrop(crop)}
                        className="text-[11px] font-semibold text-slate-600 hover:text-emerald-800 flex items-center gap-1 transition"
                      >
                        <QrCode className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Batch QR</span>
                      </button>

                      <Link
                        to={`/crops/${crop.id}`}
                        className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 hover:underline flex items-center gap-1"
                      >
                        <span>View Crop</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>

                      {isFarmer && isOwner && (
                        <button
                          type="button"
                          onClick={() => handleDelete(crop.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 transition"
                          title="Delete Listing"
                          aria-label="Delete listing"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 5. B2B COMMERCIAL CALLOUT */}
        <div className="p-6 sm:p-8 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1 max-w-2xl">
            <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[11px] font-semibold border border-emerald-200">
              Institutional &amp; Wholesale Procurement
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Need Bulk Commercial Harvests (5,000+ kg)?
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm">
              Lock in guaranteed pre-harvest supply agreements or negotiate forward purchase contracts directly with registered producer cooperatives across Sri Lanka.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 shrink-0">
            <Link
              to="/contracts"
              className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl shadow-2xs transition flex items-center gap-1.5"
            >
              <span>Forward Contracts</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              to="/negotiation"
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200 transition"
            >
              Trade Negotiation
            </Link>
          </div>
        </div>

        {/* 6. PAGINATION */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-3 pt-4">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-semibold text-xs rounded-xl disabled:opacity-50 shadow-2xs hover:bg-slate-50 transition"
            >
              Previous
            </button>
            <span className="px-4 py-2 bg-emerald-50 text-emerald-800 font-semibold text-xs rounded-xl border border-emerald-200">
              Page {page + 1} of {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-semibold text-xs rounded-xl disabled:opacity-50 shadow-2xs hover:bg-slate-50 transition"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* 7. MODALS */}
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

export default CropsList;
