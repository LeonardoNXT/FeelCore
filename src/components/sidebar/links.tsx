"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Home,
  BarChart3,
  DollarSign,
  Users,
  UserCheck,
  ChevronDown,
  Building2,
  UserPlus,
  Eye,
  LucideIcon,
} from "lucide-react";
import { useState, ReactNode } from "react";
import { useUserStore } from "@/stores/userStore";
import Image from "next/image";

interface NavItemProps {
  href?: string;
  icon: LucideIcon;
  children: ReactNode;
  isActive?: boolean;
  onClick?: () => void;
}

interface SubNavItemProps {
  href: string;
  children: ReactNode;
  isActive?: boolean;
}

export default function SideBarPage() {
  const { user } = useUserStore();
  const pathname = usePathname();
  const [isDashboardOpen, setIsDashboardOpen] = useState<boolean>(true);
  const [isEmployeesOpen, setIsEmployeesOpen] = useState<boolean>(true);

  // Verificações de rota centralizadas
  const routeStates = {
    isHomeActive:
      pathname === "/admin" || /^\/admin\/[a-f\d]{24}$/i.test(pathname),
    isDashboardUsersActive: pathname.startsWith("/admin/dashboard/users"),
    isUsersActive: pathname.startsWith("/admin/users"),
    isDashboardActive: pathname.startsWith("/admin/dashboard"),
    isEmployeesActive: pathname.startsWith("/admin/employees"),
    isAddEmployeeActive: pathname.startsWith("/admin/employees/new"),
    isEmployeesOverviewActive: pathname.startsWith("/admin/employees/overview"),
  };

  const NavItem = ({
    href,
    icon: Icon,
    children,
    isActive,
    onClick,
  }: NavItemProps) => {
    const baseClasses =
      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground";
    const activeClasses = isActive
      ? "bg-accent text-accent-foreground"
      : "text-muted-foreground";

    const content = (
      <>
        <Icon className="h-4 w-4" />
        {children}
      </>
    );

    if (href) {
      return (
        <Link href={href} className={`${baseClasses} ${activeClasses}`}>
          {content}
        </Link>
      );
    }

    return (
      <button
        onClick={onClick}
        className={`${baseClasses} ${activeClasses} w-full justify-between`}
      >
        <div className="flex items-center gap-3">{content}</div>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${
            (onClick === (() => setIsDashboardOpen(!isDashboardOpen)) &&
              isDashboardOpen) ||
            (onClick === (() => setIsEmployeesOpen(!isEmployeesOpen)) &&
              isEmployeesOpen)
              ? "rotate-180"
              : ""
          }`}
        />
      </button>
    );
  };

  const SubNavItem = ({ href, children, isActive }: SubNavItemProps) => (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-lg px-3 py-2 pl-10 text-sm transition-all hover:bg-accent hover:text-accent-foreground ${
        isActive
          ? "bg-accent text-accent-foreground font-medium"
          : "text-muted-foreground"
      }`}
    >
      {children}
    </Link>
  );

  // Se não há usuário, não renderiza o footer
  if (!user) {
    return (
      <aside className="w-[15%] relative border-r bg-background">
        <div className="w-full h-screen sticky top-0 left-0 flex flex-col">
          {/* Header */}
          <div className="flex h-14 items-center border-b px-4">
            <Link
              href="/admin"
              className="flex items-center gap-2 font-semibold"
            >
              <span className="text-[1.2vw]">newarch.</span>
            </Link>
          </div>
          {/* Loading state */}
          <div className="flex-1 flex items-center justify-center">
            <p className="text-muted-foreground">Carregando...</p>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-[15%] relative border-r bg-gradient-to-br from-[#000000] via-[#050505] to-[#0c0c0c]">
      <div className="w-full h-screen sticky top-0 left-0 flex flex-col">
        {/* Header */}
        <div className="flex h-14 items-center border-b px-4">
          <Link href="/admin" className="flex items-center gap-2 font-semibold">
            <span className="text-[1.2vw]">
              Feel<span className="text-[#ffd8a6]">Core</span>.
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          <div className="space-y-1">
            <NavItem
              href="/admin"
              icon={Home}
              isActive={routeStates.isHomeActive}
            >
              Início
            </NavItem>

            <div className="space-y-1">
              <NavItem
                icon={BarChart3}
                isActive={routeStates.isDashboardActive}
                onClick={() => setIsDashboardOpen(!isDashboardOpen)}
              >
                Dashboard
              </NavItem>

              {isDashboardOpen && (
                <div className="space-y-1 ml-4 border-l border-border pl-4">
                  <SubNavItem
                    href="/admin/dashboard/financial"
                    isActive={pathname === "/admin/dashboard/financial"}
                  >
                    <DollarSign className="h-4 w-4" />
                    Financeiro
                  </SubNavItem>
                  <SubNavItem
                    href="/admin/dashboard/users"
                    isActive={routeStates.isDashboardUsersActive}
                  >
                    <Users className="h-4 w-4" />
                    Usuários
                  </SubNavItem>
                </div>
              )}
            </div>

            <div className="space-y-1">
              <NavItem
                icon={Building2}
                isActive={routeStates.isEmployeesActive}
                onClick={() => setIsEmployeesOpen(!isEmployeesOpen)}
              >
                Funcionários
              </NavItem>

              {isEmployeesOpen && (
                <div className="space-y-1 ml-4 border-l border-border pl-4">
                  <SubNavItem
                    href="/admin/employees/overview"
                    isActive={routeStates.isEmployeesOverviewActive}
                  >
                    <Eye className="h-4 w-4" />
                    Visualização Geral
                  </SubNavItem>
                  <SubNavItem
                    href="/admin/employees"
                    isActive={pathname === "/admin/employees"}
                  >
                    <Building2 className="h-4 w-4" />
                    Lista de Funcionários
                  </SubNavItem>
                  <SubNavItem
                    href="/admin/employees/new"
                    isActive={routeStates.isAddEmployeeActive}
                  >
                    <UserPlus className="h-4 w-4" />
                    Adicionar Funcionário
                  </SubNavItem>
                </div>
              )}
            </div>

            <NavItem
              href="/admin/users"
              icon={UserCheck}
              isActive={routeStates.isUsersActive}
            >
              Usuários
            </NavItem>
          </div>
        </nav>

        {/* Footer */}
        <div className="mt-auto border-t p-4">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
              <span className="text-xs font-medium">
                <Image
                  src={user.avatar}
                  alt="Background image"
                  fill
                  className="rounded-[50%] aspect-square !relative"
                />
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">
                {user.name || "Nome não disponível"}
              </p>
              <p className="text-xs truncate">
                {user.email || "Email não disponível"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
