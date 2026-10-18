/**
 * CineBook Version 2.0 — Movie-Adaptive Color Extraction & Fallback Engine
 * 
 * Safely extracts vibrant primary, secondary, and ambient glow accents from
 * movie posters and backdrops. Handles cross-origin restrictions gracefully
 * with zero UI blocking, cached lookups, and curated cinema fallbacks.
 */

import { CINEMA_COLORS, MOVIE_AMBIENT_DEFAULTS } from '../styles/tokens.ts';
import type { Movie } from '../types/index.ts';

export interface ExtractedMovieColors {
  primary: string;       // Primary dominant cinema accent (hex)
  secondary: string;     // Complementary atmospheric secondary (hex)
  accent: string;        // Highlight glow (hex)
  glow: string;          // Soft rgba radial glow
  meshGradient: string;  // Full ambient backdrop CSS radial gradient
  isExtracted: boolean;  // Whether colors were extracted from canvas vs curated fallback
}

/**
 * Curated signature palettes for seeded blockbuster catalog
 * Guaranteed instant display with zero network overhead.
 */
export const CURATED_MOVIE_PALETTES: Record<string, Omit<ExtractedMovieColors, 'isExtracted'>> = {
  // Kalki 2898 AD: Dystopian cosmic amber & electric sci-fi cobalt
  'kalki-2898': {
    primary: '#3B82F6',
    secondary: '#D97706',
    accent: '#06B6D4',
    glow: 'rgba(59, 130, 246, 0.28)',
    meshGradient: 'radial-gradient(ellipse 90% 60% at 50% -15%, rgba(59, 130, 246, 0.35) 0%, rgba(217, 119, 6, 0.18) 50%, transparent 80%)',
  },
  // Stree 2: Eerie phantom emerald & haunted midnight purple
  'stree-2': {
    primary: '#10B981',
    secondary: '#8B5CF6',
    accent: '#34D399',
    glow: 'rgba(16, 185, 129, 0.26)',
    meshGradient: 'radial-gradient(ellipse 90% 60% at 50% -15%, rgba(16, 185, 129, 0.32) 0%, rgba(139, 92, 246, 0.22) 50%, transparent 80%)',
  },
  // Dune: Part Two: Arrakis desert spice gold, fiery amber & solar bronze
  'dune-2': {
    primary: '#F59E0B',
    secondary: '#EA580C',
    accent: '#FDE68A',
    glow: 'rgba(245, 158, 11, 0.30)',
    meshGradient: 'radial-gradient(ellipse 90% 60% at 50% -15%, rgba(245, 158, 11, 0.38) 0%, rgba(234, 88, 12, 0.22) 50%, transparent 80%)',
  },
  // Devara: Part 1: Oceanic blood-red tides & nautical deep teal
  'devara-part-1': {
    primary: '#E11D48',
    secondary: '#0D9488',
    accent: '#F43F5E',
    glow: 'rgba(225, 29, 72, 0.28)',
    meshGradient: 'radial-gradient(ellipse 90% 60% at 50% -15%, rgba(225, 29, 72, 0.34) 0%, rgba(13, 148, 136, 0.22) 50%, transparent 80%)',
  },
  // Deadpool & Wolverine: Mercenary crimson & laser mutant yellow
  'deadpool-wolverine': {
    primary: '#DC2626',
    secondary: '#EAB308',
    accent: '#F87171',
    glow: 'rgba(220, 38, 38, 0.30)',
    meshGradient: 'radial-gradient(ellipse 90% 60% at 50% -15%, rgba(220, 38, 38, 0.38) 0%, rgba(234, 179, 8, 0.22) 50%, transparent 80%)',
  },
  // Pushpa 2: Seshachalam forest emerald, scarlet sandalwood & raw gold
  'pushpa-2': {
    primary: '#B91C1C',
    secondary: '#047857',
    accent: '#F59E0B',
    glow: 'rgba(185, 28, 28, 0.30)',
    meshGradient: 'radial-gradient(ellipse 90% 60% at 50% -15%, rgba(185, 28, 28, 0.35) 0%, rgba(4, 120, 87, 0.20) 50%, transparent 80%)',
  },
  // Joker: Folie à Deux: Gotham cabaret violet & toxic arterial ruby
  'joker-2': {
    primary: '#7C3AED',
    secondary: '#BE123C',
    accent: '#A78BFA',
    glow: 'rgba(124, 58, 237, 0.28)',
    meshGradient: 'radial-gradient(ellipse 90% 60% at 50% -15%, rgba(124, 58, 237, 0.35) 0%, rgba(190, 18, 60, 0.20) 50%, transparent 80%)',
  },
  // Gladiator II: Imperial Roman scarlet, colosseum sandstone gold & bronze
  'gladiator-2': {
    primary: '#D97706',
    secondary: '#991B1B',
    accent: '#FBBF24',
    glow: 'rgba(217, 119, 6, 0.30)',
    meshGradient: 'radial-gradient(ellipse 90% 60% at 50% -15%, rgba(217, 119, 6, 0.36) 0%, rgba(153, 27, 27, 0.24) 50%, transparent 80%)',
  },
  // Interstellar: Deep quantum obsidian blue & horizon singularity amber
  'interstellar': {
    primary: '#2563EB',
    secondary: '#4338CA',
    accent: '#60A5FA',
    glow: 'rgba(37, 99, 235, 0.28)',
    meshGradient: 'radial-gradient(ellipse 90% 60% at 50% -15%, rgba(37, 99, 235, 0.35) 0%, rgba(67, 56, 202, 0.22) 50%, transparent 80%)',
  },
};

