import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, Clock, Ticket, ArrowRight, Eye } from 'lucide-react';
import type { Movie } from '../types';

import { useBooking } from '../context/BookingContext';

interface MovieCardProps {
  movie: Movie;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const navigate = useNavigate();
  const { setActiveMovie } = useBooking();

  const handleBookNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveMovie(movie);
    navigate(`/movie/${movie.id}#showtimes`);
  };

  const handleViewDetails = () => {
    setActiveMovie(movie);
    navigate(`/movie/${movie.id}`);
  };

  return (
    <div
      onClick={handleViewDetails}
      className="group relative flex flex-col rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 bg-white dark:bg-[#14161F] shadow-sm dark:shadow-none hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/15 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer"
    >
      {/* Poster Image Container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-slate-900">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-85 group-hover:opacity-65 transition-opacity" />

        {/* Rating Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-xl backdrop-blur-md bg-black/80 border border-white/10 text-amber-400 font-bold text-xs shadow-md">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{movie.rating.toFixed(1)}</span>
          <span className="text-[10px] text-slate-300 font-normal">({movie.votesCount})</span>
        </div>

        {/* Age Rating & Language Tag */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider backdrop-blur-md bg-black/70 border border-white/10 text-white">
            {movie.ageRating}
          </span>
          <span className="px-2 py-0.5 rounded-lg text-[10px] font-semibold uppercase tracking-wider backdrop-blur-md bg-blue-600 text-white shadow-sm font-bold">
            {movie.language}
            {movie.languages && movie.languages.length > 1 && (
              <span className="ml-1 opacity-90 font-normal">+{movie.languages.length - 1}</span>
            )}
          </span>
        </div>

        {/* Formats Pills */}
        <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-1">
          {movie.formats.slice(0, 2).map(format => (
            <span
              key={format}
              className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-tight bg-black/70 border border-white/15 text-blue-300 backdrop-blur-sm"
            >
              {format}
            </span>
          ))}
          {movie.formats.length > 2 && (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-black/70 border border-white/15 text-slate-300">
              +{movie.formats.length - 2}
            </span>
          )}
        </div>
      </div>

      {/* Movie Details info */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Duration & Genres */}
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
              <span className="text-slate-700 dark:text-zinc-300 font-medium">{movie.duration}</span>
            </div>
            <span className="truncate max-w-[150px] font-semibold text-blue-600 dark:text-blue-400">
              {movie.genre.slice(0, 2).join(' • ')}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-semibold text-base sm:text-lg tracking-tight text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
            {movie.title}
          </h3>

          {/* Tagline / Snippet */}
          <p className="mt-1.5 text-xs text-slate-600 dark:text-zinc-300 line-clamp-2 leading-relaxed">
            {movie.tagline}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 pt-3 border-t border-slate-200 dark:border-white/10 grid grid-cols-2 gap-2">
          <Link
            to={`/movie/${movie.id}`}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-[#1C1F2B] text-slate-700 dark:text-slate-200 hover:border-blue-500/50 hover:bg-slate-200 dark:hover:bg-[#222634] hover:text-slate-900 dark:hover:text-white transition-all"
          >
            <Eye className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
            <span>Details</span>
          </Link>

          {movie.status === 'now_showing' ? (
            <button
              onClick={handleBookNow}
              className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold rounded-xl transition-all bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/25 active:scale-95 cursor-pointer"
            >
              <Ticket className="w-3.5 h-3.5 fill-white" />
              <span>Book</span>
            </button>
          ) : (
            <button
              onClick={handleViewDetails}
              className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-xl border border-blue-500/30 text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 cursor-pointer transition-colors"
            >
              <span>Explore</span>
              <ArrowRight className="w-3 h-3 text-blue-400" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
