export type User = {
  id: string;
  email: string | null;
  phone: string | null;
  countryCode: string | null;
  nickname: string | null;
  avatarUrl: string | null;
  isAnonymous: boolean;
  createdAt: string;
};

export function hasNickname(user: User | null | undefined) {
  return Boolean(user?.nickname?.trim());
}
