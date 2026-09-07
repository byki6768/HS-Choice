export type { Comment } from "./model/types";
export { CommentItem } from "./ui/CommentItem";
export {
  deleteCommentById,
  getCommentsByGameId,
  insertComment,
  updateCommentContent,
} from "./api";
