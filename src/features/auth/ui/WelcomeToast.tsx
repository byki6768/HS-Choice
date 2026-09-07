"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { routes } from "@/shared/config";
import { AUTH_MESSAGES } from "../model/types";
import { AuthFeedback } from "./AuthFeedback";

type WelcomeToastProps = {
  show: boolean;
  stayOnPage?: boolean;
};

export function WelcomeToast({ show, stayOnPage = false }: WelcomeToastProps) {
  const router = useRouter();
  const [visible, setVisible] = useState(show);

  useEffect(() => {
    if (!show) {
      return;
    }

    setVisible(true);
    const timer = window.setTimeout(() => {
      setVisible(false);
      if (!stayOnPage) {
        router.replace(routes.home);
      }
    }, 1600);

    return () => {
      window.clearTimeout(timer);
    };
  }, [router, show, stayOnPage]);

  if (!visible) {
    return null;
  }

  return <AuthFeedback message={AUTH_MESSAGES.welcome} />;
}
