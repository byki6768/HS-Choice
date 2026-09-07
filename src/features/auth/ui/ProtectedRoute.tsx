"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { routes } from "@/shared/config";
import { useAuth } from "../model/useAuth";

type ProtectedRouteProps = {
  children: ReactNode;
};

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isReady } = useAuth();

  useEffect(() => {
    if (!isReady || isAuthenticated) {
      return;
    }

    const loginUrl = new URL(routes.login, window.location.origin);
    loginUrl.searchParams.set("next", pathname || routes.home);
    router.replace(`${loginUrl.pathname}${loginUrl.search}`);
  }, [isAuthenticated, isReady, pathname, router]);

  if (!isReady || !isAuthenticated) {
    return null;
  }

  return children;
}
