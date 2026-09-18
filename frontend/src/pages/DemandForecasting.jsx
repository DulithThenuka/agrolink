import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  MapPin,
  RefreshCw,
  AlertCircle,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Info,
  ArrowRight,
  ChevronRight,
  Filter,
  BarChart2,
  Package,
  Sparkles,
  ExternalLink,
  Layers,
  HelpCircle
} from 'lucide-react';
import { demandForecastAPI, govIntelligenceAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

// Supported Regional Provinces matching backend DemandForecastService
const SUPPORTED_PROVINCES = [
  { id: 'Western Province', name: 'Western Province', hub: 'Colombo Manning & Meegoda Hubs' },
  { id: 'Central Province', name: 'Central Province', hub: 'Dambulla & Keppetipola Economic Centres' },
  { id: 'Northern Province', name: 'Northern Province', hub: 'Jaffna & Kilinochchi Distribution Centers' },
  { id: 'Southern Province', name: 'Southern Province', hub: 'Hambantota & Southern Coastal Corridors' },
];

export const DemandForecasting = () => {
  const { isFarmer, isBuyer, isBusinessBuyer, isAdmin } = useAuth();

  // State flow variables
  // PAGE_LOADING | READY | LOAD_ERROR | FILTERING | DEMAND_LOADING | DEMAND_RESULT
  const [pageState, setPageState] = useState('PAGE_LOADING');
  const [forecastState, setForecastState] = useState('FORECAST_LOADING'); // FORECAST_LOADING | FORECAST_READY | FORECAST_UNAVAILABLE

  // Filter selections
  const [selectedProvince, setSelectedProvince] = useState('Western Province');
  const [selectedCrop, setSelectedCrop] = useState('ALL'); // 'ALL' or specific cropName

  // API Data
  const [forecastData, setForecastData] = useState(null);
  const [govOverviewData, setGovOverviewData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);

  // Fetch Demand Forecast from backend
  const loadForecastData = useCallback(async (provinceName, isInitial = false) => {
    if (isInitial) {
      setPageState('PAGE_LOADING');
    } else {
      setPageState('DEMAND_LOADING');
    }
    setForecastState('FORECAST_LOADING');
    setErrorMessage('');

    try {
      const res = await demandForecastAPI.getForecast(provinceName);
      // axios interceptor unpacks ApiResponse { success, message, data }
      const payload = res?.data || res;

      if (payload && payload.cropDemands) {
        setForecastData(payload);
        setLastUpdated(new Date());
        setPageState('DEMAND_RESULT');
        setForecastState('FORECAST_READY');
      } else {
        setForecastData(null);
        setPageState('DEMAND_RESULT');
        setForecastState('FORECAST_UNAVAILABLE');
      }
    } catch (err) {
      console.error('Failed to fetch demand forecast:', err);
      setErrorMessage(typeof err === 'string' ? err : 'Unable to load demand information.');
      setPageState('LOAD_ERROR');
      setForecastState('FORECAST_UNAVAILABLE');
    }
  }, []);

  // Fetch Gov/Admin intelligence data if user has authorized access
  useEffect(() => {
    if (isAdmin) {
      govIntelligenceAPI.getOverview()
        .then((res) => {
          const data = res?.data || res;
          if (data?.cropDemandSupplies) {
            setGovOverviewData(data);
          }
        })
        .catch((err) => {
          // Silent fallback - do not block page for optional analyst metrics
          console.warn('Analyst demand-supply overview not available:', err);
        });
    }
  }, [isAdmin]);

  // Initial load
  useEffect(() => {
    loadForecastData(selectedProvince, true);
  }, [loadForecastData, selectedProvince]);

  // Handle province change
  const handleProvinceChange = (province) => {
    if (province === selectedProvince) return;
    setSelectedProvince(province);
    setSelectedCrop('ALL');
  };

  // Supported crops list extracted from active province data
  const availableCrops = useMemo(() => {
    if (!forecastData?.cropDemands) return [];
    return forecastData.cropDemands.map((item) => item.cropName);
  }, [forecastData]);

  // Active crop demand items filtered by selectedCrop
  const displayedCrops = useMemo(() => {
    if (!forecastData?.cropDemands) return [];
    if (selectedCrop === 'ALL') return forecastData.cropDemands;
    return forecastData.cropDemands.filter((item) => item.cropName === selectedCrop);
  }, [forecastData, selectedCrop]);

  // Single selected crop detail if a specific crop is chosen
  const activeCropDetail = useMemo(() => {
    if (selectedCrop === 'ALL' || !forecastData?.cropDemands) return null;
    return forecastData.cropDemands.find((item) => item.cropName === selectedCrop) || null;
  }, [forecastData, selectedCrop]);

  // National quantified demand item (for Analyst role with MT unit)
  const matchingGovDemand = useMemo(() => {
    if (!govOverviewData?.cropDemandSupplies || !activeCropDetail) return null;
    return govOverviewData.cropDemandSupplies.find(
      (item) => item.cropName.toLowerCase().includes(activeCropDetail.cropName.toLowerCase()) ||
                activeCropDetail.cropName.toLowerCase().includes(item.cropName.toLowerCase())
    );
  }, [govOverviewData, activeCropDetail]);

  // Demand Level Badge styling helper
  const getDemandBadge = (level) => {
    switch (level?.toUpperCase()) {
      case 'VERY HIGH':
        return {
          bg: 'bg-teal-50 text-teal-800 border-teal-200',
          label: 'VERY HIGH DEMAND',
          barColor: 'bg-teal-600',
          pct: 100,
        };
      case 'HIGH':
        return {
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          label: 'HIGH DEMAND',
          barColor: 'bg-emerald-600',
          pct: 75,
        };
      case 'MEDIUM':
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-200',
          label: 'MODERATE DEMAND',
          barColor: 'bg-amber-500',
          pct: 50,
        };
      case 'LOW':
      default:
        return {
          bg: 'bg-rose-50 text-rose-800 border-rose-200',
          label: 'LOW DEMAND',
          barColor: 'bg-rose-500',
          pct: 25,
        };
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-16">
      {/* ── 5. PAGE HEADER (Compact, agricultural intelligence styling) ── */}
      <div className="bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200/60 mb-1.5">
                <BarChart2 className="w-3.5 h-3.5 text-emerald-600" />
                Market Demand Intelligence
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Demand Forecast
              </h1>
              <p className="text-slate-600 text-xs sm:text-sm mt-0.5">
                Understand current market demand and supported demand trends for agricultural crops.
              </p>
            </div>

            <div className="flex items-center gap-3 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => loadForecastData(selectedProvince)}
                disabled={pageState === 'PAGE_LOADING' || pageState === 'DEMAND_LOADING'}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
                aria-label="Refresh market demand data"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${
                    pageState === 'PAGE_LOADING' || pageState === 'DEMAND_LOADING' ? 'animate-spin text-emerald-600' : ''
                  }`}
                />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* ── 15. DATA EXPLANATION NOTE ── */}
        <div className="flex items-center justify-between flex-wrap gap-2 text-xs text-slate-500 bg-white px-4 py-2.5 rounded-xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Demand insights are based on available AgroLink market data.</span>
          </div>
          {lastUpdated && (
            <div className="flex items-center gap-1.5 text-slate-400 text-xs">
              <Clock className="w-3.5 h-3.5" />
              <span>Updated {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          )}
        </div>

        {/* ── 6. MARKET / PROVINCE & CROP SELECTOR ── */}
        <section aria-labelledby="selectors-heading" className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
          <h2 id="selectors-heading" className="sr-only">Region and Crop Selectors</h2>

          {/* Province selector */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label htmlFor="province-selector" className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                Select Market Region / Province
              </label>
              <span className="text-xs text-slate-400">4 regional agricultural zones</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {SUPPORTED_PROVINCES.map((prov) => {
                const isSelected = selectedProvince === prov.id;
                return (
                  <button
                    key={prov.id}
                    type="button"
                    onClick={() => handleProvinceChange(prov.id)}
                    aria-pressed={isSelected}
                    className={`flex flex-col text-left px-3.5 py-2.5 rounded-xl border text-xs transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      isSelected
                        ? 'bg-emerald-50/80 border-emerald-600 text-emerald-950 font-semibold shadow-sm ring-1 ring-emerald-600'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-sm font-semibold">{prov.name}</span>
                    <span className="text-[11px] text-slate-500 mt-0.5 truncate">{prov.hub}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Crop selector (dynamic from active province data) */}
          {availableCrops.length > 0 && (
            <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center gap-3">
              <label htmlFor="crop-filter" className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5 flex-shrink-0">
                <Filter className="w-3.5 h-3.5 text-emerald-600" />
                Filter by Crop:
              </label>
              <div className="flex flex-wrap gap-2 items-center">
                <button
                  type="button"
                  onClick={() => setSelectedCrop('ALL')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition border focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    selectedCrop === 'ALL'
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  All Demanded Crops ({availableCrops.length})
                </button>
                {availableCrops.map((crop) => {
                  const isSelected = selectedCrop === crop;
                  return (
                    <button
                      key={crop}
                      type="button"
                      onClick={() => setSelectedCrop(crop)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition border focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                        isSelected
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-emerald-50 hover:border-emerald-200'
                      }`}
                    >
                      {crop}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </section>

        {/* ── 16. SKELETON LOADING STATE ── */}
        {(pageState === 'PAGE_LOADING' || pageState === 'DEMAND_LOADING') && (
          <div className="space-y-6" aria-busy="true" aria-label="Loading demand data">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm animate-pulse space-y-3">
                  <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                  <div className="h-8 bg-slate-200 rounded w-1/2"></div>
                  <div className="h-3 bg-slate-100 rounded w-full"></div>
                </div>
              ))}
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm animate-pulse space-y-4">
              <div className="h-5 bg-slate-200 rounded w-1/4"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-28 bg-slate-100 rounded-xl"></div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── 17. ERROR STATE ── */}
        {pageState === 'LOAD_ERROR' && (
          <div className="bg-white rounded-2xl border border-rose-200 p-8 shadow-sm text-center max-w-lg mx-auto space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Unable to load demand information</h3>
              <p className="text-xs text-slate-600 mt-1">
                {errorMessage || 'There was a problem communicating with the AgroLink market intelligence service.'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => loadForecastData(selectedProvince)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Try Again
            </button>
          </div>
        )}

        {/* ── READY / RESULT CONTENT ── */}
        {(pageState === 'READY' || pageState === 'DEMAND_RESULT') && forecastData && (
          <>
            {/* ── 7. CURRENT DEMAND SUMMARY CARDS ── */}
            <section aria-labelledby="summary-heading" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <h2 id="summary-heading" className="sr-only">Current Demand Summary</h2>

              {/* Card 1: Primary Demand Status */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span className="font-semibold uppercase tracking-wider">
                      {activeCropDetail ? `${activeCropDetail.cropName} Demand` : 'Regional Demand Level'}
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                      Current
                    </span>
                  </div>
                  <div className="mt-2 flex items-baseline gap-2">
                    {activeCropDetail ? (
                      <span className={`text-2xl font-extrabold px-3 py-1 rounded-lg border text-sm tracking-wide ${getDemandBadge(activeCropDetail.demandLevel).bg}`}>
                        {activeCropDetail.demandLevel}
                      </span>
                    ) : (
                      <span className="text-xl font-bold text-slate-900">
                        {forecastData.overallMarketBalance || 'Balanced Supply Allocation'}
                      </span>
                    )}
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Region:</span>
                  <span className="font-semibold text-slate-800">{forecastData.provinceName}</span>
                </div>
              </div>

              {/* Card 2: Demand Trend Indicator */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span className="font-semibold uppercase tracking-wider">Demand Surge / Shift</span>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                      Supported Trend
                    </span>
                  </div>
                  <div className="mt-2">
                    {activeCropDetail ? (
                      <div className="flex items-center gap-2">
                        {activeCropDetail.positiveTrend ? (
                          <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 text-sm font-bold">
                            <TrendingUp className="w-4 h-4 text-emerald-600" aria-hidden="true" />
                            <span>Increasing (+{activeCropDetail.surgePercentage}%)</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-rose-700 bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-200 text-sm font-bold">
                            <TrendingDown className="w-4 h-4 text-rose-600" aria-hidden="true" />
                            <span>Decreasing ({activeCropDetail.surgePercentage}%)</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-slate-800 text-sm font-semibold">
                        {forecastData.cropDemands?.filter((d) => d.positiveTrend).length} of {forecastData.cropDemands?.length} crops trending upward
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Trend Direction:</span>
                  <span className="font-semibold text-slate-800">
                    {activeCropDetail
                      ? activeCropDetail.positiveTrend
                        ? 'Increasing Demand'
                        : 'Overproduction / Reduced Inflow'
                      : 'Regional Supply Allocation Matrix'}
                  </span>
                </div>
              </div>

              {/* Card 3: Supported Market / Quantity or Advisory */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm flex flex-col justify-between sm:col-span-2 lg:col-span-1">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span className="font-semibold uppercase tracking-wider">
                      {matchingGovDemand ? 'National Quota Needed' : 'Market Allocation Status'}
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                      Verified
                    </span>
                  </div>
                  <div className="mt-2">
                    {matchingGovDemand ? (
                      <div>
                        <div className="text-2xl font-bold text-slate-900">
                          {matchingGovDemand.demandMetricTons.toLocaleString()} MT
                        </div>
                        <span className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                          matchingGovDemand.status === 'SURPLUS' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          National Status: {matchingGovDemand.status} ({matchingGovDemand.variancePercentage > 0 ? `+${matchingGovDemand.variancePercentage}%` : `${matchingGovDemand.variancePercentage}%`})
                        </span>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-700 font-medium line-clamp-2">
                        {activeCropDetail ? activeCropDetail.riskStatus : 'Balanced inter-district inflow across wholesale centers.'}
                      </p>
                    )}
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Benchmark Hub:</span>
                  <span className="font-semibold text-slate-800">
                    {SUPPORTED_PROVINCES.find((p) => p.id === selectedProvince)?.hub.split('&')[0].trim() || 'Regional Market'}
                  </span>
                </div>
              </div>
            </section>

            {/* ── 8. DEMAND TREND VISUALIZER (Simple, Accessible, Non-Terminal) ── */}
            <section aria-labelledby="trend-heading" className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <h3 id="trend-heading" className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                    Demand Trend Analysis
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Clear upward or downward pressure calculated from active wholesale arrivals and regional planting registrations.
                  </p>
                </div>
                <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full self-start sm:self-auto">
                  {forecastData.provinceName}
                </span>
              </div>

              {/* Simple visual bar indicators for supported crops */}
              <div className="space-y-3 pt-1">
                {displayedCrops.map((item) => {
                  const badge = getDemandBadge(item.demandLevel);
                  return (
                    <div
                      key={item.cropName}
                      className="p-3.5 rounded-xl border border-slate-200/70 bg-slate-50/50 hover:bg-slate-50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 sm:w-1/4">
                        <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs shadow-xs">
                          {item.cropName.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-900">{item.cropName}</div>
                          <span className={`inline-block text-[10px] font-bold px-1.5 py-0.5 rounded border mt-0.5 ${badge.bg}`}>
                            {badge.label}
                          </span>
                        </div>
                      </div>

                      {/* Direction and Surge Bar */}
                      <div className="flex-1 max-w-md">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-slate-500 flex items-center gap-1 font-medium">
                            {item.positiveTrend ? (
                              <>
                                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
                                <span className="text-emerald-700 font-semibold">Increasing Demand</span>
                              </>
                            ) : (
                              <>
                                <TrendingDown className="w-3.5 h-3.5 text-rose-600" aria-hidden="true" />
                                <span className="text-rose-700 font-semibold">Decreasing / Oversupply Risk</span>
                              </>
                            )}
                          </span>
                          <span className={`font-bold ${item.positiveTrend ? 'text-emerald-700' : 'text-rose-700'}`}>
                            {item.positiveTrend ? `+${item.surgePercentage}%` : `${item.surgePercentage}%`}
                          </span>
                        </div>
                        {/* Progress meter */}
                        <div className="w-full bg-slate-200/80 rounded-full h-2 overflow-hidden" role="progressbar" aria-valuenow={badge.pct} aria-valuemin="0" aria-valuemax="100">
                          <div
                            className={`h-2 rounded-full transition-all duration-500 ${badge.barColor}`}
                            style={{ width: `${badge.pct}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Supported action status */}
                      <div className="sm:w-1/3 text-xs text-slate-600 flex items-center justify-between sm:justify-end gap-2">
                        <span className="truncate">{item.riskStatus}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* ── 9. TOP DEMANDED CROPS & 10. DEMAND FORECAST OUTLOOK ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 9. Top Demanded Crops List */}
              <section aria-labelledby="top-crops-heading" className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 id="top-crops-heading" className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Package className="w-4 h-4 text-emerald-600" />
                    Top Demanded Crops in {forecastData.provinceName}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Crops sorted by regional procurement priority.
                  </p>
                </div>

                <div className="divide-y divide-slate-100">
                  {forecastData.cropDemands?.map((crop, idx) => {
                    const badge = getDemandBadge(crop.demandLevel);
                    return (
                      <div
                        key={crop.cropName}
                        onClick={() => setSelectedCrop(crop.cropName)}
                        className={`py-3 flex items-center justify-between cursor-pointer rounded-lg px-2 transition-colors ${
                          selectedCrop === crop.cropName ? 'bg-emerald-50/70 text-emerald-950 font-semibold' : 'hover:bg-slate-50'
                        }`}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            setSelectedCrop(crop.cropName);
                          }
                        }}
                        aria-label={`Select ${crop.cropName} demand details`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-5 text-center text-xs font-bold text-slate-400">
                            #{idx + 1}
                          </span>
                          <div>
                            <span className="text-sm font-semibold text-slate-900 block">
                              {crop.cropName}
                            </span>
                            <span className="text-[11px] text-slate-500">
                              {crop.positiveTrend ? 'Strong Buyer Inflow' : 'Supply Caution'}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2.5">
                          <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${badge.bg}`}>
                            {crop.demandLevel}
                          </span>
                          <ChevronRight className="w-4 h-4 text-slate-400" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* 10. Demand Forecast Outlook */}
              <section aria-labelledby="forecast-outlook-heading" className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4 flex flex-col justify-between">
                <div>
                  <div className="border-b border-slate-100 pb-3">
                    <h3 id="forecast-outlook-heading" className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      Demand Outlook & Policy Recommendations
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Supported agricultural distribution advisories.
                    </p>
                  </div>

                  <div className="mt-4 space-y-3">
                    {forecastState === 'FORECAST_READY' && (
                      <>
                        <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-950 leading-relaxed font-medium space-y-1.5">
                          <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                            <span>Regional Production Safeguard</span>
                          </div>
                          <p>{forecastData.socialImpactNotice}</p>
                        </div>

                        {activeCropDetail ? (
                          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-xs space-y-1.5">
                            <span className="font-bold text-slate-900 block">
                              Specific Crop Outlook: {activeCropDetail.cropName}
                            </span>
                            <p className="text-slate-600">{activeCropDetail.riskStatus}</p>
                            <p className="text-[11px] text-slate-500 italic mt-1">
                              Calculated based on {selectedProvince} wholesale arrivals.
                            </p>
                          </div>
                        ) : (
                          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-xs space-y-1 text-slate-600">
                            <span className="font-semibold text-slate-800">Select any specific crop above</span>
                            <p>Click on any crop in the ranking table or filter bar to inspect localized risk advisories.</p>
                          </div>
                        )}
                      </>
                    )}

                    {forecastState === 'FORECAST_UNAVAILABLE' && (
                      <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-600">
                        A supported demand forecast is not available for this crop.
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
                  <span>Outlook Window:</span>
                  <span className="font-semibold text-slate-700">Current Season Sowing & Wholesale Cycle</span>
                </div>
              </section>
            </div>

            {/* ── 11. DEMAND FACTORS ("Why demand is changing") ── */}
            <section aria-labelledby="factors-heading" className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 id="factors-heading" className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-emerald-600" />
                  Why Demand is Changing
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Primary explanatory factors affecting current market demand in {forecastData.provinceName}.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                    <Layers className="w-4 h-4 text-emerald-600" />
                    <span>Regional Supply Allocation</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {forecastData.overallMarketBalance}. Direct shipments are tracked between producing districts and urban consumption nodes.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Harvest Saturation & Risk</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Surplus crops (such as overproduced vegetables) prompt diversion to cold storage and value-add processing to prevent spot price crashes.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                    <span>Wholesale Procurement Inflow</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Demand surge percentages reflect buyer purchase orders registered through the AgroLink wholesale network across central hubs.
                  </p>
                </div>
              </div>
            </section>

            {/* ── 12. REGIONAL MARKET COMPARISON ── */}
            <section aria-labelledby="comparison-heading" className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <h3 id="comparison-heading" className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    Regional Market Comparison
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Compare demand allocation across Sri Lanka's 4 major agronomic provinces.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {SUPPORTED_PROVINCES.map((prov) => {
                  const isCurrent = prov.id === selectedProvince;
                  return (
                    <div
                      key={prov.id}
                      className={`p-4 rounded-xl border text-xs space-y-2 ${
                        isCurrent
                          ? 'bg-emerald-50/80 border-emerald-300 ring-1 ring-emerald-500'
                          : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold">
                        <span className="text-slate-900 text-sm">{prov.name}</span>
                        {isCurrent && (
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-slate-500 text-[11px]">{prov.hub}</p>
                      {!isCurrent && (
                        <button
                          type="button"
                          onClick={() => handleProvinceChange(prov.id)}
                          className="mt-2 text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                        >
                          View Demand <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* ── 13 & 14. RELEVANT ACTIONS (ROLE-BASED) ── */}
            <section aria-labelledby="actions-heading" className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 id="actions-heading" className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-emerald-600" />
                  Recommended Next Actions
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Take immediate market action connected to your AgroLink workflow.
                </p>
              </div>

              {/* FARMER ACTIONS */}
              {(!isBuyer || isFarmer) && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Link
                    to="/crops/add"
                    className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/60 hover:bg-emerald-50 transition flex flex-col justify-between group"
                  >
                    <div>
                      <span className="text-xs font-bold text-emerald-900 block group-hover:text-emerald-950">
                        Register Planned Planting Quota →
                      </span>
                      <p className="text-xs text-slate-600 mt-1">
                        List your upcoming harvest to match verified buyers and avoid local gluts.
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-emerald-700 mt-3 flex items-center gap-1">
                      Create Crop Listing <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </Link>

                  <Link
                    to="/price-prediction"
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition flex flex-col justify-between group"
                  >
                    <div>
                      <span className="text-xs font-bold text-slate-900 block group-hover:text-emerald-700">
                        View Price Intelligence
                      </span>
                      <p className="text-xs text-slate-600 mt-1">
                        Compare wholesale price predictions with demand surge data for maximum margins.
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-slate-700 mt-3 flex items-center gap-1">
                      Explore Price Trends <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </Link>

                  <Link
                    to="/crops"
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition flex flex-col justify-between group"
                  >
                    <div>
                      <span className="text-xs font-bold text-slate-900 block group-hover:text-emerald-700">
                        Browse Marketplace
                      </span>
                      <p className="text-xs text-slate-600 mt-1">
                        Inspect active listings to see regional supply availability in {selectedProvince}.
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-slate-700 mt-3 flex items-center gap-1">
                      View Marketplace <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </Link>
                </div>
              )}

              {/* BUYER / MARKET USER ACTIONS */}
              {(isBuyer || isBusinessBuyer) && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <Link
                    to="/crops"
                    className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/60 hover:bg-emerald-50 transition flex flex-col justify-between group"
                  >
                    <div>
                      <span className="text-xs font-bold text-emerald-900 block group-hover:text-emerald-950">
                        Procure High-Demand Crops
                      </span>
                      <p className="text-xs text-slate-600 mt-1">
                        Find verified farmer listings in {selectedProvince} before market supply contracts.
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-emerald-700 mt-3 flex items-center gap-1">
                      Browse Crop Marketplace <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </Link>

                  <Link
                    to="/contracts"
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition flex flex-col justify-between group"
                  >
                    <div>
                      <span className="text-xs font-bold text-slate-900 block group-hover:text-emerald-700">
                        Contract Farming Requests
                      </span>
                      <p className="text-xs text-slate-600 mt-1">
                        Secure future crop supply through binding agreements with regional grower clusters.
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-slate-700 mt-3 flex items-center gap-1">
                      View Contracts <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </Link>

                  <Link
                    to="/orders"
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition flex flex-col justify-between group"
                  >
                    <div>
                      <span className="text-xs font-bold text-slate-900 block group-hover:text-emerald-700">
                        Manage Active Orders
                      </span>
                      <p className="text-xs text-slate-600 mt-1">
                        Track fulfillment and delivery logistics for your current wholesale procurements.
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-slate-700 mt-3 flex items-center gap-1">
                      Check Orders <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </Link>
                </div>
              )}

              {/* GOVERNMENT / ANALYST ACCESS NOTE */}
              {isAdmin && (
                <div className="mt-3 p-3.5 rounded-xl border border-indigo-200 bg-indigo-50/50 flex items-center justify-between flex-wrap gap-2 text-xs">
                  <div className="flex items-center gap-2 text-indigo-950 font-medium">
                    <ShieldCheck className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                    <span>Authorized Analyst: National Supply & Policy Balance Hub is active.</span>
                  </div>
                  <Link
                    to="/gov-intelligence"
                    className="font-bold text-indigo-700 hover:text-indigo-900 flex items-center gap-1"
                  >
                    Open Full Gov Intelligence <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </section>
          </>
        )}

        {/* ── 18. EMPTY STATES ── */}
        {pageState !== 'PAGE_LOADING' && pageState !== 'LOAD_ERROR' && (!forecastData || forecastData.cropDemands?.length === 0) && (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-3">
            <Package className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">No demand data is currently available</h3>
            <p className="text-xs text-slate-500">
              There are no recorded demand records for {selectedProvince} at this time.
            </p>
            <button
              type="button"
              onClick={() => handleProvinceChange('Western Province')}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition"
            >
              Switch to Western Province
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
