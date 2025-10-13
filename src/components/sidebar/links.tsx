"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Home,
  BarChart3,
  ChevronDown,
  Building2,
  UserPlus,
  Eye,
  LucideIcon,
  Menu,
  X,
  Heart,
  List,
  LogOut,
  Cog,
} from "lucide-react";
import {
  useState,
  ReactNode,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";
import { useUserStore } from "@/stores/userStore";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface NavItemProps {
  href?: string;
  icon: LucideIcon;
  children: ReactNode;
  isActive?: boolean;
  onClick?: () => void;
  onNavigate?: () => void;
}

interface SubNavItemProps {
  href: string;
  children: ReactNode;
  isActive?: boolean;
  onNavigate?: () => void;
}

interface SideBarPageProps {
  onMenuToggle?: (isOpen: boolean) => void;
  setHandleLogout: Dispatch<SetStateAction<boolean>>;
}

export default function SideBarPage({
  onMenuToggle,
  setHandleLogout,
}: SideBarPageProps) {
  const { user } = useUserStore();
  const pathname = usePathname();
  const [isDashboardOpen, setIsDashboardOpen] = useState<boolean>(true);
  const [isEmployeesOpen, setIsEmployeesOpen] = useState<boolean>(true);
  const [isPatientsOpen, setIsPatientsOpen] = useState<boolean>(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [handleProfileClicked, setHandleProfileClicked] =
    useState<boolean>(false);

  const logOutFetch = async () => {
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("houve um erro interno");
      }
      setHandleLogout(true);
    } catch (err) {
      console.error(err);
    }
  };

  // Detectar se é mobile (breakpoint personalizado 1500px)
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1500);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  // Notificar o componente pai sobre mudanças no menu
  useEffect(() => {
    if (onMenuToggle) {
      onMenuToggle(isMobileMenuOpen);
    }
  }, [isMobileMenuOpen, onMenuToggle]);

  // Fechar menu mobile ao navegar
  const handleMobileNavigation = () => {
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  };

  // Verificações de rota centralizadas
  const routeStates = {
    isHomeActive:
      pathname === "/admin" || /^\/admin\/[a-f\d]{24}$/i.test(pathname),
    isDashboardPatientsActive: pathname.startsWith("/admin/dashboard/users"),
    isPatientsActive: pathname.startsWith("/admin/patients"),
    isDashboardActive: pathname.startsWith("/admin/dashboard"),
    isEmployeesActive: pathname.startsWith("/admin/employees"),
    isAddEmployeeActive: pathname.startsWith("/admin/employees/new"),
    isEmployeesOverviewActive: pathname.startsWith("/admin/employees/overview"),
    isEmployeesDirectoryActive: pathname.startsWith(
      "/admin/employees/directory"
    ),
    isAddPatientActive: pathname.startsWith("/admin/patients/new"),
    isPatientsDirectoryActive: pathname.startsWith("/admin/patients/directory"),
    isPatientsOverviewActive: pathname.startsWith("/admin/patients/overview"),
  };

  const NavItem = ({
    href,
    icon: Icon,
    children,
    isActive,
    onClick,
    onNavigate,
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

    const handleClick = () => {
      if (onClick) onClick();
      if (onNavigate) onNavigate();
    };

    if (href) {
      return (
        <Link
          href={href}
          className={`${baseClasses} ${activeClasses}`}
          onClick={onNavigate}
        >
          {content}
        </Link>
      );
    }
    return (
      <button
        onClick={handleClick}
        className={`${baseClasses} ${activeClasses} w-full justify-between`}
      >
        <div className="flex items-center gap-3">{content}</div>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${
            (onClick === (() => setIsDashboardOpen(!isDashboardOpen)) &&
              isDashboardOpen) ||
            (onClick === (() => setIsEmployeesOpen(!isEmployeesOpen)) &&
              isEmployeesOpen) ||
            (onClick === (() => setIsPatientsOpen(!isPatientsOpen)) &&
              isPatientsOpen)
              ? "rotate-180"
              : ""
          }`}
        />
      </button>
    );
  };

  const SubNavItem = ({
    href,
    children,
    isActive,
    onNavigate,
  }: SubNavItemProps) => (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-lg px-3 py-2 pl-10 text-sm transition-all hover:bg-accent hover:text-accent-foreground ${
        isActive
          ? "bg-accent text-accent-foreground font-medium"
          : "text-muted-foreground"
      }`}
      onClick={onNavigate}
    >
      {children}
    </Link>
  );

  // Botão do menu mobile
  const MobileMenuButton = () => (
    <button
      onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      className="fixed top-4 right-4 z-50 p-2 rounded-lg bg-background border shadow-lg hover:bg-accent transition-colors"
      style={{ display: isMobile ? "block" : "none" }}
      aria-label="Toggle menu"
    >
      {isMobileMenuOpen ? (
        <X className="h-5 w-5 stroke-[#333]" />
      ) : (
        <Menu className="h-5 w-5 stroke-[#333]" />
      )}
    </button>
  );

  // Overlay para mobile
  const MobileOverlay = () => (
    <AnimatePresence>
      {isMobileMenuOpen && isMobile && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </AnimatePresence>
  );

  // Conteúdo do sidebar
  const SidebarContent = () => {
    if (!user) {
      return (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      );
    }

    return (
      <>
        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          <div className="space-y-1">
            <NavItem
              href="/admin"
              icon={Home}
              isActive={routeStates.isHomeActive}
              onNavigate={handleMobileNavigation}
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
                    href="/admin/dashboard/users"
                    isActive={routeStates.isDashboardPatientsActive}
                    onNavigate={handleMobileNavigation}
                  >
                    <Heart className="h-4 w-4" />
                    Pacientes
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
                    onNavigate={handleMobileNavigation}
                  >
                    <Eye className="h-4 w-4" />
                    Visualização Geral
                  </SubNavItem>
                  <SubNavItem
                    href="/admin/employees/directory"
                    isActive={routeStates.isEmployeesDirectoryActive}
                    onNavigate={handleMobileNavigation}
                  >
                    <Building2 className="h-4 w-4" />
                    Lista de Funcionários
                  </SubNavItem>
                  <SubNavItem
                    href="/admin/employees/new"
                    isActive={routeStates.isAddEmployeeActive}
                    onNavigate={handleMobileNavigation}
                  >
                    <UserPlus className="h-4 w-4" />
                    Adicionar Funcionário
                  </SubNavItem>
                </div>
              )}
            </div>

            <div className="space-y-1">
              <NavItem
                icon={Heart}
                isActive={routeStates.isPatientsActive}
                onClick={() => setIsPatientsOpen(!isPatientsOpen)}
              >
                Pacientes
              </NavItem>

              {isPatientsOpen && (
                <div className="space-y-1 ml-4 border-l border-border pl-4">
                  <SubNavItem
                    href="/admin/patients/overview"
                    isActive={routeStates.isPatientsOverviewActive}
                    onNavigate={handleMobileNavigation}
                  >
                    <Eye className="h-4 w-4" />
                    Visualização Geral
                  </SubNavItem>
                  <SubNavItem
                    href="/admin/patients/directory"
                    isActive={routeStates.isPatientsDirectoryActive}
                    onNavigate={handleMobileNavigation}
                  >
                    <List className="h-4 w-4" />
                    Lista de Pacientes
                  </SubNavItem>
                  <SubNavItem
                    href="/admin/patients/new"
                    isActive={routeStates.isAddPatientActive}
                    onNavigate={handleMobileNavigation}
                  >
                    <UserPlus className="h-4 w-4" />
                    Adicionar Paciente
                  </SubNavItem>
                </div>
              )}
            </div>
          </div>
        </nav>

        {/* Footer */}
        {user && (
          <div className="mt-auto border-t p-4">
            <AnimatePresence>
              {handleProfileClicked && (
                <motion.div
                  key={"HandleMenuComponent"}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{
                    duration: 0.7,
                    type: "spring",
                    ease: "circInOut",
                  }}
                  className="w-full h-12 shadow-2xl bg-[#fff] border-1 border-[#bbbbbb5e] rounded-3xl mb-4 flex justify-between items-center px-2"
                >
                  <div
                    className="flex px-3 gap-2 text-[#333] py-1 border-1 border-[#d8d8d8] rounded-full text-[13px] items-center duration-200 hover:bg-red-300 hover:gap-3 ursor-pointer select-none"
                    onClick={() => {
                      logOutFetch();
                    }}
                  >
                    <LogOut className="w-[15px]" />
                    <p className="tracking-wider">Sair</p>
                  </div>
                  <div className="flex px-3 gap-2 text-[#333] py-1 border-1 border-[#d8d8d8] rounded-full text-[13px] items-center duration-200 hover:bg-[#fff] hover:gap-3 cursor-pointer select-none">
                    <Cog className="w-[15px]" />
                    <p className="tracking-wider">Config.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div
              onClick={() => setHandleProfileClicked(!handleProfileClicked)}
              className="flex items-center gap-3 text-sm text-muted-foreground duration-300 border-1 hover:bg-[#fff] hover:border-[#eee] px-2 py-2 select-none cursor-pointer rounded-full"
            >
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                <span className="text-xs font-medium">
                  <Image
                    src={user.avatar}
                    alt="Avatar do usuário"
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
        )}
      </>
    );
  };

  return (
    <>
      {/* Botão do menu mobile */}
      <MobileMenuButton />

      {/* Overlay para mobile */}
      <MobileOverlay />

      {/* Sidebar Desktop (>= 1500px) */}
      <aside
        className="w-[15%] relative border-r bg-gradient-to-br from-[#c8ebf8] via-[#e9e9e9] to-[#ffffff]"
        style={{ display: isMobile ? "none" : "flex" }}
      >
        <div className="w-full h-screen sticky top-0 left-0 flex flex-col">
          {/* Header */}
          <div className="flex h-14 items-center border-b border-[#ffffff] px-4">
            <Link
              href="/admin"
              className="flex items-center gap-2 font-semibold"
            >
              <span className="text-[1.2vw] text-[#333]">
                Feel<span className="text-[#263e42]">Core</span>
              </span>
            </Link>
          </div>

          <SidebarContent />
        </div>
      </aside>

      {/* Sidebar Mobile (< 1500px) */}
      <AnimatePresence>
        {isMobileMenuOpen && isMobile && (
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed left-0 top-0 h-full w-64 z-50 border-r bg-gradient-to-br from-[#c8ebf8] via-[#e9e9e9] to-[#ffffff]"
          >
            <div className="w-full h-full flex flex-col">
              {/* Header */}
              <div className="flex h-14 items-center border-b px-4">
                <Link
                  href="/admin"
                  className="flex items-center gap-2 font-semibold"
                  onClick={handleMobileNavigation}
                >
                  <span className="text-lg text-[#333]">
                    Feel<span className="text-[#263e42]">Core</span>
                  </span>
                </Link>
              </div>

              <SidebarContent />
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
