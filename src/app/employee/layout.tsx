import NavbarOfEmployeesComponent from "@/components/sidebar/headerofEmployees";
import AuthWrapper from "./AuthWrapper";

export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="w-full h-full relative">
      <NavbarOfEmployeesComponent />
      <AuthWrapper
        checkInterval={60000} // valida a cada 1 minuto
        redirectTo="/login/employee"
        valideRole="employee"
      >
        {children}
      </AuthWrapper>
    </section>
  );
}
