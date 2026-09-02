import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Building2,
  FileText,
  MessageSquare,
  ShoppingBag,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Truck,
  Loader2,
  Sparkles,
  LogOut,
  ArrowRight,
  Sprout,
  BarChart3,
  DollarSign,
  Search,
  Filter,
  RefreshCw,
  QrCode,
  MapPin,
  Layers
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ordersAPI, contractFarmingAPI, negotiationAPI } from '../services/api';
import { BuyerProfileModal } from '../components/BuyerProfileModal';

export const BusinessBuyerDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const companyName = user?.email ? user.email.split('@')[0] : 'Enterprise Buyer';

  const [orders, setOrders] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [negotiations, setNegotiations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBuyer, setSelectedBuyer] = useState(null);

  const loadEnterpriseData = async () => {
    setLoading(true);
    try {
      // 1. Fetch wholesale orders
      const ordersRes = await ordersAPI.getMyOrders({ page: 0, size: 10 });
      if (ordersRes && ordersRes.data) {
        setOrders(ordersRes.data.content || []);
      } else {
        setOrders([
          {
            id: 701,
            cropName: 'Organic Keeri Samba Rice (Bulk Grade A)',
            quantity: 5000,
            status: 'REEFER_TRANSIT',
            totalPrice: 1350000,
            seller: 'Polonnaruwa Paddy Cooperative',
            date: '2026-08-30',
            batchCode: 'BATCH-LK-2026-0891'
          },
          {
            id: 702,
            cropName: 'Upcountry Red Potatoes (Wholesale Export Grade)',
            quantity: 3200,
            status: 'ESCROW_LOCKED',
            totalPrice: 896000,
            seller: 'Welimada Highland Farmers Group',
            date: '2026-09-01',
            batchCode: 'BATCH-LK-2026-0904'
          },
          {
            id: 703,
            cropName: 'Ceylon Cinnamon Alba (Grade 1 Cleaned)',
            quantity: 450,
            status: 'DELIVERED',
            totalPrice: 1710000,
            seller: 'Galle Organic Spices Cluster',
            date: '2026-08-22',
            batchCode: 'BATCH-LK-2026-0744'
          }
        ]);
      }

      // 2. Fetch active forward contracts
      const contractsRes = await contractFarmingAPI.getAll();
      if (contractsRes && contractsRes.data) {
        setContracts(Array.isArray(contractsRes.data) ? contractsRes.data : []);
      } else {
        setContracts([
          {
            id: 1,
            crop: 'Organic Keeri Samba',
            targetVolume: '25 MT',
            guaranteedPrice: 'Rs 270 / Kg',
            growerGroup: 'North Central Farmers Union',
            season: 'Maha 2026/27',
            status: 'CONTRACT_ACTIVE',
            advancePaid: 'Rs 1,500,000'
          },
          {
            id: 2,
            crop: 'Fresh Green Chillies (MICH 01)',
            targetVolume: '8 MT',
            guaranteedPrice: 'Rs 520 / Kg',
            growerGroup: 'Matale Spice Growers',
            season: 'Yala 2026',
            status: 'HARVEST_IN_PROGRESS',
            advancePaid: 'Rs 800,000'
          }
        ]);
      }

      // 3. Fetch trade negotiations
      const negRes = await negotiationAPI.getNegotiation();
      if (negRes && negRes.data) {
        setNegotiations(Array.isArray(negRes.data) ? negRes.data : []);
      } else {
        setNegotiations([
          {
            id: 401,
            cropName: 'Nuwara Eliya Leeks (Grade AA)',
            offeredPrice: 310,
            counterPrice: 285,
            volume: '4.5 MT',
            farmer: 'Haputale Agro Consortium',
            status: 'COUNTER_OFFER_RECEIVED'
          },
          {
            id: 402,
            cropName: 'Cavendish Banana (Cleaned & Crated)',
            offeredPrice: 140,
            counterPrice: 140,
            volume: '10 MT',
            farmer: 'Embilipitiya Fruit Growers',
            status: 'AGREEMENT_REACHED'
          }
        ]);
      }
    } catch (err) {
      console.error('Failed to load enterprise buyer data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEnterpriseData();
  }, []);

  const totalProcuredKg = orders.reduce((acc, curr) => acc + (Number(curr.quantity) || 0), 0);
  const totalEscrowCapital = orders.reduce((acc, curr) => acc + (Number(curr.totalPrice) || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8 animate-fade-in">
      {/* HERO HEADER */}
      <div className="glass rounded-3xl p-8 border border-white/80 shadow-2xl bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-950 text-white relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold uppercase tracking-wider">
              <Building2 className="w-4 h-4 text-blue-400" /> Enterprise Sourcing &amp; B2B Procurement
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-display text-white">
              Enterprise Buyer: <span className="capitalize">{companyName}</span> 🏢
            </h1>
            <p className="text-blue-100/80 text-sm max-w-2xl leading-relaxed">
              Manage multi-ton harvest forward contracts, automated escrow vaults, cold-chain reefer logistics, and wholesale trade negotiations across Sri Lanka.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/contracts"
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition flex items-center gap-2"
            >
              <FileText className="w-4 h-4" /> B2B Contracts Sourcing
            </Link>
            <button
              onClick={() => { logout(); navigate('/login'); }}
              className="px-4 py-3 rounded-2xl bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 text-red-200 font-bold text-xs backdrop-blur-md transition flex items-center gap-1.5"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      </div>

      {/* METRIC STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="premium-card p-6 bg-white border border-slate-100 shadow-md hover:shadow-xl transition-all duration-300 flex items-center justify-between group">
          <div className="space-y-1">
            <p className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Procurement Volume</p>
            <h2 className="text-3xl font-extrabold font-display text-slate-900">{(totalProcuredKg / 1000).toFixed(1)} MT</h2>
            <p className="text-[11px] font-bold text-emerald-600">{totalProcuredKg.toLocaleString()} Kg Sourced</p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shadow-sm group-hover:scale-110 transition duration-300">
            <Layers className="w-7 h-7" />
          </div>
        </div>

        <div className="premium-card p-6 bg-white border border-slate-100 shadow-md hover:shadow-xl transition-all duration-300 flex items-center justify-between group">
          <div className="space-y-1">
            <p className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Forward Contracts</p>
            <h2 className="text-3xl font-extrabold font-display text-indigo-600">{contracts.length}</h2>
            <p className="text-[11px] font-bold text-slate-500">Guaranteed Harvests</p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shadow-sm group-hover:scale-110 transition duration-300">
            <FileText className="w-7 h-7" />
          </div>
        </div>

        <div className="premium-card p-6 bg-white border border-slate-100 shadow-md hover:shadow-xl transition-all duration-300 flex items-center justify-between group">
          <div className="space-y-1">
            <p className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Active Negotiations</p>
            <h2 className="text-3xl font-extrabold font-display text-amber-600">{negotiations.length}</h2>
            <p className="text-[11px] font-bold text-amber-600">Wholesale Counter-Offers</p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center shadow-sm group-hover:scale-110 transition duration-300">
            <MessageSquare className="w-7 h-7" />
          </div>
        </div>

        <div className="premium-card p-6 bg-white border border-slate-100 shadow-md hover:shadow-xl transition-all duration-300 flex items-center justify-between group">
          <div className="space-y-1">
            <p className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Escrow Capital</p>
            <h2 className="text-2xl font-extrabold font-display text-emerald-700">Rs {totalEscrowCapital.toLocaleString()}</h2>
            <p className="text-[11px] font-bold text-slate-500">100% Vault Protected</p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shadow-sm group-hover:scale-110 transition duration-300">
            <ShieldCheck className="w-7 h-7" />
          </div>
        </div>
      </div>

      {/* QUICK ACTIONS PORTAL */}
      <div className="premium-card p-6 bg-white border border-slate-100 shadow-md space-y-4">
        <h2 className="text-base font-bold text-slate-800 font-display flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-600" /> Enterprise Sourcing Portals
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/contracts"
            className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/70 hover:shadow-md transition flex items-center justify-between group"
          >
            <div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition">B2B Forward Contracts</h3>
              <p className="text-xs text-slate-500 mt-0.5">Secure guaranteed seasonal harvests</p>
            </div>
            <ArrowRight className="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition" />
          </Link>

          <Link
            to="/negotiation"
            className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/70 hover:shadow-md transition flex items-center justify-between group"
          >
            <div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-amber-700 transition">Trade Negotiations</h3>
              <p className="text-xs text-slate-500 mt-0.5">Counter-offer multi-ton farmgate prices</p>
            </div>
            <ArrowRight className="w-5 h-5 text-amber-600 group-hover:translate-x-1 transition" />
          </Link>

          <Link
            to="/demand-forecasting"
            className="p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-teal-50 border border-purple-200/70 hover:shadow-md transition flex items-center justify-between group"
          >
            <div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-purple-700 transition">Demand Forecasting</h3>
              <p className="text-xs text-slate-500 mt-0.5">National consumption &amp; shortage models</p>
            </div>
            <BarChart3 className="w-5 h-5 text-purple-600 group-hover:scale-110 transition" />
          </Link>

          <Link
            to="/crops"
            className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/70 hover:shadow-md transition flex items-center justify-between group"
          >
            <div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition">Wholesale Produce Hub</h3>
              <p className="text-xs text-slate-500 mt-0.5">Browse live verified crop listings</p>
            </div>
            <Sprout className="w-5 h-5 text-emerald-600 group-hover:scale-110 transition" />
          </Link>
        </div>
      </div>

      {/* RECENT B2B WHOLESALE ORDERS TABLE */}
      <div className="premium-card p-6 bg-white border border-slate-100 shadow-md space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-base font-bold text-slate-800 font-display">Wholesale Procurement Orders</h2>
            <p className="text-xs text-slate-500">Live multi-ton batches in transit with cold-chain monitoring</p>
          </div>
          <Link to="/orders" className="text-xs text-blue-600 hover:text-blue-700 font-bold transition flex items-center gap-1">
            View All B2B Orders <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="py-8 text-center text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-blue-600 mb-2" />
            <span className="text-xs font-semibold">Loading enterprise procurement records...</span>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
            <p className="text-sm font-bold text-slate-700">No Enterprise Orders Yet</p>
            <p className="text-xs text-slate-500">Initiate bulk purchases or forward contracts to populate sourcing pipeline.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-100">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-400 font-bold uppercase text-[10px] tracking-widest border-b border-slate-100">
                <tr>
                  <th className="p-4">Batch &amp; Produce</th>
                  <th className="p-4">Grower Cluster</th>
                  <th className="p-4">Volume</th>
                  <th className="p-4">Escrow Value</th>
                  <th className="p-4">Logistics / Escrow Status</th>
                  <th className="p-4 text-right">Traceability</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-blue-50/30 transition">
                    <td className="p-4">
                      <div className="font-bold text-slate-900">{order.cropName || 'Wholesale Batch'}</div>
                      <div className="text-xs font-mono text-blue-600">{order.batchCode || `#ORD-${order.id}`}</div>
                    </td>
                    <td className="p-4 text-xs font-medium text-slate-600">{order.seller || 'Sri Lankan Cooperative'}</td>
                    <td className="p-4 font-bold text-slate-900">{order.quantity ? `${(order.quantity / 1000).toFixed(1)} MT` : 'Bulk MT'}</td>
                    <td className="p-4 font-bold text-emerald-700">
                      {order.totalPrice ? `Rs ${Number(order.totalPrice).toLocaleString()}` : 'Rs Escrow Locked'}
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        order.status === 'DELIVERED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : order.status === 'REEFER_TRANSIT'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {order.status || 'PROCESSING'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <Link
                        to={`/trace/${order.batchCode || 'DEMO-BATCH'}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 transition"
                      >
                        <QrCode className="w-3.5 h-3.5" /> Trace
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ACTIVE FORWARD CONTRACTS */}
      <div className="premium-card p-6 bg-white border border-slate-100 shadow-md space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-base font-bold text-slate-800 font-display">B2B Forward Contracts Pipeline</h2>
            <p className="text-xs text-slate-500">Guaranteed crop volume procurement with registered farmer clusters</p>
          </div>
          <Link to="/contracts" className="text-xs text-blue-600 hover:text-blue-700 font-bold transition flex items-center gap-1">
            Contract Farming Hub <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contracts.map((c) => (
            <div key={c.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:border-indigo-300 transition space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-indigo-100 text-indigo-800">
                    {c.season}
                  </span>
                  <h3 className="font-bold text-sm text-slate-900 mt-1">{c.crop}</h3>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  {c.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-200/60">
                <div>
                  <p className="text-slate-400 font-medium text-[11px]">Committed Volume</p>
                  <p className="font-bold text-slate-800">{c.targetVolume}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-medium text-[11px]">Guaranteed Farmgate Price</p>
                  <p className="font-bold text-slate-800">{c.guaranteedPrice}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-medium text-[11px]">Grower Group</p>
                  <p className="font-bold text-slate-800 truncate">{c.growerGroup}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-medium text-[11px]">Advance Capital Released</p>
                  <p className="font-bold text-emerald-700">{c.advancePaid}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BusinessBuyerDashboard;
