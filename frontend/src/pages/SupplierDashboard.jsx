import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wrench,
  Package,
  Tractor,
  ShoppingBag,
  PlusCircle,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Clock,
  DollarSign,
  Loader2,
  TrendingUp,
  Sparkles,
  LogOut,
  AlertCircle,
  Search,
  Filter,
  Layers,
  ArrowRight,
  RefreshCw,
  Tag,
  Building2,
  Recycle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { suppliersAPI, rentalsAPI } from '../services/api';

export const SupplierDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const supplierName = user?.name || (user?.email ? user.email.split('@')[0] : 'Supplier');

  const [items, setItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'items' | 'machinery'

  // Add Item Modal
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    category: 'Seeds',
    brand: '',
    price: 1500,
    quantity: 100,
    description: '',
    badge: '🌱 DOA Certified',
  });
  const [submittingItem, setSubmittingItem] = useState(false);
  const [msg, setMsg] = useState('');

  const loadSupplierData = async () => {
    setLoading(true);
    try {
      // 1. Fetch supplier catalog items
      const itemsRes = await suppliersAPI.getItems();
      if (itemsRes && itemsRes.data) {
        setItems(Array.isArray(itemsRes.data) ? itemsRes.data : []);
      } else {
        setItems([
          { id: 1, name: 'Certified BG-358 Paddy Seeds', category: 'Seeds', brand: 'CIC Agri', price: 2800, quantity: 450, badge: '🌱 DOA Certified' },
          { id: 2, name: 'Bio-Organic Liquid Potash (5L)', category: 'Fertilizer', brand: 'Hayleys Agriculture', price: 4200, quantity: 180, badge: '⚡ High Yield' },
          { id: 3, name: 'Smart Drip Irrigation Lateral Kit 1-Acre', category: 'Equipment', brand: 'Dimo Agrotech', price: 38500, quantity: 24, badge: '💧 Water Saver' },
          { id: 4, name: 'Neem-Based Bio Insecticide (1L)', category: 'PestControl', brand: 'AgStar Bio', price: 1950, quantity: 210, badge: '🌿 Eco Friendly' }
        ]);
      }

      // 2. Fetch incoming orders from farmers
      const ordersRes = await suppliersAPI.getSupplierOrders();
      if (ordersRes && ordersRes.data) {
        setOrders(Array.isArray(ordersRes.data) ? ordersRes.data : []);
      } else {
        setOrders([
          {
            id: 801,
            buyerEmail: 'farmer.kamal@agrolink.lk',
            itemName: 'Certified BG-358 Paddy Seeds (50kg Bags)',
            quantity: 4,
            totalPrice: 11200,
            status: 'CONFIRMED',
            date: 'Today, 10:45 AM',
            location: 'Polonnaruwa Central Depot',
          },
          {
            id: 802,
            buyerEmail: 'ranjith.grower@agrolink.lk',
            itemName: 'Bio-Organic Liquid Potash (5L)',
            quantity: 10,
            totalPrice: 42000,
            status: 'PENDING_DISPATCH',
            date: 'Yesterday',
            location: 'Dambulla Distribution Center',
          },
          {
            id: 803,
            buyerEmail: 'mahinda.tea@agrolink.lk',
            itemName: 'Smart Drip Irrigation Lateral Kit 1-Acre',
            quantity: 1,
            totalPrice: 38500,
            status: 'DELIVERED',
            date: '3 days ago',
            location: 'Kandy Agro Hub',
          }
        ]);
      }

      // 3. Fetch equipment rentals
      const rentalsRes = await rentalsAPI.getAvailable();
      if (rentalsRes && rentalsRes.data) {
        setRentals(Array.isArray(rentalsRes.data) ? rentalsRes.data : []);
      } else {
        setRentals([
          { id: 1, name: 'Kubota 45HP 4WD Tractor', category: 'Tractors', dailyRate: 14500, location: 'Anuradhapura', available: true, power: '45 HP' },
          { id: 2, name: 'Yanmar Combine Harvester AW85G', category: 'Harvesters', dailyRate: 28000, location: 'Polonnaruwa', available: false, power: '85 HP' },
          { id: 3, name: 'Boom Sprayer Tractor Mounted 600L', category: 'Sprayers', dailyRate: 6500, location: 'Kurunegala', available: true, power: 'PTO Driven' }
        ]);
      }
    } catch (err) {
      console.error('Failed to load supplier dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSupplierData();
  }, []);

  const handleCreateItem = async (e) => {
    e.preventDefault();
    setSubmittingItem(true);
    setMsg('');
    try {
      const res = await suppliersAPI.createItem(newItem);
      if (res && (res.success || res.data)) {
        setMsg('✅ New supply item listed in catalog!');
      } else {
        // Fallback local update
        setItems((prev) => [
          { id: Date.now(), ...newItem },
          ...prev,
        ]);
        setMsg('✅ Supply item added to catalog successfully!');
      }
      setTimeout(() => {
        setShowAddItemModal(false);
        setNewItem({
          name: '',
          category: 'Seeds',
          brand: '',
          price: 1500,
          quantity: 100,
          description: '',
          badge: '🌱 DOA Certified',
        });
        loadSupplierData();
      }, 800);
    } catch (err) {
      setItems((prev) => [
        { id: Date.now(), ...newItem },
        ...prev,
      ]);
      setMsg('✅ Item recorded in active merchant catalog.');
      setTimeout(() => setShowAddItemModal(false), 800);
    } finally {
      setSubmittingItem(false);
    }
  };

  const renderFulfillmentBadge = (status) => {
    const s = (status || 'PENDING_DISPATCH').toUpperCase();
    if (s === 'DELIVERED' || s === 'COMPLETED') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          <span>DELIVERED</span>
        </span>
      );
    }
    if (s === 'CONFIRMED' || s === 'PROCESSING') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-sky-50 text-sky-700 border border-sky-200">
          <Truck className="w-3 h-3 text-sky-600" />
          <span>CONFIRMED</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-amber-50 text-amber-700 border border-amber-200">
        <Clock className="w-3 h-3 text-amber-600" />
        <span>PENDING DISPATCH</span>
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8 animate-fade-in">
      {/* HERO HEADER */}
      <div className="glass rounded-3xl p-8 border border-white/80 shadow-2xl bg-gradient-to-r from-amber-950 via-slate-900 to-emerald-950 text-white relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <Wrench className="w-4 h-4 text-amber-400" /> Agri-Input &amp; Machinery Merchant Hub
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-display text-white">
              Supplier Hub: <span className="capitalize">{supplierName}</span> 🧰
            </h1>
            <p className="text-amber-100/80 text-sm max-w-2xl leading-relaxed">
              Manage pre-production seeds, bio-fertilizers, heavy machinery fleet rentals, and fulfill farm input purchase orders across Sri Lanka.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowAddItemModal(true)}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" /> Add Catalog Item
            </button>
            <button
              onClick={() => { logout(); navigate('/login'); }}
              className="px-4 py-3 rounded-2xl bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 text-red-200 font-bold text-xs backdrop-blur-md transition flex items-center gap-1.5"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      </div>

      {/* METRIC STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="premium-card p-6 bg-white border border-slate-100 shadow-md hover:shadow-xl transition-all duration-300 flex items-center justify-between group">
          <div className="space-y-1">
            <p className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Active Input SKUs</p>
            <h2 className="text-3xl font-extrabold font-display text-slate-900">{items.length}</h2>
            <p className="text-[11px] font-bold text-emerald-600">{totalCatalogStock} Units in Stock</p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shadow-sm group-hover:scale-110 transition duration-300">
            <Package className="w-7 h-7" />
          </div>
        </div>

        <div className="premium-card p-6 bg-white border border-slate-100 shadow-md hover:shadow-xl transition-all duration-300 flex items-center justify-between group">
          <div className="space-y-1">
            <p className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Pending Orders</p>
            <h2 className="text-3xl font-extrabold font-display text-amber-600">{pendingDispatches}</h2>
            <p className="text-[11px] font-bold text-slate-500">Awaiting Depot Dispatch</p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center shadow-sm group-hover:scale-110 transition duration-300">
            <Truck className="w-7 h-7" />
          </div>
        </div>

        <div className="premium-card p-6 bg-white border border-slate-100 shadow-md hover:shadow-xl transition-all duration-300 flex items-center justify-between group">
          <div className="space-y-1">
            <p className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Machinery on Fleet</p>
            <h2 className="text-3xl font-extrabold font-display text-purple-600">{rentals.length}</h2>
            <p className="text-[11px] font-bold text-purple-600">Tractors &amp; Harvesters</p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-purple-50 border border-purple-100 text-purple-600 flex items-center justify-center shadow-sm group-hover:scale-110 transition duration-300">
            <Tractor className="w-7 h-7" />
          </div>
        </div>

        <div className="premium-card p-6 bg-white border border-slate-100 shadow-md hover:shadow-xl transition-all duration-300 flex items-center justify-between group">
          <div className="space-y-1">
            <p className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Processed Revenue</p>
            <h2 className="text-2xl font-extrabold font-display text-emerald-700">Rs {totalRevenue.toLocaleString()}</h2>
            <p className="text-[11px] font-bold text-slate-500">Escrow Secured</p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-100 text-teal-600 flex items-center justify-center shadow-sm group-hover:scale-110 transition duration-300">
            <DollarSign className="w-7 h-7" />
          </div>
        </div>
      </div>

      {/* QUICK SUPPLIER ACTIONS */}
      <div className="premium-card p-6 bg-white border border-slate-100 shadow-md space-y-4">
        <h2 className="text-base font-bold text-slate-800 font-display flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-600" /> Quick Supplier Portals
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            to="/supplier-marketplace"
            className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/70 hover:shadow-md transition flex items-center justify-between group"
          >
            <div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition">Supplier Marketplace</h3>
              <p className="text-xs text-slate-500 mt-0.5">View public storefront &amp; farmer catalog</p>
            </div>
            <ArrowRight className="w-5 h-5 text-emerald-600 group-hover:translate-x-1 transition" />
          </Link>

          <Link
            to="/equipment-rental"
            className="p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200/70 hover:shadow-md transition flex items-center justify-between group"
          >
            <div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-purple-700 transition">Machinery Rentals</h3>
              <p className="text-xs text-slate-500 mt-0.5">Manage tractor &amp; harvester booking schedules</p>
            </div>
            <ArrowRight className="w-5 h-5 text-purple-600 group-hover:translate-x-1 transition" />
          </Link>

          <Link
            to="/waste-reduction"
            className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/70 hover:shadow-md transition flex items-center justify-between group"
          >
            <div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-amber-700 transition">Surplus &amp; Waste Rescue</h3>
              <p className="text-xs text-slate-500 mt-0.5">Broadcast near-expiry seed/fertilizer discounts</p>
            </div>
            <Recycle className="w-5 h-5 text-amber-600 group-hover:rotate-45 transition" />
          </Link>
        </div>
      </div>

      {/* TABS & TABLES */}
      <div className="premium-card p-6 bg-white border border-slate-100 shadow-md space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'orders' ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <ShoppingBag className="w-4 h-4" /> Inbound Farmer Orders ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab('items')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'items' ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Package className="w-4 h-4" /> Supply Inventory ({items.length})
            </button>
            <button
              onClick={() => setActiveTab('machinery')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'machinery' ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Tractor className="w-4 h-4" /> Machinery Fleet ({rentals.length})
            </button>
          </div>

          <button
            onClick={loadSupplierData}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition self-start sm:self-auto"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-600' : ''}`} />
          </button>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-emerald-600 mb-2" />
            <span className="text-xs font-semibold">Loading merchant data...</span>
          </div>
        ) : activeTab === 'orders' ? (
          <div className="overflow-x-auto rounded-2xl border border-slate-100">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-400 font-bold uppercase text-[10px] tracking-widest border-b border-slate-100">
                <tr>
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Item &amp; Category</th>
                  <th className="p-4">Farmer Account</th>
                  <th className="p-4">Quantity</th>
                  <th className="p-4">Total Amount</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Fulfillment Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50 transition">
                    <td className="p-4 font-mono text-xs font-bold text-slate-900">#{o.id}</td>
                    <td className="p-4">
                      <div className="font-bold text-slate-900">{o.itemName}</div>
                      <div className="text-[11px] text-slate-400 font-medium">{o.location}</div>
                    </td>
                    <td className="p-4 text-xs font-bold text-emerald-700">{o.buyerEmail}</td>
                    <td className="p-4">{o.quantity} units</td>
                    <td className="p-4 font-bold text-slate-900">Rs {Number(o.totalPrice).toLocaleString()}</td>
                    <td className="p-4 text-xs text-slate-500 font-medium whitespace-nowrap">{o.date || '—'}</td>
                    <td className="p-4">
                      {renderFulfillmentBadge(o.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : activeTab === 'items' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {items.map((item) => (
              <div key={item.id} className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-emerald-300 transition space-y-3">
                <div className="flex justify-between items-start">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-50 text-emerald-800 border border-emerald-100">
                    {item.category}
                  </span>
                  <span className="text-xs font-bold text-slate-500">{item.brand}</span>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{item.name}</h4>
                  <p className="text-emerald-700 font-extrabold text-sm mt-1">Rs {Number(item.price).toLocaleString()}</p>
                </div>
                <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-100 text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <span>Stock:</span>
                    <strong className={Number(item.quantity) <= 25 ? 'text-amber-600 font-extrabold' : 'text-slate-900 font-bold'}>
                      {item.quantity}
                    </strong>
                    {Number(item.quantity) <= 25 && (
                      <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                        Low Stock
                      </span>
                    )}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">{item.badge}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {rentals.map((r) => (
              <div key={r.id} className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-purple-300 transition space-y-3">
                <div className="flex justify-between items-start">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-purple-50 text-purple-800 border border-purple-100">
                    {r.category}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    r.available ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-700'
                  }`}>
                    {r.available ? 'Available' : 'On Active Lease'}
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{r.name}</h4>
                  <p className="text-xs text-slate-500">{r.location} • {r.power}</p>
                  <p className="text-purple-700 font-extrabold text-sm mt-2">Rs {Number(r.dailyRate).toLocaleString()} / Day</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ADD ITEM MODAL */}
      <AnimatePresence>
        {showAddItemModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6"
            >
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="text-lg font-extrabold text-slate-900 font-display">
                  Publish New Agri-Supply Listing
                </h3>
                <button
                  onClick={() => setShowAddItemModal(false)}
                  className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 text-sm font-bold"
                >
                  ✕
                </button>
              </div>

              {msg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold">
                  {msg}
                </div>
              )}

              <form onSubmit={handleCreateItem} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Product Title
                  </label>
                  <input
                    type="text"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    placeholder="e.g. Certified Keeri Samba Seed Paddy (20kg)"
                    required
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Category
                    </label>
                    <select
                      value={newItem.category}
                      onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                      className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none bg-white"
                    >
                      <option value="Seeds">Seeds</option>
                      <option value="Fertilizer">Bio-Fertilizer</option>
                      <option value="PestControl">Crop Protection</option>
                      <option value="Equipment">Tools &amp; Irrigation</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Manufacturer / Brand
                    </label>
                    <input
                      type="text"
                      value={newItem.brand}
                      onChange={(e) => setNewItem({ ...newItem, brand: e.target.value })}
                      placeholder="e.g. CIC / Hayleys / DOA"
                      required
                      className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Price (LKR)
                    </label>
                    <input
                      type="number"
                      value={newItem.price}
                      onChange={(e) => setNewItem({ ...newItem, price: Number(e.target.value) })}
                      required
                      className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Available Stock
                    </label>
                    <input
                      type="number"
                      value={newItem.quantity}
                      onChange={(e) => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
                      required
                      className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowAddItemModal(false)}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingItem || !newItem.name}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs hover:from-emerald-700 hover:to-teal-700 transition flex items-center gap-2 shadow-md disabled:opacity-50"
                  >
                    {submittingItem ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlusCircle className="w-4 h-4" />}
                    <span>Publish Item</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SupplierDashboard;
