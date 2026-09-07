import Link from "next/link";
import { formatOptionWithVotes, formatParticipantCount } from "@/shared/lib";
import { routes } from "@/shared/config";
import type { Choice } from "../model/types";
import { ChoiceCommentPreview } from "./ChoiceCommentPreview";
import { ChoiceOptionMedia } from "./ChoiceOptionMedia";
import { ChoiceResultBar } from "./ChoiceResultBar";

type ChoiceCardProps = {
  choice: Choice;
};

export function ChoiceCard({ choice }: ChoiceCardProps) {
  const detailHref = routes.choice(choice.id);

  return (
    <article className="rounded-3xl border border-border bg-surface p-3 shadow-sm sm:p-4">
      <div className="flex flex-col gap-3 landscape:flex-row landscape:items-center landscape:gap-4">
        <Link
          href={detailHref}
          className="group/card min-w-0 flex-1 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
        >
          <div className="mb-3 flex items-start justify-between gap-3 sm:mb-4">
            <div className="min-w-0">
              <h2 className="text-base font-semibold tracking-tight text-foreground sm:text-lg">
                {choice.title}
              </h2>
              <p className="mt-1 text-xs text-muted sm:text-sm">
                {choice.authorNickname} · 참여자{" "}
                {formatParticipantCount(choice.participantCount)}명
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-surface-muted px-2.5 py-1 text-[11px] font-medium text-muted sm:text-xs">
              VS
            </span>
          </div>

          <div className="relative grid grid-cols-2 gap-2 sm:gap-3">
            <div className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-surface-muted sm:aspect-[5/4]">
              <ChoiceOptionMedia
                src={choice.optionAImage}
                alt={choice.optionA}
                label={formatOptionWithVotes(choice.optionA, choice.optionAVotes)}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 40vw, 420px"
                labelClassName="text-sm sm:text-base"
              />
            </div>
            <div className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-surface-muted sm:aspect-[5/4]">
              <ChoiceOptionMedia
                src={choice.optionBImage}
                alt={choice.optionB}
                label={formatOptionWithVotes(choice.optionB, choice.optionBVotes)}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 40vw, 420px"
                labelClassName="text-sm sm:text-base"
              />
            </div>
            <span className="absolute top-1/2 left-1/2 z-10 flex size-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-foreground text-[11px] font-bold text-background shadow-lg sm:size-11 sm:text-xs">
              VS
            </span>
          </div>
        </Link>

        <div className="flex min-w-0 items-center gap-2 sm:gap-3 landscape:contents">
          <ChoiceResultBar
            choice={choice}
            className="min-w-0 flex-1 landscape:w-44 landscape:flex-none lg:w-56 xl:w-64"
          />
          <Link
            href={detailHref}
            className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-full bg-foreground px-4 text-sm font-bold whitespace-nowrap text-background transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface touch-manipulation sm:px-5 sm:text-base"
          >
            참여하기
          </Link>
        </div>
      </div>
      <ChoiceCommentPreview
        choiceId={choice.id}
        comments={choice.previewComments}
      />
    </article>
  );
}
