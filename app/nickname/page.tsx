import type { Metadata } from "next";
import { NicknamePage } from "@/_pages/nickname";

export const metadata: Metadata = {
  title: "닉네임 설정 | HS Choice",
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
