"use client";
import Aurora from "@/blocks/Backgrounds/Aurora";
import useInitialLoginStore from "@/stores/InitialLogin";
import { Menu, MoveRight, User, UserRoundCog } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getInitials } from "./employee/appointments/components/getInitials";
import { AnimatePresence, motion } from "framer-motion";
import RefreshComponent from "./employee/components/refresh";

export default function Home() {
  const { receiveContent, setInitialLogin } = useInitialLoginStore();
  const [acess, setAcess] = useState<string | null>(null);
  const [clickOnLogin, setClickOnLogin] = useState<boolean>(false);
  const [linkLogin, setLinkLogin] = useState<string | null>(null);
  useEffect(() => {
    const LoginApi = async () => {
      try {
        const response = await fetch("/api/auth/verify", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        const onlyRelevantInfo = {
          login: {
            name: data[0].name,
            avatar: data[0].avatar,
          },
          role: data[1].role,
        };

        setInitialLogin(onlyRelevantInfo);
        console.log(onlyRelevantInfo);
      } catch (err) {
        console.log(err);
      }
    };

    LoginApi();
  }, [setInitialLogin]);

  const setRouter = () => {
    if (!receiveContent) return;
    if (receiveContent.role === "employee") {
      return setAcess("/employee");
    } else if (receiveContent.role === "patient") {
      return setAcess("/patient");
    } else if (receiveContent.role === "adm") {
      return setAcess("/adnin");
    }
  };

  useEffect(() => {}, [receiveContent]);
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="relative bg-black"
    >
      {!acess && !linkLogin && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.9, type: "spring" }}
          className="md:max-w-[500px] fixed left-1/2 top-5 translate-x-[-50%] w-full px-2 py-2 border-1 items-center border-[#e1e1e12f] bg-[#eeeeee6c] backdrop-blur-2xl rounded-full z-20 flex justify-between"
        >
          {receiveContent ? (
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="px-1 py-1 bg-[#121212] flex items-stretch rounded-full border-1 border-[#333] cursor-pointer"
              onClick={setRouter}
            >
              {receiveContent.login.avatar ? (
                <Image
                  src={receiveContent.login.avatar.url}
                  width={55}
                  height={55}
                  alt="Imagem do usuário"
                  className="rounded-full border-[#444] border-1"
                />
              ) : (
                <div className="w-[55px] aspect-square bg-[#222] rounded-full px-2 py-2 grid place-items-center border-4 border-[#88a7a5]">
                  {getInitials(receiveContent.login.name)}
                </div>
              )}
              <div className="pr-4 px-2 flex flex-col justify-center relative">
                <p className="tracking-wide text-[13px] leading-[12px] text-[#fff2cf]">
                  Olá, {receiveContent.login.name.split(" ")[0]}
                </p>
                <div className="flex gap-1 justify-center items-center w-max text-[#bbb]">
                  <p className="text-[11px]">Acessar</p>
                  <MoveRight className="w-[11px]" />
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              className="flex gap-2 bg-[#121212] rounded-full border-1 border-[#333] px-1 py-1 relative cursor-pointer"
              onClick={() => setClickOnLogin(!clickOnLogin)}
              whileTap={{
                scale: 0.9,
                transition: {
                  duration: 0.3,
                  ease: "circInOut",
                  type: "spring",
                },
              }}
            >
              <div className="w-[55px] aspect-square bg-[rgb(34,34,34)] grid place-items-center border-1 border-[#333] rounded-full">
                <User className="w-full text-[#fff]" />
              </div>
              <div className="px-0 pr-4 py-2 flex justify-center flex-col">
                <p className=" leading-[12px] text-[14px] select-none">
                  Fazer Login
                </p>
                <span className="text-[12px] text-[#333] select-none">
                  Clique aqui
                </span>
              </div>
              <AnimatePresence>
                {clickOnLogin && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{
                      duration: 0.3,
                      type: "spring",
                      ease: "circInOut",
                    }}
                    className="absolute w-nax bottom-[-120px] bg-[#e7e6e680] border-1 border-[#dddddd] shadow-2xl px-2 py-2 flex flex-col gap-2 rounded-[25px]"
                  >
                    <div
                      onClick={() => setLinkLogin("/login/admin")}
                      className="w-full p-2 px-4 border-1 border-[#ebebebad] flex gap-4 text-[#555] text-[13px] rounded-full bg-[#eee] duration-200 hover:bg-[#f1ffde] hover:text-[#333]"
                    >
                      <UserRoundCog className="w-5 h-5" />
                      <p className="tracking-wider">Administrador</p>
                    </div>
                    <div
                      onClick={() => setLinkLogin("/login/employee")}
                      className="w-full p-2 px-4 border-1 border-[#ebebebad] flex gap-4 text-[#555] text-[13px] rounded-full bg-[#eee] duration-200 hover:bg-[#defbff] hover:text-[#333]"
                    >
                      <User className="w-5 h-5" />
                      <p className="tracking-wider">Psicólogo</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
          <div className="w-15 h-15 bg-[#111] rounded-full flex justify-center items-center cursor-not-allowed">
            <Menu />
          </div>
        </motion.div>
      )}
      <div className="w-full h-screen bg-gradient-to-tl from-[#ffffff] to-[#3b7f88] relative overflow-hidden">
        <div className="w-full h-full absolute z-10">
          <div className="overflow-hidden relative h-full rotate-180">
            <Aurora
              colorStops={["#00e1ff", "#9EE8FF", "#00ccff"]}
              blend={0.5}
              amplitude={1.0}
              speed={0.5}
            />
          </div>
        </div>
        <div className="w-full h-full z-11  overflow-hidden sepia-30 flex flex-col items-center justify-center relative">
          <p className="text-[20px] ml-2">
            O sistema que em meio a escuridão cria luz
          </p>
          <p className="text-6xl md:text-9xl ">FeelSystem</p>
        </div>
      </div>
      <div className="fixed top-0 z-15 w-full h-screen pointer-events-none">
        {receiveContent && acess && (
          <RefreshComponent
            title={`Bem-vindo(a) novamente, ${
              receiveContent.login.name.split(" ")[0]
            }!`}
            display="flex"
            route={acess}
          />
        )}
        {linkLogin && (
          <RefreshComponent
            title="Indo para área de login..."
            display="flex"
            route={linkLogin}
          />
        )}
      </div>
    </motion.main>
  );
}
