import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  TrendingUp, 
  Scale, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Store,
  ChevronRight,
  TrendingDown,
  ArrowUpRight,
  Clock,
  Wheat,
  BookOpen,
  Star,
  Eye
} from 'lucide-react';
import { useRouter } from '../context/RouterContext';
import { useLanguage } from '../context/LanguageContext';
import { usePriceData } from '../context/PriceDataContext';
import { useTheme } from '../context/ThemeContext';
import { AnimatedCropBackground } from '../components/AnimatedCropBackground';
import { VoiceSearchButton } from '../components/VoiceSearchButton';
import { CROP_CATEGORIES } from '../data/mockData';

export const HomePage: React.FC = () => {
  const { navigate } = useRouter();
  const { t, language, getCropLocalizedName } = useLanguage();
  const { isDark } = useTheme();
  const { 
    records, 
    crops, 
    mandis,
    formatPrice, 
    unit, 
    statesList, 
    getDistricts, 
    getMandis,
    globalSearch,
    setGlobalSearch,
    selectedStateFilter,
    setSelectedStateFilter,
    selectedDistrictFilter,
    setSelectedDistrictFilter,
    selectedMandiFilter,
    setSelectedMandiFilter,
    setSelectedCategoryFilter,
    watchlist,
    toggleCropWatchlist,
    isCropInWatchlist,
    recentlyViewedIds,
    recordCropView,
  } = usePriceData();

  // Local state for hero cascading selects
  const [heroSearch, setHeroSearch] = useState('');
  const [heroState, setHeroState] = useState('');
  const [heroDistrict, setHeroDistrict] = useState('');
  const [heroMandi, setHeroMandi] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const availableDistricts = heroState ? getDistricts(heroState) : [];
  const availableMandis = heroDistrict ? getMandis(heroDistrict) : [];

  const handleSearchChange = (val: string) => {
    setHeroSearch(val);
    if (val.trim().length > 0) {
      const q = val.toLowerCase().trim();
      const matches = crops
        .filter(c => {
          const matchEn = c.name.toLowerCase().includes(q);
          const matchHi = c.hindiName.toLowerCase().includes(q);
          const matchTe = c.teluguName.toLowerCase().includes(q);
          const matchReg = c.regionalNames && Object.values(c.regionalNames).some(
            v => v && v.toLowerCase().includes(q)
          );
          return matchEn || matchHi || matchTe || matchReg;
        })
        .map(c => c.name);
      setSuggestions(matches);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleHeroSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (heroSearch) setGlobalSearch(heroSearch);
    if (heroState) setSelectedStateFilter(heroState);
    if (heroDistrict) setSelectedDistrictFilter(heroDistrict);
    if (heroMandi) setSelectedMandiFilter(heroMandi);
    navigate('/prices');
  };

  const handleCropClick = (cropId: string) => {
    recordCropView(cropId);
    navigate(`/crops/${cropId}`);
  };

  const topPrices = [...records].sort((a, b) => b.modalPrice - a.modalPrice).slice(0, 6);
  const featuredRecords = records.slice(0, 8);

  const recentlyViewedCrops = crops.filter(c => recentlyViewedIds.includes(c.id)).slice(0, 6);

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section with Animated Agricultural Background */}
      <section 
        className="relative overflow-hidden text-white pt-16 pb-24 px-4 sm:px-6 transition-all duration-500"
        style={{ background: 'linear-gradient(180deg, var(--theme-hero-from, #14532D) 0%, var(--theme-hero-via, #166534) 50%, var(--theme-hero-to, #14532D) 100%)' }}
      >
        {/* Animated Floating Crop Illustrations along the perimeter */}
        <AnimatedCropBackground />

        {/* Subtle patterned mesh */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto z-10">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-10">
            {/* Tagline Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 dark:bg-black/30 backdrop-blur-md text-emerald-200 text-xs font-semibold border border-white/15 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
              <span>{t('mainTagline', "Know Today's Price. Sell at the Right Price.")}</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight font-serif leading-tight text-white drop-shadow-sm">
              Welcome to Kissan Adda
            </h1>

            {/* Animated Subtitle */}
            <p className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-yellow-200 via-emerald-200 to-lime-300 bg-clip-text text-transparent">
              {t('animatedHeroSubtitle', 'Fresh Prices. Smart Farming. Better Future.')}
            </p>

            {/* Supporting Description */}
            <p className="text-xs sm:text-base text-emerald-100/90 max-w-2xl mx-auto font-normal leading-relaxed">
              {t('heroDescription', "Discover today's agricultural market prices, compare mandis, track crop trends, and make informed selling decisions.")}
            </p>
          </div>

          {/* Hero Interactive Search & Cascading Filter Box */}
          <div className="max-w-4xl mx-auto bg-white dark:bg-stone-900 rounded-2xl shadow-2xl p-4 sm:p-7 text-stone-900 dark:text-white border border-stone-200/80 dark:border-stone-800">
            <form onSubmit={handleHeroSubmit} className="space-y-4">
              {/* Primary Search Bar with Voice Search */}
              <div className="relative">
                <div className="relative flex items-center">
                  <Search className="w-5 h-5 text-stone-400 absolute left-4 pointer-events-none" />
                  <input
                    type="text"
                    value={heroSearch}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    onFocus={() => heroSearch.trim() && setShowSuggestions(true)}
                    placeholder={t('searchCropPlaceholder', 'Search crops e.g. Tomato, Onion, Wheat, Rice...')}
                    className="w-full pl-12 pr-20 py-3.5 text-sm sm:text-base bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl focus:bg-white dark:focus:bg-stone-900 focus:ring-2 focus:ring-emerald-500/30 focus:border-[#22A447] focus:outline-hidden transition-all text-stone-900 dark:text-white placeholder:text-stone-400 font-medium"
                  />
                  
                  {/* Voice Search & Clear Controls */}
                  <div className="absolute right-3 flex items-center gap-1">
                    {heroSearch && (
                      <button
                        type="button"
                        onClick={() => { setHeroSearch(''); setSuggestions([]); setShowSuggestions(false); }}
                        className="text-xs text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 font-medium px-1.5 py-1"
                      >
                        Clear
                      </button>
                    )}
                    <VoiceSearchButton onSearchResult={(val) => handleSearchChange(val)} />
                  </div>
                </div>

                {/* Autocomplete dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute z-30 left-0 right-0 mt-1 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl shadow-xl overflow-hidden py-1 max-h-60 overflow-y-auto">
                    {suggestions.map((sug) => (
                      <button
                        key={sug}
                        type="button"
                        onClick={() => {
                          setHeroSearch(sug);
                          setShowSuggestions(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-stone-800 dark:text-stone-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 hover:text-[#14532D] font-medium flex items-center justify-between"
                      >
                        <span>{sug}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Cascading Selectors: State -> District -> Mandi */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* State */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1">
                    {t('thState', 'State')}
                  </label>
                  <select
                    value={heroState}
                    onChange={(e) => {
                      setHeroState(e.target.value);
                      setHeroDistrict('');
                      setHeroMandi('');
                    }}
                    className="w-full px-3 py-2.5 text-xs sm:text-sm bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-[#22A447] focus:outline-hidden text-stone-800 dark:text-stone-200 font-medium"
                  >
                    <option value="">{t('selectState', 'All States')}</option>
                    {statesList.map(st => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>

                {/* District */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1">
                    {t('thDistrict', 'District')}
                  </label>
                  <select
                    value={heroDistrict}
                    disabled={!heroState && availableDistricts.length === 0}
                    onChange={(e) => {
                      setHeroDistrict(e.target.value);
                      setHeroMandi('');
                    }}
                    className="w-full px-3 py-2.5 text-xs sm:text-sm bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-[#22A447] focus:outline-hidden text-stone-800 dark:text-stone-200 font-medium disabled:opacity-50"
                  >
                    <option value="">{t('selectDistrict', 'All Districts')}</option>
                    {availableDistricts.map(dt => (
                      <option key={dt} value={dt}>{dt}</option>
                    ))}
                  </select>
                </div>

                {/* Mandi */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1">
                    {t('thMandiName', 'Mandi')}
                  </label>
                  <select
                    value={heroMandi}
                    disabled={!heroDistrict && availableMandis.length === 0}
                    onChange={(e) => setHeroMandi(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs sm:text-sm bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-[#22A447] focus:outline-hidden text-stone-800 dark:text-stone-200 font-medium disabled:opacity-50"
                  >
                    <option value="">{t('selectMandi', 'All Mandis')}</option>
                    {availableMandis.map(md => (
                      <option key={md} value={md}>{md}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Action Buttons: Search, Compare, Browse Crops */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <div className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-1.5 self-start sm:self-center">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Verified APMC yards across 28 States & UTs</span>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
                  {/* Browse Crops button */}
                  <button
                    type="button"
                    onClick={() => navigate('/directory')}
                    className="flex-1 sm:flex-initial px-3.5 py-2.5 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs sm:text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5 border border-stone-200 dark:border-stone-700"
                  >
                    <BookOpen className="w-4 h-4 text-emerald-600" />
                    <span>{t('browseCropsBtn', 'Browse Crops')}</span>
                  </button>

                  {/* Compare Markets button */}
                  <button
                    type="button"
                    onClick={() => navigate('/compare')}
                    className="flex-1 sm:flex-initial px-3.5 py-2.5 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs sm:text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5 border border-stone-200 dark:border-stone-700"
                  >
                    <Scale className="w-4 h-4 text-emerald-600" />
                    <span>{t('compareMarketsBtn', 'Compare Markets')}</span>
                  </button>

                  {/* Search Prices primary button */}
                  <button
                    type="submit"
                    style={{ backgroundColor: 'var(--theme-primary, #14532D)' }}
                    className="flex-1 sm:flex-initial px-5 py-2.5 text-white hover:brightness-110 text-xs sm:text-sm font-bold rounded-xl transition-all shadow-md shadow-black/20 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Search className="w-4 h-4" />
                    <span>{t('searchPricesBtn', 'Search Prices')}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Quick Price Ticker Bar */}
          <div className="mt-8 max-w-5xl mx-auto overflow-x-auto custom-scrollbar pb-2">
            <div className="flex items-center gap-3 whitespace-nowrap min-w-max">
              <span className="text-xs uppercase tracking-wider font-bold text-yellow-300 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                Live Ticker:
              </span>
              {records.slice(0, 8).map((rec) => (
                <button
                  key={rec.id}
                  onClick={() => handleCropClick(rec.cropId)}
                  className="bg-white/10 dark:bg-black/30 hover:bg-white/15 px-3 py-1 rounded-lg text-xs backdrop-blur-md flex items-center gap-2 transition-colors border border-white/10 text-left"
                >
                  <span className="font-semibold text-white">
                    {rec.cropName}
                  </span>
                  <span className="text-emerald-200 font-mono font-bold">
                    {formatPrice(rec.modalPrice)}
                  </span>
                  <span className={`text-[10px] font-bold ${rec.priceChange >= 0 ? 'text-lime-300' : 'text-red-300'}`}>
                    {rec.priceChange >= 0 ? `+₹${rec.priceChange}` : `-₹${Math.abs(rec.priceChange)}`}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-16">
        {/* Recently Viewed Crops (If user viewed any) */}
        {recentlyViewedCrops.length > 0 && (
          <section className="bg-emerald-50/60 dark:bg-stone-900/60 p-4 sm:p-5 rounded-2xl border border-emerald-100 dark:border-stone-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" />
                <span>{t('recentlyViewed', 'Recently Viewed Crops')}</span>
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {recentlyViewedCrops.map((c) => (
                <button
                  key={c.id}
                  onClick={() => handleCropClick(c.id)}
                  className="bg-white dark:bg-stone-800 p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 hover:border-emerald-500 text-left transition-all flex items-center gap-2.5 shadow-xs"
                >
                  <img src={c.imageUrl} alt={c.name} className="w-8 h-8 rounded-lg object-cover shrink-0" />
                  <div className="truncate">
                    <span className="font-bold text-xs text-stone-900 dark:text-white block truncate">
                      {getCropLocalizedName(c)}
                    </span>
                    <span className="text-[10px] text-stone-400 block truncate">
                      {c.category}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Today's Market Prices Section */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-stone-200 dark:border-stone-800 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#14532D] dark:text-emerald-400">
                Real-Time APMC Feeds
              </span>
              <h2 className="text-2xl font-bold text-stone-900 dark:text-white tracking-tight mt-1 font-serif">
                {t('todaysMarketPrices', "Today's Market Prices")}
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
                Official APMC modal selling rates recorded across top agricultural wholesale yards.
              </p>
            </div>

            <button
              onClick={() => navigate('/prices')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#14532D] dark:text-emerald-400 hover:underline"
            >
              <span>View all {records.length} mandi records</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Desktop Table Preview & Mobile Cards */}
          <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs overflow-hidden">
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="bg-stone-50 dark:bg-stone-800/60 border-b border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300 text-xs font-bold uppercase tracking-wider">
                    <th className="py-3 px-4">{t('thCropName', 'Crop Name')}</th>
                    <th className="py-3 px-3 hidden md:table-cell">{t('thCategory', 'Category')}</th>
                    <th className="py-3 px-3">{t('thMandiName', 'Mandi')}</th>
                    <th className="py-3 px-3 hidden sm:table-cell">{t('thState', 'State')}</th>
                    <th className="py-3 px-3 text-right">{t('thMinPrice', 'Min')}</th>
                    <th className="py-3 px-3 text-right">{t('thMaxPrice', 'Max')}</th>
                    <th className="py-3 px-4 text-right font-bold text-[#14532D] dark:text-emerald-400">{t('thModalPrice', 'Modal Price')}</th>
                    <th className="py-3 px-3 text-right hidden lg:table-cell">{t('thPriceChange', 'Change')}</th>
                    <th className="py-3 px-4 text-center">{t('thActions', 'Details')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                  {featuredRecords.map((r) => {
                    const isStarred = isCropInWatchlist(r.cropId);
                    return (
                      <tr key={r.id} className="hover:bg-emerald-50/40 dark:hover:bg-emerald-950/30 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => toggleCropWatchlist(r.cropId)}
                              className="text-stone-300 hover:text-amber-500 transition-colors"
                              title="Star crop"
                            >
                              <Star className={`w-3.5 h-3.5 ${isStarred ? 'fill-amber-400 text-amber-400' : ''}`} />
                            </button>
                            <button
                              onClick={() => handleCropClick(r.cropId)}
                              className="font-bold text-stone-900 dark:text-white hover:text-emerald-700 dark:hover:text-emerald-400 text-left transition-colors"
                            >
                              {r.cropName}
                            </button>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-stone-500 dark:text-stone-400 hidden md:table-cell text-xs">
                          {r.category}
                        </td>
                        <td className="py-3 px-3 font-medium text-stone-800 dark:text-stone-200">
                          {r.mandiName}
                        </td>
                        <td className="py-3 px-3 text-stone-500 dark:text-stone-400 hidden sm:table-cell text-xs">
                          {r.district}, {r.state}
                        </td>
                        <td className="py-3 px-3 text-right text-stone-600 dark:text-stone-300 font-mono text-xs">
                          {formatPrice(r.minPrice)}
                        </td>
                        <td className="py-3 px-3 text-right text-stone-600 dark:text-stone-300 font-mono text-xs">
                          {formatPrice(r.maxPrice)}
                        </td>
                        <td className="py-3 px-4 text-right font-extrabold text-[#14532D] dark:text-emerald-400 font-mono">
                          {formatPrice(r.modalPrice)}
                        </td>
                        <td className="py-3 px-3 text-right hidden lg:table-cell">
                          <span className={`inline-flex items-center gap-0.5 font-bold text-xs ${
                            r.priceChange > 0 
                              ? 'text-emerald-700 dark:text-emerald-400' 
                              : r.priceChange < 0 
                              ? 'text-red-600 dark:text-red-400' 
                              : 'text-stone-500'
                          }`}>
                            {r.priceChange > 0 ? (
                              <>
                                <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />
                                <span>+₹{r.priceChange}</span>
                              </>
                            ) : r.priceChange < 0 ? (
                              <>
                                <TrendingDown className="w-3.5 h-3.5 text-red-600" />
                                <span>-₹{Math.abs(r.priceChange)}</span>
                              </>
                            ) : (
                              <span>₹0</span>
                            )}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => handleCropClick(r.cropId)}
                            className="px-2.5 py-1 text-xs font-semibold text-emerald-800 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 rounded-lg transition-colors border border-emerald-200 dark:border-emerald-800"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Popular Crops Grid */}
        <section className="space-y-6">
          <div className="flex items-end justify-between border-b border-stone-200 dark:border-stone-800 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#14532D] dark:text-emerald-400">
                High Volume Commodities
              </span>
              <h2 className="text-2xl font-bold text-stone-900 dark:text-white tracking-tight mt-1 font-serif">
                {t('popularCrops', 'Popular Crops')}
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
                Staples with active daily trading volumes across national mandis.
              </p>
            </div>

            <button
              onClick={() => navigate('/directory')}
              className="text-xs font-bold text-emerald-800 dark:text-emerald-400 hover:underline inline-flex items-center gap-1"
            >
              <span>Explore All {crops.length} Crops</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {crops.slice(0, 12).map((c) => {
              const cropRecs = records.filter(r => r.cropId === c.id);
              const repPrice = cropRecs.length > 0 ? cropRecs[0].modalPrice : null;
              const isStarred = isCropInWatchlist(c.id);

              return (
                <div
                  key={c.id}
                  className="group bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 overflow-hidden text-left hover:shadow-md hover:border-emerald-400 transition-all flex flex-col justify-between"
                >
                  <div className="relative">
                    <div 
                      onClick={() => handleCropClick(c.id)}
                      className="h-28 w-full overflow-hidden bg-stone-100 dark:bg-stone-800 cursor-pointer"
                    >
                      <img
                        src={c.imageUrl}
                        alt={c.name}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <button
                      onClick={() => toggleCropWatchlist(c.id)}
                      className="absolute top-2 right-2 p-1 rounded-full bg-black/40 text-white hover:text-amber-300"
                      title="Star crop"
                    >
                      <Star className={`w-3.5 h-3.5 ${isStarred ? 'fill-amber-400 text-amber-400' : ''}`} />
                    </button>
                    <span className="absolute bottom-2 left-2 bg-stone-900/80 backdrop-blur-xs text-white text-[9px] font-semibold px-1.5 py-0.5 rounded">
                      {c.category}
                    </span>
                  </div>

                  <div className="p-3 flex-1 flex flex-col justify-between space-y-1">
                    <div 
                      onClick={() => handleCropClick(c.id)}
                      className="cursor-pointer"
                    >
                      <h4 className="font-bold text-xs sm:text-sm text-stone-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors leading-snug">
                        {getCropLocalizedName(c)}
                      </h4>
                      <p className="text-[10px] text-stone-500 dark:text-stone-400">
                        {c.name}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                      <span className="text-[10px] text-stone-400">Modal:</span>
                      <span className="font-extrabold text-xs text-emerald-800 dark:text-emerald-400 font-mono">
                        {repPrice ? formatPrice(repPrice) : 'MSP Driven'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Browse by Crop Category (All 8 Categories) */}
        <section className="space-y-6">
          <div className="border-b border-stone-200 dark:border-stone-800 pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#14532D] dark:text-emerald-400">
              Commodity Classifications
            </span>
            <h2 className="text-2xl font-bold text-stone-900 dark:text-white tracking-tight mt-1 font-serif">
              {t('browseByCategory', 'Browse by Crop Category')}
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
              Filter wholesale prices according to specific agricultural produce groups.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {CROP_CATEGORIES.map((cat) => {
              const count = crops.filter(c => c.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategoryFilter(cat);
                    navigate('/prices');
                  }}
                  className="p-4 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 text-left hover:border-emerald-500 hover:shadow-sm transition-all group"
                >
                  <Wheat className="w-5 h-5 text-emerald-700 dark:text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
                  <h4 className="font-bold text-xs sm:text-sm text-stone-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 leading-snug">
                    {cat}
                  </h4>
                  <p className="text-[10px] text-stone-400 mt-1">
                    {count} crops
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        {/* How Kissan Adda Works */}
        <section className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200/90 dark:border-stone-800 p-8 sm:p-12 shadow-xs">
          <div className="max-w-2xl mx-auto text-center space-y-2 mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-[#14532D] dark:text-emerald-400">
              Empowering Decision Making
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-white font-serif">
              {t('howItWorks', 'How Kissan Adda Works')}
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
              {t('howItWorksDesc', 'A transparent three-step path to getting the best value for your harvest.')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3 p-5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
              <div className="w-12 h-12 rounded-xl bg-[#14532D] text-white flex items-center justify-center font-bold text-lg shadow-sm">
                1
              </div>
              <h3 className="font-bold text-stone-900 dark:text-white text-base">
                {t('step1Title', '1. Check Live Mandi Rates')}
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                {t('step1Desc', 'Access daily verified prices from APMC mandis across your state and neighboring regions.')}
              </p>
            </div>

            <div className="space-y-3 p-5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
              <div className="w-12 h-12 rounded-xl bg-[#22A447] text-white flex items-center justify-center font-bold text-lg shadow-sm">
                2
              </div>
              <h3 className="font-bold text-stone-900 dark:text-white text-base">
                {t('step2Title', '2. Compare Market Spreads')}
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                {t('step2Desc', 'Find which nearby yard pays top rupee for your exact crop variety and calculate transport costs.')}
              </p>
            </div>

            <div className="space-y-3 p-5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
              <div className="w-12 h-12 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                3
              </div>
              <h3 className="font-bold text-stone-900 dark:text-white text-base">
                {t('step3Title', '3. Sell with Confidence')}
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                {t('step3Desc', 'Take your produce to the most profitable market with real pricing power in hand.')}
              </p>
            </div>
          </div>
        </section>

        {/* Benefits for Farmers */}
        <section className="bg-gradient-to-br from-[#14532D] via-[#166534] to-[#14532D] dark:from-[#061F12] dark:to-[#092B19] text-white rounded-2xl p-8 sm:p-12 shadow-lg">
          <div className="max-w-3xl space-y-3 mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-yellow-300">
              Farmer Welfare & Fair Pricing
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-serif">
              {t('benefitsForFarmers', 'Benefits for Farmers')}
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100">
              Transforming how Indian farmers interact with commission agents, traders, and agricultural markets.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/15 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-yellow-400 text-stone-950 flex items-center justify-center font-bold">
                ✓
              </div>
              <h4 className="font-bold text-sm text-white">
                {t('benefit1Title', 'Avoid Distress Selling')}
              </h4>
              <p className="text-xs text-emerald-100 leading-relaxed">
                {t('benefit1Desc', 'Know the fair modal market rate before negotiating with local middlemen or commission agents.')}
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/15 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-yellow-400 text-stone-950 flex items-center justify-center font-bold">
                ✓
              </div>
              <h4 className="font-bold text-sm text-white">
                {t('benefit2Title', 'Inter-Mandi Arbitrage')}
              </h4>
              <p className="text-xs text-emerald-100 leading-relaxed">
                {t('benefit2Desc', 'Identify price premiums in neighboring districts that more than cover travel freight.')}
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/15 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-yellow-400 text-stone-950 flex items-center justify-center font-bold">
                ✓
              </div>
              <h4 className="font-bold text-sm text-white">
                {t('benefit3Title', 'Transparent Net Returns')}
              </h4>
              <p className="text-xs text-emerald-100 leading-relaxed">
                {t('benefit3Desc', 'Use our transport cost calculator to verify exact profit after freight and handling fees.')}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
