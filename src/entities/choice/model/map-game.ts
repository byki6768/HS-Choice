import type { Database } from "@/shared/api/supabase";
import type { Choice } from "./types";

type GameRow = Database["public"]["Tables"]["games"]["Row"];

type VoteRow = {
  option?: string;
  count?: number;
};

export type GameQueryRow = GameRow & {
  profiles: { nickname: string | null } | { nickname: string | null }[] | null;
  votes: VoteRow[] | null;
};

function nicknameFromProfile(profiles: GameQueryRow["profiles"]) {
  if (!profiles) {
    return "익명";
  }

  const profile = Array.isArray(profiles) ? profiles[0] : profiles;
  return profile?.nickname?.trim() || "익명";
}

function countVotes(votes: GameQueryRow["votes"]) {
  let optionAVotes = 0;
  let optionBVotes = 0;

  for (const vote of votes ?? []) {
    if (vote.option === "A") {
      optionAVotes += 1;
    } else if (vote.option === "B") {
      optionBVotes += 1;
    }
  }

  return {
    optionAVotes,
    optionBVotes,
    participantCount: optionAVotes + optionBVotes,
  };
}

export function mapGameToChoice(row: GameQueryRow): Choice {
  const votes = countVotes(row.votes);

  return {
    id: row.id,
    title: row.title,
    optionA: row.option_a,
    optionB: row.option_b,
    optionAImage: row.option_a_image_path,
    optionBImage: row.option_b_image_path,
    optionAVotes: votes.optionAVotes,
    optionBVotes: votes.optionBVotes,
    authorId: row.author_id,
    authorNickname: nicknameFromProfile(row.profiles),
    participantCount: votes.participantCount,
    createdAt: row.created_at,
    previewComments: [],
  };
}
