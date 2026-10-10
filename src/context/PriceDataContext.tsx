import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  MarketPriceRecord, 
  Crop, 
  Mandi, 
  PriceUnit, 
  ImportHistoryItem,
  CropCategory,
  Watchlist
} from '../types';
import { 
  CROPS, 
  MANDIS, 
  INITIAL_PRICE_RECORDS, 
  getUniqueStates, 
  getDistrictsForState, 
  getMandisForDistrict,
  DAVANAGERE_MARKETS
} from '../data/mockData';
import { 
  getAllStates, 
  getDistrictsByState, 
  getCitiesByDistrict, 
  getMarketsByLocation 
} from '../data/locationData';

interface PriceDataContextType {
  records: MarketPriceRecord[];
  crops: Crop[];
  mandis: Mandi[];
  davanagereMarkets: Mandi[];
  unit: PriceUnit;
  setUnit: (unit: PriceUnit) => void;
  formatPrice: (pricePerQuintal: number | undefined | null, overrideUnit?: PriceUnit) => string;
  formatPriceNumber: (pricePerQuintal: number, overrideUnit?: PriceUnit) => number;
  unitLabel: string;
  addRecord: (record: Omit<MarketPriceRecord, 'id'>) => void;
  updateRecord: (id: string, updated: Partial<MarketPriceRecord>) => void;
  deleteRecord: (id: string) => void;
  importCSVRecords: (csvText: string) => { success: boolean; count: number; error?: string };
  importHistory: ImportHistoryItem[];
  resetToDefaultData: () => void;
  statesList: string[];
  getDistricts: (state: string) => string[];
  getCities: (state: string, district: string) => string[];
  getMandis: (district: string, city?: string) => string[];
  // Quick search filter state to persist between header and prices page
  globalSearch: string;
  setGlobalSearch: (q: string) => void;
  selectedStateFilter: string;
  setSelectedStateFilter: (s: string) => void;
  selectedDistrictFilter: string;
  setSelectedDistrictFilter: (d: string) => void;
  selectedCityFilter: string;
  setSelectedCityFilter: (c: string) => void;
  selectedMandiFilter: string;
  setSelectedMandiFilter: (m: string) => void;
  selectedCategoryFilter: string;
  setSelectedCategoryFilter: (c: string) => void;
  resetAllFilters: () => void;
  // Watchlist & Recents
  watchlist: Watchlist;
  toggleCropWatchlist: (cropId: string) => void;
  toggleMandiWatchlist: (mandiId: string) => void;
  isCropInWatchlist: (cropId: string) => boolean;
  isMandiInWatchlist: (mandiId: string) => boolean;
  recentlyViewedIds: string[];
  recordCropView: (cropId: string) => void;
}

const PriceDataContext = createContext<PriceDataContextType | undefined>(undefined);

const STORAGE_KEY_RECORDS = 'kissan_adda_records_v2';
const STORAGE_KEY_UNIT = 'kissan_adda_unit_v2';
const STORAGE_KEY_HISTORY = 'kissan_adda_history_v2';
const STORAGE_KEY_WATCHLIST = 'kissan_adda_watchlist_v1';
const STORAGE_KEY_RECENTS = 'kissan_adda_recents_v1';

