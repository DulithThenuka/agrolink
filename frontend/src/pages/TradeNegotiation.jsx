import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, CheckCircle2, FileText, Send, User, ShieldCheck, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';

export const TradeNegotiation = () => {
  const [contractCreated, setContractCreated] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'BUYER', text: 'I need 500kg tomatoes every week.', time: '10:30 AM' },
    { sender: 'FARMER', text: 'I can supply 350kg this week and 500kg starting next week.', time: '10:32 AM' },
    { sender: 'BUYER', text: 'Rs. 190/kg?', time: '10:34 AM' },
    { sender: 'FARMER', text: 'Rs. 200/kg including delivery.', time: '10:35 AM' },
  ]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    setMessages([
      ...messages,
      { sender: 'BUYER', text: messageInput, time: 'Just now' },
    ]);
    setMessageInput('');
  };

  const handleAcceptOffer = () => {
    setContractCreated(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-8 animate-fade-in">
      {/* HEADER BANNER */}
      <div className="glass rounded-3xl p-8 border border-white/80 shadow-2xl bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-950 text-white relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <MessageSquare className="w-4 h-4 text-emerald-400" /> B2B Trade Negotiation Protocol
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-display flex items-center gap-3">
            Buyer ↔ Farmer Negotiation 💬
          </h1>
          <p className="text-emerald-100/80 text-sm max-w-2xl">
            Negotiate weekly supply volumes, custom pricing per Kg, and execute binding B2B trade contracts.
          </p>
        </div>
      </div>

      {/* B2B CONTRACT BANNER */}
      {contractCreated && (
        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="p-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 rounded-3xl text-white shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-emerald-200" />
              <div>
                <h3 className="text-lg font-extrabold font-display">B2B Smart Contract Executed & Signed</h3>
                <p className="text-xs text-emerald-100 font-semibold">Contract Reference ID: #AGRO-B2B-8924</p>
              </div>
            </div>
            <span className="px-4 py-1.5 bg-white text-emerald-950 font-extrabold text-xs rounded-full shadow-md flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Binding Contract Active
            </span>
          </div>
          <div className="p-4 bg-white/10 rounded-2xl border border-white/10 text-xs flex justify-between items-center font-semibold">
            <span>Agreed Terms: <strong className="text-white font-extrabold">500kg / week @ Rs. 200/kg (Delivery Included)</strong></span>
            <span className="text-emerald-200">Escrow Payment Locked</span>
          </div>
        </motion.div>
      )}

      {/* MAIN CHAT & TERMS CONTAINER */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* CHAT THREAD */}
        <div className="lg:col-span-7 premium-card p-6 bg-white border border-slate-100/90 shadow-lg space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-display">Live Trade Conversation</h3>
              <p className="text-xs text-slate-400">Colombo Wholesale ↔ Nuwara Eliya Organic Farm</p>
            </div>
            <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-full">🍅 Tomato (Grade A)</span>
          </div>

          {/* MESSAGES LIST */}
          <div className="space-y-3 py-2 max-h-96 overflow-y-auto pr-1">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 items-start max-w-[85%] ${
                  msg.sender === 'FARMER' ? 'ml-auto justify-end' : ''
                }`}
              >
                {msg.sender === 'BUYER' && (
                  <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0">👤</div>
                )}
                <div
                  className={`p-3.5 rounded-2xl text-xs font-semibold space-y-1 ${
                    msg.sender === 'FARMER'
                      ? 'bg-emerald-600 text-white text-right shadow-md'
                      : 'bg-slate-100 text-slate-800'
                  }`}
                >
                  <span className={`text-[10px] font-bold block uppercase ${msg.sender === 'FARMER' ? 'text-emerald-200' : 'text-slate-400'}`}>
                    {msg.sender === 'BUYER' ? 'Buyer' : 'Farmer'} • {msg.time}
                  </span>
                  <p>{msg.text}</p>
                </div>
                {msg.sender === 'FARMER' && (
                  <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shrink-0">🧑‍🌾</div>
                )}
              </div>
            ))}
          </div>

          {/* SEND MESSAGE FORM */}
          <form onSubmit={handleSendMessage} className="pt-3 border-t border-slate-100 flex gap-2">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Type counter offer or message..."
              className="input-premium text-xs flex-1"
            />
            <button type="submit" className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center gap-1">
              <Send className="w-3.5 h-3.5" /> Send
            </button>
          </form>
        </div>

        {/* PROPOSAL TERMS & ACCEPTANCE */}
        <div className="lg:col-span-5 premium-card p-6 bg-white border border-slate-100/90 shadow-lg space-y-5">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900 font-display">Active Counter-Proposal Terms</h3>
            <p className="text-xs text-slate-400">Review terms before accepting binding agreement</p>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                <span>Proposed Unit Price:</span>
                <span className="text-base font-extrabold text-emerald-600 font-display">Rs. 200.00/kg</span>
              </div>
              <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                <span>Weekly Supply Volume:</span>
                <span className="text-sm font-bold text-slate-900">500 kg / week</span>
              </div>
              <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                <span>Delivery Terms:</span>
                <span className="text-xs font-bold text-emerald-700">Included to Warehouse</span>
              </div>
            </div>

            {!contractCreated ? (
              <button
                onClick={handleAcceptOffer}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-500/20 hover:from-emerald-600 hover:to-emerald-700 transition flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4" /> ACCEPT OFFER &amp; CREATE CONTRACT
              </button>
            ) : (
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-1">
                <span className="text-xs font-extrabold text-emerald-800 block">✓ Contract Active &amp; Enforced</span>
                <Link to="/orders" className="text-[11px] font-bold text-emerald-600 hover:underline block">
                  Track Escrow Orders →
                </Link>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
