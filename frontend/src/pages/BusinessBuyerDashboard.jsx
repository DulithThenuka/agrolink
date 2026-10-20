import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Building2,
  FileText,
  MessageSquare,
  TrendingUp,
  CheckCircle2,
  Clock,
  Truck,
  Loader2,
  LogOut,
  ArrowRight,
  ArrowUpRight,
  Sprout,
  BarChart3,
  QrCode,
  Scale,
  Package,
  AlertCircle,
  AlertTriangle,
  RefreshCw,
  ShieldCheck,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ordersAPI, contractFarmingAPI, negotiationAPI } from '../services/api';

export const BusinessBuyerDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const companyName = user?.name || (user?.email ? user.email.split('@')[0] : 'Enterprise Buyer');

  const [orders, setOrders] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [negotiations, setNegotiations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadEnterpriseData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [ordersRes, contractsRes, negRes] = await Promise.allSettled([
        ordersAPI.getMyOrders({ page: 0, size: 10 }),
        contractFarmingAPI.getAll(),
        negotiationAPI.getNegotiation(),
      ]);

      // 1. Process Orders (no fake fallbacks)
      if (ordersRes.status === 'fulfilled' && ordersRes.value) {
        const val = ordersRes.value.data !== undefined ? ordersRes.value.data : ordersRes.value;
        const list = val?.content || (Array.isArray(val) ? val : []);
        setOrders(list);
      } else {
        setOrders([]);
      }

      // 2. Process Contracts (no fake fallbacks)
      if (contractsRes.status === 'fulfilled' && contractsRes.value) {
        const val = contractsRes.value.data !== undefined ? contractsRes.value.data : contractsRes.value;
        const list = Array.isArray(val) ? val : [];
        setContracts(list);
      } else {
        setContracts([]);
      }

      // 3. Process Negotiations (no fake fallbacks)
      if (negRes.status === 'fulfilled' && negRes.value) {
        const val = negRes.value.data !== undefined ? negRes.value.data : negRes.value;
        let list = [];
        if (Array.isArray(val)) {
          list = val;
        } else if (val && typeof val === 'object' && (val.id || val.cropName)) {
          list = [val];
        }
        setNegotiations(list);
      } else {
        setNegotiations([]);
      }
    } catch (err) {
      console.error('Failed to load enterprise buyer data:', err);
      setError('Unable to load some procurement data. Please try again.');
      setOrders([]);
      setContracts([]);
      setNegotiations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEnterpriseData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // KPIs derived solely from actual loaded data
  const totalProcuredKg = orders.reduce((acc, curr) => acc + (Number(curr.quantity) || 0), 0);
  const totalProcuredMT =
    totalProcuredKg >= 1000
      ? `${(totalProcuredKg / 1000).toFixed(1)} MT`
      : `${totalProcuredKg.toLocaleString()} kg`;
  const totalProcurementValue = orders.reduce((acc, curr) => acc + (Number(curr.totalPrice) || 0), 0);

  // Status badge helper adhering to elevated visual formatting
  const renderStatusBadge = (status) => {
    const s = (status || 'PENDING').toUpperCase();

    if (['DELIVERED', 'COMPLETED', 'CONFIRMED', 'PAID'].includes(s)) {
      const label = s === 'PAID' ? 'Paid' : s === 'CONFIRMED' ? 'Confirmed' : 'Delivered';
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/90 shadow-2xs">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>{label}</span>
        </span>
      );
    }

    if (['IN_TRANSIT', 'DISPATCHED', 'SHIPPED', 'COLLECTED', 'REEFER_TRANSIT', 'DRIVER_ASSIGNED', 'TRANSPORT_REQUESTED'].includes(s)) {
      const label = s === 'REEFER_TRANSIT' ? 'Reefer Transit' : s === 'DRIVER_ASSIGNED' ? 'Driver Assigned' : 'In Transit';
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-50 text-sky-800 border border-sky-200/90 shadow-2xs">
          <Truck className="w-3.5 h-3.5 text-sky-600 shrink-0" />
          <span>{label}</span>
        </span>
      );
    }

    if (['PENDING', 'PLACED', 'FARMER_ACCEPTED', 'PROCESSING'].includes(s)) {
      const label = s === 'FARMER_ACCEPTED' ? 'Accepted' : 'Pending';
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-200/90 shadow-2xs">
          <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span>{label}</span>
        </span>
      );
    }

    if (['DISPUTED', 'ESCROW_LOCKED'].includes(s)) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200/90 shadow-2xs">
          <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
          <span>Disputed</span>
        </span>
      );
    }

    if (['CANCELLED', 'REJECTED'].includes(s)) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200/90 shadow-2xs">
          <AlertCircle className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span>Cancelled</span>
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200/90 shadow-2xs">
        <Package className="w-3.5 h-3.5 text-slate-500 shrink-0" />
        <span>{status}</span>
      </span>
    );
  };

  const renderNegotiationStatusBadge = (status) => {
    const s = (status || '').toUpperCase();
    if (s === 'AGREEMENT_REACHED' || s === 'CONTRACT_CREATED') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/90 shadow-2xs">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>Agreement Reached</span>
        </span>
      );
    }
    if (s === 'COUNTER_OFFER_RECEIVED' || s === 'NEGOTIATING') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-200/90 shadow-2xs">
          <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span>Counter Offer</span>
        </span>
      );
    }
    if (s === 'REJECTED') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200/90 shadow-2xs">
          <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
          <span>Rejected</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200/90 shadow-2xs">
        <span>{status || 'Active'}</span>
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in text-slate-900">
      
      {/* ==================================================================== */}
      {/* 1. COMPACT DASHBOARD HEADER                                          */}
      {/* ==================================================================== */}
      <header className="relative bg-gradient-to-br from-white via-emerald-50/20 to-slate-50/60 p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-100/30 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50/90 border border-emerald-200/80 text-emerald-800 text-xs font-bold uppercase tracking-wider shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <Building2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span>Enterprise Procurement Desk</span>
          </div>

          <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900">
            Welcome back, <span className="bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-900 bg-clip-text text-transparent capitalize">{companyName}</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-2xl leading-relaxed">
            Monitor verified crop sourcing, active forward farming agreements, wholesale negotiations, and supply quotas from a unified enterprise console.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto relative z-10">
          <Link
            to="/crops"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-semibold transition shadow-xs hover:shadow-sm"
          >
            <Sprout className="w-4 h-4 shrink-0" />
            <span>Browse Crops</span>
          </Link>

          <Link
            to="/contracts"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 text-xs sm:text-sm font-semibold transition shadow-xs"
          >
            <FileText className="w-4 h-4 text-slate-500 shrink-0" />
            <span>Contracts Hub</span>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-700 text-xs sm:text-sm font-semibold transition shadow-xs cursor-pointer"
            title="Sign out of enterprise account"
          >
            <LogOut className="w-4 h-4 text-slate-400 hover:text-rose-600 shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Error alert if any */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm font-medium flex items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={loadEnterpriseData}
            className="text-xs font-bold text-rose-900 hover:underline inline-flex items-center gap-1 cursor-pointer bg-white px-2.5 py-1 rounded-md border border-rose-200"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Retry</span>
          </button>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 2. PROCUREMENT SUMMARY (Elevated KPI Cards)                          */}
      {/* ==================================================================== */}
      <section aria-label="Procurement Summary" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          [1, 2, 3, 4].map((i) => (
            <div key={i} className="agri-card p-5 bg-white space-y-3 animate-pulse border border-slate-200">
              <div className="h-3 w-28 bg-slate-200 rounded"></div>
              <div className="h-8 w-24 bg-slate-100 rounded"></div>
              <div className="h-2.5 w-32 bg-slate-100 rounded"></div>
            </div>
          ))
        ) : (
          <>
            {/* KPI 1: Total Procurement Volume */}
            <div className="agri-card p-5 bg-white flex items-start justify-between border border-slate-200/90 hover:border-emerald-300 hover:shadow-md transition-all duration-200 group">
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Total Volume
                </span>
                <p className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {totalProcuredMT}
                </p>
                <div className="flex items-center gap-1 text-slate-500 text-xs font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>{totalProcuredKg.toLocaleString()} kg fulfilled</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100/60 text-emerald-700 flex items-center justify-center border border-emerald-200/70 shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                <Scale className="w-6 h-6" />
              </div>
            </div>

            {/* KPI 2: Active Forward Contracts */}
            <div className="agri-card p-5 bg-white flex items-start justify-between border border-slate-200/90 hover:border-indigo-300 hover:shadow-md transition-all duration-200 group">
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Forward Contracts
                </span>
                <p className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {contracts.length}
                </p>
                <div className="flex items-center gap-1 text-slate-500 text-xs font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                  <span>Direct producer agreements</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100/60 text-indigo-700 flex items-center justify-center border border-indigo-200/70 shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
            </div>

            {/* KPI 3: Active Negotiations */}
            <div className="agri-card p-5 bg-white flex items-start justify-between border border-slate-200/90 hover:border-amber-300 hover:shadow-md transition-all duration-200 group">
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Active Negotiations
                </span>
                <p className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {negotiations.length}
                </p>
                <div className="flex items-center gap-1 text-slate-500 text-xs font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  <span>Open farmgate discussions</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100/60 text-amber-700 flex items-center justify-center border border-amber-200/70 shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                <MessageSquare className="w-6 h-6" />
              </div>
            </div>

            {/* KPI 4: Procurement Value */}
            <div className="agri-card p-5 bg-white flex items-start justify-between border border-slate-200/90 hover:border-emerald-300 hover:shadow-md transition-all duration-200 group">
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Procurement Value
                </span>
                <p className="font-display text-2xl sm:text-3xl font-extrabold text-emerald-800 tracking-tight">
                  <span className="text-sm font-semibold text-slate-400 mr-1 font-sans">Rs.</span>
                  {totalProcurementValue.toLocaleString()}
                </p>
                <div className="flex items-center gap-1 text-slate-500 text-xs font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                  <span>Cumulative order volume</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-100/60 text-emerald-800 flex items-center justify-center border border-emerald-200/70 shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>
          </>
        )}
      </section>

      {/* ==================================================================== */}
      {/* 3. PROCUREMENT ACTIONS                                               */}
      {/* ==================================================================== */}
      <section aria-label="Procurement Actions" className="agri-card p-6 bg-white space-y-4 border border-slate-200/90 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h2 className="font-display text-lg font-bold text-slate-900 tracking-tight">
              Operational Modules
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Direct access to wholesale crop sourcing, contract commitments, and agricultural demand forecasting.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Action 1: Source Crops */}
          <Link
            to="/crops"
            className="p-4 rounded-xl border border-slate-200/80 bg-white hover:border-emerald-500 hover:shadow-xs transition group flex flex-col justify-between space-y-3"
          >
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-100 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <Sprout className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 group-hover:translate-x-1 transition-transform" />
            </div>
            <div>
              <h3 className="font-display text-sm font-bold text-slate-900 group-hover:text-emerald-800 transition">
                Source Crops
              </h3>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed font-medium">
                Browse certified farm listings and available harvests across provinces.
              </p>
            </div>
          </Link>

          {/* Action 2: Manage Contracts */}
          <Link
            to="/contracts"
            className="p-4 rounded-xl border border-slate-200/80 bg-white hover:border-indigo-500 hover:shadow-xs transition group flex flex-col justify-between space-y-3"
          >
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-800 border border-indigo-100 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <FileText className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-700 group-hover:translate-x-1 transition-transform" />
            </div>
            <div>
              <h3 className="font-display text-sm font-bold text-slate-900 group-hover:text-indigo-800 transition">
                Forward Contracts
              </h3>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed font-medium">
                Lock in seasonal harvest pricing and guarantee delivery quotas.
              </p>
            </div>
          </Link>

          {/* Action 3: Review Negotiations */}
          <Link
            to="/negotiation"
            className="p-4 rounded-xl border border-slate-200/80 bg-white hover:border-amber-500 hover:shadow-xs transition group flex flex-col justify-between space-y-3"
          >
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <MessageSquare className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-700 group-hover:translate-x-1 transition-transform" />
            </div>
            <div>
              <h3 className="font-display text-sm font-bold text-slate-900 group-hover:text-amber-800 transition">
                Trade Negotiations
              </h3>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed font-medium">
                Respond to counter-offers and finalize direct agricultural pricing.
              </p>
            </div>
          </Link>

          {/* Action 4: Demand Intelligence */}
          <Link
            to="/demand-forecasting"
            className="p-4 rounded-xl border border-slate-200/80 bg-white hover:border-sky-500 hover:shadow-xs transition group flex flex-col justify-between space-y-3"
          >
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-800 border border-sky-200 flex items-center justify-center group-hover:bg-sky-600 group-hover:text-white transition-colors">
                <BarChart3 className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-sky-700 group-hover:translate-x-1 transition-transform" />
            </div>
            <div>
              <h3 className="font-display text-sm font-bold text-slate-900 group-hover:text-sky-800 transition">
                Demand Intelligence
              </h3>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed font-medium">
                Analyze price trends, national market indices, and consumption patterns.
              </p>
            </div>
          </Link>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 4. RECENT PROCUREMENT ORDERS (Primary Operational Area)              */}
      {/* ==================================================================== */}
      <section aria-label="Recent Procurement Orders" className="agri-card p-6 bg-white space-y-5 border border-slate-200/90 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-lg font-bold text-slate-900 tracking-tight">
                Recent Procurement Orders
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                {orders.length}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Review current purchase orders, logistics dispatches, and verifiable batch codes.
            </p>
          </div>

          <Link
            to="/orders"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-emerald-700 hover:text-emerald-800 group"
          >
            <span>View Full Order Ledger</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-400 space-y-3">
            <Loader2 className="w-7 h-7 animate-spin mx-auto text-emerald-700" />
            <span className="text-xs font-semibold text-slate-500">Loading procurement orders...</span>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12 bg-slate-50/70 rounded-2xl border border-dashed border-slate-200 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center mx-auto text-slate-400 shadow-2xs">
              <Package className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-display text-sm font-bold text-slate-800">
                No procurement orders yet
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">
                Explore available crop listings or initiate forward purchase agreements to begin enterprise procurement.
              </p>
            </div>
            <Link
              to="/crops"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold transition shadow-xs mt-2"
            >
              <Sprout className="w-3.5 h-3.5" />
              <span>Browse Crop Marketplace</span>
            </Link>
          </div>
        ) : (
          <>
            {/* Desktop Orders Table */}
            <div className="hidden md:block overflow-x-auto rounded-xl border border-slate-200/90 shadow-2xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/90 text-slate-600 font-bold uppercase text-[11px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-4">Crop & Batch</th>
                    <th className="py-3.5 px-4">Producer / Seller</th>
                    <th className="py-3.5 px-4">Quantity</th>
                    <th className="py-3.5 px-4">Total Value</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Traceability</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-emerald-50/30 transition-colors">
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-900 text-sm block">
                          {order.cropName || order.crop?.name || 'Procured Crop'}
                        </span>
                        {order.batchCode ? (
                          <span className="inline-flex items-center gap-1 mt-0.5 px-2 py-0.5 rounded bg-slate-100/90 font-mono text-[11px] text-slate-600 border border-slate-200/60">
                            <QrCode className="w-3 h-3 text-slate-400" />
                            {order.batchCode}
                          </span>
                        ) : order.id ? (
                          <span className="text-[11px] font-mono text-slate-400 block mt-0.5">
                            #ORD-{order.id}
                          </span>
                        ) : null}
                      </td>

                      <td className="py-3.5 px-4 text-slate-800 font-medium">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                          <span>{order.farmerName || order.seller || 'Registered Producer'}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-display font-bold text-slate-900 text-sm">
                        {order.quantity ? `${Number(order.quantity).toLocaleString()} kg` : '—'}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-display font-bold text-emerald-800 text-sm">
                          {order.totalPrice ? `Rs. ${Number(order.totalPrice).toLocaleString()}` : '—'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        {renderStatusBadge(order.status || order.statusLabel)}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        {order.batchCode ? (
                          <Link
                            to={`/trace/${order.batchCode}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white font-semibold text-xs border border-emerald-200/80 transition-all shadow-2xs"
                          >
                            <QrCode className="w-3.5 h-3.5" />
                            <span>Trace</span>
                          </Link>
                        ) : (
                          <span className="text-slate-400 text-xs">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Orders Layout (Vertical Cards) */}
            <div className="md:hidden space-y-3">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="p-4 rounded-xl border border-slate-200 bg-white space-y-3 shadow-2xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-display font-bold text-sm text-slate-900">
                        {order.cropName || order.crop?.name || 'Procured Crop'}
                      </h3>
                      {order.batchCode ? (
                        <p className="text-[11px] font-mono text-slate-500 mt-0.5 inline-block bg-slate-100 px-2 py-0.5 rounded border border-slate-200/60">
                          {order.batchCode}
                        </p>
                      ) : order.id ? (
                        <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                          #ORD-{order.id}
                        </p>
                      ) : null}
                    </div>
                    <div>
                      {renderStatusBadge(order.status || order.statusLabel)}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-3 border-t border-slate-100">
                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Seller</span>
                      <span className="font-medium text-slate-800 block truncate mt-0.5">
                        {order.farmerName || order.seller || 'Registered Producer'}
                      </span>
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Quantity</span>
                      <span className="font-display font-bold text-slate-900 block mt-0.5">
                        {order.quantity ? `${Number(order.quantity).toLocaleString()} kg` : '—'}
                      </span>
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Order Value</span>
                      <span className="font-display font-bold text-emerald-800 block mt-0.5">
                        {order.totalPrice ? `Rs. ${Number(order.totalPrice).toLocaleString()}` : '—'}
                      </span>
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex flex-col justify-between">
                      <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Traceability</span>
                      {order.batchCode ? (
                        <Link
                          to={`/trace/${order.batchCode}`}
                          className="inline-flex items-center gap-1 font-semibold text-emerald-700 hover:text-emerald-800 text-xs mt-0.5"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                          <span>Trace Batch</span>
                        </Link>
                      ) : (
                        <span className="text-slate-400 text-xs mt-0.5">—</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      {/* ==================================================================== */}
      {/* 5. FORWARD CONTRACT PIPELINE                                         */}
      {/* ==================================================================== */}
      <section aria-label="Forward Contract Pipeline" className="agri-card p-6 bg-white space-y-4 border border-slate-200/90 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-lg font-bold text-slate-900 tracking-tight">
                Forward Contract Pipeline
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                {contracts.length} Active
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Guaranteed seasonal harvest commitments with registered farmer clusters.
            </p>
          </div>

          <Link
            to="/contracts"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-emerald-700 hover:text-emerald-800 group"
          >
            <span>Contract Farming Hub</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <div key={i} className="p-5 rounded-xl border border-slate-200 bg-slate-50/40 space-y-3 animate-pulse">
                <div className="h-4 w-32 bg-slate-200 rounded"></div>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="h-3 w-20 bg-slate-100 rounded"></div>
                  <div className="h-3 w-20 bg-slate-100 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : contracts.length === 0 ? (
          <div className="text-center py-10 bg-slate-50/70 rounded-2xl border border-dashed border-slate-200 space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center mx-auto text-slate-400 shadow-2xs">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="font-display text-sm font-bold text-slate-800">
              No active forward contracts
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">
              No forward farming contracts are currently active. Review available contract farming programs to secure harvest quotas.
            </p>
            <div className="pt-2">
              <Link
                to="/contracts"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition shadow-2xs"
              >
                <span>Explore Contract Programs</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contracts.map((c) => {
              const cropTitle = c.cropName || c.crop || 'Crop Contract';
              const seasonOrTerm = c.season || (c.durationMonths ? `${c.durationMonths} Months` : c.deliveryFrequency || null);
              const volume = c.targetVolume || (c.monthlyQuantityKg ? `${c.monthlyQuantityKg.toLocaleString()} kg/mo` : (c.quantity ? `${c.quantity} MT` : '—'));
              const agreedPrice = c.guaranteedPrice || (c.minPriceLkr && c.maxPriceLkr ? `Rs. ${c.minPriceLkr} - ${c.maxPriceLkr} / kg` : (c.minPriceLkr ? `Rs. ${c.minPriceLkr} / kg` : (c.priceFormatted || '—')));
              const partner = c.growerGroup || c.farmer || c.buyerName || 'Producer Cluster';
              const advance = c.advancePaid || c.advanceAmount || null;
              const status = c.status || 'Active';

              return (
                <div
                  key={c.id || cropTitle}
                  className="p-5 rounded-2xl border border-slate-200/90 bg-white hover:border-indigo-300 hover:shadow-sm transition-all duration-200 space-y-4"
                >
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h3 className="font-display font-bold text-base text-slate-900">{cropTitle}</h3>
                      {seasonOrTerm && (
                        <span className="text-xs font-medium text-slate-500 block mt-0.5">
                          {seasonOrTerm}
                        </span>
                      )}
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/80 shadow-2xs shrink-0">
                      {status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 text-xs pt-1">
                    <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-100">
                      <p className="text-slate-400 font-bold text-[10px] uppercase tracking-wider">Committed Volume</p>
                      <p className="font-display font-bold text-slate-900 text-sm mt-0.5">{volume}</p>
                    </div>
                    <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-100">
                      <p className="text-slate-400 font-bold text-[10px] uppercase tracking-wider">Agreed Price</p>
                      <p className="font-display font-bold text-emerald-800 text-sm mt-0.5">{agreedPrice}</p>
                    </div>
                    <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-100">
                      <p className="text-slate-400 font-bold text-[10px] uppercase tracking-wider">Grower Group</p>
                      <p className="font-medium text-slate-700 truncate mt-0.5">{partner}</p>
                    </div>
                    {advance ? (
                      <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-100">
                        <p className="text-slate-400 font-bold text-[10px] uppercase tracking-wider">Advance Amount</p>
                        <p className="font-display font-bold text-emerald-800 text-sm mt-0.5">{advance}</p>
                      </div>
                    ) : (
                      <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-100 flex flex-col justify-between">
                        <p className="text-slate-400 font-bold text-[10px] uppercase tracking-wider">Contract Hub</p>
                        <Link
                          to="/contracts"
                          className="font-semibold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1 mt-0.5"
                        >
                          <span>Manage Pacts</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ==================================================================== */}
      {/* 6. ACTIVE NEGOTIATIONS                                               */}
      {/* ==================================================================== */}
      <section aria-label="Active Negotiations" className="agri-card p-6 bg-white space-y-4 border border-slate-200/90 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-lg font-bold text-slate-900 tracking-tight">
                Active Trade Negotiations
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                {negotiations.length} Pending
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Live farmgate price quotes and supplier volume counter-offers.
            </p>
          </div>

          <Link
            to="/negotiation"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-emerald-700 hover:text-emerald-800 group"
          >
            <span>Open Negotiation Portal</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <div key={i} className="p-5 rounded-xl border border-slate-200 bg-slate-50/40 space-y-3 animate-pulse">
                <div className="h-4 w-28 bg-slate-200 rounded"></div>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="h-3 w-16 bg-slate-100 rounded"></div>
                  <div className="h-3 w-16 bg-slate-100 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : negotiations.length === 0 ? (
          <div className="text-center py-10 bg-slate-50/70 rounded-2xl border border-dashed border-slate-200 space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center mx-auto text-slate-400 shadow-2xs">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="font-display text-sm font-bold text-slate-800">
              No active negotiations
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">
              You have no ongoing price or volume negotiations at this time. Sourced crop orders are directly processed.
            </p>
            <div className="pt-2">
              <Link
                to="/negotiation"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition shadow-2xs"
              >
                <span>Open Negotiation Desk</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {negotiations.map((neg) => {
              const cropName = neg.cropName || neg.crop || 'Trade Produce';
              const counterparty = neg.farmerName || neg.farmer || neg.seller || 'Registered Farmer';
              const volume = neg.currentOfferedQuantityKg ? `${neg.currentOfferedQuantityKg.toLocaleString()} kg` : (neg.volume || '—');
              const currentOffer = neg.currentOfferedPriceLkr ? `Rs. ${Number(neg.currentOfferedPriceLkr).toLocaleString()}` : (neg.offeredPrice ? `Rs. ${Number(neg.offeredPrice).toLocaleString()}` : '—');
              const counterOffer = neg.counterPrice ? `Rs. ${Number(neg.counterPrice).toLocaleString()}` : null;
              const status = neg.status;

              return (
                <div
                  key={neg.id || cropName}
                  className="p-5 rounded-2xl border border-slate-200/90 bg-white hover:border-amber-300 hover:shadow-sm transition-all duration-200 space-y-4"
                >
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h3 className="font-display font-bold text-base text-slate-900">{cropName}</h3>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">Seller: {counterparty}</p>
                    </div>
                    {renderNegotiationStatusBadge(status)}
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 text-xs pt-1">
                    <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-100">
                      <p className="text-slate-400 font-bold text-[10px] uppercase tracking-wider">Volume</p>
                      <p className="font-display font-bold text-slate-900 text-sm mt-0.5">{volume}</p>
                    </div>
                    <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-100">
                      <p className="text-slate-400 font-bold text-[10px] uppercase tracking-wider">Current Offer</p>
                      <p className="font-display font-bold text-slate-900 text-sm mt-0.5">{currentOffer}</p>
                    </div>
                    {counterOffer && (
                      <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-200/70">
                        <p className="text-amber-800 font-bold text-[10px] uppercase tracking-wider">Counter Offer</p>
                        <p className="font-display font-bold text-amber-900 text-sm mt-0.5">{counterOffer}</p>
                      </div>
                    )}
                    <div className={`bg-slate-50/80 p-3 rounded-xl border border-slate-100 flex flex-col justify-between ${counterOffer ? '' : 'col-span-2'}`}>
                      <p className="text-slate-400 font-bold text-[10px] uppercase tracking-wider">Action</p>
                      <Link
                        to="/negotiation"
                        className="font-semibold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1 mt-0.5"
                      >
                        <span>Respond to Negotiation</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

    </div>
  );
};

export default BusinessBuyerDashboard;
