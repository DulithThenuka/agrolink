import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, ShieldAlert, Loader2, Info } from 'lucide-react';

const PRESET_DISPUTE_REASONS = [
  { id: 'DAMAGED_PRODUCE', label: 'Damaged or Spoiled Produce', description: 'Crops arrived rotten, bruised, or damaged during transport' },
  { id: 'WEIGHT_SHORTAGE', label: 'Weight / Quantity Discrepancy', description: 'Actual delivered weight is less than the agreed amount' },
  { id: 'QUALITY_MISMATCH', label: 'Quality / Grade Mismatch', description: 'Grade or freshness does not match the published listing' },
  { id: 'DELIVERY_DELAY', label: 'Severe Delivery Delay', description: 'Excessive dispatch or transit delay causing commercial loss' },
  { id: 'WRONG_ITEM', label: 'Wrong Crop / Variety Delivered', description: 'Received a completely different crop type or batch' },
  { id: 'OTHER', label: 'Other Operational Issue', description: 'Issue requiring AgroLink administrative investigation' },
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
      ? `${selectedPreset?.label}: ${customDetails.trim()}`
      : selectedPreset?.label || 'Dispute raised by buyer.';

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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto font-sans">
        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          className="relative w-full max-w-xl bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden my-auto"
        >
          {/* Header */}
          <div className="p-5 border-b border-slate-200 flex justify-between items-start bg-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">File Order Dispute</h3>
                <p className="text-slate-500 text-xs">Order #{order?.id} &bull; {order?.cropName || 'Produce Order'}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Escrow Notice */}
            <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-amber-800 text-xs">
                <Info className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Escrow Hold Notice</span>
              </div>
              <p className="text-amber-800 text-[11px] leading-relaxed">
                Filing this dispute holds the payment payout pending review by AgroLink dispute administrators and both parties.
              </p>
            </div>

            {/* Reason Categories */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                Dispute Reason <span className="text-amber-600">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {PRESET_DISPUTE_REASONS.map((preset) => {
                  const isSelected = selectedReasonId === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setSelectedReasonId(preset.id)}
                      className={`p-3 rounded-xl border text-left text-xs transition flex flex-col justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-amber-50 border-amber-400 text-amber-950 font-bold ring-1 ring-amber-400'
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700 font-medium'
                      }`}
                    >
                      <span className="font-bold text-xs">{preset.label}</span>
                      <span className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                        {preset.description}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Additional Details */}
            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                Observation &amp; Evidence Details
              </label>
              <textarea
                rows={3}
                value={customDetails}
                onChange={(e) => setCustomDetails(e.target.value)}
                placeholder="Describe weight difference, condition of crops, or delivery delay details..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 text-xs text-slate-800 placeholder:text-slate-400"
              />
            </div>

            {/* Order Value Recap */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-500">Order Amount Under Review:</span>
              <span className="font-bold text-slate-900">
                Rs. {Number(order?.totalPrice || 0).toLocaleString()}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Submitting Dispute...</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Submit Dispute</span>
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

export default DisputeModal;
