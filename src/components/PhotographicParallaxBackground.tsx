import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

interface PhotoTile {
  id: string;
  name: string;
  url: string;
  fallbackUrl: string;
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  size: string;
  speed: number; // parallax depth multiplier
  rotation: number;
}

export const PhotographicParallaxBackground: React.FC = () => {
  const { motionEnabled, isDark, colorTheme } = useTheme();
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Parallax pointer tracking with requestAnimationFrame throttle
  useEffect(() => {
    if (!motionEnabled) return;

    let rafId: number | null = null;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      // Normalized between -1 and 1
      targetX = (e.clientX / innerWidth - 0.5) * 2;
      targetY = (e.clientY / innerHeight - 0.5) * 2;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const { innerWidth, innerHeight } = window;
        targetX = (touch.clientX / innerWidth - 0.5) * 1.5;
        targetY = (touch.clientY / innerHeight - 0.5) * 1.5;
      }
    };

    const updateParallax = () => {
      // Smooth linear interpolation (lerp)
      currentX += (targetX - currentX) * 0.06;
      currentY += (targetY - currentY) * 0.06;

      setOffset({
        x: Math.round(currentX * 18),
        y: Math.round(currentY * 18),
      });

      rafId = requestAnimationFrame(updateParallax);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    rafId = requestAnimationFrame(updateParallax);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [motionEnabled]);

  // Real photographs of agricultural produce curated around the hero perimeter
  const tiles: PhotoTile[] = [
    // Top-Left Perimeter
    {
      id: 'tomato-tile',
      name: 'Fresh Red Tomatoes',
      url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=320&auto=format&fit=crop&q=80',
      fallbackUrl: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=320&auto=format&fit=crop&q=80',
      top: '12px',
      left: '16px',
      size: 'w-16 h-16 sm:w-20 sm:h-20',
      speed: 0.8,
      rotation: -6,
    },
    {
      id: 'wheat-tile',
      name: 'Golden Wheat Sheaf',
      url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=320&auto=format&fit=crop&q=80',
      fallbackUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=320&auto=format&fit=crop&q=80',
      top: '100px',
      left: '48px',
      size: 'w-18 h-18 sm:w-24 sm:h-24',
      speed: 1.2,
      rotation: 8,
    },
    {
      id: 'onion-tile',
      name: 'Nashik Red Onions',
      url: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=320&auto=format&fit=crop&q=80',
      fallbackUrl: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=320&auto=format&fit=crop&q=80',
      top: '210px',
      left: '18px',
      size: 'w-16 h-16 sm:w-20 sm:h-20',
      speed: 0.6,
      rotation: -12,
    },
    {
      id: 'green-chilli-tile',
      name: 'Pungent Green Chillies',
      url: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=320&auto=format&fit=crop&q=80',
      fallbackUrl: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=320&auto=format&fit=crop&q=80',
      top: '310px',
      left: '52px',
      size: 'w-14 h-14 sm:w-18 sm:h-18',
      speed: 1.1,
      rotation: 14,
    },

    // Top-Right Perimeter
    {
      id: 'mango-tile',
      name: 'Alphonso Mangoes',
      url: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=320&auto=format&fit=crop&q=80',
      fallbackUrl: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=320&auto=format&fit=crop&q=80',
      top: '16px',
      right: '24px',
      size: 'w-18 h-18 sm:w-24 sm:h-24',
      speed: 0.9,
      rotation: 8,
    },
    {
      id: 'maize-tile',
      name: 'Karnataka Yellow Maize',
      url: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=320&auto=format&fit=crop&q=80',
      fallbackUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=320&auto=format&fit=crop&q=80',
      top: '110px',
      right: '60px',
      size: 'w-16 h-16 sm:w-22 sm:h-22',
      speed: 1.3,
      rotation: -10,
    },
    {
      id: 'pomegranate-tile',
      name: 'Ruby Pomegranate',
      url: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=320&auto=format&fit=crop&q=80',
      fallbackUrl: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=320&auto=format&fit=crop&q=80',
      top: '220px',
      right: '20px',
      size: 'w-16 h-16 sm:w-20 sm:h-20',
      speed: 0.7,
      rotation: 12,
    },
    {
      id: 'banana-tile',
      name: 'Fresh Robusta Bananas',
      url: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=320&auto=format&fit=crop&q=80',
      fallbackUrl: 'https://images.unsplash.com/photo-1596363505729-4190a9506133?w=320&auto=format&fit=crop&q=80',
      top: '320px',
      right: '54px',
      size: 'w-16 h-16 sm:w-22 sm:h-22',
      speed: 1.0,
      rotation: -6,
    },

    // Bottom Perimeter Accents
    {
      id: 'arecanut-tile',
      name: 'Channagiri Arecanuts',
      url: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?w=320&auto=format&fit=crop&q=80',
      fallbackUrl: 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=320&auto=format&fit=crop&q=80',
      bottom: '16px',
      left: '12%',
      size: 'w-14 h-14 sm:w-20 sm:h-20',
      speed: 0.5,
      rotation: 5,
    },
    {
      id: 'turmeric-tile',
      name: 'Golden Farm Turmeric',
      url: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=320&auto=format&fit=crop&q=80',
      fallbackUrl: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=320&auto=format&fit=crop&q=80',
      bottom: '16px',
      right: '12%',
      size: 'w-14 h-14 sm:w-20 sm:h-20',
      speed: 0.7,
      rotation: -8,
    },
  ];

  // Dynamic theme-aware backdrop opacity so text remains 100% legible
  const getOverlayClass = () => {
    switch (colorTheme) {
      case 'bright-white':
        return 'bg-white/85';
      case 'pure-black':
        return 'bg-black/80';
      case 'forest-dark':
        return 'bg-[#071C11]/85';
      case 'fresh-lime':
        return 'bg-[#15803D]/80';
      case 'harvest-gold':
        return 'bg-[#713F12]/80';
      case 'earth-brown':
        return 'bg-[#5F2B0C]/80';
      case 'classic-green':
      default:
        return 'bg-[#14532D]/80';
    }
  };

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0"
    >
      {/* Background Farm Landscape Vignette */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-overlay transition-opacity duration-700"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1600&auto=format&fit=crop&q=80')`,
          transform: motionEnabled 
            ? `translate3d(${-offset.x * 0.2}px, ${-offset.y * 0.2}px, 0)` 
            : 'none',
          transition: 'transform 0.2s cubic-bezier(0.25, 1, 0.5, 1)',
        }}
      />

      {/* Floating Produce Photo Tiles with Subtle Pointer Parallax */}
      {tiles.map((tile) => {
        const transX = motionEnabled ? offset.x * tile.speed : 0;
        const transY = motionEnabled ? offset.y * tile.speed : 0;

        return (
          <div
            key={tile.id}
            className={`absolute ${tile.size} rounded-2xl overflow-hidden shadow-lg border border-white/20 dark:border-white/10 opacity-70 hover:opacity-100 transition-opacity duration-300 hidden sm:block`}
            style={{
              top: tile.top,
              bottom: tile.bottom,
              left: tile.left,
              right: tile.right,
              transform: `translate3d(${transX}px, ${transY}px, 0) rotate(${tile.rotation}deg)`,
              transition: 'transform 0.15s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.2s ease',
              backdropFilter: 'blur(2px)',
            }}
          >
            <img
              src={tile.url}
              alt={tile.name}
              loading="lazy"
              onError={(e) => {
                // Graceful fallback to secondary photo
                const target = e.currentTarget;
                if (target.src !== tile.fallbackUrl) {
                  target.src = tile.fallbackUrl;
                }
              }}
              className="w-full h-full object-cover rounded-2xl transform scale-105"
            />
            {/* Subtle soft gradient overlay on tile for organic integration */}
            <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
          </div>
        );
      })}

      {/* Theme-aware readable scrim layer to ensure hero text contrast is crystal clear */}
      <div className={`absolute inset-0 ${getOverlayClass()} transition-colors duration-500`} />

      {/* Subtle agricultural grid dot pattern */}
      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ffffff_1.2px,transparent_1.2px)] [background-size:24px_24px] pointer-events-none" />
    </div>
  );
};
