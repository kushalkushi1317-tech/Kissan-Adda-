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
  Star,
  BookOpen
} from 'lucide-react';
import { useRouter } from '../context/RouterContext';
import { useLanguage } from '../context/LanguageContext';
import { usePriceData } from '../context/PriceDataContext';
import { useTheme } from '../context/ThemeContext';
import { ThemeSelector } from './ThemeSelector';
import { WatchlistModal } from './WatchlistModal';
import { Language } from '../types';

export const Header: React.FC = () => {
  const { path, navigate } = useRouter();
  const { language, setLanguage, t, availableLanguages } = useLanguage();
  const { unit, setUnit, watchlist } = usePriceData();
  const { isDark } = useTheme();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [watchlistModalOpen, setWatchlistModalOpen] = useState(false);

  const totalWatchlistCount = watchlist.cropIds.length + watchlist.mandiIds.length;

  const navItems = [
    { label: t('navHome', 'Home'), path: '/' },
    { label: t('navPrices', 'Crop Prices'), path: '/prices' },
    { label: t('navDirectory', 'Crop Directory'), path: '/directory' },
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
    <>
      <header 
        className="sticky top-0 z-40 border-b shadow-xs transition-colors"
        style={{ backgroundColor: 'var(--theme-header-bg)', borderColor: 'var(--theme-border)' }}
      >
        {/* Top Announcement Bar */}
        <div 
          style={{ backgroundColor: 'var(--theme-primary, #14532D)', color: 'var(--theme-primary-text, #FFFFFF)' }} 
          className="text-xs py-1.5 px-4 hidden md:block transition-colors duration-300"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-medium tracking-wide">
                {t('mainTagline', "Know Today's Price. Sell at the Right Price.")}
              </span>
              <span className="opacity-40" aria-hidden="true">|</span>
              <span className="opacity-90 hidden lg:inline text-[11px]">
                {t('secondaryTagline', 'Your Trusted Partner for Smart Farming and Better Crop Prices.')}
              </span>
            </div>

            <div className="flex items-center gap-4 text-[11px]">
              <a 
                href="tel:18001801551" 
                className="flex items-center gap-1.5 hover:opacity-100 transition-opacity"
              >
                <PhoneCall className="w-3 h-3 text-amber-300" />
                <span>Kisan Helpline: <strong>1800-180-1551</strong></span>
              </a>
              <span className="opacity-40" aria-hidden="true">•</span>
              <span className="opacity-90">12 Regional Languages Supported</span>
            </div>
          </div>
        </div>

        {/* Main Navbar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-18 gap-3 sm:gap-4">
            {/* Brand Logo */}
            <button 
              onClick={() => handleNavClick('/')}
              className="flex items-center gap-2.5 sm:gap-3 group text-left shrink-0 focus:outline-hidden cursor-pointer"
            >
              <div 
                className="w-10 sm:w-11 h-10 sm:h-11 rounded-xl text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform"
                style={{ background: 'linear-gradient(135deg, var(--theme-primary) 0%, var(--theme-secondary) 100%)' }}
              >
                <svg className="w-6 h-6 fill-current text-white" viewBox="0 0 24 24">
                  <path d="M12 2C6.5 2 2 6.5 2 12c0 3.58 1.9 6.72 4.74 8.46L12 12V2zm0 10l5.26 8.46C20.1 18.72 22 15.58 22 12c0-5.5-4.5-10-10-10v10z" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span 
                    className="text-lg sm:text-xl font-extrabold tracking-tight font-serif"
                    style={{ color: 'var(--theme-text-main)' }}
                  >
                    KISSAN ADDA
                  </span>
                </div>
                <p 
                  className="text-[10px] uppercase font-semibold tracking-wider"
                  style={{ color: 'var(--theme-text-muted)' }}
                >
                  {t('brandName', 'Kissan Adda')} · Mandi Prices
                </p>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden xl:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = path === item.path || (item.path !== '/' && path.startsWith(item.path));
                return (
                  <button
                    key={item.path}
                    onClick={() => handleNavClick(item.path)}
                    style={isActive ? { 
                      color: 'var(--theme-primary)', 
                      backgroundColor: 'var(--theme-surface-subtle)' 
                    } : {
                      color: 'var(--theme-text-muted)'
                    }}
                    className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-colors relative cursor-pointer hover:opacity-100 ${
                      isActive ? 'font-bold' : 'hover:bg-stone-500/10'
                    }`}
                  >
                    {item.label}
                    {isActive && (
                      <span 
                        className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full"
                        style={{ backgroundColor: 'var(--theme-primary)' }}
                      />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Right Controls */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              {/* Watchlist Quick Button */}
              <button
                onClick={() => setWatchlistModalOpen(true)}
                title={t('navWatchlist', 'My Watchlist')}
                className="relative p-2 rounded-lg text-stone-600 dark:text-stone-300 hover:text-amber-600 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                aria-label="Open watchlist"
              >
                <Star className="w-4 h-4 text-amber-500" />
                {totalWatchlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-500 text-stone-950 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {totalWatchlistCount}
                  </span>
                )}
              </button>

              {/* Theme & Dark Mode Controls */}
              <ThemeSelector />

              {/* Unit Toggle: Quintal vs Kg */}
              <div 
                className="hidden sm:flex items-center bg-stone-100 dark:bg-stone-800 p-0.5 rounded-lg border border-stone-200 dark:border-stone-700" 
                title={t('unitQuintalDesc')}
              >
                <button
                  onClick={() => setUnit('quintal')}
                  className={`px-2 py-1 text-xs font-semibold rounded-md transition-all ${
                    unit === 'quintal'
                      ? 'bg-[#14532D] dark:bg-emerald-600 text-white shadow-xs'
                      : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
                  }`}
                >
                  ₹/Qtl
                </button>
                <button
                  onClick={() => setUnit('kg')}
                  className={`px-2 py-1 text-xs font-semibold rounded-md transition-all ${
                    unit === 'kg'
                      ? 'bg-[#14532D] dark:bg-emerald-600 text-white shadow-xs'
                      : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
                  }`}
                >
                  ₹/Kg
                </button>
              </div>

              {/* 12-Language Selector */}
              <div className="relative flex items-center bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg px-2 py-1">
                <Languages className="w-3.5 h-3.5 text-stone-500 dark:text-stone-400 mr-1.5 shrink-0" />
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as Language)}
                  className="bg-transparent text-xs font-semibold text-stone-800 dark:text-stone-200 focus:outline-hidden cursor-pointer pr-1"
                  aria-label="Select Language"
                >
                  {Object.entries(availableLanguages).map(([code, meta]) => (
                    <option key={code} value={code} className="bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100">
                      {meta.nativeName} ({meta.code.toUpperCase()})
                    </option>
                  ))}
                </select>
              </div>

              {/* Mobile Hamburger Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="xl:hidden p-2 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg focus:outline-hidden"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Drawer Menu */}
        {mobileMenuOpen && (
          <div className="xl:hidden border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 px-4 py-4 space-y-1 shadow-lg animate-in slide-in-from-top duration-200">
            <div className="mb-3 px-3 py-2 bg-emerald-50 dark:bg-emerald-950/60 rounded-lg border border-emerald-100 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 flex items-center justify-between">
              <span className="font-semibold">{t('mainTagline', "Know Today's Price. Sell at the Right Price.")}</span>
              <button 
                onClick={() => { setWatchlistModalOpen(true); setMobileMenuOpen(false); }}
                className="text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1"
              >
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>Watchlist ({totalWatchlistCount})</span>
              </button>
            </div>

            {navItems.map((item) => {
              const isActive = path === item.path || (item.path !== '/' && path.startsWith(item.path));
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavClick(item.path)}
                  className={`w-full text-left px-3 py-2.5 text-xs font-semibold rounded-lg flex items-center justify-between ${
                    isActive 
                      ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-bold' 
                      : 'text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />}
                </button>
              );
            })}

            <div className="pt-3 border-t border-stone-100 dark:border-stone-800 mt-2 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 px-2">
              <span>Helpline: 1800-180-1551</span>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setUnit('quintal')}
                  className={`px-2 py-0.5 rounded text-[11px] ${unit === 'quintal' ? 'bg-emerald-700 text-white' : 'bg-stone-100 dark:bg-stone-800'}`}
                >
                  ₹/Qtl
                </button>
                <button 
                  onClick={() => setUnit('kg')}
                  className={`px-2 py-0.5 rounded text-[11px] ${unit === 'kg' ? 'bg-emerald-700 text-white' : 'bg-stone-100 dark:bg-stone-800'}`}
                >
                  ₹/Kg
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Watchlist Modal */}
      <WatchlistModal 
        isOpen={watchlistModalOpen} 
        onClose={() => setWatchlistModalOpen(false)} 
      />
    </>
  );
};
