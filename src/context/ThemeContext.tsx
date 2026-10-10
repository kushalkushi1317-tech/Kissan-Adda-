import React, { createContext, useContext, useState, useEffect } from 'react';
import { ColorTheme, TextSize } from '../types';

interface ThemeContextType {
  isDark: boolean;
  toggleDarkMode: () => void;
  colorTheme: ColorTheme;
  setColorTheme: (theme: ColorTheme) => void;
  textSize: TextSize;
  setTextSize: (size: TextSize) => void;
  toggleTextSize: () => void;
  motionEnabled: boolean;
  setMotionEnabled: (enabled: boolean) => void;
  toggleMotion: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY_THEME = 'kissan_adda_global_theme_v3';
const STORAGE_KEY_TEXT = 'kissan_adda_text_size_v3';
const STORAGE_KEY_MOTION = 'kissan_adda_motion_v3';

export const VALID_THEMES: ColorTheme[] = [
  'bright-white',
  'classic-green',
  'fresh-lime',
  'harvest-gold',
  'earth-brown',
  'pure-black',
  'forest-dark',
];

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [colorTheme, setColorThemeState] = useState<ColorTheme>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_THEME);
      if (saved && VALID_THEMES.includes(saved as ColorTheme)) {
        return saved as ColorTheme;
      }
      // Map older saved keys
      if (saved === 'nature-green') return 'classic-green';
    } catch {
      // ignore
    }
    return 'classic-green';
  });

  const isDark = colorTheme === 'pure-black' || colorTheme === 'forest-dark';

  const [textSize, setTextSizeState] = useState<TextSize>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TEXT);
      if (saved === 'large' || saved === 'normal') return saved;
    } catch {
      // ignore
    }
    return 'normal';
  });

  const [motionEnabled, setMotionEnabledState] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MOTION);
      if (saved !== null) return saved === 'true';
      if (typeof window !== 'undefined' && window.matchMedia) {
        return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      }
    } catch {
      // ignore
    }
    return true;
  });

  // Apply classes and attributes directly to root element
  useEffect(() => {
    const root = document.documentElement;

    // Set data-theme attribute
    root.setAttribute('data-theme', colorTheme);

    // Clean up all theme classes
    VALID_THEMES.forEach((t) => {
      root.classList.remove(`theme-${t}`);
    });
    // Remove legacy classes
    root.classList.remove('theme-nature-green');

    // Add current theme class
    root.classList.add(`theme-${colorTheme}`);

    // Manage dark mode class
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Text size
    if (textSize === 'large') {
      root.classList.add('text-scale-large');
    } else {
      root.classList.remove('text-scale-large');
    }

    // Motion
    if (!motionEnabled) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }
  }, [colorTheme, isDark, textSize, motionEnabled]);

  const setColorTheme = (theme: ColorTheme) => {
    if (!VALID_THEMES.includes(theme)) return;
    setColorThemeState(theme);
    try {
      localStorage.setItem(STORAGE_KEY_THEME, theme);
    } catch {
      // ignore
    }
  };

  const toggleDarkMode = () => {
    // If currently dark, switch to classic-green; if light, switch to forest-dark
    if (isDark) {
      setColorTheme('classic-green');
    } else {
      setColorTheme('forest-dark');
    }
  };

  const setTextSize = (size: TextSize) => {
    setTextSizeState(size);
    try {
      localStorage.setItem(STORAGE_KEY_TEXT, size);
    } catch {
      // ignore
    }
  };

  const toggleTextSize = () => {
    const next = textSize === 'normal' ? 'large' : 'normal';
    setTextSize(next);
  };

  const setMotionEnabled = (enabled: boolean) => {
    setMotionEnabledState(enabled);
    try {
      localStorage.setItem(STORAGE_KEY_MOTION, String(enabled));
    } catch {
      // ignore
    }
  };

  const toggleMotion = () => {
    setMotionEnabled(!motionEnabled);
  };

  return (
    <ThemeContext.Provider
      value={{
        isDark,
        toggleDarkMode,
        colorTheme,
        setColorTheme,
        textSize,
        setTextSize,
        toggleTextSize,
        motionEnabled,
        setMotionEnabled,
        toggleMotion,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
