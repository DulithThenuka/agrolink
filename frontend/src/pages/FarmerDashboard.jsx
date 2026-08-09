import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sprout, Sun, AlertTriangle, TrendingUp, ShoppingBag, PlusCircle, ArrowRight, ShieldCheck, DollarSign, Package, CheckCircle2, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ordersAPI } from '../services/api';

export const FarmerDashboard = () => {
  const { user } = useAuth();
  const farmerName = user?.email ? user.email.split('@')[0] : 'Farmer';

  const [farmerOrders, setFarmerOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [msg, setMsg] = useState('');

  const fetchFarmerOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await ordersAPI.getFarmerOrders({ page: 0, size: 20 });
      if (res && res.data) {
        setFarmerOrders(res.data.content || []);
      }
    } catch (err) {
      console.error('Failed to load farmer orders:', err);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    fetchFarmerOrders();
  }, []);

  const handleAcceptOrder = async (orderId) => {
    setActionLoading(orderId);
    setMsg('');
    try {
      const res = await ordersAPI.farmerAccept(orderId);
      if (res && (res.success || res.data)) {
        setMsg('✅ Order accepted! Transport requested from logistics fleet.');
        fetchFarmerOrders();
      }
    } catch (err) {
      setMsg(`❌ Acceptance failed: ${err}`);
    } finally {
      setActionLoading(null);
    }
  };

  const lowStockAlerts = [
    { name: 'Red Tomatoes (Batch A)', remaining: 12 },
    { name: 'Green Chillies (Section B)', remaining: 8 },
  ];

  const cropBenchmarks = [
    { crop: 'Samba Rice', current: 210, recommended: 240, demand: 'High 🔥' },
    { crop: 'Red Tomatoes', current: 160, recommended: 185, demand: 'High 🔥' },
    { crop: 'Nuwara Eliya Potatoes', current: 220, recommended: 240, demand: 'Moderate' },
    { crop: 'Green Chillies', current: 350, recommended: 390, demand: 'High 🔥' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8 animate-fade-in">
      {/* TOP GREETING BANNER */}
      <div className="glass rounded-3xl p-8 border border-white/80 shadow-2xl bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-950 text-white relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-wider">
              <Sprout className="w-4 h-4 text-emerald-400" /> Smart Agronomy & Order Dispatch Suite
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-display">
              Good Morning, <span className="capitalize">{farmerName}</span> 👨‍🌾
            </h1>
            <p className="text-emerald-100/80 text-sm max-w-xl">
              Your farm health score is optimal. Review incoming buyer crop orders below to accept and dispatch transport.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 shrink-0">
            <div className="text-center">
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-300 block">Overall Farm Health</span>
              <span className="text-4xl font-extrabold font-display text-white">87%</span>
            </div>
            <div className="w-12 h-12 rounded-full border-4 border-emerald-400 border-t-transparent animate-spin flex items-center justify-center text-lg shadow-inner">
              🌱
            </div>
          </div>
        </div>
      </div>

      {msg && (
        <div className={`p-4 rounded-2xl border font-bold text-xs ${msg.startsWith('✅') ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
          {msg}
        </div>
      )}

      {/* RISK & MARKET MATRIX */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <motion.div whileHover={{ y: -3 }} className="premium-card p-6 bg-white border border-slate-100/90 shadow-md flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Weather Risk</p>
            <h3 className="text-2xl font-extrabold font-display text-emerald-600 flex items-center gap-1.5">
              Low ☀️
            </h3>
            <p className="text-[11px] text-slate-500 font-semibold">26°C Sunny • 0% Rain Precip</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl font-bold border border-emerald-100">
            <Sun className="w-6 h-6 text-emerald-600" />
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -3 }} className="premium-card p-6 bg-white border border-slate-100/90 shadow-md flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Crop Disease Risk</p>
            <h3 className="text-2xl font-extrabold font-display text-amber-600 flex items-center gap-1.5">
              Medium ⚠️
            </h3>
            <p className="text-[11px] text-amber-700 font-semibold">Fungal alert for Solanaceae</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-2xl font-bold border border-amber-100">
            <AlertTriangle className="w-6 h-6 text-amber-600" />
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -3 }} className="premium-card p-6 bg-white border border-slate-100/90 shadow-md flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Market Demand</p>
            <h3 className="text-2xl font-extrabold font-display text-teal-600 flex items-center gap-1.5">
              High 🔥
            </h3>
            <p className="text-[11px] text-teal-700 font-semibold">Strong commercial buyer interest</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center text-2xl font-bold border border-teal-100">
            <TrendingUp className="w-6 h-6 text-teal-600" />
          </div>
        </motion.div>
      </div>

      {/* PENDING BUYER ORDERS & LOGISTICS DISPATCH TABLE */}
      <div className="premium-card p-6 bg-white border border-slate-100/90 shadow-lg space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900 font-display">Incoming Crop Orders &amp; Logistics Requests</h3>
            <p className="text-slate-500 text-xs font-medium">Accept buyer orders to trigger automated driver pickup and smart tracking</p>
          </div>
          <Link to="/crops/add" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center gap-1.5">
            <PlusCircle className="w-4 h-4" /> Publish New Batch
          </Link>
        </div>

        {loadingOrders ? (
          <div className="py-8 text-center text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-emerald-600 mb-2" />
            <span className="text-xs font-semibold">Scanning harvest orders...</span>
          </div>
        ) : farmerOrders.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
            <p className="text-sm font-bold text-slate-700">No Incoming Buyer Orders</p>
            <p className="text-xs text-slate-500">Orders placed on your crop listings will appear here for acceptance.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-100">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-400 font-bold uppercase text-[10px] tracking-widest border-b border-slate-100">
                <tr>
                  <th className="p-4">Harvest Item</th>
                  <th className="p-4">Buyer Account</th>
                  <th className="p-4">Quantity</th>
                  <th className="p-4">Fulfillment Status</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                {farmerOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-emerald-50/40 transition">
                    <td className="p-4 font-bold text-slate-900">{order.cropName}</td>
                    <td className="p-4 text-slate-500 text-xs">{order.buyerEmail || order.buyerName}</td>
                    <td className="p-4 font-extrabold text-slate-800">{order.quantity} Kg</td>
                    <td className="p-4">
                      <span className="badge-premium badge-pending uppercase text-[10px]">
                        {order.statusLabel || order.status}
                      </span>
                    </td>
                    <td className="p-4">
                      {order.status === 'PENDING' ? (
                        <button
                          onClick={() => handleAcceptOrder(order.id)}
                          disabled={actionLoading === order.id}
                          className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-xl transition flex items-center gap-1.5 disabled:opacity-50"
                        >
                          {actionLoading === order.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Accept Order &amp; Request Transport</span>
                            </>
                          )}
                        </button>
                      ) : (
                        <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Order Accepted
                        </span>
                      )}
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
