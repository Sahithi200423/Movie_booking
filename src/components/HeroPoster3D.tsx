import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Play, Sparkles } from 'lucide-react';
import type { Movie } from '../types';
import { use3DTilt } from '../hooks/use3DTilt';

interface HeroPoster3DProps {
  movie: Movie;
  ambientColor?: string;
  ambientGlow?: string;
}

export const HeroPoster3D: React.FC<HeroPoster3DProps> = ({
  movie,
  ambientColor = '#3B82F6',
  ambientGlow = 'rgba(59, 130, 246, 0.35)',
}) => {
  const navigate = useNavigate();

  // Subtle 3D tilt for large Hero poster (5–6° max tilt for sophisticated feel)
  const {
    cardRef,
    glareRef,
    onMouseMove,
    onMouseEnter,
    onMouseLeave,
    onFocus,
    onBlur,
  } = use3DTilt({
    maxTiltDeg: 6,
    perspective: 1200,
    scale: 1.02,
    glare: true,
    returnSpeed: 500,
  });

  const handleClick = () => {
    navigate(`/movie/${movie.id}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  const primaryFormat = movie.formats && movie.formats.length > 0 ? movie.formats[0] : null;

  return (
    <div className="perspective-1000 relative flex justify-center items-center py-4 select-none">
      {/* Dynamic Ambient Back-Glow Halo */}
      <div
        className="absolute -inset-4 rounded-3xl opacity-40 blur-2xl transition-all duration-700 pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${ambientColor} 0%, ${ambientGlow} 50%, transparent 80%)`,
        }}
        aria-hidden="true"
      />

      {/* 3D Tilt Card */}
      <div
        ref={cardRef}
        role="button"
        tabIndex={0}
        aria-label={`Featured movie poster for ${movie.title}. Press Enter to view movie details.`}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onMouseMove={onMouseMove}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onFocus={onFocus}
        onBlur={onBlur}
        className="relative w-64 sm:w-72 lg:w-80 aspect-[2/3] rounded-3xl overflow-hidden border border-white/20 bg-[#11131A] shadow-[0_24px_50px_-12px_rgba(0,0,0,0.85)] hover:border-white/40 cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none transition-colors duration-300 preserve-3d"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Poster Image */}
        <img
          src={movie.posterUrl}
          alt={movie.title}
          loading="eager"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Cinematic Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30 opacity-75 pointer-events-none" />

        {/* Specular Glare Reflection */}
        <div
          ref={glareRef}
          className="absolute inset-0 pointer-events-none opacity-0 z-20 transition-opacity"
          aria-hidden="true"
        />

        {/* Floating Rating Badge (translateZ pop) */}
        <div
          style={{ transform: 'translateZ(28px)' }}
          className="absolute top-4 left-4 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-xl backdrop-blur-md bg-black/85 border border-white/20 text-amber-400 font-bold text-xs shadow-xl"
        >
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{movie.rating.toFixed(1)}</span>
          <span className="text-[10px] text-slate-300 font-normal">/ 10</span>
        </div>

        {/* Floating Featured Spotlight Tag (translateZ pop) */}
        <div
          style={{ transform: 'translateZ(26px)' }}
          className="absolute top-4 right-4 z-20 flex items-center gap-1 px-2.5 py-1 rounded-xl backdrop-blur-md bg-blue-600/90 border border-blue-400/40 text-white font-bold text-[10px] uppercase tracking-wider shadow-lg"
        >
          <Sparkles className="w-3 h-3 text-blue-200" />
          <span>Spotlight</span>
        </div>

        {/* Bottom Floating Info Overlay (translateZ pop) */}
        <div
          style={{ transform: 'translateZ(22px)' }}
          className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between"
        >
          {primaryFormat && (
            <span className="px-3 py-1 rounded-full text-xs font-bold tracking-tight bg-black/85 border border-white/20 text-blue-300 backdrop-blur-md shadow-md">
              {primaryFormat}
            </span>
          )}

          <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 hover:bg-white/30 border border-white/30 text-white backdrop-blur-md shadow-md transition-colors">
            <Play className="w-3 h-3 fill-white" />
            <span>Preview</span>
          </span>
        </div>
      </div>
    </div>
  );
};
