import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Sprout,
  AlertCircle,
  Loader2,
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  ShieldCheck,
  ShieldAlert,
  CloudSun
} from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // If ProtectedRoute or 401 interceptor attached params, honor them
  const queryParams = new URLSearchParams(location.search);
  const redirectTo = queryParams.get('redirect') || null;
  const isExpired = queryParams.get('expired') === 'true';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setError('Password is required.');
      return;
    }

    const res = await login(email.trim(), password);
    if (res.success) {
      if (redirectTo) {
        navigate(redirectTo, { replace: true });
      } else if (
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
      setError(res.message || 'Incorrect email or password.');
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
            <span className="hidden sm:inline">Don't have an account?</span>
            <Link
              to="/register"
              className="text-emerald-800 font-bold hover:text-emerald-900 hover:underline"
            >
              Create account
            </Link>
          </div>
        </div>
      </header>

      {/* ── MAIN AUTHENTICATION CONTAINER ── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex items-center">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full">
          
          {/* LEFT COLUMN: AUTHENTICATION FORM (6 COLS) */}
          <div className="lg:col-span-6 max-w-lg w-full mx-auto lg:mx-0 space-y-6">
            
            <div className="space-y-2 text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                <span>SECURE PLATFORM ACCESS</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900">
                Welcome back to AgroLink.
              </h1>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Sign in to manage your farm, access agricultural insights, and connect with services.
              </p>
            </div>

            {/* Session Expired Banner */}
            {isExpired && !error && (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-amber-900 text-xs shadow-2xs">
                <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div className="space-y-0.5 text-left">
                  <span className="font-bold block text-amber-950">Session Expired</span>
                  <p className="text-amber-800">
                    Your login session has expired for security. Please sign in again to continue.
                  </p>
                </div>
              </div>
            )}

            {/* Error Message Alert */}
            {error && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2.5 text-red-700 text-xs font-semibold">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              
              {/* Field: Email */}
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
                    placeholder="e.g. farmer@agrolink.lk"
                    required
                    autoFocus
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 text-sm font-medium bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 transition"
                  />
                </div>
              </div>

              {/* Field: Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Password
                  </label>
                  <span className="text-xs text-slate-400 hover:text-emerald-800 cursor-pointer transition-colors">
                    Forgot password?
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your account password"
                    required
                    className="w-full pl-10 pr-11 py-3 rounded-xl border border-slate-300 text-sm font-medium bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 transition"
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

              {/* Remember Me */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-600 select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-emerald-800 focus:ring-emerald-700 cursor-pointer"
                  />
                  <span>Remember my login on this device</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-60 cursor-pointer mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

            </form>

            {/* Trust and Security Footer Note */}
            <div className="pt-4 border-t border-slate-200/80 space-y-2 text-left">
              <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Protected by encrypted session verification.</span>
              </p>
              <p className="text-xs text-slate-400">
                One platform for smarter agricultural decisions.
              </p>
            </div>

          </div>

          {/* RIGHT COLUMN: REALISTIC AGRICULTURAL VISUAL (6 COLS) */}
          <div className="lg:col-span-6 relative hidden md:block">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-slate-100">
              <img
                src="https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=1000&auto=format&fit=crop&q=80"
                alt="Farmer checking crop health data on a smartphone in a field"
                className="w-full h-[480px] lg:h-[520px] object-cover object-center"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=1000&auto=format&fit=crop&q=80';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />

              {/* SINGLE SUBTLE OVERLAY PANEL */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm rounded-xl border border-slate-200/90 p-4 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    AgroLink AI Insight
                  </span>
                  <div className="flex items-center gap-3 mt-1 text-xs font-semibold text-slate-800">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                      Crop Risk: <strong className="text-emerald-800 font-bold">LOW</strong>
                    </span>
                    <span className="text-slate-300">&bull;</span>
                    <span className="flex items-center gap-1 text-slate-600">
                      <CloudSun className="w-3.5 h-3.5 text-emerald-700" />
                      Weather: Favorable
                    </span>
                  </div>
                </div>

                <div className="hidden sm:block text-right">
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full">
                    Verified Network
                  </span>
                </div>
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

export default Login;
