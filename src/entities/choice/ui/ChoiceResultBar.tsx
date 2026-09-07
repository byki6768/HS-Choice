import { formatVoteCount } from "@/shared/lib";
import type { Choice } from "../model/types";

const OPTION_A_COLOR = "#F28B9C";
const OPTION_B_COLOR = "#6BA8E8";

type ChoiceResultBarProps = {
  choice: Choice;
  className?: string;
  size?: "md" | "lg";
};

export function ChoiceResultBar({
  choice,
  className = "",
  size = "md",
}: ChoiceResultBarProps) {
  const total = choice.optionAVotes + choice.optionBVotes;
  const aPercent = total === 0 ? 0 : (choice.optionAVotes / total) * 100;
  const bPercent = total === 0 ? 0 : (choice.optionBVotes / total) * 100;
  const isLarge = size === "lg";

  return (
    <div
      className={`min-w-0 ${className}`.trim()}
      role="img"
      aria-label={
        total === 0
          ? "아직 투표가 없어요"
          : `${choice.optionA} ${formatVoteCount(choice.optionAVotes)}, ${choice.optionB} ${formatVoteCount(choice.optionBVotes)}`
      }
    >
      <div
        className={`flex w-full overflow-hidden rounded-full bg-surface-muted ring-1 ring-border ${
          isLarge ? "h-12 sm:h-14" : "h-6 sm:h-7"
        }`}
      >
        {total === 0 ? (
          <span
            className={`flex w-full items-center justify-center px-3 font-medium text-muted ${
              isLarge ? "text-sm sm:text-base" : "text-[11px] sm:text-xs"
            }`}
          >
            아직 투표 없음
          </span>
        ) : (
          <>
            <BarSegment
              color={OPTION_A_COLOR}
              grow={choice.optionAVotes}
              percent={aPercent}
              label={choice.optionA}
              large={isLarge}
            />
            <BarSegment
              color={OPTION_B_COLOR}
              grow={choice.optionBVotes}
              percent={bPercent}
              label={choice.optionB}
              large={isLarge}
            />
          </>
        )}
      </div>
    </div>
  );
}

type BarSegmentProps = {
  color: string;
  grow: number;
  percent: number;
  label: string;
  large?: boolean;
};

function BarSegment({
  color,
  grow,
  percent,
  label,
  large = false,
}: BarSegmentProps) {
  if (grow <= 0) {
    return null;
  }

  const minVisiblePercent = large ? 12 : 18;

  return (
    <div
      className={`flex min-w-0 items-center justify-center overflow-hidden font-bold text-white ${
        large ? "text-sm sm:text-base" : "text-[11px] sm:text-xs"
      }`}
      style={{ flexGrow: grow, flexBasis: 0, backgroundColor: color }}
      title={`${label} ${Math.round(percent)}%`}
    >
      {percent >= minVisiblePercent ? `${Math.round(percent)}%` : null}
    </div>
  );
}
