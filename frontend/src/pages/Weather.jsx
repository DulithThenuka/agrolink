import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { weatherAPI, farmersAPI, cropsAPI } from '../services/api';
import {
  CloudSun,
  CloudRain,
  Thermometer,
  Droplets,
  Wind,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Sprout,
  ArrowRight,
  RefreshCw,
  MapPin,
  AlertCircle,
  Sun,
  Cloud,
  ChevronRight,
  Waves,
  Tractor,
  Truck,
  Scan,
  BrainCircuit,
  TrendingUp,
  Info
} from 'lucide-react';

const SUPPORTED_LOCATIONS = [
  'Nuwara Eliya / Kandy',
  'Anuradhapura / Polonnaruwa',
  'Badulla / Welimada',
  'Kurunegala / Puttalam',
  'Jaffna / Kilinochchi',
  'Ratnapura / Balangoda',
  'Matara / Hambantota',
  'Gampaha / Colombo'
];

export const Weather = () => {
  const { user, isFarmer } = useAuth();

  // Location state
  const initialLocation = user?.location
    ? (SUPPORTED_LOCATIONS.find(loc => loc.toLowerCase().includes(user.location.toLowerCase())) || user.location)
    : 'Nuwara Eliya / Kandy';

  const [selectedLocation, setSelectedLocation] = useState(initialLocation);
  const [selectedCrop, setSelectedCrop] = useState('ALL');

  // Weather data & loading states
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Farmer's crops for crop-weather correlation
  const [farmerCrops, setFarmerCrops] = useState([]);

  // --------------------------------------------------------------------------
  // Fetch Weather Intelligence
  // --------------------------------------------------------------------------
  const fetchWeather = async (loc) => {
    setLoading(true);
    setError(null);
    try {
      const res = await weatherAPI.getIntelligence(loc);
      if (res && res.data) {
        setWeatherData(res.data);
      } else {
        // Fallback default structure from service
        setWeatherData(res);
      }
    } catch (err) {
      console.error('Failed to fetch weather intelligence:', err);
      setError('Unable to load real-time weather telemetry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(selectedLocation);
  }, [selectedLocation]);

  // Fetch farmer crops if logged in as farmer
  useEffect(() => {
    const loadCrops = async () => {
      if (!user?.id || !isFarmer) return;
      try {
        const res = await farmersAPI.getProfile(user.id);
        if (res && res.data && Array.isArray(res.data.crops)) {
          setFarmerCrops(res.data.crops);
        }
      } catch (err) {
        // non-fatal
      }
    };
    loadCrops();
  }, [user?.id, isFarmer]);

  // --------------------------------------------------------------------------
  // Weather condition icons & risk helpers
  // --------------------------------------------------------------------------
  const getRiskBadge = (risk) => {
    const level = (risk || 'LOW').toUpperCase();
    if (level === 'HIGH') {
      return {
        label: 'Severe Risk',
        class: 'bg-rose-100 text-rose-800 border-rose-200',
        icon: AlertTriangle,
      };
    }
    if (level === 'MEDIUM') {
      return {
        label: 'Moderate Risk',
        class: 'bg-amber-100 text-amber-800 border-amber-200',
        icon: AlertCircle,
      };
    }
    return {
      label: 'Favorable',
      class: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      icon: CheckCircle2,
    };
  };

  // --------------------------------------------------------------------------
  // LOADING SKELETON
  // --------------------------------------------------------------------------
  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6 animate-pulse">
        <div className="agri-card p-6 bg-white space-y-2">
          <div className="h-7 w-64 bg-slate-200 rounded-lg"></div>
          <div className="h-4 w-96 bg-slate-100 rounded-md"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="agri-card p-5 bg-white h-32 rounded-2xl"></div>
          ))}
        </div>
        <div className="agri-card p-6 bg-white h-64 rounded-2xl"></div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // ERROR STATE
  // --------------------------------------------------------------------------
  if (error || !weatherData) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-900">Weather Telemetry Unavailable</h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          {error || 'Unable to retrieve agricultural climate readings at this moment.'}
        </p>
        <button
          onClick={() => fetchWeather(selectedLocation)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-xl transition shadow-2xs"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry Connection</span>
        </button>
      </div>
    );
  }

  // Active risk badge for current climate alert
  const alertRiskBadge = getRiskBadge(weatherData.riskLevel);
  const AlertRiskIcon = alertRiskBadge.icon;

  // Crops list for impact filtering
  const allAffectedCrops = weatherData.affectedCrops || ['Tomatoes', 'Chili', 'Potato'];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fade-in text-slate-900">
      
      {/* ==================================================================== */}
      {/* 1. PAGE HEADER                                                       */}
      {/* ==================================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
              <CloudSun className="w-7 h-7 text-emerald-700" />
              <span>Weather &amp; Farm Conditions</span>
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Monitor local weather conditions and understand information that may affect your crops.
          </p>
        </div>

        {/* LOCATION SELECTOR */}
        <div className="flex items-center gap-2 self-start sm:self-auto bg-white border border-slate-200/90 rounded-2xl p-1.5 shadow-2xs">
          <MapPin className="w-4 h-4 text-emerald-700 shrink-0 ml-1.5" />
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="text-xs font-semibold text-slate-800 bg-transparent focus:outline-none pr-3 py-1 cursor-pointer"
          >
            {SUPPORTED_LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 2. OFFICIAL SEVERE WEATHER ALERT BANNER (If alert exists)            */}
      {/* ==================================================================== */}
      {weatherData.alertTitle && (
        <div className="agri-card p-5 sm:p-6 bg-rose-50/40 border border-rose-200 rounded-2xl space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border uppercase tracking-wider ${alertRiskBadge.class}`}>
                <AlertRiskIcon className="w-3.5 h-3.5" />
                <span>{alertRiskBadge.label}</span>
              </span>
              <span className="text-xs font-semibold text-slate-600">
                Region: {weatherData.location}
              </span>
            </div>
            <span className="text-[11px] font-medium text-slate-500">
              Window: <strong className="text-slate-800">{weatherData.expectedTime}</strong>
            </span>
          </div>

          <div className="space-y-1">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              {weatherData.alertTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {weatherData.recommendation}
            </p>
          </div>

          <div className="pt-2 border-t border-rose-200/60 flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="text-slate-600 font-medium">
              Affected crops: <strong className="text-rose-900">{allAffectedCrops.join(', ')}</strong>
            </span>
            <Link
              to="/advisor"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs transition shadow-2xs"
            >
              <span>Consult AI Agronomist</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 3. CURRENT FARM CONDITIONS (Strongest Information Block)            */}
      {/* ==================================================================== */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Sun className="w-4 h-4 text-emerald-700" />
            <span>Current Farm Conditions</span>
          </h2>
          <span className="text-xs text-slate-400 font-medium">
            Live Field Telemetry
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          {/* Main Temp & Condition */}
          <div className="agri-card p-6 bg-white md:col-span-2 flex flex-col justify-between space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Ambient Temperature
                </span>
                <div className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mt-1 flex items-baseline gap-1">
                  <span>{weatherData.temperatureC}&deg;C</span>
                </div>
                <p className="text-xs text-slate-600 font-medium mt-1">
                  {weatherData.highLowTemp}
                </p>
              </div>
              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100 text-emerald-700">
                <CloudSun className="w-8 h-8" />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">Current Sky:</span>
              <span className="font-bold text-slate-900">
                {weatherData.dailyForecasts?.[0]?.condition || 'Partly Cloudy ⛅'}
              </span>
            </div>
          </div>

          {/* Moisture & Humidity */}
          <div className="agri-card p-5 bg-white flex flex-col justify-between space-y-2">
            <div className="space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                <span>Relative Humidity</span>
                <Droplets className="w-4 h-4 text-sky-600" />
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-slate-900">
                {weatherData.humidityPercent}%
              </p>
            </div>
            <p className="text-[11px] text-slate-500 leading-snug">
              {weatherData.humidityPercent > 80
                ? 'High atmospheric moisture. Spore germination risk elevated.'
                : 'Optimal transpiration range for crop foliage.'}
            </p>
          </div>

          {/* Wind Speed & Direction */}
          <div className="agri-card p-5 bg-white flex flex-col justify-between space-y-2">
            <div className="space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                <span>Wind Speed</span>
                <Wind className="w-4 h-4 text-teal-600" />
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-slate-900">
                {weatherData.windKmh} <span className="text-xs font-normal text-slate-500">km/h</span>
              </p>
            </div>
            <p className="text-[11px] text-slate-500 leading-snug">
              Bearing: <strong className="text-slate-700">{weatherData.windDirection}</strong>. Suitable for foliar spraying if &lt; 15 km/h.
            </p>
          </div>

        </div>

        {/* Secondary Farm Soil & Moisture Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="agri-card p-4 bg-white space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Drought Risk Assessment
            </span>
            <p className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{weatherData.droughtAlert}</span>
            </p>
          </div>

          <div className="agri-card p-4 bg-white space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Lowland Flooding Index
            </span>
            <p className="text-xs font-bold text-rose-800 flex items-center gap-1.5">
              <Waves className="w-4 h-4 text-rose-600" />
              <span>{weatherData.floodingRisk}</span>
            </p>
          </div>

          <div className="agri-card p-4 bg-white space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Direct Irrigation Advisory
            </span>
            <p className="text-xs font-bold text-slate-800">
              {weatherData.irrigationAdvice}
            </p>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 4. TODAY'S FORECAST TIMELINE                                         */}
      {/* ==================================================================== */}
      <section className="agri-card p-6 bg-white space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-700" />
            <h2 className="text-base font-bold text-slate-900">Today's Daylight Timeline</h2>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Hourly Operations Guidance
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Morning (6 AM - 11 AM)</span>
            <div className="text-base font-bold text-slate-900">22&deg;C</div>
            <p className="text-[11px] text-slate-600">Mild &amp; Dewy</p>
            <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
              Ideal for Picking
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Afternoon (12 PM - 3 PM)</span>
            <div className="text-base font-bold text-slate-900">{weatherData.temperatureC}&deg;C</div>
            <p className="text-[11px] text-slate-600">Partly Cloudy</p>
            <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-100 text-blue-800">
              High Transpiration
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Evening (4 PM - 7 PM)</span>
            <div className="text-base font-bold text-slate-900">24&deg;C</div>
            <p className="text-[11px] text-slate-600">Scattered Showers</p>
            <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800">
              Rain Expected
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Night (8 PM - Dawn)</span>
            <div className="text-base font-bold text-slate-900">19&deg;C</div>
            <p className="text-[11px] text-slate-600">Cool &amp; Humid</p>
            <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-200 text-slate-700">
              Low Evaporation
            </span>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 5. UPCOMING 7-DAY AGRONOMIC FORECAST                                 */}
      {/* ==================================================================== */}
      <section className="agri-card p-6 bg-white space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <CloudRain className="w-4 h-4 text-emerald-700" />
            <h2 className="text-base font-bold text-slate-900">7-Day Agricultural Forecast</h2>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Next 7 Days Weather Outlook
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {weatherData.dailyForecasts && weatherData.dailyForecasts.map((day, idx) => {
            const risk = getRiskBadge(day.riskLevel);
            const RiskIcon = risk.icon;

            return (
              <div key={idx} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3 w-40">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-sm">
                    {day.condition.includes('☀️') ? '☀️' :
                     day.condition.includes('🌧️') ? '🌧️' :
                     day.condition.includes('⛈️') ? '⛈️' :
                     day.condition.includes('🌦️') ? '🌦️' : '⛅'}
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">{day.dayName}</span>
                    <span className="text-[11px] text-slate-500">{day.condition.replace(/[^\w\s&]/gi, '')}</span>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-slate-600">
                  <span className="font-semibold text-slate-800">
                    {day.maxTempC}&deg;C / {day.minTempC}&deg;C
                  </span>
                  <span className="font-medium text-sky-700 flex items-center gap-1">
                    <Droplets className="w-3 h-3" />
                    <span>{day.rainfallMm} mm rain</span>
                  </span>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${risk.class}`}>
                    <RiskIcon className="w-3 h-3" />
                    <span>{risk.label}</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 6. RAINFALL & SOIL SATURATION ASSESSMENT                             */}
      {/* ==================================================================== */}
      <section className="agri-card p-6 bg-white space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Droplets className="w-4 h-4 text-emerald-700" />
            <h2 className="text-base font-bold text-slate-900">Precipitation &amp; Field Moisture Analysis</h2>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            Soil Retention Index
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-sky-50/50 border border-sky-100 space-y-1">
            <span className="text-[10px] font-bold text-sky-800 uppercase tracking-wider block">Expected Rainfall</span>
            <div className="text-2xl font-bold text-sky-900">{weatherData.rainfallMm} mm</div>
            <p className="text-[11px] text-sky-700">Accumulation forecast across active weather window</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Heavy Rain Window</span>
            <div className="text-sm font-bold text-slate-900">{weatherData.expectedTime}</div>
            <p className="text-[11px] text-slate-500">Peak intensity period for farm preparedness</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Fungicide / Spray Timing</span>
            <div className="text-sm font-bold text-emerald-800">Hold Spraying &gt; 48h</div>
            <p className="text-[11px] text-slate-500">Rain-fastness window insufficient before downpour</p>
          </div>
        </div>

        {/* 7-DAY RAINFALL TREND VISUALIZATION */}
        {weatherData.dailyForecasts && (
          <div className="pt-3 space-y-2">
            <span className="text-[11px] font-bold text-slate-600 block">
              7-Day Precipitation Distribution (mm)
            </span>
            <div className="grid grid-cols-7 gap-1.5 pt-2 items-end h-28 bg-slate-50/70 p-3 rounded-xl border border-slate-100">
              {weatherData.dailyForecasts.map((d, i) => {
                const heightPercent = Math.min(100, Math.max(8, (d.rainfallMm / 90) * 100));
                const isHeavy = d.rainfallMm > 40;
                const isModerate = d.rainfallMm > 10;

                return (
                  <div key={i} className="flex flex-col items-center gap-1 h-full justify-end">
                    <span className="text-[9px] font-bold text-slate-600">{d.rainfallMm}m</span>
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full rounded-t-md transition-all ${
                        isHeavy ? 'bg-rose-500' : isModerate ? 'bg-amber-500' : 'bg-sky-400'
                      }`}
                    ></div>
                    <span className="text-[10px] font-medium text-slate-500 truncate w-full text-center">
                      {d.dayName.slice(0, 3)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* ==================================================================== */}
      {/* 7. CROP WEATHER IMPACT (AgroLink Differentiator)                      */}
      {/* ==================================================================== */}
      <section className="agri-card p-6 bg-white space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <Sprout className="w-4 h-4 text-emerald-700" />
              <h2 className="text-base font-bold text-slate-900">Crop-Specific Weather Impact</h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Agronomic vulnerability matrix correlating rainfall, humidity, and disease factors.
            </p>
          </div>

          {/* CROP SELECTOR FILTER */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">Filter Crop:</span>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700 cursor-pointer shadow-2xs"
            >
              <option value="ALL">All Affected Crops</option>
              {allAffectedCrops.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Affected Crop Vulnerability Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {allAffectedCrops
            .filter((c) => selectedCrop === 'ALL' || selectedCrop === c)
            .map((cropName) => {
              const isTomato = cropName.toLowerCase().includes('tomato');
              const isChili = cropName.toLowerCase().includes('chili');
              const isPotato = cropName.toLowerCase().includes('potato');

              return (
                <div key={cropName} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-900">{cropName}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                      High Impact
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Rainfall Risk:</span>
                      <strong className="text-slate-800">
                        {isTomato ? 'Severe (Fruit cracking)' : isPotato ? 'Waterlogging & Blight' : 'Root rot & leaf drop'}
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Humidity Risk:</span>
                      <strong className="text-slate-800">
                        {isTomato ? 'Late Blight (Phytophthora)' : isChili ? 'Anthracnose Fruit Rot' : 'Early Blight Spreading'}
                      </strong>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 text-[11px] text-slate-700">
                    <strong>Action:</strong>{' '}
                    {isTomato
                      ? 'Clear furrows, harvest mature fruit before rain, suspend nitrogen.'
                      : isPotato
                      ? 'Inspect hilling earth, check drainage channels, avoid mechanical picking in mud.'
                      : 'Ensure row aerators, stake tall plants, hold scheduled irrigation.'}
                  </div>
                </div>
              );
            })}
        </div>

        {/* Official Recommendation Box */}
        <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200/80 flex items-start gap-3 text-xs text-emerald-950">
          <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold">Agronomic System Recommendation:</span>
            <p className="text-emerald-900 leading-relaxed">
              {weatherData.recommendation}
            </p>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 8. CONNECTED FARM WORKSPACE ACTIONS                                  */}
      {/* ==================================================================== */}
      <section className="agri-card p-6 bg-white space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-slate-900">Connected Farm Management Actions</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Respond to current weather alerts across existing AgroLink modules.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          
          <Link
            to="/disease-detection"
            className="p-3.5 rounded-xl border border-slate-200 hover:border-emerald-600 hover:bg-emerald-50/30 transition flex flex-col justify-between space-y-2 group shadow-2xs"
          >
            <div className="flex items-center justify-between">
              <Scan className="w-5 h-5 text-emerald-700" />
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 transition" />
            </div>
            <div>
              <span className="font-bold text-slate-900 block">Scan for Crop Disease</span>
              <span className="text-[11px] text-slate-500">Check leaf symptoms caused by humidity</span>
            </div>
          </Link>

          <Link
            to="/advisor"
            className="p-3.5 rounded-xl border border-slate-200 hover:border-emerald-600 hover:bg-emerald-50/30 transition flex flex-col justify-between space-y-2 group shadow-2xs"
          >
            <div className="flex items-center justify-between">
              <BrainCircuit className="w-5 h-5 text-emerald-700" />
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 transition" />
            </div>
            <div>
              <span className="font-bold text-slate-900 block">AI Agronomist Advice</span>
              <span className="text-[11px] text-slate-500">Receive field drainage and spraying advice</span>
            </div>
          </Link>

          <Link
            to="/equipment-rental"
            className="p-3.5 rounded-xl border border-slate-200 hover:border-emerald-600 hover:bg-emerald-50/30 transition flex flex-col justify-between space-y-2 group shadow-2xs"
          >
            <div className="flex items-center justify-between">
              <Tractor className="w-5 h-5 text-emerald-700" />
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 transition" />
            </div>
            <div>
              <span className="font-bold text-slate-900 block">Rent Water Pumps</span>
              <span className="text-[11px] text-slate-500">Find heavy drainage pumps &amp; trenchers</span>
            </div>
          </Link>

          <Link
            to="/price-prediction"
            className="p-3.5 rounded-xl border border-slate-200 hover:border-emerald-600 hover:bg-emerald-50/30 transition flex flex-col justify-between space-y-2 group shadow-2xs"
          >
            <div className="flex items-center justify-between">
              <TrendingUp className="w-5 h-5 text-emerald-700" />
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 transition" />
            </div>
            <div>
              <span className="font-bold text-slate-900 block">Wholesale Price Impact</span>
              <span className="text-[11px] text-slate-500">Track price shifts from rain arrival delays</span>
            </div>
          </Link>

        </div>
      </section>

    </div>
  );
};

export default Weather;
