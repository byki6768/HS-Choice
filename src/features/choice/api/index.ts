import {
  insertGame,
  removeGameImages,
  uploadGameImage,
} from "@/entities/choice/api";
import { createBrowserClient } from "@/shared/api";
import { toFriendlyError } from "@/shared/lib";
import type { CreateChoicePayload } from "../model/types";

export { getMyVote, voteChoice, getVoterKey } from "./vote";

function toCreateChoiceError(error: unknown) {
  const message =
    error instanceof Error ? error.message.toLowerCase() : "";

  if (message.includes("row-level security")) {
    return new Error("로그인한 사용자만 게임을 만들 수 있어요.");
  }

  return toFriendlyError(
    error,
    "게임을 생성하지 못했어요. 잠시 후 다시 시도해 주세요.",
  );
}

export async function createChoice(payload: CreateChoicePayload) {
  const supabase = createBrowserClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user || user.is_anonymous) {
    throw new Error("로그인한 사용자만 게임을 만들 수 있어요.");
  }

  const gameId = crypto.randomUUID();
  const uploadedPaths: string[] = [];

  try {
    const optionAImage = payload.optionAImage
      ? await uploadGameImage({
          userId: user.id,
          gameId,
          option: "a",
          file: payload.optionAImage,
        })
      : null;
    if (optionAImage) {
      uploadedPaths.push(optionAImage.path);
    }

    const optionBImage = payload.optionBImage
      ? await uploadGameImage({
          userId: user.id,
          gameId,
          option: "b",
          file: payload.optionBImage,
        })
      : null;
    if (optionBImage) {
      uploadedPaths.push(optionBImage.path);
    }

    return await insertGame({
      id: gameId,
      authorId: user.id,
      title: payload.title.trim(),
      optionA: payload.optionA.trim(),
      optionB: payload.optionB.trim(),
      optionAImageUrl: optionAImage?.url ?? null,
      optionBImageUrl: optionBImage?.url ?? null,
    });
  } catch (error) {
    await removeGameImages(uploadedPaths);
    throw toCreateChoiceError(error);
  }
}
