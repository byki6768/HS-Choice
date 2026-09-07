"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "./store";

export function useAuth() {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const hasNickname = useAuthStore((state) => state.hasNickname);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const finish = () => setIsHydrated(true);

    if (useAuthStore.persist.hasHydrated()) {
      finish();
    }

    return useAuthStore.persist.onFinishHydration(finish);
  }, []);

  return {
    user,
    isAuthenticated,
    hasNickname,
    isReady: isHydrated && isInitialized,
  };
}
