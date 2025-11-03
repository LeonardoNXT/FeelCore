"use client";

import { useEffect, useState } from "react";
import { Search, User } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";

type Customer = {
  _id: string;
  name: string;
  avatar?: { url: string };
  status: string;
  birth_date: string;
  appointments?: [];
  patient_of?: {
    name: string;
  };
};

export default function PatientsList() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 5;

  useEffect(() => {
    window.scrollTo(0, 0);
    fetch("/api/customers/all", {
      method: "POST",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        setCustomers(data.customers || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Filtra pelo nome
  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(search.toLowerCase())
  );

  // Calcula indices da paginação
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCustomers = filteredCustomers.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);

  // Função para calcular idade
  const calculateAge = (birthDate: string) => {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }
    return age;
  };

  if (loading) {
    return (
      <div className="w-full p-4 flex justify-center items-center min-h-[400px]">
        <p className="text-[#9e9e9e] text-lg">Carregando pacientes...</p>
      </div>
    );
  }

  return (
    <div className="w-full p-4 overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h2 className="text-[#333] text-[50px] leading-[1] mt-10">Pacientes</h2>

        <p className="text-[#9e9e9e] leading-[1] mt-5">
          Selecione um paciente para visualizar informações detalhadas e
          gerenciar o tratamento.
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
          placeholder="Pesquisar paciente..."
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
        {paginatedCustomers.length === 0 ? (
          <p className="text-[#9e9e9e] text-center mt-10">
            Nenhum paciente encontrado.
          </p>
        ) : (
          paginatedCustomers.map((customer) => (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              key={customer._id}
              className="border-1 border-[#d4d4d4a2] px-4 py-4 rounded-[20px] mt-5 flex flex-col duration-300 hover:bg-[#ecf1ff] cursor-pointer"
              onClick={() => {
                router.push(`/admin/patients/directory/${customer._id}`);
              }}
            >
              <div className="w-full flex justify-between items-center">
                {customer.avatar?.url ? (
                  <Image
                    src={customer.avatar.url}
                    width={48}
                    height={48}
                    alt={`Imagem de ${customer.name}`}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 bg-[#000] border-6 border-[#333] rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">
                      {customer.name.split(" ")[0][0] +
                        customer.name.split(" ")[
                          customer.name.split(" ").length - 1
                        ][0]}
                    </span>
                  </div>
                )}
                <div
                  className={`px-3 py-1 border-1 text-[15px] rounded-2xl ${
                    customer.status === "Ativo"
                      ? "bg-[#e4ffcb] text-[#50913a] border-[#c8e6a1]"
                      : "bg-[#ffcbcb] text-[#913a3a] border-[#e6a1a1]"
                  }`}
                >
                  {customer.status}
                </div>
              </div>

              <p className="text-[#414141] flex-[1] text-[40px] leading-[1] mt-5">
                {customer.name.split(" ")[0] +
                  " " +
                  customer.name.split(" ")[customer.name.split(" ").length - 1]}
              </p>
              <p className="text-[#9c9c9c] flex-[1] text-[18px]">
                {customer.name}
              </p>

              <div className="mt-4 flex gap-4">
                {customer.birth_date && (
                  <div className="flex items-center gap-1">
                    <User className="text-[#818181] w-[16px]" />
                    <p className="text-[#818181]">
                      {calculateAge(customer.birth_date)} anos
                    </p>
                  </div>
                )}
              </div>

              {customer.patient_of?.name && (
                <p className="text-[#9c9c9c] text-[14px] mt-2">
                  Responsável: {customer.patient_of.name}
                </p>
              )}
            </motion.div>
          ))
        )}
      </div>

      {/* Controles de paginação */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6 text-[#333]">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50 cursor-pointer"
          >
            Anterior
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded border-1 border-[#eee] ${
                currentPage === i + 1 ? "bg-[#fff]" : "cursor-pointer"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50 cursor-pointer"
          >
            Próximo
          </button>
        </div>
      )}
    </div>
  );
}
