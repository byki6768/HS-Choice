import type { Metadata } from "next";
import { MyPage } from "@/_pages/mypage";

export const metadata: Metadata = {
  title: "마이페이지",
  description: "닉네임과 계정 정보를 관리하는 HS Choice 마이페이지입니다.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <MyPage />;
}
