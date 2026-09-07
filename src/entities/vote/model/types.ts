export type VoteOption = "A" | "B";

export type Vote = {
  id: string;
  gameId: string;
  userId: string | null;
  guestKey: string | null;
  option: VoteOption;
  createdAt: string;
  updatedAt: string;
};
