import type { User as AuthUser } from "@supabase/supabase-js";
import type { Database } from "@/shared/api/supabase/database.types";
import type { User } from "./types";

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

export function mapProfileToUser(
  profile: ProfileRow,
  authUser: AuthUser,
): User {
  const metadata = authUser.user_metadata ?? {};
  const metadataPhone =
    typeof metadata.phone === "string" ? metadata.phone : null;
  const metadataCountryCode =
    typeof metadata.country_code === "string" ? metadata.country_code : null;

  return {
    id: profile.id,
    email: authUser.email ?? null,
    phone: authUser.phone || profile.phone || metadataPhone,
    countryCode: profile.country_code || metadataCountryCode,
    nickname: profile.nickname,
    avatarUrl: profile.avatar_url,
    isAnonymous: Boolean(authUser.is_anonymous),
    createdAt: profile.created_at,
  };
}

export function getGoogleAvatarUrl(authUser: AuthUser) {
  const metadata = authUser.user_metadata ?? {};

  return (
    (typeof metadata.avatar_url === "string" && metadata.avatar_url) ||
    (typeof metadata.picture === "string" && metadata.picture) ||
    null
  );
}
