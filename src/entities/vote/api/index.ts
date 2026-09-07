import { createBrowserClient } from "@/shared/api";
import { toFriendlyError } from "@/shared/lib";
import { mapVote } from "../model/map-vote";
import type { VoteOption } from "../model/types";

export async function getVoteByGameId(
  gameId: string,
  voter: { userId: string } | { guestKey: string },
) {
  const supabase = createBrowserClient();
  let query = supabase.from("votes").select("*").eq("game_id", gameId);

  query =
    "userId" in voter
      ? query.eq("user_id", voter.userId)
      : query.eq("guest_key", voter.guestKey);

  const { data, error } = await query.maybeSingle();

  if (error) {
    throw toFriendlyError(
      error,
      "투표 정보를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.",
    );
  }

  return data ? mapVote(data) : null;
}

export async function insertVote(input: {
  gameId: string;
  option: VoteOption;
  userId?: string;
  guestKey?: string;
}) {
  const supabase = createBrowserClient();
  const { data, error } = await supabase
    .from("votes")
    .insert({
      game_id: input.gameId,
      option: input.option,
      user_id: input.userId ?? null,
      guest_key: input.guestKey ?? null,
    })
    .select("*")
    .single();

  if (error?.code === "23505") {
    const existing = await getVoteByGameId(
      input.gameId,
      input.userId ? { userId: input.userId } : { guestKey: input.guestKey! },
    );

    if (existing) {
      return { vote: existing, created: false };
    }
  }

  if (error || !data) {
    throw toFriendlyError(
      error,
      "투표를 저장하지 못했어요. 잠시 후 다시 시도해 주세요.",
    );
  }

  return { vote: mapVote(data), created: true };
}
