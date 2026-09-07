"use client";

import Link from "next/link";
import {
  ChoiceCard,
  FEED_PAGE_SIZE,
  type Choice,
  type FeedSort,
} from "@/entities/choice";
import { useLiveChoices } from "@/features/choice";
import { routes } from "@/shared/config";
import { FeedPagination } from "./FeedPagination";

type ChoiceListProps = {
  choices: Choice[];
  sort?: FeedSort;
  page?: number;
};

export function ChoiceList({
  choices,
  sort = "latest",
  page = 1,
}: ChoiceListProps) {
  const liveChoices = useLiveChoices(choices, sort);
  const paginated = sort === "latest";
  const totalPages = Math.max(
    1,
    Math.ceil(liveChoices.length / FEED_PAGE_SIZE),
  );
  const currentPage = paginated
    ? Math.min(Math.max(page, 1), totalPages)
    : 1;
  const visibleChoices = paginated
    ? liveChoices.slice(
        (currentPage - 1) * FEED_PAGE_SIZE,
        currentPage * FEED_PAGE_SIZE,
      )
    : liveChoices;

  if (liveChoices.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-border bg-surface px-6 py-16 text-center">
        <p className="text-base font-semibold leading-7 text-foreground">
          아직 게임이 없어요. 첫번째 게임을 만들어 보세요!
        </p>
        <Link
          href={routes.createChoice}
          className="mt-6 inline-flex min-h-12 items-center justify-center rounded-2xl bg-foreground px-5 text-base font-semibold text-background touch-manipulation"
        >
          게임 만들기
        </Link>
      </div>
    );
  }

  return (
    <div>
      <ul className="grid grid-cols-1 gap-4 sm:gap-5 md:gap-6">
        {visibleChoices.map((choice) => (
          <li key={choice.id}>
            <ChoiceCard choice={choice} />
          </li>
        ))}
      </ul>
      {paginated && totalPages > 1 ? (
        <FeedPagination page={currentPage} totalPages={totalPages} />
      ) : null}
    </div>
  );
}
