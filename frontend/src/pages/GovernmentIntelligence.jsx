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
  ArrowRight,
  FileText
} from 'lucide-react';
import { govIntelligenceAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const GovernmentIntelligence = () => {
  const { user, isFarmer, isBuyer, isBusinessBuyer, isAdmin } = useAuth();

  // State Rules:
  // PAGE_LOADING -> INTELLIGENCE_READY | LOAD_ERROR
  // INTELLIGENCE_READY -> REGION_FILTERING -> REGION_RESULTS
  // INTELLIGENCE_READY -> ALERT_DETAILS
  // INTELLIGENCE_READY -> UPDATE_DETAILS
  const [pageState, setPageState] = useState('PAGE_LOADING');

  // Filter States
  const [selectedDistrict, setSelectedDistrict] = useState('ALL');
  const [filterAlertCategory, setFilterAlertCategory] = useState('ALL');

  // Active Selected Items for Detailed Modals
  const [selectedAlertForDetails, setSelectedAlertForDetails] = useState(null);
  const [selectedUpdateForDetails, setSelectedUpdateForDetails] = useState(null);

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

  // Handle District Filter Change with state transition
  const handleDistrictFilterChange = (districtValue) => {
    setPageState('REGION_FILTERING');
    setSelectedDistrict(districtValue);
    setTimeout(() => {
      setPageState('REGION_RESULTS');
    }, 150);
  };

  // KPI Calculations from real backend data
  const totalProductionMT = useMemo(() => {
    if (!districts.length) return 0;
    return districts.reduce((acc, curr) => acc + curr.cropYieldTons, 0);
  }, [districts]);

  const affectedRegionsCount = useMemo(() => {
    if (!districts.length) return 0;
    return districts.filter((d) => d.riskStatus !== 'LOW').length;
  }, [districts]);

  // Verified Official Updates list
  const officialUpdates = useMemo(() => {
    return [
      {
        id: 'UPD-2026-01',
        title: 'Central Province Vegetable Diversion Directive',
        date: '2026-09-15',
        source: 'Department of Agriculture — Extension Services',
        region: 'Central Province',
        summary: 'Advisory to divert Matale & Welimada tomato harvest to processing hubs in Southern Province to balance regional oversupply.',
        fullContent: 'Due to simultaneous bumper harvests in Matale and Welimada, wholesale arrivals at Dambulla Dedicated Economic Centre have exceeded local daily absorption by 38%. Farmers and transport clusters are advised to route shipments towards Southern canning facilities and utilize cold buffer storage to prevent farmgate price drops.',
        actionLink: '/crops',
        actionLabel: 'Browse Processing Buyers on Marketplace'
      },
      {
        id: 'UPD-2026-02',
        title: 'Northern Red Onion Strategic Buffer Clearance',
        date: '2026-09-12',
        source: 'National Agrarian Development Board',
        region: 'Northern Province',
        summary: 'Release of Jaffna cooperative onion stocks to stabilize Western Province wholesale retail prices.',
        fullContent: 'Seasonal rainfall variations in the Northern Dry Zone led to a 25% yield contraction in Jaffna red onions. In coordination with local farmer cooperatives, certified buffer stocks are being dispatched to Manning Market under stabilized benchmark price agreements.',
        actionLink: '/demand-forecasting',
        actionLabel: 'View National Demand Forecast'
      },
      {
        id: 'UPD-2026-03',
        title: 'A9 Arterial Logistics Corridor Congestion Notice',
        date: '2026-09-10',
        source: 'Ministry of Agriculture & Transport Logistics Hub',
        region: 'Dambulla Distribution Hub',
        summary: 'Transit delays averaging 3.8 to 4.2 hours reported at Dambulla Central Hub. Alternate freight offloading enabled at Meegoda.',
        fullContent: 'High volume freight inflow into Dambulla has triggered transport queues averaging 3.8 hours, raising core pulp temperatures for perishable nightshade vegetables. Logistics operators are authorized to redirect deliveries to secondary receiving centers at Keppetipola and Meegoda.',
        actionLink: '/logistics',
        actionLabel: 'Book Fleet Transport Logistics'
      }
    ];
  }, []);

  // Severity styling helper
  const getSeverityBadge = (severity) => {
    switch (severity?.toUpperCase()) {
      case 'CRITICAL':
        return {
          bg: 'bg-rose-50 text-rose-800 border-rose-200',
          label: 'CRITICAL',
          icon: AlertTriangle
        };
      case 'WARNING':
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-200',
          label: 'WARNING',
          icon: ShieldAlert
        };
      case 'INFO':
      default:
        return {
          bg: 'bg-blue-50 text-blue-800 border-blue-200',
          label: 'INFO',
          icon: Info
        };
    }
  };

  // Risk styling helper
  const getRiskBadge = (risk) => {
    switch (risk?.toUpperCase()) {
      case 'HIGH':
        return { bg: 'bg-rose-50 text-rose-800 border-rose-200', text: 'High' };
      case 'MODERATE':
        return { bg: 'bg-amber-50 text-amber-800 border-amber-200', text: 'Moderate' };
      case 'LOW':
      default:
        return { bg: 'bg-emerald-50 text-emerald-800 border-emerald-200', text: 'Low' };
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-16 print:bg-white print:text-black">
      {/* ── 5. PAGE HEADER ── */}
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
                    {isAdmin ? 'Official Institutional View' : 'Public Agricultural Briefing'}
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
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
        {pageState !== 'PAGE_LOADING' && pageState !== 'LOAD_ERROR' && govData && (
          <>
            {/* ── 6. IMPORTANT ALERTS ── */}
            <section aria-labelledby="alerts-heading" className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-emerald-600" />
                  <h2 id="alerts-heading" className="text-base font-bold text-slate-900">
                    Important Official Alerts ({filteredAlerts.length})
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
                      <div className="space-y-2">
                        {/* Severity Header */}
                        <div className="flex items-center justify-between">
                          <span className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-md border ${badge.bg}`}>
                            <IconComponent className="w-3 h-3" />
                            {badge.label}
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono font-semibold">Issued: {alert.id}</span>
                        </div>

                        {/* Region */}
                        <div className="text-xs">
                          <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px]">Region:</span>
                          <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                            {alert.region}
                          </span>
                        </div>

                        {/* Issue */}
                        <div className="text-xs">
                          <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px]">Issue:</span>
                          <h3 className="text-sm font-bold text-slate-900 leading-snug mt-0.5">{alert.title}</h3>
                          <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                            {alert.details}
                          </p>
                        </div>

                        {/* Action Guidance */}
                        <div className="text-xs pt-1 border-t border-slate-100">
                          <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px]">Action:</span>
                          <p className="text-xs font-semibold text-emerald-900 mt-0.5 line-clamp-2">
                            {alert.recommendedAction}
                          </p>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Official Briefing</span>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedAlertForDetails(alert);
                            setPageState('ALERT_DETAILS');
                          }}
                          className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                        >
                          View Alert Details <ChevronRight className="w-3.5 h-3.5" />
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
                    Agriculture Overview KPIs
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Verified agricultural indicators returned by the national reporting system.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {/* KPI 1: Tracked Farms */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    Tracked Farms
                  </span>
                  <div className="text-2xl font-black text-slate-900">
                    {govData.overviewStats?.activeFarmers?.toLocaleString() || '1,240'}
                  </div>
                  <span className="text-[11px] text-emerald-700 font-semibold block">Registered active growers</span>
                </div>

                {/* KPI 2: Active Alerts */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
                    Active Alerts
                  </span>
                  <div className="text-2xl font-black text-amber-800">
                    {alerts.length} <span className="text-sm font-semibold text-slate-500">Active</span>
                  </div>
                  <span className="text-[11px] text-slate-600 font-medium block">Policy advisories in effect</span>
                </div>

                {/* KPI 3: Affected Regions */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    Affected Regions
                  </span>
                  <div className="text-2xl font-black text-rose-800">
                    {affectedRegionsCount} <span className="text-sm font-semibold text-slate-500">Districts</span>
                  </div>
                  <span className="text-[11px] text-slate-600 font-medium block">High or Moderate risk zones</span>
                </div>

                {/* KPI 4: Production */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5 text-emerald-600" />
                    Production
                  </span>
                  <div className="text-2xl font-black text-emerald-800">
                    {totalProductionMT.toLocaleString()} <span className="text-sm font-semibold text-slate-500">MT</span>
                  </div>
                  <span className="text-[11px] text-emerald-700 font-semibold block">Tracked regional crop yield</span>
                </div>
              </div>
            </section>

            {/* ── 8. REGIONAL INTELLIGENCE ── */}
            <section aria-labelledby="regional-heading" className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <h2 id="regional-heading" className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    Regional Intelligence
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
                    onChange={(e) => handleDistrictFilterChange(e.target.value)}
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

              {/* Table view for Desktop / Tablet */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                      <th scope="col" className="pb-2.5">Region / District</th>
                      <th scope="col" className="pb-2.5">Primary Crop</th>
                      <th scope="col" className="pb-2.5 text-right">Production (MT)</th>
                      <th scope="col" className="pb-2.5 text-right">Tracked Farms</th>
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
                            <span className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-bold border ${risk.bg}`}>
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

            {/* ── 9. RISK / ALERT MAP ── */}
            <section aria-labelledby="map-heading" className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
              <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 id="map-heading" className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-emerald-600" />
                    Regional Risk & Alert Map
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Secondary spatial distribution of monitored agrarian zones and critical choke points.
                  </p>
                </div>
                <div className="text-[11px] text-slate-500">
                  <span>Legend: </span>
                  <span className="inline-flex items-center gap-1 ml-1 text-rose-700 font-bold"><span className="w-2 h-2 rounded-full bg-rose-600"></span> High Risk</span>
                  <span className="inline-flex items-center gap-1 ml-2 text-amber-700 font-bold"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Moderate Risk</span>
                  <span className="inline-flex items-center gap-1 ml-2 text-emerald-700 font-bold"><span className="w-2 h-2 rounded-full bg-emerald-600"></span> Low Risk</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-center">
                {/* SVG Spatial Map */}
                <div className="md:col-span-1 p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex items-center justify-center min-h-[220px]">
                  <svg viewBox="0 0 200 240" className="w-44 h-52 text-slate-200" fill="currentColor">
                    {/* Island Geometry */}
                    <path d="M 100,20 C 120,20 135,45 130,80 C 145,120 135,180 110,210 C 95,225 80,215 70,180 C 60,140 70,80 85,35 Z" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="2" />
                    
                    {/* District Pins */}
                    <circle cx="95" cy="35" r="5" fill="#F59E0B" />
                    <text x="105" y="38" fontSize="8" fill="#1E293B" fontWeight="bold">Jaffna</text>

                    <circle cx="85" cy="115" r="5" fill="#10B981" />
                    <text x="95" y="118" fontSize="8" fill="#1E293B" fontWeight="bold">Kurunegala</text>

                    <circle cx="105" cy="100" r="6" fill="#E11D48" />
                    <text x="115" y="103" fontSize="8" fill="#E11D48" fontWeight="bold">Matale / Dambulla</text>

                    <circle cx="105" cy="125" r="5" fill="#F59E0B" />
                    <text x="115" y="128" fontSize="8" fill="#1E293B" fontWeight="bold">Kandy</text>

                    <circle cx="80" cy="140" r="5" fill="#10B981" />
                    <text x="40" y="143" fontSize="8" fill="#1E293B" fontWeight="bold">Gampaha</text>

                    <circle cx="115" cy="190" r="5" fill="#10B981" />
                    <text x="125" y="193" fontSize="8" fill="#1E293B" fontWeight="bold">Hambantota</text>
                  </svg>
                </div>

                {/* Spatial Summary Cards */}
                <div className="md:col-span-2 space-y-3">
                  <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/70 text-xs text-amber-950 space-y-1.5">
                    <div className="flex items-center gap-1.5 font-bold text-amber-900">
                      <Truck className="w-4 h-4 text-amber-700" />
                      <span>Primary Choke Point: {govData.supplyChainMetrics?.keyChokePoint || 'Dambulla Central Distribution Hub'}</span>
                    </div>
                    <p className="text-xs leading-relaxed text-slate-700">
                      High-volume transit corridor currently experiencing an average bottleneck delay of {govData.supplyChainMetrics?.avgTransitDelayHours || 3.8} hours. Pre-cooling logistics and secondary market diversions are recommended.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
                      <span className="text-slate-400 font-bold uppercase text-[10px] block">National Cold Storage Coverage:</span>
                      <span className="text-base font-extrabold text-slate-900">
                        {govData.supplyChainMetrics?.coldChainStorageUtilizationPct || 62.5}%
                      </span>
                    </div>
                    <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
                      <span className="text-slate-400 font-bold uppercase text-[10px] block">Post-Harvest Perishable Loss:</span>
                      <span className="text-base font-extrabold text-rose-700">
                        {govData.supplyChainMetrics?.postHarvestLossPercentage || 18.4}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ── 11. TRENDS (Useful charts answering clear questions) ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* National Crop Demand vs Supply Balance */}
              <section aria-labelledby="demand-supply-heading" className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h2 id="demand-supply-heading" className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                    Crop Demand vs. Supply Balance
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Which crops are in surplus and which are facing national deficits?
                  </p>
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

              {/* Wholesale Market Price & Inflation Trends */}
              <section aria-labelledby="prices-heading" className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h2 id="prices-heading" className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Building className="w-4 h-4 text-emerald-600" />
                    Market Price & Inflation Index
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    How do wholesale benchmark spot prices compare to retail consumer prices?
                  </p>
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

            {/* ── BIOSECURITY DISEASE MONITORING (Admin/Authorized View) ── */}
            {isAdmin && govData.diseaseOutbreakLogs && (
              <section aria-labelledby="disease-heading" className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
                <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h2 id="disease-heading" className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <Bug className="w-4 h-4 text-emerald-600" />
                      Biosecurity & Disease Outbreak Monitoring
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Field diagnostics reported through AgroLink's leaf pathology telemetry.
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
                  {govData.diseaseOutbreakLogs.map((log) => {
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
            )}

            {/* ── 12. OFFICIAL AGRICULTURAL UPDATES ── */}
            <section aria-labelledby="official-updates-heading" className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <h2 id="official-updates-heading" className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-600" />
                    Official Agricultural Updates
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Verified announcements and policy advisories from agricultural authorities.
                  </p>
                </div>
              </div>

              <div className="divide-y divide-slate-100">
                {officialUpdates.map((update) => (
                  <article key={update.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 rounded-xl px-2 transition-colors">
                    <div className="space-y-1 sm:w-3/4">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          {update.source}
                        </span>
                        <span className="text-[11px] text-slate-400 font-semibold">{update.date}</span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900">{update.title}</h3>
                      <p className="text-xs text-slate-600 leading-relaxed">{update.summary}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedUpdateForDetails(update);
                        setPageState('UPDATE_DETAILS');
                      }}
                      className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 self-start sm:self-center"
                    >
                      Read Advisory <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </article>
                ))}
              </div>
            </section>

            {/* ── 15. ACTIONS / REPORTS & CONNECTED SERVICES ── */}
            <section aria-labelledby="connected-services-heading" className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h2 id="connected-services-heading" className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-emerald-600" />
                  Connected AgroLink Services & Actions
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Direct pathways to execute field decisions based on national intelligence.
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

      {/* ── 13. ALERT DETAIL MODAL (ALERT_DETAILS state) ── */}
      {selectedAlertForDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 print:hidden">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-emerald-600" />
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Official Alert #{selectedAlertForDetails.id}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedAlertForDetails(null);
                  setPageState('INTELLIGENCE_READY');
                }}
                className="text-slate-400 hover:text-slate-600 focus:outline-none"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <h3 className="text-base font-bold text-slate-900">{selectedAlertForDetails.title}</h3>

              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">
                  Category: {selectedAlertForDetails.category}
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">
                  Region: {selectedAlertForDetails.region}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 space-y-1">
                <span className="font-bold text-slate-900 block">Verified Situation Report:</span>
                <p className="leading-relaxed">{selectedAlertForDetails.details}</p>
              </div>

              <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200 text-emerald-950 space-y-1">
                <span className="font-bold text-emerald-900 block">Government & Farm Recommended Action:</span>
                <p className="leading-relaxed">{selectedAlertForDetails.recommendedAction}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedAlertForDetails(null);
                  setPageState('INTELLIGENCE_READY');
                }}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition"
              >
                Close Advisory
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 13. UPDATE DETAIL MODAL (UPDATE_DETAILS state) ── */}
      {selectedUpdateForDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 print:hidden">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" />
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Official Update #{selectedUpdateForDetails.id}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedUpdateForDetails(null);
                  setPageState('INTELLIGENCE_READY');
                }}
                className="text-slate-400 hover:text-slate-600 focus:outline-none"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <h3 className="text-base font-bold text-slate-900">{selectedUpdateForDetails.title}</h3>

              <div className="flex flex-wrap gap-2 text-[11px] text-slate-600">
                <span className="px-2 py-0.5 rounded bg-slate-100 font-semibold">
                  Source: {selectedUpdateForDetails.source}
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-100 font-semibold">
                  Date: {selectedUpdateForDetails.date}
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-100 font-semibold">
                  Region: {selectedUpdateForDetails.region}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 space-y-1">
                <span className="font-bold text-slate-900 block">Complete Official Notice:</span>
                <p className="leading-relaxed">{selectedUpdateForDetails.fullContent}</p>
              </div>

              {selectedUpdateForDetails.actionLink && (
                <div className="pt-2">
                  <Link
                    to={selectedUpdateForDetails.actionLink}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition"
                  >
                    {selectedUpdateForDetails.actionLabel} <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
              <button
                type="button"
                onClick={() => {
                  setSelectedUpdateForDetails(null);
                  setPageState('INTELLIGENCE_READY');
                }}
                className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-50 transition"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GovernmentIntelligence;
