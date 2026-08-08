import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sprout, ShoppingBag, ShieldCheck, Zap, TrendingUp, ArrowRight, Search, CheckCircle2 } from 'lucide-react';

export const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/crops?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <div className="space-y-20 py-6">
      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-7 space-y-8"
        >
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-bold uppercase tracking-wider shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            <Sprout className="w-4 h-4 text-emerald-600" />
            <span>Direct Farmer-to-Buyer Ecosystem</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15] font-display">
            Empowering Farmers. <br />
            Direct to <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-500">Your Doorstep.</span>
          </h1>

          <p class="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
            Bypass traditional middleman markups. AgroLink connects registered growers directly with commercial &amp; retail buyers for transparent, farm-fresh trade.
          </p>

          {/* QUICK SEARCH FORM */}
          <form onSubmit={handleSearch} className="glass p-2.5 rounded-2xl shadow-xl border border-white/80 max-w-xl flex flex-col sm:flex-row gap-2">
            <div className="relative flex-grow flex items-center px-3">
              <Search className="w-5 h-5 text-slate-400 mr-2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search crops (e.g. Organic Wheat, Tomatoes)..."
                className="w-full bg-transparent border-none text-slate-800 placeholder-slate-400 text-sm font-medium focus:outline-none focus:ring-0"
              />
            </div>
            <button
              type="submit"
              className="px-7 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-500/25 hover:from-emerald-600 hover:to-emerald-700 transition shrink-0"
            >
              Find Produce
            </button>
          </form>

          {/* TRUST BADGES */}
          <div className="pt-2 flex flex-wrap items-center gap-6 text-xs font-semibold text-slate-500">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 100% Origin Verified
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Zero Intermediary Markup
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Secure Escrow Settlement
            </div>
          </div>
        </motion.div>

        {/* HERO VISUAL CARD */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-5 relative w-full h-[460px] rounded-3xl bg-gradient-to-br from-slate-950 via-emerald-950 to-teal-950 p-8 flex flex-col justify-between overflow-hidden shadow-2xl border border-white/10 group"
        >
          <div className="absolute -right-16 -top-16 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700" />
          
          <div className="flex justify-between items-center z-10">
            <span className="px-3 py-1 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold rounded-full uppercase tracking-wider">
              Live Harvest Network
            </span>
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          <div className="space-y-3 z-10">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-3xl border border-white/10 shadow-inner">
              🌱
            </div>
            <h3 className="text-2xl font-extrabold text-white font-display">Direct Farm Trade Matrix</h3>
            <p className="text-xs text-emerald-200/80 leading-relaxed max-w-sm">
              Real-time crop inventory tracking, verified grower profiles, and automated settlement workflows.
            </p>
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-emerald-300/80 z-10 font-bold">
            <span>1,250+ Local Producers</span>
            <Link to="/crops" className="flex items-center gap-1 hover:text-white transition">
              Explore Live Feed <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* LIVE STATS TICKER BAR */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="glass rounded-3xl p-6 sm:p-8 shadow-xl border border-white/80 grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-x-0 md:divide-x divide-slate-200/60">
          <div className="space-y-1">
            <h4 className="text-3xl sm:text-4xl font-extrabold text-emerald-600 font-display">$1.8M+</h4>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Direct Harvest Traded</p>
          </div>
          <div className="space-y-1">
            <h4 className="text-3xl sm:text-4xl font-extrabold text-emerald-600 font-display">1,250+</h4>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Verified Local Farms</p>
          </div>
          <div className="space-y-1">
            <h4 className="text-3xl sm:text-4xl font-extrabold text-emerald-600 font-display">0%</h4>
            <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Intermediary Markup</p>
          </div>
          <div className="space-y-1">
            <h4 className="text-3xl sm:text-4xl font-extrabold text-emerald-600 font-display">99.2%</h4>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">On-Time Delivery Rate</p>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-16 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">Platform Capabilities</span>
            <h2 class="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 font-display">Engineered for Agricultural Excellence</h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">Modern tools designed to deliver max profits for growers and fresh quality for commercial buyers.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="premium-card p-8 flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200/60 text-emerald-600 flex items-center justify-center text-3xl font-bold shadow-sm group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition duration-300">
                  🌾
                </div>
                <h3 className="font-bold text-xl text-slate-900 font-display">Direct Farm Sourcing</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Access real-time crop availability directly from registered local fields with verified origin coordinates.
                </p>
              </div>
              <div className="pt-6 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-600 group-hover:text-emerald-700">
                <Link to="/crops">Explore Listings →</Link>
              </div>
            </div>

            <div className="premium-card p-8 flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-200/60 text-teal-600 flex items-center justify-center text-3xl font-bold shadow-sm group-hover:scale-110 group-hover:bg-teal-500 group-hover:text-white transition duration-300">
                  ⚡
                </div>
                <h3 className="font-bold text-xl text-slate-900 font-display">Automated Settlement</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Secure instant online order creation with automated quantity computation and transparent pricing structures.
                </p>
              </div>
              <div className="pt-6 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-teal-600 group-hover:text-teal-700">
                <Link to="/crops">Order Workflow →</Link>
              </div>
            </div>

            <div className="premium-card p-8 flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200/60 text-amber-600 flex items-center justify-center text-3xl font-bold shadow-sm group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-white transition duration-300">
                  📊
                </div>
                <h3 className="font-bold text-xl text-slate-900 font-display">Farmer Insights</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Comprehensive management dashboard enabling farmers to monitor earnings, list yield batches, and track pending dispatches.
                </p>
              </div>
              <div className="pt-6 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-600 group-hover:text-amber-700">
                <Link to="/dashboard">View Analytics →</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-20 bg-slate-900 text-white relative overflow-hidden my-12 mx-4 sm:mx-8 rounded-3xl shadow-2xl">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-8 relative z-10">
          <span className="px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider border border-emerald-500/30">Get Started Today</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-display">
            Ready to revolutionize your farm trade?
          </h2>
          <p className="text-slate-300 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            Join thousands of growers and commercial buyers trading directly on Sri Lanka's leading agriculture ecosystem.
          </p>
          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Link
              to="/register"
              className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold rounded-xl shadow-xl shadow-emerald-500/30 hover:from-emerald-600 hover:to-emerald-700 transition inline-block text-base"
            >
              Create Free Account
            </Link>
            <Link
              to="/crops"
              className="px-8 py-4 bg-slate-800 text-white border border-slate-700 font-bold rounded-xl hover:bg-slate-700 transition inline-block text-base"
            >
              Browse Produce Marketplace
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};


