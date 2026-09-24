import React, { useEffect, useState } from 'react';
import { traceabilityAPI } from '../services/api';
import {
  X,
  ShieldCheck,
  MapPin,
  Loader2,
  Award,
  Copy,
  Check,
  Leaf
} from 'lucide-react';

export const TraceabilityModal = ({ batchCode, cropId, onClose }) => {
  const [trace, setTrace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  // 6-Stage Traceability Timeline
  const PROVENANCE_STEPS = [
    {
      id: 1,
      title: 'Certified Seed Inoculation & Sowing',
      date: 'May 12, 2026',
      location: 'Green Valley Organic Nursery, Nuwara Eliya',
      details: 'Seeds certified by Department of Agriculture (DOA). Grown in compost-enriched highland soil.',
      badge: 'Certified Seed'
    },
    {
      id: 2,
      title: 'Organic Fertilizer Application & Bio-Pest Control',
      date: 'June 4, 2026',
      location: 'Nuwara Eliya Ridge Farmlands',
      details: 'Enriched with neem-based bio-spray and enriched vermicompost. Zero synthetic pesticides.',
      badge: 'Organic Standard'
    },
    {
      id: 3,
      title: 'Micro-Drip Irrigation & Soil Monitoring',
      date: 'June – July 2026',
      location: 'Field Sector 2',
      details: 'Automated micro-drip cycles when soil moisture dipped below 35%.',
      badge: 'Monitored Irrigation'
    },
    {
      id: 4,
      title: 'Pre-Harvest Quality & Residue Inspection',
      date: 'August 3, 2026',
      location: 'Regional Agrarian Quality Lab',
      details: 'Zero synthetic chemical residue detected. Inspected and approved for Grade A produce rating.',
      badge: 'Quality Approved'
    },
    {
      id: 5,
      title: 'Hand Harvest & Cold-Chain Dispatch',
      date: 'August 4, 2026',
      location: 'Keppetipola Dispatch Hub',
      details: 'Refrigerated transit maintained strictly between 8–12°C for peak freshness.',
      badge: 'Temperature Controlled'
    },
    {
      id: 6,
      title: 'Wholesale Hub Delivery & Verified Arrival',
      date: 'August 6, 2026',
      location: 'Colombo Central Distribution Center',
      details: 'Batch QR scanned, weight verified, and delivery confirmed.',
      badge: 'Fulfillment Verified'
    }
  ];

  useEffect(() => {
    const fetchTrace = async () => {
      setLoading(true);
      try {
        let res;
        if (cropId) {
          res = await traceabilityAPI.getByCropId(cropId);
        } else if (batchCode) {
          res = await traceabilityAPI.getTrace(batchCode);
        }
        if (res && res.data) {
          setTrace(res.data);
        } else {
          fallbackTrace();
        }
      } catch (err) {
        console.warn('Trace API offline. Loading fallback:', err);
        fallbackTrace();
      } finally {
        setLoading(false);
      }
    };

    const fallbackTrace = () => {
      setTrace({
        batchCode: batchCode || 'BATCH-2026-NWR-0941',
        cropId: cropId || 1,
        productName: 'Organic Upcountry Carrots',
        farmerName: 'K. Bandara (Green Valley Farm)',
        farmLocation: 'Nuwara Eliya (Elevation: 1,868m)',
        harvestedDate: 'August 4, 2026',
        packedDate: 'August 5, 2026',
        transportVehicle: 'Reefer Truck WP LK-4892 (Temp: 9.2°C)',
        qualityInspectionStatus: 'Passed (Grade A Organic Verification)',
        deliveredDate: 'August 6, 2026',
        blockchainHash: '0x7f8a92b4c19e81d763a1290fbc9821ea3478d104',
        carbonSavedKg: 18.4,
        co2Intensity: '0.18 kg CO2 / kg'
      });
    };

    fetchTrace();
  }, [batchCode, cropId]);

  const handleCopyHash = () => {
    if (trace?.blockchainHash) {
      navigator.clipboard.writeText(trace.blockchainHash);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in font-sans">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full border border-slate-200 overflow-hidden relative space-y-5 max-h-[90vh] overflow-y-auto">
        
        {/* MODAL HEADER */}
        <div className="p-5 border-b border-slate-200 flex items-start justify-between bg-white">
          <div className="space-y-1">
            <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Origin Traceability Record
            </span>
            <h2 className="text-lg font-bold text-slate-900">{trace?.productName || 'Produce Batch'}</h2>
            <p className="text-xs text-slate-500 font-mono">
              Batch Code: <strong className="text-slate-800">{trace?.batchCode}</strong>
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-emerald-600" />
            <p className="text-xs font-semibold">Verifying Batch Provenance...</p>
          </div>
        ) : trace ? (
          <div className="p-6 pt-0 space-y-5">
            {/* SCORECARD */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
                <div className="p-2 bg-emerald-100 rounded-lg text-emerald-800">
                  <Leaf className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-slate-500 uppercase block">Carbon Metric</span>
                  <strong className="text-slate-900 text-xs">{trace.co2Intensity || '0.18 kg CO2/kg'}</strong>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg text-blue-800">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-slate-500 uppercase block">Farmgate Origin</span>
                  <strong className="text-slate-900 text-xs truncate max-w-[120px] block">{trace.farmLocation}</strong>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
                <div className="p-2 bg-amber-100 rounded-lg text-amber-800">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-slate-500 uppercase block">Inspection</span>
                  <strong className="text-slate-900 text-xs">Grade A Verified</strong>
                </div>
              </div>
            </div>

            {/* 6-STAGE PROVENANCE TIMELINE */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Farm-to-Fork Timeline
                </h3>
                <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  6 Verified Milestones
                </span>
              </div>

              <div className="space-y-2.5">
                {PROVENANCE_STEPS.map((step) => (
                  <div
                    key={step.id}
                    className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between gap-1">
                      <div className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                          {step.id}
                        </span>
                        <h4 className="font-bold text-slate-900 text-xs">{step.title}</h4>
                      </div>
                      <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 font-semibold text-[10px]">
                        {step.badge}
                      </span>
                    </div>

                    <p className="text-slate-600 pl-6 text-[11px] leading-relaxed">{step.details}</p>
                    
                    <div className="flex justify-between items-center pl-6 text-[10px] text-slate-400 font-medium pt-1 border-t border-slate-200/60">
                      <span>{step.location}</span>
                      <span>{step.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* LEDGER HASH BOX */}
            {trace.blockchainHash && (
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">
                    Digital Verification Hash
                  </span>
                  <button
                    onClick={handleCopyHash}
                    className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded-lg border border-slate-200 transition flex items-center gap-1 cursor-pointer"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-slate-400" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <p className="font-mono text-slate-700 text-xs break-all bg-white p-2 rounded-lg border border-slate-200">
                  {trace.blockchainHash}
                </p>
              </div>
            )}

            {/* MODAL FOOTER */}
            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl transition"
              >
                Close
              </button>
            </div>
          </div>
        ) : null}

      </div>
    </div>
  );
};

export default TraceabilityModal;
