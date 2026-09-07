import Link from "next/link";
import { routes } from "@/shared/config";
import type { FeedSort } from "@/entities/choice";

type FeedSortTabsProps = {
  value: FeedSort;
};

const SORT_OPTIONS: { value: FeedSort; label: string }[] = [
  { value: "latest", label: "최신순" },
  { value: "popular", label: "참여순" },
];

export function FeedSortTabs({ value }: FeedSortTabsProps) {
  return (
    <nav
      aria-label="게임 정렬"
      className="mb-4 flex w-full max-w-full flex-wrap rounded-full bg-surface-muted p-1 sm:mb-5 sm:w-fit"
    >
      {SORT_OPTIONS.map((option) => {
        const isActive = option.value === value;

        return (
          <Link
            key={option.value}
            href={routes.feed(option.value)}
            aria-current={isActive ? "page" : undefined}
            className={`inline-flex min-h-11 min-w-24 flex-1 items-center justify-center rounded-full px-4 text-sm font-semibold transition touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent sm:min-h-12 sm:flex-none sm:text-base ${
              isActive
                ? "bg-foreground text-background shadow-sm"
                : "text-muted hover:text-foreground"
            }`}
          >
            {option.label}
          </Link>
        );
      })}
    </nav>
  );
}