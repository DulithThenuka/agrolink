import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sprout, Sun, AlertTriangle, TrendingUp, ShoppingBag, PlusCircle, ArrowRight, ShieldCheck, DollarSign, Package, CheckCircle2, Loader2, CloudRain, Cpu, Wifi, Droplet, Thermometer } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ordersAPI } from '../services/api';
import { BuyerProfileModal } from '../components/BuyerProfileModal';
import { WeatherIntelligenceModal } from '../components/WeatherIntelligenceModal';
import { IoTFarmControlModal } from '../components/IoTFarmControlModal';

export const FarmerDashboard = () => {
  const { user } = useAuth();
  const farmerName = user?.email ? user.email.split('@')[0] : 'Farmer';

  const [farmerOrders, setFarmerOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [msg, setMsg] = useState('');
  const [selectedBuyer, setSelectedBuyer] = useState(null);
  const [showWeatherModal, setShowWeatherModal] = useState(false);
  const [showIoTModal, setShowIoTModal] = useState(false);

  const fetchFarmerOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await ordersAPI.getFarmerOrders({ page: 0, size: 20 });
      if (res && res.data) {
        setFarmerOrders(res.data.content || []);
      }
    } catch (err) {
      console.error('Failed to load farmer orders:', err);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    fetchFarmerOrders();
  }, []);

  const handleAcceptOrder = async (orderId) => {
    setActionLoading(orderId);
    setMsg('');
    try {
      const res = await ordersAPI.farmerAccept(orderId);
      if (res && (res.success || res.data)) {
        setMsg('✅ Order accepted! Transport requested from logistics fleet.');
        fetchFarmerOrders();
      }
    } catch (err) {
      setMsg(`❌ Acceptance failed: ${err}`);
    } finally {
      setActionLoading(null);
    }
  };

  const lowStockAlerts = [
    { name: 'Red Tomatoes (Batch A)', remaining: 12 },
    { name: 'Green Chillies (Section B)', remaining: 8 },
  ];

  const cropBenchmarks = [
    { crop: 'Samba Rice', current: 210, recommended: 240, demand: 'High 🔥' },
    { crop: 'Red Tomatoes', current: 160, recommended: 185, demand: 'High 🔥' },
    { crop: 'Nuwara Eliya Potatoes', current: 220, recommended: 240, demand: 'Moderate' },
    { crop: 'Green Chillies', current: 350, recommended: 390, demand: 'High 🔥' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8 animate-fade-in">
      {/* TOP GREETING BANNER */}
      <div className="glass rounded-3xl p-8 border border-white/80 shadow-2xl bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-950 text-white relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-wider">
              <Sprout className="w-4 h-4 text-emerald-400" /> Smart Agronomy & Order Dispatch Suite
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-display">
              Good Morning, <span className="capitalize">{farmerName}</span> 👨‍🌾
            </h1>
            <p className="text-emerald-100/80 text-sm max-w-xl">
              Your farm health score is optimal. Review incoming buyer crop orders below to accept and dispatch transport.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 shrink-0">
            <div className="text-center">
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-300 block">Overall Farm Health</span>
              <span className="text-4xl font-extrabold font-display text-white">87%</span>
            </div>
            <div className="w-12 h-12 rounded-full border-4 border-emerald-400 border-t-transparent animate-spin flex items-center justify-center text-lg shadow-inner">
              🌱
            </div>
          </div>
        </div>
      </div>

      {msg && (
        <div className={`p-4 rounded-2xl border font-bold text-xs ${msg.startsWith('✅') ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
          {msg}
        </div>
      )}

      {/* WEATHER INTELLIGENCE SEVERE WARNING BANNER */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-red-950 via-amber-950 to-slate-900 border border-red-800/80 shadow-xl text-white space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-red-500/30 text-red-300 border border-red-400/40 text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-red-400 animate-pulse" /> Severe Weather Risk
            </span>
            <span className="text-xs font-bold text-amber-300">Expected: Tomorrow 3 PM – 8 PM</span>
          </div>

          <button
            type="button"
            onClick={() => setShowWeatherModal(true)}
            className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
          >
            <CloudRain className="w-4 h-4" /> 7-Day Climate &amp; Irrigation Advisory 🌧️
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs items-center">
          <div className="md:col-span-2 space-y-1">
            <h3 className="text-xl font-black text-white font-display flex items-center gap-2">
              <span>⚠ Heavy Rain Warning</span>
              <span className="text-xs font-extrabold bg-red-800 px-2 py-0.5 rounded-full text-red-100">82mm Rain</span>
            </h3>
            <p className="text-red-100/90 text-xs font-medium">
              <strong>Affected Crops:</strong> Tomatoes, Chili • <strong>Recommendation:</strong> Avoid fertilizer application tomorrow.
            </p>
          </div>

          <div className="p-3 bg-red-950/70 rounded-2xl border border-red-800/60 text-center">
            <span className="text-[10px] font-bold text-amber-300 uppercase block">Flooding Risk</span>
            <span className="text-sm font-extrabold text-red-200">HIGH (Flash Flood Warning)</span>
          </div>

          <div className="p-3 bg-indigo-950/70 rounded-2xl border border-indigo-800/60 text-center">
            <span className="text-[10px] font-bold text-indigo-300 uppercase block">Irrigation Advice</span>
            <span className="text-sm font-extrabold text-indigo-200">Pause Drip Irrigation</span>
          </div>
        </div>
      </div>

      {/* IOT SMART FARM LIVE TELEMETRY WIDGET */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950 to-teal-950 border border-emerald-800/80 shadow-xl text-white space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
              <Wifi className="w-3.5 h-3.5 text-emerald-400 animate-pulse" /> ESP32 IoT Live Telemetry Stream
            </span>
            <span className="text-xs font-mono font-bold text-slate-300">Device: ESP32-AGRO-8941</span>
          </div>

          <button
            type="button"
            onClick={() => setShowIoTModal(true)}
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
          >
            <Cpu className="w-4 h-4" /> Open IoT Irrigation Controller 🌱
          </button>
        </div>

        {/* SENSOR VALUE TILES */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs text-center">
          <div className="p-3 bg-amber-950/70 rounded-2xl border border-amber-800/60">
            <span className="text-[10px] font-bold text-amber-300 uppercase block">Soil Moisture</span>
            <span className="text-xl font-black text-amber-100 font-display">32% ⚠</span>
          </div>

          <div className="p-3 bg-slate-950/70 rounded-2xl border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Temperature</span>
            <span className="text-xl font-black text-white font-display">29°C</span>
          </div>

          <div className="p-3 bg-blue-950/70 rounded-2xl border border-blue-800/60">
            <span className="text-[10px] font-bold text-blue-300 uppercase block">Humidity</span>
            <span className="text-xl font-black text-blue-100 font-display">71%</span>
          </div>

          <div className="p-3 bg-emerald-950/70 rounded-2xl border border-emerald-800/60">
            <span className="text-[10px] font-bold text-emerald-300 uppercase block">Motor Status</span>
            <span className="text-sm font-extrabold text-emerald-300">AUTO-OFF</span>
          </div>

          <div className="p-3 bg-purple-950/70 rounded-2xl border border-purple-800/60 col-span-2 sm:col-span-1">
            <span className="text-[10px] font-bold text-purple-300 uppercase block">Water Tank</span>
            <span className="text-xl font-black text-purple-100 font-display">38%</span>
          </div>
        </div>

        <div className="p-3 bg-emerald-950/90 rounded-2xl border border-emerald-800/60 flex items-center justify-between text-xs flex-wrap gap-2">
          <p className="text-emerald-200 font-bold">
            🤖 <strong>AI IoT Recommendation:</strong> Irrigation required within the next 4 hours.
          </p>
          <span className="text-[10px] font-black uppercase text-emerald-400 bg-emerald-900 px-2 py-0.5 rounded border border-emerald-700">
            Automatic Irrigation Ready
          </span>
        </div>
      </div>

      {/* WASTE REDUCTION & PRODUCE RESCUE WIDGET */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 border border-emerald-700/80 shadow-xl text-white space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
              ♻️ AgroLink Waste Reduction Engine
            </span>
            <span className="text-xs font-bold text-amber-300">Produce Risk Flagged: HIGH</span>
          </div>

          <Link
            to="/waste-reduction"
            className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-black text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
          >
            Launch Produce Rescue ♻️
          </Link>
        </div>

        <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
          <div>
            <h4 className="text-sm font-extrabold text-white font-display">
              ⚠ 500kg Tomatoes • Expiry in 2 Days
            </h4>
            <p className="text-slate-300 text-xs mt-0.5">
              Automated Rescue Recommendations ready: <strong>Reduce price 15%</strong> • Match <strong>Restaurant A, Hotel B, Supermarket C</strong> • Donate <strong>Food Bank D</strong> • Process <strong>Sauce Factory E</strong>.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              to="/waste-reduction"
              className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs transition"
            >
              Apply 15% Price Reduction
            </Link>
          </div>
        </div>
      </div>

      {/* RISK & MARKET MATRIX */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <motion.div
          whileHover={{ y: -3 }}
          onClick={() => setShowWeatherModal(true)}
          className="premium-card p-6 bg-white border border-slate-100/90 shadow-md flex items-center justify-between cursor-pointer group"
        >
          <div className="space-y-1">
            <p className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Weather Intelligence</p>
            <h3 className="text-2xl font-extrabold font-display text-red-600 flex items-center gap-1.5">
              High Risk 🌧️
            </h3>
            <p className="text-[11px] text-red-700 font-semibold">82mm Heavy Rain Tomorrow • Click Details</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center text-2xl font-bold border border-red-100 group-hover:scale-105 transition">
            <CloudRain className="w-6 h-6 text-red-600" />
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -3 }} className="premium-card p-6 bg-white border border-slate-100/90 shadow-md flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Crop Disease Risk</p>
            <h3 className="text-2xl font-extrabold font-display text-amber-600 flex items-center gap-1.5">
              Medium ⚠️
            </h3>
            <p className="text-[11px] text-amber-700 font-semibold">Fungal alert for Solanaceae</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-2xl font-bold border border-amber-100">
            <AlertTriangle className="w-6 h-6 text-amber-600" />
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -3 }} className="premium-card p-6 bg-white border border-slate-100/90 shadow-md flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Market Demand</p>
            <h3 className="text-2xl font-extrabold font-display text-teal-600 flex items-center gap-1.5">
              High 🔥
            </h3>
            <p className="text-[11px] text-teal-700 font-semibold">Strong commercial buyer interest</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center text-2xl font-bold border border-teal-100">
            <TrendingUp className="w-6 h-6 text-teal-600" />
          </div>
        </motion.div>
      </div>

      {/* PENDING BUYER ORDERS & LOGISTICS DISPATCH TABLE */}
      <div className="premium-card p-6 bg-white border border-slate-100/90 shadow-lg space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900 font-display">Incoming Crop Orders &amp; Logistics Requests</h3>
            <p className="text-slate-500 text-xs font-medium">Accept buyer orders to trigger automated driver pickup and smart tracking</p>
          </div>
          <Link to="/crops/add" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center gap-1.5">
            <PlusCircle className="w-4 h-4" /> Publish New Batch
          </Link>
        </div>

        {loadingOrders ? (
          <div className="py-8 text-center text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-emerald-600 mb-2" />
            <span className="text-xs font-semibold">Scanning harvest orders...</span>
          </div>
        ) : farmerOrders.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
            <p className="text-sm font-bold text-slate-700">No Incoming Buyer Orders</p>
            <p className="text-xs text-slate-500">Orders placed on your crop listings will appear here for acceptance.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-100">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-400 font-bold uppercase text-[10px] tracking-widest border-b border-slate-100">
                <tr>
                  <th className="p-4">Harvest Item</th>
                  <th className="p-4">Buyer Account</th>
                  <th className="p-4">Quantity</th>
                  <th className="p-4">Fulfillment Status</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                {farmerOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-emerald-50/40 transition">
                    <td className="p-4 font-bold text-slate-900">{order.cropName}</td>
                    <td className="p-4 text-slate-500 text-xs">
                      <button
                        type="button"
                        onClick={() => setSelectedBuyer({ id: order.buyerId, name: order.buyerName, email: order.buyerEmail })}
                        className="text-emerald-700 font-bold hover:underline flex items-center gap-1"
                      >
                        <span>{order.buyerEmail || order.buyerName || 'Buyer'}</span>
                        <span className="text-[9px] bg-blue-100 text-blue-800 font-black px-1.5 py-0.5 rounded">Verified Buyer ⭐</span>
                      </button>
                    </td>
                    <td className="p-4 font-extrabold text-slate-800">{order.quantity} Kg</td>
                    <td className="p-4">
                      <span className="badge-premium badge-pending uppercase text-[10px]">
                        {order.statusLabel || order.status}
                      </span>
                    </td>
                    <td className="p-4">
                      {order.status === 'PENDING' ? (
                        <button
                          onClick={() => handleAcceptOrder(order.id)}
                          disabled={actionLoading === order.id}
                          className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-xl transition flex items-center gap-1.5 disabled:opacity-50"
                        >
                          {actionLoading === order.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Accept Order &amp; Request Transport</span>
                            </>
                          )}
                        </button>
                      ) : (
                        <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Order Accepted
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
          location="Nuwara Eliya"
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
