"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input } from "@/shared/ui";
import { routes } from "@/shared/config";
import { toFriendlyErrorMessage } from "@/shared/lib";
import { createChoice } from "../api";
import type { CreateChoiceFieldErrors, CreateChoicePayload } from "../model/types";
import { validateCreateChoice } from "../model/validate";
import { ImageUploadField } from "./ImageUploadField";

const emptyErrors: CreateChoiceFieldErrors = {};
const REDIRECT_DELAY_MS = 1600;

export function CreateChoiceForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [optionAImage, setOptionAImage] = useState<File | null>(null);
  const [optionBImage, setOptionBImage] = useState<File | null>(null);
  const [fieldErrors, setFieldErrors] = useState<CreateChoiceFieldErrors>(emptyErrors);
  const [formError, setFormError] = useState<string | null>(null);
  const [isCreated, setIsCreated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isCreated) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      router.push(routes.home);
      router.refresh();
    }, REDIRECT_DELAY_MS);

    return () => window.clearTimeout(timeoutId);
  }, [isCreated, router]);

  function resetForm() {
    setTitle("");
    setOptionA("");
    setOptionB("");
    setOptionAImage(null);
    setOptionBImage(null);
    setFieldErrors(emptyErrors);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const payload: CreateChoicePayload = {
      title,
      optionA,
      optionB,
      optionAImage,
      optionBImage,
    };
    const nextErrors = validateCreateChoice(payload);

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      setFormError("필수 항목을 모두 입력해 주세요.");
      return;
    }

    setFieldErrors(emptyErrors);
    setFormError(null);
    setIsSubmitting(true);

    try {
      await createChoice(payload);
      resetForm();
      setIsCreated(true);
    } catch (error) {
      setFormError(
        toFriendlyErrorMessage(
          error,
          "게임을 생성하지 못했어요. 잠시 후 다시 시도해 주세요.",
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      {isCreated ? (
        <div
          role="status"
          className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-center text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200"
        >
          <p className="text-base font-semibold">게임 생성 완료!</p>
        </div>
      ) : null}

      {formError ? (
        <div
          role="alert"
          className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
        >
          {formError}
        </div>
      ) : null}

      <Input
        id="choice-title"
        label="게임 제목"
        name="title"
        value={title}
        required
        disabled={isSubmitting || isCreated}
        placeholder="예: 오늘 저녁, 어디서 힐링할까?"
        error={fieldErrors.title}
        onChange={(event) => setTitle(event.target.value)}
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-5">
          <Input
            id="choice-option-a"
            label="선택지 A"
            name="optionA"
            value={optionA}
            required
            disabled={isSubmitting || isCreated}
            placeholder="예: 집에서 넷플릭스"
            error={fieldErrors.optionA}
            onChange={(event) => setOptionA(event.target.value)}
          />
          <ImageUploadField
            label="선택지 A 이미지"
            file={optionAImage}
            disabled={isSubmitting || isCreated}
            onChange={setOptionAImage}
          />
        </div>

        <div className="flex flex-col gap-5">
          <Input
            id="choice-option-b"
            label="선택지 B"
            name="optionB"
            value={optionB}
            required
            disabled={isSubmitting || isCreated}
            placeholder="예: 밖에 나가 맛집"
            error={fieldErrors.optionB}
            onChange={(event) => setOptionB(event.target.value)}
          />
          <ImageUploadField
            label="선택지 B 이미지"
            file={optionBImage}
            disabled={isSubmitting || isCreated}
            onChange={setOptionBImage}
          />
        </div>
      </div>

      <Button type="submit" loading={isSubmitting} disabled={isCreated}>
        {isSubmitting ? "생성 중..." : "게임 생성하기"}
      </Button>
    </form>
  );
}
