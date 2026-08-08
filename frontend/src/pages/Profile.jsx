import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Shield, MapPin, Mail, ArrowLeft } from 'lucide-react';

export const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-6 animate-fade-in">
      <div className="flex justify-between items-center pb-5 border-b border-slate-200/60">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 font-display">My Profile 👤</h1>
          <p className="text-slate-500 text-sm mt-1">Manage credentials, view account status, and configure settings.</p>
        </div>

        <Link to="/dashboard" className="text-xs text-emerald-600 hover:text-emerald-700 font-bold transition">
          ← Back to Dashboard
        </Link>
      </div>

      <div className="premium-card p-8 bg-white border border-slate-100 flex flex-col md:flex-row gap-8 items-start">
        <div className="flex justify-center w-full md:w-auto">
          <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 shadow-inner border border-emerald-200/50">
            <User className="w-10 h-10" />
          </div>
        </div>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          <div className="space-y-1">
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block">Email Address</span>
            <div className="flex items-center gap-2 font-bold text-slate-800 text-base">
              <Mail className="w-4 h-4 text-emerald-600" />
              <span>{user?.email}</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block">Platform Role</span>
            <span className="inline-block px-3.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
              {user?.role || 'BUYER'}
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block">Security Flag</span>
            <div className="flex items-center gap-1.5 font-bold text-emerald-600 text-sm">
              <Shield className="w-4 h-4" />
              <span>JWT Authenticated Session</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block">Account Status</span>
            <span className="font-bold text-emerald-600 text-sm">Active &amp; Verified</span>
          </div>
        </div>
      </div>
    </div>
  );
};
