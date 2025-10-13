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
  const [cpf, setCpf] = useState<string>("");
  const [maxDate, setMaxDate] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);

  const { funcionario, setFuncionario } = useFuncionarioStore();
  const inputCpf = useRef<HTMLInputElement>(null);
  const calendar = useRef<HTMLInputElement>(null);
  const returnButton = useRef<HTMLButtonElement>(null);
  const divReference = useRef<HTMLDivElement>(null);

  const titleRef = useRef<HTMLParagraphElement>(null);
  const formContainerRef = useRef<HTMLDivElement>(null);
  const ranOnce = useRef(false);

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

  // Função para validar CPF
  const isValidCPF = (cpf: string): boolean => {
    const numbers = cpf.replace(/\D/g, "");

    if (numbers.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(numbers)) return false;

    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(numbers.charAt(i)) * (10 - i);
    }
    let remainder = 11 - (sum % 11);
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(numbers.charAt(9))) return false;

    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(numbers.charAt(i)) * (11 - i);
    }
    remainder = 11 - (sum % 11);
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(numbers.charAt(10))) return false;

    return true;
  };

  // Função para verificar se os inputs são válidos
  const isAdult = (birthday: string): boolean => {
    const birthDate = new Date(birthday);
    const today = new Date();

    // calcula idade
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age >= 18;
  };

  const isVerifiedInput = (cpf: string, birthday: string): boolean => {
    const cpfNumbers = cpf.replace(/\D/g, "");

    return (
      cpfNumbers.length === 11 &&
      isValidCPF(cpf) &&
      birthday !== undefined &&
      birthday !== null &&
      birthday !== "" &&
      isAdult(birthday) // <-- aqui valida se tem 18+
    );
  };

  // Função para verificar se existe input válido
  const existInput = useCallback(() => {
    if (inputCpf.current && calendar.current) {
      const isValid = isVerifiedInput(
        inputCpf.current.value,
        calendar.current.value
      );
      setIsButtonDisabled(!isValid);
    }
  }, []);

  // Handler para mudança no CPF
  const handleCpfChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const formatted = formatCpf(e.target.value);
    setCpf(formatted);

    // Atualiza o valor do input diretamente
    if (inputCpf.current) {
      inputCpf.current.value = formatted;
    }

    // Executa a validação após um pequeno delay para garantir que o estado foi atualizado
    setTimeout(existInput, 0);
  };

  // Função para mudar de página
  const changePage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (inputCpf?.current && calendar?.current) {
      // Verifica se os dados são válidos antes de prosseguir
      if (!isVerifiedInput(inputCpf.current.value, calendar.current.value)) {
        alert("Por favor, preencha todos os campos corretamente.");
        return;
      }

      // Remove formatação antes de salvar no store
      const cleanCpf = inputCpf.current.value.replace(/\D/g, "");

      setFuncionario({
        cpf: cleanCpf,
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

    // Carrega dados salvos do funcionário
    if (inputCpf.current && calendar.current) {
      if (funcionario.cpf && funcionario.birthday) {
        // Formata os dados ao carregar
        const formattedCpf = formatCpf(funcionario.cpf);

        inputCpf.current.value = formattedCpf;
        calendar.current.value = funcionario.birthday;

        setCpf(formattedCpf);

        // Executa validação
        setTimeout(existInput, 100);
      }
    }
  }, [funcionario.cpf, funcionario.birthday, existInput]);

  return (
    <div
      ref={divReference}
      className="w-full flex flex-col justify-center items-center px-4 sm:px-0"
    >
      <p
        ref={titleRef}
        className="text-center text-sm sm:text-base md:text-[1vw] mb-4 sm:mb-0 over"
      >
        Coloque os dados de
        <br />
        <span className="font-bold text-[20vw] w text-4xl sm:text-6xl md:text-[8vw] leading-[0.7] block mt-2">
          {funcionario.name?.split(" ")[0]}
        </span>
      </p>

      <div className="w-full max-w-lg sm:w-[60%] sm:max-w-none">
        <div
          className="flex flex-col sm:flex-row w-full gap-3 sm:gap-[1vw] p-4 sm:p-[1vw] border-1 rounded-xl sm:rounded-[2vw] mt-6 sm:mt-[1vw]"
          ref={formContainerRef}
        >
          {/* Botão Voltar */}
          <button
            ref={returnButton}
            className="px-6 py-3 sm:px-[1.5vw] sm:py-[0.8vw] rounded-xl sm:rounded-[2vw] border text-sm sm:text-[0.8vw] transition-all duration-300 hover:bg-[#ff8282] active:scale-95 order-4 sm:order-1 w-full sm:w-auto"
            onClick={returnPage}
          >
            Voltar
          </button>

          {/* Form Container */}
          <form className="flex flex-col sm:flex-row w-full gap-3 sm:gap-[1vw] order-1 sm:order-2">
            {/* CPF Input */}
            <input
              ref={inputCpf}
              type="text"
              value={cpf}
              onChange={handleCpfChange}
              placeholder="CPF: XXX.XXX.XXX-XX"
              maxLength={14}
              className="border-1 px-4 py-3 sm:px-[2vw] sm:py-[0.8vw] sm:pl-[1vw] transition-all duration-300 focus:border-[#e6e6e6] focus:outline-none rounded-xl sm:rounded-[2vw] w-full text-sm sm:text-[0.8vw] bg-[#000]"
            />

            {/* Date Input */}
            <input
              ref={calendar}
              onChange={existInput}
              min="1930-01-01"
              max={maxDate}
              type="date"
              name="hireDate"
              className="w-full sm:w-1/2 transition-all duration-300 backdrop-blur-sm rounded-xl sm:rounded-[2vw] bg-[#000000] text-sm sm:text-[0.8vw] px-4 py-3 sm:px-[1.5vw] sm:py-[0.8vw] text-[#9c9c9c] focus:border-[#e6e6e6] focus:outline-none focus:ring-2 focus:ring-white/20 border-1"
            />

            {/* Submit Button */}
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
    </div>
  );
}
