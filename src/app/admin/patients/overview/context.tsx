"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getInitials } from "@/app/employee/appointments/components/getInitials";

interface ApiError {
  message: string;
  status?: number;
}

interface Customer {
  _id: string;
  name: string;
  email: string;
  avatar?: {
    url: string;
  };
  status: "Ativo" | "Inativo";
  mood_entries: number;
  createdAt: string;
}

interface MoodContributor {
  _id: string;
  name: string;
  avatar?: {
    url: string;
  };
  mood_entries: number;
}

interface ProfessionalDistribution {
  professional_id: string;
  professional_name: string;
  professional_avatar?: {
    url: string;
  };
  count: number;
}

interface ApiResponse {
  total: number;
  ativos: number;
  inativos: number;
  recentes: Customer[];
  mood_stats: {
    total_entries: number;
    top_contributors: MoodContributor[];
  };
  cadastros_por_mes: Record<string, number>;
  distribuicao_por_profissional?: ProfessionalDistribution[];
  message: string;
}

export default function CustomersOverView() {
  const [stats, setStats] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getCustomersStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/customers/stats", {
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
      setStats(data);
      console.log("Estatísticas de clientes recebidas:", data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro desconhecido";
      setError(errorMessage);
      console.error("Erro ao buscar estatísticas:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCustomersStats();
  }, []);

  if (loading)
    return <div className="text-white p-8">Carregando estatísticas...</div>;
  if (error) return <div className="text-red-400 p-8">Erro: {error}</div>;
  if (!stats) return null;

  return (
    <div className="w-full">
      <motion.div
        className="w-full md:h-screen 2xl:h-[98vh] relative 2xl:rounded-tl-[2vw] 2xl:rounded-[2vw] overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Image
          src="/background8.jpg"
          alt="Background image"
          fill
          className="object-cover"
        />
        <div className="w-full h-full backdrop-blur-2xl relative p-[1vw] flex flex-col gap-[2vw]">
          <div className="absolute left-0 bottom-0 w-full h-[40%] bg-gradient-to-t from-[#0a0a0a] to-transparent"></div>

          {/* Linha Superior */}
          <div className="w-full flex-col md:flex-row h-1/2 flex gap-[2vw]">
            {/* Total de Clientes */}
            <div className="w-[100%] md:w-[40%] h-full bg-[#ffffff1a] rounded-[2vw] p-[1.2vw] flex justify-center items-center flex-col relative border-[1]">
              <div className="w-full relative flex pb-[0.8vw] border-b-[1] border-[#f7f7f74f]">
                <div className="flex items-center justify-center gap-[0.4vw]">
                  <div className="ml-[1vw] md:ml-0 aspect-square w-[1vw] bg-[#ffffff] rounded-full"></div>
                  <p className="text-[#ebebeb] mb-[2vw] mt-[2vw] ml-[2vw] md:mb-0 md:mt-0 md:ml-0 md:text-[0.75vw] tracking-wide">
                    Pacientes Totais
                  </p>
                </div>
              </div>
              <div className="w-full h-full flex flex-col justify-center items-center">
                <p className="text-[5vw] md:text-[0.9vw] mt-[4vw] md:mt-0 tracking-wide">
                  Pacientes
                </p>
                <div className="text-[40vw] md:text-[10vw] mb-[10vw] md:mb-0 font-bold leading-[0.9]">
                  {stats.total}
                </div>
              </div>
            </div>

            {/* Top 3 Diário de Humor */}
            <div className="w-[100%] md:w-[60%] h-full bg-[#ffffff1a] rounded-[2vw] border-[1] relative p-[1.2vw] flex flex-col">
              <div className="w-full relative flex pb-[0.8vw] border-b-[1] border-[#f7f7f74f]">
                <div className="flex items-center justify-center gap-[0.4vw]">
                  <div className="ml-[1vw] md:ml-0 aspect-square w-[1vw] bg-[#ffffff] rounded-full"></div>
                  <p className="text-[#ebebeb] mb-[2vw] mt-[2vw] ml-[2vw] md:mb-0 md:mt-0 md:ml-0 md:text-[0.75vw] tracking-wide">
                    Pacientes mais engajados no Diário de Humor
                  </p>
                </div>
              </div>
              <div
                className={`grid md:grid-cols-3 place-items-center gap-[2vw] px-[2vw] relative h-auto flex-1 ${
                  stats.mood_stats.top_contributors.length === 1
                    ? "md:grid-cols-1"
                    : ""
                }`}
              >
                {stats.mood_stats.top_contributors.length > 0 ? (
                  stats.mood_stats.top_contributors.map((customer) => (
                    <div
                      key={customer._id}
                      className="md:w-full h-full flex-col flex justify-center items-center"
                    >
                      <p className="text-[10vw] md:text-[2vw] mb-[0.1vw]">
                        {customer.name.split(" ")[0]}
                      </p>
                      {customer.avatar ? (
                        <Image
                          src={customer.avatar.url}
                          alt={`Avatar de ${customer.name}`}
                          fill
                          className="rounded-[50%] object-cover aspect-square !relative !w-[80%] !h-auto"
                        />
                      ) : (
                        <div className="w-[80%] aspect-square rounded-full bg-[#111] border-10 text-4xl flex justify-center items-center">
                          {getInitials(customer.name)}
                        </div>
                      )}
                      <p className="mt-[3vw] md:mt-[0.7vw] text-[5.5vw] md:text-[1vw] border-1 px-[3vw] md:px-[0.8vw] md:py-[0.15vw] border-[#ffffff5b] rounded-[10vw] md:rounded-[2vw]">
                        {customer.mood_entries} entradas
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="col-span-3 text-center text-[#ffffff7a] text-[4vw] md:text-[1vw]">
                    Nenhuma entrada no diário ainda
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Linha Inferior */}
          <div className="w-full h-1/2 flex flex-col md:flex-row gap-[2vw] relative">
            {/* Pacientes Ativos */}
            <div className="w-full md:w-[30%] h-full bg-[#43738a1a] rounded-[2vw] flex flex-col items-center justify-center relative p-[1.2vw] border-[1] border-[#69696936]">
              <div className="w-full relative flex pb-[0.8vw] border-b-[1] border-[#66666623]">
                <div className="flex items-center justify-center gap-[0.4vw]">
                  <div className="ml-[1vw] md:ml-0 aspect-square w-[1vw] bg-[#ffffff] rounded-full"></div>
                  <p className="text-[#ebebeb] mb-[2vw] mt-[2vw] ml-[2vw] md:mb-0 md:mt-0 md:ml-0 md:text-[0.75vw] tracking-wide">
                    Pacientes
                  </p>
                </div>
              </div>
              <div className="flex justify-center items-center flex-col w-full h-auto flex-1">
                <p className="text-[5vw] md:text-[0.9vw] mt-[4vw] md:mt-0 tracking-wide">
                  Ativos
                </p>
                <p className="text-[40vw] md:text-[8vw] pb-[14vw] md:pb-0 leading-[0.9] font-bold">
                  {stats.ativos}
                </p>
              </div>
            </div>

            {/* Total Diário de Humor */}
            <div className="w-full md:w-[50%] h-full bg-[#ffffff0a] rounded-[2vw] border-[1] p-[1.2vw] flex flex-col">
              <div className="w-full relative flex pb-[0.8vw] border-b-[1] border-[#66666623]">
                <div className="flex items-center justify-center gap-[0.4vw]">
                  <div className="aspect-square w-[1vw] bg-[#ffffff] rounded-full"></div>
                  <p className="text-[#ebebeb] mb-[2vw] mt-[2vw] ml-[2vw] md:mb-0 md:mt-0 md:ml-0 md:text-[0.75vw] tracking-wide">
                    Entradas no Diário de Humor
                  </p>
                </div>
              </div>
              <div className="flex justify-center items-center flex-col w-full h-auto flex-1">
                <p className="text-[5vw] md:text-[0.9vw] mt-[4vw] md:mt-0 tracking-wide">
                  Total de Registros
                </p>
                <p className="text-[40vw] md:text-[8vw] pb-[14vw] md:pb-0 leading-[0.9] font-bold text-[#a8d5ff]">
                  {stats.mood_stats.total_entries}
                </p>
              </div>
            </div>

            {/* Pacientes Inativos */}
            <div className="md:w-[20%] h-full bg-gradient-to-br from-[#2e2e2e05] via-[#0f0f0f34] to-[#1c1c1c00] rounded-[2vw] flex border-[1] flex-col p-[1.2vw] border-[#242424]">
              <div className="w-full relative flex pb-[0.8vw] border-b-[1] border-[#66666623]">
                <div className="flex items-center justify-center gap-[0.4vw]">
                  <div className="aspect-square w-[1vw] bg-[#ffffff] rounded-full"></div>
                  <p className="text-[#ebebeb] mb-[2vw] mt-[2vw] ml-[2vw] md:mb-0 md:mt-0 md:ml-0 md:text-[0.75vw] tracking-wide">
                    Pacientes
                  </p>
                </div>
              </div>
              <div className="flex justify-center items-center flex-col w-full h-auto flex-1">
                <p className="text-[5vw] md:text-[0.9vw] mt-[4vw] md:mt-0 tracking-wide">
                  Inativos
                </p>
                <p className="text-[40vw] md:text-[8vw] pb-[14vw] md:pb-0 leading-[0.9] font-bold text-[#ffc2c2]">
                  {stats.inativos}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
