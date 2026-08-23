import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  BarChart2,
  DollarSign,
  Sprout,
  ShoppingBag,
  PieChart,
  Calculator,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  MapPin,
  Calendar,
  Layers,
  ShieldCheck,
  Truck,
  Download,
  Filter,
  RefreshCw,
  Scale,
  Percent,
  Coins,
  Package,
  Activity
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { analyticsAPI } from '../services/api';

export const Analytics = () => {
  const [timeRange, setTimeRange] = useState('30D'); // '7D', '30D', 'YALA', 'ALL'
  const [selectedCropKey, setSelectedCropKey] = useState('tomatoes');
  const [hoveredPointIndex, setHoveredPointIndex] = useState(null);

  // Profit Simulator State
  const [simulatorCrop, setSimulatorCrop] = useState('tomatoes');
  const [simYieldKg, setSimYieldKg] = useState(2500);
  const [simPricePerKg, setSimPricePerKg] = useState(210);

  const CROP_MARKET_SERIES = {
    tomatoes: {
      name: 'Welimada Organic Tomatoes',
      category: 'Vegetables',
      unit: 'Rs./kg',
      currentPrice: 210.0,
      traditionalPrice: 155.0,
      retailPrice: 245.0,
      trend: '+12.4%',
      isUp: true,
      color: '#10b981', // emerald-500
      points: [
        { label: 'Aug 01', direct: 180, wholesale: 135, volume: 850 },
        { label: 'Aug 05', direct: 190, wholesale: 140, volume: 1200 },
        { label: 'Aug 10', direct: 195, wholesale: 145, volume: 1450 },
        { label: 'Aug 15', direct: 205, wholesale: 150, volume: 1900 },
        { label: 'Aug 18', direct: 200, wholesale: 148, volume: 1650 },
        { label: 'Aug 21', direct: 215, wholesale: 155, volume: 2200 },
        { label: 'Today',  direct: 210, wholesale: 155, volume: 2400 }
      ]
    },
    rice: {
      name: 'Polonnaruwa Certified Samba Paddy',
      category: 'Grains',
      unit: 'Rs./kg',
      currentPrice: 220.0,
      traditionalPrice: 180.0,
      retailPrice: 260.0,
      trend: '+6.2%',
      isUp: true,
      color: '#059669', // emerald-600
      points: [
        { label: 'Aug 01', direct: 205, wholesale: 170, volume: 4500 },
        { label: 'Aug 05', direct: 210, wholesale: 172, volume: 5200 },
        { label: 'Aug 10', direct: 212, wholesale: 175, volume: 6100 },
        { label: 'Aug 15', direct: 218, wholesale: 178, volume: 6800 },
        { label: 'Aug 18', direct: 215, wholesale: 176, volume: 6400 },
        { label: 'Aug 21', direct: 222, wholesale: 180, volume: 7200 },
        { label: 'Today',  direct: 220, wholesale: 180, volume: 7500 }
      ]
    },
    potatoes: {
      name: 'Nuwara Eliya Red Potatoes',
      category: 'Vegetables',
      unit: 'Rs./kg',
      currentPrice: 280.0,
      traditionalPrice: 210.0,
      retailPrice: 325.0,
      trend: '+18.5%',
      isUp: true,
      color: '#f59e0b', // amber-500
      points: [
        { label: 'Aug 01', direct: 235, wholesale: 180, volume: 1200 },
        { label: 'Aug 05', direct: 245, wholesale: 185, volume: 1800 },
        { label: 'Aug 10', direct: 255, wholesale: 195, volume: 2100 },
        { label: 'Aug 15', direct: 270, wholesale: 200, volume: 2900 },
        { label: 'Aug 18', direct: 265, wholesale: 202, volume: 2400 },
        { label: 'Aug 21', direct: 285, wholesale: 215, volume: 3200 },
        { label: 'Today',  direct: 280, wholesale: 210, volume: 3400 }
      ]
    },
    chillies: {
      name: 'Jaffna Green Chillies',
      category: 'Spices',
      unit: 'Rs./kg',
      currentPrice: 520.0,
      traditionalPrice: 390.0,
      retailPrice: 620.0,
      trend: '-3.2%',
      isUp: false,
      color: '#ef4444', // red-500
      points: [
        { label: 'Aug 01', direct: 560, wholesale: 420, volume: 600 },
        { label: 'Aug 05', direct: 550, wholesale: 410, volume: 750 },
        { label: 'Aug 10', direct: 540, wholesale: 405, volume: 820 },
        { label: 'Aug 15', direct: 535, wholesale: 400, volume: 900 },
        { label: 'Aug 18', direct: 525, wholesale: 395, volume: 950 },
        { label: 'Aug 21', direct: 518, wholesale: 388, volume: 1100 },
        { label: 'Today',  direct: 520, wholesale: 390, volume: 1050 }
      ]
    }
  };

  const activeSeries = CROP_MARKET_SERIES[selectedCropKey] || CROP_MARKET_SERIES.tomatoes;

  // PROVINCE / DISTRICT DISTRIBUTION
  const PROVINCIAL_DATA = [
    {
      province: 'Central Province',
      districts: 'Nuwara Eliya, Badulla, Kandy, Matale',
      volumeKg: '4,850 MT',
      sharePct: 38,
      mainCrop: 'Vegetables & Upcountry Potatoes',
      color: 'bg-emerald-500'
    },
    {
      province: 'North Central Province',
      districts: 'Polonnaruwa, Anuradhapura',
      volumeKg: '3,320 MT',
      sharePct: 26,
      mainCrop: 'Samba Paddy & Grains',
      color: 'bg-teal-500'
    },
    {
      province: 'Northern Province',
      districts: 'Jaffna, Kilinochchi, Vavuniya',
      volumeKg: '2,420 MT',
      sharePct: 19,
      mainCrop: 'Red Onions, Chillies & Fruits',
      color: 'bg-amber-500'
    },
    {
      province: 'Southern & Uva Province',
      districts: 'Hambantota, Galle, Monaragala',
      volumeKg: '2,170 MT',
      sharePct: 17,
      mainCrop: 'Cinnamon, Watermelons, Papaya',
      color: 'bg-sky-500'
    }
  ];

  // SIMULATOR CALCULATIONS
  const simAgroLinkRevenue = simYieldKg * simPricePerKg;
  const simMiddlemanRevenue = simYieldKg * (simPricePerKg * 0.72); // Middlemen take ~28% margin
  const simNetFarmerBenefit = simAgroLinkRevenue - simMiddlemanRevenue;
  const simBenefitPct = ((simNetFarmerBenefit / simMiddlemanRevenue) * 100).toFixed(1);

  // SVG Chart Dimensions & Helpers
  const svgWidth = 600;
  const svgHeight = 220;
  const paddingX = 40;
  const paddingY = 25;
  const graphW = svgWidth - paddingX * 2;
  const graphH = svgHeight - paddingY * 2;

  const minDirect = Math.min(...activeSeries.points.map(p => p.wholesale)) * 0.9;
  const maxDirect = Math.max(...activeSeries.points.map(p => p.direct)) * 1.1;

  const getX = (index) => paddingX + (index / (activeSeries.points.length - 1)) * graphW;
  const getY = (val) => svgHeight - paddingY - ((val - minDirect) / (maxDirect - minDirect)) * graphH;

  const directPath = activeSeries.points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(p.direct)}`)
    .join(' ');

  const directAreaPath = `${directPath} L ${getX(activeSeries.points.length - 1)} ${svgHeight - paddingY} L ${getX(0)} ${svgHeight - paddingY} Z`;

  const wholesalePath = activeSeries.points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(p.wholesale)}`)
    .join(' ');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fade-in text-slate-800">
      {/* 1. CLEAN WHITE HERO HEADER */}
      <div className="glass-card p-6 sm:p-8 bg-white border border-slate-200/90 shadow-xl shadow-slate-200/50 rounded-3xl space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-extrabold uppercase tracking-wider border border-emerald-200 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Live National Agri-Financial Matrix</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-display text-slate-900">
              National Market Analytics 📊
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm max-w-2xl font-medium leading-relaxed">
              Real-time Sri Lankan commodity price telemetry, district harvest volume distribution, escrow trade velocity, and grower margin enhancements.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center p-1 bg-slate-100/90 rounded-2xl border border-slate-200">
              {['7D', '30D', 'YALA', 'ALL'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setTimeRange(tab)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition ${
                    timeRange === tab
                      ? 'bg-white text-emerald-700 shadow-sm border border-slate-200/60'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {tab === '7D' ? '7 Days' : tab === '30D' ? '30 Days' : tab === 'YALA' ? 'Yala 2026' : 'Annual'}
                </button>
              ))}
            </div>

            <button
              onClick={() => window.print()}
              className="px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-extrabold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. TOP 4 KEY METRIC KPI CARDS (CLEAN WHITE) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <motion.div
          whileHover={{ y: -3 }}
          className="premium-card p-6 bg-white border border-slate-200/90 shadow-md rounded-3xl space-y-2 relative overflow-hidden"
        >
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Total Escrow Traded</span>
            <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg font-black border border-emerald-100">
              💰
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
            Rs. 48.25M
          </h2>
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
            <ArrowUpRight className="w-4 h-4" />
            <span>+22.4% vs last season</span>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -3 }}
          className="premium-card p-6 bg-white border border-slate-200/90 shadow-md rounded-3xl space-y-2 relative overflow-hidden"
        >
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Middleman Cut Eliminated</span>
            <div className="w-9 h-9 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center text-lg font-black border border-teal-100">
              🌱
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-emerald-600 font-display">
            Rs. 14.86M
          </h2>
          <div className="flex items-center gap-1.5 text-xs font-bold text-teal-700">
            <CheckCircle2 className="w-4 h-4" />
            <span>Extra grower net earnings</span>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -3 }}
          className="premium-card p-6 bg-white border border-slate-200/90 shadow-md rounded-3xl space-y-2 relative overflow-hidden"
        >
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Active Live Batches</span>
            <div className="w-9 h-9 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-lg font-black border border-amber-100">
              📦
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
            384 Batches
          </h2>
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700">
            <MapPin className="w-4 h-4" />
            <span>Across all 25 districts</span>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -3 }}
          className="premium-card p-6 bg-white border border-slate-200/90 shadow-md rounded-3xl space-y-2 relative overflow-hidden"
        >
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">On-Time Escrow Release</span>
            <div className="w-9 h-9 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center text-lg font-black border border-sky-100">
              ⚡
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-sky-700 font-display">
            99.4%
          </h2>
          <div className="flex items-center gap-1.5 text-xs font-bold text-sky-600">
            <ClockIcon className="w-4 h-4" />
            <span>Avg 1.8 hrs post-delivery</span>
          </div>
        </motion.div>
      </div>

      {/* 3. INTERACTIVE COMMODITY PRICE BENCHMARK & TREND CHART */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* CHART SECTION */}
        <div className="lg:col-span-8 premium-card p-6 sm:p-7 bg-white border border-slate-200/90 shadow-lg rounded-3xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-emerald-600" />
                <h3 className="text-lg font-extrabold text-slate-900 font-display">
                  Live Commodity Price &amp; Margin Benchmark (Rs./kg)
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Comparing AgroLink Direct Farm Gate vs Traditional Dambulla / Pettah Middleman Wholesale
              </p>
            </div>

            {/* CROP SELECTOR BUTTONS */}
            <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100/90 rounded-2xl border border-slate-200">
              {Object.keys(CROP_MARKET_SERIES).map((k) => (
                <button
                  key={k}
                  onClick={() => setSelectedCropKey(k)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition capitalize ${
                    selectedCropKey === k
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {k === 'tomatoes' ? '🍅 Tomato' : k === 'rice' ? '🌾 Rice' : k === 'potatoes' ? '🥔 Potato' : '🌶️ Chilli'}
                </button>
              ))}
            </div>
          </div>

          {/* ACTIVE COMMODITY HERO HIGHLIGHT STRIP */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70 flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-0.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">{activeSeries.category}</span>
              <h4 className="font-extrabold text-slate-900 text-base font-display">{activeSeries.name}</h4>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-xs font-semibold">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">AgroLink Direct Gate</span>
                <span className="text-xl font-black text-emerald-600 font-display">
                  Rs. {activeSeries.currentPrice.toFixed(2)}/kg
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Traditional Middleman</span>
                <span className="text-base font-bold text-slate-400 line-through">
                  Rs. {activeSeries.traditionalPrice.toFixed(2)}/kg
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Grower Gain</span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-xs">
                  +{Math.round(((activeSeries.currentPrice - activeSeries.traditionalPrice) / activeSeries.traditionalPrice) * 100)}% Extra Profit
                </span>
              </div>
            </div>
          </div>

          {/* SVG INTERACTIVE TREND GRAPH */}
          <div className="space-y-2">
            <div className="relative w-full overflow-hidden">
              <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-56 select-none">
                <defs>
                  <linearGradient id="emeraldGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* HORIZONTAL GRID LINES */}
                {[0.2, 0.4, 0.6, 0.8].map((pct, i) => (
                  <line
                    key={i}
                    x1={paddingX}
                    y1={paddingY + pct * graphH}
                    x2={svgWidth - paddingX}
                    y2={paddingY + pct * graphH}
                    stroke="#e2e8f0"
                    strokeDasharray="4 4"
                  />
                ))}

                {/* DIRECT PRICE SHADED AREA */}
                <path d={directAreaPath} fill="url(#emeraldGradient)" />

                {/* WHOLESALE BENCHMARK LINE (DASHED SLATE) */}
                <path
                  d={wholesalePath}
                  fill="none"
                  stroke="#94a3b8"
                  strokeWidth="2.5"
                  strokeDasharray="6 4"
                />

                {/* DIRECT AGROLINK LINE (EMERALD VIBRANT) */}
                <path
                  d={directPath}
                  fill="none"
                  stroke="#059669"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />

                {/* DATA POINTS & INTERACTIVE HOVER */}
                {activeSeries.points.map((p, i) => {
                  const cx = getX(i);
                  const cy = getY(p.direct);
                  const isHovered = hoveredPointIndex === i;

                  return (
                    <g key={i} className="cursor-pointer" onMouseEnter={() => setHoveredPointIndex(i)} onMouseLeave={() => setHoveredPointIndex(null)}>
                      <circle
                        cx={cx}
                        cy={cy}
                        r={isHovered ? 7 : 4.5}
                        fill="#059669"
                        stroke="#ffffff"
                        strokeWidth="2.5"
                        className="transition-all duration-150"
                      />
                      {/* X AXIS LABELS */}
                      <text
                        x={cx}
                        y={svgHeight - 6}
                        textAnchor="middle"
                        fontSize="10"
                        fontWeight="700"
                        fill="#64748b"
                      >
                        {p.label}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* CHART LEGEND & HOVER DETAILS */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-xs border-t border-slate-100">
              <div className="flex items-center gap-5">
                <span className="flex items-center gap-2 font-bold text-emerald-700">
                  <span className="w-3.5 h-3.5 rounded-full bg-emerald-600 inline-block"></span>
                  AgroLink Direct Escrow Rate
                </span>
                <span className="flex items-center gap-2 font-bold text-slate-400">
                  <span className="w-3.5 h-1 bg-slate-400 inline-block"></span>
                  Traditional Middleman Price
                </span>
              </div>

              {hoveredPointIndex !== null && (
                <div className="px-3 py-1 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] font-extrabold text-emerald-800">
                  📍 {activeSeries.points[hoveredPointIndex].label}: Direct <strong>Rs. {activeSeries.points[hoveredPointIndex].direct}/kg</strong> | Wholesale Rs. {activeSeries.points[hoveredPointIndex].wholesale}/kg
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 4. PROVINCIAL & DISTRICT DISTRIBUTION BREAKDOWN */}
        <div className="lg:col-span-4 premium-card p-6 sm:p-7 bg-white border border-slate-200/90 shadow-lg rounded-3xl space-y-6">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="text-lg font-extrabold text-slate-900 font-display flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-600" /> Provincial Supply Influx
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">District harvest volume distribution across Sri Lanka</p>
          </div>

          <div className="space-y-5">
            {PROVINCIAL_DATA.map((prov, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-extrabold text-slate-800">{prov.province}</span>
                  <span className="font-black text-emerald-700">{prov.volumeKg} ({prov.sharePct}%)</span>
                </div>

                {/* PROGRESS BAR */}
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${prov.color} rounded-full transition-all duration-700`}
                    style={{ width: `${prov.sharePct}%` }}
                  />
                </div>

                <div className="flex justify-between items-center text-[10px] text-slate-400 font-medium">
                  <span className="truncate max-w-[170px]">{prov.districts}</span>
                  <span className="font-bold text-slate-600">{prov.mainCrop}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200/70 text-xs text-emerald-900 font-medium space-y-1">
            <span className="font-black uppercase text-[10px] tracking-wider text-emerald-700 block">
              💡 Logistics Optimization Insight
            </span>
            <p className="leading-relaxed">
              Central Province produce routing into Colombo &amp; Gampaha supermarkets achieved <strong>99.1% freshness retention</strong> via cold-chain trucks.
            </p>
          </div>
        </div>
      </div>

      {/* 5. INTERACTIVE FARMER ROI & HARVEST PRICING SIMULATOR */}
      <div className="premium-card p-6 sm:p-8 bg-white border border-slate-200/90 shadow-xl rounded-3xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-black uppercase tracking-wider mb-1 border border-emerald-200">
              <Calculator className="w-3.5 h-3.5 text-emerald-600" /> Interactive Yield &amp; Profit Engine
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900 font-display">
              Grower Profit &amp; Disintermediation Simulator 🧮
            </h3>
            <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
              Estimate your net take-home earnings by eliminating traditional wholesale broker commissions.
            </p>
          </div>

          <span className="px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-xs self-start md:self-auto">
            Zero Broker Deductions
          </span>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-center">
          {/* CONTROLS (LEFT) */}
          <div className="lg:col-span-6 space-y-5">
            {/* CROP SELECTOR */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">
                Select Crop Variety
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { key: 'tomatoes', name: '🍅 Tomatoes', defPrice: 210 },
                  { key: 'rice', name: '🌾 Samba Rice', defPrice: 220 },
                  { key: 'potatoes', name: '🥔 Potatoes', defPrice: 280 },
                  { key: 'chillies', name: '🌶️ Chillies', defPrice: 520 }
                ].map((c) => (
                  <button
                    key={c.key}
                    type="button"
                    onClick={() => {
                      setSimulatorCrop(c.key);
                      setSimPricePerKg(c.defPrice);
                    }}
                    className={`p-2.5 rounded-xl border text-xs font-extrabold text-center transition ${
                      simulatorCrop === c.key
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-500/20'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-emerald-50'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* HARVEST YIELD SLIDER */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-black uppercase tracking-wider text-slate-500">Harvest Yield (kg)</span>
                <span className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-800 font-black font-display text-sm border border-emerald-200">
                  {simYieldKg.toLocaleString()} kg
                </span>
              </div>
              <input
                type="range"
                min="200"
                max="10000"
                step="100"
                value={simYieldKg}
                onChange={(e) => setSimYieldKg(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer h-2 bg-slate-100 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                <span>200 kg</span>
                <span>5,000 kg</span>
                <span>10,000 kg</span>
              </div>
            </div>

            {/* LISTING PRICE SLIDER */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-black uppercase tracking-wider text-slate-500">Listing Direct Rate (Rs./kg)</span>
                <span className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-800 font-black font-display text-sm border border-emerald-200">
                  Rs. {simPricePerKg.toFixed(2)}/kg
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="1000"
                step="5"
                value={simPricePerKg}
                onChange={(e) => setSimPricePerKg(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer h-2 bg-slate-100 rounded-lg"
              />
            </div>
          </div>

          {/* SIMULATOR FINANCIAL RESULT CARD (RIGHT) */}
          <div className="lg:col-span-6 bg-gradient-to-br from-emerald-50/80 via-teal-50/50 to-white p-6 sm:p-7 rounded-3xl border border-emerald-200 shadow-md space-y-5">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700">Financial Impact Summary</span>
              <h4 className="text-xl font-extrabold text-slate-900 font-display">
                Estimated Net Earnings Comparison
              </h4>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Traditional Middleman</span>
                <p className="text-lg sm:text-xl font-black text-slate-500 line-through font-display">
                  Rs. {Math.round(simMiddlemanRevenue).toLocaleString()}
                </p>
                <span className="text-[10px] text-slate-400 block font-semibold">28% lost to intermediaries</span>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-emerald-300 space-y-1 shadow-xs ring-1 ring-emerald-400/20">
                <span className="text-[10px] font-black text-emerald-700 uppercase">AgroLink Direct Escrow</span>
                <p className="text-lg sm:text-xl font-black text-emerald-600 font-display">
                  Rs. {Math.round(simAgroLinkRevenue).toLocaleString()}
                </p>
                <span className="text-[10px] text-emerald-600 block font-bold">100% Escrow protected</span>
              </div>
            </div>

            <div className="p-4 bg-emerald-600 text-white rounded-2xl shadow-md flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase text-emerald-200 tracking-wider">Your Extra Farmer Profit</span>
                <h3 className="text-2xl sm:text-3xl font-black font-display mt-0.5">
                  +Rs. {Math.round(simNetFarmerBenefit).toLocaleString()}
                </h3>
              </div>
              <span className="px-3 py-1.5 rounded-xl bg-emerald-500 text-white font-black text-xs border border-emerald-400 shadow-xs">
                +{simBenefitPct}% Extra Margin
              </span>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <Link
                to="/crops/add"
                className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow text-center transition flex items-center justify-center gap-1.5"
              >
                <PlusCircleIcon className="w-3.5 h-3.5 text-emerald-400" />
                <span>List Produce at this Rate →</span>
              </Link>
              <Link
                to="/price-prediction"
                className="py-3 px-4 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-extrabold text-xs rounded-xl shadow-xs text-center transition"
              >
                AI Price Forecaster
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// HELPER MINI ICONS
const ClockIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const PlusCircleIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
