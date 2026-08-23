import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { govIntelligenceAPI } from '../services/api';
import {
  ShieldAlert,
  TrendingUp,
  AlertTriangle,
  CloudRain,
  Bug,
  Truck,
  Users,
  ShoppingBag,
  Sprout,
  DollarSign,
  Download,
  Filter,
  RefreshCw,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Cpu,
  Sliders,
  Layers,
  MapPin,
  Fuel,
  Database,
  Building,
  Landmark,
  Scale,
  Sparkles,
  PieChart,
  Package,
  Calendar,
  FileCheck2,
  Info
} from 'lucide-react';

export const GovernmentIntelligence = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDistrict, setSelectedDistrict] = useState('ALL');
  const [filterAlertCategory, setFilterAlertCategory] = useState('ALL');
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'heatmap', 'simulator', 'buffer'

  // Policy Simulator States
  const [tariffChange, setTariffChange] = useState(-5);
  const [storageSubsidy, setStorageSubsidy] = useState(15);
  const [fertilizerSubsidy, setFertilizerSubsidy] = useState(25);
  const [fuelSubsidy, setFuelSubsidy] = useState(20);
  const [simResult, setSimResult] = useState(null);

  const DISTRICT_HEATMAP_DATA = [
    {
      district: 'Nuwara Eliya',
      primaryCrop: 'Upcountry Vegetables & Potatoes',
      surplusPct: 38,
      status: 'SURPLUS_RISK',
      securityScore: 92,
      productionMT: '42,500 MT',
      bufferWeeks: 8.5,
      vulnerability: 'Low'
    },
    {
      district: 'Anuradhapura',
      primaryCrop: 'Samba & Keeri Paddy Rice',
      surplusPct: 14,
      status: 'OPTIMAL',
      securityScore: 95,
      productionMT: '128,000 MT',
      bufferWeeks: 16.2,
      vulnerability: 'Low'
    },
    {
      district: 'Jaffna',
      primaryCrop: 'Red Onion, Chilli & Tobacco',
      surplusPct: -8,
      status: 'DEFICIT_WARNING',
      securityScore: 78,
      productionMT: '18,400 MT',
      bufferWeeks: 5.4,
      vulnerability: 'Moderate'
    },
    {
      district: 'Polonnaruwa',
      primaryCrop: 'Paddy Rice & Maize',
      surplusPct: 22,
      status: 'OPTIMAL',
      securityScore: 94,
      productionMT: '98,000 MT',
      bufferWeeks: 14.8,
      vulnerability: 'Low'
    },
    {
      district: 'Badulla (Welimada)',
      primaryCrop: 'Tomato, Cabbage & Beans',
      surplusPct: 42,
      status: 'SURPLUS_RISK',
      securityScore: 89,
      productionMT: '34,000 MT',
      bufferWeeks: 7.2,
      vulnerability: 'Moderate'
    },
    {
      district: 'Hambantota',
      primaryCrop: 'Watermelon, Banana & Papaya',
      surplusPct: 5,
      status: 'OPTIMAL',
      securityScore: 91,
      productionMT: '22,000 MT',
      bufferWeeks: 9.1,
      vulnerability: 'Low'
    },
    {
      district: 'Matale',
      primaryCrop: 'Black Pepper, Spices & Cocoa',
      surplusPct: 12,
      status: 'OPTIMAL',
      securityScore: 93,
      productionMT: '14,500 MT',
      bufferWeeks: 12.0,
      vulnerability: 'Low'
    },
    {
      district: 'Kurunegala',
      primaryCrop: 'Coconut, Paddy & Vegetables',
      surplusPct: -12,
      status: 'DEFICIT_WARNING',
      securityScore: 84,
      productionMT: '52,000 MT',
      bufferWeeks: 4.8,
      vulnerability: 'Moderate'
    }
  ];

  const BUFFER_STOCKS = [
    {
      crop: 'Paddy Rice (Samba / Keeri)',
      targetWeeks: 16,
      currentReserveWeeks: 14.2,
      reserveQuantityMT: '240,000 MT',
      healthStatus: 'HEALTHY',
      pctFull: 88
    },
    {
      crop: 'Nuwara Eliya Seed Potatoes',
      targetWeeks: 8,
      currentReserveWeeks: 7.8,
      reserveQuantityMT: '12,500 MT',
      healthStatus: 'HEALTHY',
      pctFull: 97
    },
    {
      crop: 'Red Shallots & Big Onion',
      targetWeeks: 10,
      currentReserveWeeks: 5.2,
      reserveQuantityMT: '8,400 MT',
      healthStatus: 'MODERATE_DEFICIT',
      pctFull: 52
    },
    {
      crop: 'Feed Maize & Corn Grain',
      targetWeeks: 12,
      currentReserveWeeks: 10.5,
      reserveQuantityMT: '45,000 MT',
      healthStatus: 'HEALTHY',
      pctFull: 87
    },
    {
      crop: 'Dried Green & Red Chillies',
      targetWeeks: 8,
      currentReserveWeeks: 3.8,
      reserveQuantityMT: '2,900 MT',
      healthStatus: 'CRITICAL_DEFICIT',
      pctFull: 47
    }
  ];

  const MOCK_GOV_DATA = {
    overviewStats: {
      activeFarmers: 1250,
      activeBuyers: 84,
      todayTransactionLkr: 4200000,
      nationalFoodSecurityIndex: 94.2,
      totalTrackedHectares: 18450,
      activeEscrowLkr: 28500000
    },
    policyAlerts: [
      {
        id: 1,
        title: 'Central Province Tomato Overproduction Alert',
        severity: 'CRITICAL',
        category: 'SURPLUS',
        region: 'Welimada & Badulla Valley',
        impactMetric: '+42% Expected Surplus (Aug 2026)'
      },
      {
        id: 2,
        title: 'Fall Armyworm Infestation Risk Vector',
        severity: 'WARNING',
        category: 'PEST',
        region: 'Anuradhapura & Polonnaruwa',
        impactMetric: '1,450 Hectares Under Scan'
      },
      {
        id: 3,
        title: 'Dry Spell Weather Risk (Hambantota Southern Belt)',
        severity: 'WARNING',
        category: 'WEATHER',
        region: 'Southern Dry Zone',
        impactMetric: '-28% Rainfall Deficit'
      }
    ]
  };

  const loadOverview = async () => {
    setLoading(true);
    try {
      const res = await govIntelligenceAPI.getOverview();
      if (res && res.data) {
        setData(res.data);
      } else {
        setData(MOCK_GOV_DATA);
      }
    } catch (err) {
      console.warn('Backend Gov API offline. Loading fallback data:', err);
      setData(MOCK_GOV_DATA);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOverview();
  }, []);

  const calculatePolicySimulation = () => {
    const farmerIncomeImpact = +(12.0 + (fertilizerSubsidy * 0.25) + (fuelSubsidy * 0.20) + (tariffChange > 0 ? tariffChange * 0.3 : tariffChange * 0.15)).toFixed(1);
    const consumerInflationImpact = +(-2.0 - (tariffChange < 0 ? Math.abs(tariffChange) * 0.25 : -tariffChange * 0.3) - (storageSubsidy * 0.12)).toFixed(1);
    const selfSufficiencyIndex = +(82.0 + (fertilizerSubsidy * 0.15) + (storageSubsidy * 0.10)).toFixed(1);
    const bufferExtensionWeeks = +(4.0 + (storageSubsidy * 0.14) + (tariffChange > 0 ? 1.5 : 0)).toFixed(1);

    setSimResult({
      farmerIncomeImpact,
      consumerInflationImpact,
      selfSufficiencyIndex,
      bufferExtensionWeeks,
      policyScore: farmerIncomeImpact > 10 && consumerInflationImpact < 0 ? 'EXCELLENT INTERVENTION' : 'MODERATE IMPACT',
      recommendationSummary: `Combining a ${fertilizerSubsidy}% input subsidy with a Rs. ${storageSubsidy}/kg storage incentive stabilizes market prices while bolstering domestic grower margin by +${farmerIncomeImpact}%.`
    });
  };

  useEffect(() => {
    calculatePolicySimulation();
  }, [tariffChange, storageSubsidy, fertilizerSubsidy, fuelSubsidy]);

  const handleExportReport = () => {
    window.print();
  };

  const overview = data?.overviewStats || MOCK_GOV_DATA.overviewStats;
  const alerts = data?.policyAlerts || MOCK_GOV_DATA.policyAlerts;

  const filteredAlerts = filterAlertCategory === 'ALL'
    ? alerts
    : alerts.filter(a => a.category === filterAlertCategory);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-16 animate-fade-in print:bg-white print:text-black">
      
      {/* 1. CLEAN WHITE & GLASSMORPHIC STICKY TOP HEADER */}
      <header className="sticky top-0 z-40 glass bg-white/90 backdrop-blur-xl border-b border-slate-200/80 px-6 py-4 print:hidden shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
              <Landmark className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-widest font-black text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 shadow-xs">
                  Government &amp; Policy Intelligence
                </span>
                <span className="text-xs text-slate-400 hidden sm:inline font-semibold">• National Agrarian Telemetry</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 font-display mt-0.5">
                SRI LANKA AGRICULTURAL INTELLIGENCE HUB 🏛️
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-end md:self-auto">
            <button
              onClick={loadOverview}
              className="p-2.5 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 rounded-xl border border-slate-200 shadow-xs transition cursor-pointer"
              title="Refresh Telemetry Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-600' : ''}`} />
            </button>

            <button
              onClick={handleExportReport}
              className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-emerald-500/20 transition flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export Policy Briefing 📄</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        
        {/* 2. TOP NATIONAL STATS OVERVIEW CARDS (CLEAN WHITE) */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="premium-card p-6 bg-white border border-slate-200/90 shadow-md rounded-3xl space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Registered Farms</span>
              <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black font-display text-slate-900">
              {overview.activeFarmers.toLocaleString()}
            </div>
            <div className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> +14.2% MoM Digital Onboarding
            </div>
          </div>

          <div className="premium-card p-6 bg-white border border-slate-200/90 shadow-md rounded-3xl space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Commercial Buyers</span>
              <div className="p-2.5 rounded-2xl bg-sky-50 text-sky-600 border border-sky-100">
                <ShoppingBag className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black font-display text-slate-900">
              {overview.activeBuyers.toLocaleString()}
            </div>
            <div className="text-[11px] font-bold text-sky-700 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Keells, Cargills, SPAR &amp; Exporters
            </div>
          </div>

          <div className="premium-card p-6 bg-white border border-slate-200/90 shadow-md rounded-3xl space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">National Food Security</span>
              <div className="p-2.5 rounded-2xl bg-purple-50 text-purple-600 border border-purple-100">
                <Activity className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black font-display text-purple-700">
              {overview.nationalFoodSecurityIndex}%
            </div>
            <div className="text-[11px] font-bold text-purple-600">
              Optimal Island Supply Index
            </div>
          </div>

          <div className="premium-card p-6 bg-white border border-slate-200/90 shadow-md rounded-3xl space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Daily Trade Velocity</span>
              <div className="p-2.5 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black font-display text-amber-700">
              Rs. {(overview.todayTransactionLkr / 1000000).toFixed(1)}M
            </div>
            <div className="text-[11px] font-bold text-slate-500">
              Zero Intermediary Leakage
            </div>
          </div>
        </section>

        {/* 3. NAVIGATION TABS (CLEAN WHITE) */}
        <div className="flex flex-wrap gap-2.5 p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200 w-fit">
          {[
            { id: 'overview', label: '1. National Risk Alerts 🚨', icon: AlertTriangle },
            { id: 'heatmap', label: '2. District Food Security Heatmap 🗺️', icon: MapPin },
            { id: 'simulator', label: '3. Macroeconomic Policy Simulator ⚡', icon: Sliders },
            { id: 'buffer', label: '4. National Strategic Buffer Stocks 🌾', icon: Database }
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

        {/* TAB 1: NATIONAL RISK ALERTS */}
        {activeTab === 'overview' && (
          <section className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
              <h2 className="text-lg font-extrabold text-slate-900 font-display flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-500" /> Agrarian Risk &amp; Early Warning Stream
              </h2>
              <span className="text-xs text-slate-500 font-semibold">Department of Agriculture Live Telemetry</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {filteredAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="premium-card p-6 bg-white border border-slate-200/90 shadow-md rounded-3xl space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    <div className="flex justify-between items-start">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                        alert.severity === 'CRITICAL'
                          ? 'bg-rose-50 text-rose-800 border-rose-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}>
                        {alert.severity}
                      </span>
                      <span className="text-xs text-slate-500 font-bold">{alert.region}</span>
                    </div>

                    <h4 className="font-extrabold text-slate-900 text-base font-display">{alert.title}</h4>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-semibold">Impact Assessment:</span>
                    <span className="font-extrabold text-emerald-700">{alert.impactMetric}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* TAB 2: DISTRICT FOOD SECURITY HEATMAP */}
        {activeTab === 'heatmap' && (
          <section className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
              <h2 className="text-lg font-extrabold text-slate-900 font-display flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-600" /> Regional District Production &amp; Surplus Matrix
              </h2>
              <span className="text-xs text-slate-500 font-semibold">8 Agricultural Agrarian Hubs Tracked</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {DISTRICT_HEATMAP_DATA.map((dist) => (
                <div
                  key={dist.district}
                  className={`premium-card p-6 bg-white border rounded-3xl space-y-4 transition flex flex-col justify-between shadow-md ${
                    dist.status === 'SURPLUS_RISK'
                      ? 'border-amber-300 hover:border-amber-500'
                      : dist.status === 'DEFICIT_WARNING'
                      ? 'border-rose-300 hover:border-rose-500'
                      : 'border-slate-200/90 hover:border-emerald-500'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-extrabold text-slate-900 text-base font-display">{dist.district}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${
                        dist.status === 'SURPLUS_RISK'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : dist.status === 'DEFICIT_WARNING'
                          ? 'bg-rose-50 text-rose-800 border-rose-200'
                          : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      }`}>
                        {dist.status.replace('_', ' ')}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 font-medium">Crops: <strong className="text-slate-800">{dist.primaryCrop}</strong></p>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2 text-xs">
                    <div className="flex justify-between text-slate-500 font-semibold">
                      <span>Annual Yield:</span>
                      <strong className="text-slate-900 font-bold">{dist.productionMT}</strong>
                    </div>
                    <div className="flex justify-between text-slate-500 font-semibold">
                      <span>Reserve Buffer:</span>
                      <strong className="text-emerald-700 font-bold">{dist.bufferWeeks} Weeks</strong>
                    </div>
                    <div className="flex justify-between text-slate-500 font-semibold">
                      <span>Surplus Shift:</span>
                      <strong className={dist.surplusPct > 0 ? 'text-amber-700 font-bold' : 'text-rose-700 font-bold'}>
                        {dist.surplusPct > 0 ? `+${dist.surplusPct}%` : `${dist.surplusPct}%`}
                      </strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* TAB 3: MACROECONOMIC POLICY INTERVENTION SIMULATOR */}
        {activeTab === 'simulator' && (
          <section className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xl space-y-6 animate-fade-in">
            <div className="flex items-center gap-3 border-b border-slate-200/80 pb-4">
              <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200">
                <Sliders className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 font-display">
                  Macroeconomic Agrarian Policy Simulator ⚡
                </h2>
                <p className="text-xs text-slate-500">Simulate tariff revisions, input subsidies, and buffer storage grants to forecast national food inflation</p>
              </div>
            </div>

            {/* 4 SLIDER CONTROLS (CLEAN WHITE) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Tariff Slider */}
              <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>Import Tariff Adjustment</span>
                  <span className="text-emerald-700 font-mono font-black">{tariffChange > 0 ? `+${tariffChange}%` : `${tariffChange}%`}</span>
                </div>
                <input
                  type="range"
                  min="-30"
                  max="30"
                  step="5"
                  value={tariffChange}
                  onChange={(e) => setTariffChange(parseInt(e.target.value, 10))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
                <span className="text-[10px] text-slate-400 block font-medium">Protect domestic vs. lower consumer prices</span>
              </div>

              {/* Fertilizer Subsidy Slider */}
              <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>Fertilizer Input Subsidy</span>
                  <span className="text-purple-700 font-mono font-black">{fertilizerSubsidy}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="5"
                  value={fertilizerSubsidy}
                  onChange={(e) => setFertilizerSubsidy(parseInt(e.target.value, 10))}
                  className="w-full accent-purple-600 cursor-pointer"
                />
                <span className="text-[10px] text-slate-400 block font-medium">Boosts smallholder hectare yield</span>
              </div>

              {/* Fuel & Power Rebate */}
              <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>Agri Diesel &amp; Power Rebate</span>
                  <span className="text-amber-700 font-mono font-black">{fuelSubsidy}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="40"
                  step="5"
                  value={fuelSubsidy}
                  onChange={(e) => setFuelSubsidy(parseInt(e.target.value, 10))}
                  className="w-full accent-amber-600 cursor-pointer"
                />
                <span className="text-[10px] text-slate-400 block font-medium">Reduces machinery &amp; irrigation costs</span>
              </div>

              {/* Storage Grant */}
              <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>Cold Warehouse Grant</span>
                  <span className="text-sky-700 font-mono font-black">Rs. {storageSubsidy}/kg</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="40"
                  step="5"
                  value={storageSubsidy}
                  onChange={(e) => setStorageSubsidy(parseInt(e.target.value, 10))}
                  className="w-full accent-sky-600 cursor-pointer"
                />
                <span className="text-[10px] text-slate-400 block font-medium">Incentivizes buffer crop preservation</span>
              </div>
            </div>

            {/* SIMULATION OUTCOME MATRIX (CLEAN WHITE GLASS GRADIENT) */}
            {simResult && (
              <div className="p-6 bg-gradient-to-br from-emerald-50/80 via-teal-50/40 to-white rounded-3xl border border-emerald-200 shadow-md space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-200/60 pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-emerald-600" />
                    <h3 className="text-base font-extrabold text-slate-900 font-display">
                      Forecasted Policy Impact Assessment
                    </h3>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-black uppercase">
                    {simResult.policyScore}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                  <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Farmer Net Profit</span>
                    <span className="text-2xl font-black font-display text-emerald-600 mt-1 block">
                      +{simResult.farmerIncomeImpact}%
                    </span>
                  </div>

                  <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Food Inflation Shift</span>
                    <span className="text-2xl font-black font-display text-teal-700 mt-1 block">
                      {simResult.consumerInflationImpact}%
                    </span>
                  </div>

                  <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Self-Sufficiency Index</span>
                    <span className="text-2xl font-black font-display text-purple-700 mt-1 block">
                      {simResult.selfSufficiencyIndex}%
                    </span>
                  </div>

                  <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Buffer Stock Runway</span>
                    <span className="text-2xl font-black font-display text-sky-700 mt-1 block">
                      +{simResult.bufferExtensionWeeks} Wks
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-700 font-medium italic leading-relaxed pt-1">
                  💡 {simResult.recommendationSummary}
                </p>
              </div>
            )}
          </section>
        )}

        {/* TAB 4: NATIONAL STRATEGIC BUFFER STOCKS */}
        {activeTab === 'buffer' && (
          <section className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
              <h2 className="text-lg font-extrabold text-slate-900 font-display flex items-center gap-2">
                <Database className="w-5 h-5 text-emerald-600" /> National Strategic Commodity Buffer Stocks
              </h2>
              <span className="text-xs text-slate-500 font-semibold">Warehouse Reserve Silos Capacity</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {BUFFER_STOCKS.map((stock) => (
                <div
                  key={stock.crop}
                  className="premium-card p-6 bg-white border border-slate-200/90 shadow-md rounded-3xl space-y-4"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-base font-display">{stock.crop}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Physical Sized Reserve: <strong className="text-slate-800">{stock.reserveQuantityMT}</strong></p>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase border ${
                      stock.healthStatus === 'HEALTHY'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : stock.healthStatus === 'MODERATE_DEFICIT'
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : 'bg-rose-50 text-rose-800 border-rose-200'
                    }`}>
                      {stock.healthStatus.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-semibold">
                      <span className="text-slate-500">Current Runway vs. Target:</span>
                      <span className="text-emerald-700 font-mono font-bold">
                        {stock.currentReserveWeeks} Weeks (Target: {stock.targetWeeks} Wks)
                      </span>
                    </div>

                    <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          stock.pctFull >= 80 ? 'bg-emerald-500' : stock.pctFull >= 60 ? 'bg-amber-500' : 'bg-rose-500'
                        }`}
                        style={{ width: `${stock.pctFull}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </main>
    </div>
  );
};

export default GovernmentIntelligence;
