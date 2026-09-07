import type { CreateChoiceFieldErrors, CreateChoicePayload } from "./types";

export function validateCreateChoice(
  payload: CreateChoicePayload,
): CreateChoiceFieldErrors {
  const errors: CreateChoiceFieldErrors = {};

  if (!payload.title.trim()) {
    errors.title = "게임 제목을 입력해 주세요.";
  }

  if (!payload.optionA.trim()) {
    errors.optionA = "선택지 A 텍스트를 입력해 주세요.";
  }

  if (!payload.optionB.trim()) {
    errors.optionB = "선택지 B 텍스트를 입력해 주세요.";
  }

  return errors;
}
