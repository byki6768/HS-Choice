import { createBrowserClient as createSupabaseBrowserClient } from "@supabase/ssr";
import { publicEnv } from "@/shared/config/public-env";
import type { Database } from "./database.types";

let browserClient: ReturnType<typeof createSupabaseBrowserClient<Database>>;

export function createBrowserClient() {
  if (browserClient) {
    return browserClient;
  }

  const { supabaseUrl, supabasePublishableKey } = publicEnv;

  if (!supabaseUrl || !supabasePublishableKey) {
    throw new Error("Missing environment variable: NEXT_PUBLIC_SUPABASE_URL");
  }
  const client = createSupabaseBrowserClient<Database>(
    supabaseUrl,
    supabasePublishableKey,
  );

  if (typeof window !== "undefined") {
    browserClient = client;
  }

  return client;
}
