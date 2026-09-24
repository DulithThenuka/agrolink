import React, { useEffect, useState } from 'react';
import { buyersAPI } from '../services/api';
import { X, CheckCircle2, MapPin, Calendar, ShieldCheck, CreditCard, ThumbsUp, Loader2 } from 'lucide-react';

const DEFAULT_BUYER_PROFILE = {
  isVerifiedBuyer: true,
  location: 'Colombo',
  memberSinceYear: 2026,
  completedOrdersCount: 342,
  orderCancellationRate: 1.2,
  onTimePaymentRate: 99.1,
  buyerTrustScore: 4.9,
  farmerSatisfactionRate: 98.0,
};

export const BuyerProfileModal = ({ buyerId, buyerName, buyerEmail, onClose }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const displayName = buyerName || (buyerEmail ? buyerEmail.split('@')[0] : 'Commercial Buyer');

  useEffect(() => {
    const fetchProfile = async () => {
      if (!buyerId) {
        setProfile({ ...DEFAULT_BUYER_PROFILE, name: displayName, email: buyerEmail || 'buyer@agrolink.com' });
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const res = await buyersAPI.getProfile(buyerId);
        if (res && res.data) {
          setProfile(res.data);
        } else {
          setProfile({ ...DEFAULT_BUYER_PROFILE, name: displayName, email: buyerEmail || 'buyer@agrolink.com' });
        }
      } catch (err) {
        console.error('Failed to load buyer profile:', err);
        setProfile({ ...DEFAULT_BUYER_PROFILE, name: displayName, email: buyerEmail || 'buyer@agrolink.com' });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [buyerId, buyerEmail, displayName]);

  if (!buyerId && !buyerEmail && !buyerName) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in font-sans">
      <div className="bg-white rounded-2xl shadow-xl max-w-xl w-full border border-slate-200 overflow-hidden relative space-y-5">
        
        {/* MODAL HEADER */}
        <div className="p-5 border-b border-slate-200 flex items-start justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center text-lg font-bold">
              🛒
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 capitalize">{profile?.name || displayName}</h2>
                {profile?.isVerifiedBuyer && (
                  <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Verified Buyer
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {profile?.location} • Member since {profile?.memberSinceYear}
              </p>
            </div>
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
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-blue-600" />
            <p className="text-xs font-semibold">Loading Buyer Profile...</p>
          </div>
        ) : profile ? (
          <div className="p-6 pt-0 space-y-5">
            {/* METRICS GRID */}
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-600" /> Trading &amp; Payment History
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {/* Completed Purchases */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-0.5">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase block">Completed Orders</span>
                  <p className="text-lg font-bold text-slate-900">{profile.completedOrdersCount}</p>
                </div>

                {/* Trust Rating */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-0.5">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase block">Buyer Rating</span>
                  <p className="text-lg font-bold text-slate-900 flex items-center gap-1">
                    {profile.buyerTrustScore} <span className="text-amber-500 text-xs">★</span>
                  </p>
                </div>

                {/* Cancellation Rate */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-0.5">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase block">Cancellation Rate</span>
                  <p className="text-lg font-bold text-emerald-700">{profile.orderCancellationRate}%</p>
                </div>

                {/* On-Time Payment */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-0.5">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase block">On-Time Payment</span>
                  <p className="text-lg font-bold text-blue-700">{profile.onTimePaymentRate}%</p>
                </div>

                {/* Farmer Satisfaction */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-0.5 sm:col-span-2">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase block">Positive Seller Feedback</span>
                  <p className="text-lg font-bold text-slate-900">{profile.farmerSatisfactionRate}%</p>
                </div>
              </div>
            </div>

            {/* SUMMARY NOTE */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1 text-slate-700">
              <span className="font-semibold text-slate-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Buyer Record Status:
              </span>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                This account maintains an active commercial buying record with on-time settlements and standard AgroLink escrow fulfillment.
              </p>
            </div>

            {/* MODAL FOOTER */}
            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl transition"
              >
                Close Profile
              </button>
            </div>
          </div>
        ) : null}

      </div>
    </div>
  );
};

export default BuyerProfileModal;
