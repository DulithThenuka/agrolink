import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { expertsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { UserCheck, MessageSquare, Calendar, Image as ImageIcon, Cpu, Send, CheckCircle2, Clock, Sparkles, Loader2, Award, Stethoscope, Sprout, TestTube } from 'lucide-react';

export const ExpertModule = () => {
  const { user, isFarmer, isExpert, isAdmin } = useAuth();
  
  const [experts, setExperts] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState('');

  // Form State for Asking Question / Booking
  const [selectedSpecialty, setSelectedSpecialty] = useState('Agronomist');
  const [question, setQuestion] = useState('');
  const [farmData, setFarmData] = useState('Soil Moisture: 32%, Soil pH: 6.4, Location: Kandy');
  const [imageUrl, setImageUrl] = useState('');

  // Expert Reply State
  const [replyingId, setReplyingId] = useState(null);
  const [replyText, setReplyText] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [expRes, consRes] = await Promise.all([
        expertsAPI.getAvailable(),
        isExpert ? expertsAPI.getAllConsultations() : expertsAPI.getMyConsultations(),
      ]);

      if (expRes && expRes.data) setExperts(expRes.data);
      if (consRes && consRes.data) setConsultations(consRes.data);
    } catch (err) {
      console.error('Failed to load expert module data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isExpert]);

  const handleSubmitQuestion = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    setSubmitting(true);
    setMsg('');
    try {
      const res = await expertsAPI.submitConsultation({
        farmerEmail: user?.email || 'farmer@agrolink.com',
        farmerName: user?.email ? user.email.split('@')[0] : 'Farmer',
        expertSpecialty: selectedSpecialty,
        question,
        farmData,
        imageUrl,
      });

      if (res && res.data) {
        setMsg('✅ Your consultation inquiry has been submitted to verified agricultural experts!');
        setQuestion('');
        fetchData();
      }
    } catch (err) {
      console.error('Failed to submit question:', err);
      setMsg('❌ Failed to submit consultation. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePostReply = async (id) => {
    if (!replyText.trim()) return;

    setSubmitting(true);
    try {
      const res = await expertsAPI.replyConsultation(id, {
        reply: replyText,
        expertName: user?.email ? user.email.split('@')[0] : 'Dr. Gamini Wickramasinghe (Agronomist)',
      });

      if (res && res.data) {
        setReplyingId(null);
        setReplyText('');
        fetchData();
      }
    } catch (err) {
      console.error('Failed to post reply:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      
      {/* HEADER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 text-white p-8 md:p-10 shadow-2xl space-y-3">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-emerald-400" /> AGRICULTURAL EXPERT ADVISORY HUB
          </span>
          <span className="text-xs font-mono font-bold text-teal-200">• ROLE: {user?.role || 'FARMER'}</span>
        </div>

        <h1 className="text-3xl md:text-5xl font-black font-display tracking-tight text-white">
          Consult Verified Agricultural Officers &amp; Specialists 👨‍🔬
        </h1>
        <p className="text-slate-300 text-sm md:text-base max-w-2xl font-medium">
          Get direct agronomy, soil chemistry, veterinary, and pest diagnostics from certified agricultural officers, agronomists, soil specialists, and veterinarians.
        </p>
      </div>

      {/* VERIFIED EXPERTS DIRECTORY GRID */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-emerald-600" /> Verified Agricultural Officers &amp; Specialists
          </h2>
          <span className="text-xs font-bold text-slate-400">4 Experts Available Online</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {experts.map((exp) => (
            <div key={exp.id} className="premium-card p-5 bg-white border border-slate-100/90 shadow-md space-y-3 hover:border-emerald-200 transition">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-2xl flex items-center justify-center border border-emerald-100 shrink-0">
                  {exp.avatarUrl || '👨‍🔬'}
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">{exp.name}</h3>
                  <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    {exp.specialty}
                  </span>
                </div>
              </div>

              <div className="text-xs text-slate-500 space-y-1 font-semibold border-t border-slate-100 pt-2">
                <p className="flex justify-between">
                  <span>District: <strong>{exp.district}</strong></span>
                  <span className="text-amber-600 font-bold">★ {exp.rating}</span>
                </p>
                <p className="text-[11px] text-slate-400">{exp.consultationsCount} Consultations • {exp.availabilityStatus}</p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedSpecialty(exp.specialty);
                  window.scrollTo({ top: 400, behavior: 'smooth' });
                }}
                className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-extrabold text-xs rounded-xl border border-emerald-200 transition text-center"
              >
                Ask {exp.specialty} 💬
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* MAIN CONSULTATION HUB (ASK QUESTION FORM & HISTORY) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* INQUIRY & DATA SUBMISSION FORM */}
        <div className="lg:col-span-5 space-y-6">
          <div className="premium-card p-6 bg-white border border-slate-100 shadow-xl space-y-5">
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-emerald-600" /> Ask Question &amp; Send Farm Data
              </h3>
              <p className="text-xs text-slate-500 font-medium">Upload crop photos, soil pH readings, or book a consultation</p>
            </div>

            {msg && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                {msg}
              </div>
            )}

            <form onSubmit={handleSubmitQuestion} className="space-y-4">
              
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Select Expert Specialty
                </label>
                <select
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:border-emerald-500 transition"
                >
                  <option value="Agronomist">👨‍🔬 Agronomist (Crop Health &amp; Yield)</option>
                  <option value="Agricultural Officer">🧑‍🌾 Agricultural Officer (District Extension)</option>
                  <option value="Veterinarian">👩‍⚕️ Veterinarian (Livestock &amp; Animals)</option>
                  <option value="Soil Specialist">🔬 Soil Specialist (pH &amp; Fertilizer)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Your Question / Crop Diagnosis
                </label>
                <textarea
                  rows="3"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="e.g. How to treat early leaf yellowing on Tomato crop after heavy rain?"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-emerald-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1">
                  <Cpu className="w-3.5 h-3.5 text-emerald-600" /> Send Farm &amp; Telemetry Data
                </label>
                <input
                  type="text"
                  value={farmData}
                  onChange={(e) => setFarmData(e.target.value)}
                  placeholder="Soil Moisture: 32%, Soil pH: 6.4, Temp: 29°C"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1">
                  <ImageIcon className="w-3.5 h-3.5 text-emerald-600" /> Crop / Leaf Photo URL
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-1592417817098-8f3d6ef23a2e"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500 transition"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span>Submit Inquiry to {selectedSpecialty} 🚀</span>
              </button>

            </form>
          </div>
        </div>

        {/* CONSULTATIONS FEED & EXPERT REPLIES */}
        <div className="lg:col-span-7 space-y-6">
          <div className="premium-card p-6 bg-white border border-slate-100 shadow-xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-display">
                  {isExpert ? '📥 Open Expert Consultations Queue' : '📋 My Consultation History'}
                </h3>
                <p className="text-xs text-slate-500 font-medium">Real-time agronomy responses from verified agricultural specialists</p>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                {consultations.length} Inquiries
              </span>
            </div>

            {loading ? (
              <div className="py-12 text-center text-slate-400 space-y-2">
                <Loader2 className="w-6 h-6 animate-spin mx-auto text-emerald-600" />
                <p className="text-xs font-semibold">Loading consultation threads...</p>
              </div>
            ) : consultations.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                <p className="text-sm font-bold text-slate-700">No Consultations Recorded</p>
                <p className="text-xs text-slate-500">Ask a question to connect with agricultural officers and soil specialists.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {consultations.map((item) => (
                  <div key={item.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                    
                    {/* INQUIRY HEADER */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-extrabold text-slate-900 text-sm">{item.farmerName}</span>
                          <span className="text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                            Target: {item.expertSpecialty}
                          </span>
                        </div>
                        <p className="text-xs text-slate-700 font-bold mt-1">Q: {item.question}</p>
                      </div>

                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase shrink-0 ${
                        item.status === 'ANSWERED' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}>
                        {item.status}
                      </span>
                    </div>

                    {/* TELEMETRY & IMAGE ATTACHMENTS */}
                    {item.farmData && (
                      <div className="p-2.5 bg-white rounded-xl border border-slate-200/70 text-[11px] text-slate-600 font-mono font-bold flex items-center gap-2">
                        <Cpu className="w-3.5 h-3.5 text-emerald-600" /> {item.farmData}
                      </div>
                    )}

                    {/* EXPERT REPLY DISPLAY */}
                    {item.reply ? (
                      <div className="p-4 bg-emerald-50/90 rounded-2xl border border-emerald-200 space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-extrabold text-emerald-900 flex items-center gap-1.5">
                            👨‍🔬 {item.expertName || 'Senior Agronomist'} Response:
                          </span>
                          <span className="text-[10px] font-bold text-emerald-700">✓ Verified Diagnostic</span>
                        </div>
                        <p className="text-xs text-emerald-950 font-medium leading-relaxed">
                          {item.reply}
                        </p>
                      </div>
                    ) : (isExpert || isAdmin) ? (
                      <div className="pt-2">
                        {replyingId === item.id ? (
                          <div className="space-y-2">
                            <textarea
                              rows="2"
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder="Write your diagnostic recommendation as an Expert..."
                              className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:border-emerald-500"
                            />
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => setReplyingId(null)}
                                className="px-3 py-1 bg-slate-200 text-slate-700 font-bold text-xs rounded-lg"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handlePostReply(item.id)}
                                disabled={submitting}
                                className="px-3 py-1 bg-emerald-600 text-white font-bold text-xs rounded-lg flex items-center gap-1"
                              >
                                Send Expert Reply 👨‍🔬
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => setReplyingId(item.id)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition"
                          >
                            Reply to Farmer as Expert 👨‍🔬
                          </button>
                        )}
                      </div>
                    ) : (
                      <p className="text-[11px] text-amber-700 font-semibold italic">
                        ⏳ Awaiting response from verified {item.expertSpecialty}...
                      </p>
                    )}

                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
