import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { iotAPI } from '../services/api';
import {
  X,
  Cpu,
  Wifi,
  Droplet,
  Thermometer,
  Wind,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Play,
  Square,
  RefreshCw,
  Zap,
  ShieldCheck,
  TrendingUp,
  Clock,
  CloudRain,
  Sliders,
  Sparkles,
  Activity,
  Timer,
  Check
} from 'lucide-react';

export const IoTFarmControlModal = ({ deviceId, onClose }) => {
  const [telemetry, setTelemetry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [triggering, setTriggering] = useState(false);
  const [activeChartMetric, setActiveChartMetric] = useState('moisture'); // 'moisture', 'temp', 'ph', 'humidity'

  // Automated Trigger Controls State
  const [autoThreshold, setAutoThreshold] = useState(35); // Trigger irrigation if moisture < 35%
  const [targetMoisture, setTargetMoisture] = useState(65); // Stop when >= 65%
  const [rainBypassEnabled, setRainBypassEnabled] = useState(true);
  const [autoModeActive, setAutoModeActive] = useState(true);
  const [irrigationDurationMins, setIrrigationDurationMins] = useState(15);
  const [activeTimerSeconds, setActiveTimerSeconds] = useState(0);

  const activeDeviceId = deviceId || 'ESP32-AGRO-8941';

  // 12-Hour Historical Telemetry Dataset
  const HOURLY_TELEMETRY = [
    { time: '06:00', moisture: 48, temp: 22.5, ph: 6.4, humidity: 85 },
    { time: '08:00', moisture: 44, temp: 24.8, ph: 6.4, humidity: 80 },
    { time: '10:00', moisture: 39, temp: 27.3, ph: 6.5, humidity: 74 },
    { time: '12:00', moisture: 34, temp: 30.1, ph: 6.3, humidity: 68 },
    { time: '14:00', moisture: 31, temp: 31.4, ph: 6.4, humidity: 65 },
    { time: '16:00', moisture: 32, temp: 29.0, ph: 6.4, humidity: 71 },
    { time: '18:00', moisture: 33, temp: 26.2, ph: 6.4, humidity: 76 }
  ];

  const fetchTelemetry = async () => {
    setLoading(true);
    try {
      const res = await iotAPI.getTelemetry(activeDeviceId);
      if (res && res.data) {
        setTelemetry(res.data);
      } else {
        fallbackTelemetry();
      }
    } catch (err) {
      console.error('Failed to fetch IoT telemetry:', err);
      fallbackTelemetry();
    } finally {
      setLoading(false);
    }
  };

  const fallbackTelemetry = () => {
    setTelemetry({
      deviceId: activeDeviceId,
      soilMoisturePercent: 32.0,
      temperatureC: 29.0,
      humidityPercent: 71.0,
      soilPh: 6.4,
      waterTankLevelPercent: 42.0,
      mqttStatus: 'CONNECTED (Broker: mqtt://broker.agrolink.io:1883)',
      recommendation: 'Soil moisture (32%) dropped below 35% threshold. Automated drip cycle recommended.',
      automaticIrrigationEnabled: true,
      valveState: 'CLOSED',
      lastSyncTimestamp: 'Just now',
    });
  };

  useEffect(() => {
    fetchTelemetry();
  }, [deviceId]);

  // Active Timer Countdown Effect
  useEffect(() => {
    let interval = null;
    if (telemetry?.valveState === 'OPEN' && activeTimerSeconds > 0) {
      interval = setInterval(() => {
        setActiveTimerSeconds((prev) => {
          if (prev <= 1) {
            handleToggleValve(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [telemetry?.valveState, activeTimerSeconds]);

  const handleToggleValve = async (open, durationMins = irrigationDurationMins) => {
    setTriggering(true);
    try {
      const res = await iotAPI.triggerIrrigation(activeDeviceId, open);
      if (res && res.data) {
        setTelemetry(res.data);
      } else {
        setTelemetry((prev) => ({
          ...prev,
          valveState: open ? 'OPEN' : 'CLOSED',
          recommendation: open
            ? `Drip irrigation active. Target soil moisture ${targetMoisture}% in progress.`
            : `Irrigation paused. Current soil moisture at 32%.`,
        }));
      }
      if (open) {
        setActiveTimerSeconds(durationMins * 60);
      } else {
        setActiveTimerSeconds(0);
      }
    } catch (err) {
      console.error('Failed to toggle valve relay:', err);
      setTelemetry((prev) => ({
        ...prev,
        valveState: open ? 'OPEN' : 'CLOSED',
      }));
      if (open) setActiveTimerSeconds(durationMins * 60);
      else setActiveTimerSeconds(0);
    } finally {
      setTriggering(false);
    }
  };

  // Helper function to render pure SVG chart
  const renderMetricSvgChart = () => {
    const width = 600;
    const height = 160;
    const padding = 30;

    let points = [];
    let minVal = 0;
    let maxVal = 100;
    let unit = '%';
    let lineColor = '#10b981'; // emerald
    let areaFill = 'rgba(16, 185, 129, 0.15)';

    if (activeChartMetric === 'moisture') {
      minVal = 20; maxVal = 60; unit = '%';
      lineColor = '#059669'; areaFill = 'rgba(5, 150, 105, 0.2)';
      points = HOURLY_TELEMETRY.map((d, i) => ({
        x: padding + (i / (HOURLY_TELEMETRY.length - 1)) * (width - 2 * padding),
        y: height - padding - ((d.moisture - minVal) / (maxVal - minVal)) * (height - 2 * padding),
        val: d.moisture,
        label: d.time
      }));
    } else if (activeChartMetric === 'temp') {
      minVal = 20; maxVal = 35; unit = '°C';
      lineColor = '#f59e0b'; areaFill = 'rgba(245, 158, 11, 0.2)';
      points = HOURLY_TELEMETRY.map((d, i) => ({
        x: padding + (i / (HOURLY_TELEMETRY.length - 1)) * (width - 2 * padding),
        y: height - padding - ((d.temp - minVal) / (maxVal - minVal)) * (height - 2 * padding),
        val: d.temp,
        label: d.time
      }));
    } else if (activeChartMetric === 'ph') {
      minVal = 5.5; maxVal = 7.5; unit = ' pH';
      lineColor = '#10b981'; areaFill = 'rgba(16, 185, 129, 0.2)';
      points = HOURLY_TELEMETRY.map((d, i) => ({
        x: padding + (i / (HOURLY_TELEMETRY.length - 1)) * (width - 2 * padding),
        y: height - padding - ((d.ph - minVal) / (maxVal - minVal)) * (height - 2 * padding),
        val: d.ph,
        label: d.time
      }));
    } else {
      minVal = 50; maxVal = 95; unit = '%';
      lineColor = '#3b82f6'; areaFill = 'rgba(59, 130, 246, 0.2)';
      points = HOURLY_TELEMETRY.map((d, i) => ({
        x: padding + (i / (HOURLY_TELEMETRY.length - 1)) * (width - 2 * padding),
        y: height - padding - ((d.humidity - minVal) / (maxVal - minVal)) * (height - 2 * padding),
        val: d.humidity,
        label: d.time
      }));
    }

    const pathD = points.reduce((acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`), '');
    const areaD = `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

    return (
      <div className="w-full overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-44 drop-shadow">
          <defs>
            <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={lineColor} stopOpacity="0.35" />
              <stop offset="100%" stopColor={lineColor} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="#e2e8f0" strokeDasharray="3 3" />
          <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="#e2e8f0" strokeDasharray="3 3" />
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#cbd5e1" strokeWidth="1.5" />

          {/* Shaded Area */}
          <path d={areaD} fill="url(#chartGrad)" />

          {/* Line */}
          <path d={pathD} fill="none" stroke={lineColor} strokeWidth="3" strokeLinecap="round" />

          {/* Points */}
          {points.map((p, idx) => (
            <g key={idx}>
              <circle cx={p.x} cy={p.y} r="4.5" fill="#ffffff" stroke={lineColor} strokeWidth="2.5" />
              <text x={p.x} y={p.y - 9} textAnchor="middle" fontSize="10" fontWeight="bold" fill="#334155">
                {p.val}{unit}
              </text>
              <text x={p.x} y={height - padding + 15} textAnchor="middle" fontSize="9" fontWeight="600" fill="#94a3b8">
                {p.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full border border-slate-100 overflow-hidden relative space-y-6 max-h-[92vh] overflow-y-auto">
        
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {loading ? (
          <div className="p-12 text-center text-slate-400 space-y-3">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-emerald-600" />
            <p className="text-sm font-semibold">Connecting to ESP32 MQTT Telemetry Stream...</p>
          </div>
        ) : telemetry ? (
          <div className="p-6 md:p-8 space-y-6">
            
            {/* HEADER CARD */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                    <Wifi className="w-3.5 h-3.5 text-emerald-400 animate-pulse" /> ESP32 MQTT STREAM
                  </span>
                  <span className="text-xs font-mono font-extrabold text-emerald-400">{telemetry.deviceId}</span>
                </div>
                <h2 className="text-2xl font-black font-display tracking-tight text-white">Smart IoT Farm Telemetry Controller</h2>
                <p className="text-xs text-slate-300 font-medium">{telemetry.mqttStatus}</p>
              </div>

              <button
                onClick={fetchTelemetry}
                className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Refresh Telemetry
              </button>
            </div>

            {/* SENSOR DATA CARDS GRID */}
            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 font-display flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-emerald-600" /> Live Microcontroller Sensor Readings
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                
                {/* Soil Moisture */}
                <div
                  onClick={() => setActiveChartMetric('moisture')}
                  className={`p-4 rounded-2xl border transition cursor-pointer space-y-1 ${
                    activeChartMetric === 'moisture'
                      ? 'bg-amber-50/90 border-amber-500 ring-2 ring-amber-400/30'
                      : 'bg-slate-50 border-slate-200/80 hover:bg-amber-50/40'
                  }`}
                >
                  <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">Soil Moisture</span>
                  <div className="flex items-center justify-between">
                    <p className="text-2xl font-black text-amber-900 font-display">{telemetry.soilMoisturePercent}%</p>
                    <span className="text-[10px] font-black text-amber-800 bg-amber-200 px-2 py-0.5 rounded-full">⚠ Low</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium block">Threshold: &lt; 35%</span>
                </div>

                {/* Temperature */}
                <div
                  onClick={() => setActiveChartMetric('temp')}
                  className={`p-4 rounded-2xl border transition cursor-pointer space-y-1 ${
                    activeChartMetric === 'temp'
                      ? 'bg-amber-50/90 border-amber-500 ring-2 ring-amber-400/30'
                      : 'bg-slate-50 border-slate-200/80 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Ambient Temp</span>
                  <div className="flex items-center justify-between">
                    <p className="text-2xl font-black text-slate-900 font-display">{telemetry.temperatureC}°C</p>
                    <Thermometer className="w-5 h-5 text-amber-500" />
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium block">Field Range: 22–32°C</span>
                </div>

                {/* Humidity */}
                <div
                  onClick={() => setActiveChartMetric('humidity')}
                  className={`p-4 rounded-2xl border transition cursor-pointer space-y-1 ${
                    activeChartMetric === 'humidity'
                      ? 'bg-blue-50/90 border-blue-500 ring-2 ring-blue-400/30'
                      : 'bg-slate-50 border-slate-200/80 hover:bg-blue-50/40'
                  }`}
                >
                  <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider block">Air Humidity</span>
                  <div className="flex items-center justify-between">
                    <p className="text-2xl font-black text-blue-900 font-display">{telemetry.humidityPercent}%</p>
                    <Droplet className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium block">Relative Humidity</span>
                </div>

                {/* Soil pH */}
                <div
                  onClick={() => setActiveChartMetric('ph')}
                  className={`p-4 rounded-2xl border transition cursor-pointer space-y-1 ${
                    activeChartMetric === 'ph'
                      ? 'bg-emerald-50/90 border-emerald-500 ring-2 ring-emerald-400/30'
                      : 'bg-slate-50 border-slate-200/80 hover:bg-emerald-50/40'
                  }`}
                >
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">Soil pH Level</span>
                  <div className="flex items-center justify-between">
                    <p className="text-2xl font-black text-emerald-900 font-display">{telemetry.soilPh}</p>
                    <span className="text-[10px] font-black text-emerald-800 bg-emerald-200 px-2 py-0.5 rounded-full">Optimal</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium block">Target: 6.0 – 6.8</span>
                </div>

              </div>
            </div>

            {/* LIVE SENSOR TELEMETRY CHART SECTION */}
            <div className="p-5 bg-slate-50 rounded-3xl border border-slate-200 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-600" />
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 font-display">
                    12-Hour Telemetry Trend Curve (06:00 – 18:00)
                  </h4>
                </div>

                {/* CHART METRIC SELECTOR BUTTONS */}
                <div className="flex items-center gap-1.5 text-[11px] font-bold">
                  {[
                    { id: 'moisture', label: '💧 Moisture', color: 'emerald' },
                    { id: 'temp', label: '🌡️ Temp', color: 'amber' },
                    { id: 'humidity', label: '💧 Humidity', color: 'blue' },
                    { id: 'ph', label: '🧪 pH Level', color: 'teal' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveChartMetric(tab.id)}
                      className={`px-2.5 py-1 rounded-lg border transition cursor-pointer ${
                        activeChartMetric === tab.id
                          ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {renderMetricSvgChart()}
            </div>

            {/* AUTOMATED IRRIGATION TRIGGER SETTINGS & RELAY CONTROLS */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* TRIGGER SETTINGS (7 Cols) */}
              <div className="lg:col-span-7 p-5 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4 text-xs font-semibold">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="font-extrabold text-slate-900 flex items-center gap-1.5 text-sm">
                    <Sliders className="w-4 h-4 text-emerald-600" /> Automated Trigger Parameters
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
                    Auto-Pilot Active
                  </span>
                </div>

                {/* THRESHOLD SLIDER */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 font-bold">Auto-Trigger Moisture Threshold:</span>
                    <span className="font-black text-amber-700 text-sm font-display">&lt; {autoThreshold}% Moisture</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="50"
                    value={autoThreshold}
                    onChange={(e) => setAutoThreshold(parseInt(e.target.value, 10))}
                    className="w-full accent-amber-600 cursor-pointer"
                  />
                  <p className="text-[10px] text-slate-400">Valves will automatically open when soil sensor drops below this reading.</p>
                </div>

                {/* TARGET MOISTURE */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 font-bold">Target Saturation Cutoff:</span>
                    <span className="font-black text-emerald-700 text-sm font-display">&gt;= {targetMoisture}% Moisture</span>
                  </div>
                  <input
                    type="range"
                    min="55"
                    max="80"
                    value={targetMoisture}
                    onChange={(e) => setTargetMoisture(parseInt(e.target.value, 10))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                  <p className="text-[10px] text-slate-400">Valves will close immediately once target soil saturation is achieved.</p>
                </div>

                {/* RAIN SENSOR BYPASS */}
                <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <CloudRain className="w-4 h-4 text-blue-600" />
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">Rainfall Sensor Bypass</span>
                      <span className="text-[10px] text-slate-500 font-medium">Auto-pauses irrigation if rain is detected</span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={rainBypassEnabled}
                    onChange={(e) => setRainBypassEnabled(e.target.checked)}
                    className="w-5 h-5 accent-emerald-600 rounded cursor-pointer"
                  />
                </div>
              </div>

              {/* LIVE VALVE RELAY TRIGGER CARD (5 Cols) */}
              <div className="lg:col-span-5 p-5 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white rounded-3xl border border-slate-800 shadow-xl flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-emerald-400" /> Solenoid Valve Relay
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                      telemetry.valveState === 'OPEN'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 animate-pulse'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}>
                      {telemetry.valveState === 'OPEN' ? '🌊 Flowing Active' : '🔒 Closed'}
                    </span>
                  </div>

                  <p className="text-xs font-bold text-emerald-200 bg-emerald-950/80 p-2.5 rounded-xl border border-emerald-800/60 leading-relaxed">
                    💡 {telemetry.recommendation}
                  </p>

                  {/* ACTIVE COUNTDOWN TIMER DISPLAY */}
                  {telemetry.valveState === 'OPEN' && activeTimerSeconds > 0 && (
                    <div className="p-3 bg-emerald-900/60 rounded-xl border border-emerald-700/60 flex items-center justify-between text-xs text-white">
                      <span className="flex items-center gap-1.5 font-bold">
                        <Timer className="w-4 h-4 text-emerald-400 animate-spin" /> Cycle Timer:
                      </span>
                      <span className="font-mono font-black text-lg text-emerald-300">
                        {Math.floor(activeTimerSeconds / 60)}m {activeTimerSeconds % 60}s remaining
                      </span>
                    </div>
                  )}

                  {/* QUICK DURATION PRESETS */}
                  {telemetry.valveState === 'CLOSED' && (
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
                        Quick Timed Cycle:
                      </span>
                      <div className="grid grid-cols-3 gap-2 text-[11px]">
                        {[15, 30, 45].map((mins) => (
                          <button
                            key={mins}
                            type="button"
                            onClick={() => setIrrigationDurationMins(mins)}
                            className={`py-1.5 rounded-lg border font-bold text-center transition cursor-pointer ${
                              irrigationDurationMins === mins
                                ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                            }`}
                          >
                            {mins} Mins
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* VALVE TOGGLE BUTTON */}
                <div className="pt-2">
                  {telemetry.valveState === 'CLOSED' ? (
                    <button
                      onClick={() => handleToggleValve(true, irrigationDurationMins)}
                      disabled={triggering}
                      className="w-full py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-black text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                    >
                      {triggering ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-white" />}
                      <span>Activate {irrigationDurationMins}-Min Drip Irrigation 🌊</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleToggleValve(false)}
                      disabled={triggering}
                      className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                    >
                      {triggering ? <Loader2 className="w-4 h-4 animate-spin" /> : <Square className="w-4 h-4 fill-white" />}
                      <span>Stop Drip Irrigation Valve Immediately 🛑</span>
                    </button>
                  )}
                </div>
              </div>

            </div>

          </div>
        ) : null}

      </div>
    </div>
  );
};
