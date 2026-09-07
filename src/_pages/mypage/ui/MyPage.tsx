"use client";

import { useState } from "react";
import { LogoutButton, NicknameForm, DeleteAccountButton, useAuth, isPhoneAuthEmail } from "@/features/auth";
import { PageContainer } from "@/shared/ui";
import { logoutPill } from "@/widgets/header";

export function MyPage() {
  const { user } = useAuth();
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  return (
    <PageContainer className="flex flex-1 flex-col py-6 sm:py-8 lg:py-10">
      <header className="mb-6 sm:mb-8">
        <p className="text-sm font-medium text-accent">내 정보</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          마이페이지
        </h1>
      </header>
      <section className="mx-auto w-full max-w-md rounded-3xl border border-border bg-surface p-4 shadow-sm sm:p-6">
        <div className="mb-5 space-y-4 text-sm">
          <div>
            <p className="text-muted">이메일</p>
            <p className="mt-1 font-medium text-foreground">
              {user?.email && !isPhoneAuthEmail(user.email)
                ? user.email
                : "-"}
            </p>
          </div>
          <div>
            <p className="text-muted">휴대폰</p>
            <p className="mt-1 font-medium text-foreground">
              {user?.phone ?? "-"}
            </p>
          </div>
        </div>
        {savedMessage ? (
          <p className="mb-4 text-sm text-foreground">{savedMessage}</p>
        ) : null}
        <NicknameForm
          key={user?.nickname ?? "nickname"}
          initialNickname={user?.nickname ?? ""}
          submitLabel="닉네임 저장"
          onSaved={() => setSavedMessage("닉네임을 저장했어요.")}
        />
        <div className="mt-6 flex flex-col gap-3">
          <LogoutButton className={logoutPill("w-full")} />
          <DeleteAccountButton />
        </div>
      </section>
    </PageContainer>
  );
}
