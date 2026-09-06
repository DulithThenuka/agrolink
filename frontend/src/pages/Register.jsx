import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Sprout,
  AlertCircle,
  Loader2,
  User,
  Mail,
  Lock,
  MapPin,
  CheckCircle2,
  ArrowRight,
  Eye,
  EyeOff,
  Wheat,
  Tractor,
  Store,
  ShoppingBag,
  ShieldCheck
} from 'lucide-react';

export const Register = () => {
  const [role, setRole] = useState('FARMER');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const ROLE_OPTIONS = [
    {
      id: 'FARMER',
      title: 'Farmer',
      desc: 'Manage crops, receive AI insights, and find agricultural services.',
      icon: Wheat
    },
    {
      id: 'LOGISTICS_PROVIDER',
      title: 'Equipment & Driver',
      desc: 'Provide tractors, machinery, transport, and agricultural services.',
      icon: Tractor
    },
    {
      id: 'SUPPLIER',
      title: 'Supplier',
      desc: 'Sell agricultural products, tools, and inputs to farmers.',
      icon: Store
    },
    {
      id: 'BUYER',
      title: 'Buyer',
      desc: 'Find and purchase fresh crops and harvest from farmers.',
      icon: ShoppingBag
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }

    if (!email.trim()) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!location.trim()) {
      setError('Please provide your location or district.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    const res = await register(name.trim(), email.trim(), password, location.trim(), role);
    if (res.success) {
      if (res.autoLoggedIn) {
        if (
          res.role === 'LOGISTICS' ||
          res.role === 'ROLE_LOGISTICS' ||
          res.role === 'LOGISTICS_PROVIDER' ||
          res.role === 'ROLE_LOGISTICS_PROVIDER'
        ) {
          navigate('/logistics', { replace: true });
        } else {
          navigate('/dashboard', { replace: true });
        }
      } else {
        navigate('/login', { replace: true });
      }
    } else {
      setError(res.message || 'Unable to create your account. Please try again.');
    }
  };

  return (
    <div className="bg-[#FBFBFA] min-h-screen text-slate-900 font-sans flex flex-col justify-between">
      
      {/* ── MINIMAL AUTH HEADER ── */}
      <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur-sm py-4 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 font-sans group">
            <div className="w-8 h-8 rounded-lg bg-emerald-800 text-white flex items-center justify-center shadow-xs">
              <Sprout className="w-4 h-4" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              Agro<span className="text-emerald-700">Link</span>
            </span>
          </Link>

          <div className="text-xs sm:text-sm text-slate-600 font-medium flex items-center gap-1.5">
            <span className="hidden sm:inline">Already have an account?</span>
            <Link
              to="/login"
              className="text-emerald-800 font-bold hover:text-emerald-900 hover:underline"
            >
              Sign in
            </Link>
          </div>
        </div>
      </header>

      {/* ── MAIN REGISTRATION CONTAINER ── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex items-center">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start w-full">
          
          {/* LEFT COLUMN: ONBOARDING ROLE SELECTION & REGISTRATION FORM (7 COLS) */}
          <div className="lg:col-span-7 max-w-2xl w-full mx-auto lg:mx-0 space-y-6">
            
            <div className="space-y-1.5 text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                <span>ACCOUNT CREATION</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                How will you use AgroLink?
              </h1>
              <p className="text-sm text-slate-600">
                Choose the option that best describes you to personalize your tools and services.
              </p>
            </div>

            {/* Error Message Alert */}
            {error && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2.5 text-red-700 text-xs font-semibold text-left">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{error}</span>
              </div>
            )}

            {/* 1. ROLE SELECTION GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
              {ROLE_OPTIONS.map((item) => {
                const Icon = item.icon;
                const isSelected = role === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setRole(item.id)}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-3 relative ${
                      isSelected
                        ? 'border-emerald-700 bg-emerald-50/50 shadow-xs ring-1 ring-emerald-700/30'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                        isSelected
                          ? 'bg-emerald-800 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="space-y-0.5 flex-1 pr-4">
                      <h3
                        className={`text-sm font-bold leading-tight ${
                          isSelected ? 'text-emerald-950' : 'text-slate-900'
                        }`}
                      >
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-500 leading-snug">
                        {item.desc}
                      </p>
                    </div>

                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 absolute top-3.5 right-3.5" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* 2. REGISTRATION INPUTS */}
            <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4 text-left shadow-2xs">
              
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900">
                  Your Account Information
                </h3>
                <p className="text-xs text-slate-500">
                  Fill in your basic details to complete registration.
                </p>
              </div>

              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Sunil Gunawardena"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 transition"
                  />
                </div>
              </div>

              {/* Grid: Email & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Email Address */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. user@agrolink.lk"
                      required
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 transition"
                    />
                  </div>
                </div>

                {/* Location / District */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Location / District
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Welimada, Badulla"
                      required
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 transition"
                    />
                  </div>
                </div>
              </div>

              {/* Grid: Password & Confirm Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Password */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min. 6 characters"
                      required
                      className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-slate-300 text-sm font-medium bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      required
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 transition"
                    />
                  </div>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-2 space-y-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-60 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Creating account...</span>
                    </>
                  ) : (
                    <>
                      <span>Create Account</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <p className="text-[11px] text-center text-slate-500">
                  By creating an account, you agree to our Terms of Service and Privacy Policy.
                </p>
              </div>

            </form>

            {/* Bottom Security Note */}
            <div className="pt-2 text-left">
              <p className="text-xs text-slate-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Your personal information is protected and used only for platform services.</span>
              </p>
            </div>

          </div>

          {/* RIGHT COLUMN: REALISTIC AGRICULTURAL VISUAL (5 COLS) */}
          <div className="lg:col-span-5 relative hidden lg:block sticky top-24">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-slate-100">
              <img
                src="https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=1000&auto=format&fit=crop&q=80"
                alt="Agricultural fields and farming technology"
                className="w-full h-[540px] object-cover object-center"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=1000&auto=format&fit=crop&q=80';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-slate-950/10 to-transparent pointer-events-none" />

              {/* OVERLAY PANEL */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm rounded-xl border border-slate-200/90 p-4 shadow-sm space-y-2 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Trusted Agri-Trade
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold">Sri Lanka</span>
                </div>

                <h3 className="text-sm font-bold text-slate-900">
                  Built for Farmers. Connected for Agriculture.
                </h3>

                <p className="text-xs text-slate-600 leading-snug">
                  Join verified growers, equipment operators, input suppliers, and buyers trading directly with escrow security.
                </p>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* ── SIMPLE FOOTER NOTE ── */}
      <footer className="border-t border-slate-200/60 py-4 px-4 text-center text-xs text-slate-500">
        &copy; {new Date().getFullYear()} AgroLink. Empowering agricultural communities.
      </footer>

    </div>
  );
};

export default Register;
