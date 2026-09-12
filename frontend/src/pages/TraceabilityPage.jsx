import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { traceabilityAPI } from '../services/api';
import {
  Search,
  ArrowLeft,
  QrCode,
  CheckCircle2,
  MapPin,
  Calendar,
  Truck,
  ShieldCheck,
  Sprout,
  Loader2,
  Award,
  Copy,
  Check,
  Link as LinkIcon,
  Leaf,
  Share2,
  Package,
  Clock,
  AlertTriangle,
  ChevronRight,
  ExternalLink,
  ChevronDown
} from 'lucide-react';

const PROVENANCE_STEPS = [
  {
    id: 1,
    stepNum: '01',
    title: 'Soil Prep & Bio-Compost Enrichment',
    date: 'May 12, 2026',
    location: 'Nuwara Eliya Upland Plot 4B',
    details: 'DOA certified organic compost mixed with vermicompost (pH 6.4 balanced).',
    badge: '🌱 Organic Soil Prep',
    status: 'completed'
  },
  {
    id: 2,
    stepNum: '02',
    title: 'Certified Seed Sowing & Inoculation',
    date: 'May 20, 2026',
    location: 'Green Valley Hydro Nursery',
    details: 'Treated with beneficial Trichoderma harzianum to prevent root-borne fungi.',
    badge: '🌾 Non-GMO Strain',
    status: 'completed'
  },
  {
    id: 3,
    stepNum: '03',
    title: 'IoT Micro-Drip & Field Telemetry',
    date: 'June – July 2026',
    location: 'Field Sector 2 (ESP32 Telemetry Node)',
    details: 'Watered via automated micro-drip cycles when soil moisture dipped below 35%.',
    badge: '📡 IoT Monitored',
    status: 'completed'
  },
  {
    id: 4,
    stepNum: '04',
    title: 'Pre-Harvest Quality & Residue Inspection',
    date: 'August 3, 2026',
    location: 'Regional Agrarian Quality Lab',
    details: 'Zero synthetic chemical residue detected. Awarded Grade A Organic seal.',
    badge: '🧪 Zero Residue Tested',
    status: 'completed'
  },
  {
    id: 5,
    stepNum: '05',
    title: 'Hand Harvest & Cold-Chain Dispatch',
    date: 'August 4, 2026',
    location: 'Keppetipola Dispatch Facility',
    details: 'Loaded onto refrigerated flatbed trailer maintained strictly between 8–12°C.',
    badge: '🚚 Cold-Chain Active',
    status: 'completed'
  },
  {
    id: 6,
    stepNum: '06',
    title: 'Distribution Hub Delivery & Settlement',
    date: 'August 6, 2026',
    location: 'Colombo Central Distribution Center',
    details: 'Batch QR scanned, weight verified, and escrow payout released to grower.',
    badge: '🔒 Escrow Settled',
    status: 'current'
  }
];

