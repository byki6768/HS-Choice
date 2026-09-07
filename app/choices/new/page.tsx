import type { Metadata } from "next";
import { ChoiceCreatePage } from "@/_pages/choice-create";
import { ProtectedRoute } from "@/features/auth";

export const metadata: Metadata = {
  title: "게임 만들기",
  description: "두 가지 선택지를 넣고 새로운 밸런스 게임을 만들어 보세요.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <ProtectedRoute>
      <ChoiceCreatePage />
    </ProtectedRoute>
  );
}
