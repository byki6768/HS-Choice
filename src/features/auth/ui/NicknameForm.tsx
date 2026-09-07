"use client";

import { FormEvent, useState } from "react";
import { Button, Input } from "@/shared/ui";
import { toFriendlyErrorMessage } from "@/shared/lib";
import { saveNickname } from "../api";

type NicknameFormProps = {
  initialNickname?: string;
  submitLabel: string;
  onSaved?: () => void;
};

export function NicknameForm({
  initialNickname = "",
  submitLabel,
  onSaved,
}: NicknameFormProps) {
  const [nickname, setNickname] = useState(initialNickname);
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextNickname = nickname.trim();
    if (!nextNickname) {
      setError("닉네임을 입력해 주세요.");
      setFormError("필수 항목을 입력해 주세요.");
      return;
    }

    setError(null);
    setFormError(null);
    setIsSubmitting(true);

    try {
      await saveNickname(nextNickname);
      onSaved?.();
    } catch (saveError) {
      setFormError(
        toFriendlyErrorMessage(
          saveError,
          "닉네임을 저장하지 못했어요. 다시 시도해 주세요.",
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      {formError ? (
        <div
          role="alert"
          className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
        >
          {formError}
        </div>
      ) : null}
      <Input
        id="nickname"
        label="닉네임"
        name="nickname"
        required
        value={nickname}
        disabled={isSubmitting}
        placeholder="피드에 표시될 이름"
        error={error ?? undefined}
        onChange={(event) => setNickname(event.target.value)}
      />
      <Button type="submit" loading={isSubmitting}>
        {isSubmitting ? "저장 중..." : submitLabel}
      </Button>
    </form>
  );
}
