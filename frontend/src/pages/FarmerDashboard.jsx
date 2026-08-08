import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sprout, Sun, AlertTriangle, TrendingUp, ShoppingBag, PlusCircle, ArrowRight, ShieldCheck, DollarSign, Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const FarmerDashboard = () => {
  const { user } = useAuth();
  const farmerName = user?.email ? user.email.split('@')[0] : 'Farmer';

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

  const recentOrders = [
    { id: 101, crop: 'Samba Rice (100 Kg)', buyer: 'buyer1@trade.com', qty: 100, status: 'PENDING' },
    { id: 102, crop: 'Red Tomatoes (50 Kg)', buyer: 'hotel_colombo@trade.com', qty: 50, status: 'CONFIRMED' },
    { id: 103, crop: 'Nuwara Eliya Potatoes', buyer: 'retail_super@market.lk', qty: 200, status: 'DELIVERED' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8 animate-fade-in">
      {/* TOP GREETING BANNER */}
      <div className="glass rounded-3xl p-8 border border-white/80 shadow-2xl bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-950 text-white relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-wider">
              <Sprout className="w-4 h-4 text-emerald-400" /> Smart Agronomy Suite
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-display">
              Good Morning, <span className="capitalize">{farmerName}</span> 👨‍🌾
            </h1>
            <p className="text-emerald-100/80 text-sm max-w-xl">
              Your farm health score is optimal. Review live risk gauges, low-stock warnings, and buyer orders below.
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

      {/* CORE FINANCIAL & INVENTORY STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="premium-card p-6 bg-white border border-slate-100/90 shadow-md">
          <p className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Current Crops</p>
          <h2 className="text-3xl font-extrabold text-slate-900 font-display mt-2">6 Batches</h2>
          <p className="text-xs text-emerald-600 font-bold mt-1">1,450 Kg Active Inventory</p>
        </div>

        <div className="premium-card p-6 bg-white border border-slate-100/90 shadow-md">
          <p className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Expected Revenue</p>
          <h2 className="text-3xl font-extrabold text-emerald-600 font-display mt-2">Rs. 248,000</h2>
          <p className="text-xs text-slate-500 font-semibold mt-1">Projected gross direct trade</p>
        </div>

        <div className="premium-card p-6 bg-white border border-slate-100/90 shadow-md">
          <p className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Pending Orders</p>
          <h2 className="text-3xl font-extrabold text-amber-600 font-display mt-2">12 Orders</h2>
          <p className="text-xs text-amber-700 font-bold mt-1">Requires harvest dispatch</p>
        </div>

        <div className="premium-card p-6 bg-white border border-slate-100/90 shadow-md">
          <p className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Delivery Success</p>
          <h2 className="text-3xl font-extrabold text-slate-900 font-display mt-2">99.4%</h2>
          <p className="text-xs text-emerald-600 font-bold mt-1">On-time logistics rating</p>
        </div>
      </div>

      {/* LOW-STOCK ALERTS & RECOMMENDED PRICING */}
      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* LOW STOCK ALERTS */}
        <div className="lg:col-span-6 premium-card p-6 bg-white border border-slate-100/90 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" /> Low-Stock Inventory Alerts
            </h3>
            <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full">Re-stock Warning</span>
          </div>

          <div className="space-y-3">
            {lowStockAlerts.map((item, idx) => (
              <div key={idx} className="p-3.5 bg-amber-50/80 rounded-2xl border border-amber-200/80 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{item.name}</h4>
                  <p className="text-xs text-amber-800 font-semibold mt-0.5">Only {item.remaining} Kg remaining in warehouse</p>
                </div>
                <Link to="/crops/add" className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-sm transition">
                  Re-stock +
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* AGRONOMY RECOMMENDED SELLING PRICES */}
        <div className="lg:col-span-6 premium-card p-6 bg-white border border-slate-100/90 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" /> Agronomy Price Benchmarks
            </h3>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">AI Price Suggestion</span>
          </div>

          <div className="space-y-3">
            {cropBenchmarks.map((bench, idx) => (
              <div key={idx} className="p-3 bg-slate-50 rounded-2xl border border-slate-200/70 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900 text-sm block">{bench.crop}</span>
                  <span className="text-slate-500 font-semibold">Current: Rs. {bench.current}/Kg</span>
                </div>
                <div className="text-right">
                  <span className="font-extrabold text-emerald-600 text-sm block">Rec: Rs. {bench.recommended}/Kg</span>
                  <span className="text-[10px] font-bold text-emerald-700 uppercase">{bench.demand}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* PENDING BUYER ORDERS TABLE */}
      <div className="premium-card p-6 bg-white border border-slate-100/90 shadow-lg space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 font-display">Pending Buyer Orders &amp; Dispatch</h3>
          <Link to="/crops/add" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center gap-1.5">
            <PlusCircle className="w-4 h-4" /> Publish New Batch
          </Link>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-100">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-400 font-bold uppercase text-[10px] tracking-widest border-b border-slate-100">
              <tr>
                <th className="p-4">Harvest Item</th>
                <th className="p-4">Buyer Account</th>
                <th className="p-4">Quantity</th>
                <th className="p-4">Status</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-emerald-50/40 transition">
                  <td className="p-4 font-bold text-slate-900">{order.crop}</td>
                  <td className="p-4 text-slate-500 text-xs">{order.buyer}</td>
                  <td className="p-4 font-extrabold text-slate-800">{order.qty} Kg</td>
                  <td className="p-4">
                    <span className="badge-premium badge-pending uppercase text-[10px]">
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <button onClick={() => alert('Order marked as dispatched!')} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-[11px] font-bold rounded-xl transition">
                      Mark Dispatched →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
