import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sprout, LogOut, User as UserIcon, LayoutDashboard, ShoppingBag, PlusCircle, Menu, X, ChevronDown } from 'lucide-react';

export const Navbar = () => {
  const { isAuthenticated, user, logout, isBuyer, isFarmer, isLogistics, isAdmin } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifDrawerOpen, setNotifDrawerOpen] = useState(false);
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

        {/* DESKTOP MENU - CATEGORIZED ROLE DROPDOWNS */}
        <div className="hidden md:flex items-center space-x-2 lg:space-x-4 text-xs font-semibold text-slate-700">
          
          {/* MARKETPLACE DROPDOWN */}
          <div className="relative group py-2">
            <button className="flex items-center gap-1 hover:text-emerald-600 font-bold transition py-1">
              <span>🌾 Marketplace</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:rotate-180 transition-transform" />
            </button>
            <div className="absolute left-0 mt-1 w-56 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 space-y-1">
              <Link to="/crops" className="block px-3.5 py-2.5 rounded-xl hover:bg-emerald-50 text-slate-800 font-bold hover:text-emerald-700 transition">
                🌾 Produce Marketplace
              </Link>
              <Link to="/contracts" className="block px-3.5 py-2.5 rounded-xl hover:bg-emerald-50 text-slate-800 font-semibold hover:text-emerald-700 transition">
                📑 B2B Purchase Contracts
              </Link>
              <Link to="/supplier-marketplace" className="block px-3.5 py-2.5 rounded-xl hover:bg-emerald-50 text-slate-800 font-semibold hover:text-emerald-700 transition">
                🧰 Pre-Production Supplies
              </Link>
              <Link to="/equipment-rental" className="block px-3.5 py-2.5 rounded-xl hover:bg-emerald-50 text-slate-800 font-semibold hover:text-emerald-700 transition">
                🚜 Machinery Rentals
              </Link>
            </div>
          </div>

          {/* AI & SMART INTELLIGENCE DROPDOWN */}
          <div className="relative group py-2">
            <button className="flex items-center gap-1 hover:text-emerald-600 font-bold transition py-1">
              <span>🤖 AI Intelligence</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:rotate-180 transition-transform" />
            </button>
            <div className="absolute left-0 mt-1 w-60 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 space-y-1">
              <Link to="/advisor" className="block px-3.5 py-2.5 rounded-xl hover:bg-emerald-50 text-slate-800 font-bold hover:text-emerald-700 transition">
                🤖 AI Agronomist Advisor
              </Link>
              <Link to="/disease-detection" className="block px-3.5 py-2.5 rounded-xl hover:bg-emerald-50 text-slate-800 font-semibold hover:text-emerald-700 transition">
                📷 AI Disease Scanner
              </Link>
              <Link to="/price-prediction" className="block px-3.5 py-2.5 rounded-xl hover:bg-emerald-50 text-slate-800 font-semibold hover:text-emerald-700 transition">
                📈 Price Predictor
              </Link>
              <Link to="/demand-forecasting" className="block px-3.5 py-2.5 rounded-xl hover:bg-emerald-50 text-slate-800 font-semibold hover:text-emerald-700 transition">
                📊 Demand Forecasting
              </Link>
              <Link to="/ai-assistant" className="block px-3.5 py-2.5 rounded-xl hover:bg-emerald-50 text-slate-800 font-semibold hover:text-emerald-700 transition">
                💬 Multilingual AI Bot
              </Link>
            </div>
          </div>

          {/* ECOSYSTEM & GOVERNANCE DROPDOWN */}
          <div className="relative group py-2">
            <button className="flex items-center gap-1 hover:text-emerald-600 font-bold transition py-1">
              <span>🏛️ Governance &amp; Ecosystem</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:rotate-180 transition-transform" />
            </button>
            <div className="absolute left-0 mt-1 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 space-y-1">
              <Link to="/gov-intelligence" className="block px-3.5 py-2.5 rounded-xl bg-emerald-50 text-emerald-800 font-extrabold hover:bg-emerald-100 transition">
                🏛️ Government Intelligence 🇱🇰
              </Link>
              <Link to="/waste-reduction" className="block px-3.5 py-2.5 rounded-xl hover:bg-emerald-50 text-slate-800 font-semibold hover:text-emerald-700 transition">
                ♻️ Waste Reduction &amp; Rescue
              </Link>
              <Link to="/negotiation" className="block px-3.5 py-2.5 rounded-xl hover:bg-emerald-50 text-slate-800 font-semibold hover:text-emerald-700 transition">
                💬 Trade Negotiations
              </Link>
              <Link to="/experts" className="block px-3.5 py-2.5 rounded-xl hover:bg-emerald-50 text-slate-800 font-semibold hover:text-emerald-700 transition">
                👨‍🔬 Expert Advisory Hub
              </Link>
              <Link to="/community" className="block px-3.5 py-2.5 rounded-xl hover:bg-emerald-50 text-slate-800 font-semibold hover:text-emerald-700 transition">
                👥 Farmer Community
              </Link>
            </div>
          </div>

          <Link
            to="/analytics"
            className={`transition duration-150 ease-in-out hover:text-emerald-600 font-bold ${
              isActive('/analytics') ? 'text-emerald-600 font-bold' : ''
            }`}
          >
            Analytics 📊
          </Link>

          {(isLogistics || isAdmin) && (
            <Link
              to="/logistics"
              className={`whitespace-nowrap transition duration-150 ease-in-out hover:text-emerald-600 font-bold ${
                isActive('/logistics') ? 'text-emerald-600 font-bold' : ''
              }`}
            >
              Smart Logistics 🚚
            </Link>
          )}

          {(isBuyer || isAdmin) && (
            <Link
              to="/orders"
              className={`transition duration-150 ease-in-out hover:text-emerald-600 font-bold ${
                isActive('/orders') ? 'text-emerald-600 font-bold' : ''
              }`}
            >
              My Orders
            </Link>
          )}

          {isAuthenticated && (
            <Link
              to="/dashboard"
              className={`transition duration-150 ease-in-out hover:text-emerald-600 font-bold ${
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
            <div className="flex items-center gap-3">
              {/* NOTIFICATION BELL DRAWER */}
              <div className="relative">
                <button
                  onClick={() => {
                    setNotifDrawerOpen(!notifDrawerOpen);
                    setUserMenuOpen(false);
                  }}
                  className="p-2 rounded-xl bg-slate-100/80 hover:bg-emerald-50 text-slate-700 hover:text-emerald-600 transition relative"
                  title="System Notifications"
                >
                  <span className="text-base">🔔</span>
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-black flex items-center justify-center animate-pulse">
                    2
                  </span>
                </button>

                {notifDrawerOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 z-50 space-y-3 animate-fade-in">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 font-display">
                        Notifications (2 Unread)
                      </h4>
                      <button
                        onClick={() => setNotifDrawerOpen(false)}
                        className="text-[10px] text-emerald-600 font-bold hover:underline"
                      >
                        Close
                      </button>
                    </div>

                    <div className="space-y-2 max-h-64 overflow-y-auto text-xs">
                      <div className="p-2.5 bg-emerald-50/70 rounded-xl border border-emerald-100 space-y-1">
                        <div className="flex items-center justify-between text-[10px] font-bold text-emerald-800">
                          <span>🚚 Order Dispatched!</span>
                          <span className="text-slate-400">Just now</span>
                        </div>
                        <p className="text-slate-600 text-[11px] leading-tight">
                          Vehicle WP LK-4892 picked up 150kg Samba Rice from Nuwara Eliya.
                        </p>
                      </div>

                      <div className="p-2.5 bg-sky-50/70 rounded-xl border border-sky-100 space-y-1">
                        <div className="flex items-center justify-between text-[10px] font-bold text-sky-800">
                          <span>🔒 Escrow Secured</span>
                          <span className="text-slate-400">12m ago</span>
                        </div>
                        <p className="text-slate-600 text-[11px] leading-tight">
                          Payment of Rs 34,500.00 is safely locked in Escrow vault.
                        </p>
                      </div>

                      <div className="p-2.5 bg-amber-50/70 rounded-xl border border-amber-100 space-y-1">
                        <div className="flex items-center justify-between text-[10px] font-bold text-amber-800">
                          <span>♻️ Waste Risk Flagged</span>
                          <span className="text-slate-400">2h ago</span>
                        </div>
                        <p className="text-slate-600 text-[11px] leading-tight">
                          500kg Tomatoes near 2-day expiry. 15% discount recommended.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* USER ACCOUNT DROPDOWN */}
              <div className="relative">
                <button
                  onClick={() => {
                    setUserMenuOpen(!userMenuOpen);
                    setNotifDrawerOpen(false);
                  }}
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
          {(!isLogistics) && (
            <Link
              to="/crops"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-4 py-3 rounded-xl text-slate-700 hover:bg-slate-50 font-semibold"
            >
              <ShoppingBag className="w-4 h-4 text-emerald-600" /> Crops Catalog
            </Link>
          )}

          {(isLogistics || isAdmin) && (
            <Link
              to="/logistics"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-4 py-3 rounded-xl text-slate-700 hover:bg-slate-50 font-semibold"
            >
              <ShoppingBag className="w-4 h-4 text-emerald-600" /> Smart Logistics 🚚
            </Link>
          )}

          {(isBuyer || isAdmin) && (
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
