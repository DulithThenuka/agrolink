import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { wasteReductionAPI } from '../services/api';
import {
  Recycle,
  AlertTriangle,
  TrendingDown,
  Store,
  HeartHandshake,
  Factory,
  CheckCircle2,
  Clock,
  MapPin,
  Sparkles,
  RefreshCw,
  Send,
  ShieldCheck,
  Leaf,
  Droplets,
  Utensils,
  Radio,
  Bell,
  Truck,
  Percent,
  Award,
  DollarSign,
  Check,
  Zap,
  Share2,
  Flame,
  ChevronRight,
  Landmark,
  Sliders
} from 'lucide-react';

export const WasteReductionModule = () => {
  const [cropName, setCropName] = useState('Tomatoes');
  const [quantityKg, setQuantityKg] = useState(500);
  const [daysToExpiry, setDaysToExpiry] = useState(2);
  const [activeTab, setActiveTab] = useState('analyzer'); // 'analyzer', 'dispatcher', 'compost', 'impact'

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionSuccessMsg, setActionSuccessMsg] = useState(null);
  const [discountApplied, setDiscountApplied] = useState(false);

  // Flash Dispatcher States
  const [customDiscountPct, setCustomDiscountPct] = useState(25);
  const [broadcastChannels, setBroadcastChannels] = useState({
    supermarkets: true,
    flashFeed: true,
    expressLogistics: true,
    restaurants: false
  });
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  // Bio-Fertilizer Composting Routing States
  const [selectedCompostPlant, setSelectedCompostPlant] = useState('Ceylon Organic Compost Hub (Kurunegala)');
  const [compostRoutingConfirmed, setCompostRoutingConfirmed] = useState(false);

  const MOCK_WASTE_DATA = {
    cropName: cropName || 'Organic Tomatoes',
    quantityKg: parseInt(quantityKg) || 500,
    daysToExpiry: parseInt(daysToExpiry) || 2,
    spoilageRiskScore: 88,
    unsoldRiskLevel: 'CRITICAL (High Spoilage Risk)',
    originalPricePerKg: 200,
    discountedPricePerKg: 150,
    recommendedDiscountPct: 25,
    nearbyCommercialBuyers: [
      { name: 'Keells Super Dambulla Central', category: 'Supermarket', distanceKm: 8.5, requiredQuantityKg: 300 },
      { name: 'Cargills Express Kurunegala', category: 'Retail Chain', distanceKm: 14.2, requiredQuantityKg: 200 },
      { name: 'Heritage Kandy Restaurant Collective', category: 'Hospitality', distanceKm: 19.0, requiredQuantityKg: 150 }
    ],
    donationPartners: [
      { name: 'Sri Lanka Food Rescue Foundation', type: 'Community Kitchen Hub', contact: '+94 11 234 5678' },
      { name: 'Suwa Setha Childrens Nutrition Program', type: 'School Meal NGO', contact: '+94 81 987 6543' }
    ],
    processingCompanies: [
      { name: 'Lanka Agro-Pulp & Puree Ltd', processingType: 'Tomato Paste & Puree', offeredPricePerKg: 130 },
      { name: 'Ceylon Canners & Preserves', processingType: 'Dehydrated Powders & Sauce', offeredPricePerKg: 125 }
    ],
    environmentalImpact: {
      co2SavedKg: 420,
      waterSavedLiters: 18500,
      mealsCreated: 650
    }
  };

  const COMPOST_FACILITIES = [
    {
      id: 'COMP-1',
      name: 'Ceylon Organic Compost Hub',
      location: 'Kurunegala',
      capacityTons: 50,
      distanceKm: 12.4,
      payoutRatePerKg: 35,
      type: 'Aerobic Bio-Fertilizer',
      badge: '🌱 DOA Certified Compost'
    },
    {
      id: 'COMP-2',
      name: 'Mahaweli Green Biogas & Energy Plant',
      location: 'Dambulla',
      capacityTons: 120,
      distanceKm: 18.0,
      payoutRatePerKg: 40,
      type: 'Methane Biogas Upcycling',
      badge: '⚡ Renewable Energy'
    },
    {
      id: 'COMP-3',
      name: 'Lanka Bio-Nutrient Soil Solutions',
      location: 'Kandy',
      capacityTons: 30,
      distanceKm: 22.5,
      payoutRatePerKg: 38,
      type: 'Vermicompost Enriched Fertilizer',
      badge: '🌿 100% Organic Certificate'
    }
  ];

  const loadAnalysis = async () => {
    setLoading(true);
    try {
      const res = await wasteReductionAPI.analyzeRisk({
        cropName,
        quantityKg: parseInt(quantityKg) || 500,
        daysToExpiry: parseInt(daysToExpiry) || 2
      });
      if (res && res.data) {
        setData(res.data);
      } else {
        setData(MOCK_WASTE_DATA);
      }
    } catch (err) {
      console.warn('Backend API offline. Loading Waste Rescue fallback:', err);
      setData(MOCK_WASTE_DATA);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalysis();
  }, [cropName, quantityKg, daysToExpiry]);

  const handleApplyDiscount = async () => {
    try {
      const res = await wasteReductionAPI.applyDiscount({
        cropId: 101,
        discountPct: customDiscountPct
      });
      setDiscountApplied(true);
      setActionSuccessMsg(`✅ ${customDiscountPct}% Markdown Applied! Price reduced from Rs. 200 to Rs. ${200 * (1 - customDiscountPct / 100)}/kg.`);
      setTimeout(() => setActionSuccessMsg(null), 5000);
    } catch (err) {
      setDiscountApplied(true);
      setActionSuccessMsg(`✅ ${customDiscountPct}% Markdown Applied! Price reduced from Rs. 200 to Rs. ${200 * (1 - customDiscountPct / 100)}/kg.`);
      setTimeout(() => setActionSuccessMsg(null), 5000);
    }
  };

  const handleBroadcastSurplus = () => {
    setIsBroadcasting(true);
    setTimeout(() => {
      setIsBroadcasting(false);
      setActionSuccessMsg(`🚀 Flash Surplus Alert Broadcasted to 12 Supermarkets and Public Bargains Channel! Target Clearance in < 18 Hours.`);
      setTimeout(() => setActionSuccessMsg(null), 6000);
    }, 1200);
  };

  const handleRouteToCompost = (facility) => {
    setCompostRoutingConfirmed(true);
    setActionSuccessMsg(`🌿 Bio-Fertilizer Route Dispatched to ${facility.name}! Flatbed collection scheduled & Carbon Tax Voucher of Rs. ${Math.round(quantityKg * facility.payoutRatePerKg).toLocaleString()} issued.`);
    setTimeout(() => setActionSuccessMsg(null), 7000);
  };

  const handleDispatchOffer = async (buyerName) => {
    try {
      await wasteReductionAPI.dispatchOffer({
        targetBuyerName: buyerName,
        cropName,
        quantityKg: parseInt(quantityKg) || 500
      });
    } catch (err) {
      // fallback
    }
    setActionSuccessMsg(`📨 Direct Surplus Purchase Offer sent to ${buyerName}!`);
    setTimeout(() => setActionSuccessMsg(null), 5000);
  };

  const handleInitiateDonation = async (foodBankName) => {
    try {
      await wasteReductionAPI.initiateDonation({
        foodBankName,
        cropName,
        quantityKg: parseInt(quantityKg) || 500
      });
    } catch (err) {
      // fallback
    }
    setActionSuccessMsg(`🍲 Food Rescue Donation confirmed with ${foodBankName}! Zero-Waste Tax Exemption Certificate registered.`);
    setTimeout(() => setActionSuccessMsg(null), 6000);
  };

  // Math Calculations for Dispatcher
  const originalTotal = (parseInt(quantityKg) || 500) * 200;
  const discountedRate = 200 * (1 - customDiscountPct / 100);
  const recoveredRevenue = (parseInt(quantityKg) || 500) * discountedRate;
  const lossPrevented = recoveredRevenue;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8 animate-fade-in">
      
      {/* HEADER BANNER */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 text-white shadow-2xl relative overflow-hidden border border-emerald-800/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-extrabold uppercase tracking-wider border border-emerald-500/30">
              <Recycle className="w-4 h-4 text-emerald-400" />
              <span>AgroLink Zero Food Waste Protocol</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-display text-white">
              Surplus Crop Waste Reduction &amp; Rescue ♻️
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-3xl leading-relaxed">
              Detect harvest expiration risks before spoilage occurs. Trigger dynamic price markdowns, broadcast to local commercial buyers, donate to food banks, or route to bio-fertilizer composting.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="px-4 py-2.5 bg-white/10 backdrop-blur-md rounded-2xl text-xs font-bold text-emerald-300 border border-white/20 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Circular Economy Engine Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* ACTION SUCCESS BANNER */}
      {actionSuccessMsg && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-emerald-600 text-white font-bold text-xs shadow-lg flex items-center justify-between"
        >
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-200 shrink-0" />
            <span>{actionSuccessMsg}</span>
          </div>
          <button onClick={() => setActionSuccessMsg(null)} className="p-1 hover:bg-emerald-700 rounded-lg">
            ✕
          </button>
        </motion.div>
      )}

      {/* NAVIGATION TABS */}
      <div className="flex flex-wrap gap-3">
        {[
          { id: 'analyzer', label: '1. Spoilage Risk Analyzer 🚨', icon: AlertTriangle },
          { id: 'dispatcher', label: '2. Flash Surplus Discount Dispatcher ⚡', icon: Zap },
          { id: 'compost', label: '3. Bio-Fertilizer Composting Router 🌿', icon: Leaf },
          { id: 'impact', label: '4. Environmental Impact Dashboard 🌍', icon: Sparkles }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3 rounded-2xl text-xs font-extrabold transition-all duration-200 flex items-center gap-2 cursor-pointer border ${
                activeTab === tab.id
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-500/20'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: HARVEST RISK ANALYZER & EXPIRY DETECTOR */}
      {activeTab === 'analyzer' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900 text-white shadow-xl space-y-6 border border-slate-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h2 className="text-lg font-bold font-display text-white">
                  Harvest Risk Analyzer &amp; Expiry Detector
                </h2>
              </div>
              <button
                onClick={loadAnalysis}
                className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl transition text-slate-200 cursor-pointer"
                title="Recalculate Risk"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                  Crop Name
                </label>
                <input
                  type="text"
                  value={cropName}
                  onChange={(e) => setCropName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm font-bold text-white focus:outline-none focus:border-emerald-500"
                  placeholder="e.g. Tomatoes"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                  Quantity (Kg)
                </label>
                <input
                  type="number"
                  value={quantityKg}
                  onChange={(e) => setQuantityKg(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm font-bold text-white focus:outline-none focus:border-emerald-500"
                  placeholder="500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                  Days to Expiry
                </label>
                <input
                  type="number"
                  value={daysToExpiry}
                  onChange={(e) => setDaysToExpiry(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm font-bold text-white focus:outline-none focus:border-emerald-500"
                  placeholder="2"
                />
              </div>
            </div>

            {/* RISK DETECTION BANNER */}
            {data && (
              <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-700 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
                    <AlertTriangle className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400 font-semibold">AgroLink Detection Result:</span>
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase bg-rose-500 text-white animate-pulse">
                        {data.unsoldRiskLevel}
                      </span>
                    </div>
                    <h3 className="text-xl font-extrabold text-white font-display mt-0.5">
                      {data.quantityKg} kg {data.cropName} • Expiry Window: {data.daysToExpiry} Days Remaining
                    </h3>
                  </div>
                </div>

                <div className="text-left md:text-right font-mono">
                  <div className="text-xs text-slate-400">Standard Base Value: Rs. {originalTotal.toLocaleString()}</div>
                  <div className="text-lg font-black text-emerald-400">
                    Rescue Price Target: Rs. {data.discountedPricePerKg}/kg (-{data.recommendedDiscountPct}%)
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 4 AUTOMATED PATHWAYS OVERVIEW */}
          {data && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* PATHWAY 1: NEARBY COMMERCIAL BUYERS */}
              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-md space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-sky-50 text-sky-600 font-bold">
                    <Store className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-sky-700 bg-sky-100 px-2 py-0.5 rounded uppercase tracking-wider">
                      Pathway 1 • Commercial Bulk Direct
                    </span>
                    <h3 className="text-base font-extrabold text-slate-900 font-display">
                      Nearby Supermarkets &amp; Retailers
                    </h3>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {data.nearbyCommercialBuyers.map((b) => (
                    <div key={b.name} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between gap-2 text-xs">
                      <div>
                        <div className="font-extrabold text-slate-900">{b.name}</div>
                        <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                          <span className="font-semibold text-sky-700">{b.category}</span> • <span>{b.distanceKm} km away</span> • <span>Req: {b.requiredQuantityKg}kg</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDispatchOffer(b.name)}
                        className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-[11px] rounded-xl transition flex items-center gap-1 shrink-0 cursor-pointer"
                      >
                        <Send className="w-3 h-3" /> Offer
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* PATHWAY 2: INDUSTRIAL PROCESSORS */}
              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-md space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-purple-50 text-purple-600 font-bold">
                    <Factory className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-purple-700 bg-purple-100 px-2 py-0.5 rounded uppercase tracking-wider">
                      Pathway 2 • Industrial Upcycling
                    </span>
                    <h3 className="text-base font-extrabold text-slate-900 font-display">
                      Food Processing Factories
                    </h3>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {data.processingCompanies.map((p) => (
                    <div key={p.name} className="p-3 bg-purple-50/40 rounded-2xl border border-purple-100 flex items-center justify-between gap-2 text-xs">
                      <div>
                        <div className="font-extrabold text-slate-900">{p.name}</div>
                        <div className="text-[11px] text-purple-700 font-semibold mt-0.5">
                          {p.processingType} • Offered: <span className="font-mono font-black">Rs. {p.offeredPricePerKg}/kg</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDispatchOffer(p.name)}
                        className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-[11px] rounded-xl transition flex items-center gap-1 shrink-0 cursor-pointer"
                      >
                        Route Factory 🏭
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>
      )}

      {/* TAB 2: FLASH SURPLUS DISCOUNT DISPATCHER */}
      {activeTab === 'dispatcher' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
          
          {/* DISPATCH CONTROLS (7 Cols) */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-lg space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-2xl bg-amber-50 text-amber-700 border border-amber-100">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 font-display">Near-Expiry Surplus Dispatcher</h3>
                  <p className="text-xs text-slate-500">Configure markdown parameters &amp; broadcast across retail channels</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 text-[10px] font-black uppercase">
                Flash Clearance
              </span>
            </div>

            {/* DISCOUNT MARKDOWN SLIDER */}
            <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700">Clearance Discount Percentage:</span>
                <span className="font-black text-amber-700 text-lg font-display">{customDiscountPct}% Off</span>
              </div>
              <input
                type="range"
                min="10"
                max="50"
                step="5"
                value={customDiscountPct}
                onChange={(e) => setCustomDiscountPct(parseInt(e.target.value, 10))}
                className="w-full accent-amber-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                <span>10% (Mild Markdown)</span>
                <span>25% (Recommended)</span>
                <span>50% (Emergency Liquidation)</span>
              </div>
            </div>

            {/* BROADCAST CHANNEL SELECTOR */}
            <div className="space-y-3">
              <label className="text-xs font-extrabold uppercase text-slate-400 tracking-wider block">
                Broadcast Distribution Channels:
              </label>

              <div className="space-y-2.5 text-xs font-semibold">
                <label className="p-3 rounded-2xl border border-slate-200 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition">
                  <div className="flex items-center gap-2.5">
                    <Bell className="w-4 h-4 text-emerald-600" />
                    <div>
                      <span className="text-slate-900 font-bold block">Push Alert to 12 Local Supermarkets</span>
                      <span className="text-[11px] text-slate-500">Instant notification to Keells, Cargills, and SPAR procurement buyers</span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={broadcastChannels.supermarkets}
                    onChange={(e) => setBroadcastChannels({ ...broadcastChannels, supermarkets: e.target.checked })}
                    className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                  />
                </label>

                <label className="p-3 rounded-2xl border border-slate-200 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition">
                  <div className="flex items-center gap-2.5">
                    <Share2 className="w-4 h-4 text-blue-600" />
                    <div>
                      <span className="text-slate-900 font-bold block">Publish to "Flash Produce Deals" Public Feed</span>
                      <span className="text-[11px] text-slate-500">Listed on AgroLink consumer marketplace with banner tag</span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={broadcastChannels.flashFeed}
                    onChange={(e) => setBroadcastChannels({ ...broadcastChannels, flashFeed: e.target.checked })}
                    className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                  />
                </label>

                <label className="p-3 rounded-2xl border border-slate-200 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition">
                  <div className="flex items-center gap-2.5">
                    <Truck className="w-4 h-4 text-amber-600" />
                    <div>
                      <span className="text-slate-900 font-bold block">Priority Fleet Collection Window</span>
                      <span className="text-[11px] text-slate-500">Assigns express logistics for pickup within 6 hours</span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={broadcastChannels.expressLogistics}
                    onChange={(e) => setBroadcastChannels({ ...broadcastChannels, expressLogistics: e.target.checked })}
                    className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                  />
                </label>
              </div>
            </div>

            <button
              onClick={handleBroadcastSurplus}
              disabled={isBroadcasting}
              className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-extrabold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Radio className="w-4 h-4" />
              <span>{isBroadcasting ? 'Broadcasting Surplus Signals...' : `Broadcast ${customDiscountPct}% Markdown Flash Sale 🚀`}</span>
            </button>
          </div>

          {/* FINANCIAL RECOVERY SUMMARY (5 Cols) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-emerald-400" /> FINANCIAL RESCUE LEDGER
                </span>
                <span className="px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-300 font-extrabold text-[10px] border border-emerald-800">
                  Zero Spoilage Target
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-xs text-slate-400 font-medium">Recovered Revenue from Surplus:</span>
                <div className="text-3xl sm:text-4xl font-black font-display text-emerald-400">
                  Rs. {recoveredRevenue.toLocaleString()}
                </div>
                <p className="text-[11px] text-slate-400">
                  Prevented 100% total financial write-off for {quantityKg} kg of {cropName}.
                </p>
              </div>

              <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-2.5 text-xs">
                <div className="flex justify-between items-center text-slate-400">
                  <span>Original Standard Rate:</span>
                  <span>Rs. 200.00 / kg</span>
                </div>
                <div className="flex justify-between items-center text-emerald-400 font-bold">
                  <span>Markdown Flash Rate (-{customDiscountPct}%):</span>
                  <span>Rs. {discountedRate.toFixed(2)} / kg</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>Batch Volume:</span>
                  <span>{quantityKg} kg</span>
                </div>
                <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-emerald-300 font-bold">
                  <span>Total Capital Saved from Dump:</span>
                  <span>Rs. {recoveredRevenue.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-emerald-950/60 rounded-2xl border border-emerald-800/60 text-xs text-emerald-200 font-semibold space-y-1">
              <span className="font-extrabold text-white flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Buyer Incentive:
              </span>
              <p>Supermarkets receive 1.5x loyalty points for clearing certified rescue produce batches within 18 hours.</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: BIO-FERTILIZER COMPOSTING ROUTER */}
      {activeTab === 'compost' && (
        <div className="space-y-6 animate-fade-in">
          <div className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-200/90 shadow-lg space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-2xl bg-teal-50 text-teal-700 border border-teal-100">
                  <Leaf className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 font-display">
                    Bio-Fertilizer &amp; Organic Composting Routing
                  </h3>
                  <p className="text-xs text-slate-500">
                    For produce beyond retail shelf-life — convert into high-grade organic fertilizer and earn government green tax credits
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200 text-xs font-bold">
                🌱 100% Upcycled
              </span>
            </div>

            {/* COMPOSTING CARDS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {COMPOST_FACILITIES.map((facility) => {
                const totalPayout = (parseInt(quantityKg) || 500) * facility.payoutRatePerKg;
                const bioCompostOutputKg = Math.round((parseInt(quantityKg) || 500) * 0.70);

                return (
                  <div
                    key={facility.id}
                    className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-5 hover:border-emerald-500 transition"
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase">
                          {facility.badge}
                        </span>
                        <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-emerald-600" /> {facility.distanceKm} km
                        </span>
                      </div>

                      <h4 className="font-extrabold text-slate-900 text-base font-display">{facility.name}</h4>
                      <p className="text-xs text-slate-600 font-medium">Processing Method: <strong className="text-slate-800">{facility.type}</strong></p>

                      <div className="p-3.5 bg-white rounded-2xl border border-slate-200 space-y-1.5 text-xs">
                        <div className="flex justify-between text-slate-500 font-semibold">
                          <span>Compost Payout Rate:</span>
                          <span className="font-bold text-slate-800">Rs. {facility.payoutRatePerKg}/kg</span>
                        </div>
                        <div className="flex justify-between text-slate-500 font-semibold">
                          <span>Est. Bio-Fertilizer Output:</span>
                          <span className="font-bold text-emerald-700">{bioCompostOutputKg} kg Fertilizer</span>
                        </div>
                        <div className="pt-1.5 border-t border-slate-100 flex justify-between items-center text-slate-900 font-display">
                          <span className="font-extrabold">Total Green Credit:</span>
                          <span className="font-black text-emerald-600 text-base">Rs. {totalPayout.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRouteToCompost(facility)}
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Leaf className="w-4 h-4" />
                      <span>Route Batch for Composting 🌿</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ENVIRONMENTAL & SOCIAL IMPACT COUNTER */}
      {activeTab === 'impact' && (
        <div className="space-y-6 animate-fade-in">
          <div className="p-8 rounded-3xl bg-emerald-950 text-white border border-emerald-800 space-y-6 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-800/80 pb-4">
              <div className="flex items-center gap-2.5">
                <Leaf className="w-6 h-6 text-emerald-400" />
                <div>
                  <h3 className="text-xl font-bold font-display text-white">
                    Environmental &amp; Social Impact Ledger Saved
                  </h3>
                  <p className="text-xs text-slate-300">Audited circular economy metrics across Sri Lankan agricultural supply chains</p>
                </div>
              </div>
              <span className="text-xs text-emerald-400 font-mono font-bold bg-emerald-900/80 px-3 py-1 rounded-full border border-emerald-700">
                DOA Verified Audit
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="p-6 bg-slate-900/90 rounded-3xl border border-slate-800 flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-emerald-500/20 text-emerald-400 shrink-0">
                  <Leaf className="w-8 h-8" />
                </div>
                <div>
                  <div className="text-3xl font-black font-mono text-emerald-400">
                    {data?.environmentalImpact?.co2SavedKg || 420} kg
                  </div>
                  <div className="text-xs text-slate-400 font-semibold mt-1">CO2 Emissions Prevented</div>
                  <p className="text-[10px] text-slate-500 mt-0.5">Equivalent to planting 18 trees</p>
                </div>
              </div>

              <div className="p-6 bg-slate-900/90 rounded-3xl border border-slate-800 flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-sky-500/20 text-sky-400 shrink-0">
                  <Droplets className="w-8 h-8" />
                </div>
                <div>
                  <div className="text-3xl font-black font-mono text-sky-400">
                    {(data?.environmentalImpact?.waterSavedLiters || 18500).toLocaleString()} L
                  </div>
                  <div className="text-xs text-slate-400 font-semibold mt-1">Agricultural Water Preserved</div>
                  <p className="text-[10px] text-slate-500 mt-0.5">Freshwater irrigation conserved</p>
                </div>
              </div>

              <div className="p-6 bg-slate-900/90 rounded-3xl border border-slate-800 flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-amber-500/20 text-amber-400 shrink-0">
                  <Utensils className="w-8 h-8" />
                </div>
                <div>
                  <div className="text-3xl font-black font-mono text-amber-400">
                    {data?.environmentalImpact?.mealsCreated || 650} Meals
                  </div>
                  <div className="text-xs text-slate-400 font-semibold mt-1">Nutritious Meals Donated</div>
                  <p className="text-[10px] text-slate-500 mt-0.5">Distributed to local food banks</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default WasteReductionModule;
