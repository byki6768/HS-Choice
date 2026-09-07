import { getVoteByGameId, insertVote } from "@/entities/vote";
import { createBrowserClient } from "@/shared/api";
import type { VotePayload } from "../model/types";
import { voterStorageKey } from "../model/local-votes";

const GUEST_KEY_STORAGE = "hs-choice-guest-key";

function getGuestKey() {
  const existing = window.localStorage.getItem(GUEST_KEY_STORAGE);

  if (existing) {
    return existing;
  }

  const nextKey = crypto.randomUUID();
  window.localStorage.setItem(GUEST_KEY_STORAGE, nextKey);
  return nextKey;
}

async function getVoter() {
  const supabase = createBrowserClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user && !user.is_anonymous) {
    return { userId: user.id };
  }

  return { guestKey: getGuestKey() };
}

export async function getVoterKey() {
  return voterStorageKey(await getVoter());
}

export async function getMyVote(choiceId: string) {
  const voter = await getVoter();
  return getVoteByGameId(choiceId, voter);
}

export async function voteChoice(payload: VotePayload) {
  const voter = await getVoter();
  const existing = await getVoteByGameId(payload.choiceId, voter);

  if (existing) {
    return { vote: existing, created: false };
  }

  return insertVote({
    gameId: payload.choiceId,
    option: payload.option,
    ...voter,
  });
}
