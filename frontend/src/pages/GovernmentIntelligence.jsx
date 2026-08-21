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
  PieChart
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
  const [simulating, setSimulating] = useState(false);

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
      district: 'Kurunegala',
      primaryCrop: 'Coconut, Fruits & Vegetables',
      surplusPct: 6,
      status: 'OPTIMAL',
      securityScore: 91,
      productionMT: '56,000 MT',
      bufferWeeks: 11.5,
      vulnerability: 'Low'
    },
    {
      district: 'Hambantota',
      primaryCrop: 'Banana, Paddy & Vegetables',
      surplusPct: -12,
      status: 'DEFICIT_WARNING',
      securityScore: 74,
      productionMT: '22,000 MT',
      bufferWeeks: 4.8,
      vulnerability: 'High'
    },
    {
      district: 'Kandy',
      primaryCrop: 'Spices, Tea & Root Crops',
      surplusPct: 4,
      status: 'OPTIMAL',
      securityScore: 88,
      productionMT: '29,500 MT',
      bufferWeeks: 9.0,
      vulnerability: 'Low'
    }
  ];

  const BUFFER_STOCKS = [
    {
      crop: 'Paddy Rice (Samba / Nadu / Keeri)',
      currentReserveWeeks: 14.2,
      targetWeeks: 12.0,
      reserveQuantityMT: '385,000 MT',
      healthStatus: 'HEALTHY',
      pctFull: 95,
      color: 'emerald'
    },
    {
      crop: 'Big Onion & Red Onion',
      currentReserveWeeks: 6.4,
      targetWeeks: 8.0,
      reserveQuantityMT: '42,000 MT',
      healthStatus: 'MODERATE_DEFICIT',
      pctFull: 68,
      color: 'amber'
    },
    {
      crop: 'Upcountry Red Potatoes',
      currentReserveWeeks: 10.8,
      targetWeeks: 10.0,
      reserveQuantityMT: '65,000 MT',
      healthStatus: 'HEALTHY',
      pctFull: 88,
      color: 'emerald'
    },
    {
      crop: 'Green Chillies & Dried Chillies',
      currentReserveWeeks: 5.1,
      targetWeeks: 6.5,
      reserveQuantityMT: '14,500 MT',
      healthStatus: 'CRITICAL_MONITORING',
      pctFull: 54,
      color: 'rose'
    }
  ];

  const MOCK_GOV_DATA = {
    overviewStats: {
      activeFarmers: 42811,
      activeBuyers: 8927,
      currentListings: 73114,
      todayTransactionLkr: 38450000,
      monthlyGrowthRate: 14.2,
      nationalFoodSecurityIndex: 88.4
    },
    policyAlerts: [
      {
        id: 1,
        title: 'Tomato Overproduction Alert (Welimada & Nuwara Eliya)',
        severity: 'CRITICAL',
        category: 'OVERSUPPLY',
        region: 'Central Upcountry',
        impactMetric: '14,200 MT Surplus'
      },
      {
        id: 2,
        title: 'Fall Armyworm Infestation Advisory',
        severity: 'WARNING',
        category: 'DISEASE',
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
    // Dynamic macroeconomic calculation based on the 4 sliders
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
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-16 animate-fade-in print:bg-white print:text-black">
      
      {/* STICKY TOP HEADER */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-6 py-4 print:hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Landmark className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-widest font-extrabold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                  Government &amp; Policy Intelligence
                </span>
                <span className="text-xs text-slate-400">• Real-Time National Agrarian Telemetry</span>
              </div>
              <h1 className="text-2xl font-black tracking-tight text-white font-display">
                SRI LANKA AGRICULTURAL INTELLIGENCE HUB 🏛️
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end md:self-auto">
            <button
              onClick={loadOverview}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <button
              onClick={handleExportReport}
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-500/25 transition flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export Policy Briefing 📄</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-8 space-y-8">
        
        {/* TOP NATIONAL STATS OVERVIEW CARDS */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Registered Farms</span>
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black font-display text-white">
              {overview.activeFarmers.toLocaleString()}
            </div>
            <div className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> +14.2% MoM Digital Onboarding
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Commercial Buyers</span>
              <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400">
                <ShoppingBag className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black font-display text-white">
              {overview.activeBuyers.toLocaleString()}
            </div>
            <div className="text-[11px] font-semibold text-sky-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Keells, Cargills, SPAR &amp; Exporters
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">National Food Security</span>
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                <Activity className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black font-display text-purple-400">
              {overview.nationalFoodSecurityIndex}%
            </div>
            <div className="text-[11px] font-semibold text-purple-300">
              Optimal Island Supply Index
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Daily Trade Velocity</span>
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black font-display text-amber-400">
              Rs. {(overview.todayTransactionLkr / 1000000).toFixed(1)}M
            </div>
            <div className="text-[11px] font-semibold text-slate-400">
              Zero Intermediary Leakage
            </div>
          </div>
        </section>

        {/* NAVIGATION TABS */}
        <div className="flex flex-wrap gap-2.5">
          {[
            { id: 'overview', label: '1. National Risk Alerts 🚨', icon: AlertTriangle },
            { id: 'heatmap', label: '2. District Food Security Heatmap 🗺️', icon: MapPin },
            { id: 'simulator', label: '3. Macroeconomic Policy Simulator ⚡', icon: Sliders },
            { id: 'buffer', label: '4. National Strategic Buffer Stocks 🌾', icon: Database }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold transition flex items-center gap-2 cursor-pointer border ${
                  activeTab === tab.id
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: NATIONAL RISK ALERTS */}
        {activeTab === 'overview' && (
          <section className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-lg font-bold text-white font-display flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-400" /> Agrarian Risk &amp; Early Warning Stream
              </h2>
              <span className="text-xs text-slate-400 font-medium">Department of Agriculture Telemetry</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {filteredAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        alert.severity === 'CRITICAL'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-800'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-800'
                      }`}>
                        {alert.severity}
                      </span>
                      <span className="text-xs text-slate-400 font-bold">{alert.region}</span>
                    </div>

                    <h4 className="font-extrabold text-white text-base font-display">{alert.title}</h4>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-semibold">Impact Assessment:</span>
                    <span className="font-bold text-emerald-400">{alert.impactMetric}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* TAB 2: DISTRICT FOOD SECURITY HEATMAP */}
        {activeTab === 'heatmap' && (
          <section className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-lg font-bold text-white font-display flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-400" /> Regional District Production &amp; Surplus Matrix
              </h2>
              <span className="text-xs text-slate-400">8 Agricultural Agrarian Hubs Tracked</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {DISTRICT_HEATMAP_DATA.map((dist) => (
                <div
                  key={dist.district}
                  className={`p-5 rounded-3xl bg-slate-900 border space-y-3 transition flex flex-col justify-between ${
                    dist.status === 'SURPLUS_RISK'
                      ? 'border-amber-700/80 hover:border-amber-500'
                      : dist.status === 'DEFICIT_WARNING'
                      ? 'border-rose-700/80 hover:border-rose-500'
                      : 'border-slate-800 hover:border-emerald-500'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-extrabold text-white text-base font-display">{dist.district}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        dist.status === 'SURPLUS_RISK'
                          ? 'bg-amber-500/20 text-amber-300'
                          : dist.status === 'DEFICIT_WARNING'
                          ? 'bg-rose-500/20 text-rose-300'
                          : 'bg-emerald-500/20 text-emerald-300'
                      }`}>
                        {dist.status.replace('_', ' ')}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 font-medium">Crops: <strong className="text-slate-200">{dist.primaryCrop}</strong></p>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800/80 space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span>Annual Yield:</span>
                      <strong className="text-slate-200">{dist.productionMT}</strong>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Reserve Buffer:</span>
                      <strong className="text-emerald-400">{dist.bufferWeeks} Weeks</strong>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Surplus Shift:</span>
                      <strong className={dist.surplusPct > 0 ? 'text-amber-400' : 'text-rose-400'}>
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
          <section className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-emerald-800/60 shadow-2xl space-y-6 animate-fade-in">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Sliders className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white font-display">
                  Macroeconomic Agrarian Policy Simulator
                </h2>
                <p className="text-xs text-slate-400">Simulate tariff changes, input subsidies, and buffer storage grants to forecast national inflation</p>
              </div>
            </div>

            {/* 4 SLIDER CONTROLS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Tariff Slider */}
              <div className="space-y-2 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <div className="flex justify-between text-xs font-bold text-slate-300">
                  <span>Import Tariff Adjustment</span>
                  <span className="text-emerald-400 font-mono">{tariffChange > 0 ? `+${tariffChange}%` : `${tariffChange}%`}</span>
                </div>
                <input
                  type="range"
                  min="-30"
                  max="30"
                  step="5"
                  value={tariffChange}
                  onChange={(e) => setTariffChange(parseInt(e.target.value, 10))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <span className="text-[10px] text-slate-500 block">Protect domestic vs. lower consumer prices</span>
              </div>

              {/* Fertilizer Subsidy Slider */}
              <div className="space-y-2 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <div className="flex justify-between text-xs font-bold text-slate-300">
                  <span>Fertilizer Input Subsidy</span>
                  <span className="text-purple-400 font-mono">{fertilizerSubsidy}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="5"
                  value={fertilizerSubsidy}
                  onChange={(e) => setFertilizerSubsidy(parseInt(e.target.value, 10))}
                  className="w-full accent-purple-500 cursor-pointer"
                />
                <span className="text-[10px] text-slate-500 block">Boosts smallholder hectare yield</span>
              </div>

              {/* Fuel & Power Rebate */}
              <div className="space-y-2 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <div className="flex justify-between text-xs font-bold text-slate-300">
                  <span>Agri Diesel &amp; Power Rebate</span>
                  <span className="text-amber-400 font-mono">{fuelSubsidy}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="40"
                  step="5"
                  value={fuelSubsidy}
                  onChange={(e) => setFuelSubsidy(parseInt(e.target.value, 10))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <span className="text-[10px] text-slate-500 block">Reduces machinery &amp; irrigation costs</span>
              </div>

              {/* Storage Grant */}
              <div className="space-y-2 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <div className="flex justify-between text-xs font-bold text-slate-300">
                  <span>Cold Warehouse Grant</span>
                  <span className="text-sky-400 font-mono">Rs. {storageSubsidy}/kg</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="40"
                  step="5"
                  value={storageSubsidy}
                  onChange={(e) => setStorageSubsidy(parseInt(e.target.value, 10))}
                  className="w-full accent-sky-500 cursor-pointer"
                />
                <span className="text-[10px] text-slate-500 block">Incentivizes buffer crop preservation</span>
              </div>
            </div>

            {/* SIMULATION OUTCOME MATRIX */}
            {simResult && (
              <div className="p-6 bg-slate-950 rounded-3xl border border-emerald-500/50 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-emerald-400" />
                    <h3 className="text-base font-extrabold text-white font-display">
                      Forecasted Policy Impact Assessment
                    </h3>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-xs font-black uppercase">
                    {simResult.policyScore}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                  <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Farmer Net Profit</span>
                    <span className="text-2xl font-black font-display text-emerald-400 mt-1 block">
                      +{simResult.farmerIncomeImpact}%
                    </span>
                  </div>

                  <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Food Inflation Shift</span>
                    <span className="text-2xl font-black font-display text-emerald-400 mt-1 block">
                      {simResult.consumerInflationImpact}%
                    </span>
                  </div>

                  <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Self-Sufficiency Index</span>
                    <span className="text-2xl font-black font-display text-purple-400 mt-1 block">
                      {simResult.selfSufficiencyIndex}%
                    </span>
                  </div>

                  <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Buffer Stock Horizon</span>
                    <span className="text-2xl font-black font-display text-sky-400 mt-1 block">
                      +{simResult.bufferExtensionWeeks} Wks
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 font-medium italic leading-relaxed">
                  💡 {simResult.recommendationSummary}
                </p>
              </div>
            )}
          </section>
        )}

        {/* TAB 4: NATIONAL STRATEGIC BUFFER STOCKS */}
        {activeTab === 'buffer' && (
          <section className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-lg font-bold text-white font-display flex items-center gap-2">
                <Database className="w-5 h-5 text-emerald-400" /> National Strategic Commodity Buffer Stock
              </h2>
              <span className="text-xs text-slate-400 font-medium">Warehouse Reserve Silos Capacity</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {BUFFER_STOCKS.map((stock) => (
                <div
                  key={stock.crop}
                  className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-extrabold text-white text-base font-display">{stock.crop}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">Physical Sized Reserve: <strong className="text-slate-200">{stock.reserveQuantityMT}</strong></p>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                      stock.healthStatus === 'HEALTHY'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-800'
                        : stock.healthStatus === 'MODERATE_DEFICIT'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-800'
                        : 'bg-rose-500/20 text-rose-400 border border-rose-800'
                    }`}>
                      {stock.healthStatus.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-semibold">
                      <span className="text-slate-400">Current Runway vs. Target:</span>
                      <span className="text-emerald-400 font-mono font-bold">
                        {stock.currentReserveWeeks} Weeks (Target: {stock.targetWeeks} Wks)
                      </span>
                    </div>

                    <div className="w-full h-3 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                      <div
                        className={`h-full rounded-full ${
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
