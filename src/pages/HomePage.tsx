import React, { useState, useMemo } from 'react';
import {
  Play,
  Filter,
  MapPin,
  CheckCircle2,
  Tv
} from 'lucide-react';

import { MOVIES, GENRES, LANGUAGES, getCinemasForCity } from '../data/mockData';
import { MovieCard } from '../components/MovieCard';
import { Floating3DHero } from '../components/Floating3DHero';
import { useBooking } from '../context/BookingContext';
import { useTranslation } from '../context/LanguageContext';
import { useScrollReveal } from '../hooks/useScrollReveal';

export const HomePage: React.FC = () => {
  const { currentCity } = useBooking();
  const { t, isRTL } = useTranslation();

  const cityCinemas = useMemo(() => getCinemasForCity(currentCity), [currentCity]);

  const nowShowingRef = useScrollReveal<HTMLElement>(0.1);
  const comingSoonRef = useScrollReveal<HTMLElement>(0.1);
  const cinemasRef = useScrollReveal<HTMLElement>(0.1);

  const [activeTab, setActiveTab] = useState<'all' | 'now_showing' | 'coming_soon'>('all');
  const [selectedGenre, setSelectedGenre] = useState('All Genres');
  const [selectedLanguage, setSelectedLanguage] = useState('All Languages');
  const [searchQuery, setSearchQuery] = useState('');
  const [trailerModalMovie, setTrailerModalMovie] = useState<string | null>(null);

  // Featured Hero movie (e.g. Kalki)
  const featuredMovie = useMemo(() => MOVIES.find(m => m.featured) || MOVIES[0], []);
  const [activeHeroMovie, setActiveHeroMovie] = useState(featuredMovie);

  // Filtered movies
  const filteredMovies = useMemo(() => {
    return MOVIES.filter(movie => {
      // Tab filter
      if (activeTab === 'now_showing' && movie.status !== 'now_showing') return false;
      if (activeTab === 'coming_soon' && movie.status !== 'coming_soon') return false;

      // Genre filter
      if (selectedGenre !== 'All Genres' && !movie.genre.includes(selectedGenre)) return false;

      // Language filter
      if (selectedLanguage !== 'All Languages') {
        const matchesLanguage =
          (movie.languages && movie.languages.some(l => l.toLowerCase() === selectedLanguage.toLowerCase())) ||
          movie.language.toLowerCase() === selectedLanguage.toLowerCase();
        if (!matchesLanguage) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = movie.title.toLowerCase().includes(q);
        const matchesDirector = movie.director.toLowerCase().includes(q);
        const matchesCast = movie.cast.some(c => c.name.toLowerCase().includes(q));
        if (!matchesTitle && !matchesDirector && !matchesCast) return false;
      }

      return true;
    });
  }, [activeTab, selectedGenre, selectedLanguage, searchQuery]);

  const nowShowingMovies = useMemo(() => filteredMovies.filter(m => m.status === 'now_showing'), [filteredMovies]);
  const comingSoonMovies = useMemo(() => filteredMovies.filter(m => m.status === 'coming_soon'), [filteredMovies]);

  return (
    <div className={`min-h-screen overflow-x-hidden bg-[var(--cinema-bg-base)] text-slate-100 ${isRTL ? 'rtl' : 'ltr'}`}>
      
      {/* 1. CINEBOOK V3 SIGNATURE FLOATING 3D HERO (AURAL LUXURY HARDWARE INSPIRED) */}
      <section className="relative border-b border-white/10">
        <Floating3DHero
          movies={MOVIES}
          activeMovie={activeHeroMovie}
          onSelectMovie={setActiveHeroMovie}
          onOpenTrailer={setTrailerModalMovie}
        />
      </section>

      {/* 2. FILTER & SEARCH CONTROL BAR */}
      <section id="explore-movies-grid" className="sticky top-16 sm:top-18 z-30 bg-slate-50/98 dark:bg-[#08090B]/95 md:backdrop-blur-md border-b border-slate-200 dark:border-[#C7A675]/15 py-4 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Main Category Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white dark:bg-[#15171B] border border-slate-200 dark:border-[#C7A675]/20 shadow-sm dark:shadow-none w-full sm:w-auto overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab('all')}
              data-cursor="ALL"
              className={`whitespace-nowrap shrink-0 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-[#C7A675] text-[#08090B] shadow-md font-bold'
                  : 'text-slate-600 dark:text-[#A8ADB4] hover:text-slate-900 dark:hover:text-[#F3F0E8] hover:bg-slate-100 dark:hover:bg-[#1A1D24]'
              }`}
            >
              All Movies ({MOVIES.length})
            </button>
            <button
              onClick={() => setActiveTab('now_showing')}
              data-cursor="NOW"
              className={`whitespace-nowrap shrink-0 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'now_showing'
                  ? 'bg-[#C7A675] text-[#08090B] shadow-md font-bold'
                  : 'text-slate-600 dark:text-[#A8ADB4] hover:text-slate-900 dark:hover:text-[#F3F0E8] hover:bg-slate-100 dark:hover:bg-[#1A1D24]'
              }`}
            >
              {t.nav.nowShowing} ({MOVIES.filter(m => m.status === 'now_showing').length})
            </button>
            <button
              onClick={() => setActiveTab('coming_soon')}
              data-cursor="SOON"
              className={`whitespace-nowrap shrink-0 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'coming_soon'
                  ? 'bg-[#C7A675] text-[#08090B] shadow-md font-bold'
                  : 'text-slate-600 dark:text-[#A8ADB4] hover:text-slate-900 dark:hover:text-[#F3F0E8] hover:bg-slate-100 dark:hover:bg-[#1A1D24]'
              }`}
            >
              {t.nav.comingSoon} ({MOVIES.filter(m => m.status === 'coming_soon').length})
            </button>
          </div>

          {/* Quick Filter Selectors */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-start sm:justify-end overflow-x-auto no-scrollbar pb-1 sm:pb-0">
            
            {/* Genre filter */}
            <div className="relative">
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="appearance-none bg-white dark:bg-[#15171B] border border-slate-200 dark:border-[#C7A675]/20 hover:border-[#C7A675]/60 text-xs sm:text-sm rounded-xl px-3.5 py-2.5 pr-8 text-slate-800 dark:text-[#F3F0E8] outline-none focus:border-[#C7A675] cursor-pointer font-medium shadow-sm dark:shadow-none"
              >
                {GENRES.map(genre => (
                  <option key={genre} value={genre} className="bg-white dark:bg-[#15171B] text-slate-800 dark:text-[#F3F0E8]">
                    {genre === 'All Genres' ? t.home.allGenres : genre}
                  </option>
                ))}
              </select>
              <Filter className="w-3.5 h-3.5 text-[#C7A675] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Language filter */}
            <div className="relative">
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="appearance-none bg-white dark:bg-[#15171B] border border-slate-200 dark:border-[#C7A675]/20 hover:border-[#C7A675]/60 text-xs sm:text-sm rounded-xl px-3.5 py-2.5 pr-8 text-slate-800 dark:text-[#F3F0E8] outline-none focus:border-[#C7A675] cursor-pointer font-medium shadow-sm dark:shadow-none"
              >
                {LANGUAGES.map(lang => (
                  <option key={lang} value={lang} className="bg-white dark:bg-[#15171B] text-slate-800 dark:text-[#F3F0E8]">
                    {lang === 'All Languages' ? t.home.allLanguages : lang}
                  </option>
                ))}
              </select>
              <Tv className="w-3.5 h-3.5 text-[#C7A675] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Reset Filters button */}
            {(selectedGenre !== 'All Genres' || selectedLanguage !== 'All Languages' || activeTab !== 'all') && (
              <button
                onClick={() => {
                  setSelectedGenre('All Genres');
                  setSelectedLanguage('All Languages');
                  setActiveTab('all');
                  setSearchQuery('');
                }}
                className="text-xs text-[#C7A675] hover:underline px-2.5 py-1.5 font-semibold cursor-pointer font-mono"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 3. MAIN MOVIE GRIDS */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        
        {/* If Active Tab is 'all' or 'now_showing', render Now Showing */}
        {(activeTab === 'all' || activeTab === 'now_showing') && (
          <section id="now-showing" ref={nowShowingRef} className="scroll-mt-32 reveal-on-scroll">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-[#F3F0E8] font-display tracking-wider flex items-center gap-3">
                  <span className="w-2 h-6 bg-[#C7A675] rounded-full inline-block"></span>
                  {t.nav.nowShowing}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-[#A8ADB4] mt-1 font-sans">
                  Book tickets for today and upcoming dates in {currentCity}
                </p>
              </div>
              <span className="text-xs font-semibold text-[#C7A675] px-3.5 py-1.5 rounded-full bg-[#C7A675]/10 border border-[#C7A675]/30 font-mono">
                {nowShowingMovies.length} Available
              </span>
            </div>

            {nowShowingMovies.length === 0 ? (
              <div className="p-8 text-center rounded-2xl border border-slate-200 dark:border-[#C7A675]/15 bg-white dark:bg-[#15171B] shadow-sm">
                <p className="text-slate-600 dark:text-[#A8ADB4] text-sm">No now-showing movies match your selected filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {nowShowingMovies.map(movie => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            )}
          </section>
        )}

        {/* If Active Tab is 'all' or 'coming_soon', render Coming Soon */}
        {(activeTab === 'all' || activeTab === 'coming_soon') && (
          <section id="coming-soon" ref={comingSoonRef} className="scroll-mt-32 reveal-on-scroll">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-[#F3F0E8] font-display tracking-wider flex items-center gap-3">
                  <span className="w-2 h-6 bg-gradient-to-b from-[#C7A675] to-[#8C7043] rounded-full inline-block"></span>
                  {t.nav.comingSoon}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-[#A8ADB4] mt-1 font-sans">
                  Upcoming cinematic releases to look forward to
                </p>
              </div>
              <span className="text-xs font-semibold text-[#C7A675] px-3.5 py-1.5 rounded-full bg-[#C7A675]/10 border border-[#C7A675]/30 font-mono">
                {comingSoonMovies.length} Upcoming
              </span>
            </div>

            {comingSoonMovies.length === 0 ? (
              <div className="p-8 text-center rounded-2xl border border-slate-200 dark:border-[#C7A675]/15 bg-white dark:bg-[#15171B] shadow-sm">
                <p className="text-slate-600 dark:text-[#A8ADB4] text-sm">No upcoming movies match your selected filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {comingSoonMovies.map(movie => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            )}
          </section>
        )}

        {/* 4. CINEMAS & THEATRES SECTION */}
        <section id="cinemas-section" ref={cinemasRef} className="scroll-mt-32 pt-8 border-t border-slate-200 dark:border-[#C7A675]/15 reveal-on-scroll">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-[#F3F0E8] font-display tracking-wider flex items-center gap-3">
                <MapPin className="w-6 h-6 text-[#C7A675]" />
                Featured Theatres in {currentCity}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-[#A8ADB4] mt-1 font-sans">
                State-of-the-art auditoriums equipped with IMAX Laser 4K and Dolby Atmos
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cityCinemas.map(cinema => (
              <div
                key={cinema.id}
                data-cursor="THEATRE"
                className="p-6 rounded-2xl border border-slate-200 dark:border-[#C7A675]/20 bg-white dark:bg-[#15171B] hover:border-[#C7A675]/60 hover:shadow-2xl hover:shadow-[#C7A675]/10 transition-all flex flex-col justify-between group shadow-sm dark:shadow-md cursor-pointer"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-[#F3F0E8] font-display group-hover:text-[#C7A675] transition-colors">
                      {cinema.name}
                    </h3>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-[#08090B] border border-slate-200 dark:border-[#C7A675]/30 text-[#C7A675] font-semibold font-mono shrink-0">
                      {cinema.distance}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-[#A8ADB4] mt-2 flex items-center gap-1.5 font-sans">
                    <MapPin className="w-3.5 h-3.5 text-[#C7A675] shrink-0" />
                    <span>{cinema.address}</span>
                  </p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {cinema.facilities.map(fac => (
                      <span
                        key={fac}
                        className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-[#08090B] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-[#A8ADB4] font-medium font-mono"
                      >
                        {fac}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200 dark:border-[#C7A675]/15 flex items-center justify-between text-xs text-[#C7A675] font-semibold">
                  <span className="flex items-center gap-1.5 font-mono">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    M-Ticket & Instant Mobile Entry
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* Teaser Video Mock Modal */}
      {trailerModalMovie && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#08090B]/90 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl rounded-2xl overflow-hidden border border-[#C7A675]/30 bg-[#15171B] shadow-2xl">
            <div className="p-4 border-b border-[#C7A675]/20 flex items-center justify-between">
              <h4 className="font-bold text-[#F3F0E8] text-base flex items-center gap-2 font-display">
                <Play className="w-4 h-4 text-[#C7A675] fill-[#C7A675]" />
                <span>{trailerModalMovie} — Official Cinema Teaser</span>
              </h4>
              <button
                onClick={() => setTrailerModalMovie(null)}
                className="text-[#A8ADB4] hover:text-[#F3F0E8] px-2 py-1 rounded cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="aspect-video w-full bg-[#08090B] flex flex-col items-center justify-center text-center p-8">
              <div className="w-16 h-16 rounded-full bg-[#C7A675]/15 text-[#C7A675] border border-[#C7A675]/40 flex items-center justify-center mb-4 animate-pulse">
                <Play className="w-8 h-8 fill-[#C7A675] ml-1" />
              </div>
              <h5 className="font-bold text-lg text-[#F3F0E8] mb-1 font-display">Simulated 4K Cinema Teaser</h5>
              <p className="text-xs text-[#A8ADB4] max-w-md font-sans">
                Experience high-bitrate surround sound audio demo trailer for {trailerModalMovie}.
              </p>
              <button
                onClick={() => setTrailerModalMovie(null)}
                className="mt-6 px-6 py-2.5 text-xs font-bold rounded-full bg-[#C7A675] hover:bg-[#D4B585] text-[#08090B] cursor-pointer transition-all shadow-lg shadow-[#C7A675]/20 font-mono"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
