import ProfileContent from "./content";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ dinamicurl: string }>;
}) {
  const { dinamicurl } = await params;

  return <ProfileContent employeerId={dinamicurl} />;
}
