"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useEmployeeStore } from "@/stores/userStore";

export default function AuthWrapper({
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
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          });

          if (!res.ok) throw new Error("Não autorizado");
          const data = await res.json();
          setUser(data[0]);
        } catch {
          router.push("/");
        }
      }
    };

    verify();
  }, [user, setUser, router]);

  return user ? <main className="bg-[#000]">{children}</main> : null;
}
