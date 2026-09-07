import { createBrowserClient } from "@/shared/api";
import type { VoteOption } from "../model/types";

export type VoteInsertEvent = {
  id: string;
  gameId: string;
  option: VoteOption;
};

export function subscribeVoteInserts(
  onInsert: (vote: VoteInsertEvent) => void,
  gameId?: string,
) {
  const supabase = createBrowserClient();
  const channel = supabase
    .channel(gameId ? `votes-insert:${gameId}` : "votes-insert:feed")
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "votes",
        ...(gameId ? { filter: `game_id=eq.${gameId}` } : {}),
      },
      (payload) => {
        const row = payload.new as {
          id?: string;
          game_id?: string;
          option?: string;
        };

        if (
          !row.id ||
          !row.game_id ||
          (row.option !== "A" && row.option !== "B")
        ) {
          return;
        }

        onInsert({
          id: row.id,
          gameId: row.game_id,
          option: row.option,
        });
      },
    )
    .subscribe();

  return () => {
    void supabase.removeChannel(channel);
  };
}
