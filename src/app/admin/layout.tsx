"use client";

import { useEffect, useState } from "react";
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const handleMenuToggle = (isOpen: boolean) => {
    setIsMobileMenuOpen(isOpen);
  };

  return (
    <motion.section
      className="flex w-full relative min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <SideBarPage onMenuToggle={handleMenuToggle} />

      <motion.main
        className={`
          flex-1 h-full flex p-[0.5vw] transition-all duration-300
          md:w-[85%] w-full
          ${isMobileMenuOpen ? "md:ml-0 ml-0" : "ml-0"}
        `}
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
