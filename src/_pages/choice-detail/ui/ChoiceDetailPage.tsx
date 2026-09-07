import { getChoiceById } from "@/entities/choice";
import { getCommentsByGameId } from "@/entities/comment";
import { absoluteUrl, routes, siteConfig } from "@/shared/config";
import { JsonLd, PageContainer } from "@/shared/ui";
import { ChoiceDetailLive } from "./ChoiceDetailLive";

type ChoiceDetailPageProps = {
  choiceId: string;
};

export async function ChoiceDetailPage({ choiceId }: ChoiceDetailPageProps) {
  const choice = await getChoiceById(choiceId);

  if (!choice) {
    return (
      <PageContainer className="flex flex-1 flex-col items-start py-10">
        <h1 className="text-2xl font-bold text-foreground">
          게임을 찾을 수 없어요
        </h1>
        <p className="mt-2 text-sm text-muted">
          삭제되었거나 아직 만들어지지 않은 게임입니다.
        </p>
      </PageContainer>
    );
  }

  const comments = await getCommentsByGameId(choiceId).catch(() => []);

  return (
    <PageContainer className="flex flex-1 flex-col py-6 sm:py-8 lg:py-10">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Quiz",
          name: choice.title,
          description: `${choice.optionA} vs ${choice.optionB}`,
          url: absoluteUrl(routes.choice(choice.id)),
          inLanguage: "ko",
          datePublished: choice.createdAt,
          author: {
            "@type": "Person",
            name: choice.authorNickname,
          },
          publisher: {
            "@type": "Organization",
            name: siteConfig.name,
          },
          image: [choice.optionAImage, choice.optionBImage].filter(Boolean),
          interactionStatistic: {
            "@type": "InteractionCounter",
            interactionType: "https://schema.org/LikeAction",
            userInteractionCount: choice.participantCount,
          },
          hasPart: [
            {
              "@type": "Question",
              name: choice.title,
              suggestedAnswer: [
                { "@type": "Answer", text: choice.optionA },
                { "@type": "Answer", text: choice.optionB },
              ],
            },
          ],
        }}
      />
      <ChoiceDetailLive choice={choice} comments={comments} />
    </PageContainer>
  );
}
