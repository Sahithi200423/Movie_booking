/**
 * CineBook Version 2.0 — Premium Cinematic 3D Design Tokens
 * 
 * Centralized design tokens providing type-safe access to color palettes,
 * 3D perspective values, elevations, glows, and movie-adaptive ambient defaults.
 */

export const CINEMA_COLORS = {
  // Deep Obsidian Backgrounds
  obsidian: {
    base: '#07080B',       // Deepest auditorium black
    surface1: '#0E1017',   // Primary card background
    surface2: '#141722',   // Elevated card / modal background
    surface3: '#1C202F',   // Interactive element background (pills, tabs)
    surface4: '#252B3E',   // Hover / active elevated layer
  },
  
  // Cinematic Brand Accents
  accent: {
    primary: '#3B82F6',       // Electric Cinema Cobalt
    primaryLight: '#60A5FA',
    primaryDark: '#1D4ED8',
    cyan: '#06B6D4',          // Laser IMAX Cyan
    cyanLight: '#22D3EE',
    cyanGlow: 'rgba(6, 182, 212, 0.35)',
  },

  // Premium Seat & Ticket Tier Metallics
  metallic: {
    gold: {
      base: '#F59E0B',
      light: '#FDE68A',
      dark: '#B45309',
      gradient: 'linear-gradient(135deg, #FDE68A 0%, #D97706 50%, #78350F 100%)',
      glow: 'rgba(245, 158, 11, 0.35)',
    },
    platinum: {
      base: '#94A3B8',
      light: '#F1F5F9',
      dark: '#475569',
      gradient: 'linear-gradient(135deg, #FFFFFF 0%, #94A3B8 50%, #334155 100%)',
      glow: 'rgba(148, 163, 184, 0.25)',
    },
    bronze: {
      base: '#D97706',
      light: '#FCD34D',
      dark: '#92400E',
      gradient: 'linear-gradient(135deg, #FDE68A 0%, #B45309 60%, #451A03 100%)',
      glow: 'rgba(217, 119, 6, 0.25)',
    },
  },

  // State & Indicator Accents
  status: {
    ruby: '#F43F5E',          // Live countdown warning / seat held
    rubyGlow: 'rgba(244, 63, 94, 0.35)',
    emerald: '#10B981',       // Available seat / confirmed pass
    emeraldGlow: 'rgba(16, 185, 129, 0.35)',
    amber: '#F59E0B',
  },

  // Neutral Light Mode Fallbacks
  light: {
    base: '#F8FAFC',
    surface1: '#FFFFFF',
    surface2: '#F1F5F9',
    surface3: '#E2E8F0',
    surface4: '#CBD5E1',
    border: '#E2E8F0',
    textPrimary: '#0F172A',
    textSecondary: '#475569',
  },
} as const;

/**
 * Fallback defaults for future Movie-Adaptive Theme Engine (Phase 2)
 */
export const MOVIE_AMBIENT_DEFAULTS = {
  primary: '#3B82F6',
  secondary: '#8B5CF6',
  accent: '#06B6D4',
  glow: 'rgba(59, 130, 246, 0.25)',
  meshGradient: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(59, 130, 246, 0.25), transparent 70%)',
} as const;

/**
 * 3D Perspective and Transform Constants
 */
export const CINEMA_3D = {
  perspective: {
    tight: '500px',
    standard: '1000px',
    wide: '2000px',
  },
  cardTiltLimits: {
    maxRotationXDeg: 12,
    maxRotationYDeg: 12,
  },
  amphitheaterTiltDeg: 22,
} as const;

/**
 * Timing & Motion Tokens (Optimized for 60-120fps GPU transitions)
 */
export const CINEMA_MOTION = {
  duration: {
    fast: '150ms',
    normal: '250ms',
    smooth: '400ms',
    slow: '600ms',
  },
  easing: {
    springOut: 'cubic-bezier(0.16, 1, 0.3, 1)',
    cinematic: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
    smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const;

/**
 * Reusable Glassmorphism Styles (Lightweight for GPU performance)
 */
export const CINEMA_GLASS = {
  standard: {
    background: 'rgba(14, 16, 23, 0.75)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
  },
  elevated: {
    background: 'rgba(20, 23, 34, 0.85)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    boxShadow: 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.1), 0 16px 36px -10px rgba(0, 0, 0, 0.6)',
  },
  subtle: {
    background: 'rgba(255, 255, 255, 0.03)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
  },
} as const;
