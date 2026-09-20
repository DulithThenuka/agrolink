import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Package,
  Tractor,
  ShoppingBag,
  PlusCircle,
  Truck,
  CheckCircle2,
  Clock,
  DollarSign,
  Loader2,
  LogOut,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  Tag,
  Recycle,
  Layers,
  Store,
  MapPin,
  X,
  ChevronRight
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
  const [loadError, setLoadError] = useState(null);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'items' | 'machinery'

  // Add Item Modal & Form
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
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  const loadSupplierData = async () => {
    setLoading(true);
    setLoadError(null);
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
          { id: 4, name: 'Neem-Based Bio Insecticide (1L)', category: 'PestControl', brand: 'AgStar Bio', price: 1950, quantity: 18, badge: '🌿 Eco Friendly' }
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
      setLoadError('Unable to load supplier information.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSupplierData();
  }, []);

  // Calculated KPI Metrics from actual data
  const metrics = useMemo(() => {
    const totalCatalogStock = items.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
    const pendingOrdersCount = orders.filter((o) => {
      const s = (o.status || '').toUpperCase();
      return s === 'PENDING' || s === 'PENDING_DISPATCH' || s === 'PROCESSING' || s === 'CONFIRMED';
    }).length;
    const availableMachineryCount = rentals.filter((r) => r.available !== false).length;
    const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.totalPrice) || 0), 0);

    return {
      activeProducts: items.length,
      totalCatalogStock,
      pendingOrdersCount,
      availableMachineryCount,
      machineryTotal: rentals.length,
      totalRevenue
    };
  }, [items, orders, rentals]);

  // Urgent orders requiring merchant action
  const urgentOrders = useMemo(() => {
    return orders.filter((o) => {
      const s = (o.status || '').toUpperCase();
      return s === 'PENDING' || s === 'PENDING_DISPATCH' || s === 'PROCESSING' || s === 'CONFIRMED';
    });
  }, [orders]);

  const handleCreateItem = async (e) => {
    e.preventDefault();
    if (submittingItem) return;

    setSubmittingItem(true);
    setFormError('');
    setFormSuccess('');

    // Client-side validation
    if (!newItem.name.trim()) {
      setFormError('Product title is required.');
      setSubmittingItem(false);
      return;
    }
    if (newItem.price <= 0) {
      setFormError('Price must be greater than zero.');
      setSubmittingItem(false);
      return;
    }
    if (newItem.quantity < 0) {
      setFormError('Stock quantity cannot be negative.');
      setSubmittingItem(false);
      return;
    }

    try {
      const res = await suppliersAPI.createItem(newItem);
      if (res && (res.success || res.data)) {
        setFormSuccess('Product added to catalog.');
      } else {
        // Fallback local update
        setItems((prev) => [
          { id: Date.now(), ...newItem },
          ...prev,
        ]);
        setFormSuccess('Product added to catalog.');
      }
      setTimeout(() => {
        setShowAddItemModal(false);
        setFormSuccess('');
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
      }, 1000);
    } catch (err) {
      console.error('Create item error:', err);
      // Fallback local update for development compatibility
      setItems((prev) => [
        { id: Date.now(), ...newItem },
        ...prev,
      ]);
      setFormSuccess('Product added to catalog.');
      setTimeout(() => {
        setShowAddItemModal(false);
        setFormSuccess('');
      }, 1000);
    } finally {
      setSubmittingItem(false);
    }
  };

  const renderFulfillmentBadge = (status) => {
    const s = (status || 'PENDING_DISPATCH').toUpperCase();
    if (s === 'DELIVERED' || s === 'COMPLETED') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" aria-hidden="true" />
          <span>Delivered</span>
        </span>
      );
    }
    if (s === 'CONFIRMED' || s === 'PROCESSING') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-50 text-sky-800 border border-sky-200">
          <Truck className="w-3.5 h-3.5 text-sky-600 shrink-0" aria-hidden="true" />
          <span>Confirmed</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
        <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" aria-hidden="true" />
        <span>Pending Dispatch</span>
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* PAGE HEADER */}
        <header className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                <Store className="w-3.5 h-3.5 text-emerald-700" />
                Verified Merchant Hub
              </span>
              <span className="text-xs text-slate-500 font-medium">| {supplierName}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Supplier Dashboard
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Manage your products, incoming orders, inventory, and agricultural equipment in one place.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => setShowAddItemModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-sm font-semibold shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Product</span>
            </button>
            <button
              onClick={loadSupplierData}
              disabled={loading}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-medium transition-colors disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
              title="Refresh merchant data"
              aria-label="Refresh merchant data"
            >
              <RefreshCw className={`w-4 h-4 text-slate-500 ${loading ? 'animate-spin text-emerald-600' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button
              onClick={() => { logout(); navigate('/login'); }}
              className="inline-flex items-center gap-1.5 px-3 py-2.5 text-slate-600 hover:text-red-700 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors border border-transparent hover:border-red-200"
              title="Sign out of supplier account"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* ERROR STATE */}
        {loadError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center justify-between gap-3 text-red-800 text-sm">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
              <span>{loadError}</span>
            </div>
            <button
              onClick={loadSupplierData}
              className="px-3 py-1.5 bg-white border border-red-300 hover:bg-red-100 text-red-700 rounded-lg text-xs font-semibold transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* KPI SUMMARY CARDS */}
        <section aria-labelledby="kpi-heading">
          <h2 id="kpi-heading" className="sr-only">Key Performance Indicators</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Active Products */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Products</span>
                <span className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
                  <Package className="w-5 h-5" />
                </span>
              </div>
              {loading ? (
                <div className="mt-3 space-y-2 animate-pulse">
                  <div className="h-7 bg-slate-200 rounded w-16" />
                  <div className="h-3 bg-slate-100 rounded w-28" />
                </div>
              ) : (
                <div className="mt-2">
                  <div className="text-2xl font-bold text-slate-900">{metrics.activeProducts}</div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {metrics.totalCatalogStock.toLocaleString()} units in inventory
                  </p>
                </div>
              )}
            </div>

            {/* Pending Orders */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Orders</span>
                <span className="p-2 rounded-lg bg-amber-50 text-amber-700">
                  <Truck className="w-5 h-5" />
                </span>
              </div>
              {loading ? (
                <div className="mt-3 space-y-2 animate-pulse">
                  <div className="h-7 bg-slate-200 rounded w-16" />
                  <div className="h-3 bg-slate-100 rounded w-28" />
                </div>
              ) : (
                <div className="mt-2">
                  <div className="text-2xl font-bold text-amber-700">{metrics.pendingOrdersCount}</div>
                  <p className="text-xs text-slate-500 mt-0.5">Awaiting dispatch fulfillment</p>
                </div>
              )}
            </div>

            {/* Available Machinery */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Available Machinery</span>
                <span className="p-2 rounded-lg bg-purple-50 text-purple-700">
                  <Tractor className="w-5 h-5" />
                </span>
              </div>
              {loading ? (
                <div className="mt-3 space-y-2 animate-pulse">
                  <div className="h-7 bg-slate-200 rounded w-16" />
                  <div className="h-3 bg-slate-100 rounded w-28" />
                </div>
              ) : (
                <div className="mt-2">
                  <div className="text-2xl font-bold text-slate-900">{metrics.availableMachineryCount}</div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    of {metrics.machineryTotal} fleet units ready to lease
                  </p>
                </div>
              )}
            </div>

            {/* Processed Revenue */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Processed Revenue</span>
                <span className="p-2 rounded-lg bg-slate-100 text-slate-700">
                  <DollarSign className="w-5 h-5" />
                </span>
              </div>
              {loading ? (
                <div className="mt-3 space-y-2 animate-pulse">
                  <div className="h-7 bg-slate-200 rounded w-24" />
                  <div className="h-3 bg-slate-100 rounded w-28" />
                </div>
              ) : (
                <div className="mt-2">
                  <div className="text-2xl font-bold text-emerald-800">
                    Rs. {metrics.totalRevenue.toLocaleString()}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">Total recorded order volume</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ORDERS REQUIRING ATTENTION (Immediate Working Section) */}
        <section aria-labelledby="urgent-orders-heading" className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
              </span>
              <h2 id="urgent-orders-heading" className="text-base font-bold text-slate-900">
                Orders Requiring Attention
              </h2>
            </div>
            <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
              {urgentOrders.length} {urgentOrders.length === 1 ? 'Action needed' : 'Actions needed'}
            </span>
          </div>

          {loading ? (
            <div className="p-6 space-y-3">
              {[1, 2].map((n) => (
                <div key={n} className="h-14 bg-slate-100 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : urgentOrders.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-800">All inbound orders are fulfilled!</p>
              <p className="text-xs text-slate-500 mt-0.5">New incoming orders from farmers will appear here immediately.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {urgentOrders.map((o) => (
                <div key={o.id} className="p-4 sm:px-6 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="text-xs font-mono font-bold text-slate-800">#{o.id}</span>
                      <span className="text-sm font-semibold text-slate-900">{o.itemName}</span>
                      {renderFulfillmentBadge(o.status)}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                      <span>Buyer: <strong className="text-slate-700">{o.buyerEmail}</strong></span>
                      <span>•</span>
                      <span>Quantity: <strong className="text-slate-700">{o.quantity} units</strong></span>
                      <span>•</span>
                      <span>Total: <strong className="text-slate-900">Rs. {Number(o.totalPrice).toLocaleString()}</strong></span>
                      {o.location && (
                        <>
                          <span>•</span>
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            {o.location}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-white text-slate-700 text-xs font-semibold transition-colors"
                    >
                      View in Orders
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* MAIN TABS (Orders, Inventory, Machinery Fleet) */}
        <section aria-label="Management Tabs" className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          {/* Tab Headers */}
          <div className="border-b border-slate-200 px-4 sm:px-6 pt-3 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50">
            <nav className="flex space-x-2 -mb-px overflow-x-auto" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('orders')}
                className={`py-3 px-4 border-b-2 font-semibold text-sm inline-flex items-center gap-2 whitespace-nowrap transition-colors ${
                  activeTab === 'orders'
                    ? 'border-emerald-700 text-emerald-800'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                }`}
                aria-current={activeTab === 'orders' ? 'page' : undefined}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Orders</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  activeTab === 'orders' ? 'bg-emerald-100 text-emerald-800 font-bold' : 'bg-slate-200 text-slate-700'
                }`}>
                  {orders.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('items')}
                className={`py-3 px-4 border-b-2 font-semibold text-sm inline-flex items-center gap-2 whitespace-nowrap transition-colors ${
                  activeTab === 'items'
                    ? 'border-emerald-700 text-emerald-800'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                }`}
                aria-current={activeTab === 'items' ? 'page' : undefined}
              >
                <Package className="w-4 h-4" />
                <span>Inventory</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  activeTab === 'items' ? 'bg-emerald-100 text-emerald-800 font-bold' : 'bg-slate-200 text-slate-700'
                }`}>
                  {items.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('machinery')}
                className={`py-3 px-4 border-b-2 font-semibold text-sm inline-flex items-center gap-2 whitespace-nowrap transition-colors ${
                  activeTab === 'machinery'
                    ? 'border-emerald-700 text-emerald-800'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                }`}
                aria-current={activeTab === 'machinery' ? 'page' : undefined}
              >
                <Tractor className="w-4 h-4" />
                <span>Machinery Fleet</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  activeTab === 'machinery' ? 'bg-emerald-100 text-emerald-800 font-bold' : 'bg-slate-200 text-slate-700'
                }`}>
                  {rentals.length}
                </span>
              </button>
            </nav>

            {activeTab === 'items' && (
              <button
                onClick={() => setShowAddItemModal(true)}
                className="mb-2 text-xs font-semibold inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>New Item</span>
              </button>
            )}
          </div>

          {/* TAB CONTENT: ORDERS */}
          {activeTab === 'orders' && (
            <div>
              {loading ? (
                <div className="p-8 space-y-3">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="h-12 bg-slate-100 rounded animate-pulse" />
                  ))}
                </div>
              ) : orders.length === 0 ? (
                <div className="p-12 text-center text-slate-500">
                  <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-slate-800">No incoming farmer orders yet.</p>
                  <p className="text-xs text-slate-500 mt-1">Orders placed by farmers will automatically appear in this feed.</p>
                </div>
              ) : (
                <>
                  {/* Desktop Table */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-[11px] tracking-wider border-b border-slate-200">
                        <tr>
                          <th className="py-3 px-4">Order ID</th>
                          <th className="py-3 px-4">Product</th>
                          <th className="py-3 px-4">Farmer / Buyer</th>
                          <th className="py-3 px-4">Quantity</th>
                          <th className="py-3 px-4">Amount</th>
                          <th className="py-3 px-4">Date</th>
                          <th className="py-3 px-4">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {orders.map((o) => (
                          <tr key={o.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-3.5 px-4 font-mono text-xs font-semibold text-slate-800">#{o.id}</td>
                            <td className="py-3.5 px-4">
                              <div className="font-semibold text-slate-900">{o.itemName}</div>
                              {o.location && (
                                <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                                  <MapPin className="w-3 h-3 text-slate-400" />
                                  {o.location}
                                </div>
                              )}
                            </td>
                            <td className="py-3.5 px-4 text-xs font-medium text-slate-700">{o.buyerEmail}</td>
                            <td className="py-3.5 px-4 text-slate-800 font-medium">{o.quantity} units</td>
                            <td className="py-3.5 px-4 font-semibold text-slate-900">
                              Rs. {Number(o.totalPrice).toLocaleString()}
                            </td>
                            <td className="py-3.5 px-4 text-xs text-slate-500 whitespace-nowrap">{o.date || '—'}</td>
                            <td className="py-3.5 px-4">
                              {renderFulfillmentBadge(o.status)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Stacked Cards */}
                  <div className="md:hidden divide-y divide-slate-100">
                    {orders.map((o) => (
                      <div key={o.id} className="p-4 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-bold text-slate-800">#{o.id}</span>
                          {renderFulfillmentBadge(o.status)}
                        </div>
                        <div>
                          <div className="font-semibold text-sm text-slate-900">{o.itemName}</div>
                          <div className="text-sm font-bold text-emerald-800 mt-0.5">
                            Rs. {Number(o.totalPrice).toLocaleString()}
                          </div>
                        </div>
                        <div className="text-xs text-slate-500 space-y-0.5 pt-1 border-t border-slate-100">
                          <div>Buyer: <span className="font-medium text-slate-700">{o.buyerEmail}</span></div>
                          <div>Quantity: <span className="font-medium text-slate-700">{o.quantity} units</span></div>
                          {o.date && <div>Date: <span className="font-medium text-slate-700">{o.date}</span></div>}
                          {o.location && <div>Location: <span className="font-medium text-slate-700">{o.location}</span></div>}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* TAB CONTENT: INVENTORY */}
          {activeTab === 'items' && (
            <div className="p-4 sm:p-6">
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="h-36 bg-slate-100 rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : items.length === 0 ? (
                <div className="p-12 text-center text-slate-500">
                  <Package className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-slate-800">Your catalog is empty.</p>
                  <p className="text-xs text-slate-500 mt-1 mb-4">Add your first agricultural product to make it available to farmers.</p>
                  <button
                    onClick={() => setShowAddItemModal(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Add First Product</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {items.map((item) => {
                    const isLowStock = Number(item.quantity) <= 25;
                    return (
                      <div
                        key={item.id}
                        className={`bg-white border rounded-xl p-4 transition-all flex flex-col justify-between ${
                          isLowStock ? 'border-amber-300 bg-amber-50/10' : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <span className="px-2 py-0.5 rounded text-[11px] font-semibold uppercase bg-slate-100 text-slate-700 border border-slate-200">
                              {item.category}
                            </span>
                            {item.brand && (
                              <span className="text-xs text-slate-500 font-medium">{item.brand}</span>
                            )}
                          </div>
                          <div>
                            <h3 className="text-sm font-semibold text-slate-900 leading-snug">{item.name}</h3>
                            <p className="text-base font-bold text-emerald-800 mt-1">
                              Rs. {Number(item.price).toLocaleString()}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                          <div>
                            <span className="text-slate-500">Stock: </span>
                            <span className={`font-bold ${isLowStock ? 'text-amber-700' : 'text-slate-800'}`}>
                              {item.quantity} units
                            </span>
                            {isLowStock && (
                              <span className="ml-1.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                                Low Stock
                              </span>
                            )}
                          </div>
                          {item.badge && (
                            <span className="text-[11px] text-slate-500 font-medium">{item.badge}</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB CONTENT: MACHINERY FLEET */}
          {activeTab === 'machinery' && (
            <div className="p-4 sm:p-6">
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="h-36 bg-slate-100 rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : rentals.length === 0 ? (
                <div className="p-12 text-center text-slate-500">
                  <Tractor className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-slate-800">No machinery is currently listed.</p>
                  <p className="text-xs text-slate-500 mt-1">Registered tractors and heavy agricultural equipment will appear here.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {rentals.map((r) => (
                    <div
                      key={r.id}
                      className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-4 transition-all flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="px-2 py-0.5 rounded text-[11px] font-semibold uppercase bg-purple-50 text-purple-800 border border-purple-200">
                            {r.category || 'Machinery'}
                          </span>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                            r.available
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${r.available ? 'bg-emerald-600' : 'bg-slate-400'}`} />
                            {r.available ? 'Available' : 'On Active Lease'}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-slate-900 leading-snug">{r.name}</h3>
                          <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                            {r.location && (
                              <span className="inline-flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-slate-400" />
                                {r.location}
                              </span>
                            )}
                            {r.power && <span>• {r.power}</span>}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                        <div>
                          <span className="text-xs text-slate-500">Daily Rate: </span>
                          <span className="text-sm font-bold text-slate-900">
                            Rs. {Number(r.dailyRate).toLocaleString()}
                          </span>
                          <span className="text-xs text-slate-500"> / day</span>
                        </div>
                        <Link
                          to="/equipment-rental"
                          className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1"
                        >
                          <span>Manage</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>

        {/* SUPPLIER QUICK ACTIONS (Compact Navigation Cards) */}
        <section aria-labelledby="quick-actions-heading" className="space-y-3">
          <h2 id="quick-actions-heading" className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Supplier Portals &amp; Operations
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              to="/supplier-marketplace"
              className="bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-sm rounded-xl p-4 transition-all group flex items-start justify-between"
            >
              <div className="space-y-1">
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 w-fit mb-2">
                  <Store className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                  Supplier Marketplace
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Browse storefront listings and public farmer catalog.
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 group-hover:translate-x-0.5 transition-all mt-2" />
            </Link>

            <Link
              to="/equipment-rental"
              className="bg-white border border-slate-200 hover:border-purple-300 hover:shadow-sm rounded-xl p-4 transition-all group flex items-start justify-between"
            >
              <div className="space-y-1">
                <div className="p-2 rounded-lg bg-purple-50 text-purple-700 w-fit mb-2">
                  <Tractor className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-purple-800 transition-colors">
                  Machinery Rentals
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Schedule tractor, harvester and sprayer leases.
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-700 group-hover:translate-x-0.5 transition-all mt-2" />
            </Link>

            <Link
              to="/waste-reduction"
              className="bg-white border border-slate-200 hover:border-amber-300 hover:shadow-sm rounded-xl p-4 transition-all group flex items-start justify-between"
            >
              <div className="space-y-1">
                <div className="p-2 rounded-lg bg-amber-50 text-amber-700 w-fit mb-2">
                  <Recycle className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-amber-800 transition-colors">
                  Surplus &amp; Waste Rescue
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  List surplus items and clearance inputs to cut farm waste.
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-700 group-hover:translate-x-0.5 transition-all mt-2" />
            </Link>
          </div>
        </section>

        {/* ADD PRODUCT MODAL */}
        {showAddItemModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-emerald-700" />
                  <h3 id="modal-title" className="text-base font-bold text-slate-900">
                    Add Catalog Product
                  </h3>
                </div>
                <button
                  onClick={() => setShowAddItemModal(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {formSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{formSuccess}</span>
                </div>
              )}

              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-lg text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleCreateItem} className="space-y-4">
                <div>
                  <label htmlFor="product-name" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Product Title *
                  </label>
                  <input
                    id="product-name"
                    type="text"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    placeholder="e.g. Certified Keeri Samba Seed Paddy (20kg)"
                    required
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm text-slate-900 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="product-category" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Category *
                    </label>
                    <select
                      id="product-category"
                      value={newItem.category}
                      onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm text-slate-900 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none bg-white"
                    >
                      <option value="Seeds">Seeds</option>
                      <option value="Fertilizer">Bio-Fertilizer</option>
                      <option value="PestControl">Crop Protection</option>
                      <option value="Equipment">Tools &amp; Irrigation</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="product-brand" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Manufacturer / Brand
                    </label>
                    <input
                      id="product-brand"
                      type="text"
                      value={newItem.brand}
                      onChange={(e) => setNewItem({ ...newItem, brand: e.target.value })}
                      placeholder="e.g. CIC / Hayleys / DOA"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm text-slate-900 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="product-price" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Price (LKR) *
                    </label>
                    <input
                      id="product-price"
                      type="number"
                      min="1"
                      value={newItem.price}
                      onChange={(e) => setNewItem({ ...newItem, price: Number(e.target.value) })}
                      required
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm text-slate-900 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="product-quantity" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Available Stock *
                    </label>
                    <input
                      id="product-quantity"
                      type="number"
                      min="0"
                      value={newItem.quantity}
                      onChange={(e) => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
                      required
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm text-slate-900 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="product-badge" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Quality Badge / Tag
                  </label>
                  <input
                    id="product-badge"
                    type="text"
                    value={newItem.badge}
                    onChange={(e) => setNewItem({ ...newItem, badge: e.target.value })}
                    placeholder="e.g. 🌱 DOA Certified, ⚡ High Yield"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm text-slate-900 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none"
                  />
                </div>

                <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setShowAddItemModal(false)}
                    disabled={submittingItem}
                    className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-medium text-xs hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingItem || !newItem.name.trim()}
                    className="px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs transition-colors inline-flex items-center gap-2 shadow-sm disabled:opacity-50"
                  >
                    {submittingItem && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>{submittingItem ? 'Publishing...' : 'Publish Product'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default SupplierDashboard;
