import React, { useState } from 'react';
import { 
  Palette, 
  Sun, 
  Moon, 
  Type, 
  Sparkles, 
  Check, 
  X 
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { ColorTheme } from '../types';

export const ThemeSelector: React.FC = () => {
  const { 
    isDark, 
    toggleDarkMode, 
    colorTheme, 
    setColorTheme, 
    textSize, 
    toggleTextSize,
    motionEnabled,
    toggleMotion 
  } = useTheme();
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const themeOptions: { id: ColorTheme; name: string; color: string; accent: string }[] = [
    { id: 'nature-green', name: t('themeNatureGreen', 'Nature Green'), color: '#14532D', accent: '#22A447' },
    { id: 'fresh-lime', name: t('themeFreshLime', 'Fresh Lime'), color: '#15803D', accent: '#A3E635' },
    { id: 'harvest-gold', name: t('themeHarvestGold', 'Harvest Gold'), color: '#854D0E', accent: '#FACC15' },
    { id: 'earth-brown', name: t('themeEarthBrown', 'Earth Brown'), color: '#78350F', accent: '#8B5E3C' },
    { id: 'forest-dark', name: t('themeForestDark', 'Forest Dark'), color: '#071C11', accent: '#22A447' },
  ];

  return (
    <div className="relative">
      <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800/80 p-0.5 rounded-lg border border-stone-200 dark:border-stone-700">
        {/* Dark/Light toggle */}
        <button
          onClick={toggleDarkMode}
          title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          className="p-1.5 rounded-md text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white transition-colors"
          aria-label="Toggle dark mode"
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-stone-700" />}
        </button>

        {/* Text size accessibility toggle */}
        <button
          onClick={toggleTextSize}
          title={textSize === 'large' ? 'Reset to normal text' : 'Enable larger readable text'}
          className={`px-1.5 py-1 text-xs font-bold rounded-md transition-colors ${
            textSize === 'large' 
              ? 'bg-emerald-600 text-white' 
              : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
          }`}
          aria-label="Toggle text size"
        >
          <span className="flex items-center gap-0.5">
            <Type className="w-3.5 h-3.5" />
            <span className="text-[10px]">{textSize === 'large' ? 'A+' : 'A'}</span>
          </span>
        </button>

        {/* Color Palette dropdown trigger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          title={t('themeSelector', 'Color Theme')}
          className="p-1.5 rounded-md text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white transition-colors"
          aria-label="Choose color theme"
        >
          <Palette className="w-4 h-4" />
        </button>
      </div>

      {/* Dropdown panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-stone-900 rounded-xl shadow-xl border border-stone-200 dark:border-stone-700 p-3 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-2 mb-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-stone-800 dark:text-stone-100">
              <Palette className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t('themeSelector', 'Color Theme')}</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Theme options list */}
          <div className="space-y-1.5">
            {themeOptions.map((th) => {
              const isSelected = colorTheme === th.id;
              return (
                <button
                  key={th.id}
                  onClick={() => {
                    setColorTheme(th.id);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    isSelected 
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700' 
                      : 'hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span 
                      className="w-4 h-4 rounded-full border border-black/10 shadow-xs flex items-center justify-center shrink-0" 
                      style={{ backgroundColor: th.color }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: th.accent }} />
                    </span>
                    <span>{th.name}</span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
                </button>
              );
            })}
          </div>

          {/* Motion toggle option */}
          <div className="mt-3 pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs text-stone-600 dark:text-stone-400">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>{t('animationsToggle', 'Animations')}</span>
            </span>
            <button
              onClick={toggleMotion}
              className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                motionEnabled 
                  ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200' 
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-500'
              }`}
            >
              {motionEnabled ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
