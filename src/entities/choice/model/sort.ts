import type { Choice, FeedSort } from "./types";

export const FEED_PAGE_SIZE = 10;

export function parseFeedSort(value: string | string[] | undefined): FeedSort {
  const sort = Array.isArray(value) ? value[0] : value;
  return sort === "popular" ? "popular" : "latest";
}

export function parseFeedPage(value: string | string[] | undefined): number {
  const raw = Array.isArray(value) ? value[0] : value;

  if (!raw || !/^\d+$/.test(raw)) {
    return 1;
  }

  const page = Number.parseInt(raw, 10);
  return page < 1 ? 1 : page;
}

export function sortChoices(choices: Choice[], sort: FeedSort) {
  if (sort !== "popular") {
    return choices;
  }

  return [...choices].sort((left, right) => {
    if (right.participantCount !== left.participantCount) {
      return right.participantCount - left.participantCount;
    }

    return right.createdAt.localeCompare(left.createdAt);
  });
}
