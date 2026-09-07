export type { Vote, VoteOption } from "./model/types";
export { getVoteByGameId, insertVote } from "./api";
export { subscribeVoteInserts } from "./api/subscribe";
export type { VoteInsertEvent } from "./api/subscribe";
