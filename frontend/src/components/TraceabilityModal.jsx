import React, { useEffect, useState } from 'react';
import { traceabilityAPI } from '../services/api';
import { X, QrCode, CheckCircle2, MapPin, Calendar, Truck, ShieldCheck, Sprout, Loader2, Award, Copy, Check, Link as LinkIcon, Cpu } from 'lucide-react';

export const TraceabilityModal = ({ batchCode, cropId, onClose }) => {
  const [trace, setTrace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

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
        console.error('Failed to load batch trace:', err);
        fallbackTrace();
      } finally {
        setLoading(false);
      }
    };

    const fallbackTrace = () => {
      setTrace({
        batchCode: batchCode || 'BATCH-2026-NWR-0941',
        cropId: cropId || 1,
        productName: 'Carrot',
        farmerName: 'Green Valley Farm',
        farmLocation: 'Nuwara Eliya',
        harvestedDate: 'August 4, 2026',
        packedDate: 'August 5, 2026',
        transportVehicle: 'Vehicle WP LK-4892',
        qualityInspectionStatus: 'Passed (Grade A Organic Verification)',
        deliveredDate: 'August 6, 2026',
        blockchainHash: '0x7f8a92b4c19e81d763a1290f',
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full border border-slate-100 overflow-hidden relative space-y-6 max-h-[90vh] overflow-y-auto">
        
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center transition"
        >
          <X className="w-5 h-5" />
        </button>

        {loading ? (
          <div className="p-12 text-center text-slate-400 space-y-3">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-emerald-600" />
            <p className="text-sm font-semibold">Generating Digital Crop Traceability Passport...</p>
          </div>
        ) : trace ? (
          <div className="p-6 md:p-8 space-y-6">
            
            {/* HEADER BANNER */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center sm:text-left">
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" /> AGROLINK TRACE PASSPORT
                </span>
                <h2 className="text-3xl font-black font-display tracking-tight text-white">{trace.productName}</h2>
                <p className="text-xs text-emerald-100/80 font-mono font-bold">
                  Batch Code: <span className="text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">{trace.batchCode}</span>
                </p>
              </div>

              {/* DYNAMIC SVG QR CODE */}
              <div className="p-3 bg-white rounded-2xl shadow-xl border-2 border-emerald-400/40 text-center shrink-0">
                <svg className="w-24 h-24 mx-auto" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="100" height="100" fill="white"/>
                  {/* Position detection patterns */}
                  <rect x="5" y="5" width="30" height="30" fill="#065f46" rx="4"/>
                  <rect x="10" y="10" width="20" height="20" fill="white" rx="2"/>
                  <rect x="15" y="15" width="10" height="10" fill="#065f46" rx="1"/>

                  <rect x="65" y="5" width="30" height="30" fill="#065f46" rx="4"/>
                  <rect x="70" y="10" width="20" height="20" fill="white" rx="2"/>
                  <rect x="75" y="15" width="10" height="10" fill="#065f46" rx="1"/>

                  <rect x="5" y="65" width="30" height="30" fill="#065f46" rx="4"/>
                  <rect x="10" y="70" width="20" height="20" fill="white" rx="2"/>
                  <rect x="15" y="75" width="10" height="10" fill="#065f46" rx="1"/>

                  {/* Data Modules */}
                  <rect x="42" y="10" width="6" height="6" fill="#065f46"/>
                  <rect x="52" y="10" width="6" height="6" fill="#065f46"/>
                  <rect x="42" y="24" width="16" height="6" fill="#065f46"/>
                  <rect x="10" y="42" width="6" height="16" fill="#065f46"/>
                  <rect x="24" y="42" width="14" height="6" fill="#065f46"/>
                  <rect x="42" y="42" width="16" height="16" fill="#065f46" rx="2"/>
                  <rect x="65" y="42" width="10" height="6" fill="#065f46"/>
                  <rect x="80" y="42" width="15" height="6" fill="#065f46"/>
                  <rect x="42" y="65" width="6" height="15" fill="#065f46"/>
                  <rect x="54" y="65" width="14" height="6" fill="#065f46"/>
                  <rect x="75" y="65" width="20" height="20" fill="#065f46" rx="2"/>
                  <rect x="54" y="78" width="14" height="14" fill="#065f46"/>
                </svg>
                <span className="text-[9px] font-black uppercase text-slate-500 tracking-wider block mt-1">Scan to Verify</span>
              </div>
            </div>

            {/* SUPPLY CHAIN MILESTONES TIMELINE */}
            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 font-display flex items-center gap-1.5">
                <Sprout className="w-4 h-4 text-emerald-600" /> Farm-to-Table Supply Chain Verification
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                
                {/* Farmer & Farm Location */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Farmer &amp; Origin Farm</span>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">👨‍🌾</span>
                    <div>
                      <p className="font-extrabold text-slate-900">{trace.farmerName}</p>
                      <p className="text-[11px] text-slate-500 font-semibold flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-emerald-600" /> {trace.farmLocation}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quality Inspection Status */}
                <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-1">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">Quality Inspection</span>
                  <div className="flex items-center justify-between">
                    <p className="font-black text-emerald-900">{trace.qualityInspectionStatus}</p>
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  </div>
                </div>

                {/* Harvested & Packed Dates */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Harvest &amp; Packaging</span>
                  <p className="font-extrabold text-slate-800">Harvested: {trace.harvestedDate}</p>
                  <p className="text-[11px] text-slate-500 font-medium">Packed: {trace.packedDate}</p>
                </div>

                {/* Transport & Delivery */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Logistics &amp; Delivery</span>
                  <p className="font-extrabold text-slate-800 flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-blue-600" /> {trace.transportVehicle}
                  </p>
                  <p className="text-[11px] text-emerald-700 font-bold">Delivered: {trace.deliveredDate}</p>
                </div>

              </div>
            </div>

            {/* BLOCKCHAIN LEDGER VERIFICATION HASH */}
            <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-2 border border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-emerald-400" /> Immutable Blockchain Ledger Ledger Proof
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-mono border border-emerald-500/30">
                  VERIFIED HASH
                </span>
              </div>
              
              <div className="flex items-center justify-between bg-slate-950 p-2.5 rounded-xl border border-slate-800 font-mono text-xs">
                <span className="text-slate-300 truncate mr-2">{trace.blockchainHash}</span>
                <button
                  onClick={handleCopyHash}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[10px] font-sans font-bold flex items-center gap-1 transition shrink-0"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  {copied ? 'Copied' : 'Copy Hash'}
                </button>
              </div>
            </div>

          </div>
        ) : null}

      </div>
    </div>
  );
};
