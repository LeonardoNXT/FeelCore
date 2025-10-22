"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface AuthWrapperProps {
  children: React.ReactNode;
  checkInterval?: number;
  redirectTo?: string;
  valideRole: "employee" | "patient" | "adm";
}

export default function AuthWrapper({
  children,
  checkInterval = 60000,
  redirectTo = "/",
  valideRole,
}: AuthWrapperProps) {
  const router = useRouter();
  const [isLogged, setIsLogged] = useState<boolean>(false);

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await fetch("/api/auth/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (!res.ok) throw new Error("Não autorizado");

        const data = await res.json();
        const role = data[1].role;

        if (role === valideRole) {
          setIsLogged(true);
        } else {
          if (role === "adm") {
            router.push("/admin");
          } else {
            router.push(`/${role}`);
          }
        }
      } catch (error) {
        console.log("Auth error:", error);
        router.push(redirectTo);
      }
    };

    // ✅ Verifica IMEDIATAMENTE ao montar
    verify();

    // Configura validação periódica
    const interval = setInterval(verify, checkInterval);

    // Valida quando o usuário volta para a aba
    const handleFocus = () => verify();
    window.addEventListener("focus", handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
    };
  }, [valideRole, router, checkInterval, redirectTo]);

  return isLogged ? <main>{children}</main> : null;
}
