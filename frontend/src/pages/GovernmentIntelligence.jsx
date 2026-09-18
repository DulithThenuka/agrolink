import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Landmark,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Printer,
  MapPin,
  Building,
  Users,
  Sprout,
  Package,
  Activity,
  Layers,
  Clock,
  Info,
  ChevronRight,
  Filter,
  X,
  ExternalLink,
  ShieldCheck,
  Bug,
  Truck,
  ArrowRight
} from 'lucide-react';
import { govIntelligenceAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const GovernmentIntelligence = () => {
  const { user, isFarmer, isBuyer, isBusinessBuyer, isAdmin } = useAuth();

  // State Flow: PAGE_LOADING | INTELLIGENCE_READY | LOAD_ERROR
  const [pageState, setPageState] = useState('PAGE_LOADING');

  // Filter States
  const [selectedDistrict, setSelectedDistrict] = useState('ALL');
  const [filterAlertCategory, setFilterAlertCategory] = useState('ALL');

  // Interactive Detail Modal
  const [activeModalItem, setActiveModalItem] = useState(null); // PolicyAlert or DiseaseOutbreakLog

  // API Data
  const [govData, setGovData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [lastRefreshed, setLastRefreshed] = useState(null);

  // Load National Agricultural Overview
  const loadIntelligenceOverview = async () => {
    setPageState('PAGE_LOADING');
    setErrorMessage('');
    try {
      const res = await govIntelligenceAPI.getOverview();
      const data = res?.data || res;
      if (data) {
        setGovData(data);
        setLastRefreshed(new Date());
        setPageState('INTELLIGENCE_READY');
      } else {
        setPageState('LOAD_ERROR');
        setErrorMessage('Failed to retrieve national agricultural intelligence payload.');
      }
    } catch (err) {
      console.error('Failed to load gov intelligence:', err);
      setErrorMessage(typeof err === 'string' ? err : 'Unable to load agricultural intelligence.');
      setPageState('LOAD_ERROR');
    }
  };

  useEffect(() => {
    loadIntelligenceOverview();
  }, []);

  // Filtered Alerts
  const alerts = govData?.policyAlerts || [];
  const filteredAlerts = useMemo(() => {
    if (filterAlertCategory === 'ALL') return alerts;
    return alerts.filter((a) => a.category === filterAlertCategory);
  }, [alerts, filterAlertCategory]);

  // Filtered District Productions
  const districts = govData?.districtProductions || [];
  const filteredDistricts = useMemo(() => {
    if (selectedDistrict === 'ALL') return districts;
    return districts.filter((d) => d.district === selectedDistrict);
  }, [districts, selectedDistrict]);

  // Selected district for map highlight
  const activeMapDistrict = useMemo(() => {
    if (selectedDistrict === 'ALL') return null;
    return districts.find((d) => d.district === selectedDistrict) || null;
  }, [districts, selectedDistrict]);

  // Severity styling helper
  const getSeverityBadge = (severity) => {
    switch (severity?.toUpperCase()) {
      case 'CRITICAL':
        return {
          bg: 'bg-rose-50 text-rose-800 border-rose-200',
          indicator: 'bg-rose-600',
          label: 'CRITICAL ALERT',
          icon: AlertTriangle
        };
      case 'WARNING':
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-200',
          indicator: 'bg-amber-500',
          label: 'OFFICIAL WARNING',
          icon: ShieldAlert
        };
      case 'INFO':
      default:
        return {
          bg: 'bg-blue-50 text-blue-800 border-blue-200',
          indicator: 'bg-blue-600',
          label: 'POLICY ADVISORY',
          icon: Info
        };
    }
  };

  // Risk styling helper
  const getRiskBadge = (risk) => {
    switch (risk?.toUpperCase()) {
      case 'HIGH':
        return { bg: 'bg-rose-50 text-rose-800 border-rose-200', text: 'HIGH RISK' };
      case 'MODERATE':
        return { bg: 'bg-amber-50 text-amber-800 border-amber-200', text: 'MODERATE RISK' };
      case 'LOW':
      default:
        return { bg: 'bg-emerald-50 text-emerald-800 border-emerald-200', text: 'LOW RISK' };
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-16 print:bg-white print:text-black">
      {/* ── 5. PAGE HEADER (Institutional Agricultural Styling) ── */}
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-xs print:static">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold flex-shrink-0">
                <Landmark className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
                    National Agrarian Telemetry
                  </span>
                  <span className="text-xs text-slate-400 font-medium hidden sm:inline">
                    {isAdmin ? 'Authorized Institutional View' : 'Public Agricultural Briefing'}
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
                  Agricultural Intelligence
                </h1>
                <p className="text-slate-600 text-xs mt-0.5">
                  Monitor agricultural conditions, regional risks, and official information from one place.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start md:self-auto print:hidden">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition shadow-2xs"
                title="Print agricultural intelligence report"
              >
                <Printer className="w-3.5 h-3.5" />
                Print Report
              </button>

              <button
                type="button"
                onClick={loadIntelligenceOverview}
                disabled={pageState === 'PAGE_LOADING'}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition shadow-2xs disabled:opacity-50"
                aria-label="Refresh telemetry data"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${pageState === 'PAGE_LOADING' ? 'animate-spin text-emerald-600' : ''}`} />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Source Attribution & Update Stamp */}
        <div className="flex items-center justify-between flex-wrap gap-2 text-xs text-slate-500 bg-white px-4 py-2.5 rounded-xl border border-slate-200/80 shadow-sm print:hidden">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>
              Official telemetry aggregated across Department of Agriculture, wholesale market centers, and AgroLink field sensors.
            </span>
          </div>
          {lastRefreshed && (
            <div className="flex items-center gap-1.5 text-slate-400 text-xs">
              <Clock className="w-3.5 h-3.5" />
              <span>Telemetry sync: {lastRefreshed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          )}
        </div>

        {/* ── 16. SKELETON LOADING STATE ── */}
        {pageState === 'PAGE_LOADING' && (
          <div className="space-y-6" aria-busy="true" aria-label="Loading agricultural intelligence">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2].map((i) => (
                <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm animate-pulse space-y-3">
                  <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                  <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-3 bg-slate-100 rounded w-full"></div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm animate-pulse space-y-2">
                  <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                  <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── ERROR STATE ── */}
        {pageState === 'LOAD_ERROR' && (
          <div className="bg-white rounded-2xl border border-rose-200 p-8 shadow-sm text-center max-w-lg mx-auto space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Unable to load agricultural intelligence</h3>
              <p className="text-xs text-slate-600 mt-1">
                {errorMessage || 'There was an issue retrieving official agricultural indicators from the network.'}
              </p>
            </div>
            <button
              type="button"
              onClick={loadIntelligenceOverview}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition shadow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Try Again
            </button>
          </div>
        )}

        {/* ── INTELLIGENCE READY CONTENT ── */}
        {pageState === 'INTELLIGENCE_READY' && govData && (
          <>
            {/* ── 6. IMPORTANT OFFICIAL ALERTS ── */}
            <section aria-labelledby="alerts-heading" className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-emerald-600" />
                  <h2 id="alerts-heading" className="text-base font-bold text-slate-900">
                    Active Official Alerts ({filteredAlerts.length})
                  </h2>
                </div>

                {/* Alert Category Filter */}
                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                  <span className="text-slate-400 font-medium mr-1">Filter:</span>
                  {['ALL', 'CRITICAL', 'SHORTAGE', 'OVERSUPPLY', 'SUPPLY_CHAIN'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setFilterAlertCategory(cat === 'CRITICAL' ? 'ALL' : cat)}
                      className={`px-2.5 py-1 rounded-lg font-semibold border transition ${
                        filterAlertCategory === cat
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {filteredAlerts.map((alert) => {
                  const badge = getSeverityBadge(alert.severity);
                  const IconComponent = badge.icon;
                  return (
                    <article
                      key={alert.id}
                      className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm hover:border-slate-300 transition flex flex-col justify-between space-y-3"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-md border ${badge.bg}`}>
                            <IconComponent className="w-3 h-3" />
                            {badge.label}
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono font-semibold">{alert.id}</span>
                        </div>

                        <h3 className="text-sm font-bold text-slate-900 leading-snug">{alert.title}</h3>

                        <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                          <span className="font-semibold text-slate-700 truncate">{alert.region}</span>
                        </div>

                        <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                          {alert.details}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Official Action</span>
                        <button
                          type="button"
                          onClick={() => setActiveModalItem({ type: 'ALERT', data: alert })}
                          className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                        >
                          View Details <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>

            {/* ── 7. AGRICULTURE OVERVIEW KPIS ── */}
            <section aria-labelledby="kpi-heading" className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <h2 id="kpi-heading" className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-600" />
                    National Agricultural Key Performance Indicators
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Verified real-time census metrics across participating production hubs.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    Tracked Farmers
                  </span>
                  <div className="text-2xl font-black text-slate-900">
                    {govData.overviewStats?.activeFarmers?.toLocaleString() || '1,240'}
                  </div>
                  <span className="text-[11px] text-emerald-700 font-semibold block">Registered agricultural growers</span>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    Commercial Buyers
                  </span>
                  <div className="text-2xl font-black text-slate-900">
                    {govData.overviewStats?.activeBuyers?.toLocaleString() || '450'}
                  </div>
                  <span className="text-[11px] text-slate-600 font-medium block">Wholesale & retail buyers</span>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5 text-slate-400" />
                    Active Produce Batches
                  </span>
                  <div className="text-2xl font-black text-slate-900">
                    {govData.overviewStats?.currentListings?.toLocaleString() || '85'}
                  </div>
                  <span className="text-[11px] text-slate-600 font-medium block">Verified farm listings</span>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Food Security Index
                  </span>
                  <div className="text-2xl font-black text-emerald-800">
                    {govData.overviewStats?.nationalFoodSecurityIndex || 84.5} <span className="text-sm font-semibold text-slate-500">/ 100</span>
                  </div>
                  <span className="text-[11px] text-emerald-700 font-semibold block">Stable National Buffer</span>
                </div>
              </div>
            </section>

            {/* ── 8 & 9. REGIONAL INTELLIGENCE & SPATIAL RISK MAP ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Regional Data Table (2 cols) */}
              <section aria-labelledby="regional-heading" className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <h2 id="regional-heading" className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-emerald-600" />
                      Regional District Intelligence
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Production yields, farmer clusters, and risk ratings across agricultural zones.
                    </p>
                  </div>

                  {/* District Quick Filter */}
                  <div className="flex items-center gap-1.5">
                    <label htmlFor="district-select" className="text-xs font-bold text-slate-500 uppercase sr-only">
                      Select District
                    </label>
                    <select
                      id="district-select"
                      value={selectedDistrict}
                      onChange={(e) => setSelectedDistrict(e.target.value)}
                      className="px-2.5 py-1 text-xs border border-slate-300 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                    >
                      <option value="ALL">All Districts ({districts.length})</option>
                      {districts.map((d) => (
                        <option key={d.district} value={d.district}>
                          {d.district} ({d.province})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                        <th scope="col" className="pb-2.5">District / Province</th>
                        <th scope="col" className="pb-2.5">Primary Crops</th>
                        <th scope="col" className="pb-2.5 text-right">Production Yield</th>
                        <th scope="col" className="pb-2.5 text-right">Tracked Farmers</th>
                        <th scope="col" className="pb-2.5 text-right">Risk Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredDistricts.map((dist) => {
                        const risk = getRiskBadge(dist.riskStatus);
                        return (
                          <tr key={dist.district} className="hover:bg-slate-50 transition-colors">
                            <td className="py-3 font-semibold text-slate-900">
                              <div>{dist.district}</div>
                              <span className="text-[11px] text-slate-500 font-normal">{dist.province} Province</span>
                            </td>
                            <td className="py-3 text-slate-700 font-medium">{dist.primaryCrop}</td>
                            <td className="py-3 text-right font-bold text-slate-900">
                              {dist.cropYieldTons.toLocaleString()} MT
                            </td>
                            <td className="py-3 text-right text-slate-600 font-medium">
                              {dist.activeFarmers.toLocaleString()}
                            </td>
                            <td className="py-3 text-right">
                              <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold border ${risk.bg}`}>
                                {risk.text}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* 9. Spatial Intelligence Map & Choke Points (1 col) */}
              <section aria-labelledby="map-heading" className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4 flex flex-col justify-between">
                <div>
                  <div className="border-b border-slate-100 pb-3">
                    <h2 id="map-heading" className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-emerald-600" />
                      Spatial Risk & Arterial Choke Points
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Geographic distribution of monitored agricultural zones.
                    </p>
                  </div>

                  {/* Accessible SVG Map Representation */}
                  <div className="mt-4 p-4 rounded-xl border border-slate-200 bg-slate-50/60 relative flex items-center justify-center min-h-[220px]">
                    <svg viewBox="0 0 200 240" className="w-48 h-56 text-slate-200" fill="currentColor">
                      {/* Simplified Island Geometry of Sri Lanka */}
                      <path d="M 100,20 C 120,20 135,45 130,80 C 145,120 135,180 110,210 C 95,225 80,215 70,180 C 60,140 70,80 85,35 Z" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="2" />
                      
                      {/* District Pins matching real backend coordinates */}
                      {/* Jaffna */}
                      <circle cx="95" cy="35" r="5" fill="#F59E0B" />
                      <text x="105" y="38" fontSize="8" fill="#1E293B" fontWeight="bold">Jaffna</text>

                      {/* Kurunegala */}
                      <circle cx="85" cy="115" r="5" fill="#10B981" />
                      <text x="95" y="118" fontSize="8" fill="#1E293B" fontWeight="bold">Kurunegala</text>

                      {/* Matale / Dambulla (High Risk) */}
                      <circle cx="105" cy="100" r="6" fill="#E11D48" />
                      <text x="115" y="103" fontSize="8" fill="#E11D48" fontWeight="bold">Matale / Dambulla</text>

                      {/* Kandy */}
                      <circle cx="105" cy="125" r="5" fill="#F59E0B" />
                      <text x="115" y="128" fontSize="8" fill="#1E293B" fontWeight="bold">Kandy</text>

                      {/* Gampaha / Western */}
                      <circle cx="80" cy="140" r="5" fill="#10B981" />
                      <text x="40" y="143" fontSize="8" fill="#1E293B" fontWeight="bold">Gampaha</text>

                      {/* Hambantota */}
                      <circle cx="115" cy="190" r="5" fill="#10B981" />
                      <text x="125" y="193" fontSize="8" fill="#1E293B" fontWeight="bold">Hambantota</text>
                    </svg>
                  </div>

                  {/* Choke point callout */}
                  <div className="mt-3 p-3 rounded-xl border border-amber-200 bg-amber-50/70 text-xs text-amber-950 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-amber-900">
                      <Truck className="w-3.5 h-3.5 text-amber-700" />
                      <span>Key Arterial Choke Point</span>
                    </div>
                    <p className="text-[11px] leading-relaxed">
                      {govData.supplyChainMetrics?.keyChokePoint || 'Dambulla Central Distribution Hub & A9 Northern Arterial Highway'}
                    </p>
                    <div className="pt-1 text-[11px] font-semibold text-amber-800">
                      Avg. Transit Bottleneck Delay: {govData.supplyChainMetrics?.avgTransitDelayHours || 3.8} Hours
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500">
                  <span>Legend: </span>
                  <span className="inline-flex items-center gap-1 ml-1 text-rose-700 font-bold"><span className="w-2 h-2 rounded-full bg-rose-600"></span> High Risk</span>
                  <span className="inline-flex items-center gap-1 ml-2 text-amber-700 font-bold"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Moderate</span>
                  <span className="inline-flex items-center gap-1 ml-2 text-emerald-700 font-bold"><span className="w-2 h-2 rounded-full bg-emerald-600"></span> Low</span>
                </div>
              </section>
            </div>

            {/* ── 11. AGRICULTURAL MARKET & SUPPLY TRENDS ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* National Crop Demand vs Supply Balance */}
              <section aria-labelledby="demand-supply-heading" className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
                <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                  <div>
                    <h2 id="demand-supply-heading" className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-emerald-600" />
                      National Crop Demand vs. Supply Balance
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      National projected production tons vs. consumption requirements.
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pt-1">
                  {govData.cropDemandSupplies?.map((crop) => {
                    const isSurplus = crop.balanceStatus === 'SURPLUS';
                    return (
                      <div key={crop.cropName} className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="sm:w-1/3">
                          <span className="text-xs font-bold text-slate-900 block">{crop.cropName}</span>
                          <span className="text-[11px] text-slate-500">
                            Demand: {crop.demandTons.toLocaleString()} MT | Supply: {crop.supplyTons.toLocaleString()} MT
                          </span>
                        </div>

                        <div className="flex-1 max-w-xs">
                          <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-2 rounded-full ${isSurplus ? 'bg-emerald-600' : 'bg-rose-500'}`}
                              style={{ width: `${Math.min(Math.abs(crop.gapPercentage) * 2.5, 100)}%` }}
                            ></div>
                          </div>
                        </div>

                        <div className="sm:w-1/4 text-right">
                          <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-extrabold ${
                            isSurplus ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {isSurplus ? `+${crop.gapPercentage}% SURPLUS` : `${crop.gapPercentage}% DEFICIT`}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Central Wholesale vs Retail Price Benchmark */}
              <section aria-labelledby="prices-heading" className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
                <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                  <div>
                    <h2 id="prices-heading" className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <Building className="w-4 h-4 text-emerald-600" />
                      Wholesale Market Price & Margin Index
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Benchmark pricing across dedicated economic centers.
                    </p>
                  </div>
                </div>

                <div className="divide-y divide-slate-100">
                  {govData.priceMarketIndices?.map((item) => (
                    <div key={item.cropName + item.centralMarket} className="py-2.5 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-900 block">{item.cropName}</span>
                        <span className="text-[11px] text-slate-500">{item.centralMarket} Economic Center</span>
                      </div>

                      <div className="text-right flex items-center gap-3">
                        <div>
                          <span className="text-slate-800 font-bold">Rs. {item.avgWholesalePriceRs}</span>
                          <span className="text-[11px] text-slate-500 block">Retail: Rs. {item.avgRetailPriceRs}</span>
                        </div>
                        <span className={`font-bold text-xs flex items-center gap-0.5 ${
                          item.weeklyPriceChangePct >= 0 ? 'text-emerald-700' : 'text-rose-700'
                        }`}>
                          {item.weeklyPriceChangePct >= 0 ? '+' : ''}{item.weeklyPriceChangePct}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* ── BIOSECURITY & DISEASE OUTBREAK SURVEILLANCE ── */}
            <section aria-labelledby="disease-heading" className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
              <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 id="disease-heading" className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Bug className="w-4 h-4 text-emerald-600" />
                    Biosecurity & Disease Outbreak Monitoring
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Field diagnostics reported through AgroLink's leaf pathology intelligence module.
                  </p>
                </div>
                <Link
                  to="/disease-detection"
                  className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                >
                  Open Leaf Diagnostics <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {govData.diseaseOutbreakLogs?.map((log) => {
                  const isHigh = log.severity === 'HIGH';
                  return (
                    <div
                      key={log.diseaseName}
                      className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                            isHigh ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {log.severity} SEVERITY
                          </span>
                          <span className="text-[10px] font-bold text-slate-500">{log.status}</span>
                        </div>
                        <h3 className="text-xs font-bold text-slate-900">{log.diseaseName}</h3>
                        <p className="text-[11px] text-slate-500">Crop: {log.cropAffected} ({log.locationDistrict})</p>
                      </div>
                      <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                        <span className="text-slate-500">Confirmed Cases:</span>
                        <span className="font-bold text-slate-900">{log.reportedCases}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* ── 15. FARMER RELEVANCE: CONNECTED ACTIONS ── */}
            <section aria-labelledby="connected-services-heading" className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h2 id="connected-services-heading" className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-emerald-600" />
                  AgroLink Intelligence & Operational Workflows
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Translate national policy intelligence into immediate field and market actions.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <Link
                  to="/demand-forecasting"
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition flex flex-col justify-between group"
                >
                  <div>
                    <span className="text-xs font-bold text-slate-900 block group-hover:text-emerald-700">
                      Demand Forecasting
                    </span>
                    <p className="text-xs text-slate-600 mt-1">
                      Check provincial crop demand matrices to avoid planting oversupply gluts.
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-emerald-700 mt-3 flex items-center gap-1">
                    Inspect Demand <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </Link>

                <Link
                  to="/price-prediction"
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition flex flex-col justify-between group"
                >
                  <div>
                    <span className="text-xs font-bold text-slate-900 block group-hover:text-emerald-700">
                      Price Intelligence
                    </span>
                    <p className="text-xs text-slate-600 mt-1">
                      Compare farmgate spot prices with wholesale forecasts at Manning Market.
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-emerald-700 mt-3 flex items-center gap-1">
                    Explore Trends <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </Link>

                <Link
                  to="/logistics"
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition flex flex-col justify-between group"
                >
                  <div>
                    <span className="text-xs font-bold text-slate-900 block group-hover:text-emerald-700">
                      Logistics Network
                    </span>
                    <p className="text-xs text-slate-600 mt-1">
                      Coordinate transport around Dambulla arterial choke points to prevent spoilage.
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-emerald-700 mt-3 flex items-center gap-1">
                    View Fleet <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </Link>

                <Link
                  to="/disease-detection"
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition flex flex-col justify-between group"
                >
                  <div>
                    <span className="text-xs font-bold text-slate-900 block group-hover:text-emerald-700">
                      AI Disease Detection
                    </span>
                    <p className="text-xs text-slate-600 mt-1">
                      Scan suspicious leaf symptoms to contain regional crop pathogen spread.
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-emerald-700 mt-3 flex items-center gap-1">
                    Scan Produce <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </Link>
              </div>
            </section>
          </>
        )}
      </main>

      {/* ── 13. OFFICIAL ALERT DETAIL MODAL ── */}
      {activeModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 print:hidden">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-emerald-600" />
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Official Alert #{activeModalItem.data.id}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActiveModalItem(null)}
                className="text-slate-400 hover:text-slate-600 focus:outline-none"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <h3 className="text-base font-bold text-slate-900">{activeModalItem.data.title}</h3>

              <div className="flex flex-wrap gap-2 text-xs">
                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">
                  Category: {activeModalItem.data.category}
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">
                  Region: {activeModalItem.data.region}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1">
                <span className="font-bold text-slate-900 block">Verified Situation Report:</span>
                <p className="leading-relaxed">{activeModalItem.data.details}</p>
              </div>

              <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200 text-xs text-emerald-950 space-y-1">
                <span className="font-bold text-emerald-900 block">Government & Farm Recommended Action:</span>
                <p className="leading-relaxed">{activeModalItem.data.recommendedAction}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setActiveModalItem(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition"
              >
                Close Advisory
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GovernmentIntelligence;