/**
 * Genre-based fallback palette matrix
 */
export const GENRE_FALLBACK_PALETTES: Record<string, Omit<ExtractedMovieColors, 'isExtracted'>> = {
  'Sci-Fi': {
    primary: '#0284C7',
    secondary: '#7C3AED',
    accent: '#38BDF8',
    glow: 'rgba(2, 132, 199, 0.25)',
    meshGradient: 'radial-gradient(ellipse 85% 55% at 50% -15%, rgba(2, 132, 199, 0.32) 0%, rgba(124, 58, 237, 0.20) 50%, transparent 80%)',
  },
  'Horror': {
    primary: '#059669',
    secondary: '#831843',
    accent: '#34D399',
    glow: 'rgba(5, 150, 105, 0.25)',
    meshGradient: 'radial-gradient(ellipse 85% 55% at 50% -15%, rgba(5, 150, 105, 0.30) 0%, rgba(131, 24, 67, 0.22) 50%, transparent 80%)',
  },
  'Action': {
    primary: '#DC2626',
    secondary: '#D97706',
    accent: '#F87171',
    glow: 'rgba(220, 38, 38, 0.26)',
    meshGradient: 'radial-gradient(ellipse 85% 55% at 50% -15%, rgba(220, 38, 38, 0.32) 0%, rgba(217, 119, 6, 0.20) 50%, transparent 80%)',
  },
  'Comedy': {
    primary: '#D97706',
    secondary: '#2563EB',
    accent: '#FBBF24',
    glow: 'rgba(217, 119, 6, 0.24)',
    meshGradient: 'radial-gradient(ellipse 85% 55% at 50% -15%, rgba(217, 119, 6, 0.30) 0%, rgba(37, 99, 235, 0.18) 50%, transparent 80%)',
  },
  'Drama': {
    primary: '#4F46E5',
    secondary: '#9333EA',
    accent: '#818CF8',
    glow: 'rgba(79, 70, 229, 0.25)',
    meshGradient: 'radial-gradient(ellipse 85% 55% at 50% -15%, rgba(79, 70, 229, 0.32) 0%, rgba(147, 51, 234, 0.18) 50%, transparent 80%)',
  },
  'Thriller': {
    primary: '#B91C1C',
    secondary: '#1E293B',
    accent: '#EF4444',
    glow: 'rgba(185, 28, 28, 0.25)',
    meshGradient: 'radial-gradient(ellipse 85% 55% at 50% -15%, rgba(185, 28, 28, 0.30) 0%, rgba(30, 41, 59, 0.25) 50%, transparent 80%)',
  },
  'Adventure': {
    primary: '#0D9488',
    secondary: '#D97706',
    accent: '#2DD4BF',
    glow: 'rgba(13, 148, 136, 0.25)',
    meshGradient: 'radial-gradient(ellipse 85% 55% at 50% -15%, rgba(13, 148, 136, 0.32) 0%, rgba(217, 119, 6, 0.18) 50%, transparent 80%)',
  },
};

/**
 * Universal safe cinema fallback palette
 */
export const DEFAULT_CINEMA_PALETTE: ExtractedMovieColors = {
  primary: CINEMA_COLORS.accent.primary,
  secondary: '#8B5CF6',
  accent: CINEMA_COLORS.accent.cyan,
  glow: MOVIE_AMBIENT_DEFAULTS.glow,
  meshGradient: MOVIE_AMBIENT_DEFAULTS.meshGradient,
  isExtracted: false,
};

// In-memory LRU color cache across sessions/renders
const colorCache = new Map<string, ExtractedMovieColors>();

/**
 * Resolve the optimal fallback palette for a movie based on curated ID or genre.
 */
export function getMovieFallbackPalette(movie: Movie | null | undefined): ExtractedMovieColors {
  if (!movie) return { ...DEFAULT_CINEMA_PALETTE };

  // 1. Direct ID match
  if (CURATED_MOVIE_PALETTES[movie.id]) {
    return {
      ...CURATED_MOVIE_PALETTES[movie.id],
      isExtracted: false,
    };
  }

  // 2. Genre match
  if (movie.genre && movie.genre.length > 0) {
    for (const g of movie.genre) {
      if (GENRE_FALLBACK_PALETTES[g]) {
        return {
          ...GENRE_FALLBACK_PALETTES[g],
          isExtracted: false,
        };
      }
    }
  }

  return { ...DEFAULT_CINEMA_PALETTE };
}

