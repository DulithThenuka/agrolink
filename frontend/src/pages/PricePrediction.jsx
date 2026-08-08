import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, Calendar, AlertCircle, ArrowUpRight, CheckCircle2, CloudRain, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PricePrediction = () => {
  const [selectedCrop, setSelectedCrop] = useState('Tomato');

  const prediction = {
    cropName: selectedCrop,
    todaysMarketPriceLkr: 210.00,
    predictedFairPriceLkr: 225.00,
    sevenDayChangePercentage: 8.0,
    recommendation: 'WAIT 3–4 DAYS BEFORE SELLING',
    bestActionWindow: 'Optimal Sell Window: Day 4 – Day 5',
    factorBreakdown: [
      { name: 'Weather Forecast', impact: '+3.2% (Rainfall in Producing Belt)', positive: true },
      { name: 'Festival Demand Surge', impact: '+4.8% (Upcoming Cultural Festival)', positive: true },
      { name: 'Regional Wholesale Supply', impact: '-1.0% (Stable Inventory Inflow)', positive: false },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8 animate-fade-in">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200/60">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2 border border-emerald-200/60">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Time-Series Price Forecasting
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 font-display flex items-center gap-2">
            AI Market Price Prediction 📈
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Compare today's market price against AgroLink's predicted fair price and 7-day trend projections before selling.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/crops" className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-500/20 hover:from-emerald-600 hover:to-emerald-700 transition">
            Browse Produce Catalog →
          </Link>
        </div>
      </div>


      {/* CROP SELECTOR TABS */}
      <div className="flex flex-wrap gap-3 items-center">
        <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mr-2">Select Produce:</span>
        {['Tomato', 'Samba Rice', 'Potatoes', 'Green Chillies'].map((crop) => (
          <button
            key={crop}
            onClick={() => setSelectedCrop(crop)}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition border ${
              selectedCrop === crop
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-500/20'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-emerald-50 hover:text-emerald-700'
            }`}
          >
            {crop === 'Tomato' ? '🍅 Tomato' : crop === 'Samba Rice' ? '🌾 Samba Rice' : crop === 'Potatoes' ? '🥔 Potatoes' : '🌶️ Green Chillies'}
          </button>
        ))}
      </div>

      {/* KEY METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div whileHover={{ y: -3 }} className="premium-card p-6 bg-white border border-slate-100/90 shadow-md">
          <p className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Today's Market Price</p>
          <h2 className="text-3xl font-extrabold text-slate-900 font-display mt-2">Rs. {prediction.todaysMarketPriceLkr.toFixed(2)}/kg</h2>
          <p className="text-xs text-slate-500 font-semibold mt-1">Current wholesale average</p>
        </motion.div>

        <motion.div whileHover={{ y: -3 }} className="premium-card p-6 bg-white border border-slate-100/90 shadow-md">
          <p className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Predicted Fair Price</p>
          <h2 className="text-3xl font-extrabold text-emerald-600 font-display mt-2">Rs. {prediction.predictedFairPriceLkr.toFixed(2)}/kg</h2>
          <p className="text-xs text-emerald-600 font-bold mt-1">Target fair value benchmark</p>
        </motion.div>

        <motion.div whileHover={{ y: -3 }} className="premium-card p-6 bg-white border border-slate-100/90 shadow-md">
          <p className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Next 7 Days Forecast</p>
          <h2 className="text-3xl font-extrabold text-emerald-600 font-display mt-2">↑ Increase +{prediction.sevenDayChangePercentage}%</h2>
          <p className="text-xs text-emerald-600 font-bold mt-1">Bullish price trend</p>
        </motion.div>

        <motion.div whileHover={{ y: -3 }} className="premium-card p-6 bg-emerald-900 text-white shadow-xl flex flex-col justify-between">
          <div>
            <p className="text-xs font-extrabold text-emerald-300 uppercase tracking-widest">Actionable Recommendation</p>
            <h3 className="text-lg font-extrabold font-display mt-2">{prediction.recommendation}</h3>
          </div>
          <span className="text-[11px] text-emerald-200/80 font-bold block mt-2">{prediction.bestActionWindow}</span>
        </motion.div>
      </div>

      {/* MULTIFACTOR AI DRIVERS & ACTION */}
      <div className="grid lg:grid-cols-12 gap-8">
        
        <div className="lg:col-span-8 premium-card p-6 bg-white border border-slate-100/90 shadow-lg space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-600" /> AI Multifactor Impact Drivers
            </h3>
            <p className="text-xs text-slate-400">Key variables influencing the target price trajectory</p>
          </div>

          <div className="space-y-4">
            {prediction.factorBreakdown.map((factor, idx) => (
              <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{factor.name}</h4>
                  <p className="text-xs text-slate-600 font-semibold mt-0.5">{factor.impact}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${factor.positive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'}`}>
                  {factor.positive ? 'Positive Surge' : 'Neutral'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 premium-card p-6 bg-white border border-slate-100/90 shadow-lg space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 font-display">Trade Action Hub</h3>
            <p className="text-xs text-slate-400 mt-1">Take advantage of current price benchmarks to list or purchase crops.</p>
          </div>

          <div className="space-y-3">
            <Link
              to="/crops/add"
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-500/20 block text-center"
            >
              List Produce Batch →
            </Link>
            <Link
              to="/crops"
              className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl block text-center transition"
            >
              Browse Crop Catalog
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
