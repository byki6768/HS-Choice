import {
  deleteCommentById,
  insertComment,
  updateCommentContent,
} from "@/entities/comment";
import { createBrowserClient } from "@/shared/api";
import { validateCommentContent } from "../model/validate";
import type { CreateCommentPayload, UpdateCommentPayload } from "../model/types";

async function requireCommentAuthor() {
  const supabase = createBrowserClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user || user.is_anonymous) {
    throw new Error("로그인한 사용자만 댓글을 작성할 수 있어요.");
  }

  return user;
}

export async function createComment(payload: CreateCommentPayload) {
  const contentError = validateCommentContent(payload.content);

  if (contentError) {
    throw new Error(contentError);
  }

  const user = await requireCommentAuthor();

  return insertComment({
    gameId: payload.gameId,
    authorId: user.id,
    content: payload.content.trim(),
  });
}

export async function updateComment(payload: UpdateCommentPayload) {
  const contentError = validateCommentContent(payload.content);

  if (contentError) {
    throw new Error(contentError);
  }

  const user = await requireCommentAuthor();

  return updateCommentContent({
    commentId: payload.commentId,
    authorId: user.id,
    content: payload.content.trim(),
  });
}

export async function deleteComment(commentId: string) {
  const user = await requireCommentAuthor();

  await deleteCommentById({
    commentId,
    authorId: user.id,
  });
}
