"use client";
import { useFuncionarioStore } from "@/stores/funcionarioStore";
import { useEffect, useState, useRef, useCallback, ChangeEvent } from "react";
import { gsap } from "gsap";

type Pagina = 1 | 2 | 3 | 4 | 5;

interface Estado {
  id: number;
  sigla: string;
  nome: string;
}

interface Props {
  pagina: Pagina;
  setPagina: (number: Pagina) => void;
}

const fetchEstados = async (): Promise<Estado[]> => {
  const res = await fetch(
    "https://servicodados.ibge.gov.br/api/v1/localidades/estados"
  );
  const data = await res.json();
  return data.sort((a: Estado, b: Estado) => a.nome.localeCompare(b.nome));
};

export default function OutrosReqCadastroProfissional({ setPagina }: Props) {
  const [status, setStatus] = useState<boolean>(true);
  const [estados, setEstados] = useState<Estado[]>([]);
  const [remuneracao, setRemuneracao] = useState<string>("");
  const [endereco, setEndereco] = useState<string>("");
  const [bairro, setBairro] = useState<string>("");
  const [estadoSelecionado, setEstadoSelecionado] = useState<string>("");
  const [dataContratacao, setDataContratacao] = useState<string>("");
  const [minDate, setMinDate] = useState("");
  const [maxDate, setMaxDate] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);

  const { funcionario, setFuncionario } = useFuncionarioStore();
  const firstName = funcionario.name?.split(" ")[0] || " ";

  const returnButton = useRef<HTMLButtonElement>(null);
  const inputRemuneracao = useRef<HTMLInputElement>(null);
  const inputEndereco = useRef<HTMLInputElement>(null);
  const inputBairro = useRef<HTMLInputElement>(null);
  const selectEstado = useRef<HTMLSelectElement>(null);
  const inputDataContratacao = useRef<HTMLInputElement>(null);
  const divReference = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLParagraphElement>(null);
  const formContainerRef = useRef<HTMLDivElement>(null);
  const ranOnce = useRef(false);

  // Função para formatar valor monetário
  const formatMoney = (value: string): string => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, "");

    if (numbers === "") return "";

    // Converte para número e formata
    const numberValue = parseInt(numbers) / 100;
    return numberValue.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Função para verificar se os inputs são válidos
  const isVerifiedInput = useCallback(
    (
      remuneracao: string,
      endereco: string,
      bairro: string,
      estado: string,
      dataContratacao: string
    ): boolean => {
      const remuneracaoNumbers = remuneracao.replace(/\D/g, "");

      return (
        remuneracaoNumbers !== "" &&
        parseInt(remuneracaoNumbers) > 0 &&
        endereco.trim().length >= 5 &&
        bairro.trim().length >= 2 &&
        estado !== "" &&
        dataContratacao !== ""
      );
    },
    []
  );

  // Função para verificar se existe input válido
  const existInput = useCallback(() => {
    if (
      inputRemuneracao.current &&
      inputEndereco.current &&
      inputBairro.current &&
      selectEstado.current &&
      inputDataContratacao.current
    ) {
      setIsButtonDisabled(
        !isVerifiedInput(
          inputRemuneracao.current.value,
          inputEndereco.current.value,
          inputBairro.current.value,
          selectEstado.current.value,
          inputDataContratacao.current.value
        )
      );
    }
  }, [isVerifiedInput]);

  // Handler para mudança na remuneração
  const handleRemuneracaoChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const formatted = formatMoney(e.target.value);
    setRemuneracao(formatted);
    existInput();
  };

  // Handler para mudança no endereço
  const handleEnderecoChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setEndereco(e.target.value);
    existInput();
  };

  // Handler para mudança no bairro
  const handleBairroChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setBairro(e.target.value);
    existInput();
  };

  // Handler para mudança no estado
  const handleEstadoChange = (e: ChangeEvent<HTMLSelectElement>): void => {
    setEstadoSelecionado(e.target.value);
    existInput();
  };

  // Handler para mudança na data de contratação
  const handleDataContratacaoChange = (
    e: ChangeEvent<HTMLInputElement>
  ): void => {
    setDataContratacao(e.target.value);
    existInput();
  };

  // Função para mudar de página
  const changePage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (
      inputRemuneracao?.current &&
      inputEndereco?.current &&
      inputBairro?.current &&
      selectEstado?.current &&
      inputDataContratacao?.current
    ) {
      // Converte remuneração para número
      const remuneracaoValue =
        parseFloat(inputRemuneracao.current.value.replace(/\D/g, "")) / 100;

      // Combina endereço + bairro + estado no campo address
      const addressComplete = `${inputEndereco.current.value}, ${inputBairro.current.value}, ${selectEstado.current.value}`;

      setFuncionario({
        remuneration: remuneracaoValue,
        address: addressComplete,
        hiredata: inputDataContratacao.current.value,
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
            setPagina(5);
          }, 300);
        },
      });
    }
  };

  // Função para voltar página
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
            setPagina(3);
          }, 300);
        },
      });
    }
  };

  useEffect(() => {
    fetchEstados().then(setEstados);

    // Define datas mínima e máxima para contratação
    const hoje = new Date();
    const anoAtual = hoje.getFullYear();
    const mesAtual = String(hoje.getMonth() + 1).padStart(2, "0");
    const diaAtual = String(hoje.getDate()).padStart(2, "0");

    setMinDate("2020-01-01");
    setMaxDate(`${anoAtual}-${mesAtual}-${diaAtual}`);

    // Animações de entrada
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

    // Preenche campos se já existirem dados no store
    if (
      inputRemuneracao.current &&
      inputEndereco.current &&
      inputBairro.current &&
      selectEstado.current &&
      inputDataContratacao.current
    ) {
      if (funcionario.remuneration) {
        const formattedValue = (funcionario.remuneration * 100).toLocaleString(
          "pt-BR",
          {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }
        );
        inputRemuneracao.current.value = formattedValue;
        setRemuneracao(formattedValue);
      }
      if (funcionario.address) {
        // Separa endereço, bairro e estado se estiver combinado
        const addressParts = funcionario.address.split(", ");

        if (addressParts.length >= 3) {
          const enderecoValue = addressParts[0];
          const bairroValue = addressParts[1];
          const estadoValue = addressParts[2];

          inputEndereco.current.value = enderecoValue;
          setEndereco(enderecoValue);

          inputBairro.current.value = bairroValue;
          setBairro(bairroValue);

          if (estadoValue && estadoValue.length === 2) {
            selectEstado.current.value = estadoValue;
            setEstadoSelecionado(estadoValue);
          }
        }
      }
      if (funcionario.hiredata) {
        inputDataContratacao.current.value = funcionario.hiredata;
        setDataContratacao(funcionario.hiredata);
      }
      if (funcionario.status) {
        setStatus(funcionario.status === "Ativo");
      }
    }
  }, [funcionario]);

  return (
    <div ref={divReference} className="w-full flex flex-col items-center">
      <p ref={titleRef} className="text-[1vw] text-center ">
        Defina os Identificadores de
        <br />
        <span className="font-bold text-[7vw] leading-[0.7]">{firstName}</span>
      </p>
      <div
        ref={formContainerRef}
        className="w-[60%] p-[1vw] rounded-[2vw] border-1 relative mt-[2vw]"
      >
        <button
          ref={returnButton}
          onClick={returnPage}
          className={`px-[1.5vw] absolute bottom-[1vw] z-10 py-[0.8vw] rounded-[2vw] border text-[0.8vw] transition-all duration-300 hover:bg-[#ff8282]`}
        >
          Voltar
        </button>
        <form>
          <div className="w-full mb-[1vw] flex justify-between">
            <div className="w-[20%] h-auto flex justify-center bg-[#000] rounded-[2vw] border-1 relative p-[0.6vw]">
              <div className="w-full rounded-[2vw] h-full absolute p-[0.6vw] right-[0] top-1/2 translate-y-[-50%]">
                <div
                  className={`w-[50%] h-full border-1 rounded-[2vw] transition-all duration-300 ${
                    status
                      ? "bg-[#213b1e] translate-x-[0%]"
                      : "bg-[#3b1e1e] translate-x-[100%]"
                  }`}
                ></div>
              </div>
              <div
                className="w-1/2 flex justify-center items-center text-[0.76vw] cursor-pointer text-[#ffffff] relative"
                onClick={() => {
                  setStatus(true);
                  setFuncionario({ ...funcionario, status: "Ativo" });
                }}
              >
                Ativo
              </div>
              <div
                className="w-1/2 flex justify-center items-center text-[0.76vw] cursor-pointer text-[#ffffff] relative"
                onClick={() => {
                  setStatus(false);
                  setFuncionario({ ...funcionario, status: "Inativo" });
                }}
              >
                Inativo
              </div>
            </div>
            <div className="w-[25%] relative">
              <label className="absolute left-[1vw] top-1/2 translate-y-[-50%]">
                R$
              </label>
              <input
                ref={inputRemuneracao}
                required
                type="text"
                value={remuneracao}
                onChange={handleRemuneracaoChange}
                placeholder="Remuneração"
                className="border-1 no-spinner w-full px-[2vw] py-[0.8vw] pl-[2.3vw] transition-all duration-300 focus:border-[#e6e6e6] rounded-[2vw] text-[0.8vw] bg-[#000000]"
              />
            </div>
            <div className="flex items-center gap-[1vw]">
              <label className="text-[#ebebeb]">Contratação:</label>
              <input
                ref={inputDataContratacao}
                min={minDate}
                max={maxDate}
                type="date"
                value={dataContratacao}
                onChange={handleDataContratacaoChange}
                name="hireDate"
                className="w-full transition-all duration-300 backdrop-blur-sm rounded-[2vw] bg-[#000000] text-[0.8vw] px-[1.5vw] py-[0.8vw] text-[#9c9c9c] focus:border-[#e6e6e6] focus:outline-none focus:ring-2 focus:ring-white/20"
              />
            </div>
          </div>
          <div className="flex items-stretch w-full gap-[1vw]">
            <select
              ref={selectEstado}
              value={estadoSelecionado}
              onChange={handleEstadoChange}
              className="no-select-arrow border-1 rounded-[2vw] px-[1vw] py-[0.8vw] bg-[#000000] text-[#fff] text-[0.8vw] w-[20%] text-center"
            >
              <option className="text-[#333]" value="">
                Selecione o estado
              </option>
              {estados.map((estado) => (
                <option key={estado.id} value={estado.sigla}>
                  {estado.nome} ({estado.sigla})
                </option>
              ))}
            </select>

            <input
              ref={inputBairro}
              required
              type="text"
              value={bairro}
              onChange={handleBairroChange}
              placeholder="Bairro:"
              className="border-1 no-spinner w-[25%] px-[2vw] py-[0.8vw] pl-[1vw] transition-all duration-300 focus:border-[#e6e6e6] rounded-[2vw] text-[0.8vw] bg-[#000000]"
            />

            <input
              ref={inputEndereco}
              required
              type="text"
              value={endereco}
              onChange={handleEnderecoChange}
              placeholder="Endereço completo:"
              className="border-1 no-spinner w-[55%] px-[2vw] py-[0.8vw] pl-[1vw] transition-all duration-300 focus:border-[#e6e6e6] rounded-[2vw] text-[0.8vw] bg-[#000000]"
            />
          </div>
          <div className="mt-[1vw] flex justify-end">
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
          </div>
        </form>
      </div>
    </div>
  );
}
