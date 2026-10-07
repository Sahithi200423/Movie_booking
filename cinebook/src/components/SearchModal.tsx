import React, { useState, useEffect } from 'react';
import { Search, X, Star, Film, ArrowRight } from 'lucide-react';
import { FALLBACK_MOVIES } from '../features/movies/moviesService';
import type { Movie } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMovie: (movie: Movie) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onSelectMovie }) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredMovies = FALLBACK_MOVIES.filter((m) => {
    const q = query.toLowerCase();
    return (
      m.title.toLowerCase().includes(q) ||
      m.genres.some((g) => g.toLowerCase().includes(q)) ||
      m.languages.some((l) => l.toLowerCase().includes(q))
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl rounded-2xl bg-white dark:bg-[#13141A] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-200 dark:border-slate-800">
          <Search className="w-5 h-5 text-rose-500 shrink-0" />
          <input
            autoFocus
            type="text"
            placeholder="Search movies, Telugu, Action, IMAX..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full text-sm bg-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Results */}
        <div className="max-h-96 overflow-y-auto p-2">
          {filteredMovies.length > 0 ? (
            <div className="space-y-1">
              {filteredMovies.map((movie) => (
                <button
                  key={movie.id}
                  onClick={() => {
                    onSelectMovie(movie);
                    onClose();
                  }}
                  className="w-full p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 flex items-center justify-between text-left transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={movie.poster_url}
                      alt={movie.title}
                      className="w-10 h-14 object-cover rounded-lg shadow-xs"
                    />
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-rose-500 transition-colors">
                        {movie.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-0.5 text-amber-500 font-bold">
                          <Star className="w-3 h-3 fill-current" />
                          {movie.rating}
                        </span>
                        <span>•</span>
                        <span>{movie.genres[0]}</span>
                        <span>•</span>
                        <span className="text-rose-500 font-semibold">₹5 Ticket</span>
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-rose-500 group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-slate-400 text-xs">
              <Film className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
              No movies matching "{query}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
