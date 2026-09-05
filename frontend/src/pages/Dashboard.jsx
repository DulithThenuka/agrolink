import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { adminAPI, cropsAPI, ordersAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Users, Sprout, ShoppingBag, ArrowRight, Loader2, Sparkles, LogOut, ShieldCheck, UserCheck } from 'lucide-react';
import { FarmerDashboard } from './FarmerDashboard';
import { Logistics } from './Logistics';
import { ExpertDashboard } from './ExpertDashboard';
import { SupplierDashboard } from './SupplierDashboard';
import { BusinessBuyerDashboard } from './BusinessBuyerDashboard';
import { BuyerProfileModal } from '../components/BuyerProfileModal';
import { FarmerProfileModal } from '../components/FarmerProfileModal';

export const Dashboard = () => {
  const { user, isFarmer, isBuyer, isBusinessBuyer, isLogistics, isExpert, isSupplier, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  // ── All hooks MUST be declared unconditionally before any early return ──
  const [selectedBuyer, setSelectedBuyer] = useState(null);
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [stats, setStats] = useState({ totalUsers: 0, totalCrops: 0, totalOrders: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Roles with dedicated dashboards skip default buyer/admin data fetching
    if (isFarmer || isLogistics || isExpert || isSupplier || isBusinessBuyer) return;

    const loadDashboardData = async () => {
      setLoading(true);
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
          // Regular Buyer / default user view
          const [ordersRes, cropsRes] = await Promise.allSettled([
            ordersAPI.getMyOrders({ page: 0, size: 5 }),
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
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, [isAdmin, isBuyer, isFarmer, isLogistics, isExpert, isSupplier, isBusinessBuyer]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // ── Role-based render delegation (after all hooks) ──
  if (isFarmer) return <FarmerDashboard />;
  if (isLogistics) return <Logistics />;
  if (isExpert) return <ExpertDashboard />;
  if (isSupplier) return <SupplierDashboard />;
  if (isBusinessBuyer) return <BusinessBuyerDashboard />;

  const renderStatusBadge = (status) => {
    const s = (status || 'DELIVERED').toUpperCase();
    if (s === 'DELIVERED' || s === 'COMPLETED') {
      return (
        <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
          DELIVERED
        </span>
      );
    }
    if (s === 'PENDING' || s === 'PLACED') {
      return (
        <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-amber-100 text-amber-800 border border-amber-200">
          {status || 'PENDING'}
        </span>
      );
    }
    if (s === 'DISPATCHED' || s === 'IN_TRANSIT' || s === 'SHIPPED') {
      return (
        <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-blue-100 text-blue-800 border border-blue-200">
          {status || 'IN_TRANSIT'}
        </span>
      );
    }
    if (s === 'CANCELLED' || s === 'DISPUTED') {
      return (
        <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-red-100 text-red-800 border border-red-200">
          {status || 'DISPUTED'}
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-slate-100 text-slate-800 border border-slate-200">
        {status}
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8 animate-fade-in">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200/60">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 font-display">
              {isAdmin ? 'Admin Control Overview' : 'Buyer Dashboard Overview'}
            </h1>
            <Sparkles className="w-5 h-5 text-emerald-500" />
          </div>
          <p className="text-slate-500 text-sm mt-1">
            {isAdmin
              ? 'Real-time ecosystem metrics, order activities, and system oversight.'
              : 'Monitor your orders, track deliveries from local farmers, and explore fresh harvests.'}
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <div className="px-4 py-2 bg-emerald-50 text-emerald-800 font-bold rounded-2xl text-xs flex items-center gap-2 border border-emerald-200/70 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Welcome back, {user?.name || 'User'}</span>
          </div>

          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-2xl text-xs flex items-center gap-1.5 border border-red-200/70 transition shadow-sm"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {isAdmin ? (
          /* Admin Card 1: Total Platform Users */
          <div className="premium-card p-6 bg-white border border-slate-100/90 shadow-md hover:shadow-xl transition-all duration-300 flex items-center justify-between group">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <p className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Total Platform Users</p>
                <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                  Registered
                </span>
              </div>
              <h2 className="text-3xl font-extrabold font-display text-slate-900">{stats.totalUsers}</h2>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shadow-sm group-hover:scale-110 transition duration-300">
              <Users className="w-7 h-7" />
            </div>
          </div>
        ) : (
          /* Buyer Card 1: Account & Role */
          <div className="premium-card p-6 bg-white border border-slate-100/90 shadow-md hover:shadow-xl transition-all duration-300 flex items-center justify-between group">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <p className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Account Status</p>
                <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                  Active Buyer
                </span>
              </div>
              <h2 className="text-2xl font-extrabold font-display text-slate-900">{user?.role || 'BUYER'}</h2>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shadow-sm group-hover:scale-110 transition duration-300">
              <UserCheck className="w-7 h-7" />
            </div>
          </div>
        )}

        {/* Card 2: Total Orders / My Orders */}
        <div className="premium-card p-6 bg-white border border-slate-100/90 shadow-md hover:shadow-xl transition-all duration-300 flex items-center justify-between group">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <p className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">
                {isAdmin ? 'Total Platform Orders' : 'My Orders'}
              </p>
              <span className="text-[10px] font-extrabold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100">
                {isAdmin ? 'All-Time' : 'Purchases'}
              </span>
            </div>
            <h2 className="text-3xl font-extrabold font-display text-slate-900">{stats.totalOrders}</h2>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-purple-50 border border-purple-100 text-purple-600 flex items-center justify-center shadow-sm group-hover:scale-110 transition duration-300">
            <ShoppingBag className="w-7 h-7" />
          </div>
        </div>

        {/* Card 3: Active Crops / Marketplace Produce */}
        <div className="premium-card p-6 bg-white border border-slate-100/90 shadow-md hover:shadow-xl transition-all duration-300 flex items-center justify-between group">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <p className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">
                {isAdmin ? 'Active Crop Listings' : 'Marketplace Crops'}
              </p>
              <span className="text-[10px] font-extrabold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-100">
                Live
              </span>
            </div>
            <h2 className="text-3xl font-extrabold font-display text-slate-900">{stats.totalCrops ?? 0}</h2>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-sky-50 border border-sky-100 text-sky-600 flex items-center justify-center shadow-sm group-hover:scale-110 transition duration-300">
            <Sprout className="w-7 h-7" />
          </div>
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div className="premium-card p-6 bg-white border border-slate-100/90 shadow-md">
        <h2 className="text-base font-bold text-slate-800 font-display mb-4">Quick Management Actions</h2>
        
        <div className="flex flex-wrap gap-3">
          <Link
            to="/gov-intelligence"
            className="px-5 py-3 bg-slate-900 hover:bg-slate-950 text-emerald-400 font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2 border border-slate-800"
          >
            <span className="text-base">🏛️</span> Sri Lanka Agricultural Overview 🇱🇰
          </Link>

          {isBuyer && (
            <Link
              to="/orders"
              className="px-5 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-500/20 transition flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" /> Manage My Orders
            </Link>
          )}

          <Link
            to="/crops"
            className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition flex items-center gap-2"
          >
            <Sprout className="w-4 h-4 text-emerald-600" /> Browse Crop Catalog
          </Link>
        </div>
      </div>

      {/* RECENT ORDERS TABLE */}
      <div className="premium-card p-6 bg-white border border-slate-100/90 shadow-md space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-base font-bold text-slate-800 font-display">
            {isAdmin ? 'Recent Platform Trade Activity' : 'My Recent Order Activity'}
          </h2>
          {isBuyer && (
            <Link to="/orders" className="text-xs text-emerald-600 hover:text-emerald-700 font-bold transition flex items-center gap-1">
              View All Orders <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {loading ? (
          <div className="py-8 text-center text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-emerald-600 mb-2" />
            <span className="text-xs font-semibold">Loading transactions...</span>
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
            <p className="text-sm font-bold text-slate-700">No Recent Orders</p>
            <p className="text-xs text-slate-500">
              {isAdmin
                ? 'Platform transactions will populate as users trade.'
                : 'Your placed orders and delivery status will appear here.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-100">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-400 font-bold uppercase text-[10px] tracking-widest border-b border-slate-100">
                <tr>
                  <th className="p-4">Produce Name</th>
                  <th className="p-4">{isAdmin ? 'Buyer Account' : 'Farmer / Seller'}</th>
                  <th className="p-4">Quantity</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-emerald-50/40 transition">
                    <td className="p-4 font-bold text-slate-900">{order.cropName || order.crop?.name || 'Crop Batch'}</td>
                    <td className="p-4 text-slate-500 text-xs">
                      {isAdmin ? (
                        <button
                          type="button"
                          onClick={() => setSelectedBuyer({ id: order.buyerId, name: order.buyerName, email: order.buyerEmail })}
                          className="text-emerald-700 font-bold hover:underline"
                        >
                          {order.buyerEmail || order.buyerName || 'Buyer'} ⭐
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setSelectedFarmer({ id: order.farmerId, name: order.farmerName || 'Local Farmer' })}
                          className="text-emerald-700 font-bold hover:underline flex items-center gap-1"
                        >
                          <span>{order.farmerName || 'Local Farmer'}</span>
                          <span>🌾</span>
                        </button>
                      )}
                    </td>
                    <td className="p-4 font-bold">{order.quantity} Kg</td>
                    <td className="p-4">
                      {renderStatusBadge(order.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Profile Modals */}
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
