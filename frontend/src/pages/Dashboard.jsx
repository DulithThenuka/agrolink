import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI, cropsAPI, ordersAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Users, Sprout, ShoppingBag, PlusCircle, ArrowRight, Loader2, TrendingUp, Sparkles, LogOut, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FarmerDashboard } from './FarmerDashboard';
import { Logistics } from './Logistics';
import { ExpertDashboard } from './ExpertDashboard';
import { SupplierDashboard } from './SupplierDashboard';
import { BusinessBuyerDashboard } from './BusinessBuyerDashboard';
import { BuyerProfileModal } from '../components/BuyerProfileModal';

export const Dashboard = () => {
  const { user, isFarmer, isBuyer, isBusinessBuyer, isLogistics, isExpert, isSupplier, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  // ── All hooks MUST be declared unconditionally before any early return ──
  const [selectedBuyer, setSelectedBuyer] = useState(null);
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
          if (adminRes && adminRes.data) {
            setStats({
              totalUsers: adminRes.data.totalUsers || 0,
              totalCrops: adminRes.data.totalCrops || 0,
              totalOrders: adminRes.data.totalOrders || 0,
            });
            setRecentOrders(adminRes.data.recentOrders || []);
          }
        } else if (isBuyer) {
          const ordersRes = await ordersAPI.getMyOrders({ page: 0, size: 5 });
          if (ordersRes && ordersRes.data) {
            setRecentOrders(ordersRes.data.content || []);
            setStats((s) => ({ ...s, totalOrders: ordersRes.data.totalElements || 0 }));
          }
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

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8 animate-fade-in">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200/60">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 font-display">Dashboard Overview</h1>
            <Sparkles className="w-5 h-5 text-emerald-500" />
          </div>
          <p className="text-slate-500 text-sm mt-1">Monitor real-time trade activity, list harvests, and track pending dispatches.</p>
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
        <div className="premium-card p-6 bg-white border border-slate-100/90 shadow-md hover:shadow-xl transition-all duration-300 flex items-center justify-between group">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <p className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Account Role</p>
              <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                Verified
              </span>
            </div>
            <h2 className="text-2xl font-extrabold font-display text-slate-900">{user?.role || 'BUYER'}</h2>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shadow-sm group-hover:scale-110 transition duration-300">
            <Users className="w-7 h-7" />
          </div>
        </div>

        <div className="premium-card p-6 bg-white border border-slate-100/90 shadow-md hover:shadow-xl transition-all duration-300 flex items-center justify-between group">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <p className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Total Orders</p>
              <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                +14% this mo
              </span>
            </div>
            <h2 className="text-3xl font-extrabold font-display text-slate-900">{stats.totalOrders}</h2>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-purple-50 border border-purple-100 text-purple-600 flex items-center justify-center shadow-sm group-hover:scale-110 transition duration-300">
            <ShoppingBag className="w-7 h-7" />
          </div>
        </div>

        <div className="premium-card p-6 bg-white border border-slate-100/90 shadow-md hover:shadow-xl transition-all duration-300 flex items-center justify-between group">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <p className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Active Crops</p>
              <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                Live Feed
              </span>
            </div>
            <h2 className="text-3xl font-extrabold font-display text-slate-900">{stats.totalCrops || 'Live'}</h2>
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

          {isFarmer && (
            <Link
              to="/crops/add"
              className="px-5 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-500/20 transition flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" /> Publish Crop Listing
            </Link>
          )}

          {isBuyer && (
            <Link
              to="/orders"
              className="px-5 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-500/20 transition flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" /> Manage Orders
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
          <h2 className="text-base font-bold text-slate-800 font-display">Recent Trade Activity</h2>
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
            <p className="text-xs text-slate-500">Transactions will automatically populate once purchases occur.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-100">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-400 font-bold uppercase text-[10px] tracking-widest border-b border-slate-100">
                <tr>
                  <th className="p-4">Produce Name</th>
                  <th className="p-4">Buyer Account</th>
                  <th className="p-4">Quantity</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-emerald-50/40 transition">
                    <td className="p-4 font-bold text-slate-900">{order.cropName || order.crop?.name || 'Crop Batch'}</td>
                    <td className="p-4 text-slate-500 text-xs">
                      <button
                        type="button"
                        onClick={() => setSelectedBuyer({ id: order.buyerId, name: order.buyerName, email: order.buyerEmail || user?.email })}
                        className="text-emerald-700 font-bold hover:underline"
                      >
                        {order.buyerEmail || user?.email || 'Buyer'} ⭐
                      </button>
                    </td>
                    <td className="p-4 font-bold">{order.quantity} Kg</td>
                    <td className="p-4">
                      <span className="badge-premium badge-delivered">
                        {order.status || 'DELIVERED'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedBuyer && (
        <BuyerProfileModal
          buyerId={selectedBuyer.id}
          buyerName={selectedBuyer.name}
          buyerEmail={selectedBuyer.email}
          onClose={() => setSelectedBuyer(null)}
        />
      )}
    </div>
  );
};

