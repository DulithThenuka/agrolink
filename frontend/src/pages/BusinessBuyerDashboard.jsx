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
  Sprout,
  BarChart3,
  QrCode,
  Scale,
  Package,
  AlertCircle,
  AlertTriangle,
  RefreshCw,
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

  // Status badge helper adhering to established design system
  const renderStatusBadge = (status) => {
    const s = (status || 'PENDING').toUpperCase();

    if (['DELIVERED', 'COMPLETED', 'CONFIRMED', 'PAID'].includes(s)) {
      const label = s === 'PAID' ? 'Paid' : s === 'CONFIRMED' ? 'Confirmed' : 'Delivered';
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>{label}</span>
        </span>
      );
    }

    if (['IN_TRANSIT', 'DISPATCHED', 'SHIPPED', 'COLLECTED', 'REEFER_TRANSIT', 'DRIVER_ASSIGNED', 'TRANSPORT_REQUESTED'].includes(s)) {
      const label = s === 'REEFER_TRANSIT' ? 'In Transit' : s === 'DRIVER_ASSIGNED' ? 'Driver Assigned' : 'In Transit';
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-sky-50 text-sky-800 border border-sky-200">
          <Truck className="w-3.5 h-3.5 text-sky-600 shrink-0" />
          <span>{label}</span>
        </span>
      );
    }

    if (['PENDING', 'PLACED', 'FARMER_ACCEPTED', 'PROCESSING'].includes(s)) {
      const label = s === 'FARMER_ACCEPTED' ? 'Accepted' : 'Pending';
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
          <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span>{label}</span>
        </span>
      );
    }

    if (['DISPUTED', 'ESCROW_LOCKED'].includes(s)) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200">
          <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
          <span>Disputed</span>
        </span>
      );
    }

    if (['CANCELLED', 'REJECTED'].includes(s)) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
          <AlertCircle className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span>Cancelled</span>
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
        <Package className="w-3.5 h-3.5 text-slate-500 shrink-0" />
        <span>{status}</span>
      </span>
    );
  };

  const renderNegotiationStatusBadge = (status) => {
    const s = (status || '').toUpperCase();
    if (s === 'AGREEMENT_REACHED' || s === 'CONTRACT_CREATED') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>Agreement Reached</span>
        </span>
      );
    }
    if (s === 'COUNTER_OFFER_RECEIVED' || s === 'NEGOTIATING') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
          <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span>Counter Offer</span>
        </span>
      );
    }
    if (s === 'REJECTED') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200">
          <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
          <span>Rejected</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
        <span>{status || 'Active'}</span>
      </span>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fade-in text-slate-900">
      
      {/* ==================================================================== */}
      {/* 1. COMPACT DASHBOARD HEADER                                          */}
      {/* ==================================================================== */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span>Enterprise Procurement</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Welcome back, <span className="capitalize">{companyName}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
            Manage crop sourcing, procurement orders, contracts and negotiations from one workspace.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
          <Link
            to="/crops"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold transition shadow-xs"
          >
            <Sprout className="w-3.5 h-3.5 shrink-0" />
            <span>Browse Crop Marketplace</span>
          </Link>

          <Link
            to="/contracts"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition shadow-xs"
          >
            <FileText className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span>Contracts</span>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-rose-700 text-xs font-semibold transition shadow-xs cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Error alert if any */}
      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={loadEnterpriseData}
            className="text-xs font-bold text-rose-900 hover:underline inline-flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Retry</span>
          </button>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 2. PROCUREMENT SUMMARY (KPIs)                                        */}
      {/* ==================================================================== */}
      <section aria-label="Procurement Summary" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          [1, 2, 3, 4].map((i) => (
            <div key={i} className="agri-card p-5 bg-white space-y-2 animate-pulse">
              <div className="h-3 w-28 bg-slate-200 rounded"></div>
              <div className="h-7 w-20 bg-slate-100 rounded"></div>
              <div className="h-2.5 w-32 bg-slate-100 rounded"></div>
            </div>
          ))
        ) : (
          <>
            {/* KPI 1: Total Procurement Volume */}
            <div className="agri-card p-5 bg-white flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Total Procurement Volume
                </span>
                <p className="text-2xl font-bold text-slate-900">
                  {totalProcuredMT}
                </p>
                <span className="text-[11px] text-slate-500 font-medium block">
                  {totalProcuredKg.toLocaleString()} kg total
                </span>
              </div>
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center border border-emerald-100 shrink-0">
                <Scale className="w-5 h-5" />
              </div>
            </div>

            {/* KPI 2: Active Forward Contracts */}
            <div className="agri-card p-5 bg-white flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Active Forward Contracts
                </span>
                <p className="text-2xl font-bold text-slate-900">
                  {contracts.length}
                </p>
                <span className="text-[11px] text-slate-500 font-medium block">
                  Registered agreements
                </span>
              </div>
              <div className="w-11 h-11 rounded-xl bg-slate-50 text-slate-700 flex items-center justify-center border border-slate-200 shrink-0">
                <FileText className="w-5 h-5" />
              </div>
            </div>

            {/* KPI 3: Active Negotiations */}
            <div className="agri-card p-5 bg-white flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Active Negotiations
                </span>
                <p className="text-2xl font-bold text-slate-900">
                  {negotiations.length}
                </p>
                <span className="text-[11px] text-slate-500 font-medium block">
                  Open trade discussions
                </span>
              </div>
              <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center border border-amber-200 shrink-0">
                <MessageSquare className="w-5 h-5" />
              </div>
            </div>

            {/* KPI 4: Procurement Value */}
            <div className="agri-card p-5 bg-white flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Procurement Value
                </span>
                <p className="text-2xl font-bold text-emerald-800">
                  Rs. {totalProcurementValue.toLocaleString()}
                </p>
                <span className="text-[11px] text-slate-500 font-medium block">
                  Cumulative order volume
                </span>
              </div>
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center border border-emerald-100 shrink-0">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
          </>
        )}
      </section>

      {/* ==================================================================== */}
      {/* 3. PROCUREMENT ACTIONS                                               */}
      {/* ==================================================================== */}
      <section aria-label="Procurement Actions" className="agri-card p-6 bg-white space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-slate-900">
            Procurement Actions
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Key operational modules for enterprise sourcing, contract negotiation, and market demand intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Action 1: Source Crops */}
          <Link
            to="/crops"
            className="p-4 rounded-xl border border-slate-200 bg-white hover:border-emerald-700 hover:shadow-xs transition group flex flex-col justify-between space-y-3"
          >
            <div className="flex items-start justify-between">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-100 flex items-center justify-center">
                <Sprout className="w-4 h-4" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-800 group-hover:translate-x-0.5 transition" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-800 transition">
                Source Crops
              </h3>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                Browse available agricultural crop listings.
              </p>
            </div>
          </Link>

          {/* Action 2: Manage Contracts */}
          <Link
            to="/contracts"
            className="p-4 rounded-xl border border-slate-200 bg-white hover:border-emerald-700 hover:shadow-xs transition group flex flex-col justify-between space-y-3"
          >
            <div className="flex items-start justify-between">
              <div className="w-9 h-9 rounded-lg bg-slate-50 text-slate-700 border border-slate-200 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-800 group-hover:translate-x-0.5 transition" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-800 transition">
                Manage Contracts
              </h3>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                Review and manage supported forward contracts.
              </p>
            </div>
          </Link>

          {/* Action 3: Review Negotiations */}
          <Link
            to="/negotiation"
            className="p-4 rounded-xl border border-slate-200 bg-white hover:border-emerald-700 hover:shadow-xs transition group flex flex-col justify-between space-y-3"
          >
            <div className="flex items-start justify-between">
              <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 flex items-center justify-center">
                <MessageSquare className="w-4 h-4" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-800 group-hover:translate-x-0.5 transition" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-800 transition">
                Review Negotiations
              </h3>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                Continue active trade negotiations.
              </p>
            </div>
          </Link>

          {/* Action 4: Demand Intelligence */}
          <Link
            to="/demand-forecasting"
            className="p-4 rounded-xl border border-slate-200 bg-white hover:border-emerald-700 hover:shadow-xs transition group flex flex-col justify-between space-y-3"
          >
            <div className="flex items-start justify-between">
              <div className="w-9 h-9 rounded-lg bg-sky-50 text-sky-800 border border-sky-200 flex items-center justify-center">
                <BarChart3 className="w-4 h-4" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-800 group-hover:translate-x-0.5 transition" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-800 transition">
                Demand Intelligence
              </h3>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                Review supported demand information.
              </p>
            </div>
          </Link>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 4. RECENT PROCUREMENT ORDERS (Primary Operational Area)              */}
      {/* ==================================================================== */}
      <section aria-label="Recent Procurement Orders" className="agri-card p-6 bg-white space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Recent Procurement Orders
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Review your latest crop purchases and delivery progress.
            </p>
          </div>

          <Link
            to="/orders"
            className="text-xs font-semibold text-emerald-800 hover:text-emerald-900 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>View All Orders</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-400 space-y-2">
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-emerald-800" />
            <span className="text-xs font-medium">Loading procurement orders...</span>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-xl border border-slate-100 space-y-3">
            <Package className="w-8 h-8 mx-auto text-slate-400" />
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-800">
                No procurement orders yet
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Explore available crop listings or initiate forward purchase agreements to begin procurement.
              </p>
            </div>
            <Link
              to="/crops"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold transition shadow-xs mt-2"
            >
              <Sprout className="w-3.5 h-3.5" />
              <span>Browse Crop Marketplace</span>
            </Link>
          </div>
        ) : (
          <>
            {/* Desktop Orders Table */}
            <div className="hidden md:block overflow-x-auto rounded-xl border border-slate-200/80">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200/80">
                  <tr>
                    <th className="p-3.5">Crop</th>
                    <th className="p-3.5">Seller</th>
                    <th className="p-3.5">Quantity</th>
                    <th className="p-3.5">Value</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Trace</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50/60 transition">
                      <td className="p-3.5">
                        <span className="font-bold text-slate-900 block">
                          {order.cropName || order.crop?.name || 'Procured Crop'}
                        </span>
                        {order.batchCode ? (
                          <span className="text-[10px] font-mono text-slate-500 block">
                            {order.batchCode}
                          </span>
                        ) : order.id ? (
                          <span className="text-[10px] font-mono text-slate-400 block">
                            #ORD-{order.id}
                          </span>
                        ) : null}
                      </td>

                      <td className="p-3.5 text-slate-700 font-medium">
                        {order.farmerName || order.seller || 'Registered Producer'}
                      </td>

                      <td className="p-3.5 font-semibold text-slate-900">
                        {order.quantity ? `${Number(order.quantity).toLocaleString()} kg` : '—'}
                      </td>

                      <td className="p-3.5 font-semibold text-emerald-800">
                        {order.totalPrice ? `Rs. ${Number(order.totalPrice).toLocaleString()}` : '—'}
                      </td>

                      <td className="p-3.5">
                        {renderStatusBadge(order.status || order.statusLabel)}
                      </td>

                      <td className="p-3.5 text-right">
                        {order.batchCode ? (
                          <Link
                            to={`/trace/${order.batchCode}`}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 hover:text-emerald-900 transition"
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
                  className="p-4 rounded-xl border border-slate-200 bg-white space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">
                        {order.cropName || order.crop?.name || 'Procured Crop'}
                      </h3>
                      {order.batchCode ? (
                        <p className="text-[10px] font-mono text-slate-500 mt-0.5">
                          {order.batchCode}
                        </p>
                      ) : order.id ? (
                        <p className="text-[10px] font-mono text-slate-400 mt-0.5">
                          #ORD-{order.id}
                        </p>
                      ) : null}
                    </div>
                    <div>
                      {renderStatusBadge(order.status || order.statusLabel)}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
                    <div>
                      <span className="text-slate-400 text-[11px] block">Seller</span>
                      <span className="font-medium text-slate-800">
                        {order.farmerName || order.seller || 'Registered Producer'}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 text-[11px] block">Quantity</span>
                      <span className="font-semibold text-slate-900">
                        {order.quantity ? `${Number(order.quantity).toLocaleString()} kg` : '—'}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 text-[11px] block">Order Value</span>
                      <span className="font-semibold text-emerald-800">
                        {order.totalPrice ? `Rs. ${Number(order.totalPrice).toLocaleString()}` : '—'}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 text-[11px] block">Traceability</span>
                      {order.batchCode ? (
                        <Link
                          to={`/trace/${order.batchCode}`}
                          className="inline-flex items-center gap-1 font-semibold text-emerald-800 hover:text-emerald-900 text-xs"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                          <span>Trace Batch</span>
                        </Link>
                      ) : (
                        <span className="text-slate-400">—</span>
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
      <section aria-label="Forward Contract Pipeline" className="agri-card p-6 bg-white space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Forward Contract Pipeline
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Guaranteed seasonal crop volume agreements with registered producers.
            </p>
          </div>

          <Link
            to="/contracts"
            className="text-xs font-semibold text-emerald-800 hover:text-emerald-900 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Contract Farming Hub</span>
            <ArrowRight className="w-3 h-3" />
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
          <div className="text-center py-10 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
            <FileText className="w-7 h-7 mx-auto text-slate-400" />
            <h3 className="text-sm font-bold text-slate-800">
              No active contracts
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No forward farming contracts are currently active. Review available contract farming programs to secure harvest quotas.
            </p>
            <div className="pt-1">
              <Link
                to="/contracts"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition"
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
                  className="p-5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition space-y-3"
                >
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">{cropTitle}</h3>
                      {seasonOrTerm && (
                        <span className="text-[11px] font-medium text-slate-500">
                          {seasonOrTerm}
                        </span>
                      )}
                    </div>
                    <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
                      {status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
                    <div>
                      <p className="text-slate-400 font-medium text-[11px]">Committed Volume</p>
                      <p className="font-bold text-slate-800 mt-0.5">{volume}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 font-medium text-[11px]">Agreed Price</p>
                      <p className="font-bold text-slate-800 mt-0.5">{agreedPrice}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 font-medium text-[11px]">Grower Group</p>
                      <p className="font-medium text-slate-700 truncate mt-0.5">{partner}</p>
                    </div>
                    {advance ? (
                      <div>
                        <p className="text-slate-400 font-medium text-[11px]">Advance Amount</p>
                        <p className="font-semibold text-emerald-800 mt-0.5">{advance}</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-slate-400 font-medium text-[11px]">Contract Hub</p>
                        <Link
                          to="/contracts"
                          className="font-semibold text-emerald-800 hover:text-emerald-900 inline-flex items-center gap-0.5 mt-0.5"
                        >
                          <span>Details</span>
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
      <section aria-label="Active Negotiations" className="agri-card p-6 bg-white space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Active Negotiations
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Current wholesale trade discussions and farmgate counter-offers.
            </p>
          </div>

          <Link
            to="/negotiation"
            className="text-xs font-semibold text-emerald-800 hover:text-emerald-900 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Negotiation Portal</span>
            <ArrowRight className="w-3 h-3" />
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
          <div className="text-center py-10 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
            <MessageSquare className="w-7 h-7 mx-auto text-slate-400" />
            <h3 className="text-sm font-bold text-slate-800">
              No active negotiations
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You have no ongoing price or volume negotiations at this time.
            </p>
            <div className="pt-1">
              <Link
                to="/negotiation"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition"
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
                  className="p-5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition space-y-3"
                >
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">{cropName}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">Seller: {counterparty}</p>
                    </div>
                    {renderNegotiationStatusBadge(status)}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
                    <div>
                      <p className="text-slate-400 font-medium text-[11px]">Volume</p>
                      <p className="font-semibold text-slate-800 mt-0.5">{volume}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 font-medium text-[11px]">Current Offer</p>
                      <p className="font-semibold text-slate-800 mt-0.5">{currentOffer}</p>
                    </div>
                    {counterOffer && (
                      <div>
                        <p className="text-slate-400 font-medium text-[11px]">Counter Offer</p>
                        <p className="font-bold text-amber-700 mt-0.5">{counterOffer}</p>
                      </div>
                    )}
                    <div className={counterOffer ? '' : 'col-span-2'}>
                      <p className="text-slate-400 font-medium text-[11px]">Action</p>
                      <Link
                        to="/negotiation"
                        className="font-semibold text-emerald-800 hover:text-emerald-900 inline-flex items-center gap-1 mt-0.5"
                      >
                        <span>View Negotiation</span>
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
