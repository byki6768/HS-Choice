"use client";

import Link from "next/link";
import { type Choice } from "@/entities/choice";
import { useLiveChoices } from "@/features/choice";
import { routes } from "@/shared/config";
import { StatsGameRow } from "./StatsGameRow";

type StatsLiveProps = {
  choices: Choice[];
  highlightId?: string;
};

export function StatsLive({ choices, highlightId }: StatsLiveProps) {
  const liveChoices = useLiveChoices(choices, "latest");
  const highlight = highlightId
    ? liveChoices.find((choice) => choice.id === highlightId)
    : undefined;
  const rest = highlight
    ? liveChoices.filter((choice) => choice.id !== highlight.id)
    : liveChoices;

  if (liveChoices.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-border bg-surface px-6 py-16 text-center">
        <p className="text-base font-semibold leading-7 text-foreground">
          아직 게임이 없어요. 첫번째 게임을 만들어 보세요!
        </p>
        <Link
          href={routes.createChoice}
          className="mt-6 inline-flex min-h-12 items-center justify-center rounded-2xl bg-foreground px-5 text-base font-semibold text-background touch-manipulation"
        >
          게임 만들기
        </Link>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-3 sm:gap-4">
      {highlight ? (
        <li>
          <StatsGameRow choice={highlight} highlight />
        </li>
      ) : null}
      {rest.map((choice) => (
        <li key={choice.id}>
          <StatsGameRow choice={choice} />
        </li>
      ))}
    </ul>
  );
}
