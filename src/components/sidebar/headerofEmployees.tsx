"use client";
import { useEmployeeStore } from "@/stores/userStore";
import Image from "next/image";
import { Bell, Menu, RefreshCcw, X } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import RefreshComponent from "@/app/employee/components/refresh";
import ExitAccountComponent from "./components/exitComponent";
import NotificationComponent from "./components/notificationSinoCoponent";
import { useNotificationApi } from "@/stores/notificationStore";
import NotificationBarComponent from "./components/notificationComponent";

interface ErrorApi {
  error: string;
  message: string;
}

export default function NavbarOfEmployeesComponent() {
  const router = useRouter();
  const { user } = useEmployeeStore();
  const [mobile, setMobile] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [exitClicked, setExitClicked] = useState<boolean>(false);
  const [error, setError] = useState<ErrorApi | null>(null);

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

  const { notifications, unread, setNotifications } = useNotificationApi();

  console.log();

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

  const updateStatusNotification = async () => {
    let isUpdated = false;
    const unreadNotifications = notifications.filter(
      (notification) => notification.status === "enviado"
    );
    for (const notification of unreadNotifications) {
      const id = notification._id;
      try {
        const response = await fetch(`/api/notification/read/${id}`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Erro ao atualizar notificação");
        }
        isUpdated = true;
      } catch (err) {
        console.log(err);
        setError({
          error: "Houve um erro interno.",
          message: "Um erro interno ocorreu. Tente novamente erro.",
        });
      }
    }
    return isUpdated;
  };

  const updateNotification = async () => {
    try {
      const response = await fetch("/api/notification/all", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data);
      }
      setNotifications(data);
    } catch (err) {
      console.log(err);
      setError({
        error: "",
        message: "",
      });
    }
  };

  const refreshNotification = async () => {
    if (await updateStatusNotification()) {
      updateNotification();
    }
  };

  useEffect(() => {
    const notificationAPI = async () => {
      const response = await fetch("/api/notification/all", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      console.log(data);
      setNotifications(data);
    };

    notificationAPI();
  }, [setNotifications]);

  if (user) {
    return (
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 1 }}
        className="w-full fixed px-2 md:px-4 z-10 flex justify-center items-stretch"
      >
        {exitClicked && (
          <AnimatePresence>
            <RefreshComponent
              title="Desconectando..."
              route="/"
              display="absolute"
              zIndex="20"
            />
          </AnimatePresence>
        )}
        <div className="w-full max-w-[500px] md:bg-[#ffffff28] md:backdrop-blur-2xl rounded-full px-2 py-2 md:border-1 flex items-stretch justify-between relative z-10 top-4">
          <div className="flex bg-[#000] w-max px-2 py-2 rounded-full gap-2 items-center ">
            {user?.avatar?.url && (
              <Image
                src={user.avatar.url}
                width={100}
                height={100}
                className="rounded-full w-[50px] border-2 border-[#dddddd]"
                alt="Sua imagem"
              />
            )}
            <div>
              <p className="pr-3 text-[14px] leading-[0.9] text-[#fff7ef]">
                Olá, {user.name.split(" ")[0]}
              </p>
              <p className="pr-3 text-[12px] text-[#727272]">Mostrar perfil</p>
            </div>
          </div>
          <div className="h-auto flex text-[#fff] border-1 rounded-full md:border-[0px]">
            <NotificationComponent open={open} unread={unread} />
            <div
              className="h-full aspect-square bg-[#181818] rounded-full flex justify-center items-center cursor-pointer hover:bg-[#000] duration-300"
              onClick={() => setOpen(!open)}
            >
              {open ? <X onClick={refreshNotification} /> : <Menu />}
            </div>
          </div>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute w-full h-screen left-0 bg-[#00000057]"
            >
              {mobile ? (
                <div className="absolute left-1/2 h-[60%] w-full max-w-[500] translate-x-[-50%] top-4 md:top-30 px-2 md:px-0">
                  <div className="h-full bg-[#fff]  rounded-4xl relative">
                    <div className="px-4 h-full justify-center flex flex-col gap-2">
                      {routes.map((route, i) => (
                        <p
                          key={i}
                          className="text-[#333] text-4xl cursor-pointer after:block after:w-0 after:bg-[#c0c0c0] after:h-[1px] hover:after:w-full transition-all after:duration-300 duration-300 hover:tracking-wide hover:text-[#000] w-max"
                          onClick={() => {
                            setOpen(!open);
                            router.push(route.path);
                          }}
                        >
                          {route.name}
                        </p>
                      ))}
                    </div>
                    <ExitAccountComponent
                      setExitClicked={setExitClicked}
                      exitClicked={exitClicked}
                    />
                  </div>
                </div>
              ) : (
                <div className="absolute left-1/2 h-[60%] w-full max-w-[900] translate-x-[-50%] top-4 md:top-30 px-2 md:px-0">
                  <div className="h-full bg-[#fff] rounded-4xl relative flex">
                    <div className="w-1/2 h-full">
                      <div className="px-4 h-full justify-center flex flex-col gap-2">
                        {routes.map((route, i) => (
                          <p
                            key={i}
                            className="text-[#333] text-4xl cursor-pointer after:block after:w-0 after:bg-[#c0c0c0] after:h-[1px] hover:after:w-full transition-all after:duration-300 duration-300 hover:tracking-wide hover:text-[#000] w-max"
                            onClick={() => {
                              setOpen(!open);
                              router.push(route.path);
                            }}
                          >
                            {route.name}
                          </p>
                        ))}
                      </div>
                    </div>
                    <div className="w-1/2 h-full px-4 py-4 relative">
                      <NotificationBarComponent />
                    </div>
                    <ExitAccountComponent
                      setExitClicked={setExitClicked}
                      exitClicked={exitClicked}
                    />
                  </div>
                </div>
              )}
              <div className="w-full h-50 absolute bottom-0 left-0 bg-gradient-to-b to-[#000]"></div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    );
  }
}
