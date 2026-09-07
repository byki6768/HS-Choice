import type { Metadata } from "next";
import { HomePage } from "@/_pages/home";
import { parseFeedPage, parseFeedSort } from "@/entities/choice";
import { getSiteUrl, routes, siteConfig } from "@/shared/config";
import { JsonLd } from "@/shared/ui";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  searchParams,
}: PageProps<"/">): Promise<Metadata> {
  const params = await searchParams;
  const sort = parseFeedSort(params.sort);

  if (sort === "popular") {
    const title = "인기 게임";
    const description =
      "참여가 많은 밸런스 게임을 인기순으로 보고 투표에 참여하세요.";

    return {
      title,
      description,
      alternates: { canonical: routes.feed("popular") },
      openGraph: {
        title: `${title} | ${siteConfig.name}`,
        description,
        url: routes.feed("popular"),
      },
      twitter: {
        title: `${title} | ${siteConfig.name}`,
        description,
      },
    };
  }

  const title = { absolute: `${siteConfig.name} - ${siteConfig.tagline}` };
  const description = siteConfig.description;

  return {
    title,
    description,
    alternates: { canonical: routes.home },
    openGraph: {
      title: `${siteConfig.name} - ${siteConfig.tagline}`,
      description,
      url: routes.home,
    },
  };
}

export default async function Page({ searchParams }: PageProps<"/">) {
  const params = await searchParams;
  const welcome = Array.isArray(params.welcome)
    ? params.welcome[0]
    : params.welcome;
  const sort = parseFeedSort(params.sort);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: sort === "popular" ? "인기 게임" : "최신 게임",
          description:
            sort === "popular"
              ? "참여가 많은 밸런스 게임을 인기순으로 모은 페이지입니다."
              : "가장 최근에 올라온 밸런스 게임을 모은 페이지입니다.",
          isPartOf: { "@id": `${getSiteUrl()}/#website` },
          url: `${getSiteUrl()}${sort === "popular" ? routes.feed("popular") : routes.home}`,
          inLanguage: "ko",
        }}
      />
      <HomePage
        sort={sort}
        page={parseFeedPage(params.page)}
        welcome={welcome === "1"}
      />
    </>
  );
}
