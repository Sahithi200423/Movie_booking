import React, { useState, useEffect } from 'react';
import {
  Shield,
  Film,
  Building2,
  Ticket,
  DollarSign,
  Plus,
  CheckCircle2,
} from 'lucide-react';
import { fetchAdminStats, addMovie, type AdminDashboardStats } from '../features/admin/adminService';

export const AdminPage: React.FC = () => {
  const [stats, setStats] = useState<AdminDashboardStats>({
    totalBookings: 124,
    totalRevenue: 620.0,
    activeMovies: 5,
    totalTheatres: 4,
  });

  const [isAddMovieOpen, setIsAddMovieOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newGenre, setNewGenre] = useState('Action');
  const [newLang, setNewLang] = useState('Telugu');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchAdminStats().then(setStats);
  }, []);

  const handleCreateMovie = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    const slug = newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const res = await addMovie({
      title: newTitle,
      slug,
      synopsis: 'A high-octane cinematic journey scheduled at ₹5 per ticket.',
      duration_minutes: 150,
      languages: [newLang],
      genres: [newGenre],
      certification: 'UA',
      rating: 8.5,
      votes_count: 50,
      poster_url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
      status: 'now_showing',
    });

    if (res.success) {
      setMessage(`Movie "${newTitle}" registered in database!`);
      setNewTitle('');
      setIsAddMovieOpen(false);
      setStats((prev) => ({ ...prev, activeMovies: prev.activeMovies + 1 }));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
              <Shield className="w-4 h-4" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              CineBook Administration Console
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage catalogue, theatres, screens, and inspect system revenue metrics.
          </p>
        </div>

        <button
          onClick={() => setIsAddMovieOpen(true)}
          className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 shadow-sm flex items-center gap-1.5 self-start cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Movie</span>
        </button>
      </div>

      {message && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{message}</span>
        </div>
      )}

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-[#121318] border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Bookings</span>
            <Ticket className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2">
            {stats.totalBookings}
          </div>
          <span className="text-[10px] text-emerald-500 font-semibold">100% Verified DB Records</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#121318] border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Gross Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2">
            ₹{stats.totalRevenue.toFixed(2)}
          </div>
          <span className="text-[10px] text-slate-400 font-semibold">Calculated @ ₹5 / seat</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#121318] border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Active Movies</span>
            <Film className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2">
            {stats.activeMovies}
          </div>
          <span className="text-[10px] text-slate-400">Now Showing in Theatres</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#121318] border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Active Theatres</span>
            <Building2 className="w-4 h-4 text-sky-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2">
            {stats.totalTheatres}
          </div>
          <span className="text-[10px] text-slate-400">Hyderabad, Mumbai, BLR</span>
        </div>
      </div>

      {/* Quick Add Movie Modal */}
      {isAddMovieOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#13141A] border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-xl">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Register New Movie</h3>
            <form onSubmit={handleCreateMovie} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Movie Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Game Changer"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Primary Language</label>
                  <select
                    value={newLang}
                    onChange={(e) => setNewLang(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  >
                    <option>Telugu</option>
                    <option>Hindi</option>
                    <option>Tamil</option>
                    <option>English</option>
                    <option>Malayalam</option>
                    <option>Kannada</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Genre</label>
                  <select
                    value={newGenre}
                    onChange={(e) => setNewGenre(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  >
                    <option>Action</option>
                    <option>Sci-Fi</option>
                    <option>Drama</option>
                    <option>Comedy</option>
                    <option>Thriller</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddMovieOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold"
                >
                  Save Movie
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
