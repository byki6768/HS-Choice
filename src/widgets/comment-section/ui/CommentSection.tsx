"use client";

import { useState } from "react";
import type { Comment } from "@/entities/comment";
import { CommentCard, CreateCommentForm } from "@/features/comment";
import { useAuth } from "@/features/auth";

type CommentSectionProps = {
  gameId: string;
  comments: Comment[];
};

export function CommentSection({ gameId, comments: initialComments }: CommentSectionProps) {
  const { user, isAuthenticated } = useAuth();
  const [comments, setComments] = useState(initialComments);

  return (
    <section className="mt-8 rounded-3xl border border-border bg-surface p-4 shadow-sm sm:mt-10 sm:p-6">
      <header className="mb-4">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">
          댓글 {comments.length}
        </h2>
        <p className="mt-1 text-sm text-muted">
          로그인하면 의견을 남기고, 내 댓글은 수정하거나 삭제할 수 있어요.
        </p>
      </header>

      <CreateCommentForm
        gameId={gameId}
        onCreated={(comment) => {
          setComments((current) => [comment, ...current]);
        }}
      />

      {comments.length === 0 ? (
        <p className="mt-6 rounded-2xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted">
          아직 댓글이 없어요. 첫 댓글을 남겨 보세요.
        </p>
      ) : (
        <ul className="mt-6 flex flex-col gap-3">
          {comments.map((comment) => (
            <li key={comment.id}>
              <CommentCard
                comment={comment}
                isOwner={isAuthenticated && user?.id === comment.authorId}
                onUpdated={(nextComment) => {
                  setComments((current) =>
                    current.map((item) =>
                      item.id === nextComment.id ? nextComment : item,
                    ),
                  );
                }}
                onDeleted={(commentId) => {
                  setComments((current) =>
                    current.filter((item) => item.id !== commentId),
                  );
                }}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
