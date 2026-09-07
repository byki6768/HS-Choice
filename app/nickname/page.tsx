import type { Metadata } from "next";
import { NicknamePage } from "@/_pages/nickname";

export const metadata: Metadata = {
  title: "닉네임 설정",
  description: "HS Choice에서 사용할 닉네임을 설정합니다.",
  robots: { index: false, follow: false },
};

export default async function Page({
  searchParams,
}: PageProps<"/nickname">) {
  const params = await searchParams;
  const welcome = Array.isArray(params.welcome)
    ? params.welcome[0]
    : params.welcome;

  return <NicknamePage welcome={welcome === "1"} />;
}
