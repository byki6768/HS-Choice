"use client";

import { useEffect, type ReactNode } from "react";
import { syncProfileFromAuthUser } from "@/entities/user";
import { createBrowserClient } from "@/shared/api";
import { syncSession } from "../api";
import { useAuthStore } from "../model/store";

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  useEffect(() => {
    const supabase = createBrowserClient();

    void syncSession().catch(() => {
      useAuthStore.getState().clear();
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "INITIAL_SESSION") {
        return;
      }

      if (!session?.user) {
        useAuthStore.getState().clear();
        return;
      }

      void syncProfileFromAuthUser(session.user)
        .then((user) => {
          useAuthStore.getState().setUser(user);
        })
        .catch(() => {
          useAuthStore.getState().clear();
        });
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return children;
}
