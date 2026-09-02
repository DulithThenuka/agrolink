import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Sprout, LogOut, User as UserIcon, LayoutDashboard,
  Menu, X, ChevronDown, Bell,
} from 'lucide-react';

export const Navbar = () => {
  const {
    isAuthenticated, user, logout,
    isFarmer, isBuyer, isBusinessBuyer,
    isLogistics, isExpert, isSupplier, isAdmin,
  } = useAuth();

  const [userMenuOpen, setUserMenuOpen]     = useState(false);
  const [notifDrawerOpen, setNotifDrawerOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled]         = useState(false);
  const location  = useLocation();
  const navigate  = useNavigate();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileMenuOpen(false); }, [location.pathname]);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  /* ─────────────────────────────────────────────
   *  Role helpers (all resolve ADMIN as universal)
   * ───────────────────────────────────────────── */
  const canTrade      = isAdmin || isFarmer || isBuyer || isBusinessBuyer;
  const canSupply     = isAdmin || isFarmer || isSupplier;
  const canOrder      = isAdmin || isBuyer  || isBusinessBuyer;
  const canContract   = isAdmin || isFarmer || isBuyer || isBusinessBuyer;
  const canNegotiate  = canContract;
  const canAI         = isAdmin || isFarmer || isExpert;          // Agronomist + Disease
  const canMarketAI   = isAuthenticated;                          // Price + Demand (any login)
  const canExperts    = isAdmin || isFarmer || isBuyer || isBusinessBuyer || isExpert;
  const canCommunity  = isAuthenticated;
  const canWaste      = isAdmin || isFarmer || isBuyer || isBusinessBuyer || isSupplier;
  const canGov        = isAuthenticated;
  const canLogistics  = isAdmin || isLogistics;

  /* ─────────────────────────────────────────────
   *  Dropdown link component (desktop)
   * ───────────────────────────────────────────── */
  const DLink = ({ to, children, highlight }) => (
    <Link
      to={to}
      className={`block px-3.5 py-2.5 rounded-xl text-slate-800 font-semibold hover:text-emerald-700 transition text-xs ${
        highlight
          ? 'bg-emerald-50 font-extrabold text-emerald-800 hover:bg-emerald-100'
          : 'hover:bg-emerald-50'
      }`}
    >
      {children}
    </Link>
  );

  /* ─────────────────────────────────────────────
   *  Mobile link component
   * ───────────────────────────────────────────── */
  const MLink = ({ to, children, highlight }) => (
    <Link
      to={to}
      onClick={() => setMobileMenuOpen(false)}
      className={`px-3.5 py-2.5 rounded-xl flex items-center gap-2 text-xs font-bold text-slate-700 ${
        highlight
          ? 'bg-emerald-50 text-emerald-800 font-extrabold'
          : 'hover:bg-slate-100'
      }`}
    >
      {children}
    </Link>
  );

  /* ─────────────────────────────────────────────
   *  Dropdown wrapper (desktop hover)
   * ───────────────────────────────────────────── */
  const Dropdown = ({ label, width = 'w-56', children }) => (
    <div className="relative group py-2">
      <button className="flex items-center gap-1 hover:text-emerald-600 font-bold transition py-1 text-xs">
        <span>{label}</span>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:rotate-180 transition-transform" />
      </button>
      <div
        className={`absolute left-0 mt-1 ${width} bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/90 p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 space-y-1`}
      >
        {children}
      </div>
    </div>
  );

  /* ─────────────────────────────────────────────
   *  Dynamic Link Sets
   * ───────────────────────────────────────────── */
  const marketplaceLinks = [
    { to: '/crops', label: '🌾 Produce Marketplace', show: true },
    { to: '/contracts', label: '📑 B2B Purchase Contracts', show: canContract },
    { to: '/supplier-marketplace', label: '🧰 Pre-Production Supplies', show: canSupply },
    { to: '/equipment-rental', label: '🚜 Machinery Rentals', show: canSupply },
    { to: '/orders', label: '🛍️ My Orders', show: canOrder },
    { to: '/negotiation', label: '💬 Trade Negotiations', show: canNegotiate },
    { to: '/logistics', label: '🚚 Smart Logistics', show: canLogistics },
  ].filter((item) => item.show);

  const aiLinks = [
    { to: '/advisor', label: '🤖 AI Agronomist Advisor', show: canAI },
    { to: '/disease-detection', label: '📷 AI Disease Scanner', show: canAI },
    { to: '/price-prediction', label: '📈 Price Predictor', show: canMarketAI },
    { to: '/demand-forecasting', label: '📊 Demand Forecasting', show: canMarketAI },
    { to: '/ai-assistant', label: '💬 Multilingual AI Bot', show: canMarketAI },
  ].filter((item) => item.show);

  const govLinks = [
    { to: '/gov-intelligence', label: '🏛️ Government Intelligence 🇱🇰', show: canGov, highlight: true },
    { to: '/waste-reduction', label: '♻️ Waste Reduction & Rescue', show: canWaste },
    { to: '/experts', label: '👨‍🔬 Expert Advisory Hub', show: canExperts },
    { to: '/community', label: '👥 Farmer Community', show: canCommunity },
  ].filter((item) => item.show);

  const topNavLinkClass = (path) => `
    transition duration-150 ease-in-out hover:text-emerald-600 font-bold py-1
    ${isActive(path) ? 'text-emerald-600' : ''}
  `;

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 px-6 ${
        isScrolled
          ? 'bg-white/85 backdrop-blur-xl shadow-lg shadow-slate-900/5 py-3 border-b border-slate-200/80'
          : 'bg-white/70 backdrop-blur-md py-4 border-b border-slate-200/40'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        {/* ── LOGO ── */}
        <Link
          to="/"
          className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2 font-display group shrink-0 mr-4"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-white flex items-center justify-center shadow-md shadow-emerald-500/25 group-hover:scale-105 group-hover:rotate-3 transition-transform duration-300">
            <Sprout className="w-5 h-5" />
          </div>
          <span>Agro<span className="text-emerald-600 font-extrabold">Link</span></span>
        </Link>

        {/* ── DESKTOP NAV ── */}
        <div className="hidden md:flex items-center space-x-3 lg:space-x-5 text-xs font-semibold text-slate-700">

          {/* Marketplace: direct link if 1 item (e.g. guests), dropdown if multiple */}
          {marketplaceLinks.length === 1 ? (
            <Link to={marketplaceLinks[0].to} className={topNavLinkClass(marketplaceLinks[0].to)}>
              <span>🌾 Marketplace</span>
            </Link>
          ) : marketplaceLinks.length > 1 ? (
            <Dropdown label="🌾 Marketplace" width="w-60">
              {marketplaceLinks.map((item) => (
                <DLink key={item.to} to={item.to} highlight={item.highlight}>
                  {item.label}
                </DLink>
              ))}
            </Dropdown>
          ) : null}

          {/* AI Intelligence: direct link if 1 item, dropdown if multiple, hidden if 0 */}
          {aiLinks.length === 1 ? (
            <Link to={aiLinks[0].to} className={topNavLinkClass(aiLinks[0].to)}>
              <span>{aiLinks[0].label}</span>
            </Link>
          ) : aiLinks.length > 1 ? (
            <Dropdown label="🤖 AI Intelligence" width="w-60">
              {aiLinks.map((item) => (
                <DLink key={item.to} to={item.to} highlight={item.highlight}>
                  {item.label}
                </DLink>
              ))}
            </Dropdown>
          ) : null}

          {/* Governance & Ecosystem: direct link if 1 item, dropdown if multiple, hidden if 0 */}
          {govLinks.length === 1 ? (
            <Link to={govLinks[0].to} className={topNavLinkClass(govLinks[0].to)}>
              <span>{govLinks[0].label}</span>
            </Link>
          ) : govLinks.length > 1 ? (
            <Dropdown label="🏛️ Governance & Ecosystem" width="w-64">
              {govLinks.map((item) => (
                <DLink key={item.to} to={item.to} highlight={item.highlight}>
                  {item.label}
                </DLink>
              ))}
            </Dropdown>
          ) : null}

          {/* Analytics — any authenticated user */}
          {isAuthenticated && (
            <Link
              to="/analytics"
              className={topNavLinkClass('/analytics')}
            >
              Analytics 📊
            </Link>
          )}

          {/* Dashboard — authenticated only */}
          {isAuthenticated && (
            <Link
              to="/dashboard"
              className={topNavLinkClass('/dashboard')}
            >
              Dashboard
            </Link>
          )}

          {/* ── AUTH ACTIONS ── */}
          {!isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link to="/login" className="px-4 py-2 text-slate-700 hover:text-emerald-600 transition font-semibold">
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold rounded-xl shadow-md shadow-emerald-500/25 hover:from-emerald-600 hover:to-emerald-700 transition"
              >
                Get Started
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-3">

              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={() => { setNotifDrawerOpen(!notifDrawerOpen); setUserMenuOpen(false); }}
                  className="p-2 rounded-xl bg-slate-100/80 hover:bg-emerald-50 text-slate-700 hover:text-emerald-600 transition relative"
                  title="System Notifications"
                >
                  <Bell className="w-4 h-4 text-slate-700" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-black flex items-center justify-center animate-pulse">
                    2
                  </span>
                </button>

                {notifDrawerOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/90 p-4 z-50 space-y-3 animate-fade-in">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 font-display">
                        Notifications (2 Unread)
                      </h4>
                      <button onClick={() => setNotifDrawerOpen(false)} className="text-[10px] text-emerald-600 font-bold hover:underline">
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

              {/* User Account Dropdown */}
              <div className="relative">
                <button
                  onClick={() => { setUserMenuOpen(!userMenuOpen); setNotifDrawerOpen(false); }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100/80 hover:bg-emerald-50 text-slate-800 font-semibold transition"
                >
                  <span className="max-w-[150px] truncate capitalize">{user?.name || (user?.email ? user.email.split('@')[0] : 'Account')}</span>
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                </button>
                {userMenuOpen && (
                  <div
                    onMouseLeave={() => setUserMenuOpen(false)}
                    className="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-100 p-2 z-50 space-y-1 animate-fade-in"
                  >
                    <div className="px-3 py-2 border-b border-slate-100/80 mb-1">
                      <p className="text-xs font-bold text-slate-900 truncate">{user?.name || 'User'}</p>
                      <p className="text-[11px] text-slate-400 font-medium truncate">{user?.email}</p>
                    </div>
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

        {/* ── MOBILE TOGGLE ── */}
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-slate-700 p-2">
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* ════════════════════════════════════════════
       *  MOBILE MENU DRAWER
       * ════════════════════════════════════════════ */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/98 backdrop-blur-xl border-t border-slate-200/80 p-5 space-y-5 mt-4 rounded-3xl shadow-2xl max-h-[80vh] overflow-y-auto animate-fade-in">

          {/* Dashboard shortcut */}
          {isAuthenticated && (
            <MLink to="/dashboard" highlight>
              <LayoutDashboard className="w-5 h-5 text-emerald-600" />
              <span>User Dashboard</span>
            </MLink>
          )}

          {/* ── MARKETPLACE & TRADE ── */}
          {marketplaceLinks.length > 0 && (
            <div className="space-y-1.5">
              <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-400 font-display px-2">
                🌾 Marketplace &amp; Trade
              </h4>
              <div className="grid grid-cols-1 gap-1">
                {marketplaceLinks.map((item) => (
                  <MLink key={item.to} to={item.to} highlight={item.highlight}>
                    {item.label}
                  </MLink>
                ))}
              </div>
            </div>
          )}

          {/* ── AI AGRONOMY SUITE ── */}
          {aiLinks.length > 0 && (
            <div className="space-y-1.5">
              <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-400 font-display px-2">
                🤖 AI Agronomy Suite
              </h4>
              <div className="grid grid-cols-1 gap-1">
                {aiLinks.map((item) => (
                  <MLink key={item.to} to={item.to} highlight={item.highlight}>
                    {item.label}
                  </MLink>
                ))}
              </div>
            </div>
          )}

          {/* ── GOVERNANCE & COMMUNITY ── */}
          {govLinks.length > 0 && (
            <div className="space-y-1.5">
              <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-400 font-display px-2">
                🏛️ Governance &amp; Community
              </h4>
              <div className="grid grid-cols-1 gap-1">
                {govLinks.map((item) => (
                  <MLink key={item.to} to={item.to} highlight={item.highlight}>
                    {item.label}
                  </MLink>
                ))}
              </div>
            </div>
          )}

          {/* ── ANALYTICS (any logged-in user) ── */}
          {isAuthenticated && (
            <div className="space-y-1.5">
              <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-400 font-display px-2">
                📊 Reports
              </h4>
              <MLink to="/analytics">📊 Analytics &amp; Intelligence</MLink>
            </div>
          )}

          {/* ── AUTH ACTIONS ── */}
          {!isAuthenticated ? (
            <div className="pt-3 space-y-2 border-t border-slate-100">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center px-4 py-3 rounded-2xl border border-slate-200 text-slate-700 font-bold text-sm"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center px-4 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-extrabold text-sm shadow-md"
              >
                Get Started
              </Link>
            </div>
          ) : (
            <div className="pt-3 space-y-2 border-t border-slate-100">
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-slate-700 hover:bg-slate-50 font-bold text-xs"
              >
                <UserIcon className="w-4 h-4 text-emerald-600" /> Profile Settings
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-xl font-bold text-xs"
              >
                <LogOut className="w-4 h-4" /> Logout Account
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
