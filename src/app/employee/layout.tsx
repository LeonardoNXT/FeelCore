import NavbarOfEmployeesComponent from "@/components/sidebar/headerofEmployees";
import AuthWrapper from "./AuthWrapper";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="w-full h-full relative">
      <NavbarOfEmployeesComponent />
      <AuthWrapper>{children}</AuthWrapper>
    </section>
  );
}
