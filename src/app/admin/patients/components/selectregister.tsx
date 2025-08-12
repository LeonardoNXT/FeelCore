"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Search, User } from "lucide-react";
import { motion } from "framer-motion";
import { useConsumerStore } from "@/stores/consumesStrore";

type Employee = {
  _id: string;
  name: string;
  avatar?: { url: string };
  status: string;
  patients?: [];
};

export default function CadastroSelect({
  backPage,
  onContinuar,
}: {
  backPage: () => void;
  onContinuar: () => void;
}) {
  const { consumer, setConsumer } = useConsumerStore();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // quantos por página

  useEffect(() => {
    window.scrollY = 0; // volta para o topo
    fetch("/api/employees/all", {
      method: "post",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        setEmployees(data.employees);
      });
  }, []);

  // Filtra pelo nome
  const filteredEmployees = employees.filter((employee) =>
    employee.name.toLowerCase().includes(search.toLowerCase())
  );

  // Calcula indices da paginação
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEmployees = filteredEmployees.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

  return (
    <div className="w-full p-4 overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h2 className="text-[#333] text-[50px] leading-[1] mt-10">
          Selecione um funcionário
        </h2>

        <p className="text-[#9e9e9e] leading-[1] mt-5">
          Selecione um dos funcionários para administrar e gerenciar o usuário.
        </p>
      </motion.div>

      {/* Campo de busca */}
      <div className="relative mt-6 w-full md:w-[25%]">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          placeholder="Pesquisar funcionário..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="border border-gray-300 rounded-3xl pl-10 pr-3 py-3 w-full text-[#333]"
        />
      </div>

      {/* Lista paginada */}
      <div className="mt-10">
        {paginatedEmployees
          .filter((employee) => employee.status === "Ativo")
          .map((employee) => (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              key={employee._id}
              className="border-1 border-[#d4d4d4a2] px-4 py-4 rounded-[20px] mt-5 flex flex-col duration-300 hover:bg-[#ecf1ff] cursor-pointer"
              onClick={() => {
                setConsumer({
                  ...consumer,
                  patient_of: employee._id,
                });
                onContinuar();
              }}
            >
              <div className="w-full flex justify-between items-center">
                {employee.avatar?.url ? (
                  <Image
                    src={employee.avatar.url}
                    alt={`Imagem de ${employee.name}`}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-12 h-12 bg-[#000] border-6 border-[#333] rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">
                      {employee.name.split(" ")[0][0] +
                        employee.name.split(" ")[
                          employee.name.split(" ").length - 1
                        ][0]}
                    </span>
                  </div>
                )}
                <div
                  className={`px-3 py-1 border-1 text-[15px] rounded-2xl ${
                    employee.status === "Ativo"
                      ? "bg-[#e4ffcb] text-[#50913a] border-[#c8e6a1]"
                      : "bg-[#ffcbcb] text-[#913a3a] border-[#e6a1a1]"
                  }`}
                >
                  {employee.status}
                </div>
              </div>

              <p className="text-[#414141] flex-[1] text-[40px] leading-[1] mt-5">
                {employee.name.split(" ")[0] +
                  " " +
                  employee.name.split(" ")[employee.name.split(" ").length - 1]}
              </p>
              <p className="text-[#9c9c9c] flex-[1] text-[18px]">
                {employee.name}
              </p>
              <div className="mt-4 flex">
                <User className="text-[#818181] w-[16px]" />
                <p className="text-[#818181]">
                  {employee.patients?.length || 0}
                </p>
              </div>
            </motion.div>
          ))}
      </div>

      {/* Controles de paginação */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Anterior
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 border rounded ${
                currentPage === i + 1 ? "bg-gray-300" : ""
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Próximo
          </button>
        </div>
      )}
      <button
        className="text-[#333] bg-[#ffffffc0] px-6 py-3 mt-3 rounded-2xl border-1 md:border-[#e7e7e7] duration-300 hover:bg-[#f1f1f1]"
        onClick={backPage}
      >
        Voltar
      </button>
    </div>
  );
}
