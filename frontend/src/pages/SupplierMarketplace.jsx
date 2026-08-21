import React, { useState, useEffect } from 'react';
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
  DollarSign,
  Layers,
  Search,
  ArrowUpDown,
  X,
  ChevronDown,
  ChevronUp,
  FileText,
  BadgeCheck,
  Award
} from 'lucide-react';

export const SupplierMarketplace = () => {
  const { user, isFarmer, isSupplier, isAdmin } = useAuth();

  const [items, setItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('POPULAR');
  const [expandedItemId, setExpandedItemId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  // Purchase Modal State
  const [purchasingItem, setPurchasingItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [processingPurchase, setProcessingPurchase] = useState(false);

  // New Item Form State (for Suppliers)
  const [showAddItemForm, setShowAddItemForm] = useState(false);
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
  });

  const categories = ['ALL', 'Seeds', 'Fertilizer', 'Pesticides', 'Tools', 'Irrigation', 'Machinery'];

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
      if (ordersRes && ordersRes.data) setOrders(ordersRes.data);
    } catch (err) {
      console.warn('Backend API offline. Loading Supplier Marketplace fallback:', err);
      setItems(MOCK_SUPPLIER_ITEMS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedCategory, isSupplier]);

  // Live Filtering & Sorting Logic
  const filteredAndSortedItems = items
    .filter((item) => {
      const matchesCategory = selectedCategory === 'ALL' || item.category.toLowerCase() === selectedCategory.toLowerCase();
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch = !q || (
        item.name?.toLowerCase().includes(q) ||
        item.brand?.toLowerCase().includes(q) ||
        item.supplierName?.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q) ||
        item.category?.toLowerCase().includes(q)
      );

      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'PRICE_LOW') return a.price - b.price;
      if (sortBy === 'PRICE_HIGH') return b.price - a.price;
      if (sortBy === 'NAME_ASC') return a.name.localeCompare(b.name);
      return 0;
    });

  const handlePurchase = async () => {
    if (!purchasingItem || quantity < 1) return;

    setProcessingPurchase(true);
    setMsg('');
    try {
      const res = await suppliersAPI.purchaseItem(purchasingItem.id, quantity);
      if (res && res.data) {
        setMsg(`✅ Successfully purchased ${quantity}x ${purchasingItem.name}! Order confirmed.`);
        setPurchasingItem(null);
        setQuantity(1);
        fetchData();
      }
    } catch (err) {
      console.error('Purchase failed:', err);
      setMsg('❌ Purchase failed. Please verify inventory availability.');
    } finally {
      setProcessingPurchase(false);
    }
  };

  const handleCreateItem = async (e) => {
    e.preventDefault();
    if (!newItem.name || !newItem.price) return;

    setProcessingPurchase(true);
    try {
      const res = await suppliersAPI.createItem({
        ...newItem,
        supplierName: user?.email ? user.email.split('@')[0] : 'Lanka Agri-Supply',
      });

      if (res && res.data) {
        setMsg('✅ New input supply item added to the marketplace!');
        setShowAddItemForm(false);
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
        });
        fetchData();
      }
    } catch (err) {
      console.error('Failed to create item:', err);
    } finally {
      setProcessingPurchase(false);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      
      {/* HEADER BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-emerald-950 to-teal-950 text-white p-8 md:p-10 shadow-2xl space-y-3">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-emerald-400" /> PRE-PRODUCTION SUPPLIER ECOSYSTEM
          </span>
          <span className="text-xs font-mono font-bold text-teal-200">• SUPPLIER ➔ FARMER</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-5xl font-black font-display tracking-tight text-white">
              Agricultural Supplier Marketplace 🧰
            </h1>
            <p className="text-slate-300 text-sm md:text-base max-w-2xl font-medium">
              Equip your farm before cultivation! Purchase certified hybrid seeds, organic fertilizers, pesticides, precision tools, drip irrigation kits, and farm machinery.
            </p>
          </div>

          {(isSupplier || isAdmin) && (
            <button
              onClick={() => setShowAddItemForm(!showAddItemForm)}
              className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-2xl shadow-xl transition flex items-center gap-2 shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{showAddItemForm ? 'Close Form' : 'List New Input Supply 📦'}</span>
            </button>
          )}
        </div>
      </div>

      {/* MARKETPLACE SUMMARY METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-md flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Verified Suppliers</p>
            <h3 className="text-lg font-extrabold text-slate-900 font-display">12 Agribusiness Partners</h3>
            <p className="text-[11px] text-slate-500 font-medium">CIC, Baurs, Hayleys, Jacto</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-md flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-teal-50 text-teal-700 border border-teal-100 shrink-0">
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Input Quality Guarantee</p>
            <h3 className="text-lg font-extrabold text-slate-900 font-display">100% DOA Certified</h3>
            <p className="text-[11px] text-slate-500 font-medium">Bio-organic & pest-free testing</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-md flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-100 shrink-0">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Farmgate Delivery</p>
            <h3 className="text-lg font-extrabold text-slate-900 font-display">2-3 Days Express</h3>
            <p className="text-[11px] text-slate-500 font-medium">Islandwide 25 district shipping</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-md flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-100 shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Government Subsidy</p>
            <h3 className="text-lg font-extrabold text-slate-900 font-display">Eligible Products</h3>
            <p className="text-[11px] text-slate-500 font-medium">Fertilizer & machinery vouchers</p>
          </div>
        </div>
      </div>

      {msg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 font-bold text-xs shadow-sm">
          {msg}
        </div>
      )}

      {/* SUPPLIER NEW ITEM CREATION FORM */}
      {showAddItemForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xl space-y-4">
          <h3 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
            <Package className="w-5 h-5 text-emerald-600" /> Add Agricultural Supply Listing
          </h3>

          <form onSubmit={handleCreateItem} className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-semibold">
            <div>
              <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Item Title</label>
              <input
                type="text"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                placeholder="e.g. Organic NPK Fertilizer 50kg"
                required
                className="w-full p-2.5 rounded-xl border border-slate-200"
              />
            </div>

            <div>
              <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Category</label>
              <select
                value={newItem.category}
                onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 font-bold"
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
              <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Brand / Manufacturer</label>
              <input
                type="text"
                value={newItem.brand}
                onChange={(e) => setNewItem({ ...newItem, brand: e.target.value })}
                placeholder="e.g. Lanka AgriTech"
                className="w-full p-2.5 rounded-xl border border-slate-200"
              />
            </div>

            <div>
              <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Price (Rs.)</label>
              <input
                type="number"
                value={newItem.price}
                onChange={(e) => setNewItem({ ...newItem, price: Number(e.target.value) })}
                className="w-full p-2.5 rounded-xl border border-slate-200 font-bold text-emerald-600"
              />
            </div>

            <div>
              <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Stock Quantity</label>
              <input
                type="number"
                value={newItem.quantity}
                onChange={(e) => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
                className="w-full p-2.5 rounded-xl border border-slate-200 font-bold"
              />
            </div>

            <div>
              <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Certification Badge</label>
              <input
                type="text"
                value={newItem.badge}
                onChange={(e) => setNewItem({ ...newItem, badge: e.target.value })}
                placeholder="e.g. 🌱 DOA Certified"
                className="w-full p-2.5 rounded-xl border border-slate-200 font-bold"
              />
            </div>

            <div className="md:col-span-3">
              <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Application / Dosage Guidelines</label>
              <input
                type="text"
                value={newItem.dosageGuide}
                onChange={(e) => setNewItem({ ...newItem, dosageGuide: e.target.value })}
                placeholder="e.g. Dilute 50ml per 16L knapsack sprayer. Apply in early morning."
                className="w-full p-2.5 rounded-xl border border-slate-200"
              />
            </div>

            <div className="md:col-span-3">
              <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Description</label>
              <textarea
                rows="2"
                value={newItem.description}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                placeholder="Detailed specifications, usage guidelines, and chemical composition..."
                className="w-full p-2.5 rounded-xl border border-slate-200"
              />
            </div>

            <div className="md:col-span-3">
              <button
                type="submit"
                disabled={processingPurchase}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
              >
                {processingPurchase ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlusCircle className="w-4 h-4" />}
                <span>Publish Item to Marketplace 🚀</span>
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* SEARCH BAR & SORTING TOOLBAR */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* SEARCH INPUT */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search supplies by name or brand (e.g. CIC, Baurs, Hayleys, Knapsack)..."
              className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* SORT DROPDOWN */}
          <div className="flex items-center gap-2 shrink-0">
            <ArrowUpDown className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl text-xs font-extrabold bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
            >
              <option value="POPULAR">⭐ Featured / Popular</option>
              <option value="PRICE_LOW">💲 Price: Low to High</option>
              <option value="PRICE_HIGH">💰 Price: High to Low</option>
              <option value="NAME_ASC">🔤 Name: A to Z</option>
            </select>
          </div>
        </div>

        {/* CATEGORY FILTER BAR */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs font-bold uppercase text-slate-400 mr-1 flex items-center gap-1 shrink-0">
              <Filter className="w-3.5 h-3.5" /> Category:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {cat === 'ALL' ? '📦 All' : cat}
              </button>
            ))}
          </div>

          {/* ACTIVE FILTER SUMMARY & RESET */}
          {(selectedCategory !== 'ALL' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCategory('ALL');
                setSearchQuery('');
              }}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 underline self-start sm:self-auto shrink-0"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* ITEMS CATALOG GRID */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
            Available Supplies
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-extrabold">
              {filteredAndSortedItems.length} Products Found
            </span>
          </h2>
          <span className="text-xs font-semibold text-slate-400">Direct Delivery to Farm Location</span>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-400 space-y-2">
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-emerald-600" />
            <p className="text-xs font-semibold">Loading marketplace catalog...</p>
          </div>
        ) : filteredAndSortedItems.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
            <p className="text-base font-extrabold text-slate-800">No Supply Items Found</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No products match "{searchQuery}" under {selectedCategory === 'ALL' ? 'all categories' : selectedCategory}. Try clearing your search query or switching categories.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('ALL');
                setSearchQuery('');
              }}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow transition"
            >
              Clear All Search Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedItems.map((item) => {
              const isExpanded = expandedItemId === item.id;

              return (
                <motion.div
                  key={item.id}
                  whileHover={{ y: -3 }}
                  className="premium-card bg-white border border-slate-100/90 shadow-md rounded-3xl overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-44 bg-slate-100 overflow-hidden">
                      <img
                        src={item.imageUrl || 'https://images.unsplash.com/photo-1592417817098-8f3d6ef23a2e'}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1592417817098-8f3d6ef23a2e';
                        }}
                      />
                      <div className="absolute top-3 left-3 px-3 py-1 bg-slate-900/80 backdrop-blur-sm text-emerald-300 text-[10px] font-black uppercase tracking-wider rounded-full border border-white/20">
                        {item.category}
                      </div>

                      {/* TRUST BADGE OVERLAY */}
                      {item.badge && (
                        <div className="absolute top-3 right-3 px-2.5 py-1 bg-emerald-600/90 backdrop-blur-sm text-white text-[10px] font-black rounded-full shadow border border-emerald-400/40 flex items-center gap-1">
                          <BadgeCheck className="w-3 h-3 text-emerald-200" /> {item.badge}
                        </div>
                      )}
                    </div>

                    <div className="p-5 space-y-3">
                      <div className="space-y-1">
                        <span className="text-[11px] font-bold text-slate-400 block">{item.brand} • {item.supplierName}</span>
                        <h3 className="font-extrabold text-slate-900 text-base leading-snug">{item.name}</h3>
                        <p className="text-xs text-slate-500 font-medium line-clamp-2">{item.description}</p>
                      </div>

                      {/* EXPANDABLE TECHNICAL DOSAGE DATASHEET */}
                      {item.dosageGuide && (
                        <div className="pt-2">
                          <button
                            onClick={() => setExpandedItemId(isExpanded ? null : item.id)}
                            className="w-full py-1.5 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-[11px] flex items-center justify-between border border-slate-200 transition"
                          >
                            <span className="flex items-center gap-1.5 text-emerald-700">
                              <FileText className="w-3.5 h-3.5" /> Technical Usage & Dosage Guide
                            </span>
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>

                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-2 p-3 bg-emerald-50/80 rounded-xl border border-emerald-200/80 text-[11px] space-y-1.5 text-slate-700"
                              >
                                <p className="font-extrabold text-emerald-900 flex items-center gap-1">
                                  <Sprout className="w-3.5 h-3.5 text-emerald-600" /> Application Rate:
                                </p>
                                <p className="font-medium text-slate-700 leading-relaxed">{item.dosageGuide}</p>
                                {item.activeComposition && (
                                  <div className="pt-1.5 border-t border-emerald-200/60 font-semibold text-slate-600">
                                    <span className="font-bold text-slate-800">Composition: </span>{item.activeComposition}
                                  </div>
                                )}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-5 pt-0">
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase text-slate-400 block">Unit Price</span>
                        <span className="text-xl font-black text-emerald-600 font-display">Rs. {item.price.toLocaleString()}</span>
                      </div>

                      <button
                        onClick={() => {
                          setPurchasingItem(item);
                          setQuantity(1);
                        }}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" /> Buy Supplies 🛒
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* FARMER PURCHASE ORDERS & SUPPLIER SALES HISTORY */}
      <div className="premium-card p-6 bg-white border border-slate-100 shadow-xl space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900 font-display">
              {isSupplier ? '📦 Supplier Sales Orders' : '🛒 My Farm Supply Purchases'}
            </h3>
            <p className="text-xs text-slate-500 font-medium">Input supplies &amp; equipment order history</p>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
            {orders.length} Orders Recorded
          </span>
        </div>

        {orders.length === 0 ? (
          <p className="text-xs text-slate-400 font-medium py-4 text-center">No supply orders recorded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-400 uppercase font-black tracking-wider text-[10px]">
                <tr>
                  <th className="p-3">Order ID</th>
                  <th className="p-3">Supply Product</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Quantity</th>
                  <th className="p-3">Total Amount</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-slate-900">#SUP-{ord.id}</td>
                    <td className="p-3 font-bold text-slate-900">{ord.supplierItemName}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-extrabold text-[10px]">
                        {ord.category}
                      </span>
                    </td>
                    <td className="p-3 font-bold">{ord.quantity} Units</td>
                    <td className="p-3 font-black text-emerald-600">Rs. {ord.totalPrice.toLocaleString()}</td>
                    <td className="p-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">
                        {ord.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* PURCHASE MODAL WITH TECHNICAL DATASHEET */}
      {purchasingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full border border-slate-100 p-6 space-y-5 relative">
            <h3 className="text-lg font-black text-slate-900 font-display">Confirm Supply Purchase 🛒</h3>
            
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between items-start">
                <p className="font-extrabold text-slate-900 text-sm">{purchasingItem.name}</p>
                {purchasingItem.badge && (
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-extrabold text-[10px]">
                    {purchasingItem.badge}
                  </span>
                )}
              </div>
              <p className="text-slate-500 font-medium">Category: {purchasingItem.category} • Brand: {purchasingItem.brand}</p>
              <p className="text-emerald-700 font-extrabold text-sm">Unit Price: Rs. {purchasingItem.price.toLocaleString()}</p>
            </div>

            {purchasingItem.dosageGuide && (
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] space-y-1">
                <span className="font-extrabold text-emerald-900 block">📋 Application Dosage Instructions:</span>
                <p className="text-slate-700 font-medium">{purchasingItem.dosageGuide}</p>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Quantity</label>
              <input
                type="number"
                min="1"
                max={purchasingItem.quantity || 100}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                className="w-full p-3 rounded-xl border border-slate-200 text-sm font-extrabold"
              />
            </div>

            <div className="p-3 bg-slate-900 text-white rounded-xl flex justify-between items-center text-xs shadow">
              <span className="font-bold text-slate-300">Total Order Cost:</span>
              <span className="text-xl font-black text-emerald-400 font-display">
                Rs. {(purchasingItem.price * quantity).toLocaleString()}
              </span>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setPurchasingItem(null)}
                className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handlePurchase}
                disabled={processingPurchase}
                className="w-1/2 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1.5"
              >
                {processingPurchase ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Order 🛒'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
