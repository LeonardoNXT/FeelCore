"use client";
import { motion } from "framer-motion";
import { GraficoDeContratacoes } from "@/components/graphic/graphicADMadmission";
import Image from "next/image";
import { useEffect, useState } from "react";

interface ApiError {
  message: string;
  status?: number;
}

interface Employee {
  _id: string;
  address: string;
  avatar?: {
    url: string;
    public?: string;
  };
  birthday: string;
  cpf: string;
  createdAt: string;
  email: string;
  employee_of: string;
  hireDate: string;
  name: string;
  patients: string[];
  phone: string;
  remuneration: number;
  rg: string;
  status: "Ativo" | "Inativo";
  updatedAt: string;
  __v?: number;
}

interface ApiResponse {
  employees: Employee[];
  total: number;
  ativos: number;
  inativos: number;
  message: string;
}

export default function ContentOverView() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ativos, setAtivos] = useState<number | 0>(0);
  const [inativos, setInativos] = useState<number | 0>(0);

  const getAllEmployees = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/employees/all", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        const errorData: ApiError = await response.json();
        throw new Error(
          `Erro ${response.status}: ${
            errorData.message || "Falha na requisição"
          }`
        );
      }

      const data: ApiResponse = await response.json();
      const sortedAndLimited = data.employees
        .sort((a, b) => b.patients.length - a.patients.length) // Ordenar
        .slice(0, 3);
      setEmployees(sortedAndLimited);
      setAtivos(data.ativos);
      setInativos(data.inativos);

      console.log("Dados recebidos:", data);
      console.log("Total de funcionários:", data.total);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro desconhecido";
      setError(errorMessage);
      console.error("Erro ao buscar funcionários:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllEmployees();
  }, []);

  useEffect(() => {
    console.log("Employees atualizados:", employees);
  }, [employees]);

  if (loading) return <div>Carregando funcionários...</div>;
  if (error) return <div>Erro: {error}</div>;
  return (
    <div className="w-full">
      <motion.div
        className="w-full md:h-[98vh] relative md:rounded-tl-[2vw] md:rounded-[2vw] overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Image
          src="/background2.jpg"
          alt="Background image"
          fill
          className="object-cover sepia-50"
        />
        <div className="w-full h-full backdrop-blur-2xl relative p-[1vw] flex flex-col gap-[2vw]">
          <div className="absolute left-0 bottom-0 w-full h-[40%] bg-gradient-to-t from-[#0a0a0a] to-transparent"></div>
          <div className="w-full flex-col md:flex-row h-1/2 flex gap-[2vw]">
            <div className="w-[100%] md:w-[40%] h-full bg-[#ffffff1a] rounded-[2vw] p-[1.2vw] flex justify-center items-center flex-col relative border-[1]">
              <div className="w-full relative flex pb-[0.8vw] border-b-[1] border-[#f7f7f74f]">
                <div className="flex items-center justify-center gap-[0.4vw]">
                  <div className="ml-[1vw] md:ml-0 aspect-square w-[1vw] bg-[#ffffff]  rounded-full "></div>
                  <p className="text-[#ebebeb] mb-[2vw] mt-[2vw] ml-[2vw] md:mb-0 md:mt-0 md:ml-0 md:text-[0.75vw] tracking-wide">
                    Agendamentos Totais
                  </p>
                </div>
              </div>
              <div className="w-full h-full flex flex-col justify-center items-center">
                <p className="text-[5vw] md:text-[0.9vw] mt-[4vw] md:mt-0 tracking-wide ">
                  Agendamentos
                </p>
                <div className="text-[40vw] md:text-[10vw] mb-[10vw] md:mb-0 font-bold leading-[0.9]">
                  0
                </div>
              </div>
            </div>
            <div className="w-[100%] md:w-[60%] h-full bg-[#ffffff1a] rounded-[2vw] border-[1] relative p-[1.2vw] flex flex-col">
              <div className="w-full relative flex pb-[0.8vw] border-b-[1] border-[#f7f7f74f]">
                <div className="flex items-center justify-center gap-[0.4vw]">
                  <div className="ml-[1vw] md:ml-0 aspect-square w-[1vw] bg-[#ffffff]  rounded-full "></div>
                  <p className="text-[#ebebeb] mb-[2vw] mt-[2vw] ml-[2vw] md:mb-0 md:mt-0 md:ml-0 md:text-[0.75vw] tracking-wide">
                    Funcionários com mais pacientes
                  </p>
                </div>
              </div>
              <div className="grid md:grid-cols-3 place-items-center gap-[2vw] px-[2vw] relative h-auto flex-1">
                {employees.map(
                  (
                    employee // ✅ Parênteses para retorno implícito
                  ) => (
                    <div
                      key={employee._id}
                      className="md:w-full h-full flex-col flex justify-center items-center"
                    >
                      <p className="text-[10vw] md:text-[2vw] mb-[0.1vw]">
                        {employee.name.split(" ")[0]}
                      </p>
                      <Image
                        src={employee.avatar?.url || ""}
                        alt={`Avatar de ${employee.name}`}
                        fill
                        className="rounded-[50%] object-cover aspect-square !relative !w-[80%] !h-auto"
                      />
                      <p className="mt-[3vw] md:mt-[0.7vw] text-[5.5vw] md:text-[1vw] border-1 px-[3vw] md:px-[0.8vw] md:py-[0.15vw] border-[#ffffff5b] rounded-[10vw] md:rounded-[2vw]">
                        {employee.patients.length}
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
          <div className="w-full h-1/2 flex flex-col md:flex-row gap-[2vw] relative">
            <div className="w-full md:w-[30%] h-full bg-[#43738a1a] rounded-[2vw] flex flex-col items-center justify-center relative p-[1.2vw] border-[1] border-[#69696936]">
              <div className="w-full relative flex pb-[0.8vw] border-b-[1] border-[#66666623]">
                <div className="flex items-center justify-center gap-[0.4vw]">
                  <div className="ml-[1vw] md:ml-0 aspect-square w-[1vw] bg-[#ffffff]  rounded-full "></div>
                  <p className="text-[#ebebeb] mb-[2vw] mt-[2vw] ml-[2vw] md:mb-0 md:mt-0 md:ml-0 md:text-[0.75vw] tracking-wide">
                    Profissionais
                  </p>
                </div>
              </div>
              <div className=" flex justify-center items-center flex-col w-full h-auto flex-1">
                <p className="text-[5vw] md:text-[0.9vw] mt-[4vw] md:mt-0 tracking-wide ">
                  Ativos
                </p>
                <p className="text-[40vw] md:text-[8vw] pb-[14vw] md:pb-0 leading-[0.9] font-bold">
                  {ativos}
                </p>
              </div>
            </div>
            <div className="w-full md:w-[50%] h-full bg-[#ffffff0a] rounded-[2vw] border-[1]">
              <GraficoDeContratacoes />
            </div>
            <div className="md:w-[20%] h-full bg-gradient-to-br from-[#2e2e2e] via-[#0f0f0f] to-[#1c1c1c] rounded-[2vw] flex border-[1] flex-col p-[1.2vw] border-[#242424]">
              <div className="w-full relative flex pb-[0.8vw] border-b-[1] border-[#66666623]">
                <div className="flex items-center justify-center gap-[0.4vw]">
                  <div className="aspect-square w-[1vw] bg-[#ffffff]  rounded-full "></div>
                  <p className="text-[#ebebeb] mb-[2vw] mt-[2vw] ml-[2vw] md:mb-0 md:mt-0 md:ml-0 md:text-[0.75vw] tracking-wide">
                    Profissionais
                  </p>
                </div>
              </div>
              <div className=" flex justify-center items-center flex-col w-full h-auto flex-1">
                <p className="text-[5vw] md:text-[0.9vw] mt-[4vw] md:mt-0 tracking-wide ">
                  Inativos
                </p>
                <p className="text-[40vw] md:text-[8vw] pb-[14vw] md:pb-0 leading-[0.9] font-bold text-[#ffc2c2]">
                  {inativos}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
