import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sprout,
  PlusCircle,
  ShieldCheck,
  CheckCircle2,
  Loader2,
  CloudRain,
  Cpu,
  BarChart3,
  Award,
  Sparkles
} from 'lucide-react';
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

  // Financial & Benchmark State
  const [selectedSeason, setSelectedSeason] = useState('Yala 2026');

  const SEASONAL_FINANCIALS = {
    grossRevenue: 1480000,
    fertilizerCost: 240000,
    equipmentRentalCost: 120000,
    logisticsCost: 85000,
    irrigationCost: 45000,
    netProfit: 990000,
    profitMarginPct: 66.9
  };

  const YIELD_BENCHMARKS = [
    {
      crop: '🍅 Organic Tomatoes',
      myYield: '9.2 MT / Acre',
      districtAvg: '7.8 MT / Acre',
      diffPct: 17.9,
      status: 'TOP 10% PRODUCER',
      color: 'emerald'
    },
    {
      crop: '🌾 Polonnaruwa Samba Paddy',
      myYield: '4.6 MT / Acre',
      districtAvg: '4.1 MT / Acre',
      diffPct: 12.2,
      status: 'HIGH EFFICIENCY',
      color: 'emerald'
    },
    {
      crop: '🥔 Upcountry Red Potatoes',
      myYield: '8.4 MT / Acre',
      districtAvg: '8.0 MT / Acre',
      diffPct: 5.0,
      status: 'ABOVE AVERAGE',
      color: 'blue'
    }
  ];

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

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8 animate-fade-in">

      {/* TOP GREETING BANNER */}
      <div className="glass rounded-3xl p-8 border border-white/80 shadow-2xl bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-950 text-white relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-wider">
              <Sprout className="w-4 h-4 text-emerald-400" /> Smart Agronomy &amp; Financial Suite
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-display text-white">
              Welcome Back, <span className="capitalize">{farmerName}</span> 👨‍🌾
            </h1>
            <p className="text-emerald-100/80 text-sm max-w-xl">
              Your farm health score is optimal. Review seasonal revenue breakdown, district yield benchmarks, and incoming crop orders.
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

      {/* QUICK SMART ACTION TILES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          whileHover={{ y: -3 }}
          onClick={() => setShowIoTModal(true)}
          className="premium-card p-6 bg-white border border-slate-100/90 shadow-md flex items-center justify-between cursor-pointer group"
        >
          <div className="space-y-1">
            <p className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">IoT Farm Controller</p>
            <h3 className="text-xl font-extrabold font-display text-emerald-700 flex items-center gap-1.5">
              Online 📡
            </h3>
            <p className="text-[11px] text-emerald-800 font-semibold">ESP32 Soil &amp; Auto Valves</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl font-bold border border-emerald-100 group-hover:scale-105 transition">
            <Cpu className="w-6 h-6 text-emerald-600" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -3 }}
          onClick={() => setShowWeatherModal(true)}
          className="premium-card p-6 bg-white border border-slate-100/90 shadow-md flex items-center justify-between cursor-pointer group"
        >
          <div className="space-y-1">
            <p className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Weather Intelligence</p>
            <h3 className="text-xl font-extrabold font-display text-amber-600 flex items-center gap-1.5">
              82mm Rain 🌧️
            </h3>
            <p className="text-[11px] text-amber-700 font-semibold">Click for 7-Day Forecast</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-2xl font-bold border border-amber-100 group-hover:scale-105 transition">
            <CloudRain className="w-6 h-6 text-amber-600" />
          </div>
        </motion.div>

        <Link to="/crop-disease" className="block">
          <motion.div whileHover={{ y: -3 }} className="premium-card p-6 bg-white border border-slate-100/90 shadow-md flex items-center justify-between cursor-pointer group">
            <div className="space-y-1">
              <p className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">AI Disease Scanner</p>
              <h3 className="text-xl font-extrabold font-display text-blue-600 flex items-center gap-1.5">
                Scan Leaf 🔬
              </h3>
              <p className="text-[11px] text-blue-700 font-semibold">CNN Vision Pathology</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl font-bold border border-blue-100 group-hover:scale-105 transition">
              <Sparkles className="w-6 h-6 text-blue-600" />
            </div>
          </motion.div>
        </Link>

        <Link to="/contract-farming" className="block">
          <motion.div whileHover={{ y: -3 }} className="premium-card p-6 bg-white border border-slate-100/90 shadow-md flex items-center justify-between cursor-pointer group">
            <div className="space-y-1">
              <p className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Contract Farming</p>
              <h3 className="text-xl font-extrabold font-display text-teal-600 flex items-center gap-1.5">
                Escrow Terms 🌾
              </h3>
              <p className="text-[11px] text-teal-700 font-semibold">Guaranteed Buyback Tenders</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center text-2xl font-bold border border-teal-100 group-hover:scale-105 transition">
              <ShieldCheck className="w-6 h-6 text-teal-600" />
            </div>
          </motion.div>
        </Link>
      </div>

      {/* 📊 NEW: SEASONAL REVENUE VS. INPUT COST BREAKDOWN & YIELD BENCHMARKS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* FINANCIAL PROFIT & EXPENSE BREAKDOWN (7 Cols) */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-lg space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 font-display">
                  Seasonal Revenue vs. Input Costs
                </h3>
                <p className="text-xs text-slate-400 font-medium">Real-time ledger tracking farm cashflow</p>
              </div>
            </div>

            <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase">
              {selectedSeason}
            </span>
          </div>

          {/* NET PROFIT HERO CARD */}
          <div className="p-5 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white rounded-2xl border border-slate-800 shadow-md flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">
                Net Harvest Profit
              </span>
              <div className="text-3xl font-black font-display text-emerald-400">
                Rs. {SEASONAL_FINANCIALS.netProfit.toLocaleString()}
              </div>
              <span className="text-xs text-slate-300 font-medium">
                Overall Net Profit Margin: <strong>{SEASONAL_FINANCIALS.profitMarginPct}%</strong>
              </span>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Gross Sales</span>
              <span className="text-lg font-extrabold text-white font-display">
                Rs. {SEASONAL_FINANCIALS.grossRevenue.toLocaleString()}
              </span>
            </div>
          </div>

          {/* ITEMIZED EXPENSE PROGRESS BARS */}
          <div className="space-y-3 text-xs font-semibold">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
              Expense Allocation Breakdown:
            </span>

            <div className="space-y-1.5">
              <div className="flex justify-between text-slate-600">
                <span>🌱 Fertilizer &amp; Agronomic Inputs:</span>
                <span className="font-bold text-slate-900">Rs. {SEASONAL_FINANCIALS.fertilizerCost.toLocaleString()} (16.2%)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '16.2%' }} />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-slate-600">
                <span>🚜 Machinery &amp; Equipment Rental:</span>
                <span className="font-bold text-slate-900">Rs. {SEASONAL_FINANCIALS.equipmentRentalCost.toLocaleString()} (8.1%)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-teal-500 rounded-full" style={{ width: '8.1%' }} />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-slate-600">
                <span>🚚 Flatbed Reefer Logistics:</span>
                <span className="font-bold text-slate-900">Rs. {SEASONAL_FINANCIALS.logisticsCost.toLocaleString()} (5.7%)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-sky-500 rounded-full" style={{ width: '5.7%' }} />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-slate-600">
                <span>💧 IoT Drip Irrigation &amp; Power:</span>
                <span className="font-bold text-slate-900">Rs. {SEASONAL_FINANCIALS.irrigationCost.toLocaleString()} (3.0%)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: '3.0%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* REGIONAL DISTRICT YIELD BENCHMARKS (5 Cols) */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-lg space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-50 text-amber-700 border border-amber-100">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 font-display">
                  District Yield Benchmarks
                </h3>
                <p className="text-xs text-slate-400 font-medium">Comparison vs. Regional Average</p>
              </div>
            </div>

            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10px] font-black uppercase">
              Top 10%
            </span>
          </div>

          <div className="space-y-3.5">
            {YIELD_BENCHMARKS.map((bench) => (
              <div
                key={bench.crop}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5"
              >
                <div className="flex justify-between items-center">
                  <span className="font-extrabold text-slate-900 text-xs font-display">{bench.crop}</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
                    +{bench.diffPct}% vs Avg 🚀
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 bg-white rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold block">Your Plot Yield:</span>
                    <strong className="text-emerald-700 text-sm">{bench.myYield}</strong>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold block">District Average:</span>
                    <strong className="text-slate-600 text-sm">{bench.districtAvg}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 font-semibold space-y-0.5">
            <span className="font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Agronomic Tip:
            </span>
            <p className="text-[11px] text-emerald-800">
              Your drip irrigation timing improved tomato yield by 17.9% compared to the Welimada district mean.
            </p>
          </div>
        </div>

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
                        className="text-emerald-700 font-bold hover:underline flex items-center gap-1 cursor-pointer"
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
                          className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-xl transition flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
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

export default FarmerDashboard;
