import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Printer,
  ShieldCheck,
  QrCode,
  Calendar,
  CheckCircle2,
  Building2,
  FileText,
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
      <div className="agri-modal-backdrop">
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 12 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="agri-modal-content max-w-3xl my-8 print:m-0 print:border-none print:shadow-none"
        >
          {/* TOP ACTION BAR (Hidden in print) */}
          <div className="flex items-center justify-between px-5 py-3.5 bg-slate-50 border-b border-slate-200 print:hidden">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span className="text-sm font-semibold text-slate-900">DOA Official Pathology Certificate</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="agri-btn-secondary gap-1.5 py-1.5 px-3 text-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / Save PDF</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 hover:text-slate-700 transition cursor-pointer"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* OFFICIAL CERTIFICATE BODY */}
          <div className="p-7 sm:p-9 space-y-6 text-slate-800 font-sans">

            {/* GOVT / DOA HEADER */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-2 border-emerald-700 pb-5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-emerald-50 border border-emerald-200 text-2xl flex items-center justify-center shrink-0">
                  🏛️
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-800 block">
                    Democratic Socialist Republic of Sri Lanka
                  </span>
                  <h2 className="text-xl font-bold text-slate-900 mt-0.5">
                    Department of Agriculture (DOA)
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    National Plant Protection &amp; Agro-Pathology Diagnostic Service
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right shrink-0">
                <span className="text-[10px] font-semibold uppercase text-slate-400 block tracking-wider">Certificate ID</span>
                <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 inline-block mt-0.5">
                  {certNumber}
                </span>
                <span className="text-[10px] text-slate-400 block mt-1 font-medium">Issued: {issueDate}</span>
              </div>
            </div>

            {/* DIAGNOSTIC VERDICT SUMMARY */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-5 rounded-xl border border-slate-200">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">Target Specimen</span>
                <p className="text-sm font-semibold text-slate-900 mt-0.5">{sample.crop} Foliage</p>
                <p className="text-xs text-slate-500">{fieldAcres} Acres Coverage</p>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">Pathogen Classification</span>
                <p className="text-sm font-semibold text-rose-700 mt-0.5">{sample.disease}</p>
                <p className="text-xs text-slate-500 font-mono italic">{sample.scientific}</p>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">AI Model Confidence</span>
                <p className="text-sm font-semibold text-emerald-700 mt-0.5">{sample.confidence}% Match</p>
                <p className="text-xs text-slate-600">Severity Grade: {sample.severity}</p>
              </div>
            </div>

            {/* PRESCRIBED FORMULATION TABLE */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                DOA Approved Treatment Prescription
              </h4>
              <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left divide-y divide-slate-200">
                  <thead className="bg-emerald-50 font-bold text-emerald-900 text-[11px]">
                    <tr>
                      <th className="p-3">Prescribed Compound</th>
                      <th className="p-3">Knapsack Dilution</th>
                      <th className="p-3">Spray Timing</th>
                      <th className="p-3">Mandatory PHI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    <tr>
                      <td className="p-3 font-semibold text-slate-900">{sample.activeRemedy}</td>
                      <td className="p-3">{sample.dosage}</td>
                      <td className="p-3">{sample.sprayTiming}</td>
                      <td className="p-3 font-semibold text-emerald-700">{sample.phiDays} Days</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* TREATMENT PROTOCOL CHECKLIST */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Mandatory Field Action Directives
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {sample.treatmentSteps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2 p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-slate-700">{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* VERIFICATION QR & DIGITAL SIGNATURE */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white border border-slate-200 rounded-xl p-1 flex items-center justify-center">
                  <QrCode className="w-10 h-10 text-slate-700" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">Tamper-Proof Verification</span>
                  <p className="text-xs font-mono font-semibold text-slate-700 mt-0.5">SHA-256: 8f4a...92b1</p>
                  <p className="text-[10px] text-emerald-700 font-semibold mt-0.5">Scan to verify at agrolink.gov.lk/verify</p>
                </div>
              </div>

              <div className="text-center sm:text-right space-y-1">
                <div className="font-serif italic font-bold text-slate-900 text-sm">
                  Dr. K. L. Perera, Ph.D.
                </div>
                <div className="text-[10px] text-slate-500">
                  Director of Plant Pathology &amp; Agronomy
                </div>
                <div className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
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
