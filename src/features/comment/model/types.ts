export type CreateCommentPayload = {
  gameId: string;
  content: string;
};

export type UpdateCommentPayload = {
  commentId: string;
  content: string;
};
