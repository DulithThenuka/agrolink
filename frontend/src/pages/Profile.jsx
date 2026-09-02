import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Shield, MapPin, Mail, ArrowLeft, Award, Lock, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { farmersAPI, buyersAPI, authAPI } from '../services/api';

export const Profile = () => {
  const { user, isFarmer, isBuyer } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [passwordModal, setPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  const roleEmoji =
    user?.role === 'BUSINESS_BUYER' ? '🏢' :
    user?.role === 'LOGISTICS_PROVIDER' || user?.role === 'LOGISTICS' ? '🚚' :
    user?.role === 'AGRICULTURAL_EXPERT' || user?.role === 'EXPERT' ? '👨‍🔬' :
    user?.role === 'FARMER' ? '🧑‍🌾' :
    user?.role === 'SUPPLIER' ? '🧰' :
    user?.role === 'ADMIN' ? '🏛️' :
    '🛒';

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      try {
        if (isFarmer) {
          const res = await farmersAPI.getProfile(user.id || 1);
          if (res && res.data) setProfileData(res.data);
        } else if (isBuyer) {
          const res = await buyersAPI.getProfile(user.id || 1);
          if (res && res.data) setProfileData(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch detailed profile:', err);
      }
    };
    fetchProfile();
  }, [user, isFarmer, isBuyer]);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setMsg('');

    if (newPassword.length < 6) {
      setErrorMsg('New password must be at least 6 characters long.');
      return;
    }

    setSavingPassword(true);
    try {
      await authAPI.changePassword({ oldPassword, newPassword });
      setMsg('🎉 Password updated successfully!');
      setTimeout(() => {
        setPasswordModal(false);
        setMsg('');
        setErrorMsg('');
        setOldPassword('');
        setNewPassword('');
      }, 1500);
    } catch (err) {
      setErrorMsg(typeof err === 'string' ? err : 'Failed to update password. Please check your current password.');
    } finally {
      setSavingPassword(false);
    }
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
          <div className="w-24 h-24 rounded-3xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20 text-4xl font-bold">
            {roleEmoji}
          </div>
          <span className="badge-premium badge-delivered">
            <CheckCircle2 className="w-3.5 h-3.5" /> Account Verified
          </span>
        </div>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          <div className="space-y-1">
            <span className="text-slate-400 text-[10px] font-extrabold uppercase tracking-widest block">Full Name</span>
            <div className="flex items-center gap-2 font-bold text-slate-900 text-base">
              <User className="w-4 h-4 text-emerald-600" />
              <span>{user?.name || (user?.email ? user.email.split('@')[0] : 'Member')}</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-slate-400 text-[10px] font-extrabold uppercase tracking-widest block">Email Address</span>
            <div className="flex items-center gap-2 font-bold text-slate-800 text-base">
              <Mail className="w-4 h-4 text-emerald-600" />
              <span>{user?.email}</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-slate-400 text-[10px] font-extrabold uppercase tracking-widest block">Registered Location / Region</span>
            <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>{user?.location || 'Sri Lanka'}</span>
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
              onClick={() => {
                setPasswordModal(true);
                setErrorMsg('');
                setMsg('');
              }}
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
          <div className="glass bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 animate-fade-in">
            <h3 className="text-lg font-bold text-slate-900 font-display">Update Password</h3>

            {msg && (
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                <span>{msg}</span>
              </div>
            )}

            {errorMsg && (
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Current Password</label>
                <input
                  type="password"
                  required
                  placeholder="Enter current password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="input-premium text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">New Password (min 6 chars)</label>
                <input
                  type="password"
                  required
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="input-premium text-sm"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={savingPassword}
                  className="btn btn-primary text-xs flex-1 py-2.5 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {savingPassword ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPasswordModal(false);
                    setErrorMsg('');
                    setMsg('');
                  }}
                  className="btn btn-secondary text-xs py-2.5"
                >
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

