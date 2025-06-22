"use client";
import { gsap } from "gsap";
import { useFuncionarioStore } from "@/stores/funcionarioStore";
import { useRef, useEffect, useState, useCallback } from "react";
import { ChangeEvent } from "react";

type Pagina = 1 | 2 | 3 | 4 | 5;

interface Props {
  pagina: Pagina;
  setPagina: (number: Pagina) => void;
}

export default function CadastroEmailSenha({ setPagina }: Props) {
  const [phone, setPhone] = useState<string>("");
  const [isDisabled, setIsDisabled] = useState<boolean>(true);

  const submitButton = useRef<HTMLButtonElement>(null);
  const returnButton = useRef<HTMLButtonElement>(null);
  const inputNumber = useRef<HTMLInputElement>(null);
  const inputEmail = useRef<HTMLInputElement>(null);

  const isVerifiedInput = (email: string, number: string) => {
    return (
      email.includes("@") &&
      email.includes(".com") &&
      number.replace(/\D/g, "").length >= 11
    );
  };
  const existInput = useCallback(() => {
    if (inputNumber.current && inputEmail.current) {
      setIsDisabled(
        !isVerifiedInput(inputEmail.current.value, inputNumber.current.value)
      );
    }
  }, []);

  // Função para formatar celular brasileiro
  const formatPhone = (value: string): string => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, "");

    // Aplica a máscara baseado no tamanho
    if (numbers.length <= 2) {
      return `(${numbers}`;
    } else if (numbers.length <= 7) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    } else if (numbers.length <= 11) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(
        7
      )}`;
    } else {
      // Limita a 11 dígitos
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(
        7,
        11
      )}`;
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const formatted = formatPhone(e.target.value);
    setPhone(formatted);
  };

  const divReference = useRef<HTMLDivElement>(null);
  const { funcionario, setFuncionario } = useFuncionarioStore();

  const returnPage = () => {
    if (divReference.current) {
      const title = divReference.current.querySelector("p");
      const inputs = Array.from(divReference.current.querySelectorAll("input"));
      const div = divReference.current.querySelector("div");

      if (title) {
        gsap.to(title, {
          opacity: 0,
          duration: 0.3,
        });
      }
      if (inputs) {
        gsap.to(inputs, {
          opacity: 0,
          duration: 0.3,
        });
      }
      if (div) {
        gsap.to(div, {
          opacity: 0,
          duration: 0.3,
          onComplete: () => {
            setTimeout(() => {
              setPagina(1);
            }, 300);
          },
        });
      }
    }
  };
  const changePage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (divReference.current) {
      const title = divReference.current.querySelector("p");
      const inputs = Array.from(divReference.current.querySelectorAll("input"));
      const div = divReference.current.querySelector("div");

      if (inputs) {
        gsap.to(inputs, { opacity: 0, y: 10, duration: 0.3 });
      }
      if (title) {
        gsap.to(title, { opacity: 0, y: 20, duration: 0.3 });
      }
      if (div) {
        gsap.to(div, {
          opacity: 0,
          duration: 0.3,
          onComplete: () => {
            setTimeout(() => {
              if (inputEmail.current && inputNumber.current) {
                setFuncionario({
                  phone: inputNumber.current?.value,
                  email: inputEmail.current?.value,
                });
              }
              setPagina(3);
            }, 300);
          },
        });
      }
    }
  };
  useEffect(() => {
    if (divReference.current) {
      const title = divReference.current.querySelector("p");
      const inputs = Array.from(divReference.current.querySelectorAll("input"));
      const div = divReference.current.querySelector("div");

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
          { opacity: 0, y: 10 },
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
    if (inputEmail.current && inputNumber.current) {
      inputEmail.current.value = funcionario.email || "";
      inputNumber.current.value = funcionario.phone || "";
      if (!(inputNumber.current.value.length == 0)) {
        setPhone(formatPhone(funcionario.phone || ""));
      }
      existInput();
    }
  }, [funcionario, existInput]);

  if (funcionario.name) {
    const firstName = funcionario.name.split(" ")[0] || " ";
    return (
      <div className="flex flex-col items-center" ref={divReference}>
        <p className="text-[1vw] text-center">
          Defina os Identificadores de
          <br />
          <span className="font-bold text-[7vw] leading-[0.7]">
            {firstName}
          </span>
        </p>
        <div className="flex border-1 rounded-[2vw] gap-[1vw] mt-[1vw] p-[1vw]">
          <button
            ref={returnButton}
            className={`px-[1.5vw] py-[0.8vw] rounded-[2vw] border text-[0.8vw] transition-all duration-300 hover:bg-[#ff8282]`}
            onClick={returnPage}
          >
            Voltar
          </button>
          <form className="w-[100%] flex gap-[1vw]">
            <input
              ref={inputEmail}
              onChange={existInput}
              type="email"
              placeholder="Email:"
              className="border-1 px-[2vw] py-[0.8vw] pl-[1vw] transition-all duration-300 focus:border-[#e6e6e6]   rounded-[2vw] text-[0.8vw]  w-full bg-[#000]"
            />
            <input
              ref={inputNumber}
              type="tel"
              value={phone}
              onChange={(e) => {
                handleChange(e);
                existInput();
              }}
              placeholder="Celular:"
              className="w-1/2 border-1 px-[1vw] py-[0.8vw] transition-all text-[0.8vw] duration-300 focus:border-[#e6e6e6] text-center rounded-[2vw]  bg-[#000]"
            />
            <button
              ref={submitButton}
              type="submit"
              disabled={isDisabled}
              onClick={changePage}
              className={`px-[1.5vw] py-[0.8vw] rounded-[2vw] border text-[0.8vw] transition-all duration-300 ${
                isDisabled
                  ? "bg-[#000000] text-[#525252] cursor-not-allowed"
                  : "bg-[#ebebeb] text-[#333] hover:bg-white"
              }`}
            >
              Próximo
            </button>
          </form>
        </div>
      </div>
    );
  }

  return null;
}
