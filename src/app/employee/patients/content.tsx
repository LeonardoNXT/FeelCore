"use client";

import { useEffect, useState } from "react";
import PdfOnBoxInsideConteiner from "../appointments/components/PDFonBoxInsideConteiner";
import BoxOfInitialPagesComponent from "../appointments/components/boxOfInitialComponents";
import SectionConteinerPadronized from "../components/sectionAndComponentPadronized";
import {
  Cake,
  Mail,
  Search,
  User,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import { getInitials } from "../appointments/components/getInitials";
import { Customer } from "@/stores/userStore";
import { motion } from "framer-motion";
import CardPadronizedComponent from "../appointments/components/cardPadronized";
import MoveUpRightAndLoadingComponent from "./components/moveUpRight";

type PatientsReceive = {
  message: string;
  total: number;
  customers: Customer[];
};

export default function PatientContent() {
  const [patientsReceive, setPatientsReceive] =
    useState<PatientsReceive | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/customers/all", {
          method: "POST",
          credentials: "include",
        });
        const data = await response.json();
        setPatientsReceive(data);
        console.log(data);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    console.log("[PATIENT RECEIVE]", patientsReceive);
  }, [patientsReceive]);

  const filteredPatients =
    patientsReceive?.customers.filter(
      (patient) =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.email.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPatients = filteredPatients.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <SectionConteinerPadronized>
      {patientsReceive && (
        <CardPadronizedComponent
          arrayOfItems={patientsReceive.customers}
          title="Seus Pacientes"
          to="#eb7a34"
        />
      )}
      {patientsReceive && patientsReceive.total > 0 && (
        <PdfOnBoxInsideConteiner
          color="#eb7a34"
          title="PDF - Pacientes"
          summary="Aqui você encontra as principais informações relacionadas ao paciente, como dados cadastrais, documentos anexados, observações clínicas e outras informações relevantes. Utilize esta seção para consultar ou atualizar os registros conforme necessário."
          pdfEndpoint="patients/"
        />
      )}
      {patientsReceive && patientsReceive.total > 0 && (
        <BoxOfInitialPagesComponent
          title="Lista de Pacientes"
          summary="Aqui você encontra a relação completa de pacientes cadastrados no sistema. Essa lista permite visualizar dados básicos de cada paciente, facilitando o acesso rápido às informações e o gerenciamento dos registros."
          icon={false}
        >
          <div className="mt-10 relative flex flex-col gap-5">
            <div className="relative w-[70%] md:w-1/2">
              <input
                type="text"
                placeholder="Procurar :"
                className="w-full bg-[#111] border-1 rounded-full px-4 py-2"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute top-1/2 translate-y-[-50%] right-3 text-[#444]" />
            </div>
            <div
              className={`h-100 relative bg-gradient-to-tr ${
                paginatedPatients.length === 1 &&
                "flex justify-center items-center w-full"
              } from-[#fff] to-[#eb7a34] rounded-3xl flex flex-col py-10 px-5 md:px-10 gap-2 overflow-y-scroll`}
            >
              {paginatedPatients.map((patient) => (
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  whileHover={{
                    scale: 1.01,
                    transition: {
                      type: "spring",
                      ease: "circInOut",
                    },
                  }}
                  transition={{
                    type: "spring",
                    ease: "circInOut",
                    duration: 0.3,
                  }}
                  layout
                  key={patient._id}
                  className="p-2 bg-gradient-to-tr w-full from-[#fff] rounded-4xl shadow-md flex flex-col gap-2"
                >
                  <div className="w-full flex justify-between items-stretch">
                    <div className="flex gap-2 md:gap-4 items-center px-2 pr-4 md:pr-10 rounded-4xl py-2 bg-[#ffffff6c] border-1 border-[#e7e7e7] w-max">
                      {patient.avatar ? (
                        <Image
                          src={patient.avatar.url}
                          width={50}
                          height={50}
                          alt="foto do paciente"
                          className="rounded-full w-10 md:w-[50px]"
                        />
                      ) : (
                        <div className="h-10 md:h-[50px] text-[12px] aspect-square rounded-full border-[#ffc6ac] flex justify-center items-center bg-[#111] md:text-[18px] border-4 md:font-bold">
                          {getInitials(patient.name)}
                        </div>
                      )}
                      <p className="text-[#333] md:text-[25px]">
                        {patient.name.split(" ")[0] +
                          " " +
                          patient.name.split(" ")[
                            patient.name.split(" ").length - 1
                          ]}
                      </p>
                    </div>
                    <div className="h-full aspect-square bg-gradient-to-tr from-[#fff] shadow-inner shadow-[#333333a4] rounded-full px-4 py-2">
                      <MoveUpRightAndLoadingComponent id={patient._id} />
                    </div>
                  </div>
                  {patient.mood_diary.length !== 0 && (
                    <div className="w-full px-2 py-2 bg-[#ffffff42] rounded-3xl relative overflow-hidden">
                      <div className="flex gap-2 overflow-x-hidden">
                        {patient.mood_diary.slice(0, 8).map((mood, i) => (
                          <div
                            className="text-[#555] px-4 py-1 rounded-full border-1 border-[#33333321] bg-[#ffffff0c] "
                            key={i}
                          >
                            {mood.emotion}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="w-full bg-gradient-to-tr from-[#fff] rounded-3xl px-4 py-4">
                    <div className="flex flex-col gap-4 text-[15px]">
                      <div className="flex gap-2 text-[#646464]">
                        <User className="w-6" />
                        <p>{patient.name}</p>
                      </div>
                      <div className="flex gap-2 text-[#646464]">
                        <Mail className="w-6" />
                        <p>{patient.email}</p>
                      </div>
                      <div className="flex gap-2 text-[#646464]">
                        <Cake className="w-6" />
                        <p>
                          {new Date(patient.birth_date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            {totalPages > 1 && (
              <div className=" fixed left-1/2 translate-x-[-50%] bottom-30 md:bottom-45 flex items-center justify-center gap-4">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                  className="p-2 rounded-2xl bg-[#fff] disabled:opacity-50 text-[#333] disabled:cursor-not-allowed hover:bg-[#ffefd7] transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="px-4 py-2 bg-[#fff] text-[#646464] border-1 border-[#eee] rounded-2xl">
                  {currentPage} / {totalPages}
                </div>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-2xl bg-[#fff] text-[#333] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#ffefd7] transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </BoxOfInitialPagesComponent>
      )}
    </SectionConteinerPadronized>
  );
}
