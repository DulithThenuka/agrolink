import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { suppliersAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Package,
  ShoppingBag,
  PlusCircle,
  Filter,
  CheckCircle2,
  ShieldCheck,
  Truck,
  Loader2,
  Sparkles,
  Sprout,
  Wrench,
  Cpu,
  Layers,
  Search,
  ArrowUpDown,
  X,
  ChevronDown,
  ChevronUp,
  FileText,
  BadgeCheck,
  Tag,
  Percent,
  AlertTriangle,
  XCircle,
  Clock,
  ArrowRight,
  SlidersHorizontal,
  RefreshCw,
  Info,
  Check,
  ShoppingBasket,
  Calendar,
  ExternalLink
} from 'lucide-react';

export const SupplierMarketplace = () => {
  const { user, isFarmer, isSupplier, isAdmin } = useAuth();
  const searchInputRef = useRef(null);

  // Core Data States
  const [items, setItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState(null); // { type: 'success' | 'error', text: string }

  // Navigation / View Tabs
  const [activeTab, setActiveTab] = useState('catalog'); // 'catalog' | 'orders'

  // Filtering & Sorting
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('ALL'); // 'ALL' | 'IN_STOCK' | 'LOW_STOCK'
  const [selectedSupplier, setSelectedSupplier] = useState('ALL');
  const [sortBy, setSortBy] = useState('POPULAR'); // 'POPULAR' | 'PRICE_LOW' | 'PRICE_HIGH' | 'NAME_ASC' | 'STOCK_HIGH'
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Detail Modal & Accordion States
  const [selectedItemDetails, setSelectedItemDetails] = useState(null);
  const [expandedCardId, setExpandedCardId] = useState(null);

  // Multi-step Purchase / Checkout Modal State
  const [purchasingItem, setPurchasingItem] = useState(null);
  const [orderStep, setOrderStep] = useState('configure'); // 'configure' | 'review' | 'confirmed'
  const [quantity, setQuantity] = useState(1);
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [processingPurchase, setProcessingPurchase] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);

  // Add Item Modal Form State (Suppliers & Admins)
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    category: 'Seeds',
    brand: '',
    description: '',
    price: 1500,
    quantity: 50,
    imageUrl: '',
    badge: '🌱 DOA Certified',
    dosageGuide: '',
    activeComposition: '',
  });

  const categories = ['ALL', 'Seeds', 'Fertilizer', 'Pesticides', 'Tools', 'Irrigation', 'Machinery'];

  // Baseline Sri Lankan certified input dataset for graceful offline fallback
  const MOCK_SUPPLIER_ITEMS = [
    {
      id: 1,
      name: 'CIC Hybrid Paddy Seeds (BG-352)',
      category: 'Seeds',
      brand: 'CIC Agri Businesses',
      supplierName: 'CIC Ceylon Organics',
      price: 1850,
      quantity: 120,
      badge: '🌱 DOA Certified',
      imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80',
      description: 'High-yield certified 3.5-month paddy seeds resistant to blast disease.',
      dosageGuide: 'Soak seeds in clean water for 24 hours prior to field broadcasting. Recommended seeding rate: 35 kg per acre.',
      activeComposition: 'BG-352 Strain • 98.5% Germination • 0.1% Inert Matter',
    },
    {
      id: 2,
      name: 'Baurs Organic NPK Fertilizer (50kg)',
      category: 'Fertilizer',
      brand: 'A. Baur & Co.',
      supplierName: 'Baurs Agricultural Inputs',
      price: 4500,
      quantity: 250,
      badge: '🧪 Bio-Organic Certified',
      imageUrl: 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?w=800&auto=format&fit=crop&q=80',
      description: 'Balanced bio-organic fertilizer blend for vegetables and tea plantations.',
      dosageGuide: 'Apply 25 kg/acre as basal soil application prior to planting. Repeat side-dressing application on Day 30 and Day 60.',
      activeComposition: 'NPK Ratio 12:12:17 + Organic Compost Matter (35%)',
    },
    {
      id: 3,
      name: 'Hayleys Bio-Pesticide Neem Spray (1L)',
      category: 'Pesticides',
      brand: 'Hayleys Agriculture',
      supplierName: 'Hayleys Plant Protection',
      price: 2200,
      quantity: 85,
      badge: '🌿 Eco-Safe Non-Toxic',
      imageUrl: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800&auto=format&fit=crop&q=80',
      description: 'Eco-friendly neem-extract botanical pesticide for organic pest control.',
      dosageGuide: 'Dilute 50ml per 16L knapsack sprayer water. Spray thoroughly on foliage at early morning. Pre-harvest interval (PHI): 3 days.',
      activeComposition: 'Azadirachtin 10,000 PPM Neem Oil Concentrate',
    },
    {
      id: 4,
      name: 'Jacto 16L Knapsack Sprayer',
      category: 'Tools',
      brand: 'Jacto Lanka',
      supplierName: 'Lanka Agro Tools Ltd',
      price: 12500,
      quantity: 30,
      badge: '🛡️ 1-Year Warranty',
      imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80',
      description: 'Ergonomic high-pressure manual knapsack sprayer for crop maintenance.',
      dosageGuide: 'Operate manual lever at 45-60 PSI. Flush tank and spray nozzle with clean water immediately after chemical application.',
      activeComposition: 'High-density Polyethylene Tank • Stainless Steel Lance & Brass Nozzle',
    },
    {
      id: 5,
      name: 'DripLanka Micro-Drip Irrigation Kit (0.5 Acre)',
      category: 'Irrigation',
      brand: 'Drip Lanka Tech',
      supplierName: 'Drip Lanka Systems',
      price: 28500,
      quantity: 15,
      badge: '💧 60% Water Saver',
      imageUrl: 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?w=800&auto=format&fit=crop&q=80',
      description: 'Complete water-saving drip emitters, tubing, filter, and manifold valve.',
      dosageGuide: 'Operate at 1.5–2.0 bar pressure. Run drip cycle for 45 mins daily during early morning or dusk.',
      activeComposition: 'UV-Stabilized 16mm Drip Line • 2L/hr Pressure Compensating Emitters',
    },
    {
      id: 6,
      name: 'Mahindra 15HP Mini Power Tiller Cultivator',
      category: 'Machinery',
      brand: 'Mahindra Agri Lanka',
      supplierName: 'Mahindra Machinery Division',
      price: 345000,
      quantity: 6,
      badge: '🏛️ Govt Subsidy Eligible',
      imageUrl: 'https://images.unsplash.com/photo-1530267981608-bc70a2974b6f?w=800&auto=format&fit=crop&q=80',
      description: 'Heavy-duty diesel power tiller with rotary blades for paddy and upland tilling.',
      dosageGuide: 'Requires SAE 15W-40 4-stroke diesel engine oil. Average field capacity: 0.5 acres per hour. Fuel consumption ~1.2L/hr.',
      activeComposition: '15HP Direct Injection Diesel Engine • 18-Blade Rotary Cultivator',
    },
    {
      id: 7,
      name: 'CIC Certified Keeri Samba Seeds (5kg)',
      category: 'Seeds',
      brand: 'CIC Agri Businesses',
      supplierName: 'CIC Ceylon Organics',
      price: 2400,
      quantity: 90,
      badge: '🌱 DOA Certified',
      imageUrl: 'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=800&auto=format&fit=crop&q=80',
      description: 'Premium aromatic Keeri Samba certified seed grains with 98% germination rate.',
      dosageGuide: 'Broadcast at 30kg per acre after 24hr seed soaking and 36hr sprouting treatment.',
      activeComposition: 'Keeri Samba Strain • 99% Purity • Certified Pest-Free Grain',
    },
    {
      id: 8,
      name: 'Baurs Triple Super Phosphate Granules (25kg)',
      category: 'Fertilizer',
      brand: 'A. Baur & Co.',
      supplierName: 'Baurs Agricultural Inputs',
      price: 3800,
      quantity: 110,
      badge: '🧪 High-Purity Grade',
      imageUrl: 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=800&auto=format&fit=crop&q=80',
      description: 'Concentrated phosphorus root booster fertilizer for early crop establishment.',
      dosageGuide: 'Incorporate 15 kg per acre directly into seedbed rows prior to seed sowing.',
      activeComposition: 'P2O5 46% Available Water-Soluble Phosphate Granules',
    }
  ];

  // Fetch real items & orders from backend
  const fetchData = async () => {
    setLoading(true);
    try {
      const [itemsRes, ordersRes] = await Promise.all([
        suppliersAPI.getItems(selectedCategory),
        isSupplier ? suppliersAPI.getSupplierOrders() : suppliersAPI.getFarmerOrders(),
      ]);

      if (itemsRes && itemsRes.data && itemsRes.data.length > 0) {
        setItems(itemsRes.data);
      } else {
        setItems(MOCK_SUPPLIER_ITEMS);
      }

      if (ordersRes && ordersRes.data) {
        setOrders(ordersRes.data);
      }
    } catch (err) {
      console.warn('Backend API offline. Loading verified supplier fallback catalog:', err);
      setItems(MOCK_SUPPLIER_ITEMS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedCategory, isSupplier]);

  // Keyboard shortcut '/' to instantly focus search
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

  // Extract unique suppliers for filter dropdown
  const uniqueSuppliers = Array.from(new Set(items.map((i) => i.supplierName).filter(Boolean)));

  // Live Filtering & Sorting Logic
  const filteredAndSortedItems = items
    .filter((item) => {
      // Category match
      const matchesCategory = selectedCategory === 'ALL' || item.category?.toLowerCase() === selectedCategory.toLowerCase();

      // Search match
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch = !q || (
        item.name?.toLowerCase().includes(q) ||
        item.brand?.toLowerCase().includes(q) ||
        item.supplierName?.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q) ||
        item.category?.toLowerCase().includes(q)
      );

      // Availability match
      let matchesAvailability = true;
      if (availabilityFilter === 'IN_STOCK') {
        matchesAvailability = item.quantity > 0;
      } else if (availabilityFilter === 'LOW_STOCK') {
        matchesAvailability = item.quantity > 0 && item.quantity <= 20;
      }

      // Supplier match
      const matchesSupplier = selectedSupplier === 'ALL' || item.supplierName === selectedSupplier;

      return matchesCategory && matchesSearch && matchesAvailability && matchesSupplier;
    })
    .sort((a, b) => {
      if (sortBy === 'PRICE_LOW') return a.price - b.price;
      if (sortBy === 'PRICE_HIGH') return b.price - a.price;
      if (sortBy === 'NAME_ASC') return a.name.localeCompare(b.name);
      if (sortBy === 'STOCK_HIGH') return (b.quantity || 0) - (a.quantity || 0);
      return 0; // POPULAR / default order
    });

  // Bulk Discount Calculator (transparent calculations without hidden fees)
  const calculateBulkDiscount = (unitPrice, qty) => {
    let discountPct = 0;
    let tierName = 'Standard Rate';

    if (qty >= 25) {
      discountPct = 15;
      tierName = 'Enterprise Wholesale (-15%)';
    } else if (qty >= 10) {
      discountPct = 10;
      tierName = 'Cooperative Bulk (-10%)';
    } else if (qty >= 5) {
      discountPct = 5;
      tierName = 'Smallholder Tier (-5%)';
    }

    const rawTotal = unitPrice * qty;
    const discountAmount = rawTotal * (discountPct / 100);
    const finalTotal = rawTotal - discountAmount;

    return { discountPct, tierName, rawTotal, discountAmount, finalTotal };
  };

  // Stock Status Helper (Icon + Text indicator; not color alone)
  const renderStockBadge = (quantity) => {
    if (quantity <= 0) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
          <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" aria-hidden="true" />
          <span>Out of Stock (0 available)</span>
        </span>
      );
    }
    if (quantity <= 20) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" aria-hidden="true" />
          <span>Low Stock ({quantity} remaining)</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" aria-hidden="true" />
        <span>In Stock ({quantity} available)</span>
      </span>
    );
  };

  // Open multi-step checkout
  const startPurchaseFlow = (item) => {
    if (item.quantity <= 0) return;
    setPurchasingItem(item);
    setQuantity(1);
    setOrderStep('configure');
    setDeliveryNotes('');
    setCompletedOrder(null);
  };

  // Execute purchase via API
  const handlePurchase = async () => {
    if (!purchasingItem || quantity < 1) return;

    setProcessingPurchase(true);
    setMsg(null);
    try {
      const res = await suppliersAPI.purchaseItem(purchasingItem.id, quantity);
      if (res && res.data) {
        setCompletedOrder(res.data);
        setOrderStep('confirmed');
        setMsg({
          type: 'success',
          text: `Order confirmed! #${res.data.id || 'SUP'} for ${quantity}x ${purchasingItem.name}.`,
        });
        fetchData();
      }
    } catch (err) {
      console.error('Purchase failed:', err);
      setMsg({
        type: 'error',
        text: err?.response?.data?.message || 'Purchase request failed. Please check available stock and try again.',
      });
    } finally {
      setProcessingPurchase(false);
    }
  };

  // Create new inventory item (Suppliers & Admins)
  const handleCreateItem = async (e) => {
    e.preventDefault();
    if (!newItem.name || !newItem.price) return;

    setProcessingPurchase(true);
    try {
      const res = await suppliersAPI.createItem({
        ...newItem,
        supplierName: user?.name || (user?.email ? user.email.split('@')[0] : 'Lanka Agri-Supply'),
      });

      if (res && res.data) {
        setMsg({
          type: 'success',
          text: `"${newItem.name}" added to marketplace catalog!`,
        });
        setShowAddItemModal(false);
        setNewItem({
          name: '',
          category: 'Seeds',
          brand: '',
          description: '',
          price: 1500,
          quantity: 50,
          imageUrl: '',
          badge: '🌱 DOA Certified',
          dosageGuide: '',
          activeComposition: '',
        });
        fetchData();
      }
    } catch (err) {
      console.error('Failed to create item:', err);
      setMsg({
        type: 'error',
        text: 'Failed to publish item listing. Please verify inputs.',
      });
    } finally {
      setProcessingPurchase(false);
    }
  };

  const hasActiveFilters =
    selectedCategory !== 'ALL' ||
    searchQuery.trim() !== '' ||
    availabilityFilter !== 'ALL' ||
    selectedSupplier !== 'ALL' ||
    sortBy !== 'POPULAR';

  const resetAllFilters = () => {
    setSelectedCategory('ALL');
    setSearchQuery('');
    setAvailabilityFilter('ALL');
    setSelectedSupplier('ALL');
    setSortBy('POPULAR');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16 font-sans">
      
      {/* 1. TOP ANNOUNCEMENT / TRUST STRIP */}
      <div className="bg-emerald-800 text-emerald-50 px-4 py-2.5 text-xs font-medium border-b border-emerald-900/30">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 font-semibold text-emerald-200">
              <ShieldCheck className="w-4 h-4 text-emerald-300" aria-hidden="true" />
              Verified Pre-Production Ecosystem
            </span>
            <span className="hidden sm:inline text-emerald-300/60">•</span>
            <span className="hidden sm:inline text-emerald-100">
              Direct B2B Procurement: Certified Suppliers to Farmgate
            </span>
          </div>

          <div className="flex items-center gap-4 text-emerald-200 text-xs">
            <span className="inline-flex items-center gap-1">
              <Truck className="w-3.5 h-3.5" aria-hidden="true" /> Islandwide Delivery (25 Districts)
            </span>
            <span className="hidden md:inline-flex items-center gap-1">
              <BadgeCheck className="w-3.5 h-3.5" aria-hidden="true" /> DOA Tested
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
                <Layers className="w-3.5 h-3.5 text-emerald-700" aria-hidden="true" />
                Agricultural Input Suppliers
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
                Farm Input &amp; Equipment Marketplace
              </h1>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Procure government-certified hybrid seeds, organic fertilizers, precision knapsack sprayers, micro-drip kits, and farm machinery directly from verified manufacturers.
              </p>
            </div>

            {/* Actions: New Listing (Supplier/Admin) & Tab Switcher */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              {(isSupplier || isAdmin) && (
                <button
                  type="button"
                  onClick={() => setShowAddItemModal(true)}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2"
                >
                  <PlusCircle className="w-4 h-4" aria-hidden="true" />
                  <span>List New Supply</span>
                </button>
              )}

              {/* View Switcher Tabs */}
              <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200" role="tablist">
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === 'catalog'}
                  onClick={() => setActiveTab('catalog')}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    activeTab === 'catalog'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Browse Supplies ({items.length})
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === 'orders'}
                  onClick={() => setActiveTab('orders')}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    activeTab === 'orders'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Order History ({orders.length})
                </button>
              </div>
            </div>
          </div>

          {/* Trust Guarantees Grid */}
          <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100 shrink-0">
                <ShieldCheck className="w-4 h-4" aria-hidden="true" />
              </div>
              <div>
                <span className="font-semibold text-slate-900 block">Verified Partners</span>
                <span className="text-slate-500">CIC, Baurs, Hayleys, Jacto</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-teal-50 text-teal-700 border border-teal-100 shrink-0">
                <Sprout className="w-4 h-4" aria-hidden="true" />
              </div>
              <div>
                <span className="font-semibold text-slate-900 block">Quality Certified</span>
                <span className="text-slate-500">Department of Agriculture certified</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-blue-50 text-blue-700 border border-blue-100 shrink-0">
                <Truck className="w-4 h-4" aria-hidden="true" />
              </div>
              <div>
                <span className="font-semibold text-slate-900 block">Direct Delivery</span>
                <span className="text-slate-500">2-3 days farmgate dispatch</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-amber-50 text-amber-700 border border-amber-100 shrink-0">
                <Percent className="w-4 h-4" aria-hidden="true" />
              </div>
              <div>
                <span className="font-semibold text-slate-900 block">Bulk Savings</span>
                <span className="text-slate-500">5% to 15% tier discounts</span>
              </div>
            </div>
          </div>
        </div>

        {/* Global Feedback Banner */}
        {msg && (
          <div
            className={`p-4 rounded-xl border text-sm font-medium flex items-center justify-between shadow-sm ${
              msg.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}
            role="alert"
          >
            <div className="flex items-center gap-2">
              {msg.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" aria-hidden="true" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" aria-hidden="true" />
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

        {/* =========================================================================
            TAB 1: BROWSE CATALOG
        ========================================================================= */}
        {activeTab === 'catalog' && (
          <div className="space-y-6">

            {/* SEARCH & FILTERS TOOLBAR */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm space-y-4">
              
              {/* Top Row: Search Input + Sort Dropdown + Mobile Filter Toggle */}
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                
                {/* Search Field with Keyboard Shortcut */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" aria-hidden="true" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search inputs by name, brand, or specification (e.g. CIC seeds, fertilizer, sprayer)..."
                    className="w-full pl-10 pr-16 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition"
                    aria-label="Search agricultural supplies"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    {searchQuery ? (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition"
                        aria-label="Clear search text"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono font-semibold text-slate-400 bg-slate-100 border border-slate-200 rounded">
                        /
                      </kbd>
                    )}
                  </div>
                </div>

                {/* Sort By Dropdown */}
                <div className="flex items-center gap-2">
                  <div className="relative inline-flex items-center">
                    <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" aria-hidden="true" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="pl-8 pr-8 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent appearance-none cursor-pointer hover:bg-slate-100 transition"
                      aria-label="Sort product catalog"
                    >
                      <option value="POPULAR">Featured Products</option>
                      <option value="PRICE_LOW">Price: Low to High</option>
                      <option value="PRICE_HIGH">Price: High to Low</option>
                      <option value="NAME_ASC">Name: A to Z</option>
                      <option value="STOCK_HIGH">Highest Stock</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 pointer-events-none" aria-hidden="true" />
                  </div>

                  {/* Mobile Filters Toggle Button */}
                  <button
                    type="button"
                    onClick={() => setShowMobileFilters(!showMobileFilters)}
                    className="md:hidden inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                    aria-expanded={showMobileFilters}
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-700" aria-hidden="true" />
                    <span>Filters</span>
                    {hasActiveFilters && (
                      <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                    )}
                  </button>
                </div>
              </div>

              {/* Category Pills Row */}
              <div className="pt-2 border-t border-slate-100">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none" role="tablist">
                  <span className="text-xs font-semibold text-slate-500 mr-1 shrink-0 flex items-center gap-1">
                    <Filter className="w-3 h-3 text-slate-400" aria-hidden="true" /> Categories:
                  </span>
                  {categories.map((cat) => {
                    const isActive = selectedCategory === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all ${
                          isActive
                            ? 'bg-emerald-700 text-white shadow-sm'
                            : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                        }`}
                      >
                        {cat === 'ALL' ? 'All Supplies' : cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Secondary Filter Row (Desktop & Expanded Mobile) */}
              <div className={`pt-2 border-t border-slate-100 flex-wrap items-center justify-between gap-3 text-xs ${showMobileFilters ? 'flex' : 'hidden md:flex'}`}>
                <div className="flex flex-wrap items-center gap-3">
                  
                  {/* Stock Availability Filter */}
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-slate-500">Availability:</span>
                    <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50">
                      <button
                        type="button"
                        onClick={() => setAvailabilityFilter('ALL')}
                        className={`px-2.5 py-1 rounded-md font-medium text-xs transition ${
                          availabilityFilter === 'ALL' ? 'bg-white shadow-sm text-slate-900 font-semibold' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        All
                      </button>
                      <button
                        type="button"
                        onClick={() => setAvailabilityFilter('IN_STOCK')}
                        className={`px-2.5 py-1 rounded-md font-medium text-xs transition ${
                          availabilityFilter === 'IN_STOCK' ? 'bg-white shadow-sm text-emerald-800 font-semibold' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        In Stock
                      </button>
                      <button
                        type="button"
                        onClick={() => setAvailabilityFilter('LOW_STOCK')}
                        className={`px-2.5 py-1 rounded-md font-medium text-xs transition ${
                          availabilityFilter === 'LOW_STOCK' ? 'bg-white shadow-sm text-amber-800 font-semibold' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Low Stock (≤20)
                      </button>
                    </div>
                  </div>

                  {/* Supplier Dropdown Filter */}
                  {uniqueSuppliers.length > 0 && (
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-slate-500">Supplier:</span>
                      <div className="relative inline-flex items-center">
                        <select
                          value={selectedSupplier}
                          onChange={(e) => setSelectedSupplier(e.target.value)}
                          className="pl-2.5 pr-7 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-600 cursor-pointer"
                        >
                          <option value="ALL">All Suppliers ({uniqueSuppliers.length})</option>
                          {uniqueSuppliers.map((sup) => (
                            <option key={sup} value={sup}>{sup}</option>
                          ))}
                        </select>
                        <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 pointer-events-none" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Reset Filters & Count */}
                <div className="flex items-center gap-3 ml-auto">
                  <span className="text-slate-500 font-medium">
                    Showing <strong className="text-slate-900">{filteredAndSortedItems.length}</strong> items
                  </span>

                  {hasActiveFilters && (
                    <button
                      type="button"
                      onClick={resetAllFilters}
                      className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-800 font-semibold hover:underline"
                    >
                      <RefreshCw className="w-3 h-3" /> Reset Filters
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* PRODUCT CATALOG GRID */}
            {loading ? (
              /* Loading Skeletons */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((sk) => (
                  <div key={sk} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm animate-pulse">
                    <div className="h-44 bg-slate-200" />
                    <div className="p-5 space-y-3">
                      <div className="h-3.5 bg-slate-200 rounded w-1/3" />
                      <div className="h-5 bg-slate-200 rounded w-3/4" />
                      <div className="h-3 bg-slate-200 rounded w-full" />
                      <div className="h-3 bg-slate-200 rounded w-2/3" />
                      <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                        <div className="h-6 bg-slate-200 rounded w-24" />
                        <div className="h-8 bg-slate-200 rounded w-24" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredAndSortedItems.length === 0 ? (
              /* Empty Results State */
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm max-w-md mx-auto space-y-4">
                <div className="w-14 h-14 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                  <Package className="w-7 h-7" aria-hidden="true" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900">No Supply Products Found</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    No products matched your search {searchQuery ? `"${searchQuery}"` : ''} under {selectedCategory === 'ALL' ? 'all categories' : selectedCategory}. Try clearing keywords or resetting active filters.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Clear All Filters
                </button>
              </div>
            ) : (
              /* Catalog Grid Cards */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAndSortedItems.map((item) => {
                  const isExpanded = expandedCardId === item.id;
                  const isOutOfStock = (item.quantity || 0) <= 0;

                  return (
                    <div
                      key={item.id}
                      className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                    >
                      {/* Top Media & Tags */}
                      <div>
                        <div className="relative h-44 bg-slate-100 overflow-hidden group">
                          <img
                            src={item.imageUrl || 'https://images.unsplash.com/photo-1592417817098-8f3d6ef23a2e?w=800&auto=format&fit=crop&q=80'}
                            alt={item.name}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            onError={(e) => {
                              e.currentTarget.src = 'https://images.unsplash.com/photo-1592417817098-8f3d6ef23a2e?w=800&auto=format&fit=crop&q=80';
                            }}
                          />
                          {/* Category Badge */}
                          <div className="absolute top-3 left-3 px-2.5 py-0.5 bg-slate-900/80 backdrop-blur-sm text-white text-[11px] font-semibold rounded-md">
                            {item.category}
                          </div>

                          {/* Trust Badge */}
                          {item.badge && (
                            <div className="absolute top-3 right-3 px-2.5 py-0.5 bg-emerald-700/90 backdrop-blur-sm text-white text-[11px] font-semibold rounded-md flex items-center gap-1 shadow-sm">
                              <BadgeCheck className="w-3.5 h-3.5 text-emerald-200" aria-hidden="true" />
                              <span>{item.badge}</span>
                            </div>
                          )}
                        </div>

                        {/* Card Body */}
                        <div className="p-5 space-y-3">
                          {/* Brand & Supplier metadata */}
                          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                            <span className="truncate max-w-[65%]">
                              {item.brand ? `${item.brand} • ` : ''}{item.supplierName || 'Verified Agribusiness'}
                            </span>
                            <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/60 shrink-0">
                              Bulk Tier
                            </span>
                          </div>

                          {/* Product Title */}
                          <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-1 hover:text-emerald-700 cursor-pointer" onClick={() => setSelectedItemDetails(item)}>
                            {item.name}
                          </h3>

                          {/* Short Description */}
                          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                            {item.description || 'Verified agricultural input ready for direct dispatch.'}
                          </p>

                          {/* Stock Status Indicator with Icon + Text */}
                          <div className="pt-1">
                            {renderStockBadge(item.quantity)}
                          </div>

                          {/* Technical Usage Accordion Trigger */}
                          {item.dosageGuide && (
                            <div className="pt-1">
                              <button
                                type="button"
                                onClick={() => setExpandedCardId(isExpanded ? null : item.id)}
                                className="w-full py-1.5 px-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs flex items-center justify-between border border-slate-200 transition"
                                aria-expanded={isExpanded}
                              >
                                <span className="flex items-center gap-1.5 text-emerald-800">
                                  <FileText className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
                                  <span>Usage &amp; Dosage Guide</span>
                                </span>
                                {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                              </button>

                              <AnimatePresence>
                                {isExpanded && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mt-2 p-2.5 bg-emerald-50/70 rounded-lg border border-emerald-200/70 text-xs space-y-1.5 text-slate-700"
                                  >
                                    <div className="font-semibold text-emerald-900 flex items-center gap-1">
                                      <Sprout className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
                                      Application Instructions:
                                    </div>
                                    <p className="text-slate-700 leading-relaxed">{item.dosageGuide}</p>
                                    {item.activeComposition && (
                                      <div className="pt-1 border-t border-emerald-200/60 text-[11px] text-slate-600">
                                        <strong className="text-slate-800">Composition: </strong>
                                        {item.activeComposition}
                                      </div>
                                    )}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Card Footer: Unit Price & Actions */}
                      <div className="p-5 pt-0">
                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                          <div>
                            <span className="text-[10px] font-semibold uppercase text-slate-400 block tracking-wider">
                              Unit Price
                            </span>
                            <span className="text-lg sm:text-xl font-extrabold text-slate-900">
                              Rs. {item.price.toLocaleString()}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* View Details Button */}
                            <button
                              type="button"
                              onClick={() => setSelectedItemDetails(item)}
                              className="px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition"
                              title="View full specifications"
                            >
                              Details
                            </button>

                            {/* Order Now Button */}
                            <button
                              type="button"
                              onClick={() => startPurchaseFlow(item)}
                              disabled={isOutOfStock}
                              className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm ${
                                isOutOfStock
                                  ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                                  : 'bg-emerald-700 hover:bg-emerald-800 text-white focus:ring-2 focus:ring-emerald-600'
                              }`}
                            >
                              <ShoppingBag className="w-3.5 h-3.5" aria-hidden="true" />
                              <span>{isOutOfStock ? 'Sold Out' : 'Order Now'}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 2: ORDER HISTORY
        ========================================================================= */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">
                  {isSupplier ? 'Supplier Incoming Sales Orders' : 'My Farm Supply Orders'}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Track procurement records, verified item quantities, and delivery statuses.
                </p>
              </div>

              <div className="inline-flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
                  {orders.length} Orders Logged
                </span>
                <button
                  type="button"
                  onClick={fetchData}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
                  title="Refresh Orders"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {orders.length === 0 ? (
              <div className="py-12 text-center max-w-sm mx-auto space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 mx-auto flex items-center justify-center text-slate-400">
                  <ShoppingBasket className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-slate-800">No Supply Orders Recorded</h3>
                  <p className="text-xs text-slate-500">
                    You haven't placed or received any input supply orders yet. Browse the catalog to place an order.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('catalog')}
                  className="px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-semibold hover:bg-emerald-800 transition"
                >
                  Browse Catalog
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-500 uppercase font-semibold tracking-wider text-[10px] border-b border-slate-200">
                    <tr>
                      <th className="p-3.5">Order Ref</th>
                      <th className="p-3.5">Product Name</th>
                      <th className="p-3.5">Category</th>
                      <th className="p-3.5">Quantity</th>
                      <th className="p-3.5">Total Amount</th>
                      <th className="p-3.5">Buyer / Supplier</th>
                      <th className="p-3.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {orders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-slate-50/80 transition">
                        <td className="p-3.5 font-mono font-bold text-slate-900">
                          #SUP-{ord.id}
                        </td>
                        <td className="p-3.5 font-semibold text-slate-900">
                          {ord.supplierItemName || `Item #${ord.supplierItemId}`}
                        </td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold text-[10px]">
                            {ord.category || 'General'}
                          </span>
                        </td>
                        <td className="p-3.5 font-semibold text-slate-900">
                          {ord.quantity} Units
                        </td>
                        <td className="p-3.5 font-bold text-emerald-700">
                          Rs. {ord.totalPrice?.toLocaleString() || '0'}
                        </td>
                        <td className="p-3.5 text-slate-500 text-[11px]">
                          {isSupplier
                            ? ord.farmerName || ord.farmerEmail || 'Registered Farmer'
                            : ord.supplierEmail || 'Verified Agribusiness'}
                        </td>
                        <td className="p-3.5">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-800 border border-emerald-200">
                            <Check className="w-3 h-3 text-emerald-600" />
                            {ord.status || 'CONFIRMED'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* =========================================================================
          MODAL 1: PRODUCT DETAILS MODAL
      ========================================================================= */}
      {selectedItemDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-semibold text-xs">
                  {selectedItemDetails.category}
                </span>
                {selectedItemDetails.badge && (
                  <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold text-xs border border-slate-200">
                    {selectedItemDetails.badge}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setSelectedItemDetails(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition"
                aria-label="Close details dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content Scrollable */}
            <div className="p-6 space-y-5 overflow-y-auto">
              <div className="flex flex-col sm:flex-row gap-5">
                <div className="w-full sm:w-1/2 h-52 bg-slate-100 rounded-xl overflow-hidden shrink-0">
                  <img
                    src={selectedItemDetails.imageUrl || 'https://images.unsplash.com/photo-1592417817098-8f3d6ef23a2e?w=800&auto=format&fit=crop&q=80'}
                    alt={selectedItemDetails.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="w-full sm:w-1/2 space-y-3">
                  <div>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                      {selectedItemDetails.brand || 'Certified Agribusiness'}
                    </span>
                    <h2 className="text-xl font-bold text-slate-900 mt-0.5">
                      {selectedItemDetails.name}
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Supplier: <strong className="text-slate-700">{selectedItemDetails.supplierName || 'Verified Partner'}</strong>
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                    <span className="text-[10px] font-semibold uppercase text-slate-400 block">Unit Price</span>
                    <span className="text-2xl font-extrabold text-slate-900">
                      Rs. {selectedItemDetails.price.toLocaleString()}
                    </span>
                  </div>

                  <div>
                    {renderStockBadge(selectedItemDetails.quantity)}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider">Product Overview</h4>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {selectedItemDetails.description || 'Verified agricultural input ready for direct dispatch.'}
                </p>
              </div>

              {/* Technical Usage Guide */}
              {selectedItemDetails.dosageGuide && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs space-y-2">
                  <h4 className="font-bold text-emerald-900 flex items-center gap-1.5">
                    <Sprout className="w-4 h-4 text-emerald-700" />
                    Recommended Application / Dosage Guide
                  </h4>
                  <p className="text-slate-700 leading-relaxed">{selectedItemDetails.dosageGuide}</p>
                  {selectedItemDetails.activeComposition && (
                    <div className="pt-2 border-t border-emerald-200/70 text-slate-600">
                      <strong className="text-slate-800">Composition / Strain: </strong>
                      {selectedItemDetails.activeComposition}
                    </div>
                  )}
                </div>
              )}

              {/* Wholesale Bulk Tier Table */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Tag className="w-4 h-4 text-emerald-700" />
                  Wholesale Bulk Tier Pricing
                </h4>
                <div className="grid grid-cols-3 gap-2 text-center pt-1">
                  <div className="p-2 rounded-lg bg-white border border-slate-200">
                    <span className="text-[10px] text-slate-500 block font-medium">5+ Units</span>
                    <span className="font-bold text-slate-900">5% Discount</span>
                  </div>
                  <div className="p-2 rounded-lg bg-white border border-slate-200">
                    <span className="text-[10px] text-slate-500 block font-medium">10+ Units</span>
                    <span className="font-bold text-slate-900">10% Discount</span>
                  </div>
                  <div className="p-2 rounded-lg bg-white border border-slate-200">
                    <span className="text-[10px] text-slate-500 block font-medium">25+ Units</span>
                    <span className="font-bold text-slate-900">15% Discount</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50/60">
              <button
                type="button"
                onClick={() => setSelectedItemDetails(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const itm = selectedItemDetails;
                  setSelectedItemDetails(null);
                  startPurchaseFlow(itm);
                }}
                disabled={(selectedItemDetails.quantity || 0) <= 0}
                className={`px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                  (selectedItemDetails.quantity || 0) <= 0
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                    : 'bg-emerald-700 hover:bg-emerald-800 text-white'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{(selectedItemDetails.quantity || 0) <= 0 ? 'Out of Stock' : 'Proceed to Order'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: MULTI-STEP ORDER FLOW MODAL (CONFIGURE -> REVIEW -> CONFIRMED)
      ========================================================================= */}
      {purchasingItem && (() => {
        const bulkCalc = calculateBulkDiscount(purchasingItem.price, quantity);
        const maxStock = purchasingItem.quantity || 1;

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
              
              {/* Modal Header */}
              <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
                <div className="space-y-0.5">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-emerald-700" />
                    {orderStep === 'configure' && 'Configure Supply Order'}
                    {orderStep === 'review' && 'Review & Confirm Procurement'}
                    {orderStep === 'confirmed' && 'Order Successfully Placed!'}
                  </h3>
                  <div className="text-xs text-slate-500">
                    Step {orderStep === 'configure' ? '1 of 2' : orderStep === 'review' ? '2 of 2' : 'Complete'}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setPurchasingItem(null)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-5 overflow-y-auto">
                
                {/* STEP 1: CONFIGURE */}
                {orderStep === 'configure' && (
                  <div className="space-y-5">
                    {/* Item Snapshot */}
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">{purchasingItem.name}</h4>
                          <p className="text-slate-500 mt-0.5">
                            {purchasingItem.brand} • {purchasingItem.supplierName}
                          </p>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200 text-[10px]">
                          {purchasingItem.category}
                        </span>
                      </div>

                      <div className="pt-2 border-t border-slate-200/70 flex justify-between items-center">
                        <span className="text-slate-500 font-medium">Standard Unit Price:</span>
                        <strong className="text-slate-900 font-bold">
                          Rs. {purchasingItem.price.toLocaleString()}
                        </strong>
                      </div>
                    </div>

                    {/* Quantity Stepper with Stock Limit */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <label htmlFor="order-quantity-input" className="font-bold text-slate-700">
                          Order Quantity:
                        </label>
                        <span className="text-slate-500">
                          Max Available: <strong className="text-slate-900">{maxStock} units</strong>
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="w-10 h-10 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-base flex items-center justify-center transition"
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <input
                          id="order-quantity-input"
                          type="number"
                          min="1"
                          max={maxStock}
                          value={quantity}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            if (val >= 1 && val <= maxStock) {
                              setQuantity(val);
                            } else if (val > maxStock) {
                              setQuantity(maxStock);
                            } else {
                              setQuantity(1);
                            }
                          }}
                          className="flex-1 py-2 px-3 rounded-xl border border-slate-200 text-center font-bold text-slate-900 text-base focus:outline-none focus:ring-2 focus:ring-emerald-600"
                        />
                        <button
                          type="button"
                          onClick={() => setQuantity(Math.min(maxStock, quantity + 1))}
                          disabled={quantity >= maxStock}
                          className="w-10 h-10 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-base flex items-center justify-center transition disabled:opacity-40"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      {/* Bulk Tier Quick-Select Buttons */}
                      <div className="grid grid-cols-4 gap-2 pt-1 text-[11px]">
                        {[1, 5, 10, 25].map((tierQty) => {
                          const isEligible = maxStock >= tierQty;
                          return (
                            <button
                              key={tierQty}
                              type="button"
                              disabled={!isEligible}
                              onClick={() => setQuantity(tierQty)}
                              className={`py-1.5 rounded-lg border font-semibold text-center transition ${
                                quantity === tierQty
                                  ? 'bg-emerald-700 text-white border-emerald-700'
                                  : isEligible
                                  ? 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                                  : 'bg-slate-100 text-slate-300 border-slate-100 cursor-not-allowed'
                              }`}
                            >
                              {tierQty} {tierQty === 1 ? 'Unit' : `Units (${tierQty === 5 ? '-5%' : tierQty === 10 ? '-10%' : '-15%'})`}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Delivery & Dispatch Note */}
                    <div className="space-y-1.5 text-xs">
                      <label className="font-bold text-slate-700 block">
                        Farm Delivery Notes / Receiving Location:
                      </label>
                      <textarea
                        rows="2"
                        value={deliveryNotes}
                        onChange={(e) => setDeliveryNotes(e.target.value)}
                        placeholder="e.g. Green Valley Farm, Polonnaruwa North. Access via Canal Rd."
                        className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>

                    {/* Transparent Price Summary */}
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-xs">
                      <div className="flex justify-between text-slate-600">
                        <span>Unit Subtotal ({quantity} × Rs. {purchasingItem.price.toLocaleString()}):</span>
                        <span>Rs. {bulkCalc.rawTotal.toLocaleString()}</span>
                      </div>
                      {bulkCalc.discountPct > 0 && (
                        <div className="flex justify-between text-emerald-700 font-semibold">
                          <span>{bulkCalc.tierName}:</span>
                          <span>- Rs. {bulkCalc.discountAmount.toLocaleString()}</span>
                        </div>
                      )}
                      <div className="pt-2 border-t border-slate-200/80 flex justify-between items-baseline font-bold text-slate-900">
                        <span className="text-sm">Order Estimate:</span>
                        <span className="text-xl text-emerald-700">
                          Rs. {bulkCalc.finalTotal.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 2: REVIEW & CONFIRM */}
                {orderStep === 'review' && (
                  <div className="space-y-4 text-xs">
                    <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2">
                      <h4 className="font-bold text-emerald-900 text-sm">Review Order Details</h4>
                      <p className="text-slate-600">
                        Please verify your procurement quantities before confirming dispatch with {purchasingItem.supplierName}.
                      </p>
                    </div>

                    <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl p-4 bg-white space-y-3">
                      <div className="pb-2 flex justify-between items-start">
                        <div>
                          <span className="font-bold text-slate-900 text-sm block">{purchasingItem.name}</span>
                          <span className="text-slate-500">{purchasingItem.brand}</span>
                        </div>
                        <span className="font-bold text-slate-900">{quantity} units</span>
                      </div>

                      <div className="pt-3 space-y-1 text-slate-600">
                        <div className="flex justify-between">
                          <span>Unit Price:</span>
                          <span>Rs. {purchasingItem.price.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Quantity:</span>
                          <span>{quantity} Units</span>
                        </div>
                        {bulkCalc.discountPct > 0 && (
                          <div className="flex justify-between text-emerald-700 font-semibold">
                            <span>Bulk Savings ({bulkCalc.discountPct}%):</span>
                            <span>- Rs. {bulkCalc.discountAmount.toLocaleString()}</span>
                          </div>
                        )}
                        {deliveryNotes && (
                          <div className="pt-1 text-slate-500">
                            <span className="font-semibold text-slate-700">Delivery Notes: </span>
                            {deliveryNotes}
                          </div>
                        )}
                      </div>

                      <div className="pt-3 flex justify-between items-baseline">
                        <span className="font-bold text-slate-900 text-sm">Total Payable:</span>
                        <span className="text-2xl font-extrabold text-emerald-700">
                          Rs. {bulkCalc.finalTotal.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-500 flex items-center gap-2">
                      <Info className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>Direct supplier billing. Payment and dispatch logistics handled upon order acknowledgement.</span>
                    </div>
                  </div>
                )}

                {/* STEP 3: ORDER CONFIRMED RECEIPT */}
                {orderStep === 'confirmed' && (
                  <div className="text-center py-4 space-y-4">
                    <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-sm">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-lg font-extrabold text-slate-900">Procurement Order Confirmed!</h3>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        Your supply order has been recorded and transmitted to <strong>{purchasingItem.supplierName}</strong>.
                      </p>
                    </div>

                    {/* Order Reference Box */}
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-left max-w-sm mx-auto space-y-2">
                      <div className="flex justify-between font-mono">
                        <span className="text-slate-500">Order Ref:</span>
                        <strong className="text-slate-900">#SUP-{completedOrder?.id || Date.now().toString().slice(-4)}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Item:</span>
                        <strong className="text-slate-900">{purchasingItem.name}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Units:</span>
                        <strong className="text-slate-900">{quantity} units</strong>
                      </div>
                      <div className="flex justify-between border-t border-slate-200 pt-1">
                        <span className="text-slate-500 font-semibold">Total Amount:</span>
                        <strong className="text-emerald-700 font-bold">
                          Rs. {completedOrder?.totalPrice?.toLocaleString() || bulkCalc.finalTotal.toLocaleString()}
                        </strong>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer Controls */}
              <div className="p-4 sm:p-5 border-t border-slate-100 flex items-center justify-between gap-3 bg-slate-50/60">
                {orderStep === 'configure' && (
                  <>
                    <button
                      type="button"
                      onClick={() => setPurchasingItem(null)}
                      className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => setOrderStep('review')}
                      className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center gap-1.5 transition"
                    >
                      <span>Review Order</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}

                {orderStep === 'review' && (
                  <>
                    <button
                      type="button"
                      onClick={() => setOrderStep('configure')}
                      disabled={processingPurchase}
                      className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handlePurchase}
                      disabled={processingPurchase}
                      className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center gap-1.5 transition disabled:opacity-50"
                    >
                      {processingPurchase ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Processing Order...</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Confirm &amp; Place Order</span>
                        </>
                      )}
                    </button>
                  </>
                )}

                {orderStep === 'confirmed' && (
                  <div className="w-full flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setPurchasingItem(null);
                        setActiveTab('orders');
                      }}
                      className="w-1/2 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition"
                    >
                      View in Order History
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setPurchasingItem(null);
                        setActiveTab('catalog');
                      }}
                      className="w-1/2 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold transition"
                    >
                      Continue Shopping
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* =========================================================================
          MODAL 3: ADD NEW SUPPLY LISTING (SUPPLIERS / ADMINS)
      ========================================================================= */}
      {showAddItemModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
            
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100">
                  <Package className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">List New Agricultural Supply</h3>
                  <p className="text-xs text-slate-500">Publish inputs directly to verified farmers</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddItemModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateItem} className="p-6 space-y-4 overflow-y-auto text-xs font-medium">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-bold mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    placeholder="e.g. CIC Hybrid Paddy Seeds (BG-352)"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Category *</label>
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none font-semibold cursor-pointer"
                  >
                    <option value="Seeds">🌱 Seeds</option>
                    <option value="Fertilizer">🧪 Fertilizer</option>
                    <option value="Pesticides">🐛 Pesticides</option>
                    <option value="Tools">🛠️ Tools</option>
                    <option value="Irrigation">🚰 Irrigation</option>
                    <option value="Machinery">🚜 Machinery</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Brand / Manufacturer</label>
                  <input
                    type="text"
                    value={newItem.brand}
                    onChange={(e) => setNewItem({ ...newItem, brand: e.target.value })}
                    placeholder="e.g. CIC Agri Businesses"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Unit Price (Rs.) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={newItem.price}
                    onChange={(e) => setNewItem({ ...newItem, price: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900 font-bold text-emerald-700 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Stock Quantity *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900 font-bold focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Certification Badge</label>
                  <input
                    type="text"
                    value={newItem.badge}
                    onChange={(e) => setNewItem({ ...newItem, badge: e.target.value })}
                    placeholder="e.g. 🌱 DOA Certified"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Product Image URL</label>
                  <input
                    type="url"
                    value={newItem.imageUrl}
                    onChange={(e) => setNewItem({ ...newItem, imageUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-bold mb-1">Technical Composition</label>
                  <input
                    type="text"
                    value={newItem.activeComposition}
                    onChange={(e) => setNewItem({ ...newItem, activeComposition: e.target.value })}
                    placeholder="e.g. NPK 12:12:17 + Organic Compost Matter (35%)"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-bold mb-1">Application / Dosage Guide</label>
                  <input
                    type="text"
                    value={newItem.dosageGuide}
                    onChange={(e) => setNewItem({ ...newItem, dosageGuide: e.target.value })}
                    placeholder="e.g. Dilute 50ml per 16L knapsack sprayer water. Pre-harvest interval (PHI): 3 days."
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-bold mb-1">Full Description</label>
                  <textarea
                    rows="3"
                    value={newItem.description}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                    placeholder="Provide detailed information regarding packaging, efficacy, and usage."
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Form Footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddItemModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={processingPurchase}
                  className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center gap-1.5 transition disabled:opacity-50"
                >
                  {processingPurchase ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Publishing...</span>
                    </>
                  ) : (
                    <>
                      <PlusCircle className="w-4 h-4" />
                      <span>Publish to Marketplace</span>
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

export default SupplierMarketplace;
