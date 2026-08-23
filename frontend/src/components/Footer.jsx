import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-emerald-100 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
        
        {/* BRAND */}
        <div className="flex items-center gap-2 text-slate-600 text-sm font-semibold">
          <div className="w-6 h-6 rounded-lg bg-emerald-500 text-white flex items-center justify-center shadow-xs">
            <Sprout className="w-3.5 h-3.5" />
          </div>
          <span>&copy; {new Date().getFullYear()} <strong className="text-slate-900 font-display">Agro<span className="text-emerald-600">Link</span></strong>. Empowering Sri Lankan Agriculture.</span>
        </div>

        {/* NAV LINKS */}
        <div className="flex flex-wrap justify-center gap-6 text-xs font-bold text-slate-600">
          <Link to="/" className="hover:text-emerald-600 transition">
            Home
          </Link>
          <Link to="/crops" className="hover:text-emerald-600 transition">
            Marketplace
          </Link>
          <Link to="/contracts" className="hover:text-emerald-600 transition">
            Contract Farming
          </Link>
          <Link to="/equipment-rental" className="hover:text-emerald-600 transition">
            Equipment
          </Link>
          <Link to="/dashboard" className="hover:text-emerald-600 transition">
            Dashboard
          </Link>
        </div>

        {/* TECH STACK BADGE */}
        <div className="text-xs text-slate-400 font-medium flex items-center gap-1">
          Built with <Heart className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500 inline" /> for Sustainable Trade
        </div>

      </div>
    </footer>
  );
};
