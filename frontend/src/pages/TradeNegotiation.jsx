import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  CheckCircle2,
  FileText,
  Send,
  User,
  ShieldCheck,
  DollarSign,
  Sliders,
  Scale,
  Sparkles,
  Lock,
  ArrowRight,
  TrendingUp,
  Package,
  Truck,
  Building2,
  Clock,
  Coins,
  Bot,
  Zap,
  Award,
  ChevronRight,
  Download,
  Eye,
  X,
  Layers,
  Percent,
  Check,
  AlertCircle,
  RotateCcw,
  PenTool,
  CheckCircle,
  Hash,
  SlidersHorizontal,
  ChevronDown,
  Info
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { negotiationAPI } from '../services/api';

// MULTI-DEAL CONFIGURATIONS
const ACTIVE_DEALS = [
  {
    id: 'deal-tomato-01',
    commodity: 'Welimada Organic Tomatoes',
    grade: 'Grade A',
    icon: '🍅',
    buyer: {
      name: 'Keells Procurement (Colombo Central)',
      role: 'Enterprise Buyer • Verified ⭐ 4.9',
      avatarBg: 'bg-sky-100 text-sky-700',
      initialBudget: 185
    },
    farmer: {
      name: 'Bandara Organic Farm (Welimada)',
      role: 'GAP Certified Producer ⭐ 4.95',
      avatarBg: 'bg-emerald-100 text-emerald-700',
      askingPrice: 200
    },
    spotPrice: 210,
    brokerPrice: 155,
    aiOptimalPrice: 192,
    aiOptimalVolume: 600,
    minPrice: 150,
    maxPrice: 240,
    defaultVolume: 500,
    unit: 'kg',
    deliveryLocation: 'Keells Colombo Hub',
    logisticsFee: 6500,
    initialMessages: [
      {
        id: 1,
        sender: 'BUYER',
        senderName: 'Keells Procurement (Colombo Central)',
        role: 'Enterprise Buyer • Verified ⭐ 4.9',
        avatarBg: 'bg-sky-100 text-sky-700',
        text: 'Greetings Bandara. We require 500kg Grade-A Welimada Organic Tomatoes weekly for our Western Province supermarket network.',
        time: '10:30 AM',
        isProposal: false
      },
      {
        id: 2,
        sender: 'FARMER',
        senderName: 'Bandara Organic Farm (Welimada)',
        role: 'GAP Certified Producer ⭐ 4.95',
        avatarBg: 'bg-emerald-100 text-emerald-700',
        text: 'Hello! I have prime harvest ready. Wholesale spot price is Rs. 210/kg, but I can offer Rs. 200/kg for a guaranteed weekly recurring contract with farmgate cold-chain.',
        time: '10:32 AM',
        isProposal: false
      },
      {
        id: 3,
        sender: 'BUYER',
        senderName: 'Keells Procurement',
        role: 'Enterprise Buyer • Verified ⭐ 4.9',
        avatarBg: 'bg-sky-100 text-sky-700',
        text: 'Our supply budget allows Rs. 185/kg if we commit to a 3-month recurring tender with scheduled Tuesday deliveries.',
        time: '10:34 AM',
        isProposal: true,
        proposedPrice: 185,
        proposedVolume: 500,
        proposedTerms: 'Weekly Delivery • 3-Month Tender'
      }
    ]
  },
  {
    id: 'deal-carrot-02',
    commodity: 'Nuwara Eliya Jumbo Carrots',
    grade: 'Export Grade A',
    icon: '🥕',
    buyer: {
      name: 'Cargills Ceylon Agri-Supply',
      role: 'Supermarket Chain • Verified ⭐ 4.95',
      avatarBg: 'bg-amber-100 text-amber-700',
      initialBudget: 240
    },
    farmer: {
      name: 'Highland Pure Greens (Kandapola)',
      role: 'GlobalGAP Producer ⭐ 4.92',
      avatarBg: 'bg-emerald-100 text-emerald-700',
      askingPrice: 275
    },
    spotPrice: 290,
    brokerPrice: 210,
    aiOptimalPrice: 255,
    aiOptimalVolume: 1200,
    minPrice: 200,
    maxPrice: 320,
    defaultVolume: 1000,
    unit: 'kg',
    deliveryLocation: 'Cargills Ja-Ela Distribution Center',
    logisticsFee: 8500,
    initialMessages: [
      {
        id: 1,
        sender: 'BUYER',
        senderName: 'Cargills Ceylon Agri-Supply',
        role: 'Supermarket Chain • Verified ⭐ 4.95',
        avatarBg: 'bg-amber-100 text-amber-700',
        text: 'Looking to contract 1,000kg weekly of washed export-grade Nuwara Eliya Carrots for our refrigerated hypermarkets.',
        time: '09:15 AM',
        isProposal: false
      },
      {
        id: 2,
        sender: 'FARMER',
        senderName: 'Highland Pure Greens',
        role: 'GlobalGAP Producer ⭐ 4.92',
        avatarBg: 'bg-emerald-100 text-emerald-700',
        text: 'Our crop is harvested at 6,200ft elevation with exceptional sweetness. We ask Rs. 275/kg including refrigerated transit.',
        time: '09:18 AM',
        isProposal: false
      },
      {
        id: 3,
        sender: 'BUYER',
        senderName: 'Cargills Ceylon Agri-Supply',
        role: 'Supermarket Chain • Verified ⭐ 4.95',
        avatarBg: 'bg-amber-100 text-amber-700',
        text: 'We propose Rs. 240/kg if volume is locked for full quarter.',
        time: '09:22 AM',
        isProposal: true,
        proposedPrice: 240,
        proposedVolume: 1000,
        proposedTerms: 'Weekly Reefer • Quarter Contract'
      }
    ]
  },
  {
    id: 'deal-onion-03',
    commodity: 'Jaffna Premium Red Onions',
    grade: 'Grade A Cured',
    icon: '🧅',
    buyer: {
      name: 'Lanka Agro Global Exports',
      role: 'Export Consortium • Verified ⭐ 4.88',
      avatarBg: 'bg-purple-100 text-purple-700',
      initialBudget: 330
    },
    farmer: {
      name: 'Northern Peninsula Cooperative',
      role: 'Certified Organic Growers ⭐ 4.90',
      avatarBg: 'bg-emerald-100 text-emerald-700',
      askingPrice: 380
    },
    spotPrice: 410,
    brokerPrice: 290,
    aiOptimalPrice: 350,
    aiOptimalVolume: 800,
    minPrice: 280,
    maxPrice: 450,
    defaultVolume: 800,
    unit: 'kg',
    deliveryLocation: 'Colombo Port Logistics Hub',
    logisticsFee: 12000,
    initialMessages: [
      {
        id: 1,
        sender: 'BUYER',
        senderName: 'Lanka Agro Global Exports',
        role: 'Export Consortium • Verified ⭐ 4.88',
        avatarBg: 'bg-purple-100 text-purple-700',
        text: 'Seeking 800kg batch of dry-cured Jaffna Red Onions for UAE container shipment.',
        time: '11:05 AM',
        isProposal: false
      },
      {
        id: 2,
        sender: 'FARMER',
        senderName: 'Northern Peninsula Cooperative',
        role: 'Certified Organic Growers ⭐ 4.90',
        avatarBg: 'bg-emerald-100 text-emerald-700',
        text: 'Sun-cured and mesh-bagged. Spot retail is Rs. 410/kg. We can offer Rs. 380/kg FOB Jaffna.',
        time: '11:12 AM',
        isProposal: false
      },
      {
        id: 3,
        sender: 'BUYER',
        senderName: 'Lanka Agro Global Exports',
        role: 'Export Consortium • Verified ⭐ 4.88',
        avatarBg: 'bg-purple-100 text-purple-700',
        text: 'Target export procurement cap is Rs. 330/kg with palletized dispatch.',
        time: '11:15 AM',
        isProposal: true,
        proposedPrice: 330,
        proposedVolume: 800,
        proposedTerms: 'Bi-Weekly • Export Specification'
      }
    ]
  }
];

