import { ChoiceDetailPage } from "@/_pages/choice-detail";
import { getChoiceById } from "@/entities/choice";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps<"/choices/[id]">) {
  const { id } = await params;
  const choice = await getChoiceById(id);

  return {
    title: choice ? `${choice.title} | HS Choice` : "HS Choice",
  };
}

export default async function Page({
  params,
}: PageProps<"/choices/[id]">) {
  const { id } = await params;

  return <ChoiceDetailPage choiceId={id} />;
}
