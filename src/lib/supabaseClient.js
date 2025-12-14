import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  // This prevents silent crashes -> gives a clear error in console
  console.error("Missing Supabase environment variables", {
    hasUrl: Boolean(url),
    hasAnonKey: Boolean(anonKey),
  });
}

export const supabase = createClient(url, anonKey);
