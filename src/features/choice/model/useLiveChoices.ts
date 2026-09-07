"use client";

import { useEffect, useRef, useState } from "react";
import { applyVoteInsert } from "@/entities/choice/model/apply-vote";
import { sortChoices } from "@/entities/choice/model/sort";
import type { Choice, FeedSort } from "@/entities/choice";
import { subscribeVoteInserts } from "@/entities/vote";

export function useLiveChoices(
  initialChoices: Choice[],
  sort: FeedSort = "latest",
) {
  const [choices, setChoices] = useState(initialChoices);
  const appliedVoteIds = useRef(new Set<string>());
  const feedKey = `${sort}:${initialChoices.map((choice) => choice.id).join(",")}`;

  useEffect(() => {
    setChoices(sortChoices(initialChoices, sort));
    // Reset only when the feed set or sort changes, not on every realtime render.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- feedKey captures identity
  }, [feedKey, sort]);

  useEffect(() => {
    return subscribeVoteInserts((vote) => {
      if (appliedVoteIds.current.has(vote.id)) {
        return;
      }

      appliedVoteIds.current.add(vote.id);
      setChoices((current) =>
        sortChoices(
          current.map((choice) =>
            choice.id === vote.gameId
              ? applyVoteInsert(choice, vote.option)
              : choice,
          ),
          sort,
        ),
      );
    });
  }, [sort]);

  return choices;
}

export function useLiveChoice(initialChoice: Choice) {
  const [choice, setChoice] = useState(initialChoice);
  const appliedVoteIds = useRef(new Set<string>());

  useEffect(() => {
    setChoice(initialChoice);
  }, [initialChoice.id]);

  useEffect(() => {
    return subscribeVoteInserts((vote) => {
      if (appliedVoteIds.current.has(vote.id)) {
        return;
      }

      appliedVoteIds.current.add(vote.id);
      setChoice((current) =>
        current.id === vote.gameId
          ? applyVoteInsert(current, vote.option)
          : current,
      );
    }, initialChoice.id);
  }, [initialChoice.id]);

  return choice;
}
