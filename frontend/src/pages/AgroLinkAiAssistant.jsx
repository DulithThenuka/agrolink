import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { aiAssistantAPI } from '../services/api';
import {
  Bot,
  Send,
  Globe,
  Image as ImageIcon,
  MapPin,
  Calendar,
  Sparkles,
  UserCheck,
  Loader2,
  RefreshCw,
  MessageSquare,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Radio,
  CheckCircle2,
  HelpCircle,
  TrendingUp,
  Droplet,
  Zap
} from 'lucide-react';

export const AgroLinkAiAssistant = () => {
  const [language, setLanguage] = useState('EN'); // EN, SI, TA
  const [inputMessage, setInputMessage] = useState('');
  const [district, setDistrict] = useState('Matale');
  const [plantAgeDays, setPlantAgeDays] = useState(45);
  const [imageUrl, setImageUrl] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);

  const [chatHistory, setChatHistory] = useState([
    {
      id: 1,
      sender: 'AI',
      text: 'Hello! I am AgroLink AI Agronomist Assistant. Ask me anything about crop diseases, organic fertilizers, soil moisture, or price forecasts in English, Sinhala (සිංහල), or Tamil (தமிழ்).',
      requiresExpert: false,
    },
  ]);
  const [loading, setLoading] = useState(false);

  const QUICK_TEMPLATES = [
    {
      label: '🌿 Chilli Leaf Curl Remedy',
      query: {
        EN: 'What is the best organic bio-pesticide to control Chilli Leaf Curl Virus and whitefly vectors?',
        SI: 'මිරිස් කොළ කොඩවීම පාලනය කිරීමට හොඳම කාබනික පළිබෝධනාශකය කුමක්ද?',
        TA: 'மிளகாய் இலை சுருட்டை நோயைக் கட்டுப்படுத்த சிறந்த இயற்கை பூச்சிக்கொல்லி எது?'
      }
    },
    {
      label: '📈 Tomato Price Forecast',
      query: {
        EN: 'Forecast wholesale tomato market prices for next week in Dambulla and Pettah markets.',
        SI: 'ලබන සතිය සඳහා දඹුල්ල සහ පිටකොටුව තක්කාලි තොග මිල පුරෝකථනය කරන්න.',
        TA: 'அடுத்த வாரத்திற்கான தக்காளி மொத்த சந்தை விலையை கணிக்கவும்.'
      }
    },
    {
      label: '🧪 N-P-K Fertilizer for Paddy',
      query: {
        EN: 'What is the recommended N-P-K and organic manure ratio for Samba Paddy at 45 days after planting?',
        SI: 'දින 45 ක් වයසැති සම්බා වී වගාව සඳහා නිර්දේශිත N-P-K පොහොර අනුපාතය කුමක්ද?',
        TA: '45 நாள் சம்பா நெற்பயிருக்கு பரிந்துரைக்கப்பட்ட N-P-K உர விகிதம் என்ன?'
      }
    },
    {
      label: '💧 Drip Irrigation Timing',
      query: {
        EN: 'What is the ideal daily drip irrigation schedule for upcountry potatoes during dry spells?',
        SI: 'වියළි කාලගුණයේදී උඩරට අර්තාපල් සඳහා සුදුසු බිංදු ජල සම්පාදන කාලසටහන කුමක්ද?',
        TA: 'உலர்ந்த காலநிலையில் உருளைக்கிழங்கிற்கான உகந்த சொட்டு நீர் பாசன அட்டவணை என்ன?'
      }
    }
  ];

  // Speech Recognition (Voice Input)
  const handleToggleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser. Please type your query.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = language === 'SI' ? 'si-LK' : language === 'TA' ? 'ta-LK' : 'en-US';
    recognition.interimResults = false;

    if (!isRecording) {
      setIsRecording(true);
      recognition.start();

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsRecording(false);
        handleSendMessage(transcript);
      };

      recognition.onerror = () => {
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };
    } else {
      setIsRecording(false);
      recognition.stop();
    }
  };

  // Text-to-Speech Output
  const speakResponse = (text) => {
    if (!ttsEnabled || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'SI' ? 'si-LK' : language === 'TA' ? 'ta-LK' : 'en-US';
    utterance.rate = 1.0;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = async (textToSend) => {
    const query = textToSend || inputMessage;
    if (!query.trim()) return;

    const userMsg = { id: Date.now(), sender: 'USER', text: query };
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
          id: Date.now() + 1,
          sender: 'AI',
          text: res.data.aiResponseText,
          requiresExpert: res.data.requiresExpertConfirmation,
        };
        setChatHistory((prev) => [...prev, aiMsg]);
        speakResponse(res.data.aiResponseText);
      } else {
        const fallbackText = language === 'SI'
          ? `[AI පිළිතුර] ${district} දිස්ත්‍රික්කයේ දින ${plantAgeDays} ක් වයසැති වගාව සඳහා: නයිට්‍රජන් අනුපාතය අඩු කර කාබනික කොහොඹ තෙල් මිශ්‍රණය යොදන්න. ජල සම්පාදනය උදෑසන 07:00 ට පෙර සිදු කරන්න.`
          : language === 'TA'
          ? `[AI பதில்] ${district} மாவட்டத்தில் ${plantAgeDays} நாள் பயிருக்கு: வேப்ப எண்ணெய் தெளிக்கவும் மற்றும் காலையில் நீர்ப்பாசனம் செய்யவும்.`
          : `[AgroLink Agronomist] For ${district} district at ${plantAgeDays} days: Apply Neem Bio-Extract (10,000 PPM) at 50ml/16L knapsack. Maintain drip irrigation at 30 mins early morning.`;

        const fallbackMsg = {
          id: Date.now() + 1,
          sender: 'AI',
          text: fallbackText,
          requiresExpert: false,
        };
        setChatHistory((prev) => [...prev, fallbackMsg]);
        speakResponse(fallbackText);
      }
    } catch (err) {
      console.error('Failed to communicate with AgroLink AI Assistant:', err);
      const errText = language === 'SI'
        ? 'සමාවන්න, සම්බන්ධතා දෝෂයක් ඇති විය. කරුණාකර නැවත උත්සාහ කරන්න.'
        : 'Sorry, I encountered a temporary connection issue. Please try again.';
      setChatHistory((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'AI',
          text: errText,
          requiresExpert: false,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8 animate-fade-in">
      
      {/* HEADER BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 text-white p-8 md:p-10 shadow-2xl space-y-4 border border-emerald-800/40">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
              <Bot className="w-3.5 h-3.5 text-emerald-400" /> SRI LANKAN AGRI AI ASSISTANT
            </span>
            <span className="text-xs font-mono font-bold text-teal-200">• TRI-LINGUAL &amp; VOICE AI</span>
          </div>

          {/* LANGUAGE & VOICE AUDIO CONTROLS */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTtsEnabled(!ttsEnabled)}
              className={`p-2 rounded-xl text-xs font-bold transition flex items-center gap-1 border ${
                ttsEnabled ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
              title="Toggle Voice Speech Output"
            >
              {ttsEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <div className="flex items-center gap-1 bg-slate-900/80 p-1.5 rounded-2xl border border-white/20">
              <Globe className="w-3.5 h-3.5 text-emerald-400 ml-1" />
              <button
                onClick={() => setLanguage('EN')}
                className={`px-3 py-1 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                  language === 'EN' ? 'bg-emerald-600 text-white shadow' : 'text-slate-300 hover:text-white'
                }`}
              >
                🇬🇧 English
              </button>
              <button
                onClick={() => setLanguage('SI')}
                className={`px-3 py-1 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                  language === 'SI' ? 'bg-emerald-600 text-white shadow' : 'text-slate-300 hover:text-white'
                }`}
              >
                🇱🇰 සිංහල
              </button>
              <button
                onClick={() => setLanguage('TA')}
                className={`px-3 py-1 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                  language === 'TA' ? 'bg-emerald-600 text-white shadow' : 'text-slate-300 hover:text-white'
                }`}
              >
                🇱🇰 தமிழ்
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <h1 className="text-3xl md:text-5xl font-black font-display tracking-tight text-white">
            AgroLink AI Agronomist 🤖💬
          </h1>
          <p className="text-slate-300 text-sm md:text-base max-w-2xl font-medium">
            Ask questions via microphone or text. Get localized tri-lingual agronomy guidance, organic dosage formulas, and DOA extension officer verification.
          </p>
        </div>
      </div>

      {/* CHAT CONTEXT CONTROLS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-4 rounded-3xl border border-slate-200 shadow-sm text-xs font-semibold">
        <div>
          <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" /> District Location
          </label>
          <select
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="w-full p-2.5 rounded-xl border border-slate-200 font-bold bg-white text-slate-800 cursor-pointer"
          >
            <option value="Matale">Matale</option>
            <option value="Kurunegala">Kurunegala</option>
            <option value="Nuwara Eliya">Nuwara Eliya</option>
            <option value="Kandy">Kandy</option>
            <option value="Anuradhapura">Anuradhapura</option>
            <option value="Jaffna">Jaffna</option>
            <option value="Badulla">Badulla</option>
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

      {/* QUICK AGRONOMY TEMPLATES */}
      <div className="space-y-2">
        <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
          Quick Agronomy Prompt Templates:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {QUICK_TEMPLATES.map((tmpl, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(tmpl.query[language])}
              className="p-3 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-950 rounded-2xl border border-slate-200 hover:border-emerald-300 text-left transition shadow-xs cursor-pointer flex flex-col justify-between space-y-1"
            >
              <span className="font-extrabold text-xs text-emerald-800">{tmpl.label}</span>
              <p className="text-[11px] text-slate-500 line-clamp-2 font-medium">"{tmpl.query[language]}"</p>
            </button>
          ))}
        </div>
      </div>

      {/* CHAT TRANSCRIPT CONTAINER */}
      <div className="premium-card p-6 bg-white border border-slate-200/90 shadow-xl rounded-3xl space-y-4">
        
        {/* MESSAGES THREAD */}
        <div className="space-y-4 max-h-[460px] overflow-y-auto p-2">
          {chatHistory.map((msg) => (
            <div
              key={msg.id}
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
              <span>AgroLink AI is analyzing Sri Lankan agronomic models...</span>
            </div>
          )}
        </div>

        {/* INPUT PROMPT BAR WITH VOICE MICROPHONE TOGGLE */}
        <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={handleToggleVoiceInput}
            className={`p-3.5 rounded-2xl transition flex items-center justify-center cursor-pointer ${
              isRecording
                ? 'bg-rose-600 text-white animate-pulse shadow-lg ring-4 ring-rose-500/20'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
            title="Voice Input (Microphone)"
          >
            {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-emerald-600" />}
          </button>

          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={
              language === 'SI' ? 'ඔබගේ වගා ගැටලුව මෙහි සඳහන් කරන්න...' :
              language === 'TA' ? 'உங்கள் பயிர் பிரச்சனையை இங்கே உள்ளிடவும்...' :
              'Ask AgroLink AI via microphone or text...'
            }
            className="flex-1 p-3.5 rounded-2xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-emerald-500"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendMessage();
            }}
          />

          <button
            onClick={() => handleSendMessage()}
            disabled={loading}
            className="px-5 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-2xl shadow-lg transition flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Ask AI</span>
          </button>
        </div>

      </div>

    </div>
  );
};

export default AgroLinkAiAssistant;
