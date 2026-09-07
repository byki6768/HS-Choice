"use client";

import { ErrorRetryButton, ErrorState } from "@/shared/ui";
import "@/_app/styles/globals.css";

type GlobalErrorPageProps = {
  error: Error & { digest?: string };
  retry: () => void;
};

export default function GlobalErrorPage({ retry }: GlobalErrorPageProps) {
  return (
    <html lang="ko">
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground">
        <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-10 sm:px-6 lg:px-8">
          <ErrorState
            title="잠시 문제가 생겼어요"
            description="HS Choice를 불러오지 못했어요. 조금 뒤에 다시 시도해 주세요."
            action={<ErrorRetryButton onRetry={retry} />}
          />
        </main>
      </body>
    </html>
  );
}
