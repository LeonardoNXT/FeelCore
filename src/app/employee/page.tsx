"use client";
import { useEffect, useState } from "react";
import MainRouteOfEmployeeConteiner from "./context";
import { useEmployeeStore } from "@/stores/userStore";
import { useRouter } from "next/navigation";

export default function MainRouteOfEmployee() {
  const { user, setUser } = useEmployeeStore();
  const [load, setload] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    console.log("rodou função");
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
          setload(true);
        } catch (err) {
          console.error("Erro na verificação:", err);
          router.push("/");
        }
      }
    };

    verify();
  }, [user, setUser, router]);

  return <MainRouteOfEmployeeConteiner load={load} />;
}
