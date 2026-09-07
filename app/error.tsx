"use client";

import { ErrorRetryButton, ErrorState, PageContainer } from "@/shared/ui";

type ErrorPageProps = {
  error: Error & { digest?: string };
  retry: () => void;
};

export default function ErrorPage({ retry }: ErrorPageProps) {
  return (
    <PageContainer className="flex flex-1 flex-col py-10">
      <ErrorState
        title="잠시 문제가 생겼어요"
        description="페이지를 불러오지 못했어요. 조금 뒤에 다시 시도해 주세요."
        action={<ErrorRetryButton onRetry={retry} />}
      />
    </PageContainer>
  );
}
