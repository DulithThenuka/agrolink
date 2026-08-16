import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { cropsAPI } from '../services/api';
import { Sprout, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';

export const AddCrop = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await cropsAPI.create({
        name,
        category,
        price: parseFloat(price),
        quantity: parseInt(quantity),
        location,
        description,
        imageUrl,
      });
      alert('Crop listing published successfully!');
      navigate('/crops');
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Failed to publish crop listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-8 animate-fade-in space-y-6">
      <Link to="/crops" className="inline-flex items-center gap-2 text-slate-500 hover:text-emerald-600 transition text-sm font-semibold">
        <ArrowLeft className="w-4 h-4" /> Cancel and back to catalog
      </Link>

      <div className="premium-card p-8 bg-white border border-slate-100 space-y-6">
        <div>
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
            <Sprout className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 font-display">Publish New Harvest</h2>
          <p className="text-slate-500 text-xs font-semibold mt-1">Provide details regarding your available produce to list it for buyers.</p>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-100 flex items-center gap-3 text-red-600 text-xs font-bold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Crop Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Honeycrisp Apples"
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Category</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Fruits, Vegetables, Grains"
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Price (Rs./Kg)</label>
              <input
                type="number"
                step="0.5"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="240.00"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Stock Quantity (Kg)</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="e.g. 500"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Agricultural District 🇱🇰</label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold bg-white focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition cursor-pointer"
            >
              <option value="">Select District 📍</option>
              {[
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
              ].map((dist) => (
                <option key={dist} value={dist}>
                  📍 {dist}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Image URL (Optional)</label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/crop.jpg"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Description (Optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Harvest description, freshness details, or organic certification notes..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-200 hover:from-emerald-600 hover:to-emerald-700 transition flex items-center justify-center text-sm disabled:opacity-50 mt-4"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Publish Harvest Listing'}
          </button>
        </form>
      </div>
    </div>
  );
};
