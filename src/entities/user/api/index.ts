import type { User as AuthUser } from "@supabase/supabase-js";
import { createBrowserClient } from "@/shared/api";
import { toFriendlyError } from "@/shared/lib";
import { getGoogleAvatarUrl, mapProfileToUser } from "../model/map-profile";
import type { User } from "../model/types";

const PROFILE_CLIENT_COLUMNS =
  "id, nickname, avatar_url, phone, country_code, created_at, updated_at" as const;

export async function getProfileById(userId: string) {
  const supabase = createBrowserClient();
  const { data, error } = await supabase
    .from("profiles")
    .select(PROFILE_CLIENT_COLUMNS)
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    throw toFriendlyError(
      error,
      "프로필을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.",
    );
  }

  return data;
}

export async function syncProfileFromAuthUser(
  authUser: AuthUser,
): Promise<User> {
  const supabase = createBrowserClient();
  const avatarUrl = getGoogleAvatarUrl(authUser);
  const metadata = authUser.user_metadata ?? {};
  const phone =
    authUser.phone ||
    (typeof metadata.phone === "string" ? metadata.phone : null);
  const countryCode =
    typeof metadata.country_code === "string" && metadata.country_code.trim()
      ? metadata.country_code.trim()
      : null;
  const existing = await getProfileById(authUser.id);

  if (!existing) {
    const { data, error } = await supabase
      .from("profiles")
      .upsert({
        id: authUser.id,
        nickname: null,
        avatar_url: avatarUrl,
        phone,
        country_code: countryCode,
      })
      .select(PROFILE_CLIENT_COLUMNS)
      .single();

    if (error || !data) {
      throw toFriendlyError(
        error,
        "프로필을 만들지 못했어요. 잠시 후 다시 시도해 주세요.",
      );
    }

    return mapProfileToUser(data, authUser);
  }

  const nextPhone = phone && phone !== existing.phone ? phone : existing.phone;
  const nextCountryCode =
    countryCode && countryCode !== existing.country_code
      ? countryCode
      : existing.country_code;
  const nextAvatar =
    avatarUrl && avatarUrl !== existing.avatar_url
      ? avatarUrl
      : existing.avatar_url;

  if (
    nextPhone !== existing.phone ||
    nextCountryCode !== existing.country_code ||
    nextAvatar !== existing.avatar_url
  ) {
    const { data, error } = await supabase
      .from("profiles")
      .update({
        avatar_url: nextAvatar,
        phone: nextPhone,
        country_code: nextCountryCode,
      })
      .eq("id", authUser.id)
      .select(PROFILE_CLIENT_COLUMNS)
      .single();

    if (error || !data) {
      throw toFriendlyError(
        error,
        "프로필을 저장하지 못했어요. 잠시 후 다시 시도해 주세요.",
      );
    }

    return mapProfileToUser(data, authUser);
  }

  return mapProfileToUser(existing, authUser);
}

export async function updateNickname(userId: string, nickname: string) {
  const nextNickname = nickname.trim();

  if (!nextNickname) {
    throw new Error("닉네임을 입력해 주세요.");
  }

  const supabase = createBrowserClient();
  const { data, error } = await supabase
    .from("profiles")
    .update({ nickname: nextNickname })
    .eq("id", userId)
    .select(PROFILE_CLIENT_COLUMNS)
    .single();

  if (error || !data) {
    throw toFriendlyError(
      error,
      "닉네임을 저장하지 못했어요. 다시 시도해 주세요.",
    );
  }

  return data;
}
