import { NextResponse } from "next/server";
import { createServerClient } from "@/shared/api/supabase/server";
import { routes } from "@/shared/config";

const AUTH_NEXT_COOKIE = "hs-choice-auth-next";
const AUTH_INTENT_COOKIE = "hs-choice-auth-intent";

function readCookie(cookieHeader: string, name: string) {
  return cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`))
    ?.slice(`${name}=`.length);
}

function isNewlyCreatedUser(createdAt: string | undefined) {
  if (!createdAt) {
    return false;
  }

  const created = Date.parse(createdAt);
  if (Number.isNaN(created)) {
    return false;
  }

  return Date.now() - created < 120_000;
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const cookieStore = request.headers.get("cookie") ?? "";
  const intent = readCookie(cookieStore, AUTH_INTENT_COOKIE);

  function clearAuthCookies(response: NextResponse) {
    response.cookies.delete(AUTH_NEXT_COOKIE);
    response.cookies.delete(AUTH_INTENT_COOKIE);
    return response;
  }

  if (code) {
    const supabase = await createServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (intent === "login") {
        const signedUp = user?.user_metadata?.signed_up === true;
        const brandNew = isNewlyCreatedUser(user?.created_at) && !signedUp;

        if (brandNew) {
          await supabase.rpc("delete_own_account");
          await supabase.auth.signOut();
          const loginUrl = new URL(routes.login, origin);
          loginUrl.searchParams.set("error", "not_member");
          return clearAuthCookies(NextResponse.redirect(loginUrl));
        }

        if (user) {
          await supabase.auth.updateUser({
            data: {
              ...user.user_metadata,
              signed_up: true,
            },
          });
        }

        const homeUrl = new URL(routes.home, origin);
        homeUrl.searchParams.set("welcome", "1");
        return clearAuthCookies(NextResponse.redirect(homeUrl));
      }

      if (user) {
        await supabase.auth.updateUser({
          data: {
            ...user.user_metadata,
            signed_up: true,
            login_method: "google",
          },
        });
      }

      return clearAuthCookies(NextResponse.redirect(new URL(routes.home, origin)));
    }
  }

  const loginUrl = new URL(routes.login, origin);
  loginUrl.searchParams.set("error", "auth");
  return clearAuthCookies(NextResponse.redirect(loginUrl));
}
