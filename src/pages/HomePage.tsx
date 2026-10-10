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
  Wheat
} from 'lucide-react';
import { useRouter } from '../context/RouterContext';
import { useLanguage } from '../context/LanguageContext';
import { usePriceData } from '../context/PriceDataContext';
import { CROP_CATEGORIES } from '../data/mockData';

export const HomePage: React.FC = () => {
  const { navigate } = useRouter();
  const { t, language } = useLanguage();
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
      const q = val.toLowerCase();
      const matches = crops
        .filter(c => 
          c.name.toLowerCase().includes(q) || 
          c.hindiName.includes(q) || 
          c.teluguName.includes(q)
        )
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

  const handleCompareClick = () => {
    navigate('/compare');
  };

  // Top gainers or top available rates today
  const topPrices = [...records].sort((a, b) => b.modalPrice - a.modalPrice).slice(0, 6);
  const featuredRecords = records.slice(0, 8);

  const getCropDisplayName = (cropId: string, fallback: string) => {
    const c = crops.find(item => item.id === cropId);
    if (!c) return fallback;
    if (language === 'hi') return c.hindiName;
    if (language === 'te') return c.teluguName;
    return c.name;
  };

  return (
    <div className="space-y-14 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#176B35]/95 to-[#176B35] text-white pt-12 pb-20 px-4 sm:px-6">
        {/* Subtle patterned overlay */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs text-emerald-200 text-xs font-semibold border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{t('mainTagline', "Know Today's Price. Sell at the Right Price.")}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-serif leading-tight">
              Welcome to Kissan Adda
            </h1>

            <p className="text-base sm:text-xl text-emerald-100 font-normal leading-relaxed">
              {t('heroSubtitle', 'Find the Right Market. Compare Crop Prices. Make Better Decisions.')}
            </p>
          </div>

          {/* Hero Interactive Search & Cascading Filter Box */}
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-4 sm:p-6 text-stone-900 border border-stone-200/80">
            <form onSubmit={handleHeroSubmit} className="space-y-4">
              {/* Primary Search Bar with Suggestions */}
              <div className="relative">
                <div className="relative flex items-center">
                  <Search className="w-5 h-5 text-stone-400 absolute left-4 pointer-events-none" />
                  <input
                    type="text"
                    value={heroSearch}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    onFocus={() => heroSearch.trim() && setShowSuggestions(true)}
                    placeholder={t('searchCropPlaceholder', 'Search crops e.g. Tomato, Onion, Wheat...')}
                    className="w-full pl-12 pr-4 py-3.5 text-sm sm:text-base bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/30 focus:border-[#2E8B45] focus:outline-hidden transition-all text-stone-900 placeholder:text-stone-400 font-medium"
                  />
                  {heroSearch && (
                    <button
                      type="button"
                      onClick={() => { setHeroSearch(''); setSuggestions([]); setShowSuggestions(false); }}
                      className="absolute right-4 text-xs text-stone-400 hover:text-stone-700 font-medium px-2 py-1 rounded"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Autocomplete dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute z-30 left-0 right-0 mt-1 bg-white border border-stone-200 rounded-xl shadow-lg overflow-hidden py-1">
                    {suggestions.map((sug) => (
                      <button
                        key={sug}
                        type="button"
                        onClick={() => {
                          setHeroSearch(sug);
                          setShowSuggestions(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-stone-800 hover:bg-emerald-50 hover:text-[#176B35] font-medium flex items-center justify-between"
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
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                    {t('thState', 'State')}
                  </label>
                  <select
                    value={heroState}
                    onChange={(e) => {
                      setHeroState(e.target.value);
                      setHeroDistrict('');
                      setHeroMandi('');
                    }}
                    className="w-full px-3 py-2.5 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-[#2E8B45] focus:outline-hidden text-stone-800 font-medium"
                  >
                    <option value="">{t('selectState', 'All States')}</option>
                    {statesList.map(st => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>

                {/* District */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                    {t('thDistrict', 'District')}
                  </label>
                  <select
                    value={heroDistrict}
                    disabled={!heroState && availableDistricts.length === 0}
                    onChange={(e) => {
                      setHeroDistrict(e.target.value);
                      setHeroMandi('');
                    }}
                    className="w-full px-3 py-2.5 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-[#2E8B45] focus:outline-hidden text-stone-800 font-medium disabled:opacity-50 disabled:bg-stone-100"
                  >
                    <option value="">{t('selectDistrict', 'All Districts')}</option>
                    {availableDistricts.map(dt => (
                      <option key={dt} value={dt}>{dt}</option>
                    ))}
                  </select>
                </div>

                {/* Mandi */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                    {t('thMandiName', 'Mandi')}
                  </label>
                  <select
                    value={heroMandi}
                    disabled={!heroDistrict && availableMandis.length === 0}
                    onChange={(e) => setHeroMandi(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-[#2E8B45] focus:outline-hidden text-stone-800 font-medium disabled:opacity-50 disabled:bg-stone-100"
                  >
                    <option value="">{t('selectMandi', 'All Mandis')}</option>
                    {availableMandis.map(md => (
                      <option key={md} value={md}>{md}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <div className="text-xs text-stone-500 flex items-center gap-1.5 self-start sm:self-center">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Verified mandi yards across India</span>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleCompareClick}
                    className="flex-1 sm:flex-initial px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs sm:text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5 border border-stone-200"
                  >
                    <Scale className="w-4 h-4 text-emerald-700" />
                    <span>{t('compareMarketsBtn', 'Compare Markets')}</span>
                  </button>

                  <button
                    type="submit"
                    className="flex-1 sm:flex-initial px-6 py-2.5 bg-[#176B35] hover:bg-[#12572a] text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-md shadow-emerald-950/20 flex items-center justify-center gap-2"
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
              <span className="text-xs uppercase tracking-wider font-bold text-amber-300 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                Live Ticker:
              </span>
              {records.slice(0, 6).map((rec) => (
                <button
                  key={rec.id}
                  onClick={() => navigate(`/crops/${rec.cropId}`)}
                  className="bg-white/10 hover:bg-white/15 px-3 py-1 rounded-lg text-xs backdrop-blur-xs flex items-center gap-2 transition-colors border border-white/10 text-left"
                >
                  <span className="font-semibold text-white">
                    {getCropDisplayName(rec.cropId, rec.cropName)}
                  </span>
                  <span className="text-emerald-200 font-mono">
                    {formatPrice(rec.modalPrice)}
                  </span>
                  <span className={`text-[10px] font-bold ${rec.priceChange >= 0 ? 'text-emerald-300' : 'text-red-300'}`}>
                    {rec.priceChange >= 0 ? `+₹${rec.priceChange}` : `-₹${Math.abs(rec.priceChange)}`}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-16">
        {/* Today's Market Prices Section */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-stone-200 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#176B35]">
                Real-Time APMC Feeds
              </span>
              <h2 className="text-2xl font-bold text-stone-900 tracking-tight mt-1">
                {t('todaysMarketPrices', "Today's Market Prices")}
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 mt-1">
                Official APMC modal selling rates recorded across top agricultural wholesale yards.
              </p>
            </div>

            <button
              onClick={() => navigate('/prices')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#176B35] hover:text-[#12572a] hover:underline"
            >
              <span>View all {records.length} mandi records</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Desktop Table Preview & Mobile Cards */}
          <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 text-xs font-bold uppercase tracking-wider">
                    <th className="py-3 px-4">{t('thCropName', 'Crop Name')}</th>
                    <th className="py-3 px-3 hidden md:table-cell">{t('thCategory', 'Category')}</th>
                    <th className="py-3 px-3">{t('thMandiName', 'Mandi')}</th>
                    <th className="py-3 px-3 hidden sm:table-cell">{t('thState', 'State')}</th>
                    <th className="py-3 px-3 text-right">{t('thMinPrice', 'Min')}</th>
                    <th className="py-3 px-3 text-right">{t('thMaxPrice', 'Max')}</th>
                    <th className="py-3 px-4 text-right font-bold text-[#176B35]">{t('thModalPrice', 'Modal Price')}</th>
                    <th className="py-3 px-3 text-right hidden lg:table-cell">{t('thPriceChange', 'Change')}</th>
                    <th className="py-3 px-4 text-center">{t('thActions', 'Details')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {featuredRecords.map((r) => (
                    <tr key={r.id} className="hover:bg-emerald-50/40 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <button
                            onClick={() => navigate(`/crops/${r.cropId}`)}
                            className="font-bold text-stone-900 hover:text-[#176B35] text-left transition-colors"
                          >
                            {getCropDisplayName(r.cropId, r.cropName)}
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-stone-500 hidden md:table-cell text-xs">
                        {r.category}
                      </td>
                      <td className="py-3 px-3 font-medium text-stone-800">
                        {r.mandiName}
                      </td>
                      <td className="py-3 px-3 text-stone-500 hidden sm:table-cell text-xs">
                        {r.district}, {r.state}
                      </td>
                      <td className="py-3 px-3 text-right text-stone-600 font-mono text-xs">
                        {formatPrice(r.minPrice)}
                      </td>
                      <td className="py-3 px-3 text-right text-stone-600 font-mono text-xs">
                        {formatPrice(r.maxPrice)}
                      </td>
                      <td className="py-3 px-4 text-right font-extrabold text-[#176B35] font-mono">
                        {formatPrice(r.modalPrice)}
                      </td>
                      <td className="py-3 px-3 text-right hidden lg:table-cell">
                        <span className={`inline-flex items-center gap-0.5 font-bold text-xs ${
                          r.priceChange > 0 
                            ? 'text-emerald-700' 
                            : r.priceChange < 0 
                            ? 'text-red-600' 
                            : 'text-stone-500'
                        }`}>
                          {r.priceChange > 0 ? `+₹${r.priceChange}` : r.priceChange < 0 ? `-₹${Math.abs(r.priceChange)}` : '₹0'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => navigate(`/crops/${r.cropId}`)}
                          className="px-2.5 py-1 text-xs font-semibold text-[#176B35] hover:bg-emerald-50 rounded-lg transition-colors border border-emerald-200"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Popular Crops Grid */}
        <section className="space-y-6">
          <div className="flex items-end justify-between border-b border-stone-200 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#176B35]">
                High Volume Commodities
              </span>
              <h2 className="text-2xl font-bold text-stone-900 tracking-tight mt-1">
                {t('popularCrops', 'Popular Crops')}
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 mt-1">
                Frequently traded staples with active price discovery and high market arrival volume.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {crops.slice(0, 6).map((c) => {
              // Find average or representative modal price
              const cropRecs = records.filter(r => r.cropId === c.id);
              const repPrice = cropRecs.length > 0 ? cropRecs[0].modalPrice : 2000;

              return (
                <button
                  key={c.id}
                  onClick={() => navigate(`/crops/${c.id}`)}
                  className="group bg-white rounded-xl border border-stone-200/90 overflow-hidden text-left hover:shadow-md hover:border-emerald-300 transition-all flex flex-col"
                >
                  <div className="h-28 w-full overflow-hidden relative bg-stone-100">
                    <img
                      src={c.imageUrl}
                      alt={c.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2 bg-stone-900/70 backdrop-blur-xs text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">
                      {c.category}
                    </div>
                  </div>

                  <div className="p-3 flex-1 flex flex-col justify-between space-y-1">
                    <div>
                      <h4 className="font-bold text-sm text-stone-900 group-hover:text-[#176B35] transition-colors leading-snug">
                        {language === 'hi' ? c.hindiName : language === 'te' ? c.teluguName : c.name}
                      </h4>
                      <p className="text-[11px] text-stone-500">
                        {c.name}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                      <span className="text-[11px] text-stone-500">Modal:</span>
                      <span className="font-extrabold text-xs text-[#176B35] font-mono">
                        {formatPrice(repPrice)}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Top Available Prices & Recent Price Movements */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Available Prices */}
          <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-stone-900">
                    {t('topAvailablePrices', 'Top Available Mandi Rates')}
                  </h3>
                  <p className="text-xs text-stone-500">Mandis offering premium values for harvest</p>
                </div>
              </div>
              <button 
                onClick={() => navigate('/prices')}
                className="text-xs text-emerald-700 font-bold hover:underline"
              >
                All
              </button>
            </div>

            <div className="space-y-3">
              {topPrices.map((rec) => (
                <div 
                  key={rec.id}
                  onClick={() => navigate(`/crops/${rec.cropId}`)}
                  className="flex items-center justify-between p-2.5 rounded-lg hover:bg-stone-50 cursor-pointer transition-colors border border-stone-100"
                >
                  <div>
                    <div className="font-bold text-xs sm:text-sm text-stone-900 flex items-center gap-2">
                      <span>{getCropDisplayName(rec.cropId, rec.cropName)}</span>
                      <span className="text-[10px] text-stone-400 font-normal">· {rec.variety}</span>
                    </div>
                    <div className="text-[11px] text-stone-500 mt-0.5">
                      {rec.mandiName} ({rec.state})
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-extrabold text-sm text-[#176B35]">
                      {formatPrice(rec.modalPrice)}
                    </div>
                    <div className="text-[10px] text-emerald-700 font-semibold">
                      Max: {formatPrice(rec.maxPrice)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Price Movements */}
          <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-stone-900">
                    {t('recentPriceTrends', 'Recent Price Movements')}
                  </h3>
                  <p className="text-xs text-stone-500">Day-over-day price adjustments</p>
                </div>
              </div>
              <button 
                onClick={() => navigate('/trends')}
                className="text-xs text-emerald-700 font-bold hover:underline"
              >
                Trends
              </button>
            </div>

            <div className="space-y-3">
              {records.slice(4, 10).map((rec) => (
                <div 
                  key={rec.id}
                  onClick={() => navigate(`/crops/${rec.cropId}`)}
                  className="flex items-center justify-between p-2.5 rounded-lg hover:bg-stone-50 cursor-pointer transition-colors border border-stone-100"
                >
                  <div>
                    <div className="font-bold text-xs sm:text-sm text-stone-900">
                      {getCropDisplayName(rec.cropId, rec.cropName)}
                    </div>
                    <div className="text-[11px] text-stone-500 mt-0.5">
                      {rec.mandiName} · {rec.marketDate}
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-3">
                    <span className="font-mono font-bold text-xs text-stone-800">
                      {formatPrice(rec.modalPrice)}
                    </span>
                    <span className={`inline-flex items-center text-xs font-bold px-2 py-0.5 rounded ${
                      rec.priceChange > 0 
                        ? 'bg-emerald-50 text-emerald-700' 
                        : rec.priceChange < 0 
                        ? 'bg-red-50 text-red-700' 
                        : 'bg-stone-100 text-stone-600'
                    }`}>
                      {rec.priceChange > 0 ? `+₹${rec.priceChange}` : rec.priceChange < 0 ? `-₹${Math.abs(rec.priceChange)}` : '₹0'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Browse by Crop Category */}
        <section className="space-y-6">
          <div className="border-b border-stone-200 pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#176B35]">
              Commodity Classifications
            </span>
            <h2 className="text-2xl font-bold text-stone-900 tracking-tight mt-1">
              {t('browseByCategory', 'Browse by Crop Category')}
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Filter wholesale prices according to specific agricultural produce groups.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {CROP_CATEGORIES.map((cat) => {
              const count = records.filter(r => r.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategoryFilter(cat);
                    navigate('/prices');
                  }}
                  className="p-4 bg-white rounded-xl border border-stone-200 text-left hover:border-emerald-500 hover:shadow-xs transition-all group"
                >
                  <Wheat className="w-5 h-5 text-emerald-700 mb-2 group-hover:scale-110 transition-transform" />
                  <h4 className="font-bold text-xs sm:text-sm text-stone-900 group-hover:text-[#176B35] leading-snug">
                    {cat}
                  </h4>
                  <p className="text-[11px] text-stone-400 mt-1">
                    {count} records
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        {/* How Kissan Adda Works */}
        <section className="bg-white rounded-2xl border border-stone-200/90 p-8 sm:p-12 shadow-xs">
          <div className="max-w-2xl mx-auto text-center space-y-2 mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-[#176B35]">
              Empowering Decision Making
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-serif">
              {t('howItWorks', 'How Kissan Adda Works')}
            </h2>
            <p className="text-xs sm:text-sm text-stone-500">
              {t('howItWorksDesc', 'A transparent three-step path to getting the best value for your harvest.')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="space-y-3 text-center md:text-left p-4 rounded-xl bg-stone-50/60 border border-stone-200/60">
              <div className="w-12 h-12 rounded-xl bg-[#176B35] text-white flex items-center justify-center font-bold text-lg shadow-sm mx-auto md:mx-0">
                1
              </div>
              <h3 className="font-bold text-stone-900 text-base">
                {t('step1Title', '1. Check Live Mandi Rates')}
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                {t('step1Desc', 'Access daily verified prices from APMC mandis across your state and neighboring regions.')}
              </p>
            </div>

            {/* Step 2 */}
            <div className="space-y-3 text-center md:text-left p-4 rounded-xl bg-stone-50/60 border border-stone-200/60">
              <div className="w-12 h-12 rounded-xl bg-[#2E8B45] text-white flex items-center justify-center font-bold text-lg shadow-sm mx-auto md:mx-0">
                2
              </div>
              <h3 className="font-bold text-stone-900 text-base">
                {t('step2Title', '2. Compare Market Spreads')}
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                {t('step2Desc', 'Find which nearby yard pays top rupee for your exact crop variety and calculate transport costs.')}
              </p>
            </div>

            {/* Step 3 */}
            <div className="space-y-3 text-center md:text-left p-4 rounded-xl bg-stone-50/60 border border-stone-200/60">
              <div className="w-12 h-12 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold text-lg shadow-sm mx-auto md:mx-0">
                3
              </div>
              <h3 className="font-bold text-stone-900 text-base">
                {t('step3Title', '3. Sell with Confidence')}
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                {t('step3Desc', 'Take your produce to the most profitable market with real pricing power in hand.')}
              </p>
            </div>
          </div>
        </section>

        {/* Benefits for Farmers */}
        <section className="bg-gradient-to-br from-emerald-900 to-[#176B35] text-white rounded-2xl p-8 sm:p-12 shadow-lg">
          <div className="max-w-3xl space-y-3 mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
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
            <div className="bg-white/10 backdrop-blur-xs rounded-xl p-5 border border-white/10 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-amber-400 text-stone-950 flex items-center justify-center font-bold">
                ✓
              </div>
              <h4 className="font-bold text-sm text-white">
                {t('benefit1Title', 'Avoid Distress Selling')}
              </h4>
              <p className="text-xs text-emerald-100 leading-relaxed">
                {t('benefit1Desc', 'Know the fair modal market rate before negotiating with local middlemen or commission agents.')}
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-xs rounded-xl p-5 border border-white/10 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-amber-400 text-stone-950 flex items-center justify-center font-bold">
                ✓
              </div>
              <h4 className="font-bold text-sm text-white">
                {t('benefit2Title', 'Inter-Mandi Arbitrage')}
              </h4>
              <p className="text-xs text-emerald-100 leading-relaxed">
                {t('benefit2Desc', 'Identify price premiums in neighboring districts that more than cover travel freight.')}
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-xs rounded-xl p-5 border border-white/10 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-amber-400 text-stone-950 flex items-center justify-center font-bold">
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
