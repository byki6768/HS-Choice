"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { hasNickname, type User } from "@/entities/user";

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  hasNickname: boolean;
  isInitialized: boolean;
  setUser: (user: User | null) => void;
  setNickname: (nickname: string) => void;
  clear: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      hasNickname: false,
      isInitialized: false,
      setUser: (user) =>
        set({
          user,
          isAuthenticated: Boolean(user && !user.isAnonymous),
          hasNickname: hasNickname(user),
          isInitialized: true,
        }),
      setNickname: (nickname) =>
        set((state) => {
          if (!state.user) {
            return state;
          }

          const user = { ...state.user, nickname };

          return {
            user,
            hasNickname: hasNickname(user),
          };
        }),
      clear: () =>
        set({
          user: null,
          isAuthenticated: false,
          hasNickname: false,
          isInitialized: true,
        }),
    }),
    {
      name: "hs-choice-auth",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        hasNickname: state.hasNickname,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state?.user) {
          return;
        }

        const stored = state.user as User & { memberKey?: unknown };
        const { memberKey: _hidden, ...safeUser } = stored;
        state.user = safeUser;
        state.hasNickname = hasNickname(safeUser);
        state.isAuthenticated = !safeUser.isAnonymous;
      },
    },
  ),
);
