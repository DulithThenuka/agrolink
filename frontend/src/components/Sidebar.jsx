import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Sprout, ShoppingBag, PlusCircle, User, Truck, LogOut } from 'lucide-react';

export const Sidebar = () => {
  const { isFarmer, isBuyer, isLogistics, isExpert, isSupplier, isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 min-h-screen p-4 space-y-6">
      <div className="px-3 text-xs font-bold uppercase tracking-wider text-slate-400 font-display">
        Navigation
      </div>

      <nav className="space-y-1.5 font-semibold text-sm">
        {/* Dashboard available for all logged-in users */}
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

        {/* Crops catalog for Buyer, Farmer, Admin */}
        {(isBuyer || isFarmer || isAdmin) && (
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
        )}

        {/* My Orders for Buyer and Admin */}
        {(isBuyer || isAdmin) && (
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

        {/* Add Crop Listing for Farmer and Admin */}
        {(isFarmer || isAdmin) && (
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

        {/* Smart Logistics for Driver/Logistics Provider and Admin */}
        {(isLogistics || isAdmin) && (
          <Link
            to="/logistics"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
              isActive('/logistics')
                ? 'bg-emerald-50 text-emerald-700 font-bold'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Truck className="w-5 h-5 text-emerald-600" />
            <span>Smart Logistics 🚚</span>
          </Link>
        )}

        {/* Expert Advisory for Farmer, Expert, Admin */}
        {(isFarmer || isExpert || isAdmin) && (
          <Link
            to="/experts"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
              isActive('/experts')
                ? 'bg-emerald-50 text-emerald-700 font-bold'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span className="text-lg">👨‍🔬</span>
            <span>Expert Advisory 👨‍🔬</span>
          </Link>
        )}

        {/* Supplier Marketplace for Farmer, Supplier, Admin */}
        {(isFarmer || isSupplier || isAdmin) && (
          <Link
            to="/supplier-marketplace"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
              isActive('/supplier-marketplace')
                ? 'bg-emerald-50 text-emerald-700 font-bold'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span className="text-lg">🧰</span>
            <span>Supplier Marketplace 🧰</span>
          </Link>
        )}

        {/* Equipment Rental for Farmer, Supplier, Admin */}
        {(isFarmer || isSupplier || isAdmin) && (
          <Link
            to="/equipment-rental"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
              isActive('/equipment-rental')
                ? 'bg-emerald-50 text-emerald-700 font-bold'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span className="text-lg">🚜</span>
            <span>Equipment Rental 🚜</span>
          </Link>
        )}

        {/* Community Forum for all users */}
        <Link
          to="/community"
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
            isActive('/community')
              ? 'bg-emerald-50 text-emerald-700 font-bold'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <span className="text-lg">👥</span>
          <span>Community Forum 👥</span>
        </Link>

        {/* Profile settings for all users */}
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

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 font-bold transition mt-4"
        >
          <LogOut className="w-5 h-5 text-red-500" />
          <span>Logout</span>
        </button>
      </nav>

      <div className="mt-auto px-4 py-3 bg-slate-50 rounded-2xl border border-slate-100 text-[10px] uppercase font-bold text-slate-400 text-center tracking-widest">
        AgroLink v1.0 • React
      </div>
    </aside>
  );
};
