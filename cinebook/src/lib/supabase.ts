// ====================================================================
// CineBook Supabase Client Configuration
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

export const isSupabaseConfigured = Boolean(
  isValidHttpUrl(rawUrl) &&
  !rawUrl.includes('your_supabase_project_url') &&
  !rawUrl.includes('placeholder') &&
  Boolean(rawKey) &&
  !rawKey.includes('your_supabase_anon_key') &&
  !rawKey.includes('placeholder')
);

const clientUrl = isValidHttpUrl(rawUrl) && !rawUrl.includes('your_supabase_project_url')
  ? rawUrl
  : 'https://placeholder.supabase.co';

const clientKey = rawKey && !rawKey.includes('your_supabase_anon_key')
  ? rawKey
  : 'placeholder-anon-key';

// Instantiate Supabase Client (No hardcoded secrets)
export const supabase = createClient(
  clientUrl,
  clientKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);
