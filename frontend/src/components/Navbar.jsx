import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { notificationsAPI } from '../services/api';
import {
  Sprout, LogOut, User as UserIcon, LayoutDashboard,
  Menu, X, ChevronDown, Bell, CheckCheck,
} from 'lucide-react';

export const Navbar = () => {
  const {
    isAuthenticated, user, logout,
    isFarmer, isBuyer, isBusinessBuyer,
    isLogistics, isExpert, isSupplier, isAdmin,
  } = useAuth();

  const [userMenuOpen, setUserMenuOpen]       = useState(false);
  const [notifDrawerOpen, setNotifDrawerOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen]   = useState(false);
  const [isScrolled, setIsScrolled]           = useState(false);
  const [notifications, setNotifications]     = useState([]);
  const location  = useLocation();
  const navigate  = useNavigate();

  const unreadCount = notifications.filter((n) => !n.read).length;

  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await notificationsAPI.getAll();
      if (res?.data) {
        const list = Array.isArray(res.data) ? res.data : (res.data.data ?? []);
        setNotifications(list);
      }
    } catch {
      // silently handle notification errors
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 15);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { fetchNotifications(); }, [fetchNotifications]);
  useEffect(() => { setMobileMenuOpen(false); }, [location.pathname]);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    setNotifications([]);
    navigate('/login');
  };

  const handleMarkRead = async (id) => {
    try {
      await notificationsAPI.markRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    }
  };

  const handleMarkAllRead = async () => {
    const unread = notifications.filter((n) => !n.read);
    await Promise.allSettled(unread.map((n) => notificationsAPI.markRead(n.id)));
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const canContract  = isAdmin || isFarmer || isBuyer || isBusinessBuyer;
  const canSupply    = isAdmin || isFarmer || isSupplier;
  const canOrder     = isAdmin || isBuyer  || isBusinessBuyer;
  const canLogistics = isAdmin || isLogistics;
  const canAI        = isAdmin || isFarmer || isExpert;

  const isActive = (path) => location.pathname === path;

  const navLinkClass = (path) => `
    text-sm font-medium transition-colors px-3 py-1.5 rounded-lg
    ${isActive(path) ? 'text-emerald-800 bg-emerald-50/80 font-semibold' : 'text-slate-700 hover:text-emerald-800 hover:bg-slate-100/60'}
  `;

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-200 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/80 py-2.5'
          : 'bg-white/90 backdrop-blur-sm border-b border-slate-200/50 py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* ── LOGO & BRAND ── */}
        <Link
          to="/"
          className="flex items-center gap-2.5 font-sans group shrink-0"
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-800 text-white flex items-center justify-center shadow-xs">
            <Sprout className="w-4 h-4" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            Agro<span className="text-emerald-700">Link</span>
          </span>
        </Link>

        {/* ── DESKTOP NAVIGATION ── */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          <Link to="/" className={navLinkClass('/')}>
            Home
          </Link>

          {/* AI Insights Dropdown */}
          <div className="relative group py-1">
            <button className="flex items-center gap-1 text-sm font-medium text-slate-700 hover:text-emerald-800 px-3 py-1.5 rounded-lg hover:bg-slate-100/60 transition-colors">
              <span>AI Insights</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-800 transition-transform group-hover:rotate-180" />
            </button>
            <div className="absolute left-0 mt-1 w-60 bg-white rounded-xl shadow-lg border border-slate-200/90 p-1.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50 space-y-0.5">
              <Link to="/disease-detection" className="block px-3 py-2 text-xs font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 rounded-lg transition-colors">
                AI Crop Disease Scanner
              </Link>
              <Link to="/advisor" className="block px-3 py-2 text-xs font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 rounded-lg transition-colors">
                AI Agronomist Advisor
              </Link>
              <Link to="/price-prediction" className="block px-3 py-2 text-xs font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 rounded-lg transition-colors">
                Wholesale Price Prediction
              </Link>
              <Link to="/demand-forecasting" className="block px-3 py-2 text-xs font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 rounded-lg transition-colors">
                National Demand Forecast
              </Link>
              <Link to="/ai-assistant" className="block px-3 py-2 text-xs font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 rounded-lg transition-colors">
                Multilingual AI Assistant
              </Link>
            </div>
          </div>

          <Link to="/equipment-rental" className={navLinkClass('/equipment-rental')}>
            Equipment
          </Link>

          {/* Marketplace Dropdown */}
          <div className="relative group py-1">
            <button className="flex items-center gap-1 text-sm font-medium text-slate-700 hover:text-emerald-800 px-3 py-1.5 rounded-lg hover:bg-slate-100/60 transition-colors">
              <span>Marketplace</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-800 transition-transform group-hover:rotate-180" />
            </button>
            <div className="absolute left-0 mt-1 w-60 bg-white rounded-xl shadow-lg border border-slate-200/90 p-1.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50 space-y-0.5">
              <Link to="/crops" className="block px-3 py-2 text-xs font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 rounded-lg transition-colors">
                Crop &amp; Produce Market
              </Link>
              <Link to="/supplier-marketplace" className="block px-3 py-2 text-xs font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 rounded-lg transition-colors">
                Supplies &amp; Agricultural Inputs
              </Link>
              {canContract && (
                <Link to="/contracts" className="block px-3 py-2 text-xs font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 rounded-lg transition-colors">
                  Forward Purchase Contracts
                </Link>
              )}
              {canOrder && (
                <Link to="/orders" className="block px-3 py-2 text-xs font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 rounded-lg transition-colors">
                  My Orders &amp; Escrow
                </Link>
              )}
              {canLogistics && (
                <Link to="/logistics" className="block px-3 py-2 text-xs font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 rounded-lg transition-colors">
                  Logistics &amp; Transport
                </Link>
              )}
            </div>
          </div>

          <Link to="/community" className={navLinkClass('/community')}>
            Community
          </Link>

          <Link to="/gov-intelligence" className={navLinkClass('/gov-intelligence')}>
            Government
          </Link>

          {isAuthenticated && (
            <Link to="/dashboard" className={navLinkClass('/dashboard')}>
              Dashboard
            </Link>
          )}
        </nav>

        {/* ── RIGHT ACTIONS ── */}
        <div className="flex items-center gap-3">
          {!isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="text-sm font-semibold text-slate-700 hover:text-emerald-800 px-3.5 py-2 rounded-lg transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="text-sm font-semibold bg-emerald-800 hover:bg-emerald-900 text-white px-4 py-2 rounded-lg shadow-xs transition-colors"
              >
                Get Started
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={() => { setNotifDrawerOpen(!notifDrawerOpen); setUserMenuOpen(false); }}
                  className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition relative"
                  title="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-600" />
                  )}
                </button>

                {notifDrawerOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 space-y-3 animate-fade-in">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        Notifications {unreadCount > 0 && `(${unreadCount})`}
                      </span>
                      <div className="flex items-center gap-2">
                        {unreadCount > 0 && (
                          <button
                            onClick={handleMarkAllRead}
                            className="text-[11px] text-emerald-700 font-semibold hover:underline flex items-center gap-0.5"
                          >
                            <CheckCheck className="w-3 h-3" /> Mark all read
                          </button>
                        )}
                        <button
                          onClick={() => setNotifDrawerOpen(false)}
                          className="text-[11px] text-slate-400 hover:text-slate-600"
                        >
                          Close
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2 max-h-60 overflow-y-auto text-xs">
                      {notifications.length === 0 ? (
                        <p className="text-center text-slate-400 text-xs py-4">No notifications.</p>
                      ) : (
                        notifications.map((n) => (
                          <button
                            key={n.id}
                            onClick={() => handleMarkRead(n.id)}
                            className={`w-full text-left p-2.5 rounded-lg border border-slate-100 bg-slate-50/80 hover:bg-slate-100 transition space-y-1 ${
                              n.read ? 'opacity-60' : 'opacity-100'
                            }`}
                          >
                            <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                              <span>{n.title}</span>
                              <span className="text-[10px] text-slate-400 font-normal">{n.timestamp}</span>
                            </div>
                            <p className="text-[11px] text-slate-600 leading-snug">{n.message}</p>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User Dropdown */}
              <div className="relative">
                <button
                  onClick={() => { setUserMenuOpen(!userMenuOpen); setNotifDrawerOpen(false); }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200/80 text-slate-800 text-xs font-semibold transition"
                >
                  <div className="w-5 h-5 rounded-full bg-emerald-800 text-white text-[10px] font-bold flex items-center justify-center">
                    {(user?.name ? user.name.charAt(0) : (user?.email ? user.email.charAt(0) : 'U')).toUpperCase()}
                  </div>
                  <span className="max-w-[120px] truncate">{user?.name || 'Account'}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                </button>

                {userMenuOpen && (
                  <div
                    onMouseLeave={() => setUserMenuOpen(false)}
                    className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50 space-y-1 animate-fade-in"
                  >
                    <div className="px-3 py-2 bg-slate-50 rounded-lg border border-slate-100 mb-1">
                      <p className="text-xs font-bold text-slate-900 truncate">{user?.name || 'User'}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                      <span className="inline-block mt-1 px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[9px] font-bold uppercase tracking-wider">
                        {user?.role?.replace('ROLE_', '') || 'MEMBER'}
                      </span>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-100 rounded-lg transition font-medium"
                    >
                      <UserIcon className="w-3.5 h-3.5 text-slate-500" /> Profile Settings
                    </Link>

                    <Link
                      to="/dashboard"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-100 rounded-lg transition font-medium"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5 text-slate-500" /> Dashboard Overview
                    </Link>

                    <div className="h-px bg-slate-100 my-1" />

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 text-left px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-lg font-medium transition cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Log Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* ── MOBILE MENU ── */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 px-4 py-4 space-y-3 shadow-lg max-h-[85vh] overflow-y-auto">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-800 hover:bg-slate-100"
          >
            Home
          </Link>

          <div className="space-y-1">
            <span className="block px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              AI Insights
            </span>
            <Link to="/disease-detection" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-1.5 text-xs font-medium text-slate-700 hover:text-emerald-800">
              AI Crop Disease Scanner
            </Link>
            <Link to="/advisor" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-1.5 text-xs font-medium text-slate-700 hover:text-emerald-800">
              AI Agronomist Advisor
            </Link>
            <Link to="/price-prediction" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-1.5 text-xs font-medium text-slate-700 hover:text-emerald-800">
              Wholesale Price Prediction
            </Link>
          </div>

          <Link
            to="/equipment-rental"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-800 hover:bg-slate-100"
          >
            Equipment
          </Link>

          <div className="space-y-1">
            <span className="block px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Marketplace
            </span>
            <Link to="/crops" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-1.5 text-xs font-medium text-slate-700 hover:text-emerald-800">
              Crop &amp; Produce Market
            </Link>
            <Link to="/supplier-marketplace" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-1.5 text-xs font-medium text-slate-700 hover:text-emerald-800">
              Supplies &amp; Agricultural Inputs
            </Link>
          </div>

          <Link
            to="/community"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-800 hover:bg-slate-100"
          >
            Community
          </Link>

          <Link
            to="/gov-intelligence"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-800 hover:bg-slate-100"
          >
            Government
          </Link>

          {!isAuthenticated ? (
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-lg border border-slate-200 text-slate-800 font-semibold text-sm"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-lg bg-emerald-800 text-white font-semibold text-sm shadow-xs"
              >
                Get Started
              </Link>
            </div>
          ) : (
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-1">
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-xs font-semibold text-emerald-800 bg-emerald-50"
              >
                Go to Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50"
              >
                Log Out
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
