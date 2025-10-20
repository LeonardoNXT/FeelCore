import PatientOfEmployeeContent from "./content";

export default async function PatientOfEmployeeComponent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const userId = await params;

  return <PatientOfEmployeeContent params={userId} />;
}