/**
 * Helper: Convert RGB components to Hex string
 */
function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Helper: Calculate perceived luminance (0-255)
 */
function getLuminance(r: number, g: number, b: number): number {
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

/**
 * Helper: Calculate color saturation (0-1)
 */
function getSaturation(r: number, g: number, b: number): number {
  const max = Math.max(r, g, b) / 255;
  const min = Math.min(r, g, b) / 255;
  if (max === min) return 0;
  const l = (max + min) / 2;
  const d = max - min;
  return l > 0.5 ? d / (2 - max - min) : d / (max + min);
}

/**
 * Extract vibrant ambient colors from an image URL via HTML5 Canvas.
 * Non-blocking, CORS-safe, and gracefully falls back on security errors.
 */
export async function extractColorsFromImageUrl(
  imageUrl: string,
  fallback: ExtractedMovieColors
): Promise<ExtractedMovieColors> {
  if (!imageUrl) return fallback;

  // Check cache first
  if (colorCache.has(imageUrl)) {
    return colorCache.get(imageUrl)!;
  }

  return new Promise<ExtractedMovieColors>((resolve) => {
    // If not in a browser environment, return fallback
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      resolve(fallback);
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';

    // Timeout safety: if image doesn't load within 2.5 seconds, use fallback
    const timer = setTimeout(() => {
      resolve(fallback);
    }, 2500);

    img.onload = () => {
      clearTimeout(timer);
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) {
          resolve(fallback);
          return;
        }

        // Downsample to a small 40x40 grid for high-speed sampling with zero lag
        const sampleSize = 40;
        canvas.width = sampleSize;
        canvas.height = sampleSize;
        ctx.drawImage(img, 0, 0, sampleSize, sampleSize);

        const imgData = ctx.getImageData(0, 0, sampleSize, sampleSize);
        const data = imgData.data;

        // Bucket colors by vibrance and contrast suitable for dark cinema backdrops
        let bestPrimary = { r: 59, g: 130, b: 246, score: -1 };
        let bestSecondary = { r: 139, g: 92, b: 246, score: -1 };

        for (let i = 0; i < data.length; i += 16) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const a = data[i + 3];

          if (a < 128) continue;

          const lum = getLuminance(r, g, b);
          const sat = getSaturation(r, g, b);

          // Discard pure blacks, whites, and washed-out greys
          if (lum < 35 || lum > 215 || sat < 0.25) continue;

          // Vibrancy score: prioritize high saturation and moderate luminance
          const score = sat * 2.0 + (1 - Math.abs(lum - 120) / 120);

          if (score > bestPrimary.score) {
            bestSecondary = { ...bestPrimary };
            bestPrimary = { r, g, b, score };
          } else if (score > bestSecondary.score && Math.abs(r - bestPrimary.r) + Math.abs(g - bestPrimary.g) > 60) {
            bestSecondary = { r, g, b, score };
          }
        }

        // If no candidate scored well, use fallback
        if (bestPrimary.score < 0) {
          colorCache.set(imageUrl, fallback);
          resolve(fallback);
          return;
        }

        const primaryHex = rgbToHex(bestPrimary.r, bestPrimary.g, bestPrimary.b);
        const secondaryHex = bestSecondary.score > 0
          ? rgbToHex(bestSecondary.r, bestSecondary.g, bestSecondary.b)
          : fallback.secondary;

        const glowRgba = `rgba(${bestPrimary.r}, ${bestPrimary.g}, ${bestPrimary.b}, 0.28)`;
        const mesh = `radial-gradient(ellipse 90% 60% at 50% -15%, rgba(${bestPrimary.r}, ${bestPrimary.g}, ${bestPrimary.b}, 0.35) 0%, rgba(${bestSecondary.r}, ${bestSecondary.g}, ${bestSecondary.b}, 0.20) 50%, transparent 80%)`;

        const result: ExtractedMovieColors = {
          primary: primaryHex,
          secondary: secondaryHex,
          accent: primaryHex,
          glow: glowRgba,
          meshGradient: mesh,
          isExtracted: true,
        };

        colorCache.set(imageUrl, result);
        resolve(result);
      } catch (_err) {
        // Handle SecurityError / CORS canvas taint gracefully without crashing
        colorCache.set(imageUrl, fallback);
        resolve(fallback);
      }
    };

    img.onerror = () => {
      clearTimeout(timer);
      colorCache.set(imageUrl, fallback);
      resolve(fallback);
    };

    img.src = imageUrl;
  });
}
