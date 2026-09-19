import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
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
  CheckCircle2,
  HelpCircle,
  TrendingUp,
  AlertCircle,
  Tractor,
  Package,
  ArrowRight,
  Plus,
  Trash2,
  X,
  Layers,
  ChevronDown,
  Info
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { aiAssistantAPI, cropsAPI } from '../services/api';

// ============================================================================
// CONTEXTUAL SUGGESTED QUESTIONS (Strictly mapped to existing capabilities)
// ============================================================================
const SUGGESTED_QUESTIONS = [
  {
    category: 'Crop Health',
    icon: Sparkles,
    label: 'Tomato Leaf Yellowing Remedy',
    query: {
      EN: 'What is the best treatment for yellowing tomato leaves in my crop?',
      SI: 'මගේ තක්කාලි වගාවේ කොළ කහ වීමට සුදුසුම ප්‍රතිකාරය කුමක්ද?',
      TA: 'எனது தக்காளிப் பயிரில் இலைகள் மஞ்சளாவதற்கு சிறந்த சிகிச்சை என்ன?'
    },
    suggestedAction: {
      label: 'Consult Agricultural Expert',
      to: '/experts',
      icon: UserCheck
    }
  },
  {
    category: 'Market Prices',
    icon: TrendingUp,
    label: 'Paddy & Veg Market Forecast',
    query: {
      EN: 'Forecast wholesale vegetable and samba paddy prices for next week.',
      SI: 'ලබන සතිය සඳහා එළවළු සහ සම්බා වී තොග මිල පුරෝකථනය කරන්නේ කෙසේද?',
      TA: 'அடுத்த வாரத்திற்கான காய்கறி மற்றும் நெல் மொத்த விலை முன்னறிவிப்பு என்ன?'
    },
    suggestedAction: {
      label: 'Open Price Forecaster',
      to: '/price-prediction',
      icon: TrendingUp
    }
  },
  {
    category: 'Equipment',
    icon: Tractor,
    label: 'Find Tractors & Machinery',
    query: {
      EN: 'How do I find a 4WD tractor or harvesters available for rent near me?',
      SI: 'මගේ ප්‍රදේශයේ කුලියට ගැනීමට ඇති ට්‍රැක්ටර් සහ අස්වනු නෙලන යන්ත්‍ර සොයා ගන්නේ කෙසේද?',
      TA: 'எனக்கு அருகில் வாடகைக்குக் கிடைக்கும் டிராக்டர்களை எவ்வாறு கண்டுபிடிப்பது?'
    },
    suggestedAction: {
      label: 'Browse Equipment Rentals',
      to: '/equipment-rental',
      icon: Tractor
    }
  },
  {
    category: 'Supplies',
    icon: Package,
    label: 'Certified Seeds & Inputs',
    query: {
      EN: 'Where can I order DOA certified organic fertilizer and seed varieties?',
      SI: 'කෘෂිකර්ම දෙපාර්තමේන්තුවෙන් සහතික කළ කාබනික පොහොර සහ බීජ ඇණවුම් කරන්නේ කෙසේද?',
      TA: 'சான்றளிக்கப்பட்ட இயற்கை உரம் மற்றும் விதைகளை எங்கு ஆர்டர் செய்யலாம்?'
    },
    suggestedAction: {
      label: 'Open Supplier Marketplace',
      to: '/supplier-marketplace',
      icon: Package
    }
  }
];

