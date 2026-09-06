import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Truck,
  Lock,
  QrCode,
  MapPin,
  Clock,
  ArrowUpRight,
  Sprout,
  Activity,
  Award,
  Zap,
  DollarSign
} from 'lucide-react';

export const AgriHero3DCanvas = () => {
  const [activeTab, setActiveTab] = useState('passport'); // 'passport', 'price', 'escrow', 'logistics'

  // Auto-cycle through tabs every 6 seconds for dynamic life, pausing on user interaction
  const [autoRotate, setAutoRotate] = useState(true);

  useEffect(() => {
    if (!autoRotate) return;
    const tabs = ['passport', 'price', 'escrow', 'logistics'];
    const interval = setInterval(() => {
      setActiveTab((curr) => {
        const nextIdx = (tabs.indexOf(curr) + 1) % tabs.length;
        return tabs[nextIdx];
      });
    }, 6000);
    return () => clearInterval(interval);
  }, [autoRotate]);

  return (
    <div 
      className="relative w-full select-none"
      onMouseEnter={() => setAutoRotate(false)}
      onMouseLeave={() => setAutoRotate(true)}
    >
      {/* GLOW BACKDROPS */}
      <div className="absolute -top-6 -right-6 w-72 h-72 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-8 -left-8 w-72 h-72 bg-teal-400/20 rounded-full blur-3xl pointer-events-none" />

      {/* MAIN GLASSMORPHIC CARD */}
      <div className="glass-card bg-white/95 border border-slate-200/90 rounded-3xl p-5 sm:p-7 shadow-2xl shadow-emerald-500/10 space-y-5 relative overflow-hidden backdrop-blur-xl">
        
        {/* CARD HEADER & INTERACTIVE PILL SWITCHER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-black text-base shadow-xs">
              🌱
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-slate-900 font-display">AgroLink Live Hub</span>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Verified Smart Agri-Trade Ledger</p>
            </div>
          </div>

          {/* TAB BUTTONS */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100/90 rounded-2xl border border-slate-200/80 overflow-x-auto">
            {[
              { id: 'passport', label: 'Produce', icon: '🌾' },
              { id: 'price', label: 'AI Price', icon: '📈' },
              { id: 'escrow', label: 'Escrow', icon: '🔒' },
              { id: 'logistics', label: 'Cold Fleet', icon: '🚚' }
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setAutoRotate(false);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-extrabold transition-all flex items-center gap-1 cursor-pointer shrink-0 ${
                    isActive
                      ? 'bg-white text-emerald-800 shadow-sm border border-slate-200/80 ring-1 ring-emerald-500/20'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* TAB 1: HARVEST ORIGIN PASSPORT */}
        <AnimatePresence mode="wait">
          {activeTab === 'passport' && (
            <motion.div
              key="passport"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="space-y-4"
            >
              <div className="relative rounded-2xl overflow-hidden border border-slate-200/80 bg-slate-50 group">
                <img
                  src="https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80"
                  alt="Welimada Grade A Organic Tomatoes"
                  className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30" />
                
                {/* TOP CHIPS */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-slate-900 text-[10px] font-black uppercase tracking-wider border border-white shadow-xs">
                    DOA Certified
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider shadow">
                    Grade A Export
                  </span>
                </div>

                <div className="absolute top-3 right-3">
                  <span className="px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-emerald-300 text-[10px] font-black uppercase flex items-center gap-1 border border-white/20">
                    <QrCode className="w-3 h-3 text-emerald-400" /> BATCH #WLM-882
                  </span>
                </div>

                {/* BOTTOM OVERLAY INFO */}
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h4 className="text-base font-extrabold font-display leading-snug drop-shadow-sm">
                    Welimada Red Tomatoes (Grade A)
                  </h4>
                  <div className="flex items-center justify-between text-xs text-slate-200 font-medium pt-0.5">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" /> Welimada Organic Cooperative
                    </span>
                    <span className="font-bold text-emerald-300 font-display">Rs. 185.00/kg</span>
                  </div>
                </div>
              </div>

              {/* TELEMETRY METRIC GRID */}
              <div className="grid grid-cols-3 gap-2.5 text-xs">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-0.5">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Freshness Index</span>
                  <strong className="text-emerald-700 font-black text-sm">98.4% Peak</strong>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-0.5">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Harvest Lot</span>
                  <strong className="text-slate-800 font-black text-sm">2,500 Kg</strong>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-0.5">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Middleman Markup</span>
                  <strong className="text-emerald-700 font-black text-sm">0.00% Zero</strong>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: AI PRICE PREDICTION & FORECAST */}
          {activeTab === 'price' && (
            <motion.div
              key="price"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="space-y-3.5"
            >
              <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200 flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase text-emerald-800 tracking-wider flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-600" /> AI 7-DAY PRICE FORECAST
                  </span>
                  <h4 className="text-sm font-extrabold text-slate-900 font-display">
                    Tomato Wholesale Market Surge
                  </h4>
                </div>
                <span className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-black text-xs shadow-sm flex items-center gap-1">
                  +19.4% Surge Expected
                </span>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-2.5 text-xs shadow-xs">
                <div className="flex justify-between items-center text-slate-500">
                  <span>Current Dambulla Wholesale:</span>
                  <span className="font-bold text-slate-800">Rs. 180.00 / kg</span>
                </div>
                <div className="flex justify-between items-center text-emerald-800 font-bold">
                  <span>AI Target Fair Value (in 3 Days):</span>
                  <span className="text-base font-black font-display text-emerald-700">Rs. 215.00 / kg</span>
                </div>
                <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-slate-500">
                  <span>Pettah Market Arrivals:</span>
                  <span className="font-bold text-amber-700">Tight Supply (Deficit -15%)</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 font-medium flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>AI Recommendation: Hold harvest for 3 days to maximize wholesale revenue.</span>
              </div>
            </motion.div>
          )}

          {/* TAB 3: 100% SMART ESCROW VAULT */}
          {activeTab === 'escrow' && (
            <motion.div
              key="escrow"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="space-y-3.5"
            >
              <div className="p-4 bg-teal-50/70 rounded-2xl border border-teal-200 flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase text-teal-800 tracking-wider flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-teal-600" /> SMART CONTRACT ESCROW
                  </span>
                  <h4 className="text-sm font-extrabold text-slate-900 font-display">
                    Keells Supermarket Forward Vault
                  </h4>
                </div>
                <span className="px-3 py-1.5 rounded-xl bg-teal-600 text-white font-black text-xs shadow-sm">
                  100% Funds Locked
                </span>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-2.5 text-xs shadow-xs">
                <div className="flex justify-between items-center text-slate-500">
                  <span>Locked Escrow Capital:</span>
                  <span className="text-base font-black text-emerald-700 font-display">Rs. 462,500.00</span>
                </div>
                <div className="flex justify-between items-center text-slate-500">
                  <span>Agreed Batch Volume:</span>
                  <span className="font-bold text-slate-800">2,500 kg Organic Tomatoes</span>
                </div>
                <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-slate-700 font-bold">
                  <span>Farmer Payout Release:</span>
                  <span className="text-teal-700 font-extrabold">Instant upon Destination Scan</span>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 font-medium flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Farmers are 100% protected against delayed payments and unfair deductions.</span>
              </div>
            </motion.div>
          )}

          {/* TAB 4: COLD-CHAIN FLEET LOGISTICS */}
          {activeTab === 'logistics' && (
            <motion.div
              key="logistics"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="space-y-3.5"
            >
              <div className="p-4 bg-sky-50/70 rounded-2xl border border-sky-200 flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase text-sky-800 tracking-wider flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-sky-600" /> REAL-TIME COLD-CHAIN FLEET
                  </span>
                  <h4 className="text-sm font-extrabold text-slate-900 font-display">
                    Refrigerated Transit #AG-8842
                  </h4>
                </div>
                <span className="px-3 py-1.5 rounded-xl bg-sky-600 text-white font-black text-xs shadow-sm flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span> In Transit
                </span>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-2.5 text-xs shadow-xs">
                <div className="flex justify-between items-center text-slate-500">
                  <span>Cold Storage Core Temp:</span>
                  <span className="font-extrabold text-emerald-700 font-mono">4.2°C (Optimal)</span>
                </div>
                <div className="flex justify-between items-center text-slate-500">
                  <span>Transit Route:</span>
                  <span className="font-bold text-slate-800">Welimada ➔ Dambulla Central</span>
                </div>
                <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-slate-700">
                  <span>Estimated Delivery Window:</span>
                  <span className="font-black text-sky-700">1 Hour 35 Mins (On-Time)</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 font-medium flex items-center gap-2">
                <Clock className="w-4 h-4 text-sky-600 shrink-0" />
                <span>9-Stage verified logistics tracking with digital origin &amp; destination scans.</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CARD FOOTER CALLOUT */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-500 font-semibold text-[11px]">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Sri Lanka DOA Verified Ecosystem</span>
          </div>

          <Link
            to="/crops"
            className="text-emerald-700 hover:text-emerald-800 font-extrabold text-xs inline-flex items-center gap-1 transition group"
          >
            <span>Explore Live Batches</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

      </div>

      {/* FLOATING GLASS CHIPS SURROUNDING HERO CARD */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -bottom-5 -left-4 sm:-left-6 z-20 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-slate-200/90 shadow-xl flex items-center gap-2 text-xs font-black text-slate-800"
      >
        <div className="w-6 h-6 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs">
          🛡️
        </div>
        <span>100% Escrow Secured</span>
      </motion.div>

      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute -top-4 -right-2 sm:-right-4 z-20 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-slate-200/90 shadow-xl flex items-center gap-2 text-xs font-black text-slate-800"
      >
        <div className="w-6 h-6 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center text-xs">
          🌿
        </div>
        <span>DOA Certified Quality</span>
      </motion.div>
    </div>
  );
};

export default AgriHero3DCanvas;
