import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Star, Clock, Film, ArrowRight } from 'lucide-react';
import { MOVIES, GENRES, LANGUAGES } from '../data/mockData';
import type { Movie } from '../types';

import { useBooking } from '../context/BookingContext';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All Genres');
  const [selectedLanguage, setSelectedLanguage] = useState('All Languages');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { setActiveMovie } = useBooking();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setSearchTerm('');
    }
  }, [isOpen]);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
      if (e.key === '/' && !isOpen && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Filter movies
  const filteredMovies = MOVIES.filter(movie => {
    const matchesSearch =
      movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movie.director.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movie.cast.some(c => c.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      movie.genre.some(g => g.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesGenre = selectedGenre === 'All Genres' || movie.genre.includes(selectedGenre);

    const matchesLanguage =
      selectedLanguage === 'All Languages' ||
      (movie.languages && movie.languages.some(l => l.toLowerCase() === selectedLanguage.toLowerCase())) ||
      movie.language.toLowerCase() === selectedLanguage.toLowerCase();

    return matchesSearch && matchesGenre && matchesLanguage;
  });

  const handleSelectMovie = (movie: Movie) => {
    setActiveMovie(movie);
    onClose();
    navigate(`/movie/${movie.id}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-[#08090B]/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="fixed inset-0" 
        onClick={onClose} 
      />
      
      <div className="relative w-full max-w-2xl rounded-2xl shadow-2xl border border-[#C7A675]/30 overflow-hidden bg-[#15171B] text-[#F3F0E8] z-10 max-h-[80vh] flex flex-col">
        
        {/* Header Search Input */}
        <div className="p-4 border-b border-[#C7A675]/20 flex items-center gap-3">
          <Search className="w-5 h-5 text-[#C7A675] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by movie title, actor, director, genre..."
            className="flex-1 bg-transparent text-base outline-none text-[#F3F0E8] placeholder:text-[#A8ADB4]/60 font-medium font-sans"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="p-1 text-[#A8ADB4] hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border border-[#C7A675]/20 hover:bg-[#C7A675]/10 text-[#A8ADB4] hover:text-[#C7A675] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Quick Pills */}
        <div className="px-4 py-2.5 border-b border-white/10 bg-[#08090B] flex items-center gap-2 overflow-x-auto text-xs no-scrollbar">
          <span className="text-[#A8ADB4] text-[11px] font-semibold uppercase tracking-wider shrink-0 font-mono">Genre:</span>
          {GENRES.slice(0, 5).map(g => (
            <button
              key={g}
              onClick={() => setSelectedGenre(g)}
              className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors cursor-pointer font-mono ${
                selectedGenre === g
                  ? 'bg-[#C7A675] text-[#08090B] font-bold'
                  : 'bg-[#15171B] border border-[#C7A675]/20 text-[#A8ADB4] hover:bg-[#1A1D24] hover:text-[#F3F0E8]'
              }`}
            >
              {g}
            </button>
          ))}
          <div className="w-px h-4 bg-white/10 shrink-0 mx-1" />
          <span className="text-[#A8ADB4] text-[11px] font-semibold uppercase tracking-wider shrink-0 font-mono">Lang:</span>
          {LANGUAGES.slice(0, 4).map(l => (
            <button
              key={l}
              onClick={() => setSelectedLanguage(l)}
              className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors cursor-pointer font-mono ${
                selectedLanguage === l
                  ? 'bg-[#C7A675] text-[#08090B] font-bold'
                  : 'bg-[#15171B] border border-[#C7A675]/20 text-[#A8ADB4] hover:bg-[#1A1D24] hover:text-[#F3F0E8]'
              }`}
            >
              {l}
            </button>
          ))}
        </div>

        {/* Movie Results List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {filteredMovies.length === 0 ? (
            <div className="text-center py-12">
              <Film className="w-10 h-10 mx-auto text-[#A8ADB4]/40 mb-3" />
              <p className="text-base font-bold text-[#F3F0E8] font-display">No movies found</p>
              <p className="text-xs text-[#A8ADB4] mt-1 font-sans">
                Try searching for different keywords, actors, or reset filters.
              </p>
            </div>
          ) : (
            filteredMovies.map(movie => (
              <div
                key={movie.id}
                onClick={() => handleSelectMovie(movie)}
                className="flex items-center gap-3.5 p-2.5 rounded-xl hover:bg-[#08090B] border border-transparent hover:border-[#C7A675]/30 transition-all cursor-pointer group"
              >
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  className="w-12 h-16 rounded-lg object-cover shrink-0 bg-[#08090B] shadow-md border border-[#C7A675]/20"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-[#F3F0E8] font-display truncate group-hover:text-[#C7A675] transition-colors">
                      {movie.title}
                    </h4>
                    <span className="px-1.5 py-0.2 rounded text-[10px] bg-[#08090B] text-[#C7A675] font-semibold shrink-0 border border-[#C7A675]/30 font-mono">
                      {movie.ageRating}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-[#A8ADB4] mt-1 font-mono">
                    <span className="text-[#C7A675] font-medium flex items-center gap-1">
                      <Star className="w-3 h-3 fill-[#C7A675]" />
                      {movie.rating}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#C7A675]" />
                      {movie.duration}
                    </span>
                    <span className="truncate text-[11px] uppercase tracking-wider">{movie.genre.join(', ')}</span>
                  </div>
                  <p className="text-[11px] text-[#A8ADB4] truncate mt-0.5 font-sans">
                    Cast: {movie.cast.map(c => c.name).join(', ')}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-[#A8ADB4] group-hover:text-[#C7A675] group-hover:translate-x-0.5 transition-all shrink-0" />
              </div>
            ))
          )}
        </div>

        {/* Footer Hint */}
        <div className="p-3 bg-[#08090B] border-t border-[#C7A675]/15 text-xs text-[#A8ADB4] flex items-center justify-between font-mono">
          <span>{filteredMovies.length} movies available</span>
          <span className="text-[11px] text-[#A8ADB4]/60">Press ESC to dismiss</span>
        </div>
      </div>
    </div>
  );
};
