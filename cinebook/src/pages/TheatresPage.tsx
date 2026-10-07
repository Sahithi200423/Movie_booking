import React, { useState, useEffect } from 'react';
import { MapPin, Sparkles } from 'lucide-react';
import { fetchTheatres } from '../features/theatres/theatresService';
import type { Theatre } from '../types';

export const TheatresPage: React.FC = () => {
  const [theatres, setTheatres] = useState<Theatre[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTheatres().then((data) => {
      setTheatres(data);
      setLoading(false);
    });
  }, []);

  const cities = ['all', 'Hyderabad', 'Mumbai', 'Bengaluru'];
  const filteredTheatres =
    selectedCity === 'all'
      ? theatres
      : theatres.filter((t) => t.city.toLowerCase() === selectedCity.toLowerCase());

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Multiplex Theatres
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Experience premium IMAX Laser and Dolby Atmos projection at ₹5 flat ticket pricing.
          </p>
        </div>

        {/* City Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {cities.map((city) => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                selectedCity === city
                  ? 'bg-rose-600 text-white font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {city === 'all' ? 'All Cities' : city}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-44 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTheatres.map((theatre) => (
            <div
              key={theatre.id}
              className="p-5 rounded-2xl bg-white dark:bg-[#121318] border border-slate-200 dark:border-slate-800 shadow-xs hover:border-rose-500/40 dark:hover:border-rose-500/40 transition-all flex flex-col justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    {theatre.name}
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20 shrink-0">
                    {theatre.chain}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  <span className="line-clamp-1">{theatre.address}</span>
                </div>

                {/* Amenities */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {theatre.amenities.map((amenity) => (
                    <span
                      key={amenity}
                      className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  All Shows ₹5
                </span>

                <button
                  type="button"
                  className="px-3 py-1 rounded-lg text-xs font-semibold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                >
                  View Shows →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
