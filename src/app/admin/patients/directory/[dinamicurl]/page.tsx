import CustomerProfileContent from "./content";

export default async function ProfilePatientPage({
  params,
}: {
  params: Promise<{ dinamicurl: string }>;
}) {
  const { dinamicurl } = await params;

  return <CustomerProfileContent customerId={dinamicurl} />;
}
