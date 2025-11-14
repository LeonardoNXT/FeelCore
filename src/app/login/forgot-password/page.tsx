"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SetRoleComponent from "./pages/setRole";
import SetEmailComponent from "./pages/setEmail";
import SetTokenComponent from "./pages/setToken";

export type Pages = "setRole" | "setEmail" | "setToken" | "setNewPassword";

export type UserPasswordFlow = {
  email?: string;
  name?: string;
  role?: "Employee" | "Organization" | "Patient";
};

export default function ForgotPassword() {
  const [user, setUser] = useState<UserPasswordFlow | null>(null);
  const [page, setpage] = useState<Pages>("setRole");
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="w-full h-screen relative bg-gradient-to-tr from-[rgb(218,255,255)] to-[#ffffff] overflow-hidden"
    >
      <AnimatePresence>
        {page === "setRole" && (
          <SetRoleComponent setPage={setpage} setUser={setUser} />
        )}
        {page === "setEmail" && (
          <SetEmailComponent setPage={setpage} setUser={setUser} user={user} />
        )}
        {page === "setToken" && (
          <SetTokenComponent setPage={setpage} setUser={setUser} user={user} />
        )}
      </AnimatePresence>
    </motion.main>
  );
}
