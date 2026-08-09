import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { cropsAPI, ordersAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, MapPin, Tag, ShoppingBag, Loader2, UserCheck, QrCode } from 'lucide-react';
import { FarmerProfileModal } from '../components/FarmerProfileModal';
import { TraceabilityModal } from '../components/TraceabilityModal';

export const CropDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isBuyer, isAuthenticated } = useAuth();
  const [crop, setCrop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [showTraceModal, setShowTraceModal] = useState(false);

  useEffect(() => {
    const fetchCrop = async () => {
      try {
        const res = await cropsAPI.getById(id);
        if (res && res.data) {
          setCrop(res.data);
        }
      } catch (err) {
        console.error('Failed to load crop:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCrop();
  }, [id]);

  const handleOrder = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setSubmitting(true);
    try {
      await ordersAPI.place({ cropId: crop.id, quantity });
      alert('Order placed successfully!');
      navigate('/orders');
    } catch (err) {
      alert(typeof err === 'string' ? err : 'Order placement failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-400 space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        <p className="text-sm font-semibold">Loading crop details...</p>
      </div>
    );
  }

  if (!crop) {
    return (
      <div className="max-w-md mx-auto text-center py-20 bg-white rounded-3xl border border-slate-100 p-8 space-y-4">
        <div className="text-4xl">🌾</div>
        <h3 className="text-xl font-bold text-slate-900 font-display">Crop Not Found</h3>
        <Link to="/crops" className="inline-block px-6 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-sm">
          Return to Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 animate-fade-in space-y-6">
      <Link to="/crops" className="inline-flex items-center gap-2 text-slate-500 hover:text-emerald-600 transition text-sm font-semibold">
        <ArrowLeft className="w-4 h-4" /> Back to browse
      </Link>

      <div className="grid md:grid-cols-2 gap-10">
        {/* IMAGE */}
        <div className="premium-card overflow-hidden bg-slate-100 border border-slate-100 p-0 flex items-center justify-center">
          <img
            src={crop.imageUrl || 'https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&w=800&q=80'}
            alt={crop.name}
            className="w-full h-[450px] object-cover"
          />
        </div>

        {/* DETAILS CARD */}
        <div className="premium-card p-8 bg-white border border-slate-100 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase tracking-widest">
              <Tag className="w-3.5 h-3.5" />
              <span>{crop.category || 'Harvest'}</span>
              <span>•</span>
              <MapPin className="w-3.5 h-3.5" />
              <span>{crop.location || 'Local Farm'}</span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 font-display">{crop.name}</h1>

            <div>
              {crop.quantity > 0 ? (
                <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                  In Stock ({crop.quantity} units available)
                </span>
              ) : (
                <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800">
                  Out of Stock
                </span>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100">
              <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Direct Price</div>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-4xl font-extrabold text-emerald-600 font-display">${crop.price}</span>
                <span className="text-sm text-slate-500 font-semibold">/ unit</span>
              </div>
            </div>

            {crop.description && (
              <div className="space-y-1 pt-2">
                <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Description</div>
                <p className="text-slate-600 text-sm leading-relaxed">{crop.description}</p>
              </div>
            )}

            {/* FARMER REPUTATION CARD TRIGGER */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setSelectedFarmer({ id: crop.farmerId, name: crop.farmerName })}
                className="flex items-center gap-3 p-3.5 bg-emerald-50/80 hover:bg-emerald-100/80 rounded-2xl border border-emerald-200 text-left transition w-full group"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-base shrink-0 shadow-sm">
                  👨‍🌾
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-extrabold text-slate-900 text-xs">{crop.farmerName || 'Nimal Perera'}</span>
                    <span className="text-[9px] font-black text-emerald-800 bg-emerald-200 px-1.5 py-0.5 rounded">Verified Farmer ✓</span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-semibold truncate mt-0.5">
                    District: <strong>{crop.location || 'Kandy'}</strong> • Reputation Rating: <strong className="text-amber-700">⭐ 4.8 / 5</strong>
                  </p>
                </div>
                <span className="text-[11px] font-bold text-emerald-700 group-hover:translate-x-0.5 transition-transform shrink-0">
                  View Profile ⭐
                </span>
              </button>

              {/* TRACEABILITY QR PASSPORT BUTTON */}
              <button
                type="button"
                onClick={() => setShowTraceModal(true)}
                className="w-full py-3 bg-emerald-950 hover:bg-slate-900 text-white font-extrabold text-xs rounded-2xl shadow-md transition flex items-center justify-center gap-2 border border-emerald-500/40"
              >
                <QrCode className="w-4 h-4 text-emerald-400" />
                <span>AGROLINK TRACE 🔎 Scan Batch QR Code</span>
              </button>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 space-y-4">
            {isBuyer && (
              <form onSubmit={handleOrder} className="flex gap-3 items-center">
                <div className="w-24">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Qty</label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    min="1"
                    max={crop.quantity}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-center font-bold focus:outline-none focus:border-emerald-500 text-sm"
                  />
                </div>

                <div className="flex-1 pt-4">
                  <button
                    type="submit"
                    disabled={crop.quantity <= 0 || submitting}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-200 transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><ShoppingBag className="w-4 h-4" /> Place Order</>}
                  </button>
                </div>
              </form>
            )}

            {!isAuthenticated && (
              <div className="text-center bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-1">
                <p className="text-xs text-slate-500 font-medium">To place an order directly with the farmer:</p>
                <Link to="/login" className="text-xs text-emerald-600 hover:underline font-bold">
                  Sign in to purchase →
                </Link>
              </div>
            )}

            <button
              onClick={() => setSelectedFarmer({ id: crop.farmerId, name: crop.farmerName })}
              className="w-full flex items-center gap-3.5 bg-slate-50 hover:bg-slate-100 p-4 rounded-2xl border border-slate-100 text-left transition"
            >
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
                👨‍🌾
              </div>
              <div className="flex-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Harvest Producer</div>
                <div className="text-sm font-bold text-slate-700">{crop.farmerName || 'Verified Local Grower'}</div>
              </div>
              <span className="text-xs font-bold text-emerald-600">View Rating ⭐</span>
            </button>
          </div>
        </div>
      </div>

      {selectedFarmer && (
        <FarmerProfileModal
          farmerId={selectedFarmer.id}
          farmerName={selectedFarmer.name}
          onClose={() => setSelectedFarmer(null)}
        />
      )}

      {showTraceModal && (
        <TraceabilityModal
          cropId={crop.id}
          batchCode={crop.batchCode}
          onClose={() => setShowTraceModal(false)}
        />
      )}
    </div>
  );
};
