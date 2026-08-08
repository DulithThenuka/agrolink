import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sprout, LogOut, User as UserIcon, LayoutDashboard, ShoppingBag, PlusCircle, Menu, X, ChevronDown } from 'lucide-react';

export const Navbar = () => {
  const { isAuthenticated, user, logout, isBuyer } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="glass sticky top-0 z-50 px-6 py-4 border-b border-slate-200/50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* LOGO */}
        <Link to="/" className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2 font-display group shrink-0 mr-4">
          <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-300">
            <Sprout className="w-5 h-5" />
          </div>
          <span>Agro<span className="text-emerald-600">Link</span></span>
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center space-x-2 lg:space-x-4 text-xs font-semibold text-slate-600 overflow-x-auto py-1">
          <Link
            to="/crops"
            className={`whitespace-nowrap transition duration-150 ease-in-out hover:text-emerald-600 ${
              isActive('/crops') ? 'text-emerald-600 font-bold' : ''
            }`}
          >
            Crops
          </Link>

          <Link
            to="/analytics"
            className={`whitespace-nowrap transition duration-150 ease-in-out hover:text-emerald-600 ${
              isActive('/analytics') ? 'text-emerald-600 font-bold' : ''
            }`}
          >
            Analytics
          </Link>

          <Link
            to="/advisor"
            className={`whitespace-nowrap transition duration-150 ease-in-out hover:text-emerald-600 ${
              isActive('/advisor') ? 'text-emerald-600 font-bold' : ''
            }`}
          >
            AI Advisor 🤖
          </Link>

          <Link
            to="/price-prediction"
            className={`whitespace-nowrap transition duration-150 ease-in-out hover:text-emerald-600 ${
              isActive('/price-prediction') ? 'text-emerald-600 font-bold' : ''
            }`}
          >
            Price Predictor 📈
          </Link>

          <Link
            to="/demand-forecasting"
            className={`whitespace-nowrap transition duration-150 ease-in-out hover:text-emerald-600 ${
              isActive('/demand-forecasting') ? 'text-emerald-600 font-bold' : ''
            }`}
          >
            Demand Forecast 📊
          </Link>

          <Link
            to="/disease-detection"
            className={`whitespace-nowrap transition duration-150 ease-in-out hover:text-emerald-600 ${
              isActive('/disease-detection') ? 'text-emerald-600 font-bold' : ''
            }`}
          >
            Disease Scanner 📷
          </Link>

          <Link
            to="/negotiation"
            className={`whitespace-nowrap transition duration-150 ease-in-out hover:text-emerald-600 ${
              isActive('/negotiation') ? 'text-emerald-600 font-bold' : ''
            }`}
          >
            Negotiations 💬
          </Link>








          {isBuyer && (
            <Link
              to="/orders"
              className={`transition duration-150 ease-in-out hover:text-emerald-600 ${
                isActive('/orders') ? 'text-emerald-600 font-bold' : ''
              }`}
            >
              My Orders
            </Link>
          )}

          {isAuthenticated && (
            <Link
              to="/dashboard"
              className={`transition duration-150 ease-in-out hover:text-emerald-600 ${
                isActive('/dashboard') ? 'text-emerald-600 font-bold' : ''
              }`}
            >
              Dashboard
            </Link>
          )}

          {!isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link to="/login" className="px-4 py-2 text-slate-700 hover:text-emerald-600 transition font-semibold">
                Sign In
              </Link>
              <Link to="/register" className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold rounded-xl shadow-md shadow-emerald-200 hover:from-emerald-600 hover:to-emerald-700 transition">
                Get Started
              </Link>
            </div>
          ) : (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100/80 hover:bg-emerald-50 text-slate-800 font-semibold transition"
              >
                <span>{user?.email}</span>
                <ChevronDown className="w-4 h-4 text-slate-500" />
              </button>

              {userMenuOpen && (
                <div
                  onMouseLeave={() => setUserMenuOpen(false)}
                  className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 space-y-1 animate-fade-in"
                >
                  <Link
                    to="/profile"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 rounded-xl font-medium transition"
                  >
                    <UserIcon className="w-4 h-4 text-emerald-600" /> Profile Settings
                  </Link>

                  <div className="h-px bg-slate-100 my-1" />

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl font-medium transition"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* MOBILE TOGGLE */}
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-slate-700 p-2">
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

      </div>

      {/* MOBILE MENU DRAWER */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-slate-100 p-4 space-y-3 mt-4 rounded-2xl shadow-xl">
          <Link
            to="/crops"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-4 py-3 rounded-xl text-slate-700 hover:bg-slate-50 font-semibold"
          >
            <ShoppingBag className="w-4 h-4 text-emerald-600" /> Crops Catalog
          </Link>

          {isBuyer && (
            <Link
              to="/orders"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-4 py-3 rounded-xl text-slate-700 hover:bg-slate-50 font-semibold"
            >
              <ShoppingBag className="w-4 h-4 text-emerald-600" /> My Orders
            </Link>
          )}

          {isAuthenticated && (
            <Link
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-4 py-3 rounded-xl text-slate-700 hover:bg-slate-50 font-semibold"
            >
              <LayoutDashboard className="w-4 h-4 text-emerald-600" /> Dashboard
            </Link>
          )}

          {isAuthenticated && (
            <Link
              to="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-4 py-3 rounded-xl text-slate-700 hover:bg-slate-50 font-semibold"
            >
              <UserIcon className="w-4 h-4 text-emerald-600" /> Profile
            </Link>
          )}

          {!isAuthenticated ? (
            <div className="pt-2 space-y-2 border-t border-slate-100">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-bold"
              >
                Get Started
              </Link>
            </div>
          ) : (
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl font-bold"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
};
