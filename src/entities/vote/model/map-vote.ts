import type { Database } from "@/shared/api/supabase";
import type { Vote, VoteOption } from "./types";

type VoteRow = Database["public"]["Tables"]["votes"]["Row"];

export function mapVote(row: VoteRow): Vote {
  return {
    id: row.id,
    gameId: row.game_id,
    userId: row.user_id,
    guestKey: row.guest_key,
    option: row.option as VoteOption,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
