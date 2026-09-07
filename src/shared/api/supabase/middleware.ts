import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseConfig, protectedRoutes, routes } from "@/shared/config";

export async function updateSession(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (/\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|html)$/i.test(pathname)) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({
    request,
  });

  const { supabaseUrl, supabasePublishableKey } = getSupabaseConfig();
  const supabase = createServerClient(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) => {
          supabaseResponse.cookies.set(name, value, options);
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isProtected = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
  const isPermanentUser = Boolean(user) && user?.is_anonymous !== true;

  if (!isPermanentUser && isProtected) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = routes.login;
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isPermanentUser && user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("nickname")
      .eq("id", user.id)
      .maybeSingle();
    const hasNickname = Boolean(profile?.nickname?.trim());
    const isAuthPath =
      pathname === routes.login ||
      pathname === routes.signup ||
      pathname.startsWith(`${routes.authCallback}/`) ||
      pathname === routes.authCallback;

    const welcome = request.nextUrl.searchParams.get("welcome") === "1";

    if (!hasNickname && pathname !== routes.nickname && !isAuthPath) {
      const nicknameUrl = request.nextUrl.clone();
      nicknameUrl.pathname = routes.nickname;
      nicknameUrl.search = "";
      if (pathname !== routes.home) {
        nicknameUrl.searchParams.set("next", pathname);
      }
      if (welcome) {
        nicknameUrl.searchParams.set("welcome", "1");
      }
      return NextResponse.redirect(nicknameUrl);
    }

    if (hasNickname && pathname === routes.nickname) {
      const homeUrl = request.nextUrl.clone();
      homeUrl.pathname = routes.home;
      homeUrl.search = "";
      if (welcome) {
        homeUrl.searchParams.set("welcome", "1");
      }
      return NextResponse.redirect(homeUrl);
    }

    if (hasNickname && (pathname === routes.login || pathname === routes.signup)) {
      const homeUrl = request.nextUrl.clone();
      homeUrl.pathname = routes.home;
      homeUrl.search = "";
      return NextResponse.redirect(homeUrl);
    }
  }

  return supabaseResponse;
}
