"use client";

import Link from "next/link";
import { LogoutButton, useAuth } from "@/features/auth";
import { routes } from "@/shared/config";
import { logoutPill, navPill } from "./nav-pill";

export function MyPageLink() {
  const { isAuthenticated, isReady } = useAuth();
  const href =
    isReady && !isAuthenticated
      ? `${routes.login}?next=${encodeURIComponent(routes.mypage)}`
      : routes.mypage;

  return (
    <Link href={href} className={navPill("mypage")}>
      마이 페이지
    </Link>
  );
}

export function AuthNav() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return (
      <Link href={routes.login} className={navPill("login")}>
        로그인
      </Link>
    );
  }

  return <LogoutButton className={logoutPill()} />;
}
