import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Database, CheckCircle2, XCircle, Loader2, RefreshCw, ExternalLink } from 'lucide-react';
import { checkHealthApi, API_BASE, type HealthStatus } from '../services/api';
import { supabase } from '../lib/supabase';

interface ConnectionState {
  status: 'loading' | 'connected' | 'failed';
  message: string;
  source?: 'backend' | 'supabase-client';
  healthData?: HealthStatus;
  errorMessage?: string;
  isWakingUp?: boolean;
}

interface SupabaseConnectionBadgeProps {
  compact?: boolean;
}

export const SupabaseConnectionBadge: React.FC<SupabaseConnectionBadgeProps> = ({ compact = false }) => {
  const [state, setState] = useState<ConnectionState>({
    status: 'loading',
    message: 'Testing connection...',
    isWakingUp: false,
  });
  const [showConfigHelp, setShowConfigHelp] = useState(false);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const testConnection = useCallback(async (isRetry = false) => {
    setState((prev) => ({
      ...prev,
      status: 'loading',
      message: isRetry ? 'Waking up CineBook backend...' : 'Checking Supabase connection...',
      isWakingUp: isRetry,
      errorMessage: undefined,
    }));

    // Step 1: Query backend /health (which performs a live database ping)
    try {
      const health = await checkHealthApi();

      if (health && health.ok) {
        console.log('✅ [CineBook API & Supabase Healthy]:', health);
        setState({
          status: 'connected',
          message: 'Supabase Connected ✓',
          source: 'backend',
          healthData: health,
          isWakingUp: false,
        });
        return;
      } else {
        throw new Error(health?.database || 'Database status reported unhealthy.');
      }
    } catch (backendErr: any) {
      console.warn('[Backend Health Check Notice]:', backendErr?.message || backendErr);

      // Step 2: Fallback to direct client-side Supabase if keys exist
      const directUrl = import.meta.env.VITE_SUPABASE_URL || '';
      const directKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

      if (directUrl && directKey && !directUrl.includes('placeholder') && !directUrl.includes('your_supabase_project_url')) {
        try {
          const { error } = await supabase.from('connection_test').select('*').limit(1);
          if (!error) {
            console.log('✅ [Direct Supabase Client Healthy]');
            setState({
              status: 'connected',
              message: 'Supabase Connected ✓',
              source: 'supabase-client',
              isWakingUp: false,
            });
            return;
          }
        } catch (directErr) {
          console.warn('[Direct Supabase Query Failed]:', directErr);
        }
      }

      // If this was the first try and it might be a cold start on Render free tier, do 1 automatic retry after 3s
      if (!isRetry) {
        setState({
          status: 'loading',
          message: 'Connecting to Render backend...',
          isWakingUp: true,
          errorMessage: 'Render free tier backend may be waking up from sleep (typically 30–50 seconds). Retrying...',
        });

        if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
        retryTimeoutRef.current = setTimeout(() => {
          testConnection(true);
        }, 3500);
        return;
      }

      // If backend is still unreachable
      const errMsg = backendErr?.message || 'Could not connect to CineBook backend.';
      setState({
        status: 'failed',
        message: 'Supabase Connection Failed',
        errorMessage: `${errMsg} (Target: ${API_BASE}/health)`,
        isWakingUp: false,
      });
    }
  }, []);

  useEffect(() => {
    testConnection();
    return () => {
      if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
    };
  }, [testConnection]);

  return (
    <div className="relative inline-flex items-center">
      {compact ? (
        state.status === 'loading' ? (
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center border border-slate-200 dark:border-white/10 bg-white dark:bg-[#1C1F2B] text-slate-500 animate-pulse"
            title="Checking database connection..."
          >
            <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
          </div>
        ) : state.status === 'connected' ? (
          <button
            type="button"
            onClick={() => setShowConfigHelp(!showConfigHelp)}
            className="w-10 h-10 rounded-xl flex items-center justify-center relative border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 transition-colors cursor-pointer"
            title="Database Connected ✓ (Click for details)"
            aria-label="Database Connected"
          >
            <Database className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#0E1017]"></span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setShowConfigHelp(!showConfigHelp)}
            className="w-10 h-10 rounded-xl flex items-center justify-center relative border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 transition-colors cursor-pointer"
            title="Database Connection Notice (Click for diagnostics)"
            aria-label="Database Connection Status"
          >
            <Database className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-[#0E1017]"></span>
          </button>
        )
      ) : (
        <>
          {state.status === 'loading' && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 animate-pulse">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-500" />
              <span>{state.message}</span>
            </div>
          )}

          {state.status === 'connected' && (
            <button
              type="button"
              onClick={() => setShowConfigHelp(!showConfigHelp)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 shadow-xs transition-colors cursor-pointer"
              title="Click to view connection info"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>{state.message}</span>
            </button>
          )}

          {state.status === 'failed' && (
            <div className="inline-flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setShowConfigHelp(!showConfigHelp)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/25 shadow-xs transition-colors cursor-pointer"
                title="Click for connection diagnostics"
              >
                <XCircle className="w-3.5 h-3.5 text-red-500" />
                <span>{state.message}</span>
              </button>

              <button
                type="button"
                onClick={() => testConnection(false)}
                className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                title="Retry Connection"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </>
      )}

      {/* Diagnostics Popover */}
      {showConfigHelp && (
        <div className="absolute top-full mt-2 right-0 z-50 w-80 sm:w-96 p-4 rounded-2xl bg-white dark:bg-[#151720] border border-slate-200 dark:border-slate-800 shadow-2xl text-xs space-y-3 animate-in fade-in duration-150 text-left">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
              <Database className="w-4 h-4 text-rose-500" />
              <span>CineBook Connectivity Details</span>
            </div>
            <button
              onClick={() => setShowConfigHelp(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              ✕
            </button>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
              <span className="font-semibold">Backend Endpoint:</span>
              <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[180px]" title={API_BASE}>
                {API_BASE}
              </span>
            </div>

            <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
              <span className="font-semibold">Supabase Database:</span>
              <span className="font-semibold text-emerald-500">
                {state.status === 'connected' ? 'Connected (via Render API)' : 'Disconnected'}
              </span>
            </div>

            {state.healthData && (
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-1 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                <div>Service: {state.healthData.service || 'CineBook API'}</div>
                <div>Status: {state.healthData.status}</div>
                {state.healthData.version && <div>Version: {state.healthData.version}</div>}
              </div>
            )}
          </div>

          {state.errorMessage && (
            <div className="p-2.5 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 font-mono text-[11px] break-words">
              {state.errorMessage}
            </div>
          )}

          <div className="space-y-1.5 text-slate-600 dark:text-slate-300 text-[11px]">
            <p className="font-semibold text-slate-800 dark:text-slate-200">Tips:</p>
            <ul className="list-disc pl-4 space-y-1 text-slate-500 dark:text-slate-400">
              <li>Render free-tier backends sleep after inactivity and need 30–50s to wake up.</li>
              <li>
                Check live backend status directly:{' '}
                <a
                  href={`${API_BASE}/health`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-rose-500 underline inline-flex items-center gap-0.5"
                >
                  /api/health <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>Ensure Vercel production has <code className="text-rose-500">VITE_API_URL</code> set.</li>
            </ul>
          </div>

          <div className="pt-2 flex justify-between items-center border-t border-slate-100 dark:border-slate-800">
            <span className="text-[10px] text-slate-400">CineBook Production System</span>
            <button
              onClick={() => testConnection(false)}
              className="px-3 py-1 rounded-lg text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 transition-colors"
            >
              Retry Check
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
