"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/shared/ui";
import { routes } from "@/shared/config";
import { toFriendlyErrorMessage } from "@/shared/lib";
import { useAuth } from "@/features/auth";
import type { Comment } from "@/entities/comment";
import { createComment } from "../api";

type CreateCommentFormProps = {
  gameId: string;
  onCreated: (comment: Comment) => void;
};

export function CreateCommentForm({ gameId, onCreated }: CreateCommentFormProps) {
  const router = useRouter();
  const { isAuthenticated, isReady } = useAuth();
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function goToLogin() {
    router.push(
      `${routes.login}?next=${encodeURIComponent(routes.choice(gameId))}`,
    );
  }

  function handleGuestIntent() {
    if (isReady && !isAuthenticated) {
      goToLogin();
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isReady) {
      return;
    }

    if (!isAuthenticated) {
      goToLogin();
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const comment = await createComment({
        gameId,
        content,
      });
      setContent("");
      onCreated(comment);
    } catch (submitError) {
      setError(
        toFriendlyErrorMessage(
          submitError,
          "댓글을 저장하지 못했어요. 잠시 후 다시 시도해 주세요.",
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <label htmlFor="comment-content" className="text-sm font-medium text-foreground">
        댓글
      </label>
      <textarea
        id="comment-content"
        name="content"
        rows={3}
        value={content}
        disabled={isSubmitting}
        placeholder={
          isReady && !isAuthenticated
            ? "로그인하고 댓글을 남겨 보세요"
            : "이 게임에 대한 생각을 남겨 주세요"
        }
        className="min-h-24 w-full resize-y rounded-2xl border border-border bg-background px-4 py-3 text-base text-foreground outline-none transition placeholder:text-muted focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
        onFocus={handleGuestIntent}
        onChange={(event) => setContent(event.target.value)}
      />
      {error ? (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      ) : null}
      <Button type="submit" loading={isSubmitting} className="sm:w-auto sm:self-end">
        {isSubmitting ? "등록 중..." : "댓글 등록"}
      </Button>
    </form>
  );
}
