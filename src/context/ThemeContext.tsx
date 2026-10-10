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

const STORAGE_KEY_DARK = 'kissan_adda_theme_dark';
const STORAGE_KEY_COLOR = 'kissan_adda_theme_color';
const STORAGE_KEY_TEXT = 'kissan_adda_text_size';
const STORAGE_KEY_MOTION = 'kissan_adda_motion';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DARK);
      if (saved !== null) return saved === 'true';
    } catch {
      // ignore
    }
    return false;
  });

  const [colorTheme, setColorThemeState] = useState<ColorTheme>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_COLOR);
      if (saved && ['nature-green', 'fresh-lime', 'harvest-gold', 'earth-brown', 'forest-dark'].includes(saved)) {
        return saved as ColorTheme;
      }
    } catch {
      // ignore
    }
    return 'nature-green';
  });

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

  // Apply classes to root element
  useEffect(() => {
    const root = document.documentElement;
    // Dark mode
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Color theme classes
    root.classList.remove(
      'theme-nature-green', 
      'theme-fresh-lime', 
      'theme-harvest-gold', 
      'theme-earth-brown', 
      'theme-forest-dark'
    );
    root.classList.add(`theme-${colorTheme}`);

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
  }, [isDark, colorTheme, textSize, motionEnabled]);

  const toggleDarkMode = () => {
    setIsDark(prev => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY_DARK, String(next));
      if (next && colorTheme !== 'forest-dark') {
        // preserve theme
      } else if (!next && colorTheme === 'forest-dark') {
        setColorThemeState('nature-green');
        localStorage.setItem(STORAGE_KEY_COLOR, 'nature-green');
      }
      return next;
    });
  };

  const setColorTheme = (theme: ColorTheme) => {
    setColorThemeState(theme);
    localStorage.setItem(STORAGE_KEY_COLOR, theme);
    if (theme === 'forest-dark') {
      setIsDark(true);
      localStorage.setItem(STORAGE_KEY_DARK, 'true');
    } else {
      setIsDark(false);
      localStorage.setItem(STORAGE_KEY_DARK, 'false');
    }
  };

  const setTextSize = (size: TextSize) => {
    setTextSizeState(size);
    localStorage.setItem(STORAGE_KEY_TEXT, size);
  };

  const toggleTextSize = () => {
    const next = textSize === 'normal' ? 'large' : 'normal';
    setTextSize(next);
  };

  const setMotionEnabled = (enabled: boolean) => {
    setMotionEnabledState(enabled);
    localStorage.setItem(STORAGE_KEY_MOTION, String(enabled));
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
