"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

interface Patient {
  _id: string;
  name: string;
  avatar?: {
    url: string;
    public_id: string;
  };
  status: "Ativo" | "Inativo";
}

export default function CreateAppointments() {
  const [patients, setPatients] = useState<Patient[] | null>(null);
  const [patientSelected, setPatientSelected] = useState<Patient | null>(null);

  useEffect(() => {
    console.log(patientSelected);
  }, [patientSelected]);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await fetch("/api/customers/all", {
          method: "POST",
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Ocorreu um erro");
        }
        const data = await response.json();
        setPatients(data.customers);
        console.log(data);
      } catch (err) {
        console.log(err);
      }
    };
    getUsers();
  }, []);
  const activePatients = patients?.filter(
    (patient) => patient.status == "Ativo"
  );

  return (
    <div className="w-full min-h-screen bg-[url('/background.jpg')] bg-cover">
      <div className="w-full min-h-screen backdrop-blur-2xl">
        <div className="px-3 py-25">
          <div className="w-full px-2 py-2 bg-gradient-to-r from-[#000000] to-[#252525] rounded-[30px] border-1 border-[#333]">
            <div className="flex justify-between items-center px-2 py-2">
              <p className="text-[17px] text-[#646464] bg-[#1b1b1b] py-1 px-2  border-1 rounded-2xl">
                Selecione um paciente
              </p>
            </div>
            <div className="px-4 text-[#757575] mb-7 mt-2">
              Para começar, selecione um paciente que você deseja para iniciar
              um agendamento. Toque para selecionar.
            </div>
            <div className="relative rounded-3xl overflow-hidden">
              <div className="w-full h-50 bg-gradient-to-br from-[#ddd9c4] to-[#e9e9e9] rounded-3xl border-1 border-[#7c7c7c6c] flex flex-col gap-2 px-4 py-6 overflow-y-scroll relative">
                {activePatients && activePatients?.length > 0 ? (
                  activePatients.map((paciente, i) => (
                    <div
                      key={i}
                      className="w-full px-2 py-2 bg-gradient-to-r from-[#181818] relative to-[#4d4a43] border-1 shadow-2xl border-[#acacac] rounded-4xl flex justify-between items-center"
                      onClick={() => setPatientSelected(paciente)}
                    >
                      {paciente.avatar ? (
                        <Image
                          src={paciente.avatar.url}
                          width={50}
                          height={50}
                          alt="foto do paciente"
                          className="rounded-full border-4 border-[#ebebeb]"
                        />
                      ) : (
                        <div></div>
                      )}
                      <p className=" text-[#d6d6d6]">{paciente.name}</p>
                    </div>
                  ))
                ) : (
                  <p className="absolute top-1/2 left-1/2 translate-[-50%] text-nowrap text-[#333]">
                    Pacientes não encontrados
                  </p>
                )}
              </div>
              <div className="w-full h-10 absolute bottom-0 left-0 bg-gradient-to-b to-[#afada2] pointer-events-none"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
