"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { routes } from "@/shared/config";
import { signOut } from "../api";

type LogoutButtonProps = {
  className?: string;
};

export function LogoutButton({ className = "" }: LogoutButtonProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLogout() {
    setIsSubmitting(true);
    await signOut();
    router.replace(routes.home);
    router.refresh();
  }

  return (
    <button
      type="button"
      disabled={isSubmitting}
      onClick={handleLogout}
      className={`disabled:opacity-60 ${className || "rounded-full px-3 py-2 text-sm font-medium text-muted transition hover:bg-surface-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"}`}
    >
      {isSubmitting ? "로그아웃 중..." : "로그아웃"}
    </button>
  );
}
