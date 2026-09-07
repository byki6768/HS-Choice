import { getChoices, type FeedSort } from "@/entities/choice";
import { WelcomeToast } from "@/features/auth";
import { PageContainer } from "@/shared/ui";
import { ChoiceList } from "@/widgets/choice-list";

type HomePageProps = {
  sort?: FeedSort;
  page?: number;
  welcome?: boolean;
};

export async function HomePage({
  sort = "latest",
  page = 1,
  welcome = false,
}: HomePageProps) {
  const choices = await getChoices(sort);

  return (
    <PageContainer className="flex flex-1 flex-col py-6 sm:py-8 lg:py-10">
      <WelcomeToast show={welcome} />
      <section className="mb-6 sm:mb-8">
        <p className="text-sm font-medium text-accent">밸런스 게임 커뮤니티</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
          {sort === "popular" ? "인기 게임" : "메인 화면"}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted sm:text-base">
          {sort === "popular"
            ? "게임에 참여한 사람이 많은 순서대로 보여 드려요."
            : "가장 최근에 올라온 게임을 아래에서 만나 보세요."}
        </p>
      </section>
      {sort === "latest" ? (
        <h2 className="mb-4 text-lg font-bold tracking-tight text-foreground sm:mb-5 sm:text-xl">
          최신 게임
        </h2>
      ) : null}
      <ChoiceList choices={choices} sort={sort} page={page} />
    </PageContainer>
  );
}
