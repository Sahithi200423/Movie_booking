import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Ticket,
  Film,
  Flame,
  Calendar,
  CheckCircle2,
  Database,
  Lock,
} from 'lucide-react';
import { MovieCard } from '../components/MovieCard';
import { fetchMovies } from '../features/movies/moviesService';
import { useLanguage } from '../contexts/LanguageContext';
import type { Movie } from '../types';

export const HomePage: React.FC = () => {
  const { t } = useLanguage();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'Telugu' | 'Hindi' | 'English' | 'Action' | 'Sci-Fi'>('all');
  const [loading, setLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  useEffect(() => {
    fetchMovies().then((data) => {
      setMovies(data);
      setLoading(false);
      if (data.length > 0) setSelectedMovie(data[0]);
    });
  }, []);

  const nowShowingMovies = movies.filter((m) => m.status === 'now_showing');
  const comingSoonMovies = movies.filter((m) => m.status === 'coming_soon');

  const filteredNowShowing = nowShowingMovies.filter((movie) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'Action' || activeTab === 'Sci-Fi') {
      return movie.genres.includes(activeTab);
    }
    return movie.languages.includes(activeTab);
  });

  return (
    <div className="space-y-12 pb-16">
      {/* Cinematic Hero Banner */}
      <section className="relative overflow-hidden bg-slate-950 text-white py-16 sm:py-24 border-b border-slate-800">
        <div className="absolute inset-0 z-0 opacity-25">
          <img
            src="https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1920&q=80"
            alt="Hero Cinema Backdrop"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/60" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/25 text-rose-400 text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              <span>CineBook • Flat ₹5 Movie Ticket Revolution</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
              {t('hero.title')}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-red-400 to-amber-400">
                At Just ₹5
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              {t('hero.subtitle')} Complete with real-time 10-minute atomic seat reservations and digital QR turnstile passes.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#now-showing"
                className="px-6 py-3 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 shadow-lg shadow-rose-600/30 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Film className="w-4 h-4" />
                <span>Explore Movies (₹5)</span>
              </a>

              <a
                href="#architecture"
                className="px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 transition-all flex items-center gap-2"
              >
                <Database className="w-4 h-4 text-emerald-400" />
                <span>Database Schema</span>
              </a>
            </div>

            {/* Quick Stat Pill */}
            <div className="pt-4 flex items-center gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-rose-500" />
                <span>₹5 Ticket Formula</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-amber-500" />
                <span>10-Min Temporary Locks</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>PostgreSQL RLS Security</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Now Showing Section */}
      <section id="now-showing" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-rose-500" />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                {t('section.now_showing')}
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Select any movie to begin the ₹5 ticket reservation flow.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            {(['all', 'Telugu', 'Hindi', 'English', 'Action', 'Sci-Fi'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === tab
                    ? 'bg-rose-600 text-white font-bold shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                {tab === 'all' ? 'All Titles' : tab}
              </button>
            ))}
          </div>
        </div>

        {/* Movie Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="aspect-[2/3] rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {filteredNowShowing.map((movie) => (
              <MovieCard key={movie.id} movie={movie} onSelectMovie={setSelectedMovie} />
            ))}
          </div>
        )}
      </section>

      {/* Selected Movie Detail Modal / Preview Drawer */}
      {selectedMovie && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute right-0 top-0 w-1/2 h-full opacity-20 pointer-events-none">
              <img
                src={selectedMovie.backdrop_url || selectedMovie.poster_url}
                alt={selectedMovie.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="relative z-10 max-w-2xl space-y-4">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold">
                  Featured Spotlight • ₹5
                </span>
                <span className="text-xs text-slate-400">{selectedMovie.certification}</span>
                <span className="text-xs text-slate-400">• {selectedMovie.duration_minutes} mins</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold">{selectedMovie.title}</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {selectedMovie.synopsis}
              </p>

              <div className="flex flex-wrap gap-2 text-xs">
                {selectedMovie.languages.map((l) => (
                  <span key={l} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {l}
                  </span>
                ))}
              </div>

              <div className="pt-2 flex items-center gap-3">
                <div className="p-3 rounded-xl bg-rose-600/20 border border-rose-500/30 text-xs font-medium text-rose-300 flex items-center gap-2">
                  <Ticket className="w-4 h-4 text-rose-400" />
                  <span>Flat ₹5 Booking Ticket Foundation Ready</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Coming Soon Section */}
      {comingSoonMovies.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-amber-500" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {t('section.coming_soon')}
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {comingSoonMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </section>
      )}

      {/* Database Schema & Architecture Explainer (Stage 1 Requirement) */}
      <section id="architecture" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#111217] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                CineBook Architecture & Supabase Schema
              </h2>
              <p className="text-xs text-slate-500">
                Stage 1 foundation: Clean entity-relationship model with atomic seat concurrency.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 space-y-2">
              <h4 className="font-bold text-rose-500 flex items-center gap-1.5">
                <Ticket className="w-4 h-4" />
                Critical Seat Design
              </h4>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Physical seats belong to screens, while show availability is separated into{' '}
                <code className="text-rose-400 font-mono text-[11px]">show_seats</code>. A seat can be AVAILABLE for Show 1, BOOKED for Show 2, and BLOCKED with a 10-minute hold for Show 3.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 space-y-2">
              <h4 className="font-bold text-amber-500 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                ₹5 Ticket Price Rule
              </h4>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Every ticket base price is ₹5. Total booking amounts are calculated through the formula:{' '}
                <code className="text-amber-400 font-mono text-[11px]">(ticket_count × 5.00) - discount + charges</code>. Never hard-coded on the client.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 space-y-2">
              <h4 className="font-bold text-emerald-500 flex items-center gap-1.5">
                <Lock className="w-4 h-4" />
                PostgreSQL RLS Security
              </h4>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Row Level Security strictly isolates customer orders. Users cannot modify another customer's booking or mark their own payment as successful.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
