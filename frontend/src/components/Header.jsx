import React from 'react';
import { Scale, Heart, Menu, X } from 'lucide-react';

const Header = ({ shortlistCount = 0, onShortlistClick, onMenuClick, isMenuOpen }) => {
  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a
            href="/"
            className="flex items-center gap-2 group"
            aria-label="LegalConnect Home"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-legal-navy rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
              <Scale className="text-white" size={22} />
            </div>
            <div className="hidden sm:block">
              <span className="font-display text-xl font-bold text-legal-navy">
                Legal<span className="text-primary-600">Connect</span>
              </span>
              <p className="text-xs text-slate-500 -mt-1">Find Your Legal Expert</p>
            </div>
          </a>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <a
              href="#browse"
              className="text-slate-600 hover:text-primary-600 font-medium transition-colors"
            >
              Browse Lawyers
            </a>
            <a
              href="#map"
              className="text-slate-600 hover:text-primary-600 font-medium transition-colors"
            >
              Map View
            </a>
            <a
              href="#about"
              className="text-slate-600 hover:text-primary-600 font-medium transition-colors"
            >
              How It Works
            </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Shortlist Button */}
            <button
              onClick={onShortlistClick}
              className="relative flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-700 rounded-full font-medium hover:bg-primary-100 transition-colors"
              aria-label={`View shortlist (${shortlistCount} lawyers)`}
            >
              <Heart size={18} fill={shortlistCount > 0 ? 'currentColor' : 'none'} />
              <span className="hidden sm:inline">Shortlist</span>
              {shortlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {shortlistCount > 9 ? '9+' : shortlistCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={onMenuClick}
              className="md:hidden p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white animate-slide-down">
          <nav className="flex flex-col p-4 space-y-3">
            <a
              href="#browse"
              className="px-4 py-3 text-slate-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg font-medium transition-colors"
              onClick={onMenuClick}
            >
              Browse Lawyers
            </a>
            <a
              href="#map"
              className="px-4 py-3 text-slate-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg font-medium transition-colors"
              onClick={onMenuClick}
            >
              Map View
            </a>
            <a
              href="#about"
              className="px-4 py-3 text-slate-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg font-medium transition-colors"
              onClick={onMenuClick}
            >
              How It Works
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;

