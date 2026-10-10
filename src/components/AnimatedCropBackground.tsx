import React from 'react';
import { useTheme } from '../context/ThemeContext';

export const AnimatedCropBackground: React.FC = () => {
  const { motionEnabled, isDark } = useTheme();

  if (!motionEnabled) {
    return null;
  }

  // Opacity styles based on dark/light mode for elegant unobtrusive perimeter ambience
  const itemOpacity = isDark ? 'opacity-25 hover:opacity-50' : 'opacity-30 hover:opacity-60';

  return (
    <div 
      aria-hidden="true" 
      className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0"
    >
      {/* ========================================================
          LEFT FLANK PERIMETER ELEMENTS (Top to Bottom)
          ======================================================== */}

      {/* 1. Tomato */}
      <div 
        className={`absolute top-4 left-3 sm:left-6 md:left-10 ${itemOpacity} transition-opacity duration-300 animate-float-slow`}
        style={{ animationDelay: '0s', animationDuration: '8s' }}
        title="Tomato"
      >
        <svg className="w-10 h-10 md:w-12 md:h-12 text-red-500 fill-current drop-shadow-sm" viewBox="0 0 24 24">
          <circle cx="12" cy="13" r="8" />
          <path d="M12 5v3M9 5.5c1.5 0 2.5 1.5 3 2.5s1.5-2.5 3-2.5" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>

      {/* 2. Carrot */}
      <div 
        className={`absolute top-24 left-6 sm:left-14 md:left-24 ${itemOpacity} transition-opacity duration-300 animate-float-drift`}
        style={{ animationDelay: '1.2s', animationDuration: '9.5s' }}
        title="Carrot"
      >
        <svg className="w-9 h-9 md:w-11 md:h-11 text-amber-500 fill-current drop-shadow-sm" viewBox="0 0 24 24">
          <path d="M16 4l4 4-10 12-4-4L16 4z" />
          <path d="M16 4l2-2m-2 2l-2-2m4 4l2-2" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>

      {/* 3. Green Leaf / Sprout */}
      <div 
        className={`absolute top-44 left-2 sm:left-8 md:left-12 ${itemOpacity} transition-opacity duration-300 animate-sway-gentle`}
        style={{ animationDelay: '0.5s', animationDuration: '7s' }}
        title="Green Leaf"
      >
        <svg className="w-10 h-10 md:w-12 md:h-12 text-emerald-400 fill-current" viewBox="0 0 24 24">
          <path d="M12 2C6.5 2 2 6.5 2 12c0 3.58 1.9 6.72 4.74 8.46L12 12V2zm0 10l5.26 8.46C20.1 18.72 22 15.58 22 12c0-5.5-4.5-10-10-10v10z" />
        </svg>
      </div>

      {/* 4. Green Chilli */}
      <div 
        className={`absolute top-64 left-5 sm:left-16 md:left-28 ${itemOpacity} transition-opacity duration-300 animate-float-reverse`}
        style={{ animationDelay: '2.1s', animationDuration: '10s' }}
        title="Green Chilli"
      >
        <svg className="w-9 h-9 md:w-10 md:h-10 text-emerald-500 fill-current" viewBox="0 0 24 24">
          <path d="M17 3c-1 0-3 2-5 5-3 4-5 8-4 11 1 2 3 3 5 2 3-1 5-6 6-10 1-4-1-8-2-8z" />
          <path d="M17 3c0-1.5 1-2 2-2" stroke="#14532D" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>

      {/* 5. Onion */}
      <div 
        className={`absolute top-84 left-2 sm:left-7 md:left-14 ${itemOpacity} transition-opacity duration-300 animate-float-slow`}
        style={{ animationDelay: '3.2s', animationDuration: '8.5s' }}
        title="Onion"
      >
        <svg className="w-10 h-10 md:w-11 md:h-11 text-fuchsia-600 fill-current" viewBox="0 0 24 24">
          <path d="M12 3c-1 2-2 4-2 6-4 2-6 5-6 8 0 4 3.5 6 8 6s8-2 8-6c0-3-2-6-6-8-0-2-1-4-2-6z" />
          <path d="M12 3v3M10 20c1 1 3 1 4 0" stroke="#a21caf" strokeWidth="1.5" />
        </svg>
      </div>

      {/* 6. Potato */}
      <div 
        className={`absolute top-104 left-6 sm:left-16 md:left-32 ${itemOpacity} transition-opacity duration-300 animate-float-drift`}
        style={{ animationDelay: '1.7s', animationDuration: '9.2s' }}
        title="Potato"
      >
        <svg className="w-10 h-10 md:w-11 md:h-11 text-amber-700/80 fill-current" viewBox="0 0 24 24">
          <ellipse cx="12" cy="13" rx="8" ry="6" transform="rotate(-15 12 13)" />
          <circle cx="9" cy="11" r="0.75" fill="#451a03" />
          <circle cx="14" cy="14" r="0.75" fill="#451a03" />
          <circle cx="15" cy="10" r="0.75" fill="#451a03" />
        </svg>
      </div>

      {/* 7. Wheat Stalk */}
      <div 
        className={`absolute top-124 left-3 sm:left-10 md:left-16 ${itemOpacity} transition-opacity duration-300 animate-sway-gentle`}
        style={{ animationDelay: '1.8s', animationDuration: '8s' }}
        title="Wheat Stalk"
      >
        <svg className="w-11 h-11 md:w-12 md:h-12 text-amber-400 fill-current" viewBox="0 0 24 24">
          <path d="M12 22V2M8 6l4 2-4 2M16 6l-4 2 4 2M8 11l4 2-4 2M16 11l-4 2 4 2M8 16l4 2-4 2M16 16l-4 2 4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>

      {/* 8. Cabbage */}
      <div 
        className={`absolute top-144 left-5 sm:left-14 md:left-24 hidden lg:block ${itemOpacity} transition-opacity duration-300 animate-float-reverse`}
        style={{ animationDelay: '2.4s', animationDuration: '9.8s' }}
        title="Cabbage"
      >
        <svg className="w-10 h-10 md:w-11 md:h-11 text-emerald-500 fill-current" viewBox="0 0 24 24">
          <circle cx="12" cy="13" r="8" fill="#10b981" />
          <path d="M7 11c2-3 8-3 10 0M6 14c3-1 9-1 12 0M8 17c2 2 6 2 8 0" stroke="#047857" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </svg>
      </div>

      {/* ========================================================
          RIGHT FLANK PERIMETER ELEMENTS (Top to Bottom)
          ======================================================== */}

      {/* 9. Corn / Maize */}
      <div 
        className={`absolute top-5 right-4 sm:right-8 md:right-14 ${itemOpacity} transition-opacity duration-300 animate-float-drift`}
        style={{ animationDelay: '0.8s', animationDuration: '9.5s' }}
        title="Corn / Maize"
      >
        <svg className="w-11 h-11 md:w-12 md:h-12 text-yellow-400 fill-current" viewBox="0 0 24 24">
          <ellipse cx="12" cy="12" rx="4" ry="8" transform="rotate(-30 12 12)" />
          <path d="M8 18c2 3 6 4 9 2M6 14c1 4 4 6 7 5" stroke="#22c55e" strokeWidth="2" fill="none" />
        </svg>
      </div>

      {/* 10. Apple */}
      <div 
        className={`absolute top-26 right-6 sm:right-14 md:right-28 ${itemOpacity} transition-opacity duration-300 animate-float-slow`}
        style={{ animationDelay: '2.5s', animationDuration: '8.5s' }}
        title="Apple"
      >
        <svg className="w-9 h-9 md:w-10 md:h-10 text-rose-500 fill-current" viewBox="0 0 24 24">
          <path d="M12 5c-3-2-6 0-7 3-2 4 0 9 4 12 2 1 4 1 6 0 2 1 4 1 6 0 4-3 6-8 4-12-1-3-4-5-7-3z" />
          <path d="M12 2c0 2-1 3-2 3" stroke="#854d0e" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>

      {/* 11. Mango */}
      <div 
        className={`absolute top-48 right-3 sm:right-8 md:right-12 ${itemOpacity} transition-opacity duration-300 animate-float-reverse`}
        style={{ animationDelay: '1.4s', animationDuration: '7.5s' }}
        title="Mango"
      >
        <svg className="w-10 h-10 md:w-11 md:h-11 text-amber-400 fill-current" viewBox="0 0 24 24">
          <path d="M14 3c-4 0-8 4-8 9s4 9 8 9c3 0 5-2 6-5 1-4-2-13-6-13z" />
          <circle cx="15" cy="5" r="1" fill="#15803d" />
        </svg>
      </div>

      {/* 12. Brinjal / Eggplant */}
      <div 
        className={`absolute top-70 right-6 sm:right-16 md:right-26 ${itemOpacity} transition-opacity duration-300 animate-float-drift`}
        style={{ animationDelay: '3s', animationDuration: '9s' }}
        title="Brinjal"
      >
        <svg className="w-10 h-10 md:w-11 md:h-11 text-purple-600 fill-current" viewBox="0 0 24 24">
          <path d="M12 5c-3 0-6 4-6 9 0 4 3 7 6 7s6-3 6-7c0-5-3-9-6-9z" />
          <path d="M12 2v3M10 5c1 1 3 1 4 0" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>

      {/* 13. Banana */}
      <div 
        className={`absolute top-92 right-3 sm:right-8 md:right-14 ${itemOpacity} transition-opacity duration-300 animate-sway-gentle`}
        style={{ animationDelay: '0.4s', animationDuration: '8s' }}
        title="Banana"
      >
        <svg className="w-10 h-10 md:w-11 md:h-11 text-yellow-300 fill-current" viewBox="0 0 24 24">
          <path d="M5 19c6 3 13-1 15-9 1-4-1-7-2-7 0 3-2 6-5 8-3 2-6 3-8 8z" />
        </svg>
      </div>

      {/* 14. Orange */}
      <div 
        className={`absolute top-112 right-6 sm:right-14 md:right-30 ${itemOpacity} transition-opacity duration-300 animate-float-slow`}
        style={{ animationDelay: '1.9s', animationDuration: '8.2s' }}
        title="Orange"
      >
        <svg className="w-10 h-10 md:w-11 md:h-11 text-orange-500 fill-current" viewBox="0 0 24 24">
          <circle cx="12" cy="13" r="8" />
          <path d="M12 3c0 2-1 3-2 3M12 3c1.5 0 3 1 3 2.5" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>

      {/* 15. Cauliflower */}
      <div 
        className={`absolute top-134 right-3 sm:right-8 md:right-16 hidden lg:block ${itemOpacity} transition-opacity duration-300 animate-float-drift`}
        style={{ animationDelay: '2.8s', animationDuration: '9.4s' }}
        title="Cauliflower"
      >
        <svg className="w-10 h-10 md:w-11 md:h-11 text-emerald-200 fill-current" viewBox="0 0 24 24">
          <circle cx="12" cy="11" r="5" fill="#fef08a" />
          <circle cx="8" cy="13" r="4" fill="#fef08a" />
          <circle cx="16" cy="13" r="4" fill="#fef08a" />
          <path d="M6 18c2 2 10 2 12 0M5 15c0 4 4 6 7 6s7-2 7-6" stroke="#15803d" strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
      </div>

      {/* 16. Pineapple */}
      <div 
        className={`absolute top-154 right-7 sm:right-16 md:right-28 hidden xl:block ${itemOpacity} transition-opacity duration-300 animate-float-reverse`}
        style={{ animationDelay: '0.9s', animationDuration: '10.2s' }}
        title="Pineapple"
      >
        <svg className="w-10 h-10 md:w-11 md:h-11 text-yellow-500 fill-current" viewBox="0 0 24 24">
          <ellipse cx="12" cy="14" rx="5" ry="7" />
          <path d="M12 2l-2 5h4l-2-5zm-3 2l1 5zm6 0l-1 5z" fill="#15803d" />
        </svg>
      </div>

      {/* ========================================================
          BOTTOM & SUB-CORNER ACCENTS (Bottom Perimeter)
          ======================================================== */}

      {/* 17. Watermelon slice */}
      <div 
        className={`absolute bottom-6 left-12 sm:left-24 md:left-40 ${itemOpacity} transition-opacity duration-300 animate-float-slow`}
        style={{ animationDelay: '1s', animationDuration: '10s' }}
        title="Watermelon"
      >
        <svg className="w-11 h-11 md:w-12 md:h-12 text-emerald-600 fill-current" viewBox="0 0 24 24">
          <path d="M21 12c0 5-4 9-9 9s-9-4-9-9h18z" />
          <path d="M19 12c0 4-3 7-7 7s-7-3-7-7h14z" fill="#ef4444" />
        </svg>
      </div>

      {/* 18. Pumpkin */}
      <div 
        className={`absolute bottom-8 right-12 sm:right-24 md:right-44 ${itemOpacity} transition-opacity duration-300 animate-float-drift`}
        style={{ animationDelay: '2.2s', animationDuration: '8s' }}
        title="Pumpkin"
      >
        <svg className="w-11 h-11 md:w-12 md:h-12 text-orange-500 fill-current" viewBox="0 0 24 24">
          <circle cx="12" cy="13" r="8" />
          <ellipse cx="12" cy="13" rx="4" ry="8" fill="#ea580c" />
          <path d="M12 3v3" stroke="#166534" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>

      {/* 19. Small Flowers / Sunflower */}
      <div 
        className={`absolute bottom-3 left-1/2 -translate-x-1/2 ${itemOpacity} transition-opacity duration-300 animate-sway-gentle`}
        style={{ animationDelay: '0.7s', animationDuration: '9s' }}
        title="Small Flower"
      >
        <svg className="w-8 h-8 md:w-9 md:h-9 text-yellow-400 fill-current" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="3" fill="#78350f" />
          <path d="M12 2l1.5 4h4l-3 2.5 1.5 4-4-2.5-4 2.5 1.5-4-3-2.5h4z" />
        </svg>
      </div>

      {/* 20. Rice plant */}
      <div 
        className={`absolute top-52 left-1/2 -translate-x-80 hidden 2xl:block ${itemOpacity} transition-opacity duration-300 animate-float-slow`}
        style={{ animationDelay: '3.5s', animationDuration: '11s' }}
        title="Rice Plant"
      >
        <svg className="w-10 h-10 md:w-11 md:h-11 text-emerald-400 fill-current" viewBox="0 0 24 24">
          <path d="M12 21V9M9 12c1.5-2 3-3 3-5M15 12c-1.5-2-3-3-3-5M9 16c1.5-2 3-3 3-5M15 16c-1.5-2-3-3-3-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>

      {/* 21. Grapes */}
      <div 
        className={`absolute top-52 right-1/2 translate-x-80 hidden 2xl:block ${itemOpacity} transition-opacity duration-300 animate-float-drift`}
        style={{ animationDelay: '2.8s', animationDuration: '10.5s' }}
        title="Grapes"
      >
        <svg className="w-10 h-10 md:w-11 md:h-11 text-indigo-500 fill-current" viewBox="0 0 24 24">
          <circle cx="12" cy="8" r="2.5" />
          <circle cx="9" cy="12" r="2.5" />
          <circle cx="15" cy="12" r="2.5" />
          <circle cx="10" cy="16" r="2.5" />
          <circle cx="14" cy="16" r="2.5" />
          <circle cx="12" cy="20" r="2" />
          <path d="M12 3v3" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>

      {/* 22. Cucumber */}
      <div 
        className={`absolute bottom-14 left-1/3 ${itemOpacity} transition-opacity duration-300 animate-float-reverse hidden md:block`}
        style={{ animationDelay: '1.5s', animationDuration: '8.7s' }}
        title="Cucumber"
      >
        <svg className="w-10 h-10 md:w-11 md:h-11 text-emerald-600 fill-current" viewBox="0 0 24 24">
          <rect x="5" y="10" width="14" height="6" rx="3" transform="rotate(-20 12 13)" />
          <path d="M4 12c1 0 1-1 2-1" stroke="#34d399" strokeWidth="1.5" />
        </svg>
      </div>
    </div>
  );
};
