import React, { useState } from 'react';
import { X, Mail, Lock, User, Sparkles, CheckCircle2, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { isSupabaseConfigured } from '../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { signInWithEmail, signUpWithEmail, signInAsDemo } = useAuth();
  const [tab, setTab] = useState<'signin' | 'signup' | 'demo'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    if (tab === 'signin') {
      const { error } = await signInWithEmail(email, password);
      if (error) {
        setErrorMsg(error.message);
      } else {
        setSuccessMsg('Signed in successfully!');
        setTimeout(onClose, 600);
      }
    } else {
      const { error } = await signUpWithEmail(email, password, fullName);
      if (error) {
        setErrorMsg(error.message);
      } else {
        setSuccessMsg('Account created successfully! You are now logged in.');
        setTimeout(onClose, 600);
      }
    }
    setLoading(false);
  };

  const handleDemoSelect = (role: 'customer' | 'admin') => {
    signInAsDemo(role);
    setSuccessMsg(`Logged in as Demo ${role === 'admin' ? 'Administrator' : 'Customer'}!`);
    setTimeout(onClose, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-[#13141A] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
        {/* Header Banner */}
        <div className="p-6 pb-4 bg-gradient-to-r from-rose-600/10 via-red-500/10 to-transparent border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {tab === 'demo' ? 'Quick Demo Login' : tab === 'signin' ? 'Welcome to CineBook' : 'Create Account'}
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Instant ₹5 tickets with Supabase Authentication
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-6 pt-2">
          <button
            onClick={() => {
              setTab('signin');
              setErrorMsg('');
            }}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 cursor-pointer ${
              tab === 'signin'
                ? 'border-rose-500 text-rose-600 dark:text-rose-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setTab('signup');
              setErrorMsg('');
            }}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 cursor-pointer ${
              tab === 'signup'
                ? 'border-rose-500 text-rose-600 dark:text-rose-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Register
          </button>
          <button
            onClick={() => {
              setTab('demo');
              setErrorMsg('');
            }}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1 ${
              tab === 'demo'
                ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>1-Click Demo</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl text-xs font-medium bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{successMsg}</span>
            </div>
          )}

          {tab === 'demo' ? (
            <div className="space-y-3">
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Test CineBook immediately without typing passwords. Click below to sign in:
              </p>

              <button
                type="button"
                onClick={() => handleDemoSelect('customer')}
                className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-rose-500/50 dark:hover:border-rose-500/50 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between text-left transition-all hover:scale-[1.01] cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center font-bold">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">Customer Account</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">rahul.verma@cinebook.in • Standard Customer</p>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-rose-500">Sign In →</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoSelect('admin')}
                className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 dark:hover:border-amber-500/50 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between text-left transition-all hover:scale-[1.01] cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">Administrator Account</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">admin@cinebook.in • Full Admin Access</p>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-amber-500">Sign In →</span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {tab === 'signup' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Verma"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 shadow-md shadow-rose-600/20 active:scale-98 transition-all disabled:opacity-50 cursor-pointer"
              >
                {loading ? 'Processing...' : tab === 'signin' ? 'Sign In to CineBook' : 'Create Free Account'}
              </button>
            </form>
          )}

          {!isSupabaseConfigured() && (
            <p className="text-[11px] text-center text-slate-400 dark:text-slate-500">
              💡 Tip: Supabase Auth is enabled with graceful instant demo fallback for local preview.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
