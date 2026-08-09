import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { aiAssistantAPI } from '../services/api';
import { Bot, Send, Globe, Image as ImageIcon, MapPin, Calendar, Sparkles, UserCheck, Loader2, RefreshCw, MessageSquare } from 'lucide-react';

export const AgroLinkAiAssistant = () => {
  const [language, setLanguage] = useState('EN'); // EN, SI, TA
  const [inputMessage, setInputMessage] = useState('');
  const [district, setDistrict] = useState('Matale');
  const [plantAgeDays, setPlantAgeDays] = useState(45);
  const [imageUrl, setImageUrl] = useState('');
  const [chatHistory, setChatHistory] = useState([
    {
      sender: 'AI',
      text: 'Hello! I am AgroLink AI Assistant. Ask me anything about crop diseases, soil nutrients, or farming advice in English, Sinhala (සිංහල), or Tamil (தமிழ்).',
      requiresExpert: false,
    },
  ]);
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async (textToSend) => {
    const query = textToSend || inputMessage;
    if (!query.trim()) return;

    const userMsg = { sender: 'USER', text: query };
    setChatHistory((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');

    setLoading(true);
    try {
      const res = await aiAssistantAPI.chat({
        message: query,
        language,
        district,
        plantAgeDays: Number(plantAgeDays),
        imageUrl,
      });

      if (res && res.data) {
        const aiMsg = {
          sender: 'AI',
          text: res.data.aiResponseText,
          requiresExpert: res.data.requiresExpertConfirmation,
        };
        setChatHistory((prev) => [...prev, aiMsg]);
      }
    } catch (err) {
      console.error('Failed to communicate with AgroLink AI Assistant:', err);
      setChatHistory((prev) => [
        ...prev,
        {
          sender: 'AI',
          text: 'Sorry, I encountered a temporary connection issue. Please try again.',
          requiresExpert: false,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const samplePrompts = {
    EN: 'My tomato leaves are becoming yellow. What should I do?',
    SI: 'මගේ තක්කාලි කොළ කහ පාට වෙනවා. මම කුමක් කළ යුතුද?',
    TA: 'என் தக்காளி இலைகள் மஞ்சளாக மாறுகின்றன. நான் என்ன செய்ய வேண்டும்?',
  };

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8">
      
      {/* HEADER BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 text-white p-8 md:p-10 shadow-2xl space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
              <Bot className="w-3.5 h-3.5 text-emerald-400" /> SRI LANKAN AGRI AI ASSISTANT
            </span>
            <span className="text-xs font-mono font-bold text-teal-200">• TRI-LINGUAL INTELLIGENCE</span>
          </div>

          {/* LANGUAGE SWITCHER */}
          <div className="flex items-center gap-1.5 bg-slate-900/80 p-1.5 rounded-2xl border border-white/20">
            <Globe className="w-3.5 h-3.5 text-emerald-400 ml-1" />
            <button
              onClick={() => setLanguage('EN')}
              className={`px-3 py-1 rounded-xl text-xs font-extrabold transition ${
                language === 'EN' ? 'bg-emerald-600 text-white shadow' : 'text-slate-300 hover:text-white'
              }`}
            >
              🇬🇧 English
            </button>
            <button
              onClick={() => setLanguage('SI')}
              className={`px-3 py-1 rounded-xl text-xs font-extrabold transition ${
                language === 'SI' ? 'bg-emerald-600 text-white shadow' : 'text-slate-300 hover:text-white'
              }`}
            >
              🇱🇰 සිංහල
            </button>
            <button
              onClick={() => setLanguage('TA')}
              className={`px-3 py-1 rounded-xl text-xs font-extrabold transition ${
                language === 'TA' ? 'bg-emerald-600 text-white shadow' : 'text-slate-300 hover:text-white'
              }`}
            >
              🇱🇰 தமிழ்
            </button>
          </div>
        </div>

        <div className="space-y-1">
          <h1 className="text-3xl md:text-5xl font-black font-display tracking-tight text-white">
            AgroLink AI Assistant 🤖💬
          </h1>
          <p className="text-slate-300 text-sm md:text-base max-w-2xl font-medium">
            Describe crop symptoms, upload photos, specify district and plant age to receive localized tri-lingual agronomy advice and certified expert confirmation.
          </p>
        </div>
      </div>

      {/* CHAT CONTEXT CONTROLS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-xs font-semibold">
        <div>
          <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" /> District Location
          </label>
          <select
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="w-full p-2.5 rounded-xl border border-slate-200 font-bold bg-white text-slate-800"
          >
            <option value="Matale">Matale</option>
            <option value="Kurunegala">Kurunegala</option>
            <option value="Nuwara Eliya">Nuwara Eliya</option>
            <option value="Kandy">Kandy</option>
            <option value="Anuradhapura">Anuradhapura</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-emerald-600" /> Plant Age (Days)
          </label>
          <input
            type="number"
            value={plantAgeDays}
            onChange={(e) => setPlantAgeDays(Number(e.target.value))}
            placeholder="e.g. 45"
            className="w-full p-2.5 rounded-xl border border-slate-200 font-bold"
          />
        </div>

        <div>
          <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1 flex items-center gap-1">
            <ImageIcon className="w-3.5 h-3.5 text-emerald-600" /> Leaf Photo URL (Optional)
          </label>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://images.unsplash.com/..."
            className="w-full p-2.5 rounded-xl border border-slate-200"
          />
        </div>
      </div>

      {/* CHAT TRANSCRIPT CONTAINER */}
      <div className="premium-card p-6 bg-white border border-slate-100 shadow-xl rounded-3xl space-y-4">
        
        {/* QUICK SAMPLE PROMPT CHIP */}
        <div className="p-3 bg-emerald-50/80 rounded-2xl border border-emerald-100 flex items-center justify-between text-xs flex-wrap gap-2">
          <span className="font-bold text-emerald-900 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Sample User Query:
          </span>
          <button
            onClick={() => handleSendMessage(samplePrompts[language])}
            className="px-3.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl transition shadow text-[11px]"
          >
            "{samplePrompts[language]}" 🚀
          </button>
        </div>

        {/* MESSAGES THREAD */}
        <div className="space-y-4 max-h-[500px] overflow-y-auto p-2">
          {chatHistory.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 ${msg.sender === 'USER' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-9 h-9 rounded-2xl flex items-center justify-center font-bold text-sm shrink-0 shadow ${
                msg.sender === 'USER' ? 'bg-slate-900 text-white' : 'bg-emerald-600 text-white'
              }`}>
                {msg.sender === 'USER' ? '🧑‍🌾' : '🤖'}
              </div>

              <div className={`max-w-xl p-4 rounded-3xl text-xs font-medium space-y-2 leading-relaxed ${
                msg.sender === 'USER'
                  ? 'bg-slate-900 text-white rounded-tr-none'
                  : 'bg-slate-50 text-slate-900 border border-slate-200/90 rounded-tl-none shadow-sm'
              }`}>
                <p>{msg.text}</p>

                {msg.requiresExpert && (
                  <div className="pt-2 border-t border-slate-200">
                    <Link
                      to="/experts"
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[11px] rounded-xl inline-flex items-center gap-1.5 transition shadow"
                    >
                      <UserCheck className="w-3.5 h-3.5" /> Request Certified Expert Confirmation 👨‍🔬
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold p-2">
              <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
              <span>AgroLink AI is analyzing agronomic models...</span>
            </div>
          )}
        </div>

        {/* INPUT PROMPT BAR */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={
              language === 'SI' ? 'ඔබගේ වගා ගැටලුව මෙහි සඳහන් කරන්න...' :
              language === 'TA' ? 'உங்கள் பயிர் பிரச்சனையை இங்கே உள்ளிடவும்...' :
              'Ask AgroLink AI about your crop symptoms...'
            }
            className="flex-1 p-3.5 rounded-2xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-emerald-500"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendMessage();
            }}
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={loading}
            className="px-5 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-2xl shadow-lg transition flex items-center gap-1.5 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </div>

      </div>

    </div>
  );
};
