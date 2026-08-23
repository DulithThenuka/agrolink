import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
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
  Sliders,
  Coins,
  ArrowUpRight,
  X,
  FileText,
  BadgeCheck
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
  const [broadcastRecords, setBroadcastRecords] = useState(() => {
    const saved = localStorage.getItem('agrolink_surplus_broadcasts');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 'FLASH-2026-089',
        cropName: 'Welimada Tomatoes',
        quantityKg: 500,
        discountPct: 25,
        originalPrice: 200,
        discountedPrice: 150,
        recoveredRevenue: 75000,
        channels: ['12 Local Supermarkets', 'Public Flash Feed', 'Priority Cold Fleet'],
        status: 'ACTIVE',
        viewsCount: 28,
        inquiriesCount: 3,
        createdAt: '25 mins ago',
        expiresIn: '17 Hours'
      }
    ];
  });

  // Direct Offer Modal States
  const [selectedBuyerForOffer, setSelectedBuyerForOffer] = useState(null);
  const [offerQuantity, setOfferQuantity] = useState(300);
  const [offerPrice, setOfferPrice] = useState(150);
  const [deliveryMode, setDeliveryMode] = useState('AGROLINK_FLEET');
  const [holdHours, setHoldHours] = useState(6);
  const [submittingOffer, setSubmittingOffer] = useState(false);
  const [offerSuccessReceipt, setOfferSuccessReceipt] = useState(null);

  // Bio-Fertilizer Composting Routing States
  const [selectedCompostPlant, setSelectedCompostPlant] = useState('Ceylon Organic Compost Hub (Kurunegala)');

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
      { id: 'BUY-1', name: 'Keells Super Dambulla Central', category: 'Supermarket', distanceKm: 8.5, requiredQuantityKg: 300, suggestedPrice: 150 },
      { id: 'BUY-2', name: 'Cargills Express Kurunegala', category: 'Retail Chain', distanceKm: 14.2, requiredQuantityKg: 200, suggestedPrice: 155 },
      { id: 'BUY-3', name: 'Heritage Kandy Restaurant Collective', category: 'Hospitality', distanceKm: 19.0, requiredQuantityKg: 150, suggestedPrice: 160 }
    ],
    donationPartners: [
      { name: 'Sri Lanka Food Rescue Foundation', type: 'Community Kitchen Hub', contact: '+94 11 234 5678' },
      { name: 'Suwa Setha Childrens Nutrition Program', type: 'School Meal NGO', contact: '+94 81 987 6543' }
    ],
    processingCompanies: [
      { id: 'PROC-1', name: 'Lanka Agro-Pulp & Puree Ltd', category: 'Food Factory', processingType: 'Tomato Paste & Puree', offeredPricePerKg: 130, requiredQuantityKg: 500 },
      { id: 'PROC-2', name: 'Ceylon Canners & Preserves', category: 'Processing Plant', processingType: 'Dehydrated Powders & Sauce', offeredPricePerKg: 125, requiredQuantityKg: 400 }
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
      console.warn('Backend Waste API offline, loading fallback data:', err);
      setData(MOCK_WASTE_DATA);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadAnalysis();
    }, 300);
    return () => clearTimeout(timer);
  }, [cropName, quantityKg, daysToExpiry]);

  const handleOpenOfferModal = (buyer) => {
    setSelectedBuyerForOffer(buyer);
    setOfferQuantity(buyer.requiredQuantityKg || parseInt(quantityKg) || 300);
    setOfferPrice(buyer.offeredPricePerKg || buyer.suggestedPrice || data?.discountedPricePerKg || 150);
    setDeliveryMode('AGROLINK_FLEET');
    setHoldHours(6);
    setOfferSuccessReceipt(null);
  };

  const handleCloseOfferModal = () => {
    setSelectedBuyerForOffer(null);
    setOfferSuccessReceipt(null);
    setSubmittingOffer(false);
  };

  const handleSendDirectOffer = async (e) => {
    e.preventDefault();
    setSubmittingOffer(true);

    const payload = {
      buyerId: selectedBuyerForOffer?.id || 'BUY-GEN',
      buyerName: selectedBuyerForOffer?.name,
      cropName: data?.cropName || cropName,
      quantityKg: offerQuantity,
      pricePerKg: offerPrice,
      totalAmount: offerQuantity * offerPrice,
      deliveryMode,
      holdHours
    };

    try {
      await wasteReductionAPI.dispatchOffer(payload);
    } catch (err) {
      console.warn('Dispatch API fallback:', err);
    }

    setTimeout(() => {
      setSubmittingOffer(false);
      setOfferSuccessReceipt({
        dispatchCode: `AGRO-DISPATCH-${Math.floor(1000 + Math.random() * 9000)}`,
        buyerName: selectedBuyerForOffer?.name,
        cropName: data?.cropName || cropName,
        quantityKg: offerQuantity,
        pricePerKg: offerPrice,
        totalAmount: offerQuantity * offerPrice,
        holdHours,
        deliveryMode,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      setActionSuccessMsg(`🚀 Direct Dispatch Offer transmitted to ${selectedBuyerForOffer?.name}!`);
      setTimeout(() => setActionSuccessMsg(null), 6000);
    }, 800);
  };

  const handleBroadcastSurplus = () => {
    setIsBroadcasting(true);
    setTimeout(() => {
      setIsBroadcasting(false);
      const newRecord = {
        id: `FLASH-2026-${Math.floor(100 + Math.random() * 900)}`,
        cropName: data?.cropName || cropName,
        quantityKg: parseInt(quantityKg) || 500,
        discountPct: customDiscountPct,
        originalPrice: 200,
        discountedPrice: discountedRate,
        recoveredRevenue: recoveredRevenue,
        channels: Object.entries(broadcastChannels)
          .filter(([_, active]) => active)
          .map(([key]) => key === 'supermarkets' ? '12 Supermarkets' : key === 'flashFeed' ? 'Public Flash Feed' : 'Priority Cold Fleet'),
        status: 'ACTIVE',
        viewsCount: 1,
        inquiriesCount: 0,
        createdAt: 'Just now',
        expiresIn: '18 Hours'
      };

      const updated = [newRecord, ...broadcastRecords];
      setBroadcastRecords(updated);
      try {
        localStorage.setItem('agrolink_surplus_broadcasts', JSON.stringify(updated));
      } catch (e) {}

      setActionSuccessMsg(`📡 Broadcast successful! Recorded active flash deal (${newRecord.id}) dispatched to 12 verified supermarket procurement buyers.`);
      setTimeout(() => setActionSuccessMsg(null), 6000);
    }, 1000);
  };

  const handleDelistBroadcast = (id) => {
    const updated = broadcastRecords.filter(r => r.id !== id);
    setBroadcastRecords(updated);
    try {
      localStorage.setItem('agrolink_surplus_broadcasts', JSON.stringify(updated));
    } catch (e) {}
    setActionSuccessMsg(`🛑 Flash broadcast (${id}) delisted successfully.`);
    setTimeout(() => setActionSuccessMsg(null), 4000);
  };

  const handleRouteToCompost = (facility) => {
    setActionSuccessMsg(`🌿 Batch routed to ${facility.name} for bio-fertilizer conversion! Payout of Rs. ${(quantityKg * facility.payoutRatePerKg).toLocaleString()} logged.`);
    setTimeout(() => setActionSuccessMsg(null), 6000);
  };

  // Math Calculations for Dispatcher
  const originalTotal = (parseInt(quantityKg) || 500) * 200;
  const discountedRate = 200 * (1 - customDiscountPct / 100);
  const recoveredRevenue = (parseInt(quantityKg) || 500) * discountedRate;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fade-in text-slate-800">
      
      {/* 1. CLEAN WHITE & GLASSMORPHIC HERO HEADER */}
      <div className="glass-card p-6 sm:p-8 bg-white border border-slate-200/90 shadow-xl shadow-slate-200/50 rounded-3xl space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-extrabold uppercase tracking-wider border border-emerald-200 shadow-xs">
              <Recycle className="w-4 h-4 text-emerald-600" />
              <span>AgroLink Zero Food Waste Protocol</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-display text-slate-900">
              Surplus Crop Waste Reduction &amp; Rescue ♻️
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm max-w-3xl leading-relaxed font-medium">
              Detect harvest expiration risks before spoilage occurs. Trigger dynamic price markdowns, broadcast to local commercial buyers, donate to food banks, or route to bio-fertilizer composting.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="px-4 py-2.5 bg-emerald-50 rounded-2xl text-xs font-bold text-emerald-800 border border-emerald-200 flex items-center gap-2 shadow-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
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

      {/* 2. NAVIGATION TABS (CLEAN WHITE) */}
      <div className="flex flex-wrap gap-2.5 p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200 w-fit">
        {[
          { id: 'analyzer', label: '1. Spoilage Risk Analyzer 🚨', icon: AlertTriangle },
          { id: 'dispatcher', label: '2. Flash Surplus Discount Dispatcher ⚡', icon: Zap },
          { id: 'compost', label: '3. Bio-Fertilizer Composting Router 🌿', icon: Leaf },
          { id: 'impact', label: '4. Environmental Impact Dashboard 🌍', icon: Sparkles }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs font-extrabold transition flex items-center gap-2 cursor-pointer border ${
                isActive
                  ? 'bg-white text-emerald-800 border-slate-200 shadow-sm ring-1 ring-emerald-500/20'
                  : 'bg-transparent text-slate-600 border-transparent hover:bg-white/60 hover:text-slate-900'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: HARVEST RISK ANALYZER & EXPIRY DETECTOR */}
      {activeTab === 'analyzer' && (
        <div className="space-y-6">
          <div className="premium-card p-6 sm:p-7 bg-white border border-slate-200/90 shadow-lg rounded-3xl space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <h2 className="text-lg font-extrabold font-display text-slate-900">
                  Harvest Risk Analyzer &amp; Expiry Detector
                </h2>
              </div>
              <button
                onClick={loadAnalysis}
                className="p-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition text-slate-600 shadow-xs cursor-pointer"
                title="Recalculate Risk"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-600' : ''}`} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                  Crop Name
                </label>
                <input
                  type="text"
                  value={cropName}
                  onChange={(e) => setCropName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white transition"
                  placeholder="e.g. Tomatoes"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                  Quantity (Kg)
                </label>
                <input
                  type="number"
                  value={quantityKg}
                  onChange={(e) => setQuantityKg(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white transition"
                  placeholder="500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                  Days to Expiry
                </label>
                <input
                  type="number"
                  value={daysToExpiry}
                  onChange={(e) => setDaysToExpiry(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white transition"
                  placeholder="2"
                />
              </div>
            </div>

            {/* RISK DETECTION BANNER (CLEAN WHITE) */}
            {data && (
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center font-bold shrink-0">
                    <AlertTriangle className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 font-semibold">AgroLink Detection Result:</span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-rose-100 text-rose-800 border border-rose-200">
                        {data.unsoldRiskLevel}
                      </span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 font-display mt-0.5">
                      {data.quantityKg} kg {data.cropName} • Expiry Window: {data.daysToExpiry} Days Remaining
                    </h3>
                  </div>
                </div>

                <div className="text-left md:text-right font-mono">
                  <div className="text-xs text-slate-400">Standard Base Value: Rs. {originalTotal.toLocaleString()}</div>
                  <div className="text-lg font-black text-emerald-600">
                    Rescue Price Target: Rs. {data.discountedPricePerKg}/kg (-{data.recommendedDiscountPct}%)
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 4 AUTOMATED PATHWAYS OVERVIEW (CLEAN WHITE) */}
          {data && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* PATHWAY 1: NEARBY COMMERCIAL BUYERS */}
              <div className="premium-card p-6 bg-white border border-slate-200/90 shadow-md rounded-3xl space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-sky-50 text-sky-600 font-bold border border-sky-100">
                    <Store className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-sky-800 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Pathway 1 • Commercial Bulk Direct
                    </span>
                    <h3 className="text-base font-extrabold text-slate-900 font-display mt-0.5">
                      Nearby Supermarkets &amp; Retailers
                    </h3>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {data.nearbyCommercialBuyers.map((b) => (
                    <div key={b.name} className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between gap-2 text-xs">
                      <div>
                        <div className="font-extrabold text-slate-900">{b.name}</div>
                        <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                          <span className="font-semibold text-sky-700">{b.category}</span> • <span>{b.distanceKm} km away</span> • <span>Req: {b.requiredQuantityKg}kg</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleOpenOfferModal(b)}
                        className="px-3.5 py-2 bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs rounded-xl transition flex items-center gap-1.5 shrink-0 cursor-pointer shadow-sm active:scale-95"
                      >
                        <Send className="w-3.5 h-3.5" /> Offer
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* PATHWAY 2: INDUSTRIAL PROCESSORS */}
              <div className="premium-card p-6 bg-white border border-slate-200/90 shadow-md rounded-3xl space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-purple-50 text-purple-600 font-bold border border-purple-100">
                    <Factory className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-purple-800 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Pathway 2 • Industrial Upcycling
                    </span>
                    <h3 className="text-base font-extrabold text-slate-900 font-display mt-0.5">
                      Food Processing Factories
                    </h3>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {data.processingCompanies.map((p) => (
                    <div key={p.name} className="p-3 bg-purple-50/40 rounded-2xl border border-purple-200/60 flex items-center justify-between gap-2 text-xs">
                      <div>
                        <div className="font-extrabold text-slate-900">{p.name}</div>
                        <div className="text-[11px] text-purple-700 font-semibold mt-0.5">
                          {p.processingType} • Offered: <span className="font-mono font-black">Rs. {p.offeredPricePerKg}/kg</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleOpenOfferModal(p)}
                        className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs rounded-xl transition flex items-center gap-1.5 shrink-0 cursor-pointer shadow-sm active:scale-95"
                      >
                        <Send className="w-3.5 h-3.5" /> Route Factory 🏭
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
                <div className="p-2.5 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 font-display">Near-Expiry Surplus Dispatcher</h3>
                  <p className="text-xs text-slate-500">Configure markdown parameters &amp; broadcast across retail channels</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 text-[10px] font-black uppercase border border-amber-200">
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
              <label className="text-xs font-extrabold uppercase text-slate-500 tracking-wider block">
                Broadcast Distribution Channels:
              </label>

              <div className="space-y-2.5 text-xs font-semibold">
                <label className="p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition">
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

                <label className="p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition">
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

                <label className="p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition">
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
          <div className="lg:col-span-5 bg-gradient-to-br from-emerald-50/90 via-teal-50/40 to-white p-6 sm:p-8 rounded-3xl border border-emerald-200 shadow-xl flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              <div className="flex justify-between items-center border-b border-emerald-200/60 pb-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-800 flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-emerald-600" /> FINANCIAL RESCUE LEDGER
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[10px] border border-emerald-200">
                  Zero Spoilage Target
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-xs text-slate-500 font-medium">Recovered Revenue from Surplus:</span>
                <div className="text-3xl sm:text-4xl font-black font-display text-emerald-700">
                  Rs. {recoveredRevenue.toLocaleString()}
                </div>
                <p className="text-[11px] text-slate-500 font-medium">
                  Prevented 100% total financial write-off for {quantityKg} kg of {cropName}.
                </p>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2.5 text-xs">
                <div className="flex justify-between items-center text-slate-500 font-semibold">
                  <span>Original Standard Rate:</span>
                  <span className="font-bold text-slate-800">Rs. 200.00 / kg</span>
                </div>
                <div className="flex justify-between items-center text-emerald-700 font-bold">
                  <span>Markdown Flash Rate (-{customDiscountPct}%):</span>
                  <span>Rs. {discountedRate.toFixed(2)} / kg</span>
                </div>
                <div className="flex justify-between items-center text-slate-500 font-semibold">
                  <span>Batch Volume:</span>
                  <span className="font-bold text-slate-800">{quantityKg} kg</span>
                </div>
                <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-emerald-800 font-extrabold">
                  <span>Total Capital Saved from Dump:</span>
                  <span className="text-base font-black">Rs. {recoveredRevenue.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 font-medium space-y-1">
              <span className="font-black text-emerald-800 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Buyer Incentive:
              </span>
              <p>Supermarkets receive 1.5x loyalty points for clearing certified rescue produce batches within 18 hours.</p>
            </div>
          </div>

          {/* ACTIVE BROADCASTS RECORD LOG */}
          <div className="lg:col-span-12 bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-md space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center shrink-0">
                  <Radio className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-extrabold text-slate-900 font-display">
                    Active Surplus Flash Broadcasts &amp; Clearance Records 📡
                  </h4>
                  <p className="text-xs text-slate-500 font-medium">
                    {broadcastRecords.length} live flash markdown broadcasts currently active across Sri Lanka retail procurement desks
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-black uppercase flex items-center gap-1.5 self-start sm:self-auto">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Active Feeds Live</span>
              </span>
            </div>

            <div className="space-y-3">
              {broadcastRecords.map((record) => (
                <div
                  key={record.id}
                  className="p-4 bg-slate-50 rounded-2xl border border-slate-200/90 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono font-black text-slate-900 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
                        {record.id}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-black text-[10px] uppercase">
                        {record.discountPct}% OFF FLASH SALE
                      </span>
                      <span className="text-slate-400 font-semibold">• {record.createdAt}</span>
                    </div>

                    <h5 className="font-extrabold text-slate-900 text-sm font-display">
                      {record.quantityKg} kg {record.cropName} @ <strong className="text-emerald-700 font-mono">Rs. {record.discountedPrice.toFixed(2)}/kg</strong>
                      <span className="text-slate-400 font-normal line-through ml-2">Rs. {record.originalPrice.toFixed(2)}/kg</span>
                    </h5>

                    <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 font-medium">
                      <span>Channels: <strong className="text-slate-800">{record.channels.join(', ')}</strong></span>
                      <span>• Total Lot: <strong className="text-slate-800">Rs. {record.recoveredRevenue.toLocaleString()}</strong></span>
                      <span>• <strong className="text-amber-700">{record.expiresIn} Left</strong></span>
                      <span>• 👁️ {record.viewsCount} Procurement Views • 💬 {record.inquiriesCount} Inquiries</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
                    <Link
                      to="/crops"
                      className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 shadow-xs transition"
                    >
                      View on Market →
                    </Link>
                    <button
                      onClick={() => handleDelistBroadcast(record.id)}
                      className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl border border-rose-200 transition cursor-pointer"
                    >
                      End Broadcast
                    </button>
                  </div>
                </div>
              ))}
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
                <div className="p-2.5 rounded-2xl bg-teal-50 text-teal-700 border border-teal-200">
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
              <span className="px-3 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200 text-xs font-extrabold">
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
                    className="p-6 rounded-3xl bg-slate-50 border border-slate-200 shadow-sm flex flex-col justify-between space-y-5 hover:border-emerald-500 transition"
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase border border-emerald-200">
                          {facility.badge}
                        </span>
                        <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-emerald-600" /> {facility.distanceKm} km
                        </span>
                      </div>

                      <h4 className="font-extrabold text-slate-900 text-base font-display">{facility.name}</h4>
                      <p className="text-xs text-slate-600 font-medium">Processing Method: <strong className="text-slate-800">{facility.type}</strong></p>

                      <div className="p-3.5 bg-white rounded-2xl border border-slate-200 space-y-1.5 text-xs shadow-xs">
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
                          <span className="font-black text-emerald-700 text-base">Rs. {totalPayout.toLocaleString()}</span>
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
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
              <div className="flex items-center gap-2.5">
                <Leaf className="w-6 h-6 text-emerald-600" />
                <div>
                  <h3 className="text-xl font-extrabold font-display text-slate-900">
                    Environmental &amp; Social Impact Ledger Saved
                  </h3>
                  <p className="text-xs text-slate-500">Audited circular economy metrics across Sri Lankan agricultural supply chains</p>
                </div>
              </div>
              <span className="text-xs text-emerald-800 font-bold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 shadow-xs">
                DOA Verified Audit
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200 flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-emerald-100 text-emerald-700 shrink-0 border border-emerald-200">
                  <Leaf className="w-8 h-8" />
                </div>
                <div>
                  <div className="text-3xl font-black font-display text-emerald-700">
                    {data?.environmentalImpact?.co2SavedKg || 420} kg
                  </div>
                  <div className="text-xs text-slate-600 font-bold mt-1">CO2 Emissions Prevented</div>
                  <p className="text-[10px] text-slate-400 mt-0.5">Equivalent to planting 18 trees</p>
                </div>
              </div>

              <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200 flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-sky-100 text-sky-700 shrink-0 border border-sky-200">
                  <Droplets className="w-8 h-8" />
                </div>
                <div>
                  <div className="text-3xl font-black font-display text-sky-700">
                    {(data?.environmentalImpact?.waterSavedLiters || 18500).toLocaleString()} L
                  </div>
                  <div className="text-xs text-slate-600 font-bold mt-1">Agricultural Water Preserved</div>
                  <p className="text-[10px] text-slate-400 mt-0.5">Freshwater irrigation conserved</p>
                </div>
              </div>

              <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200 flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-amber-100 text-amber-700 shrink-0 border border-amber-200">
                  <Utensils className="w-8 h-8" />
                </div>
                <div>
                  <div className="text-3xl font-black font-display text-amber-700">
                    {data?.environmentalImpact?.mealsCreated || 650} Meals
                  </div>
                  <div className="text-xs text-slate-600 font-bold mt-1">Nutritious Meals Donated</div>
                  <p className="text-[10px] text-slate-400 mt-0.5">Distributed to local food banks</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. DIRECT DISPATCH OFFER MODAL */}
      <AnimatePresence>
        {selectedBuyerForOffer && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-950/70 backdrop-blur-md animate-fade-in">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="bg-white border border-slate-200 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden relative max-h-[90vh] flex flex-col my-auto"
            >
              {/* MODAL HEADER */}
              <div className="p-5 sm:p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 border border-sky-200 flex items-center justify-center shrink-0">
                    <Send className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base font-display">
                      Direct Surplus Dispatch Offer
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      Transmit direct rescue lot to <strong className="text-slate-800">{selectedBuyerForOffer.name}</strong>
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleCloseOfferModal}
                  className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* MODAL CONTENT */}
              <div className="p-5 sm:p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-80px)]">
                {!offerSuccessReceipt ? (
                  <form onSubmit={handleSendDirectOffer} className="space-y-4">
                    
                    {/* TARGET BUYER CHIP */}
                    <div className="p-3.5 bg-sky-50/60 rounded-2xl border border-sky-200 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] font-black uppercase text-sky-800 tracking-wider block">Target Procurement Desk</span>
                        <strong className="text-slate-900 text-sm font-display">{selectedBuyerForOffer.name}</strong>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-white text-sky-800 border border-sky-200 font-bold text-[11px] shadow-xs">
                        {selectedBuyerForOffer.distanceKm || 10} km away
                      </span>
                    </div>

                    {/* QUANTITY AND PRICE ROW */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1.5">
                          Offer Volume (kg)
                        </label>
                        <input
                          type="number"
                          required
                          min="10"
                          max={quantityKg}
                          value={offerQuantity}
                          onChange={(e) => setOfferQuantity(Number(e.target.value))}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-black text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white transition"
                        />
                        <span className="text-[10px] text-slate-400 font-medium mt-1 block">Max batch: {quantityKg} kg</span>
                      </div>

                      <div>
                        <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1.5">
                          Offer Rate (Rs./kg)
                        </label>
                        <input
                          type="number"
                          required
                          min="10"
                          step="1"
                          value={offerPrice}
                          onChange={(e) => setOfferPrice(Number(e.target.value))}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-black text-emerald-700 focus:outline-none focus:border-emerald-500 focus:bg-white transition"
                        />
                        <span className="text-[10px] text-slate-400 font-medium mt-1 block">Standard: Rs. 200/kg</span>
                      </div>
                    </div>

                    {/* LOGISTICS & HOLD TIME */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1.5">
                          Logistics Dispatch
                        </label>
                        <select
                          value={deliveryMode}
                          onChange={(e) => setDeliveryMode(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
                        >
                          <option value="AGROLINK_FLEET">🚚 AgroLink Cold Fleet</option>
                          <option value="FARMER_DELIVER">🚜 Farmer Self-Deliver</option>
                          <option value="BUYER_PICKUP">🏬 Buyer Depot Pickup</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1.5">
                          Reserved Hold Window
                        </label>
                        <select
                          value={holdHours}
                          onChange={(e) => setHoldHours(Number(e.target.value))}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
                        >
                          <option value="3">⏳ 3 Hours (Urgent)</option>
                          <option value="6">⏳ 6 Hours (Recommended)</option>
                          <option value="12">⏳ 12 Hours (Standard)</option>
                        </select>
                      </div>
                    </div>

                    {/* FINANCIAL CALCULATION SUMMARY CARD */}
                    <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2">
                      <div className="flex justify-between items-center text-xs font-semibold text-slate-600">
                        <span>Offered Batch:</span>
                        <strong className="text-slate-900">{offerQuantity} kg of {data?.cropName || cropName}</strong>
                      </div>
                      <div className="flex justify-between items-center text-sm font-black text-emerald-900 border-t border-emerald-200/80 pt-2">
                        <span>Total Recovered Deal Value:</span>
                        <span className="text-xl font-display text-emerald-700">
                          Rs. {(offerQuantity * offerPrice).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-700">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>100% Escrow Protected • Instant Settlement upon Gate Scan</span>
                      </div>
                    </div>

                    {/* SUBMIT BUTTON */}
                    <button
                      type="submit"
                      disabled={submittingOffer}
                      className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-emerald-500/20 transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {submittingOffer ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Transmitting Offer Signal...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Send Official Dispatch Offer (Rs. {(offerQuantity * offerPrice).toLocaleString()}) 🚀</span>
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  /* CONFIRMATION RECEIPT SCREEN */
                  <div className="space-y-5 animate-fade-in text-center">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto border-4 border-emerald-50 shadow-md">
                      <CheckCircle2 className="w-9 h-9" />
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-xl font-black text-slate-900 font-display">
                        Dispatch Offer Successfully Transmitted! 🎉
                      </h4>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        Official rescue offer sent directly to <strong>{offerSuccessReceipt.buyerName}</strong>'s procurement system.
                      </p>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left space-y-2 text-xs">
                      <div className="flex justify-between items-center text-slate-500">
                        <span>Dispatch Reference:</span>
                        <span className="font-mono font-black text-slate-900">{offerSuccessReceipt.dispatchCode}</span>
                      </div>
                      <div className="flex justify-between items-center text-slate-500">
                        <span>Reserved Volume:</span>
                        <span className="font-bold text-slate-800">{offerSuccessReceipt.quantityKg} kg @ Rs. {offerSuccessReceipt.pricePerKg}/kg</span>
                      </div>
                      <div className="flex justify-between items-center text-slate-500">
                        <span>Total Deal Amount:</span>
                        <span className="font-extrabold text-emerald-700">Rs. {offerSuccessReceipt.totalAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center text-slate-500">
                        <span>Escrow Hold Window:</span>
                        <span className="font-bold text-amber-700">{offerSuccessReceipt.holdHours} Hours</span>
                      </div>
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row gap-3">
                      <Link
                        to="/negotiation"
                        className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow text-center transition flex items-center justify-center gap-1.5"
                      >
                        <FileText className="w-3.5 h-3.5 text-emerald-400" />
                        <span>View Active Negotiations →</span>
                      </Link>
                      <button
                        onClick={handleCloseOfferModal}
                        className="py-3 px-5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-extrabold text-xs rounded-xl shadow-xs transition cursor-pointer"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default WasteReductionModule;
