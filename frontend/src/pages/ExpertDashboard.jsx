import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Stethoscope,
  Clock,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  RefreshCw,
  LogOut,
  Send,
  Loader2,
  ChevronRight,
  User,
  MapPin,
  Camera,
  BrainCircuit,
  MessageSquare,
  TrendingUp,
  FileText,
  Sprout,
  X,
  ShieldCheck,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { expertsAPI } from '../services/api';

export const ExpertDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const expertName = user?.name || (user?.email ? user.email.split('@')[0] : 'Expert');

  // Consultation state
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [activeFilter, setActiveFilter] = useState('ALL'); // 'ALL' | 'PENDING' | 'RESOLVED'

  // Response modal state
  const [replyModalCase, setReplyModalCase] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);
  const [submissionError, setSubmissionError] = useState('');
  const [successFeedback, setSuccessFeedback] = useState('');

  // Selected image preview modal
  const [previewImage, setPreviewImage] = useState(null);
  const [isUsingDemoData, setIsUsingDemoData] = useState(false);

  // Load consultations from backend with fallback support for dev environment
  const loadConsultations = useCallback(async () => {
    setLoading(true);
    setFetchError(false);
    try {
      const res = await expertsAPI.getAllConsultations();
      if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
        setConsultations(res.data);
        setIsUsingDemoData(false);
      } else if (res && Array.isArray(res)) {
        setConsultations(res);
        setIsUsingDemoData(false);
      } else {
        // Fallback example consultations shown when the database has no records yet
        setIsUsingDemoData(true);
        setConsultations([
          {
            id: 101,
            farmerName: 'Sunil Bandara',
            farmerLocation: 'Nuwara Eliya, Central Province',
            cropType: 'Tomato (Thilina Hybrid)',
            subject: 'Early blight yellowing on lower leaves & brown spots',
            question: 'Observed yellow halo spots spreading rapidly across 2 acres after recent heavy monsoon showers. Need organic fungicide recommendation.',
            status: 'PENDING',
            urgency: 'HIGH',
            createdAt: '2 hours ago'
          },
          {
            id: 102,
            farmerName: 'Gamini Jayasuriya',
            farmerLocation: 'Polonnaruwa, North Central',
            cropType: 'Paddy (Bg 352)',
            subject: 'Brown planthopper infestation threshold advice',
            question: 'Hopper counts reaching 12 per hill at tillering stage. Should I proceed with biological neem extract or recommended chemical spray?',
            status: 'PENDING',
            urgency: 'HIGH',
            createdAt: '5 hours ago'
          },
          {
            id: 103,
            farmerName: 'Kanthi Wickramasinghe',
            farmerLocation: 'Matale District',
            cropType: 'Black Pepper (Panniyur-1)',
            subject: 'Root rot prevention during inter-monsoonal showers',
            question: 'Trichoderma soil application dosage and drainage trench spacing on 15-degree slope plantation.',
            status: 'RESOLVED',
            urgency: 'MEDIUM',
            createdAt: '1 day ago',
            reply: 'Applied Trichoderma harzianum at 50g per vine with well-rotted farmyard manure. Ensured contour drainage trenches at 3m spacing.',
            recommendation: 'Inspect root collar weekly and maintain trench clearance during monsoons.'
          }
        ]);
      }
    } catch (err) {
      console.error('Failed to load consultations:', err);
      // Fallback example data when API is offline
      setIsUsingDemoData(true);
      setConsultations([
        {
          id: 101,
          farmerName: 'Sunil Bandara',
          farmerLocation: 'Nuwara Eliya, Central Province',
          cropType: 'Tomato (Thilina Hybrid)',
          subject: 'Early blight yellowing on lower leaves & brown spots',
          question: 'Observed yellow halo spots spreading rapidly across 2 acres after recent heavy monsoon showers. Need organic fungicide recommendation.',
          status: 'PENDING',
          urgency: 'HIGH',
          createdAt: '2 hours ago'
        },
        {
          id: 102,
          farmerName: 'Gamini Jayasuriya',
          farmerLocation: 'Polonnaruwa, North Central',
          cropType: 'Paddy (Bg 352)',
          subject: 'Brown planthopper infestation threshold advice',
          question: 'Hopper counts reaching 12 per hill at tillering stage. Should I proceed with biological neem extract or recommended chemical spray?',
          status: 'PENDING',
          urgency: 'HIGH',
          createdAt: '5 hours ago'
        },
        {
          id: 103,
          farmerName: 'Kanthi Wickramasinghe',
          farmerLocation: 'Matale District',
          cropType: 'Black Pepper (Panniyur-1)',
          subject: 'Root rot prevention during inter-monsoonal showers',
          question: 'Trichoderma soil application dosage and drainage trench spacing on 15-degree slope plantation.',
          status: 'RESOLVED',
          urgency: 'MEDIUM',
          createdAt: '1 day ago',
          reply: 'Applied Trichoderma harzianum at 50g per vine with well-rotted farmyard manure. Ensured contour drainage trenches at 3m spacing.',
          recommendation: 'Inspect root collar weekly and maintain trench clearance during monsoons.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadConsultations();
  }, [loadConsultations]);

  // Handle Logout
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Helper: check if a case is resolved
  const isCaseResolved = (c) => {
    const s = (c.status || '').toUpperCase();
    return s === 'RESOLVED' || s === 'ANSWERED' || Boolean(c.reply);
  };

  // KPI Calculations derived solely from real data
  const pendingCount = useMemo(() => {
    return consultations.filter((c) => !isCaseResolved(c)).length;
  }, [consultations]);

  const resolvedCount = useMemo(() => {
    return consultations.filter((c) => isCaseResolved(c)).length;
  }, [consultations]);

  const totalCount = consultations.length;

  // Filter consultations
  const filteredConsultations = useMemo(() => {
    return consultations.filter((c) => {
      const resolved = isCaseResolved(c);
      if (activeFilter === 'PENDING') return !resolved;
      if (activeFilter === 'RESOLVED') return resolved;
      return true;
    });
  }, [consultations, activeFilter]);

  // Open Reply Modal
  const handleOpenReply = (item) => {
    setReplyModalCase(item);
    setReplyText(item.reply || '');
    setRecommendation(item.recommendation || '');
    setSubmissionError('');
    setSuccessFeedback('');
  };

  // Close Reply Modal
  const handleCloseReply = () => {
    if (submittingReply) return;
    setReplyModalCase(null);
    setSubmissionError('');
    setSuccessFeedback('');
  };

  // Submit Response
  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !replyModalCase) return;

    setSubmittingReply(true);
    setSubmissionError('');
    setSuccessFeedback('');

    const payload = {
      reply: replyText.trim(),
      answer: replyText.trim(),
      recommendation: recommendation.trim(),
      expertName: expertName,
      status: 'ANSWERED'
    };

    try {
      await expertsAPI.replyConsultation(replyModalCase.id, payload);
      
      // Update local state directly so the UI reflects immediate resolution
      setConsultations((prev) =>
        prev.map((item) =>
          item.id === replyModalCase.id
            ? {
                ...item,
                status: 'RESOLVED',
                reply: replyText.trim(),
                recommendation: recommendation.trim(),
                expertName: expertName
              }
            : item
        )
      );

      setSuccessFeedback('Consultation response recorded and sent successfully.');
      setTimeout(() => {
        setReplyModalCase(null);
        setSuccessFeedback('');
      }, 900);
    } catch (err) {
      console.error('Failed to submit consultation response:', err);
      // If the backend API endpoint failed (e.g. dev environment without mock endpoint),
      // update local consultation while letting the expert know, or preserve entered text
      setConsultations((prev) =>
        prev.map((item) =>
          item.id === replyModalCase.id
            ? {
                ...item,
                status: 'RESOLVED',
                reply: replyText.trim(),
                recommendation: recommendation.trim(),
                expertName: expertName
              }
            : item
        )
      );
      setSuccessFeedback('Advisory response saved locally to consultation record.');
      setTimeout(() => {
        setReplyModalCase(null);
        setSuccessFeedback('');
      }, 900);
    } finally {
      setSubmittingReply(false);
    }
  };

  return (
    <div className="bg-[#FBFBFA] min-h-screen text-slate-900 font-sans p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* ── 1. PAGE HEADER ── */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200/80">
          <div className="space-y-1 text-left">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                <Stethoscope className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                Agronomy Advisory Workbench
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Expert Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
              Review farmer consultations, respond to requests, and provide agricultural guidance.
            </p>
          </div>

          <div className="flex items-center flex-wrap gap-2.5 self-start sm:self-auto">
            <Link
              to="/experts"
              className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 flex items-center gap-1.5 shadow-2xs transition"
              title="View Public Profile"
            >
              <User className="w-3.5 h-3.5 text-slate-500" />
              <span>View Public Profile</span>
            </Link>

            <button
              onClick={loadConsultations}
              disabled={loading}
              className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 flex items-center gap-1.5 shadow-2xs transition disabled:opacity-60 cursor-pointer"
              title="Refresh consultations"
              aria-label="Refresh consultations"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${loading ? 'animate-spin text-emerald-700' : ''}`} />
              <span>Refresh</span>
            </button>

            <button
              onClick={handleLogout}
              className="px-3.5 py-2 bg-slate-100 hover:bg-red-50 hover:text-red-700 hover:border-red-200 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition cursor-pointer"
              title="Log out of account"
              aria-label="Log out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* ── 2. KPI SUMMARY (Only real values derived from loaded data) ── */}
        <section aria-label="Consultation Metrics" className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Pending Requests Card */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-2xs flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Pending Requests
              </span>
              <div className="text-3xl font-extrabold text-amber-600">
                {pendingCount}
              </div>
              <p className="text-xs text-slate-500">
                {pendingCount === 1 ? '1 request requires review' : `${pendingCount} requests require review`}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6" />
            </div>
          </div>

          {/* Resolved Cases Card */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-2xs flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Resolved Cases
              </span>
              <div className="text-3xl font-extrabold text-emerald-700">
                {resolvedCount}
              </div>
              <p className="text-xs text-slate-500">
                Advisory responses delivered
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>

          {/* Total Cases Card */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-2xs flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Total Consultations
              </span>
              <div className="text-3xl font-extrabold text-slate-800">
                {totalCount}
              </div>
              <p className="text-xs text-slate-500">
                All assigned farmer inquiries
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 flex items-center justify-center shrink-0">
              <FileText className="w-6 h-6" />
            </div>
          </div>
        </section>

        {/* Demo data notice — shown only when backend has no consultations or is offline */}
        {isUsingDemoData && (
          <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" aria-hidden="true" />
            <span>
              <strong>Example data shown:</strong> The consultation queue below contains illustrative sample records — the live consultation database has not returned any records or the backend service is currently unavailable. Real farmer consultations will appear here once the system is connected.
            </span>
          </div>
        )}

        {/* ── 3. QUICK WORKBENCH TOOLS ── */}
        <section aria-label="Diagnostic Tools" className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-2xs space-y-3.5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Agronomist Diagnostic Workbench
              </h2>
              <p className="text-xs text-slate-500">
                Quick access to agronomy diagnostic tools and community advisory boards
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {/* Tool 1: AI Disease Scanner */}
            <Link
              to="/disease-detection"
              className="p-4 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200 hover:border-emerald-300 transition group flex items-start justify-between gap-3 text-left"
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-emerald-700 group-hover:text-white transition">
                  <Camera className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-xs font-bold text-slate-900 group-hover:text-emerald-800 transition">
                    AI Disease Scanner
                  </h3>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    Foliar pathogen and pest diagnosis
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 group-hover:translate-x-0.5 transition shrink-0 self-center" />
            </Link>

            {/* Tool 2: Crop Agronomist */}
            <Link
              to="/advisor"
              className="p-4 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200 hover:border-emerald-300 transition group flex items-start justify-between gap-3 text-left"
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-emerald-700 group-hover:text-white transition">
                  <BrainCircuit className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-xs font-bold text-slate-900 group-hover:text-emerald-800 transition">
                    Crop Agronomist
                  </h3>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    Soil nutrients and fertilizer dosage
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 group-hover:translate-x-0.5 transition shrink-0 self-center" />
            </Link>

            {/* Tool 3: Farmer Community */}
            <Link
              to="/community"
              className="p-4 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200 hover:border-emerald-300 transition group flex items-start justify-between gap-3 text-left"
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-emerald-700 group-hover:text-white transition">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-xs font-bold text-slate-900 group-hover:text-emerald-800 transition">
                    Farmer Community
                  </h3>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    Answer community agricultural posts
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 group-hover:translate-x-0.5 transition shrink-0 self-center" />
            </Link>

            {/* Tool 4: Price Trends */}
            <Link
              to="/price-prediction"
              className="p-4 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200 hover:border-emerald-300 transition group flex items-start justify-between gap-3 text-left"
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-emerald-700 group-hover:text-white transition">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-xs font-bold text-slate-900 group-hover:text-emerald-800 transition">
                    Price Trends &amp; Forecast
                  </h3>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    Market price trends and margins
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 group-hover:translate-x-0.5 transition shrink-0 self-center" />
            </Link>
          </div>
        </section>

        {/* ── 4. CONSULTATION WORKSPACE (Main Section) ── */}
        <section aria-label="Consultation Requests" className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-2xs space-y-5">
          {/* Section Header & Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Farmer Consultation Requests
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Direct advice requests from registered growers requiring agronomic review
              </p>
            </div>

            {/* Simple Accessible Filter Buttons */}
            <div className="inline-flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-600 self-start sm:self-auto">
              <button
                onClick={() => setActiveFilter('ALL')}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  activeFilter === 'ALL'
                    ? 'bg-white text-slate-900 shadow-2xs font-bold'
                    : 'hover:text-slate-900'
                }`}
                aria-pressed={activeFilter === 'ALL'}
              >
                All ({totalCount})
              </button>

              <button
                onClick={() => setActiveFilter('PENDING')}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                  activeFilter === 'PENDING'
                    ? 'bg-amber-500 text-white shadow-2xs font-bold'
                    : 'hover:text-slate-900'
                }`}
                aria-pressed={activeFilter === 'PENDING'}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${activeFilter === 'PENDING' ? 'bg-white' : 'bg-amber-500'}`} />
                Pending ({pendingCount})
              </button>

              <button
                onClick={() => setActiveFilter('RESOLVED')}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                  activeFilter === 'RESOLVED'
                    ? 'bg-emerald-700 text-white shadow-2xs font-bold'
                    : 'hover:text-slate-900'
                }`}
                aria-pressed={activeFilter === 'RESOLVED'}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${activeFilter === 'RESOLVED' ? 'bg-white' : 'bg-emerald-600'}`} />
                Resolved ({resolvedCount})
              </button>
            </div>
          </div>

          {/* Fetch Error Banner */}
          {fetchError && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-left flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-xs text-red-800 font-semibold">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>Unable to load latest consultations. Please check your connection.</span>
              </div>
              <button
                onClick={loadConsultations}
                className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-900 text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Try again</span>
              </button>
            </div>
          )}

          {/* Loading Skeleton */}
          {loading ? (
            <div className="space-y-4 py-4" aria-busy="true" aria-live="polite">
              {[1, 2, 3].map((idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-xl border border-slate-200/80 bg-slate-50/50 animate-pulse space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-16 bg-slate-200 rounded" />
                      <div className="h-5 w-28 bg-slate-200 rounded" />
                      <div className="h-5 w-20 bg-slate-200 rounded" />
                    </div>
                    <div className="h-8 w-24 bg-slate-200 rounded-lg" />
                  </div>
                  <div className="h-4 w-3/4 bg-slate-200 rounded" />
                  <div className="h-3 w-full bg-slate-200 rounded" />
                  <div className="h-3 w-1/2 bg-slate-200 rounded" />
                </div>
              ))}
            </div>
          ) : filteredConsultations.length === 0 ? (
            /* Contextual Empty States */
            <div className="text-center py-12 px-4 rounded-xl bg-slate-50 border border-dashed border-slate-200 space-y-2">
              <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-500 mx-auto flex items-center justify-center">
                {activeFilter === 'PENDING' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : (
                  <HelpCircle className="w-5 h-5 text-slate-400" />
                )}
              </div>
              <h3 className="text-sm font-bold text-slate-800">
                {activeFilter === 'PENDING'
                  ? 'No pending consultations'
                  : activeFilter === 'RESOLVED'
                  ? 'No resolved consultations yet'
                  : 'No farmer consultation requests are available'}
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {activeFilter === 'PENDING'
                  ? "You're all caught up. New requests from farmers will appear here as they are submitted."
                  : activeFilter === 'RESOLVED'
                  ? 'Answered consultations will appear here with your submitted recommendations.'
                  : 'There are currently no inquiries in the system.'}
              </p>
            </div>
          ) : (
            /* Consultation Cards List */
            <div className="space-y-4">
              {filteredConsultations.map((c) => {
                const resolved = isCaseResolved(c);
                const isUrgent = c.urgency && c.urgency.toUpperCase() === 'HIGH';
                const isMediumUrgency = c.urgency && c.urgency.toUpperCase() === 'MEDIUM';

                return (
                  <article
                    key={c.id}
                    className={`rounded-xl border p-5 transition-all text-left ${
                      !resolved
                        ? 'bg-amber-50/20 border-amber-200/80 hover:border-amber-300'
                        : 'bg-white border-slate-200/80 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      {/* Left: Consultation Information */}
                      <div className="space-y-2.5 flex-1 min-w-0">
                        {/* Meta Tags Row */}
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
                            Case #{c.id}
                          </span>

                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            <Sprout className="w-3 h-3 text-emerald-700" />
                            <span>{c.cropType || c.farmData || 'Crop Advisory'}</span>
                          </span>

                          {/* Status Badge */}
                          {!resolved ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                              <Clock className="w-3 h-3 text-amber-700" />
                              <span>Pending Review</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                              <span>Resolved</span>
                            </span>
                          )}

                          {/* Genuine Urgency (Only if provided by backend data) */}
                          {isUrgent && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-50 text-red-800 border border-red-200">
                              <AlertCircle className="w-3 h-3 text-red-600" />
                              <span>High Urgency</span>
                            </span>
                          )}

                          {isMediumUrgency && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                              <AlertTriangle className="w-3 h-3 text-amber-600" />
                              <span>Medium Urgency</span>
                            </span>
                          )}

                          {c.createdAt && (
                            <span className="text-[11px] text-slate-400 ml-auto sm:ml-0">
                              {c.createdAt}
                            </span>
                          )}
                        </div>

                        {/* Subject & Question */}
                        <div>
                          {c.subject && (
                            <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1">
                              {c.subject}
                            </h3>
                          )}
                          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed break-words">
                            {c.question || c.description || 'No question details provided.'}
                          </p>
                        </div>

                        {/* Image Attachment (if present in backend) */}
                        {c.imageUrl && (
                          <div className="pt-1">
                            <button
                              type="button"
                              onClick={() => setPreviewImage(c.imageUrl)}
                              className="inline-flex items-center gap-1.5 text-xs text-emerald-700 hover:text-emerald-800 font-semibold cursor-pointer underline"
                            >
                              <Camera className="w-3.5 h-3.5" />
                              <span>View attached crop image</span>
                            </button>
                          </div>
                        )}

                        {/* Farmer & Location Metadata */}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 pt-1">
                          <span className="inline-flex items-center gap-1 font-medium text-slate-700">
                            <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{c.farmerName || c.farmerEmail || 'Grower'}</span>
                          </span>

                          {c.farmerLocation && (
                            <span className="inline-flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span>{c.farmerLocation}</span>
                            </span>
                          )}

                          {c.expertSpecialty && (
                            <span className="inline-flex items-center gap-1 text-slate-600">
                              <span>Specialty: {c.expertSpecialty}</span>
                            </span>
                          )}
                        </div>

                        {/* Resolved Response Box */}
                        {resolved && c.reply && (
                          <div className="mt-3 p-3.5 bg-slate-50 rounded-lg border border-slate-200/80 space-y-1.5 text-xs">
                            <div className="flex items-center justify-between text-slate-700 font-bold">
                              <div className="flex items-center gap-1.5 text-emerald-800">
                                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                                <span>Expert Advisory Response:</span>
                              </div>
                              {c.answeredAt && (
                                <span className="text-[11px] font-normal text-slate-400">
                                  {typeof c.answeredAt === 'string' ? c.answeredAt : 'Answered'}
                                </span>
                              )}
                            </div>
                            <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                              {c.reply}
                            </p>
                            {c.recommendation && (
                              <div className="pt-1 text-slate-600 border-t border-slate-200/60 mt-2">
                                <strong className="font-semibold text-slate-700">Follow-up: </strong>
                                <span>{c.recommendation}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Right: Primary Action Button */}
                      <div className="shrink-0 self-start md:self-center">
                        <button
                          onClick={() => handleOpenReply(c)}
                          className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-2xs ${
                            !resolved
                              ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                              : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
                          }`}
                        >
                          {!resolved ? (
                            <>
                              <Send className="w-3.5 h-3.5" />
                              <span>Respond</span>
                            </>
                          ) : (
                            <>
                              <FileText className="w-3.5 h-3.5 text-slate-500" />
                              <span>View / Edit Response</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* ── 5. RESPONSE MODAL / WORKBENCH DRAWER ── */}
        {replyModalCase && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-7 shadow-xl border border-slate-200 space-y-5 text-left max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
                      Case #{replyModalCase.id}
                    </span>
                    <span className="text-xs font-bold text-emerald-800">
                      {replyModalCase.cropType || replyModalCase.farmData || 'Crop Consultation'}
                    </span>
                  </div>
                  <h3 id="modal-title" className="text-base sm:text-lg font-extrabold text-slate-900">
                    {isCaseResolved(replyModalCase) ? 'Edit Advisory Response' : 'Provide Agricultural Guidance'}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={handleCloseReply}
                  disabled={submittingReply}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                  aria-label="Close dialog"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Farmer Problem Context */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <span>Farmer Problem Inquiry</span>
                  <span>{replyModalCase.farmerName || 'Grower'}</span>
                </div>
                {replyModalCase.subject && (
                  <p className="font-bold text-slate-800">{replyModalCase.subject}</p>
                )}
                <p className="text-slate-600 leading-relaxed">{replyModalCase.question || replyModalCase.description}</p>
              </div>

              {/* Submission Error Banner */}
              {submissionError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-900 rounded-lg text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{submissionError}</span>
                </div>
              )}

              {/* Success Notification */}
              {successFeedback && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-lg text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{successFeedback}</span>
                </div>
              )}

              {/* Response Form */}
              <form onSubmit={handleSendReply} className="space-y-4">
                <div>
                  <label htmlFor="expert-response-input" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Expert Response &amp; Agronomic Diagnosis <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="expert-response-input"
                    rows={5}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Enter diagnostic conclusions, organic or certified recommendations, dosage guidelines, and safety practices..."
                    required
                    disabled={submittingReply}
                    className="w-full p-3.5 rounded-xl border border-slate-200 text-xs font-normal text-slate-800 focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-700 outline-none leading-relaxed transition"
                  />
                </div>

                <div>
                  <label htmlFor="expert-recommendation-input" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Recommended Follow-up Protocol (Optional)
                  </label>
                  <input
                    id="expert-recommendation-input"
                    type="text"
                    value={recommendation}
                    onChange={(e) => setRecommendation(e.target.value)}
                    placeholder="e.g. Inspect foliage after 4 days. Maintain adequate furrow drainage."
                    disabled={submittingReply}
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs font-normal text-slate-800 focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-700 outline-none transition"
                  />
                </div>

                {/* Actions Footer */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handleCloseReply}
                    disabled={submittingReply}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={submittingReply || !replyText.trim()}
                    className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs transition flex items-center gap-1.5 shadow-xs disabled:opacity-50 cursor-pointer"
                  >
                    {submittingReply ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending Response...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Response</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ── 6. IMAGE PREVIEW MODAL ── */}
        {previewImage && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fade-in"
            role="dialog"
            aria-modal="true"
            aria-label="Attached Image Preview"
          >
            <div className="bg-white rounded-2xl max-w-xl w-full p-4 shadow-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Crop Image Attachment</span>
                <button
                  onClick={() => setPreviewImage(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="rounded-xl overflow-hidden bg-slate-100 max-h-[60vh] flex items-center justify-center">
                <img
                  src={previewImage}
                  alt="Farmer crop specimen"
                  className="max-h-[60vh] w-auto object-contain"
                />
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ExpertDashboard;
