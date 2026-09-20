import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { cropsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Sprout,
  ArrowLeft,
  Loader2,
  AlertCircle,
  CheckCircle2,
  MapPin,
  Tag,
  DollarSign,
  Layers,
  Image as ImageIcon,
  FileText,
  PlusCircle,
  Eye
} from 'lucide-react';

const COMMON_CROPS = [
  { name: 'Tomato', category: 'Vegetables' },
  { name: 'Carrot', category: 'Vegetables' },
  { name: 'Potato', category: 'Tubers & Root Crops' },
  { name: 'Green Chili', category: 'Spices & Condiments' },
  { name: 'Red Onion', category: 'Spices & Condiments' },
  { name: 'Cabbage', category: 'Vegetables' },
  { name: 'Cavendish Banana', category: 'Fruits' },
  { name: 'Red Lady Papaya', category: 'Fruits' },
];

const CATEGORIES = [
  'Vegetables',
  'Fruits',
  'Grains & Cereals',
  'Spices & Condiments',
  'Tubers & Root Crops',
];

const SRI_LANKAN_DISTRICTS = [
  'Nuwara Eliya',
  'Kandy',
  'Matale',
  'Badulla',
  'Anuradhapura',
  'Polonnaruwa',
  'Kurunegala',
  'Puttalam',
  'Jaffna',
  'Kilinochchi',
  'Mannar',
  'Vavuniya',
  'Mullaitivu',
  'Ampara',
  'Batticaloa',
  'Trincomalee',
  'Hambantota',
  'Matara',
  'Galle',
  'Ratnapura',
  'Kegalle',
  'Monaragala',
  'Kalutara',
  'Gampaha',
  'Colombo',
];

