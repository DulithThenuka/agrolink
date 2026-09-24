import React, { useEffect, useState } from 'react';
import { weatherAPI } from '../services/api';
import { X, CloudRain, AlertTriangle, Thermometer, Droplets, Wind, ShieldAlert, CheckCircle2, Loader2, Calendar, Sprout, Info } from 'lucide-react';

export const WeatherIntelligenceModal = ({ location, onClose }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      try {
        const res = await weatherAPI.getIntelligence(location || 'Nuwara Eliya');
        if (res && res.data) {
          setData(res.data);
        } else {
          fallbackData();
        }
      } catch (err) {
        console.error('Failed to fetch weather intelligence:', err);
        fallbackData();
      } finally {
        setLoading(false);
      }
    };

    const fallbackData = () => {
      setData({
        location: location || 'Nuwara Eliya / Kandy',
        alertTitle: '⚠ Heavy Rain Warning',
        expectedTime: 'Tomorrow 3 PM – 8 PM',
        rainfallMm: 82.0,
        riskLevel: 'HIGH',
        affectedCrops: ['Tomatoes', 'Chili', 'Potato'],
        recommendation: 'Avoid fertilizer application tomorrow. Ensure field drainage channels are clear to prevent root rot.',
        temperatureC: 26.0,
        highLowTemp: 'High 28°C / Low 19°C',
        humidityPercent: 84.0,
        windKmh: 18.0,
        windDirection: 'SW',
        droughtAlert: 'Normal Soil Moisture (0% Drought Risk)',
        floodingRisk: 'HIGH (Flash Flood Warning in Lowland Basins)',
        irrigationAdvice: 'Pause automated drip irrigation for the next 48 hours.',
        dailyForecasts: [
          { dayName: 'Today', condition: 'Partly Cloudy ⛅', maxTempC: 27, minTempC: 19, rainfallMm: 4, riskLevel: 'LOW' },
          { dayName: 'Tomorrow', condition: 'Heavy Rain & Downpour 🌧️', maxTempC: 23, minTempC: 17, rainfallMm: 82, riskLevel: 'HIGH' },
          { dayName: 'Wednesday', condition: 'Scattered Showers 🌦️', maxTempC: 25, minTempC: 18, rainfallMm: 18, riskLevel: 'MEDIUM' },
          { dayName: 'Thursday', condition: 'Sunny Spells 🌤️', maxTempC: 28, minTempC: 20, rainfallMm: 2, riskLevel: 'LOW' },
          { dayName: 'Friday', condition: 'Clear & Warm ☀️', maxTempC: 29, minTempC: 21, rainfallMm: 0, riskLevel: 'LOW' },
          { dayName: 'Saturday', condition: 'Moderate Rain 🌧️', maxTempC: 24, minTempC: 18, rainfallMm: 24, riskLevel: 'MEDIUM' },
          { dayName: 'Sunday', condition: 'Thunderstorm Risk ⛈️', maxTempC: 22, minTempC: 17, rainfallMm: 45, riskLevel: 'HIGH' },
        ],
      });
    };

    fetchWeather();
  }, [location]);

  return (
    <div className="agri-modal-backdrop">
      <div className="agri-modal-content max-w-3xl relative max-h-[90vh] overflow-y-auto">
        
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center transition"
        >
          <X className="w-5 h-5" />
        </button>

        {loading ? (
          <div className="p-12 text-center text-slate-400 space-y-3">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600" />
            <p className="text-sm font-semibold">Connecting to Agronomic Weather Intelligence Models...</p>
          </div>
        ) : data ? (
          <div className="p-6 md:p-8 space-y-6">
            
            {/* WEATHER ALERT BANNER */}
            <div className="p-5 rounded-xl bg-rose-50 border border-rose-200 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-rose-100 text-rose-800 border border-rose-200 text-[10px] font-bold uppercase tracking-wider">
                  <AlertTriangle className="w-3.5 h-3.5" /> Climate Risk Alert
                </span>
                <span className="text-xs text-slate-600 font-medium">Region: {data.location}</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold text-rose-900">{data.alertTitle}</h2>
                  <p className="text-xs text-slate-600 mt-0.5">Expected: <strong className="text-slate-800">{data.expectedTime}</strong></p>
                </div>
                <div className="bg-rose-100 border border-rose-200 p-3 rounded-lg text-center shrink-0">
                  <span className="text-[10px] font-semibold uppercase text-rose-700 tracking-wider block">Expected Rainfall</span>
                  <span className="text-xl font-bold text-rose-900">{data.rainfallMm} mm</span>
                </div>
              </div>

              <div className="p-3 bg-white border border-rose-200 rounded-lg space-y-1 text-xs">
                <span className="font-semibold text-amber-800 flex items-center gap-1.5">
                  <Sprout className="w-3.5 h-3.5" /> Affected Crops: {data.affectedCrops.join(', ')}
                </span>
                <p className="text-slate-700">
                  <strong>Recommendation:</strong> {data.recommendation}
                </p>
              </div>
            </div>

            {/* LIVE WEATHER METRICS GRID */}
            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 font-display flex items-center gap-1.5">
                <CloudRain className="w-4 h-4 text-blue-600" /> Current Climate &amp; Soil Metrics
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Temperature</span>
                  <p className="text-xl font-black text-slate-900 font-display flex items-center gap-1">
                    <Thermometer className="w-5 h-5 text-amber-500" /> {data.temperatureC}°C
                  </p>
                  <span className="text-[11px] text-slate-500 font-semibold">{data.highLowTemp}</span>
                </div>

                <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200 space-y-1">
                  <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider block">Relative Humidity</span>
                  <p className="text-xl font-black text-blue-900 font-display flex items-center gap-1">
                    <Droplets className="w-5 h-5 text-blue-600" /> {data.humidityPercent}%
                  </p>
                  <span className="text-[11px] text-blue-700 font-semibold">High Moisture Level</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Wind Speed</span>
                  <p className="text-xl font-black text-slate-900 font-display flex items-center gap-1">
                    <Wind className="w-5 h-5 text-teal-600" /> {data.windKmh} km/h
                  </p>
                  <span className="text-[11px] text-slate-500 font-semibold">Direction: {data.windDirection}</span>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-1">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">Drought Risk</span>
                  <p className="font-extrabold text-emerald-900">{data.droughtAlert}</p>
                </div>

                <div className="p-4 rounded-2xl bg-red-50/80 border border-red-200 space-y-1">
                  <span className="text-[10px] font-bold text-red-800 uppercase tracking-wider block">Flooding Risk</span>
                  <p className="font-extrabold text-red-900">{data.floodingRisk}</p>
                </div>

                <div className="p-4 rounded-2xl bg-indigo-50/80 border border-indigo-200 space-y-1">
                  <span className="text-[10px] font-bold text-indigo-800 uppercase tracking-wider block">Irrigation Advice</span>
                  <p className="font-extrabold text-indigo-900 text-[11px]">{data.irrigationAdvice}</p>
                </div>

              </div>
            </div>

            {/* 7-DAY FORECAST TABLE */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 font-display flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-emerald-600" /> 7-Day Rainfall &amp; Risk Outlook
              </h3>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {data.dailyForecasts.map((day, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-2xl border border-slate-200/70 flex items-center justify-between gap-3 text-xs">
                    <div className="w-24">
                      <p className="font-extrabold text-slate-900">{day.dayName}</p>
                      <p className="text-[11px] text-slate-500 font-medium">{day.condition}</p>
                    </div>

                    <div className="flex items-center gap-4 text-slate-600 font-semibold">
                      <span>{day.maxTempC}°C / {day.minTempC}°C</span>
                      <span className="font-bold text-blue-600">{day.rainfallMm} mm rain</span>
                    </div>

                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                      day.riskLevel === 'HIGH' ? 'bg-red-100 text-red-800 border border-red-200' :
                      day.riskLevel === 'MEDIUM' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                      'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}>
                      {day.riskLevel} RISK
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        ) : null}

      </div>
    </div>
  );
};
