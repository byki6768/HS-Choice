import { createBrowserClient } from "@/shared/api";
import { toFriendlyError } from "@/shared/lib";
import { mapGameToChoice, type GameQueryRow } from "../model/map-game";
import { sortChoices } from "../model/sort";
import type { FeedSort } from "../model/types";

export const GAME_IMAGES_BUCKET = "game-images";

const GAME_SELECT =
  "*, profiles!games_author_id_fkey(nickname), votes(option)" as const;

function getImageExtension(file: File) {
  const fromName = file.name.split(".").pop()?.toLowerCase();
  const allowed = new Set(["jpg", "jpeg", "png", "webp", "gif", "avif"]);

  if (fromName && allowed.has(fromName)) {
    return fromName === "jpeg" ? "jpg" : fromName;
  }

  const fromType: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
    "image/avif": "avif",
  };

  return fromType[file.type] ?? "jpg";
}

export async function getChoices(sort: FeedSort = "latest") {
  const supabase = createBrowserClient();
  const { data, error } = await supabase
    .from("games")
    .select(GAME_SELECT)
    .order("created_at", { ascending: false });

  if (error) {
    throw toFriendlyError(
      error,
      "게임을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.",
    );
  }

  return sortChoices(
    ((data ?? []) as GameQueryRow[]).map(mapGameToChoice),
    sort,
  );
}

export async function getChoiceById(id: string) {
  const supabase = createBrowserClient();
  const { data, error } = await supabase
    .from("games")
    .select(GAME_SELECT)
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return mapGameToChoice(data as GameQueryRow);
}

export async function uploadGameImage(input: {
  userId: string;
  gameId: string;
  option: "a" | "b";
  file: File;
}) {
  const supabase = createBrowserClient();
  const extension = getImageExtension(input.file);
  const path = `${input.userId}/${input.gameId}/option-${input.option}.${extension}`;

  const { error } = await supabase.storage
    .from(GAME_IMAGES_BUCKET)
    .upload(path, input.file, {
      cacheControl: "3600",
      upsert: false,
      contentType: input.file.type || "image/jpeg",
    });

  if (error) {
    throw toFriendlyError(
      error,
      "이미지를 올리지 못했어요. 잠시 후 다시 시도해 주세요.",
    );
  }

  const { data } = supabase.storage.from(GAME_IMAGES_BUCKET).getPublicUrl(path);

  return { path, url: data.publicUrl };
}

export async function removeGameImages(paths: string[]) {
  if (paths.length === 0) {
    return;
  }

  const supabase = createBrowserClient();
  await supabase.storage.from(GAME_IMAGES_BUCKET).remove(paths);
}

export async function insertGame(input: {
  id: string;
  authorId: string;
  title: string;
  optionA: string;
  optionB: string;
  optionAImageUrl: string | null;
  optionBImageUrl: string | null;
}) {
  const supabase = createBrowserClient();
  const { data, error } = await supabase
    .from("games")
    .insert({
      id: input.id,
      author_id: input.authorId,
      title: input.title,
      option_a: input.optionA,
      option_b: input.optionB,
      option_a_image_path: input.optionAImageUrl,
      option_b_image_path: input.optionBImageUrl,
    })
    .select("id, title")
    .single();

  if (error || !data) {
    throw toFriendlyError(
      error,
      "게임을 저장하지 못했어요. 잠시 후 다시 시도해 주세요.",
    );
  }

  return data;
}
