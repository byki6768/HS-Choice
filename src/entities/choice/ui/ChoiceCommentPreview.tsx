import Link from "next/link";
import type { Comment } from "@/entities/comment/model/types";
import { routes } from "@/shared/config";

type ChoiceCommentPreviewProps = {
  choiceId: string;
  comments: Comment[];
};

export function ChoiceCommentPreview({
  choiceId,
  comments,
}: ChoiceCommentPreviewProps) {
  const preview = comments.slice(0, 2);

  return (
    <div className="mt-3 flex items-center gap-2 border-t border-border pt-3 sm:gap-3">
      <div className="min-w-0 flex-1">
        {preview.length === 0 ? (
          <p className="truncate text-sm text-muted">아직 댓글이 없어요.</p>
        ) : (
          <ul className="flex flex-col gap-1">
            {preview.map((comment) => (
              <li
                key={comment.id}
                className="flex min-w-0 items-baseline gap-2 text-sm leading-5"
              >
                <span className="shrink-0 font-semibold text-foreground">
                  {comment.authorNickname}
                </span>
                <span className="min-w-0 truncate text-muted">
                  {comment.content.replace(/\s+/g, " ")}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <Link
        href={routes.choiceComments(choiceId)}
        className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-full border border-border bg-surface px-3 text-xs font-bold whitespace-nowrap text-foreground transition hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface touch-manipulation sm:min-h-12 sm:px-4 sm:text-sm"
      >
        댓글달기
      </Link>
    </div>
  );
}
