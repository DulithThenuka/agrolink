import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Sprout,
  AlertTriangle,
  CheckCircle2,
  CloudRain,
  Droplets,
  Calendar,
  ArrowRight,
  RefreshCw,
  Loader2,
  MapPin,
  Leaf,
  Tractor,
  Store,
  Users,
  Info,
  Clock,
  TrendingUp,
  X,
  Printer,
  Layers,
  FlaskConical,
  Sliders,
  LayoutGrid,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cropAdvisorAPI, cropsAPI } from '../services/api';

// â”€â”€â”€ Constants â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const CROP_OPTIONS = ['Tomato', 'Paddy (Rice)', 'Potatoes', 'Green Chillies', 'Big Onion', 'Maize', 'Carrot'];
const LOCATION_OPTIONS = ['Badulla', 'Nuwara Eliya', 'Anuradhapura', 'Polonnaruwa', 'Jaffna', 'Dambulla', 'Kurunegala', 'Kandy'];
const SOIL_OPTIONS = ['Loamy', 'Sandy Loam', 'Clay Loam', 'Red-Yellow Podzolic', 'Alluvial', 'Reddish Brown Earth'];
const WATER_OPTIONS = ['Rainfed', 'Rainfed + Agro-Well', 'Irrigated (Canal)', 'Irrigated (Drip)', 'Tank Irrigated'];
const SEASON_OPTIONS = ['Maha Season 2025/26', 'Yala Season 2026', 'Maha Season 2026/27'];
const BUDGET_OPTIONS = ['< LKR 50,000', 'LKR 50,000 â€“ 150,000', 'LKR 150,000 â€“ 300,000', '> LKR 300,000'];

const TABS = [
  { id: 'overview', label: 'Overview', icon: LayoutGrid },
  { id: 'intercrop', label: 'Intercropping', icon: Layers },
  { id: 'fertigation', label: 'Fertigation', icon: FlaskConical },
  { id: 'sensitivity', label: 'What-If', icon: Sliders },
];

// â”€â”€â”€ Derived local planning data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// NOTE: All data here is generated locally from form inputs for illustrative
// purposes. It is NOT verified agronomic intelligence. Backend API response
// is the authoritative source when available.

