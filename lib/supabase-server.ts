import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Server client for reading in Server Components (uses anon key with RLS)
export function createServerClient() {
  return createClient(supabaseUrl, supabaseAnonKey);
}

// Admin client for write operations (bypasses RLS)
// Only use in API routes that verify admin auth
export function createAdminClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey) {
    // Fallback to anon key if service role not available
    console.warn(
      "SUPABASE_SERVICE_ROLE_KEY not set, using anon key for admin operations"
    );
    return createClient(supabaseUrl, supabaseAnonKey);
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
