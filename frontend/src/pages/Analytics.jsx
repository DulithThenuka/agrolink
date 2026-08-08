import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, BarChart2, DollarSign, Sprout, ShoppingBag, PieChart, Calculator, CheckCircle2, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Analytics = () => {
  const [yieldKg, setYieldKg] = useState(500);
  const [suggestedPrice, setSuggestedPrice] = useState(2.50);

  const totalRevenue = (yieldKg * suggestedPrice).toFixed(2);
  const directProfit = (yieldKg * suggestedPrice * 0.92).toFixed(2);

  const commodityPrices = [
    { name: 'Samba Rice (Kg)', price: '220.00', change: '+2.4%', up: true },
    { name: 'Red Tomatoes (Kg)', price: '185.50', change: '+5.1%', up: true },
    { name: 'Nuwara Eliya Potatoes (Kg)', price: '240.00', change: '-1.2%', up: false },
    { name: 'Sweet Corn (Kg)', price: '140.00', change: '0.0%', up: true },
    { name: 'Green Chillies (Kg)', price: '390.00', change: '+8.3%', up: true },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8 animate-fade-in">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200/60">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2 border border-emerald-200/60">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Market Intelligence Matrix
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 font-display">Agricultural Market Analytics</h1>
          <p className="text-slate-500 text-sm mt-1">Real-time commodity price tracking, buyer savings metrics, and harvest forecasting.</p>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => window.print()} className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl shadow-sm transition">
            Export Report
          </button>
          <Link to="/crops" className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-500/20 hover:from-emerald-600 hover:to-emerald-700 transition">
            Browse Produce Catalog →
          </Link>
        </div>
      </div>

      {/* COMMODITY TICKER BAR */}
      <div className="glass rounded-2xl p-4 border border-white/80 shadow-md overflow-x-auto">
        <div className="flex items-center gap-6 min-w-max px-2">
          <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400 border-r border-slate-200 pr-4">Live Index</span>
          {commodityPrices.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs font-bold">
              <span className="text-slate-800">{item.name}</span>
              <span className="text-emerald-700">Rs.{item.price}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] flex items-center gap-0.5 ${item.up ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-700'}`}>
                {item.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {item.change}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div whileHover={{ y: -4 }} className="premium-card p-6 bg-white border border-slate-100/90 shadow-md">
          <p className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Total Traded Volume</p>
          <h2 className="text-3xl font-extrabold text-slate-900 font-display mt-2">$184,050.00</h2>
          <p className="text-xs text-emerald-600 font-bold mt-1">↑ +18.4% vs last quarter</p>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} className="premium-card p-6 bg-white border border-slate-100/90 shadow-md">
          <p className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Active Listings</p>
          <h2 className="text-3xl font-extrabold text-slate-900 font-display mt-2">142 Batches</h2>
          <p className="text-xs text-emerald-600 font-bold mt-1">Verified farm sources</p>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} className="premium-card p-6 bg-white border border-slate-100/90 shadow-md">
          <p className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Escrow Settled Orders</p>
          <h2 className="text-3xl font-extrabold text-slate-900 font-display mt-2">98 Orders</h2>
          <p className="text-xs text-emerald-600 font-bold mt-1">100% On-time fulfillment</p>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} className="premium-card p-6 bg-white border border-slate-100/90 shadow-md">
          <p className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Avg Buyer Savings</p>
          <h2 className="text-3xl font-extrabold text-emerald-600 font-display mt-2">34.2% Saved</h2>
          <p className="text-xs text-slate-500 font-semibold mt-1">Vs. wholesale middleman markup</p>
        </motion.div>
      </div>

      {/* VISUAL CARDS GRID */}
      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* PRICE BENCHMARK SUMMARY */}
        <div className="lg:col-span-7 premium-card p-6 bg-white border border-slate-100/90 shadow-lg space-y-6">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-emerald-600" /> Direct Trade vs Traditional Wholesale ($/Kg)
              </h3>
              <p className="text-xs text-slate-400">Comparing direct farm trade against traditional wholesale prices</p>
            </div>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 font-bold text-xs rounded-full">Price Matrix</span>
          </div>


          <div className="space-y-4">
            {[
              { crop: 'Samba Rice', direct: 2.20, wholesale: 3.10, savings: '29%' },
              { crop: 'Red Tomatoes', direct: 1.85, wholesale: 2.80, savings: '33%' },
              { crop: 'Nuwara Eliya Potatoes', direct: 2.40, wholesale: 3.50, savings: '31%' },
              { crop: 'Green Chillies', direct: 3.90, wholesale: 5.80, savings: '32%' },
            ].map((row, idx) => (
              <div key={idx} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{row.crop}</h4>
                  <div className="flex items-center gap-3 text-xs text-slate-500 font-semibold mt-0.5">
                    <span>Direct: <strong className="text-emerald-600">${row.direct}</strong></span>
                    <span>Wholesale: <span className="line-through">${row.wholesale}</span></span>
                  </div>
                </div>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-extrabold text-xs rounded-xl">
                  {row.savings} Saved
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* FARMER PROFIT CALCULATOR */}
        <div className="lg:col-span-5 premium-card p-6 bg-white border border-slate-100/90 shadow-lg space-y-5">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
              <Calculator className="w-5 h-5 text-emerald-600" /> Farmer Profit Estimator
            </h3>
            <p className="text-xs text-slate-400">Calculate net revenue bypassing middleman commission</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Harvest Yield (Kg)</label>
              <input
                type="number"
                value={yieldKg}
                onChange={(e) => setYieldKg(Number(e.target.value))}
                min="10"
                className="input-premium font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Listing Price ($ / Kg)</label>
              <input
                type="number"
                step="0.10"
                value={suggestedPrice}
                onChange={(e) => setSuggestedPrice(Number(e.target.value))}
                className="input-premium font-bold"
              />
            </div>

            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 space-y-2">
              <div className="flex justify-between items-center text-xs font-semibold text-slate-600">
                <span>Gross Revenue:</span>
                <span className="font-bold text-slate-900">${totalRevenue}</span>
              </div>
              <div className="flex justify-between items-center text-sm font-extrabold text-emerald-800">
                <span>Estimated Net Farmer Income:</span>
                <span className="text-xl font-display text-emerald-600">${directProfit}</span>
              </div>
            </div>

            <Link
              to="/crops"
              className="px-5 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-500/20 hover:from-emerald-600 hover:to-emerald-700 transition block text-center"
            >
              List Produce Batch Now →
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