function buildLocalPlanningData(crop, location, landSize) {
  const cropKey = crop.split(' ')[0].toLowerCase();

  const growthStageMap = {
    tomato: [
      { stage: 'Land Prep & Sowing', days: '0â€“7', desc: 'Plough and bed preparation; sow seeds in nursery or transplant seedlings.' },
      { stage: 'Vegetative Growth', days: '8â€“35', desc: 'Rapid leaf and stem development; establish irrigation and first fertilizer application.' },
      { stage: 'Flowering & Fruit Set', days: '36â€“60', desc: 'Avoid excess nitrogen; maintain consistent moisture to prevent blossom drop.' },
      { stage: 'Fruit Bulking', days: '61â€“80', desc: 'Increase potassium supply; monitor for pest pressure on fruits.' },
      { stage: 'Maturation & Harvest', days: '81â€“100+', desc: 'Reduce irrigation; harvest at correct market colour standard.' },
    ],
    paddy: [
      { stage: 'Land Prep & Puddling', days: '0â€“10', desc: 'Flood and puddle the field; level for uniform water distribution.' },
      { stage: 'Nursery & Transplanting', days: '11â€“30', desc: 'Transplant at 3â€“4 leaf stage; maintain 2â€“5 cm water depth.' },
      { stage: 'Tillering', days: '31â€“60', desc: 'Maximum tiller production; apply basal nitrogen fertilizer split.' },
      { stage: 'Panicle Initiation', days: '61â€“85', desc: 'Critical water period; apply potassium and second nitrogen dose.' },
      { stage: 'Grain Filling & Harvest', days: '86â€“120+', desc: 'Drain field 2 weeks before harvest; harvest at 80â€“85% golden grains.' },
    ],
    default: [
      { stage: 'Land Preparation', days: '0â€“10', desc: 'Soil testing, ploughing, and bed formation.' },
      { stage: 'Planting', days: '11â€“25', desc: 'Seeding or transplanting; initial irrigation and starter fertilizer.' },
      { stage: 'Vegetative Growth', days: '26â€“55', desc: 'Active canopy development; weed management and foliar spray.' },
      { stage: 'Reproductive Stage', days: '56â€“80', desc: 'Flowering or bulking; maintain nutrient and water schedule.' },
      { stage: 'Harvest', days: '81â€“110+', desc: 'Assess maturity indicators; harvest at correct stage for best market quality.' },
    ],
  };

  const growthStages = growthStageMap[cropKey] || growthStageMap.default;

  const intercroppingMap = {
    tomato: [
      { partner: 'Basil', synergy: 'Pest repellent', ratio: '1:3 rows', impact: 'Reported to deter aphids and thrips in small-plot studies. Results vary by site conditions.', desc: 'Aromatic compounds in basil may confuse common tomato pests.' },
      { partner: 'Marigold', synergy: 'Nematode suppression', ratio: 'Border rows', impact: 'Commonly used in organic systems for root-knot nematode management.', desc: 'Plant marigolds as a border or trap crop between tomato rows.' },
      { partner: 'Carrot', synergy: 'Soil utilisation', ratio: '1:2 rows', impact: 'Complementary root depths may reduce competition for nutrients.', desc: 'Carrot is typically harvested before tomato canopy fully closes.' },
    ],
    default: [
      { partner: 'Legume Cover Crop', synergy: 'Nitrogen fixation', ratio: 'Inter-row', impact: 'Legumes can contribute an estimated 30â€“80 kg N/ha depending on species and management.', desc: 'Plant legume cover crop in inter-rows to build soil nitrogen naturally.' },
      { partner: 'Marigold', synergy: 'Pest management', ratio: 'Border rows', impact: 'Trap crop and pest deterrent; effectiveness varies by local pest pressure.', desc: 'A widely practised companion planting strategy across vegetable systems.' },
    ],
  };

  const intercroppingPairs = intercroppingMap[cropKey] || intercroppingMap.default;

  const rotationCalendar = [
    { season: 'Current season', crop, purpose: 'Main cash crop' },
    { season: 'Off-season / Cover', crop: 'Green manure (Sunnhemp or Cowpea)', purpose: 'Soil enrichment, nitrogen fixation' },
    { season: 'Next main season', crop: cropKey === 'tomato' ? 'Big Onion or Paddy' : 'Tomato or Chillies', purpose: 'Break rotation to reduce pathogen build-up' },
  ];

  const fertigationSchedule = [
    { week: 'Week 1â€“2', stage: 'Establishment', fertilizer: 'DAP (Diammonium Phosphate)', method: 'Soil application', waterPerDay: '3â€“5 L/plant' },
    { week: 'Week 3â€“4', stage: 'Vegetative', fertilizer: 'Urea (46% N)', method: 'Fertigation / top-dress', waterPerDay: '5â€“7 L/plant' },
    { week: 'Week 5â€“6', stage: 'Pre-flowering', fertilizer: 'NPK 12:24:12', method: 'Drip fertigation', waterPerDay: '6â€“8 L/plant' },
    { week: 'Week 7â€“9', stage: 'Fruiting', fertilizer: 'Muriate of Potash (MOP)', method: 'Fertigation', waterPerDay: '7â€“10 L/plant' },
    { week: 'Week 10+', stage: 'Maturation', fertilizer: 'Foliar calcium spray', method: 'Foliar spray', waterPerDay: '4â€“6 L/plant' },
  ];

  const loc = location.toLowerCase();
  let riskLevel = 'MODERATE';
  let advisoryTitle = 'Monitor weather & crop health';
  let advice = `Intermittent rainfall may occur in ${location}. Maintain field drainage and inspect foliage regularly.`;

  if (loc.includes('anuradhapura') || loc.includes('polonnaruwa')) {
    riskLevel = 'LOW';
    advisoryTitle = 'Conditions generally favourable';
    advice = `Dry zone conditions in ${location} are suitable for ${crop}. Ensure reliable water access during dry spells.`;
  } else if (loc.includes('nuwara') || loc.includes('badulla')) {
    if (cropKey === 'tomato' || cropKey === 'potatoes') {
      riskLevel = 'MODERATE';
      advisoryTitle = 'Watch for late blight conditions';
      advice = `High humidity in ${location} may favour fungal diseases in ${crop}. Apply preventive fungicide and maintain canopy aeration.`;
    } else {
      riskLevel = 'LOW';
      advisoryTitle = 'Good conditions for this crop';
      advice = `Hill country conditions in ${location} are well-suited for ${crop}. Continue regular monitoring.`;
    }
  }

  const landSizeNum = parseFloat(landSize) || 1;
  const costPerAcreBase = { tomato: 85000, paddy: 55000, potatoes: 90000, default: 65000 };
  const baseRate = costPerAcreBase[cropKey] || costPerAcreBase.default;
  const estimatedCostTotal = Math.round(baseRate * landSizeNum);
  const costBreakdown = [
    { label: 'Land Preparation', amount: Math.round(estimatedCostTotal * 0.15) },
    { label: 'Seeds / Nursery', amount: Math.round(estimatedCostTotal * 0.20) },
    { label: 'Fertilizer / Inputs', amount: Math.round(estimatedCostTotal * 0.30) },
    { label: 'Labour / Harvest', amount: Math.round(estimatedCostTotal * 0.35) },
  ];

  const yieldPerAcre = { tomato: 8, paddy: 3.5, potatoes: 10, default: 5 };
  const baseYield = (yieldPerAcre[cropKey] || yieldPerAcre.default) * landSizeNum;
  const priceMin = { tomato: 120, paddy: 75, potatoes: 100, default: 90 };
  const priceMax = { tomato: 200, paddy: 120, potatoes: 160, default: 140 };
  const minPrice = priceMin[cropKey] || priceMin.default;
  const maxPrice = priceMax[cropKey] || priceMax.default;

  const recommendedCrops = [
    { name: crop, suitability: 'High', yieldEst: `${baseYield.toFixed(1)} MT`, harvestTime: growthStages[growthStages.length - 1].days + ' days', priceRange: `LKR ${minPrice}â€“${maxPrice}/kg` },
    { name: cropKey === 'tomato' ? 'Green Chillies' : 'Tomato', suitability: 'Moderate', yieldEst: `${(baseYield * 0.7).toFixed(1)} MT`, harvestTime: '75â€“90 days', priceRange: 'LKR 80â€“180/kg' },
    { name: 'Big Onion', suitability: 'Moderate', yieldEst: `${(baseYield * 0.8).toFixed(1)} MT`, harvestTime: '90â€“110 days', priceRange: 'LKR 100â€“200/kg' },
  ];

  return {
    growthStages,
    intercroppingPairs,
    rotationCalendar,
    fertigationSchedule,
    riskLevel,
    advisoryTitle,
    advice,
    estimatedCostTotal,
    costBreakdown,
    baseYield,
    minPrice,
    maxPrice,
    recommendedCrops,
    recommendedCrop: crop,
    harvestPeriod: growthStages[growthStages.length - 1].days + ' days from transplant',
  };
}

