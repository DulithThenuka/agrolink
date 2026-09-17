import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Check,
  X,
  Clock,
  AlertCircle,
  CheckCircle2,
  User,
  Building2,
  Package,
  DollarSign,
  MessageSquare,
  Send,
  Calendar,
  FileText,
  BadgeCheck,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Scale,
  RefreshCw,
  Info
} from 'lucide-react';
import { negotiationAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

// Standardized Backend Status Definitions
// Rendered using Text + Subtle Visual Indicator (icon + text, never color alone)
const STATUS_CONFIG = {
  'NEGOTIATING': {
    label: 'Pending Response',
    icon: Clock,
    badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
    dotClass: 'bg-amber-500'
  },
  'Pending': {
    label: 'Pending Response',
    icon: Clock,
    badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
    dotClass: 'bg-amber-500'
  },
  'Countered': {
    label: 'Counter Offer Active',
    icon: RefreshCw,
    badgeClass: 'bg-sky-50 text-sky-800 border-sky-200',
    dotClass: 'bg-sky-500'
  },
  'CONTRACT_CREATED': {
    label: 'Accepted • Contract Created',
    icon: BadgeCheck,
    badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    dotClass: 'bg-emerald-500'
  },
  'Accepted': {
    label: 'Accepted',
    icon: CheckCircle2,
    badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    dotClass: 'bg-emerald-500'
  },
  'Rejected': {
    label: 'Rejected • Closed',
    icon: AlertCircle,
    badgeClass: 'bg-rose-50 text-rose-800 border-rose-200',
    dotClass: 'bg-rose-500'
  },
  'Expired': {
    label: 'Expired',
    icon: Clock,
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-300',
    dotClass: 'bg-slate-400'
  },
  'Cancelled': {
    label: 'Cancelled',
    icon: AlertCircle,
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-300',
    dotClass: 'bg-slate-400'
  },
  'Completed': {
    label: 'Completed',
    icon: BadgeCheck,
    badgeClass: 'bg-blue-50 text-blue-800 border-blue-200',
    dotClass: 'bg-blue-500'
  }
};

// Initial Realistic Negotiation Thread
// Matches Backend NegotiationDTO model + ChatMessage and Offer Sequence
const INITIAL_NEGOTIATION = {
  id: 'NEG-9921',
  cropName: 'Tomato (Grade A)',
  sellerName: 'Nuwara Eliya Organic Farm',
  sellerRole: 'FARMER',
  buyerName: 'Colombo Wholesale Market',
  buyerRole: 'BUYER',
  originalListingPrice: 210,
  unit: 'kg',
  status: 'NEGOTIATING', // NEGOTIATING, CONTRACT_CREATED, Rejected, Expired
  contractId: null,
  
  // Chronological Offers Sequence
  offers: [
    {
      id: 'off-1',
      offeredBy: 'Seller',
      senderRole: 'FARMER',
      senderName: 'Nuwara Eliya Organic Farm',
      price: 210,
      quantity: 500,
      timestamp: '10:30 AM',
      date: 'Today',
      note: 'Initial catalog asking price with high-tunnel cold harvest.',
      type: 'INITIAL_OFFER'
    },
    {
      id: 'off-2',
      offeredBy: 'Buyer',
      senderRole: 'BUYER',
      senderName: 'Colombo Wholesale Market',
      price: 185,
      quantity: 500,
      timestamp: '10:34 AM',
      date: 'Today',
      note: 'Proposed counter price for recurring weekly supply commitment.',
      type: 'COUNTER_OFFER'
    },
    {
      id: 'off-3',
      offeredBy: 'Seller',
      senderRole: 'FARMER',
      senderName: 'Nuwara Eliya Organic Farm',
      price: 200,
      quantity: 500,
      timestamp: '10:35 AM',
      date: 'Today',
      note: 'Rs. 200/kg including crates and temperature-controlled delivery.',
      type: 'COUNTER_OFFER'
    }
  ],

  // Conversation Messages (Visually distinct from formal financial offers)
  messages: [
    {
      id: 'msg-1',
      senderRole: 'BUYER',
      senderName: 'Colombo Wholesale Market',
      text: 'Greetings. We require 500kg Grade-A tomatoes every week for our wholesale stalls.',
      timestampText: '10:30 AM'
    },
    {
      id: 'msg-2',
      senderRole: 'FARMER',
      senderName: 'Nuwara Eliya Organic Farm',
      text: 'I can supply 350kg this week and 500kg starting next week with GAP certification.',
      timestampText: '10:32 AM'
    },
    {
      id: 'msg-3',
      senderRole: 'BUYER',
      senderName: 'Colombo Wholesale Market',
      text: 'Would Rs. 190/kg work if we lock weekly pickup at Dambulla?',
      timestampText: '10:34 AM'
    },
    {
      id: 'msg-4',
      senderRole: 'FARMER',
      senderName: 'Nuwara Eliya Organic Farm',
      text: 'Rs. 200/kg including refrigerated delivery is our best direct farmgate rate.',
      timestampText: '10:35 AM'
    }
  ]
};

export const TradeNegotiation = () => {
  const { user, isFarmer, isBuyer, isBusinessBuyer, isAdmin } = useAuth();

  // Page State
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [negotiation, setNegotiation] = useState(INITIAL_NEGOTIATION);
  const [submittingAction, setSubmittingAction] = useState(false);
  const [actionError, setActionError] = useState(null);
  const [feedbackSuccess, setFeedbackSuccess] = useState(null);

  // Modal / Form States
  const [viewState, setViewState] = useState('DEFAULT'); // 'DEFAULT', 'COUNTER_FORM', 'CONFIRM_ACCEPT', 'CONFIRM_REJECT'
  
  // Counter Offer Form Inputs
  const [counterPrice, setCounterPrice] = useState(200);
  const [counterQuantity, setCounterQuantity] = useState(500);
  const [counterNote, setCounterNote] = useState('');
  const [counterValidationError, setCounterValidationError] = useState('');

  // Chat message input
  const [chatInput, setChatInput] = useState('');
  const chatBottomRef = useRef(null);

  // Determine current user's negotiated role
  // Default to Buyer perspective if logged in as Buyer, or Farmer perspective if Farmer
  const currentUserRole = useMemo(() => {
    if (isFarmer) return 'FARMER';
    if (isBuyer || isBusinessBuyer) return 'BUYER';
    return user?.role === 'FARMER' ? 'FARMER' : 'BUYER';
  }, [isFarmer, isBuyer, isBusinessBuyer, user]);

  const currentUserName = user?.name || (currentUserRole === 'BUYER' ? negotiation.buyerName : negotiation.sellerName);

  // Fetch from backend API on mount
  useEffect(() => {
    let isMounted = true;
    const loadNegotiationData = async () => {
      setLoading(true);
      setLoadError(null);
      try {
        const res = await negotiationAPI.getNegotiation(false);
        if (isMounted && res?.data) {
          const beData = res.data;
          
          setNegotiation(prev => {
            const isContractCreated = beData.status === 'CONTRACT_CREATED';
            const latestOfferPrice = beData.currentOfferedPriceLkr ? Number(beData.currentOfferedPriceLkr) : prev.offers[prev.offers.length - 1].price;
            const latestOfferQty = beData.currentOfferedQuantityKg || prev.offers[prev.offers.length - 1].quantity;

            // Merge messages from backend if present
            const backendMessages = Array.isArray(beData.messages) && beData.messages.length > 0
              ? beData.messages.map((m, idx) => ({
                  id: `be-msg-${idx}`,
                  senderRole: m.senderRole || 'BUYER',
                  senderName: m.senderRole === 'BUYER' ? (beData.buyerName || prev.buyerName) : (beData.farmerName || prev.sellerName),
                  text: m.text,
                  timestampText: m.timestampText || 'Just now'
                }))
              : prev.messages;

            return {
              ...prev,
              id: beData.id || prev.id,
              cropName: beData.cropName || prev.cropName,
              buyerName: beData.buyerName || prev.buyerName,
              sellerName: beData.farmerName || prev.sellerName,
              status: isContractCreated ? 'CONTRACT_CREATED' : prev.status,
              contractId: beData.contractId || (isContractCreated ? '#AGRO-B2B-8924' : prev.contractId),
              messages: backendMessages,
              offers: prev.offers.map((off, idx) => {
                if (idx === prev.offers.length - 1) {
                  return {
                    ...off,
                    price: latestOfferPrice,
                    quantity: latestOfferQty
                  };
                }
                return off;
              })
            };
          });

          // Sync counter inputs
          if (beData.currentOfferedPriceLkr) {
            setCounterPrice(Number(beData.currentOfferedPriceLkr));
          }
          if (beData.currentOfferedQuantityKg) {
            setCounterQuantity(beData.currentOfferedQuantityKg);
          }
        }
      } catch (err) {
        // Fallback gracefully to default negotiation state
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadNegotiationData();
    return () => { isMounted = false; };
  }, []);

  // Derived: Latest Offer
  const latestOffer = useMemo(() => {
    if (!negotiation.offers || negotiation.offers.length === 0) return null;
    return negotiation.offers[negotiation.offers.length - 1];
  }, [negotiation.offers]);

  // Derived: Is negotiation open or closed?
  const isClosed = useMemo(() => {
    return ['CONTRACT_CREATED', 'Accepted', 'Rejected', 'Expired', 'Cancelled', 'Completed'].includes(negotiation.status);
  }, [negotiation.status]);

  // Derived: Who made the latest offer?
  // If the current user made the latest offer, they cannot counter or accept their own offer; they must await the other party.
  const isLatestOfferFromMe = useMemo(() => {
    if (!latestOffer) return false;
    return latestOffer.senderRole === currentUserRole;
  }, [latestOffer, currentUserRole]);

  // Status indicator helper
  const renderStatusBadge = (statusKey) => {
    const config = STATUS_CONFIG[statusKey] || STATUS_CONFIG['NEGOTIATING'];
    const IconComponent = config.icon;
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${config.badgeClass}`}>
        <span className={`w-2 h-2 rounded-full ${config.dotClass}`} aria-hidden="true" />
        <IconComponent className="w-3.5 h-3.5" />
        <span>{config.label}</span>
      </span>
    );
  };

  // Action: Accept Offer
  const handleAcceptOffer = async () => {
    setSubmittingAction(true);
    setActionError(null);

    try {
      const res = await negotiationAPI.acceptOffer();
      const contractRef = res?.data?.contractId || '#AGRO-B2B-8924';

      setNegotiation(prev => ({
        ...prev,
        status: 'CONTRACT_CREATED',
        contractId: contractRef,
        messages: [
          ...prev.messages,
          {
            id: `msg-accept-${Date.now()}`,
            senderRole: currentUserRole,
            senderName: currentUserName,
            text: `Offer of Rs. ${latestOffer.price}/kg accepted. Contract ${contractRef} generated!`,
            timestampText: 'Just now'
          }
        ]
      }));

      setViewState('DEFAULT');
      setFeedbackSuccess(`Offer successfully accepted! B2B Contract ${contractRef} has been created.`);
    } catch (err) {
      setActionError('Unable to accept this offer. Try Again.');
    } finally {
      setSubmittingAction(false);
    }
  };

  // Action: Reject Offer
  const handleRejectOffer = () => {
    setSubmittingAction(true);
    setActionError(null);

    try {
      setNegotiation(prev => ({
        ...prev,
        status: 'Rejected',
        messages: [
          ...prev.messages,
          {
            id: `msg-reject-${Date.now()}`,
            senderRole: currentUserRole,
            senderName: currentUserName,
            text: `Offer of Rs. ${latestOffer.price}/kg was declined. Negotiation closed.`,
            timestampText: 'Just now'
          }
        ]
      }));

      setViewState('DEFAULT');
      setFeedbackSuccess('Negotiation offer was declined and the thread has been closed.');
    } catch (err) {
      setActionError('Unable to reject this offer. Try Again.');
    } finally {
      setSubmittingAction(false);
    }
  };

  // Action: Submit Counter Offer
  const handleSubmitCounterOffer = (e) => {
    e.preventDefault();
    setCounterValidationError('');

    const priceNum = Number(counterPrice);
    const qtyNum = Number(counterQuantity);

    if (isNaN(priceNum) || priceNum <= 0) {
      setCounterValidationError('Please provide a valid price greater than 0.');
      return;
    }
    if (isNaN(qtyNum) || qtyNum <= 0) {
      setCounterValidationError('Please provide a valid quantity greater than 0.');
      return;
    }

    setSubmittingAction(true);
    setActionError(null);

    try {
      const newOfferObj = {
        id: `off-${Date.now()}`,
        offeredBy: currentUserRole === 'BUYER' ? 'Buyer' : 'Seller',
        senderRole: currentUserRole,
        senderName: currentUserName,
        price: priceNum,
        quantity: qtyNum,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: 'Today',
        note: counterNote.trim() || `Proposed counter-offer of Rs. ${priceNum}/kg for ${qtyNum} kg.`,
        type: 'COUNTER_OFFER'
      };

      const newMsgObj = {
        id: `msg-${Date.now()}`,
        senderRole: currentUserRole,
        senderName: currentUserName,
        text: `Submitted counter offer: Rs. ${priceNum}/kg for ${qtyNum}kg. ${counterNote.trim()}`,
        timestampText: 'Just now'
      };

      setNegotiation(prev => ({
        ...prev,
        status: 'Countered',
        offers: [...prev.offers, newOfferObj],
        messages: [...prev.messages, newMsgObj]
      }));

      setViewState('DEFAULT');
      setCounterNote('');
      setFeedbackSuccess(`Your counter offer of Rs. ${priceNum}/kg was sent successfully!`);
    } catch (err) {
      setActionError('Unable to send your offer. Try Again.');
    } finally {
      setSubmittingAction(false);
    }
  };

  // Action: Send chat note
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim() || isClosed) return;

    const newMsg = {
      id: `msg-${Date.now()}`,
      senderRole: currentUserRole,
      senderName: currentUserName,
      text: chatInput.trim(),
      timestampText: 'Just now'
    };

    setNegotiation(prev => ({
      ...prev,
      messages: [...prev.messages, newMsg]
    }));

    setChatInput('');
    setTimeout(() => {
      if (chatBottomRef.current) {
        chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  // Skeleton Loading State
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6 animate-pulse">
        <div className="h-8 bg-slate-200 rounded-lg w-1/3" />
        <div className="h-4 bg-slate-200 rounded-lg w-1/2" />
        <div className="h-28 bg-slate-200 rounded-2xl" />
        <div className="h-48 bg-slate-200 rounded-2xl" />
        <div className="h-64 bg-slate-200 rounded-2xl" />
      </div>
    );
  }

  // Load Error State
  if (loadError) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="p-3 bg-rose-50 text-rose-700 rounded-2xl inline-block">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Unable to load negotiation thread</h2>
        <p className="text-xs text-slate-600">Please check your connection and try again.</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-xl hover:bg-emerald-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* ─── 1. HEADER ─────────────────────────────────────────────── */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-5 border-b border-slate-200">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
              Ref: {negotiation.id}
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-display">
              Trade Negotiation
            </h1>
          </div>
          <p className="text-xs text-slate-500">
            Review offers, propose counter-terms, and establish bilateral supply agreements.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {renderStatusBadge(negotiation.status)}
        </div>
      </header>

      {/* FEEDBACK BANNERS */}
      {feedbackSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between text-xs font-medium">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{feedbackSuccess}</span>
          </div>
          <button
            onClick={() => setFeedbackSuccess(null)}
            className="p-1 hover:bg-emerald-100 rounded text-slate-600 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {actionError && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 flex items-center justify-between text-xs font-medium">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{actionError}</span>
          </div>
          <button
            onClick={() => setActionError(null)}
            className="text-xs font-bold underline hover:text-rose-950"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* ─── 2. NEGOTIATION SUMMARY ────────────────────────────────── */}
      <section aria-labelledby="summary-heading" className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h2 id="summary-heading" className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Negotiation Summary
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
          {/* Crop */}
          <div className="space-y-0.5">
            <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
              <Package className="w-3.5 h-3.5 text-emerald-600" /> Commodity
            </span>
            <p className="font-bold text-slate-900 text-sm">{negotiation.cropName}</p>
          </div>

          {/* Seller */}
          <div className="space-y-0.5">
            <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-slate-500" /> Seller (Farmer)
            </span>
            <p className="font-semibold text-slate-900 truncate" title={negotiation.sellerName}>
              {negotiation.sellerName}
            </p>
            {currentUserRole === 'FARMER' && (
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                (You)
              </span>
            )}
          </div>

          {/* Buyer */}
          <div className="space-y-0.5">
            <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-slate-500" /> Buyer
            </span>
            <p className="font-semibold text-slate-900 truncate" title={negotiation.buyerName}>
              {negotiation.buyerName}
            </p>
            {currentUserRole === 'BUYER' && (
              <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-1.5 py-0.2 rounded">
                (You)
              </span>
            )}
          </div>

          {/* Quantity */}
          <div className="space-y-0.5">
            <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
              <Scale className="w-3.5 h-3.5 text-slate-500" /> Quantity
            </span>
            <p className="font-bold text-slate-900 text-sm">
              {latestOffer ? `${latestOffer.quantity.toLocaleString()} ${negotiation.unit}` : '500 kg'}
            </p>
          </div>

          {/* Original Listing Price */}
          <div className="space-y-0.5">
            <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-slate-500" /> Original Price
            </span>
            <p className="font-semibold text-slate-600 text-sm">
              Rs. {negotiation.originalListingPrice} / {negotiation.unit}
            </p>
          </div>
        </div>
      </section>

      {/* ─── 3. CURRENT OFFER (STRONGEST VISUAL ELEMENT) ───────────── */}
      {latestOffer && (
        <section aria-labelledby="current-offer-heading" className="p-6 bg-white rounded-2xl border-2 border-emerald-600/30 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h2 id="current-offer-heading" className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Current Active Offer
              </h2>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              Offered by: <strong className="text-slate-800">{latestOffer.offeredBy} ({latestOffer.senderName})</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
            {/* Price Column */}
            <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                Offered Rate
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl font-extrabold text-emerald-700 font-display">
                  Rs. {latestOffer.price.toLocaleString()}
                </span>
                <span className="text-xs font-semibold text-emerald-900">/ {negotiation.unit}</span>
              </div>
              <p className="text-[11px] text-slate-500">
                {latestOffer.price < negotiation.originalListingPrice ? (
                  <span className="text-emerald-700 font-semibold inline-flex items-center gap-0.5">
                    <TrendingDown className="w-3 h-3" />
                    Rs. {negotiation.originalListingPrice - latestOffer.price} below original listing
                  </span>
                ) : (
                  <span>Standard listing benchmark</span>
                )}
              </p>
            </div>

            {/* Quantity & Total Value */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Contract Volume &amp; Total
              </span>
              <div className="text-xl font-bold text-slate-900">
                {latestOffer.quantity.toLocaleString()} {negotiation.unit}
              </div>
              <p className="text-xs font-semibold text-slate-700 pt-0.5">
                Total Value: <span className="font-extrabold text-slate-900">Rs. {(latestOffer.price * latestOffer.quantity).toLocaleString()}</span>
              </p>
            </div>

            {/* Turn & Status Prompt */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Turn Status
              </span>
              <div className="text-sm font-bold text-slate-800">
                {isClosed ? (
                  <span className="text-slate-500">Negotiation Closed</span>
                ) : isLatestOfferFromMe ? (
                  <span className="text-amber-800 flex items-center gap-1">
                    <Clock className="w-4 h-4 text-amber-600" /> Waiting for response
                  </span>
                ) : (
                  <span className="text-emerald-700 flex items-center gap-1">
                    <Info className="w-4 h-4 text-emerald-600" /> Awaiting your decision
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500">
                {isClosed
                  ? 'Agreement concluded.'
                  : isLatestOfferFromMe
                  ? `Your offer was sent to the ${latestOffer.offeredBy === 'Buyer' ? 'Seller' : 'Buyer'}.`
                  : 'You may Accept, Propose a Counter-Offer, or Decline.'}
              </p>
            </div>
          </div>

          {latestOffer.note && (
            <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 border border-slate-100">
              <strong className="text-slate-800">Terms Note:</strong> {latestOffer.note}
            </div>
          )}
        </section>
      )}

      {/* ─── AGREED TERMS SECTION (DISPLAYED WHEN ACCEPTED) ─────────── */}
      {negotiation.status === 'CONTRACT_CREATED' && (
        <section className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-emerald-200/60">
            <div className="flex items-center gap-2">
              <BadgeCheck className="w-5 h-5 text-emerald-700" />
              <h2 className="text-base font-bold text-emerald-950 font-display">
                AGREED TERMS • B2B PURCHASE CONTRACT
              </h2>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-800 bg-white px-2.5 py-1 rounded-md border border-emerald-200">
              Contract ID: {negotiation.contractId || '#AGRO-B2B-8924'}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-emerald-800 font-medium block">Crop</span>
              <span className="font-bold text-slate-900 text-sm">{negotiation.cropName}</span>
            </div>
            <div>
              <span className="text-emerald-800 font-medium block">Agreed Quantity</span>
              <span className="font-bold text-slate-900 text-sm">
                {latestOffer.quantity.toLocaleString()} {negotiation.unit}
              </span>
            </div>
            <div>
              <span className="text-emerald-800 font-medium block">Agreed Price</span>
              <span className="font-bold text-emerald-900 text-sm">
                Rs. {latestOffer.price.toLocaleString()} / {negotiation.unit}
              </span>
            </div>
            <div>
              <span className="text-emerald-800 font-medium block">Total Contract Value</span>
              <span className="font-bold text-slate-900 text-sm">
                Rs. {(latestOffer.price * latestOffer.quantity).toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-emerald-800 font-medium block">Buyer</span>
              <span className="font-semibold text-slate-900">{negotiation.buyerName}</span>
            </div>
            <div>
              <span className="text-emerald-800 font-medium block">Seller (Grower)</span>
              <span className="font-semibold text-slate-900">{negotiation.sellerName}</span>
            </div>
            <div className="col-span-2 flex items-center justify-end">
              <Link
                to="/contracts"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition"
              >
                <span>View in Contract Farming</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ─── 4. CONVERSATION / OFFER HISTORY ───────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Chronological Offer History */}
        <section aria-labelledby="history-heading" className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h2 id="history-heading" className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Offer History
            </h2>
            <span className="text-[11px] text-slate-400 font-medium">
              {negotiation.offers.length} recorded propositions
            </span>
          </div>

          <div className="space-y-3">
            {negotiation.offers.map((off, idx) => {
              const isCurrent = idx === negotiation.offers.length - 1;
              const isBuyerParty = off.senderRole === 'BUYER';

              return (
                <div key={off.id} className="relative">
                  {idx > 0 && (
                    <div className="flex items-center justify-center py-1">
                      <span className="text-[10px] text-slate-400 font-semibold px-2 py-0.5 rounded-full bg-slate-100 flex items-center gap-1">
                        ↓ Counter Offer
                      </span>
                    </div>
                  )}

                  <div className={`p-3.5 rounded-xl border text-xs space-y-1.5 transition-all ${
                    isCurrent
                      ? 'bg-emerald-50/40 border-emerald-300 ring-1 ring-emerald-400/20'
                      : 'bg-slate-50 border-slate-200/80 text-slate-600'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className={`font-bold flex items-center gap-1 ${isBuyerParty ? 'text-sky-800' : 'text-emerald-800'}`}>
                        {isBuyerParty ? <Building2 className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                        {off.offeredBy} ({off.senderName})
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">
                        {off.timestamp}
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between pt-1">
                      <span className="text-base font-extrabold text-slate-900 font-display">
                        Rs. {off.price} <span className="text-xs font-normal text-slate-500">/ {negotiation.unit}</span>
                      </span>
                      <span className="font-semibold text-slate-700">
                        {off.quantity} {negotiation.unit}
                      </span>
                    </div>

                    {off.note && (
                      <p className="text-[11px] text-slate-500 pt-0.5 leading-relaxed">
                        {off.note}
                      </p>
                    )}

                    {isCurrent && (
                      <div className="pt-1 flex items-center gap-1 text-[10px] font-bold text-emerald-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                        Current active proposition
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Right Column: Negotiation Messaging */}
        <section aria-labelledby="messages-heading" className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h2 id="messages-heading" className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-slate-400" /> Negotiation Discussion
              </h2>
              <span className="text-[11px] text-slate-400 font-medium">
                Direct Party Messaging
              </span>
            </div>

            <div className="h-64 overflow-y-auto space-y-2.5 py-3 pr-1 text-xs">
              {negotiation.messages.map((msg) => {
                const isMyMessage = msg.senderRole === currentUserRole;
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMyMessage ? 'items-end' : 'items-start'}`}
                  >
                    <span className="text-[10px] text-slate-400 font-medium px-1">
                      {msg.senderName} • {msg.timestampText}
                    </span>
                    <div className={`p-2.5 rounded-2xl max-w-[85%] leading-relaxed ${
                      isMyMessage
                        ? 'bg-emerald-600 text-white rounded-br-xs'
                        : 'bg-slate-100 text-slate-800 rounded-bl-xs'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                );
              })}
              <div ref={chatBottomRef} />
            </div>
          </div>

          {/* Chat Input Bar */}
          {!isClosed ? (
            <form onSubmit={handleSendMessage} className="pt-2 border-t border-slate-100 flex items-center gap-2">
              <input
                type="text"
                placeholder="Type a message or delivery note..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="submit"
                disabled={!chatInput.trim()}
                className="p-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl transition cursor-pointer"
                title="Send note"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-center text-xs text-slate-500">
              Discussion closed with negotiation completion.
            </div>
          )}
        </section>
      </div>

      {/* ─── 5. RESPONSE ACTIONS ───────────────────────────────────── */}
      <section aria-label="Negotiation Actions" className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Available Response Actions
          </h2>
          <span className="text-xs font-semibold text-slate-600">
            Role: <strong className="text-slate-900">{currentUserRole === 'BUYER' ? 'Buyer' : 'Seller (Farmer)'}</strong>
          </span>
        </div>

        {/* CLOSED STATE */}
        {isClosed ? (
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
              Negotiation Closed
            </span>
            <p className="text-xs text-slate-500">
              This negotiation is finalized with status:{' '}
              <strong className="text-slate-800">{negotiation.status}</strong>. No further counter-proposals can be submitted.
            </p>
            {negotiation.status === 'CONTRACT_CREATED' && (
              <div className="pt-2">
                <Link
                  to="/contracts"
                  className="inline-flex items-center gap-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
                >
                  <span>Go to Contract Farming</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>
        ) : isLatestOfferFromMe ? (
          /* WAITING FOR OTHER PARTY */
          <div className="p-4 bg-amber-50/70 rounded-xl border border-amber-200 text-amber-950 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-700 shrink-0" />
              <span>
                You submitted the latest offer of <strong>Rs. {latestOffer.price}/kg</strong>. Awaiting response from{' '}
                <strong>{currentUserRole === 'BUYER' ? negotiation.sellerName : negotiation.buyerName}</strong>.
              </span>
            </div>
          </div>
        ) : (
          /* ACTION CONTROLS */
          <div className="flex flex-wrap items-center gap-3">
            <button
              id="accept-offer-btn"
              onClick={() => setViewState('CONFIRM_ACCEPT')}
              disabled={submittingAction}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Accept Offer (Rs. {latestOffer.price}/kg)</span>
            </button>

            <button
              id="counter-offer-btn"
              onClick={() => {
                setCounterPrice(latestOffer.price);
                setCounterQuantity(latestOffer.quantity);
                setViewState('COUNTER_FORM');
              }}
              disabled={submittingAction}
              className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
              <span>Propose Counter Offer</span>
            </button>

            <button
              id="reject-offer-btn"
              onClick={() => setViewState('CONFIRM_REJECT')}
              disabled={submittingAction}
              className="px-4 py-2.5 bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer ml-auto"
            >
              <X className="w-3.5 h-3.5 text-rose-500" />
              <span>Decline Offer</span>
            </button>
          </div>
        )}
      </section>

      {/* ─── MODAL: COUNTER OFFER FORM ─────────────────────────────── */}
      {viewState === 'COUNTER_FORM' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-display">
                  Propose Counter Offer
                </h3>
                <p className="text-xs text-slate-500">
                  Negotiate price and delivery terms for {negotiation.cropName}.
                </p>
              </div>
              <button
                onClick={() => setViewState('DEFAULT')}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {counterValidationError && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-lg font-medium">
                {counterValidationError}
              </div>
            )}

            <form onSubmit={handleSubmitCounterOffer} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Proposed Price (Rs / kg) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    step="any"
                    value={counterPrice}
                    onChange={(e) => setCounterPrice(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Quantity ({negotiation.unit}) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={counterQuantity}
                    onChange={(e) => setCounterQuantity(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-bold"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center text-xs">
                <span className="text-slate-500 font-medium">Total Proposed Valuation:</span>
                <span className="font-extrabold text-emerald-800 text-sm">
                  Rs. {(Number(counterPrice || 0) * Number(counterQuantity || 0)).toLocaleString()}
                </span>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Terms / Justification Message</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Can meet Rs. 195/kg if delivery is consolidated into single weekly dispatches."
                  value={counterNote}
                  onChange={(e) => setCounterNote(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setViewState('DEFAULT')}
                  className="px-4 py-2 border border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingAction}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-xs cursor-pointer"
                >
                  {submittingAction ? 'Submitting...' : 'Submit Counter Offer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL: ACCEPT CONFIRMATION ────────────────────────────── */}
      {viewState === 'CONFIRM_ACCEPT' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 font-display">
                Accept this offer?
              </h3>
              <button onClick={() => setViewState('DEFAULT')} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1.5 text-slate-800">
              <div className="flex justify-between font-medium">
                <span>Commodity:</span>
                <span className="font-bold">{negotiation.cropName}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Quantity:</span>
                <span className="font-bold">{latestOffer.quantity} {negotiation.unit}</span>
              </div>
              <div className="flex justify-between font-bold text-emerald-900 pt-1 border-t border-emerald-200">
                <span>Agreed Price:</span>
                <span>Rs. {latestOffer.price} / {negotiation.unit}</span>
              </div>
              <div className="flex justify-between font-bold text-emerald-900">
                <span>Total Agreement Value:</span>
                <span>Rs. {(latestOffer.price * latestOffer.quantity).toLocaleString()}</span>
              </div>
            </div>

            <p className="text-slate-600 leading-relaxed">
              Accepting this proposition will conclude active negotiation and automatically generate an AgroLink B2B crop supply contract backed by bank escrow.
            </p>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setViewState('DEFAULT')}
                disabled={submittingAction}
                className="px-4 py-2 border border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAcceptOffer}
                disabled={submittingAction}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-xs transition flex items-center gap-1 cursor-pointer"
              >
                {submittingAction ? (
                  <span>Accepting...</span>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Accept Offer</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL: REJECT CONFIRMATION ────────────────────────────── */}
      {viewState === 'CONFIRM_REJECT' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 font-display">
                Decline this negotiation?
              </h3>
              <button onClick={() => setViewState('DEFAULT')} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-slate-600 leading-relaxed">
              Are you sure you want to decline this offer? Declining will close this negotiation thread and signal to the other party that an agreement could not be reached.
            </p>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setViewState('DEFAULT')}
                disabled={submittingAction}
                className="px-4 py-2 border border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 cursor-pointer"
              >
                Keep Open
              </button>
              <button
                type="button"
                onClick={handleRejectOffer}
                disabled={submittingAction}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-xs transition cursor-pointer"
              >
                {submittingAction ? 'Closing...' : 'Decline & Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TradeNegotiation;
