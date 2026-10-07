import React from 'react';
import { Star, Clock, Ticket } from 'lucide-react';
import type { Movie } from '../types';

interface MovieCardProps {
  movie: Movie;
  onSelectMovie?: (movie: Movie) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie, onSelectMovie }) => {
  return (
    <div
      onClick={() => onSelectMovie && onSelectMovie(movie)}
      className="group relative flex flex-col rounded-2xl overflow-hidden bg-white dark:bg-[#13141A] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-rose-500/40 dark:hover:border-rose-500/40 transition-all duration-300 cursor-pointer"
    >
      {/* Poster Media */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-slate-900">
        <img
          src={movie.poster_url}
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Rating Badge */}
        <div className="absolute top-2.5 left-2.5 px-2 py-1 rounded-lg backdrop-blur-md bg-black/70 border border-white/10 flex items-center gap-1 shadow-md">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span className="text-xs font-bold text-white">{movie.rating.toFixed(1)}</span>
        </div>

        {/* ₹5 Flat Price Guarantee Tag */}
        <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-gradient-to-r from-rose-600 to-red-500 text-white font-extrabold text-xs shadow-lg shadow-rose-600/30 flex items-center gap-1">
          <Ticket className="w-3 h-3" />
          <span>₹5 Only</span>
        </div>

        {/* Certification */}
        <div className="absolute bottom-2.5 left-2.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-black/60 text-slate-300 backdrop-blur-xs border border-white/10">
          {movie.certification}
        </div>

        {/* Duration */}
        <div className="absolute bottom-2.5 right-2.5 px-1.5 py-0.5 rounded text-[10px] font-medium bg-black/60 text-slate-300 backdrop-blur-xs flex items-center gap-1">
          <Clock className="w-2.5 h-2.5" />
          <span>{movie.duration_minutes}m</span>
        </div>
      </div>

      {/* Movie Details */}
      <div className="p-3.5 flex flex-col flex-1 justify-between gap-2.5">
        <div>
          <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white line-clamp-1 group-hover:text-rose-500 transition-colors">
            {movie.title}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
            {movie.genres.join(' • ')}
          </p>
        </div>

        {/* Language Tags & CTA */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 overflow-hidden">
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 truncate max-w-[120px]">
              {movie.languages.slice(0, 2).join(', ')}
              {movie.languages.length > 2 && ` +${movie.languages.length - 2}`}
            </span>
          </div>

          <button
            type="button"
            className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 active:scale-95 transition-all shadow-xs shrink-0"
          >
            Book ₹5
          </button>
        </div>
      </div>
    </div>
  );
};