export const PriceDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [crops] = useState<Crop[]>(CROPS);
  const [mandis] = useState<Mandi[]>(MANDIS);

  const [records, setRecords] = useState<MarketPriceRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_RECORDS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Fallback
    }
    return INITIAL_PRICE_RECORDS;
  });

  const [unit, setUnitState] = useState<PriceUnit>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_UNIT);
      return saved === 'kg' ? 'kg' : 'quintal';
    } catch {
      return 'quintal';
    }
  });

  const [importHistory, setImportHistory] = useState<ImportHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_HISTORY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [
      {
        id: 'hist-1',
        timestamp: '2026-10-10 09:00 AM',
        recordsCount: INITIAL_PRICE_RECORDS.length,
        status: 'success',
        sourceName: 'Agmarknet APMC Daily Bulletin - Morning Batch',
        notes: 'Initial verified benchmark records loaded.',
      },
    ];
  });

  // Watchlist
  const [watchlist, setWatchlist] = useState<Watchlist>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_WATCHLIST);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return { cropIds: ['tomato', 'onion', 'wheat'], mandiIds: ['mandi-azadpur', 'mandi-lasalgaon'] };
  });

  // Recently Viewed Crops
  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_RECENTS);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return ['tomato', 'onion', 'cotton'];
  });

  // Global filters
  const [globalSearch, setGlobalSearch] = useState('');
  const [selectedStateFilter, setSelectedStateFilter] = useState('');
  const [selectedDistrictFilter, setSelectedDistrictFilter] = useState('');
  const [selectedCityFilter, setSelectedCityFilter] = useState('');
  const [selectedMandiFilter, setSelectedMandiFilter] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');

  const resetAllFilters = () => {
    setGlobalSearch('');
    setSelectedStateFilter('');
    setSelectedDistrictFilter('');
    setSelectedCityFilter('');
    setSelectedMandiFilter('');
    setSelectedCategoryFilter('All');
  };

  const setUnit = (newUnit: PriceUnit) => {
    setUnitState(newUnit);
    try {
      localStorage.setItem(STORAGE_KEY_UNIT, newUnit);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_RECORDS, JSON.stringify(records));
    } catch {
      // storage full or disabled
    }
  }, [records]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(importHistory));
    } catch {
      // storage error
    }
  }, [importHistory]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_WATCHLIST, JSON.stringify(watchlist));
    } catch {
      // ignore
    }
  }, [watchlist]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_RECENTS, JSON.stringify(recentlyViewedIds));
    } catch {
      // ignore
    }
  }, [recentlyViewedIds]);

  const toggleCropWatchlist = (cropId: string) => {
    setWatchlist(prev => {
      const exists = prev.cropIds.includes(cropId);
      return {
        ...prev,
        cropIds: exists ? prev.cropIds.filter(id => id !== cropId) : [...prev.cropIds, cropId],
      };
    });
  };

  const toggleMandiWatchlist = (mandiId: string) => {
    setWatchlist(prev => {
      const exists = prev.mandiIds.includes(mandiId);
      return {
        ...prev,
        mandiIds: exists ? prev.mandiIds.filter(id => id !== mandiId) : [...prev.mandiIds, mandiId],
      };
    });
  };

  const isCropInWatchlist = (cropId: string) => watchlist.cropIds.includes(cropId);
  const isMandiInWatchlist = (mandiId: string) => watchlist.mandiIds.includes(mandiId);

  const recordCropView = (cropId: string) => {
    setRecentlyViewedIds(prev => {
      const filtered = prev.filter(id => id !== cropId);
      return [cropId, ...filtered].slice(0, 8);
    });
  };

  const formatPriceNumber = (pricePerQuintal: number, overrideUnit?: PriceUnit): number => {
    const activeUnit = overrideUnit || unit;
    if (activeUnit === 'kg') {
      return Number((pricePerQuintal / 100).toFixed(2));
    }
    return Math.round(pricePerQuintal);
  };

  const formatPrice = (pricePerQuintal: number | undefined | null, overrideUnit?: PriceUnit): string => {
    if (pricePerQuintal === undefined || pricePerQuintal === null || isNaN(pricePerQuintal)) {
      return 'N/A';
    }
    const activeUnit = overrideUnit || unit;
    if (activeUnit === 'kg') {
      const perKg = (pricePerQuintal / 100).toFixed(2);
      return `₹${perKg}/kg`;
    }
    return `₹${Math.round(pricePerQuintal).toLocaleString('en-IN')}/qtl`;
  };

  const unitLabel = unit === 'kg' ? '₹/kg' : '₹/quintal';

  const addRecord = (newRecData: Omit<MarketPriceRecord, 'id'>) => {
    const newRecord: MarketPriceRecord = {
      ...newRecData,
      id: `pr-custom-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    };
    setRecords(prev => [newRecord, ...prev]);
  };

  const updateRecord = (id: string, updated: Partial<MarketPriceRecord>) => {
    setRecords(prev => prev.map(r => (r.id === id ? { ...r, ...updated } : r)));
  };

  const deleteRecord = (id: string) => {
    setRecords(prev => prev.filter(r => r.id !== id));
  };

  const resetToDefaultData = () => {
    setRecords(INITIAL_PRICE_RECORDS);
    localStorage.removeItem(STORAGE_KEY_RECORDS);
  };

  const importCSVRecords = (csvText: string): { success: boolean; count: number; error?: string } => {
    try {
      const lines = csvText.trim().split('\n');
      if (lines.length < 2) {
        return { success: false, count: 0, error: 'CSV file is empty or missing headers.' };
      }

      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      const cropIdx = headers.findIndex(h => h.includes('crop'));
      const stateIdx = headers.findIndex(h => h.includes('state'));
      const distIdx = headers.findIndex(h => h.includes('district'));
      const mandiIdx = headers.findIndex(h => h.includes('mandi') || h.includes('market'));
      const modalIdx = headers.findIndex(h => h.includes('modal'));
      const minIdx = headers.findIndex(h => h.includes('min'));
      const maxIdx = headers.findIndex(h => h.includes('max'));
      const catIdx = headers.findIndex(h => h.includes('category'));

      if (cropIdx === -1 || modalIdx === -1) {
        return { 
          success: false, 
          count: 0, 
          error: 'Required columns not found. Ensure columns include "Crop Name" and "Modal Price".' 
        };
      }

      const parsed: MarketPriceRecord[] = [];
      const today = new Date().toISOString().split('T')[0];

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        const cols = line.split(',').map(c => c.trim().replace(/^["']|["']$/g, ''));
        const cropName = cols[cropIdx] || 'Unknown';
        const modalVal = parseFloat(cols[modalIdx]);
        if (isNaN(modalVal) || modalVal <= 0) continue;

        const minVal = minIdx !== -1 && !isNaN(parseFloat(cols[minIdx])) ? parseFloat(cols[minIdx]) : Math.round(modalVal * 0.9);
        const maxVal = maxIdx !== -1 && !isNaN(parseFloat(cols[maxIdx])) ? parseFloat(cols[maxIdx]) : Math.round(modalVal * 1.1);
        const stateVal = stateIdx !== -1 && cols[stateIdx] ? cols[stateIdx] : 'National';
        const distVal = distIdx !== -1 && cols[distIdx] ? cols[distIdx] : 'General';
        const mandiVal = mandiIdx !== -1 && cols[mandiIdx] ? cols[mandiIdx] : 'District Mandi';
        const catVal = (catIdx !== -1 && cols[catIdx] ? cols[catIdx] : 'Vegetables') as CropCategory;

        const matchedCrop = crops.find(c => c.name.toLowerCase() === cropName.toLowerCase());

        parsed.push({
          id: `pr-csv-${Date.now()}-${i}`,
          cropId: matchedCrop ? matchedCrop.id : cropName.toLowerCase().replace(/\s+/g, '-'),
          cropName: matchedCrop ? matchedCrop.name : cropName,
          hindiName: matchedCrop ? matchedCrop.hindiName : cropName,
          teluguName: matchedCrop ? matchedCrop.teluguName : cropName,
          category: matchedCrop ? matchedCrop.category : catVal,
          state: stateVal,
          district: distVal,
          mandiName: mandiVal,
          mandiId: `mandi-csv-${i}`,
          variety: 'Standard FAQ',
          qualityGrade: 'FAQ',
          minPrice: Math.round(minVal),
          maxPrice: Math.round(maxVal),
          modalPrice: Math.round(modalVal),
          priceChange: 0,
          marketDate: today,
          lastUpdated: 'Imported just now',
          arrivalsTons: 100,
          dataSource: 'CSV Admin Import Verified',
        });
      }

      if (parsed.length === 0) {
        return { success: false, count: 0, error: 'No valid data rows found in CSV.' };
      }

      setRecords(prev => [...parsed, ...prev]);

      const newHistoryItem: ImportHistoryItem = {
        id: `hist-${Date.now()}`,
        timestamp: new Date().toLocaleString('en-IN'),
        recordsCount: parsed.length,
        status: 'success',
        sourceName: 'User CSV Upload',
        notes: `Successfully imported ${parsed.length} market price entries.`,
      };
      setImportHistory(prev => [newHistoryItem, ...prev]);

      return { success: true, count: parsed.length };
    } catch (err) {
      return { 
        success: false, 
        count: 0, 
        error: err instanceof Error ? err.message : 'Failed to parse CSV file.' 
      };
    }
  };

  const statesList = Array.from(new Set([...getAllStates(), ...getUniqueStates(records)])).sort();

  const getDistricts = (state: string) => {
    if (!state) return [];
    const fromHierarchy = getDistrictsByState(state);
    const fromRecords = getDistrictsForState(records, state);
    return Array.from(new Set([...fromHierarchy, ...fromRecords])).sort();
  };

  const getCities = (state: string, district: string) => {
    if (!state || !district) return [];
    return getCitiesByDistrict(state, district);
  };

  const getMandis = (district: string, city?: string) => {
    if (!district) return [];
    const fromRecords = records
      .filter(r => r.district.toLowerCase() === district.toLowerCase() && (!city || (r.city && r.city.toLowerCase() === city.toLowerCase())))
      .map(r => r.mandiName);
    const fromMandis = mandis
      .filter(m => m.district.toLowerCase() === district.toLowerCase() && (!city || (m.city && m.city.toLowerCase() === city.toLowerCase())))
      .map(m => m.name);
    return Array.from(new Set([...fromRecords, ...fromMandis])).sort();
  };

  return (
    <PriceDataContext.Provider
      value={{
        records,
        crops,
        mandis,
        davanagereMarkets: DAVANAGERE_MARKETS,
        unit,
        setUnit,
        formatPrice,
        formatPriceNumber,
        unitLabel,
        addRecord,
        updateRecord,
        deleteRecord,
        importCSVRecords,
        importHistory,
        resetToDefaultData,
        statesList,
        getDistricts,
        getCities,
        getMandis,
        globalSearch,
        setGlobalSearch,
        selectedStateFilter,
        setSelectedStateFilter,
        selectedDistrictFilter,
        setSelectedDistrictFilter,
        selectedCityFilter,
        setSelectedCityFilter,
        selectedMandiFilter,
        setSelectedMandiFilter,
        selectedCategoryFilter,
        setSelectedCategoryFilter,
        resetAllFilters,
        watchlist,
        toggleCropWatchlist,
        toggleMandiWatchlist,
        isCropInWatchlist,
        isMandiInWatchlist,
        recentlyViewedIds,
        recordCropView,
      }}
    >
      {children}
    </PriceDataContext.Provider>
  );
};

export const usePriceData = (): PriceDataContextType => {
  const context = useContext(PriceDataContext);
  if (!context) {
    throw new Error('usePriceData must be used within a PriceDataProvider');
  }
  return context;
};