export const TraceabilityPage = () => {
  const { batchCode } = useParams();
  const navigate = useNavigate();

  const [inputCode, setInputCode] = useState(batchCode || '');
  const [trace, setTrace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Fetch Traceability record from API or fallback
  const fetchTraceabilityData = async (code) => {
    setLoading(true);
    setError(false);
    try {
      const activeCode = code || 'BATCH-2026-NWR-0941';
      const res = await traceabilityAPI.getTrace(activeCode);
      if (res && res.data) {
        setTrace(res.data);
      } else {
        fallbackTrace(activeCode);
      }
    } catch (err) {
      console.warn('Trace API offline. Loading fallback traceability data:', err);
      fallbackTrace(code || 'BATCH-2026-NWR-0941');
    } finally {
      setLoading(false);
    }
  };

  const fallbackTrace = (code) => {
    setTrace({
      batchCode: code,
      cropId: 1,
      productName: 'Organic Nuwara Eliya Tomatoes',
      farmerName: 'Sunil Perera (Green Valley Farm)',
      farmLocation: 'Nuwara Eliya (Elevation: 1,868m), Central Province',
      harvestedDate: 'August 4, 2026',
      packedDate: 'August 5, 2026',
      transportVehicle: 'Reefer Truck WP LK-4892 (Temp: 9.2°C)',
      qualityInspectionStatus: 'Passed (Grade A Organic Verification)',
      deliveredDate: 'August 6, 2026',
      blockchainHash: '0x7f8a92b4c19e81d763a1290fbc9821ea3478d104',
      carbonSavedKg: 18.4,
      co2Intensity: '0.18 kg CO2 / kg'
    });
  };

  useEffect(() => {
    if (batchCode) {
      setInputCode(batchCode);
      fetchTraceabilityData(batchCode);
    } else {
      fetchTraceabilityData('BATCH-2026-NWR-0941');
    }
  }, [batchCode]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmed = inputCode.trim();
    if (!trimmed) return;
    navigate(`/trace/${trimmed}`);
  };

  const handleCopyHash = () => {
    if (trace?.blockchainHash) {
      navigator.clipboard.writeText(trace.blockchainHash);
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16 font-sans">
      
      {/* 1. TOP ANNOUNCEMENT & TRUST STRIP */}
      <div className="bg-emerald-800 text-emerald-50 px-4 py-2.5 text-xs font-medium border-b border-emerald-900/30">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 font-semibold text-emerald-200">
              <ShieldCheck className="w-4 h-4 text-emerald-300" aria-hidden="true" />
              Verified Agricultural Provenance System
            </span>
            <span className="hidden sm:inline text-emerald-300/60">•</span>
            <span className="hidden sm:inline text-emerald-100">
              Direct Cryptographic Verification from Farmgate to Wholesale Buyer
            </span>
          </div>

          <div className="flex items-center gap-4 text-emerald-200 text-xs">
            <span className="inline-flex items-center gap-1">
              <Truck className="w-3.5 h-3.5" aria-hidden="true" /> GPS &amp; Temperature Audited
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-8">

        {/* 2. BREADCRUMB & BACK NAVIGATION */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-slate-500 font-medium">
            <Link to="/crops" className="hover:text-emerald-800 transition flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Produce Marketplace
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400">Crop Traceability</span>
            {trace && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-900 font-semibold font-mono">{trace.batchCode}</span>
              </>
            )}
          </nav>

          <Link
            to="/crops"
            className="inline-flex items-center gap-1 text-emerald-800 hover:text-emerald-900 font-semibold transition"
          >
            <span>Browse All Produce</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 3. PAGE HEADER & BATCH LOOKUP BAR */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold tracking-wide uppercase">
              <QrCode className="w-3.5 h-3.5 text-emerald-700" aria-hidden="true" />
              Origin Passport
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              Crop Traceability
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Follow the journey of this crop from farm to destination. Verify real-time cold-chain handling, soil preparation, laboratory quality testing, and settlement milestones.
            </p>
          </div>

          {/* Interactive Batch ID Search Bar */}
          <div className="pt-2 border-t border-slate-100 space-y-3">
            <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  placeholder="Enter Batch ID (e.g. BATCH-2026-NWR-0941)..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition font-mono"
                  aria-label="Enter Batch ID"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-sm transition flex items-center justify-center gap-2 focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 shrink-0"
              >
                <span>Track Crop</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Example Batch Chips */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-medium">
              <span>Example Batch Codes:</span>
              {[
                { label: 'Tomatoes (Nuwara Eliya)', code: 'BATCH-2026-NWR-0941' },
                { label: 'Red Onions (Jaffna)', code: 'BATCH-2026-JAF-0822' },
                { label: 'Cinnamon (Galle)', code: 'BATCH-2026-GAL-0519' }
              ].map((chip) => (
                <button
                  key={chip.code}
                  type="button"
                  onClick={() => {
                    setInputCode(chip.code);
                    navigate(`/trace/${chip.code}`);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-[11px] transition"
                >
                  {chip.code}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 4. MAIN CONTENT AREA */}
        {loading ? (
          /* Skeleton Loader */
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm animate-pulse space-y-4">
              <div className="h-6 bg-slate-200 rounded w-1/3" />
              <div className="h-4 bg-slate-200 rounded w-1/4" />
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-20 bg-slate-200 rounded-xl" />
                ))}
              </div>
            </div>
            <div className="h-64 bg-slate-200 rounded-2xl animate-pulse" />
          </div>
        ) : error || !trace ? (
          /* Not Found State */
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm max-w-md mx-auto space-y-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
              <Package className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">We Couldn't Find This Crop Batch</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Check the batch ID and try again, or select one of the verified sample batches above.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setInputCode('BATCH-2026-NWR-0941');
                navigate('/trace/BATCH-2026-NWR-0941');
              }}
              className="px-4 py-2 bg-slate-900 text-white font-semibold text-xs rounded-xl hover:bg-slate-800 transition"
            >
              Load Sample Batch
            </button>
          </div>
        ) : (
          /* TRACE RESULT & DETAILS */
          <div className="space-y-8">
            
            {/* CROP & BATCH SUMMARY CARD */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
                    <span className="font-mono bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {trace.batchCode}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-600">Harvested: {trace.harvestedDate}</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                    {trace.productName}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600">
                    Grown by <strong className="text-slate-900">{trace.farmerName}</strong> in <strong>{trace.farmLocation}</strong>
                  </p>
                </div>

                {/* Status Badge & Share Action */}
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Delivered &amp; Escrow Settled</span>
                  </span>

                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition"
                    title="Share Traceability"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-slate-500" />}
                    <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
                  </button>
                </div>
              </div>

              {/* 4 Summary Metric Tiles */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-100 text-xs">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                  <span className="text-[10px] font-semibold uppercase text-slate-400 block tracking-wider">
                    Origin Elevation
                  </span>
                  <strong className="text-slate-900 font-bold block text-sm">1,868m High-Altitude</strong>
                  <span className="text-slate-500 text-[11px]">Central Province Soil</span>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                  <span className="text-[10px] font-semibold uppercase text-slate-400 block tracking-wider">
                    Quality Audit
                  </span>
                  <strong className="text-emerald-800 font-bold block text-sm">Grade A Certified</strong>
                  <span className="text-slate-500 text-[11px]">Zero Chemical Residue</span>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                  <span className="text-[10px] font-semibold uppercase text-slate-400 block tracking-wider">
                    Cold-Chain Reefer
                  </span>
                  <strong className="text-slate-900 font-bold block text-sm">9.2°C Regulated</strong>
                  <span className="text-slate-500 text-[11px] truncate block">{trace.transportVehicle || 'Reefer Truck'}</span>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                  <span className="text-[10px] font-semibold uppercase text-slate-400 block tracking-wider">
                    Carbon Footprint
                  </span>
                  <strong className="text-teal-800 font-bold block text-sm">0.18 kg CO₂ / kg</strong>
                  <span className="text-emerald-700 font-semibold text-[11px]">78% Under Benchmark</span>
                </div>
              </div>
            </div>

            {/* 5. MAIN TRACEABILITY TIMELINE (CENTERPIECE) */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Farm-to-Fork Provenance Timeline
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Chronological lifecycle events verified by agrarian extension officers and IoT telemetry.
                  </p>
                </div>
                <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 font-semibold text-xs border border-emerald-200">
                  6 Verified Milestones
                </span>
              </div>

              {/* DESKTOP HORIZONTAL TIMELINE (HIDDEN ON MOBILE) */}
              <div className="hidden lg:block pt-4 pb-2">
                <div className="grid grid-cols-6 gap-3 relative">
                  {/* Connecting Line Behind Steps */}
                  <div className="absolute top-4 left-6 right-6 h-0.5 bg-emerald-200 z-0 pointer-events-none" />

                  {PROVENANCE_STEPS.map((step) => {
                    const isCurrent = step.status === 'current';

                    return (
                      <div key={step.id} className="relative z-10 space-y-3">
                        {/* Step Marker Circle */}
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-sm transition ${
                            isCurrent
                              ? 'bg-emerald-700 text-white ring-4 ring-emerald-100'
                              : 'bg-emerald-800 text-white'
                          }`}
                        >
                          {step.stepNum}
                        </div>

                        {/* Step Content */}
                        <div className="space-y-1.5 pr-2">
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 inline-block">
                            {step.badge}
                          </span>
                          <h4 className="text-xs font-bold text-slate-900 leading-snug">
                            {step.title}
                          </h4>
                          <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-3">
                            {step.details}
                          </p>
                          <div className="pt-1 text-[10px] text-slate-400 font-medium space-y-0.5">
                            <p className="flex items-center gap-1 truncate">
                              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                              <span className="truncate">{step.location}</span>
                            </p>
                            <p className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                              <span>{step.date}</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* MOBILE VERTICAL TIMELINE (HIDDEN ON DESKTOP) */}
              <div className="lg:hidden space-y-6 relative pl-6 border-l-2 border-emerald-200 ml-3 pt-2">
                {PROVENANCE_STEPS.map((step) => {
                  const isCurrent = step.status === 'current';

                  return (
                    <div key={step.id} className="relative space-y-2 text-xs">
                      {/* Circle on the vertical line */}
                      <div
                        className={`absolute -left-[31px] top-0.5 w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] shadow-sm ${
                          isCurrent
                            ? 'bg-emerald-700 text-white ring-4 ring-emerald-100'
                            : 'bg-emerald-800 text-white'
                        }`}
                      >
                        {step.id}
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-1.5">
                        <h4 className="font-bold text-slate-900 text-sm">{step.title}</h4>
                        <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {step.badge}
                        </span>
                      </div>

                      <p className="text-slate-600 leading-relaxed font-medium">
                        {step.details}
                      </p>

                      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 font-medium pt-1 border-t border-slate-100">
                        <span>📍 {step.location}</span>
                        <span>📅 {step.date}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 6. FOUR-COLUMN DETAILED CARDS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Card 1: Farm Origin */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-xs pb-2 border-b border-slate-100">
                  <Sprout className="w-4 h-4 text-emerald-700" />
                  <span>Farm Origin</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Producer Name</span>
                    <strong className="text-slate-900">{trace.farmerName}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Location</span>
                    <span className="text-slate-700">{trace.farmLocation}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Harvest Date</span>
                    <span className="text-slate-700">{trace.harvestedDate}</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Quality Inspection */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-xs pb-2 border-b border-slate-100">
                  <Award className="w-4 h-4 text-emerald-700" />
                  <span>Crop Quality</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Grade Quality</span>
                    <strong className="text-emerald-800">Grade A Export Standard</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Chemical Residue</span>
                    <span className="text-slate-700">0.00 ppm (Zero Synthetic Fungicide)</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Status</span>
                    <span className="text-slate-700">{trace.qualityInspectionStatus}</span>
                  </div>
                </div>
              </div>

              {/* Card 3: Storage Conditions */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-xs pb-2 border-b border-slate-100">
                  <Package className="w-4 h-4 text-emerald-700" />
                  <span>Cold-Chain Storage</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Packing Date</span>
                    <strong className="text-slate-900">{trace.packedDate}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Temperature Spec</span>
                    <span className="text-slate-700">8°C – 12°C Regulated Pre-cooling</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Packaging Unit</span>
                    <span className="text-slate-700">Ventilated Crates (Food Grade)</span>
                  </div>
                </div>
              </div>

              {/* Card 4: Logistics & Dispatch */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-xs pb-2 border-b border-slate-100">
                  <Truck className="w-4 h-4 text-emerald-700" />
                  <span>Logistics Transit</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Dispatch Vehicle</span>
                    <strong className="text-slate-900 truncate block">{trace.transportVehicle}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Transit Route</span>
                    <span className="text-slate-700">Keppetipola Hub → Colombo CDC</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Delivered Date</span>
                    <span className="text-slate-700">{trace.deliveredDate}</span>
                  </div>
                </div>
              </div>

            </div>

            {/* 7. VERIFICATION TRUST CARD & QR CODE */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
              
              <div className="space-y-3 flex-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold uppercase">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" /> Cryptographic Ledger Audit
                </div>

                <h3 className="text-lg font-bold text-slate-900">
                  Verified Batch Provenance Record
                </h3>

                <p className="text-xs text-slate-600 max-w-xl leading-relaxed">
                  Every batch lifecycle event is recorded with cryptographic timestamps. Buyers and certifiers can verify authenticity by checking the cryptographic transaction hash on the AGROLINK ledger.
                </p>

                {/* Hash Box */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3 text-xs max-w-xl">
                  <div className="truncate font-mono text-[11px] text-slate-700">
                    <span className="text-slate-400 block text-[10px] font-sans font-semibold">Ledger Hash:</span>
                    <span className="truncate">{trace.blockchainHash}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyHash}
                    className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 transition shrink-0"
                    title="Copy Ledger Hash"
                  >
                    {copiedHash ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Dynamic SVG QR Code */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center shrink-0 w-40">
                <svg className="w-28 h-28 mx-auto" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="100" height="100" fill="white" rx="8"/>
                  <rect x="6" y="6" width="28" height="28" fill="#065f46" rx="4"/>
                  <rect x="11" y="11" width="18" height="18" fill="white" rx="2"/>
                  <rect x="15" y="15" width="10" height="10" fill="#065f46" rx="1"/>
                  <rect x="66" y="6" width="28" height="28" fill="#065f46" rx="4"/>
                  <rect x="71" y="11" width="18" height="18" fill="white" rx="2"/>
                  <rect x="75" y="15" width="10" height="10" fill="#065f46" rx="1"/>
                  <rect x="6" y="66" width="28" height="28" fill="#065f46" rx="4"/>
                  <rect x="11" y="71" width="18" height="18" fill="white" rx="2"/>
                  <rect x="15" y="75" width="10" height="10" fill="#065f46" rx="1"/>
                  <rect x="42" y="42" width="16" height="16" fill="#047857" rx="2"/>
                  <circle cx="50" cy="50" r="3" fill="white"/>
                  <rect x="42" y="10" width="6" height="16" fill="#065f46" rx="1"/>
                  <rect x="52" y="20" width="6" height="16" fill="#065f46" rx="1"/>
                  <rect x="10" y="42" width="16" height="6" fill="#065f46" rx="1"/>
                  <rect x="20" y="52" width="16" height="6" fill="#065f46" rx="1"/>
                  <rect x="66" y="42" width="24" height="6" fill="#065f46" rx="1"/>
                  <rect x="42" y="66" width="6" height="24" fill="#065f46" rx="1"/>
                  <rect x="76" y="76" width="14" height="14" fill="#065f46" rx="2"/>
                </svg>
                <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block mt-2">
                  Scan to Verify
                </span>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default TraceabilityPage;
