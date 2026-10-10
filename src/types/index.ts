export type Language = 
  | 'en' // English
  | 'hi' // Hindi
  | 'kn' // Kannada
  | 'ta' // Tamil
  | 'ml' // Malayalam
  | 'te' // Telugu
  | 'mr' // Marathi
  | 'bn' // Bengali
  | 'gu' // Gujarati
  | 'pa' // Punjabi
  | 'or' // Odia
  | 'as'; // Assamese

export type ColorTheme = 
  | 'nature-green' 
  | 'fresh-lime' 
  | 'harvest-gold' 
  | 'earth-brown' 
  | 'forest-dark';

export type TextSize = 'normal' | 'large';

export type CropCategory = 
  | 'Vegetables' 
  | 'Fruits' 
  | 'Grains & Cereals' 
  | 'Pulses' 
  | 'Spices' 
  | 'Oilseeds' 
  | 'Commercial Crops'
  | 'Plantation Crops';

export type PriceUnit = 'quintal' | 'kg';

export interface RegionalCropNames {
  hi?: string;
  kn?: string;
  ta?: string;
  ml?: string;
  te?: string;
  mr?: string;
  bn?: string;
  gu?: string;
  pa?: string;
  or?: string;
  as?: string;
}

export interface Crop {
  id: string;
  name: string;
  hindiName: string;
  teluguName: string;
  regionalNames?: RegionalCropNames;
  category: CropCategory;
  imageUrl: string;
  defaultVariety: string;
  msp?: number; // Minimum Support Price in ₹/quintal if applicable
  season: 'Kharif' | 'Rabi' | 'Zaid' | 'All Year';
  description: string;
}

export interface Mandi {
  id: string;
  name: string;
  state: string;
  district: string;
  marketType: 'Principal Market Yard' | 'Sub Market Yard' | 'Private Market';
  address: string;
  phone: string;
  dailyArrivalTons: number;
  featuredCrops: string[];
}

export interface MarketPriceRecord {
  id: string;
  cropId: string;
  cropName: string;
  hindiName: string;
  teluguName: string;
  category: CropCategory;
  state: string;
  district: string;
  mandiName: string;
  mandiId: string;
  variety: string;
  qualityGrade: 'FAQ' | 'Grade A' | 'Grade B' | 'Super';
  minPrice: number;    // In ₹/quintal
  maxPrice: number;    // In ₹/quintal
  modalPrice: number;  // In ₹/quintal (most common selling rate)
  priceChange: number; // ₹ change compared to previous day (+/-)
  marketDate: string;  // YYYY-MM-DD
  lastUpdated: string; // e.g. "Today, 11:30 AM"
  arrivalsTons: number;
  dataSource: string;  // e.g. "Agmarknet APMC Daily Bulletin"
}

export interface HistoricalPricePoint {
  date: string;       // YYYY-MM-DD
  displayDate: string;// e.g. "04 Oct"
  modalPrice: number; // ₹/quintal
  minPrice: number;   // ₹/quintal
  maxPrice: number;   // ₹/quintal
  arrivalsTons: number;
}

export interface CSVImportRecord {
  cropName: string;
  category: string;
  state: string;
  district: string;
  mandiName: string;
  variety?: string;
  qualityGrade?: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  marketDate: string;
}

export interface ImportHistoryItem {
  id: string;
  timestamp: string;
  recordsCount: number;
  status: 'success' | 'failed' | 'partial';
  sourceName: string;
  notes?: string;
}

export interface Watchlist {
  cropIds: string[];
  mandiIds: string[];
}
