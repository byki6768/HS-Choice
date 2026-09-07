import type { Metadata } from "next";
import { LoginPage } from "@/_pages/login";

export const metadata: Metadata = {
  title: "로그인",
  description:
    "Google, 이메일, 휴대폰 번호로 HS Choice에 로그인하거나 신규 가입하세요.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/login" },
};

export default async function Page({
  searchParams,
}: PageProps<"/login">) {
  const params = await searchParams;
  const error = Array.isArray(params.error) ? params.error[0] : params.error;
  const mode = Array.isArray(params.mode) ? params.mode[0] : params.mode;

  return <LoginPage error={error} mode={mode} />;
}
