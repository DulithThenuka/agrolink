import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cropsAPI, ordersAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Search, Filter, Loader2, ShoppingBag, MapPin, Tag, Trash2 } from 'lucide-react';
import { FarmerProfileModal } from '../components/FarmerProfileModal';

export const CropsList = () => {
  const { isBuyer, isFarmer } = useAuth();
  const navigate = useNavigate();
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchCrops = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        size: 12,
        ...(keyword && { keyword }),
        ...(category && { category }),
        ...(location && { location }),
        ...(minPrice && { minPrice }),
        ...(maxPrice && { maxPrice }),
      };
      const res = await cropsAPI.getAll(params);
      if (res && res.data) {
        setCrops(res.data.content || []);
        setTotalPages(res.data.totalPages || 0);
      }
    } catch (err) {
      console.error('Failed to load crops:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCrops();
  }, [page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0);
    fetchCrops();
  };

  const handleBuy = async (cropId) => {
    try {
      await ordersAPI.place({ cropId, quantity: 1 });
      alert('Order placed successfully!');
      fetchCrops();
    } catch (err) {
      alert(typeof err === 'string' ? err : 'Order placement failed');
    }
  };

  const handleDelete = async (cropId) => {
    if (!window.confirm('Are you sure you want to delete this crop listing?')) return;
    try {
      await cropsAPI.delete(cropId);
      fetchCrops();
    } catch (err) {
      alert('Failed to delete crop');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8 animate-fade-in">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pb-6 border-b border-slate-200/60">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 font-display">Available Crops 🌾</h1>
          <p className="text-slate-500 text-sm mt-1">Discover, order, or sell fresh organic agriculture harvests directly.</p>
        </div>

        {/* SEARCH BAR */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1 md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Search crops..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition"
            />
          </div>
          <button type="submit" className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-sm transition">
            Search
          </button>
        </form>
      </div>

      {/* QUICK CATEGORY PILLS */}
      <div className="flex flex-wrap gap-2.5 items-center">
        <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mr-1">Category Pill Filters:</span>
        {['', 'Vegetables', 'Grains', 'Fruits', 'Spices'].map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setCategory(cat);
              setPage(0);
              fetchCrops();
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition border ${
              category === cat
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-500/20'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-emerald-50 hover:text-emerald-700'
            }`}
          >
            {cat === '' ? 'All Produce' : cat}
          </button>
        ))}
      </div>


      {/* FILTER BAR */}
      <div className="premium-card p-6 bg-white border border-slate-100">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 items-end">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Category</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Vegetables"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500 transition"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. California"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500 transition"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Min Price ($)</label>
            <input
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="0"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500 transition"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Max Price ($)</label>
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="1000"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500 transition"
            />
          </div>

          <button type="submit" className="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5">
            <Filter className="w-3.5 h-3.5" /> Apply Filters
          </button>
        </form>
      </div>

      {/* CROP GRID */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400 space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
          <p className="text-sm font-semibold">Loading agricultural catalog...</p>
        </div>
      ) : crops.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 p-8 space-y-3">
          <div className="text-4xl">🌾</div>
          <h3 className="text-lg font-bold text-slate-800 font-display">No Crops Found</h3>
          <p className="text-slate-500 text-sm">Try adjusting your search query or filter parameters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {crops.map((crop) => (
            <motion.div
              key={crop.id}
              whileHover={{ y: -4 }}
              className="premium-card overflow-hidden bg-white border border-slate-100/90 flex flex-col justify-between h-full group shadow-md hover:shadow-xl transition-all duration-300"
            >
              <div className="h-52 overflow-hidden bg-slate-100 relative">
                <img
                  src={crop.imageUrl || 'https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&w=600&q=80'}
                  alt={crop.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-70" />

                <div className="absolute top-3 left-3 flex flex-col gap-1 items-start z-10">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFarmer({ id: crop.farmerId, name: crop.farmerName });
                    }}
                    className="badge-premium badge-delivered shadow-md text-[10px] hover:scale-105 transition font-bold"
                  >
                    🧑‍🌾 {crop.farmerName || 'Nimal Perera'} ✓
                  </button>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 backdrop-blur-md text-emerald-200 text-[9px] font-bold border border-emerald-400/30">
                    🌱 Organic: Yes
                  </span>
                </div>

                <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-amber-500 text-white font-extrabold text-[10px] uppercase shadow-md">
                  Grade A
                </span>

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-semibold">
                  <span className="px-2 py-0.5 rounded-lg glass-dark text-[10px] font-bold border border-white/20 flex items-center gap-1">
                    📍 {crop.location || 'Nuwara Eliya'}
                  </span>
                  <span className="px-2 py-0.5 rounded-lg glass-dark text-[10px] font-bold border border-white/20">
                    {crop.quantity || 230}kg Available
                  </span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-1">
                    <span>{crop.category || 'Fresh Produce'}</span>
                    <span className="text-slate-500 font-bold lowercase">Harvested: Today</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-800 font-display hover:text-emerald-600 transition">
                    <Link to={`/crops/${crop.id}`}>{crop.name}</Link>
                  </h3>

                  <div className="flex items-center justify-between text-xs mt-1">
                    <span className="font-bold text-amber-500 text-xs">
                      ★★★★★ 4.8
                    </span>
                    <span className="text-slate-400 font-semibold text-[10px]">327 transactions</span>
                  </div>

                  <div className="mt-3 p-2.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-0.5">
                    <div className="flex items-baseline justify-between">
                      <span className="text-lg font-extrabold text-emerald-600 font-display">Rs. {crop.price || 210}/kg</span>
                      <span className="text-[10px] text-slate-400 line-through font-semibold">Market: Rs. 225/kg</span>
                    </div>
                    <div className="flex justify-between items-center text-[9px] font-bold text-emerald-700">
                      <span>Direct Farm Price</span>
                      <span className="px-1.5 py-0.5 rounded-full bg-emerald-100">You save: 6.7%</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  {isBuyer && (
                    <div className="grid grid-cols-2 gap-2 w-full">
                      <button
                        onClick={() => handleBuy(crop.id)}
                        disabled={crop.quantity <= 0}
                        className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition disabled:opacity-50 flex items-center justify-center gap-1"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" /> Buy Now
                      </button>
                      <button
                        onClick={() => alert('Offer submitted to farmer for negotiation!')}
                        className="w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition text-center"
                      >
                        Make Offer
                      </button>
                    </div>
                  )}

                  {!isBuyer && !isFarmer && (
                    <Link
                      to={`/crops/${crop.id}`}
                      className="w-full text-center py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
                    >
                      View Crop Details
                    </Link>
                  )}

                  {isFarmer && (
                    <button
                      onClick={() => handleDelete(crop.id)}
                      className="ml-auto p-2 text-red-500 hover:bg-red-50 rounded-xl transition"
                      title="Delete Listing"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}


      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 pt-6">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-bold text-xs rounded-xl disabled:opacity-50 shadow-sm"
          >
            Previous
          </button>
          <span className="px-4 py-2 bg-emerald-50 text-emerald-700 font-bold text-xs rounded-xl border border-emerald-100">
            Page {page + 1} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-bold text-xs rounded-xl disabled:opacity-50 shadow-sm"
          >
            Next
          </button>
        </div>
      )}

      {selectedFarmer && (
        <FarmerProfileModal
          farmerId={selectedFarmer.id}
          farmerName={selectedFarmer.name}
          onClose={() => setSelectedFarmer(null)}
        />
      )}
    </div>
  );
};
