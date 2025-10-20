import CompleteTasksContent from "./content";

export default async function CompleteTasksComponent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;

  return <CompleteTasksContent id={id} />;
}
