import type { ReactNode } from "react";
import type { Comment } from "../model/types";

type CommentItemProps = {
  comment: Comment;
  actions?: ReactNode;
  children?: ReactNode;
  edited?: boolean;
};

export function CommentItem({
  comment,
  actions,
  children,
  edited = false,
}: CommentItemProps) {
  return (
    <article className="rounded-2xl border border-border bg-background p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground">
            {comment.authorNickname}
          </p>
          <p className="mt-0.5 text-xs text-muted">
            {formatCommentTime(comment.createdAt)}
            {edited ? " · 수정됨" : null}
          </p>
        </div>
        {actions}
      </div>
      {children ?? (
        <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-foreground">
          {comment.content}
        </p>
      )}
    </article>
  );
}

function formatCommentTime(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}
