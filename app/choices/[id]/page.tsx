import type { Metadata } from "next";
import { ChoiceDetailPage } from "@/_pages/choice-detail";
import { getChoiceById } from "@/entities/choice";
import { routes, siteConfig } from "@/shared/config";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps<"/choices/[id]">): Promise<Metadata> {
  const { id } = await params;
  const choice = await getChoiceById(id);

  if (!choice) {
    return {
      title: "게임을 찾을 수 없어요",
      description: "삭제되었거나 아직 만들어지지 않은 밸런스 게임입니다.",
      robots: { index: false, follow: false },
    };
  }

  const description = `${choice.optionA} vs ${choice.optionB}. ${choice.authorNickname}님이 만든 밸런스 게임에 투표해 보세요.`;
  const path = routes.choice(choice.id);
  const images = [choice.optionAImage, choice.optionBImage].filter(
    (image): image is string => Boolean(image),
  );

  return {
    title: choice.title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      title: `${choice.title} | ${siteConfig.name}`,
      description,
      url: path,
      publishedTime: choice.createdAt,
      authors: [choice.authorNickname],
      images: images.map((url) => ({ url })),
    },
    twitter: {
      card: images.length > 0 ? "summary_large_image" : "summary",
      title: `${choice.title} | ${siteConfig.name}`,
      description,
      images,
    },
  };
}

export default async function Page({
  params,
}: PageProps<"/choices/[id]">) {
  const { id } = await params;

  return <ChoiceDetailPage choiceId={id} />;
}
