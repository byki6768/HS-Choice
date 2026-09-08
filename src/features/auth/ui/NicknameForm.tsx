"use client";

import { FormEvent, useEffect, useState } from "react";
import { Button, Input } from "@/shared/ui";
import { toFriendlyErrorMessage } from "@/shared/lib";
import { saveNickname } from "../api";
import { SpeechBubble } from "./SpeechBubble";

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
  const [bubble, setBubble] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    function dismissOnNavigate(event: PointerEvent) {
      const target = event.target as HTMLElement | null;
      if (!target) {
        return;
      }

      if (target.closest("form")) {
        return;
      }

      if (!target.closest("a, button")) {
        return;
      }

      setBubble(null);
    }

    document.addEventListener("pointerdown", dismissOnNavigate, true);
    return () => {
      document.removeEventListener("pointerdown", dismissOnNavigate, true);
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextNickname = nickname.trim();
    if (!nextNickname) {
      setBubble("닉네임을 입력해 주세요.");
      return;
    }

    setBubble(null);
    setIsSubmitting(true);

    try {
      await saveNickname(nextNickname);
      onSaved?.();
    } catch (saveError) {
      setBubble(
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
      <Input
        id="nickname"
        label="닉네임"
        name="nickname"
        required
        value={nickname}
        disabled={isSubmitting}
        placeholder="피드에 표시될 이름"
        bubble={
          bubble ? (
            <SpeechBubble id="nickname-hint" message={bubble} />
          ) : undefined
        }
        onChange={(event) => {
          setNickname(event.target.value);
          setBubble(null);
        }}
      />
      <Button type="submit" loading={isSubmitting}>
        {isSubmitting ? "저장 중..." : submitLabel}
      </Button>
    </form>
  );
}
