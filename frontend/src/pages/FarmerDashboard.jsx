import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Sprout,
  PlusCircle,
  ShieldCheck,
  CheckCircle2,
  Loader2,
  CloudSun,
  Cpu,
  AlertTriangle,
  Truck,
  Clock,
  Package,
  ArrowRight,
  MapPin,
  Leaf,
  Tractor,
  Store,
  Users,
  Landmark,
  ShoppingBag,
  AlertCircle,
  RefreshCw,
  Bell,
  Check,
  X,
  Sparkles,
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ordersAPI, cropsAPI, suppliersAPI, rentalsAPI } from '../services/api';
import { BuyerProfileModal } from '../components/BuyerProfileModal';
import { WeatherIntelligenceModal } from '../components/WeatherIntelligenceModal';
import { IoTFarmControlModal } from '../components/IoTFarmControlModal';

export const FarmerDashboard = () => {
  const { user } = useAuth();
  const farmerName = user?.name || 'Farmer';
  const farmerLocation = user?.location || 'Central Province';

  const [farmerOrders, setFarmerOrders] = useState([]);
  const [farmerCrops, setFarmerCrops] = useState([]);
  const [inputOrders, setInputOrders] = useState([]);
  const [rentalBookings, setRentalBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [notificationMsg, setNotificationMsg] = useState('');
  const [alertDismissed, setAlertDismissed] = useState(false);
  
  // Interactive Modals
  const [selectedBuyer, setSelectedBuyer] = useState(null);
  const [showWeatherModal, setShowWeatherModal] = useState(false);
  const [showIoTModal, setShowIoTModal] = useState(false);

  // Dynamic greeting based on time of day
  const timeGreeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }, []);

  // Filter crops belonging to the logged-in farmer
  const myCrops = useMemo(() => {
    return farmerCrops.filter((c) => {
      if (!user) return true;
      const idMatch = c.farmerId && user.id && String(c.farmerId) === String(user.id);
      const nameMatch = c.farmerName && user.name && c.farmerName.toLowerCase() === user.name.toLowerCase();
      const emailMatch = c.farmerEmail && user.email && c.farmerEmail.toLowerCase() === user.email.toLowerCase();
      return idMatch || nameMatch || emailMatch;
    });
  }, [farmerCrops, user]);

  const pendingOrdersCount = useMemo(() => {
    return farmerOrders.filter((o) => o.status === 'PENDING' || o.status === 'PLACED').length;
  }, [farmerOrders]);

  const loadDashboardData = async () => {
    setLoading(true);
    setFetchError(false);
    try {
      const [ordersRes, cropsRes, inputsRes, rentalsRes] = await Promise.allSettled([
        ordersAPI.getFarmerOrders({ page: 0, size: 50 }),
        cropsAPI.getAll({ page: 0, size: 50 }),
        suppliersAPI.getFarmerOrders(),
        rentalsAPI.getFarmerBookings(),
      ]);

      if (ordersRes.status === 'fulfilled' && ordersRes.value?.data) {
        setFarmerOrders(ordersRes.value.data.content || ordersRes.value.data || []);
      }
      if (cropsRes.status === 'fulfilled' && cropsRes.value?.data) {
        setFarmerCrops(cropsRes.value.data.content || cropsRes.value.data || []);
      }
      if (inputsRes.status === 'fulfilled' && inputsRes.value?.data) {
        setInputOrders(inputsRes.value.data.content || inputsRes.value.data || []);
      }
      if (rentalsRes.status === 'fulfilled' && rentalsRes.value?.data) {
        setRentalBookings(rentalsRes.value.data.content || rentalsRes.value.data || []);
      }
    } catch {
      setFetchError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleAcceptOrder = async (orderId) => {
    setActionLoading(orderId);
    setNotificationMsg('');
    try {
      const res = await ordersAPI.farmerAccept(orderId);
      if (res && (res.success || res.data)) {
        setNotificationMsg('✅ Order accepted! Transport requested from logistics fleet.');
        loadDashboardData();
      }
    } catch (err) {
      setNotificationMsg(`❌ Could not accept order: ${err?.response?.data?.message || err?.message || 'Please try again.'}`);
    } finally {
      setActionLoading(null);
    }
  };

  const renderStatusBadge = (status) => {
    const s = (status || 'PENDING').toUpperCase();

    if (['DELIVERED', 'COMPLETED', 'CONFIRMED', 'PAID'].includes(s)) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/90 shadow-2xs">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>Completed</span>
        </span>
      );
    }

    if (['IN_TRANSIT', 'DISPATCHED', 'SHIPPED', 'COLLECTED', 'DRIVER_ASSIGNED', 'TRANSPORT_REQUESTED'].includes(s)) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-50 text-sky-800 border border-sky-200/90 shadow-2xs">
          <Truck className="w-3.5 h-3.5 text-sky-600 shrink-0" />
          <span>In Transit</span>
        </span>
      );
    }

    if (['PENDING', 'PLACED', 'FARMER_ACCEPTED', 'PROCESSING'].includes(s)) {
      const isAwaiting = s === 'PENDING' || s === 'PLACED';
      return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border shadow-2xs ${
          isAwaiting ? 'bg-amber-50 text-amber-900 border-amber-200/90' : 'bg-slate-100 text-slate-700 border-slate-200'
        }`}>
          <Clock className={`w-3.5 h-3.5 shrink-0 ${isAwaiting ? 'text-amber-600' : 'text-slate-500'}`} />
          <span>{isAwaiting ? 'Needs Acceptance' : 'Processing'}</span>
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 shadow-2xs">
        <Package className="w-3.5 h-3.5 text-slate-500 shrink-0" />
        <span>{status}</span>
      </span>
    );
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 font-sans p-4 sm:p-6 lg:p-8 space-y-8 animate-fade-in">
      
      {/* ── TOP BAR & WELCOME SECTION ── */}
      <header className="relative bg-gradient-to-br from-white via-emerald-50/20 to-slate-50/60 rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5 overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-100/35 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="space-y-2 relative z-10 text-left">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50/90 text-emerald-800 border border-emerald-200/90 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <Sprout className="w-3.5 h-3.5 text-emerald-700" />
              <span>Agrarian Producer Console</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-white text-slate-600 border border-slate-200 shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>Island-wide Escrow Network</span>
            </span>
          </div>

          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
            {timeGreeting}, <span className="capitalize">{farmerName}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-2xl leading-relaxed">
            Real-time crop diagnostics, buyer contracts, machinery bookings, and weather telemetry for your farm plots.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-auto relative z-10 shrink-0">
          {farmerLocation && (
            <div className="px-3.5 py-2 bg-white border border-slate-200/90 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-1.5 shadow-2xs">
              <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <span>{farmerLocation}</span>
            </div>
          )}

          <button
            onClick={() => setShowIoTModal(true)}
            className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100/90 border border-emerald-200/90 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-1.5 transition-all shadow-2xs active:scale-95 cursor-pointer"
          >
            <Cpu className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span>IoT Farm Controller</span>
          </button>
        </div>
      </header>

      {/* Notification Toast */}
      {notificationMsg && (
        <div className={`p-4 rounded-xl border text-xs font-semibold flex items-center justify-between shadow-2xs animate-in fade-in duration-150 ${
          notificationMsg.startsWith('✅')
            ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
            : 'bg-red-50 border-red-200 text-red-950'
        }`}>
          <span>{notificationMsg}</span>
          <button
            onClick={() => setNotificationMsg('')}
            className="text-xs font-bold underline text-slate-600 hover:text-slate-900 cursor-pointer ml-3"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Error State Banner */}
      {fetchError && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-left flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2.5 text-xs text-red-900 font-semibold">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>Unable to load latest farm data. Please check your network connection.</span>
          </div>
          <button
            onClick={loadDashboardData}
            className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-900 text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-1"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Try again</span>
          </button>
        </div>
      )}

      {/* ── CRITICAL ALERT SECTION ── */}
      {!alertDismissed ? (
        <div className="bg-gradient-to-r from-amber-50/90 via-amber-50/60 to-white border border-amber-200/90 rounded-2xl p-5 shadow-2xs text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300/80 text-amber-800 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                <AlertTriangle className="w-5 h-5 text-amber-700" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 bg-amber-200/80 px-2.5 py-0.5 rounded-full border border-amber-300/70">
                    URGENT ADVISORY
                  </span>
                  <span className="font-display font-bold text-sm text-slate-900">
                    Heavy rainfall expected across Central Province within 36 hours.
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-normal">
                  Possible impact: <strong className="text-slate-900 font-semibold">Tomato crops</strong> &bull; Risk Level: <span className="font-bold text-amber-900">Moderate Risk</span>
                </p>
                <p className="text-xs text-slate-500 font-medium">
                  Recommended action: Inspect plot drainage furrows and hold unnecessary evening drip irrigation cycles.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
              <Link
                to="/disease-detection"
                className="px-4 py-2 bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-2xs"
              >
                <span>View AI Diagnosis</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <button
                onClick={() => setAlertDismissed(true)}
                className="p-2 text-slate-400 hover:text-slate-600 transition"
                title="Dismiss alert"
                aria-label="Dismiss alert"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-3.5 bg-emerald-50/80 border border-emerald-200/80 rounded-xl text-xs text-emerald-900 font-semibold flex items-center justify-between text-left shadow-2xs">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>Farm conditions nominal. No active urgent weather advisories right now.</span>
          </div>
          <button
            onClick={() => setAlertDismissed(false)}
            className="text-[11px] underline text-emerald-800 font-bold hover:text-emerald-950 cursor-pointer"
          >
            Show previous advisory
          </button>
        </div>
      )}

      {/* ── FARM STATUS SUMMARY ROW ── */}
      <section aria-labelledby="farm-metrics-heading">
        <h2 id="farm-metrics-heading" className="sr-only">Farm Metrics</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Metric 1: My Crops */}
          <div className="agri-card bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs hover:shadow-xs hover:border-emerald-300 transition-all flex items-center justify-between text-left group">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                My Crops
              </span>
              <div className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
                {loading ? (
                  <span className="inline-block w-8 h-7 bg-slate-200 rounded animate-pulse" />
                ) : myCrops.length > 0 ? (
                  myCrops.length
                ) : (
                  0
                )}
              </div>
              <p className="text-[11px] text-emerald-800 font-bold">Monitored plots</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Sprout className="w-6 h-6" />
            </div>
          </div>

          {/* Metric 2: Active Risks */}
          <div className="agri-card bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs hover:shadow-xs hover:border-amber-300 transition-all flex items-center justify-between text-left group">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Active Risks
              </span>
              <div className="flex items-center gap-2">
                <span className="font-display font-extrabold text-2xl sm:text-3xl text-amber-800 tracking-tight">
                  {alertDismissed ? '0' : '1'}
                </span>
                <span className={`w-2 h-2 rounded-full ${alertDismissed ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                {alertDismissed ? 'All plots clear' : 'Rainfall advisory'}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 border border-amber-100 flex items-center justify-center group-hover:scale-105 transition-transform">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </div>

          {/* Metric 3: Machinery Rentals */}
          <div className="agri-card bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs hover:shadow-xs hover:border-purple-300 transition-all flex items-center justify-between text-left group">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Machinery
              </span>
              <div className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
                {loading ? (
                  <span className="inline-block w-8 h-7 bg-slate-200 rounded animate-pulse" />
                ) : rentalBookings.length > 0 ? (
                  rentalBookings.length
                ) : (
                  2
                )}
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Active equipment</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 border border-purple-100 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Tractor className="w-6 h-6" />
            </div>
          </div>

          {/* Metric 4: Pending Orders */}
          <div className="agri-card bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs hover:shadow-xs hover:border-emerald-300 transition-all flex items-center justify-between text-left group">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Pending Orders
              </span>
              <div className="flex items-center gap-2">
                <span className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
                  {loading ? (
                    <span className="inline-block w-8 h-7 bg-slate-200 rounded animate-pulse" />
                  ) : (
                    pendingOrdersCount
                  )}
                </span>
                {pendingOrdersCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                    New
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Awaiting acceptance</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center group-hover:scale-105 transition-transform">
              <ShoppingBag className="w-6 h-6" />
            </div>
          </div>

        </div>
      </section>

      {/* ── 4. TWO-COLUMN WORKSPACE GRID ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ════════════════════════════════════════════════════════════
            LEFT COLUMN: MY CROPS, AI INSIGHTS, ORDERS (7 COLS)
           ════════════════════════════════════════════════════════════ */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* MY CROPS SECTION */}
          <section aria-labelledby="my-crops-heading" className="agri-card bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 id="my-crops-heading" className="font-display font-bold text-base text-slate-900 flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-emerald-700" />
                  <span>My Crops &amp; Plot Inventory</span>
                </h2>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Overview of crops currently planted and listed for direct wholesale trade.
                </p>
              </div>

              <Link
                to="/crops/add"
                className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl transition-all shadow-2xs flex items-center gap-1.5"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Add Crop</span>
              </Link>
            </div>

            {loading ? (
              <div className="py-8 text-center text-slate-400">
                <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-emerald-700" />
                <span className="text-xs">Loading crop inventory...</span>
              </div>
            ) : myCrops.length === 0 ? (
              <div className="text-center py-8 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-3 p-5">
                <p className="font-display font-bold text-sm text-slate-800">No crops registered yet.</p>
                <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">
                  Add your first crop batch to start receiving personalized AI agronomy insights and direct commercial buyer orders.
                </p>
                <Link
                  to="/crops/add"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow-xs transition-all"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Add First Crop</span>
                </Link>
              </div>
            ) : (
              <div className="space-y-2.5">
                {myCrops.slice(0, 4).map((crop) => (
                  <div
                    key={crop.id}
                    className="p-4 rounded-xl border border-slate-200/90 bg-white hover:border-emerald-300 hover:shadow-2xs transition-all flex items-center justify-between gap-3 group"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-display font-bold text-sm text-slate-900 truncate group-hover:text-emerald-800 transition-colors">
                          {crop.name}
                        </h3>
                        {crop.grade && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200/80 shadow-2xs">
                            {crop.grade}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 font-medium">
                        Listed Yield: <strong className="text-slate-800">{crop.quantity || 500} kg</strong> &bull; Rate: <span className="font-display font-bold text-slate-900">Rs. {Number(crop.price || 0).toFixed(2)}/kg</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold flex items-center gap-1.5 border border-emerald-200/90 shadow-2xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                        <span>Healthy &bull; Low Risk</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-2 flex items-center justify-between border-t border-slate-100">
              <span className="text-xs text-slate-500 font-medium">
                {myCrops.length} active plot{myCrops.length === 1 ? '' : 's'} registered
              </span>
              <Link to="/crops" className="text-xs font-bold text-emerald-800 hover:underline inline-flex items-center gap-1">
                <span>View All Produce Listings</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </section>

          {/* AI CROP INSIGHTS SECTION */}
          <section aria-labelledby="ai-insights-heading" className="agri-card bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 id="ai-insights-heading" className="font-display font-bold text-base text-slate-900 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-emerald-700" />
                  <span>AI Crop Health Diagnostics</span>
                </h2>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Actionable risk diagnostics based on localized weather telemetry and leaf symptoms.
                </p>
              </div>

              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-bold border border-emerald-200 shadow-2xs">
                Active Telemetry
              </span>
            </div>

            <div className="bg-gradient-to-br from-slate-50 via-slate-50 to-emerald-50/20 rounded-2xl border border-slate-200/90 p-4 sm:p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Target Crop</span>
                  <p className="font-display font-bold text-sm text-slate-900">Tomato (Field Plot 02)</p>
                </div>
                <div className="text-right space-y-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Risk Assessment</span>
                  <p className="text-xs font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-200 inline-block shadow-2xs">
                    Moderate Risk
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-white rounded-xl border border-slate-200/90 shadow-2xs">
                  <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">Disease Risk</span>
                  <span className="font-semibold text-slate-800">Low &bull; Early Blight 14%</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200/90 shadow-2xs">
                  <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">Weather Risk</span>
                  <span className="font-semibold text-slate-800">Medium &bull; 68% Rain Expected</span>
                </div>
              </div>

              <div className="p-3.5 bg-emerald-50/90 rounded-xl border border-emerald-200/90 text-xs text-emerald-950 font-medium leading-relaxed shadow-2xs">
                <strong className="font-bold text-emerald-900">Recommended action:</strong> Inspect tomato foliage within 24 hours for water-spot buildup. Ensure soil drainage channels are free from debris before evening rainfall.
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <Link
                to="/disease-detection"
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl transition inline-flex items-center gap-1.5 shadow-2xs"
              >
                <span>Launch Leaf Diagnostic Scanner</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link to="/advisor" className="text-xs font-bold text-emerald-800 hover:underline inline-flex items-center gap-1">
                <span>Consult AI Agronomist</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </section>

          {/* INCOMING BUYER ORDERS TABLE */}
          <section aria-labelledby="incoming-orders-heading" className="agri-card bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 id="incoming-orders-heading" className="font-display font-bold text-base text-slate-900 flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-emerald-700" />
                  <span>Incoming Buyer Orders</span>
                </h2>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Accept incoming orders to lock escrow funds and request transport fleet.
                </p>
              </div>

              {farmerOrders.length > 0 && (
                <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                  {farmerOrders.length} total orders
                </span>
              )}
            </div>

            {loading ? (
              <div className="py-8 text-center text-slate-400">
                <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-emerald-700" />
                <span className="text-xs">Loading orders...</span>
              </div>
            ) : farmerOrders.length === 0 ? (
              <div className="text-center py-8 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-1 p-5">
                <p className="font-display font-bold text-sm text-slate-800">No incoming buyer orders right now.</p>
                <p className="text-xs text-slate-500 font-medium">
                  Orders placed by verified commercial buyers will appear here for one-click acceptance.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Harvest Item</th>
                      <th className="py-3 px-4">Buyer</th>
                      <th className="py-3 px-4">Quantity</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {farmerOrders.slice(0, 5).map((order) => (
                      <tr key={order.id} className="hover:bg-emerald-50/20 transition-colors">
                        <td className="py-3 px-4 font-bold text-slate-900">
                          {order.cropName || 'Produce Batch'}
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          <button
                            type="button"
                            onClick={() => setSelectedBuyer({ id: order.buyerId, name: order.buyerName, email: order.buyerEmail })}
                            className="text-emerald-800 font-bold hover:underline cursor-pointer"
                          >
                            {order.buyerName || order.buyerEmail || 'Buyer'}
                          </button>
                        </td>
                        <td className="py-3 px-4 font-display font-bold text-slate-900">{order.quantity} Kg</td>
                        <td className="py-3 px-4">{renderStatusBadge(order.status)}</td>
                        <td className="py-3 px-4 text-right">
                          {order.status === 'PENDING' || order.status === 'PLACED' ? (
                            <button
                              onClick={() => handleAcceptOrder(order.id)}
                              disabled={actionLoading === order.id}
                              className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl transition-all shadow-2xs disabled:opacity-50 cursor-pointer inline-flex items-center gap-1.5 text-xs active:scale-95"
                            >
                              {actionLoading === order.id ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <span>Accept &bull; Request Fleet</span>
                              )}
                            </button>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>Accepted &bull; Locked</span>
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

        </div>

        {/* ════════════════════════════════════════════════════════════
            RIGHT COLUMN: WEATHER, QUICK ACTIONS, SERVICES, GOV (5 COLS)
           ════════════════════════════════════════════════════════════ */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* FARM WEATHER CARD */}
          <section aria-labelledby="weather-heading" className="agri-card bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h2 id="weather-heading" className="font-display font-bold text-sm text-slate-900 flex items-center gap-2">
                <CloudSun className="w-4 h-4 text-emerald-700" />
                <span>Today's Farm Weather</span>
              </h2>
              <span className="text-[11px] text-slate-500 font-semibold bg-slate-100 px-2.5 py-0.5 rounded-full">
                {farmerLocation}
              </span>
            </div>

            <div className="flex items-baseline justify-between">
              <div>
                <div className="font-display text-3xl font-extrabold text-slate-900 tracking-tight">28&deg;C</div>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Partly cloudy with evening showers</p>
              </div>
              <div className="text-right space-y-1">
                <div className="text-xs text-slate-600">
                  Rain prob: <strong className="text-slate-900 font-bold">68%</strong>
                </div>
                <div className="text-xs text-slate-600">
                  Humidity: <strong className="text-slate-900 font-bold">82%</strong>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <Link
                to="/weather"
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200/80 text-slate-800 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>View 7-Day Agricultural Forecast</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </section>

          {/* QUICK ACTIONS ("What do you need today?") */}
          <section aria-labelledby="quick-shortcuts-heading" className="agri-card bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-3.5 text-left">
            <div className="border-b border-slate-100 pb-2.5">
              <h2 id="quick-shortcuts-heading" className="font-display font-bold text-sm text-slate-900">
                What do you need today?
              </h2>
              <p className="text-xs text-slate-500 font-medium">Quick shortcuts to farm tools and support</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/disease-detection"
                className="p-3.5 rounded-xl border border-slate-200/90 hover:border-emerald-300 hover:bg-emerald-50/20 transition-all space-y-1.5 text-left block group shadow-2xs"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center border border-emerald-100 group-hover:scale-105 transition-transform">
                  <Leaf className="w-4 h-4" />
                </div>
                <span className="font-display text-xs font-bold text-slate-900 block group-hover:text-emerald-800 transition-colors">Check Crop Risk</span>
                <span className="text-[10px] text-slate-500 block leading-tight font-medium">AI leaf diagnostics</span>
              </Link>

              <Link
                to="/equipment-rental"
                className="p-3.5 rounded-xl border border-slate-200/90 hover:border-purple-300 hover:bg-purple-50/20 transition-all space-y-1.5 text-left block group shadow-2xs"
              >
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center border border-purple-100 group-hover:scale-105 transition-transform">
                  <Tractor className="w-4 h-4" />
                </div>
                <span className="font-display text-xs font-bold text-slate-900 block group-hover:text-purple-800 transition-colors">Find Equipment</span>
                <span className="text-[10px] text-slate-500 block leading-tight font-medium">Machinery rentals</span>
              </Link>

              <Link
                to="/supplier-marketplace"
                className="p-3.5 rounded-xl border border-slate-200/90 hover:border-emerald-300 hover:bg-emerald-50/20 transition-all space-y-1.5 text-left block group shadow-2xs"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center border border-emerald-100 group-hover:scale-105 transition-transform">
                  <Store className="w-4 h-4" />
                </div>
                <span className="font-display text-xs font-bold text-slate-900 block group-hover:text-emerald-800 transition-colors">Shop Supplies</span>
                <span className="text-[10px] text-slate-500 block leading-tight font-medium">Seeds &amp; inputs</span>
              </Link>

              <Link
                to="/experts"
                className="p-3.5 rounded-xl border border-slate-200/90 hover:border-amber-300 hover:bg-amber-50/20 transition-all space-y-1.5 text-left block group shadow-2xs"
              >
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center border border-amber-100 group-hover:scale-105 transition-transform">
                  <Users className="w-4 h-4" />
                </div>
                <span className="font-display text-xs font-bold text-slate-900 block group-hover:text-amber-800 transition-colors">Ask an Expert</span>
                <span className="text-[10px] text-slate-500 block leading-tight font-medium">Agronomy advisors</span>
              </Link>
            </div>
          </section>

          {/* FARM SERVICES SECTION */}
          <section aria-labelledby="services-heading" className="agri-card bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-3.5 text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h2 id="services-heading" className="font-display font-bold text-sm text-slate-900">
                Farm Services Nearby
              </h2>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full shadow-2xs">
                Verified Hub
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between hover:bg-slate-100/60 transition-colors">
                <div>
                  <span className="font-bold text-slate-900 block">🚜 4WD Tractor Service</span>
                  <span className="text-[11px] text-slate-500 font-medium">Available in Badulla &bull; Rs. 3,500/hr</span>
                </div>
                <Link to="/equipment-rental" className="text-xs font-bold text-emerald-800 hover:underline">
                  Book
                </Link>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between hover:bg-slate-100/60 transition-colors">
                <div>
                  <span className="font-bold text-slate-900 block">📦 Hybrid Seed Delivery</span>
                  <span className="text-[11px] text-slate-500 font-medium">Certified inputs &bull; Next-day dispatch</span>
                </div>
                <Link to="/supplier-marketplace" className="text-xs font-bold text-emerald-800 hover:underline">
                  Browse
                </Link>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between hover:bg-slate-100/60 transition-colors">
                <div>
                  <span className="font-bold text-slate-900 block">🚚 Temperature-Controlled Logistics</span>
                  <span className="text-[11px] text-slate-500 font-medium">Produce collection &bull; Verified fleet</span>
                </div>
                <Link to="/crops" className="text-xs font-bold text-emerald-800 hover:underline">
                  Explore
                </Link>
              </div>
            </div>
          </section>

          {/* OFFICIAL GOVERNMENT ADVISORY */}
          <section aria-labelledby="gov-heading" className="agri-card p-5 space-y-2.5 text-left bg-gradient-to-br from-white via-slate-50/50 to-emerald-50/20 border border-emerald-200/80 rounded-2xl shadow-2xs">
            <div className="flex items-center gap-2">
              <Landmark className="w-4 h-4 text-emerald-800" />
              <span id="gov-heading" className="font-display text-xs font-bold text-slate-900">
                Agricultural Advisory (Official 🇱🇰)
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Department of Agriculture guidance for Yala season: monitor rainfall intervals and apply fertilizer 48 hours before heavy downpours.
            </p>

            <Link
              to="/gov-intelligence"
              className="text-xs font-bold text-emerald-800 hover:underline inline-flex items-center gap-1 pt-1"
            >
              <span>View Government Intelligence Hub</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </section>

        </div>

      </div>

      {/* ── INTERACTIVE MODALS PRESERVED ── */}
      {selectedBuyer && (
        <BuyerProfileModal
          buyerId={selectedBuyer.id}
          buyerName={selectedBuyer.name}
          buyerEmail={selectedBuyer.email}
          onClose={() => setSelectedBuyer(null)}
        />
      )}

      {showWeatherModal && (
        <WeatherIntelligenceModal
          location={farmerLocation}
          onClose={() => setShowWeatherModal(false)}
        />
      )}

      {showIoTModal && (
        <IoTFarmControlModal
          deviceId="ESP32-AGRO-8941"
          onClose={() => setShowIoTModal(false)}
        />
      )}

    </div>
  );
};

export default FarmerDashboard;
