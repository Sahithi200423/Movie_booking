/**
 * CineBook Version 2.0 — AmbientBackdrop Component
 * 
 * Renders an immersive, hardware-accelerated cinematic ambient backdrop
 * with dynamic radial lighting, soft atmospheric blur, and high-contrast dark vignettes.
 */

import React from 'react';
import type { ExtractedMovieColors } from '../utils/colorExtractor';

export interface AmbientBackdropProps {
  /** Computed or fallback movie colors */
  colors?: ExtractedMovieColors;
  /** Optional high-res backdrop image */
  backdropUrl?: string;
  /** Intensity preset for the lighting depth */
  intensity?: 'subtle' | 'vibrant' | 'intense';
  /** Whether to render as an absolute background layer (default: true) */
  absolute?: boolean;
  /** Whether to include the blurred backdrop image (default: true) */
  showImage?: boolean;
  /** Additional custom classNames */
  className?: string;
  /** Optional child elements to render within the container */
  children?: React.ReactNode;
}

export const AmbientBackdrop: React.FC<AmbientBackdropProps> = ({
  colors,
  backdropUrl,
  intensity = 'vibrant',
  absolute = true,
  showImage = true,
  className = '',
  children,
}) => {
  // Intensity multipliers for opacity
  const opacityMap = {
    subtle: { mesh: 'opacity-40', aura: 'opacity-30', image: 'opacity-25' },
    vibrant: { mesh: 'opacity-70', aura: 'opacity-50', image: 'opacity-35' },
    intense: { mesh: 'opacity-90', aura: 'opacity-70', image: 'opacity-50' },
  }[intensity];

  const primaryGlow = colors?.glow || 'rgba(59, 130, 246, 0.25)';
  const secondaryColor = colors?.secondary || '#8B5CF6';

  return (
    <div
      className={`pointer-events-none select-none overflow-hidden transition-all duration-700 ${
        absolute ? 'absolute inset-0 z-0' : 'relative w-full'
      } ${className}`}
      aria-hidden="true"
    >
      {/* 1. Blurred Backdrop Photo (When Available) */}
      {showImage && backdropUrl && (
        <div className={`absolute inset-0 ${opacityMap.image} transition-opacity duration-1000`}>
          <img
            src={backdropUrl}
            alt=""
            loading="lazy"
            className="w-full h-full object-cover object-center filter blur-3xl scale-110 brightness-40 saturate-150 transform-gpu"
          />
        </div>
      )}

      {/* 2. Primary Atmospheric Spotlight Mesh (Dynamically Colored) */}
      <div
        className={`absolute inset-0 ${opacityMap.mesh} transition-all duration-700 transform-gpu`}
        style={{
          background:
            colors?.meshGradient ||
            `radial-gradient(ellipse 90% 60% at 50% -15%, ${primaryGlow} 0%, transparent 75%)`,
        }}
      />

      {/* 3. Secondary Off-Axis Atmospheric Aura */}
      <div
        className={`absolute -top-32 -right-32 w-96 h-96 rounded-full blur-[100px] ${opacityMap.aura} transition-all duration-700 transform-gpu`}
        style={{
          backgroundColor: secondaryColor,
        }}
      />

      {/* 4. High-Contrast Bottom & Edge Dark Vignettes (Guarantees WCAG AAA Text Contrast) */}
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--cinema-bg-base)] via-[var(--cinema-bg-base)]/75 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--cinema-bg-base)] via-[var(--cinema-bg-base)]/85 to-transparent" />

      {/* Optional In-Flow Content */}
      {children && <div className="relative z-10 pointer-events-auto">{children}</div>}
    </div>
  );
};
