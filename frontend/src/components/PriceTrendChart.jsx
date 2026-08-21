import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Calendar, TrendingUp, Info, HelpCircle, ArrowUpRight, CheckCircle2 } from 'lucide-react';

export const PriceTrendChart = ({
  cropName = 'Produce',
  historical = [150, 158, 164, 170, 176, 180],
  forecast = [188, 196, 206, 215, 212, 205, 198],
  todaysPrice = 180,
  bestWindow = 'Day 3 – Day 5',
}) => {
  const [hoveredPoint, setHoveredPoint] = useState(null);

  // Build unified 13-day dataset
  // Index 0..5 = Historical (Day -5 to Day 0)
  // Index 5..12 = Forecast (Day 0 to Day +7)
  const todayIndex = historical.length - 1; // 5

  const pointsData = [];
  const baseDate = new Date();

  // Historical points
  historical.forEach((val, idx) => {
    const dayOffset = idx - todayIndex;
    const dateObj = new Date(baseDate);
    dateObj.setDate(baseDate.getDate() + dayOffset);

    pointsData.push({
      index: idx,
      dayLabel: dayOffset === 0 ? 'Today' : `Day ${dayOffset}`,
      dateStr: dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      price: val,
      isHistorical: true,
      isToday: dayOffset === 0,
      confidenceMin: val,
      confidenceMax: val,
    });
  });

  // Forecast points (starting from Day +1)
  forecast.forEach((val, idx) => {
    const dayNum = idx + 1;
    const dateObj = new Date(baseDate);
    dateObj.setDate(baseDate.getDate() + dayNum);

    // Add confidence variance range (+/- 4%)
    const variance = val * 0.04;

    pointsData.push({
      index: todayIndex + dayNum,
      dayLabel: `Day +${dayNum}`,
      dateStr: dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      price: val,
      isHistorical: false,
      isToday: false,
      confidenceMin: val - variance,
      confidenceMax: val + variance,
      isOptimalWindow: dayNum >= 3 && dayNum <= 5,
    });
  });

  const totalPoints = pointsData.length;

  // Chart dimensions
  const svgWidth = 800;
  const svgHeight = 320;
  const paddingLeft = 55;
  const paddingRight = 45;
  const paddingTop = 40;
  const paddingBottom = 45;

  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  // Min and Max prices for Y axis scaling
  const allPrices = pointsData.flatMap(p => [p.price, p.confidenceMin, p.confidenceMax]);
  const rawMin = Math.min(...allPrices);
  const rawMax = Math.max(...allPrices);
  const priceMargin = Math.max((rawMax - rawMin) * 0.15, 10);

  const minY = Math.max(0, Math.floor((rawMin - priceMargin) / 10) * 10);
  const maxY = Math.ceil((rawMax + priceMargin) / 10) * 10;

  const getX = (index) => paddingLeft + (index / (totalPoints - 1)) * chartWidth;
  const getY = (val) => svgHeight - paddingBottom - ((val - minY) / (maxY - minY)) * chartHeight;

  // Generate SVG path for Historical line
  const histPoints = pointsData.filter(p => p.index <= todayIndex);
  const histPath = histPoints.reduce((acc, p, idx) => {
    const x = getX(p.index);
    const y = getY(p.price);
    return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, '');

  // Generate SVG path for Forecast line (starts from Today index)
  const fcPoints = pointsData.filter(p => p.index >= todayIndex);
  const fcPath = fcPoints.reduce((acc, p, idx) => {
    const x = getX(p.index);
    const y = getY(p.price);
    return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, '');

  // Confidence Interval Shaded Area Path
  const fcUpper = fcPoints.map(p => `${getX(p.index)},${getY(p.confidenceMax)}`);
  const fcLower = [...fcPoints].reverse().map(p => `${getX(p.index)},${getY(p.confidenceMin)}`);
  const confidenceAreaPath = `M ${fcUpper.join(' L ')} L ${fcLower.join(' L ')} Z`;

  // Historical Area Fill Path
  const histFirstX = getX(0);
  const histLastX = getX(todayIndex);
  const baselineY = getY(minY);
  const histAreaPath = `${histPath} L ${histLastX} ${baselineY} L ${histFirstX} ${baselineY} Z`;

  // Best Sell Window Highlights (Day 3 to Day 5)
  const windowStartP = pointsData.find(p => p.dayLabel === 'Day +3');
  const windowEndP = pointsData.find(p => p.dayLabel === 'Day +5');
  const windowStartX = windowStartP ? getX(windowStartP.index) : null;
  const windowEndX = windowEndP ? getX(windowEndP.index) : null;

  // Grid steps (4 ticks)
  const yTicks = [0, 1, 2, 3].map(i => minY + (i * (maxY - minY)) / 3);

  // Peak forecast price
  const peakPoint = [...pointsData].sort((a, b) => b.price - a.price)[0];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xl p-6 space-y-6">
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
              <TrendingUp className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
                14-Day Price Trend & AI Forecast
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-extrabold border border-emerald-200">
                  Interactive Chart
                </span>
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Past 6 days actual market prices + 7 days AI time-series projection model
              </p>
            </div>
          </div>
        </div>

        {/* METRIC CHIPS */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <span className="text-slate-400 font-medium">Historical Range: </span>
            <span className="font-extrabold text-slate-800">Rs.{rawMin.toFixed(0)} - Rs.{todaysPrice.toFixed(0)}</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
            <span className="text-emerald-700 font-medium">Peak Forecast: </span>
            <span className="font-extrabold text-emerald-800">Rs.{peakPoint?.price?.toFixed(0)} ({peakPoint?.dayLabel})</span>
          </div>
        </div>
      </div>

      {/* SVG CHART CONTAINER */}
      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto select-none"
          onMouseLeave={() => setHoveredPoint(null)}
        >
          <defs>
            {/* Historical Area Gradient */}
            <linearGradient id="histGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
            </linearGradient>

            {/* Forecast Confidence Area Gradient */}
            <linearGradient id="confidenceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.03" />
            </linearGradient>

            {/* Target Sell Window Gradient */}
            <linearGradient id="sellWindowGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ecfdf5" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#d1fae5" stopOpacity="0.3" />
            </linearGradient>
          </defs>

          {/* BACKGROUND Y-AXIS GRID LINES & LABELS */}
          {yTicks.map((val, idx) => {
            const y = getY(val);
            return (
              <g key={idx}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={svgWidth - paddingRight}
                  y2={y}
                  stroke="#e2e8f0"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 4}
                  textAnchor="end"
                  className="text-[11px] fill-slate-400 font-semibold"
                >
                  Rs.{Math.round(val)}
                </text>
              </g>
            );
          })}

          {/* OPTIMAL SELL WINDOW SHADED BAND */}
          {windowStartX && windowEndX && (
            <g>
              <rect
                x={windowStartX}
                y={paddingTop}
                width={windowEndX - windowStartX}
                height={chartHeight}
                fill="url(#sellWindowGradient)"
                rx="6"
              />
              <line
                x1={windowStartX}
                y1={paddingTop}
                x2={windowStartX}
                y2={svgHeight - paddingBottom}
                stroke="#10b981"
                strokeDasharray="3 3"
                strokeWidth="1.5"
              />
              <line
                x1={windowEndX}
                y1={paddingTop}
                x2={windowEndX}
                y2={svgHeight - paddingBottom}
                stroke="#10b981"
                strokeDasharray="3 3"
                strokeWidth="1.5"
              />
              <text
                x={(windowStartX + windowEndX) / 2}
                y={paddingTop + 16}
                textAnchor="middle"
                className="text-[10px] fill-emerald-800 font-extrabold uppercase tracking-wider"
              >
                ✦ Optimal Sell Window
              </text>
            </g>
          )}

          {/* HISTORICAL AREA FILL */}
          <path d={histAreaPath} fill="url(#histGradient)" />

          {/* FORECAST CONFIDENCE INTERVAL AREA */}
          <path d={confidenceAreaPath} fill="url(#confidenceGradient)" />

          {/* TODAY VERTICAL DIVIDER LINE */}
          {(() => {
            const todayX = getX(todayIndex);
            return (
              <g>
                <line
                  x1={todayX}
                  y1={paddingTop - 10}
                  x2={todayX}
                  y2={svgHeight - paddingBottom}
                  stroke="#64748b"
                  strokeDasharray="4 4"
                  strokeWidth="1.5"
                />
                <rect
                  x={todayX - 24}
                  y={paddingTop - 25}
                  width="48"
                  height="18"
                  rx="9"
                  fill="#334155"
                />
                <text
                  x={todayX}
                  y={paddingTop - 13}
                  textAnchor="middle"
                  className="text-[9px] fill-white font-extrabold uppercase"
                >
                  TODAY
                </text>
              </g>
            );
          })()}

          {/* HISTORICAL PATH LINE */}
          <path
            d={histPath}
            fill="none"
            stroke="#2563eb"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* FORECAST DASHED PATH LINE */}
          <path
            d={fcPath}
            fill="none"
            stroke="#059669"
            strokeWidth="3.5"
            strokeDasharray="6 6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* DATA POINTS & INTERACTIVE HOVER TARGETS */}
          {pointsData.map((p) => {
            const cx = getX(p.index);
            const cy = getY(p.price);
            const isHovered = hoveredPoint?.index === p.index;

            return (
              <g
                key={p.index}
                className="cursor-pointer transition-all duration-200"
                onMouseEnter={() => setHoveredPoint(p)}
              >
                {/* Large invisible circle for easy hover catching */}
                <circle cx={cx} cy={cy} r="18" fill="transparent" />

                {/* Point Outer Ring on Hover */}
                {isHovered && (
                  <circle
                    cx={cx}
                    cy={cy}
                    r="9"
                    fill={p.isHistorical ? '#93c5fd' : '#a7f3d0'}
                    opacity="0.8"
                  />
                )}

                {/* Main Data Point Circle */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={p.isToday ? 6 : isHovered ? 5.5 : 4}
                  fill={p.isToday ? '#1e293b' : p.isHistorical ? '#2563eb' : '#059669'}
                  stroke="#ffffff"
                  strokeWidth={p.isToday ? 3 : 2}
                />

                {/* X-Axis Day / Date Labels */}
                <text
                  x={cx}
                  y={svgHeight - paddingBottom + 18}
                  textAnchor="middle"
                  className={`text-[10px] font-bold ${
                    p.isToday
                      ? 'fill-slate-900 font-extrabold'
                      : p.isHistorical
                      ? 'fill-slate-500'
                      : 'fill-emerald-700'
                  }`}
                >
                  {p.dayLabel}
                </text>

                <text
                  x={cx}
                  y={svgHeight - paddingBottom + 30}
                  textAnchor="middle"
                  className="text-[9px] fill-slate-400 font-medium"
                >
                  {p.dateStr}
                </text>
              </g>
            );
          })}

          {/* ACTIVE HOVER VERTICAL GUIDE LINE */}
          {hoveredPoint && (
            <line
              x1={getX(hoveredPoint.index)}
              y1={paddingTop}
              x2={getX(hoveredPoint.index)}
              y2={svgHeight - paddingBottom}
              stroke="#64748b"
              strokeDasharray="2 2"
              strokeWidth="1"
              pointerEvents="none"
            />
          )}
        </svg>

        {/* FLOATING HOVER TOOLTIP CARD */}
        <AnimatePresence>
          {hoveredPoint && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute z-20 pointer-events-none p-3.5 bg-slate-900/95 text-white rounded-xl shadow-2xl backdrop-blur-md border border-slate-700 text-xs space-y-1.5 min-w-[170px]"
              style={{
                left: `${Math.min(Math.max((getX(hoveredPoint.index) / svgWidth) * 100, 15), 85)}%`,
                top: `${Math.max((getY(hoveredPoint.price) / svgHeight) * 100 - 35, 10)}%`,
                transform: 'translate(-50%, -100%)',
              }}
            >
              <div className="flex items-center justify-between gap-2 border-b border-slate-700/80 pb-1.5">
                <span className="font-extrabold text-slate-200 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" /> {hoveredPoint.dayLabel} ({hoveredPoint.dateStr})
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  hoveredPoint.isHistorical
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}>
                  {hoveredPoint.isToday ? 'Today' : hoveredPoint.isHistorical ? 'Actual' : 'AI Forecast'}
                </span>
              </div>

              <div className="pt-0.5 flex items-baseline justify-between gap-4">
                <span className="text-slate-400 font-medium">Predicted Price:</span>
                <span className="text-sm font-extrabold text-emerald-400 font-display">
                  Rs. {hoveredPoint.price.toFixed(2)}/kg
                </span>
              </div>

              {!hoveredPoint.isHistorical && (
                <div className="flex items-center justify-between text-[10px] text-slate-300 pt-0.5">
                  <span className="text-slate-400">Confidence Range:</span>
                  <span className="font-semibold text-emerald-200">
                    Rs.{hoveredPoint.confidenceMin.toFixed(0)} - Rs.{hoveredPoint.confidenceMax.toFixed(0)}
                  </span>
                </div>
              )}

              {hoveredPoint.isOptimalWindow && (
                <div className="mt-1 px-2 py-1 rounded bg-emerald-950 text-emerald-300 text-[10px] font-bold flex items-center gap-1 border border-emerald-700/60">
                  <Sparkles className="w-3 h-3 text-emerald-400" /> Target Sell Window
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* CHART LEGEND & FOOTER NOTES */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100 text-xs">
        <div className="flex flex-wrap items-center gap-5">
          <div className="flex items-center gap-2">
            <span className="w-4 h-1 rounded bg-blue-600"></span>
            <span className="font-bold text-slate-700">Historical Price (Past 6 Days)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 stroke-emerald-600 border-b-2 border-dashed border-emerald-600"></span>
            <span className="font-bold text-emerald-800">AI Forecast (Next 7 Days)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-emerald-100 border border-emerald-400"></span>
            <span className="font-semibold text-slate-600">Optimal Sell Window</span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
          <Info className="w-3.5 h-3.5 text-slate-400" />
          <span>Updated dynamically with daily market arrivals & weather telemetry</span>
        </div>
      </div>
    </div>
  );
};
