import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Printer,
  ShieldCheck,
  Award,
  QrCode,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Building2,
  FileText,
  Download
} from 'lucide-react';

export const DiseaseCertificateModal = ({ isOpen, onClose, data, sample, fieldAcres = 2.0 }) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const certNumber = `DOA-PATH-${Math.floor(100000 + Math.random() * 900000)}-LK`;
  const issueDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 print:m-0 print:border-none print:shadow-none"
        >
          {/* TOP ACTION BAR (Hidden in print) */}
          <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white print:hidden">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span className="text-sm font-extrabold font-display">DOA Official Pathology Certificate</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / Save PDF</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* OFFICIAL CERTIFICATE BODY */}
          <div className="p-8 sm:p-10 space-y-6 text-slate-800 font-sans">
            {/* GOVT / DOA HEADER */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b-2 border-emerald-700 pb-6 text-center sm:text-left">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-black text-3xl flex items-center justify-center shrink-0">
                  🏛️
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-800 block">
                    Democratic Socialist Republic of Sri Lanka
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-display">
                    Department of Agriculture (DOA)
                  </h2>
                  <p className="text-xs text-slate-500 font-semibold">
                    National Plant Protection &amp; Agro-Pathology Diagnostic Service
                  </p>
                </div>
              </div>

              <div className="text-right sm:text-right shrink-0">
                <span className="text-[10px] font-mono font-bold text-slate-400 block">CERTIFICATE ID</span>
                <span className="text-xs font-mono font-black text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  {certNumber}
                </span>
                <span className="text-[10px] font-medium text-slate-400 block mt-1">Issued: {issueDate}</span>
              </div>
            </div>

            {/* DIAGNOSTIC VERDICT SUMMARY */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <div>
                <span className="text-[10px] font-extrabold uppercase text-slate-400">Target Specimen:</span>
                <p className="text-sm font-black text-slate-900">{sample.crop} Foliage</p>
                <p className="text-xs text-slate-500">{fieldAcres} Acres Coverage</p>
              </div>

              <div>
                <span className="text-[10px] font-extrabold uppercase text-slate-400">Pathogen Classification:</span>
                <p className="text-sm font-black text-rose-700">{sample.disease}</p>
                <p className="text-xs text-slate-500 font-mono italic">{sample.scientific}</p>
              </div>

              <div>
                <span className="text-[10px] font-extrabold uppercase text-slate-400">AI Model SLA Match:</span>
                <p className="text-sm font-black text-emerald-700">{sample.confidence}% SLA Confidence</p>
                <p className="text-xs text-emerald-600 font-bold">Grade: {sample.severity}</p>
              </div>
            </div>

            {/* PRESCRIBED FORMULATION TABLE */}
            <div className="space-y-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">
                DOA Approved Chemical / Bio-Organic Prescription:
              </h4>
              <div className="border border-slate-200 rounded-2xl overflow-hidden text-xs">
                <table className="w-full text-left divide-y divide-slate-200">
                  <thead className="bg-emerald-50/80 font-bold text-emerald-900 text-[11px]">
                    <tr>
                      <th className="p-3">Prescribed Compound</th>
                      <th className="p-3">Knapsack Dilution</th>
                      <th className="p-3">Spray Timing</th>
                      <th className="p-3">Mandatory PHI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    <tr>
                      <td className="p-3 font-bold text-slate-900">{sample.activeRemedy}</td>
                      <td className="p-3">{sample.dosage}</td>
                      <td className="p-3">{sample.sprayTiming}</td>
                      <td className="p-3 font-bold text-emerald-700">{sample.phiDays} Days</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* TREATMENT PROTOCOL CHECKLIST */}
            <div className="space-y-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">
                Mandatory Field Action Directives:
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-medium text-slate-700">
                {sample.treatmentSteps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* VERIFICATION QR & DIGITAL SIGNATURE */}
            <div className="pt-4 border-t-2 border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white border border-slate-200 rounded-xl p-1 flex items-center justify-center shadow-xs">
                  <QrCode className="w-12 h-12 text-slate-800" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-slate-400">Tamper-Proof Verification</span>
                  <p className="text-xs font-mono font-bold text-slate-700">SHA-256: 8f4a...92b1</p>
                  <p className="text-[10px] text-emerald-700 font-bold">Scan to verify at agrolink.gov.lk/verify</p>
                </div>
              </div>

              <div className="text-center sm:text-right space-y-1">
                <div className="font-serif italic font-bold text-slate-900 text-sm">
                  Dr. K. L. Perera, Ph.D.
                </div>
                <div className="text-[10px] text-slate-500 font-medium">
                  Director of Plant Pathology &amp; Agronomy
                </div>
                <div className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" /> DOA Digital Seal Authenticated
                </div>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
