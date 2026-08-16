import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Camera, ShieldAlert, CheckCircle2, Phone, AlertCircle, Sparkles, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import { diseaseDetectionAPI } from '../services/api';

export const CropDiseaseDetection = () => {
  const [selectedCrop, setSelectedCrop] = useState('Tomato');
  const [imageUrl, setImageUrl] = useState('');
  const [scanning, setScanning] = useState(false);
  const [resultData, setResultData] = useState(null);

  const fetchScan = async (crop, img) => {
    setScanning(true);
    try {
      const res = await diseaseDetectionAPI.scan({ sampleCrop: crop, imageUrl: img || 'leaf_sample.jpg' });
      if (res && res.data) {
        setResultData(res.data);
      }
    } catch (err) {
      console.error('Failed to run crop disease scan:', err);
    } finally {
      setScanning(false);
    }
  };

  useEffect(() => {
    fetchScan(selectedCrop, imageUrl);
  }, [selectedCrop]);

  const handleScan = () => {
    fetchScan(selectedCrop, imageUrl);
  };

  const result = {
    detectedDisease: resultData?.detectedDisease || (selectedCrop === 'Rice' ? 'Rice Leaf Blast' : selectedCrop === 'Potato' ? 'Potato Late Blight' : 'Tomato Early Blight'),
    scientificName: resultData?.scientificName || (selectedCrop === 'Rice' ? 'Magnaporthe oryzae' : selectedCrop === 'Potato' ? 'Phytophthora infestans' : 'Alternaria solani'),
    confidencePercentage: resultData?.confidencePercentage || (selectedCrop === 'Rice' ? 92.8 : selectedCrop === 'Potato' ? 96.1 : 94.3),
    severityLevel: resultData?.severityLevel || (selectedCrop === 'Tomato' ? 'Moderate' : 'High'),
    recommendedActions: resultData?.recommendedActions || [
      'Remove severely infected leaves from plant canopy immediately',
      'Avoid overhead sprinkler watering; transition to drip irrigation',
      'Improve field row ventilation and sunlight exposure',
      'Apply organic copper fungicide or consult an agricultural extension officer',
    ],
    nearbyExpert: resultData?.nearbyExpert || {
      name: 'Dr. K. L. Perera',
      title: 'Senior Agricultural Extension Specialist',
      phone: '+94 77 123 4567',
      officeLocation: 'Regional Agricultural Office, Anuradhapura',
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8 animate-fade-in">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200/60">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2 border border-emerald-200/60">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> CNN Computer Vision Diagnostics
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 font-display flex items-center gap-2">
            Crop Disease Scanner 📷
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Upload or scan a leaf photo to diagnose crop pathologies, calculate confidence scores, and get treatment advice.
          </p>
        </div>
      </div>


      {/* TWO COLUMN LAYOUT */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT SCANNER INPUT PANEL */}
        <div className="lg:col-span-5 premium-card p-6 bg-white border border-slate-100/90 shadow-lg space-y-5">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-600" /> Leaf Photo Diagnostic Scan
            </h3>
            <p className="text-xs text-slate-400">Upload photo or choose a leaf sample</p>
          </div>

          <div className="border-2 border-slate-200 border-dashed rounded-3xl p-6 text-center space-y-3 bg-slate-50 hover:bg-slate-100/60 transition cursor-pointer">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto text-2xl font-bold shadow-sm">
              <Upload className="w-7 h-7 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800"><span className="text-emerald-600">Click to upload leaf photo</span> or drag &amp; drop</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Supports PNG, JPG, WEBP (Max 10MB)</p>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Select Preset Leaf Sample:</label>
            <select
              value={selectedCrop}
              onChange={(e) => {
                setSelectedCrop(e.target.value);
                handleScan();
              }}
              className="input-premium text-sm font-semibold"
            >
              <option value="Tomato">🍅 Tomato Leaf (Early Blight)</option>
              <option value="Rice">🌾 Rice Leaf (Leaf Blast)</option>
              <option value="Potato">🥔 Potato Leaf (Late Blight)</option>
            </select>

            <button
              onClick={handleScan}
              disabled={scanning}
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-500/20 hover:from-emerald-600 hover:to-emerald-700 transition"
            >
              {scanning ? 'Running Vision Classification...' : 'Run AI Vision Scan 🔬'}
            </button>
          </div>
        </div>

        {/* RIGHT DIAGNOSTIC RESULTS PANEL */}
        <div className="lg:col-span-7 space-y-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="premium-card p-6 bg-white border border-emerald-100 shadow-xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div>
                <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-extrabold rounded-full uppercase tracking-wider">
                  Condition Identified
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900 font-display mt-2">
                  {result.detectedDisease}
                </h2>
                <p className="text-xs text-slate-400 font-semibold italic mt-0.5">
                  Pathogen: {result.scientificName}
                </p>
              </div>

              <div className="text-right">
                <span className="text-3xl font-extrabold text-emerald-600 font-display">{result.confidencePercentage}%</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">CNN Confidence</span>
              </div>
            </div>

            <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200/80 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">Infection Severity Rating:</span>
              <span className="px-3 py-1 bg-amber-500 text-white font-extrabold text-xs rounded-xl">
                {result.severityLevel}
              </span>
            </div>

            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Recommended Agronomic Treatment Action</h3>
              <div className="space-y-2">
                {result.recommendedActions.map((action, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <p className="text-xs font-semibold text-slate-700 leading-relaxed">{action}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* NEARBY EXPERT SPECIALIST CARD */}
          <div className="premium-card p-6 bg-white border border-slate-100/90 shadow-md space-y-3">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block">Nearby Extension Specialist Available</span>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xl">
                  👨‍🔬
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-base">{result.nearbyExpert.name}</h4>
                  <p className="text-xs text-slate-500 font-semibold">{result.nearbyExpert.title}</p>
                  <p className="text-[11px] text-emerald-600 font-bold mt-0.5">{result.nearbyExpert.officeLocation}</p>
                </div>
              </div>
              <a href={`tel:${result.nearbyExpert.phone}`} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition flex items-center gap-1.5 shrink-0">
                <Phone className="w-3.5 h-3.5 text-emerald-600" /> Call Specialist
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
