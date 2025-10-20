"use client";
import { useEmployeeStore } from "@/stores/userStore";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import RefreshComponent from "@/app/employee/components/refresh";
import ExitAccountComponent from "./components/exitComponent";
import { useNotificationApi } from "@/stores/notificationStore";
import NotificationBarComponent from "./components/notificationComponent";
import TopHeaderEmployee from "./components/topheaderEmployee";
import { ErrorApi } from "@/types/ErrorApi";
import NotificationComponentMobile from "./components/notificationComponentMobile";
import ErrorComponent from "@/app/employee/appointments/components/errorComponent";
import EmployeeLinksComponent from "./components/EmployeeLinksComponent";

export default function NavbarOfEmployeesComponent() {
  const { user, clearUser } = useEmployeeStore();
  const [mobile, setMobile] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [exitClicked, setExitClicked] = useState<boolean>(false);
  const [error, setError] = useState<ErrorApi | null>(null);
  const [notificationOpen, setNotificationOpen] = useState<boolean>(false);

  const { setNotifications } = useNotificationApi();

  useEffect(() => {
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
              auxiliarFunction={() => {
                console.log("[ ==== USUÁRIO LIMPO ==== ]");
                clearUser();
              }}
            />
          </AnimatePresence>
        )}
        {error && (
          <ErrorComponent errorContent={error} onClick={() => setError(null)} />
        )}
        <TopHeaderEmployee
          user={user}
          open={open}
          setOpen={setOpen}
          setError={setError}
          setNotificationOpen={setNotificationOpen}
          notificationOpen={notificationOpen}
        />

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
                  <div className="h-full bg-[#fff] rounded-4xl relative">
                    <EmployeeLinksComponent setOpen={setOpen} open={open} />
                    <ExitAccountComponent
                      setExitClicked={setExitClicked}
                      exitClicked={exitClicked}
                    />
                    <AnimatePresence>
                      {notificationOpen && <NotificationComponentMobile />}
                    </AnimatePresence>
                  </div>
                </div>
              ) : (
                <div className="absolute left-1/2 h-[60%] w-full max-w-[900] translate-x-[-50%] top-4 md:top-30 px-2 md:px-0">
                  <div className="h-full bg-[#fff] rounded-4xl relative flex">
                    <div className="w-1/2 h-full">
                      <EmployeeLinksComponent setOpen={setOpen} open={open} />
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
