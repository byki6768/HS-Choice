export type { Comment } from "./model/types";
export { CommentItem } from "./ui/CommentItem";
export {
  deleteCommentById,
  getCommentsByGameId,
  getPreviewCommentsByGameIds,
  insertComment,
  PREVIEW_COMMENT_COUNT,
  updateCommentContent,
} from "./api";
