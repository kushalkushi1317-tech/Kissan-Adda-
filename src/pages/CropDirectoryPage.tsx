import React, { useState, useMemo } from 'react';
import { 
  Wheat, 
  Search, 
  Star, 
  ArrowRight, 
  Filter, 
  Sparkles,
  ExternalLink,
  ChevronDown,
  Tag
} from 'lucide-react';
import { useRouter } from '../context/RouterContext';
import { useLanguage } from '../context/LanguageContext';
import { usePriceData } from '../context/PriceDataContext';
import { VoiceSearchButton } from '../components/VoiceSearchButton';
import { CROP_CATEGORIES } from '../data/mockData';
import { CropCategory, Crop } from '../types';

export const CropDirectoryPage: React.FC = () => {
  const { navigate } = useRouter();
  const { t, language, getCropLocalizedName } = useLanguage();
  const { 
    crops, 
    records, 
    formatPrice, 
    isCropInWatchlist, 
    toggleCropWatchlist, 
    recordCropView 
  } = usePriceData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedLetter, setSelectedLetter] = useState<string>('All');
  const [displayCount, setDisplayCount] = useState<number>(24);

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  // Filtered crops
  const filteredCrops = useMemo(() => {
    return crops.filter((c) => {
      // Category filter
      if (selectedCategory !== 'All' && c.category !== selectedCategory) {
        return false;
      }

      // Alphabet filter
      if (selectedLetter !== 'All' && !c.name.toUpperCase().startsWith(selectedLetter)) {
        return false;
      }

      // Search query (English, Hindi, Telugu, or any regional name)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesEnglish = c.name.toLowerCase().includes(q);
        const matchesHindi = c.hindiName.toLowerCase().includes(q);
        const matchesTelugu = c.teluguName.toLowerCase().includes(q);
        const matchesRegional = c.regionalNames && Object.values(c.regionalNames).some(
          val => val && val.toLowerCase().includes(q)
        );

        if (!matchesEnglish && !matchesHindi && !matchesTelugu && !matchesRegional) {
          return false;
        }
      }

      return true;
    });
  }, [crops, selectedCategory, selectedLetter, searchQuery]);

  const displayedCrops = filteredCrops.slice(0, displayCount);

  const handleCardClick = (crop: Crop) => {
    recordCropView(crop.id);
    navigate(`/crops/${crop.id}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-stone-200 dark:border-stone-800 pb-5">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
          <Wheat className="w-4 h-4" />
          <span>National Commodity Repository</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-white tracking-tight mt-1 font-serif">
          {t('navDirectory', 'Crop Directory & Market Catalog')}
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 mt-1 max-w-3xl">
          Browse our extensive catalog across Vegetables, Fruits, Grains, Pulses, Spices, Oilseeds, Commercial, and Plantation commodities with regional language names.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search with Voice */}
          <div className="relative flex-1 flex items-center">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search crop in English, हिन्दी, ಕನ್ನಡ, தமிழ், తెలుగు, বাংলা..."
              className="w-full pl-10 pr-12 py-2.5 text-xs sm:text-sm bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 text-stone-900 dark:text-white"
            />
            <div className="absolute right-2">
              <VoiceSearchButton onSearchResult={(val) => setSearchQuery(val)} />
            </div>
          </div>

          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="px-3 py-2 text-xs font-semibold text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Tabs */}
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-2">
            Categories ({CROP_CATEGORIES.length})
          </span>
          <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === 'All'
                  ? 'bg-[#14532D] dark:bg-emerald-600 text-white shadow-xs'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
              }`}
            >
              {t('allCategories', 'All Categories')} ({crops.length})
            </button>
            {CROP_CATEGORIES.map((cat) => {
              const catCount = crops.filter(c => c.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? 'bg-[#14532D] dark:bg-emerald-600 text-white shadow-xs'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
                  }`}
                >
                  {cat} ({catCount})
                </button>
              );
            })}
          </div>
        </div>

        {/* A-Z Alphabet Filter */}
        <div className="pt-2 border-t border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar pb-1 text-xs">
            <span className="text-[11px] font-bold text-stone-400 mr-1 shrink-0">A-Z:</span>
            <button
              onClick={() => setSelectedLetter('All')}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold shrink-0 ${
                selectedLetter === 'All' 
                  ? 'bg-emerald-800 text-white' 
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100'
              }`}
            >
              All
            </button>
            {alphabet.map((letter) => (
              <button
                key={letter}
                onClick={() => setSelectedLetter(letter)}
                className={`w-6 h-6 flex items-center justify-center rounded text-[11px] font-semibold shrink-0 ${
                  selectedLetter === letter 
                    ? 'bg-emerald-800 text-white' 
                    : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
              >
                {letter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 px-1">
        <span>
          Showing <strong>{displayedCrops.length}</strong> of <strong>{filteredCrops.length}</strong> commodities
        </span>
      </div>

      {/* Crop Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {displayedCrops.map((crop) => {
          const isStarred = isCropInWatchlist(crop.id);
          const cropRecs = records.filter(r => r.cropId === crop.id);
          const repPrice = cropRecs.length > 0 ? cropRecs[0].modalPrice : null;

          return (
            <div
              key={crop.id}
              className="group bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-xs hover:border-emerald-500 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="relative">
                {/* Crop Image */}
                <div 
                  onClick={() => handleCardClick(crop)}
                  className="h-32 w-full overflow-hidden bg-stone-100 dark:bg-stone-800 cursor-pointer"
                >
                  <img
                    src={crop.imageUrl}
                    alt={crop.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Star Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleCropWatchlist(crop.id);
                  }}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-black/40 backdrop-blur-xs text-white hover:text-amber-300 transition-colors"
                  title={isStarred ? 'Remove from Watchlist' : 'Add to Watchlist'}
                >
                  <Star className={`w-3.5 h-3.5 ${isStarred ? 'fill-amber-400 text-amber-400' : ''}`} />
                </button>

                {/* Category label */}
                <span className="absolute bottom-2 left-2 bg-stone-900/80 backdrop-blur-xs text-white text-[9px] font-semibold px-1.5 py-0.5 rounded">
                  {crop.category}
                </span>
              </div>

              {/* Card Body */}
              <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                <div 
                  onClick={() => handleCardClick(crop)}
                  className="cursor-pointer"
                >
                  <h3 className="font-bold text-xs sm:text-sm text-stone-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors leading-tight">
                    {getCropLocalizedName(crop)}
                  </h3>
                  <p className="text-[10px] text-stone-500 dark:text-stone-400 mt-0.5">
                    {crop.name}
                  </p>
                </div>

                <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs">
                  {repPrice ? (
                    <div>
                      <span className="text-[9px] text-stone-400 uppercase font-bold block">Modal</span>
                      <span className="font-mono font-extrabold text-xs text-emerald-700 dark:text-emerald-400">
                        {formatPrice(repPrice)}
                      </span>
                    </div>
                  ) : (
                    <span className="text-[10px] text-stone-400 italic">
                      Catalog Only
                    </span>
                  )}

                  <button
                    onClick={() => handleCardClick(crop)}
                    className="p-1 rounded-md text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/60"
                    title="View details"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Load More Button */}
      {displayedCrops.length < filteredCrops.length && (
        <div className="text-center pt-4">
          <button
            onClick={() => setDisplayCount(prev => prev + 24)}
            className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow-xs transition-colors inline-flex items-center gap-2"
          >
            <span>Load More Crops ({filteredCrops.length - displayedCrops.length} remaining)</span>
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
