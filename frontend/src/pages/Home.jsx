import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sprout, ShoppingBag, ShieldCheck, Zap, TrendingUp, ArrowRight } from 'lucide-react';

export const Home = () => {
  return (
    <div className="space-y-24 py-8">
      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold uppercase tracking-wider">
            <Sprout className="w-4 h-4 text-emerald-600" />
            <span>Direct Farmer-to-Buyer Marketplace</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight font-display">
            Connecting Farmers <br />
            &amp; Buyers <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-600">Directly</span>
          </h1>

          <p className="text-base md:text-lg text-slate-600 leading-relaxed max-w-lg">
            AgroLink bypasses wholesale intermediaries, empowering farmers with fair crop prices and buyers with farm-fresh produce.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              to="/crops"
              className="px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-200 hover:from-emerald-600 hover:to-emerald-700 transition flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" /> Browse Crops
            </Link>
            <Link
              to="/register"
              className="px-8 py-3.5 bg-white text-slate-700 font-bold border border-slate-200 rounded-xl hover:bg-slate-50 transition"
            >
              Get Started
            </Link>
          </div>
        </motion.div>

        {/* HERO CARDS / ILLUSTRATION */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative w-full h-[440px] rounded-3xl bg-gradient-to-br from-slate-950 via-emerald-950 to-teal-950 p-8 flex flex-col justify-between overflow-hidden shadow-2xl border border-white/10 group"
        >
          <div className="absolute -right-16 -top-16 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700" />
          
          <div className="flex justify-between items-center z-10">
            <span className="px-3 py-1 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold rounded-full uppercase tracking-wider">
              Decentralized Agriculture
            </span>
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          <div className="space-y-3 z-10">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-3xl border border-white/10">
              🌱
            </div>
            <h3 className="text-2xl font-bold text-white font-display">Organic Yield Network</h3>
            <p className="text-xs text-emerald-200/80 leading-relaxed max-w-sm">
              Live updates from local growers with real-time settlement tracking and direct shipping.
            </p>
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-emerald-300/80 z-10 font-semibold">
            <span>Verified Local Producers</span>
            <Link to="/crops" className="flex items-center gap-1 hover:text-white transition">
              Explore Live Feed <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* FEATURES SECTION */}
      <section className="bg-white py-20 border-t border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 font-display">Why Choose AgroLink?</h2>
            <p className="text-slate-600 text-sm md:text-base">We bridge the agricultural supply chain gap with modern software for growers and consumers.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="premium-card p-8 flex flex-col space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Sprout className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 font-display">Fresh &amp; Traceable</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Access organic crops straight from local farms with complete harvest origin transparency.
              </p>
            </div>

            <div className="premium-card p-8 flex flex-col space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 font-display">Instant Orders</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Order crops in seconds with simplified transaction workflows and clear delivery tracking.
              </p>
            </div>

            <div className="premium-card p-8 flex flex-col space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 font-display">Fair Direct Pricing</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Bypass middleman fees to ensure maximum profit margins for farmers and affordable prices for buyers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="max-w-4xl mx-auto text-center px-6 space-y-8">
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 font-display">
          Start buying or selling today
        </h2>
        <p className="text-slate-600 max-w-lg mx-auto text-sm md:text-base">
          Join our decentralized marketplace in minutes. Register as a farmer to list harvests or as a buyer to shop fresh crops.
        </p>
        <div>
          <Link
            to="/register"
            className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-200 hover:from-emerald-600 hover:to-emerald-700 transition inline-block text-base"
          >
            Create Your Account
          </Link>
        </div>
      </section>
    </div>
  );
};