export const AgroLinkAiAssistant = () => {
  const { user } = useAuth();

  // --------------------------------------------------------------------------
  // STATE DEFINITIONS
  // --------------------------------------------------------------------------
  // Language & Voice
  const [language, setLanguage] = useState('EN'); // 'EN' | 'SI' | 'TA'
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Farmer Context Data
  const [district, setDistrict] = useState(user?.location || 'Matale');
  const [plantAgeDays, setPlantAgeDays] = useState(45);
  const [imageUrl, setImageUrl] = useState('');
  const [showContextBar, setShowContextBar] = useState(false);
  const [farmerCrops, setFarmerCrops] = useState([]);

  // Composer & Message State
  // 'COMPOSER_READY' | 'MESSAGE_SENDING' | 'MESSAGE_ERROR'
  const [composerState, setComposerState] = useState('COMPOSER_READY');
  const [inputMessage, setInputMessage] = useState('');
  const [failedMessage, setFailedMessage] = useState('');

  // Conversation Thread
  const [messages, setMessages] = useState([]);

  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, composerState]);

  // Load farmer's crops for contextual awareness without manual re-entry
  useEffect(() => {
    const fetchFarmerCrops = async () => {
      try {
        const res = await cropsAPI.getAll({ page: 0, size: 5 });
        const list = res?.data?.content || res?.data || (Array.isArray(res) ? res : []);
        setFarmerCrops(list);
      } catch (err) {
        // Non-critical, ignore gracefully
      }
    };
    fetchFarmerCrops();
  }, []);

  // Update district when user context changes
  useEffect(() => {
    if (user?.location) {
      setDistrict(user.location);
    }
  }, [user]);

  // --------------------------------------------------------------------------
  // TEXT TO SPEECH (Safe & Non-intrusive)
  // --------------------------------------------------------------------------
  const speakText = (text) => {
    if (!ttsEnabled || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'SI' ? 'si-LK' : language === 'TA' ? 'ta-LK' : 'en-US';
      utterance.rate = 1.0;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      setIsSpeaking(false);
    }
  };

  // --------------------------------------------------------------------------
  // SPEECH TO TEXT (Microphone Input)
  // --------------------------------------------------------------------------
  const handleToggleVoice = () => {
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
        handleSend(transcript);
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

  // --------------------------------------------------------------------------
  // SEND MESSAGE HANDLER
  // --------------------------------------------------------------------------
  const handleSend = async (customText) => {
    const textToSend = (customText !== undefined ? customText : inputMessage).trim();
    if (!textToSend || composerState === 'MESSAGE_SENDING') return;

    // Append user message
    const userMsg = {
      id: Date.now(),
      sender: 'USER',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setFailedMessage('');
    setComposerState('MESSAGE_SENDING');

    try {
      const res = await aiAssistantAPI.chat({
        message: textToSend,
        language,
        district,
        plantAgeDays: Number(plantAgeDays),
        imageUrl
      });

      const aiData = res?.data || res;
      const responseText =
        aiData?.aiResponseText ||
        (language === 'SI'
          ? `[AgroLink AI] ${district} දිස්ත්‍රික්කයේ දින ${plantAgeDays} වගාව සඳහා: කාබනික පොහොර හා නිසි ජල සම්පාදනය යොදන්න.`
          : language === 'TA'
          ? `[AgroLink AI] ${district} மாவட்டத்தில் ${plantAgeDays} நாள் பயிருக்கு: இயற்கை உரம் மற்றும் சரியான நீர்ப்பாசனத்தைப் பயன்படுத்தவும்.`
          : `[AgroLink AI] For ${district} district at ${plantAgeDays} days: Maintain balanced bio-fertilizers and monitored drip cycles.`);

      const requiresExpert = Boolean(aiData?.requiresExpertConfirmation);

      // Derive relevant contextual action link based on topic and expert flag
      let actionLink = null;
      const lower = textToSend.toLowerCase();

      if (requiresExpert || lower.includes('disease') || lower.includes('leaf') || lower.includes('blight') || lower.includes('yellow') || lower.includes('කහ')) {
        actionLink = {
          label: 'Consult Certified Agricultural Officer',
          to: '/experts',
          icon: UserCheck
        };
      } else if (lower.includes('tractor') || lower.includes('equipment') || lower.includes('machinery') || lower.includes('rent')) {
        actionLink = {
          label: 'Find Equipment Rentals',
          to: '/equipment-rental',
          icon: Tractor
        };
      } else if (lower.includes('price') || lower.includes('forecast') || lower.includes('market')) {
        actionLink = {
          label: 'View Crop Price Forecasts',
          to: '/price-prediction',
          icon: TrendingUp
        };
      } else if (lower.includes('seed') || lower.includes('fertilizer') || lower.includes('pesticide') || lower.includes('buy')) {
        actionLink = {
          label: 'Browse Input Marketplace',
          to: '/supplier-marketplace',
          icon: Package
        };
      }

      const aiMsg = {
        id: Date.now() + 1,
        sender: 'AI',
        text: responseText,
        requiresExpert,
        actionLink,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, aiMsg]);
      setComposerState('COMPOSER_READY');
      speakText(responseText);
    } catch (err) {
      console.error('AI chat error:', err);
      setFailedMessage(textToSend);
      setComposerState('MESSAGE_ERROR');
    }
  };

  // --------------------------------------------------------------------------
  // CONVERSATION MANAGEMENT
  // --------------------------------------------------------------------------
  const handleNewConversation = () => {
    if (messages.length > 0) {
      const confirmReset = window.confirm('Start a new conversation thread? Your current chat will be cleared.');
      if (!confirmReset) return;
    }
    setMessages([]);
    setFailedMessage('');
    setInputMessage('');
    setComposerState('COMPOSER_READY');
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-5 sm:py-7 space-y-4 text-slate-900 animate-fade-in flex flex-col min-h-[calc(100vh-120px)]">
      {/* ==================================================================== */}
      {/* 4. HEADER (Compact, non-marketing, clean AgroLink standard)          */}
      {/* ==================================================================== */}
      <div className="agri-card p-4 sm:p-5 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Bot className="w-5 h-5 text-emerald-800" />
              <span>AgroLink AI Assistant</span>
            </h1>
            <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-semibold border border-emerald-200">
              Agronomic Advisor
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-0.5">
            Get help understanding your crops, services, and agricultural information.
          </p>
        </div>

        {/* Toolbar: Language selector, Voice toggle, Context drawer & New chat */}
        <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
          {/* Tri-Lingual Language Selector */}
          <div className="flex items-center p-0.5 bg-slate-100 rounded-xl border border-slate-200 text-xs">
            <button
              onClick={() => setLanguage('EN')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                language === 'EN' ? 'bg-white text-emerald-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('SI')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                language === 'SI' ? 'bg-white text-emerald-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              සිංහල
            </button>
            <button
              onClick={() => setLanguage('TA')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                language === 'TA' ? 'bg-white text-emerald-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              தமிழ்
            </button>
          </div>

          {/* Speech Audio Toggle */}
          <button
            onClick={() => {
              if (ttsEnabled && 'speechSynthesis' in window) {
                window.speechSynthesis.cancel();
              }
              setTtsEnabled(!ttsEnabled);
            }}
            className={`p-2 rounded-xl border text-xs font-semibold transition flex items-center justify-center ${
              ttsEnabled
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
            }`}
            title={ttsEnabled ? 'Mute spoken responses' : 'Enable voice read-out'}
          >
            {ttsEnabled ? <Volume2 className="w-4 h-4 text-emerald-800" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Farm Context Toggle */}
          <button
            onClick={() => setShowContextBar(!showContextBar)}
            className={`px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition flex items-center gap-1.5 ${
              showContextBar
                ? 'bg-slate-100 text-slate-800 border-slate-300'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
            title="Adjust farm location and crop parameters"
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-800" />
            <span className="hidden md:inline">{district}</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showContextBar ? 'rotate-180' : ''}`} />
          </button>

          {/* New Conversation Button */}
          {messages.length > 0 && (
            <button
              onClick={handleNewConversation}
              className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition flex items-center gap-1 shadow-xs"
              title="Start a fresh conversation thread"
            >
              <Plus className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">New Thread</span>
            </button>
          )}
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 9. FARM CONTEXT BAR (Collapsible Context Panel)                      */}
      {/* ==================================================================== */}
      {showContextBar && (
        <div className="agri-card p-4 bg-slate-50 border border-slate-200/90 text-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-800 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-emerald-800" />
              <span>Current Agronomic Context Parameters</span>
            </span>
            <span className="text-[11px] text-slate-500">
              {user ? `Farmer: ${user.name || user.email}` : 'Guest Session'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                District Location
              </label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-700"
              >
                <option value="Matale">Matale</option>
                <option value="Nuwara Eliya">Nuwara Eliya</option>
                <option value="Badulla">Badulla</option>
                <option value="Kandy">Kandy</option>
                <option value="Kurunegala">Kurunegala</option>
                <option value="Anuradhapura">Anuradhapura</option>
                <option value="Polonnaruwa">Polonnaruwa</option>
                <option value="Jaffna">Jaffna</option>
                <option value="Monaragala">Monaragala</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Crop Growth Age (Days)
              </label>
              <input
                type="number"
                min="1"
                max="365"
                value={plantAgeDays}
                onChange={(e) => setPlantAgeDays(Number(e.target.value))}
                className="w-full p-2 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                placeholder="e.g. 45"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Leaf Diagnostic Photo URL (Optional)
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                placeholder="https://example.com/leaf.jpg"
              />
            </div>
          </div>

          {farmerCrops.length > 0 && (
            <div className="pt-2 border-t border-slate-200/80 flex items-center gap-2 flex-wrap text-[11px] text-slate-600">
              <span className="font-semibold text-slate-500">Your Listed Crops:</span>
              {farmerCrops.map((c, i) => (
                <span key={i} className="px-2 py-0.5 rounded bg-white border border-slate-200 font-medium">
                  {c.cropName || c.name || 'Crop'} ({c.quantityKg || c.quantity || 0} kg)
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ==================================================================== */}
      {/* 5. WELCOME & 6. CONVERSATION VIEW (Scrollable Chat Container)        */}
      {/* ==================================================================== */}
      <div className="agri-card bg-white p-4 sm:p-6 flex-1 overflow-y-auto min-h-[350px] max-h-[560px] space-y-4">
        {/* 5. WELCOME / EMPTY STATE */}
        {messages.length === 0 && (
          <div className="py-6 sm:py-8 space-y-6 text-center">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center border border-emerald-100">
              <Bot className="w-6 h-6" />
            </div>

            <div className="space-y-1 max-w-md mx-auto">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                How can I help with your farm today?
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                Ask about crop disease remedies, market price trends, equipment rentals, or expert consultations in {district}.
              </p>
            </div>

            {/* 10. SUGGESTED QUESTIONS CHIPS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left max-w-2xl mx-auto pt-2">
              {SUGGESTED_QUESTIONS.map((sug, idx) => {
                const IconComp = sug.icon;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSend(sug.query[language])}
                    className="p-3.5 rounded-xl border border-slate-200 hover:border-emerald-700 bg-slate-50/60 hover:bg-emerald-50/40 text-slate-800 transition text-left flex flex-col justify-between space-y-1.5 cursor-pointer shadow-2xs"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900 flex items-center gap-1.5">
                        <IconComp className="w-3.5 h-3.5 text-emerald-800" />
                        {sug.label}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                        {sug.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-normal">
                      "{sug.query[language]}"
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 6. CONVERSATION MESSAGES */}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${msg.sender === 'USER' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                msg.sender === 'USER'
                  ? 'bg-slate-800 text-white'
                  : 'bg-emerald-800 text-white'
              }`}
            >
              {msg.sender === 'USER' ? '🧑‍🌾' : <Bot className="w-4 h-4" />}
            </div>

            {/* Bubble Content */}
            <div
              className={`max-w-xl p-3.5 sm:p-4 rounded-2xl text-xs space-y-2 leading-relaxed ${
                msg.sender === 'USER'
                  ? 'bg-slate-900 text-white rounded-tr-none'
                  : 'bg-slate-50 text-slate-900 border border-slate-200/90 rounded-tl-none shadow-2xs'
              }`}
            >
              <div className="flex justify-between items-center text-[10px] text-slate-400 gap-4 mb-1">
                <span className={`font-semibold ${msg.sender === 'USER' ? 'text-slate-300' : 'text-emerald-900'}`}>
                  {msg.sender === 'USER' ? (user?.name || 'You') : 'AgroLink AI'}
                </span>
                <span>{msg.timestamp}</span>
              </div>

              <p className="whitespace-pre-line text-xs font-normal leading-relaxed">
                {msg.text}
              </p>

              {/* 8. ACTIONABLE RESPONSES (Only authentic AgroLink routes) */}
              {msg.actionLink && (
                <div className="pt-2 border-t border-slate-200 mt-2">
                  <Link
                    to={msg.actionLink.to}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs transition shadow-2xs"
                  >
                    {msg.actionLink.icon && <msg.actionLink.icon className="w-3.5 h-3.5" />}
                    <span>{msg.actionLink.label}</span>
                    <ArrowRight className="w-3 h-3 ml-0.5" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* 14. AI LOADING STATE (Thinking...) */}
        {composerState === 'MESSAGE_SENDING' && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-800 text-white flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 rounded-tl-none text-xs text-slate-500 flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-800" />
              <span>Thinking...</span>
            </div>
          </div>
        )}

        {/* 15. ERROR STATE */}
        {composerState === 'MESSAGE_ERROR' && (
          <div className="p-3.5 rounded-xl border border-red-200 bg-red-50 text-red-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>I couldn't process that request right now.</span>
            </div>
            {failedMessage && (
              <button
                type="button"
                onClick={() => handleSend(failedMessage)}
                className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg self-start sm:self-auto transition shadow-2xs"
              >
                Try Again
              </button>
            )}
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* ==================================================================== */}
      {/* 11. MESSAGE COMPOSER                                                 */}
      {/* ==================================================================== */}
      <div className="agri-card p-3 sm:p-3.5 bg-white shrink-0 space-y-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          {/* Voice Input Microphone Toggle */}
          <button
            type="button"
            onClick={handleToggleVoice}
            className={`p-2.5 rounded-xl transition flex items-center justify-center cursor-pointer border ${
              isRecording
                ? 'bg-rose-600 text-white border-rose-600 animate-pulse'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
            }`}
            title={isRecording ? 'Listening... click to stop' : 'Voice input (Microphone)'}
            aria-label="Voice input"
          >
            {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-emerald-800" />}
          </button>

          {/* Leaf Photo URL Quick Toggle */}
          <button
            type="button"
            onClick={() => setShowContextBar(!showContextBar)}
            className={`p-2.5 rounded-xl transition flex items-center justify-center cursor-pointer border ${
              imageUrl
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
            }`}
            title="Attach crop/leaf photo parameter"
            aria-label="Attach crop photo"
          >
            <ImageIcon className="w-4 h-4 text-slate-600" />
          </button>

          {/* Text Input */}
          <input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            disabled={composerState === 'MESSAGE_SENDING'}
            placeholder={
              language === 'SI'
                ? 'ඔබගේ වගා ගැටලුව හෝ සේවාව මෙහි විමසන්න...'
                : language === 'TA'
                ? 'உங்கள் விவசாய கேள்வியை இங்கே உள்ளிடவும்...'
                : 'Ask AgroLink AI about crops, diseases, prices, or equipment...'
            }
            className="flex-1 p-2.5 text-xs font-normal border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-700 bg-white text-slate-900 disabled:bg-slate-50"
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={!inputMessage.trim() || composerState === 'MESSAGE_SENDING'}
            className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            aria-label="Send query"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ask AI</span>
          </button>
        </form>

        {/* Cautious AI Guidance Notice */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 pt-1">
          <span>
            {language === 'SI'
              ? 'ස්වයංක්‍රීය කෘෂි උපදේශනය. රෝග නිර්ණය සඳහා වෘත්තීය නිලධාරීන්ගේ තහවුරු කිරීම නිර්දේශ කෙරේ.'
              : language === 'TA'
              ? 'தானியங்கி விவசாய ஆலோசனை. நோய் உறுதிப்படுத்தலுக்கு அதிகாரிகளை அணுகவும்.'
              : 'AgroLink AI provides guidance based on SL DOA benchmarks. For critical issues, consult certified officers.'}
          </span>
          {isSpeaking && (
            <span className="text-emerald-800 font-semibold flex items-center gap-1">
              <Volume2 className="w-3 h-3 animate-pulse" /> Reading answer
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgroLinkAiAssistant;
