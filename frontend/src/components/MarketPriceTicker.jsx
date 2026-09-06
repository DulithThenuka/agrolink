import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, TrendingDown, Sparkles, ArrowRight } from 'lucide-react';

export const MARKET_TICKER_DATA = [
  { id: 1, name: 'Welimada Tomatoes (Grade A)', category: 'Vegetables', price: 185.00, change: 4.2, trend: 'up', market: 'Dambulla DEC', icon: '🍅' },
  { id: 2, name: 'Polonnaruwa Samba Rice', category: 'Grains', price: 220.00, change: 1.5, trend: 'up', market: 'Pettah Wholesale', icon: '🌾' },
  { id: 3, name: 'Nuwara Eliya Red Potatoes', category: 'Vegetables', price: 280.00, change: 8.1, trend: 'up', market: 'Keppetipola DEC', icon: '🥔' },
  { id: 4, name: 'Jaffna Green Chillies', category: 'Spices', price: 520.00, change: -2.4, trend: 'down', market: 'Chavakachcheri', icon: '🌶️' },
  { id: 5, name: 'Kandapola Export Carrots', category: 'Vegetables', price: 240.00, change: 3.0, trend: 'up', market: 'Nuwara Eliya', icon: '🥕' },
  { id: 6, name: 'Dambulla Big Onions', category: 'Vegetables', price: 310.00, change: 6.5, trend: 'up', market: 'Dambulla DEC', icon: '🧅' },
  { id: 7, name: 'Bandarawela Capsicum', category: 'Vegetables', price: 420.00, change: -1.2, trend: 'down', market: 'Bandarawela', icon: '🫑' },
  { id: 8, name: 'Kurunegala Fresh Coconut', category: 'Plantation', price: 110.00, change: 0.0, trend: 'neutral', market: 'Kurunegala Belt', icon: '🥥' },
  { id: 9, name: 'Embilipitiya Red Papaya', category: 'Fruits', price: 140.00, change: 5.3, trend: 'up', market: 'Embilipitiya DEC', icon: '🍈' },
  { id: 10, name: 'Matale Black Pepper (550 GL)', category: 'Spices', price: 1850.00, change: 2.1, trend: 'up', market: 'Matale Spice Hub', icon: '🌿' }
];

export const MarketPriceTicker = () => {
  // Duplicate array for seamless infinite marquee loop
  const tickerItems = [...MARKET_TICKER_DATA, ...MARKET_TICKER_DATA];

  return (
    <div className="w-full bg-white/80 backdrop-blur-md text-slate-800 border-y border-emerald-100/90 shadow-xs overflow-hidden relative group py-2">
      {/* Soft gradient edge fade overlays */}
      <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />

      <div className="flex items-center">
        {/* LIVE LABEL BADGE */}
        <div className="shrink-0 pl-4 pr-3 sm:pr-4 py-1 z-20 flex items-center gap-2 bg-white/90 backdrop-blur-md border-r border-slate-200">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
          </span>
          <span className="text-[10px] sm:text-xs font-black tracking-wider uppercase text-emerald-800 flex items-center gap-1 font-display whitespace-nowrap">
            🌾 Market Pulse <span className="hidden md:inline text-slate-400 font-medium">| Dambulla &amp; Pettah</span>
          </span>
        </div>

        {/* MARQUEE TRACK */}
        <div className="overflow-hidden flex-1 select-none">
          <div className="flex items-center gap-4 sm:gap-6 whitespace-nowrap animate-marquee group-hover:[animation-play-state:paused]">
            {tickerItems.map((item, idx) => {
              const isUp = item.trend === 'up';
              const isDown = item.trend === 'down';

              return (
                <Link
                  key={`${item.id}-${idx}`}
                  to="/price-prediction"
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-white hover:bg-emerald-50/80 border border-slate-200/90 hover:border-emerald-300 shadow-xs transition-all duration-200 group/item cursor-pointer"
                >
                  <span className="text-sm sm:text-base">{item.icon}</span>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-800 group-hover/item:text-emerald-700 transition-colors">
                        {item.name}
                      </span>
                      <span className="text-[9px] text-slate-400 font-medium hidden sm:inline">
                        ({item.market})
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px]">
                      <span className="font-extrabold text-slate-900">
                        Rs. {item.price.toFixed(2)}
                        <span className="text-[9px] text-slate-400 font-normal">/kg</span>
                      </span>
                      <span
                        className={`inline-flex items-center text-[10px] font-black px-1.5 py-0.2 rounded-md ${
                          isUp
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : isDown
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {isUp && <TrendingUp className="w-2.5 h-2.5 mr-0.5" />}
                        {isDown && <TrendingDown className="w-2.5 h-2.5 mr-0.5" />}
                        {item.change > 0 ? `+${item.change}%` : item.change < 0 ? `${item.change}%` : '0.0%'}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* QUICK LINK TO PRICE FORECASTER */}
        <div className="shrink-0 pr-4 pl-3 z-20 hidden lg:flex items-center bg-white/90 backdrop-blur-md border-l border-slate-200">
          <Link
            to="/price-prediction"
            className="text-[11px] font-extrabold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 transition"
          >
            <span>7-Day Forecast</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MarketPriceTicker;
