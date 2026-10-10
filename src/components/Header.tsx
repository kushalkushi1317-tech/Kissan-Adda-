import React, { useState } from 'react';
import { 
  Sprout, 
  Menu, 
  X, 
  TrendingUp, 
  Scale, 
  Store, 
  Languages, 
  Search,
  ShieldCheck,
  PhoneCall,
  Info
} from 'lucide-react';
import { useRouter } from '../context/RouterContext';
import { useLanguage } from '../context/LanguageContext';
import { usePriceData } from '../context/PriceDataContext';
import { Language } from '../types';

export const Header: React.FC = () => {
  const { path, navigate } = useRouter();
  const { language, setLanguage, t } = useLanguage();
  const { unit, setUnit } = usePriceData();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: t('navHome', 'Home'), path: '/' },
    { label: t('navPrices', 'Crop Prices'), path: '/prices' },
    { label: t('navCompare', 'Compare Markets'), path: '/compare' },
    { label: t('navTrends', 'Price Trends'), path: '/trends' },
    { label: t('navMarkets', 'Market Directory'), path: '/markets' },
    { label: t('navAbout', 'About'), path: '/about' },
    { label: t('navContact', 'Contact'), path: '/contact' },
    { label: t('navAdmin', 'Admin'), path: '/admin' },
  ];

  const handleNavClick = (targetPath: string) => {
    navigate(targetPath);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-stone-200/90 shadow-xs">
      {/* Top microbar */}
      <div className="bg-[#176B35] text-white text-xs py-1.5 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-medium tracking-wide">
              {t('mainTagline', "Know Today's Price. Sell at the Right Price.")}
            </span>
            <span className="text-emerald-300/60" aria-hidden="true">|</span>
            <span className="text-emerald-100/90 hidden lg:inline text-[11px]">
              {t('secondaryTagline', 'Your Trusted Partner for Smart Farming and Better Crop Prices.')}
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <a 
              href="tel:18001801551" 
              className="flex items-center gap-1.5 text-emerald-100 hover:text-white transition-colors"
            >
              <PhoneCall className="w-3 h-3 text-amber-300" />
              <span>Kisan Helpline: <strong>1800-180-1551</strong></span>
            </a>
            <span className="text-emerald-400/60" aria-hidden="true">•</span>
            <span className="text-emerald-200">APMC Live Mandi Network</span>
          </div>
        </div>
      </div>

      {/* Main navigation bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-18 gap-4">
          {/* Brand Logo */}
          <button 
            onClick={() => handleNavClick('/')}
            className="flex items-center gap-3 group text-left shrink-0 focus:outline-hidden"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#176B35] to-[#2E8B45] text-white flex items-center justify-center shadow-md shadow-emerald-950/10 group-hover:scale-105 transition-transform">
              {/* Wheat / Leaf sprout graphic */}
              <svg 
                className="w-6 h-6 fill-current text-emerald-100" 
                viewBox="0 0 24 24"
              >
                <path d="M12 2C6.5 2 2 6.5 2 12c0 3.58 1.9 6.72 4.74 8.46L12 12V2zm0 10l5.26 8.46C20.1 18.72 22 15.58 22 12c0-5.5-4.5-10-10-10v10z" />
                <path d="M12 8c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" opacity="0.3" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight text-[#176B35] font-serif">
                  KISSAN ADDA
                </span>
              </div>
              <p className="text-[10px] uppercase font-semibold tracking-wider text-stone-500">
                {t('brandName', 'Kissan Adda')} · Mandi Prices
              </p>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = path === item.path || (item.path !== '/' && path.startsWith(item.path));
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavClick(item.path)}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors relative ${
                    isActive 
                      ? 'text-[#176B35] font-semibold bg-emerald-50/70' 
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#2E8B45] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Controls: Unit switch & Language Selector */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Unit Toggle: Quintal vs Kg */}
            <div className="flex items-center bg-stone-100 p-0.5 rounded-lg border border-stone-200" title={t('unitQuintalDesc')}>
              <button
                onClick={() => setUnit('quintal')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                  unit === 'quintal'
                    ? 'bg-[#176B35] text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                ₹/Qtl
              </button>
              <button
                onClick={() => setUnit('kg')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                  unit === 'kg'
                    ? 'bg-[#176B35] text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                ₹/Kg
              </button>
            </div>

            {/* Language Selector */}
            <div className="relative flex items-center bg-stone-50 border border-stone-200 rounded-lg px-2 py-1">
              <Languages className="w-3.5 h-3.5 text-stone-500 mr-1.5 shrink-0" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="bg-transparent text-xs font-semibold text-stone-800 focus:outline-hidden cursor-pointer pr-1"
                aria-label="Select Language"
              >
                <option value="en">English (EN)</option>
                <option value="hi">हिन्दी (HI)</option>
                <option value="te">తెలుగు (TE)</option>
              </select>
            </div>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg focus:outline-hidden"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 bg-white px-4 py-4 space-y-1 shadow-lg animate-in slide-in-from-top duration-200">
          <div className="mb-3 px-2 py-2 bg-emerald-50/70 rounded-lg border border-emerald-100 text-xs text-emerald-900">
            <span className="font-semibold">{t('mainTagline', "Know Today's Price. Sell at the Right Price.")}</span>
          </div>

          {navItems.map((item) => {
            const isActive = path === item.path || (item.path !== '/' && path.startsWith(item.path));
            return (
              <button
                key={item.path}
                onClick={() => handleNavClick(item.path)}
                className={`w-full text-left px-3 py-2.5 text-sm font-medium rounded-lg flex items-center justify-between ${
                  isActive 
                    ? 'bg-emerald-50 text-[#176B35] font-semibold' 
                    : 'text-stone-700 hover:bg-stone-50'
                }`}
              >
                <span>{item.label}</span>
                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#176B35]" />}
              </button>
            );
          })}

          <div className="pt-3 border-t border-stone-100 mt-2 flex items-center justify-between text-xs text-stone-500 px-2">
            <span>Helpline: 1800-180-1551</span>
            <span>Unit: {unit === 'quintal' ? '₹/Quintal' : '₹/Kg'}</span>
          </div>
        </div>
      )}
    </header>
  );
};
