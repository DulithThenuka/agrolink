import React, { useState, useEffect } from 'react';
import { logisticsAPI } from '../services/api';
import { Truck, MapPin, Package, Navigation, DollarSign, CheckCircle2, Clock, Loader2, ArrowRight, RefreshCw, ShieldCheck } from 'lucide-react';

export const Logistics = () => {
  const [availableJobs, setAvailableJobs] = useState([]);
  const [myJobs, setMyJobs] = useState([]);
  const [activeTab, setActiveTab] = useState('available'); // 'available' | 'active'
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [msg, setMsg] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [availRes, myJobsRes] = await Promise.all([
        logisticsAPI.getAvailableDeliveries({ page: 0, size: 50 }),
        logisticsAPI.getMyJobs({ page: 0, size: 50 }),
      ]);

      if (availRes && availRes.data) {
        setAvailableJobs(availRes.data.content || []);
      }
      if (myJobsRes && myJobsRes.data) {
        setMyJobs(myJobsRes.data.content || []);
      }
    } catch (err) {
      console.error('Failed to load logistics data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAcceptDelivery = async (orderId) => {
    setActionLoading(orderId);
    setMsg('');
    try {
      const res = await logisticsAPI.acceptDelivery(orderId);
      if (res && (res.success || res.data)) {
        setMsg('✅ Delivery accepted successfully! Check "My Active Deliveries".');
        fetchData();
        setActiveTab('active');
      }
    } catch (err) {
      setMsg(`❌ Error: ${err}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleUpdateStatus = async (orderId, nextStatus, customNotes) => {
    setActionLoading(orderId);
    setMsg('');
    try {
      const res = await logisticsAPI.updateStatus(orderId, {
        status: nextStatus,
        notes: customNotes,
      });
      if (res && (res.success || res.data)) {
        setMsg(`✅ Delivery updated to: ${nextStatus}`);
        fetchData();
      }
    } catch (err) {
      setMsg(`❌ Update failed: ${err}`);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 flex items-center pr-10 pointer-events-none">
          <Truck className="w-80 h-80 text-emerald-400" />
        </div>

        <div className="relative z-10 space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <Truck className="w-3.5 h-3.5" /> Smart Logistics & Delivery Fleet
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-display">
            Driver & Logistics Dispatch 🚚
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed font-medium">
            Connect directly with local agricultural producers and buyers. Accept crop dispatches, track active transit routes, and collect instant payouts upon verified delivery.
          </p>

          <div className="pt-2 flex items-center gap-4">
            <button
              onClick={() => setActiveTab('available')}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 ${
                activeTab === 'available'
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                  : 'bg-white/10 text-slate-300 hover:bg-white/20'
              }`}
            >
              <Package className="w-4 h-4" /> Available Jobs ({availableJobs.length})
            </button>

            <button
              onClick={() => setActiveTab('active')}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 ${
                activeTab === 'active'
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                  : 'bg-white/10 text-slate-300 hover:bg-white/20'
              }`}
            >
              <Truck className="w-4 h-4" /> My Active Deliveries ({myJobs.length})
            </button>

            <button
              onClick={fetchData}
              className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-slate-300 transition"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {msg && (
        <div className={`p-4 rounded-2xl border font-bold text-xs ${msg.startsWith('✅') ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
          {msg}
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400 space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
          <p className="text-sm font-semibold">Scanning available logistics dispatches...</p>
        </div>
      ) : activeTab === 'available' ? (
        /* AVAILABLE JOBS POOL */
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900 font-display flex items-center gap-2">
                Available Transport Requests
              </h2>
              <p className="text-slate-500 text-xs font-medium">Orders accepted by farmers waiting for driver pickup</p>
            </div>
            <span className="text-xs font-bold bg-slate-100 text-slate-600 px-3 py-1 rounded-full">
              {availableJobs.length} Ready for Pickup
            </span>
          </div>

          {availableJobs.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 p-8 space-y-4 shadow-sm">
              <div className="text-4xl">🚚</div>
              <h3 className="text-lg font-bold text-slate-800 font-display">No Available Deliveries Right Now</h3>
              <p className="text-slate-500 text-sm max-w-md mx-auto">
                When farmers accept incoming crop orders, delivery dispatches will appear here instantly for logistics providers to accept.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {availableJobs.map((job) => (
                <div key={job.id} className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition space-y-5 flex flex-col justify-between">
                  {/* Job Card Top */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                      <div>
                        <span className="text-[10px] uppercase tracking-widest font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                          Order #{job.id}
                        </span>
                        <h3 className="text-lg font-extrabold text-slate-900 font-display mt-1">
                          {job.cropName || 'Crop Cargo'}
                        </h3>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-semibold text-slate-400 block">Driver Reward</span>
                        <span className="text-xl font-black text-emerald-600 font-display">
                          Rs. {job.logisticsFee ? Number(job.logisticsFee).toLocaleString() : '4,800'}
                        </span>
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                        <span className="text-slate-400 font-bold uppercase text-[10px] flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600" /> Pickup Location
                        </span>
                        <p className="font-extrabold text-slate-800 text-sm">
                          {job.pickupLocation || 'Homagama'}
                        </p>
                        <p className="text-[11px] text-slate-500 font-medium">Farmer: {job.farmerName || 'Local Farmer'}</p>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                        <span className="text-slate-400 font-bold uppercase text-[10px] flex items-center gap-1">
                          <Navigation className="w-3.5 h-3.5 text-emerald-600" /> Delivery Target
                        </span>
                        <p className="font-extrabold text-slate-800 text-sm">
                          {job.deliveryLocation || 'Colombo'}
                        </p>
                        <p className="text-[11px] text-slate-500 font-medium">Buyer: {job.buyerName || 'Verified Buyer'}</p>
                      </div>
                    </div>

                    {/* Cargo & Distance */}
                    <div className="flex items-center justify-between p-3.5 bg-emerald-50/50 rounded-2xl border border-emerald-100 text-xs font-semibold text-slate-700">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-emerald-600" />
                        <span>Cargo: <strong>{job.quantity}kg {job.cropName}</strong></span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-500 font-bold">
                        <Navigation className="w-3.5 h-3.5 text-slate-400" />
                        <span>Distance: <strong>{job.distanceKm || 31}km</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Accept Button */}
                  <button
                    onClick={() => handleAcceptDelivery(job.id)}
                    disabled={actionLoading === job.id}
                    className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-emerald-500/20 transition flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {actionLoading === job.id ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <span>[Accept Delivery]</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* MY ACTIVE DELIVERIES */
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900 font-display flex items-center gap-2">
                My Assigned & Active Jobs
              </h2>
              <p className="text-slate-500 text-xs font-medium">Manage order pickup, live tracking updates, and delivery fulfillment</p>
            </div>
            <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
              {myJobs.length} Total Assigned
            </span>
          </div>

          {myJobs.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 p-8 space-y-4 shadow-sm">
              <div className="text-4xl">📋</div>
              <h3 className="text-lg font-bold text-slate-800 font-display">No Active Jobs Assigned</h3>
              <p className="text-slate-500 text-sm">Switch to "Available Jobs" to claim delivery jobs across Sri Lanka.</p>
              <button
                onClick={() => setActiveTab('available')}
                className="px-6 py-3 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md"
              >
                Browse Available Jobs
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {myJobs.map((job) => (
                <div key={job.id} className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-6">
                  {/* Job Header */}
                  <div className="flex flex-wrap justify-between items-start gap-4 border-b border-slate-100 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-slate-900 font-display">Order #{job.id}</span>
                        <span className="px-3 py-0.5 rounded-full text-[11px] font-black uppercase bg-emerald-100 text-emerald-800">
                          {job.status}
                        </span>
                      </div>
                      <h3 className="text-xl font-extrabold text-slate-900 font-display mt-1">
                        {job.cropName} ({job.quantity}kg)
                      </h3>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-semibold text-slate-400 block">Payment Fee</span>
                      <span className="text-2xl font-black text-emerald-600 font-display">
                        Rs. {job.logisticsFee ? Number(job.logisticsFee).toLocaleString() : '4,800'}
                      </span>
                    </div>
                  </div>

                  {/* Route Bar */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs font-semibold">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                        📍
                      </div>
                      <div>
                        <span className="text-slate-400 uppercase text-[10px] font-extrabold block">Pickup</span>
                        <span className="text-slate-900 font-bold">{job.pickupLocation || 'Homagama'}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                        🏁
                      </div>
                      <div>
                        <span className="text-slate-400 uppercase text-[10px] font-extrabold block">Delivery</span>
                        <span className="text-slate-900 font-bold">{job.deliveryLocation || 'Colombo'}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                        📏
                      </div>
                      <div>
                        <span className="text-slate-400 uppercase text-[10px] font-extrabold block">Distance</span>
                        <span className="text-slate-900 font-bold">{job.distanceKm || 31} km</span>
                      </div>
                    </div>
                  </div>

                  {/* Live Status & Tracking Note */}
                  <div className="p-4 bg-emerald-50/70 border border-emerald-200/60 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-emerald-600" /> Live Tracking Status:
                      </span>
                      <span className="text-[11px] font-extrabold uppercase bg-emerald-200/60 px-2.5 py-0.5 rounded-md">
                        {job.statusLabel || job.status}
                      </span>
                    </div>
                    <p className="text-xs text-emerald-800 font-medium italic">
                      "{job.trackingNotes || 'Driver assigned and preparing for route.'}"
                    </p>
                  </div>

                  {/* Action Controls */}
                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    {job.status === 'DRIVER_ASSIGNED' && (
                      <button
                        onClick={() => handleUpdateStatus(job.id, 'COLLECTED', 'Crop collected at Homagama pickup location.')}
                        disabled={actionLoading === job.id}
                        className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center gap-2"
                      >
                        {actionLoading === job.id ? <Loader2 className="w-4 h-4 animate-spin" /> : '1. Mark Crop Collected'}
                      </button>
                    )}

                    {(job.status === 'DRIVER_ASSIGNED' || job.status === 'COLLECTED') && (
                      <button
                        onClick={() => handleUpdateStatus(job.id, 'IN_TRANSIT', 'Live tracking active: En route on High Level Road towards Colombo.')}
                        disabled={actionLoading === job.id}
                        className="px-5 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center gap-2"
                      >
                        {actionLoading === job.id ? <Loader2 className="w-4 h-4 animate-spin" /> : '2. Activate Live Tracking'}
                      </button>
                    )}

                    {(job.status === 'COLLECTED' || job.status === 'IN_TRANSIT') && (
                      <button
                        onClick={() => handleUpdateStatus(job.id, 'DELIVERED', 'Cargo delivered safely to buyer destination. Awaiting buyer confirmation.')}
                        disabled={actionLoading === job.id}
                        className="px-5 py-3 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center gap-2"
                      >
                        {actionLoading === job.id ? <Loader2 className="w-4 h-4 animate-spin" /> : '3. Mark Delivered to Buyer'}
                      </button>
                    )}

                    {(job.status === 'DELIVERED' || job.status === 'CONFIRMED' || job.status === 'PAID') && (
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-100/80 px-4 py-3 rounded-xl border border-emerald-200">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Fulfillment Completed! {job.status === 'PAID' ? 'Farmer paid.' : 'Awaiting buyer confirmation.'}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
