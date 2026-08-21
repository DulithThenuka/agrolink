import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, Calendar, AlertCircle, ArrowUpRight, CheckCircle2, CloudRain, Sparkles, Calculator, Layers, ShieldCheck, MapPin, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { pricePredictionAPI } from '../services/api';
import { PriceTrendChart } from '../components/PriceTrendChart';

export const PricePrediction = () => {
  const [selectedCrop, setSelectedCrop] = useState('Tomato');
  const [selectedLocation, setSelectedLocation] = useState('Dambulla');
  const [selectedGrade, setSelectedGrade] = useState('Grade B');
  const [predictionData, setPredictionData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [harvestQty, setHarvestQty] = useState(500);

  const locations = [
    { id: 'Dambulla', name: 'Dambulla (Central Hub)', desc: 'National Price Benchmark' },
    { id: 'Pettah', name: 'Pettah (Manning Market)', desc: 'Urban Retail & Freight Hub' },
    { id: 'Keppetipola', name: 'Keppetipola (Upcountry)', desc: 'Direct Farmgate Baseline' },
    { id: 'Meegoda', name: 'Meegoda (Western Hub)', desc: 'Supermarket Supply Center' },
    { id: 'Jaffna', name: 'Jaffna (Northern Hub)', desc: 'Regional North Distribution' },
  ];

  const grades = [
    { id: 'Grade A', name: 'Grade A (Supermarket/Export)', badge: 'Premium +22%', color: 'emerald' },
    { id: 'Grade B', name: 'Grade B (Standard Wholesale)', badge: 'Baseline', color: 'blue' },
    { id: 'Grade C', name: 'Grade C (Processing/Bulk)', badge: 'Discount -18%', color: 'amber' },
  ];

  useEffect(() => {
    const fetchPrediction = async () => {
      setLoading(true);
      try {
        const res = await pricePredictionAPI.getPrediction(selectedCrop, selectedLocation, selectedGrade);
        if (res && res.data) {
          setPredictionData(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch price prediction:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPrediction();
  }, [selectedCrop, selectedLocation, selectedGrade]);

  const prediction = {
    cropName: predictionData?.cropName || selectedCrop,
    location: predictionData?.location || selectedLocation,
    selectedGrade: predictionData?.selectedGrade || selectedGrade,
    todaysMarketPriceLkr: Number(predictionData?.todaysMarketPriceLkr) || 180.00,
    predictedFairPriceLkr: Number(predictionData?.predictedFairPriceLkr) || 215.00,
    gradeAPriceLkr: Number(predictionData?.gradeAPriceLkr) || 262.30,
    gradeBPriceLkr: Number(predictionData?.gradeBPriceLkr) || 215.00,
    gradeCPriceLkr: Number(predictionData?.gradeCPriceLkr) || 176.30,
    sevenDayChangePercentage: predictionData?.sevenDayChangePercentage ?? 19.4,
    recommendation: predictionData?.recommendation || 'WAIT 3–4 DAYS BEFORE SELLING',
    bestActionWindow: predictionData?.bestActionWindow || 'Optimal Sell Window: Day 3 – Day 5',
    historicalPrices: predictionData?.historicalPrices?.length ? predictionData.historicalPrices : [150, 158, 164, 170, 176, 180],
    forecastPrices: predictionData?.forecastPrices?.length ? predictionData.forecastPrices : [188, 196, 206, 215, 212, 205, 198],
    factorBreakdown: predictionData?.factorBreakdown?.map(f => ({
      name: f.factorName,
      impact: f.impactText,
      positive: f.positive
    })) || [
      { name: 'Central Belt Weather', impact: '+8.5% (Excess rain in Welimada reduced picking)', positive: true },
      { name: 'Economic Center Inflow', impact: '+7.2% (Dambulla arrivals down 20%)', positive: true },
      { name: 'Urban Supermarket Demand', impact: '+3.7% (High demand for Grade A produce)', positive: true },
    ],
  };

  // Calculator calculations
  const todayRevenue = harvestQty * prediction.todaysMarketPriceLkr;
  const targetRevenue = harvestQty * prediction.predictedFairPriceLkr;
  const netGain = targetRevenue - todayRevenue;
  const percentageGain = prediction.todaysMarketPriceLkr > 0 ? ((netGain / todayRevenue) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8 animate-fade-in">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200/60">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2 border border-emerald-200/60">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Multi-Regional Commodity Analytics
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 font-display flex items-center gap-2">
            AI Market Price Prediction 📈
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Analyze localized wholesale price benchmarks across Sri Lankan economic centers & quality produce grades.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/crops" className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-500/20 hover:from-emerald-600 hover:to-emerald-700 transition">
            Browse Produce Catalog →
          </Link>
        </div>
      </div>

      {/* FILTER BAR: CROP SELECTOR + REGIONAL LOCATION + QUALITY GRADE */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
        {/* ROW 1: CROP & LOCATION SELECTORS */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* CROP TABS */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mr-2">Produce:</span>
            {['Tomato', 'Samba Rice', 'Potatoes', 'Green Chillies'].map((crop) => (
              <button
                key={crop}
                onClick={() => setSelectedCrop(crop)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition border ${
                  selectedCrop === crop
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-500/20'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-emerald-50 hover:text-emerald-700'
                }`}
              >
                {crop === 'Tomato' ? '🍅 Tomato' : crop === 'Samba Rice' ? '🌾 Samba Rice' : crop === 'Potatoes' ? '🥔 Potatoes' : '🌶️ Green Chillies'}
              </button>
            ))}
          </div>

          {/* REGIONAL MARKET DROPDOWN */}
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Market Hub:</span>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            >
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  📍 {loc.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ROW 2: QUALITY GRADE BENCHMARK TABS */}
        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Quality Produce Grade:</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full sm:w-auto">
            {grades.map((g) => {
              const isSelected = selectedGrade === g.id;
              const price = g.id === 'Grade A' ? prediction.gradeAPriceLkr : g.id === 'Grade C' ? prediction.gradeCPriceLkr : prediction.gradeBPriceLkr;

              return (
                <button
                  key={g.id}
                  onClick={() => setSelectedGrade(g.id)}
                  className={`px-4 py-2.5 rounded-xl border text-left transition flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-emerald-900 text-white border-emerald-900 shadow-md'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                  }`}
                >
                  <div>
                    <p className="text-xs font-extrabold">{g.name}</p>
                    <p className={`text-[11px] font-semibold ${isSelected ? 'text-emerald-300' : 'text-slate-500'}`}>
                      Rs. {price.toFixed(2)}/kg
                    </p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    isSelected
                      ? 'bg-emerald-800 text-emerald-200'
                      : g.id === 'Grade A' ? 'bg-emerald-100 text-emerald-800' : g.id === 'Grade C' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {g.badge}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* KEY METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div whileHover={{ y: -3 }} className="premium-card p-6 bg-white border border-slate-100/90 shadow-md">
          <div className="flex justify-between items-start">
            <p className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Today's Market Price</p>
            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-bold">📍 {selectedLocation}</span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 font-display mt-2">Rs. {prediction.todaysMarketPriceLkr.toFixed(2)}/kg</h2>
          <p className="text-xs text-slate-500 font-semibold mt-1">{selectedGrade} Wholesale average</p>
        </motion.div>

        <motion.div whileHover={{ y: -3 }} className="premium-card p-6 bg-white border border-slate-100/90 shadow-md">
          <div className="flex justify-between items-start">
            <p className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Predicted Fair Price</p>
            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold">✦ AI Target</span>
          </div>
          <h2 className="text-3xl font-extrabold text-emerald-600 font-display mt-2">Rs. {prediction.predictedFairPriceLkr.toFixed(2)}/kg</h2>
          <p className="text-xs text-emerald-600 font-bold mt-1">Fair value for {selectedGrade}</p>
        </motion.div>

        <motion.div whileHover={{ y: -3 }} className="premium-card p-6 bg-white border border-slate-100/90 shadow-md">
          <p className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Next 7 Days Forecast</p>
          <h2 className={`text-3xl font-extrabold font-display mt-2 ${prediction.sevenDayChangePercentage >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
            {prediction.sevenDayChangePercentage >= 0 ? `↑ +${prediction.sevenDayChangePercentage}%` : `↓ ${prediction.sevenDayChangePercentage}%`}
          </h2>
          <p className={`text-xs font-bold mt-1 ${prediction.sevenDayChangePercentage >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
            {prediction.sevenDayChangePercentage >= 0 ? 'Bullish price surge expected' : 'Bearish downward pressure'}
          </p>
        </motion.div>

        <motion.div whileHover={{ y: -3 }} className="premium-card p-6 bg-emerald-900 text-white shadow-xl flex flex-col justify-between">
          <div>
            <p className="text-xs font-extrabold text-emerald-300 uppercase tracking-widest">Actionable Recommendation</p>
            <h3 className="text-base font-extrabold font-display mt-2 text-white">{prediction.recommendation}</h3>
          </div>
          <span className="text-[11px] text-emerald-200/90 font-bold block mt-2">{prediction.bestActionWindow}</span>
        </motion.div>
      </div>

      {/* WHAT-IF HARVEST PROFIT CALCULATOR */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-700/80 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-700/60 pb-4">
          <div className="flex items-center gap-3">
            <span className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Calculator className="w-6 h-6" />
            </span>
            <div>
              <h3 className="text-xl font-bold font-display text-white">Harvest Revenue & Profit Calculator 💡</h3>
              <p className="text-xs text-slate-300">
                Simulate earnings for <span className="font-extrabold text-emerald-400">{selectedGrade}</span> at <span className="font-extrabold text-emerald-400">{selectedLocation}</span>
              </p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-extrabold border border-emerald-500/30 self-start sm:self-auto">
            Interactive Scenario Tool
          </span>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-center">
          {/* SLIDER CONTROLS */}
          <div className="lg:col-span-6 space-y-5">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Harvest Batch Quantity (kg):
                </label>
                <span className="text-lg font-extrabold text-emerald-400 font-display">
                  {harvestQty.toLocaleString()} kg
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="5000"
                step="50"
                value={harvestQty}
                onChange={(e) => setHarvestQty(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-medium">
                <span>50 kg</span>
                <span>1,000 kg</span>
                <span>2,500 kg</span>
                <span>5,000 kg</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setHarvestQty(250)}
                className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 border border-slate-700 transition"
              >
                Smallholder (250 kg)
              </button>
              <button
                onClick={() => setHarvestQty(1000)}
                className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 border border-slate-700 transition"
              >
                Commercial (1,000 kg)
              </button>
            </div>
          </div>

          {/* CALCULATED REVENUE GAIN DISPLAY */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-800/80 rounded-xl p-5 border border-slate-700">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Selling Today ({selectedLocation}):</span>
              <p className="text-2xl font-extrabold text-slate-200 font-display">
                Rs. {todayRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <span className="text-[11px] text-slate-400">@ Rs. {prediction.todaysMarketPriceLkr.toFixed(2)}/kg</span>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">Selling at AI Target Window:</span>
              <p className="text-2xl font-extrabold text-emerald-400 font-display">
                Rs. {targetRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <span className="text-[11px] text-emerald-300">@ Rs. {prediction.predictedFairPriceLkr.toFixed(2)}/kg</span>
            </div>

            <div className="sm:col-span-2 pt-3 border-t border-slate-700 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-300">Net Additional Revenue:</span>
                <p className={`text-xl font-extrabold font-display ${netGain >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {netGain >= 0 ? `+ Rs. ${netGain.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : `- Rs. ${Math.abs(netGain).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                </p>
              </div>
              <span className={`px-3 py-1.5 rounded-xl text-xs font-extrabold ${netGain >= 0 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'}`}>
                {netGain >= 0 ? `+${percentageGain.toFixed(1)}% Extra Gain` : `${percentageGain.toFixed(1)}% Loss`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* INTERACTIVE 14-DAY PRICE TREND & FORECAST CHART */}
      <PriceTrendChart
        cropName={`${prediction.cropName} (${selectedLocation} - ${selectedGrade})`}
        historical={prediction.historicalPrices}
        forecast={prediction.forecastPrices}
        todaysPrice={prediction.todaysMarketPriceLkr}
        bestWindow={prediction.bestActionWindow}
      />

      {/* MULTIFACTOR AI DRIVERS & ACTION */}
      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 premium-card p-6 bg-white border border-slate-100/90 shadow-lg space-y-4">
          <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-600" /> AI Multifactor Impact Drivers
              </h3>
              <p className="text-xs text-slate-400">Key regional & market variables influencing target price</p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
              📍 {selectedLocation}
            </span>
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
