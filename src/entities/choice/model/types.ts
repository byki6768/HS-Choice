import type { Comment } from "@/entities/comment/model/types";

export type FeedSort = "latest" | "popular";

export type Choice = {
  id: string;
  title: string;
  optionA: string;
  optionB: string;
  optionAImage: string | null;
  optionBImage: string | null;
  optionAVotes: number;
  optionBVotes: number;
  authorId: string;
  authorNickname: string;
  participantCount: number;
  createdAt: string;
  previewComments: Comment[];
};
