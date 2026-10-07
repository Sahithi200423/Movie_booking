import React from 'react';
import { Link } from 'react-router-dom';
import { Film, Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4 border border-amber-500/20">
        <Film className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-black text-white tracking-tight mb-2">404</h1>
      <h2 className="text-xl font-bold text-slate-300 mb-2">Scene Not Found</h2>
      <p className="text-sm text-slate-400 mb-6 max-w-sm">
        The reel you are looking for doesn't exist or has been archived from CineBook.
      </p>
      <Link
        to="/"
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-sm hover:bg-amber-400 transition-colors shadow-md"
      >
        <Home className="w-4 h-4" />
        <span>Return to Home</span>
      </Link>
    </div>
  );
};
