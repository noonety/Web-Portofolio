import { createClient } from "@supabase/supabase-js";

let supabaseClient: ReturnType<typeof createClient> | null = null;

export function getSupabaseClient() {
  if (supabaseClient) return supabaseClient;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Supabase URL or Anon Key is missing. " +
      "Ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_ANON_KEY are set."
    );
  }

  supabaseClient = createClient(supabaseUrl, supabaseKey);
  return supabaseClient;
}