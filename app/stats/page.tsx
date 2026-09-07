import type { Metadata } from "next";
import { StatsPage } from "@/_pages/stats";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "통계 보기",
  description:
    "밸런스 게임 투표 결과를 그래프로 확인하고, 다른 게임의 통계도 이어서 볼 수 있습니다.",
  alternates: { canonical: "/stats" },
  openGraph: {
    title: "통계 보기 | HS Choice",
    description:
      "밸런스 게임 투표 결과를 그래프로 확인하고, 다른 게임의 통계도 이어서 볼 수 있습니다.",
    url: "/stats",
  },
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
