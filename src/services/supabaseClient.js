/**
 * Supabase Free Tier Client
 * Connects to Supabase if VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are defined.
 * If credentials are not set, smoothly falls back to local storage and mock database.
 */

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_KEY);

/**
 * Execute query against Supabase REST API (zero extra dependencies required)
 */
export async function supabaseRequest(endpoint, options = {}) {
  if (!isSupabaseConfigured) return null;

  const url = `${SUPABASE_URL}/rest/v1/${endpoint}`;
  const headers = {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': options.prefer || 'return=representation',
    ...options.headers
  };

  try {
    const res = await fetch(url, {
      ...options,
      headers
    });
    if (!res.ok) {
      console.warn(`[Supabase Free Tier] Error ${res.status}:`, await res.text());
      return null;
    }
    return await res.json();
  } catch (err) {
    console.warn('[Supabase Free Tier] Fetch failed:', err);
    return null;
  }
}
