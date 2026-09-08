import Image from "next/image";
import Link from "next/link";
import { routes } from "@/shared/config";

export function BrandLogo() {
  return (
    <Link
      href={routes.home}
      className="mx-auto flex w-full justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-white"
    >
      <Image
        src="/header-hs-choice.png"
        alt="HS Choice Balance Game Community"
        width={2172}
        height={724}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 72rem"
        className="h-auto w-auto max-h-[clamp(6.5rem,30vw,12rem)] max-w-full object-contain object-center drop-shadow-[0_1px_8px_rgba(255,255,255,0.55)]"
        priority
      />
    </Link>
  );
}
