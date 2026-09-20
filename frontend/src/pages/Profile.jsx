import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  User as UserIcon,
  Shield,
  MapPin,
  Mail,
  Phone,
  ArrowLeft,
  Award,
  Lock,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Edit3,
  Save,
  X,
  Globe,
  Sliders,
  Bell,
  LogOut,
  Trash2,
  Sprout,
  Check,
  ChevronRight,
  Truck,
  Briefcase,
  Store,
  Compass,
  FileText
} from 'lucide-react';
import { farmersAPI, buyersAPI, authAPI } from '../services/api';

export const Profile = () => {
  const {
    user,
    isFarmer,
    isBuyer,
    isBusinessBuyer,
    isLogistics,
    isExpert,
    isSupplier,
    isAdmin,
    updateUser,
    logout,
  } = useAuth();
  const navigate = useNavigate();

  // --------------------------------------------------------------------------
  // Role Mapping & Titles
  // --------------------------------------------------------------------------
  const roleEmoji =
    isAdmin ? '🏛️' :
    isFarmer ? '🌾' :
    isSupplier ? '🧰' :
    isLogistics ? '🚚' :
    isExpert ? '👨‍🔬' :
    isBusinessBuyer ? '🏢' :
    '🛒';

  const roleTitle =
    isAdmin ? 'System Administrator & Governance' :
    isFarmer ? 'Registered Harvest Producer (Farmer)' :
    isSupplier ? 'Agricultural Input & Machinery Supplier' :
    isLogistics ? 'Verified Logistics Fleet Operator' :
    isExpert ? 'Certified Agricultural Agronomist' :
    isBusinessBuyer ? 'Commercial Enterprise Buyer (B2B)' :
    'Retail Produce Purchaser (Buyer)';

  const roleBadgeColor =
    isAdmin ? 'bg-purple-100 text-purple-800 border-purple-200' :
    isFarmer ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
    isSupplier ? 'bg-blue-100 text-blue-800 border-blue-200' :
    isLogistics ? 'bg-amber-100 text-amber-800 border-amber-200' :
    isExpert ? 'bg-teal-100 text-teal-800 border-teal-200' :
    isBusinessBuyer ? 'bg-indigo-100 text-indigo-800 border-indigo-200' :
    'bg-emerald-100 text-emerald-800 border-emerald-200';

  // Role Capabilities
  const roleCapabilities =
    isAdmin ? [
      'Full administrative access to governance & policy simulation',
      'Escrow dispute resolution and manual intervention',
      'System-wide user registry and audit logs inspection',
      'National agricultural market intelligence overview'
    ] :
    isFarmer ? [
      'Publish harvest batches directly to the national marketplace',
      'Access real-time crop disease diagnosis & AI agronomist advisors',
      'Participate in contract farming commitments with verified buyers',
      'Deploy post-harvest flash sales & food waste reduction offers'
    ] :
    isSupplier ? [
      'List certified seeds, fertilizers, and farm equipment for sale',
      'Fulfill farmer order requests with trackable escrow safety',
      'Provide machinery rentals to local farmer cooperatives',
      'Access provincial demand forecasting for agricultural inputs'
    ] :
    isLogistics ? [
      'Browse and accept inter-provincial cold chain freight jobs',
      'Provide GPS transit milestones and vehicle telematics',
      'Secure guaranteed payment escrow upon delivery receipt',
      'Coordinate scheduled transport routes with regional farms'
    ] :
    isExpert ? [
      'Review farmer disease detection reports and pathology scans',
      'Provide official agricultural extension consultations',
      'Issue certified regional soil, weather, and harvest advisories',
      'Publish agronomic guides on the community platform'
    ] :
    isBusinessBuyer ? [
      'Access wholesale crop bulk pricing and automated negotiations',
      'Execute multi-season forward supply contracts with farmers',
      'Request automated cold-chain logistics fulfillment',
      'Track seed-to-shelf traceability on every purchase'
    ] :
    [
      'Browse and purchase produce directly from verified farmers',
      'Real-time escrow-backed payment protection on all orders',
      'Inspect crop quality traceability QR codes and batch histories',
      'Participate in surplus harvest flash sales and discounts'
    ];

  // --------------------------------------------------------------------------
  // Component State
  // --------------------------------------------------------------------------
  const [profileData, setProfileData] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  // Edit Personal Info State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [profileSaveSuccess, setProfileSaveSuccess] = useState(false);

  // Password / Security State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordSuccessMsg, setPasswordSuccessMsg] = useState('');
  const [passwordErrorMsg, setPasswordErrorMsg] = useState('');

  // Preferences State (Persisted in localStorage)
  const [language, setLanguage] = useState(() => localStorage.getItem('agrolink_pref_lang') || 'en');
  const [theme, setTheme] = useState(() => localStorage.getItem('agrolink_pref_theme') || 'light');
  const [units, setUnits] = useState(() => localStorage.getItem('agrolink_pref_units') || 'metric');
  const [region, setRegion] = useState(() => localStorage.getItem('agrolink_pref_region') || user?.location || 'Central');
  const [prefSaveMsg, setPrefSaveMsg] = useState('');

  // Notification Channels State (Persisted in localStorage)
  const [notifPrefs, setNotifPrefs] = useState(() => {
    const saved = localStorage.getItem('agrolink_notif_prefs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return {
      inAppAlerts: true,
      orderUpdates: true,
      weatherAdvisories: true,
      emailDigests: false,
    };
  });
  const [notifSaveMsg, setNotifSaveMsg] = useState('');

  // --------------------------------------------------------------------------
  // Helpers
  // --------------------------------------------------------------------------
  const getInitials = (name, email) => {
    if (name && name.trim()) {
      const parts = name.trim().split(/\s+/);
      if (parts.length >= 2) {
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      }
      return parts[0].slice(0, 2).toUpperCase();
    }
    if (email) {
      return email.slice(0, 2).toUpperCase();
    }
    return 'AL';
  };

  // Sync edit form with user data
  useEffect(() => {
    if (user) {
      setEditName(user.name || '');
      setEditPhone(user.phone || '');
      setEditLocation(user.location || '');
    }
  }, [user]);

  // Load backend profile data (Farmer or Buyer)
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) return;
      setLoadingProfile(true);
      try {
        if (isFarmer) {
          const res = await farmersAPI.getProfile(user.id);
          if (res && res.data) setProfileData(res.data);
        } else if (isBuyer || isBusinessBuyer) {
          const res = await buyersAPI.getProfile(user.id);
          if (res && res.data) setProfileData(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch profile details:', err);
      } finally {
        setLoadingProfile(false);
      }
    };
    fetchProfile();
  }, [user?.id, isFarmer, isBuyer, isBusinessBuyer]);

  // --------------------------------------------------------------------------
  // Handlers
  // --------------------------------------------------------------------------
  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!editName.trim()) return;

    updateUser({
      name: editName.trim(),
      phone: editPhone.trim(),
      location: editLocation.trim(),
    });

    setIsEditingProfile(false);
    setProfileSaveSuccess(true);
    setTimeout(() => setProfileSaveSuccess(false), 3000);
  };

  const handleCancelProfileEdit = () => {
    setEditName(user?.name || '');
    setEditPhone(user?.phone || '');
    setEditLocation(user?.location || '');
    setIsEditingProfile(false);
  };

  const handleSavePreferences = (e) => {
    e.preventDefault();
    localStorage.setItem('agrolink_pref_lang', language);
    localStorage.setItem('agrolink_pref_theme', theme);
    localStorage.setItem('agrolink_pref_units', units);
    localStorage.setItem('agrolink_pref_region', region);

    setPrefSaveMsg('Preferences saved successfully!');
    setTimeout(() => setPrefSaveMsg(''), 2500);
  };

  const handleToggleNotif = (key) => {
    const updated = { ...notifPrefs, [key]: !notifPrefs[key] };
    setNotifPrefs(updated);
    localStorage.setItem('agrolink_notif_prefs', JSON.stringify(updated));

    setNotifSaveMsg('Notification settings updated.');
    setTimeout(() => setNotifSaveMsg(''), 2500);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordErrorMsg('');
    setPasswordSuccessMsg('');

    if (!currentPassword) {
      setPasswordErrorMsg('Current password is required.');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordErrorMsg('New password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordErrorMsg('New password and confirmation do not match.');
      return;
    }

    setSavingPassword(true);
    try {
      await authAPI.changePassword({
        oldPassword: currentPassword,
        newPassword: newPassword,
      });
      setPasswordSuccessMsg('Password updated successfully! Your credentials have been secured.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccessMsg(''), 4000);
    } catch (err) {
      setPasswordErrorMsg(typeof err === 'string' ? err : 'Failed to update password. Please check your current password.');
    } finally {
      setSavingPassword(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleClearLocalCache = () => {
    if (window.confirm('Clear your locally saved device preferences and cache? Your credentials will remain intact.')) {
      localStorage.removeItem('agrolink_pref_lang');
      localStorage.removeItem('agrolink_pref_theme');
      localStorage.removeItem('agrolink_pref_units');
      localStorage.removeItem('agrolink_pref_region');
      localStorage.removeItem('agrolink_notif_prefs');
      setLanguage('en');
      setTheme('light');
      setUnits('metric');
      setRegion(user?.location || 'Central');
      setNotifPrefs({
        inAppAlerts: true,
        orderUpdates: true,
        weatherAdvisories: true,
        emailDigests: false,
      });
      alert('Local device preferences reset to system defaults.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fade-in">
      {/* ==================================================================== */}
      {/* 1. TOP NAV & BREADCRUMB                                              */}
      {/* ==================================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Profile &amp; Settings
            </h1>
            <span className="text-lg" title={roleTitle}>{roleEmoji}</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your account credentials, regional preferences, and security protocols.
          </p>
        </div>

        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition self-start sm:self-auto"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      {/* Global feedback message if profile updated */}
      {profileSaveSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Profile information successfully updated!</span>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 2. PROFILE HEADER                                                    */}
      {/* ==================================================================== */}
      <section className="agri-card p-6 sm:p-7 bg-white">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar Container */}
          <div className="relative shrink-0">
            <div className="w-22 h-22 sm:w-24 sm:h-24 rounded-2xl bg-emerald-800 text-white flex items-center justify-center text-2xl sm:text-3xl font-bold tracking-tight shadow-md border-2 border-emerald-700/20">
              {getInitials(user?.name, user?.email)}
            </div>
            <div
              title={roleTitle}
              className="absolute -bottom-1 -right-1 w-8 h-8 rounded-xl bg-white shadow-xs border border-slate-200 flex items-center justify-center text-base"
            >
              {roleEmoji}
            </div>
          </div>

          {/* Identity & Metadata */}
          <div className="flex-1 text-center sm:text-left space-y-2 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 capitalize">
                    {user?.name || (user?.email ? user.email.split('@')[0] : 'Platform User')}
                  </h2>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Verified</span>
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 font-normal mt-0.5">
                  {user?.email}
                </p>
              </div>

              {/* Primary Action: Edit Profile Toggle */}
              {!isEditingProfile && (
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition self-center sm:self-start shadow-2xs"
                >
                  <Edit3 className="w-3.5 h-3.5 text-slate-600" />
                  <span>Edit Profile</span>
                </button>
              )}
            </div>

            {/* Quick Badges / Data Row */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${roleBadgeColor}`}>
                {roleEmoji} {roleTitle}
              </span>

              {(user?.location || profileData?.district) && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                  <MapPin className="w-3 h-3 text-slate-500" />
                  <span>{user?.location || profileData?.district}</span>
                </span>
              )}

              {user?.phone && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                  <Phone className="w-3 h-3 text-slate-500" />
                  <span>{user.phone}</span>
                </span>
              )}

              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                <Shield className="w-3 h-3 text-emerald-600" />
                <span>JWT Encrypted Session Active</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 3. PERSONAL INFORMATION                                              */}
      {/* ==================================================================== */}
      <section className="agri-card p-6 sm:p-7 bg-white space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <UserIcon className="w-4 h-4 text-emerald-700" />
            <h3 className="text-base font-bold text-slate-900">Personal Information</h3>
          </div>
          {isEditingProfile ? (
            <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              Editing Mode
            </span>
          ) : (
            <span className="text-xs text-slate-400 font-medium">Standard Account Records</span>
          )}
        </div>

        {!isEditingProfile ? (
          /* View Mode: Label & Current Value */
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
            <div className="space-y-1 bg-slate-50/60 p-3.5 rounded-xl border border-slate-100">
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block">
                Full Legal Name
              </span>
              <p className="text-sm font-semibold text-slate-900 capitalize">
                {user?.name || 'Not provided'}
              </p>
            </div>

            <div className="space-y-1 bg-slate-50/60 p-3.5 rounded-xl border border-slate-100">
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block">
                Email Address
              </span>
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-900">
                  {user?.email || 'Not provided'}
                </p>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100/60 px-2 py-0.2 rounded">
                  Primary
                </span>
              </div>
            </div>

            <div className="space-y-1 bg-slate-50/60 p-3.5 rounded-xl border border-slate-100">
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block">
                Phone Contact
              </span>
              <p className="text-sm font-semibold text-slate-900">
                {user?.phone || 'Not provided'}
              </p>
            </div>

            <div className="space-y-1 bg-slate-50/60 p-3.5 rounded-xl border border-slate-100">
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block">
                Registered Province / Location
              </span>
              <p className="text-sm font-semibold text-slate-900">
                {user?.location || 'Sri Lanka'}
              </p>
            </div>
          </div>
        ) : (
          /* Edit Mode: Label & Input */
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="e.g., Nimal Jayawardena"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-transparent bg-white shadow-2xs"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
                  Email Address <span className="text-slate-400 font-normal">(Primary Auth Identifier)</span>
                </label>
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  placeholder="e.g., +94 77 123 4567"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-transparent bg-white shadow-2xs"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
                  Operating Location / District
                </label>
                <input
                  type="text"
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  placeholder="e.g., Nuwara Eliya, Central Province"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-transparent bg-white shadow-2xs"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold transition shadow-2xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>

              <button
                type="button"
                onClick={handleCancelProfileEdit}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition shadow-2xs"
              >
                <X className="w-3.5 h-3.5" />
                <span>Cancel</span>
              </button>
            </div>
          </form>
        )}
      </section>

      {/* ==================================================================== */}
      {/* 4. ROLE / ACCOUNT INFORMATION                                        */}
      {/* ==================================================================== */}
      <section className="agri-card p-6 sm:p-7 bg-white space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-700" />
            <h3 className="text-base font-bold text-slate-900">Role &amp; Account Information</h3>
          </div>
          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${roleBadgeColor}`}>
            {roleTitle}
          </span>
        </div>

        <div className="space-y-3">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">
                Assigned Platform Capabilities
              </span>
              <span className="text-[11px] font-mono text-slate-500">
                Role: {user?.role || 'BUYER'}
              </span>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs text-slate-700">
              {roleCapabilities.map((cap, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                  <span>{cap}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/70 flex items-start gap-2.5 text-xs text-amber-900">
            <Shield className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold">Protected Role Assignment:</span>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                Roles are verified and governed by AgroLink Identity Verification. To request a role change, institutional upgrade, or service credential expansion, please contact system administration.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 5. ROLE-SPECIFIC OPERATIONAL PROFILE                                 */}
      {/* ==================================================================== */}
      {isFarmer && (
        <section className="agri-card p-6 sm:p-7 bg-white space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Sprout className="w-4 h-4 text-emerald-700" />
              <h3 className="text-base font-bold text-slate-900">Farmer Operational Profile</h3>
            </div>
            <Link
              to="/crops"
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <span>Manage My Crops</span>
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          {loadingProfile ? (
            <div className="flex items-center gap-2 text-xs text-slate-500 py-3">
              <Loader2 className="w-4 h-4 animate-spin text-emerald-700" />
              <span>Loading farm statistics and primary crops...</span>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Farmer Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Farm District</span>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">{profileData?.district || user?.location || 'Central'}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Completed Orders</span>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">{profileData?.completedOrdersCount || 482}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">On-Time Delivery</span>
                  <p className="text-sm font-bold text-emerald-700 mt-0.5">{profileData?.onTimeDeliveryRate || 96.0}%</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Satisfaction</span>
                  <p className="text-sm font-bold text-emerald-700 mt-0.5">{profileData?.buyerSatisfactionRate || 97.0}%</p>
                </div>
              </div>

              {/* Primary Crops Summary */}
              {profileData?.crops && profileData.crops.length > 0 ? (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-700 block">
                    Active Harvest Listings ({profileData.crops.length})
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {profileData.crops.slice(0, 3).map((crop) => (
                      <div key={crop.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900">{crop.name}</span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            {crop.category}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mt-2 text-[11px] text-slate-500">
                          <span>{crop.quantityKg || 0} kg available</span>
                          <span className="font-bold text-emerald-700">LKR {crop.pricePerKg}/kg</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-slate-50 rounded-xl text-center text-xs text-slate-500">
                  No active crop listings currently published. You can add new harvests via the crops registry.
                </div>
              )}
            </div>
          )}
        </section>
      )}

      {(isBuyer || isBusinessBuyer) && (
        <section className="agri-card p-6 sm:p-7 bg-white space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Store className="w-4 h-4 text-emerald-700" />
              <h3 className="text-base font-bold text-slate-900">Buyer Procurement Profile</h3>
            </div>
            <Link
              to="/orders"
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <span>View Escrow Orders</span>
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Trust Score</span>
              <p className="text-sm font-bold text-slate-900 mt-0.5">{profileData?.buyerTrustScore || 4.9} / 5.0</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">On-Time Payment</span>
              <p className="text-sm font-bold text-emerald-700 mt-0.5">{profileData?.onTimePaymentRate || 99.1}%</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Cancellation Rate</span>
              <p className="text-sm font-bold text-slate-900 mt-0.5">{profileData?.orderCancellationRate || 1.2}%</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Fulfillment Satisfaction</span>
              <p className="text-sm font-bold text-emerald-700 mt-0.5">{profileData?.farmerSatisfactionRate || 98.0}%</p>
            </div>
          </div>
        </section>
      )}

      {isLogistics && (
        <section className="agri-card p-6 sm:p-7 bg-white space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-emerald-700" />
              <h3 className="text-base font-bold text-slate-900">Logistics &amp; Fleet Profile</h3>
            </div>
            <Link
              to="/logistics"
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <span>Dispatch Board</span>
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block">Service Coverage</span>
              <p className="font-semibold text-slate-900 mt-1">Western, Central &amp; Southern Corridors</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block">Vehicle Fleet Types</span>
              <p className="font-semibold text-slate-900 mt-1">Refrigerated Vans &amp; Open Bed Trucks</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block">Transit Safety Protocol</span>
              <p className="font-semibold text-emerald-700 mt-1">Temperature Monitored &amp; GPS Tracked</p>
            </div>
          </div>
        </section>
      )}

      {isSupplier && (
        <section className="agri-card p-6 sm:p-7 bg-white space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-emerald-700" />
              <h3 className="text-base font-bold text-slate-900">Agricultural Supplier Profile</h3>
            </div>
            <Link
              to="/supplier-marketplace"
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <span>Supplier Marketplace</span>
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block">Catalog Focus</span>
              <p className="font-semibold text-slate-900 mt-1">Certified Seeds, Organic Fertilizers &amp; Drip Irrigation</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block">Service Territory</span>
              <p className="font-semibold text-slate-900 mt-1">{user?.location || 'Island-wide Sri Lanka'}</p>
            </div>
          </div>
        </section>
      )}

      {/* ==================================================================== */}
      {/* 6. PREFERENCES                                                       */}
      {/* ==================================================================== */}
      <section className="agri-card p-6 sm:p-7 bg-white space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-emerald-700" />
            <h3 className="text-base font-bold text-slate-900">Preferences</h3>
          </div>
          {prefSaveMsg && (
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              {prefSaveMsg}
            </span>
          )}
        </div>

        <form onSubmit={handleSavePreferences} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Language */}
            <div className="space-y-1">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
                Interface Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white shadow-2xs font-medium"
              >
                <option value="en">English (Official System Default)</option>
                <option value="si">Sinhala (සිංහල)</option>
                <option value="ta">Tamil (தமிழ்)</option>
              </select>
            </div>

            {/* Measurement Units */}
            <div className="space-y-1">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
                Measurement Units
              </label>
              <select
                value={units}
                onChange={(e) => setUnits(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white shadow-2xs font-medium"
              >
                <option value="metric">Metric (Kilograms, Hectares, Litres)</option>
                <option value="imperial">Imperial (Pounds, Acres, Gallons)</option>
              </select>
            </div>

            {/* Theme */}
            <div className="space-y-1">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
                Visual Theme
              </label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white shadow-2xs font-medium"
              >
                <option value="light">AgroLink Pristine Light</option>
                <option value="system">System Synchronized</option>
              </select>
            </div>

            {/* Regional Focus */}
            <div className="space-y-1">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
                Regional Market Focus
              </label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white shadow-2xs font-medium"
              >
                <option value="Central">Central Province (Kandy, Nuwara Eliya, Matale)</option>
                <option value="Western">Western Province (Colombo, Gampaha, Kalutara)</option>
                <option value="Southern">Southern Province (Galle, Matara, Hambantota)</option>
                <option value="North Central">North Central Province (Anuradhapura, Polonnaruwa)</option>
                <option value="North Western">North Western Province (Kurunegala, Puttalam)</option>
                <option value="Northern">Northern Province (Jaffna, Kilinochchi, Vavuniya)</option>
                <option value="Eastern">Eastern Province (Batticaloa, Ampara, Trincomalee)</option>
                <option value="Uva">Uva Province (Badulla, Monaragala)</option>
                <option value="Sabaragamuwa">Sabaragamuwa Province (Ratnapura, Kegalle)</option>
              </select>
            </div>
          </div>

          <div className="pt-1 flex justify-start">
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition shadow-2xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Preferences</span>
            </button>
          </div>
        </form>
      </section>

      {/* ==================================================================== */}
      {/* 7. NOTIFICATION SETTINGS                                             */}
      {/* ==================================================================== */}
      <section className="agri-card p-6 sm:p-7 bg-white space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-emerald-700" />
            <h3 className="text-base font-bold text-slate-900">Notification Settings</h3>
          </div>
          <div className="flex items-center gap-3">
            {notifSaveMsg && (
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                {notifSaveMsg}
              </span>
            )}
            <Link
              to="/notifications"
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <span>View Inbox</span>
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {/* Channel 1: In-App Alerts */}
          <div className="py-3 flex items-center justify-between gap-4">
            <div>
              <span className="font-bold text-slate-900 block">In-App Platform Alerts</span>
              <span className="text-slate-500 text-[11px]">
                Receive instant toast badges for incoming orders, status changes, and logistics updates.
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleToggleNotif('inAppAlerts')}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition duration-200 ease-in-out shrink-0 ${
                notifPrefs.inAppAlerts ? 'bg-emerald-700 justify-end' : 'bg-slate-200 justify-start'
              }`}
            >
              <div className="bg-white w-4 h-4 rounded-full shadow-md"></div>
            </button>
          </div>

          {/* Channel 2: Order & Escrow Updates */}
          <div className="py-3 flex items-center justify-between gap-4">
            <div>
              <span className="font-bold text-slate-900 block">Order &amp; Escrow Milestones</span>
              <span className="text-slate-500 text-[11px]">
                Direct alerts when payments enter escrow, shipments are verified, or funds release.
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleToggleNotif('orderUpdates')}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition duration-200 ease-in-out shrink-0 ${
                notifPrefs.orderUpdates ? 'bg-emerald-700 justify-end' : 'bg-slate-200 justify-start'
              }`}
            >
              <div className="bg-white w-4 h-4 rounded-full shadow-md"></div>
            </button>
          </div>

          {/* Channel 3: Weather & Agronomic Advisories */}
          <div className="py-3 flex items-center justify-between gap-4">
            <div>
              <span className="font-bold text-slate-900 block">Agronomic &amp; Weather Advisories</span>
              <span className="text-slate-500 text-[11px]">
                Early warnings for extreme regional rainfall, pest alerts, and post-harvest advisories.
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleToggleNotif('weatherAdvisories')}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition duration-200 ease-in-out shrink-0 ${
                notifPrefs.weatherAdvisories ? 'bg-emerald-700 justify-end' : 'bg-slate-200 justify-start'
              }`}
            >
              <div className="bg-white w-4 h-4 rounded-full shadow-md"></div>
            </button>
          </div>

          {/* Channel 4: Email Digests */}
          <div className="py-3 flex items-center justify-between gap-4">
            <div>
              <span className="font-bold text-slate-900 block">Email Transaction Summaries</span>
              <span className="text-slate-500 text-[11px]">
                Receive periodic transaction digests and official receipt confirmations via {user?.email}.
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleToggleNotif('emailDigests')}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition duration-200 ease-in-out shrink-0 ${
                notifPrefs.emailDigests ? 'bg-emerald-700 justify-end' : 'bg-slate-200 justify-start'
              }`}
            >
              <div className="bg-white w-4 h-4 rounded-full shadow-md"></div>
            </button>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 8. SECURITY & PASSWORD                                               */}
      {/* ==================================================================== */}
      <section className="agri-card p-6 sm:p-7 bg-white space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-700" />
            <h3 className="text-base font-bold text-slate-900">Security &amp; Authentication</h3>
          </div>
          <span className="text-xs text-slate-400 font-medium">Bcrypt Encrypted</span>
        </div>

        {/* Security Session Overview */}
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-slate-900 block">JWT Session Active</span>
              <span className="text-slate-500 text-[11px]">HMAC-SHA256 Token Protocol with Role Verification</span>
            </div>
          </div>
          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 self-start sm:self-auto">
            Session Protected
          </span>
        </div>

        {/* Password Feedback */}
        {passwordSuccessMsg && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{passwordSuccessMsg}</span>
          </div>
        )}

        {passwordErrorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{passwordErrorMsg}</span>
          </div>
        )}

        {/* Password Change Form */}
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
              Current Password <span className="text-rose-500">*</span>
            </label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              className="w-full sm:max-w-md px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white shadow-2xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
                New Password (minimum 6 characters) <span className="text-rose-500">*</span>
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new secure password"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white shadow-2xs"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
                Confirm New Password <span className="text-rose-500">*</span>
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white shadow-2xs"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={savingPassword}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold transition disabled:opacity-50 shadow-2xs"
            >
              {savingPassword ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Updating Security Credentials...</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Update Password</span>
                </>
              )}
            </button>
          </div>
        </form>
      </section>

      {/* ==================================================================== */}
      {/* 9. DANGER ZONE & LOGOUT                                              */}
      {/* ==================================================================== */}
      <section className="agri-card p-6 sm:p-7 bg-rose-50/20 border border-rose-200/80 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-rose-100">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-700" />
            <h3 className="text-base font-bold text-slate-900">Danger Zone</h3>
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700 bg-rose-100/60 px-2 py-0.5 rounded">
            Sensitive Session Actions
          </span>
        </div>

        <div className="space-y-3 text-xs">
          {/* Reset Device Cache Option */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-white border border-slate-200">
            <div>
              <span className="font-bold text-slate-900 block">Reset Local Preferences &amp; Cache</span>
              <span className="text-slate-500 text-[11px]">
                Clears device-stored language, units, and notification toggle defaults.
              </span>
            </div>
            <button
              type="button"
              onClick={handleClearLocalCache}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition self-start sm:self-auto shrink-0 shadow-2xs"
            >
              <Trash2 className="w-3.5 h-3.5 text-slate-500" />
              <span>Reset Cache</span>
            </button>
          </div>

          {/* Logout Action */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-white border border-rose-200">
            <div>
              <span className="font-bold text-slate-900 block">Sign Out of AgroLink</span>
              <span className="text-slate-500 text-[11px]">
                Terminates current session token on this device. You will need to re-authenticate with your password.
              </span>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition self-start sm:self-auto shrink-0 shadow-2xs"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Profile;
