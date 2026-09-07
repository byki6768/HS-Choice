import { cache } from "react";
import { createBrowserClient } from "@/shared/api";
import { toFriendlyError } from "@/shared/lib";
import { mapComment, type CommentQueryRow } from "../model/map-comment";
import type { Comment } from "../model/types";

export const PREVIEW_COMMENT_COUNT = 2;

const COMMENT_SELECT =
  "*, profiles!comments_author_id_fkey(nickname)" as const;

export const getCommentsByGameId = cache(async (gameId: string) => {
  const supabase = createBrowserClient();
  const { data, error } = await supabase
    .from("comments")
    .select(COMMENT_SELECT)
    .eq("game_id", gameId)
    .order("created_at", { ascending: false });

  if (error) {
    throw toFriendlyError(
      error,
      "댓글을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.",
    );
  }

  return ((data ?? []) as CommentQueryRow[]).map(mapComment);
});

export async function getPreviewCommentsByGameIds(gameIds: string[]) {
  const uniqueIds = [...new Set(gameIds.filter(Boolean))];
  const commentsByGame = new Map<string, Comment[]>();

  for (const gameId of uniqueIds) {
    commentsByGame.set(gameId, []);
  }

  if (uniqueIds.length === 0) {
    return commentsByGame;
  }

  const supabase = createBrowserClient();
  const { data, error } = await supabase
    .from("comments")
    .select(COMMENT_SELECT)
    .in("game_id", uniqueIds)
    .order("created_at", { ascending: false });

  if (error) {
    throw toFriendlyError(
      error,
      "댓글을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.",
    );
  }

  for (const comment of ((data ?? []) as CommentQueryRow[]).map(mapComment)) {
    const current = commentsByGame.get(comment.gameId) ?? [];

    if (current.length < PREVIEW_COMMENT_COUNT) {
      current.push(comment);
      commentsByGame.set(comment.gameId, current);
    }
  }

  return commentsByGame;
}

export async function insertComment(input: {
  gameId: string;
  authorId: string;
  content: string;
}) {
  const supabase = createBrowserClient();
  const { data, error } = await supabase
    .from("comments")
    .insert({
      game_id: input.gameId,
      author_id: input.authorId,
      content: input.content,
    })
    .select(COMMENT_SELECT)
    .single();

  if (error || !data) {
    throw toFriendlyError(
      error,
      "댓글을 저장하지 못했어요. 잠시 후 다시 시도해 주세요.",
    );
  }

  return mapComment(data as CommentQueryRow);
}

export async function updateCommentContent(input: {
  commentId: string;
  authorId: string;
  content: string;
}) {
  const supabase = createBrowserClient();
  const { data, error } = await supabase
    .from("comments")
    .update({ content: input.content })
    .eq("id", input.commentId)
    .eq("author_id", input.authorId)
    .select(COMMENT_SELECT)
    .single();

  if (error || !data) {
    throw toFriendlyError(
      error,
      "댓글을 수정하지 못했어요. 잠시 후 다시 시도해 주세요.",
    );
  }

  return mapComment(data as CommentQueryRow);
}

export async function deleteCommentById(input: {
  commentId: string;
  authorId: string;
}) {
  const supabase = createBrowserClient();
  const { error } = await supabase
    .from("comments")
    .delete()
    .eq("id", input.commentId)
    .eq("author_id", input.authorId);

  if (error) {
    throw toFriendlyError(
      error,
      "댓글을 삭제하지 못했어요. 잠시 후 다시 시도해 주세요.",
    );
  }
}
