import Link from "next/link";
import { PageContainer } from "@/shared/ui";
import { routes } from "@/shared/config";
import { AuthNav, MyPageLink } from "./AuthNav";
import { BrandLogo } from "./BrandLogo";
import { CreateGameLink } from "./CreateGameLink";
import { navPill } from "./nav-pill";

export function Header() {
  return (
    <header className="sticky top-0 z-40 overflow-x-clip border-b border-border/80 bg-background/90 pt-[env(safe-area-inset-top)] backdrop-blur-md">
      <PageContainer className="flex flex-col gap-2 py-2 sm:gap-3 sm:py-3 lg:gap-4 lg:py-4">
        <BrandLogo />
        <nav
          aria-label="주요 메뉴"
          className="@container grid w-full min-w-0 grid-cols-6 grid-rows-1 items-center gap-[clamp(0.15rem,1.1cqi,0.5rem)]"
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
