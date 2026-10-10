import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  RotateCcw, 
  Download, 
  ArrowUpDown, 
  ChevronLeft, 
  ChevronRight, 
  ExternalLink,
  MapPin,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Sparkles,
  Calendar,
  Layers,
  Star,
  Check
} from 'lucide-react';
import { useRouter } from '../context/RouterContext';
import { useLanguage } from '../context/LanguageContext';
import { usePriceData } from '../context/PriceDataContext';
import { VoiceSearchButton } from '../components/VoiceSearchButton';
import { CROP_CATEGORIES } from '../data/mockData';
import { MarketPriceRecord } from '../types';

export const PricesPage: React.FC = () => {
  const { navigate } = useRouter();
  const { t, language, getCropLocalizedName } = useLanguage();
  const { 
    records, 
    crops, 
    unit, 
    setUnit, 
    formatPrice, 
    unitLabel,
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
    selectedCategoryFilter,
    setSelectedCategoryFilter,
    resetAllFilters,
    isCropInWatchlist,
    toggleCropWatchlist,
    recordCropView,
  } = usePriceData();

  // Sorting
  const [sortBy, setSortBy] = useState<'modalPrice' | 'cropName' | 'mandiName' | 'marketDate' | 'priceChange'>('modalPrice');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  // Suggestions
  const [showSuggestions, setShowSuggestions] = useState(false);

  const availableDistricts = selectedStateFilter ? getDistricts(selectedStateFilter) : [];
  const availableMandis = selectedDistrictFilter ? getMandis(selectedDistrictFilter) : [];

  // Filtered dataset
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      // Search
      if (globalSearch.trim()) {
        const q = globalSearch.toLowerCase().trim();
        const matchesName = r.cropName.toLowerCase().includes(q) ||
          r.hindiName.toLowerCase().includes(q) ||
          r.teluguName.toLowerCase().includes(q) ||
          r.mandiName.toLowerCase().includes(q);
        
        // Also check regional aliases from crop definition
        const matchedCrop = crops.find(c => c.id === r.cropId);
        const matchesRegional = matchedCrop?.regionalNames && Object.values(matchedCrop.regionalNames).some(
          v => v && v.toLowerCase().includes(q)
        );

        if (!matchesName && !matchesRegional) return false;
      }

      // Category
      if (selectedCategoryFilter && selectedCategoryFilter !== 'All') {
        if (r.category !== selectedCategoryFilter) return false;
      }

      // State
      if (selectedStateFilter) {
        if (r.state.toLowerCase() !== selectedStateFilter.toLowerCase()) return false;
      }

      // District
      if (selectedDistrictFilter) {
        if (r.district.toLowerCase() !== selectedDistrictFilter.toLowerCase()) return false;
      }

      // Mandi
      if (selectedMandiFilter) {
        if (r.mandiName.toLowerCase() !== selectedMandiFilter.toLowerCase()) return false;
      }

      return true;
    });
  }, [
    records, 
    crops,
    globalSearch, 
    selectedCategoryFilter, 
    selectedStateFilter, 
    selectedDistrictFilter, 
    selectedMandiFilter
  ]);

  // Sorted dataset
  const sortedRecords = useMemo(() => {
    return [...filteredRecords].sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'modalPrice') {
        comparison = a.modalPrice - b.modalPrice;
      } else if (sortBy === 'cropName') {
        comparison = a.cropName.localeCompare(b.cropName);
      } else if (sortBy === 'mandiName') {
        comparison = a.mandiName.localeCompare(b.mandiName);
      } else if (sortBy === 'marketDate') {
        comparison = a.marketDate.localeCompare(b.marketDate);
      } else if (sortBy === 'priceChange') {
        comparison = a.priceChange - b.priceChange;
      }
      return sortDirection === 'desc' ? -comparison : comparison;
    });
  }, [filteredRecords, sortBy, sortDirection]);

  // Pagination slice
  const totalRecords = sortedRecords.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedRecords.slice(start, start + pageSize);
  }, [sortedRecords, currentPage, pageSize]);

  const handleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortDirection('desc');
    }
    setCurrentPage(1);
  };

  const exportToCSV = () => {
    const headers = [
      'Crop Name',
      'Hindi Name',
      'Category',
      'State',
      'District',
      'Mandi Name',
      `Min Price (${unitLabel})`,
      `Max Price (${unitLabel})`,
      `Modal Price (${unitLabel})`,
      'Unit',
      'Market Date',
      'Last Updated',
      'Data Source',
    ];

    const rows = sortedRecords.map(r => [
      `"${r.cropName}"`,
      `"${r.hindiName}"`,
      `"${r.category}"`,
      `"${r.state}"`,
      `"${r.district}"`,
      `"${r.mandiName}"`,
      unit === 'kg' ? (r.minPrice / 100).toFixed(2) : r.minPrice,
      unit === 'kg' ? (r.maxPrice / 100).toFixed(2) : r.maxPrice,
      unit === 'kg' ? (r.modalPrice / 100).toFixed(2) : r.modalPrice,
      unit === 'kg' ? '₹/kg' : '₹/quintal',
      `"${r.marketDate}"`,
      `"${r.lastUpdated}"`,
      `"${r.dataSource}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `kissan_adda_mandi_prices_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRowClick = (cropId: string) => {
    recordCropView(cropId);
    navigate(`/crops/${cropId}`);
  };

  // Search auto-complete suggestions
  const searchSuggestions = useMemo(() => {
    if (!globalSearch.trim()) return [];
    const q = globalSearch.toLowerCase().trim();
    return crops
      .filter(c => c.name.toLowerCase().includes(q) || c.hindiName.includes(q))
      .map(c => c.name)
      .slice(0, 5);
  }, [globalSearch, crops]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Page Title & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#14532D] dark:text-emerald-400">
            <MapPin className="w-3.5 h-3.5" />
            <span>APMC Mandi Price Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-white tracking-tight mt-1 font-serif">
            {t('navPrices', 'Crop Prices & Market Rates')}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
            Compare minimum, maximum, and modal wholesale rates across licensed APMC mandis.
          </p>
        </div>

        {/* Top actions: Unit switch & CSV export */}
        <div className="flex items-center gap-3">
          {/* Unit Toggle */}
          <div className="flex items-center bg-stone-100 dark:bg-stone-800 p-0.5 rounded-lg border border-stone-300 dark:border-stone-700">
            <button
              onClick={() => setUnit('quintal')}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                unit === 'quintal'
                  ? 'bg-[#14532D] dark:bg-emerald-600 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              ₹/Quintal
            </button>
            <button
              onClick={() => setUnit('kg')}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                unit === 'kg'
                  ? 'bg-[#14532D] dark:bg-emerald-600 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              ₹/Kg
            </button>
          </div>

          {/* Export CSV button */}
          <button
            onClick={exportToCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 text-xs font-semibold rounded-lg shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Panel */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200/90 dark:border-stone-800 p-4 sm:p-5 shadow-xs space-y-4">
        {/* Top search with Voice Search */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 flex items-center">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={globalSearch}
              onChange={(e) => {
                setGlobalSearch(e.target.value);
                setShowSuggestions(true);
                setCurrentPage(1);
              }}
              onFocus={() => setShowSuggestions(true)}
              placeholder={t('searchCropPlaceholder', 'Search crops e.g. Tomato, Onion, Wheat, Rice...')}
              className="w-full pl-10 pr-20 py-2.5 text-xs sm:text-sm bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl focus:bg-white dark:focus:bg-stone-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-[#22A447] focus:outline-hidden text-stone-900 dark:text-white"
            />
            
            <div className="absolute right-2 flex items-center gap-1">
              {globalSearch && (
                <button
                  onClick={() => {
                    setGlobalSearch('');
                    setShowSuggestions(false);
                    setCurrentPage(1);
                  }}
                  className="text-xs text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 font-medium px-1.5 py-1"
                >
                  Clear
                </button>
              )}
              <VoiceSearchButton onSearchResult={(val) => { setGlobalSearch(val); setCurrentPage(1); }} />
            </div>

            {/* Suggestions dropdown */}
            {showSuggestions && searchSuggestions.length > 0 && (
              <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl shadow-lg py-1">
                {searchSuggestions.map((sug) => (
                  <button
                    key={sug}
                    type="button"
                    onClick={() => {
                      setGlobalSearch(sug);
                      setShowSuggestions(false);
                      setCurrentPage(1);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-stone-800 dark:text-stone-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 font-medium"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                resetAllFilters();
                setCurrentPage(1);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t('resetFilters', 'Reset Filters')}</span>
            </button>
          </div>
        </div>

        {/* Cascading State -> District -> Mandi Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-stone-100 dark:border-stone-800">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1">
              {t('thState', 'State')}
            </label>
            <select
              value={selectedStateFilter}
              onChange={(e) => {
                setSelectedStateFilter(e.target.value);
                setSelectedDistrictFilter('');
                setSelectedMandiFilter('');
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-[#22A447] focus:outline-hidden text-stone-800 dark:text-stone-200"
            >
              <option value="">{t('selectState', 'All States')}</option>
              {statesList.map(st => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1">
              {t('thDistrict', 'District')}
            </label>
            <select
              value={selectedDistrictFilter}
              disabled={!selectedStateFilter && availableDistricts.length === 0}
              onChange={(e) => {
                setSelectedDistrictFilter(e.target.value);
                setSelectedMandiFilter('');
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-[#22A447] focus:outline-hidden text-stone-800 dark:text-stone-200 disabled:opacity-50"
            >
              <option value="">{t('selectDistrict', 'All Districts')}</option>
              {availableDistricts.map(dt => (
                <option key={dt} value={dt}>{dt}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1">
              {t('thMandiName', 'Mandi')}
            </label>
            <select
              value={selectedMandiFilter}
              disabled={!selectedDistrictFilter && availableMandis.length === 0}
              onChange={(e) => {
                setSelectedMandiFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-[#22A447] focus:outline-hidden text-stone-800 dark:text-stone-200 disabled:opacity-50"
            >
              <option value="">{t('selectMandi', 'All Mandis')}</option>
              {availableMandis.map(md => (
                <option key={md} value={md}>{md}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Filter Tabs (All 8 categories) */}
        <div className="pt-2 border-t border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1">
            <button
              onClick={() => { setSelectedCategoryFilter('All'); setCurrentPage(1); }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
                selectedCategoryFilter === 'All'
                  ? 'bg-[#14532D] dark:bg-emerald-600 text-white shadow-xs'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
              }`}
            >
              {t('allCategories', 'All Categories')}
            </button>
            {CROP_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => { setSelectedCategoryFilter(cat); setCurrentPage(1); }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
                  selectedCategoryFilter === cat
                    ? 'bg-[#14532D] dark:bg-emerald-600 text-white shadow-xs'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Header: Count and Sort */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-stone-600 dark:text-stone-400 px-1">
        <div>
          Showing <strong>{totalRecords}</strong> {t('recordsFound', 'market records found')}
          {unit === 'kg' && <span className="ml-2 text-emerald-800 dark:text-emerald-400 font-semibold">(Displaying in ₹/kg)</span>}
        </div>

        <div className="flex items-center gap-3">
          <label className="text-stone-500 dark:text-stone-400">Sort by:</label>
          <select
            value={`${sortBy}-${sortDirection}`}
            onChange={(e) => {
              const [f, d] = e.target.value.split('-');
              setSortBy(f as any);
              setSortDirection(d as any);
              setCurrentPage(1);
            }}
            className="bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-md px-2 py-1 text-xs font-medium focus:outline-hidden text-stone-800 dark:text-stone-200"
          >
            <option value="modalPrice-desc">Modal Price: High to Low</option>
            <option value="modalPrice-asc">Modal Price: Low to High</option>
            <option value="cropName-asc">Crop Name: A to Z</option>
            <option value="mandiName-asc">Mandi Name: A to Z</option>
            <option value="priceChange-desc">Highest Price Gain</option>
          </select>
        </div>
      </div>

      {/* Main Table (Desktop / Tablet) */}
      <div className="hidden md:block bg-white dark:bg-stone-900 rounded-2xl border border-stone-200/90 dark:border-stone-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-stone-50 dark:bg-stone-800/60 border-b border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300 font-bold uppercase tracking-wider">
                <th className="py-3.5 px-3 w-8">★</th>
                <th 
                  onClick={() => handleSort('cropName')}
                  className="py-3.5 px-4 cursor-pointer hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>{t('thCropName', 'Crop Name')}</span>
                    <ArrowUpDown className="w-3 h-3 text-stone-400" />
                  </div>
                </th>
                <th className="py-3.5 px-3">{t('thCategory', 'Category')}</th>
                <th className="py-3.5 px-3">{t('thState', 'State')}</th>
                <th className="py-3.5 px-3">{t('thDistrict', 'District')}</th>
                <th 
                  onClick={() => handleSort('mandiName')}
                  className="py-3.5 px-3 cursor-pointer hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>{t('thMandiName', 'Mandi')}</span>
                    <ArrowUpDown className="w-3 h-3 text-stone-400" />
                  </div>
                </th>
                <th className="py-3.5 px-3 text-right">{t('thMinPrice', 'Min Price')}</th>
                <th className="py-3.5 px-3 text-right">{t('thMaxPrice', 'Max Price')}</th>
                <th 
                  onClick={() => handleSort('modalPrice')}
                  className="py-3.5 px-4 text-right cursor-pointer hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors text-emerald-800 dark:text-emerald-400 font-extrabold"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>{t('thModalPrice', 'Modal Price')}</span>
                    <ArrowUpDown className="w-3 h-3 text-emerald-700" />
                  </div>
                </th>
                <th className="py-3.5 px-3 text-center">{t('thUnit', 'Unit')}</th>
                <th 
                  onClick={() => handleSort('priceChange')}
                  className="py-3.5 px-3 text-right cursor-pointer hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>{t('thPriceChange', 'Change')}</span>
                    <ArrowUpDown className="w-3 h-3 text-stone-400" />
                  </div>
                </th>
                <th className="py-3.5 px-3 text-stone-500 dark:text-stone-400">{t('thMarketDate', 'Date')}</th>
                <th className="py-3.5 px-4 text-center">{t('thActions', 'Action')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {paginatedRecords.length > 0 ? (
                paginatedRecords.map((r) => {
                  const isStarred = isCropInWatchlist(r.cropId);
                  return (
                    <tr key={r.id} className="hover:bg-emerald-50/40 dark:hover:bg-emerald-950/30 transition-colors">
                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() => toggleCropWatchlist(r.cropId)}
                          className="text-stone-300 hover:text-amber-500 transition-colors"
                          title="Star crop"
                        >
                          <Star className={`w-3.5 h-3.5 ${isStarred ? 'fill-amber-400 text-amber-400' : ''}`} />
                        </button>
                      </td>
                      <td className="py-3 px-4 font-bold text-stone-900 dark:text-white">
                        <button
                          onClick={() => handleRowClick(r.cropId)}
                          className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors text-left font-bold"
                        >
                          {r.cropName}
                          <span className="block text-[11px] font-normal text-stone-500 dark:text-stone-400">
                            {r.variety} · {r.qualityGrade}
                          </span>
                        </button>
                      </td>
                      <td className="py-3 px-3 text-stone-600 dark:text-stone-400 text-[11px]">
                        {r.category}
                      </td>
                      <td className="py-3 px-3 text-stone-700 dark:text-stone-300">
                        {r.state}
                      </td>
                      <td className="py-3 px-3 text-stone-600 dark:text-stone-400">
                        {r.district}
                      </td>
                      <td className="py-3 px-3 font-semibold text-stone-800 dark:text-stone-200">
                        <button
                          onClick={() => navigate(`/markets/${r.mandiId}`)}
                          className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors text-left"
                        >
                          {r.mandiName}
                        </button>
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-stone-600 dark:text-stone-300">
                        {formatPrice(r.minPrice)}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-stone-600 dark:text-stone-300">
                        {formatPrice(r.maxPrice)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-extrabold text-[#14532D] dark:text-emerald-400 text-sm">
                        {formatPrice(r.modalPrice)}
                      </td>
                      <td className="py-3 px-3 text-center text-[11px] text-stone-500 dark:text-stone-400 font-mono">
                        {unit === 'kg' ? 'kg' : 'qtl'}
                      </td>
                      <td className="py-3 px-3 text-right font-medium">
                        <span className={`inline-flex items-center gap-0.5 text-xs font-bold ${
                          r.priceChange > 0 
                            ? 'text-emerald-700 dark:text-emerald-400' 
                            : r.priceChange < 0 
                            ? 'text-red-600 dark:text-red-400' 
                            : 'text-stone-500'
                        }`}>
                          {r.priceChange > 0 ? (
                            <>
                              <ArrowUpRight className="w-3.5 h-3.5" />
                              <span>+₹{r.priceChange}</span>
                            </>
                          ) : r.priceChange < 0 ? (
                            <>
                              <TrendingDown className="w-3.5 h-3.5" />
                              <span>-₹{Math.abs(r.priceChange)}</span>
                            </>
                          ) : (
                            <span>₹0</span>
                          )}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-[11px] text-stone-500 dark:text-stone-400 whitespace-nowrap">
                        {r.marketDate}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleRowClick(r.cropId)}
                          className="px-2.5 py-1 text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-200 dark:border-emerald-800"
                        >
                          {t('thDetails', 'Details')}
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={13} className="py-12 text-center text-stone-500 dark:text-stone-400 text-sm">
                    {t('noRecordsFound', 'No market price records found matching your filters.')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {paginatedRecords.length > 0 ? (
          paginatedRecords.map((r) => {
            const isStarred = isCropInWatchlist(r.cropId);
            return (
              <div 
                key={r.id} 
                className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-4 shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-2">
                    <button
                      onClick={() => toggleCropWatchlist(r.cropId)}
                      className="text-stone-300 hover:text-amber-500 mt-0.5"
                    >
                      <Star className={`w-4 h-4 ${isStarred ? 'fill-amber-400 text-amber-400' : ''}`} />
                    </button>
                    <div>
                      <button
                        onClick={() => handleRowClick(r.cropId)}
                        className="font-bold text-base text-stone-900 dark:text-white hover:text-emerald-700 text-left"
                      >
                        {r.cropName}
                      </button>
                      <p className="text-xs text-stone-500 dark:text-stone-400">
                        {r.variety} · {r.category}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-extrabold text-base font-mono text-[#14532D] dark:text-emerald-400">
                      {formatPrice(r.modalPrice)}
                    </div>
                    <span className={`inline-flex items-center gap-0.5 text-[11px] font-bold ${
                      r.priceChange >= 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      {r.priceChange >= 0 ? `+₹${r.priceChange}` : `-₹${Math.abs(r.priceChange)}`}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs border-t border-b border-stone-100 dark:border-stone-800 py-2.5">
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase font-bold">Mandi Yard</span>
                    <span className="font-medium text-stone-800 dark:text-stone-200">{r.mandiName}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase font-bold">Location</span>
                    <span className="text-stone-700 dark:text-stone-300">{r.district}, {r.state}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase font-bold">Price Range</span>
                    <span className="font-mono text-stone-700 dark:text-stone-300">{formatPrice(r.minPrice)} – {formatPrice(r.maxPrice)}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase font-bold">Date</span>
                    <span className="text-stone-600 dark:text-stone-400">{r.marketDate}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-stone-400">
                    {r.dataSource}
                  </span>
                  <button
                    onClick={() => handleRowClick(r.cropId)}
                    className="px-3 py-1.5 bg-[#14532D] dark:bg-emerald-600 text-white text-xs font-semibold rounded-lg"
                  >
                    View Details
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-8 text-center text-stone-500 text-sm">
            {t('noRecordsFound', 'No market price records found matching your filters.')}
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-stone-200 dark:border-stone-800">
          <div className="text-xs text-stone-500 dark:text-stone-400">
            Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong> ({totalRecords} total items)
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 text-xs font-semibold bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg hover:bg-stone-50 dark:hover:bg-stone-700 disabled:opacity-40"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>{t('prevPage', 'Previous')}</span>
            </button>

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 text-xs font-semibold bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg hover:bg-stone-50 dark:hover:bg-stone-700 disabled:opacity-40 flex items-center gap-1"
            >
              <span>{t('nextPage', 'Next')}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
