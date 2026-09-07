import type { Choice } from "./types";

export function applyVoteInsert(choice: Choice, option: "A" | "B"): Choice {
  const optionAVotes =
    option === "A" ? choice.optionAVotes + 1 : choice.optionAVotes;
  const optionBVotes =
    option === "B" ? choice.optionBVotes + 1 : choice.optionBVotes;

  return {
    ...choice,
    optionAVotes,
    optionBVotes,
    participantCount: optionAVotes + optionBVotes,
  };
}
