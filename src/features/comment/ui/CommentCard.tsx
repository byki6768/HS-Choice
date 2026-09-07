"use client";

import { useState } from "react";
import { CommentItem, type Comment } from "@/entities/comment";
import { toFriendlyErrorMessage } from "@/shared/lib";
import { deleteComment, updateComment } from "../api";

type CommentCardProps = {
  comment: Comment;
  isOwner: boolean;
  onUpdated: (comment: Comment) => void;
  onDeleted: (commentId: string) => void;
};

export function CommentCard({
  comment,
  isOwner,
  onUpdated,
  onDeleted,
}: CommentCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(comment.content);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const edited = comment.updatedAt !== comment.createdAt;

  async function handleSave() {
    setError(null);
    setIsSaving(true);

    try {
      const nextComment = await updateComment({
        commentId: comment.id,
        content: draft,
      });
      onUpdated(nextComment);
      setIsEditing(false);
    } catch (saveError) {
      setError(
        toFriendlyErrorMessage(saveError, "댓글을 수정하지 못했어요."),
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm("이 댓글을 삭제할까요?")) {
      return;
    }

    setError(null);
    setIsDeleting(true);

    try {
      await deleteComment(comment.id);
      onDeleted(comment.id);
    } catch {
      setError("댓글을 삭제하지 못했어요. 잠시 후 다시 시도해 주세요.");
      setIsDeleting(false);
    }
  }

  return (
    <CommentItem
      comment={comment}
      edited={edited}
      actions={
        isOwner ? (
          <div className="flex shrink-0 gap-1.5">
            {isEditing ? null : (
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => {
                  setDraft(comment.content);
                  setIsEditing(true);
                  setError(null);
                }}
                className="min-h-11 rounded-xl px-3 text-sm font-medium text-muted transition touch-manipulation hover:bg-surface-muted hover:text-foreground disabled:opacity-50"
              >
                수정
              </button>
            )}
            <button
              type="button"
              disabled={isDeleting || isSaving}
              onClick={() => void handleDelete()}
              className="min-h-11 rounded-xl px-3 text-sm font-medium text-red-600 transition touch-manipulation hover:bg-red-50 disabled:opacity-50 dark:text-red-400 dark:hover:bg-red-950/40"
            >
              삭제
            </button>
          </div>
        ) : null
      }
    >
      {isEditing ? (
        <div className="mt-3 flex flex-col gap-2">
          <textarea
            value={draft}
            disabled={isSaving}
            rows={3}
            className="min-h-20 w-full resize-y rounded-2xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus-visible:ring-2 focus-visible:ring-accent"
            onChange={(event) => setDraft(event.target.value)}
          />
          {error ? (
            <p role="alert" className="text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          ) : null}
          <div className="flex gap-2">
            <button
              type="button"
              disabled={isSaving}
              onClick={() => void handleSave()}
              className="min-h-11 flex-1 rounded-xl bg-foreground px-4 text-sm font-semibold text-background touch-manipulation disabled:opacity-60 sm:flex-none"
            >
              {isSaving ? "저장 중..." : "저장"}
            </button>
            <button
              type="button"
              disabled={isSaving}
              onClick={() => {
                setIsEditing(false);
                setDraft(comment.content);
                setError(null);
              }}
              className="min-h-11 flex-1 rounded-xl border border-border px-4 text-sm font-medium text-muted touch-manipulation sm:flex-none"
            >
              취소
            </button>
          </div>
        </div>
      ) : (
        <>
          <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-foreground">
            {comment.content}
          </p>
          {error ? (
            <p role="alert" className="mt-2 text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          ) : null}
        </>
      )}
    </CommentItem>
  );
}
