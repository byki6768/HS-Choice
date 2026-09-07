import Link from "next/link";
import { routes } from "@/shared/config";

export function BrandLogo() {
  return (
    <Link
      href={routes.home}
      className="group inline-flex max-w-full items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:gap-4"
    >
      <span
        aria-hidden
        className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-rose-400 via-amber-400 to-violet-500 text-2xl font-black text-white shadow-lg shadow-rose-300/50 ring-2 ring-white/80 transition group-hover:scale-105 group-hover:shadow-xl sm:size-16 sm:rounded-3xl sm:text-3xl lg:size-[4.5rem] lg:text-4xl"
      >
        HS
      </span>
      <span className="relative min-w-0">
        <span
          aria-hidden
          className="absolute inset-x-1 -bottom-1 h-3 rounded-full bg-linear-to-r from-rose-400 via-amber-400 to-violet-500 opacity-60 blur-md"
        />
        <span className="relative bg-[linear-gradient(90deg,#f43f5e_0%,#f59e0b_28%,#10b981_62%,#8b5cf6_100%)] bg-clip-text text-[clamp(1.75rem,8vw,3.75rem)] leading-none font-black tracking-tight text-transparent whitespace-nowrap">
          HS Choice
        </span>
      </span>
    </Link>
  );
}
