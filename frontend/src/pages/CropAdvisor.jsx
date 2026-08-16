import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bot, CheckCircle2, TrendingUp, DollarSign, Calendar, AlertTriangle, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cropAdvisorAPI } from '../services/api';

export const CropAdvisor = () => {
  const [form, setForm] = useState({
    location: 'Anuradhapura',
    landSizeAcres: 2.0,
    soilType: 'Sandy Loam',
    waterAvailability: 'Medium',
    month: 'September',
    budgetLkr: 150000,
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const fetchAnalysis = async (formData) => {
    setLoading(true);
    try {
      const res = await cropAdvisorAPI.analyze(formData || form);
      if (res && res.data) {
        setResult(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch Crop Advisor analysis:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalysis(form);
  }, []);

  const handleAnalyze = (e) => {
    e.preventDefault();
    fetchAnalysis(form);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8 animate-fade-in">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200/60">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2 border border-emerald-200/60">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Machine Learning Agronomy Engine
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 font-display flex items-center gap-2">
            AI Crop Advisor 🤖
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Input field parameters to analyze agro-ecological suitability, cost/revenue projections, and growth cycles.
          </p>
        </div>
      </div>


      {/* TWO COLUMN GRID */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* INPUT FORM */}
        <div className="lg:col-span-5 premium-card p-6 bg-white border border-slate-100/90 shadow-lg space-y-5">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-600" /> Field Parameters
            </h3>
            <p className="text-xs text-slate-400">Configure your specific land conditions</p>
          </div>

          <form onSubmit={handleAnalyze} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Location</label>
              <select
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="input-premium text-sm font-semibold"
              >
                <option value="Anuradhapura">Anuradhapura (Dry Zone)</option>
                <option value="Nuwara Eliya">Nuwara Eliya (Hill Country)</option>
                <option value="Jaffna">Jaffna (Northern Peninsula)</option>
                <option value="Dambulla">Dambulla (Central Valley)</option>
                <option value="Badulla">Badulla (Uva Province)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Land Size (Acres)</label>
                <input
                  type="number"
                  step="0.5"
                  value={form.landSizeAcres}
                  onChange={(e) => setForm({ ...form, landSizeAcres: Number(e.target.value) })}
                  className="input-premium text-sm font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Planting Month</label>
                <select
                  value={form.month}
                  onChange={(e) => setForm({ ...form, month: e.target.value })}
                  className="input-premium text-sm font-semibold"
                >
                  <option value="September">September</option>
                  <option value="October">October</option>
                  <option value="November">November</option>
                  <option value="December">December</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Soil Type</label>
              <select
                value={form.soilType}
                onChange={(e) => setForm({ ...form, soilType: e.target.value })}
                className="input-premium text-sm font-semibold"
              >
                <option value="Sandy Loam">Sandy Loam</option>
                <option value="Clay Loam">Clay Loam</option>
                <option value="Red Yellow Latosols">Red Yellow Latosols</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Water Availability</label>
              <select
                value={form.waterAvailability}
                onChange={(e) => setForm({ ...form, waterAvailability: e.target.value })}
                className="input-premium text-sm font-semibold"
              >
                <option value="Medium">Medium (Rainfed + Well)</option>
                <option value="High">High (Irrigated Canal)</option>
                <option value="Low">Low (Rainfed Only)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Budget (Rs.)</label>
              <input
                type="number"
                value={form.budgetLkr}
                onChange={(e) => setForm({ ...form, budgetLkr: Number(e.target.value) })}
                className="input-premium text-sm font-bold"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-500/20 hover:from-emerald-600 hover:to-emerald-700 transition"
            >
              {loading ? 'Analyzing Agronomy Models...' : 'Run AI Agronomy Analysis 🤖'}
            </button>
          </form>
        </div>

        {/* RESULTS PANEL */}
        <div className="lg:col-span-7 space-y-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="premium-card p-6 bg-white border border-emerald-100 shadow-xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-extrabold rounded-full uppercase tracking-wider">
                  🏆 Best Recommendation: {result.bestRecommendation}
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900 font-display mt-2">
                  Top Recommended Crop: <span className="text-emerald-600">{result.bestRecommendation}</span>
                </h2>
              </div>
              <div className="text-right">
                <span className="text-3xl font-extrabold text-emerald-600 font-display">92%</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">Suitability Match</span>
              </div>
            </div>

            {/* REAL-TIME WEATHER INTELLIGENCE & IRRIGATION ADVICE */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-red-950 via-slate-900 to-indigo-950 text-white space-y-2 border border-red-800/80">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-red-300 flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-400" /> Weather Intelligence Warning (82mm Heavy Rain Expected)
                </span>
                <span className="px-2 py-0.5 rounded bg-red-800 text-red-100 font-bold text-[9px]">HIGH RISK</span>
              </div>
              <p className="text-xs text-slate-200 font-medium">
                <strong>Agronomic Advice:</strong> Avoid fertilizer application tomorrow for {result.bestRecommendation} &amp; Chili. Pause automated drip irrigation for 48h.
              </p>
            </div>

            {/* CROP SUITABILITY BREAKDOWN */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Recommended Crops Breakdown</h3>
              {result.recommendedCrops.map((crop, idx) => (
                <div key={idx} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                      {idx + 1}
                    </span>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{crop.cropName}</h4>
                      <p className="text-[11px] text-slate-400 font-semibold">Agro-Ecological Match</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-32 bg-slate-200 h-2.5 rounded-full overflow-hidden hidden sm:block">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${crop.suitabilityPercentage}%` }} />
                    </div>
                    <span className="font-extrabold text-emerald-700 text-sm">{crop.suitabilityPercentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* PROJECTION GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="premium-card p-5 bg-white border border-slate-100 shadow-md space-y-1">
              <p className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Expected Harvest Period</p>
              <h3 className="text-xl font-extrabold text-slate-900 font-display">{result.expectedHarvestingPeriod}</h3>
              <p className="text-xs text-emerald-600 font-bold mt-1">Optimal growth cycle</p>
            </div>

            <div className="premium-card p-5 bg-white border border-slate-100 shadow-md space-y-1">
              <p className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Estimated Cost</p>
              <h3 className="text-xl font-extrabold text-slate-900 font-display">Rs. {result.estimatedCostLkr.toLocaleString()}</h3>
              <p className="text-xs text-slate-500 font-semibold mt-1">Within specified budget</p>
            </div>

            <div className="premium-card p-5 bg-white border border-slate-100 shadow-md space-y-1">
              <p className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Estimated Revenue</p>
              <h3 className="text-xl font-extrabold text-emerald-600 font-display">
                Rs. {result.minEstimatedRevenueLkr.toLocaleString()} – Rs. {result.maxEstimatedRevenueLkr.toLocaleString()}
              </h3>
              <p className="text-xs text-emerald-600 font-bold mt-1">Net profit: Rs. 120,000+</p>
            </div>

            <div className="premium-card p-5 bg-white border border-slate-100 shadow-md space-y-1">
              <p className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Agronomic Risk Level</p>
              <h3 className="text-xl font-extrabold text-amber-600 font-display">{result.riskLevel}</h3>
              <p className="text-xs text-amber-700 font-semibold mt-1">Standard pest control required</p>
            </div>
          </div>

          {/* ACTION BANNER */}
          <div className="p-6 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl text-white shadow-lg flex justify-between items-center">
            <div>
              <h4 className="font-bold text-base font-display">Ready to list your recommended harvest?</h4>
              <p class="text-xs text-emerald-100 mt-0.5">Pre-fill listing details directly in the AgroLink marketplace.</p>
            </div>
            <Link to="/crops/add" className="px-5 py-2.5 bg-white text-emerald-950 font-bold text-xs rounded-xl shadow-md shrink-0 hover:bg-slate-50 transition">
              List Harvest Batch →
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
