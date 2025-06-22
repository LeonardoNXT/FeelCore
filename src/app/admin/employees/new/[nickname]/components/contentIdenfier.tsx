"use client";
import { useFuncionarioStore } from "@/stores/funcionarioStore";
import { useState, useRef, useCallback, useEffect, ChangeEvent } from "react";
import { gsap } from "gsap";

type Pagina = 1 | 2 | 3 | 4 | 5;

interface Props {
  pagina: Pagina;
  setPagina: (number: Pagina) => void;
}

export default function IdentificacaoDoProfissional({ setPagina }: Props) {
  const [rg, setRg] = useState<string>("");
  const [cpf, setCpf] = useState<string>("");
  const [maxDate, setMaxDate] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);

  const { funcionario, setFuncionario } = useFuncionarioStore();

  const inputRg = useRef<HTMLInputElement>(null);
  const inputCpf = useRef<HTMLInputElement>(null);
  const calendar = useRef<HTMLInputElement>(null);
  const returnButton = useRef<HTMLButtonElement>(null);
  const divReference = useRef<HTMLDivElement>(null);

  const titleRef = useRef<HTMLParagraphElement>(null);
  const formContainerRef = useRef<HTMLDivElement>(null);
  const ranOnce = useRef(false);

  // Função para formatar RG brasileiro (XX.XXX.XXX-X)
  const formatRg = (value: string): string => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, "");

    // Aplica a máscara baseado no tamanho
    if (numbers.length <= 2) {
      return numbers;
    } else if (numbers.length <= 5) {
      return `${numbers.slice(0, 2)}.${numbers.slice(2)}`;
    } else if (numbers.length <= 8) {
      return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(
        5
      )}`;
    } else {
      // Limita a 9 dígitos
      return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(
        5,
        8
      )}-${numbers.slice(8, 9)}`;
    }
  };

  // Função para formatar CPF brasileiro (XXX.XXX.XXX-XX)
  const formatCpf = (value: string): string => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, "");

    // Aplica a máscara baseado no tamanho
    if (numbers.length <= 3) {
      return numbers;
    } else if (numbers.length <= 6) {
      return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
    } else if (numbers.length <= 9) {
      return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(
        6
      )}`;
    } else {
      // Limita a 11 dígitos
      return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(
        6,
        9
      )}-${numbers.slice(9, 11)}`;
    }
  };

  // Função para verificar se os inputs são válidos
  const isVerifiedInput = (rg: string, cpf: string): boolean => {
    const rgNumbers = rg.replace(/\D/g, "");
    const cpfNumbers = cpf.replace(/\D/g, "");
    const birthday = calendar?.current?.value;

    return (
      rgNumbers.length >= 8 &&
      cpfNumbers.length >= 11 &&
      birthday !== undefined &&
      birthday !== null &&
      birthday !== ""
    );
  };

  // Função para verificar se existe input válido
  const existInput = useCallback(() => {
    if (inputRg.current && inputCpf.current) {
      setIsButtonDisabled(
        !isVerifiedInput(inputRg.current.value, inputCpf.current.value)
      );
    }
  }, []);

  // Handler para mudança no RG
  const handleRgChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const formatted = formatRg(e.target.value);
    setRg(formatted);
    existInput();
  };

  // Handler para mudança no CPF
  const handleCpfChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const formatted = formatCpf(e.target.value);
    setCpf(formatted);
    existInput();
  };

  // Função para mudar de página
  const changePage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (inputRg?.current && inputCpf?.current && calendar?.current) {
      setFuncionario({
        rg: inputRg.current.value,
        cpf: inputCpf.current.value,
        birthday: calendar.current.value,
      });
    }
    if (divReference.current) {
      const title = divReference.current.querySelector("p");
      const div = divReference.current.querySelector("div");

      if (title) {
        gsap.to(title, {
          opacity: 0,
          y: 20,
          duration: 0.3,
        });
      }
      gsap.to(div, {
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
          setTimeout(() => {
            setPagina(4);
          }, 300);
        },
      });
    }
  };
  const returnPage = () => {
    if (divReference.current) {
      const title = divReference.current.querySelector("p");
      const div = divReference.current.querySelector("div");

      if (title) {
        gsap.to(title, {
          opacity: 0,
          y: 20,
          duration: 0.3,
        });
      }
      gsap.to(div, {
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
          setTimeout(() => {
            setPagina(2);
          }, 300);
        },
      });
    }
  };

  useEffect(() => {
    const hoje = new Date();
    // Subtrai 18 anos da data atual
    hoje.setFullYear(hoje.getFullYear() - 18);

    // Formata para "YYYY-MM-DD"
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, "0");
    const dia = String(hoje.getDate()).padStart(2, "0");

    setMaxDate(`${ano}-${mes}-${dia}`);
    if (ranOnce.current) return;
    ranOnce.current = true;
    if (titleRef.current && formContainerRef.current) {
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.3 }
      );

      gsap.fromTo(
        formContainerRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3 }
      );
    }
    console.log(calendar.current?.value);
    if (inputRg.current && inputCpf.current && calendar.current) {
      if (funcionario.rg && funcionario.cpf && funcionario.birthday) {
        inputRg.current.value = funcionario.rg;
        inputCpf.current.value = funcionario.cpf;
        calendar.current.value = funcionario.birthday;
      }
    }
  }, [funcionario.rg, funcionario.cpf, funcionario.birthday]);

  return (
    <div
      ref={divReference}
      className="w-full flex flex-col justify-center items-center"
    >
      <p ref={titleRef} className="text-center text-[1vw]">
        Coloque os dados de
        <br />
        <span className="font-bold text-[8vw] leading-[0.7]">
          {funcionario.name?.split(" ")[0]}
        </span>
      </p>
      <div
        className="flex w-[60%] gap-[1vw] p-[1vw] border-1 rounded-[2vw] mt-[1vw]"
        ref={formContainerRef}
      >
        <button
          ref={returnButton}
          className={`px-[1.5vw] py-[0.8vw] rounded-[2vw] border text-[0.8vw] transition-all duration-300 hover:bg-[#ff8282]`}
          onClick={returnPage}
        >
          Voltar
        </button>
        <form className="flex w-full gap-[1vw]">
          <input
            ref={inputRg}
            type="text"
            value={rg}
            onChange={handleRgChange}
            placeholder="RG:"
            className="border-1 px-[2vw] py-[0.8vw] pl-[1vw] transition-all duration-300 focus:border-[#e6e6e6] rounded-[2vw] w-full text-[0.8vw] bg-[#000]"
          />
          <input
            ref={inputCpf}
            type="text"
            value={cpf}
            onChange={handleCpfChange}
            placeholder="CPF:"
            className="border-1 px-[2vw] py-[0.8vw] pl-[1vw] transition-all duration-300 focus:border-[#e6e6e6] rounded-[2vw] w-full text-[0.8vw] bg-[#000]"
          />
          <input
            ref={calendar}
            onChange={existInput}
            min="1930-01-01"
            max={maxDate}
            type="date"
            name="hireDate"
            className="w-1/2 transition-all duration-300 backdrop-blur-sm rounded-[2vw] bg-[#000000] text-[0.8vw] px-[1.5vw] py-[0.8vw] text-[#9c9c9c] focus:border-[#e6e6e6] focus:outline-none focus:ring-2 focus:ring-white/20"
          />
          <button
            type="submit"
            disabled={isButtonDisabled}
            onClick={changePage}
            className={`px-[1.5vw] py-[0.8vw] rounded-[2vw] border text-[0.8vw] transition-all duration-300 ${
              isButtonDisabled
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
