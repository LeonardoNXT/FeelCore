"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { useFuncionarioStore } from "@/stores/funcionarioStore";
import { AnimatePresence, motion } from "framer-motion";
import { Organization } from "@/stores/userStore";
type Pagina = 1 | 2 | 3 | 4 | 5;
// Props do componente
interface Props {
  setPagina: (number: Pagina) => void;
}

export default function CadastroInicio({ setPagina }: Props) {
  const [user, setUser] = useState<Organization | null>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { funcionario, setFuncionario } = useFuncionarioStore();
  const ranOnce = useRef(false);

  const inputNameRef = useRef<HTMLInputElement>(null);
  const inputLastNameRef = useRef<HTMLInputElement>(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const isFormValid = (name: string, lastName: string): boolean => {
    return name.length > 2 && lastName.length > 4;
  };

  const verifyInputs = useCallback(() => {
    const name = inputNameRef.current?.value || "";
    const lastName = inputLastNameRef.current?.value || "";
    setIsButtonDisabled(!isFormValid(name, lastName));
  }, []);

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await fetch("/api/auth/verify", {
          method: "POST",
          credentials: "include",
        });
        setIsLoading(false);
        if (!response.ok) {
          throw new Error("Houve um erro interno");
        }

        const data = await response.json();

        console.log("POST /auth/verify", data);
        setUser(data[0]);
      } catch (err) {
        setIsLoading(false);
        console.log(err);
      }
    };
    getUser();
  }, []);

  useEffect(() => {
    if (ranOnce.current) return;
    ranOnce.current = true;

    if (inputNameRef.current && inputLastNameRef.current) {
      if (funcionario.name) {
        inputNameRef.current.value = funcionario.name.split(" ")[0];
        inputLastNameRef.current.value = funcionario.name
          .split(" ")
          .splice(1)
          .join(" ");
      }
    }
    verifyInputs();
  }, [funcionario.name, verifyInputs]);

  const changePage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const name = inputNameRef.current?.value.trim();
    const lastname = inputLastNameRef.current?.value.trim();
    const completename = [name, lastname].filter(Boolean).join(" ");
    setFuncionario({
      name: completename,
    });
    setPagina(2);
  };

  if (!isLoading) {
    if (user) {
      return (
        <div className="w-full h-full flex justify-center items-center flex-col px-4 sm:px-0">
          <AnimatePresence>
            <motion.p
              key={"title"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-4 sm:mb-0"
            >
              <span className="text-[13vw] sm:text-3xl md:text-[4vw] font-medium">
                Olá, {user.name}!<br />
              </span>
              <span className="text-sm sm:text-base">
                Digite nos campos para cadastrar o novo funcionário.
              </span>
            </motion.p>

            <motion.div
              key={"form"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-md sm:w-1/2 sm:max-w-none"
            >
              <form
                className="flex flex-col sm:flex-row gap-3 sm:gap-[1vw] bg-[#05050504] border-1 mb-4 sm:mb-[1vw] border-[#474747] p-4 sm:p-[1vw] rounded-xl sm:rounded-[2vw] mt-6 sm:mt-[2vw]"
                onSubmit={(e) => e.preventDefault()}
              >
                <div className="w-full sm:w-1/2">
                  <input
                    ref={inputNameRef}
                    required
                    type="text"
                    placeholder="Nome:"
                    className="border-1 px-4 py-3 sm:px-[2vw] sm:py-[0.8vw] sm:pl-[1vw] transition-all duration-300 focus:border-[#e6e6e6] rounded-xl sm:rounded-[2vw] w-full text-sm sm:text-[0.8vw] bg-[#000] focus:outline-none"
                    onChange={verifyInputs}
                  />
                </div>

                <div className="w-full sm:w-1/2">
                  <input
                    ref={inputLastNameRef}
                    required
                    type="text"
                    placeholder="Sobrenome:"
                    className="border-1 px-4 py-3 sm:px-[2vw] sm:py-[0.8vw] sm:pl-[1vw] transition-all duration-300 focus:border-[#e6e6e6] rounded-xl sm:rounded-[2vw] text-sm sm:text-[0.8vw] w-full bg-[#000] focus:outline-none"
                    onChange={verifyInputs}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isButtonDisabled}
                  onClick={changePage}
                  className={`px-6 py-3 sm:px-[1.5vw] sm:py-[0.8vw] rounded-xl sm:rounded-[2vw] border text-sm sm:text-[0.8vw] transition-all duration-300 font-medium w-full sm:w-auto ${
                    isButtonDisabled
                      ? "bg-[#000000] text-[#525252] cursor-not-allowed"
                      : "bg-[#ebebeb] text-[#333] hover:bg-white active:scale-95"
                  }`}
                >
                  Próximo
                </button>
              </form>
            </motion.div>
          </AnimatePresence>
        </div>
      );
    } else {
      return (
        <div className="w-full h-screen flex justify-center items-center text-center">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="text-2xl"
          >
            Houve um erro ao verificar a organização.
          </motion.p>
        </div>
      );
    }
  }
}
