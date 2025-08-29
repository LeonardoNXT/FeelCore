"use client";

import { useEffect, useState } from "react";
import { useEmployeeStore } from "@/stores/userStore";
import { useRouter } from "next/navigation";
import NavbarOfEmployeesComponent from "@/components/sidebar/headerofEmployees";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobile, setmobile] = useState<boolean>(false);
  const { user, setUser } = useEmployeeStore();
  const router = useRouter();

  useEffect(() => {
    let widthScreen = 0;
    let verifyScreen = false;

    const mobileVerify = () => {
      if (widthScreen !== window.innerWidth) {
        verifyScreen = widthScreen < 768 ? true : false;
        widthScreen = window.innerWidth;
        setmobile(verifyScreen);
        console.log(mobile);
      }
    };

    window.addEventListener("resize", mobileVerify);

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

    return () => {
      window.removeEventListener("resize", mobileVerify);
    };
  }, [user, setUser, router]);

  return (
    <section className="w-full h-full relative">
      <NavbarOfEmployeesComponent />
      <main>{children}</main>
    </section>
  );
}
