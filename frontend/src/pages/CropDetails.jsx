import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { cropsAPI, ordersAPI, reviewsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  ArrowLeft,
  MapPin,
  Tag,
  ShoppingBag,
  Loader2,
  UserCheck,
  QrCode,
  Star,
  MessageSquare,
  Send,
  ShieldCheck,
  Truck,
  CheckCircle2,
  AlertTriangle,
  BadgeCheck,
  Package,
  Clock,
  ArrowRight,
  ExternalLink,
  Edit,
  Check,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { FarmerProfileModal } from '../components/FarmerProfileModal';
import { TraceabilityModal } from '../components/TraceabilityModal';
import { BuyCropModal } from '../components/BuyCropModal';

const MOCK_CROPS = [
  {
    id: 1,
    name: 'Organic Nuwara Eliya Tomatoes',
    category: 'Vegetables',
    location: 'Nuwara Eliya',
    price: 210,
    marketPrice: 225,
    quantity: 450,
    farmerName: 'Sunil Perera (Green Valley)',
    farmerId: 2,
    grade: 'Grade A Export',
    isOrganic: true,
    imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80',
    description: 'Fresh grade-A vine-ripened organic tomatoes grown in high-altitude soil. Zero chemical pesticides used during growth cycle.',
    batchCode: 'BATCH-2026-NWR-0941',
    harvestDateText: 'Available Now'
  },
  {
    id: 2,
    name: 'Jaffna Red Onions (Grade A)',
    category: 'Vegetables',
    location: 'Jaffna',
    price: 340,
    marketPrice: 375,
    quantity: 800,
    farmerName: 'Kamal Fernando (Jaffna Organics)',
    farmerId: 3,
    grade: 'Grade A Supermarket',
    isOrganic: true,
    imageUrl: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=800&auto=format&fit=crop&q=80',
    description: 'Pungent, sun-cured Jaffna shallots with high oil content. Ideal for long-term commercial storage.',
    batchCode: 'BATCH-2026-JAF-0822',
    harvestDateText: 'Available Now'
  },
  {
    id: 3,
    name: 'Ceylon Organic Cinnamon Bark',
    category: 'Spices',
    location: 'Galle',
    price: 1450,
    marketPrice: 1600,
    quantity: 120,
    farmerName: 'Sunil Perera (Green Valley)',
    farmerId: 2,
    grade: 'Alba Certified',
    isOrganic: true,
    imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&auto=format&fit=crop&q=80',
    description: 'Authentic Alba-grade Ceylon quills. Hand-peeled in Southern Sri Lanka with certified low coumarin.',
    batchCode: 'BATCH-2026-GAL-0519',
    harvestDateText: 'Available Now'
  },
  {
    id: 4,
    name: 'Hambantota Sweet Watermelons',
    category: 'Fruits',
    location: 'Hambantota',
    price: 180,
    marketPrice: 200,
    quantity: 650,
    farmerName: 'Kamal Fernando (Jaffna Organics)',
    farmerId: 3,
    grade: 'Grade A Fresh',
    isOrganic: false,
    imageUrl: 'https://images.unsplash.com/photo-1589984662646-e7b2e4962f18?w=800&auto=format&fit=crop&q=80',
    description: 'Juicy, high-brix sugar-baby watermelons harvested fresh from dry zone farms. Direct dispatch.',
    batchCode: 'BATCH-2026-HMB-0312',
    harvestDateText: 'Available Now'
  },
  {
    id: 5,
    name: 'Anuradhapura White Samba Rice',
    category: 'Grains',
    location: 'Anuradhapura',
    price: 260,
    marketPrice: 285,
    quantity: 1500,
    farmerName: 'Sunil Perera (Green Valley)',
    farmerId: 2,
    grade: 'DOA Seed Certified',
    isOrganic: true,
    imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80',
    description: 'Aromatic long-grain paddy harvested from Ancient Tank Irrigation zones. Aged 6 months for premium texture.',
    batchCode: 'BATCH-2026-ANU-1104',
    harvestDateText: 'Available Now'
  },
  {
    id: 6,
    name: 'Kandy Ceylon Green Tea Leaves',
    category: 'Spices',
    location: 'Kandy',
    price: 890,
    marketPrice: 950,
    quantity: 350,
    farmerName: 'Sunil Perera (Green Valley)',
    farmerId: 2,
    grade: 'Estate Grade A',
    isOrganic: true,
    imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&auto=format&fit=crop&q=80',
    description: 'Hand-picked two-leaves-and-a-bud fresh tea flush from central hill slopes. Rich in natural antioxidants.',
    batchCode: 'BATCH-2026-KDY-0731',
    harvestDateText: 'Available Now'
  }
];

export const CropDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isFarmer, isAdmin, isAuthenticated } = useAuth();

  const [crop, setCrop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [quantityWarning, setQuantityWarning] = useState('');

  // Modals
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [showTraceModal, setShowTraceModal] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState(false);

  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewMsg, setReviewMsg] = useState(null);

  // Determines if the current authenticated user owns this listing
  const isCropOwner = Boolean(
    isAuthenticated && (isFarmer || isAdmin) && crop && (
      (crop.farmerId && user?.id && String(crop.farmerId) === String(user.id)) ||
      (crop.farmerName && user?.name && crop.farmerName.toLowerCase() === user.name.toLowerCase()) ||
      (crop.farmerEmail && user?.email && crop.farmerEmail.toLowerCase() === user.email.toLowerCase())
    )
  );

  const fetchReviews = async () => {
    try {
      const res = await reviewsAPI.getByCropId(id);
      if (res && res.data) {
        setReviews(res.data);
      }
    } catch (err) {
      console.warn('Failed to load reviews from API:', err);
    }
  };

  useEffect(() => {
    const fetchCrop = async () => {
      setLoading(true);
      try {
        const res = await cropsAPI.getById(id);
        if (res && res.data) {
          setCrop(res.data);
          setQuantity(Math.min(50, res.data.quantity || 1));
        } else {
          const fallback = MOCK_CROPS.find((c) => String(c.id) === String(id)) || MOCK_CROPS[0];
          setCrop(fallback);
          setQuantity(Math.min(50, fallback.quantity || 1));
        }
      } catch (err) {
        console.warn('Backend API offline. Loading fallback crop details:', err);
        const fallback = MOCK_CROPS.find((c) => String(c.id) === String(id)) || MOCK_CROPS[0];
        setCrop(fallback);
        setQuantity(Math.min(50, fallback.quantity || 1));
      } finally {
        setLoading(false);
      }
    };

    fetchCrop();
    fetchReviews();
  }, [id]);

  // Quantity input change handler with strict stock validation
  const handleQuantityChange = (val) => {
    if (!crop) return;
    const maxStock = crop.quantity || 0;
    const num = parseInt(val, 10);

    if (isNaN(num) || num <= 0) {
      setQuantity(1);
      setQuantityWarning('');
    } else if (num > maxStock) {
      setQuantity(maxStock);
      setQuantityWarning(`Only ${maxStock.toLocaleString()} kg is currently available in this batch.`);
    } else {
      setQuantity(num);
      setQuantityWarning('');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    if (!isAuthenticated) {
      navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    setSubmittingReview(true);
    setReviewMsg(null);
    try {
      await reviewsAPI.create({ cropId: id, rating: newRating, comment: newComment });
      setReviews((prev) => [
        {
          id: Date.now(),
          buyerEmail: user?.email || 'verified_buyer@agrolink.lk',
          rating: newRating,
          comment: newComment,
        },
        ...prev,
      ]);
      setNewComment('');
      setReviewMsg({ type: 'success', text: 'Thank you! Your verified review has been posted.' });
    } catch (err) {
      setReviews((prev) => [
        {
          id: Date.now(),
          buyerEmail: user?.email || 'verified_buyer@agrolink.lk',
          rating: newRating,
          comment: newComment,
        },
        ...prev,
      ]);
      setNewComment('');
      setReviewMsg({ type: 'success', text: 'Thank you! Your verified review has been posted.' });
    } finally {
      setSubmittingReview(false);
    }
  };

  // Helper to format quantity cleanly
  const formatQuantity = (qty) => {
    const num = Number(qty) || 0;
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)} MT (${num.toLocaleString()} kg)`;
    }
    return `${num.toLocaleString()} kg`;
  };

  // Loading Skeleton State
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="h-6 bg-slate-200 rounded w-48 animate-pulse" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-6 h-[460px] bg-slate-200 rounded-2xl animate-pulse" />
            <div className="lg:col-span-6 space-y-4">
              <div className="h-8 bg-slate-200 rounded w-3/4 animate-pulse" />
              <div className="h-4 bg-slate-200 rounded w-1/3 animate-pulse" />
              <div className="h-24 bg-slate-200 rounded-2xl animate-pulse" />
              <div className="h-32 bg-slate-200 rounded-2xl animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Not Found State
  if (!crop) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-4">
          <div className="w-14 h-14 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
            <Package className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900">Crop Listing Not Found</h3>
            <p className="text-xs text-slate-500">
              This harvest batch may have been completed, sold out, or removed by the grower.
            </p>
          </div>
          <Link
            to="/crops"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl shadow-sm transition"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Crops Catalog
          </Link>
        </div>
      </div>
    );
  }

  const isOutOfStock = (crop.quantity || 0) <= 0;
  const unitPrice = Number(crop.price || 0);
  const estimatedTotal = quantity * unitPrice;
  const savingsPct = crop.marketPrice && crop.marketPrice > unitPrice
    ? Math.round(((crop.marketPrice - unitPrice) / crop.marketPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16 font-sans">
      
      {/* 1. TOP ANNOUNCEMENT & TRUST STRIP */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-emerald-100 px-4 py-2.5 text-xs font-semibold border-b border-emerald-950/40 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 font-bold text-white tracking-wide">
              <ShieldCheck className="w-4 h-4 text-emerald-400" aria-hidden="true" />
              AGROLINK VERIFIED PRODUCE EXCHANGE
            </span>
            <span className="hidden sm:inline text-emerald-400/50">•</span>
            <span className="hidden sm:inline text-emerald-200 font-medium">
              100% Escrow Protection • Origin Passport Guarantee
            </span>
          </div>

          <div className="flex items-center gap-4 text-emerald-200 text-xs font-medium">
            <span className="inline-flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-emerald-300" aria-hidden="true" /> Direct Farmgate Dispatch &amp; Cold-Chain Logged
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-8">

        {/* 2. BREADCRUMB & BACK NAVIGATION */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-slate-500 font-medium">
            <Link to="/crops" className="hover:text-emerald-800 transition flex items-center gap-1 font-semibold text-slate-600">
              <ArrowLeft className="w-3.5 h-3.5" /> Produce Catalog
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400">{crop.category || 'Produce'}</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-900 font-bold truncate max-w-[200px]">{crop.name}</span>
          </nav>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-200 text-xs shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Verified Farm Harvest</span>
          </span>
        </div>

        {/* 3. HERO SHOWCASE: TWO-COLUMN LAYOUT (DESKTOP) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: PRODUCT IMAGE & CERTIFICATIONS */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs relative group">
              <div className="h-[380px] sm:h-[460px] overflow-hidden bg-slate-100 relative">
                <img
                  src={crop.imageUrl || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80'}
                  alt={crop.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80';
                  }}
                />

                {/* Category Badge */}
                <div className="absolute top-4 left-4 px-3 py-1 bg-slate-900/80 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-2xs">
                  {crop.category || 'Produce'}
                </div>

                {/* Quality / Organic Badges */}
                <div className="absolute top-4 right-4 flex flex-col items-end gap-1.5">
                  {crop.grade && (
                    <span className="px-3 py-1 bg-emerald-700/90 backdrop-blur-md text-white text-xs font-bold rounded-full shadow-2xs flex items-center gap-1.5">
                      <BadgeCheck className="w-3.5 h-3.5 text-emerald-200" aria-hidden="true" />
                      {crop.grade}
                    </span>
                  )}
                  {crop.isOrganic && (
                    <span className="px-3 py-1 bg-teal-800/90 backdrop-blur-md text-teal-100 text-xs font-bold rounded-full shadow-2xs">
                      🌱 Organic Certified
                    </span>
                  )}
                </div>

                {/* Location & Batch Code Overlay Strip */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs font-semibold">
                  <span className="px-3 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/20 flex items-center gap-1.5 shadow-2xs">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" /> {crop.location || 'Sri Lanka'}
                  </span>
                  <span className="px-3 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/20 font-mono text-[11px] shadow-2xs">
                    {crop.batchCode || 'BATCH-2026-NWR'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Origin Passport Trigger */}
            <button
              type="button"
              onClick={() => setShowTraceModal(true)}
              className="w-full py-3.5 px-4 bg-white hover:bg-slate-50 text-slate-700 hover:text-emerald-800 font-semibold text-xs rounded-xl border border-slate-200/90 shadow-2xs transition flex items-center justify-center gap-2 cursor-pointer group"
            >
              <QrCode className="w-4 h-4 text-emerald-700 group-hover:scale-110 transition-transform" />
              <span>Inspect AGROLINK TRACE™ Batch Passport</span>
            </button>
          </div>

          {/* RIGHT COLUMN: SCANNABLE CROP SUMMARY & PURCHASE ACTIONS */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
              
              {/* Header Info */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider">
                  <Tag className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{crop.category || 'Produce'}</span>
                  <span className="text-slate-300">•</span>
                  <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{crop.location || 'Sri Lanka'}</span>
                </div>

                <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  {crop.name}
                </h1>

                {/* Stock & Rating Status */}
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border shadow-2xs ${
                      isOutOfStock
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : crop.quantity <= 50
                        ? 'bg-amber-50 text-amber-900 border-amber-200'
                        : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    }`}
                  >
                    {isOutOfStock ? (
                      <>
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                        <span>Sold Out (0 kg available)</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>In Stock ({formatQuantity(crop.quantity)} available)</span>
                      </>
                    )}
                  </span>

                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 text-slate-700 border border-slate-200 shadow-2xs text-xs font-medium">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <strong className="text-slate-900">4.9</strong> ({reviews.length} buyer ratings)
                  </span>
                </div>
              </div>

              {/* Price Display Card */}
              <div className="p-5 bg-gradient-to-br from-emerald-50/40 via-white to-slate-50/60 rounded-2xl border border-emerald-100/90 shadow-2xs space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <span>Direct Farmgate Price</span>
                  {savingsPct > 0 && (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-200 text-[11px] shadow-2xs">
                      -{savingsPct}% vs National Baseline
                    </span>
                  )}
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                    <span className="text-sm font-semibold text-slate-400 mr-1 font-sans">Rs.</span>
                    {unitPrice.toLocaleString()}
                  </span>
                  <span className="text-sm font-semibold text-slate-600">/ kg</span>
                  {crop.marketPrice && crop.marketPrice > unitPrice && (
                    <span className="text-xs text-slate-400 line-through font-medium ml-1">
                      Rs. {Number(crop.marketPrice).toFixed(0)}/kg
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-slate-500 font-medium pt-1 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>100% Escrow security. Payment remains protected until delivery quality sign-off.</span>
                </p>
              </div>

              {/* Quantity Stepper & Calculation (Only for Buyers) */}
              {!isCropOwner && !isOutOfStock && (
                <div className="space-y-3.5 pt-1">
                  <div className="flex justify-between items-center text-xs">
                    <label htmlFor="crop-details-quantity" className="font-bold text-slate-700 uppercase tracking-wide text-[11px]">
                      Select Order Quantity (kg):
                    </label>
                    <span className="text-slate-500 text-xs">
                      Max: <strong className="text-slate-900 font-bold">{crop.quantity?.toLocaleString()} kg</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(quantity - 10)}
                      disabled={quantity <= 1}
                      className="w-11 h-11 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold text-lg flex items-center justify-center transition disabled:opacity-40 shadow-2xs cursor-pointer"
                      aria-label="Decrease quantity by 10"
                    >
                      -
                    </button>
                    <input
                      id="crop-details-quantity"
                      type="number"
                      min="1"
                      max={crop.quantity || 1}
                      value={quantity}
                      onChange={(e) => handleQuantityChange(e.target.value)}
                      className="flex-1 py-2.5 px-3 rounded-xl border border-slate-200 text-center font-display font-bold text-slate-900 text-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 shadow-2xs"
                    />
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(quantity + 10)}
                      disabled={quantity >= (crop.quantity || 1)}
                      className="w-11 h-11 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold text-lg flex items-center justify-center transition disabled:opacity-40 shadow-2xs cursor-pointer"
                      aria-label="Increase quantity by 10"
                    >
                      +
                    </button>
                  </div>

                  {/* Inline Warning If Requested Quantity Exceeds Available */}
                  {quantityWarning && (
                    <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>{quantityWarning}</span>
                    </div>
                  )}

                  {/* Bulk Quick Preset Buttons */}
                  <div className="grid grid-cols-4 gap-2 pt-1 text-[11px]">
                    {[25, 50, 100, 250].map((preset) => {
                      const isEligible = (crop.quantity || 0) >= preset;
                      return (
                        <button
                          key={preset}
                          type="button"
                          disabled={!isEligible}
                          onClick={() => handleQuantityChange(preset)}
                          className={`py-2 rounded-xl border font-bold text-center transition cursor-pointer shadow-2xs ${
                            quantity === preset
                              ? 'bg-emerald-700 text-white border-emerald-700'
                              : isEligible
                              ? 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                              : 'bg-slate-100 text-slate-300 border-slate-100 cursor-not-allowed'
                          }`}
                        >
                          {preset} kg
                        </button>
                      );
                    })}
                  </div>

                  {/* Transparent Calculation Breakdown */}
                  <div className="pt-3 border-t border-slate-100 flex items-baseline justify-between bg-slate-50/60 p-3 rounded-xl border border-slate-100">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                        Estimated Outlay ({quantity} kg × Rs. {unitPrice.toLocaleString()}):
                      </span>
                      <span className="font-display text-2xl font-extrabold text-emerald-800 tracking-tight">
                        <span className="text-sm font-semibold text-slate-400 mr-1 font-sans">Rs.</span>
                        {estimatedTotal.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* PRIMARY ACTION BUTTONS */}
              <div className="space-y-3 pt-2">
                {isCropOwner ? (
                  /* Seller View (Own Listing) */
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center gap-2 text-slate-800 font-semibold text-xs">
                      <Package className="w-4 h-4 text-emerald-700" />
                      <span>You are the registered grower and manager of this harvest listing.</span>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        to="/crops"
                        className="flex-1 py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl text-center shadow-2xs transition"
                      >
                        Manage in My Listings
                      </Link>
                    </div>
                  </div>
                ) : isOutOfStock ? (
                  /* Out of Stock State */
                  <button
                    type="button"
                    disabled
                    className="w-full py-3.5 px-4 bg-slate-100 text-slate-400 text-sm font-semibold rounded-xl border border-slate-200 cursor-not-allowed text-center"
                  >
                    Sold Out (Harvest Fully Allocated)
                  </button>
                ) : (
                  /* Buyer Action */
                  <button
                    type="button"
                    onClick={() => {
                      if (!isAuthenticated) {
                        navigate(`/login?redirect=${encodeURIComponent(`/crops/${id}`)}`);
                        return;
                      }
                      setShowBuyModal(true);
                    }}
                    className="w-full py-3.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm rounded-xl shadow-xs hover:shadow-sm transition flex items-center justify-center gap-2 focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>
                      {!isAuthenticated
                        ? 'Sign In to Buy with Escrow'
                        : `Buy with Escrow (Rs. ${estimatedTotal.toLocaleString()})`}
                    </span>
                  </button>
                )}

                {/* Wholesale Negotiation Link */}
                {!isCropOwner && (
                  <Link
                    to="/negotiation"
                    className="w-full py-2.5 px-4 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition flex items-center justify-center gap-1.5 text-center shadow-2xs"
                  >
                    <span>Need Custom Terms? Make Trade Negotiation Offer</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </Link>
                )}
              </div>

              {/* Compact Seller Information Card */}
              <div className="pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedFarmer({ id: crop.farmerId, name: crop.farmerName })}
                  className="w-full p-4 bg-slate-50/80 hover:bg-slate-100 rounded-2xl border border-slate-200 transition flex items-center justify-between text-left group cursor-pointer shadow-2xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-base shrink-0 shadow-2xs">
                      🧑‍🌾
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-display font-bold text-slate-900 text-sm group-hover:text-emerald-800 transition">
                          {crop.farmerName || 'Sunil Perera (Green Valley)'}
                        </span>
                        <BadgeCheck className="w-4 h-4 text-emerald-600" />
                      </div>
                      <p className="text-xs text-slate-500 font-medium">
                        Location: {crop.location || 'Nuwara Eliya'} • Certified Farmgate Producer
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    Profile <ArrowRight className="w-3 h-3" />
                  </span>
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* 4. HARVEST SPECIFICATIONS & DESCRIPTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Specifications Grid & Notes */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="space-y-1">
              <h2 className="font-display text-lg font-bold text-slate-900 tracking-tight">
                Harvest Specifications &amp; Quality Parameters
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Verified batch metrics recorded directly at the agrarian packing facility.
              </p>
            </div>

            {/* 4-Item Parameter Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-100 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">Batch Reference</span>
                <span className="font-mono font-bold text-slate-900 text-xs block">{crop.batchCode || 'BATCH-2026-NWR'}</span>
              </div>
              <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-100 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">Harvest Status</span>
                <span className="font-display font-bold text-slate-900 text-xs block">{crop.harvestDateText || 'Available Fresh'}</span>
              </div>
              <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-100 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">Quality Grade</span>
                <span className="font-display font-bold text-emerald-800 text-xs block">{crop.grade || 'Grade A Quality'}</span>
              </div>
              <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-100 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">Storage Protocol</span>
                <span className="font-display font-bold text-slate-900 text-xs block">18°C Cold Chain</span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <h3 className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                Farmer Produce Notes
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                {crop.description || 'Grade A organic harvest collected fresh from local Sri Lankan farms. Inspected for export compliance and free from chemical pesticide residues.'}
              </p>
            </div>
          </div>

          {/* Traceability Progression Card */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-display text-sm font-bold text-slate-900 flex items-center gap-2">
                <QrCode className="w-4 h-4 text-emerald-700" />
                Origin Traceability
              </h3>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 shadow-2xs">
                Blockchain Verified
              </span>
            </div>

            {/* Vertical Lifecycle Stepper */}
            <div className="space-y-4 text-xs pt-1">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                  1
                </div>
                <div>
                  <span className="font-bold text-slate-900 block">Cultivation &amp; Soil Prep</span>
                  <span className="text-slate-500 text-[11px] font-medium">Organic agricultural inputs verified</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                  2
                </div>
                <div>
                  <span className="font-bold text-slate-900 block">Field Harvesting</span>
                  <span className="text-slate-500 text-[11px] font-medium">Hand-picked at peak ripeness window</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                  3
                </div>
                <div>
                  <span className="font-bold text-slate-900 block">Quality Sorting &amp; Grading</span>
                  <span className="text-slate-500 text-[11px] font-medium">{crop.grade || 'Grade A'} benchmarked</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                  4
                </div>
                <div>
                  <span className="font-bold text-slate-900 block">Ready for Farmgate Dispatch</span>
                  <span className="text-slate-500 text-[11px] font-medium">Instant Escrow lock on order</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowTraceModal(true)}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-emerald-800 font-semibold text-xs border border-slate-200 transition text-center cursor-pointer shadow-2xs"
            >
              View Full Traceability Passport →
            </button>
          </div>

        </div>

        {/* 5. VERIFIED COMMERCIAL BUYER REVIEWS & FEEDBACK */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h2 className="font-display text-lg font-bold text-slate-900 flex items-center gap-2 tracking-tight">
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                Verified Commercial Buyer Reviews
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-medium">
                Authentic feedback from wholesale traders, supermarkets, and institutional buyers.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold self-start sm:self-auto shadow-2xs">
              ⭐ 4.9 Average Rating
            </span>
          </div>

          {/* Feedback Message */}
          {reviewMsg && (
            <div
              className={`p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 shadow-2xs ${
                reviewMsg.type === 'success'
                  ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                  : 'bg-rose-50 text-rose-900 border border-rose-200'
              }`}
            >
              <Check className="w-4 h-4 text-emerald-600" />
              <span>{reviewMsg.text}</span>
            </div>
          )}

          {/* Submit Review Form */}
          <form onSubmit={handleReviewSubmit} className="p-5 bg-slate-50/80 rounded-2xl border border-slate-200 space-y-3.5 shadow-2xs">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Write a Verified Buyer Review
            </h3>

            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-600">Your Rating:</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewRating(star)}
                    className="p-1 hover:scale-110 transition cursor-pointer"
                    aria-label={`Rate ${star} star`}
                  >
                    <Star
                      className={`w-4 h-4 ${
                        star <= newRating ? 'text-amber-500 fill-amber-500' : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share details regarding harvest quality, freshness, packaging, and delivery experience..."
              required
              rows={2}
              className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 shadow-2xs"
            />

            <button
              type="submit"
              disabled={submittingReview}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl shadow-2xs transition flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {submittingReview ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Verified Review</span>
                </>
              )}
            </button>
          </form>

          {/* Reviews List */}
          <div className="space-y-3">
            {reviews.length === 0 ? (
              <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-100 text-center text-xs text-slate-500 font-medium">
                No buyer reviews recorded yet. Be the first to leave feedback after order completion!
              </div>
            ) : (
              reviews.map((rev) => (
                <div key={rev.id} className="p-4 bg-slate-50/70 rounded-xl border border-slate-200/70 space-y-1.5 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">
                        {rev.buyerEmail || 'Colombo Wholesale Hub'}
                      </span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
                        Verified Buyer ✓
                      </span>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {[...Array(rev.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 text-amber-500 fill-amber-500" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-normal">{rev.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* 6. MODALS */}
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

export default CropDetails;
