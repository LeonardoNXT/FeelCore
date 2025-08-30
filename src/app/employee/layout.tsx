import NavbarOfEmployeesComponent from "@/components/sidebar/headerofEmployees";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="w-full h-full relative">
      <NavbarOfEmployeesComponent />
      <main className="bg-[#000]">{children}</main>
    </section>
  );
}
