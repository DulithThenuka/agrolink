import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Sprout, ShoppingBag, PlusCircle, User } from 'lucide-react';

export const Sidebar = () => {
  const { isFarmer, isBuyer } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 min-h-screen p-4 space-y-6">
      <div className="px-3 text-xs font-bold uppercase tracking-wider text-slate-400 font-display">
        Navigation
      </div>

      <nav className="space-y-1.5 font-semibold text-sm">
        <Link
          to="/dashboard"
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
            isActive('/dashboard')
              ? 'bg-emerald-50 text-emerald-700 font-bold'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <LayoutDashboard className="w-5 h-5 text-emerald-600" />
          <span>Dashboard</span>
        </Link>

        <Link
          to="/crops"
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
            isActive('/crops')
              ? 'bg-emerald-50 text-emerald-700 font-bold'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Sprout className="w-5 h-5 text-emerald-600" />
          <span>Browse Crops</span>
        </Link>

        {isBuyer && (
          <Link
            to="/orders"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
              isActive('/orders')
                ? 'bg-emerald-50 text-emerald-700 font-bold'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <ShoppingBag className="w-5 h-5 text-emerald-600" />
            <span>My Orders</span>
          </Link>
        )}

        {isFarmer && (
          <Link
            to="/crops/add"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
              isActive('/crops/add')
                ? 'bg-emerald-50 text-emerald-700 font-bold'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <PlusCircle className="w-5 h-5 text-emerald-600" />
            <span>Add Crop Listing</span>
          </Link>
        )}

        <Link
          to="/profile"
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
            isActive('/profile')
              ? 'bg-emerald-50 text-emerald-700 font-bold'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <User className="w-5 h-5 text-emerald-600" />
          <span>Profile Settings</span>
        </Link>
      </nav>

      <div className="mt-auto px-4 py-3 bg-slate-50 rounded-2xl border border-slate-100 text-[10px] uppercase font-bold text-slate-400 text-center tracking-widest">
        AgroLink v1.0 • React
      </div>
    </aside>
  );
};
