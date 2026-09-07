import { HomePage } from "@/_pages/home";
import { parseFeedPage, parseFeedSort } from "@/entities/choice";

export const dynamic = "force-dynamic";

export default async function Page({ searchParams }: PageProps<"/">) {
  const params = await searchParams;
  const welcome = Array.isArray(params.welcome)
    ? params.welcome[0]
    : params.welcome;

  return (
    <HomePage
      sort={parseFeedSort(params.sort)}
      page={parseFeedPage(params.page)}
      welcome={welcome === "1"}
    />
  );
}