export const AddCrop = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Initial location pre-fill from user context if available
  const initialDistrict = user?.location
    ? (SRI_LANKAN_DISTRICTS.find(d => user.location.toLowerCase().includes(d.toLowerCase())) || '')
    : '';

  // Form Field State
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [location, setLocation] = useState(initialDistrict);
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  // Form State Machine
  // 'FORM_READY' | 'SUBMITTING' | 'SUCCESS' | 'SUBMISSION_ERROR'
  const [formState, setFormState] = useState('FORM_READY');
  const [validationErrors, setValidationErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [createdCropData, setCreatedCropData] = useState(null);

  // Quick crop selection pill handler
  const handleSelectQuickCrop = (crop) => {
    setName(crop.name);
    setCategory(crop.category);
    if (validationErrors.name) {
      setValidationErrors((prev) => ({ ...prev, name: null }));
    }
    if (validationErrors.category) {
      setValidationErrors((prev) => ({ ...prev, category: null }));
    }
  };

  // Client-side validation
  const validateForm = () => {
    const errors = {};
    if (!name.trim()) {
      errors.name = 'Crop name is required.';
    }
    if (!category.trim()) {
      errors.category = 'Please select a crop category.';
    }
    if (!location.trim()) {
      errors.location = 'Agricultural district is required.';
    }

    const parsedPrice = parseFloat(price);
    if (!price || isNaN(parsedPrice) || parsedPrice <= 0) {
      errors.price = 'Price must be greater than 0.';
    }

    const parsedQty = parseInt(quantity, 10);
    if (!quantity || isNaN(parsedQty) || parsedQty < 1) {
      errors.quantity = 'Stock quantity must be at least 1 Kg.';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!validateForm()) {
      return;
    }

    setFormState('SUBMITTING');

    try {
      const payload = {
        name: name.trim(),
        category: category.trim(),
        price: parseFloat(price),
        quantity: parseInt(quantity, 10),
        location: location.trim(),
        description: description.trim(),
        imageUrl: imageUrl.trim(),
      };

      const res = await cropsAPI.create(payload);
      const savedData = res?.data || payload;

      setCreatedCropData(savedData);
      setFormState('SUCCESS');
    } catch (err) {
      console.error('Failed to create crop:', err);
      setServerError(typeof err === 'string' ? err : 'Unable to add this crop. Please review your details and try again.');
      setFormState('SUBMISSION_ERROR');
    }
  };

  // Reset form for adding another crop
  const handleResetForAnother = () => {
    setName('');
    setCategory('');
    setPrice('');
    setQuantity('');
    setLocation(initialDistrict);
    setDescription('');
    setImageUrl('');
    setValidationErrors({});
    setServerError('');
    setCreatedCropData(null);
    setFormState('FORM_READY');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 animate-fade-in space-y-6 text-slate-900">
      
      {/* ── TOP NAVIGATION / CANCEL ── */}
      <div className="flex items-center justify-between">
        <Link
          to="/crops"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-800 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Cancel and back to My Crops</span>
        </Link>
      </div>

      {/* ==================================================================== */}
      {/* SUCCESS STATE                                                        */}
      {/* ==================================================================== */}
      {formState === 'SUCCESS' && (
        <div className="agri-card p-6 sm:p-8 bg-white border border-emerald-200 shadow-sm space-y-6 animate-fade-in text-center">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-200">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Crop Added Successfully
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
              Your harvest record is now registered in the AgroLink farm ledger. You can track growth stages, weather impact, and manage market listings.
            </p>
          </div>

          {/* Record Summary Card */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-left text-xs space-y-2 max-w-md mx-auto">
            <div className="flex justify-between py-1 border-b border-slate-200/60">
              <span className="text-slate-500">Crop Name:</span>
              <strong className="text-slate-900">{createdCropData?.name || name}</strong>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200/60">
              <span className="text-slate-500">Category:</span>
              <span className="font-semibold text-slate-800">{createdCropData?.category || category}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200/60">
              <span className="text-slate-500">Farm District:</span>
              <span className="font-semibold text-slate-800">{createdCropData?.location || location}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200/60">
              <span className="text-slate-500">Harvest Volume:</span>
              <strong className="text-emerald-700">{createdCropData?.quantity || quantity} Kg</strong>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Wholesale Unit Price:</span>
              <strong className="text-emerald-700">Rs. {createdCropData?.price || price} / Kg</strong>
            </div>
          </div>

          {/* Next Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to="/crops"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold transition shadow-2xs"
            >
              <Sprout className="w-3.5 h-3.5" />
              <span>View in My Crops</span>
            </Link>

            <button
              type="button"
              onClick={handleResetForAnother}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition shadow-2xs"
            >
              <PlusCircle className="w-3.5 h-3.5 text-slate-500" />
              <span>Add Another Crop</span>
            </button>

            <Link
              to="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-slate-600 hover:text-slate-900 text-xs font-semibold transition"
            >
              <span>Back to Overview</span>
            </Link>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* FORM INTERFACE                                                       */}
      {/* ==================================================================== */}
      {formState !== 'SUCCESS' && (
        <div className="agri-card p-6 sm:p-8 bg-white space-y-6">
          
          {/* Header */}
          <div className="space-y-1 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
                <Sprout className="w-4 h-4" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                Add a New Crop
              </h1>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Add a crop to your farm so AgroLink can help you track its progress and provide relevant insights.
            </p>
          </div>

          {/* Submission Error Banner */}
          {serverError && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center justify-between gap-2 animate-fade-in">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{serverError}</span>
              </div>
              <button
                type="button"
                onClick={() => setServerError('')}
                className="text-xs font-bold text-rose-900 hover:underline shrink-0"
              >
                Dismiss
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* ────────────────────────────────────────────────────────────── */}
            {/* 1. CROP INFORMATION GROUP                                     */}
            {/* ────────────────────────────────────────────────────────────── */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 pb-1">
                <Tag className="w-3.5 h-3.5 text-emerald-700" />
                <span>Crop Information</span>
              </div>

              {/* Quick Suggestion Pills */}
              <div className="space-y-1.5">
                <span className="text-[11px] text-slate-400 font-medium">Quick Suggestions:</span>
                <div className="flex flex-wrap gap-1.5">
                  {COMMON_CROPS.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => handleSelectQuickCrop(c)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition border ${
                        name === c.name
                          ? 'bg-emerald-800 text-white border-emerald-800 shadow-2xs'
                          : 'bg-slate-50 text-slate-600 border-slate-200/80 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Crop Name */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
                  Crop Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (validationErrors.name) {
                      setValidationErrors((prev) => ({ ...prev, name: null }));
                    }
                  }}
                  placeholder="e.g., Honeycrisp Apples, Tomato, Green Beans"
                  className={`w-full px-3.5 py-2.5 text-xs rounded-xl border font-medium focus:outline-none focus:ring-2 focus:ring-emerald-700 transition ${
                    validationErrors.name
                      ? 'border-rose-300 bg-rose-50/30'
                      : 'border-slate-200 bg-white'
                  }`}
                />
                {validationErrors.name && (
                  <p className="text-[11px] text-rose-600 font-semibold">{validationErrors.name}</p>
                )}
              </div>

              {/* Category */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
                  Produce Category <span className="text-rose-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    if (validationErrors.category) {
                      setValidationErrors((prev) => ({ ...prev, category: null }));
                    }
                  }}
                  className={`w-full px-3.5 py-2.5 text-xs rounded-xl border font-medium focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white transition cursor-pointer ${
                    validationErrors.category
                      ? 'border-rose-300 bg-rose-50/30'
                      : 'border-slate-200'
                  }`}
                >
                  <option value="">Select Category...</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                {validationErrors.category && (
                  <p className="text-[11px] text-rose-600 font-semibold">{validationErrors.category}</p>
                )}
              </div>
            </div>

            {/* ────────────────────────────────────────────────────────────── */}
            {/* 2. FARM & LOCATION GROUP                                      */}
            {/* ────────────────────────────────────────────────────────────── */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 pb-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                <span>Farm &amp; Location Details</span>
              </div>

              {/* District */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
                  Agricultural District 🇱🇰 <span className="text-rose-500">*</span>
                </label>
                <select
                  value={location}
                  onChange={(e) => {
                    setLocation(e.target.value);
                    if (validationErrors.location) {
                      setValidationErrors((prev) => ({ ...prev, location: null }));
                    }
                  }}
                  className={`w-full px-3.5 py-2.5 text-xs rounded-xl border font-medium focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white transition cursor-pointer ${
                    validationErrors.location
                      ? 'border-rose-300 bg-rose-50/30'
                      : 'border-slate-200'
                  }`}
                >
                  <option value="">Select District 📍</option>
                  {SRI_LANKAN_DISTRICTS.map((dist) => (
                    <option key={dist} value={dist}>
                      📍 {dist}
                    </option>
                  ))}
                </select>
                {validationErrors.location && (
                  <p className="text-[11px] text-rose-600 font-semibold">{validationErrors.location}</p>
                )}
              </div>

              {/* Description / Farm Notes */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
                  Farm &amp; Harvest Notes <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  placeholder="Harvest description, freshness details, organic certification, or field block..."
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white transition resize-none"
                />
              </div>
            </div>

            {/* ────────────────────────────────────────────────────────────── */}
            {/* 3. HARVEST VOLUME & PRICING GROUP                             */}
            {/* ────────────────────────────────────────────────────────────── */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 pb-1">
                <DollarSign className="w-3.5 h-3.5 text-emerald-700" />
                <span>Volume &amp; Target Pricing</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Quantity */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
                    Stock Quantity (Kg) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={quantity}
                    onChange={(e) => {
                      setQuantity(e.target.value);
                      if (validationErrors.quantity) {
                        setValidationErrors((prev) => ({ ...prev, quantity: null }));
                      }
                    }}
                    placeholder="e.g., 500"
                    className={`w-full px-3.5 py-2.5 text-xs rounded-xl border font-medium focus:outline-none focus:ring-2 focus:ring-emerald-700 transition ${
                      validationErrors.quantity
                        ? 'border-rose-300 bg-rose-50/30'
                        : 'border-slate-200 bg-white'
                    }`}
                  />
                  {validationErrors.quantity && (
                    <p className="text-[11px] text-rose-600 font-semibold">{validationErrors.quantity}</p>
                  )}
                </div>

                {/* Price */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
                    Target Price (Rs./Kg) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0.01"
                    step="0.5"
                    value={price}
                    onChange={(e) => {
                      setPrice(e.target.value);
                      if (validationErrors.price) {
                        setValidationErrors((prev) => ({ ...prev, price: null }));
                      }
                    }}
                    placeholder="e.g., 240.00"
                    className={`w-full px-3.5 py-2.5 text-xs rounded-xl border font-medium focus:outline-none focus:ring-2 focus:ring-emerald-700 transition ${
                      validationErrors.price
                        ? 'border-rose-300 bg-rose-50/30'
                        : 'border-slate-200 bg-white'
                    }`}
                  />
                  {validationErrors.price && (
                    <p className="text-[11px] text-rose-600 font-semibold">{validationErrors.price}</p>
                  )}
                </div>
              </div>
            </div>

            {/* ────────────────────────────────────────────────────────────── */}
            {/* 4. PRODUCE PHOTO (OPTIONAL)                                   */}
            {/* ────────────────────────────────────────────────────────────── */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 pb-1">
                <ImageIcon className="w-3.5 h-3.5 text-emerald-700" />
                <span>Produce Photo (Optional)</span>
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
                  Image URL
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/crops/harvest-photo.jpg"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white transition"
                />
              </div>

              {/* Thumbnail preview if URL entered */}
              {imageUrl && (
                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <img
                    src={imageUrl}
                    alt="Produce Preview"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                    className="w-12 h-12 object-cover rounded-lg border border-slate-200"
                  />
                  <div className="text-[11px] text-slate-600">
                    <span className="font-semibold block text-slate-900">Image Preview Loaded</span>
                    <span>Buyers will be able to inspect this crop visual on the marketplace.</span>
                  </div>
                </div>
              )}
            </div>

            {/* ────────────────────────────────────────────────────────────── */}
            {/* SUBMIT BUTTONS                                                */}
            {/* ────────────────────────────────────────────────────────────── */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="submit"
                disabled={formState === 'SUBMITTING'}
                className="w-full sm:flex-1 py-3 px-5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs transition shadow-2xs flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
              >
                {formState === 'SUBMITTING' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Adding crop...</span>
                  </>
                ) : (
                  <>
                    <Sprout className="w-4 h-4" />
                    <span>Add Crop</span>
                  </>
                )}
              </button>

              <Link
                to="/crops"
                className="w-full sm:w-auto py-3 px-5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs text-center transition shadow-2xs"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AddCrop;
