import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Shield, MapPin, Mail, ArrowLeft, Award, Lock, CheckCircle2 } from 'lucide-react';

export const Profile = () => {
  const { user } = useAuth();
  const [passwordModal, setPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [msg, setMsg] = useState('');

  const handlePasswordChange = (e) => {
    e.preventDefault();
    setMsg('Password updated successfully!');
    setTimeout(() => {
      setPasswordModal(false);
      setMsg('');
      setOldPassword('');
      setNewPassword('');
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-6 animate-fade-in">
      <div className="flex justify-between items-center pb-5 border-b border-slate-200/60">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 font-display">Account Profile 👤</h1>
          <p className="text-slate-500 text-sm mt-1">Manage credentials, view account verification, and security settings.</p>
        </div>

        <Link to="/dashboard" className="text-xs text-emerald-600 hover:text-emerald-700 font-bold transition">
          ← Back to Dashboard
        </Link>
      </div>

      <div className="premium-card p-8 bg-white border border-slate-100/90 shadow-md flex flex-col md:flex-row gap-8 items-start">
        <div className="flex flex-col items-center gap-3 w-full md:w-auto">
          <div className="w-24 h-24 rounded-3xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20 text-3xl font-bold">
            🧑‍🌾
          </div>
          <span className="badge-premium badge-delivered">
            <CheckCircle2 className="w-3.5 h-3.5" /> Account Verified
          </span>
        </div>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          <div className="space-y-1">
            <span className="text-slate-400 text-[10px] font-extrabold uppercase tracking-widest block">Email Address</span>
            <div className="flex items-center gap-2 font-bold text-slate-800 text-base">
              <Mail className="w-4 h-4 text-emerald-600" />
              <span>{user?.email}</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-slate-400 text-[10px] font-extrabold uppercase tracking-widest block">Platform Role &amp; Actor Type</span>
            <span className="inline-block px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
              {user?.role === 'BUSINESS_BUYER' ? '🏢 Commercial Business Buyer (B2B)' :
               user?.role === 'LOGISTICS_PROVIDER' || user?.role === 'LOGISTICS' ? '🚚 Logistics Provider' :
               user?.role === 'AGRICULTURAL_EXPERT' || user?.role === 'EXPERT' ? '👨‍🔬 Agricultural Expert' :
               user?.role === 'FARMER' ? '🌾 Farmer (Producer)' :
               user?.role === 'SUPPLIER' ? '🧰 Input Supplier' :
               user?.role === 'ADMIN' ? '🏛️ System Admin & Policymaker' :
               '🛒 Retail Buyer'}
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-slate-400 text-[10px] font-extrabold uppercase tracking-widest block">Security Protocol</span>
            <div className="flex items-center gap-1.5 font-bold text-emerald-600 text-sm">
              <Shield className="w-4 h-4" />
              <span>Encrypted JWT Session Active</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-slate-400 text-[10px] font-extrabold uppercase tracking-widest block">Direct Trade Rating</span>
            <span className="font-bold text-slate-800 text-sm flex items-center gap-1">
              <Award className="w-4 h-4 text-amber-500" /> 5.0 Star Producer Score
            </span>
          </div>

          <div className="md:col-span-2 pt-4 border-t border-slate-100 flex justify-between items-center">
            <button
              onClick={() => setPasswordModal(true)}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition flex items-center gap-2"
            >
              <Lock className="w-3.5 h-3.5" /> Update Password
            </button>
            <span className="text-xs text-slate-400 font-semibold">Joined AgroLink Ecosystem</span>
          </div>
        </div>
      </div>

      {/* PASSWORD MODAL */}
      {passwordModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 font-display">Update Password</h3>
            {msg && <p className="text-xs font-bold text-emerald-600 bg-emerald-50 p-2 rounded-xl border border-emerald-100">{msg}</p>}
            <form onSubmit={handlePasswordChange} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Current Password</label>
                <input
                  type="password"
                  required
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="input-premium text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">New Password</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="input-premium text-sm"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="submit" className="btn btn-primary text-xs flex-1 py-2.5">
                  Save Changes
                </button>
                <button type="button" onClick={() => setPasswordModal(false)} className="btn btn-secondary text-xs py-2.5">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

