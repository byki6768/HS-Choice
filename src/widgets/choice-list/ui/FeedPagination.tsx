import Link from "next/link";
import { FEED_PAGE_SIZE } from "@/entities/choice";
import { routes } from "@/shared/config";

type FeedPaginationProps = {
  page: number;
  totalPages: number;
};

function pageWindow(current: number, total: number) {
  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => index + 1);
  }

  const start = Math.max(1, Math.min(current - 2, total - 6));
  const end = Math.min(total, start + 6);

  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

const pageLinkClassName =
  "inline-flex min-h-11 min-w-11 items-center justify-center rounded-full px-3 text-sm font-semibold transition touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent sm:min-h-12 sm:min-w-12 sm:text-base";

export function FeedPagination({ page, totalPages }: FeedPaginationProps) {
  const pages = pageWindow(page, totalPages);
  const previousPage = page - 1;
  const nextPage = page + 1;

  return (
    <nav
      aria-label="최신 게임 페이지"
      className="mt-6 flex flex-wrap items-center justify-center gap-2 sm:mt-8"
    >
      {previousPage >= 1 ? (
        <Link href={routes.feed("latest", previousPage)} className={`${pageLinkClassName} text-muted hover:text-foreground`}>
          이전
        </Link>
      ) : (
        <span className={`${pageLinkClassName} cursor-not-allowed text-muted/40`}>
          이전
        </span>
      )}

      {pages[0] !== 1 ? (
        <>
          <Link href={routes.feed()} className={`${pageLinkClassName} text-muted hover:text-foreground`}>
            1
          </Link>
          {pages[0] !== 2 ? (
            <span className="px-1 text-sm text-muted" aria-hidden>
              …
            </span>
          ) : null}
        </>
      ) : null}

      {pages.map((number) => {
        const isCurrent = number === page;

        return (
          <Link
            key={number}
            href={routes.feed("latest", number)}
            aria-current={isCurrent ? "page" : undefined}
            aria-label={`${(number - 1) * FEED_PAGE_SIZE + 1}~${number * FEED_PAGE_SIZE}번째 게임`}
            className={`${pageLinkClassName} ${
              isCurrent
                ? "bg-foreground text-background shadow-sm"
                : "text-muted hover:text-foreground"
            }`}
          >
            {number}
          </Link>
        );
      })}

      {pages[pages.length - 1] !== totalPages ? (
        <>
          {pages[pages.length - 1] !== totalPages - 1 ? (
            <span className="px-1 text-sm text-muted" aria-hidden>
              …
            </span>
          ) : null}
          <Link
            href={routes.feed("latest", totalPages)}
            className={`${pageLinkClassName} text-muted hover:text-foreground`}
          >
            {totalPages}
          </Link>
        </>
      ) : null}

      {nextPage <= totalPages ? (
        <Link href={routes.feed("latest", nextPage)} className={`${pageLinkClassName} text-muted hover:text-foreground`}>
          다음
        </Link>
      ) : (
        <span className={`${pageLinkClassName} cursor-not-allowed text-muted/40`}>
          다음
        </span>
      )}
    </nav>
  );
}
