import Link from "next/link";
import {
  ChoiceOptionMedia,
  ChoiceResultBar,
  type Choice,
} from "@/entities/choice";
import { formatOptionWithVotes, formatParticipantCount } from "@/shared/lib";
import { routes } from "@/shared/config";

type StatsGameRowProps = {
  choice: Choice;
  highlight?: boolean;
};

export function StatsGameRow({ choice, highlight = false }: StatsGameRowProps) {
  const detailHref = routes.choice(choice.id);

  return (
    <article
      className={`flex items-center gap-2 rounded-3xl border bg-surface p-2 shadow-sm sm:gap-4 sm:p-4 ${
        highlight
          ? "border-accent/40 ring-1 ring-accent/20"
          : "border-border"
      }`}
    >
      <Link
        href={detailHref}
        className="relative grid w-[28%] max-w-56 min-w-[6.75rem] shrink-0 grid-cols-2 gap-1 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface sm:gap-2"
      >
        <div className="group relative aspect-square overflow-hidden rounded-xl bg-surface-muted sm:rounded-2xl">
          <ChoiceOptionMedia
            src={choice.optionAImage}
            alt={choice.optionA}
            label={formatOptionWithVotes(choice.optionA, choice.optionAVotes)}
            sizes="(max-width: 640px) 18vw, 140px"
            labelClassName="p-1.5 text-[10px] sm:p-2.5 sm:text-sm"
          />
        </div>
        <div className="group relative aspect-square overflow-hidden rounded-xl bg-surface-muted sm:rounded-2xl">
          <ChoiceOptionMedia
            src={choice.optionBImage}
            alt={choice.optionB}
            label={formatOptionWithVotes(choice.optionB, choice.optionBVotes)}
            sizes="(max-width: 640px) 18vw, 140px"
            labelClassName="p-1.5 text-[10px] sm:p-2.5 sm:text-sm"
          />
        </div>
        <span className="absolute top-1/2 left-1/2 z-10 flex size-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-foreground text-[10px] font-bold text-background shadow-lg sm:size-9 sm:text-xs">
          VS
        </span>
      </Link>

      <div className="min-w-0 flex-1">
        {highlight ? (
          <p className="text-[11px] font-medium text-accent sm:text-sm">
            선택한 게임
          </p>
        ) : null}
        <h2 className="truncate text-sm font-semibold tracking-tight text-foreground sm:text-lg">
          {choice.title}
        </h2>
        <p className="mt-0.5 truncate text-[11px] text-muted sm:text-sm">
          {choice.authorNickname} · 참여자{" "}
          {formatParticipantCount(choice.participantCount)}명
        </p>
        <ChoiceResultBar choice={choice} size="lg" className="mt-2 sm:mt-3" />
      </div>

      <Link
        href={detailHref}
        className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-full bg-foreground px-3 text-xs font-bold whitespace-nowrap text-background transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface touch-manipulation sm:min-h-12 sm:px-5 sm:text-base"
      >
        참여하기
      </Link>
    </article>
  );
}
