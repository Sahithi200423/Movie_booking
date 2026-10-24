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

  // Intelligently prefetch downstream route chunks on user hover/focus
  const preloadNextRoutes = () => {
    import('../pages/MovieDetailsPage');
    import('../pages/SeatSelectionPage');
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    preloadNextRoutes();
    onMouseEnter(e);
  };

  const handleFocus = () => {
    preloadNextRoutes();
    onFocus();
  };

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
        data-cursor="VIEW"
        aria-label={`${movie.title}, rated ${movie.rating.toFixed(1)} out of 10. Press Enter to view movie details.`}
        onClick={handleViewDetails}
        onKeyDown={handleKeyDown}
        onMouseMove={onMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={onMouseLeave}
        onFocus={handleFocus}
        onBlur={onBlur}
        className="relative flex flex-col rounded-2xl overflow-hidden border border-slate-200 dark:border-[#C7A675]/15 bg-white dark:bg-[#15171B] shadow-sm dark:shadow-[0_16px_36px_-12px_rgba(0,0,0,0.8)] hover:border-[#C7A675]/60 hover:shadow-2xl hover:shadow-[#C7A675]/15 focus-visible:ring-2 focus-visible:ring-[#C7A675] focus-visible:outline-none transition-colors duration-300 cursor-pointer preserve-3d"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Poster Image Container with 3D Depth */}
        <div className="relative aspect-[2/3] w-full overflow-hidden bg-slate-900 preserve-3d">
          <img
            src={movie.posterUrl}
            alt={movie.title}
            width={300}
            height={450}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            onError={(e) => {
              const target = e.currentTarget;
              target.onerror = null;
              target.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22300%22%20height%3D%22450%22%20viewBox%3D%220%200%20300%20450%22%3E%3Crect%20fill%3D%22%2315171B%22%20width%3D%22300%22%20height%3D%22450%22%2F%3E%3Ccircle%20cx%3D%22150%22%20cy%3D%22200%22%20r%3D%2240%22%20fill%3D%22none%22%20stroke%3D%22%23C7A675%22%20stroke-width%3D%222%22%2F%3E%3Ctext%20x%3D%22150%22%20y%3D%22270%22%20fill%3D%22%23DFC49D%22%20font-family%3D%22sans-serif%22%20font-size%3D%2214%22%20font-weight%3D%22bold%22%20text-anchor%3D%22middle%22%20letter-spacing%3D%222%22%3ECINEBOOK%3C%2Ftext%3E%3C%2Fsvg%3E';
            }}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />

          {/* Cinematic Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#08090B] via-black/25 to-black/35 opacity-85 group-hover:opacity-65 transition-opacity duration-300 pointer-events-none" />

          {/* Specular Glare Reflection (Tracks Cursor 3D Light) */}
          <div
            ref={glareRef}
            className="absolute inset-0 pointer-events-none opacity-0 z-20 transition-opacity"
            aria-hidden="true"
          />

          {/* Floating Rating Badge (Layer 1 with 3D Pop translateZ) */}
          <div
            style={{ transform: 'translateZ(26px)' }}
            className="absolute top-3 left-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-xl backdrop-blur-md bg-[#08090B]/85 border border-[#C7A675]/30 text-[#C7A675] font-bold text-xs shadow-lg shadow-black/60 font-mono"
          >
            <Star className="w-3.5 h-3.5 fill-[#C7A675] text-[#C7A675]" />
            <span className="text-[#F3F0E8]">{movie.rating.toFixed(1)}</span>
            {movie.votesCount && (
              <span className="text-[10px] text-[#A8ADB4] font-normal">({movie.votesCount})</span>
            )}
          </div>

          {/* Age Rating & Language Tag (Layer 2 with translateZ) */}
          <div
            style={{ transform: 'translateZ(22px)' }}
            className="absolute top-3 right-3 z-20 flex items-center gap-1.5"
          >
            {movie.ageRating && (
              <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider backdrop-blur-md bg-[#08090B]/80 border border-white/15 text-[#F3F0E8] shadow-sm">
                {movie.ageRating}
              </span>
            )}
            <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider backdrop-blur-md bg-[#15171B]/95 text-[#C7A675] border border-[#C7A675]/40 shadow-sm font-mono">
              {movie.language}
              {movie.languages && movie.languages.length > 1 && (
                <span className="ml-1 opacity-80 font-normal">+{movie.languages.length - 1}</span>
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
                  className="px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase bg-[#08090B]/90 border border-[#C7A675]/30 text-[#C7A675] backdrop-blur-md shadow-sm font-mono"
                >
                  {format}
                </span>
              ))}
              {availableFormats.length > 2 && (
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#08090B]/90 border border-white/10 text-[#A8ADB4] backdrop-blur-md font-mono">
                  +{availableFormats.length - 2}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Movie Info & Details Container */}
        <div
          style={{ transform: 'translateZ(12px)' }}
          className="p-4 sm:p-5 flex-1 flex flex-col justify-between bg-white dark:bg-[#15171B] border-t border-slate-100 dark:border-[#C7A675]/10"
        >
          <div>
            {/* Duration & Genres */}
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-[#A8ADB4] mb-2">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#C7A675]" />
                <span className="text-slate-700 dark:text-[#F3F0E8] font-medium font-mono text-[11px]">{movie.duration}</span>
              </div>
              <span className="truncate max-w-[140px] font-semibold text-[#C7A675] text-[11px] uppercase tracking-wider font-mono">
                {movie.genre.slice(0, 2).join(' • ')}
              </span>
            </div>

            {/* Title */}
            <h3 className="font-bold text-base sm:text-lg tracking-wide text-slate-900 dark:text-[#F3F0E8] font-display group-hover:text-[#C7A675] transition-colors line-clamp-1">
              {movie.title}
            </h3>

            {/* Tagline */}
            <p className="mt-1.5 text-xs text-slate-600 dark:text-[#A8ADB4] line-clamp-2 leading-relaxed font-sans">
              {movie.tagline}
            </p>
          </div>

          {/* Interactive Action Bar */}
          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-[#C7A675]/15 grid grid-cols-2 gap-2">
            <Link
              to={`/movie/${movie.id}`}
              onClick={(e) => e.stopPropagation()}
              data-cursor="DETAILS"
              className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-xl border border-slate-200 dark:border-[#C7A675]/25 bg-slate-100 dark:bg-[#08090B] text-slate-700 dark:text-[#F3F0E8] hover:border-[#C7A675] hover:bg-slate-200 dark:hover:bg-[#1A1D24] hover:text-slate-900 dark:hover:text-[#C7A675] active:scale-95 transition-all focus-visible:ring-2 focus-visible:ring-[#C7A675] focus-visible:outline-none btn-tactile"
            >
              <Eye className="w-3.5 h-3.5 text-[#C7A675]" />
              <span>Details</span>
            </Link>

            {movie.status === 'now_showing' ? (
              <button
                type="button"
                data-cursor="BOOK"
                onClick={handleBookNow}
                className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold rounded-xl transition-all bg-[#C7A675] hover:bg-[#D4B585] text-[#08090B] shadow-md shadow-[#C7A675]/20 active:scale-95 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#C7A675] focus-visible:outline-none btn-tactile"
              >
                <Ticket className="w-3.5 h-3.5 fill-[#08090B]" />
                <span>Book</span>
              </button>
            ) : (
              <button
                type="button"
                data-cursor="EXPLORE"
                onClick={handleViewDetails}
                className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-xl border border-[#C7A675]/40 text-[#C7A675] bg-[#C7A675]/10 hover:bg-[#C7A675]/20 active:scale-95 cursor-pointer transition-colors focus-visible:ring-2 focus-visible:ring-[#C7A675] focus-visible:outline-none btn-tactile"
              >
                <span>Explore</span>
                <ArrowRight className="w-3 h-3 text-[#C7A675]" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
