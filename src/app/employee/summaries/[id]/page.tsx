import SummaryDetailContent from "./content";

export default async function SummaryId({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <SummaryDetailContent id={id} />;
}
