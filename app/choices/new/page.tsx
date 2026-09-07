import type { Metadata } from "next";
import { ChoiceCreatePage } from "@/_pages/choice-create";
import { ProtectedRoute } from "@/features/auth";

export const metadata: Metadata = {
  title: "게임 만들기 | HS Choice",
};

export default function Page() {
  return (
    <ProtectedRoute>
      <ChoiceCreatePage />
    </ProtectedRoute>
  );
}
