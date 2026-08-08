import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, ShieldCheck, AlertCircle, ArrowUpRight, ArrowDownRight, MapPin, CheckCircle2, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DemandForecasting = () => {
  const [selectedProvince, setSelectedProvince] = useState('Western Province');

  const forecast = {
    provinceName: selectedProvince,
    overallMarketBalance: 'Balanced Supply Allocation',
    socialImpactNotice: `Preventing Harvest Crashes: By diversifying away from Beans and towards Chili & Tomatoes, AgroLink protects local farmer incomes while ensuring consumer price stability in ${selectedProvince}.`,
    cropDemands: [
      { name: 'Chili', level: 'VERY HIGH', surge: 31, positive: true, status: 'High Priority Planting 🚀' },
      { name: 'Tomato', level: 'HIGH', surge: 24, positive: true, status: 'Favorable Market Market 📈' },
      { name: 'Carrot', level: 'MEDIUM', surge: 7, positive: true, status: 'Balanced Production ⚖️' },
      { name: 'Beans', level: 'LOW', surge: 13, positive: false, status: 'Overproduction Warning ⚠️' },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8 animate-fade-in">
      {/* HEADER BANNER */}
      <div className="glass rounded-3xl p-8 border border-white/80 shadow-2xl bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-950 text-white relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <BarChart3 className="w-4 h-4 text-emerald-400" /> Economic Market Allocation
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-display flex items-center gap-3">
            Demand Forecasting 📊
          </h1>
          <p className="text-emerald-100/80 text-sm max-w-2xl">
            Solve agricultural overproduction and price crashes. View regional demand expectations before sowing your harvest.
          </p>
        </div>
      </div>

      {/* PROVINCIAL TABS */}
      <div className="flex flex-wrap gap-3 items-center">
        <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mr-2">Select Province:</span>
        {['Western Province', 'Central Province', 'Northern Province', 'Southern Province'].map((prov) => (
          <button
            key={prov}
            onClick={() => setSelectedProvince(prov)}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition border ${
              selectedProvince === prov
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-500/20'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-emerald-50 hover:text-emerald-700'
            }`}
          >
            🏛️ {prov}
          </button>
        ))}
      </div>

      {/* OVERPRODUCTION PREVENTION CARD */}
      <div className="premium-card p-6 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200/80 shadow-md space-y-2">
        <div className="flex items-center gap-2 text-emerald-900 font-bold">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <h3 className="text-base font-display">Overproduction Prevention Safeguard</h3>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed font-medium">
          {forecast.socialImpactNotice}
        </p>
      </div>

      {/* DEMAND MATRIX GRID */}
      <div className="premium-card p-6 bg-white border border-slate-100/90 shadow-lg space-y-6">
        <div className="flex justify-between items-center pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900 font-display">
              Expected Demand – <span className="text-emerald-600">{forecast.provinceName}</span>
            </h3>
            <p className="text-xs text-slate-400">Current regional consumption surge vs active planting intent</p>
          </div>
          <span className="px-3.5 py-1.5 bg-emerald-100 text-emerald-800 text-xs font-extrabold rounded-full">
            {forecast.overallMarketBalance}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {forecast.cropDemands.map((item, idx) => (
            <motion.div key={idx} whileHover={{ y: -3 }} className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                    🌾
                  </div>
                  <span>{item.name}</span>
                </h4>
                <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                  item.level === 'VERY HIGH' ? 'bg-teal-100 text-teal-800' :
                  item.level === 'HIGH' ? 'bg-emerald-100 text-emerald-800' :
                  item.level === 'MEDIUM' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-700'
                }`}>
                  {item.level}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="font-bold text-slate-600">Surge Projection:</span>
                <span className={`font-extrabold text-sm flex items-center gap-0.5 ${item.positive ? 'text-emerald-600' : 'text-red-600'}`}>
                  {item.positive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  {item.surge}%
                </span>
              </div>

              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Recommendation:</span>
                <span className="font-bold text-slate-800">{item.status}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ACTION BUTTON */}
        <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
          <span className="text-xs text-slate-400 font-semibold">Help distribute regional production and prevent market gluts</span>
          <Link to="/crops/add" className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-500/20 hover:from-emerald-600 hover:to-emerald-700 transition">
            Register Planned Planting Quota →
          </Link>
        </div>
      </div>
    </div>
  );
};
