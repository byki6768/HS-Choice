"use client";

import type { ReactNode } from "react";
import { Button } from "@/shared/ui/button";

type ErrorStateProps = {
  title?: string;
  description?: string;
  action?: ReactNode;
};

export function ErrorState({
  title = "잠시 문제가 생겼어요",
  description = "요청을 처리하지 못했어요. 조금 뒤에 다시 시도해 주세요.",
  action,
}: ErrorStateProps) {
  return (
    <div className="rounded-3xl border border-dashed border-border bg-surface px-6 py-16 text-center">
      <p className="text-base font-semibold text-foreground">{title}</p>
      <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
      {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
    </div>
  );
}

type ErrorRetryButtonProps = {
  onRetry: () => void;
};

export function ErrorRetryButton({ onRetry }: ErrorRetryButtonProps) {
  return (
    <Button type="button" className="sm:w-auto" onClick={onRetry}>
      다시 시도하기
    </Button>
  );
}