export const TradeNegotiation = () => {
  const [selectedDealId, setSelectedDealId] = useState(ACTIVE_DEALS[0].id);
  const currentDeal = ACTIVE_DEALS.find((d) => d.id === selectedDealId) || ACTIVE_DEALS[0];

  const [contractCreated, setContractCreated] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const [showTermSheetModal, setShowTermSheetModal] = useState(false);
  const [isAiOptimizing, setIsAiOptimizing] = useState(false);
  const [isBuyerTyping, setIsBuyerTyping] = useState(false);
  const [activeMobileTab, setActiveMobileTab] = useState('both'); // 'both', 'chat', 'studio'

  // Interactive Counter-Offer Parameters
  const [counterPrice, setCounterPrice] = useState(currentDeal.aiOptimalPrice + 3);
  const [counterVolumeKg, setCounterVolumeKg] = useState(currentDeal.defaultVolume);
  const [frequency, setFrequency] = useState('weekly'); // 'weekly', 'spot'
  const [qualityGrade, setQualityGrade] = useState(currentDeal.grade);
  const [includeTransport, setIncludeTransport] = useState(true);

  // Chat Messages State
  const [messages, setMessages] = useState(currentDeal.initialMessages);

  // Digital Signature State
  const [signatureData, setSignatureData] = useState(null);
  const [isSigned, setIsSigned] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef(null);

  // Switch Deal Handler
  const handleDealChange = (newDealId) => {
    const deal = ACTIVE_DEALS.find((d) => d.id === newDealId) || ACTIVE_DEALS[0];
    setSelectedDealId(deal.id);
    setMessages(deal.initialMessages);
    setCounterPrice(deal.aiOptimalPrice + 3);
    setCounterVolumeKg(deal.defaultVolume);
    setQualityGrade(deal.grade);
    setFrequency('weekly');
    setIncludeTransport(true);
    setContractCreated(false);
    setShowTermSheetModal(false);
    setIsSigned(false);
    setSignatureData(null);
  };

  useEffect(() => {
    const fetchNegotiation = async () => {
      try {
        const res = await negotiationAPI.getNegotiation(contractCreated);
        if (res && res.data && res.data.status === 'ACCEPTED') {
          setContractCreated(true);
        }
      } catch (err) {
        // fallback
      }
    };
    fetchNegotiation();
  }, [contractCreated]);

  const handleResetSession = () => {
    setMessages(currentDeal.initialMessages);
    setCounterPrice(currentDeal.aiOptimalPrice + 3);
    setCounterVolumeKg(currentDeal.defaultVolume);
    setFrequency('weekly');
    setQualityGrade(currentDeal.grade);
    setIncludeTransport(true);
    setContractCreated(false);
    setShowTermSheetModal(false);
    setIsSigned(false);
    setSignatureData(null);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    const userText = messageInput;
    const farmerMsg = {
      id: Date.now(),
      sender: 'FARMER',
      senderName: currentDeal.farmer.name + ' (You)',
      role: currentDeal.farmer.role,
      avatarBg: currentDeal.farmer.avatarBg,
      text: userText,
      time: 'Just now',
      isProposal: false
    };

    setMessages((prev) => [...prev, farmerMsg]);
    setMessageInput('');

    // Simulate reactive buyer response
    setIsBuyerTyping(true);
    setTimeout(() => {
      setIsBuyerTyping(false);
      let replyText = `Thank you for the update. We are reviewing these terms with our intake supervisor for ${currentDeal.commodity}.`;
      if (userText.includes(currentDeal.aiOptimalPrice.toString()) || userText.includes(currentDeal.grade) || userText.includes('agree')) {
        replyText = 'Understood! If you can lock this rate and quality grade, our procurement system is ready to fund the escrow immediately.';
      } else if (userText.includes('transport') || userText.includes('Reefer') || userText.includes('transit')) {
        replyText = 'Having farmgate cold-chain included ensures 99% freshness upon arrival. That helps satisfy our quality SLA!';
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'BUYER',
          senderName: currentDeal.buyer.name,
          role: currentDeal.buyer.role,
          avatarBg: currentDeal.buyer.avatarBg,
          text: replyText,
          time: 'Just now',
          isProposal: false
        }
      ]);
    }, 1200);
  };

  const handleQuickChip = (text) => {
    setMessageInput(text);
  };

  const handleSendCounterOffer = () => {
    const newMsg = {
      id: Date.now(),
      sender: 'FARMER',
      senderName: currentDeal.farmer.name + ' (You)',
      role: currentDeal.farmer.role,
      avatarBg: currentDeal.farmer.avatarBg,
      text: `Submitted formal counter-offer: Rs. ${counterPrice}/kg for ${counterVolumeKg}kg ${frequency === 'weekly' ? 'weekly' : 'one-time'} (${includeTransport ? 'Farmgate Cold-Chain Transport Included' : 'Buyer Pickup'}). Quality: ${qualityGrade}.`,
      time: 'Just now',
      isProposal: true,
      proposedPrice: counterPrice,
      proposedVolume: counterVolumeKg,
      proposedTerms: `${frequency.toUpperCase()} • ${qualityGrade} • ${includeTransport ? 'Cold Transport Inc.' : 'Self Pickup'}`
    };

    setMessages((prev) => [...prev, newMsg]);

    // Simulated responsive Buyer reaction
    setIsBuyerTyping(true);
    setTimeout(() => {
      setIsBuyerTyping(false);
      const isGoodPrice = counterPrice <= currentDeal.aiOptimalPrice + 5;
      const buyerReply = isGoodPrice
        ? `We have reviewed your proposal of Rs. ${counterPrice}.00/kg for ${counterVolumeKg}kg weekly (${qualityGrade}). This falls within our wholesale allocation! Click 'Accept Terms & Lock Smart Escrow Contract' below to lock in the batch.`
        : `We received your counter of Rs. ${counterPrice}.00/kg. Could you consider Rs. ${currentDeal.aiOptimalPrice}.00/kg if we bump our weekly intake volume to ${currentDeal.aiOptimalVolume}kg?`;

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 2,
          sender: 'BUYER',
          senderName: currentDeal.buyer.name,
          role: currentDeal.buyer.role,
          avatarBg: currentDeal.buyer.avatarBg,
          text: buyerReply,
          time: 'Just now',
          isProposal: !isGoodPrice,
          proposedPrice: currentDeal.aiOptimalPrice,
          proposedVolume: currentDeal.aiOptimalVolume,
          proposedTerms: 'Volume Discount Tender'
        }
      ]);
    }, 1300);
  };

  const handleApplyAiRecommendation = () => {
    setIsAiOptimizing(true);
    setTimeout(() => {
      setCounterPrice(currentDeal.aiOptimalPrice);
      setCounterVolumeKg(currentDeal.aiOptimalVolume);
      setFrequency('weekly');
      setIncludeTransport(true);
      setQualityGrade(currentDeal.grade);
      setIsAiOptimizing(false);
    }, 350);
  };

  const handleAcceptOffer = async () => {
    try {
      await negotiationAPI.acceptOffer();
    } catch (err) {
      // fallback
    }
    setContractCreated(true);
    setShowTermSheetModal(true);
  };

  // Financial Mathematics
  const totalContractVal = counterPrice * counterVolumeKg;
  const spotMarketVal = currentDeal.spotPrice * counterVolumeKg;
  const traditionalBrokerVal = currentDeal.brokerPrice * counterVolumeKg;
  const buyerSavingsVsSpot = spotMarketVal - totalContractVal;
  const logisticsFee = includeTransport ? currentDeal.logisticsFee : 0;
  const farmerNetPayout = totalContractVal - logisticsFee;
  const farmerExtraVsBroker = farmerNetPayout - traditionalBrokerVal;
  const dealViabilityScore = Math.min(
    98,
    Math.max(50, Math.round(100 - Math.abs(counterPrice - currentDeal.aiOptimalPrice) * 2.2 - (counterVolumeKg > 2000 ? 5 : 0)))
  );

  // Price Visualizer Calculation Helpers (0% to 100% position on bar)
  const priceMin = currentDeal.minPrice;
  const priceMax = currentDeal.maxPrice;
  const getPercentage = (val) => Math.max(0, Math.min(100, ((val - priceMin) / (priceMax - priceMin)) * 100));

  const brokerPct = getPercentage(currentDeal.brokerPrice);
  const buyerTargetPct = getPercentage(currentDeal.buyer.initialBudget);
  const aiOptimalPct = getPercentage(currentDeal.aiOptimalPrice);
  const farmerAskingPct = getPercentage(currentDeal.farmer.askingPrice);
  const spotMarketPct = getPercentage(currentDeal.spotPrice);
  const currentPricePct = getPercentage(counterPrice);

  // Canvas Signature Pad Functions
  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
    const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
    const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#059669'; // Emerald-600
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      setSignatureData(canvas.toDataURL());
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setSignatureData(null);
      setIsSigned(false);
    }
  };

  const generateAutoSignature = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = 'italic 28px "Caveat", "Brush Script MT", cursive, sans-serif';
      ctx.fillStyle = '#047857';
      ctx.fillText('Bandara S. Farmgate', 20, 50);
      setSignatureData(canvas.toDataURL());
      setIsSigned(true);
    }
  };

  const finalizeSignContract = () => {
    if (signatureData) {
      setIsSigned(true);
    }
  };

  return (
    <div className="relative min-h-screen py-8 px-4 sm:px-6 lg:px-8 space-y-8 animate-fade-in text-slate-800">
      {/* AMBIENT FROSTED GLASS BACKGROUND REFRACTION ORBS */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-10 left-1/4 w-[480px] h-[480px] bg-emerald-400/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-10 w-[420px] h-[420px] bg-teal-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-[380px] h-[380px] bg-sky-400/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* 1. HERO HEADER WITH MULTI-COMMODITY DEAL SELECTOR */}
        <div className="relative overflow-hidden rounded-3xl bg-white/85 backdrop-blur-xl border border-white/90 shadow-xl shadow-slate-200/50 ring-1 ring-slate-900/5 p-6 sm:p-8 space-y-6">
          <div className="absolute -top-12 -right-12 w-72 h-72 bg-gradient-to-br from-emerald-400/15 via-teal-300/10 to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50/90 backdrop-blur-md text-emerald-800 text-xs font-extrabold uppercase tracking-wider border border-emerald-200/80 shadow-xs">
                  <Scale className="w-3.5 h-3.5 text-emerald-600" />
                  <span>B2B Multi-Party Price Negotiation Protocol</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span className="w-2 h-2 rounded-full bg-emerald-500 -ml-3.5" />
                  <span>Room Active • 2 Parties Online</span>
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black tracking-tight font-display text-slate-900">
                Real-Time Trade &amp; Counter-Offer Room 🤝
              </h1>
              <p className="text-slate-500 text-xs sm:text-sm max-w-3xl font-medium leading-relaxed">
                Direct peer-to-peer commodity bargaining protocol with dynamic market spread telemetry, AI Sentinel equilibrium guidance, and legally-binding digital signature escrow contracts.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                onClick={handleResetSession}
                title="Reset simulation back to initial state"
                className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 font-extrabold text-xs rounded-2xl transition-all flex items-center gap-1.5 cursor-pointer border border-slate-200"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-600" />
                <span>Reset Deal</span>
              </button>

              <button
                onClick={() => setShowTermSheetModal(true)}
                className="px-4 py-2.5 bg-white/90 hover:bg-white active:scale-95 border border-slate-200/80 text-slate-700 font-extrabold text-xs rounded-2xl shadow-xs hover:shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-slate-500" />
                <span>View Term Sheet</span>
              </button>

              <div className="px-4 py-2.5 bg-emerald-50/90 backdrop-blur-md rounded-2xl text-xs font-black text-emerald-800 border border-emerald-200/80 shadow-xs flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Escrow Vault Ready</span>
              </div>
            </div>
          </div>

          {/* ACTIVE COMMODITY DEAL SWITCHER TABS */}
          <div className="pt-2 border-t border-slate-100/90">
            <div className="flex items-center justify-between flex-wrap gap-2 pb-2">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" /> Switch Active Negotiation Room:
              </span>
              <span className="text-xs text-slate-500 font-semibold">
                Spot Benchmark: <strong className="text-slate-800">Rs. {currentDeal.spotPrice}/kg</strong>
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {ACTIVE_DEALS.map((deal) => {
                const isSelected = deal.id === currentDeal.id;
                return (
                  <button
                    key={deal.id}
                    onClick={() => handleDealChange(deal.id)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20'
                        : 'bg-slate-50/80 hover:bg-white text-slate-700 border-slate-200/80 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-xl">{deal.icon}</span>
                      <div className="min-w-0">
                        <p className={`text-xs font-extrabold truncate ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                          {deal.commodity}
                        </p>
                        <p className={`text-[10px] font-medium truncate ${isSelected ? 'text-emerald-100' : 'text-slate-400'}`}>
                          {deal.buyer.name.split('(')[0]}
                        </p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0 ${
                      isSelected ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {deal.grade}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ROOM PARTICIPANTS STRIP */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t border-slate-100/90">
            <div className="p-3 bg-slate-50/80 backdrop-blur-md rounded-2xl border border-slate-200/70 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-black text-sm border border-sky-200">
                <Building2 className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-black uppercase text-slate-400 block tracking-wider">Enterprise Buyer</span>
                <p className="text-xs font-extrabold text-slate-900 truncate">{currentDeal.buyer.name}</p>
              </div>
            </div>

            <div className="p-3 bg-slate-50/80 backdrop-blur-md rounded-2xl border border-slate-200/70 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-sm border border-emerald-200">
                <Award className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-black uppercase text-slate-400 block tracking-wider">Certified Producer</span>
                <p className="text-xs font-extrabold text-slate-900 truncate">{currentDeal.farmer.name}</p>
              </div>
            </div>

            <div className="p-3 bg-slate-50/80 backdrop-blur-md rounded-2xl border border-slate-200/70 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-black text-sm border border-teal-200">
                <Truck className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-black uppercase text-slate-400 block tracking-wider">Cold Logistics SLA</span>
                <p className="text-xs font-extrabold text-slate-900 truncate">{currentDeal.deliveryLocation}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 2. STRATEGIC METRICS & AI SENTINEL RIBBON */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* AI Win-Win Deal Score */}
          <div className="p-5 bg-white/85 backdrop-blur-xl border border-white/90 shadow-lg shadow-slate-200/40 ring-1 ring-slate-900/5 rounded-3xl space-y-1">
            <div className="flex justify-between items-center text-xs">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Deal Viability Score</span>
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-black">
                ✨
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-black font-display text-emerald-600">{dealViabilityScore}%</h3>
              <span className="text-[11px] font-extrabold text-slate-600">
                {dealViabilityScore > 85 ? 'High Agreement Probability' : 'Negotiation Divergence'}
              </span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${dealViabilityScore}%` }}
              />
            </div>
          </div>

          {/* Live Price Spread */}
          <div className="p-5 bg-white/85 backdrop-blur-xl border border-white/90 shadow-lg shadow-slate-200/40 ring-1 ring-slate-900/5 rounded-3xl space-y-1">
            <div className="flex justify-between items-center text-xs">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Active Price Proposal</span>
              <span className="text-xs font-bold text-slate-400">Spot Rs. {currentDeal.spotPrice}</span>
            </div>
            <h3 className="text-2xl font-black font-display text-slate-900">
              Rs. {counterPrice}.00<span className="text-xs font-bold text-slate-400">/kg</span>
            </h3>
            <p className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span>+{Math.round(((counterPrice - currentDeal.brokerPrice) / currentDeal.brokerPrice) * 100)}% over broker rate</span>
            </p>
          </div>

          {/* Weekly Escrow Volume */}
          <div className="p-5 bg-white/85 backdrop-blur-xl border border-white/90 shadow-lg shadow-slate-200/40 ring-1 ring-slate-900/5 rounded-3xl space-y-1">
            <div className="flex justify-between items-center text-xs">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Batch Contract Volume</span>
              <span className="text-xs font-bold text-emerald-600">{qualityGrade}</span>
            </div>
            <h3 className="text-2xl font-black font-display text-slate-900">
              {counterVolumeKg.toLocaleString()} <span className="text-xs font-bold text-slate-400">kg/wk</span>
            </h3>
            <p className="text-[11px] font-bold text-slate-500">
              Total Escrow: Rs. {totalContractVal.toLocaleString()}
            </p>
          </div>

          {/* Extra Grower Profit */}
          <div className="p-5 bg-white/85 backdrop-blur-xl border border-white/90 shadow-lg shadow-slate-200/40 ring-1 ring-slate-900/5 rounded-3xl space-y-1">
            <div className="flex justify-between items-center text-xs">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Net Grower Extra Gain</span>
              <span className="text-xs font-black text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">Zero Broker Cut</span>
            </div>
            <h3 className="text-2xl font-black font-display text-emerald-600">
              +Rs. {Math.max(0, Math.round(farmerExtraVsBroker)).toLocaleString()}
            </h3>
            <p className="text-[11px] font-bold text-slate-500">
              Net payout: Rs. {farmerNetPayout.toLocaleString()}
            </p>
          </div>
        </div>

        {/* 3. AGROLINK AI DEAL SENTINEL & ONE-CLICK RECOMMENDATION BANNER */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-sky-500/5 backdrop-blur-xl rounded-3xl border border-emerald-300/80 shadow-lg shadow-emerald-500/5 ring-1 ring-emerald-400/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-600/30">
              <Bot className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-black text-slate-900 font-display">AgroLink AI Deal Sentinel Recommendation</h4>
                <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-extrabold uppercase tracking-wide">
                  Optimal Win-Win
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium leading-relaxed max-w-3xl">
                Settling at <strong>Rs. {currentDeal.aiOptimalPrice}.00/kg</strong> with a <strong>{currentDeal.aiOptimalVolume} kg weekly commitment</strong> gives the producer <strong>+{Math.round(((currentDeal.aiOptimalPrice - currentDeal.brokerPrice)/currentDeal.brokerPrice)*100)}% extra take-home profit</strong> over traditional brokers while keeping {currentDeal.buyer.name.split('(')[0]} <strong>{Math.round(((currentDeal.spotPrice - currentDeal.aiOptimalPrice)/currentDeal.spotPrice)*100)}% below Pettah spot rates</strong>.
              </p>
            </div>
          </div>

          <button
            onClick={handleApplyAiRecommendation}
            disabled={isAiOptimizing}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold text-xs rounded-2xl shadow-md hover:shadow-lg shadow-emerald-600/25 transition-all flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 text-emerald-200" />
            <span>{isAiOptimizing ? 'Optimizing Terms...' : `Apply AI Terms (Rs. ${currentDeal.aiOptimalPrice}/kg)`}</span>
          </button>
        </div>

        {/* 4. EXECUTED CONTRACT BANNER (WHEN ACCEPTED) */}
        {contractCreated && (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="p-6 bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-emerald-500/5 backdrop-blur-xl rounded-3xl border border-emerald-300 shadow-xl shadow-emerald-500/10 space-y-4 ring-1 ring-emerald-500/20"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-600 text-white rounded-2xl shadow-md shadow-emerald-600/30">
                  <FileText className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-lg font-black font-display text-slate-900">B2B Smart Contract Ratified &amp; Escrow Locked! 🔒</h3>
                  <p className="text-xs text-emerald-700 font-bold flex items-center gap-1.5">
                    <span>Smart Contract Hash: #AGRO-B2B-ESCROW-2026-8941</span>
                    {isSigned && (
                      <span className="bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Digitally Signed
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowTermSheetModal(true)}
                  className="px-4 py-2 bg-white text-emerald-950 font-black text-xs rounded-full border border-emerald-300 shadow-xs flex items-center gap-1.5 cursor-pointer hover:bg-slate-50 transition"
                >
                  <Eye className="w-3.5 h-3.5" /> View / Sign Agreement
                </button>
                <span className="px-4 py-2 bg-emerald-600 text-white font-black text-xs rounded-full shadow-md flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-200" /> Binding Agreement Enforced
                </span>
              </div>
            </div>

            <div className="p-4 bg-white/90 backdrop-blur-sm rounded-2xl border border-emerald-200/80 text-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 font-semibold text-slate-800 shadow-xs">
              <span>
                Locked Terms: <strong className="text-emerald-700 font-black">{counterVolumeKg} kg / week @ Rs. {counterPrice}.00 / kg ({includeTransport ? 'Cold Transport Included' : 'Self Pickup'})</strong>
              </span>
              <span className="text-emerald-700 font-black font-display text-sm">Total Weekly Escrow: Rs. {totalContractVal.toLocaleString()}</span>
            </div>
          </motion.div>
        )}

        {/* MOBILE SEGMENTED VIEW CONTROLLER */}
        <div className="flex lg:hidden bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-black">
          <button
            onClick={() => setActiveMobileTab('chat')}
            className={`flex-1 py-2 rounded-xl transition ${
              activeMobileTab === 'chat' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
            }`}
          >
            💬 Timeline Chat ({messages.length})
          </button>
          <button
            onClick={() => setActiveMobileTab('studio')}
            className={`flex-1 py-2 rounded-xl transition ${
              activeMobileTab === 'studio' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
            }`}
          >
            🎛️ Counter-Offer Studio
          </button>
        </div>

        {/* 5. MAIN TWO-COLUMN WORKSPACE: CHAT THREAD & PARAMETER STUDIO */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: LIVE BARGAINING CHAT TIMELINE (7 Cols) */}
          <div className={`lg:col-span-7 bg-white/85 backdrop-blur-xl p-6 sm:p-7 rounded-3xl border border-white/90 shadow-xl shadow-slate-200/40 ring-1 ring-slate-900/5 space-y-5 ${
            activeMobileTab === 'studio' ? 'hidden lg:block' : 'block'
          }`}>
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 font-display flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-emerald-600" /> Live Negotiation Timeline
                </h3>
                <p className="text-xs text-slate-400 font-medium">{currentDeal.buyer.name} ↔ {currentDeal.farmer.name}</p>
              </div>
              <span className="px-3.5 py-1.5 bg-emerald-50 text-emerald-800 text-xs font-black rounded-full border border-emerald-200 shadow-xs flex items-center gap-1.5">
                <span>{currentDeal.icon}</span>
                <span>{currentDeal.commodity} ({qualityGrade})</span>
              </span>
            </div>

            {/* MESSAGES SCROLL CONTAINER */}
            <div className="space-y-4 py-2 max-h-[500px] overflow-y-auto pr-2">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col max-w-[88%] ${
                    m.sender === 'FARMER' ? 'ml-auto items-end' : 'items-start'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1 px-1">
                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider">
                      {m.senderName}
                    </span>
                    <span className="text-[10px] text-slate-300 font-bold">• {m.time}</span>
                  </div>

                  <div
                    className={`p-4 rounded-3xl text-xs font-medium space-y-2 leading-relaxed shadow-sm transition-all ${
                      m.sender === 'FARMER'
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-br-none shadow-emerald-600/20'
                        : 'bg-slate-100/90 text-slate-800 rounded-bl-none border border-slate-200/60'
                    }`}
                  >
                    <p>{m.text}</p>

                    {/* PROPOSAL BADGE INSIDE CHAT */}
                    {m.isProposal && (
                      <div
                        className={`p-3.5 rounded-2xl border text-xs font-semibold shadow-xs space-y-1.5 ${
                          m.sender === 'FARMER'
                            ? 'bg-emerald-700/60 border-emerald-400/50 text-emerald-50'
                            : 'bg-white/95 border-slate-200 text-slate-900'
                        }`}
                      >
                        <div className="flex justify-between items-center font-display">
                          <span className="font-extrabold text-sm">Proposed Price: Rs. {m.proposedPrice}/kg</span>
                          <span className="font-bold">Batch: {m.proposedVolume} kg</span>
                        </div>
                        {m.proposedTerms && (
                          <div className="text-[10px] font-bold opacity-80 flex items-center gap-1">
                            <Layers className="w-3 h-3" />
                            <span>Terms: {m.proposedTerms}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* BUYER TYPING SIMULATION INDICATOR */}
              {isBuyerTyping && (
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 p-2 animate-pulse">
                  <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]" />
                  <span>{currentDeal.buyer.name.split('(')[0]} is typing...</span>
                </div>
              )}
            </div>

            {/* QUICK RESPONSE CHIPS */}
            <div className="space-y-1.5 pt-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Quick Settlement Suggestions:</span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  `🤝 Agree at Rs. ${currentDeal.aiOptimalPrice}/kg for ${currentDeal.aiOptimalVolume}kg commitment`,
                  `🚚 Cold-Chain Reefer included to ${currentDeal.deliveryLocation.split(' ')[0]}`,
                  `📦 Can guarantee ${qualityGrade} quality SLA certificate`,
                  `⚡ Immediate escrow locking upon final signoff`
                ].map((chip, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleQuickChip(chip)}
                    className="px-2.5 py-1 rounded-xl bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 border border-slate-200 text-[11px] font-bold text-slate-600 hover:text-emerald-800 transition cursor-pointer"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>

            {/* TEXT MESSAGE INPUT FORM */}
            <form onSubmit={handleSendMessage} className="pt-2 border-t border-slate-100 flex gap-2">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Type message, counter-terms, or special conditions..."
                className="w-full p-3.5 rounded-2xl border border-slate-200/90 bg-white/80 backdrop-blur-sm text-xs font-semibold focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-slate-900 transition-all placeholder:text-slate-400 shadow-inner"
              />
              <button
                type="submit"
                className="px-5 py-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold text-xs rounded-2xl shadow-md hover:shadow-lg shadow-emerald-600/25 transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <Send className="w-3.5 h-3.5" /> Send
              </button>
            </form>
          </div>

          {/* RIGHT: INTERACTIVE COUNTER-OFFER STUDIO & INTERACTIVE PRICE VISUALIZER (5 Cols) */}
          <div className={`lg:col-span-5 bg-white/85 backdrop-blur-xl p-6 sm:p-7 rounded-3xl border border-white/90 shadow-xl shadow-slate-200/40 ring-1 ring-slate-900/5 space-y-5 ${
            activeMobileTab === 'chat' ? 'hidden lg:block' : 'block'
          }`}>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 font-display flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-emerald-600" /> Counter-Offer Studio
                </h3>
                <p className="text-xs text-slate-400 font-medium">Configure legally binding contract parameters</p>
              </div>
              <span className="px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-800 text-[10px] font-black uppercase border border-emerald-200 shadow-xs">
                Escrow Config
              </span>
            </div>

            {/* PRICE SLIDER */}
            <div className="p-4 bg-slate-50/80 backdrop-blur-md rounded-2xl border border-slate-200/70 space-y-3 shadow-xs">
              <div className="flex justify-between items-center text-xs">
                <span className="font-extrabold text-slate-600">Unit Price Proposal:</span>
                <span className="text-lg font-black text-emerald-600 font-display">Rs. {counterPrice}.00 / kg</span>
              </div>

              <input
                type="range"
                min={currentDeal.minPrice}
                max={currentDeal.maxPrice}
                step="1"
                value={counterPrice}
                onChange={(e) => setCounterPrice(parseInt(e.target.value, 10))}
                className="w-full accent-emerald-600 cursor-pointer h-2.5 bg-slate-200/80 rounded-lg"
              />

              {/* 🌟 UPGRADED: INTERACTIVE PRICE RANGE VISUALIZER */}
              <div className="pt-2 space-y-2 border-t border-slate-200/60">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-slate-400">
                  <span>Market Spread Range Telemetry</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                    counterPrice <= currentDeal.aiOptimalPrice + 4
                      ? 'bg-emerald-100 text-emerald-800'
                      : counterPrice <= currentDeal.farmer.askingPrice
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}>
                    {counterPrice <= currentDeal.aiOptimalPrice + 4
                      ? '⚡ Optimal Win-Win Zone'
                      : counterPrice <= currentDeal.farmer.askingPrice
                      ? '⚖️ Moderate Resistance'
                      : '⚠️ Above Spot Price'}
                  </span>
                </div>

                {/* VISUAL GRADIENT SPREAD BAR WITH LIVE PINPOINT */}
                <div className="relative h-6 bg-slate-200 rounded-xl overflow-visible p-0.5 flex items-center">
                  {/* Zone: Broker Low */}
                  <div
                    className="h-full bg-slate-300 rounded-l-lg"
                    style={{ width: `${buyerTargetPct}%` }}
                    title={`Broker Rate: Rs. ${currentDeal.brokerPrice}`}
                  />
                  {/* Zone: Buyer to AI Zone */}
                  <div
                    className="h-full bg-teal-400/40"
                    style={{ width: `${aiOptimalPct - buyerTargetPct}%` }}
                    title={`Buyer Target: Rs. ${currentDeal.buyer.initialBudget}`}
                  />
                  {/* Zone: AI Equilibrium Sweet Spot */}
                  <div
                    className="h-full bg-emerald-500/80"
                    style={{ width: `${farmerAskingPct - aiOptimalPct}%` }}
                    title={`AI Sweet Spot: Rs. ${currentDeal.aiOptimalPrice}`}
                  />
                  {/* Zone: Farmer High / Spot */}
                  <div
                    className="h-full bg-amber-400/50 rounded-r-lg"
                    style={{ width: `${100 - farmerAskingPct}%` }}
                    title={`Spot Market: Rs. ${currentDeal.spotPrice}`}
                  />

                  {/* ACTIVE USER PRICE PINPOINT POINTER */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white border-2 border-emerald-600 rounded-full shadow-lg flex items-center justify-center -ml-2.5 transition-all duration-150 z-20 pointer-events-none"
                    style={{ left: `${currentPricePct}%` }}
                  >
                    <div className="w-2 h-2 rounded-full bg-emerald-600" />
                  </div>
                </div>

                {/* LABELS BELOW VISUALIZER */}
                <div className="grid grid-cols-4 text-[9px] font-bold text-slate-500 text-center gap-1">
                  <div>
                    <span className="block text-slate-400">Broker</span>
                    <span className="font-extrabold text-slate-600">Rs.{currentDeal.brokerPrice}</span>
                  </div>
                  <div>
                    <span className="block text-sky-600">Buyer Target</span>
                    <span className="font-extrabold text-sky-700">Rs.{currentDeal.buyer.initialBudget}</span>
                  </div>
                  <div>
                    <span className="block text-emerald-600">AI Optimal</span>
                    <span className="font-black text-emerald-700">Rs.{currentDeal.aiOptimalPrice}</span>
                  </div>
                  <div>
                    <span className="block text-amber-600">Pettah Spot</span>
                    <span className="font-extrabold text-amber-700">Rs.{currentDeal.spotPrice}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* VOLUME SLIDER & PRESET BUTTONS */}
            <div className="p-4 bg-slate-50/80 backdrop-blur-md rounded-2xl border border-slate-200/70 space-y-2.5 shadow-xs">
              <div className="flex justify-between items-center text-xs">
                <span className="font-extrabold text-slate-600">Batch Volume Commitment:</span>
                <span className="text-sm font-black text-slate-900 font-display">{counterVolumeKg.toLocaleString()} kg</span>
              </div>
              <input
                type="range"
                min="200"
                max="2500"
                step="50"
                value={counterVolumeKg}
                onChange={(e) => setCounterVolumeKg(parseInt(e.target.value, 10))}
                className="w-full accent-emerald-600 cursor-pointer h-2 bg-slate-200/80 rounded-lg"
              />

              <div className="grid grid-cols-4 gap-1.5 pt-1 text-[11px] font-extrabold">
                {[300, 500, 600, 1000].map((vol) => (
                  <button
                    key={vol}
                    type="button"
                    onClick={() => setCounterVolumeKg(vol)}
                    className={`py-1.5 rounded-xl border transition-all duration-200 cursor-pointer ${
                      counterVolumeKg === vol
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    {vol} kg
                  </button>
                ))}
              </div>
            </div>

            {/* FREQUENCY & QUALITY PILLS */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50/80 backdrop-blur-md rounded-2xl border border-slate-200/70 space-y-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Frequency</span>
                <div className="flex gap-1">
                  {['weekly', 'spot'].map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setFrequency(f)}
                      className={`flex-1 py-1 text-[10px] font-extrabold rounded-lg border transition ${
                        frequency === f
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-white text-slate-600 border-slate-200'
                      }`}
                    >
                      {f === 'weekly' ? 'Weekly' : 'Spot'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-slate-50/80 backdrop-blur-md rounded-2xl border border-slate-200/70 space-y-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Quality Standard</span>
                <div className="flex gap-1">
                  {['Grade A', 'Grade B'].map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => setQualityGrade(q)}
                      className={`flex-1 py-1 text-[10px] font-extrabold rounded-lg border transition ${
                        qualityGrade.includes(q)
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-white text-slate-600 border-slate-200'
                      }`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* TRANSPORT TOGGLE */}
            <div className="p-3.5 bg-slate-50/80 backdrop-blur-md rounded-2xl border border-slate-200/70 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-extrabold text-slate-900 block">Include Farmgate Reefer Delivery</span>
                  <span className="text-[10px] text-slate-500 font-medium">To {currentDeal.deliveryLocation} (Rs. {currentDeal.logisticsFee.toLocaleString()})</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={includeTransport}
                onChange={(e) => setIncludeTransport(e.target.checked)}
                className="w-5 h-5 accent-emerald-600 rounded-lg cursor-pointer"
              />
            </div>

            {/* REAL-TIME FINANCIAL PROFIT CARD */}
            <div className="p-4 bg-gradient-to-br from-emerald-50/90 via-teal-50/50 to-white backdrop-blur-xl rounded-2xl border border-emerald-200/80 shadow-md ring-1 ring-emerald-400/20 space-y-2 text-xs text-slate-700">
              <div className="flex justify-between text-slate-500 font-semibold">
                <span>Total Batch Value (Escrow Deposit):</span>
                <strong className="text-slate-900 font-display font-extrabold">Rs. {totalContractVal.toLocaleString()}</strong>
              </div>
              <div className="flex justify-between text-slate-500 font-semibold">
                <span>Buyer Savings vs Retail Spot:</span>
                <strong className="text-emerald-700 font-display font-black">Rs. {buyerSavingsVsSpot > 0 ? buyerSavingsVsSpot.toLocaleString() : 0}</strong>
              </div>
              <div className="flex justify-between text-slate-500 font-semibold">
                <span>Logistics Reefer Deductible:</span>
                <strong className="text-slate-700 font-display">Rs. {logisticsFee.toLocaleString()}</strong>
              </div>
              <div className="pt-2.5 border-t border-emerald-200/60 flex justify-between items-baseline text-sm">
                <span className="text-slate-800 font-black">Net Grower Take-Home:</span>
                <span className="text-xl font-black text-emerald-600 font-display">
                  Rs. {farmerNetPayout.toLocaleString()}
                </span>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="space-y-2.5 pt-1">
              <button
                onClick={handleSendCounterOffer}
                className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-extrabold text-xs rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sliders className="w-4 h-4 text-emerald-400" />
                <span>Submit Counter-Offer to Timeline 📨</span>
              </button>

              {!contractCreated ? (
                <button
                  onClick={handleAcceptOffer}
                  className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-95 text-white font-black text-xs rounded-2xl shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  <span>Accept Terms &amp; Lock Smart Escrow Contract 🔒</span>
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setShowTermSheetModal(true)}
                    className="py-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-extrabold text-xs rounded-2xl transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <PenTool className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{isSigned ? 'View Signed Sheet' : 'E-Sign Term Sheet'}</span>
                  </button>
                  <Link
                    to="/orders"
                    className="py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-2xl transition flex items-center justify-center gap-1.5 shadow-md"
                  >
                    <span>Track Orders →</span>
                  </Link>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* 6. SMART ESCROW TERM SHEET MODAL WITH DIGITAL SIGNATURE PAD */}
      <AnimatePresence>
        {showTermSheetModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 relative max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900 font-display">
                      AgroLink B2B Smart Escrow Term Sheet
                    </h3>
                    <p className="text-xs text-slate-400">Cryptographic Binding Agreement #AGRO-B2B-ESCROW-2026-8941</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowTermSheetModal(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* CONTRACT CLAUSES GRID */}
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <div>
                    <span className="text-[10px] font-black uppercase text-slate-400 block">Buyer Entity</span>
                    <span className="font-extrabold text-slate-800">{currentDeal.buyer.name}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase text-slate-400 block">Seller Entity</span>
                    <span className="font-extrabold text-slate-800">{currentDeal.farmer.name}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase text-slate-400 block">Commodity &amp; Grade</span>
                    <span className="font-extrabold text-emerald-700">{currentDeal.commodity} ({qualityGrade})</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase text-slate-400 block">Agreed Settlement Rate</span>
                    <span className="font-extrabold text-emerald-700">Rs. {counterPrice}.00 / kg</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase text-slate-400 block">Batch Volume</span>
                    <span className="font-extrabold text-slate-800">{counterVolumeKg} kg ({frequency.toUpperCase()})</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase text-slate-400 block">Weekly Escrow Value</span>
                    <span className="font-extrabold text-slate-800">Rs. {totalContractVal.toLocaleString()}</span>
                  </div>
                </div>

                <div className="space-y-2 p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 text-emerald-950">
                  <span className="font-black uppercase text-[10px] tracking-wider text-emerald-800 block">
                    🔒 Binding Smart Contract Clauses
                  </span>
                  <ul className="space-y-1.5 text-xs">
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span><strong>100% Escrow Collateral:</strong> Funds locked in AgroLink Central Bank Verified Vault prior to dispatch.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span><strong>Logistics SLA:</strong> Temperature-controlled reefer fleet to {currentDeal.deliveryLocation}.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span><strong>Dispute Resolution:</strong> Department of Agriculture automated mediation window (12 hours).</span>
                    </li>
                  </ul>
                </div>

                {/* 🌟 UPGRADED: DIGITAL SIGNATURE PAD SECTION */}
                <div className="p-4 bg-slate-50/90 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-black uppercase text-[10px] tracking-wider text-slate-700 flex items-center gap-1.5">
                      <PenTool className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Authorized Producer E-Signature &amp; Verification</span>
                    </span>
                    {isSigned ? (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-emerald-600" /> Cryptographically Ratified
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-amber-600">Awaiting Producer Signature</span>
                    )}
                  </div>

                  {/* SIGNATURE CANVAS */}
                  <div className="space-y-2">
                    <div className="relative border-2 border-dashed border-slate-300 rounded-2xl bg-white overflow-hidden">
                      <canvas
                        ref={canvasRef}
                        width={500}
                        height={100}
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        onTouchStart={startDrawing}
                        onTouchMove={draw}
                        onTouchEnd={stopDrawing}
                        className="w-full h-[100px] cursor-crosshair block"
                      />
                      {!signatureData && !isSigned && (
                        <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-slate-300 text-xs font-semibold">
                          Sign with mouse, stylus or touch here ✍️
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={clearSignature}
                          className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 text-[11px] font-extrabold rounded-lg transition flex items-center gap-1 cursor-pointer"
                        >
                          <RotateCcw className="w-3 h-3" /> Clear
                        </button>
                        <button
                          type="button"
                          onClick={generateAutoSignature}
                          className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-[11px] font-extrabold rounded-lg transition flex items-center gap-1 cursor-pointer"
                        >
                          <Zap className="w-3 h-3 text-emerald-600" /> Auto-Stamp E-Sign
                        </button>
                      </div>

                      {!isSigned && signatureData && (
                        <button
                          type="button"
                          onClick={finalizeSignContract}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-extrabold rounded-lg shadow-xs transition flex items-center gap-1 cursor-pointer"
                        >
                          <Check className="w-3 h-3" /> Confirm Signature
                        </button>
                      )}
                    </div>
                  </div>

                  {/* CRYPTOGRAPHIC AUDIT SEAL */}
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-[10px] text-slate-500 flex items-center justify-between flex-wrap gap-2">
                    <span className="font-mono flex items-center gap-1">
                      <Hash className="w-3 h-3 text-slate-400" /> SHA-256: 8f4a9b23c...e71c902
                    </span>
                    <span className="font-bold text-slate-400">
                      Timestamp: {new Date().toLocaleDateString()} • TLS 1.3 Escrow Lock
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 font-extrabold text-xs rounded-xl shadow-xs hover:bg-slate-50 transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Signed PDF</span>
                </button>
                <button
                  onClick={() => setShowTermSheetModal(false)}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TradeNegotiation;
