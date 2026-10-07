import React from 'react';
import { Link } from 'react-router-dom';
import { Film, Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center font-bold">
        <Film className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">404</h1>
      <h2 className="text-lg font-bold text-slate-700 dark:text-slate-300">Page Not Found</h2>
      <p className="text-xs text-slate-500 max-w-sm">
        The screening or page you are looking for does not exist or has been relocated.
      </p>
      <Link
        to="/"
        className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 shadow-sm flex items-center gap-1.5 transition-colors"
      >
        <Home className="w-4 h-4" />
        <span>Return to CineBook Home</span>
      </Link>
    </div>
  );
};
