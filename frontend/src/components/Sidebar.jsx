import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Sprout,
  ShoppingBag,
  PlusCircle,
  User,
  Truck,
  LogOut,
  Bot,
  BrainCircuit,
  TrendingUp,
  BarChart3,
  Landmark,
  Recycle,
  MessageSquare,
  Users,
  Wrench,
  Tractor,
  FileText
} from 'lucide-react';

export const Sidebar = () => {
  const { isFarmer, isBuyer, isBusinessBuyer, isLogistics, isExpert, isSupplier, isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const linkClass = (path, accent = false) => `
    flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 relative group
    ${
      isActive(path)
        ? accent
          ? 'bg-emerald-900 text-emerald-200 font-extrabold shadow-sm'
          : 'bg-emerald-50 text-emerald-700 font-bold shadow-xs'
        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
    }
  `;

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200/80 sticky top-[73px] h-[calc(100vh-73px)] overflow-y-auto shrink-0 p-4 space-y-6 z-40 select-none scrollbar-thin">
      
      {/* CORE NAVIGATION SECTION */}
      <div className="space-y-1">
        <div className="px-3 pb-1 text-[10px] font-black uppercase tracking-widest text-slate-400 font-display">
          Overview
        </div>
        <nav className="space-y-1">
          <Link to="/dashboard" className={linkClass('/dashboard')}>
            <LayoutDashboard className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Dashboard</span>
          </Link>
          <Link to="/analytics" className={linkClass('/analytics')}>
            <BarChart3 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Analytics & Intelligence</span>
          </Link>
        </nav>
      </div>

      {/* MARKETPLACE & TRADE SECTION */}
      <div className="space-y-1">
        <div className="px-3 pb-1 text-[10px] font-black uppercase tracking-widest text-slate-400 font-display">
          Trade & Marketplace
        </div>
        <nav className="space-y-1">
          <Link to="/crops" className={linkClass('/crops')}>
            <Sprout className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Produce Marketplace</span>
          </Link>

          {(isFarmer || isAdmin) && (
            <Link to="/crops/add" className={linkClass('/crops/add')}>
              <PlusCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Post New Harvest</span>
            </Link>
          )}

          {(isBuyer || isBusinessBuyer || isAdmin) && (
            <Link to="/orders" className={linkClass('/orders')}>
              <ShoppingBag className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>My Orders</span>
            </Link>
          )}

          {(isFarmer || isBuyer || isBusinessBuyer || isAdmin) && (
            <Link to="/contracts" className={linkClass('/contracts')}>
              <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>B2B Purchase Contracts</span>
            </Link>
          )}

          {(isFarmer || isSupplier || isAdmin) && (
            <>
              <Link to="/supplier-marketplace" className={linkClass('/supplier-marketplace')}>
                <Wrench className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Supplier Marketplace</span>
              </Link>
              <Link to="/equipment-rental" className={linkClass('/equipment-rental')}>
                <Tractor className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Machinery Rentals</span>
              </Link>
            </>
          )}

          {(isLogistics || isAdmin) && (
            <Link to="/logistics" className={linkClass('/logistics')}>
              <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Smart Logistics</span>
            </Link>
          )}
        </nav>
      </div>

      {/* AI & SMART INTELLIGENCE SECTION */}
      <div className="space-y-1">
        <div className="px-3 pb-1 text-[10px] font-black uppercase tracking-widest text-slate-400 font-display">
          AI Agronomy Suite
        </div>
        <nav className="space-y-1">
          {/* Agronomist tools — farmers & experts only */}
          {(isFarmer || isExpert || isAdmin) && (
            <>
              <Link to="/advisor" className={linkClass('/advisor')}>
                <BrainCircuit className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>AI Crop Agronomist</span>
              </Link>
              <Link to="/disease-detection" className={linkClass('/disease-detection')}>
                <span className="text-sm shrink-0">📷</span>
                <span>AI Disease Scanner</span>
              </Link>
            </>
          )}
          {/* Market intelligence — all roles */}
          <Link to="/price-prediction" className={linkClass('/price-prediction')}>
            <TrendingUp className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Price Predictor</span>
          </Link>
          <Link to="/demand-forecasting" className={linkClass('/demand-forecasting')}>
            <span className="text-sm shrink-0">📊</span>
            <span>Demand Forecasting</span>
          </Link>
          <Link to="/ai-assistant" className={linkClass('/ai-assistant')}>
            <Bot className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Multilingual AI Bot</span>
          </Link>
        </nav>
      </div>

      {/* GOVERNANCE & COMMUNITY SECTION */}
      <div className="space-y-1">
        <div className="px-3 pb-1 text-[10px] font-black uppercase tracking-widest text-slate-400 font-display">
          Ecosystem &amp; Support
        </div>
        <nav className="space-y-1">
          <Link to="/gov-intelligence" className={linkClass('/gov-intelligence', true)}>
            <Landmark className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Gov Intelligence 🇱🇰</span>
          </Link>
          {(isFarmer || isBuyer || isBusinessBuyer || isSupplier || isAdmin) && (
            <Link to="/waste-reduction" className={linkClass('/waste-reduction')}>
              <Recycle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Waste Reduction &amp; Rescue</span>
            </Link>
          )}
          {(isFarmer || isBuyer || isBusinessBuyer || isAdmin) && (
            <Link to="/negotiation" className={linkClass('/negotiation')}>
              <MessageSquare className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Trade Negotiations</span>
            </Link>
          )}
          {(isFarmer || isExpert || isAdmin) && (
            <Link to="/experts" className={linkClass('/experts')}>
              <span className="text-sm shrink-0">👨‍🔬</span>
              <span>Expert Advisory Hub</span>
            </Link>
          )}
          <Link to="/community" className={linkClass('/community')}>
            <Users className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Community Forum</span>
          </Link>
        </nav>
      </div>

      {/* ACCOUNT SECTION */}
      <div className="pt-4 border-t border-slate-100 space-y-1 mt-auto">
        <div className="px-3 py-2 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100/80 flex items-center justify-between mb-2">
          <span className="text-[10px] font-black uppercase text-emerald-800 tracking-wider">Role</span>
          <span className="text-[11px] font-bold text-emerald-700 bg-white px-2 py-0.5 rounded-md shadow-2xs border border-emerald-100">
            {isAdmin
              ? 'Admin 👑'
              : isFarmer
              ? 'Farmer 🌱'
              : isLogistics
              ? 'Logistics 🚚'
              : isBuyer
              ? 'Buyer 🛒'
              : isSupplier
              ? 'Supplier 🧰'
              : isExpert
              ? 'Expert 👨‍🔬'
              : 'Member 👤'}
          </span>
        </div>

        <Link to="/profile" className={linkClass('/profile')}>
          <User className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Profile Settings</span>
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition"
        >
          <LogOut className="w-4 h-4 text-red-500 shrink-0" />
          <span>Logout</span>
        </button>
      </div>

      <div className="px-3 py-2 bg-slate-50 rounded-xl border border-slate-100 text-[10px] uppercase font-bold text-slate-400 text-center tracking-wider font-display">
        AgroLink v1.0 • React
      </div>
    </aside>
  );
};

