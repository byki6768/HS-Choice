import Link from "next/link";
import { PageContainer } from "@/shared/ui";
import { routes } from "@/shared/config";
import { AuthNav, MyPageLink } from "./AuthNav";
import { BrandLogo } from "./BrandLogo";
import { CreateGameLink } from "./CreateGameLink";
import { LogoSpectrumFrame } from "./LogoSpectrumFrame";
import { navPill } from "./nav-pill";

export function Header() {
  return (
    <header className="sticky top-0 z-40 overflow-x-clip border-b border-border/80 bg-background/90 pt-[env(safe-area-inset-top)] backdrop-blur-md">
      <LogoSpectrumFrame>
        <PageContainer className="flex justify-center py-1 sm:py-1.5">
          <BrandLogo />
        </PageContainer>
      </LogoSpectrumFrame>
      <PageContainer className="flex flex-col items-center gap-2 py-2 sm:gap-3 sm:py-3 lg:gap-4 lg:py-4">
        <nav
          aria-label="주요 메뉴"
          className="@container grid w-full min-w-0 grid-cols-6 grid-rows-1 items-center gap-[clamp(0.15rem,1.1cqi,0.5rem)] self-stretch"
        >
          <Link href={routes.feed()} className={navPill("warehouse")}>
            메인 화면
          </Link>
          <Link href={routes.feed("popular")} className={navPill("popular")}>
            인기 게임
          </Link>
          <CreateGameLink />
          <Link href={routes.statsHome} className={navPill("stats")}>
            통계 보기
          </Link>
          <MyPageLink />
          <AuthNav />
        </nav>
      </PageContainer>
    </header>
  );
}
