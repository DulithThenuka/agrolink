import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Sprout,
  PlusCircle,
  ShoppingBag,
  FileText,
  Wrench,
  Tractor,
  Truck,
  BrainCircuit,
  Scan,
  TrendingUp,
  Landmark,
  Users,
  User,
  LogOut,
  Sparkles,
  Bot
} from 'lucide-react';

export const Sidebar = () => {
  const { isFarmer, isBuyer, isBusinessBuyer, isLogistics, isExpert, isSupplier, isAdmin, logout, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const linkClass = (path) => `
    flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors relative
    ${
      isActive(path)
        ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200/60'
        : 'text-slate-600 hover:bg-slate-100/70 hover:text-slate-900'
    }
  `;

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200/80 sticky top-[65px] h-[calc(100vh-65px)] overflow-y-auto shrink-0 p-4 space-y-6 z-40 select-none">
      
      {/* ── CORE NAVIGATION ── */}
      <div className="space-y-1">
        <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Overview
        </div>
        <nav className="space-y-0.5">
          <Link to="/dashboard" className={linkClass('/dashboard')}>
            <LayoutDashboard className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>Farm Overview</span>
          </Link>
          <Link to="/crops" className={linkClass('/crops')}>
            <Sprout className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>My Crops &amp; Market</span>
          </Link>
          {(isFarmer || isAdmin) && (
            <Link to="/crops/add" className={linkClass('/crops/add')}>
              <PlusCircle className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Add Harvest Batch</span>
            </Link>
          )}
        </nav>
      </div>

      {/* ── AI INTELLIGENCE ── */}
      <div className="space-y-1">
        <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          AI Agronomy Suite
        </div>
        <nav className="space-y-0.5">
          {(isFarmer || isExpert || isAdmin) && (
            <>
              <Link to="/disease-detection" className={linkClass('/disease-detection')}>
                <Scan className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Disease Scanner</span>
              </Link>
              <Link to="/advisor" className={linkClass('/advisor')}>
                <BrainCircuit className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>AI Agronomist</span>
              </Link>
            </>
          )}
          <Link to="/price-prediction" className={linkClass('/price-prediction')}>
            <TrendingUp className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>Wholesale Price Trend</span>
          </Link>
          <Link to="/ai-assistant" className={linkClass('/ai-assistant')}>
            <Bot className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>AI Farm Assistant</span>
          </Link>
        </nav>
      </div>

      {/* ── SERVICES & MARKETPLACE ── */}
      <div className="space-y-1">
        <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Services &amp; Equipment
        </div>
        <nav className="space-y-0.5">
          <Link to="/equipment-rental" className={linkClass('/equipment-rental')}>
            <Tractor className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>Equipment Rental</span>
          </Link>
          <Link to="/supplier-marketplace" className={linkClass('/supplier-marketplace')}>
            <Wrench className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>Input Supplies Hub</span>
          </Link>
          {(isFarmer || isBuyer || isBusinessBuyer || isAdmin) && (
            <Link to="/contracts" className={linkClass('/contracts')}>
              <FileText className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Forward Contracts</span>
            </Link>
          )}
          {(isBuyer || isBusinessBuyer || isAdmin) && (
            <Link to="/orders" className={linkClass('/orders')}>
              <ShoppingBag className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Orders &amp; Escrow</span>
            </Link>
          )}
          {(isLogistics || isAdmin) && (
            <Link to="/logistics" className={linkClass('/logistics')}>
              <Truck className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Logistics Fleet</span>
            </Link>
          )}
        </nav>
      </div>

      {/* ── GOVERNANCE & COMMUNITY ── */}
      <div className="space-y-1">
        <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Support &amp; Community
        </div>
        <nav className="space-y-0.5">
          <Link to="/gov-intelligence" className={linkClass('/gov-intelligence')}>
            <Landmark className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>Government Intel 🇱🇰</span>
          </Link>
          <Link to="/community" className={linkClass('/community')}>
            <Users className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>Farmer Community</span>
          </Link>
        </nav>
      </div>

      {/* ── USER & ACCOUNT FOOTER ── */}
      <div className="pt-4 border-t border-slate-200/80 space-y-1 mt-auto">
        <div className="px-3 py-2 bg-slate-50 rounded-xl border border-slate-200/60 flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold uppercase text-slate-500">Account Role</span>
          <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
            {user?.role?.replace('ROLE_', '') || 'FARMER'}
          </span>
        </div>

        <Link to="/profile" className={linkClass('/profile')}>
          <User className="w-4 h-4 text-slate-500 shrink-0" />
          <span>Profile Settings</span>
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition cursor-pointer"
        >
          <LogOut className="w-4 h-4 text-red-500 shrink-0" />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
