import React, { useState, useEffect } from 'react';
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
  Truck
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { negotiationAPI } from '../services/api';

export const TradeNegotiation = () => {
  const [contractCreated, setContractCreated] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  
  // Interactive Counter-Offer State
  const [counterPrice, setCounterPrice] = useState(195);
  const [counterVolumeKg, setCounterVolumeKg] = useState(500);
  const [includeTransport, setIncludeTransport] = useState(true);

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'BUYER',
      senderName: 'Keells Procurement (Colombo Central)',
      text: 'Greetings Bandara. We require 500kg Grade-A Tomatoes weekly for our Western Province stores.',
      time: '10:30 AM',
      isProposal: false
    },
    {
      id: 2,
      sender: 'FARMER',
      senderName: 'Bandara Organic Farm (Welimada)',
      text: 'Hello! I have prime harvest ready. Wholesale spot price is Rs. 210/kg, but I can offer Rs. 200/kg for a guaranteed weekly contract.',
      time: '10:32 AM',
      isProposal: false
    },
    {
      id: 3,
      sender: 'BUYER',
      senderName: 'Keells Procurement',
      text: 'Our budget allows Rs. 185/kg if we commit to a 3-month recurring tender.',
      time: '10:34 AM',
      isProposal: true,
      proposedPrice: 185,
      proposedVolume: 500
    }
  ]);

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

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        sender: 'BUYER',
        senderName: 'Keells Procurement',
        text: messageInput,
        time: 'Just now',
        isProposal: false
      }
    ]);
    setMessageInput('');
  };

  const handleSendCounterOffer = () => {
    const newMsg = {
      id: Date.now(),
      sender: 'FARMER',
      senderName: 'Bandara Organic Farm',
      text: `Submitted formal counter-offer: Rs. ${counterPrice}/kg for ${counterVolumeKg}kg weekly (${includeTransport ? 'Farmgate Transport Included' : 'Self Pickup'}).`,
      time: 'Just now',
      isProposal: true,
      proposedPrice: counterPrice,
      proposedVolume: counterVolumeKg
    };
    setMessages((prev) => [...prev, newMsg]);
  };

  const handleAcceptOffer = async () => {
    try {
      await negotiationAPI.acceptOffer();
    } catch (err) {
      // fallback
    }
    setContractCreated(true);
  };

  // Math Calculations for Active Proposal
  const totalContractVal = counterPrice * counterVolumeKg;
  const spotMarketVal = 210 * counterVolumeKg;
  const buyerSavings = spotMarketVal - totalContractVal;
  const logisticsFee = includeTransport ? 6500 : 0;
  const farmerNetPayout = totalContractVal - logisticsFee;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8 animate-fade-in">
      
      {/* HEADER BANNER */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white shadow-2xl relative overflow-hidden border border-emerald-800/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-extrabold uppercase tracking-wider border border-emerald-500/30">
              <Scale className="w-4 h-4 text-emerald-400" />
              <span>B2B Multi-Party Price Negotiation Protocol</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-display text-white">
              Real-Time Trade &amp; Counter-Offer Room 🤝
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-3xl leading-relaxed">
              Negotiate wholesale batch prices, counter-propose custom weekly delivery volumes, and lock agreed terms into binding escrow smart contracts.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="px-4 py-2.5 bg-white/10 backdrop-blur-md rounded-2xl text-xs font-bold text-emerald-300 border border-white/20 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Escrow Vault Ready</span>
            </div>
          </div>
        </div>
      </div>

      {/* B2B EXECUTED CONTRACT BANNER */}
      {contractCreated && (
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="p-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 rounded-3xl text-white shadow-2xl space-y-4 border border-emerald-400/40"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/10 rounded-2xl">
                <FileText className="w-8 h-8 text-emerald-200" />
              </div>
              <div>
                <h3 className="text-lg font-black font-display">B2B Smart Contract Signed &amp; Escrow Locked! 🔒</h3>
                <p className="text-xs text-emerald-100 font-medium">Smart Contract Hash: #AGRO-B2B-ESCROW-2026-8941</p>
              </div>
            </div>
            <span className="px-4 py-1.5 bg-white text-emerald-950 font-black text-xs rounded-full shadow-md flex items-center gap-1.5 self-start sm:self-auto">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Binding Agreement Enforced
            </span>
          </div>

          <div className="p-4 bg-white/10 rounded-2xl border border-white/20 text-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 font-semibold">
            <span>
              Locked Terms: <strong className="text-white font-black">{counterVolumeKg} kg / week @ Rs. {counterPrice}.00 / kg ({includeTransport ? 'Transport Included' : 'Self Pickup'})</strong>
            </span>
            <span className="text-emerald-200 font-bold">Total Batch Escrow: Rs. {totalContractVal.toLocaleString()}</span>
          </div>
        </motion.div>
      )}

      {/* TWO COLUMN WORKSPACE: CHAT THREAD & COUNTER-OFFER SLIDER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT: LIVE BARGAINING CHAT TIMELINE (7 Cols) */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-lg space-y-5">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 font-display flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-600" /> Live Negotiation Thread
              </h3>
              <p className="text-xs text-slate-400">Keells Procurement Hub ↔ Bandara Organic Farm</p>
            </div>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-full border border-emerald-200">
              🍅 Tomato (Grade A)
            </span>
          </div>

          {/* MESSAGES SCROLL CONTAINER */}
          <div className="space-y-4 py-2 max-h-[420px] overflow-y-auto pr-2">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col max-w-[88%] ${
                  m.sender === 'FARMER' ? 'ml-auto items-end' : 'items-start'
                }`}
              >
                <span className="text-[10px] text-slate-400 font-bold mb-1 px-1">
                  {m.senderName} • {m.time}
                </span>

                <div
                  className={`p-4 rounded-3xl text-xs font-medium space-y-2 leading-relaxed shadow-sm ${
                    m.sender === 'FARMER'
                      ? 'bg-emerald-600 text-white rounded-br-none'
                      : 'bg-slate-100 text-slate-800 rounded-bl-none'
                  }`}
                >
                  <p>{m.text}</p>

                  {/* PROPOSAL BADGE INSIDE CHAT */}
                  {m.isProposal && (
                    <div
                      className={`p-3 rounded-2xl border text-xs font-semibold ${
                        m.sender === 'FARMER'
                          ? 'bg-emerald-700/70 border-emerald-500/60 text-emerald-100'
                          : 'bg-white border-slate-200 text-slate-900'
                      }`}
                    >
                      <div className="flex justify-between items-center font-display">
                        <span className="font-extrabold">Proposed Price: Rs. {m.proposedPrice}/kg</span>
                        <span>Volume: {m.proposedVolume} kg</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* TEXT MESSAGE INPUT FORM */}
          <form onSubmit={handleSendMessage} className="pt-3 border-t border-slate-100 flex gap-2">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Type message or negotiation terms..."
              className="w-full p-3 rounded-2xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-2xl shadow-md transition flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Send className="w-3.5 h-3.5" /> Send
            </button>
          </form>
        </div>

        {/* RIGHT: INTERACTIVE COUNTER-OFFER SLIDER & ESCROW LOCK (5 Cols) */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 font-display flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-600" /> Counter-Offer Builder
              </h3>
              <p className="text-xs text-slate-400 font-medium">Fine-tune price &amp; volume parameters</p>
            </div>
            <span className="px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10px] font-black uppercase">
              Interactive
            </span>
          </div>

          {/* PRICE SLIDER */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-600">Unit Price Proposal:</span>
              <span className="text-lg font-black text-emerald-600 font-display">Rs. {counterPrice}.00 / kg</span>
            </div>
            <input
              type="range"
              min="160"
              max="240"
              step="5"
              value={counterPrice}
              onChange={(e) => setCounterPrice(parseInt(e.target.value, 10))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
              <span>Rs. 160 (Buyer Target)</span>
              <span>Rs. 200 (Fair)</span>
              <span>Rs. 240 (Spot)</span>
            </div>
          </div>

          {/* VOLUME SLIDER & PRESET BUTTONS */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-600">Weekly Batch Volume:</span>
              <span className="text-sm font-black text-slate-900 font-display">{counterVolumeKg} kg / week</span>
            </div>
            <input
              type="range"
              min="200"
              max="2000"
              step="50"
              value={counterVolumeKg}
              onChange={(e) => setCounterVolumeKg(parseInt(e.target.value, 10))}
              className="w-full accent-emerald-600 cursor-pointer"
            />

            <div className="grid grid-cols-4 gap-1.5 pt-1 text-[11px] font-bold">
              {[250, 500, 1000, 2000].map((vol) => (
                <button
                  key={vol}
                  type="button"
                  onClick={() => setCounterVolumeKg(vol)}
                  className={`py-1 rounded-lg border transition cursor-pointer ${
                    counterVolumeKg === vol
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {vol} kg
                </button>
              ))}
            </div>
          </div>

          {/* TRANSPORT TOGGLE */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-emerald-600" />
              <div>
                <span className="text-xs font-bold text-slate-900 block">Include Farmgate Reefer Delivery</span>
                <span className="text-[10px] text-slate-500 font-medium">Delivered to Keells Colombo Hub</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={includeTransport}
              onChange={(e) => setIncludeTransport(e.target.checked)}
              className="w-5 h-5 accent-emerald-600 rounded cursor-pointer"
            />
          </div>

          {/* REAL-TIME PROFIT BREAKDOWN CARD */}
          <div className="p-4 bg-slate-950 text-white rounded-2xl border border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Total Weekly Batch Value:</span>
              <strong className="text-white font-display">Rs. {totalContractVal.toLocaleString()}</strong>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Buyer Savings vs Spot (Rs. 210):</span>
              <strong className="text-emerald-400 font-display">Rs. {buyerSavings > 0 ? buyerSavings.toLocaleString() : 0}</strong>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Estimated Logistics Deductible:</span>
              <strong className="text-slate-300 font-display">Rs. {logisticsFee.toLocaleString()}</strong>
            </div>
            <div className="pt-2 border-t border-slate-800 flex justify-between items-baseline text-sm">
              <span className="text-slate-300 font-bold">Net Farmer Payout:</span>
              <span className="text-xl font-black text-emerald-400 font-display">
                Rs. {farmerNetPayout.toLocaleString()}
              </span>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="space-y-2 pt-1">
            <button
              onClick={handleSendCounterOffer}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sliders className="w-4 h-4 text-emerald-400" />
              <span>Submit Counter-Offer to Timeline 📨</span>
            </button>

            {!contractCreated ? (
              <button
                onClick={handleAcceptOffer}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                <span>Accept Terms &amp; Lock Smart Escrow Contract 🔒</span>
              </button>
            ) : (
              <Link
                to="/orders"
                className="w-full py-3 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-extrabold text-xs rounded-xl transition flex items-center justify-center gap-1.5"
              >
                <span>Track Active Escrow Orders →</span>
              </Link>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default TradeNegotiation;
