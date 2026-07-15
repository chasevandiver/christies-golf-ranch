import { createClient as createSupabaseClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Service-role client for trusted server-side jobs (the post dispatcher and
 * unsubscribe endpoint). Bypasses RLS — never import from client components.
 * Returns null when SUPABASE_SERVICE_ROLE_KEY isn't configured so callers can
 * fail with a clear message instead of crashing.
 */
export function createServiceClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createSupabaseClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
