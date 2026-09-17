import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Calendar,
  AlertCircle,
  MapPin,
  Award,
  Layers,
  Sparkles,
  Info,
  ArrowRight,
  RefreshCw,
  Clock,
  Building2,
  CheckCircle2,
  FileText,
  HelpCircle,
  BarChart3
} from 'lucide-react';
import { pricePredictionAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

// Supported Crops aligned with Backend PricePredictionService
const SUPPORTED_CROPS = [
  { id: 'Tomato', name: 'Tomato', icon: '🍅', category: 'Vegetables' },
  { id: 'Green Chillies', name: 'Green Chillies', icon: '🌶️', category: 'Spices' },
  { id: 'Potatoes', name: 'Potatoes', icon: '🥔', category: 'Tubers' },
  { id: 'Red Onions', name: 'Red Onions', icon: '🧅', category: 'Vegetables' },
  { id: 'Samba Rice', name: 'Samba Rice', icon: '🌾', category: 'Grains' }
];

// Supported Economic Market Hubs
const SUPPORTED_MARKETS = [
  { id: 'Dambulla', name: 'Dambulla Economic Centre', region: 'Central Benchmark', mult: 1.0 },
  { id: 'Pettah', name: 'Pettah Manning Market', region: 'Colombo Urban Wholesale', mult: 1.08 },
  { id: 'Keppetipola', name: 'Keppetipola Economic Hub', region: 'Upcountry Farmgate', mult: 0.94 },
  { id: 'Meegoda', name: 'Meegoda Dedicated Centre', region: 'Western Province Hub', mult: 1.06 },
  { id: 'Jaffna', name: 'Jaffna Regional Market', region: 'Northern Distribution', mult: 1.04 }
];

// Supported Produce Quality Grades
const SUPPORTED_GRADES = [
  { id: 'Grade A', name: 'Grade A (Supermarket/Export)', badge: '+22% Premium', multiplier: 1.22 },
  { id: 'Grade B', name: 'Grade B (Standard Wholesale)', badge: 'Benchmark', multiplier: 1.0 },
  { id: 'Grade C', name: 'Grade C (Processing/Bulk)', badge: '-18% Discount', multiplier: 0.82 }
];

export const PricePrediction = () => {
  const { user, isFarmer, isBuyer, isBusinessBuyer } = useAuth();

  // Selected filter states
  const [selectedCrop, setSelectedCrop] = useState('Tomato');
  const [selectedMarket, setSelectedMarket] = useState('Dambulla');
  const [selectedGrade, setSelectedGrade] = useState('Grade B');

  // Fetching and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [predictionData, setPredictionData] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Fetch from backend API
  const loadMarketIntelligence = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await pricePredictionAPI.getPrediction(selectedCrop, selectedMarket, selectedGrade);
      if (res && res.data) {
        setPredictionData(res.data);
      } else {
        setPredictionData(null);
      }
    } catch (err) {
      setError('Unable to load market prices. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMarketIntelligence();
  }, [selectedCrop, selectedMarket, selectedGrade]);

  // Derived Values
  const currentPrice = useMemo(() => {
    if (!predictionData?.todaysMarketPriceLkr) return null;
    return Number(predictionData.todaysMarketPriceLkr);
  }, [predictionData]);

  const targetFairPrice = useMemo(() => {
    if (!predictionData?.predictedFairPriceLkr) return null;
    return Number(predictionData.predictedFairPriceLkr);
  }, [predictionData]);

  const changePercentage = useMemo(() => {
    return predictionData?.sevenDayChangePercentage ?? 0;
  }, [predictionData]);

  const priceDiff = useMemo(() => {
    if (currentPrice === null || targetFairPrice === null) return 0;
    return targetFairPrice - currentPrice;
  }, [currentPrice, targetFairPrice]);

  // Unified 13-Day Trend Series (6 Days Historical + Today + 6 Days Forecast)
  const chartData = useMemo(() => {
    const historical = predictionData?.historicalPrices || [150, 158, 164, 170, 176, 180];
    const forecast = predictionData?.forecastPrices || [188, 196, 206, 215, 212, 205, 198];

    const todayIdx = historical.length - 1;
    const baseDate = new Date();
    const list = [];

    // Historical Points (Day -5 to Day 0)
    historical.forEach((price, i) => {
      const dayOffset = i - todayIdx;
      const d = new Date(baseDate);
      d.setDate(baseDate.getDate() + dayOffset);

      list.push({
        index: i,
        dayLabel: dayOffset === 0 ? 'Today' : `Day ${dayOffset}`,
        dateText: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        price: Number(price),
        isHistorical: true,
        isToday: dayOffset === 0
      });
    });

    // Forecast Points (Day +1 to Day +7)
    forecast.forEach((price, i) => {
      const dayNum = i + 1;
      const d = new Date(baseDate);
      d.setDate(baseDate.getDate() + dayNum);

      list.push({
        index: todayIdx + dayNum,
        dayLabel: `+${dayNum}d`,
        dateText: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        price: Number(price),
        isHistorical: false,
        isToday: false
      });
    });

    return list;
  }, [predictionData]);

  // SVG Chart Geometry
  const svgWidth = 720;
  const svgHeight = 240;
  const padLeft = 55;
  const padRight = 30;
  const padTop = 30;
  const padBottom = 40;

  const chartW = svgWidth - padLeft - padRight;
  const chartH = svgHeight - padTop - padBottom;

  const pricesArr = chartData.map(d => d.price);
  const minPrice = Math.floor(Math.min(...(pricesArr.length ? pricesArr : [100])) * 0.95);
  const maxPrice = Math.ceil(Math.max(...(pricesArr.length ? pricesArr : [300])) * 1.05);

  const getX = (idx) => padLeft + (idx / Math.max(chartData.length - 1, 1)) * chartW;
  const getY = (val) => svgHeight - padBottom - ((val - minPrice) / Math.max(maxPrice - minPrice, 1)) * chartH;

  const todayIndex = chartData.findIndex(d => d.isToday);

  // SVG Paths
  const histPath = chartData
    .filter(d => d.index <= todayIndex)
    .reduce((acc, d, i) => (i === 0 ? `M ${getX(d.index)} ${getY(d.price)}` : `${acc} L ${getX(d.index)} ${getY(d.price)}`), '');

  const forecastPath = chartData
    .filter(d => d.index >= todayIndex)
    .reduce((acc, d, i) => (i === 0 ? `M ${getX(d.index)} ${getY(d.price)}` : `${acc} L ${getX(d.index)} ${getY(d.price)}`), '');

  // Market comparison data calculated via backend multipliers
  const marketComparisons = useMemo(() => {
    if (!currentPrice) return [];
    // Central baseline: Dambulla multiplier is 1.0
    const currentLocObj = SUPPORTED_MARKETS.find(m => m.id === selectedMarket) || SUPPORTED_MARKETS[0];
    const basePrice = currentPrice / currentLocObj.mult;

    return SUPPORTED_MARKETS.map(m => {
      const estPrice = Math.round(basePrice * m.mult);
      const isSelected = m.id === selectedMarket;
      return {
        ...m,
        price: estPrice,
        isSelected
      };
    });
  }, [currentPrice, selectedMarket]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* ─── 1. PAGE HEADER ────────────────────────────────────────── */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-5 border-b border-slate-200">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
              <BarChart3 className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-display">
              Market Price Intelligence
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
            Track crop prices and understand supported market trends to make better farming and purchasing decisions.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>Updated Today • Dambulla Dedicated Centre Bulletin</span>
        </div>
      </header>

      {/* ─── 2. CROP / MARKET SELECTION ────────────────────────────── */}
      <section aria-labelledby="selectors-heading" className="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h2 id="selectors-heading" className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Filter Market Intelligence
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Crop Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 block">
              Crop Produce
            </label>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="w-full px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-800 cursor-pointer"
            >
              {SUPPORTED_CROPS.map(c => (
                <option key={c.id} value={c.id}>
                  {c.icon} {c.name} ({c.category})
                </option>
              ))}
            </select>
          </div>

          {/* Market / Location Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 block">
              Market / Location
            </label>
            <select
              value={selectedMarket}
              onChange={(e) => setSelectedMarket(e.target.value)}
              className="w-full px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-800 cursor-pointer"
            >
              {SUPPORTED_MARKETS.map(m => (
                <option key={m.id} value={m.id}>
                  📍 {m.name}
                </option>
              ))}
            </select>
          </div>

          {/* Quality Produce Grade Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 block">
              Produce Quality Grade
            </label>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="w-full px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-800 cursor-pointer"
            >
              {SUPPORTED_GRADES.map(g => (
                <option key={g.id} value={g.id}>
                  {g.name} [{g.badge}]
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* ERROR STATE */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={loadMarketIntelligence}
            className="px-3 py-1 bg-rose-600 text-white font-semibold rounded-lg hover:bg-rose-700 cursor-pointer"
          >
            Try Again
          </button>
        </div>
      )}

      {/* ─── 3. CURRENT PRICE SUMMARY ──────────────────────────────── */}
      {loading ? (
        <div className="p-6 bg-white rounded-2xl border border-slate-200 animate-pulse space-y-4">
          <div className="h-4 bg-slate-200 rounded w-1/4" />
          <div className="h-10 bg-slate-200 rounded w-1/3" />
          <div className="h-4 bg-slate-200 rounded w-1/2" />
        </div>
      ) : currentPrice !== null ? (
        <section aria-labelledby="current-price-heading" className="p-6 bg-white rounded-2xl border-2 border-emerald-600/30 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-slate-100">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Current Benchmark Price
              </span>
              <h2 id="current-price-heading" className="text-base font-bold text-slate-900">
                {selectedCrop} • {selectedGrade}
              </h2>
            </div>

            <div className="text-left sm:text-right text-xs">
              <span className="text-slate-400 block font-medium">Wholesale Market Hub</span>
              <span className="font-bold text-slate-800">📍 {selectedMarket}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Focal Price Display */}
            <div className="space-y-1">
              <span className="text-xs text-slate-500 font-medium">Current Price</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-4xl font-extrabold text-slate-900 font-display">
                  Rs. {currentPrice.toFixed(2)}
                </span>
                <span className="text-sm font-bold text-slate-600">/ kg</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Unit: 1 Kilogram (kg) wholesale standard
              </p>
            </div>

            {/* 7-Day Change Comparison */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                7-Day Price Trend
              </span>
              <div className="flex items-center gap-1.5">
                {changePercentage > 0 ? (
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                ) : changePercentage < 0 ? (
                  <TrendingDown className="w-5 h-5 text-rose-600" />
                ) : (
                  <Minus className="w-5 h-5 text-slate-500" />
                )}
                <span className={`text-xl font-bold font-display ${
                  changePercentage > 0 ? 'text-emerald-700' : changePercentage < 0 ? 'text-rose-700' : 'text-slate-700'
                }`}>
                  {changePercentage > 0 ? `+${changePercentage.toFixed(1)}%` : `${changePercentage.toFixed(1)}%`}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                {changePercentage > 0
                  ? `+Rs. ${(currentPrice * (changePercentage / 100)).toFixed(2)} / kg vs. past week`
                  : changePercentage < 0
                  ? `-Rs. ${Math.abs(currentPrice * (changePercentage / 100)).toFixed(2)} / kg vs. past week`
                  : 'Stable pricing across the reporting period'}
              </p>
            </div>

            {/* Quality Grade Comparison Chips */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1.5 text-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                Grade Benchmarks ({selectedMarket})
              </span>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-600">Grade A (Supermarket):</span>
                  <span className="font-bold text-slate-900">
                    Rs. {predictionData.gradeAPriceLkr ? Number(predictionData.gradeAPriceLkr).toFixed(2) : (currentPrice * 1.22).toFixed(2)}/kg
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Grade B (Wholesale):</span>
                  <span className="font-bold text-slate-900">
                    Rs. {predictionData.gradeBPriceLkr ? Number(predictionData.gradeBPriceLkr).toFixed(2) : currentPrice.toFixed(2)}/kg
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Grade C (Processing):</span>
                  <span className="font-bold text-slate-900">
                    Rs. {predictionData.gradeCPriceLkr ? Number(predictionData.gradeCPriceLkr).toFixed(2) : (currentPrice * 0.82).toFixed(2)}/kg
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500">
          <Info className="w-6 h-6 mx-auto mb-2 text-slate-400" />
          <p className="text-sm font-medium">No market price data is currently available for this crop.</p>
        </div>
      )}

      {/* ─── 4. PRICE TREND CHART ──────────────────────────────────── */}
      <section aria-labelledby="chart-heading" className="p-5 sm:p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h2 id="chart-heading" className="text-base font-bold text-slate-900 font-display">
              13-Day Price Trend &amp; Trajectory
            </h2>
            <p className="text-xs text-slate-500">
              Answers whether prices are moving up, down, or remaining stable over the 13-day window.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-blue-600 rounded" />
              <span className="text-slate-600 font-medium">Historical (Past 6 Days)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 border-b-2 border-dashed border-emerald-600" />
              <span className="text-emerald-800 font-semibold">Forecast (Next 7 Days)</span>
            </div>
          </div>
        </div>

        {/* SVG Chart */}
        <div className="w-full overflow-x-auto">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full min-w-[500px] h-auto select-none"
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {/* Grid Ticks */}
            {[0, 1, 2, 3].map((step) => {
              const val = Math.round(minPrice + (step * (maxPrice - minPrice)) / 3);
              const y = getY(val);
              return (
                <g key={step}>
                  <line
                    x1={padLeft}
                    y1={y}
                    x2={svgWidth - padRight}
                    y2={y}
                    stroke="#f1f5f9"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                  <text
                    x={padLeft - 8}
                    y={y + 4}
                    textAnchor="end"
                    className="text-[10px] fill-slate-400 font-medium font-mono"
                  >
                    Rs.{val}
                  </text>
                </g>
              );
            })}

            {/* Today Dividing Line */}
            {todayIndex >= 0 && (
              <g>
                <line
                  x1={getX(todayIndex)}
                  y1={padTop - 5}
                  x2={getX(todayIndex)}
                  y2={svgHeight - padBottom}
                  stroke="#94a3b8"
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                />
                <text
                  x={getX(todayIndex)}
                  y={padTop - 10}
                  textAnchor="middle"
                  className="text-[9px] fill-slate-500 font-bold uppercase tracking-wider"
                >
                  TODAY
                </text>
              </g>
            )}

            {/* Historical Path Line */}
            <path
              d={histPath}
              fill="none"
              stroke="#2563eb"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Forecast Dashed Line */}
            <path
              d={forecastPath}
              fill="none"
              stroke="#059669"
              strokeWidth="3"
              strokeDasharray="5 5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Interactive Data Points */}
            {chartData.map((d) => {
              const cx = getX(d.index);
              const cy = getY(d.price);
              const isHovered = hoveredIndex === d.index;

              return (
                <g
                  key={d.index}
                  onMouseEnter={() => setHoveredIndex(d.index)}
                  className="cursor-pointer"
                >
                  {/* Catch Area */}
                  <circle cx={cx} cy={cy} r="14" fill="transparent" />

                  {/* Hover ring */}
                  {isHovered && (
                    <circle
                      cx={cx}
                      cy={cy}
                      r="8"
                      fill={d.isHistorical ? '#93c5fd' : '#a7f3d0'}
                      opacity="0.8"
                    />
                  )}

                  {/* Point circle */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={d.isToday ? 5.5 : 4}
                    fill={d.isToday ? '#0f172a' : d.isHistorical ? '#2563eb' : '#059669'}
                    stroke="#ffffff"
                    strokeWidth={2}
                  />

                  {/* X Axis Label */}
                  <text
                    x={cx}
                    y={svgHeight - padBottom + 16}
                    textAnchor="middle"
                    className={`text-[9px] ${d.isToday ? 'fill-slate-900 font-bold' : 'fill-slate-500'}`}
                  >
                    {d.dayLabel}
                  </text>
                  <text
                    x={cx}
                    y={svgHeight - padBottom + 28}
                    textAnchor="middle"
                    className="text-[8px] fill-slate-400 font-mono"
                  >
                    {d.dateText}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Hover Readout Tooltip Bar */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs">
          <div className="text-slate-600 font-medium">
            {hoveredIndex !== null && chartData[hoveredIndex] ? (
              <span>
                <strong>{chartData[hoveredIndex].dayLabel} ({chartData[hoveredIndex].dateText}):</strong>{' '}
                <span className="text-emerald-700 font-bold">Rs. {chartData[hoveredIndex].price.toFixed(2)} / kg</span>{' '}
                ({chartData[hoveredIndex].isHistorical ? 'Actual recorded price' : 'Projected price benchmark'})
              </span>
            ) : (
              <span className="text-slate-400">
                Hover over any day point on the chart to inspect recorded or predicted prices.
              </span>
            )}
          </div>

          <div className="text-[11px] text-slate-500 font-medium">
            Trajectory:{' '}
            <strong className={changePercentage >= 0 ? 'text-emerald-700' : 'text-rose-700'}>
              {changePercentage >= 0 ? 'Upward Trend (+)' : 'Downward Trend (-)'}
            </strong>
          </div>
        </div>
      </section>

      {/* ─── 5. PREDICTION / OUTLOOK ─────────────────────────────────── */}
      {predictionData?.recommendation && (
        <section aria-labelledby="outlook-heading" className="p-5 sm:p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <h2 id="outlook-heading" className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Price Outlook &amp; Market Recommendation
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200/80 space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Target Fair Price (Next 7 Days)
              </span>
              <p className="text-2xl font-bold text-emerald-950 font-display">
                Rs. {targetFairPrice?.toFixed(2)} / kg
              </p>
              <p className="text-xs text-emerald-900 font-medium">
                {priceDiff >= 0
                  ? `Estimated potential gain of +Rs. ${priceDiff.toFixed(2)}/kg (+${changePercentage.toFixed(1)}%)`
                  : `Estimated potential decrease of -Rs. ${Math.abs(priceDiff).toFixed(2)}/kg (${changePercentage.toFixed(1)}%)`}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                Action Window &amp; Guidance
              </span>
              <p className="text-sm font-bold text-slate-900">
                {predictionData.recommendation}
              </p>
              <p className="text-xs text-slate-600 font-semibold">
                {predictionData.bestActionWindow}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ─── 6. KEY EXPLANATORY FACTORS ─────────────────────────────── */}
      {predictionData?.factorBreakdown && predictionData.factorBreakdown.length > 0 && (
        <section aria-labelledby="factors-heading" className="p-5 sm:p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h2 id="factors-heading" className="text-base font-bold text-slate-900 font-display">
                Key Factors Affecting Price
              </h2>
              <p className="text-xs text-slate-500">
                Supply, weather, and regional arrivals impacting current and near-term market rates.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            {predictionData.factorBreakdown.map((f, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-bold text-slate-900 text-xs">{f.factorName}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      f.positive ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {f.positive ? 'Upward Factor' : 'Downward Factor'}
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px] pt-1 leading-relaxed">
                    {f.impactText}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ─── 7. REGIONAL MARKET COMPARISON ──────────────────────────── */}
      {marketComparisons.length > 0 && (
        <section aria-labelledby="comparison-heading" className="p-5 sm:p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h2 id="comparison-heading" className="text-base font-bold text-slate-900 font-display">
                Regional Market Comparison
              </h2>
              <p className="text-xs text-slate-500">
                Current {selectedCrop} wholesale prices across major Sri Lankan economic centres.
              </p>
            </div>
            <span className="text-xs text-slate-400 font-medium">Wholesale kg benchmark</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
            {marketComparisons.map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedMarket(m.id)}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  m.isSelected
                    ? 'bg-emerald-50/70 border-emerald-300 ring-2 ring-emerald-500/20'
                    : 'bg-slate-50 border-slate-200/80 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 text-xs">{m.name.split(' ')[0]}</span>
                  {m.isSelected && (
                    <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  )}
                </div>
                <p className="text-[10px] text-slate-400 truncate">{m.region}</p>
                <p className="text-base font-extrabold text-slate-900 font-display mt-2">
                  Rs. {m.price} <span className="text-[10px] font-normal text-slate-500">/kg</span>
                </p>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* ─── 8. HISTORICAL & FORECAST DATA TABLE ─────────────────────── */}
      <section aria-labelledby="table-heading" className="p-5 sm:p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h2 id="table-heading" className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Detailed Price Records (13-Day Log)
          </h2>
          <span className="text-xs text-slate-400">Unit: LKR / kg</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-medium">
                <th className="py-2.5 px-3">Timeline</th>
                <th className="py-2.5 px-3">Calendar Date</th>
                <th className="py-2.5 px-3">Record Type</th>
                <th className="py-2.5 px-3 text-right">Wholesale Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {chartData.map((row) => (
                <tr
                  key={row.index}
                  className={`hover:bg-slate-50/80 ${row.isToday ? 'bg-emerald-50/50 font-bold' : ''}`}
                >
                  <td className="py-2.5 px-3 font-semibold text-slate-800">
                    {row.dayLabel} {row.isToday && <span className="text-emerald-700 text-[10px]">(Today)</span>}
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 font-mono">
                    {row.dateText}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      row.isToday
                        ? 'bg-slate-900 text-white'
                        : row.isHistorical
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {row.isToday ? 'Current Benchmark' : row.isHistorical ? 'Actual Recorded' : 'AI Forecast'}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right font-extrabold text-slate-900 font-display">
                    Rs. {row.price.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ─── 9. SECONDARY ACTIONS (FARMER & BUYER) ──────────────────── */}
      <section aria-label="Trade Actions" className="p-5 bg-slate-100 rounded-2xl border border-slate-200 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Related Agricultural Actions
            </h3>
            <p className="text-xs text-slate-500">
              Apply these price benchmarks across AgroLink marketplaces and contract tools.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Farmer actions */}
            <Link
              to="/crops/add"
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
            >
              List Produce at Target Price
            </Link>

            <Link
              to="/demand-forecasting"
              className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold text-xs rounded-xl transition"
            >
              View Demand Forecast
            </Link>

            <Link
              to="/crops"
              className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold text-xs rounded-xl transition"
            >
              Browse Crop Catalog
            </Link>

            <Link
              to="/contracts"
              className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold text-xs rounded-xl transition"
            >
              Contract Farming
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PricePrediction;
