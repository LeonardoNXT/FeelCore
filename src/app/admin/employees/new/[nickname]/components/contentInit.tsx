"use client";
import { useUserStore } from "@/stores/userStore";
import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { useFuncionarioStore } from "@/stores/funcionarioStore";
type Pagina = 1 | 2 | 3 | 4 | 5;
// Props do componente
interface Props {
  setPagina: (number: Pagina) => void;
}

export default function CadastroInicio({ setPagina }: Props) {
  const { user } = useUserStore();
  const { funcionario, setFuncionario } = useFuncionarioStore();
  const ranOnce = useRef(false);

  const inputNameRef = useRef<HTMLInputElement>(null);
  const inputLastNameRef = useRef<HTMLInputElement>(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const divOpacity = useRef<HTMLDivElement>(null);

  const isFormValid = (name: string, lastName: string): boolean => {
    return name.length > 2 && lastName.length > 4;
  };

  const verifyInputs = useCallback(() => {
    const name = inputNameRef.current?.value || "";
    const lastName = inputLastNameRef.current?.value || "";
    setIsButtonDisabled(!isFormValid(name, lastName));
  }, []);

  useEffect(() => {
    if (ranOnce.current) return;
    ranOnce.current = true;
    if (divOpacity.current) {
      const title = divOpacity.current.querySelector("p");
      const inputs = Array.from(divOpacity.current.querySelectorAll("input"));
      const div = divOpacity.current.querySelector("div");

      if (title) {
        gsap.fromTo(
          title,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
        );
      }

      if (inputs) {
        gsap.fromTo(
          inputs,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
        );
      }
      if (div) {
        gsap.fromTo(
          div,
          { opacity: 0 },
          { opacity: 1, duration: 0.3, ease: "power2.out" }
        );
      }
    }

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

  if (!user) return null;

  const changePage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const name = inputNameRef.current?.value.trim();
    const lastname = inputLastNameRef.current?.value.trim();
    const completename = [name, lastname].filter(Boolean).join(" ");
    setFuncionario({
      name: completename,
    });

    if (!divOpacity.current) return;

    gsap.to(divOpacity.current, {
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        setPagina(2);
        gsap.to(divOpacity.current, { opacity: 1 });
      },
    });
  };

  return (
    <>
      <div
        className="w-full h-full flex justify-center items-center flex-col px-4 sm:px-0"
        ref={divOpacity}
      >
        <p className="text-center mb-4 sm:mb-0">
          <span className="text-[13vw] sm:text-3xl md:text-[4vw] font-medium">
            Olá, {user.name}!<br />
          </span>
          <span className="text-sm sm:text-base">
            Digite nos campos para cadastrar o novo funcionário.
          </span>
        </p>

        <div className="w-full max-w-md sm:w-1/2 sm:max-w-none">
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
        </div>
      </div>
    </>
  );
}
