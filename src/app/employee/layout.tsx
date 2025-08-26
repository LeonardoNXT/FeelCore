"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { useEmployeeStore } from "@/stores/userStore";
import { useRouter } from "next/navigation";
import NavbarOfEmployeesComponent from "@/components/sidebar/headerofEmployees";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, setUser } = useEmployeeStore();
  const router = useRouter();

  useEffect(() => {
    const verify = async () => {
      if (!user) {
        try {
          const res = await fetch("/api/auth/verify", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          });

          if (!res.ok) throw new Error("Não autorizado");

          const data = await res.json();
          setUser(data[0]);
        } catch (err) {
          console.error("Erro na verificação:", err);
          router.push("/");
        }
      }
    };

    verify();
  }, [user, setUser, router]);

  return (
    <section className="w-full h-full relative">
      <NavbarOfEmployeesComponent />
      <main>{children}</main>
    </section>
  );
}
