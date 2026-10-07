// ====================================================================
// CineBook Supabase Client Initialization & Realtime Configuration
// ====================================================================

import { createClient } from '@supabase/supabase-js';

const rawUrl = (import.meta.env.VITE_SUPABASE_URL as string) || '';
const rawKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || '';

const isValidHttpUrl = (str: string): boolean => {
  try {
    const parsed = new URL(str);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

export const isSupabaseConfigured = (): boolean => {
  return (
    isValidHttpUrl(rawUrl) &&
    !rawUrl.includes('your_supabase_project_url') &&
    !rawUrl.includes('placeholder') &&
    Boolean(rawKey) &&
    !rawKey.includes('your_supabase_anon_key') &&
    !rawKey.includes('placeholder')
  );
};

const clientUrl = isValidHttpUrl(rawUrl) && !rawUrl.includes('your_supabase_project_url')
  ? rawUrl
  : 'https://placeholder.supabase.co';

const clientKey = rawKey && !rawKey.includes('your_supabase_anon_key')
  ? rawKey
  : 'placeholder-anon-key';

if (!isSupabaseConfigured()) {
  console.info(
    '⚡ [CineBook] Supabase credentials in .env are not yet configured or using placeholders (VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY).'
  );
}

// Supabase client instance with session persistence & Realtime subscriptions
export const supabase = createClient(
  clientUrl,
  clientKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: window.localStorage,
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  }
);
