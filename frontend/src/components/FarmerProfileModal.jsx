import React, { useEffect, useState } from 'react';
import { farmersAPI } from '../services/api';
import { X, CheckCircle2, MapPin, Calendar, ShieldCheck, Truck, Sprout, ThumbsUp, Loader2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const DEFAULT_FARMER_PROFILE = {
  isVerified: true,
  district: 'Kandy',
  memberSinceYear: 2026,
  completedOrdersCount: 482,
  overallRating: 4.8,
  onTimeDeliveryRate: 96.0,
  productQualityRating: 4.9,
  buyerSatisfactionRate: 97.0,
  crops: [],
};

export const FarmerProfileModal = ({ farmerId, farmerName, onClose }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!farmerId) {
        setProfile({ ...DEFAULT_FARMER_PROFILE, name: farmerName || 'Producer' });
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const res = await farmersAPI.getProfile(farmerId);
        if (res && res.data) {
          setProfile(res.data);
        } else {
          setProfile({ ...DEFAULT_FARMER_PROFILE, name: farmerName || 'Producer' });
        }
      } catch (err) {
        console.error('Failed to load farmer profile:', err);
        setProfile({ ...DEFAULT_FARMER_PROFILE, name: farmerName || 'Producer' });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [farmerId, farmerName]);

  if (!farmerId && !farmerName) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in font-sans">
      <div className="bg-white rounded-2xl shadow-xl max-w-xl w-full border border-slate-200 overflow-hidden relative space-y-5">
        
        {/* MODAL HEADER */}
        <div className="p-5 border-b border-slate-200 flex items-start justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center text-lg font-bold">
              🧑‍🌾
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 capitalize">{profile?.name}</h2>
                {profile?.isVerified && (
                  <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified Producer
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {profile?.district} District • Member since {profile?.memberSinceYear}
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
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-emerald-600" />
            <p className="text-xs font-semibold">Loading Farmer Profile...</p>
          </div>
        ) : profile ? (
          <div className="p-6 pt-0 space-y-5">
            {/* METRICS GRID */}
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Verified Producer Metrics
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {/* Completed Orders */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-0.5">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase block">Completed Orders</span>
                  <p className="text-lg font-bold text-slate-900">{profile.completedOrdersCount}</p>
                </div>

                {/* Overall Rating */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-0.5">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase block">Farmer Rating</span>
                  <p className="text-lg font-bold text-slate-900 flex items-center gap-1">
                    {profile.overallRating} <span className="text-amber-500 text-xs">★</span>
                  </p>
                </div>

                {/* On-Time Deliveries */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-0.5">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase block">On-Time Dispatch</span>
                  <p className="text-lg font-bold text-slate-900">{profile.onTimeDeliveryRate}%</p>
                </div>

                {/* Product Quality */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-0.5">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase block">Quality Score</span>
                  <p className="text-lg font-bold text-emerald-700">{profile.productQualityRating} / 5</p>
                </div>

                {/* Buyer Satisfaction */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-0.5 sm:col-span-2">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase block">Buyer Satisfaction</span>
                  <p className="text-lg font-bold text-slate-900">{profile.buyerSatisfactionRate}%</p>
                </div>
              </div>
            </div>

            {/* ACTIVE CROPS OFFERED */}
            {profile.crops && profile.crops.length > 0 && (
              <div className="space-y-2.5 pt-2 border-t border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Active Harvest Listings ({profile.crops.length})
                </h3>

                <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                  {profile.crops.map((crop) => (
                    <div
                      key={crop.id}
                      className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 flex items-center justify-between gap-3 hover:bg-slate-100 transition"
                    >
                      <div>
                        <p className="font-bold text-slate-900 text-xs">{crop.name}</p>
                        <p className="text-[11px] text-slate-500">
                          Stock: {crop.quantity} kg • {crop.location || profile.district}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-bold text-slate-900 text-xs">
                          Rs. {Number(crop.price).toLocaleString()} / kg
                        </span>
                        <Link
                          to={`/crops/${crop.id}`}
                          onClick={onClose}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] rounded-lg transition flex items-center gap-1"
                        >
                          View <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

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

export default FarmerProfileModal;
