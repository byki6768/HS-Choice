"use client";

import { VoteButtons } from "@/features/choice";
import type { Choice } from "@/entities/choice";

type ChoiceVoteProps = {
  choice: Choice;
};

export function ChoiceVote({ choice }: ChoiceVoteProps) {
  return (
    <article className="rounded-3xl border border-border bg-surface p-3 shadow-sm sm:p-5 md:p-6">
      <VoteButtons choice={choice} />
    </article>
  );
}
