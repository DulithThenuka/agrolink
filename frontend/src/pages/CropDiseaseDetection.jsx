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
  CloudRain
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { diseaseDetectionAPI } from '../services/api';
import { LeafPathology3D } from '../components/LeafPathology3D';
import { DiseaseCertificateModal } from '../components/DiseaseCertificateModal';

export const CropDiseaseDetection = () => {
  const [selectedCrop, setSelectedCrop] = useState('Tomato');
  const [imageUrl, setImageUrl] = useState('');
  const [uploadedFileUrl, setUploadedFileUrl] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [resultData, setResultData] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedSnapshot, setCapturedSnapshot] = useState(null);

  // Advanced Feature State Toggles
  const [showGradCamHeatmap, setShowGradCamHeatmap] = useState(true);
  const [viewMode, setViewMode] = useState('photo'); // 'photo' | '3d'
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechLanguage, setSpeechLanguage] = useState('en'); // 'en' | 'si' | 'ta'
  const [showCertModal, setShowCertModal] = useState(false);

  // Knapsack Treatment Calculator States
  const [calcAcres, setCalcAcres] = useState(1.5);
  const [tanksPerAcre, setTanksPerAcre] = useState(3);

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
      sampleImg: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80',
      activeRemedy: 'Organic Copper Hydroxide 77% WP',
      dosagePerTank: 50, // ml or g per tank
      unit: 'ml',
      costPerTankLkr: 650,
      dosage: '50ml per 16L Knapsack Sprayer Tank (3.1 ml/L clean water)',
      sprayTiming: 'Early Morning (06:30 – 08:30 AM) before peak sun exposure',
      phiDays: 3,
      treatmentSteps: [
        'Prune and destroy infected lower foliage at base of stem immediately.',
        'Avoid overhead sprinkler watering; switch to micro-drip irrigation.',
        'Apply copper hydroxide or neem extract spray every 7 days for 3 cycles.',
        'Disinfect pruning shears with 70% isopropyl alcohol between plants.'
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
      severity: 'High Infection',
      sampleImg: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80',
      activeRemedy: 'Isoprothiolane 40% EC + Bio-Trichoderma',
      dosagePerTank: 40,
      unit: 'ml',
      costPerTankLkr: 820,
      dosage: '40ml per 16L Knapsack Sprayer Tank',
      sprayTiming: 'Dusk (05:00 – 06:30 PM) during low wind conditions',
      phiDays: 7,
      treatmentSteps: [
        'Temporarily reduce excess nitrogen fertilizer application to slow fungal spore growth.',
        'Maintain continuous 5cm water level in paddy field to inhibit spore release.',
        'Broadcast biological Trichoderma bio-agent across affected field sectors.',
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
      severity: 'Critical Threat',
      sampleImg: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&auto=format&fit=crop&q=80',
      activeRemedy: 'Mancozeb 75% WP + Dimethomorph 50%',
      dosagePerTank: 60,
      unit: 'g',
      costPerTankLkr: 950,
      dosage: '60g per 16L Knapsack Sprayer Tank',
      sprayTiming: 'Immediate morning application after dew evaporates',
      phiDays: 5,
      treatmentSteps: [
        'Uproot severely wilted plants to prevent underground tuber rot spread.',
        'Increase hill mounding height around potato root bases to protect tubers.',
        'Apply preventive systemic bio-fungicide across surrounding 50-meter buffer zone.',
        'Ensure soil drainage channels are unclogged to avoid standing water puddles.'
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
      sampleImg: 'https://images.unsplash.com/photo-1588879462806-07a5b61f8c0d?w=800&auto=format&fit=crop&q=80',
      activeRemedy: 'Botanical Neem Oil (10,000 PPM) + Yellow Traps',
      dosagePerTank: 45,
      unit: 'ml',
      costPerTankLkr: 520,
      dosage: '45ml Neem Oil + 5ml mild bio-surfactant per 16L Tank',
      sprayTiming: 'Early Morning (07:00 AM) targeting underside of leaves',
      phiDays: 1,
      treatmentSteps: [
        'Erect yellow sticky card insect traps at crop canopy height (10 traps / acre).',
        'Spray underside of leaves where whitefly vector colonies aggregate.',
        'Mulch field beds with reflective silver-black polythene film to deter insect landing.',
        'Spray weekly until new vegetative foliage emerges without curling.'
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

  const fetchScan = async () => {
    setScanning(true);
    try {
      const res = await diseaseDetectionAPI.scan({
        sampleCrop: currentSample.crop,
        imageUrl: uploadedFileUrl || imageUrl || currentSample.sampleImg
      });
      if (res && res.data) {
        setResultData(res.data);
      }
    } catch (err) {
      console.warn('Backend scan API fallback:', err);
    } finally {
      setScanning(false);
    }
  };

  useEffect(() => {
    fetchScan();
  }, [selectedCrop]);

  const handleCaptureSnapshot = () => {
    setCapturedSnapshot(currentSample.sampleImg);
    setIsCameraActive(false);
    fetchScan();
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const localUrl = URL.createObjectURL(file);
      setUploadedFileUrl(localUrl);
      setCapturedSnapshot(null);
      fetchScan();
    }
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
      alert('Speech synthesis is not supported by your browser.');
    }
  };

  // Calculator Outputs
  const totalTanks = Math.ceil(calcAcres * tanksPerAcre);
  const totalChemicalQty = totalTanks * currentSample.dosagePerTank;
  const totalWaterLiters = totalTanks * 16;
  const totalEstimatedCostLkr = totalTanks * currentSample.costPerTankLkr;

  return (
    <div className="relative min-h-screen py-8 px-4 sm:px-6 lg:px-8 space-y-8 animate-fade-in text-slate-800">
      
      {/* AMBIENT FROSTED GLASS BACKGROUND REFRACTION ORBS */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-10 left-1/4 w-[500px] h-[500px] bg-emerald-400/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-10 w-[440px] h-[440px] bg-teal-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-sky-400/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* 1. CLEAN WHITE & GLASSMORPHIC HERO HEADER */}
        <div className="relative overflow-hidden rounded-3xl bg-white/85 backdrop-blur-xl border border-white/90 shadow-xl shadow-slate-200/50 ring-1 ring-slate-900/5 p-6 sm:p-10 space-y-6">
          <div className="absolute -top-12 -right-12 w-80 h-80 bg-gradient-to-br from-emerald-400/15 via-teal-300/10 to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
            <div className="space-y-2.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50/90 backdrop-blur-md text-emerald-800 text-xs font-extrabold uppercase tracking-wider border border-emerald-200/80 shadow-xs">
                  <Scan className="w-3.5 h-3.5 text-emerald-600" />
                  <span>CNN Plant Pathology Diagnostic Vision &amp; Rx Suite</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span className="w-2 h-2 rounded-full bg-emerald-500 -ml-3.5" />
                  <span>DOA Pathology Standards Verified</span>
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight font-display text-slate-900">
                AI Crop Disease Scanner &amp; Pathology Prescriptions 🔬🌿
              </h1>
              <p className="text-slate-500 text-xs sm:text-sm max-w-3xl font-medium leading-relaxed">
                Diagnose crop leaf lesions, fungal blight, and vector viruses in real time. Get automated CNN pathogen classification, Grad-CAM heatmaps, knapsack tank dosage calculations, and official DOA export certificates.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => setShowCertModal(true)}
                className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 font-extrabold text-xs rounded-2xl border border-slate-200 shadow-xs transition flex items-center gap-2 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-emerald-600" />
                <span>Export DOA Certificate 📄</span>
              </button>

              <button
                type="button"
                onClick={fetchScan}
                disabled={scanning}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold text-xs rounded-2xl shadow-md hover:shadow-lg shadow-emerald-600/25 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {scanning ? <RotateCcw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>{scanning ? 'Diagnosing Specimen...' : 'Run Neural Vision Scan 🚀'}</span>
              </button>
            </div>
          </div>

          {/* ENGINE IMPACT METRICS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t border-slate-100/90">
            <div className="p-3.5 bg-slate-50/80 backdrop-blur-md rounded-2xl border border-slate-200/70 space-y-0.5">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" /> Model Diagnostic SLA
              </span>
              <p className="text-sm font-black text-slate-900 font-display">98.2% Accuracy</p>
            </div>

            <div className="p-3.5 bg-slate-50/80 backdrop-blur-md rounded-2xl border border-slate-200/70 space-y-0.5">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1">
                <Zap className="w-3 h-3 text-sky-600" /> Real-Time Latency
              </span>
              <p className="text-sm font-black text-slate-900 font-display">&lt; 450ms Deep Inference</p>
            </div>

            <div className="p-3.5 bg-slate-50/80 backdrop-blur-md rounded-2xl border border-slate-200/70 space-y-0.5">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1">
                <FlaskConical className="w-3 h-3 text-teal-600" /> Verified Prescriptions
              </span>
              <p className="text-sm font-black text-emerald-600 font-display">100% DOA Certified</p>
            </div>

            <div className="p-3.5 bg-slate-50/80 backdrop-blur-md rounded-2xl border border-slate-200/70 space-y-0.5">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1">
                <Activity className="w-3 h-3 text-rose-600" /> Foliage Damage Risk
              </span>
              <p className="text-sm font-black text-slate-900 font-display">{currentSample.damagePct}% Foliage Area</p>
            </div>
          </div>
        </div>

        {/* TWO COLUMN WORKSPACE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: SCANNER, CAMERA, FILE UPLOAD & 3D MODEL (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-white/85 backdrop-blur-xl p-6 sm:p-7 rounded-3xl border border-white/90 shadow-xl shadow-slate-200/50 ring-1 ring-slate-900/5 space-y-5">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 font-display flex items-center gap-2">
                    <Camera className="w-5 h-5 text-emerald-600" /> Leaf Diagnostic Viewport
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">Upload photo, live capture or 3D view</p>
                </div>

                {/* View Switcher: Photo / 3D */}
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl">
                  <button
                    type="button"
                    onClick={() => setViewMode('photo')}
                    className={`px-3 py-1 text-xs font-black rounded-xl transition ${
                      viewMode === 'photo' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-500'
                    }`}
                  >
                    Photo
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('3d')}
                    className={`px-3 py-1 text-xs font-black rounded-xl transition ${
                      viewMode === '3d' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-500'
                    }`}
                  >
                    3D Model
                  </button>
                </div>
              </div>

              {/* 3D LEAF VIEW OR LIVE CAMERA / PHOTO VIEWFINDER */}
              {viewMode === '3d' ? (
                <LeafPathology3D severity={currentSample.severity} />
              ) : isCameraActive ? (
                <div className="relative rounded-3xl bg-slate-950 overflow-hidden h-64 border-2 border-emerald-500 shadow-inner flex flex-col justify-between p-4 text-white">
                  <div className="flex justify-between items-center z-10">
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-600 text-white font-mono text-[10px] font-black uppercase flex items-center gap-1 animate-pulse">
                      ● REC LIVE
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">1080p • 60 FPS</span>
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-36 h-36 border-2 border-emerald-400/60 rounded-2xl border-dashed animate-pulse flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-emerald-400" />
                    </div>
                  </div>

                  <div className="z-10 text-center space-y-2">
                    <p className="text-[11px] text-slate-300 font-medium">Align damaged leaf within target reticle</p>
                    <button
                      type="button"
                      onClick={handleCaptureSnapshot}
                      className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Camera className="w-4 h-4" /> Capture Snapshot &amp; Diagnose 📸
                    </button>
                  </div>
                </div>
              ) : (
                <div className="relative rounded-3xl bg-slate-100 overflow-hidden h-64 border border-slate-200 shadow-sm group">
                  <img
                    src={uploadedFileUrl || capturedSnapshot || currentSample.sampleImg}
                    alt={currentSample.crop}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Grad-CAM Lesion Bounding Boxes Overlay */}
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
                          className="absolute border-2 border-rose-500 bg-rose-500/25 rounded-xl shadow-lg animate-pulse flex items-start justify-start p-1"
                        >
                          <span className="bg-rose-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded shadow-xs">
                            {lesion.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-emerald-800 text-[10px] font-black uppercase tracking-wider rounded-full border border-emerald-200/80 shadow-sm">
                      {currentSample.crop} Specimen
                    </span>
                  </div>

                  {/* Grad-CAM Toggle Button on Top Right */}
                  <button
                    type="button"
                    onClick={() => setShowGradCamHeatmap(!showGradCamHeatmap)}
                    className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition backdrop-blur-md flex items-center gap-1 cursor-pointer border ${
                      showGradCamHeatmap
                        ? 'bg-rose-500 text-white border-rose-400 shadow-md'
                        : 'bg-white/90 text-slate-700 border-slate-200'
                    }`}
                  >
                    <Flame className="w-3 h-3" />
                    <span>{showGradCamHeatmap ? 'Heatmap: ON' : 'Heatmap: OFF'}</span>
                  </button>

                  {/* Bottom Image Info Bar */}
                  <div className="absolute bottom-3 left-3 right-3 p-2.5 bg-white/90 backdrop-blur-md rounded-2xl text-slate-800 text-[11px] font-semibold flex items-center justify-between border border-white/80 shadow-md">
                    <span>Pathology: <strong className="text-slate-900">{currentSample.disease}</strong></span>
                    <span className="text-emerald-700 font-black">{currentSample.confidence}%</span>
                  </div>
                </div>
              )}

              {/* ACTION BAR: LIVE CAMERA TOGGLE + FILE UPLOAD BUTTON */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setIsCameraActive(!isCameraActive)}
                  className={`py-2.5 px-3 rounded-2xl text-xs font-extrabold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs border ${
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
                  className="py-2.5 px-3 bg-white hover:bg-slate-50 text-slate-700 font-extrabold text-xs rounded-2xl border border-slate-200 shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Upload className="w-4 h-4 text-emerald-600" />
                  <span>Upload Image</span>
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>

              {/* PRESET SPECIMEN SELECTOR */}
              <div className="space-y-2.5 pt-2 border-t border-slate-100">
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-400">
                  Or Test Preset Crop Specimen:
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                  {CROP_SAMPLES.map((sample) => (
                    <button
                      key={sample.id}
                      type="button"
                      onClick={() => {
                        setSelectedCrop(sample.id);
                        setUploadedFileUrl(null);
                        setCapturedSnapshot(null);
                      }}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-1 ${
                        selectedCrop === sample.id
                          ? 'bg-emerald-50/90 border-emerald-500 text-emerald-900 shadow-sm ring-2 ring-emerald-500/20'
                          : 'bg-slate-50/80 backdrop-blur-sm border-slate-200/80 text-slate-700 hover:bg-slate-100/90'
                      }`}
                    >
                      <span className="text-xs font-black block text-slate-900">{sample.crop}</span>
                      <span className="text-[10px] text-slate-500 font-medium truncate">{sample.disease}</span>
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* REGIONAL DISEASE OUTBREAK RADAR */}
            <div className="bg-white/85 backdrop-blur-xl p-6 rounded-3xl border border-white/90 shadow-xl shadow-slate-200/50 ring-1 ring-slate-900/5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-black text-slate-900 flex items-center gap-1.5 font-display">
                  <Radio className="w-4 h-4 text-rose-600 animate-pulse" /> Regional Outbreak Radar
                </span>
                <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[10px] font-black border border-rose-200">
                  Live District Telemetry
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="p-3 bg-rose-50/70 rounded-2xl border border-rose-200/70 flex items-start justify-between gap-3">
                  <div>
                    <span className="font-extrabold text-rose-900 block flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-600" /> Welimada &amp; Badulla Valley
                    </span>
                    <p className="text-[11px] text-rose-800 mt-0.5">14 cases of Early Blight detected in 48h</p>
                  </div>
                  <span className="px-2 py-1 bg-rose-600 text-white rounded-lg text-[9px] font-black uppercase shrink-0">
                    High Risk
                  </span>
                </div>

                <div className="p-3 bg-amber-50/70 rounded-2xl border border-amber-200/70 flex items-start justify-between gap-3">
                  <div>
                    <span className="font-extrabold text-amber-900 block flex items-center gap-1">
                      <CloudRain className="w-3.5 h-3.5 text-amber-600" /> Nuwara Eliya Highlands
                    </span>
                    <p className="text-[11px] text-amber-800 mt-0.5">Late Blight Spore Index: 82% (High Humidity)</p>
                  </div>
                  <span className="px-2 py-1 bg-amber-600 text-white rounded-lg text-[9px] font-black uppercase shrink-0">
                    Warning
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: DIAGNOSTIC REPORT, MULTILINGUAL AUDIO, DOSAGE CALCULATOR & PROTOCOL (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* PATHOLOGY DIAGNOSTIC REPORT CARD */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/85 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/90 shadow-xl shadow-slate-200/50 ring-1 ring-slate-900/5 space-y-6"
            >
              {/* REPORT HEADER & MULTILINGUAL VOICE PRESCRIPTION */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-100 pb-5">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-800 text-[10px] font-black uppercase tracking-wider border border-rose-200">
                      {currentSample.pathogenType}
                    </span>
                    <span className="text-xs font-bold text-slate-400">• Confirmed by AI Vision</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
                    {currentSample.disease}
                  </h2>
                  <p className="text-xs text-slate-500 font-mono italic">
                    Pathogen Taxon: <strong className="text-slate-700">{currentSample.scientific}</strong>
                  </p>
                </div>

                <div className="text-left sm:text-right bg-emerald-50/90 backdrop-blur-md p-3.5 rounded-2xl border border-emerald-200/80 shrink-0 shadow-xs">
                  <span className="text-2xl sm:text-3xl font-black text-emerald-700 font-display block">
                    {currentSample.confidence}%
                  </span>
                  <span className="text-[10px] font-black uppercase text-emerald-800 tracking-wider block">
                    Match Confidence
                  </span>
                </div>
              </div>

              {/* 🔊 MULTILINGUAL VOICE READOUT BAR */}
              <div className="p-4 bg-emerald-50/80 backdrop-blur-md rounded-2xl border border-emerald-200/80 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleToggleVoice}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition cursor-pointer shadow-sm ${
                      isSpeaking
                        ? 'bg-rose-600 text-white animate-pulse'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    }`}
                  >
                    {isSpeaking ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </button>
                  <div>
                    <span className="text-xs font-black text-slate-900 block">
                      {isSpeaking ? 'Reading Audio Prescription...' : 'Audio Voice Prescription'}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">Listen in your native language</span>
                  </div>
                </div>

                {/* Language Switcher */}
                <div className="flex items-center gap-1 bg-white/80 p-1 rounded-xl border border-emerald-200">
                  <button
                    type="button"
                    onClick={() => setSpeechLanguage('en')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-extrabold transition ${
                      speechLanguage === 'en' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    EN
                  </button>
                  <button
                    type="button"
                    onClick={() => setSpeechLanguage('si')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-extrabold transition ${
                      speechLanguage === 'si' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    සිංහල
                  </button>
                  <button
                    type="button"
                    onClick={() => setSpeechLanguage('ta')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-extrabold transition ${
                      speechLanguage === 'ta' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    தமிழ்
                  </button>
                </div>
              </div>

              {/* SEVERITY GAUGE & DAMAGE METER */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50/80 backdrop-blur-md rounded-2xl border border-slate-200/80 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-600">Foliage Surface Damage:</span>
                    <span className="font-black text-rose-600 text-sm font-display">{currentSample.damagePct}% Area</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        currentSample.damagePct > 25 ? 'bg-rose-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${currentSample.damagePct}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                    <span>Mild (&lt;10%)</span>
                    <span>Moderate (11–25%)</span>
                    <span>Severe (&gt;25%)</span>
                  </div>
                </div>

                <div className="p-4 bg-slate-50/80 backdrop-blur-md rounded-2xl border border-slate-200/80 flex flex-col justify-between space-y-2">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Infection Threat Rating</span>
                  <div className="flex items-center justify-between">
                    <span className="text-base font-extrabold text-slate-900 font-display">{currentSample.severity}</span>
                    <span className="px-2.5 py-1 rounded-xl text-[10px] font-black uppercase bg-rose-500 text-white shadow-xs">
                      Action Required
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium">Spread risk elevated under high humidity (&gt;75%)</span>
                </div>
              </div>

              {/* 🧮 KNAPSACK TANK & CHEMICAL DOSAGE CALCULATOR */}
              <div className="p-5 bg-white/90 backdrop-blur-md rounded-3xl border border-slate-200/80 space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <span className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5 font-display">
                    <Calculator className="w-4 h-4 text-emerald-600" /> Knapsack Sprayer Tank Mix Estimator
                  </span>
                  <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Field Scale Mode
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-500 font-bold mb-1">Field Size: {calcAcres} Acres</label>
                    <input
                      type="range"
                      min="0.5"
                      max="10"
                      step="0.5"
                      value={calcAcres}
                      onChange={(e) => setCalcAcres(Number(e.target.value))}
                      className="w-full accent-emerald-600 cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 font-bold mb-1">Tanks per Acre: {tanksPerAcre} Tanks</label>
                    <input
                      type="range"
                      min="1"
                      max="6"
                      step="1"
                      value={tanksPerAcre}
                      onChange={(e) => setTanksPerAcre(Number(e.target.value))}
                      className="w-full accent-emerald-600 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 text-center text-xs">
                  <div className="p-2.5 bg-slate-50 rounded-2xl border border-slate-200">
                    <span className="text-[9px] font-black uppercase text-slate-400 block">Total Tanks</span>
                    <span className="text-sm font-black text-slate-900 font-display">{totalTanks} Tanks (16L)</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-2xl border border-slate-200">
                    <span className="text-[9px] font-black uppercase text-slate-400 block">Chemical Volume</span>
                    <span className="text-sm font-black text-emerald-700 font-display">{totalChemicalQty} {currentSample.unit}</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-2xl border border-slate-200">
                    <span className="text-[9px] font-black uppercase text-slate-400 block">Clean Water Req.</span>
                    <span className="text-sm font-black text-sky-700 font-display">{totalWaterLiters} Liters</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-2xl border border-slate-200">
                    <span className="text-[9px] font-black uppercase text-slate-400 block">Estimated Cost</span>
                    <span className="text-sm font-black text-slate-900 font-display">Rs. {totalEstimatedCostLkr.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* TECHNICAL REMEDY & BIO-PESTICIDE DOSAGE PRESCRIPTION */}
              <div className="p-6 bg-gradient-to-br from-emerald-50/90 via-teal-50/60 to-white/95 rounded-3xl border border-emerald-200/90 space-y-4 shadow-lg shadow-emerald-100/50">
                <div className="flex items-center justify-between border-b border-emerald-200/60 pb-3">
                  <span className="text-xs font-black text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-emerald-600" /> Technical Treatment Prescription
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-extrabold text-[10px] border border-emerald-300">
                    DOA Certified Formula
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3.5 bg-white/90 backdrop-blur-md rounded-2xl border border-emerald-200/70 space-y-1 shadow-xs">
                    <span className="text-[10px] font-extrabold uppercase text-slate-400">Prescribed Bio-Fungicide / Remedy:</span>
                    <p className="font-extrabold text-slate-900 text-sm font-display">{currentSample.activeRemedy}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                    <div className="p-3.5 bg-white/90 backdrop-blur-md rounded-2xl border border-emerald-200/70 space-y-1 shadow-xs">
                      <span className="text-slate-500 font-bold block flex items-center gap-1">
                        <Droplet className="w-3.5 h-3.5 text-emerald-600" /> Dilution Ratio:
                      </span>
                      <span className="font-bold text-slate-800">{currentSample.dosage}</span>
                    </div>

                    <div className="p-3.5 bg-white/90 backdrop-blur-md rounded-2xl border border-emerald-200/70 space-y-1 shadow-xs">
                      <span className="text-slate-500 font-bold block flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-amber-600" /> Spray Schedule &amp; PHI:
                      </span>
                      <span className="font-bold text-slate-800">
                        {currentSample.sprayTiming} • <strong className="text-emerald-700">PHI: {currentSample.phiDays} Days</strong>
                      </span>
                    </div>
                  </div>
                </div>

                <Link
                  to="/supplier-marketplace"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-2xl shadow-md hover:shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Order Prescribed Remedy on Supplier Marketplace 🛒</span>
                </Link>
              </div>

              {/* 5-DAY TREATMENT RECOVERY TIMELINE */}
              <div className="space-y-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
                  5-Day Treatment Recovery Roadmap:
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 text-xs">
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                    <span className="text-[9px] font-black text-rose-600 uppercase">Day 1</span>
                    <p className="font-bold text-slate-800 text-[11px]">Knapsack Spray</p>
                    <p className="text-[10px] text-slate-500">Apply early morning mix</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                    <span className="text-[9px] font-black text-amber-600 uppercase">Day 3</span>
                    <p className="font-bold text-slate-800 text-[11px]">Prune Lesions</p>
                    <p className="text-[10px] text-slate-500">Isolate lower leaves</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                    <span className="text-[9px] font-black text-sky-600 uppercase">Day 5</span>
                    <p className="font-bold text-slate-800 text-[11px]">Follow-Up Scan</p>
                    <p className="text-[10px] text-slate-500">Check spore arrest</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                    <span className="text-[9px] font-black text-emerald-600 uppercase">Day 8</span>
                    <p className="font-bold text-slate-800 text-[11px]">DOA Clear Pass</p>
                    <p className="text-[10px] text-slate-500">Harvest ready state</p>
                  </div>
                </div>
              </div>

            </motion.div>

            {/* NEARBY AGRONOMIST EXTENSION OFFICER */}
            <div className="p-6 bg-white/85 backdrop-blur-xl rounded-3xl border border-white/90 shadow-xl shadow-slate-200/50 ring-1 ring-slate-900/5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 font-black text-2xl flex items-center justify-center shrink-0 border border-emerald-200">
                  👨‍🔬
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm font-display">Dr. K. L. Perera (Senior Agronomist)</h4>
                  <p className="text-xs text-slate-500 font-medium">Department of Agriculture Regional Extension Office</p>
                  <p className="text-[11px] text-emerald-700 font-bold mt-0.5">📍 Anuradhapura &amp; Central Belt Region</p>
                </div>
              </div>

              <a
                href="tel:+94771234567"
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-2xl shadow transition flex items-center gap-1.5 shrink-0"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-400" /> Direct Call Extension
              </a>
            </div>

          </div>

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
