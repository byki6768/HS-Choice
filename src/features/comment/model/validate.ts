const MAX_COMMENT_LENGTH = 500;

export function validateCommentContent(content: string) {
  const trimmed = content.trim();

  if (!trimmed) {
    return "댓글을 입력해 주세요.";
  }

  if (trimmed.length > MAX_COMMENT_LENGTH) {
    return `댓글은 ${MAX_COMMENT_LENGTH}자까지 입력할 수 있어요.`;
  }

  return null;
}