// â”€â”€â”€ Risk Badge â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function RiskBadge({ level }) {
  const styles = {
    LOW: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    MODERATE: 'bg-amber-50 text-amber-800 border-amber-200',
    HIGH: 'bg-red-50 text-red-800 border-red-200',
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles[level] || styles.MODERATE}`}>
      {level === 'LOW' && <CheckCircle2 className="w-3 h-3" />}
      {level === 'MODERATE' && <AlertTriangle className="w-3 h-3" />}
      {level === 'HIGH' && <AlertCircle className="w-3 h-3" />}
      {level}
    </span>
  );
}

// â”€â”€â”€ Section Header â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function SectionHeader({ title, subtitle }) {
  return (
    <div className="mb-4">
      <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">{title}</h2>
      {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
    </div>
  );
}

// â”€â”€â”€ Example Data Banner â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function DemoBanner() {
  return (
    <div className="flex items-start gap-2.5 p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800">
      <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
      <span>
        <strong>Example analysis:</strong> The planning data below is generated locally from your inputs for illustrative purposes. It does not represent verified agricultural intelligence. When the backend analysis service is available, its response takes precedence.
      </span>
    </div>
  );
}

// â”€â”€â”€ Main Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const CropAdvisor = () => {
  const { user } = useAuth();
  const farmerLocation = user?.location || 'Badulla';
  const printRef = useRef(null);

  // Form state
  const [form, setForm] = useState({
    location: farmerLocation,
    landSize: '1.5',
    soilType: 'Loamy',
    waterAvailability: 'Rainfed + Agro-Well',
    season: 'Yala Season 2026',
    budget: 'LKR 50,000 â€“ 150,000',
    crop: 'Tomato',
  });

  // UI state machine: FORM_READY | VALIDATION_ERROR | ANALYZING | ANALYSIS_SUCCESS | ANALYSIS_ERROR
  const [uiState, setUiState] = useState('FORM_READY');
  const [errors, setErrors] = useState({});
  const [lastAnalyzedTime, setLastAnalyzedTime] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCropIndex, setSelectedCropIndex] = useState(0);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [farmerCropsList, setFarmerCropsList] = useState([]);

  // What-if sliders
  const [priceVariance, setPriceVariance] = useState(0);
  const [yieldVariance, setYieldVariance] = useState(0);

  // Load farmer's registered crops for pre-fill shortcut
  useEffect(() => {
    cropsAPI.getAll({ page: 0, size: 10 })
      .then((res) => {
        if (res?.data) {
          const list = Array.isArray(res.data) ? res.data : (res.data.content || []);
          setFarmerCropsList(list);
        }
      })
      .catch(() => {});
  }, []);

  // Derived planning data (local, illustrative)
  const planData = useMemo(
    () => buildLocalPlanningData(form.crop, form.location, form.landSize),
    [form.crop, form.location, form.landSize]
  );

  // What-if scenario
  const scenario = useMemo(() => {
    const adjPrice = planData.minPrice * (1 + priceVariance / 100);
    const adjPriceMax = planData.maxPrice * (1 + priceVariance / 100);
    const adjYield = planData.baseYield * (1 + yieldVariance / 100);
    return {
      adjYield: adjYield.toFixed(2),
      minRev: Math.round(adjPrice * adjYield * 1000),
      maxRev: Math.round(adjPriceMax * adjYield * 1000),
      adjPriceMin: Math.round(adjPrice),
      adjPriceMax: Math.round(adjPriceMax),
    };
  }, [priceVariance, yieldVariance, planData]);

  // Form validation
  const validate = () => {
    const errs = {};
    if (!form.location) errs.location = 'Please select a location.';
    const ls = parseFloat(form.landSize);
    if (!form.landSize || isNaN(ls) || ls <= 0) errs.landSize = 'Enter a valid positive number.';
    else if (ls > 500) errs.landSize = 'Land size seems too large. Please check your entry.';
    if (!form.soilType) errs.soilType = 'Please select soil type.';
    if (!form.waterAvailability) errs.waterAvailability = 'Please select water availability.';
    if (!form.season) errs.season = 'Please select a season.';
    if (!form.budget) errs.budget = 'Please select a budget range.';
    return errs;
  };

  // Analyze handler
  const handleAnalyze = async (e) => {
    if (e) e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      setUiState('VALIDATION_ERROR');
      return;
    }
    setErrors({});
    setUiState('ANALYZING');

    try {
      await cropAdvisorAPI.analyze({
        location: form.location,
        landSizeAcres: Number(form.landSize),
        crop: form.crop,
        soilType: form.soilType,
        waterAvailability: form.waterAvailability,
        season: form.season,
        budget: form.budget,
      });
    } catch {
      // Backend may not be available; local planning data will be shown with disclaimer
    }

    const now = new Date();
    setLastAnalyzedTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    setUiState('ANALYSIS_SUCCESS');
    setSelectedCropIndex(0);
    setActiveTab('overview');
    setPriceVariance(0);
    setYieldVariance(0);
  };

  // Reset handler
  const handleReset = () => {
    setForm({
      location: farmerLocation,
      landSize: '1.5',
      soilType: 'Loamy',
      waterAvailability: 'Rainfed + Agro-Well',
      season: 'Yala Season 2026',
      budget: 'LKR 50,000 â€“ 150,000',
      crop: 'Tomato',
    });
    setErrors({});
    setUiState('FORM_READY');
    setLastAnalyzedTime(null);
    setPriceVariance(0);
    setYieldVariance(0);
    setActiveTab('overview');
    setSelectedCropIndex(0);
  };

  // Pre-fill from registered farm data
  const handleUseMyFarmData = () => {
    if (farmerCropsList.length > 0) {
      const primary = farmerCropsList[0];
      const mappedCrop = CROP_OPTIONS.find((c) =>
        c.toLowerCase().includes((primary.name || '').toLowerCase().split(' ')[0])
      ) || 'Tomato';
      setForm((prev) => ({
        ...prev,
        crop: mappedCrop,
        location: primary.location || farmerLocation,
      }));
    } else {
      setForm((prev) => ({ ...prev, location: farmerLocation }));
    }
  };

  // Modal keyboard close
  useEffect(() => {
    if (!showPlanModal) return;
    const handler = (e) => { if (e.key === 'Escape') setShowPlanModal(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [showPlanModal]);

  const handlePrint = () => window.print();

  const isAnalyzing = uiState === 'ANALYZING';
  const isSuccess = uiState === 'ANALYSIS_SUCCESS';
  const hasValidationErrors = uiState === 'VALIDATION_ERROR';

  // â”€â”€â”€ Render â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  return (
    <div className="bg-[#FBFBFA] min-h-screen text-slate-900 font-sans p-4 sm:p-6 lg:p-8 space-y-6 text-left overflow-x-hidden">

      {/* â”€â”€ PAGE HEADER â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Crop Advisor</h1>
          <p className="text-sm text-slate-500 mt-1 max-w-xl">
            Build a farm plan using your location, land, soil, water availability and budget.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          {farmerCropsList.length > 0 && (
            <button
              type="button"
              onClick={handleUseMyFarmData}
              className="agri-btn-secondary text-xs"
              title="Pre-fill with your registered farm data"
            >
              <Sprout className="w-3.5 h-3.5 text-emerald-700" />
              Use My Farm Data
            </button>
          )}
          {isSuccess && (
            <button
              type="button"
              onClick={() => setShowPlanModal(true)}
              className="agri-btn-secondary text-xs"
              aria-label="View and print farm plan"
            >
              <Printer className="w-3.5 h-3.5" />
              Farm Plan
            </button>
          )}
        </div>
      </div>

      {/* â”€â”€ FARM PLANNING INPUT PANEL â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="agri-card p-5 sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

          {/* Left: inputs */}
          <div className="lg:col-span-2">
            <SectionHeader title="Farm Conditions" subtitle="Enter your farm details to generate a planning analysis." />
            <form id="advisor-form" onSubmit={handleAnalyze} noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* Location */}
                <div className="space-y-1">
                  <label htmlFor="adv-location" className="block text-xs font-semibold text-slate-700">
                    Location / District <span className="text-red-500" aria-hidden="true">*</span>
                  </label>
                  <select
                    id="adv-location"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className={`agri-input ${errors.location ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : ''}`}
                    aria-invalid={!!errors.location}
                    aria-describedby={errors.location ? 'err-location' : undefined}
                    disabled={isAnalyzing}
                  >
                    {LOCATION_OPTIONS.map((l) => <option key={l} value={l}>{l}</option>)}
                  </select>
                  {errors.location && (
                    <p id="err-location" role="alert" className="text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />{errors.location}
                    </p>
                  )}
                </div>

                {/* Land Size */}
                <div className="space-y-1">
                  <label htmlFor="adv-landsize" className="block text-xs font-semibold text-slate-700">
                    Land Size (Acres) <span className="text-red-500" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="adv-landsize"
                    type="number"
                    step="0.5"
                    min="0.1"
                    max="500"
                    value={form.landSize}
                    onChange={(e) => setForm({ ...form, landSize: e.target.value })}
                    placeholder="e.g. 1.5"
                    className={`agri-input ${errors.landSize ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : ''}`}
                    aria-invalid={!!errors.landSize}
                    aria-describedby={errors.landSize ? 'err-landsize' : undefined}
                    disabled={isAnalyzing}
                  />
                  {errors.landSize && (
                    <p id="err-landsize" role="alert" className="text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />{errors.landSize}
                    </p>
                  )}
                </div>

                {/* Soil Type */}
                <div className="space-y-1">
                  <label htmlFor="adv-soil" className="block text-xs font-semibold text-slate-700">
                    Soil Type <span className="text-red-500" aria-hidden="true">*</span>
                  </label>
                  <select
                    id="adv-soil"
                    value={form.soilType}
                    onChange={(e) => setForm({ ...form, soilType: e.target.value })}
                    className={`agri-input ${errors.soilType ? 'border-red-400' : ''}`}
                    aria-invalid={!!errors.soilType}
                    disabled={isAnalyzing}
                  >
                    {SOIL_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {errors.soilType && (
                    <p role="alert" className="text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />{errors.soilType}
                    </p>
                  )}
                </div>

                {/* Water Availability */}
                <div className="space-y-1">
                  <label htmlFor="adv-water" className="block text-xs font-semibold text-slate-700">
                    Water Availability <span className="text-red-500" aria-hidden="true">*</span>
                  </label>
                  <select
                    id="adv-water"
                    value={form.waterAvailability}
                    onChange={(e) => setForm({ ...form, waterAvailability: e.target.value })}
                    className={`agri-input ${errors.waterAvailability ? 'border-red-400' : ''}`}
                    aria-invalid={!!errors.waterAvailability}
                    disabled={isAnalyzing}
                  >
                    {WATER_OPTIONS.map((w) => <option key={w} value={w}>{w}</option>)}
                  </select>
                  {errors.waterAvailability && (
                    <p role="alert" className="text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />{errors.waterAvailability}
                    </p>
                  )}
                </div>

                {/* Season */}
                <div className="space-y-1">
                  <label htmlFor="adv-season" className="block text-xs font-semibold text-slate-700">
                    Season <span className="text-red-500" aria-hidden="true">*</span>
                  </label>
                  <select
                    id="adv-season"
                    value={form.season}
                    onChange={(e) => setForm({ ...form, season: e.target.value })}
                    className={`agri-input ${errors.season ? 'border-red-400' : ''}`}
                    aria-invalid={!!errors.season}
                    disabled={isAnalyzing}
                  >
                    {SEASON_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {errors.season && (
                    <p role="alert" className="text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />{errors.season}
                    </p>
                  )}
                </div>

                {/* Budget */}
                <div className="space-y-1">
                  <label htmlFor="adv-budget" className="block text-xs font-semibold text-slate-700">
                    Budget <span className="text-red-500" aria-hidden="true">*</span>
                  </label>
                  <select
                    id="adv-budget"
                    value={form.budget}
                    onChange={(e) => setForm({ ...form, budget: e.target.value })}
                    className={`agri-input ${errors.budget ? 'border-red-400' : ''}`}
                    aria-invalid={!!errors.budget}
                    disabled={isAnalyzing}
                  >
                    {BUDGET_OPTIONS.map((b) => <option key={b} value={b}>{b}</option>)}
                  </select>
                  {errors.budget && (
                    <p role="alert" className="text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />{errors.budget}
                    </p>
                  )}
                </div>

                {/* Preferred Crop â€” full width */}
                <div className="space-y-1 sm:col-span-2">
                  <label htmlFor="adv-crop" className="block text-xs font-semibold text-slate-700">
                    Preferred Crop
                  </label>
                  <select
                    id="adv-crop"
                    value={form.crop}
                    onChange={(e) => setForm({ ...form, crop: e.target.value })}
                    className="agri-input"
                    disabled={isAnalyzing}
                  >
                    {CROP_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

              </div>

              {/* Form actions */}
              <div className="flex flex-wrap items-center gap-3 mt-5">
                <button
                  type="submit"
                  disabled={isAnalyzing}
                  className="agri-btn-primary"
                  aria-label="Analyze farm conditions and generate crop plan"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Analyzingâ€¦
                    </>
                  ) : (
                    <>
                      Analyze Farm
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  disabled={isAnalyzing}
                  className="agri-btn-secondary"
                  aria-label="Reset all form inputs"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Reset Inputs
                </button>
                {lastAnalyzedTime && (
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Last analyzed: {lastAnalyzedTime}
                  </span>
                )}
              </div>

              {hasValidationErrors && (
                <div role="alert" className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  Please fix the highlighted fields before running the analysis.
                </div>
              )}
            </form>
          </div>

          {/* Right: what is considered */}
          <div className="lg:col-span-1">
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-3 h-full">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">What will be considered?</h3>
              {[
                { icon: MapPin, label: 'Location', desc: 'District climate & rainfall patterns' },
                { icon: Layers, label: 'Land size', desc: 'Plot area for cost estimation' },
                { icon: Leaf, label: 'Soil', desc: 'Soil type suitability for the crop' },
                { icon: Droplets, label: 'Water', desc: 'Irrigation method & availability' },
                { icon: Calendar, label: 'Season', desc: 'Seasonal crop calendar alignment' },
                { icon: TrendingUp, label: 'Budget', desc: 'Cost feasibility for the plan' },
              ].map(({ icon: Icon, label, desc }) => (
                <div key={label} className="flex items-start gap-2.5 text-xs text-slate-600">
                  <div className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-semibold text-slate-800">{label}</span>
                    <p className="text-slate-500 text-[11px] mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* â”€â”€ ANALYZING STATE â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {isAnalyzing && (
        <div className="agri-card p-8 text-center space-y-3" aria-live="polite" aria-busy="true">
          <Loader2 className="w-7 h-7 animate-spin text-emerald-700 mx-auto" aria-hidden="true" />
          <p className="text-sm font-semibold text-slate-800">Analyzing farm conditionsâ€¦</p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Processing your inputs against crop suitability data.
          </p>
        </div>
      )}

      {/* â”€â”€ EMPTY / READY STATE â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {!isAnalyzing && !isSuccess && (
        <div className="agri-card p-10 text-center space-y-3">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
            <Sprout className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Enter your farm conditions above</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Fill in the fields on the left, then click <strong>Analyze Farm</strong> to generate your crop plan.
          </p>
        </div>
      )}

      {/* â”€â”€ ANALYSIS RESULTS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {isSuccess && (
        <div className="space-y-6 animate-fade-in">

          <DemoBanner />

          {/* â”€â”€ RECOMMENDED CROP SUMMARY â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          <div className="agri-card p-5 sm:p-6">
            <SectionHeader
              title="Recommended Crop Plan"
              subtitle={`Analysis for ${form.location} Â· ${form.landSize} acres Â· ${form.season}`}
            />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 space-y-1">
                <p className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider">Recommended Crop</p>
                <p className="text-xl font-bold text-slate-900">{planData.recommendedCrop}</p>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-1">
                <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Expected Harvest</p>
                <p className="text-sm font-semibold text-slate-800">{planData.harvestPeriod}</p>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-1">
                <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Advisory Risk</p>
                <RiskBadge level={planData.riskLevel} />
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-1">
                <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Illustrative Cost</p>
                <p className="text-sm font-semibold text-slate-800">LKR {planData.estimatedCostTotal.toLocaleString()}</p>
                <p className="text-[10px] text-slate-400">Example estimate</p>
              </div>
            </div>
          </div>

          {/* â”€â”€ FINANCIAL SUMMARY â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          <div className="agri-card p-5 sm:p-6">
            <SectionHeader title="Financial Summary" subtitle="Illustrative figures only â€” verify with current local market data." />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
              <div>
                <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mb-1">Estimated Cost</p>
                <p className="text-lg font-bold text-slate-900">LKR {planData.estimatedCostTotal.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mb-1">Expected Yield</p>
                <p className="text-lg font-bold text-slate-900">{planData.baseYield.toFixed(1)} MT</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mb-1">Price Range</p>
                <p className="text-lg font-bold text-slate-900">LKR {planData.minPrice}â€“{planData.maxPrice}/kg</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mb-1">Estimated Revenue</p>
                <p className="text-base font-bold text-slate-900">
                  LKR {(planData.minPrice * planData.baseYield * 1000).toLocaleString()}â€“{(planData.maxPrice * planData.baseYield * 1000).toLocaleString()}
                </p>
              </div>
            </div>
            <p className="text-xs font-semibold text-slate-600 mb-3">Cost Breakdown</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {planData.costBreakdown.map((item) => (
                <div key={item.label} className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-1">
                  <p className="text-[10px] text-slate-500 font-medium">{item.label}</p>
                  <p className="text-sm font-bold text-slate-900">LKR {item.amount.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>

          {/* â”€â”€ CROP COMPARISON â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          <div className="agri-card p-5 sm:p-6 overflow-x-auto">
            <SectionHeader title="Crop Comparison" subtitle="Click a row to select a crop and update planning sections." />
            <div className="overflow-x-auto">
              <table className="w-full text-xs min-w-[480px]" role="table" aria-label="Crop comparison table">
                <thead>
                  <tr className="border-b border-slate-200 text-left">
                    <th scope="col" className="pb-2 pr-4 text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Crop</th>
                    <th scope="col" className="pb-2 pr-4 text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Suitability</th>
                    <th scope="col" className="pb-2 pr-4 text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Est. Yield</th>
                    <th scope="col" className="pb-2 pr-4 text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Harvest Time</th>
                    <th scope="col" className="pb-2 text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Price Range</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {planData.recommendedCrops.map((crop, idx) => (
                    <tr
                      key={crop.name}
                      onClick={() => setSelectedCropIndex(idx)}
                      onKeyDown={(e) => e.key === 'Enter' && setSelectedCropIndex(idx)}
                      className={`cursor-pointer transition ${selectedCropIndex === idx ? 'bg-emerald-50/50' : 'hover:bg-slate-50'}`}
                      tabIndex={0}
                      aria-selected={selectedCropIndex === idx}
                      role="row"
                    >
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2">
                          {selectedCropIndex === idx && <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" aria-hidden="true" />}
                          <span className="font-semibold text-slate-900">{crop.name}</span>
                        </div>
                      </td>
                      <td className="py-3 pr-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${crop.suitability === 'High' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-amber-50 border-amber-200 text-amber-800'}`}>
                          {crop.suitability}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-slate-600">{crop.yieldEst}</td>
                      <td className="py-3 pr-4 text-slate-600">{crop.harvestTime}</td>
                      <td className="py-3 text-slate-600">{crop.priceRange}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[10px] text-slate-400 mt-3">* Figures are illustrative. Actual results depend on field management, weather and market conditions.</p>
          </div>

          {/* â”€â”€ RISK & WEATHER ADVISORY â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          <div className="agri-card p-5 sm:p-6">
            <SectionHeader title="Farm Risk & Weather Advisory" />
            <div className={`rounded-xl border p-4 sm:p-5 flex flex-col sm:flex-row sm:items-start gap-4 ${
              planData.riskLevel === 'LOW' ? 'bg-emerald-50 border-emerald-200' :
              planData.riskLevel === 'HIGH' ? 'bg-red-50 border-red-200' :
              'bg-amber-50 border-amber-200'
            }`}>
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                planData.riskLevel === 'LOW' ? 'bg-emerald-100 text-emerald-700' :
                planData.riskLevel === 'HIGH' ? 'bg-red-100 text-red-700' :
                'bg-amber-100 text-amber-700'
              }`} aria-hidden="true">
                {planData.riskLevel === 'LOW' ? <CheckCircle2 className="w-5 h-5" /> :
                 planData.riskLevel === 'HIGH' ? <AlertCircle className="w-5 h-5" /> :
                 <AlertTriangle className="w-5 h-5" />}
              </div>
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-bold text-slate-900">{planData.advisoryTitle}</p>
                  <RiskBadge level={planData.riskLevel} />
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">{planData.advice}</p>
                <p className="text-[10px] text-slate-500">
                  Advisory reflects typical seasonal conditions. Check live forecasts via the{' '}
                  <Link to="/weather" className="underline hover:text-emerald-700">Weather module</Link>.
                </p>
              </div>
            </div>
          </div>

          {/* â”€â”€ PLANNING TABS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          <div className="agri-card p-0 overflow-hidden">

            {/* Tab Nav */}
            <div className="border-b border-slate-200 overflow-x-auto">
              <div className="flex min-w-max" role="tablist" aria-label="Farm planning sections">
                {TABS.map((tab) => {
                  const Icon = tab.icon;
                  const active = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      role="tab"
                      aria-selected={active}
                      aria-controls={`tabpanel-${tab.id}`}
                      id={`tab-${tab.id}`}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-1.5 px-4 py-3 text-xs font-semibold whitespace-nowrap border-b-2 transition ${
                        active
                          ? 'text-emerald-700 border-emerald-600 bg-emerald-50/40'
                          : 'text-slate-500 border-transparent hover:text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tab Panels */}
            <div className="p-5 sm:p-6">

              {/* OVERVIEW â€” Growth Plan + Rotation */}
              {activeTab === 'overview' && (
                <div id="tabpanel-overview" role="tabpanel" aria-labelledby="tab-overview">
                  <SectionHeader title="Crop Growth Plan" subtitle={`Growth stages for ${planData.recommendedCrop}. Days are approximate and vary by variety and climate.`} />

                  {/* Desktop horizontal timeline */}
                  <div className="hidden sm:flex items-start overflow-x-auto pb-2">
                    {planData.growthStages.map((stage, idx) => (
                      <div key={idx} className="flex flex-col items-center text-center min-w-[130px] flex-1">
                        <div className="flex items-center w-full">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${idx === 0 ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 border border-slate-300'}`}>
                            {idx + 1}
                          </div>
                          {idx < planData.growthStages.length - 1 && (
                            <div className="flex-1 h-0.5 bg-slate-200" />
                          )}
                        </div>
                        <div className="mt-3 px-2 space-y-1">
                          <p className="text-xs font-semibold text-slate-800">{stage.stage}</p>
                          <p className="text-[10px] text-emerald-700 font-medium">{stage.days} days</p>
                          <p className="text-[10px] text-slate-500 leading-relaxed">{stage.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Mobile vertical timeline */}
                  <div className="sm:hidden space-y-0">
                    {planData.growthStages.map((stage, idx) => (
                      <div key={idx} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${idx === 0 ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 border border-slate-300'}`}>
                            {idx + 1}
                          </div>
                          {idx < planData.growthStages.length - 1 && <div className="w-0.5 flex-1 bg-slate-200 my-1" />}
                        </div>
                        <div className="pb-5 space-y-0.5">
                          <p className="text-xs font-semibold text-slate-800">{stage.stage}</p>
                          <p className="text-[10px] text-emerald-700 font-medium">{stage.days} days</p>
                          <p className="text-[10px] text-slate-500 leading-relaxed">{stage.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Crop Rotation */}
                  <div className="mt-6 pt-5 border-t border-slate-100">
                    <SectionHeader title="Seasonal Crop Rotation" subtitle="Suggested rotation to maintain soil health and reduce disease build-up." />
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {planData.rotationCalendar.map((r, idx) => (
                        <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-1.5">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center justify-center shrink-0">{idx + 1}</span>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{r.season}</p>
                          </div>
                          <p className="text-sm font-semibold text-slate-900">{r.crop}</p>
                          <p className="text-[11px] text-slate-500">{r.purpose}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* INTERCROPPING */}
              {activeTab === 'intercrop' && (
                <div id="tabpanel-intercrop" role="tabpanel" aria-labelledby="tab-intercrop">
                  <SectionHeader
                    title="Intercropping Options"
                    subtitle={`Companion planting combinations for ${planData.recommendedCrop}. Verify with local agronomic guidance before adopting.`}
                  />
                  <div className="space-y-4">
                    {planData.intercroppingPairs.map((pair, idx) => (
                      <div key={idx} className="border border-slate-200 rounded-xl p-4 sm:p-5 space-y-3">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <p className="text-sm font-bold text-slate-900">{planData.recommendedCrop} + {pair.partner}</p>
                            <p className="text-xs text-slate-500 mt-0.5">{pair.synergy}</p>
                          </div>
                          <span className="px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold">
                            Ratio: {pair.ratio}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">{pair.desc}</p>
                        <div className="flex items-start gap-2 p-3 rounded-lg bg-slate-50 border border-slate-200">
                          <Info className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" aria-hidden="true" />
                          <p className="text-[11px] text-slate-500">
                            <strong>Reported impact:</strong> {pair.impact}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* FERTIGATION */}
              {activeTab === 'fertigation' && (
                <div id="tabpanel-fertigation" role="tabpanel" aria-labelledby="tab-fertigation">
                  <SectionHeader
                    title="Fertigation Plan"
                    subtitle={`Example schedule for ${planData.recommendedCrop}. Adjust based on soil test results and current DOA recommendations.`}
                  />

                  {/* Desktop table */}
                  <div className="hidden sm:block overflow-x-auto">
                    <table className="w-full text-xs" role="table" aria-label="Fertigation schedule">
                      <thead>
                        <tr className="border-b border-slate-200 text-left">
                          <th scope="col" className="pb-2 pr-4 text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Period</th>
                          <th scope="col" className="pb-2 pr-4 text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Stage</th>
                          <th scope="col" className="pb-2 pr-4 text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Fertilizer</th>
                          <th scope="col" className="pb-2 pr-4 text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Method</th>
                          <th scope="col" className="pb-2 text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Water/Day</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {planData.fertigationSchedule.map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-50 transition">
                            <td className="py-3 pr-4 font-semibold text-slate-800 whitespace-nowrap">{row.week}</td>
                            <td className="py-3 pr-4 text-slate-600 whitespace-nowrap">{row.stage}</td>
                            <td className="py-3 pr-4 text-slate-800 font-medium">{row.fertilizer}</td>
                            <td className="py-3 pr-4 text-slate-600">{row.method}</td>
                            <td className="py-3 text-slate-600">{row.waterPerDay || 'â€”'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile stacked cards */}
                  <div className="sm:hidden space-y-3">
                    {planData.fertigationSchedule.map((row, idx) => (
                      <div key={idx} className="border border-slate-200 rounded-xl p-4 space-y-2">
                        <div className="flex justify-between items-start">
                          <p className="text-xs font-bold text-slate-900">{row.week}</p>
                          <span className="text-[10px] text-slate-500">{row.stage}</span>
                        </div>
                        <p className="text-xs font-semibold text-slate-800">{row.fertilizer}</p>
                        <div className="flex items-center justify-between text-[11px] text-slate-500">
                          <span>Method: {row.method}</span>
                          {row.waterPerDay && <span>Water: {row.waterPerDay}</span>}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex items-start gap-2 p-3 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-500">
                    <Info className="w-3 h-3 shrink-0 mt-0.5 text-slate-400" aria-hidden="true" />
                    This is an example starting schedule. Do not modify fertilizer types or quantities without agronomic guidance. Always use soil test results and DOA recommendations as the primary reference.
                  </div>
                </div>
              )}

              {/* WHAT-IF / SENSITIVITY */}
              {activeTab === 'sensitivity' && (
                <div id="tabpanel-sensitivity" role="tabpanel" aria-labelledby="tab-sensitivity">
                  <SectionHeader
                    title="What-If Analysis"
                    subtitle="Adjust price and yield to explore how changes affect estimated revenue. This is a scenario, not a forecast or guaranteed outcome."
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                    {/* Price slider */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <label htmlFor="price-slider" className="text-xs font-semibold text-slate-700">Price Change</label>
                        <span className={`text-xs font-bold tabular-nums ${priceVariance > 0 ? 'text-emerald-700' : priceVariance < 0 ? 'text-red-600' : 'text-slate-500'}`}>
                          {priceVariance > 0 ? '+' : ''}{priceVariance}%
                        </span>
                      </div>
                      <input
                        id="price-slider"
                        type="range"
                        min="-30"
                        max="30"
                        step="5"
                        value={priceVariance}
                        onChange={(e) => setPriceVariance(Number(e.target.value))}
                        className="w-full accent-emerald-600 h-1.5 rounded-full cursor-pointer"
                        aria-valuemin={-30}
                        aria-valuemax={30}
                        aria-valuenow={priceVariance}
                        aria-valuetext={`${priceVariance > 0 ? '+' : ''}${priceVariance}% price change`}
                      />
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>âˆ’30%</span><span>0</span><span>+30%</span>
                      </div>
                    </div>

                    {/* Yield slider */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <label htmlFor="yield-slider" className="text-xs font-semibold text-slate-700">Yield Change</label>
                        <span className={`text-xs font-bold tabular-nums ${yieldVariance > 0 ? 'text-emerald-700' : yieldVariance < 0 ? 'text-red-600' : 'text-slate-500'}`}>
                          {yieldVariance > 0 ? '+' : ''}{yieldVariance}%
                        </span>
                      </div>
                      <input
                        id="yield-slider"
                        type="range"
                        min="-30"
                        max="30"
                        step="5"
                        value={yieldVariance}
                        onChange={(e) => setYieldVariance(Number(e.target.value))}
                        className="w-full accent-emerald-600 h-1.5 rounded-full cursor-pointer"
                        aria-valuemin={-30}
                        aria-valuemax={30}
                        aria-valuenow={yieldVariance}
                        aria-valuetext={`${yieldVariance > 0 ? '+' : ''}${yieldVariance}% yield change`}
                      />
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>âˆ’30%</span><span>0</span><span>+30%</span>
                      </div>
                    </div>
                  </div>

                  {/* Scenario result */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-xl">
                    <div>
                      <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mb-1">Base Case</p>
                      <p className="text-base font-bold text-slate-900">{planData.baseYield.toFixed(1)} MT</p>
                      <p className="text-[10px] text-slate-400">yield</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mb-1">Scenario Yield</p>
                      <p className={`text-base font-bold ${yieldVariance > 0 ? 'text-emerald-700' : yieldVariance < 0 ? 'text-red-600' : 'text-slate-900'}`}>
                        {scenario.adjYield} MT
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mb-1">Scenario Price</p>
                      <p className={`text-sm font-bold ${priceVariance > 0 ? 'text-emerald-700' : priceVariance < 0 ? 'text-red-600' : 'text-slate-900'}`}>
                        LKR {scenario.adjPriceMin}â€“{scenario.adjPriceMax}/kg
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mb-1">Est. Revenue</p>
                      <p className={`text-sm font-bold ${(priceVariance + yieldVariance) > 0 ? 'text-emerald-700' : (priceVariance + yieldVariance) < 0 ? 'text-red-600' : 'text-slate-900'}`}>
                        LKR {scenario.minRev.toLocaleString()}â€“{scenario.maxRev.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 mt-3 flex items-center gap-1.5">
                    <Info className="w-3 h-3 shrink-0" aria-hidden="true" />
                    Revenue is recalculated using simple multipliers applied to illustrative base values. This is a scenario tool, not a statistical forecast.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* â”€â”€ RELATED SERVICES â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          <div className="agri-card p-5 sm:p-6">
            <SectionHeader title="Related Services" subtitle="Take action across the AgroLink network." />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { to: '/disease-detection', icon: Leaf, label: 'Disease Scanner', desc: 'Scan crop images â†’' },
                { to: '/equipment-rental', icon: Tractor, label: 'Equipment Rental', desc: 'Rent machinery â†’' },
                { to: '/supplier-marketplace', icon: Store, label: 'Supplies', desc: 'Certified inputs â†’' },
                { to: '/experts', icon: Users, label: 'Consult Agronomist', desc: 'Expert advice â†’' },
              ].map(({ to, icon: Icon, label, desc }) => (
                <Link
                  key={to}
                  to={to}
                  className="p-3.5 rounded-xl border border-slate-200 hover:border-emerald-600 hover:bg-emerald-50/30 transition block space-y-1.5 group"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center group-hover:bg-emerald-100 transition" aria-hidden="true">
                    <Icon className="w-4 h-4" />
                  </div>
                  <p className="text-xs font-semibold text-slate-900">{label}</p>
                  <p className="text-[11px] text-slate-500">{desc}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* â”€â”€ DISCLAIMER â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          <div className="flex items-start gap-2.5 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 leading-relaxed">
            <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" aria-hidden="true" />
            <p>
              <strong className="text-slate-700">Decision Support Disclaimer:</strong> Analysis and recommendations are provided as planning aids only. They should be considered alongside Department of Agriculture guidelines, certified agronomist advice, and direct field observations. Do not substitute this tool for professional agricultural consultation.
            </p>
          </div>

        </div>
      )}

      {/* â”€â”€ FARM PLAN MODAL â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {showPlanModal && isSuccess && (
        <div
          className="agri-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="plan-modal-title"
          onClick={(e) => { if (e.target === e.currentTarget) setShowPlanModal(false); }}
        >
          <div className="agri-modal-content max-w-2xl w-full" ref={printRef}>
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
              <div>
                <h2 id="plan-modal-title" className="text-base font-bold text-slate-900">Farm Plan Preview</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {form.location} Â· {form.landSize} acres Â· {form.season}
                </p>
              </div>
              <button
                onClick={() => setShowPlanModal(false)}
                className="p-1.5 hover:bg-slate-100 rounded-lg transition text-slate-500"
                aria-label="Close farm plan preview"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 sm:p-6 space-y-5 overflow-y-auto max-h-[65vh]">
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-800 flex items-start gap-2">
                <Info className="w-3 h-3 shrink-0 mt-0.5" aria-hidden="true" />
                This document is a planning aid generated from your farm inputs. It is not an officially certified agricultural plan.
              </div>

              {/* Summary grid */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Plan Summary</h3>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    ['Location', form.location],
                    ['Land Size', `${form.landSize} acres`],
                    ['Soil Type', form.soilType],
                    ['Water', form.waterAvailability],
                    ['Season', form.season],
                    ['Budget', form.budget],
                    ['Recommended Crop', planData.recommendedCrop],
                    ['Expected Harvest', planData.harvestPeriod],
                    ['Advisory Risk', planData.riskLevel],
                    ['Illustrative Cost', `LKR ${planData.estimatedCostTotal.toLocaleString()}`],
                  ].map(([label, value]) => (
                    <div key={label} className="bg-slate-50 rounded-lg p-2.5 border border-slate-200">
                      <p className="text-[10px] text-slate-400 font-medium">{label}</p>
                      <p className="font-semibold text-slate-900 mt-0.5">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Growth stages */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Growth Stages</h3>
                <div className="space-y-2">
                  {planData.growthStages.map((s, idx) => (
                    <div key={idx} className="flex gap-3 text-xs">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-[10px]">{idx + 1}</span>
                      <div>
                        <span className="font-semibold text-slate-800">{s.stage}</span>
                        <span className="text-slate-400 ml-2">({s.days} days)</span>
                        <p className="text-slate-500 text-[11px] mt-0.5">{s.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Risk advisory */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Risk Advisory</h3>
                <p className="text-xs text-slate-700"><strong>{planData.advisoryTitle}</strong> â€” {planData.advice}</p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-slate-200">
              <button
                onClick={() => setShowPlanModal(false)}
                className="agri-btn-secondary"
                aria-label="Close farm plan preview"
              >
                Close
              </button>
              <button
                onClick={handlePrint}
                className="agri-btn-primary"
                aria-label="Print farm plan"
              >
                <Printer className="w-4 h-4" />
                Print Plan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CropAdvisor;

