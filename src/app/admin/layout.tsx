"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import SideBarPage from "@/components/sidebar/links";
import { useUserStore } from "@/stores/userStore";
import { useRouter } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, setUser } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    const verify = async () => {
      if (!user) {
        try {
          const res = await fetch("http://127.0.0.1:3005/auth/verify", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          });

          if (!res.ok) throw new Error("Não autorizado");

          const data = await res.json();
          console.log(data);
          setUser(data.user);
        } catch (err) {
          console.error("Erro na verificação:", err);
          router.push("/login");
        }
      }
    };

    verify();
  }, [user, setUser, router]);

  return (
    <motion.section
      className="flex w-full relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <SideBarPage />
      <motion.main
        className="w-[85%] h-full flex p-[0.5vw] "
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.section
          className="w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.section>
      </motion.main>
    </motion.section>
  );
}
