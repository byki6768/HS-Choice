import type { Metadata } from "next";
import { StatsPage } from "@/_pages/stats";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "통계 보기 | HS Choice",
};

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const highlightId = firstParam(params.game);
  const showVotedMessage = firstParam(params.voted) === "1";

  return (
    <StatsPage
      highlightId={highlightId}
      showVotedMessage={showVotedMessage}
    />
  );
}
