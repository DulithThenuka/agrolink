import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI, cropsAPI, ordersAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Users, Sprout, ShoppingBag, PlusCircle, ArrowRight, Loader2 } from 'lucide-react';

export const Dashboard = () => {
  const { user, isFarmer, isBuyer, isAdmin } = useAuth();
  const [stats, setStats] = useState({ totalUsers: 0, totalCrops: 0, totalOrders: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
  }, [isAdmin, isBuyer]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8 animate-fade-in">
      {/* HEADER */}
      <div className="flex justify-between items-center pb-5 border-b border-slate-200/60">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 font-display">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Monitor activity, track live crops, and manage direct trade.</p>
        </div>

        <div className="px-4 py-2 bg-emerald-50 text-emerald-700 font-bold rounded-2xl text-xs flex items-center gap-1.5 border border-emerald-100 shadow-sm">
          <span>👋</span> Welcome back, {user?.email}
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="premium-card p-6 bg-white border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Account Role</p>
            <h2 className="text-2xl font-extrabold mt-2 font-display text-slate-800">{user?.role || 'BUYER'}</h2>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="premium-card p-6 bg-white border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Orders</p>
            <h2 className="text-3xl font-extrabold mt-2 font-display text-slate-800">{stats.totalOrders}</h2>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        <div className="premium-card p-6 bg-white border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Crops</p>
            <h2 className="text-3xl font-extrabold mt-2 font-display text-slate-800">{stats.totalCrops || 'Live'}</h2>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Sprout className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div className="premium-card p-6 bg-white border border-slate-100">
        <h2 className="text-base font-bold text-slate-800 font-display mb-4">Quick Actions</h2>
        
        <div className="flex flex-wrap gap-3">
          {isFarmer && (
            <Link
              to="/crops/add"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-100 transition flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" /> Add Crop Listing
            </Link>
          )}

          {isBuyer && (
            <Link
              to="/orders"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-100 transition flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" /> Manage Orders
            </Link>
          )}

          <Link
            to="/crops"
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition flex items-center gap-2"
          >
            <Sprout className="w-4 h-4" /> Browse Catalog
          </Link>
        </div>
      </div>

      {/* RECENT ORDERS TABLE */}
      <div className="premium-card p-6 bg-white border border-slate-100 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-base font-bold text-slate-800 font-display">Recent Orders Activity</h2>
          {isBuyer && (
            <Link to="/orders" className="text-xs text-emerald-600 hover:text-emerald-700 font-bold transition flex items-center gap-1">
              View All Orders <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {loading ? (
          <div className="py-8 text-center text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-emerald-600 mb-2" />
            <span className="text-xs font-semibold">Loading orders...</span>
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="text-center py-10 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
            <p className="text-sm font-bold text-slate-700">No Recent Orders</p>
            <p className="text-xs text-slate-500">Transactions will appear here once purchases are made.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-100">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-100">
                <tr>
                  <th className="p-4">Crop Name</th>
                  <th className="p-4">Buyer</th>
                  <th className="p-4">Quantity</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50 transition">
                    <td className="p-4 font-bold text-slate-900">{order.cropName || order.crop?.name || 'Crop Listing'}</td>
                    <td className="p-4 text-slate-500 text-xs">{order.buyerEmail || user?.email}</td>
                    <td className="p-4">{order.quantity}</td>
                    <td className="p-4">
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                        {order.status || 'PENDING'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
