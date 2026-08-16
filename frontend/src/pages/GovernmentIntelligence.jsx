import React, { useState, useEffect } from 'react';
import { govIntelligenceAPI } from '../services/api';
import {
  ShieldAlert, TrendingUp, AlertTriangle, CloudRain, Bug, Truck,
  Users, ShoppingBag, Sprout, DollarSign, Download, Filter, RefreshCw,
  CheckCircle2, ArrowUpRight, ArrowDownRight, Activity, Cpu, Sliders, Layers
} from 'lucide-react';

export const GovernmentIntelligence = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDistrict, setSelectedDistrict] = useState('ALL');
  const [filterAlertCategory, setFilterAlertCategory] = useState('ALL');

  // Simulator State
  const [tariffChange, setTariffChange] = useState(-5);
  const [storageSubsidy, setStorageSubsidy] = useState(15);
  const [fertilizerSubsidy, setFertilizerSubsidy] = useState(20);
  const [simResult, setSimResult] = useState(null);
  const [simulating, setSimulating] = useState(false);

  const MOCK_GOV_DATA = {
    activeRiskAlerts: [
      { id: 1, title: 'Tomato Overproduction Risk', severity: 'CRITICAL', category: 'SURPLUS', region: 'Nuwara Eliya', impactMetric: '8,400 MT Projected Surplus' },
      { id: 2, title: 'Dry Zone Pest Warning (Armyworm)', severity: 'HIGH', category: 'PEST_OUTBREAK', region: 'Anuradhapura', impactMetric: '1,200 Hectares Affected' },
      { id: 3, title: 'Onion Price Spike Hazard', severity: 'MEDIUM', category: 'PRICE_SPIKE', region: 'Jaffna', impactMetric: 'Retail Price +18%' }
    ],
    productionMetrics: {
      totalMonthlyProductionKg: 45000000,
      bufferStockHealthPct: 88,
      subsidyDisbursedLkr: 240000000,
      activeFarmersCount: 14200
    },
    districtHeatmap: [
      { district: 'Nuwara Eliya', primaryCrop: 'Carrot & Tomato', riskLevel: 'HIGH', surplusPct: 34 },
      { district: 'Jaffna', primaryCrop: 'Red Onion', riskLevel: 'MEDIUM', surplusPct: 12 },
      { district: 'Anuradhapura', primaryCrop: 'Paddy Rice', riskLevel: 'LOW', surplusPct: 5 }
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
      console.warn('Backend API offline. Loading Government Intelligence fallback:', err);
      setData(MOCK_GOV_DATA);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOverview();
  }, []);

  const handleSimulate = async () => {
    setSimulating(true);
    try {
      const res = await govIntelligenceAPI.simulatePolicy({
        importTariffChangePct: parseFloat(tariffChange),
        storageSubsidyLkrPerKg: parseFloat(storageSubsidy),
        fertilizerSubsidyPct: parseFloat(fertilizerSubsidy)
      });
      if (res && res.data) {
        setSimResult(res.data);
      } else {
        setSimResult({
          projectedFarmerIncomeChangePct: 14.2,
          consumerPriceImpactPct: -4.8,
          postHarvestLossReductionPct: 22.5,
          policyScore: 'EXCELLENT'
        });
      }
    } catch (err) {
      setSimResult({
        projectedFarmerIncomeChangePct: 14.2,
        consumerPriceImpactPct: -4.8,
        postHarvestLossReductionPct: 22.5,
        policyScore: 'EXCELLENT'
      });
    } finally {
      setSimulating(false);
    }
  };

  useEffect(() => {
    handleSimulate();
  }, [tariffChange, storageSubsidy, fertilizerSubsidy]);

  const handleExportReport = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="text-center space-y-4">
          <RefreshCw className="w-10 h-10 animate-spin text-emerald-400 mx-auto" />
          <p className="text-lg font-bold font-display tracking-wide">Synthesizing Sri Lanka Agricultural Intelligence...</p>
          <p className="text-xs text-slate-400">Connecting to Agrarian Services, Department of Agriculture & Central Markets</p>
        </div>
      </div>
    );
  }

  const overview = data?.overviewStats || {
    activeFarmers: 42811,
    activeBuyers: 8927,
    currentListings: 73114,
    todayTransactionLkr: 38450000,
    monthlyGrowthRate: 14.2,
    nationalFoodSecurityIndex: 84.5
  };

  const alerts = data?.policyAlerts || [];
  const districts = data?.districtProductions || [];
  const demandSupply = data?.cropDemandSupplies || [];
  const prices = data?.priceMarketIndices || [];
  const diseaseLogs = data?.diseaseOutbreakLogs || [];
  const supplyChain = data?.supplyChainMetrics || {};

  const filteredAlerts = filterAlertCategory === 'ALL'
    ? alerts
    : alerts.filter(a => a.category === filterAlertCategory);

  const filteredDistricts = selectedDistrict === 'ALL'
    ? districts
    : districts.filter(d => d.district === selectedDistrict);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-16 animate-fade-in print:bg-white print:text-black">
      {/* HEADER BAR */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-6 py-4 print:hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-widest font-extrabold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                  Government & Policy Portal
                </span>
                <span className="text-xs text-slate-400">• Real-Time National Analytics</span>
              </div>
              <h1 className="text-2xl font-black tracking-tight text-white font-display">
                SRI LANKA AGRICULTURAL OVERVIEW
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end md:self-auto">
            <button
              onClick={loadOverview}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition"
              title="Refresh Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <button
              onClick={handleExportReport}
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/25 transition flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Export Policy Brief</span>
            </button>
          </div>
        </div>
      </header>

      {/* PRINT-ONLY HEADER */}
      <div className="hidden print:block p-8 border-b-2 border-slate-900">
        <h1 className="text-3xl font-bold">MINISTRY OF AGRICULTURE & POLICYMAKER BRIEFING</h1>
        <p className="text-sm text-slate-600">National AgroLink Intelligence Report • Generated: {new Date().toLocaleDateString()}</p>
      </div>

      <main className="max-w-7xl mx-auto px-6 pt-8 space-y-8">
        
        {/* 1. TOP NATIONAL STATS CARDS */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs uppercase font-extrabold tracking-widest text-slate-400">
              National Key Performance Indicators
            </h2>
            <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span> Live Feed Sync Active
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Active Farmers */}
            <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-900/80 border border-slate-800/80 hover:border-emerald-500/50 transition-all shadow-xl space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-bold uppercase tracking-wider">Active Farmers</span>
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <Users className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl font-black font-display text-white">
                {overview.activeFarmers.toLocaleString()}
              </div>
              <div className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5" /> +14.2% MoM growth
              </div>
            </div>

            {/* Active Buyers */}
            <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-900/80 border border-slate-800/80 hover:border-sky-500/50 transition-all shadow-xl space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-bold uppercase tracking-wider">Active Buyers</span>
                <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400">
                  <ShoppingBag className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl font-black font-display text-white">
                {overview.activeBuyers.toLocaleString()}
              </div>
              <div className="text-[11px] font-semibold text-sky-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Verified Commercial & Retail
              </div>
            </div>

            {/* Current Listings */}
            <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-900/80 border border-slate-800/80 hover:border-purple-500/50 transition-all shadow-xl space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-bold uppercase tracking-wider">Current Listings</span>
                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                  <Sprout className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl font-black font-display text-white">
                {overview.currentListings.toLocaleString()}
              </div>
              <div className="text-[11px] font-semibold text-purple-400">
                25 Districts Covered
              </div>
            </div>

            {/* Today's Transactions */}
            <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-900/80 border border-slate-800/80 hover:border-amber-500/50 transition-all shadow-xl space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-bold uppercase tracking-wider">Today's Transactions</span>
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl font-black font-display text-amber-400">
                Rs {(overview.todayTransactionLkr / 1000000).toFixed(1)}M
              </div>
              <div className="text-[11px] font-semibold text-slate-400">
                LKR Financial Velocity
              </div>
            </div>
          </div>
        </section>

        {/* 2. PREDICTIVE WARNING & POLICY ALERT FEED */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-bold text-white font-display">
                Early Warning & Policy Risk Feeds
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <div className="flex gap-1.5 overflow-x-auto text-xs font-bold">
                {['ALL', 'SHORTAGE', 'OVERSUPPLY', 'WEATHER', 'DISEASE', 'SUPPLY_CHAIN'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilterAlertCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg border transition ${
                      filterAlertCategory === cat
                        ? 'bg-amber-500 text-slate-950 border-amber-400 font-extrabold'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAlerts.map((alert) => {
              const isCritical = alert.severity === 'CRITICAL';
              const isWarning = alert.severity === 'WARNING';

              return (
                <div
                  key={alert.id}
                  className={`p-5 rounded-2xl border transition-all space-y-3 relative overflow-hidden ${
                    isCritical
                      ? 'bg-red-950/20 border-red-800/80 hover:border-red-500'
                      : isWarning
                      ? 'bg-amber-950/20 border-amber-800/80 hover:border-amber-500'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 text-[10px] font-black rounded uppercase tracking-wider ${
                        isCritical ? 'bg-red-500 text-white' : isWarning ? 'bg-amber-500 text-slate-950' : 'bg-blue-500 text-white'
                      }`}>
                        {alert.severity}
                      </span>
                      <span className="text-xs text-slate-400 font-bold">{alert.region}</span>
                    </div>
                    {alert.category === 'WEATHER' ? <CloudRain className="w-5 h-5 text-sky-400" /> :
                     alert.category === 'DISEASE' ? <Bug className="w-5 h-5 text-emerald-400" /> :
                     alert.category === 'SUPPLY_CHAIN' ? <Truck className="w-5 h-5 text-purple-400" /> :
                     <AlertTriangle className="w-5 h-5 text-amber-400" />}
                  </div>

                  <div>
                    <h3 className="text-base font-extrabold text-white font-display">
                      ⚠ {alert.title}
                    </h3>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      {alert.details}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 text-[11px] text-emerald-300 font-semibold bg-emerald-950/30 p-2.5 rounded-xl border border-emerald-800/50">
                    <span className="font-bold uppercase text-emerald-400">Policy Recommendation:</span> {alert.recommendedAction}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 3. CROP PRODUCTION BY DISTRICT & DEMAND VS SUPPLY GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* DISTRICT PRODUCTION TABLE */}
          <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
                  <Sprout className="w-5 h-5 text-emerald-400" />
                  Crop Production by District
                </h3>
                <p className="text-xs text-slate-400">Harvest yield projections & active farmer density</p>
              </div>

              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="bg-slate-800 border border-slate-700 text-xs font-bold rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="ALL">All Sri Lanka Districts</option>
                {districts.map(d => (
                  <option key={d.district} value={d.district}>{d.district} ({d.province})</option>
                ))}
              </select>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="p-3">District</th>
                    <th className="p-3">Primary Produce</th>
                    <th className="p-3 text-right">Yield (Tons)</th>
                    <th className="p-3 text-right">Active Farmers</th>
                    <th className="p-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300 font-semibold">
                  {filteredDistricts.map((d) => (
                    <tr key={d.district} className="hover:bg-slate-800/50 transition">
                      <td className="p-3 font-bold text-white">
                        {d.district}
                        <span className="block text-[10px] text-slate-400 font-normal">{d.province} Prov.</span>
                      </td>
                      <td className="p-3 text-emerald-400 font-bold">{d.primaryCrop}</td>
                      <td className="p-3 text-right font-mono font-bold text-white">{d.cropYieldTons.toLocaleString()} T</td>
                      <td className="p-3 text-right font-mono">{d.activeFarmers.toLocaleString()}</td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          d.riskStatus === 'HIGH' ? 'bg-red-500/20 text-red-400 border border-red-800' :
                          d.riskStatus === 'MODERATE' ? 'bg-amber-500/20 text-amber-400 border border-amber-800' :
                          'bg-emerald-500/20 text-emerald-400 border border-emerald-800'
                        }`}>
                          {d.riskStatus} RISK
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* CROP DEMAND VS SUPPLY BALANCE */}
          <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div>
              <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
                <Sliders className="w-5 h-5 text-sky-400" />
                National Demand vs Supply
              </h3>
              <p className="text-xs text-slate-400">Shortage & oversupply gap analysis</p>
            </div>

            <div className="space-y-3.5 max-h-[380px] overflow-y-auto pr-1">
              {demandSupply.map((item) => {
                const isDeficit = item.balanceStatus === 'DEFICIT';
                const pct = Math.min(100, Math.max(10, (item.supplyTons / item.demandTons) * 100));

                return (
                  <div key={item.cropName} className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-white">{item.cropName}</span>
                      <span className={`font-mono text-[11px] ${isDeficit ? 'text-red-400' : 'text-emerald-400'}`}>
                        {item.gapPercentage > 0 ? `+${item.gapPercentage}%` : `${item.gapPercentage}%`} ({item.balanceStatus})
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isDeficit ? 'bg-gradient-to-r from-red-600 to-amber-500' : 'bg-gradient-to-r from-teal-500 to-emerald-400'
                        }`}
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold font-mono">
                      <span>Supply: {item.supplyTons.toLocaleString()} T</span>
                      <span>Demand: {item.demandTons.toLocaleString()} T</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* 4. MARKET PRICES & DISEASE LOGS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* AVERAGE MARKET PRICES & INFLATION */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div>
              <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                Central Market Wholesale & Retail Indices
              </h3>
              <p className="text-xs text-slate-400">Live commodity prices per kg across major economic centers</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {prices.map((p) => {
                const isUp = p.weeklyPriceChangePct > 0;

                return (
                  <div key={p.cropName + p.centralMarket} className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-white">{p.cropName}</span>
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                        {p.centralMarket}
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-xs text-slate-400">Wholesale: </span>
                        <span className="text-sm font-black font-mono text-emerald-400">Rs {p.avgWholesalePriceRs}</span>
                      </div>
                      <div>
                        <span className="text-xs text-slate-400">Retail: </span>
                        <span className="text-sm font-black font-mono text-white">Rs {p.avgRetailPriceRs}</span>
                      </div>
                    </div>

                    <div className={`text-[10px] font-extrabold flex items-center gap-1 ${isUp ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      {isUp ? `+${p.weeklyPriceChangePct}% weekly shift` : `${p.weeklyPriceChangePct}% price drop`}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* DISEASE OUTBREAK MONITORING */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div>
              <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
                <Bug className="w-5 h-5 text-red-400" />
                Plant Pest & Disease Surveillance
              </h3>
              <p className="text-xs text-slate-400">Agrarian Services field reports & pathogen tracking</p>
            </div>

            <div className="space-y-3">
              {diseaseLogs.map((log) => (
                <div key={log.diseaseName} className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-white">{log.diseaseName}</span>
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded">
                        {log.cropAffected}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Region: <span className="text-slate-200 font-semibold">{log.locationDistrict}</span> • Reported Cases: <span className="font-mono font-bold text-white">{log.reportedCases}</span>
                    </p>
                  </div>

                  <span className={`px-2.5 py-1 rounded text-[10px] font-extrabold uppercase ${
                    log.status === 'SPREADING' ? 'bg-red-500/20 text-red-400 border border-red-800' :
                    log.status === 'MONITORING' ? 'bg-amber-500/20 text-amber-400 border border-amber-800' :
                    'bg-emerald-500/20 text-emerald-400 border border-emerald-800'
                  }`}>
                    {log.status}
                  </span>
                </div>
              ))}
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <span className="text-slate-400 font-semibold">National Cold Chain Storage Utilization</span>
                <p className="font-bold text-white font-mono">{supplyChain.coldChainStorageUtilizationPct}% Active Capacity</p>
              </div>
              <div className="text-right space-y-0.5">
                <span className="text-slate-400 font-semibold">Post-Harvest Loss Avg</span>
                <p className="font-bold text-amber-400 font-mono">{supplyChain.postHarvestLossPercentage}%</p>
              </div>
            </div>
          </div>

        </div>

        {/* 5. INTERACTIVE POLICY INTERVENTION SIMULATOR */}
        <section className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-emerald-800/60 shadow-2xl space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white font-display">
                National Policy Impact Simulator
              </h2>
              <p className="text-xs text-slate-400">Simulate macroeconomic interventions to forecast market stability and consumer price inflation</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Tariff Slider */}
            <div className="space-y-2 bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="flex justify-between text-xs font-bold text-slate-300">
                <span>Import Tariff Change</span>
                <span className="text-emerald-400 font-mono">{tariffChange}%</span>
              </div>
              <input
                type="range"
                min="-30"
                max="30"
                value={tariffChange}
                onChange={(e) => setTariffChange(e.target.value)}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 block">Relax or restrict food import tariffs</span>
            </div>

            {/* Storage Subsidy Slider */}
            <div className="space-y-2 bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="flex justify-between text-xs font-bold text-slate-300">
                <span>Storage Grant / Subsidy</span>
                <span className="text-sky-400 font-mono">Rs {storageSubsidy}/kg</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                value={storageSubsidy}
                onChange={(e) => setStorageSubsidy(e.target.value)}
                className="w-full accent-sky-500 cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 block">Incentivize cold storage and warehouse buffer</span>
            </div>

            {/* Fertilizer Subsidy Slider */}
            <div className="space-y-2 bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="flex justify-between text-xs font-bold text-slate-300">
                <span>Fertilizer Subsidy Support</span>
                <span className="text-purple-400 font-mono">{fertilizerSubsidy}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                value={fertilizerSubsidy}
                onChange={(e) => setFertilizerSubsidy(e.target.value)}
                className="w-full accent-purple-500 cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 block">Boost farmer crop yield per hectare</span>
            </div>
          </div>

          {/* SIMULATION RESULTS BOX */}
          {simResult && (
            <div className="p-5 rounded-xl bg-slate-950 border border-emerald-500/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-black tracking-widest text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                    AI Forecast Outcome
                  </span>
                  <span className="text-xs text-slate-300 font-bold">
                    Food Security Score Impact: <span className="text-emerald-400 font-mono">+{simResult.foodSecurityScoreImpact} pts</span>
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  {simResult.policyRecommendation}
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono font-bold self-end md:self-auto">
                <div className="bg-slate-900 px-3 py-2 rounded-lg border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 font-sans block">Price Shift</span>
                  <span className={simResult.projectedPriceChangePct < 0 ? 'text-emerald-400' : 'text-amber-400'}>
                    {simResult.projectedPriceChangePct}%
                  </span>
                </div>
                <div className="bg-slate-900 px-3 py-2 rounded-lg border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 font-sans block">Supply Boost</span>
                  <span className="text-emerald-400">
                    +{simResult.projectedNationalSupplyIncreasePct}%
                  </span>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default GovernmentIntelligence;
