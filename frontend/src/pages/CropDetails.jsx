import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { cropsAPI, ordersAPI, reviewsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, MapPin, Tag, ShoppingBag, Loader2, UserCheck, QrCode, Star, MessageSquare, Send } from 'lucide-react';
import { FarmerProfileModal } from '../components/FarmerProfileModal';
import { TraceabilityModal } from '../components/TraceabilityModal';
import { BuyCropModal } from '../components/BuyCropModal';

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
  const [showBuyModal, setShowBuyModal] = useState(false);

  // Review state
  const [reviews, setReviews] = useState([]);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchReviews = async () => {
    try {
      const res = await reviewsAPI.getByCropId(id);
      if (res && res.data) {
        setReviews(res.data);
      }
    } catch (err) {
      console.error('Failed to load reviews:', err);
    }
  };

  const MOCK_CROPS = [
    {
      id: 1,
      name: 'Organic Nuwara Eliya Tomatoes',
      category: 'Vegetables',
      location: 'Nuwara Eliya',
      price: 210,
      quantity: 450,
      farmerName: 'Sunil Perera (Green Valley)',
      farmerId: 2,
      imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80',
      description: 'Fresh grade-A vine-ripened organic tomatoes grown in high-altitude soil. Zero chemical pesticides.',
      batchCode: 'BATCH-2026-NWR-0941'
    },
    {
      id: 2,
      name: 'Jaffna Red Onions (Grade A)',
      category: 'Vegetables',
      location: 'Jaffna',
      price: 340,
      quantity: 800,
      farmerName: 'Kamal Fernando (Jaffna Organics)',
      farmerId: 3,
      imageUrl: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=800&auto=format&fit=crop&q=80',
      description: 'Pungent, sun-cured Jaffna shallots with high oil content. Ideal for long-term commercial storage.',
      batchCode: 'BATCH-2026-JAF-0822'
    },
    {
      id: 3,
      name: 'Ceylon Organic Cinnamon Bark',
      category: 'Spices',
      location: 'Galle',
      price: 1450,
      quantity: 120,
      farmerName: 'Sunil Perera (Green Valley)',
      farmerId: 2,
      imageUrl: 'https://images.unsplash.com/photo-1509358271058-acd05cc93280?w=800&auto=format&fit=crop&q=80',
      description: 'Authentic Alba-grade Ceylon quills. Hand-peeled in Southern Sri Lanka with certified low coumarin.',
      batchCode: 'BATCH-2026-GAL-0519'
    },
    {
      id: 4,
      name: 'Hambantota Sweet Watermelons',
      category: 'Fruits',
      location: 'Hambantota',
      price: 180,
      quantity: 650,
      farmerName: 'Kamal Fernando (Jaffna Organics)',
      farmerId: 3,
      imageUrl: 'https://images.unsplash.com/photo-1589984662646-e7b2e4962f18?w=800&auto=format&fit=crop&q=80',
      description: 'Juicy, high-brix sugar-baby watermelons harvested fresh from dry zone farms. Direct dispatch.',
      batchCode: 'BATCH-2026-HMB-0312'
    },
    {
      id: 5,
      name: 'Anuradhapura White Samba Rice',
      category: 'Grains',
      location: 'Anuradhapura',
      price: 260,
      quantity: 1500,
      farmerName: 'Sunil Perera (Green Valley)',
      farmerId: 2,
      imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80',
      description: 'Aromatic long-grain paddy harvested from Ancient Tank Irrigation zones. Aged 6 months for premium texture.',
      batchCode: 'BATCH-2026-ANU-1104'
    },
    {
      id: 6,
      name: 'Kandy Ceylon Green Tea Leaves',
      category: 'Spices',
      location: 'Kandy',
      price: 890,
      quantity: 350,
      farmerName: 'Sunil Perera (Green Valley)',
      farmerId: 2,
      imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&auto=format&fit=crop&q=80',
      description: 'Hand-picked two-leaves-and-a-bud fresh tea flush from central hill slopes. Rich in natural antioxidants.',
      batchCode: 'BATCH-2026-KDY-0731'
    }
  ];

  useEffect(() => {
    const fetchCrop = async () => {
      try {
        const res = await cropsAPI.getById(id);
        if (res && res.data) {
          setCrop(res.data);
        } else {
          const fallback = MOCK_CROPS.find(c => String(c.id) === String(id)) || MOCK_CROPS[0];
          setCrop(fallback);
        }
      } catch (err) {
        console.warn('Backend API offline. Loading fallback crop details:', err);
        const fallback = MOCK_CROPS.find(c => String(c.id) === String(id)) || MOCK_CROPS[0];
        setCrop(fallback);
      } finally {
        setLoading(false);
      }
    };
    fetchCrop();
    fetchReviews();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setSubmittingReview(true);
    try {
      await reviewsAPI.create({ cropId: id, rating: newRating, comment: newComment });
      setNewComment('');
      fetchReviews();
      alert('Thank you! Your 5-star review has been posted.');
    } catch (err) {
      alert('Failed to submit review.');
    } finally {
      setSubmittingReview(false);
    }
  };

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
              <button
                type="button"
                onClick={() => setShowBuyModal(true)}
                disabled={crop.quantity <= 0}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-emerald-500/25 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" /> Calculate &amp; Place Bulk Order
              </button>
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

        {/* REVIEWS & RATINGS SECTION */}
        <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-md space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-lg font-extrabold text-slate-900 font-display flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
              Verified Customer Reviews &amp; Ratings
            </h3>
            <span className="text-xs font-bold text-slate-400">5.0 Star Producer Score</span>
          </div>

          {/* SUBMIT REVIEW FORM */}
          <form onSubmit={handleReviewSubmit} className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Leave a Verified Review</h4>
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-600">Rating:</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewRating(star)}
                    className="p-1 hover:scale-110 transition"
                  >
                    <Star className={`w-5 h-5 ${star <= newRating ? 'text-amber-500 fill-amber-500' : 'text-slate-300'}`} />
                  </button>
                ))}
              </div>
            </div>

            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share details about harvest freshness, packaging, and logistics experience..."
              required
              rows={2}
              className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-emerald-500"
            />

            <button
              type="submit"
              disabled={submittingReview}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5 disabled:opacity-50"
            >
              {submittingReview ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Send className="w-3.5 h-3.5" /> Submit Review</>}
            </button>
          </form>

          {/* REVIEW REVIEWS LIST */}
          <div className="space-y-3">
            {reviews.map((rev) => (
              <div key={rev.id} className="p-4 bg-slate-50/70 rounded-2xl border border-slate-100 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800">{rev.buyerEmail}</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">Verified Buyer</span>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-600 font-medium">{rev.comment}</p>
              </div>
            ))}
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

      {showBuyModal && (
        <BuyCropModal
          crop={crop}
          onClose={() => setShowBuyModal(false)}
        />
      )}
    </div>
  );
};
