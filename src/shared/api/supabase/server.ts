import { createServerClient as createSupabaseServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabaseConfig } from "@/shared/config";
import type { Database } from "./database.types";

export async function createServerClient() {
  const { supabaseUrl, supabasePublishableKey } = getSupabaseConfig();
  const cookieStore = await cookies();

  return createSupabaseServerClient<Database>(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Components cannot always write cookies.
        }
      },
    },
  });
}
