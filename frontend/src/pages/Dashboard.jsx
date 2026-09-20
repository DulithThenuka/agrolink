import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { adminAPI, cropsAPI, ordersAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Users,
  Sprout,
  ShoppingBag,
  ArrowRight,
  Loader2,
  Sparkles,
  LogOut,
  UserCheck,
  CheckCircle2,
  Clock,
  Truck,
  AlertTriangle,
  Package,
  BarChart3,
  TrendingUp,
  CloudSun,
  ShieldCheck,
  RefreshCw,
  Landmark,
  FileText,
  AlertCircle
} from 'lucide-react';
import { FarmerDashboard } from './FarmerDashboard';
import { Logistics } from './Logistics';
import { ExpertDashboard } from './ExpertDashboard';
import { SupplierDashboard } from './SupplierDashboard';
import { BusinessBuyerDashboard } from './BusinessBuyerDashboard';
import { BuyerProfileModal } from '../components/BuyerProfileModal';
import { FarmerProfileModal } from '../components/FarmerProfileModal';

export const Dashboard = () => {
  const {
    user,
    isFarmer,
    isBuyer,
    isBusinessBuyer,
    isLogistics,
    isExpert,
    isSupplier,
    isAdmin,
    logout,
  } = useAuth();
  const navigate = useNavigate();

  // ── All hooks declared unconditionally before any role delegation returns ──
  const [selectedBuyer, setSelectedBuyer] = useState(null);
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [stats, setStats] = useState({ totalUsers: 0, totalCrops: 0, totalOrders: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDashboardData = async () => {
    // Roles with dedicated dashboards skip default buyer/admin data fetching
    if (isFarmer || isLogistics || isExpert || isSupplier || isBusinessBuyer) return;

    setLoading(true);
    setError(null);
    try {
      if (isAdmin) {
        const adminRes = await adminAPI.getDashboard();
        const adminData = adminRes?.data || adminRes;
        if (adminData) {
          setStats({
            totalUsers: adminData.totalUsers || 0,
            totalCrops: adminData.totalCrops || 0,
            totalOrders: adminData.totalOrders || 0,
          });
          setRecentOrders(adminData.recentOrders || []);
        }
      } else {
        // Standard Buyer view
        const [ordersRes, cropsRes] = await Promise.allSettled([
          ordersAPI.getMyOrders({ page: 0, size: 6 }),
          cropsAPI.getAll({ page: 0, size: 1 }),
        ]);

        let totalOrders = 0;
        let ordersList = [];
        if (ordersRes.status === 'fulfilled' && ordersRes.value) {
          const data = ordersRes.value.data || ordersRes.value;
          ordersList = data.content || data.orders || (Array.isArray(data) ? data : []);
          totalOrders = data.totalElements || ordersList.length || 0;
        }

        let totalCrops = 0;
        if (cropsRes.status === 'fulfilled' && cropsRes.value) {
          const cData = cropsRes.value.data || cropsRes.value;
          totalCrops = cData.totalElements || (Array.isArray(cData) ? cData.length : 0);
        }

        setRecentOrders(ordersList);
        setStats({
          totalUsers: 0,
          totalOrders,
          totalCrops,
        });
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setError('Unable to load dashboard information.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [isAdmin, isBuyer, isFarmer, isLogistics, isExpert, isSupplier, isBusinessBuyer]);

  // Compute active orders count for Buyer view
  const activeOrdersCount = useMemo(() => {
    if (!recentOrders || !Array.isArray(recentOrders)) return 0;
    const activeStatuses = [
      'PENDING', 'PLACED', 'FARMER_ACCEPTED', 'PROCESSING',
      'IN_TRANSIT', 'DISPATCHED', 'SHIPPED', 'COLLECTED',
      'DRIVER_ASSIGNED', 'TRANSPORT_REQUESTED'
    ];
    return recentOrders.filter(o => activeStatuses.includes((o.status || '').toUpperCase())).length;
  }, [recentOrders]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // ── Role-based render delegation (preserved exactly) ──
  if (isFarmer) return <FarmerDashboard />;
  if (isLogistics) return <Logistics />;
  if (isExpert) return <ExpertDashboard />;
  if (isSupplier) return <SupplierDashboard />;
  if (isBusinessBuyer) return <BusinessBuyerDashboard />;

  // ── Status badge helper (text + icon, accessible) ──
  const renderStatusBadge = (status) => {
    const s = (status || 'PENDING').toUpperCase();

    // Completed / Delivered / Paid / Confirmed
    if (['DELIVERED', 'COMPLETED', 'CONFIRMED', 'PAID'].includes(s)) {
      const label = s === 'PAID' ? 'Paid & Complete' : s === 'CONFIRMED' ? 'Confirmed' : 'Delivered';
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>{label}</span>
        </span>
      );
    }

    // Active Logistics / In Transit / Dispatched
    if (['IN_TRANSIT', 'DISPATCHED', 'SHIPPED', 'COLLECTED', 'DRIVER_ASSIGNED', 'TRANSPORT_REQUESTED'].includes(s)) {
      const label =
        s === 'IN_TRANSIT' || s === 'DISPATCHED' || s === 'SHIPPED'
          ? 'In Transit'
          : s === 'COLLECTED'
          ? 'Collected'
          : s === 'DRIVER_ASSIGNED'
          ? 'Driver Assigned'
          : 'Transport Requested';

      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-50 text-sky-800 border border-sky-200">
          <Truck className="w-3.5 h-3.5 text-sky-600 shrink-0" />
          <span>{label}</span>
        </span>
      );
    }

    // Pending / Placed / Farmer Accepted / Processing
    if (['PENDING', 'PLACED', 'FARMER_ACCEPTED', 'PROCESSING'].includes(s)) {
      const label = s === 'FARMER_ACCEPTED' ? 'Farmer Accepted' : 'Pending Order';
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
          <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span>{label}</span>
        </span>
      );
    }

    // Disputed / Escrow Locked
    if (['DISPUTED', 'ESCROW_LOCKED'].includes(s)) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-800 border border-rose-200">
          <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
          <span>Dispute Under Review</span>
        </span>
      );
    }

    // Cancelled / Rejected
    if (['CANCELLED', 'REJECTED'].includes(s)) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
          <AlertCircle className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span>Cancelled</span>
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
        <Package className="w-3.5 h-3.5 text-slate-500 shrink-0" />
        <span>{status}</span>
      </span>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fade-in text-slate-900">
      
      {/* ==================================================================== */}
      {/* 1. ROLE-AWARE HEADER                                                 */}
      {/* ==================================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              {isAdmin ? 'Platform Overview' : 'Buyer Dashboard'}
            </h1>
            <span className="text-base" title={isAdmin ? 'Governance Mode' : 'Purchasing Mode'}>
              {isAdmin ? '🏛️' : '🛒'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {isAdmin
              ? 'Monitor platform activity, users, crops, and transactions.'
              : 'Monitor your purchases, deliveries, and activity across AgroLink.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <div className="px-3.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 flex items-center gap-2 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            <span>Welcome, {user?.name || (user?.email ? user.email.split('@')[0] : 'Member')}</span>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition shadow-2xs cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5 text-slate-500" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Error Alert if fetching failed */}
      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={loadDashboardData}
            className="text-xs font-bold text-rose-900 hover:underline inline-flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Try Again</span>
          </button>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 2. SUMMARY METRICS (KPIs)                                            */}
      {/* ==================================================================== */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {loading ? (
          // Skeleton loaders
          [1, 2, 3].map((i) => (
            <div key={i} className="agri-card p-5 bg-white space-y-2 animate-pulse">
              <div className="h-3 w-28 bg-slate-200 rounded"></div>
              <div className="h-7 w-20 bg-slate-100 rounded"></div>
            </div>
          ))
        ) : isAdmin ? (
          <>
            {/* Admin Metric 1: Total Platform Users */}
            <div className="agri-card p-5 bg-white flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Total Registered Users
                </span>
                <p className="text-2xl sm:text-3xl font-bold text-slate-900">
                  {stats.totalUsers.toLocaleString()}
                </p>
                <span className="text-[11px] text-slate-500 font-medium">
                  Verified system accounts
                </span>
              </div>
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center border border-emerald-100 shrink-0">
                <Users className="w-5 h-5" />
              </div>
            </div>

            {/* Admin Metric 2: Active Crop Listings */}
            <div className="agri-card p-5 bg-white flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Active Crop Listings
                </span>
                <p className="text-2xl sm:text-3xl font-bold text-slate-900">
                  {stats.totalCrops.toLocaleString()}
                </p>
                <span className="text-[11px] text-slate-500 font-medium">
                  Live marketplace harvests
                </span>
              </div>
              <div className="w-11 h-11 rounded-xl bg-sky-50 text-sky-800 flex items-center justify-center border border-sky-100 shrink-0">
                <Sprout className="w-5 h-5" />
              </div>
            </div>

            {/* Admin Metric 3: Total Platform Orders */}
            <div className="agri-card p-5 bg-white flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Total Platform Orders
                </span>
                <p className="text-2xl sm:text-3xl font-bold text-slate-900">
                  {stats.totalOrders.toLocaleString()}
                </p>
                <span className="text-[11px] text-slate-500 font-medium">
                  Escrow-backed transactions
                </span>
              </div>
              <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-800 flex items-center justify-center border border-indigo-100 shrink-0">
                <ShoppingBag className="w-5 h-5" />
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Buyer Metric 1: My Orders */}
            <div className="agri-card p-5 bg-white flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  My Orders
                </span>
                <p className="text-2xl sm:text-3xl font-bold text-slate-900">
                  {stats.totalOrders}
                </p>
                <span className="text-[11px] text-slate-500 font-medium">
                  Lifetime purchase count
                </span>
              </div>
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center border border-emerald-100 shrink-0">
                <ShoppingBag className="w-5 h-5" />
              </div>
            </div>

            {/* Buyer Metric 2: Active Purchases */}
            <div className="agri-card p-5 bg-white flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Active Purchases
                </span>
                <p className="text-2xl sm:text-3xl font-bold text-slate-900">
                  {activeOrdersCount}
                </p>
                <span className="text-[11px] text-slate-500 font-medium">
                  Pending or in-transit shipments
                </span>
              </div>
              <div className="w-11 h-11 rounded-xl bg-sky-50 text-sky-800 flex items-center justify-center border border-sky-100 shrink-0">
                <Truck className="w-5 h-5" />
              </div>
            </div>

            {/* Buyer Metric 3: Marketplace Crops */}
            <div className="agri-card p-5 bg-white flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Marketplace Crops
                </span>
                <p className="text-2xl sm:text-3xl font-bold text-slate-900">
                  {stats.totalCrops}
                </p>
                <span className="text-[11px] text-slate-500 font-medium">
                  Fresh produce listings available
                </span>
              </div>
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center border border-emerald-100 shrink-0">
                <Sprout className="w-5 h-5" />
              </div>
            </div>
          </>
        )}
      </section>

      {/* ==================================================================== */}
      {/* 3. QUICK ACTIONS                                                     */}
      {/* ==================================================================== */}
      <section className="agri-card p-6 bg-white space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-slate-900">
            {isAdmin ? 'System Governance & Analytics' : 'Quick Purchasing Actions'}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {isAdmin
              ? 'Access platform intelligence, price forecasts, and policy simulation modules.'
              : 'Direct shortcuts to browse harvests, manage escrow payments, and track deliveries.'}
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {isAdmin ? (
            <>
              <Link
                to="/gov-intelligence"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition shadow-2xs"
              >
                <Landmark className="w-3.5 h-3.5 text-emerald-400" />
                <span>Government Intelligence 🇱🇰</span>
              </Link>

              <Link
                to="/analytics"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition shadow-2xs"
              >
                <BarChart3 className="w-3.5 h-3.5 text-indigo-600" />
                <span>Platform Analytics</span>
              </Link>

              <Link
                to="/price-prediction"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition shadow-2xs"
              >
                <TrendingUp className="w-3.5 h-3.5 text-emerald-700" />
                <span>Price Intelligence</span>
              </Link>

              <Link
                to="/weather"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition shadow-2xs"
              >
                <CloudSun className="w-3.5 h-3.5 text-teal-600" />
                <span>Weather Telemetry</span>
              </Link>

              <Link
                to="/community"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition shadow-2xs"
              >
                <Users className="w-3.5 h-3.5 text-slate-500" />
                <span>Community Platform</span>
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/crops"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold transition shadow-2xs"
              >
                <Sprout className="w-3.5 h-3.5" />
                <span>Browse Crop Marketplace</span>
              </Link>

              <Link
                to="/orders"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition shadow-2xs"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-emerald-700" />
                <span>My Orders &amp; Escrow</span>
              </Link>

              <Link
                to="/contracts"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition shadow-2xs"
              >
                <FileText className="w-3.5 h-3.5 text-slate-600" />
                <span>Forward Contracts</span>
              </Link>

              <Link
                to="/demand-forecasting"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition shadow-2xs"
              >
                <TrendingUp className="w-3.5 h-3.5 text-sky-600" />
                <span>Demand Forecast</span>
              </Link>

              <Link
                to="/weather"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition shadow-2xs"
              >
                <CloudSun className="w-3.5 h-3.5 text-teal-600" />
                <span>Weather Conditions</span>
              </Link>
            </>
          )}
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 4. RECENT ACTIVITY (Orders & Trade Ledger)                          */}
      {/* ==================================================================== */}
      <section className="agri-card p-6 bg-white space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {isAdmin ? 'Recent Platform Trade Activity' : 'My Recent Orders'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {isAdmin
                ? 'Latest commercial trade flows across the agricultural ecosystem.'
                : 'Track fulfillment progress and escrow safety on your latest produce purchases.'}
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
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-emerald-700" />
            <span className="text-xs font-medium">Loading trade activity...</span>
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
            <ShoppingBag className="w-8 h-8 mx-auto text-slate-400" />
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-800">
                {isAdmin ? 'No recent platform activity' : 'No recent orders yet'}
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {isAdmin
                  ? 'Transactions will appear here as users place orders and dispatch logistics.'
                  : 'Explore the marketplace to find available crops and place your first trade order.'}
              </p>
            </div>
            {!isAdmin && (
              <Link
                to="/crops"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold transition shadow-2xs mt-2"
              >
                <Sprout className="w-3.5 h-3.5" />
                <span>Browse Marketplace Crops</span>
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200/80">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200/80">
                <tr>
                  <th className="p-3.5">Produce Name</th>
                  <th className="p-3.5">{isAdmin ? 'Buyer Account' : 'Farmer / Seller'}</th>
                  <th className="p-3.5">Volume</th>
                  <th className="p-3.5">Fulfillment Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/60 transition">
                    <td className="p-3.5">
                      <span className="font-bold text-slate-900 block">
                        {order.cropName || order.crop?.name || 'Crop Batch'}
                      </span>
                      {order.batchCode && (
                        <span className="text-[10px] font-mono text-slate-400">
                          {order.batchCode}
                        </span>
                      )}
                    </td>

                    <td className="p-3.5">
                      {isAdmin ? (
                        <button
                          type="button"
                          onClick={() => setSelectedBuyer({ id: order.buyerId, name: order.buyerName, email: order.buyerEmail })}
                          className="text-emerald-800 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <span>{order.buyerName || order.buyerEmail || 'Buyer'}</span>
                          <span className="text-[11px] text-amber-500">⭐</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setSelectedFarmer({ id: order.farmerId, name: order.farmerName || 'Local Producer' })}
                          className="text-emerald-800 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <span>{order.farmerName || 'Local Farmer'}</span>
                          <span className="text-[11px]">🌾</span>
                        </button>
                      )}
                    </td>

                    <td className="p-3.5 font-semibold text-slate-800">
                      {order.quantity ? `${order.quantity} Kg` : '—'}
                    </td>

                    <td className="p-3.5">
                      {renderStatusBadge(order.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ==================================================================== */}
      {/* 5. PROFILE MODALS (Preserved)                                        */}
      {/* ==================================================================== */}
      {selectedBuyer && (
        <BuyerProfileModal
          buyerId={selectedBuyer.id}
          buyerName={selectedBuyer.name}
          buyerEmail={selectedBuyer.email}
          onClose={() => setSelectedBuyer(null)}
        />
      )}

      {selectedFarmer && (
        <FarmerProfileModal
          farmerId={selectedFarmer.id}
          farmerName={selectedFarmer.name}
          onClose={() => setSelectedFarmer(null)}
        />
      )}

    </div>
  );
};

export default Dashboard;
