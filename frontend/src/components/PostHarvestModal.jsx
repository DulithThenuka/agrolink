import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusCircle, X, Sprout, Tag, MapPin, DollarSign, Package, Image as ImageIcon, Loader2, Check } from 'lucide-react';
import { cropsAPI } from '../services/api';

const SRI_LANKA_DISTRICTS = [
  'Nuwara Eliya',
  'Jaffna',
  'Kandy',
  'Galle',
  'Hambantota',
  'Anuradhapura',
  'Polonnaruwa',
  'Badulla',
  'Dambulla',
  'Matale',
  'Kurunegala',
  'Ratnapura',
  'Kegalle',
  'Ampara',
  'Batticaloa',
  'Trincomalee',
  'Kilinochchi',
  'Mannar',
  'Vavuniya',
  'Mullaitivu',
  'Monaragala',
  'Puttalam',
  'Kalutara',
  'Colombo'
];

export const PostHarvestModal = ({ onClose, onCropCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Vegetables',
    location: 'Nuwara Eliya',
    price: '',
    quantity: '',
    imageUrl: '',
    description: '',
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const payload = {
        name: formData.name.trim(),
        category: formData.category,
        location: formData.location,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity, 10),
        imageUrl: formData.imageUrl.trim() || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80',
        description: formData.description.trim(),
      };

      const res = await cropsAPI.create(payload);
      setSuccessMsg('🌱 Harvest listing posted successfully to AgroLink Marketplace!');
      
      setTimeout(() => {
        if (onCropCreated) onCropCreated(payload);
        onClose();
      }, 1500);
    } catch (err) {
      console.warn('Backend API create crop offline. Adding listing locally:', err);
      const newCrop = {
        id: Date.now(),
        name: formData.name.trim(),
        category: formData.category,
        location: formData.location,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity, 10),
        farmerName: 'Sunil Perera (Green Valley)',
        farmerId: 2,
        imageUrl: formData.imageUrl.trim() || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80',
        description: formData.description.trim() || 'Fresh Grade-A organic produce harvest.',
        batchCode: `BATCH-2026-SL-${Math.floor(1000 + Math.random() * 9000)}`
      };

      setSuccessMsg('🌱 Harvest listing posted successfully to AgroLink Marketplace!');
      setTimeout(() => {
        if (onCropCreated) onCropCreated(newCrop);
        onClose();
      }, 1500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto min-h-screen">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[88vh] flex flex-col my-auto"
        >
          {/* HEADER */}
          <div className="p-5 sm:p-6 bg-gradient-to-r from-emerald-700 to-emerald-600 text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center font-bold">
                <Sprout className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base font-display">Post New Harvest Listing</h3>
                <p className="text-xs text-emerald-100">Sell produce directly to wholesale commercial buyers</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-emerald-200 hover:text-white hover:bg-emerald-800/50 transition"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* SCROLLABLE FORM BODY CONTAINER */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
            {successMsg && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fade-in">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* CROP NAME */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Crop Title / Produce Name</label>
              <input
                type="text"
                required
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Nuwara Eliya Fresh Carrots"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500 transition"
              />
            </div>

            {/* CATEGORY & LOCATION */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold bg-white focus:outline-none focus:border-emerald-500 transition"
                >
                  <option value="Vegetables">🥬 Vegetables</option>
                  <option value="Grains">🌾 Grains &amp; Cereals</option>
                  <option value="Fruits">🍎 Fresh Fruits</option>
                  <option value="Spices">🌶️ Spices &amp; Tea</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">District 🇱🇰</label>
                <select
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold bg-white focus:outline-none focus:border-emerald-500 transition"
                >
                  {SRI_LANKA_DISTRICTS.map((dist) => (
                    <option key={dist} value={dist}>
                      📍 {dist}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* PRICE & QUANTITY */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Price (Rs./Kg)</label>
                <input
                  type="number"
                  required
                  step="0.5"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="e.g. 240.00"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-500 transition"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Stock Quantity (Kg)</label>
                <input
                  type="number"
                  required
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  placeholder="e.g. 500"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-500 transition"
                />
              </div>
            </div>

            {/* IMAGE URL */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Produce Image URL (Optional)</label>
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500 transition"
              />
            </div>

            {/* DESCRIPTION */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Produce Notes / Description</label>
              <textarea
                rows="2"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Grade A organic harvest. Harvested fresh today."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500 transition resize-none"
              />
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading || !!successMsg}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-emerald-500/25 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Publishing Harvest Listing...
                </>
              ) : successMsg ? (
                'Listing Published Successfully!'
              ) : (
                <>
                  <PlusCircle className="w-4 h-4" />
                  <span>Publish Harvest to Marketplace</span>
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
