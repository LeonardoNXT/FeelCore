"use client";

import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Users,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import Image from "next/image";

// Interface Employee conforme recebida da API
interface Employee {
  _id: string;
  name: string;
  email: string;
  birthday: string;
  rg: string;
  cpf: string;
  phone: string;
  address: string;
  remuneration: number;
  patients: Array<object>;
  employee_of: {
    _id: string;
    name: string;
  };
  hireDate: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  avatar?: {
    url: string;
    public_id: string;
  };
}

interface ContentDirectoryProps {
  data: {
    employees: Employee[];
    total: number;
  };
}

export default function ContentDirectory({ data }: ContentDirectoryProps) {
  const ITEMS_PER_PAGE = 9;
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Filtrar funcionários baseado na busca
  const filteredEmployees = data.employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.employee_of.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const start = (page - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  const paginatedEmployees = filteredEmployees.slice(start, end);

  const totalPages = Math.ceil(filteredEmployees.length / ITEMS_PER_PAGE);
  const hasNextPage = end < filteredEmployees.length;
  const hasPreviousPage = page > 1;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "ativo":
        return "bg-green-500";
      case "inativo":
        return "bg-red-500";
      default:
        return "bg-gray-400";
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case "ativo":
        return "Ativo";
      case "inativo":
        return "Inativo";
      default:
        return status;
    }
  };

  // Reset página quando buscar
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setPage(1);
  };

  return (
    <div className="relative border-1 border-[#ffffff] rounded-[2vw] h-full">
      {/* Background Image */}

      {/* Overlay and Content */}
      <div className=" w-full min-h-[98vh] flex flex-col h-auto bg-[#e2e2e298] backdrop-blur-[50px] rounded-[2vw] p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-10 mt-4">
            <div className="p-3 bg-[#e9e9e9] backdrop-blur-sm rounded-xl border border-[#52525213]">
              <Users className="w-6 h-6 text-[#333]" />
            </div>
            <div>
              <h2 className="text-[#333] text-4xl font-bold">
                Diretório de Funcionários
              </h2>
              <p className="text-[#adaaaa]">
                Total de funcionários: {filteredEmployees.length}
              </p>
            </div>
          </div>

          {/* Controles */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            {/* Busca */}
            <div className="relative flex-1  max-w-md w-full lg:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#333] w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar funcionários..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#ffffff0e] backdrop-blur-sm border-1 border-[#2b2a2a28] rounded-xl text-[#333] placeholder-[#5c5c5c] focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30 transition-all"
              />
            </div>

            {/* Seletor de visualização */}
            <div className="flex bg-[#ffffff0a] backdrop-blur-sm rounded-xl p-1 border border-white/20">
              <button
                onClick={() => setViewMode("list")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  viewMode === "list"
                    ? "bg-white text-black"
                    : "text-white/70 hover:text-white"
                }`}
              >
                Lista
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  viewMode === "grid"
                    ? "bg-white text-black"
                    : "text-white/70 hover:text-white"
                }`}
              >
                Grade
              </button>
            </div>
          </div>
        </div>

        {/* Lista de funcionários */}
        {paginatedEmployees.length === 0 ? (
          <div className="text-center py-16 w-auto flex-1 flex flex-col justify-center items-center">
            <Users className="w-16 h-16 text-white/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              Nenhum funcionário encontrado
            </h3>
            <p className="text-white/60">Tente ajustar os filtros de busca</p>
          </div>
        ) : (
          <div
            className={`${
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            }`}
          >
            {paginatedEmployees.map((employee) => (
              <div
                key={employee._id}
                className="w-full px-4 border-1 py-3 rounded-[30px] relative bg-[#e7e7e7e7] border-[#bdbdbd65]"
              >
                <div className="flex border-b-1 pb-4 pt-1 relative">
                  {employee.avatar ? (
                    <div className="relative">
                      <Image
                        src={employee.avatar.url}
                        width={60}
                        height={60}
                        className="rounded-full border-7 text-[#fff]"
                        alt=""
                      />
                      {employee.status && (
                        <div
                          className={`absolute bottom-1 right-1 w-5 h-5 rounded-full border-white/30 ${getStatusColor(
                            employee.status
                          )}`}
                          title={getStatusText(employee.status)}
                        ></div>
                      )}
                    </div>
                  ) : (
                    <div className="w-[60px] h-[60px] border-7 rounded-full flex justify-center items-center bg-[#000000] text-[#fff4d6] text-2xl font-bold ring-1 relative">
                      {employee.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .substring(0, 2)}
                      <div
                        className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white/30 ${getStatusColor(
                          employee.status
                        )}`}
                        title={getStatusText(employee.status)}
                      ></div>
                    </div>
                  )}
                  <div
                    className={` tracking-wide flex  items-center flex-1 lg:text-[0.9vw] ${
                      viewMode === "grid" ? " pl-5" : "justify-center"
                    }`}
                  >
                    <p className="text-[#333]">{employee.name}</p>
                  </div>
                </div>
                <div>
                  <div
                    className={`py-5 lg:justify-between w-full ${
                      viewMode == "grid" ? "" : "lg:flex px-[1vw]"
                    }`}
                  >
                    <div className="w-full lg:w-auto flex items-center gap-5">
                      <Mail className="w-4 h-4 text-[#333]" />
                      <p className="text-[#333]">{employee.email}</p>
                    </div>
                    <div className="w-full lg:w-auto flex items-center gap-5 py-3">
                      <Phone className="w-4 h-4 text-[#333]" />
                      <p className="text-[#333]">{employee.phone}</p>
                    </div>
                    <div className="w-full lg:w-auto flex items-center gap-5 ">
                      <MapPin className="w-4 h-4 text-[#333]" />
                      <p className="text-[#333]">{employee.address}</p>
                    </div>
                  </div>
                  <button className="w-full border-1 text-[#333] border-[#33333321] bg-[#dfdfdf11] rounded-3xl py-2 mb-2">
                    Ver Perfil
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-4">
            {/* Botão Anterior */}
            {hasPreviousPage && (
              <button
                onClick={() => setPage(page - 1)}
                className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-xl hover:bg-white/90 transition-colors font-medium"
              >
                <ChevronLeft className="w-5 h-5" />
                Anterior
              </button>
            )}

            {/* Indicador de página */}
            <div className="flex items-center gap-2">
              <span className="text-white/70 text-sm">
                Página {page} de {totalPages}
              </span>
            </div>

            {/* Botão Próxima */}
            {hasNextPage && (
              <button
                onClick={() => setPage(page + 1)}
                className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-xl hover:bg-white/90 transition-colors font-medium"
              >
                Próxima
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        {/* Navegação por páginas (opcional - para muitas páginas) */}
        {totalPages > 3 && (
          <div className="mt-4 flex items-center justify-center gap-2">
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (page <= 3) {
                pageNum = i + 1;
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = page - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                    page === pageNum
                      ? "bg-white text-black"
                      : "bg-white/10 border border-white/20 text-white hover:bg-white/20"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
