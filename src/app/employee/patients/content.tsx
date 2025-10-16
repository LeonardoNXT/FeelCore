"use client";

import { useEffect, useState } from "react";
import PdfOnBoxInsideConteiner from "../appointments/components/PDFonBoxInsideConteiner";
import BoxOfInitialPagesComponent from "../appointments/components/boxOfInitialComponents";
import SectionConteinerPadronized from "../components/sectionAndComponentPadronized";
import { Search } from "lucide-react";
import Image from "next/image";
import { getInitials } from "../appointments/components/getInitials";

type Patient = {
  _id: string;
  name: string;
  email: string;
  avatar?: {
    url: string;
    public_id: string;
  };
};

type PatientsReceive = {
  message: string;
  total: number;
  customers: Patient[];
};

export default function PatientContent() {
  const [patientsReceive, setPatientsReceive] =
    useState<PatientsReceive | null>(null);
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

  return (
    <SectionConteinerPadronized>
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
          <div className="mt-10 flex flex-col gap-5">
            <div className="relative w-[70%] md:w-1/2">
              <input
                type="text"
                placeholder="Procurar :"
                className="w-full bg-[#111] border-1 rounded-full px-4 py-2"
              />
              <Search className="absolute top-1/2 translate-y-[-50%] right-3 text-[#444]" />
            </div>
            <div className=" h-100 bg-gradient-to-tr from-[#fff] to-[#eb7a34] rounded-3xl flex flex-col py-10 px-5 md:px-10 gap-2 overflow-y-scroll">
              {patientsReceive.customers &&
                patientsReceive.customers.map((patient) => (
                  <div
                    key={patient._id}
                    className="p-2 bg-gradient-to-tr from-[#fff] rounded-full shadow-md"
                  >
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
                      <p className="font-semibold text-[#333]  md:text-[30px]">
                        {patient.name.split(" ")[0] +
                          " " +
                          patient.name.split(" ")[
                            patient.name.split(" ").length - 1
                          ]}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </BoxOfInitialPagesComponent>
      )}
    </SectionConteinerPadronized>
  );
}
