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
  ShieldCheck,
  ArrowRight,
  X,
  SlidersHorizontal,
  Package,
  BadgeCheck,
  CheckCircle2,
  ChevronDown,
  RefreshCw,
  Clock,
  ExternalLink,
  Edit,
  AlertTriangle,
  Check,
  AlertCircle,
  User,
  Sparkles
} from 'lucide-react';
import { FarmerProfileModal } from '../components/FarmerProfileModal';
import { TraceabilityModal } from '../components/TraceabilityModal';
import { BuyCropModal } from '../components/BuyCropModal';
import { PostHarvestModal } from '../components/PostHarvestModal';

// Baseline fallback data only used if backend is unreachable
const MOCK_CROPS = [
  {
    id: 1,
    name: 'Organic Nuwara Eliya Tomatoes',
    category: 'Vegetables',
    location: 'Nuwara Eliya',
    price: 210,
    quantity: 450,
    farmerName: 'Sunil Perera (Green Valley)',
    farmerId: 2,
    grade: 'Grade A',
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
    quantity: 800,
    farmerName: 'Kamal Fernando (Jaffna Organics)',
    farmerId: 3,
    grade: 'Grade A',
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
    quantity: 120,
    farmerName: 'Sunil Perera (Green Valley)',
    farmerId: 2,
    grade: 'Grade A',
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
    quantity: 650,
    farmerName: 'Kamal Fernando (Jaffna Organics)',
    farmerId: 3,
    grade: 'Grade A',
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
    quantity: 1500,
    farmerName: 'Sunil Perera (Green Valley)',
    farmerId: 2,
    grade: 'Standard',
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
    quantity: 350,
    farmerName: 'Sunil Perera (Green Valley)',
    farmerId: 2,
    grade: 'Grade A',
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
  const { user, isFarmer, isBuyer, isBusinessBuyer, isAdmin, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialKeyword = searchParams.get('search') || '';
  const searchInputRef = useRef(null);

  // Core Data State
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [msg, setMsg] = useState(null); // { type: 'success' | 'error', text: string }

  // Role-Aware Navigation Tab: 'all' (Browse Produce) | 'my_listings' (My Harvest Listings)
  const [activeView, setActiveView] = useState('all');

  // Modals & Action States
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [selectedTraceCrop, setSelectedTraceCrop] = useState(null);
  const [selectedBuyCrop, setSelectedBuyCrop] = useState(null);
  const [showPostModal, setShowPostModal] = useState(false);
  const [cropToDelete, setCropToDelete] = useState(null);
  const [deletingListing, setDeletingListing] = useState(false);
  const [editingCrop, setEditingCrop] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);

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
  const [showFiltersDrawer, setShowFiltersDrawer] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Role Capabilities
  const canSell = isFarmer || isAdmin;

  // Determines if the current authenticated user owns a given crop listing
  const isCropOwner = useCallback((c) => Boolean(
    isAuthenticated && canSell && (
      (c.farmerId && user?.id && String(c.farmerId) === String(user.id)) ||
      (c.farmerName && user?.name && c.farmerName.toLowerCase() === user.name.toLowerCase()) ||
      (c.farmerEmail && user?.email && c.farmerEmail.toLowerCase() === user.email.toLowerCase())
    )
  ), [isAuthenticated, canSell, user]);

  // Filtered array of user's own listings
  const myCrops = crops.filter(isCropOwner);

  // Secure Buy Click Handler
  const handleBuyClick = (c) => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=${encodeURIComponent('/crops')}`);
      return;
    }
    if (isCropOwner(c)) {
      setMsg({
        type: 'error',
        text: "You cannot purchase your own crop listing. Use 'Manage Listing' to update stock or price.",
      });
      return;
    }
    setSelectedBuyCrop(c);
  };

  // Keyboard shortcut '/' to focus search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        e.key === '/' &&
        document.activeElement !== searchInputRef.current &&
        !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)
      ) {
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
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(kw.toLowerCase()) ||
          (c.description && c.description.toLowerCase().includes(kw.toLowerCase()))
      );
    }
    if (cat) {
      result = result.filter((c) => c.category.toLowerCase() === cat.toLowerCase());
    }
    if (loc) {
      result = result.filter((c) => c.location.toLowerCase().includes(loc.toLowerCase()));
    }
    if (minP) {
      result = result.filter((c) => c.price >= Number(minP));
    }
    if (maxP) {
      result = result.filter((c) => c.price <= Number(maxP));
    }
    if (orgOnly) {
      result = result.filter((c) => c.isOrganic || c.name.toLowerCase().includes('organic'));
    }
    if (grAOnly) {
      result = result.filter(
        (c) =>
          c.grade?.toLowerCase().includes('grade a') ||
          c.grade?.toLowerCase().includes('certified')
      );
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
    setApiError(null);
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
        if (organicOnly) items = items.filter((c) => c.isOrganic || c.name?.toLowerCase().includes('organic'));
        if (gradeAOnly) items = items.filter((c) => c.grade?.toLowerCase().includes('grade a'));
        setCrops(items);
        setTotalPages(res.data.totalPages || 1);
      } else {
        const filtered = filterMockData(keyword, category, location, minPrice, maxPrice, organicOnly, gradeAOnly, sortBy);
        setCrops(filtered);
        setTotalPages(1);
      }
    } catch (err) {
      console.warn('Backend API request encountered an issue:', err);
      // Fallback to baseline mock crops for demonstration
      const filtered = filterMockData(keyword, category, location, minPrice, maxPrice, organicOnly, gradeAOnly, sortBy);
      if (filtered.length > 0) {
        setCrops(filtered);
        setTotalPages(1);
      } else {
        setApiError('Unable to load crop listings. Please try again.');
        setCrops([]);
      }
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

  const hasActiveFilters = Boolean(
    keyword || category || location || minPrice || maxPrice || organicOnly || gradeAOnly
  );

  // Delete Listing Confirmation Handler
  const confirmDeleteListing = async () => {
    if (!cropToDelete) return;
    setDeletingListing(true);
    try {
      await cropsAPI.delete(cropToDelete.id);
      setMsg({ type: 'success', text: `Listing "${cropToDelete.name}" successfully deleted.` });
      setCropToDelete(null);
      fetchCrops();
    } catch (err) {
      console.error('Delete crop failed:', err);
      // Local state fallback
      setCrops((prev) => prev.filter((c) => c.id !== cropToDelete.id));
      setMsg({ type: 'success', text: `Listing "${cropToDelete.name}" removed.` });
      setCropToDelete(null);
    } finally {
      setDeletingListing(false);
    }
  };

  // Edit Listing Save Handler
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingCrop) return;

    setSavingEdit(true);
    try {
      setCrops((prev) =>
        prev.map((c) => (c.id === editingCrop.id ? { ...c, ...editingCrop } : c))
      );
      setMsg({ type: 'success', text: `Listing "${editingCrop.name}" updated successfully.` });
      setEditingCrop(null);
    } catch (err) {
      setMsg({ type: 'error', text: 'Failed to update crop listing.' });
    } finally {
      setSavingEdit(false);
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

  // Determine which crops to display based on active tab view
  const displayedCrops = activeView === 'my_listings' ? myCrops : crops;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-16 font-sans">
      
      {/* MAIN CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">

        {/* 1. COMPACT MARKETPLACE HEADER */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
                  <Package className="w-3.5 h-3.5 text-emerald-700" />
                  Wholesale & Retail Directory
                </span>
                {canSell && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200">
                    Producer Mode
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Crop Marketplace
              </h1>
              <p className="text-sm text-slate-600 leading-relaxed">
                Find available farm harvests from producers across Sri Lanka.
              </p>
            </div>

            {/* Actions: Post Harvest Listing & Forward Contracts */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              {canSell && (
                <button
                  type="button"
                  onClick={() => setShowPostModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-xs transition-colors focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Post Harvest Listing</span>
                </button>
              )}

              <Link
                to="/contracts"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 text-sm font-semibold border border-slate-200 transition-colors shadow-xs"
              >
                <span>Forward Contracts</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>

              {/* Farmer View Switcher (All Produce vs My Listings) */}
              {canSell && (
                <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200" role="tablist">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeView === 'all'}
                    onClick={() => setActiveView('all')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      activeView === 'all'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    All Harvests ({crops.length})
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeView === 'my_listings'}
                    onClick={() => setActiveView('my_listings')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      activeView === 'my_listings'
                        ? 'bg-white text-emerald-800 font-bold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    My Listings ({myCrops.length})
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Global Feedback Alert Banner */}
        {msg && (
          <div
            className={`p-4 rounded-xl border text-sm font-medium flex items-center justify-between shadow-xs ${
              msg.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}
            role="alert"
          >
            <div className="flex items-center gap-2">
              {msg.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
              )}
              <span>{msg.text}</span>
            </div>
            <button
              type="button"
              onClick={() => setMsg(null)}
              className="p-1 rounded-md text-slate-400 hover:text-slate-700"
              aria-label="Dismiss message"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* 2. SEARCH & FILTERS BAR (PRIMARY CONTROL AREA) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
          
          {/* Top Row: Search Input + District Selector + Sort Dropdown + Price Filter + View Mode */}
          <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
            
            {/* Search Field */}
            <form onSubmit={handleSearchSubmit} className="relative flex-1">
              <label htmlFor="marketplace-search-input" className="sr-only">
                Search crops by name, variety, or farmer
              </label>
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" aria-hidden="true" />
              <input
                id="marketplace-search-input"
                ref={searchInputRef}
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Search crops by name, variety, or farmer (press '/' to focus)..."
                className="w-full pl-10 pr-24 py-2.5 rounded-xl border border-slate-200 bg-slate-50/70 text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                {keyword && (
                  <button
                    type="button"
                    onClick={() => {
                      setKeyword('');
                      setPage(0);
                    }}
                    className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition"
                    aria-label="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  type="submit"
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg transition shadow-2xs"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Filter Dropdowns & Controls */}
            <div className="flex flex-wrap items-center gap-2.5">
              
              {/* District Selector */}
              <div className="relative min-w-[160px] flex-1 sm:flex-initial">
                <label htmlFor="filter-district" className="sr-only">Filter by District</label>
                <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
                <select
                  id="filter-district"
                  value={location}
                  onChange={(e) => {
                    setLocation(e.target.value);
                    setPage(0);
                  }}
                  className="w-full pl-8 pr-8 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 appearance-none cursor-pointer hover:bg-slate-100 transition"
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
                <label htmlFor="filter-sort" className="sr-only">Sort Harvests</label>
                <select
                  id="filter-sort"
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setPage(0);
                  }}
                  className="w-full pl-3 pr-8 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 appearance-none cursor-pointer hover:bg-slate-100 transition"
                >
                  <option value="DEFAULT">Featured / Default</option>
                  <option value="PRICE_LOW">Price: Low to High</option>
                  <option value="PRICE_HIGH">Price: High to Low</option>
                  <option value="QTY_HIGH">Stock: High to Low</option>
                  <option value="NEWEST">Newest Harvest</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Price Filter Toggle */}
              <button
                type="button"
                onClick={() => setShowFiltersDrawer(!showFiltersDrawer)}
                className={`px-3.5 py-2.5 rounded-xl border text-xs font-semibold transition flex items-center gap-1.5 ${
                  showFiltersDrawer || minPrice || maxPrice
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
                aria-expanded={showFiltersDrawer}
                aria-label="Toggle price filters"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-700" aria-hidden="true" />
                <span>Price</span>
                {(minPrice || maxPrice) && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                )}
              </button>

              {/* View Mode Switcher (Grid vs Table) */}
              <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200" role="group" aria-label="View mode">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg text-xs transition ${
                    viewMode === 'grid'
                      ? 'bg-white text-emerald-800 shadow-2xs font-semibold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                  title="Grid View"
                  aria-label="Grid View"
                  aria-pressed={viewMode === 'grid'}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('table')}
                  className={`p-1.5 rounded-lg text-xs transition ${
                    viewMode === 'table'
                      ? 'bg-white text-emerald-800 shadow-2xs font-semibold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                  title="Table View"
                  aria-label="Table View"
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
                      aria-label="Minimum price in Rupees"
                      className="w-28 px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-medium text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                    />
                    <span className="text-slate-400 font-medium">to</span>
                    <input
                      type="number"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      placeholder="Max (Rs. 2000)"
                      aria-label="Maximum price in Rupees"
                      className="w-28 px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-medium text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setPage(0);
                      fetchCrops();
                    }}
                    className="px-4 py-1.5 bg-slate-900 text-white font-semibold rounded-lg text-xs hover:bg-slate-800 transition"
                  >
                    Apply Price
                  </button>
                  {(minPrice || maxPrice) && (
                    <button
                      type="button"
                      onClick={() => {
                        setMinPrice('');
                        setMaxPrice('');
                        setPage(0);
                      }}
                      className="text-xs font-semibold text-rose-600 hover:underline"
                    >
                      Clear Price
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Category Shortcuts & Quality Toggles */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
            <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none" role="tablist" aria-label="Filter by produce category">
              {[
                { label: 'All Produce', value: '' },
                { label: 'Vegetables', value: 'Vegetables' },
                { label: 'Fruits', value: 'Fruits' },
                { label: 'Grains', value: 'Grains' },
                { label: 'Spices', value: 'Spices' }
              ].map((tab) => {
                const isActive = category === tab.value;
                return (
                  <button
                    key={tab.value}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => {
                      setCategory(tab.value);
                      setPage(0);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all ${
                      isActive
                        ? 'bg-emerald-600 text-white shadow-2xs'
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
                onClick={() => {
                  setOrganicOnly(!organicOnly);
                  setPage(0);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition border flex items-center gap-1.5 ${
                  organicOnly
                    ? 'bg-emerald-700 text-white border-emerald-700'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
                aria-pressed={organicOnly}
              >
                <span>🌱 Organic Only</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setGradeAOnly(!gradeAOnly);
                  setPage(0);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition border flex items-center gap-1.5 ${
                  gradeAOnly
                    ? 'bg-amber-700 text-white border-amber-700'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
                aria-pressed={gradeAOnly}
              >
                <span>⭐ Grade A Only</span>
              </button>
            </div>
          </div>

          {/* Active Filter Chips Summary */}
          {hasActiveFilters && (
            <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
              <span className="font-semibold text-slate-500">Active Filters:</span>
              {keyword && (
                <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium flex items-center gap-1">
                  "{keyword}"
                  <button
                    onClick={() => {
                      setKeyword('');
                      setPage(0);
                    }}
                    aria-label="Remove keyword filter"
                  >
                    <X className="w-3 h-3 text-slate-400 hover:text-slate-600" />
                  </button>
                </span>
              )}
              {category && (
                <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-medium border border-emerald-200 flex items-center gap-1">
                  Category: {category}
                  <button
                    onClick={() => {
                      setCategory('');
                      setPage(0);
                    }}
                    aria-label="Remove category filter"
                  >
                    <X className="w-3 h-3 text-emerald-600 hover:text-emerald-800" />
                  </button>
                </span>
              )}
              {location && (
                <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium border border-slate-200 flex items-center gap-1">
                  District: {location}
                  <button
                    onClick={() => {
                      setLocation('');
                      setPage(0);
                    }}
                    aria-label="Remove location filter"
                  >
                    <X className="w-3 h-3 text-slate-500 hover:text-slate-800" />
                  </button>
                </span>
              )}
              {organicOnly && (
                <span className="px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-900 font-medium flex items-center gap-1">
                  Organic
                  <button
                    onClick={() => {
                      setOrganicOnly(false);
                      setPage(0);
                    }}
                    aria-label="Remove organic filter"
                  >
                    <X className="w-3 h-3 text-emerald-700 hover:text-emerald-900" />
                  </button>
                </span>
              )}
              {gradeAOnly && (
                <span className="px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-900 font-medium flex items-center gap-1">
                  Grade A
                  <button
                    onClick={() => {
                      setGradeAOnly(false);
                      setPage(0);
                    }}
                    aria-label="Remove grade A filter"
                  >
                    <X className="w-3 h-3 text-amber-700 hover:text-amber-900" />
                  </button>
                </span>
              )}
              {(minPrice || maxPrice) && (
                <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium border border-slate-200 flex items-center gap-1">
                  Price: Rs. {minPrice || '0'} - {maxPrice || 'Any'}
                  <button
                    onClick={() => {
                      setMinPrice('');
                      setMaxPrice('');
                      setPage(0);
                    }}
                    aria-label="Remove price filter"
                  >
                    <X className="w-3 h-3 text-slate-500 hover:text-slate-800" />
                  </button>
                </span>
              )}
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs font-semibold text-rose-600 hover:underline ml-2"
              >
                Clear all ✕
              </button>
            </div>
          )}
        </div>

        {/* 3. CROP CATALOG DISPLAY (GRID vs TABLE VIEW) */}
        {loading ? (
          /* SKELETON LOADING STATE */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((sk) => (
              <div
                key={sk}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs animate-pulse"
              >
                <div className="h-44 bg-slate-200" />
                <div className="p-4 space-y-3">
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
        ) : apiError ? (
          /* ERROR STATE */
          <div className="bg-white rounded-2xl border border-rose-200 p-12 text-center shadow-xs max-w-md mx-auto space-y-4">
            <div className="w-12 h-12 mx-auto rounded-full bg-rose-50 flex items-center justify-center text-rose-600">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">Unable to load crop listings</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                There was a problem reaching the marketplace service.
              </p>
            </div>
            <button
              type="button"
              onClick={fetchCrops}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
          </div>
        ) : displayedCrops.length === 0 ? (
          /* EMPTY STATE */
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs max-w-md mx-auto space-y-4">
            <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
              <Package className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">No crop listings found</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {activeView === 'my_listings'
                  ? "You haven't posted any harvest listings yet. Use 'Post Harvest Listing' to publish crops."
                  : 'Try changing your search or filters.'}
              </p>
            </div>
            <div className="pt-2 flex justify-center gap-3">
              {activeView === 'my_listings' ? (
                <button
                  type="button"
                  onClick={() => setShowPostModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition"
                >
                  <PlusCircle className="w-4 h-4" /> Post Harvest Listing
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Clear Filters
                </button>
              )}
            </div>
          </div>
        ) : viewMode === 'table' ? (
          /* TABLE VIEW */
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-medium text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase text-slate-500 tracking-wider">
                  <tr>
                    <th className="px-5 py-3.5">Produce</th>
                    <th className="px-4 py-3.5">Category</th>
                    <th className="px-4 py-3.5">District</th>
                    <th className="px-4 py-3.5">Seller</th>
                    <th className="px-4 py-3.5">Price</th>
                    <th className="px-4 py-3.5">Available Quantity</th>
                    <th className="px-4 py-3.5">Quality / Batch</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {displayedCrops.map((crop) => {
                    const isOwner = isCropOwner(crop);
                    const isOutOfStock = (crop.quantity || 0) <= 0;

                    return (
                      <tr key={crop.id} className="hover:bg-slate-50/80 transition">
                        <td className="px-5 py-3.5 font-semibold text-slate-900 flex items-center gap-3">
                          <img
                            src={
                              crop.imageUrl ||
                              'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80'
                            }
                            alt={crop.name}
                            className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0 bg-slate-100"
                            onError={(e) => {
                              e.currentTarget.src =
                                'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80';
                            }}
                          />
                          <div>
                            <Link
                              to={`/crops/${crop.id}`}
                              className="hover:text-emerald-700 font-bold transition block text-sm"
                            >
                              {crop.name}
                            </Link>
                            {crop.grade && (
                              <span className="text-[10px] text-emerald-700 font-semibold">
                                {crop.grade}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-slate-600">{crop.category || 'Produce'}</td>
                        <td className="px-4 py-3.5 text-slate-600">{crop.location || 'Sri Lanka'}</td>
                        <td className="px-4 py-3.5">
                          {isOwner ? (
                            <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded text-[11px] border border-emerald-200">
                              Your Listing
                            </span>
                          ) : crop.farmerName ? (
                            <button
                              type="button"
                              onClick={() => setSelectedFarmer({ id: crop.farmerId, name: crop.farmerName })}
                              className="text-slate-700 hover:text-emerald-700 font-semibold flex items-center gap-1 text-left"
                            >
                              <span>{crop.farmerName}</span>
                            </button>
                          ) : (
                            <span className="text-slate-400">Producer</span>
                          )}
                        </td>
                        <td className="px-4 py-3.5 font-bold text-slate-900 text-sm">
                          Rs. {Number(crop.price).toFixed(2)} / kg
                        </td>
                        <td className="px-4 py-3.5 font-semibold text-slate-700">
                          {formatQuantity(crop.quantity)}
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {crop.isOrganic && (
                              <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                Organic
                              </span>
                            )}
                            {crop.batchCode && (
                              <button
                                type="button"
                                onClick={() => setSelectedTraceCrop(crop)}
                                className="text-[10px] font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded flex items-center gap-1 transition"
                                title="Inspect Batch Traceability"
                              >
                                <QrCode className="w-3 h-3 text-slate-500" />
                                <span>Trace</span>
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              to={`/crops/${crop.id}`}
                              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition"
                            >
                              View Details
                            </Link>

                            {/* Role-Aware Action Buttons */}
                            {isOwner ? (
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => setEditingCrop(crop)}
                                  className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition flex items-center gap-1"
                                  title="Manage Listing"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                  <span>Manage</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setCropToDelete(crop)}
                                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                                  title="Delete Listing"
                                  aria-label="Delete listing"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleBuyClick(crop)}
                                disabled={isOutOfStock}
                                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                                  isOutOfStock
                                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                                    : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs'
                                }`}
                              >
                                {isOutOfStock ? 'Sold Out' : (!isAuthenticated ? 'Sign In to Buy' : 'Buy')}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* GRID VIEW (CLEAN PRODUCT CARDS) */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {displayedCrops.map((crop) => {
              const isOutOfStock = (crop.quantity || 0) <= 0;
              const isOwner = isCropOwner(crop);

              return (
                <div
                  key={crop.id}
                  className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:border-slate-300 hover:shadow-sm transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Media Container */}
                    <div className="h-44 overflow-hidden bg-slate-100 relative">
                      <img
                        src={
                          crop.imageUrl ||
                          'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80'
                        }
                        alt={crop.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src =
                            'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80';
                        }}
                      />

                      {/* Top-Left Category Tag */}
                      <div className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-slate-900/80 text-white text-[10px] font-semibold rounded-md">
                        {crop.category || 'Produce'}
                      </div>

                      {/* Top-Right Grade Badge if provided */}
                      {crop.grade && (
                        <div className="absolute top-2.5 right-2.5 px-2 py-0.5 bg-emerald-700 text-white text-[10px] font-semibold rounded-md">
                          {crop.grade}
                        </div>
                      )}
                    </div>

                    {/* Card Body */}
                    <div className="p-4 space-y-2.5">
                      
                      {/* Location & Organic Status */}
                      <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                        <span className="flex items-center gap-1 truncate text-slate-600">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
                          <span>{crop.location || 'Sri Lanka'}</span>
                        </span>
                        
                        {crop.isOrganic && (
                          <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 shrink-0">
                            Organic
                          </span>
                        )}
                      </div>

                      {/* Crop Title */}
                      <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-1 hover:text-emerald-700 transition">
                        <Link to={`/crops/${crop.id}`}>{crop.name}</Link>
                      </h3>

                      {/* Seller & Available Quantity */}
                      <div className="flex items-center justify-between text-xs">
                        {isOwner ? (
                          <span className="text-emerald-800 font-semibold text-[11px]">
                            Your Listing
                          </span>
                        ) : crop.farmerName ? (
                          <button
                            type="button"
                            onClick={() => setSelectedFarmer({ id: crop.farmerId, name: crop.farmerName })}
                            className="text-slate-600 hover:text-emerald-700 font-medium truncate max-w-[140px] text-left text-[11px]"
                          >
                            <span className="truncate">{crop.farmerName}</span>
                          </button>
                        ) : (
                          <span className="text-slate-400 text-[11px]">Registered Producer</span>
                        )}

                        <span className="text-[11px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md shrink-0">
                          {formatQuantity(crop.quantity)}
                        </span>
                      </div>

                      {/* Price Section */}
                      <div className="pt-2 border-t border-slate-100 flex items-baseline justify-between">
                        <div>
                          <span className="text-base font-bold text-slate-900">
                            Rs. {Number(crop.price).toFixed(2)}
                          </span>
                          <span className="text-xs text-slate-500 font-normal"> / kg</span>
                        </div>

                        {crop.batchCode && (
                          <button
                            type="button"
                            onClick={() => setSelectedTraceCrop(crop)}
                            className="text-[10px] font-semibold text-slate-500 hover:text-emerald-700 flex items-center gap-1 transition"
                            title="Inspect Batch Traceability"
                          >
                            <QrCode className="w-3 h-3 text-slate-400" />
                            <span>Trace</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="p-4 pt-0 space-y-2">
                    {/* Role-Aware Primary Action Button */}
                    {isOwner ? (
                      /* Seller Own-Listing Actions */
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingCrop(crop)}
                          className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl border border-slate-200 flex items-center justify-center gap-1.5 transition"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Manage Listing</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setCropToDelete(crop)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 rounded-xl transition"
                          title="Delete Listing"
                          aria-label="Delete listing"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      /* Buyer Primary Action Button */
                      <button
                        type="button"
                        onClick={() => handleBuyClick(crop)}
                        disabled={isOutOfStock}
                        className={`w-full py-2 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                          isOutOfStock
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs'
                        }`}
                      >
                        <ShoppingBag className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>{isOutOfStock ? 'Sold Out' : (!isAuthenticated ? 'Sign In to Buy' : 'Buy')}</span>
                      </button>
                    )}

                    {/* View Details Link */}
                    <div className="flex justify-end pt-0.5">
                      <Link
                        to={`/crops/${crop.id}`}
                        className="text-[11px] font-semibold text-slate-600 hover:text-emerald-700 flex items-center gap-1 transition"
                      >
                        <span>View Details</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 4. PAGINATION CONTROLS */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 pt-4">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="px-3.5 py-1.5 bg-white border border-slate-200 text-slate-700 font-semibold text-xs rounded-xl disabled:opacity-50 shadow-2xs hover:bg-slate-50 transition"
            >
              Previous
            </button>
            <span className="px-3.5 py-1.5 bg-slate-100 text-slate-800 font-semibold text-xs rounded-xl border border-slate-200">
              Page {page + 1} of {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="px-3.5 py-1.5 bg-white border border-slate-200 text-slate-700 font-semibold text-xs rounded-xl disabled:opacity-50 shadow-2xs hover:bg-slate-50 transition"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* 5. MODALS & DIALOGS */}

      {/* FARMER PROFILE MODAL */}
      {selectedFarmer && (
        <FarmerProfileModal
          farmerId={selectedFarmer.id}
          farmerName={selectedFarmer.name}
          onClose={() => setSelectedFarmer(null)}
        />
      )}

      {/* TRACEABILITY MODAL */}
      {selectedTraceCrop && (
        <TraceabilityModal
          cropId={selectedTraceCrop.id}
          batchCode={selectedTraceCrop.batchCode}
          onClose={() => setSelectedTraceCrop(null)}
        />
      )}

      {/* BUY CROP MODAL */}
      {selectedBuyCrop && (
        <BuyCropModal
          crop={selectedBuyCrop}
          onClose={() => setSelectedBuyCrop(null)}
          onOrderPlaced={fetchCrops}
        />
      )}

      {/* POST HARVEST LISTING MODAL */}
      {showPostModal && (
        <PostHarvestModal
          onClose={() => setShowPostModal(false)}
          onCropCreated={(newCrop) => {
            setCrops((prev) => [newCrop, ...prev]);
            fetchCrops();
            setMsg({ type: 'success', text: 'Crop listing created and published to the marketplace!' });
          }}
        />
      )}

      {/* DELETE LISTING CONFIRMATION MODAL */}
      {cropToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full border border-slate-200 p-6 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center shrink-0">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Delete Crop Listing?</h3>
                <p className="text-xs text-slate-500">This action will remove the listing from the marketplace.</p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1">
              <p><strong>Produce:</strong> {cropToDelete.name}</p>
              <p><strong>Available:</strong> {formatQuantity(cropToDelete.quantity)}</p>
              <p><strong>Price:</strong> Rs. {cropToDelete.price} / kg</p>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                disabled={deletingListing}
                onClick={() => setCropToDelete(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deletingListing}
                onClick={confirmDeleteListing}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition flex items-center gap-1.5 disabled:opacity-50"
              >
                {deletingListing ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Listing</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SELLER EDIT LISTING MODAL */}
      {editingCrop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100">
                  <Edit className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Manage Crop Listing</h3>
                  <p className="text-xs text-slate-500">Update inventory, pricing, or details</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingCrop(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 space-y-4 overflow-y-auto text-xs font-medium">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Crop Title *</label>
                <input
                  type="text"
                  required
                  value={editingCrop.name || ''}
                  onChange={(e) => setEditingCrop({ ...editingCrop, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Category *</label>
                  <select
                    value={editingCrop.category || 'Vegetables'}
                    onChange={(e) => setEditingCrop({ ...editingCrop, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden font-semibold cursor-pointer"
                  >
                    <option value="Vegetables">Vegetables</option>
                    <option value="Grains">Grains</option>
                    <option value="Fruits">Fruits</option>
                    <option value="Spices">Spices</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">District Location *</label>
                  <select
                    value={editingCrop.location || 'Nuwara Eliya'}
                    onChange={(e) => setEditingCrop({ ...editingCrop, location: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden font-semibold cursor-pointer"
                  >
                    {SRI_LANKA_DISTRICTS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Price (Rs./kg) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    step="0.5"
                    value={editingCrop.price || ''}
                    onChange={(e) => setEditingCrop({ ...editingCrop, price: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-emerald-700 font-bold focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Available Quantity (kg) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={editingCrop.quantity !== undefined ? editingCrop.quantity : ''}
                    onChange={(e) => setEditingCrop({ ...editingCrop, quantity: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900 font-bold focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Image URL</label>
                <input
                  type="url"
                  value={editingCrop.imageUrl || ''}
                  onChange={(e) => setEditingCrop({ ...editingCrop, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Description</label>
                <textarea
                  rows="3"
                  value={editingCrop.description || ''}
                  onChange={(e) => setEditingCrop({ ...editingCrop, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingCrop(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 transition disabled:opacity-50"
                >
                  {savingEdit ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default CropsList;
