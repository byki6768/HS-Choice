"use client";

import { useRouter } from "next/navigation";
import { NicknameForm, WelcomeToast, useAuth } from "@/features/auth";
import { PageContainer } from "@/shared/ui";
import { routes } from "@/shared/config";

type NicknamePageProps = {
  welcome?: boolean;
};

export function NicknamePage({ welcome = false }: NicknamePageProps) {
  const router = useRouter();
  const { user } = useAuth();

  function handleSaved() {
    router.replace(routes.home);
    router.refresh();
  }

  return (
    <PageContainer className="flex flex-1 flex-col py-6 sm:py-8 lg:py-10">
      <WelcomeToast show={welcome} stayOnPage />
      <header className="mb-6 sm:mb-8">
        <p className="text-sm font-medium text-accent">프로필</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          닉네임을 정해 주세요
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted sm:text-base">
          HS Choice에서 사용할 이름을 입력하면 바로 시작할 수 있어요.
        </p>
      </header>
      <div className="mx-auto w-full max-w-md rounded-3xl border border-border bg-surface p-4 shadow-sm sm:p-6">
        <NicknameForm
          initialNickname={user?.nickname ?? ""}
          submitLabel="저장하고 시작하기"
          onSaved={handleSaved}
        />
      </div>
    </PageContainer>
  );
}
