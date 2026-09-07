import type { Database } from "@/shared/api/supabase";
import type { Comment } from "./types";

type CommentRow = Database["public"]["Tables"]["comments"]["Row"];

export type CommentQueryRow = CommentRow & {
  profiles: { nickname: string | null } | { nickname: string | null }[] | null;
};

function nicknameFromProfile(profiles: CommentQueryRow["profiles"]) {
  if (!profiles) {
    return "익명";
  }

  const profile = Array.isArray(profiles) ? profiles[0] : profiles;
  return profile?.nickname?.trim() || "익명";
}

export function mapComment(row: CommentQueryRow): Comment {
  return {
    id: row.id,
    gameId: row.game_id,
    authorId: row.author_id,
    authorNickname: nicknameFromProfile(row.profiles),
    content: row.content,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
