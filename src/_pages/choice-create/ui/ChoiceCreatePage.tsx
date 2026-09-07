import { PageContainer } from "@/shared/ui";
import { ChoiceForm } from "@/widgets/choice-form";

export function ChoiceCreatePage() {
  return (
    <PageContainer className="flex flex-1 flex-col py-6 sm:py-8 lg:py-10">
      <header className="mb-6 sm:mb-8">
        <p className="text-sm font-medium text-accent">새 밸런스 게임</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          게임을 만들어 보세요
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted sm:text-base">
          두 가지 선택지를 넣고, 이미지는 필요할 때만 올려 주세요.
        </p>
      </header>
      <div className="mx-auto w-full max-w-3xl">
        <ChoiceForm />
      </div>
    </PageContainer>
  );
}
