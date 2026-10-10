import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Plus, 
  Upload, 
  FileText, 
  History, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  Trash2,
  Edit,
  Database,
  ArrowRight
} from 'lucide-react';
import { useRouter } from '../context/RouterContext';
import { useLanguage } from '../context/LanguageContext';
import { usePriceData } from '../context/PriceDataContext';
import { CROP_CATEGORIES } from '../data/mockData';
import { CropCategory, MarketPriceRecord } from '../types';

export const AdminPage: React.FC = () => {
  const { navigate } = useRouter();
  const { t } = useLanguage();
  const { 
    records, 
    crops, 
    mandis, 
    addRecord, 
    deleteRecord, 
    importCSVRecords, 
    importHistory, 
    resetToDefaultData,
    formatPrice,
  } = usePriceData();

  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('kissan_admin_auth') === 'true';
  });
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');

  // Active admin tab
  const [activeTab, setActiveTab] = useState<'addRecord' | 'csvImport' | 'manageRecords' | 'history'>('addRecord');

  // New Record Form State
  const [cropId, setCropId] = useState(crops[0]?.id || 'tomato');
  const [state, setState] = useState('Maharashtra');
  const [district, setDistrict] = useState('Nashik');
  const [mandiName, setMandiName] = useState('Lasalgaon APMC');
  const [variety, setVariety] = useState('FAQ Standard');
  const [minPrice, setMinPrice] = useState<number>(2000);
  const [maxPrice, setMaxPrice] = useState<number>(2800);
  const [modalPrice, setModalPrice] = useState<number>(2450);
  const [qualityGrade, setQualityGrade] = useState<'FAQ' | 'Grade A' | 'Grade B' | 'Super'>('Grade A');
  const [arrivalsTons, setArrivalsTons] = useState<number>(250);
  const [formSuccess, setFormSuccess] = useState('');
  const [formError, setFormError] = useState('');

  // CSV Import State
  const [csvText, setCsvText] = useState('');
  const [csvResult, setCsvResult] = useState<{ success?: boolean; count?: number; error?: string } | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default PIN: 1234 or kissan2026
    if (passcode === '1234' || passcode === 'kissan2026' || passcode === 'admin') {
      setIsAuthenticated(true);
      localStorage.setItem('kissan_admin_auth', 'true');
      setAuthError('');
    } else {
      setAuthError('Invalid Admin Passcode. (Try default: 1234)');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('kissan_admin_auth');
  };

  const handleAddRecordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSuccess('');
    setFormError('');

    if (minPrice > modalPrice || modalPrice > maxPrice) {
      setFormError('Price logic violation: Minimum Price must be ≤ Modal Price ≤ Maximum Price.');
      return;
    }

    const selectedCrop = crops.find(c => c.id === cropId);
    if (!selectedCrop) {
      setFormError('Please select a valid crop.');
      return;
    }

    const todayStr = new Date().toISOString().split('T')[0];

    addRecord({
      cropId: selectedCrop.id,
      cropName: selectedCrop.name,
      hindiName: selectedCrop.hindiName,
      teluguName: selectedCrop.teluguName,
      category: selectedCrop.category,
      state,
      district,
      mandiName,
      mandiId: `mandi-${mandiName.toLowerCase().replace(/\s+/g, '-')}`,
      variety,
      qualityGrade,
      minPrice: Number(minPrice),
      maxPrice: Number(maxPrice),
      modalPrice: Number(modalPrice),
      priceChange: 0,
      marketDate: todayStr,
      lastUpdated: 'Just now (Admin verified)',
      arrivalsTons: Number(arrivalsTons),
      dataSource: 'Mandi Board Officer Portal',
    });

    setFormSuccess(`Successfully published new price record for ${selectedCrop.name} at ${mandiName}!`);
    setTimeout(() => setFormSuccess(''), 4000);
  };

  const handleCsvImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvText.trim()) return;
    const res = importCSVRecords(csvText);
    setCsvResult(res);
    if (res.success) {
      setCsvText('');
    }
  };

  const loadSampleCsv = () => {
    const sample = `Crop Name,Category,State,District,Mandi Name,Modal Price,Min Price,Max Price
Tomato,Vegetables,Karnataka,Kolar,Kolar Special Yard,2500,2100,2850
Onion,Vegetables,Maharashtra,Pune,Pune Gultekdi Mandi,2200,1800,2500
Wheat,Grains & Cereals,Punjab,Khanna,Khanna Central Yard,2600,2400,2750
Soybean,Oilseeds,Madhya Pradesh,Ujjain,Ujjain APMC,4850,4500,5100`;
    setCsvText(sample);
  };

  // If not logged in, render authentication gate
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl border border-stone-200 p-8 shadow-sm text-center space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-[#176B35] flex items-center justify-center mx-auto shadow-xs">
            <Lock className="w-6 h-6" />
          </div>

          <div>
            <h1 className="text-xl font-bold text-stone-900 font-serif">
              Admin & Mandi Supervisor Portal
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Enter authorized PIN to manage daily mandi feeds and upload CSV records.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter PIN (Default: 1234)"
                className="w-full px-4 py-2.5 text-center text-sm font-mono tracking-widest bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-[#2E8B45] focus:outline-hidden"
              />
            </div>

            {authError && (
              <p className="text-xs text-red-600 font-medium">
                {authError}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-2.5 bg-[#176B35] hover:bg-[#12572a] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
            >
              Unlock Dashboard
            </button>
          </form>

          <p className="text-[11px] text-stone-400">
            For evaluation, default PIN is <strong>1234</strong>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#176B35]">
            <ShieldCheck className="w-4 h-4" />
            <span>Authorized Operations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight mt-1">
            Mandi Administration Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Add price lots, batch import daily market sheets, and audit APMC records.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={resetToDefaultData}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors border border-stone-200"
            title="Reset to default benchmark dataset"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>

          <button
            onClick={handleLogout}
            className="px-3 py-1.5 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-200"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 overflow-x-auto custom-scrollbar pb-1">
        <button
          onClick={() => setActiveTab('addRecord')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
            activeTab === 'addRecord'
              ? 'bg-[#176B35] text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New Price Record</span>
        </button>

        <button
          onClick={() => setActiveTab('csvImport')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
            activeTab === 'csvImport'
              ? 'bg-[#176B35] text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Upload className="w-3.5 h-3.5" />
          <span>CSV Batch Import</span>
        </button>

        <button
          onClick={() => setActiveTab('manageRecords')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
            activeTab === 'manageRecords'
              ? 'bg-[#176B35] text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>All Records ({records.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
            activeTab === 'history'
              ? 'bg-[#176B35] text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>Import History</span>
        </button>
      </div>

      {/* Tab 1: Add New Record Form */}
      {activeTab === 'addRecord' && (
        <div className="bg-white rounded-xl border border-stone-200/90 p-6 shadow-xs max-w-3xl space-y-6">
          <div className="border-b border-stone-100 pb-3">
            <h3 className="font-bold text-base text-stone-900">
              Publish Daily APMC Rate Entry
            </h3>
            <p className="text-xs text-stone-500">
              Input verified wholesale rate reported by the Agricultural Produce Market Committee.
            </p>
          </div>

          {formSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2 text-xs font-semibold text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{formSuccess}</span>
            </div>
          )}

          {formError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-xs font-semibold text-red-800">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleAddRecordSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Crop Commodity *
                </label>
                <select
                  value={cropId}
                  onChange={(e) => setCropId(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
                >
                  {crops.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.category})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Variety & Quality Grade *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    value={variety}
                    onChange={(e) => setVariety(e.target.value)}
                    placeholder="e.g. Desi Hybrid"
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-hidden"
                  />
                  <select
                    value={qualityGrade}
                    onChange={(e) => setQualityGrade(e.target.value as any)}
                    className="w-full px-2 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-hidden"
                  >
                    <option value="FAQ">FAQ</option>
                    <option value="Grade A">Grade A</option>
                    <option value="Grade B">Grade B</option>
                    <option value="Super">Super</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  State *
                </label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  District *
                </label>
                <input
                  type="text"
                  required
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Mandi Name *
                </label>
                <input
                  type="text"
                  required
                  value={mandiName}
                  onChange={(e) => setMandiName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-hidden"
                />
              </div>
            </div>

            {/* Price inputs: Min, Modal, Max (in ₹/quintal) */}
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
                Wholesale Price Brackets (₹ / Quintal)
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                    Minimum Rate (₹)
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={minPrice}
                    onChange={(e) => setMinPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs font-mono font-bold bg-white border border-stone-300 rounded-lg focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#176B35] mb-1">
                    Modal Rate (₹) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={modalPrice}
                    onChange={(e) => setModalPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs font-mono font-bold bg-white border-2 border-emerald-500 rounded-lg focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                    Maximum Rate (₹)
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs font-mono font-bold bg-white border border-stone-300 rounded-lg focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                  Daily Arrivals (Metric Tonnes)
                </label>
                <input
                  type="number"
                  min="0"
                  value={arrivalsTons}
                  onChange={(e) => setArrivalsTons(Number(e.target.value))}
                  className="w-48 px-3 py-1.5 text-xs font-mono bg-white border border-stone-300 rounded-lg focus:outline-hidden"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#176B35] hover:bg-[#12572a] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
              >
                Publish Rate Record
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 2: CSV Batch Import */}
      {activeTab === 'csvImport' && (
        <div className="bg-white rounded-xl border border-stone-200/90 p-6 shadow-xs max-w-3xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
            <div>
              <h3 className="font-bold text-base text-stone-900">
                Import Market-Price Records from CSV
              </h3>
              <p className="text-xs text-stone-500">
                Upload or paste comma-separated commodity rates from official APMC bulletins.
              </p>
            </div>

            <button
              type="button"
              onClick={loadSampleCsv}
              className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 underline self-start sm:self-auto"
            >
              Load Example Template
            </button>
          </div>

          {csvResult && (
            <div className={`p-4 rounded-xl text-xs flex items-start gap-2 border ${
              csvResult.success 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
                : 'bg-red-50 border-red-200 text-red-900'
            }`}>
              {csvResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              )}
              <div>
                <span className="font-bold block">
                  {csvResult.success ? 'Import Complete' : 'Import Error'}
                </span>
                <p>
                  {csvResult.success 
                    ? `Successfully parsed and validated ${csvResult.count} market price records.`
                    : csvResult.error}
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleCsvImportSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Paste CSV Data (Headers: Crop Name, Category, State, District, Mandi Name, Modal Price, Min Price, Max Price)
              </label>
              <textarea
                rows={8}
                value={csvText}
                onChange={(e) => setCsvText(e.target.value)}
                placeholder="Crop Name,Category,State,District,Mandi Name,Modal Price,Min Price,Max Price&#10;Tomato,Vegetables,Karnataka,Kolar,Kolar APMC,2400,2000,2700"
                className="w-full px-3 py-2 text-xs font-mono bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-hidden"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[11px] text-stone-400">
                Automatic validation against valid numbers and positive prices
              </span>
              <button
                type="submit"
                disabled={!csvText.trim()}
                className="px-5 py-2.5 bg-[#176B35] hover:bg-[#12572a] text-white text-xs font-bold rounded-xl disabled:opacity-50 transition-colors"
              >
                Parse & Import CSV
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 3: Manage Records */}
      {activeTab === 'manageRecords' && (
        <div className="bg-white rounded-xl border border-stone-200/90 shadow-xs overflow-hidden">
          <div className="p-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
            <h3 className="font-bold text-sm text-stone-900">
              Active Database Records ({records.length})
            </h3>
            <span className="text-xs text-stone-500">
              Delete or review entries
            </span>
          </div>

          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-stone-200 text-stone-500 uppercase font-bold">
                  <th className="py-3 px-4">Commodity</th>
                  <th className="py-3 px-3">State / District</th>
                  <th className="py-3 px-3">Mandi</th>
                  <th className="py-3 px-3 text-right">Min Rate</th>
                  <th className="py-3 px-3 text-right">Modal Rate</th>
                  <th className="py-3 px-3 text-right">Max Rate</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {records.map((r) => (
                  <tr key={r.id} className="hover:bg-stone-50">
                    <td className="py-3 px-4 font-bold text-stone-900">
                      {r.cropName} ({r.variety})
                    </td>
                    <td className="py-3 px-3 text-stone-600">
                      {r.district}, {r.state}
                    </td>
                    <td className="py-3 px-3 font-medium text-stone-800">
                      {r.mandiName}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-stone-600">
                      {formatPrice(r.minPrice)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-[#176B35]">
                      {formatPrice(r.modalPrice)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-stone-600">
                      {formatPrice(r.maxPrice)}
                    </td>
                    <td className="py-3 px-3 text-stone-500 text-[11px]">
                      {r.marketDate}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => deleteRecord(r.id)}
                        className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Import History */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-xl border border-stone-200/90 shadow-xs overflow-hidden">
          <div className="p-4 bg-stone-50 border-b border-stone-200">
            <h3 className="font-bold text-sm text-stone-900">
              Audit Trail & Import History
            </h3>
            <p className="text-xs text-stone-500">
              Log of all CSV and bulk import transactions
            </p>
          </div>

          <div className="divide-y divide-stone-100">
            {importHistory.map((item) => (
              <div key={item.id} className="p-4 flex items-center justify-between text-xs hover:bg-stone-50">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-900">{item.sourceName}</span>
                    <span className="bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-semibold text-[10px]">
                      {item.recordsCount} records
                    </span>
                  </div>
                  <p className="text-stone-500 text-[11px]">{item.notes}</p>
                </div>
                <div className="text-right text-stone-400 text-[11px] font-mono">
                  {item.timestamp}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
