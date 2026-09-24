import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, ShieldCheck, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto text-slate-600 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-3">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center shadow-xs">
                <Sprout className="w-4 h-4" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                Agro<span className="text-emerald-700">Link</span>
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-slate-600 max-w-sm leading-relaxed">
              Digital agriculture platform connecting farmers, commercial buyers, suppliers, and agricultural specialists across Sri Lanka.
            </p>
            <div className="pt-1 flex items-center gap-2 text-xs font-medium text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>Verified Harvests &bull; Department of Agriculture Standards</span>
            </div>
          </div>

          {/* Platform Links */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Platform
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link to="/crops" className="hover:text-emerald-700 transition-colors">
                  Crop Marketplace
                </Link>
              </li>
              <li>
                <Link to="/advisor" className="hover:text-emerald-700 transition-colors">
                  AI Crop Insights
                </Link>
              </li>
              <li>
                <Link to="/equipment-rental" className="hover:text-emerald-700 transition-colors">
                  Equipment Rental
                </Link>
              </li>
              <li>
                <Link to="/community" className="hover:text-emerald-700 transition-colors">
                  Community
                </Link>
              </li>
              <li>
                <Link to="/gov-intelligence" className="hover:text-emerald-700 transition-colors">
                  Government Intelligence
                </Link>
              </li>
            </ul>
          </div>

          {/* Ecosystem Links */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Ecosystem
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link to="/experts" className="hover:text-emerald-700 transition-colors">
                  Agricultural Experts
                </Link>
              </li>
              <li>
                <Link to="/supplier-marketplace" className="hover:text-emerald-700 transition-colors">
                  Supplier Marketplace
                </Link>
              </li>
              <li>
                <Link to="/contracts" className="hover:text-emerald-700 transition-colors">
                  Contracts
                </Link>
              </li>
              <li>
                <Link to="/waste-reduction" className="hover:text-emerald-700 transition-colors">
                  Waste Reduction
                </Link>
              </li>
              <li>
                <Link to="/ai-assistant" className="hover:text-emerald-700 transition-colors">
                  AI Assistant
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Trust */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Terms &amp; Trust
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link to="/contracts" className="hover:text-emerald-700 transition-colors">
                  Contract Terms
                </Link>
              </li>
              <li>
                <span className="text-slate-400 cursor-default">
                  Privacy Policy
                </span>
              </li>
              <li>
                <span className="text-slate-400 cursor-default">
                  Terms of Service
                </span>
              </li>
              <li>
                <span className="text-slate-400 cursor-default">
                  Dispute Guidelines
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
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
