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
  X
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
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
          <CheckCircle2 className="w-3 h-3 text-emerald-700" />
          <span>Completed</span>
        </span>
      );
    }

    if (['IN_TRANSIT', 'DISPATCHED', 'SHIPPED', 'COLLECTED', 'DRIVER_ASSIGNED', 'TRANSPORT_REQUESTED'].includes(s)) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-50 text-sky-800 border border-sky-200">
          <Truck className="w-3 h-3 text-sky-700" />
          <span>In Transit</span>
        </span>
      );
    }

    if (['PENDING', 'PLACED', 'FARMER_ACCEPTED', 'PROCESSING'].includes(s)) {
      const isAwaiting = s === 'PENDING' || s === 'PLACED';
      return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${
          isAwaiting ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-slate-100 text-slate-700 border-slate-200'
        }`}>
          <Clock className="w-3 h-3" />
          <span>{isAwaiting ? 'Needs Acceptance' : 'Processing'}</span>
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
        <Package className="w-3 h-3 text-slate-500" />
        <span>{status}</span>
      </span>
    );
  };

  return (
    <div className="bg-[#FBFBFA] min-h-screen text-slate-900 font-sans p-4 sm:p-6 lg:p-8 space-y-6">
      
      {/* ── TOP BAR & WELCOME SECTION ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div className="space-y-1 text-left">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            {timeGreeting}, <span className="capitalize">{farmerName}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Here's what is happening on your farm today.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          {farmerLocation && (
            <div className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 flex items-center gap-1.5 shadow-2xs">
              <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <span>{farmerLocation}</span>
            </div>
          )}

          <button
            onClick={() => setShowIoTModal(true)}
            className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200/80 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-1.5 transition cursor-pointer"
          >
            <Cpu className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span className="hidden sm:inline">IoT Controller</span>
            <span className="sm:hidden">IoT</span>
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {notificationMsg && (
        <div className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center justify-between ${
          notificationMsg.startsWith('✅')
            ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
            : 'bg-red-50 border-red-200 text-red-900'
        }`}>
          <span>{notificationMsg}</span>
          <button
            onClick={() => setNotificationMsg('')}
            className="text-xs underline text-slate-500 hover:text-slate-700 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Error State Banner */}
      {fetchError && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-left flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-xs text-red-800 font-semibold">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>Unable to load latest farm data. Please check your connection.</span>
          </div>
          <button
            onClick={loadDashboardData}
            className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-900 text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Try again</span>
          </button>
        </div>
      )}

      {/* ── CRITICAL ALERT SECTION ── */}
      {!alertDismissed ? (
        <div className="bg-amber-50/90 border border-amber-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-100 border border-amber-300 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
                <AlertTriangle className="w-5 h-5 text-amber-700" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-900 bg-amber-200/70 px-2 py-0.5 rounded">
                    ATTENTION NEEDED
                  </span>
                  <span className="text-xs font-bold text-slate-900">
                    Heavy rainfall expected in your area.
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  Possible impact: <strong className="text-slate-900">Tomato crops</strong> &bull; Risk Level: <span className="font-bold text-amber-900">Medium Risk</span>
                </p>
                <p className="text-xs text-slate-600">
                  Recommended action: Check field drainage channels and avoid unnecessary evening irrigation.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
              <Link
                to="/disease-detection"
                className="px-4 py-2 bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold rounded-xl transition flex items-center gap-1 shadow-2xs"
              >
                <span>View AI Insight</span>
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
        <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl text-xs text-emerald-800 font-semibold flex items-center justify-between text-left">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>You're all caught up. No active urgent alerts right now.</span>
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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: My Crops */}
        <div className="agri-card p-4 sm:p-5 flex items-center justify-between text-left">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              My Crops
            </span>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900">
              {loading ? (
                <span className="inline-block w-8 h-7 bg-slate-200 rounded animate-pulse" />
              ) : myCrops.length > 0 ? (
                myCrops.length
              ) : (
                0
              )}
            </div>
            <p className="text-[11px] text-emerald-800 font-medium">Monitored fields</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
            <Sprout className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 2: Active Risks */}
        <div className="agri-card p-4 sm:p-5 flex items-center justify-between text-left">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Active Risks
            </span>
            <div className="flex items-center gap-2">
              <span className="text-2xl sm:text-3xl font-bold text-amber-700">
                {alertDismissed ? '0' : '1'}
              </span>
              <span className={`w-2 h-2 rounded-full ${alertDismissed ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              {alertDismissed ? 'All clear' : 'Rainfall advisory'}
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 3: Machinery Rentals */}
        <div className="agri-card p-4 sm:p-5 flex items-center justify-between text-left">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Machinery
            </span>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900">
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
          <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
            <Tractor className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 4: Pending Orders */}
        <div className="agri-card p-4 sm:p-5 flex items-center justify-between text-left">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Pending Orders
            </span>
            <div className="flex items-center gap-2">
              <span className="text-2xl sm:text-3xl font-bold text-slate-900">
                {loading ? (
                  <span className="inline-block w-8 h-7 bg-slate-200 rounded animate-pulse" />
                ) : (
                  pendingOrdersCount
                )}
              </span>
              {pendingOrdersCount > 0 && (
                <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  New
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 font-medium">Awaiting acceptance</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
            <ShoppingBag className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* ── 4. TWO-COLUMN WORKSPACE GRID ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ════════════════════════════════════════════════════════════
            LEFT COLUMN: MY CROPS, AI INSIGHTS, ORDERS (7 COLS)
           ════════════════════════════════════════════════════════════ */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* MY CROPS SECTION */}
          <div className="agri-card p-5 sm:p-6 space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-emerald-700" />
                  <span>My Crops</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Overview of crops currently planted and listed for wholesale trade.
                </p>
              </div>

              <Link
                to="/crops/add"
                className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-lg transition flex items-center gap-1 shadow-2xs"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Add Crop</span>
              </Link>
            </div>

            {loading ? (
              <div className="py-8 text-center text-slate-400">
                <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-emerald-700" />
                <span className="text-xs">Loading crop health status...</span>
              </div>
            ) : myCrops.length === 0 ? (
              <div className="text-center py-8 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3 p-4">
                <p className="text-sm font-bold text-slate-700">No crops added yet.</p>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Add your first crop to start receiving personalized AI insights and direct buyer orders.
                </p>
                <Link
                  to="/crops/add"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-800 text-white text-xs font-bold rounded-lg shadow-xs"
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
                    className="p-3.5 rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50/60 transition flex items-center justify-between gap-3"
                  >
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-900 truncate">
                          {crop.name}
                        </h3>
                        {crop.grade && (
                          <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10px] font-bold">
                            {crop.grade}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500">
                        Listed Yield: {crop.quantity || 500} kg &bull; Rate: Rs. {Number(crop.price || 0).toFixed(2)}/kg
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                        Healthy &bull; Low Risk
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-2 flex items-center justify-between border-t border-slate-100">
              <span className="text-xs text-slate-500">
                {myCrops.length} active plot{myCrops.length === 1 ? '' : 's'} registered
              </span>
              <Link to="/crops" className="text-xs font-bold text-emerald-800 hover:underline inline-flex items-center gap-1">
                <span>View All Produce Listings</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* AI CROP INSIGHTS SECTION */}
          <div className="agri-card p-5 sm:p-6 space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-emerald-700" />
                  <span>AI Crop Insights</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Actionable risk diagnostics based on localized weather and leaf telemetry.
                </p>
              </div>

              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                Active Diagnostic
              </span>
            </div>

            <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Target Crop</span>
                  <p className="text-sm font-bold text-slate-900">Tomato (Field Plot 02)</p>
                </div>
                <div className="text-right space-y-0.5">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Overall Risk</span>
                  <p className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-md inline-block">
                    Moderate Risk
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 bg-white rounded-lg border border-slate-200/80">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Disease Risk</span>
                  <span className="font-semibold text-slate-800">Low &bull; Early Blight 14%</span>
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-slate-200/80">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Weather Risk</span>
                  <span className="font-semibold text-slate-800">Medium &bull; 68% Rain Expected</span>
                </div>
              </div>

              <div className="p-3 bg-emerald-50/90 rounded-lg border border-emerald-200 text-xs text-emerald-900 font-medium">
                <strong className="font-bold">Recommended action:</strong> Inspect tomato foliage within 24 hours for water-spot buildup. Ensure soil drainage channels are free from debris before evening rainfall.
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <Link
                to="/disease-detection"
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-lg transition inline-flex items-center gap-1.5 shadow-2xs"
              >
                <span>Launch Disease Scanner</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link to="/advisor" className="text-xs font-bold text-emerald-800 hover:underline">
                Consult AI Agronomist &rarr;
              </Link>
            </div>
          </div>

          {/* INCOMING BUYER ORDERS TABLE */}
          <div className="agri-card p-5 sm:p-6 space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-emerald-700" />
                  <span>Incoming Buyer Orders</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Accept incoming orders to lock escrow funds and request transport.
                </p>
              </div>

              {farmerOrders.length > 0 && (
                <span className="text-xs font-bold text-slate-500">
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
              <div className="text-center py-8 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1 p-4">
                <p className="text-sm font-bold text-slate-700">No incoming buyer orders right now.</p>
                <p className="text-xs text-slate-500">
                  Orders placed by verified commercial buyers will appear here for acceptance.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="p-3">Harvest Item</th>
                      <th className="p-3">Buyer</th>
                      <th className="p-3">Quantity</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {farmerOrders.slice(0, 5).map((order) => (
                      <tr key={order.id} className="hover:bg-slate-50/60 transition">
                        <td className="p-3 font-bold text-slate-900">
                          {order.cropName || 'Produce Batch'}
                        </td>
                        <td className="p-3 text-slate-600">
                          <button
                            type="button"
                            onClick={() => setSelectedBuyer({ id: order.buyerId, name: order.buyerName, email: order.buyerEmail })}
                            className="text-emerald-800 font-bold hover:underline cursor-pointer"
                          >
                            {order.buyerName || order.buyerEmail || 'Buyer'}
                          </button>
                        </td>
                        <td className="p-3 font-semibold">{order.quantity} Kg</td>
                        <td className="p-3">{renderStatusBadge(order.status)}</td>
                        <td className="p-3">
                          {order.status === 'PENDING' || order.status === 'PLACED' ? (
                            <button
                              onClick={() => handleAcceptOrder(order.id)}
                              disabled={actionLoading === order.id}
                              className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-lg transition disabled:opacity-50 cursor-pointer flex items-center gap-1 text-[11px]"
                            >
                              {actionLoading === order.id ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <span>Accept &bull; Request Fleet</span>
                              )}
                            </button>
                          ) : (
                            <span className="text-[11px] font-bold text-emerald-800">
                              Accepted &bull; Locked
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>

        {/* ════════════════════════════════════════════════════════════
            RIGHT COLUMN: WEATHER, QUICK ACTIONS, SERVICES, GOV (5 COLS)
           ════════════════════════════════════════════════════════════ */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* FARM WEATHER CARD */}
          <div className="agri-card p-5 space-y-3.5 text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <CloudSun className="w-4 h-4 text-emerald-700" />
                <span>Today's Farm Weather</span>
              </h2>
              <span className="text-[11px] text-slate-500 font-medium">
                {farmerLocation}
              </span>
            </div>

            <div className="flex items-baseline justify-between">
              <div>
                <div className="text-3xl font-extrabold text-slate-900">28&deg;C</div>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Partly cloudy with evening showers</p>
              </div>
              <div className="text-right space-y-1">
                <div className="text-xs text-slate-600">
                  Rain prob: <strong className="text-slate-900">68%</strong>
                </div>
                <div className="text-xs text-slate-600">
                  Humidity: <strong className="text-slate-900">82%</strong>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowWeatherModal(true)}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200/80 text-slate-800 font-bold text-xs rounded-lg transition cursor-pointer"
              >
                View 7-Day Agricultural Forecast &rarr;
              </button>
            </div>
          </div>

          {/* QUICK ACTIONS ("What do you need today?") */}
          <div className="agri-card p-5 space-y-3.5 text-left">
            <div className="border-b border-slate-100 pb-2.5">
              <h2 className="text-sm font-bold text-slate-900">
                What do you need today?
              </h2>
              <p className="text-xs text-slate-500">Quick shortcuts to farm tools and support</p>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <Link
                to="/disease-detection"
                className="p-3 rounded-xl border border-slate-200 hover:border-emerald-700 hover:bg-emerald-50/40 transition space-y-1 text-left block"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center">
                  <Leaf className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-900 block">Check Crop Risk</span>
                <span className="text-[10px] text-slate-500 block leading-tight">AI leaf diagnostics</span>
              </Link>

              <Link
                to="/equipment-rental"
                className="p-3 rounded-xl border border-slate-200 hover:border-emerald-700 hover:bg-emerald-50/40 transition space-y-1 text-left block"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center">
                  <Tractor className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-900 block">Find Equipment</span>
                <span className="text-[10px] text-slate-500 block leading-tight">Machinery rentals</span>
              </Link>

              <Link
                to="/supplier-marketplace"
                className="p-3 rounded-xl border border-slate-200 hover:border-emerald-700 hover:bg-emerald-50/40 transition space-y-1 text-left block"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center">
                  <Store className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-900 block">Shop Supplies</span>
                <span className="text-[10px] text-slate-500 block leading-tight">Seeds &amp; inputs</span>
              </Link>

              <Link
                to="/experts"
                className="p-3 rounded-xl border border-slate-200 hover:border-emerald-700 hover:bg-emerald-50/40 transition space-y-1 text-left block"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-900 block">Ask an Expert</span>
                <span className="text-[10px] text-slate-500 block leading-tight">Agronomy advisors</span>
              </Link>
            </div>
          </div>

          {/* FARM SERVICES SECTION */}
          <div className="agri-card p-5 space-y-3.5 text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h2 className="text-sm font-bold text-slate-900">
                Farm Services Nearby
              </h2>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full">
                Verified Hub
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block">🚜 4WD Tractor Service</span>
                  <span className="text-[11px] text-slate-500">Available in Badulla &bull; Rs. 3,500/hr</span>
                </div>
                <Link to="/equipment-rental" className="text-xs font-bold text-emerald-800 hover:underline">
                  Book
                </Link>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block">📦 Hybrid Seed Delivery</span>
                  <span className="text-[11px] text-slate-500">Certified inputs &bull; Next-day dispatch</span>
                </div>
                <Link to="/supplier-marketplace" className="text-xs font-bold text-emerald-800 hover:underline">
                  Browse
                </Link>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block">🚚 Temperature-Controlled Logistics</span>
                  <span className="text-[11px] text-slate-500">Produce collection &bull; Verified fleet</span>
                </div>
                <Link to="/crops" className="text-xs font-bold text-emerald-800 hover:underline">
                  Explore
                </Link>
              </div>
            </div>
          </div>

          {/* OFFICIAL GOVERNMENT ADVISORY */}
          <div className="agri-card p-5 space-y-2.5 text-left bg-gradient-to-br from-white via-slate-50/50 to-emerald-50/20 border-emerald-200/80">
            <div className="flex items-center gap-2">
              <Landmark className="w-4 h-4 text-emerald-800" />
              <span className="text-xs font-bold text-slate-900">
                Agricultural Advisory (Official 🇱🇰)
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Department of Agriculture guidance for Yala season: monitor rainfall intervals and apply fertilizer 48 hours before heavy downpours.
            </p>

            <Link
              to="/gov-intelligence"
              className="text-xs font-bold text-emerald-800 hover:underline inline-flex items-center gap-1 pt-1"
            >
              <span>View Government Intelligence Hub</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

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
