"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChoiceOptionMedia, type Choice } from "@/entities/choice";
import { formatOptionWithVotes } from "@/shared/lib";
import { routes } from "@/shared/config";
import type { VoteOption } from "@/entities/vote";
import { getMyVote, getVoterKey, voteChoice } from "../api";
import { hasLocalVote, recordLocalVote } from "../model/local-votes";
import { VoteFeedback } from "./VoteFeedback";
import { useAuth } from "@/features/auth";

type VoteButtonsProps = {
  choice: Choice;
};

export function VoteButtons({ choice }: VoteButtonsProps) {
  const router = useRouter();
  const { user, isReady: isAuthReady } = useAuth();
  const voterId = user?.id ?? null;
  const [voterKey, setVoterKey] = useState<string | null>(null);
  const [votedOption, setVotedOption] = useState<VoteOption | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"success" | "duplicate" | null>(
    null,
  );

  useEffect(() => {
    if (!isAuthReady) {
      return;
    }

    let cancelled = false;
    setVotedOption(null);
    setFeedback(null);
    setVoterKey(null);
    setIsReady(false);

    void (async () => {
      try {
        const [nextVoterKey, vote] = await Promise.all([
          getVoterKey(),
          getMyVote(choice.id),
        ]);

        if (cancelled) {
          return;
        }

        setVoterKey(nextVoterKey);

        if (vote) {
          setVotedOption(vote.option);
          recordLocalVote(choice.id, nextVoterKey);
        }
      } catch {
        if (!cancelled) {
          setError("투표 정보를 불러오지 못했어요.");
        }
      } finally {
        if (!cancelled) {
          setIsReady(true);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [choice.id, isAuthReady, voterId]);

  useEffect(() => {
    if (feedback === "duplicate") {
      const timer = window.setTimeout(() => {
        router.replace(routes.home);
      }, 2000);

      return () => {
        window.clearTimeout(timer);
      };
    }

    if (feedback === "success") {
      const timer = window.setTimeout(() => {
        router.push(routes.stats(choice.id, { voted: true }));
      }, 800);

      return () => {
        window.clearTimeout(timer);
      };
    }
  }, [choice.id, feedback, router]);

  function handleAlreadyVoted() {
    setError(null);
    setFeedback("duplicate");
  }

  async function handleVote(option: VoteOption) {
    if (isVoting || feedback) {
      return;
    }

    if (
      (voterKey && hasLocalVote(choice.id, voterKey)) ||
      votedOption
    ) {
      handleAlreadyVoted();
      return;
    }

    if (!isReady) {
      return;
    }

    setIsVoting(true);
    setError(null);

    try {
      const { vote, created } = await voteChoice({
        choiceId: choice.id,
        option,
      });

      recordLocalVote(choice.id, voterKey ?? (await getVoterKey()));
      setVotedOption(vote.option);

      if (!created) {
        handleAlreadyVoted();
        return;
      }

      setFeedback("success");
    } catch {
      setError("투표를 저장하지 못했어요. 잠시 후 다시 시도해 주세요.");
    } finally {
      setIsVoting(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {feedback === "duplicate" ? (
        <VoteFeedback message="이미 선택하였습니다!" />
      ) : null}
      {feedback === "success" ? (
        <VoteFeedback message="선택 완료" />
      ) : null}
      <div className="relative grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-5">
        <ChoiceButton
          label={formatOptionWithVotes(choice.optionA, choice.optionAVotes)}
          imageSrc={choice.optionAImage}
          selected={votedOption === "A"}
          disabled={!isReady || isVoting || Boolean(feedback)}
          voted={Boolean(votedOption)}
          priority
          onSelect={() => void handleVote("A")}
        />
        <ChoiceButton
          label={formatOptionWithVotes(choice.optionB, choice.optionBVotes)}
          imageSrc={choice.optionBImage}
          selected={votedOption === "B"}
          disabled={!isReady || isVoting || Boolean(feedback)}
          voted={Boolean(votedOption)}
          onSelect={() => void handleVote("B")}
        />
        <span className="absolute top-1/2 left-1/2 z-10 flex size-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-foreground text-sm font-bold text-background shadow-xl md:size-14 md:text-base">
          VS
        </span>
      </div>
      {error ? (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      ) : null}
    </div>
  );
}

type ChoiceButtonProps = {
  label: string;
  imageSrc: string | null;
  selected: boolean;
  disabled: boolean;
  voted: boolean;
  onSelect: () => void;
  priority?: boolean;
};

function ChoiceButton({
  label,
  imageSrc,
  selected,
  disabled,
  voted,
  onSelect,
  priority = false,
}: ChoiceButtonProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      aria-pressed={selected}
      className={`group relative min-h-56 overflow-hidden rounded-3xl bg-surface-muted text-left touch-manipulation transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface sm:min-h-72 md:min-h-80 lg:min-h-96 ${
        selected
          ? "ring-2 ring-accent ring-offset-2 ring-offset-surface"
          : voted
            ? "opacity-80"
            : "hover:brightness-105 disabled:opacity-70"
      }`}
    >
      <ChoiceOptionMedia
        src={imageSrc}
        alt={label}
        label={label}
        priority={priority}
        sizes="(max-width: 768px) 100vw, 50vw"
        labelClassName="text-lg sm:text-xl md:text-2xl px-1"
      />
      {selected ? (
        <span className="absolute top-3 right-3 z-10 flex size-9 items-center justify-center rounded-full bg-accent text-white shadow-md sm:size-10">
          <CheckIcon />
          <span className="sr-only">선택한 항목</span>
        </span>
      ) : null}
    </button>
  );
}

function CheckIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 20 20"
      className="size-5"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16.25 5.75 8.5 14.25 3.75 9.75"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
