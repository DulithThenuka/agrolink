import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, ShieldAlert, Loader2, CheckCircle2, FileText, Info } from 'lucide-react';

const PRESET_DISPUTE_REASONS = [
  { id: 'DAMAGED_PRODUCE', label: '🥀 Damaged or Spoiled Produce', description: 'Crops arrived rotten, bruised, or damaged during transport' },
  { id: 'WEIGHT_SHORTAGE', label: '⚖️ Weight / Quantity Discrepancy', description: 'Actual delivered weight is less than the agreed amount' },
  { id: 'QUALITY_MISMATCH', label: '🏷️ Quality / Grade Mismatch', description: 'Grade or freshness does not match the published listing' },
  { id: 'DELIVERY_DELAY', label: '⏱️ Severe Delivery Delay', description: 'Excessive dispatch or transit delay causing commercial loss' },
  { id: 'WRONG_ITEM', label: '📦 Wrong Crop / Variety Delivered', description: 'Received a completely different crop type or batch' },
  { id: 'OTHER', label: '❓ Other Operational Issue', description: 'Other issue requiring AgroLink administrative investigation' },
];

export const DisputeModal = ({ order, onClose, onSubmitDispute }) => {
  const [selectedReasonId, setSelectedReasonId] = useState(PRESET_DISPUTE_REASONS[0].id);
  const [customDetails, setCustomDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const selectedPreset = PRESET_DISPUTE_REASONS.find((r) => r.id === selectedReasonId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!order) return;

    const finalReason = customDetails.trim()
      ? `${selectedPreset?.label.replace(/^[^\s]+ /, '')}: ${customDetails.trim()}`
      : selectedPreset?.label.replace(/^[^\s]+ /, '') || 'Dispute raised by buyer.';

    setSubmitting(true);
    setErrorMsg('');
    try {
      await onSubmitDispute(order.id, finalReason);
    } catch (err) {
      setErrorMsg(err?.response?.data?.message || err?.message || 'Failed to file dispute. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', duration: 0.35, bounce: 0.1 }}
          className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10"
        >
          {/* Header */}
          <div className="p-6 bg-gradient-to-r from-amber-500 to-amber-600 text-white flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-inner">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold font-display">Raise Escrow Dispute</h3>
                <p className="text-amber-100 text-xs font-medium">Order #{order?.id} • {order?.cropName || 'Crop Harvest'}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {errorMsg && (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Escrow Protection Notice */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1.5">
              <div className="flex items-center gap-2 font-black text-amber-800 uppercase tracking-wider text-[11px]">
                <Info className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Immediate Escrow Vault Lock</span>
              </div>
              <p className="text-amber-800 leading-relaxed font-medium">
                Filing this dispute will <strong>freeze the Escrow release</strong> to the farmer. Funds remain secure in the AgroLink Vault until an official administrator resolves the dispute with both parties.
              </p>
            </div>

            {/* Reason Categories */}
            <div className="space-y-2">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 font-display">
                Select Dispute Category <span className="text-amber-600">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {PRESET_DISPUTE_REASONS.map((preset) => {
                  const isSelected = selectedReasonId === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setSelectedReasonId(preset.id)}
                      className={`p-3 rounded-2xl border text-left text-xs transition flex flex-col justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-amber-500/10 border-amber-500 text-amber-950 font-bold ring-2 ring-amber-500/20 shadow-sm'
                          : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold'
                      }`}
                    >
                      <span className="font-extrabold text-[13px]">{preset.label}</span>
                      <span className="text-[11px] text-slate-500 mt-1 font-normal leading-snug">
                        {preset.description}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Additional Details Textarea */}
            <div className="space-y-2">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 font-display">
                Dispute Evidence & Details
              </label>
              <textarea
                rows={3}
                value={customDetails}
                onChange={(e) => setCustomDetails(e.target.value)}
                placeholder="Describe the issue in detail (e.g. photos available, measured weight shortfall, packaging condition)..."
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 text-xs font-medium text-slate-800 placeholder:text-slate-400"
              />
            </div>

            {/* Order Summary Recap */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Locked Escrow Value:</span>
              <span className="font-extrabold text-slate-900 text-sm">
                Rs. {Number(order?.totalPrice || 0).toLocaleString()}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-amber-500/20 transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Freezing Escrow...</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4" />
                    <span>File Official Dispute</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
