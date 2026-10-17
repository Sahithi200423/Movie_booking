import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, Clock, Ticket, ArrowRight, Eye } from 'lucide-react';
import type { Movie } from '../types';
import { useBooking } from '../context/BookingContext';
import { use3DTilt } from '../hooks/use3DTilt';

interface MovieCardProps {
  movie: Movie;
  /** Optional priority loading for above-the-fold posters */
  priority?: boolean;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie, priority = false }) => {
  const navigate = useNavigate();
  const { setActiveMovie } = useBooking();

  // 3D Perspective Tilt Engine (6–8° subtle tilt, specular lighting glare)
  const {
    cardRef,
    glareRef,
    onMouseMove,
    onMouseEnter,
    onMouseLeave,
    onFocus,
    onBlur
  } = use3DTilt({
    maxTiltDeg: 7,
    perspective: 1000,
    scale: 1.025,
    glare: true,
    returnSpeed: 450
  });

  const handleBookNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveMovie(movie);
    navigate(`/movie/${movie.id}#showtimes`);
  };

  const handleViewDetails = () => {
    setActiveMovie(movie);
    navigate(`/movie/${movie.id}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleViewDetails();
    }
  };

  // Safely extract existing formats without hardcoding unsupported technologies
  const availableFormats = Array.isArray(movie.formats) ? movie.formats.filter(Boolean) : [];

  return (
    <div className="perspective-1000 w-full group select-none">
      <div
        ref={cardRef}
        role="button"
        tabIndex={0}
        aria-label={`${movie.title}, rated ${movie.rating.toFixed(1)} out of 10. Press Enter to view movie details.`}
        onClick={handleViewDetails}
        onKeyDown={handleKeyDown}
        onMouseMove={onMouseMove}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onFocus={onFocus}
        onBlur={onBlur}
        className="relative flex flex-col rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 bg-white dark:bg-[#11131A] shadow-sm dark:shadow-[0_12px_32px_-8px_rgba(0,0,0,0.65)] hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/15 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none transition-colors duration-300 cursor-pointer preserve-3d"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Poster Image Container with 3D Depth */}
        <div className="relative aspect-[2/3] w-full overflow-hidden bg-slate-900 preserve-3d">
          <img
            src={movie.posterUrl}
            alt={movie.title}
            loading={priority ? 'eager' : 'lazy'}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />

          {/* Cinematic Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C10] via-black/20 to-black/30 opacity-80 group-hover:opacity-60 transition-opacity duration-300 pointer-events-none" />

          {/* Specular Glare Reflection (Tracks Cursor 3D Light) */}
          <div
            ref={glareRef}
            className="absolute inset-0 pointer-events-none opacity-0 z-20 transition-opacity"
            aria-hidden="true"
          />

          {/* Floating Rating Badge (Layer 1 with 3D Pop translateZ) */}
          <div
            style={{ transform: 'translateZ(26px)' }}
            className="absolute top-3 left-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-xl backdrop-blur-md bg-black/80 border border-white/15 text-amber-400 font-bold text-xs shadow-lg shadow-black/50"
          >
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{movie.rating.toFixed(1)}</span>
            {movie.votesCount && (
              <span className="text-[10px] text-slate-300 font-normal">({movie.votesCount})</span>
            )}
          </div>

          {/* Age Rating & Language Tag (Layer 2 with translateZ) */}
          <div
            style={{ transform: 'translateZ(22px)' }}
            className="absolute top-3 right-3 z-20 flex items-center gap-1.5"
          >
            {movie.ageRating && (
              <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider backdrop-blur-md bg-black/75 border border-white/15 text-white shadow-sm">
                {movie.ageRating}
              </span>
            )}
            <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider backdrop-blur-md bg-blue-600/90 text-white border border-blue-400/30 shadow-sm">
              {movie.language}
              {movie.languages && movie.languages.length > 1 && (
                <span className="ml-1 opacity-90 font-normal">+{movie.languages.length - 1}</span>
              )}
            </span>
          </div>

          {/* Formats Pills (Strictly from movie.formats, with translateZ depth) */}
          {availableFormats.length > 0 && (
            <div
              style={{ transform: 'translateZ(18px)' }}
              className="absolute bottom-3 left-3 right-3 z-20 flex flex-wrap gap-1.5 pointer-events-none"
            >
              {availableFormats.slice(0, 2).map((format) => (
                <span
                  key={format}
                  className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-tight bg-black/80 border border-white/15 text-blue-300 backdrop-blur-md shadow-sm"
                >
                  {format}
                </span>
              ))}
              {availableFormats.length > 2 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/80 border border-white/15 text-slate-300 backdrop-blur-md">
                  +{availableFormats.length - 2}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Movie Info & Details Container */}
        <div
          style={{ transform: 'translateZ(12px)' }}
          className="p-4 sm:p-5 flex-1 flex flex-col justify-between bg-white dark:bg-[#11131A] border-t border-slate-100 dark:border-white/5"
        >
          <div>
            {/* Duration & Genres */}
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
                <span className="text-slate-700 dark:text-zinc-300 font-medium">{movie.duration}</span>
              </div>
              <span className="truncate max-w-[140px] font-semibold text-blue-600 dark:text-blue-400">
                {movie.genre.slice(0, 2).join(' • ')}
              </span>
            </div>

            {/* Title */}
            <h3 className="font-bold text-base sm:text-lg tracking-tight text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
              {movie.title}
            </h3>

            {/* Tagline */}
            <p className="mt-1.5 text-xs text-slate-600 dark:text-zinc-300 line-clamp-2 leading-relaxed">
              {movie.tagline}
            </p>
          </div>

          {/* Interactive Action Bar */}
          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-white/10 grid grid-cols-2 gap-2">
            <Link
              to={`/movie/${movie.id}`}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-[#1A1D27] text-slate-700 dark:text-slate-200 hover:border-blue-500/50 hover:bg-slate-200 dark:hover:bg-[#232735] hover:text-slate-900 dark:hover:text-white active:scale-95 transition-all focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
            >
              <Eye className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
              <span>Details</span>
            </Link>

            {movie.status === 'now_showing' ? (
              <button
                type="button"
                onClick={handleBookNow}
                className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold rounded-xl transition-all bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30 active:scale-95 cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:outline-none"
              >
                <Ticket className="w-3.5 h-3.5 fill-white" />
                <span>Book</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleViewDetails}
                className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-xl border border-blue-500/30 text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 active:scale-95 cursor-pointer transition-colors focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:outline-none"
              >
                <span>Explore</span>
                <ArrowRight className="w-3 h-3 text-blue-400" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
