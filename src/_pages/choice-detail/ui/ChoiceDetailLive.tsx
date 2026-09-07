"use client";

import { useLiveChoice } from "@/features/choice";
import { formatParticipantCount } from "@/shared/lib";
import { ChoiceVote } from "@/widgets/choice-vote";
import { CommentSection } from "@/widgets/comment-section";
import type { Choice } from "@/entities/choice";
import type { Comment } from "@/entities/comment";

type ChoiceDetailLiveProps = {
  choice: Choice;
  comments: Comment[];
};

export function ChoiceDetailLive({ choice, comments }: ChoiceDetailLiveProps) {
  const liveChoice = useLiveChoice(choice);

  return (
    <>
      <header className="mb-5 sm:mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
          {liveChoice.title}
        </h1>
        <p className="mt-2 text-sm text-muted sm:text-base">
          {liveChoice.authorNickname} · 참여자{" "}
          {formatParticipantCount(liveChoice.participantCount)}명
        </p>
      </header>
      <ChoiceVote choice={liveChoice} />
      <CommentSection gameId={liveChoice.id} comments={comments} />
    </>
  );
}
