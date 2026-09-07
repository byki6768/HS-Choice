import { publicEnv } from "./public-env";

export function getSupabaseConfig() {
  const { supabaseUrl, supabasePublishableKey } = publicEnv;

  if (!supabaseUrl) {
    throw new Error("Missing environment variable: NEXT_PUBLIC_SUPABASE_URL");
  }

  if (!supabasePublishableKey) {
    throw new Error(
      "Missing environment variable: NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
    );
  }

  return {
    supabaseUrl,
    supabasePublishableKey,
  };
}

export const env = publicEnv;
