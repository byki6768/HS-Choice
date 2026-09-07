import { getChoices } from "@/entities/choice";
import { PageContainer } from "@/shared/ui";
import { StatsLive } from "./StatsLive";

type StatsPageProps = {
  highlightId?: string;
  showVotedMessage?: boolean;
};

export async function StatsPage({
  highlightId,
  showVotedMessage = false,
}: StatsPageProps) {
  const choices = await getChoices("latest");

  return (
    <PageContainer className="flex flex-1 flex-col py-6 sm:py-8 lg:py-10">
      {showVotedMessage ? (
        <p
          role="status"
          className="mb-4 rounded-2xl bg-accent/15 px-4 py-3 text-center text-base font-bold text-foreground sm:text-lg"
        >
          선택 완료
        </p>
      ) : null}
      <section className="mb-6 sm:mb-8">
        <p className="text-sm font-medium text-accent">투표 결과</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
          통계 보기
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted sm:text-base">
          선택한 게임의 누적 결과를 가장 위에서 확인하고, 다른 게임의 통계도 이어서
          볼 수 있어요.
        </p>
      </section>
      <StatsLive choices={choices} highlightId={highlightId} />
    </PageContainer>
  );
}
