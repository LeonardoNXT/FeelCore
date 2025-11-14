"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SetRoleComponent from "./pages/setRole";
import SetEmailComponent from "./pages/setEmail";
import SetTokenComponent from "./pages/setToken";
import SetPasswordComponent from "./pages/setPassword";
import RefreshComponent from "@/app/employee/components/refresh";
import Iridescence from "@/blocks/Backgrounds/Beams/Beams";

export type Pages =
  | "setRole"
  | "setEmail"
  | "setToken"
  | "setNewPassword"
  | "refreshPage";

export type UserPasswordFlow = {
  email?: string;
  name?: string;
  role?: "Employee" | "Organization" | "Patient";
};

type Route = "employee" | "admin" | "patient";

const routes: Partial<Record<"Employee" | "Organization" | "Patient", Route>> =
  {
    Employee: "employee",
    Organization: "admin",
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
      <motion.div
        initial={{ opacity: 0, scale: 5 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.5 }}
        transition={{ duration: 5 }}
        className="w-full h-full absolute saturate-[15%]"
      >
        <Iridescence color={[1, 1, 1]} />
      </motion.div>

      <AnimatePresence mode="wait">
        {page === "setRole" && (
          <SetRoleComponent
            setPage={setpage}
            setUser={setUser}
            key={"SetRoleComponent"}
          />
        )}
        {page === "setEmail" && (
          <SetEmailComponent
            setPage={setpage}
            setUser={setUser}
            user={user}
            key={"SetEmailComponent"}
          />
        )}
        {page === "setToken" && (
          <SetTokenComponent
            setPage={setpage}
            setUser={setUser}
            user={user}
            key={"SetTokenComponent"}
          />
        )}
        {page === "setNewPassword" && (
          <SetPasswordComponent
            user={user}
            key={"setNewPassword"}
            setPage={setpage}
          />
        )}
        {page === "refreshPage" && user && user.role && (
          <div className="w-full h-full absolute z-10">
            <RefreshComponent
              display="flex"
              zIndex="10"
              route={`/login/${routes[user.role] as Route}`}
              title="Senha alterada com sucesso."
              auxiliarFunction={() => {
                setUser(null);
              }}
            />
          </div>
        )}
      </AnimatePresence>
    </motion.main>
  );
}
