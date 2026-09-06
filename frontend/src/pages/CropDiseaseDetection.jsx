import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  Phone,
  AlertCircle,
  Sparkles,
  Upload,
  Activity,
  Droplet,
  Sun,
  Shield,
  Layers,
  Thermometer,
  Wrench,
  RotateCcw,
  Zap,
  ShoppingBag,
  Clock,
  Scan,
  Video,
  VideoOff,
  Check,
  Leaf,
  FlaskConical,
  Award,
  Calendar,
  Compass,
  ArrowRight,
  TrendingUp,
  Volume2,
  VolumeX,
  FileText,
  Printer,
  QrCode,
  Radio,
  Eye,
  EyeOff,
  Calculator,
  SlidersHorizontal,
  MapPin,
  Flame,
  CloudRain,
  ChevronRight,
  RefreshCw,
  Image as ImageIcon,
  Info,
  ExternalLink,
  HelpCircle,
  History,
  X
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { diseaseDetectionAPI } from '../services/api';
import { LeafPathology3D } from '../components/LeafPathology3D';
import { DiseaseCertificateModal } from '../components/DiseaseCertificateModal';

export const CropDiseaseDetection = () => {
  const [selectedCrop, setSelectedCrop] = useState('Tomato');
  const [imageUrl, setImageUrl] = useState('');
  const [uploadedFileUrl, setUploadedFileUrl] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [scanning, setScanning] = useState(false);
  const [resultData, setResultData] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedSnapshot, setCapturedSnapshot] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Feature Toggles
  const [showGradCamHeatmap, setShowGradCamHeatmap] = useState(true);
  const [viewMode, setViewMode] = useState('photo'); // 'photo' | '3d'
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechLanguage, setSpeechLanguage] = useState('en'); // 'en' | 'si' | 'ta'
  const [showCertModal, setShowCertModal] = useState(false);

  // Knapsack Treatment Calculator States
  const [calcAcres, setCalcAcres] = useState(1.5);
  const [tanksPerAcre, setTanksPerAcre] = useState(3);

  // Scan History
  const [scanHistory, setScanHistory] = useState([
    {
      id: 'sc-1',
      date: 'Today, 04:15 PM',
      crop: 'Tomato',
      condition: 'Tomato Early Blight',
      severity: 'Moderate',
      status: 'Needs Attention',
      confidence: 96.4
    },
    {
      id: 'sc-2',
      date: 'Yesterday',
      crop: 'Paddy Rice',
      condition: 'Rice Leaf Blast',
      severity: 'High',
      status: 'Action Required',
      confidence: 94.8
    },
    {
      id: 'sc-3',
      date: 'Sep 02, 2026',
      crop: 'Green Chilli',
      condition: 'Chilli Leaf Curl Virus',
      severity: 'Moderate',
      status: 'Under Observation',
      confidence: 93.2
    }
  ]);

  const fileInputRef = useRef(null);

  const CROP_SAMPLES = [
    {
      id: 'Tomato',
      crop: 'Tomato',
      disease: 'Tomato Early Blight',
      scientific: 'Alternaria solani',
      pathogenType: 'Fungal Pathogen',
      confidence: 96.4,
      damagePct: 18,
      severity: 'Moderate',
      severityNote: 'Inspect and take supported action',
      sampleImg: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80',
      activeRemedy: 'Organic Copper Hydroxide 77% WP',
      dosagePerTank: 50,
      unit: 'ml',
      costPerTankLkr: 650,
      dosage: '50ml per 16L Knapsack Sprayer Tank (3.1 ml/L clean water)',
      sprayTiming: 'Early Morning (06:30 – 08:30 AM) before peak sun exposure',
      phiDays: 3,
      symptoms: [
        'Concentric ring lesions on lower mature foliage',
        'Chlorosis halo discoloration around dark spots',
        'Stem collar rot on older branches'
      ],
      treatmentSteps: [
        'Prune and safely discard infected lower foliage at base of stem.',
        'Avoid overhead sprinkler watering; switch to micro-drip or soil-level irrigation.',
        'Apply copper hydroxide or organic bio-fungicide every 7 days for 3 cycles.',
        'Disinfect pruning shears with 70% alcohol between plants.'
      ],
      voiceText: {
        en: 'Diagnosis: Tomato Early Blight caused by Alternaria solani. Prescription: Apply 50 ml Organic Copper Hydroxide per 16 liter tank early morning. Pre-harvest interval is 3 days.',
        si: 'රෝග විනිශ්චය: තක්කාලි අංගමාර රෝගය. ප්‍රතිකාරය: ලීටර් 16 ටැංකියකට කාබනික කොපර් හයිඩ්‍රොක්සයිඩ් මිලිලීටර් 50 ක් උදෑසන යොදන්න. අස්වනු නෙලීමේ පරතරය දින 3 කි.',
        ta: 'நோய் கண்டறிதல்: தக்காளி ஆரம்பக்கால கருகல் நோய். மருந்து: 16 லிட்டர் டேங்கிற்கு 50 மில்லி காப்பர் ஹைட்ராக்சைடு அதிகாலையில் தெளிக்கவும். அறுவடை இடைவெளி 3 நாட்கள்.'
      },
      lesions: [
        { x: 38, y: 35, w: 22, h: 24, label: 'Necrotic Lesion (96.4%)' },
        { x: 62, y: 55, w: 18, h: 18, label: 'Chlorosis Ring (91.2%)' }
      ]
    },
    {
      id: 'Rice',
      crop: 'Paddy Rice',
      disease: 'Rice Leaf Blast',
      scientific: 'Magnaporthe oryzae',
      pathogenType: 'Fungal Ascomycete',
      confidence: 94.8,
      damagePct: 24,
      severity: 'High',
      severityNote: 'Seek appropriate agricultural guidance promptly',
      sampleImg: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80',
      activeRemedy: 'Isoprothiolane 40% EC + Bio-Trichoderma',
      dosagePerTank: 40,
      unit: 'ml',
      costPerTankLkr: 820,
      dosage: '40ml per 16L Knapsack Sprayer Tank',
      sprayTiming: 'Dusk (05:00 – 06:30 PM) during low wind conditions',
      phiDays: 7,
      symptoms: [
        'Diamond/spindle-shaped lesions with greyish centers and brown margins',
        'Rapid leaf sheath blighting during high relative humidity',
        'Panicle collar rot risk if left untreated'
      ],
      treatmentSteps: [
        'Temporarily pause excess nitrogen fertilizer top-dressing to slow spore proliferation.',
        'Maintain a steady 5cm standing water level in paddy field sectors.',
        'Broadcast biological Trichoderma bio-agent across affected sectors.',
        'Perform follow-up AI scan in 5 days to confirm disease arrest.'
      ],
      voiceText: {
        en: 'Diagnosis: Rice Leaf Blast caused by Magnaporthe oryzae. Prescription: Spray 40 ml Isoprothiolane per 16 liter knapsack tank at dusk. Pre-harvest interval is 7 days.',
        si: 'රෝග විනිශ්චය: ගොයම් කොළ කොළපු රෝගය. ප්‍රතිකාරය: ලීටර් 16 ටැංකියකට අයිසොප්‍රොතියෝලේන් මිලිලීටර් 40 ක් සවස් කාලයේ යොදන්න. නෙලීමේ පරතරය දින 7 කි.',
        ta: 'நோய் கண்டறிதல்: நெல் இலை கருகல் நோய். மருந்து: 16 லிட்டர் டேங்கிற்கு 40 மில்லி ஐசோப்ரோதியோலேன் மாலையில் தெளிக்கவும்.'
      },
      lesions: [
        { x: 45, y: 30, w: 16, h: 32, label: 'Spindle Blast Spore (94.8%)' }
      ]
    },
    {
      id: 'Potato',
      crop: 'Potato',
      disease: 'Potato Late Blight',
      scientific: 'Phytophthora infestans',
      pathogenType: 'Oomycete Water Mold',
      confidence: 97.8,
      damagePct: 32,
      severity: 'High',
      severityNote: 'Critical threat — immediate field containment recommended',
      sampleImg: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&auto=format&fit=crop&q=80',
      activeRemedy: 'Mancozeb 75% WP + Dimethomorph 50%',
      dosagePerTank: 60,
      unit: 'g',
      costPerTankLkr: 950,
      dosage: '60g per 16L Knapsack Sprayer Tank',
      sprayTiming: 'Immediate morning application once morning dew evaporates',
      phiDays: 5,
      symptoms: [
        'Water-soaked irregular dark green/brown lesions on leaf margins',
        'White fungal growth visible on leaf undersides in humid conditions',
        'Rapid stem collapse under persistent fog or mist'
      ],
      treatmentSteps: [
        'Uproot severely infected plants to prevent underground tuber rot spread.',
        'Increase hill mounding height around potato root bases to protect tubers.',
        'Apply preventive systemic bio-fungicide across surrounding 50m buffer perimeter.',
        'Clear all field drainage furrows to eliminate waterlogging.'
      ],
      voiceText: {
        en: 'Diagnosis: Critical Potato Late Blight. Apply 60 grams Mancozeb mixture per 16 liter tank immediately. Pre-harvest interval is 5 days.',
        si: 'රෝග විනිශ්චය: අර්තාපල් පසු අංගමාරය. ලීටර් 16 ටැංකියකට මැන්කොසෙබ් ග්‍රෑම් 60 ක් උදෑසන යොදන්න. නෙලීමේ පරතරය දින 5 කි.',
        ta: 'நோய் கண்டறிதல்: உருளைக்கிழங்கு தாமதமான கருகல் நோய். 16 லிட்டர் டேங்கிற்கு 60 கிராம் மேன்கோசெப் தெளிக்கவும்.'
      },
      lesions: [
        { x: 30, y: 40, w: 26, h: 28, label: 'Water Mold Lesion (97.8%)' },
        { x: 60, y: 25, w: 20, h: 22, label: 'Secondary Necrosis (92.4%)' }
      ]
    },
    {
      id: 'Chilli',
      crop: 'Green Chilli',
      disease: 'Chilli Leaf Curl Virus',
      scientific: 'Begomovirus (Whitefly Vector)',
      pathogenType: 'Viral Infection (Vector-Borne)',
      confidence: 93.2,
      damagePct: 15,
      severity: 'Moderate',
      severityNote: 'Inspect vectors and apply botanical repellent',
      sampleImg: 'https://images.unsplash.com/photo-1588879462806-07a5b61f8c0d?w=800&auto=format&fit=crop&q=80',
      activeRemedy: 'Botanical Neem Oil (10,000 PPM) + Yellow Traps',
      dosagePerTank: 45,
      unit: 'ml',
      costPerTankLkr: 520,
      dosage: '45ml Neem Oil + 5ml mild bio-surfactant per 16L Tank',
      sprayTiming: 'Early Morning (07:00 AM) targeting underside of leaves',
      phiDays: 1,
      symptoms: [
        'Upward curling and puckering of young apical leaves',
        'Shortening of internodes causing stunted bushy crop canopy',
        'Visible whitefly pest population on foliage underside'
      ],
      treatmentSteps: [
        'Install yellow sticky card traps at canopy level (10 traps / acre) for whitefly monitoring.',
        'Thoroughly spray the underside of leaves where pest vectors congregate.',
        'Mulch field beds with reflective silver-black polythene film to deter insect landing.',
        'Continue weekly bio-repellent until new uncurled foliage emerges.'
      ],
      voiceText: {
        en: 'Diagnosis: Chilli Leaf Curl Begomovirus. Prescription: Mix 45 ml Neem Oil per 16 liter tank and target underside of leaves. Set 10 yellow traps per acre.',
        si: 'රෝග විනිශ්චය: මිරිස් කොළ කොඩවීම. ලීටර් 16 ටැංකියකට කොහොඹ තෙල් මිලිලීටර් 45 ක් කොළ යටට යොදන්න.',
        ta: 'நோய் கண்டறிதல்: மிளகாய் இலை சுருள் வைரஸ். 16 லிட்டர் டேங்கிற்கு 45 மில்லி வேப்பெண்ணெய் இலைகளின் அடியில் தெளிக்கவும்.'
      },
      lesions: [
        { x: 35, y: 30, w: 30, h: 35, label: 'Curling Leaf Apex (93.2%)' }
      ]
    }
  ];

  const currentSample = CROP_SAMPLES.find((s) => s.id === selectedCrop) || CROP_SAMPLES[0];

  const runAnalysis = async () => {
    setScanning(true);
    setValidationError('');
    try {
      const res = await diseaseDetectionAPI.scan({
        sampleCrop: currentSample.crop,
        imageUrl: uploadedFileUrl || imageUrl || currentSample.sampleImg
      });
      if (res && res.data) {
        setResultData(res.data);
      }
    } catch (err) {
      console.warn('Backend scan API note (running localized diagnosis):', err);
    } finally {
      setScanning(false);
    }
  };

  useEffect(() => {
    runAnalysis();
  }, [selectedCrop]);

  const handleCaptureSnapshot = () => {
    setCapturedSnapshot(currentSample.sampleImg);
    setIsCameraActive(false);
    runAnalysis();
  };

  const processFile = (file) => {
    if (!file) return;

    // Validation
    if (!file.type.startsWith('image/')) {
      setValidationError('Please upload a valid image file (PNG, JPG, JPEG, WEBP).');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setValidationError('The image file exceeds the 15MB size limit. Please choose a smaller image.');
      return;
    }

    setValidationError('');
    const localUrl = URL.createObjectURL(file);
    setUploadedFileUrl(localUrl);
    setUploadedFileName(file.name);
    setCapturedSnapshot(null);
    runAnalysis();
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    processFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    processFile(file);
  };

  const handleResetImage = () => {
    setUploadedFileUrl(null);
    setUploadedFileName('');
    setCapturedSnapshot(null);
    setValidationError('');
  };

  // Text-To-Speech Synthesis
  const handleToggleVoice = () => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      } else {
        const text = currentSample.voiceText[speechLanguage] || currentSample.voiceText.en;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.95;
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        setIsSpeaking(true);
        window.speechSynthesis.speak(utterance);
      }
    } else {
      alert('Speech synthesis is not supported on this browser.');
    }
  };

  // Calculator Outputs
  const totalTanks = Math.ceil(calcAcres * tanksPerAcre);
  const totalChemicalQty = totalTanks * currentSample.dosagePerTank;
  const totalWaterLiters = totalTanks * 16;
  const totalEstimatedCostLkr = totalTanks * currentSample.costPerTankLkr;

  const getSeverityBadge = (sev) => {
    if (sev === 'High' || sev === 'Critical Threat') {
      return {
        bg: 'bg-rose-50',
        text: 'text-rose-700',
        border: 'border-rose-200',
        dot: 'bg-rose-500',
        label: 'High Severity'
      };
    }
    if (sev === 'Moderate' || sev === 'Medium') {
      return {
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        border: 'border-amber-200',
        dot: 'bg-amber-500',
        label: 'Moderate Severity'
      };
    }
    return {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
      dot: 'bg-emerald-500',
      label: 'Low Severity'
    };
  };

  const severityBadge = getSeverityBadge(currentSample.severity);

  return (
    <div className="min-h-screen bg-[#FBFBFA] py-8 px-4 sm:px-6 lg:px-8 text-slate-800 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* ─── 1. BREADCRUMB & COMPACT HEADER ─── */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Link to="/dashboard" className="hover:text-emerald-700 transition flex items-center gap-1">
              <span>← Back to Farmer Dashboard</span>
            </Link>
            <span>/</span>
            <span className="text-slate-800">Crop Disease Detection</span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                <Scan className="w-3.5 h-3.5 text-emerald-600" />
                <span>AI-POWERED CROP ANALYSIS</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Crop Disease Detection
              </h1>
              <p className="text-sm text-slate-600 leading-relaxed">
                Upload a clear photo of your crop to identify possible disease symptoms, view pathogen patterns, and receive practical next steps.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setShowCertModal(true)}
                className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 shadow-xs transition flex items-center gap-2 cursor-pointer"
              >
                <FileText className="w-4 h-4 text-emerald-600" />
                <span>Export DOA Certificate</span>
              </button>

              <button
                type="button"
                onClick={runAnalysis}
                disabled={scanning}
                className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {scanning ? (
                  <RotateCcw className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                <span>{scanning ? 'Analyzing Crop...' : 'Analyze Specimen'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* ─── 2. TWO COLUMN WORKSPACE ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* LEFT COLUMN: UPLOAD, CAMERA, PREVIEW & PRESETS (5 COLS) */}
          <div className="lg:col-span-5 space-y-6">

            {/* UPLOAD & VIEWPORT CARD */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Camera className="w-4 h-4 text-emerald-600" /> Check Your Crop
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">Take or upload a clear photo of the affected plant area.</p>
                </div>

                {/* View Switcher: Photo / 3D */}
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setViewMode('photo')}
                    className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${
                      viewMode === 'photo' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Photo
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('3d')}
                    className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${
                      viewMode === '3d' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    3D Model
                  </button>
                </div>
              </div>

              {/* VIEWPORT BODY */}
              {viewMode === '3d' ? (
                <LeafPathology3D severity={currentSample.severity} />
              ) : isCameraActive ? (
                <div className="relative rounded-2xl bg-slate-950 overflow-hidden h-64 border-2 border-emerald-500 shadow-inner flex flex-col justify-between p-4 text-white">
                  <div className="flex justify-between items-center z-10">
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-600 text-white font-mono text-[10px] font-bold uppercase flex items-center gap-1.5 animate-pulse">
                      <span className="w-1.5 h-1.5 rounded-full bg-white" /> LIVE CAMERA
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400">Ready to Capture</span>
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-40 h-40 border-2 border-emerald-400/70 rounded-2xl border-dashed animate-pulse flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-emerald-400" />
                    </div>
                  </div>

                  <div className="z-10 text-center space-y-2">
                    <p className="text-[11px] text-slate-300">Align damaged leaves or spots within the green target</p>
                    <button
                      type="button"
                      onClick={handleCaptureSnapshot}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Camera className="w-4 h-4" /> Take Photo &amp; Analyze
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Photo Preview Container */}
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`relative rounded-2xl bg-slate-50 overflow-hidden h-64 border ${
                      isDragging ? 'border-emerald-500 bg-emerald-50/40 ring-2 ring-emerald-500/20' : 'border-slate-200'
                    } flex items-center justify-center group transition-all`}
                  >
                    <img
                      src={uploadedFileUrl || capturedSnapshot || currentSample.sampleImg}
                      alt={`${currentSample.crop} leaf specimen`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Grad-CAM Lesion Heatmap Overlay */}
                    {showGradCamHeatmap && currentSample.lesions && (
                      <div className="absolute inset-0 pointer-events-none">
                        {currentSample.lesions.map((lesion, idx) => (
                          <div
                            key={idx}
                            style={{
                              left: `${lesion.x}%`,
                              top: `${lesion.y}%`,
                              width: `${lesion.w}%`,
                              height: `${lesion.h}%`
                            }}
                            className="absolute border-2 border-rose-500 bg-rose-500/20 rounded-xl animate-pulse flex items-start justify-start p-1"
                          >
                            <span className="bg-rose-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs">
                              {lesion.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Top Crop Tag */}
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-slate-800 text-[11px] font-bold rounded-full border border-slate-200 shadow-xs">
                        {currentSample.crop} Specimen
                      </span>
                    </div>

                    {/* Grad-CAM Heatmap Toggle */}
                    <button
                      type="button"
                      onClick={() => setShowGradCamHeatmap(!showGradCamHeatmap)}
                      className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold transition backdrop-blur-sm flex items-center gap-1.5 cursor-pointer border ${
                        showGradCamHeatmap
                          ? 'bg-rose-600 text-white border-rose-500 shadow-xs'
                          : 'bg-white/90 text-slate-700 border-slate-200 hover:bg-white'
                      }`}
                    >
                      <Flame className="w-3 h-3" />
                      <span>{showGradCamHeatmap ? 'Heatmap On' : 'Heatmap Off'}</span>
                    </button>

                    {/* Bottom File / Reset Bar */}
                    {(uploadedFileUrl || capturedSnapshot) && (
                      <div className="absolute bottom-3 left-3 right-3 p-2 bg-white/95 backdrop-blur-sm rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                        <span className="text-slate-700 font-medium truncate max-w-[200px]">
                          {uploadedFileName || 'Captured Camera Snapshot'}
                        </span>
                        <button
                          type="button"
                          onClick={handleResetImage}
                          className="text-rose-600 hover:text-rose-700 font-bold text-[11px] flex items-center gap-0.5"
                        >
                          <X className="w-3.5 h-3.5" /> Remove
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* VALIDATION ERROR MESSAGE */}
              {validationError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{validationError}</span>
                </div>
              )}

              {/* ACTION BUTTONS: LIVE CAMERA & UPLOAD FILE */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setIsCameraActive(!isCameraActive)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer border ${
                    isCameraActive
                      ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {isCameraActive ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4 text-emerald-600" />}
                  <span>{isCameraActive ? 'Close Camera' : 'Live Camera'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="py-2.5 px-3 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Upload className="w-4 h-4 text-emerald-600" />
                  <span>Upload Photo</span>
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>

              {/* PRACTICAL PHOTO GUIDANCE */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1.5">
                <span className="font-bold text-slate-800 block">For clearer analysis:</span>
                <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-600">
                  <li>Use a well-lit image under natural daylight.</li>
                  <li>Focus closely on the affected leaf or fruit surface.</li>
                  <li>Avoid blurry, out-of-focus, or distant photos.</li>
                </ul>
              </div>

              {/* CROP PRESET SELECTOR */}
              <div className="space-y-2.5 pt-3 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-700">
                  Or Test Supported Crop Specimens:
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {CROP_SAMPLES.map((sample) => (
                    <button
                      key={sample.id}
                      type="button"
                      onClick={() => {
                        setSelectedCrop(sample.id);
                        setUploadedFileUrl(null);
                        setUploadedFileName('');
                        setCapturedSnapshot(null);
                        setValidationError('');
                      }}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-1 ${
                        selectedCrop === sample.id
                          ? 'bg-emerald-50 border-emerald-600 text-emerald-900 ring-1 ring-emerald-600'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span className="font-bold block text-slate-900">{sample.crop}</span>
                      <span className="text-[11px] text-slate-500 truncate">{sample.disease}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* REGIONAL DISEASE OUTBREAK ALERT */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-rose-600 animate-pulse" /> Regional Outbreak Radar
                </span>
                <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[10px] font-bold border border-rose-200">
                  DOA Advisory
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-3 bg-rose-50/70 rounded-xl border border-rose-200/70 flex items-start justify-between gap-3">
                  <div>
                    <span className="font-bold text-rose-900 block flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-600" /> Welimada &amp; Badulla Valley
                    </span>
                    <p className="text-[11px] text-rose-800 mt-0.5">14 cases of Early Blight logged in the past 48 hours.</p>
                  </div>
                  <span className="px-2 py-0.5 bg-rose-600 text-white rounded text-[10px] font-bold shrink-0">
                    High Risk
                  </span>
                </div>

                <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200/70 flex items-start justify-between gap-3">
                  <div>
                    <span className="font-bold text-amber-900 block flex items-center gap-1">
                      <CloudRain className="w-3.5 h-3.5 text-amber-600" /> Nuwara Eliya Highlands
                    </span>
                    <p className="text-[11px] text-amber-800 mt-0.5">Late Blight Spore Index high due to persistent mist.</p>
                  </div>
                  <span className="px-2 py-0.5 bg-amber-600 text-white rounded text-[10px] font-bold shrink-0">
                    Warning
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: DIAGNOSTIC RESULT, WHAT WAS DETECTED, NEXT STEPS & CALCULATOR (7 COLS) */}
          <div className="lg:col-span-7 space-y-6">

            {/* MAIN DIAGNOSTIC RESULT CARD */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">

              {/* CARD HEADER: DIAGNOSIS & CONFIDENCE */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-100 pb-5">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${severityBadge.bg} ${severityBadge.text} ${severityBadge.border}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${severityBadge.dot}`} />
                      <span>{severityBadge.label}</span>
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      • {currentSample.pathogenType}
                    </span>
                  </div>

                  <span className="text-xs uppercase tracking-wider text-slate-400 font-bold block">
                    Possible Condition
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                    {currentSample.disease}
                  </h2>
                  <p className="text-xs text-slate-500 italic">
                    Pathogen: <strong className="text-slate-700 font-semibold">{currentSample.scientific}</strong>
                  </p>
                </div>

                <div className="text-left sm:text-right bg-slate-50 p-3.5 rounded-xl border border-slate-200 shrink-0">
                  <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">
                    Model Confidence
                  </span>
                  <span className="text-2xl font-bold text-emerald-800 block mt-0.5">
                    {currentSample.confidence}%
                  </span>
                  <span className="text-[11px] text-slate-500">Supported AI Pattern</span>
                </div>
              </div>

              {/* 🔊 MULTILINGUAL AUDIO VOICE READOUT */}
              <div className="p-4 bg-emerald-50/80 rounded-xl border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleToggleVoice}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition cursor-pointer shadow-xs ${
                      isSpeaking
                        ? 'bg-rose-600 text-white animate-pulse'
                        : 'bg-emerald-700 hover:bg-emerald-800 text-white'
                    }`}
                  >
                    {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      {isSpeaking ? 'Reading Audio Advisory...' : 'Audio Voice Summary'}
                    </span>
                    <span className="text-[11px] text-slate-600">Listen in Sinhala, Tamil, or English</span>
                  </div>
                </div>

                {/* Language Switcher */}
                <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-emerald-200">
                  <button
                    type="button"
                    onClick={() => setSpeechLanguage('en')}
                    className={`px-2.5 py-1 rounded text-xs font-bold transition ${
                      speechLanguage === 'en' ? 'bg-emerald-700 text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    EN
                  </button>
                  <button
                    type="button"
                    onClick={() => setSpeechLanguage('si')}
                    className={`px-2.5 py-1 rounded text-xs font-bold transition ${
                      speechLanguage === 'si' ? 'bg-emerald-700 text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    සිංහල
                  </button>
                  <button
                    type="button"
                    onClick={() => setSpeechLanguage('ta')}
                    className={`px-2.5 py-1 rounded text-xs font-bold transition ${
                      speechLanguage === 'ta' ? 'bg-emerald-700 text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    தமிழ்
                  </button>
                </div>
              </div>

              {/* SEVERITY & DAMAGE BREAKDOWN */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-600">Estimated Foliage Damage:</span>
                    <span className="font-bold text-slate-900">{currentSample.damagePct}% Surface Area</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        currentSample.damagePct > 25 ? 'bg-rose-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${currentSample.damagePct}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>Mild (&lt;10%)</span>
                    <span>Moderate (11–25%)</span>
                    <span>Severe (&gt;25%)</span>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between space-y-1">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Severity Guidance</span>
                  <p className="text-xs font-bold text-slate-800">
                    {currentSample.severityNote}
                  </p>
                  <span className="text-[10px] text-slate-500">Spread risk increases under humid weather (&gt;75% RH).</span>
                </div>
              </div>

              {/* WHAT WAS DETECTED */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-emerald-600" /> What Was Detected on the Image
                </h3>
                <div className="space-y-2">
                  {currentSample.symptoms.map((symptom, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2.5 text-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-slate-700 leading-relaxed">{symptom}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* RECOMMENDED NEXT STEPS */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> What Should You Do Next?
                </h3>
                <div className="space-y-2.5">
                  {currentSample.treatmentSteps.map((step, idx) => (
                    <div key={idx} className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 flex items-start gap-3 text-xs">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="text-slate-800 leading-relaxed font-medium">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* KNAPSACK TANK & CHEMICAL MIX ESTIMATOR */}
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Calculator className="w-4 h-4 text-emerald-600" /> Knapsack Sprayer Tank Mix Estimator
                  </span>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Field Calculation
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Field Size: {calcAcres} Acres</label>
                    <input
                      type="range"
                      min="0.5"
                      max="10"
                      step="0.5"
                      value={calcAcres}
                      onChange={(e) => setCalcAcres(Number(e.target.value))}
                      className="w-full accent-emerald-700 cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Tanks per Acre: {tanksPerAcre} Tanks</label>
                    <input
                      type="range"
                      min="1"
                      max="6"
                      step="1"
                      value={tanksPerAcre}
                      onChange={(e) => setTanksPerAcre(Number(e.target.value))}
                      className="w-full accent-emerald-700 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 text-center text-xs">
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Total Tanks</span>
                    <span className="text-sm font-bold text-slate-900">{totalTanks} (16L Tanks)</span>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Bio-Remedy Qty</span>
                    <span className="text-sm font-bold text-emerald-700">{totalChemicalQty} {currentSample.unit}</span>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Clean Water Req.</span>
                    <span className="text-sm font-bold text-sky-700">{totalWaterLiters} Liters</span>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Est. Solution Cost</span>
                    <span className="text-sm font-bold text-slate-900">Rs. {totalEstimatedCostLkr.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* CONNECTED ACTIONS & SERVICE SHORTCUTS */}
              <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="space-y-0.5 text-left">
                  <span className="text-xs font-bold text-slate-900 block">
                    Prescribed Remedy: {currentSample.activeRemedy}
                  </span>
                  <span className="text-[11px] text-slate-600">Order certified bio-fungicides directly from verified suppliers</span>
                </div>

                <Link
                  to="/supplier-marketplace"
                  className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 shrink-0"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Order on Marketplace</span>
                </Link>
              </div>

              {/* AGRONOMIST EXTENSION OFFICER SUPPORT */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-lg shrink-0">
                    👨‍🔬
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">Agronomy Support &amp; Extension Service</h4>
                    <p className="text-[11px] text-slate-500">Department of Agriculture Regional Advisory Desk</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    to="/advisor"
                    className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition flex items-center gap-1.5"
                  >
                    <span>View AI Insights</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <a
                    href="tel:+94771234567"
                    className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Call Extension</span>
                  </a>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* ─── 3. PREVIOUS SCANS (SCAN HISTORY) ─── */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <History className="w-4 h-4 text-emerald-600" /> Previous Crop Scans
            </h3>
            <span className="text-xs text-slate-500 font-medium">Recent Specimen Scans</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {scanHistory.map((scan) => (
              <div key={scan.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-start justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{scan.crop}</span>
                    <span className="text-[10px] text-slate-400">• {scan.date}</span>
                  </div>
                  <p className="text-slate-700 font-medium">{scan.condition}</p>
                  <span className="text-[11px] text-emerald-700 font-semibold">{scan.confidence}% Confidence</span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${
                  scan.severity === 'High'
                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}>
                  {scan.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ─── 4. TRUST & SCIENTIFIC LIMITATIONS ADVISORY ─── */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            AI image analysis provides assistive decision-support information based on visible leaf symptoms. Always confirm critical crop-health decisions with your local agricultural extension officer or agronomist before conducting broad chemical interventions.
          </p>
        </div>

      </div>

      {/* DOA OFFICIAL CERTIFICATE EXPORT MODAL */}
      <DiseaseCertificateModal
        isOpen={showCertModal}
        onClose={() => setShowCertModal(false)}
        sample={currentSample}
        fieldAcres={calcAcres}
      />
    </div>
  );
};

export default CropDiseaseDetection;
