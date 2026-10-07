import React, { useEffect, useState } from 'react';
import { Database, CheckCircle2, XCircle, Loader2, RefreshCw } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ConnectionState {
  status: 'loading' | 'connected' | 'failed';
  message: string;
  testRow?: { id?: string; message?: string };
  errorMessage?: string;
}

export const SupabaseConnectionBadge: React.FC = () => {
  const [state, setState] = useState<ConnectionState>({
    status: 'loading',
    message: 'Testing Supabase connection...',
  });
  const [showConfigHelp, setShowConfigHelp] = useState(false);

  const testConnection = async () => {
    setState({ status: 'loading', message: 'Testing Supabase connection...' });

    // Step 1: Check if credentials are placeholders
    const url = import.meta.env.VITE_SUPABASE_URL || '';
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

    if (!url || !key || url.includes('your_supabase_project_url') || url.includes('placeholder')) {
      const err = 'Missing or placeholder Supabase credentials in .env (VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY required).';
      console.error('[Supabase Connection Error]:', err);
      setState({
        status: 'failed',
        message: 'Supabase Connection Failed',
        errorMessage: err,
      });
      return;
    }

    try {
      // Step 2: Query connection_test table
      const { data, error } = await supabase.from('connection_test').select('*').limit(1);

      if (error) {
        // If connection_test table does not exist, check fallback tables or report table missing
        if (error.code === '42P01' || error.message?.includes('does not exist')) {
          // Table doesn't exist yet, but let's check if the connection to the project itself works
          const { error: authError } = await supabase.auth.getSession();
          if (!authError) {
            console.warn('[Supabase Connection Notice]: Project reached, but `connection_test` table not found. Run supabase/migrations/20261005_connection_test.sql in Supabase SQL editor.');
            console.error('[Supabase Connection Error]:', error.message);
            setState({
              status: 'failed',
              message: 'Supabase Connection Failed',
              errorMessage: `Connected to Supabase project, but table "connection_test" does not exist. Run migration SQL to create it. (${error.message})`,
            });
            return;
          }
        }

        console.error('[Supabase Connection Error]:', error.message, error);
        setState({
          status: 'failed',
          message: 'Supabase Connection Failed',
          errorMessage: error.message || 'Database query failed.',
        });
        return;
      }

      // Step 3: Success! Read row
      const firstRow = data && data.length > 0 ? data[0] : undefined;
      console.log('✅ [Supabase Connection Test Successful]:', firstRow || 'Table queried successfully');
      setState({
        status: 'connected',
        message: 'Supabase Connected ✓',
        testRow: firstRow,
      });
    } catch (err: unknown) {
      const errorMsg = (err as Error)?.message || 'Network / connection failure.';
      console.error('[Supabase Connection Exception]:', err);
      setState({
        status: 'failed',
        message: 'Supabase Connection Failed',
        errorMessage: errorMsg,
      });
    }
  };

  useEffect(() => {
    testConnection();
  }, []);

  return (
    <div className="relative inline-flex items-center">
      {state.status === 'loading' && (
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 animate-pulse">
          <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-500" />
          <span>Checking Supabase...</span>
        </div>
      )}

      {state.status === 'connected' && (
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 shadow-xs">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          <span>{state.message}</span>
        </div>
      )}

      {state.status === 'failed' && (
        <div className="inline-flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setShowConfigHelp(!showConfigHelp)}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/25 shadow-xs transition-colors cursor-pointer"
            title="Click for connection details"
          >
            <XCircle className="w-3.5 h-3.5 text-red-500" />
            <span>{state.message}</span>
          </button>

          <button
            type="button"
            onClick={testConnection}
            className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            title="Retry Connection"
          >
            <RefreshCw className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Configuration Help Popover */}
      {showConfigHelp && (
        <div className="absolute top-full mt-2 left-0 sm:right-0 sm:left-auto z-50 w-80 sm:w-96 p-4 rounded-2xl bg-white dark:bg-[#151720] border border-slate-200 dark:border-slate-800 shadow-2xl text-xs space-y-3 animate-in fade-in duration-150 text-left">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
              <Database className="w-4 h-4 text-rose-500" />
              <span>Supabase Connection Diagnostics</span>
            </div>
            <button
              onClick={() => setShowConfigHelp(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              ✕
            </button>
          </div>

          {state.errorMessage && (
            <div className="p-2.5 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 font-mono text-[11px] break-words">
              {state.errorMessage}
            </div>
          )}

          <div className="space-y-1.5 text-slate-600 dark:text-slate-300">
            <p className="font-semibold text-slate-800 dark:text-slate-200">To connect your live Supabase database:</p>
            <ol className="list-decimal pl-4 space-y-1 text-[11px] text-slate-500 dark:text-slate-400">
              <li>Open <code className="text-rose-500">.env</code> in project root.</li>
              <li>Provide your real <code className="text-rose-500">VITE_SUPABASE_URL</code> and <code className="text-rose-500">VITE_SUPABASE_ANON_KEY</code>.</li>
              <li>Run the SQL snippet in <code className="text-rose-500">supabase/migrations/20261005_connection_test.sql</code> in your Supabase SQL editor.</li>
            </ol>
          </div>

          <div className="pt-2 flex justify-between items-center border-t border-slate-100 dark:border-slate-800">
            <span className="text-[10px] text-slate-400">Restart dev server after updating .env</span>
            <button
              onClick={testConnection}
              className="px-3 py-1 rounded-lg text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
