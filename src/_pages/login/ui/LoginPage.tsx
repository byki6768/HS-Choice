import { AUTH_MESSAGES, LoginForm } from "@/features/auth";
import { PageContainer } from "@/shared/ui";

type LoginPageProps = {
  error?: string;
  mode?: string;
};

export function LoginPage({ error, mode }: LoginPageProps) {
  const errorMessage =
    error === "not_member"
      ? AUTH_MESSAGES.notFound
      : error === "auth"
        ? "로그인에 실패했어요. 다시 시도해 주세요."
        : null;

  return (
    <PageContainer className="flex flex-1 flex-col py-6 sm:py-8 lg:py-10">
      <header className="mb-6 sm:mb-8">
        <p className="text-sm font-medium text-accent">계정</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          로그인 / 신규 가입
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted sm:text-base">
          이미 회원이라면 로그인, 처음이라면 신규 가입으로 HS Choice에 참여하세요.
        </p>
      </header>
      <div className="mx-auto w-full max-w-md rounded-3xl border border-border bg-surface p-4 shadow-sm sm:p-6">
        {errorMessage ? (
          <p
            role="alert"
            className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
          >
            {errorMessage}
          </p>
        ) : null}
        <LoginForm
          key={mode === "login" || mode === "signup" ? mode : "menu"}
          mode={mode}
        />
      </div>
    </PageContainer>
  );
}
