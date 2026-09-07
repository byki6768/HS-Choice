import type { ReactNode } from "react";
import { Header } from "@/widgets/header";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        {children}
      </main>
    </>
  );
}
