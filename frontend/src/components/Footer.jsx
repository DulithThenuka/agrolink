import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200/60 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
        
        {/* BRAND */}
        <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
          <Sprout className="w-4 h-4 text-emerald-600" />
          <span>&copy; {new Date().getFullYear()} AgroLink. All rights reserved.</span>
        </div>

        {/* NAV LINKS */}
        <div className="flex flex-wrap justify-center gap-6 text-sm font-semibold text-slate-500">
          <Link to="/" className="hover:text-emerald-600 transition">
            Home
          </Link>
          <Link to="/crops" className="hover:text-emerald-600 transition">
            Crops
          </Link>
          <Link to="/dashboard" className="hover:text-emerald-600 transition">
            Dashboard
          </Link>
          <Link to="/profile" className="hover:text-emerald-600 transition">
            Profile
          </Link>
        </div>

        {/* TECH STACK BADGE */}
        <div className="text-xs text-slate-400 font-medium flex items-center gap-1">
          Built with <Heart className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500 inline" /> using React &amp; Spring Boot
        </div>

      </div>
    </footer>
  );
};
