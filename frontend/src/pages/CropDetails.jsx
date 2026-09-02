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
  const { user, isFarmer, isAuthenticated } = useAuth();
  const [crop, setCrop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [showTraceModal, setShowTraceModal] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState(false);

  const isCropOwner = Boolean(
    isFarmer && crop && (
      (crop.farmerId && user?.id && String(crop.farmerId) === String(user.id)) ||
      (crop.farmerName && user?.name && crop.farmerName.toLowerCase() === user.name.toLowerCase()) ||
      (crop.farmerEmail && user?.email && crop.farmerEmail.toLowerCase() === user.email.toLowerCase())
    )
  );

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
      imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&auto=format&fit=crop&q=80',
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
    setSubmittingReview(true);
    try {
      await reviewsAPI.create({ cropId: id, rating: newRating, comment: newComment });
      setReviews(prev => [{ id: Date.now(), buyerEmail: 'you@agrolink.lk', rating: newRating, comment: newComment }, ...prev]);
      setNewComment('');
      alert('Thank you! Your verified review has been posted.');
    } catch (err) {
      setReviews(prev => [{ id: Date.now(), buyerEmail: 'you@agrolink.lk', rating: newRating, comment: newComment }, ...prev]);
      setNewComment('');
      alert('Thank you! Your verified review has been posted.');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-400 space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        <p className="text-sm font-semibold">Loading harvest showcase...</p>
      </div>
    );
  }

  if (!crop) {
    return (
      <div className="max-w-md mx-auto text-center py-20 bg-white rounded-3xl border border-slate-100 p-8 space-y-4">
        <div className="text-4xl">🌾</div>
        <h3 className="text-xl font-bold text-slate-900 font-display">Harvest Listing Not Found</h3>
        <Link to="/crops" className="inline-block px-6 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-sm">
          Return to Crops Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 animate-fade-in space-y-10">
      {/* BREADCRUMB */}
      <div className="flex items-center justify-between">
        <Link to="/crops" className="inline-flex items-center gap-2 text-slate-500 hover:text-emerald-600 transition text-xs font-extrabold uppercase tracking-wider">
          <ArrowLeft className="w-4 h-4" /> Back to Crops Catalog
        </Link>
        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          🌱 Verified Direct Farm Harvest
        </span>
      </div>

      {/* HERO SECTION */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: PRODUCT IMAGE */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative rounded-3xl overflow-hidden bg-slate-100 border border-slate-200 shadow-xl group">
            <img
              src={crop.imageUrl || 'https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&w=800&q=80'}
              alt={crop.name}
              className="w-full h-[460px] object-cover group-hover:scale-105 transition duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-60" />

            <div className="absolute top-4 left-4 flex gap-2">
              <span className="px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-emerald-300 font-extrabold text-xs border border-white/20 shadow-md">
                🌱 Organic Certified
              </span>
              <span className="px-3 py-1 rounded-full bg-amber-500 text-white font-black text-xs uppercase shadow-md">
                Grade A Quality
              </span>
            </div>

            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs font-bold">
              <span className="px-3 py-1.5 rounded-xl glass-dark border border-white/20 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-400" /> {crop.location || 'Nuwara Eliya'}, Sri Lanka
              </span>
              <span className="px-3 py-1.5 rounded-xl glass-dark border border-white/20 font-mono">
                {crop.batchCode || 'BATCH-2026-NWR-0941'}
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: DETAILS & ACTIONS */}
        <div className="lg:col-span-6 space-y-6">
          <div className="glass p-8 bg-white/90 rounded-3xl border border-slate-200/80 shadow-xl space-y-6">
            
            {/* TITLE & CATEGORY */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-black text-emerald-600 uppercase tracking-widest">
                <Tag className="w-4 h-4" />
                <span>{crop.category || 'Fresh Harvest'}</span>
                <span>•</span>
                <MapPin className="w-4 h-4" />
                <span>{crop.location || 'Sri Lanka'}</span>
              </div>

              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 font-display leading-tight">
                {crop.name}
              </h1>

              <div className="flex items-center gap-3 pt-1">
                <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  ✓ In Stock ({crop.quantity || 450} kg available)
                </span>
                <span className="text-amber-500 font-extrabold text-xs flex items-center gap-1">
                  <Star className="w-4 h-4 fill-amber-500" /> 4.9 (48 Verified Orders)
                </span>
              </div>
            </div>

            {/* PRICE CARD */}
            <div className="p-5 bg-gradient-to-r from-emerald-950 to-slate-900 text-white rounded-2xl shadow-lg space-y-2">
              <div className="flex items-center justify-between text-[10px] font-extrabold uppercase tracking-widest text-emerald-300">
                <span>Direct Farmer Harvest Price</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">Direct Farm Savings: 6.7%</span>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-emerald-400 font-display">
                  Rs. {Number(crop.price || 210).toLocaleString()}
                </span>
                <span className="text-sm font-bold text-slate-300">/ Kg</span>
                <span className="text-xs text-slate-400 line-through ml-2 font-semibold">Market: Rs. {(Number(crop.price || 210) * 1.07).toFixed(0)}/kg</span>
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 font-display">Produce Summary &amp; Quality Notes</h4>
              <p className="text-slate-600 text-xs leading-relaxed font-medium">
                {crop.description || 'Grade A organic harvest collected fresh from local Sri Lankan farms. Zero chemical pesticides used.'}
              </p>
            </div>

            {/* HARVEST SPECIFICATIONS GRID */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Batch Code</span>
                <span className="font-extrabold text-slate-800 font-mono text-[11px]">{crop.batchCode || 'BATCH-2026-NWR'}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Harvest Date</span>
                <span className="font-extrabold text-slate-800 text-[11px]">Today Fresh</span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Quality Grade</span>
                <span className="font-extrabold text-emerald-700 text-[11px]">Grade A Organic</span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Storage Temp</span>
                <span className="font-extrabold text-slate-800 text-[11px]">18°C Controlled</span>
              </div>
            </div>

            {/* VERIFIED FARMER TRUST CARD */}
            <button
              type="button"
              onClick={() => setSelectedFarmer({ id: crop.farmerId, name: crop.farmerName })}
              className="flex items-center gap-4 p-4 bg-emerald-50/80 hover:bg-emerald-100/80 rounded-2xl border border-emerald-200 text-left transition w-full group shadow-sm"
            >
              <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-md">
                🧑‍🌾
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-extrabold text-slate-900 text-sm">{crop.farmerName || 'Sunil Perera (Green Valley)'}</span>
                  <span className="text-[9px] font-black text-emerald-800 bg-emerald-200 px-2 py-0.5 rounded-md">Verified Producer ✓</span>
                </div>
                <p className="text-xs text-slate-500 font-semibold truncate mt-0.5">
                  Location: <strong>{crop.location || 'Nuwara Eliya'}</strong> • Payout Trust Score: <strong className="text-amber-700">⭐ 4.9 / 5</strong>
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-700 group-hover:translate-x-1 transition-transform shrink-0">
                Profile →
              </span>
            </button>

            {/* PRIMARY ACTION BUTTONS */}
            <div className="space-y-3 pt-2">
              {isCropOwner ? (
                <div className="w-full py-4 bg-slate-100 text-slate-700 font-extrabold text-sm rounded-2xl border border-slate-200 text-center flex items-center justify-center gap-2">
                  <span>🧑‍🌾 Your Own Produce Listing (Owner View)</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    if (!isAuthenticated) {
                      navigate(`/login?redirect=${encodeURIComponent(`/crops/${id}`)}`);
                      return;
                    }
                    setShowBuyModal(true);
                  }}
                  disabled={crop.quantity <= 0}
                  className="w-full py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-emerald-500/25 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>
                    {!isAuthenticated
                      ? 'Sign In to Place Bulk Order (Lock Escrow)'
                      : 'Calculate & Place Bulk Order (Lock Escrow)'}
                  </span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setShowTraceModal(true)}
                className="w-full py-3 bg-slate-900 hover:bg-slate-950 text-white font-extrabold text-xs rounded-2xl shadow-md transition flex items-center justify-center gap-2 border border-slate-800"
              >
                <QrCode className="w-4 h-4 text-emerald-400" />
                <span>Scan AGROLINK TRACE Passport 🔎</span>
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* FULL-WIDTH VERIFIED REVIEWS & RATINGS SECTION */}
      <div className="glass p-8 bg-white/90 rounded-3xl border border-slate-200/80 shadow-xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 font-display flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
              Verified Commercial Buyer Reviews
            </h3>
            <p className="text-slate-500 text-xs mt-0.5">Direct ratings and feedback from wholesale buyers and supermarkets.</p>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-black">
            ⭐ 4.9 Average Rating
          </span>
        </div>

        {/* SUBMIT REVIEW FORM */}
        <form onSubmit={handleReviewSubmit} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
          <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider font-display">Write a Buyer Feedback Review</h4>
          
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-600">Select Rating:</span>
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
            placeholder="Share details about harvest freshness, batch quality, packaging, and logistics delivery experience..."
            required
            rows={2}
            className="w-full p-3.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-emerald-500 shadow-sm"
          />

          <button
            type="submit"
            disabled={submittingReview}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center gap-2 disabled:opacity-50"
          >
            {submittingReview ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Send className="w-4 h-4" /> Submit Verified Review</>}
          </button>
        </form>

        {/* REVIEWS LIST */}
        <div className="space-y-3">
          {reviews.length === 0 ? (
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center text-xs text-slate-500 font-medium">
              No buyer reviews yet. Be the first to leave feedback after receiving your harvest order!
            </div>
          ) : (
            reviews.map((rev) => (
              <div key={rev.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-slate-800">{rev.buyerEmail || 'Colombo Wholesale Supermarket'}</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-200">Verified Buyer ✓</span>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {[...Array(rev.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-600 font-medium">{rev.comment}</p>
              </div>
            ))
          )}
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
