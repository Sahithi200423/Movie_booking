import React, { useState } from 'react';
import { X, User, Lock, Mail, Phone, ShieldCheck, Sparkles, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, register, loginDemo, isLoading } = useAuth();
  const [tab, setTab] = useState<'signin' | 'register' | 'demo'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    try {
      await login(email, password);
      setSuccessMessage('Logged in successfully!');
      setTimeout(() => {
        onClose();
      }, 700);
    } catch (err: unknown) {
      setErrorMessage((err as Error).message || 'Failed to sign in');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    try {
      await register(name, email, password, phone);
      setSuccessMessage('Account created and logged in!');
      setTimeout(() => {
        onClose();
      }, 700);
    } catch (err: unknown) {
      setErrorMessage((err as Error).message || 'Registration failed');
    }
  };

  const handleDemo = async (role: 'user' | 'admin') => {
    setErrorMessage('');
    setSuccessMessage('');
    try {
      await loginDemo(role);
      setSuccessMessage(`Logged in as Demo ${role === 'admin' ? 'Administrator' : 'Moviegoer'}!`);
      setTimeout(() => {
        onClose();
      }, 700);
    } catch (err: unknown) {
      setErrorMessage((err as Error).message || 'Demo login failed');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#090A0F]/80 backdrop-blur-md animate-in fade-in duration-200 cursor-pointer"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-md rounded-2xl border border-white/10 shadow-2xl overflow-hidden bg-[#14161F] text-slate-100 transition-colors cursor-default"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg tracking-tight text-white">CineBook Account</h3>
              <p className="text-xs text-slate-400">Access bookings, tickets & cinema controls</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-white/10 bg-[#0E1017]">
          <button
            onClick={() => { setTab('signin'); setErrorMessage(''); }}
            className={`flex-1 py-3 text-xs font-semibold tracking-wider uppercase transition-colors border-b-2 cursor-pointer ${
              tab === 'signin'
                ? 'border-blue-500 text-blue-400 bg-[#14161F]'
                : 'border-transparent text-slate-400 hover:text-slate-300'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setTab('register'); setErrorMessage(''); }}
            className={`flex-1 py-3 text-xs font-semibold tracking-wider uppercase transition-colors border-b-2 cursor-pointer ${
              tab === 'register'
                ? 'border-blue-500 text-blue-400 bg-[#14161F]'
                : 'border-transparent text-slate-400 hover:text-slate-300'
            }`}
          >
            Register
          </button>
          <button
            onClick={() => { setTab('demo'); setErrorMessage(''); }}
            className={`flex-1 py-3 text-xs font-semibold tracking-wider uppercase transition-colors border-b-2 flex items-center justify-center gap-1 cursor-pointer ${
              tab === 'demo'
                ? 'border-blue-500 text-blue-400 bg-[#14161F]'
                : 'border-transparent text-slate-400 hover:text-slate-300'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-400" /> 1-Click Demo
          </button>
        </div>

        {/* Alert Notifications */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3 rounded-xl text-xs font-medium bg-rose-500/10 border border-rose-500/30 text-rose-400">
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="mx-6 mt-4 p-3 rounded-xl text-xs font-medium bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            {successMessage}
          </div>
        )}

        {/* Body Content */}
        <div className="p-6">
          {tab === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="user@cinebook.com"
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-white/10 bg-[#1C1F2B] text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-white/10 bg-[#1C1F2B] text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-full font-bold text-sm bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sign In to CineBook'}
              </button>
            </form>
          )}

          {tab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Alex Morgan"
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-white/10 bg-[#1C1F2B] text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="alex@example.com"
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-white/10 bg-[#1C1F2B] text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-white/10 bg-[#1C1F2B] text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Password (Min 6 chars)</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-white/10 bg-[#1C1F2B] text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-full font-bold text-sm bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create CineBook Account'}
              </button>
            </form>
          )}

          {tab === 'demo' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-400 text-center">
                Select an account role below to immediately test all booking, ticket management, and cinema administration capabilities.
              </p>

              <button
                onClick={() => handleDemo('user')}
                disabled={isLoading}
                className="w-full p-4 rounded-xl border border-white/10 text-left transition-all group hover:border-blue-500/60 bg-[#1C1F2B] hover:bg-[#252a3a] cursor-pointer"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2 font-bold text-sm text-white">
                    <User className="w-4 h-4 text-blue-400" /> Demo Moviegoer
                  </div>
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-blue-600/20 text-blue-300 border border-blue-500/30 font-semibold">
                    Regular User
                  </span>
                </div>
                <div className="text-xs text-slate-400">
                  Email: <span className="font-mono text-slate-300">user@cinebook.com</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Browse movies, book seats, view tickets, and test ticket cancellations.
                </p>
              </button>

              <button
                onClick={() => handleDemo('admin')}
                disabled={isLoading}
                className="w-full p-4 rounded-xl border border-white/10 text-left transition-all group hover:border-blue-500/60 bg-[#1C1F2B] hover:bg-[#252a3a] cursor-pointer"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2 font-bold text-sm text-white">
                    <ShieldCheck className="w-4 h-4 text-purple-400" /> Cinema Administrator
                  </div>
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-semibold">
                    Admin Portal
                  </span>
                </div>
                <div className="text-xs text-slate-400">
                  Email: <span className="font-mono text-slate-300">admin@cinebook.com</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Access live revenue metrics, manage movie catalogue, and audit bookings.
                </p>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
