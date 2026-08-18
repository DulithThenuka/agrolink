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

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
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

      {/* ROLE-BASED PORTAL MATRIX SECTION */}
      <section className="py-12 bg-slate-100/70 border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto px-6 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">Tailored Ecosystem Access</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 font-display">Built for Every Agricultural Stakeholder</h2>
            <p className="text-slate-600 text-sm leading-relaxed">AgroLink provides customized tools depending on your registered account role.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* FARMERS */}
            <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-lg space-y-4 hover:border-emerald-500 transition">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl font-bold">
                🧑‍🌾
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-emerald-600 tracking-wider">Role 1: Producers</span>
                <h3 className="text-lg font-extrabold text-slate-900 font-display">Farmers &amp; Growers</h3>
              </div>
              <ul className="space-y-2 text-xs font-semibold text-slate-600">
                <li className="flex items-center gap-2">✓ Post Harvest Listings (+ Quick Modal)</li>
                <li className="flex items-center gap-2">✓ AI Disease Scanner &amp; Advisory</li>
                <li className="flex items-center gap-2">✓ Crop Price Predictor &amp; Demand Map</li>
                <li className="flex items-center gap-2">✓ Pre-Production Supplies &amp; Machinery</li>
              </ul>
              <Link to="/register" className="inline-block pt-2 text-xs font-extrabold text-emerald-600 hover:underline">
                Join as Farmer →
              </Link>
            </div>

            {/* COMMERCIAL BUYERS */}
            <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-lg space-y-4 hover:border-emerald-500 transition">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center text-2xl font-bold">
                🏬
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-teal-600 tracking-wider">Role 2: Buyers</span>
                <h3 className="text-lg font-extrabold text-slate-900 font-display">Supermarkets &amp; B2B</h3>
              </div>
              <ul className="space-y-2 text-xs font-semibold text-slate-600">
                <li className="flex items-center gap-2">✓ Bulk Quantity Escrow Orders</li>
                <li className="flex items-center gap-2">✓ B2B Purchase Request Tenders</li>
                <li className="flex items-center gap-2">✓ Live 9-Stage Fleet Tracking</li>
                <li className="flex items-center gap-2">✓ Verified Grower Origin Passports</li>
              </ul>
              <Link to="/crops" className="inline-block pt-2 text-xs font-extrabold text-teal-600 hover:underline">
                Browse Marketplace →
              </Link>
            </div>

            {/* LOGISTICS DRIVERS */}
            <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-lg space-y-4 hover:border-emerald-500 transition">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-2xl font-bold">
                🚚
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-amber-600 tracking-wider">Role 3: Logistics</span>
                <h3 className="text-lg font-extrabold text-slate-900 font-display">Fleet Drivers</h3>
              </div>
              <ul className="space-y-2 text-xs font-semibold text-slate-600">
                <li className="flex items-center gap-2">✓ Dispatch Order Assignment</li>
                <li className="flex items-center gap-2">✓ Route Pickup &amp; Transit Updates</li>
                <li className="flex items-center gap-2">✓ Escrow Delivery Settlement</li>
                <li className="flex items-center gap-2">✓ Vehicle Registration &amp; Mileage</li>
              </ul>
              <Link to="/login" className="inline-block pt-2 text-xs font-extrabold text-amber-600 hover:underline">
                Logistics Portal →
              </Link>
            </div>

            {/* GOVERNMENT ADMINS */}
            <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-lg space-y-4 hover:border-emerald-500 transition">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center text-2xl font-bold">
                🏛️
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-sky-600 tracking-wider">Role 4: Officers</span>
                <h3 className="text-lg font-extrabold text-slate-900 font-display">Gov Intelligence</h3>
              </div>
              <ul className="space-y-2 text-xs font-semibold text-slate-600">
                <li className="flex items-center gap-2">✓ District Overproduction Risk Alerts</li>
                <li className="flex items-center gap-2">✓ Tariff &amp; Policy Impact Simulator</li>
                <li className="flex items-center gap-2">✓ Buffer Stock Health Tracking</li>
                <li className="flex items-center gap-2">✓ Food Security Heatmaps</li>
              </ul>
              <Link to="/gov-intelligence" className="inline-block pt-2 text-xs font-extrabold text-sky-600 hover:underline">
                View Gov Intelligence →
              </Link>
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


