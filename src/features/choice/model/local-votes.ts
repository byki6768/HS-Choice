const VOTED_GAMES_KEY = "hs-choice-voted-games";

type VotedGamesByVoter = Record<string, string[]>;

function isGameIdList(value: unknown): value is string[] {
  return (
    Array.isArray(value) && value.every((item) => typeof item === "string")
  );
}

function readVotedGamesByVoter(): VotedGamesByVoter {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(VOTED_GAMES_KEY);

    if (!raw) {
      return {};
    }

    const parsed: unknown = JSON.parse(raw);

    // Legacy unscoped list blocked every account on this browser.
    if (isGameIdList(parsed)) {
      return {};
    }

    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return {};
    }

    const next: VotedGamesByVoter = {};

    for (const [voterKey, gameIds] of Object.entries(parsed)) {
      if (isGameIdList(gameIds)) {
        next[voterKey] = gameIds;
      }
    }

    return next;
  } catch {
    return {};
  }
}

export function voterStorageKey(voter: {
  userId?: string;
  guestKey?: string;
}) {
  if (voter.userId) {
    return `user:${voter.userId}`;
  }

  return `guest:${voter.guestKey ?? "anonymous"}`;
}

export function hasLocalVote(gameId: string, voterKey: string) {
  return readVotedGamesByVoter()[voterKey]?.includes(gameId) ?? false;
}

export function recordLocalVote(gameId: string, voterKey: string) {
  if (typeof window === "undefined" || !voterKey) {
    return;
  }

  const store = readVotedGamesByVoter();
  const current = store[voterKey] ?? [];

  if (current.includes(gameId)) {
    return;
  }

  window.localStorage.setItem(
    VOTED_GAMES_KEY,
    JSON.stringify({
      ...store,
      [voterKey]: [...current, gameId],
    }),
  );
}
