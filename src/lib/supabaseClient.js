import { createClient } from "@supabase/supabase-js";

// Vite client-side env vars
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// If env vars are missing, return a Supabase-like stub so the UI can still load.
function envMissing() {
  return {
    error: {
      message:
        "Supabase env vars missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Vercel Environment Variables, then redeploy.",
    },
    data: null,
  };
}

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : {
        from() {
          return {
            insert: async () => envMissing(),
            select: async () => envMissing(),
            update: async () => envMissing(),
            delete: async () => envMissing(),
          };
        },
      };
