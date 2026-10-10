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

  // 7 Themes defined in prompt requirements
  const themeOptions: { 
    id: ColorTheme; 
    name: string; 
    color: string; 
    accent: string; 
    description: string;
    isDarkTheme?: boolean;
  }[] = [
    { 
      id: 'bright-white', 
      name: t('themeBrightWhite', 'Bright White'), 
      color: '#FFFFFF', 
      accent: '#15803D',
      description: 'Pure white surfaces, dark text, green accents',
      isDarkTheme: false
    },
    { 
      id: 'classic-green', 
      name: t('themeClassicGreen', 'Classic Green'), 
      color: '#F5F8F3', 
      accent: '#176B35',
      description: 'Clean light background, natural forest green highlights',
      isDarkTheme: false
    },
    { 
      id: 'fresh-lime', 
      name: t('themeFreshLime', 'Fresh Lime'), 
      color: '#F7FEE7', 
      accent: '#84CC16',
      description: 'Soft green surfaces, vibrant lime highlights',
      isDarkTheme: false
    },
    { 
      id: 'harvest-gold', 
      name: t('themeHarvestGold', 'Harvest Gold'), 
      color: '#FEFCE8', 
      accent: '#FACC15',
      description: 'Warm cream surfaces, golden-yellow highlights',
      isDarkTheme: false
    },
    { 
      id: 'earth-brown', 
      name: t('themeEarthBrown', 'Earth Brown'), 
      color: '#FAF6F0', 
      accent: '#8B5E3C',
      description: 'Natural beige & terracotta brown tones',
      isDarkTheme: false
    },
    { 
      id: 'pure-black', 
      name: t('themePureBlack', 'Pure Black'), 
      color: '#000000', 
      accent: '#22C55E',
      description: 'True black OLED background, crisp white text',
      isDarkTheme: true
    },
    { 
      id: 'forest-dark', 
      name: t('themeForestDark', 'Forest Dark'), 
      color: '#071C11', 
      accent: '#10B981',
      description: 'Dark forest-green, high-contrast mint text',
      isDarkTheme: true
    },
  ];

  return (
    <div className="relative">
      <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800/80 p-0.5 rounded-lg border border-stone-200 dark:border-stone-700">
        {/* Dark/Light Quick Toggle */}
        <button
          onClick={toggleDarkMode}
          title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          className="p-1.5 rounded-md text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white transition-colors cursor-pointer"
          aria-label="Toggle dark mode"
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-stone-700" />}
        </button>

        {/* Text size accessibility toggle */}
        <button
          onClick={toggleTextSize}
          title={textSize === 'large' ? 'Reset to normal text' : 'Enable larger readable text'}
          className={`px-1.5 py-1 text-xs font-bold rounded-md transition-colors cursor-pointer ${
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
          title={t('themeSelector', 'Choose Color Theme')}
          className="p-1.5 rounded-md text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white transition-colors cursor-pointer flex items-center gap-1"
          aria-label="Choose color theme"
        >
          <Palette className="w-4 h-4" />
        </button>
      </div>

      {/* Dropdown panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-stone-900 rounded-xl shadow-2xl border border-stone-200 dark:border-stone-700 p-3 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-2 mb-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-stone-800 dark:text-stone-100">
              <Palette className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t('themeSelector', 'Website Theme')} (7 Themes)</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Theme options list */}
          <div className="space-y-1 max-h-80 overflow-y-auto custom-scrollbar pr-0.5">
            {themeOptions.map((th) => {
              const isSelected = colorTheme === th.id;
              return (
                <button
                  key={th.id}
                  onClick={() => {
                    setColorTheme(th.id);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer text-left ${
                    isSelected 
                      ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-900 dark:text-emerald-200 border border-emerald-400 dark:border-emerald-600 shadow-xs' 
                      : 'hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span 
                      className="w-5 h-5 rounded-full border border-black/20 dark:border-white/20 shadow-xs flex items-center justify-center shrink-0" 
                      style={{ backgroundColor: th.color }}
                    >
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: th.accent }} />
                    </span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold">{th.name}</span>
                        {th.isDarkTheme && (
                          <span className="text-[9px] px-1 py-0.2 bg-stone-800 text-stone-300 rounded font-normal">
                            Dark
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-stone-500 dark:text-stone-400 font-normal leading-tight">
                        {th.description}
                      </p>
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Motion toggle option */}
          <div className="mt-2 pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs text-stone-600 dark:text-stone-400">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>{t('animationsToggle', 'Photo Parallax Movement')}</span>
            </span>
            <button
              onClick={toggleMotion}
              className={`px-2 py-0.5 rounded text-[11px] font-bold cursor-pointer transition-colors ${
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
