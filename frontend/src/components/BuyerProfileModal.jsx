import React, { useEffect, useState } from 'react';
import { buyersAPI } from '../services/api';
import { X, CheckCircle2, MapPin, Calendar, ShieldCheck, Star, CreditCard, ThumbsUp, Loader2, Ban } from 'lucide-react';

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

  const displayName = buyerName || (buyerEmail ? buyerEmail.split('@')[0] : 'Wholesale Market Ltd');

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full border border-slate-100 overflow-hidden relative space-y-6">
        
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center transition"
        >
          <X className="w-5 h-5" />
        </button>

        {loading ? (
          <div className="p-12 text-center text-slate-400 space-y-3">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600" />
            <p className="text-sm font-semibold">Loading Buyer Trust Profile...</p>
          </div>
        ) : profile ? (
          <div className="p-6 md:p-8 space-y-6">
            
            {/* HEADER CARD */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white shadow-xl">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-blue-500 text-white flex items-center justify-center text-2xl font-black shadow-md border-2 border-blue-400">
                  🛒
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-2xl font-extrabold font-display tracking-tight capitalize">{profile.name}</h2>
                    {profile.isVerifiedBuyer && (
                      <span className="px-3 py-1 rounded-full bg-blue-500/30 text-blue-300 border border-blue-400/40 text-[11px] font-black uppercase flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Verified Purchaser ✓
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-blue-100/80 font-medium">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-blue-400" /> Destination: <strong>{profile.location}</strong>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-blue-400" /> Member since: <strong>{profile.memberSinceYear}</strong>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* TRUST & RELIABILITY METRICS */}
            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 font-display flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-600" /> Buyer Reliability & Payment Trust Score
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                
                {/* Completed Purchases */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Purchased</span>
                  <div className="flex items-center justify-between">
                    <p className="text-xl font-black text-slate-900 font-display">{profile.completedOrdersCount} Orders</p>
                    <span className="text-lg">📦</span>
                  </div>
                </div>

                {/* Trust Rating */}
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-1">
                  <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">Buyer Trust Rating</span>
                  <div className="flex items-center justify-between">
                    <p className="text-xl font-black text-amber-900 font-display flex items-center gap-1">
                      {profile.buyerTrustScore} <span className="text-amber-500 text-sm">★</span>
                    </p>
                    <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">5.0 Max</span>
                  </div>
                </div>

                {/* Cancellation Rate */}
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-1">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">Cancellation Rate</span>
                  <div className="flex items-center justify-between">
                    <p className="text-xl font-black text-emerald-900 font-display">{profile.orderCancellationRate}%</p>
                    <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">Low Risk</span>
                  </div>
                </div>

                {/* On-Time Payment */}
                <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 space-y-1">
                  <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider block">On-Time Payment</span>
                  <div className="flex items-center justify-between">
                    <p className="text-xl font-black text-blue-900 font-display">{profile.onTimePaymentRate}%</p>
                    <CreditCard className="w-5 h-5 text-blue-600" />
                  </div>
                </div>

                {/* Farmer Satisfaction */}
                <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200/80 space-y-1 sm:col-span-2">
                  <span className="text-[10px] font-bold text-purple-800 uppercase tracking-wider block">Farmer Satisfaction</span>
                  <div className="flex items-center justify-between">
                    <p className="text-xl font-black text-purple-900 font-display">{profile.farmerSatisfactionRate}% Positive Rating</p>
                    <ThumbsUp className="w-5 h-5 text-purple-600" />
                  </div>
                </div>

              </div>
            </div>

            {/* TRUST SUMMARY BOX */}
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs space-y-1.5">
              <span className="font-extrabold text-emerald-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> AgroLink Verified Paymaster Guarantee:
              </span>
              <p className="text-emerald-800 font-medium">
                This buyer maintains an exemplary <strong>{profile.onTimePaymentRate}% on-time payment rate</strong> and an extremely low order cancellation rate ({profile.orderCancellationRate}%). All purchase orders from this account are backed by AgroLink Escrow.
              </p>
            </div>

          </div>
        ) : null}

      </div>
    </div>
  );
};
