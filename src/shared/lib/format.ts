export function formatParticipantCount(count: number) {
  return new Intl.NumberFormat("ko-KR").format(count);
}

export function formatVoteCount(count: number) {
  return `${formatParticipantCount(count)}표`;
}

export function formatOptionWithVotes(label: string, count: number) {
  return `${label} ${formatVoteCount(count)}`;
}
