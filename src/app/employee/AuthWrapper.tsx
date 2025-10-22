"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useEmployeeStore } from "@/stores/userStore";

interface AuthWrapperProps {
  children: React.ReactNode;
  checkInterval?: number; // em milissegundos (padrão: 60000 = 1 minuto)
  redirectTo?: string;
}

export default function AuthWrapper({
  children,
  checkInterval = 60000,
  redirectTo = "/",
}: AuthWrapperProps) {
  const { user, setUser, clearUser } = useEmployeeStore();
  const router = useRouter();

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
        setUser(data[0]);
      } catch (error) {
        console.log("Auth error:", error);
        clearUser?.(); // Limpa o usuário do store se houver essa função
        router.push(redirectTo);
      }
    };

    // Verifica imediatamente se não tiver usuário
    if (!user) {
      verify();
    }

    // Configura validação periódica
    const interval = setInterval(verify, checkInterval);

    // Valida quando o usuário volta para a aba
    const handleFocus = () => verify();
    window.addEventListener("focus", handleFocus);

    // Limpa ao desmontar
    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
    };
  }, [user, setUser, clearUser, router, checkInterval, redirectTo]);

  return user ? <main className="bg-[#000]">{children}</main> : null;
}
