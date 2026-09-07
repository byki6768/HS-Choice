"use client";

import Link from "next/link";
import { useAuth } from "@/features/auth";
import { routes } from "@/shared/config";
import { navPill } from "./nav-pill";

export function CreateGameLink() {
  const { isAuthenticated, isReady } = useAuth();
  const href =
    isReady && !isAuthenticated
      ? `${routes.login}?next=${encodeURIComponent(routes.createChoice)}`
      : routes.createChoice;

  return (
    <Link href={href} className={navPill("create")}>
      게임 만들기
    </Link>
  );
}
