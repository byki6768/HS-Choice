import type { Metadata } from "next";
import { MyPage } from "@/_pages/mypage";

export const metadata: Metadata = {
  title: "마이페이지 | HS Choice",
};

export default function Page() {
  return <MyPage />;
}
