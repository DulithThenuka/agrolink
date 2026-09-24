import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X, ShieldCheck, Truck, Calculator, MapPin, Loader2, ArrowRight, AlertTriangle, Lock } from 'lucide-react';
import { ordersAPI } from '../services/api';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const BuyCropModal = ({ crop, onClose, onOrderPlaced }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, isFarmer } = useAuth();
  
  const [quantity, setQuantity] = useState(Math.min(50, crop.quantity || 100));
  const [deliveryLocation, setDeliveryLocation] = useState('Colombo Wholesale Hub');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const unitPrice = Number(crop.price) || 210;
  const maxStock = crop.quantity || 500;

  // Determine if the current logged-in user is the farmer who owns this listing
  const isOwner = Boolean(
    isFarmer && crop && (
      (crop.farmerId && user?.id && String(crop.farmerId) === String(user.id)) ||
      (crop.farmerName && user?.name && crop.farmerName.toLowerCase() === user.name.toLowerCase()) ||
      (crop.farmerEmail && user?.email && crop.farmerEmail.toLowerCase() === user.email.toLowerCase())
    )
  );

  // Live Calculation Math
  const produceTotal = quantity * unitPrice;
  const estimatedLogistics = 4800 + Math.round(quantity * 1.5);
  const totalEscrowAmount = produceTotal + estimatedLogistics;

  const handleQuantityChange = (val) => {
    const num = parseInt(val, 10);
    if (isNaN(num) || num <= 0) {
      setQuantity(1);
    } else if (num > maxStock) {
      setQuantity(maxStock);
    } else {
      setQuantity(num);
    }
  };

  const handleConfirmOrder = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`);
      return;
    }

    if (isOwner) {
      setErrorMsg('You cannot purchase your own crop listing.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const payload = {
        cropId: crop.id,
        quantity: quantity,
        deliveryLocation: deliveryLocation,
      };

      await ordersAPI.place(payload);
      setSuccessMsg('Order placed successfully! Purchase record submitted.');
      
      setTimeout(() => {
        if (onOrderPlaced) onOrderPlaced();
        onClose();
        navigate('/orders');
      }, 1500);

    } catch (err) {
      console.warn('Backend order placement API response:', err);
      setErrorMsg(typeof err === 'string' ? err : 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col my-auto font-sans"
        >
          {/* HEADER */}
          <div className="p-5 border-b border-slate-200 flex items-center justify-between shrink-0 bg-white">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-bold">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">Purchase Order</h3>
                <p className="text-xs text-slate-500">Commercial Wholesale Produce Order</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* SCROLLABLE BODY CONTAINER */}
          <div className="overflow-y-auto flex-1 divide-y divide-slate-100">
            {/* CROP BRIEF CARD */}
            <div className="p-4 bg-slate-50 flex items-center gap-4">
              <img
                src={crop.imageUrl || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80'}
                alt={crop.name}
                className="w-14 h-14 rounded-xl object-cover border border-slate-200 bg-white shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase text-emerald-700 tracking-wider">
                    {crop.category || 'Produce'}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100/70 text-emerald-800 font-semibold text-[11px]">
                    {maxStock} kg Stock
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm truncate mt-0.5">{crop.name}</h4>
                <p className="text-xs text-slate-600">
                  Rate: <span className="text-emerald-700 font-bold">Rs. {unitPrice}/kg</span> • Location: {crop.location || 'Sri Lanka'}
                </p>
              </div>
            </div>

            {/* FORM & CALCULATOR */}
            <form onSubmit={handleConfirmOrder} className="p-5 space-y-4">
              {successMsg && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                  <span>{successMsg}</span>
                </div>
              )}

              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* QUANTITY INPUT STEPPER */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-semibold text-slate-700">Required Quantity (kg)</label>
                  <span className="text-slate-400">Available: {maxStock} kg</span>
                </div>

                <input
                  type="number"
                  min="1"
                  max={maxStock}
                  value={quantity}
                  onChange={(e) => handleQuantityChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition"
                />

                {/* QUICK PRESET BUTTONS */}
                <div className="flex gap-2 pt-1">
                  {[10, 50, 100, 250, maxStock].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => handleQuantityChange(preset)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition border ${
                        quantity === preset
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {preset === maxStock ? 'Max Stock' : `${preset} kg`}
                    </button>
                  ))}
                </div>
              </div>

              {/* DELIVERY LOCATION */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">Delivery Destination Hub</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={deliveryLocation}
                    onChange={(e) => setDeliveryLocation(e.target.value)}
                    placeholder="e.g. Colombo Wholesale Manning Market"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition"
                  />
                </div>
              </div>

              {/* PRICE BREAKDOWN BOX */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs text-slate-700">
                <div className="flex items-center justify-between font-bold text-slate-800 pb-2 border-b border-slate-200">
                  <span className="flex items-center gap-1.5"><Calculator className="w-3.5 h-3.5 text-slate-500" /> Order Summary</span>
                  <span className="text-emerald-700">Direct Purchase</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Produce Cost ({quantity} kg × Rs. {unitPrice}):</span>
                  <span className="font-semibold text-slate-800">Rs. {produceTotal.toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500 flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-slate-400" /> Estimated Freight Logistics:
                  </span>
                  <span className="font-semibold text-slate-800">Rs. {estimatedLogistics.toLocaleString()}</span>
                </div>

                <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline">
                  <span className="font-bold text-sm text-slate-900">Total Purchase Amount:</span>
                  <span className="text-lg font-bold text-emerald-700">
                    Rs. {totalEscrowAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* AUTH / ROLE BANNER */}
              {!isAuthenticated ? (
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-2">
                  <div className="flex items-center gap-2 font-bold">
                    <Lock className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Sign In Required</span>
                  </div>
                  <p className="text-[11px] text-amber-700">
                    Please sign in to confirm this purchase order.
                  </p>
                  <button
                    type="button"
                    onClick={() => navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`)}
                    className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg text-xs transition inline-flex items-center gap-1"
                  >
                    <span>Sign In to Continue</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : isOwner ? (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs space-y-1">
                  <div className="flex items-center gap-2 font-bold">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>Your Own Produce Listing</span>
                  </div>
                  <p className="text-[11px] text-rose-700">
                    You cannot purchase your own crop listing. Use 'Manage Listing' to update stock or price.
                  </p>
                </div>
              ) : null}

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={loading || !!successMsg || !isAuthenticated || isOwner}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm rounded-xl transition shadow-xs disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Processing Order...
                  </>
                ) : successMsg ? (
                  'Order Submitted Successfully'
                ) : !isAuthenticated ? (
                  'Sign In to Place Order'
                ) : isOwner ? (
                  'Cannot Purchase Own Listing'
                ) : (
                  <>
                    <span>Confirm Purchase Order</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default BuyCropModal;
