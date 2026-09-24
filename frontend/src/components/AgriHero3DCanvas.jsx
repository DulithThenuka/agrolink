import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  TrendingUp,
  Truck,
  FileText,
  QrCode,
  MapPin,
  Sprout,
  DollarSign
} from 'lucide-react';

export const AgriHero3DCanvas = () => {
  const [activeTab, setActiveTab] = useState('passport'); // 'passport', 'price', 'contracts', 'logistics'

  return (
    <div className="relative w-full select-none font-sans">
      {/* MAIN AGROLINK SURFACE */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
        
        {/* CARD HEADER & INTERACTIVE TABS */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-bold text-sm">
              <Sprout className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900">AgroLink Platform Preview</span>
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Digital Agriculture &amp; Trade Management</p>
            </div>
          </div>

          {/* TAB BUTTONS */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200 overflow-x-auto">
            {[
              { id: 'passport', label: 'Harvest Batch' },
              { id: 'price', label: 'Price Trends' },
              { id: 'contracts', label: 'Contracts' },
              { id: 'logistics', label: 'Logistics' }
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                    isActive
                      ? 'bg-white text-slate-900 shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* TAB 1: HARVEST BATCH */}
        <AnimatePresence mode="wait">
          {activeTab === 'passport' && (
            <motion.div
              key="passport"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                <img
                  src="https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80"
                  alt="Welimada Grade A Organic Tomatoes"
                  className="w-full h-44 object-cover"
                />
                
                {/* TOP CHIPS */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-white/95 text-slate-900 text-[10px] font-semibold border border-slate-200 shadow-2xs">
                    DOA Verified
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-semibold">
                    Grade A Produce
                  </span>
                </div>

                <div className="absolute top-3 right-3">
                  <span className="px-2.5 py-0.5 rounded-md bg-slate-900/80 text-emerald-300 text-[10px] font-semibold flex items-center gap-1">
                    <QrCode className="w-3 h-3 text-emerald-400" /> BATCH #WLM-882
                  </span>
                </div>

                {/* BOTTOM OVERLAY INFO */}
                <div className="absolute bottom-3 left-3 right-3 bg-slate-900/80 rounded-lg p-2.5 text-white">
                  <h4 className="text-sm font-bold leading-snug">
                    Welimada Greenhouse Tomatoes
                  </h4>
                  <div className="flex items-center justify-between text-xs text-slate-300 font-medium pt-0.5">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" /> Welimada Organic Cooperative
                    </span>
                    <span className="font-bold text-white">Rs. 185.00 / kg</span>
                  </div>
                </div>
              </div>

              {/* METRIC GRID */}
              <div className="grid grid-cols-3 gap-2.5 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-0.5">
                  <span className="text-[10px] font-semibold uppercase text-slate-500 block">Harvest Lot</span>
                  <strong className="text-slate-900 font-bold text-sm">2,500 kg</strong>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-0.5">
                  <span className="text-[10px] font-semibold uppercase text-slate-500 block">Quality Status</span>
                  <strong className="text-emerald-700 font-bold text-sm">Certified</strong>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-0.5">
                  <span className="text-[10px] font-semibold uppercase text-slate-500 block">Dispatch Ready</span>
                  <strong className="text-slate-900 font-bold text-sm">Today</strong>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: PRICE TRENDS */}
          {activeTab === 'price' && (
            <motion.div
              key="price"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="space-y-3"
            >
              <div className="p-4 bg-emerald-50/80 rounded-xl border border-emerald-200 flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold uppercase text-emerald-800 tracking-wider flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-600" /> 7-Day Market Trend
                  </span>
                  <h4 className="text-sm font-bold text-slate-900">
                    Tomato Wholesale Index
                  </h4>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-semibold text-xs">
                  +19.4% Projected
                </span>
              </div>

              <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between items-center text-slate-600">
                  <span>Current Dambulla Wholesale:</span>
                  <span className="font-semibold text-slate-900">Rs. 180.00 / kg</span>
                </div>
                <div className="flex justify-between items-center text-slate-600">
                  <span>Projected Regional Fair Value:</span>
                  <span className="font-bold text-emerald-700">Rs. 215.00 / kg</span>
                </div>
                <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-slate-500">
                  <span>Wholesale Market Flow:</span>
                  <span className="font-medium text-amber-700">Moderate Supply</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 3: CONTRACTS */}
          {activeTab === 'contracts' && (
            <motion.div
              key="contracts"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="space-y-3"
            >
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-emerald-600" /> Forward Contract
                  </span>
                  <h4 className="text-sm font-bold text-slate-900">
                    Pre-Harvest Purchase Agreement
                  </h4>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-slate-200 text-slate-800 font-semibold text-xs">
                  Active
                </span>
              </div>

              <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between items-center text-slate-600">
                  <span>Agreed Lot Value:</span>
                  <span className="font-bold text-slate-900">Rs. 462,500.00</span>
                </div>
                <div className="flex justify-between items-center text-slate-600">
                  <span>Contract Volume:</span>
                  <span className="font-semibold text-slate-800">2,500 kg Tomatoes</span>
                </div>
                <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-slate-500">
                  <span>Settlement Terms:</span>
                  <span className="font-medium text-slate-700">Escrow on verified delivery</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 4: LOGISTICS */}
          {activeTab === 'logistics' && (
            <motion.div
              key="logistics"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="space-y-3"
            >
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-blue-600" /> Fleet Transport Dispatch
                  </span>
                  <h4 className="text-sm font-bold text-slate-900">
                    Highland Central to Western Province Hub
                  </h4>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-semibold text-xs border border-blue-200">
                  In Transit
                </span>
              </div>

              <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between items-center text-slate-600">
                  <span>Transit Vehicle:</span>
                  <span className="font-medium text-slate-800">Refrigerated Truck (WP LK-4892)</span>
                </div>
                <div className="flex justify-between items-center text-slate-600">
                  <span>Temperature Control:</span>
                  <span className="font-semibold text-emerald-700">9.2°C (Optimal)</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default AgriHero3DCanvas;
