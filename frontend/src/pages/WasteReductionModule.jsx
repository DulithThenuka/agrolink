import React, { useState, useEffect } from 'react';
import { wasteReductionAPI } from '../services/api';
import {
  Recycle, AlertTriangle, TrendingDown, Store, HeartHandshake, Factory,
  CheckCircle2, Clock, MapPin, Sparkles, RefreshCw, Send, ShieldCheck,
  Leaf, Droplets, Utensils
} from 'lucide-react';

export const WasteReductionModule = () => {
  const [cropName, setCropName] = useState('Tomatoes');
  const [quantityKg, setQuantityKg] = useState(500);
  const [daysToExpiry, setDaysToExpiry] = useState(2);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionSuccessMsg, setActionSuccessMsg] = useState(null);
  const [discountApplied, setDiscountApplied] = useState(false);

  const loadAnalysis = async () => {
    setLoading(true);
    try {
      const res = await wasteReductionAPI.analyzeRisk({
        cropName,
        quantityKg: parseInt(quantityKg) || 500,
        daysToExpiry: parseInt(daysToExpiry) || 2
      });
      if (res && res.data) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Failed to load waste reduction analysis:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalysis();
  }, [cropName, quantityKg, daysToExpiry]);

  const handleApplyDiscount = async () => {
    try {
      const res = await wasteReductionAPI.applyDiscount({
        cropId: 101,
        discountPct: data?.recommendedDiscountPct || 15
      });
      if (res && res.data) {
        setDiscountApplied(true);
        setActionSuccessMsg(res.data.message);
        setTimeout(() => setActionSuccessMsg(null), 5000);
      }
    } catch (err) {
      console.error('Error applying discount:', err);
    }
  };

  const handleDispatchOffer = async (buyerName) => {
    try {
      const res = await wasteReductionAPI.dispatchOffer({
        targetBuyerName: buyerName,
        cropName,
        quantityKg: parseInt(quantityKg) || 500
      });
      if (res && res.data) {
        setActionSuccessMsg(res.data.message);
        setTimeout(() => setActionSuccessMsg(null), 5000);
      }
    } catch (err) {
      console.error('Error dispatching offer:', err);
    }
  };

  const handleInitiateDonation = async (foodBankName) => {
    try {
      const res = await wasteReductionAPI.initiateDonation({
        foodBankName,
        cropName,
        quantityKg: parseInt(quantityKg) || 500
      });
      if (res && res.data) {
        setActionSuccessMsg(res.data.message);
        setTimeout(() => setActionSuccessMsg(null), 6000);
      }
    } catch (err) {
      console.error('Error initiating donation:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8 animate-fade-in">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200/60">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500 text-white shadow-md shadow-emerald-500/20">
              <Recycle className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 font-display">
              Waste Reduction & Produce Rescue ♻️
            </h1>
          </div>
          <p className="text-slate-500 text-sm mt-1">
            Detect unsold produce risk before harvest spoilage and trigger automated multi-channel rescue routing.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-emerald-50 text-emerald-800 font-bold rounded-2xl text-xs flex items-center gap-2 border border-emerald-200/70">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Zero Food Waste Engine Active</span>
          </div>
        </div>
      </div>

      {/* ACTION SUCCESS BANNER */}
      {actionSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 font-bold text-sm flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* 1. INPUT HARVEST RISK DETECTOR FORM */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white shadow-xl space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold font-display text-white">
              Harvest Risk Analyzer & Expiry Detector
            </h2>
          </div>
          <button
            onClick={loadAnalysis}
            className="p-2 bg-slate-700 hover:bg-slate-600 rounded-xl transition text-slate-200"
            title="Recalculate Risk"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
              Crop Name
            </label>
            <input
              type="text"
              value={cropName}
              onChange={(e) => setCropName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm font-bold text-white focus:outline-none focus:border-emerald-500"
              placeholder="e.g. Tomatoes"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
              Quantity (Kg)
            </label>
            <input
              type="number"
              value={quantityKg}
              onChange={(e) => setQuantityKg(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm font-bold text-white focus:outline-none focus:border-emerald-500"
              placeholder="500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
              Days to Expiry
            </label>
            <input
              type="number"
              value={daysToExpiry}
              onChange={(e) => setDaysToExpiry(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm font-bold text-white focus:outline-none focus:border-emerald-500"
              placeholder="2"
            />
          </div>
        </div>

        {/* RISK DETECTION BANNER */}
        {data && (
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-700 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center font-bold">
                <AlertTriangle className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-semibold">AgroLink Detection Result:</span>
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-black uppercase bg-red-500 text-white animate-pulse">
                    Unsold Produce Risk: {data.unsoldRiskLevel}
                  </span>
                </div>
                <h3 className="text-xl font-extrabold text-white font-display mt-0.5">
                  {data.quantityKg} kg {data.cropName} • Expiry: {data.daysToExpiry} days
                </h3>
              </div>
            </div>

            <div className="text-left md:text-right font-mono">
              <div className="text-xs text-slate-400">Original Price: LKR {data.originalPricePerKg}/kg</div>
              <div className="text-lg font-black text-emerald-400">
                Rescue Target: LKR {data.discountedPricePerKg}/kg (-{data.recommendedDiscountPct}%)
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. AUTOMATED RECOMMENDATIONS GRID */}
      {data && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h2 className="text-xl font-extrabold text-slate-900 font-display flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              AgroLink Automated Rescue Recommendations
            </h2>
            <span className="text-xs font-bold text-slate-500">4 Automated Pathways Active</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* PATHWAY 1: DYNAMIC FLASH PRICE DISCOUNT */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-md space-y-4 hover:shadow-lg transition">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-amber-50 text-amber-600 font-bold">
                    <TrendingDown className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold text-amber-700 bg-amber-100 px-2 py-0.5 rounded uppercase tracking-wider">
                      Pathway 1 • Rapid Clearance
                    </span>
                    <h3 className="text-lg font-extrabold text-slate-900 font-display">
                      Reduce Price {data.recommendedDiscountPct}%
                    </h3>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Automatically mark down current listing price from <span className="font-bold">Rs {data.originalPricePerKg}</span> to <span className="font-bold text-emerald-600">Rs {data.discountedPricePerKg}</span>/kg to clear 500kg before expiration.
              </p>

              <button
                onClick={handleApplyDiscount}
                disabled={discountApplied}
                className={`w-full py-3 px-4 rounded-xl font-bold text-xs shadow-md transition flex items-center justify-center gap-2 ${
                  discountApplied
                    ? 'bg-emerald-100 text-emerald-800 cursor-default'
                    : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white'
                }`}
              >
                {discountApplied ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" /> 15% Price Reduction Applied Live!
                  </>
                ) : (
                  <>
                    <TrendingDown className="w-4 h-4" /> Apply {data.recommendedDiscountPct}% Price Reduction Now
                  </>
                )}
              </button>
            </div>

            {/* PATHWAY 2: NEARBY COMMERCIAL BUYERS */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-md space-y-4 hover:shadow-lg transition">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-sky-50 text-sky-600 font-bold">
                    <Store className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold text-sky-700 bg-sky-100 px-2 py-0.5 rounded uppercase tracking-wider">
                      Pathway 2 • Commercial Direct
                    </span>
                    <h3 className="text-lg font-extrabold text-slate-900 font-display">
                      Nearby Commercial Buyers
                    </h3>
                  </div>
                </div>
              </div>

              <div className="space-y-2.5">
                {data.nearbyCommercialBuyers.map((b) => (
                  <div key={b.name} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between gap-2">
                    <div>
                      <div className="text-xs font-bold text-slate-900">{b.name}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                        <span className="font-semibold text-sky-700">{b.category}</span> • <span>{b.distanceKm} km away</span> • <span className="font-mono text-slate-700">Req: {b.requiredQuantityKg}kg</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDispatchOffer(b.name)}
                      className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-[11px] rounded-lg transition flex items-center gap-1 shrink-0"
                    >
                      <Send className="w-3 h-3" /> Offer
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* PATHWAY 3: DONATION TO FOOD BANKS */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-md space-y-4 hover:shadow-lg transition">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-rose-50 text-rose-600 font-bold">
                    <HeartHandshake className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold text-rose-700 bg-rose-100 px-2 py-0.5 rounded uppercase tracking-wider">
                      Pathway 3 • Zero-Waste Social Impact
                    </span>
                    <h3 className="text-lg font-extrabold text-slate-900 font-display">
                      Donation: Food Bank D
                    </h3>
                  </div>
                </div>
              </div>

              <div className="space-y-2.5">
                {data.donationPartners.map((d) => (
                  <div key={d.name} className="p-3 bg-rose-50/40 rounded-xl border border-rose-100 flex items-center justify-between gap-2">
                    <div>
                      <div className="text-xs font-bold text-slate-900">{d.name}</div>
                      <div className="text-[11px] text-rose-700 font-semibold mt-0.5">
                        {d.type} • Free Pick-up Available • Tax Certificate Included
                      </div>
                    </div>
                    <button
                      onClick={() => handleInitiateDonation(d.name)}
                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] rounded-lg transition flex items-center gap-1 shrink-0"
                    >
                      Donate 🍲
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* PATHWAY 4: FOOD PROCESSING COMPANY */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-md space-y-4 hover:shadow-lg transition">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-purple-50 text-purple-600 font-bold">
                    <Factory className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold text-purple-700 bg-purple-100 px-2 py-0.5 rounded uppercase tracking-wider">
                      Pathway 4 • Industrial Upcycling
                    </span>
                    <h3 className="text-lg font-extrabold text-slate-900 font-display">
                      Processing Company: Sauce Factory E
                    </h3>
                  </div>
                </div>
              </div>

              <div className="space-y-2.5">
                {data.processingCompanies.map((p) => (
                  <div key={p.name} className="p-3 bg-purple-50/40 rounded-xl border border-purple-100 flex items-center justify-between gap-2">
                    <div>
                      <div className="text-xs font-bold text-slate-900">{p.name}</div>
                      <div className="text-[11px] text-purple-700 font-semibold mt-0.5">
                        {p.processingType} • Offered Price: <span className="font-mono font-bold">Rs {p.offeredPricePerKg}/kg</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDispatchOffer(p.name)}
                      className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-[11px] rounded-lg transition flex items-center gap-1 shrink-0"
                    >
                      Route Factory 🏭
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 3. ENVIRONMENTAL IMPACT COUNTER */}
      {data?.environmentalImpact && (
        <div className="p-6 rounded-3xl bg-emerald-950 text-white border border-emerald-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Leaf className="w-5 h-5 text-emerald-400" />
              <h3 className="text-lg font-bold font-display text-white">
                Environmental & Social Impact Metrics Saved
              </h3>
            </div>
            <span className="text-xs text-emerald-400 font-mono">AgroLink Circular Economy</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 flex items-center gap-3">
              <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400">
                <Leaf className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-black font-mono text-emerald-400">
                  {data.environmentalImpact.co2SavedKg} kg
                </div>
                <div className="text-xs text-slate-400 font-semibold">CO2 Emissions Prevented</div>
              </div>
            </div>

            <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 flex items-center gap-3">
              <div className="p-3 rounded-xl bg-sky-500/20 text-sky-400">
                <Droplets className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-black font-mono text-sky-400">
                  {data.environmentalImpact.waterSavedLiters.toLocaleString()} L
                </div>
                <div className="text-xs text-slate-400 font-semibold">Agricultural Water Preserved</div>
              </div>
            </div>

            <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 flex items-center gap-3">
              <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400">
                <Utensils className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-black font-mono text-amber-400">
                  {data.environmentalImpact.mealsCreated} Meals
                </div>
                <div className="text-xs text-slate-400 font-semibold">Nutritious Food Meals Created</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WasteReductionModule;
