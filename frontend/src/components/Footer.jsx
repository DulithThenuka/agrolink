import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, ShieldCheck, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto text-slate-600 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Brand Column (2 cols wide on desktop) */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-800 text-white flex items-center justify-center shadow-xs">
                <Sprout className="w-4 h-4" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                Agro<span className="text-emerald-700">Link</span>
              </span>
            </Link>
            <p className="text-sm text-slate-600 max-w-sm leading-relaxed">
              Smart agriculture platform connecting farmers, services, suppliers, and agricultural organizations across Sri Lanka.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs font-medium text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>DOA Standards &bull; Secure Escrow Settlements</span>
            </div>
          </div>

          {/* Platform Links */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Platform
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/advisor" className="hover:text-emerald-800 transition-colors">
                  AI Insights
                </Link>
              </li>
              <li>
                <Link to="/equipment-rental" className="hover:text-emerald-800 transition-colors">
                  Equipment
                </Link>
              </li>
              <li>
                <Link to="/crops" className="hover:text-emerald-800 transition-colors">
                  Marketplace
                </Link>
              </li>
              <li>
                <Link to="/community" className="hover:text-emerald-800 transition-colors">
                  Community
                </Link>
              </li>
              <li>
                <Link to="/gov-intelligence" className="hover:text-emerald-800 transition-colors">
                  Government
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Company
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/community" className="hover:text-emerald-800 transition-colors">
                  About AgroLink
                </Link>
              </li>
              <li>
                <Link to="/experts" className="hover:text-emerald-800 transition-colors">
                  Agri Experts
                </Link>
              </li>
              <li>
                <Link to="/waste-reduction" className="hover:text-emerald-800 transition-colors">
                  Waste Reduction
                </Link>
              </li>
              <li>
                <Link to="/ai-assistant" className="hover:text-emerald-800 transition-colors">
                  Support &amp; AI Help
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Legal &amp; Trust
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/contracts" className="hover:text-emerald-800 transition-colors">
                  Escrow Terms
                </Link>
              </li>
              <li>
                <span className="text-slate-500 cursor-default">
                  Privacy Policy
                </span>
              </li>
              <li>
                <span className="text-slate-500 cursor-default">
                  Terms of Service
                </span>
              </li>
              <li>
                <span className="text-slate-500 cursor-default">
                  Dispute Resolution
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} AgroLink. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600 inline" /> for sustainable agriculture
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
