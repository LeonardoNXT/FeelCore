"use client";
import { useEmployeeStore } from "@/stores/userStore";
import Image from "next/image";
import { Menu, Bell } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function NavbarOfEmployeesComponent() {
  const { user } = useEmployeeStore();
  const firstname = user?.name.split(" ")[0];
  const [mobile, setmobile] = useState<boolean>(false);

  useEffect(() => {
    console.log("rodou header");
    const mobileVerify = () => {
      const isMobile = window.innerWidth < 768;
      setmobile(isMobile);
    };

    mobileVerify();
    window.addEventListener("resize", mobileVerify);

    return () => {
      window.removeEventListener("resize", mobileVerify);
    };
  }, []);
  if (user) {
    return (
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 1 }}
        className="w-full fixed px-3 py-4 z-10 flex justify-between items-stretch"
      >
        <div className="flex justify-center items-center w-max bg-[#161616] px-1 py-2 rounded-4xl">
          {user?.avatar?.url && (
            <Image
              src={user.avatar.url}
              width={100}
              height={100}
              className="rounded-full w-[50px]"
              alt="Sua imagem"
            />
          )}
          <div className="pl-2">
            <p className="text-[13px] pr-6 text-[#fff3e2] ml-1">
              Olá, {firstname}
            </p>
            <p className="text-[11px] pr-6 text-[#8a8a8a] ml-1">
              Mostrar perfil
            </p>
          </div>
        </div>
        <div className="h-auto flex border-1 rounded-full">
          <div className="bg-[#ffffff00] h-full flex justify-center items-center w-16 rounded-full">
            <Bell />
          </div>
          <div className="bg-[#161616] h-full flex justify-center items-center w-16 rounded-full">
            <Menu />
          </div>
        </div>
      </motion.header>
    );
  }
}
