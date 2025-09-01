"use client";
import { useEmployeeStore } from "@/stores/userStore";
import Image from "next/image";
import { Menu, Bell, LogOut, X } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function NavbarOfEmployeesComponent() {
  const router = useRouter();
  const { user } = useEmployeeStore();
  const firstname = user?.name.split(" ")[0];
  const [mobile, setMobile] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const routes = [
    {
      name: "Início",
      path: "/employee",
    },
    {
      name: "Pacientes",
      path: "/employee/patients",
    },
    {
      name: "Agendamento",
      path: "/employee/appointments",
    },
    {
      name: "Resumos",
      path: "/employee/summaries",
    },
    {
      name: "Tarefas",
      path: "/employee/tasks",
    },
  ];

  useEffect(() => {
    console.log("rodou header");

    let timeoutId: ReturnType<typeof setTimeout>;

    const mobileVerify = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const isMobile = window.innerWidth < 768;
        setMobile(isMobile);
      }, 200);
    };

    mobileVerify(); // roda na montagem

    window.addEventListener("resize", mobileVerify);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", mobileVerify);
    };
  }, []);

  if (user) {
    if (mobile) {
      return (
        <motion.header
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 1 }}
          className="w-full fixed px-3 py-4 z-10 flex justify-between items-stretch"
        >
          <div className="flex justify-center items-center w-max bg-[#161616] px-1 py-2 rounded-4xl relative z-10">
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
          <div className="h-auto flex border-1 rounded-full relative z-10">
            <div
              className={`bg-[#ffffff00] h-full flex justify-center items-center w-16 rounded-full transition-all duration-300 ${
                open
                  ? "text-[#333] border-1 border-[#d6d6d6]"
                  : "text-[#ebebeb]"
              }`}
            >
              <Bell />
            </div>
            <div
              className="bg-[#161616] h-full flex justify-center items-center w-16 rounded-full"
              onClick={() => setOpen(!open)}
            >
              {open ? <X /> : <Menu />}
            </div>
          </div>
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute w-full h-screen top-0 left-0 bg-[#00000057]"
              >
                <div className="w-[96%] h-[60%] bg-[#fff] absolute right-2 top-3 rounded-4xl">
                  <div className="px-4 h-full justify-center flex flex-col gap-2">
                    {routes.map((route, i) => (
                      <p
                        key={i}
                        className="text-[#333] text-4xl"
                        onClick={() => {
                          setOpen(!open);
                          router.push(route.path);
                        }}
                      >
                        {route.name}
                      </p>
                    ))}
                  </div>
                  <div className="absolute bottom-4 left-4 bg-[#000] px-5 py-2 rounded-3xl text-[13px] items-center flex gap-2">
                    <p>SAIR</p>
                    <LogOut className="w-4" />
                  </div>
                </div>
                <div className="w-full h-50 absolute bottom-0 left-0 bg-gradient-to-b to-[#000]"></div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.header>
      );
    }
  }
}
