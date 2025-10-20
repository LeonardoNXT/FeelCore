import { getInitials } from "@/app/employee/appointments/components/getInitials";
import { Customer } from "@/stores/userStore";
import { Cake, Mail } from "lucide-react";
import Image from "next/image";
import AnamneseComponent from "./anamneseComponent";
import { Dispatch, SetStateAction } from "react";
import { ErrorAPI } from "@/app/employee/appointments/hooks/useSetError";

export default function PatientMainContentComponent({
  patient,
  setError,
  setPatient,
}: {
  patient: Customer;
  setPatient: Dispatch<SetStateAction<Customer | null>>;
  setError: Dispatch<SetStateAction<ErrorAPI | null>>;
}) {
  return (
    <div className="w-full grid md:grid-cols-2 grid-rows-[2fr, 1fr] gap-2">
      <div className="w-full h-full px-2 py-2 bg-gradient-to-tr from-[#ffffff93] to-[#d3b094] rounded-4xl border-4 border-[#e4d2bf] relative">
        <div className="flex gap-2 px-1 py-1 pr-4 border-1 border-[#f5f5f565] bg-[#ffffff3f] items-center rounded-full w-max absolute">
          {patient.avatar ? (
            <Image
              src={patient.avatar.url}
              width={30}
              height={30}
              alt="Imagem do paciente"
              className="w-auto aspect-square rounded-full"
            />
          ) : (
            <div className="w-[100px] aspect-square border-4 border-[#e4d2bf] rounded-full flex justify-center items-center text-2xl text-[#646464]">
              {getInitials(patient.name)}
            </div>
          )}
          <p className="text-[#0303037e] text-[15px]">
            {patient.name.split(" ")[0] + " " + patient.name.split(" ")[1]}
          </p>
        </div>
        <div className="w-full h-50 flex justify-center items-center text-[#333] flex-col">
          <p>{patient.status}</p>
          <p className="text-4xl text-center">{patient.name}</p>
        </div>
      </div>
      <AnamneseComponent
        patient={patient}
        setError={setError}
        setPatient={setPatient}
      />
      <div className="w-full h-max bg-gradient-to-tr px-2 py-2 from-[#fff] to-[#d3b094] rounded-4xl border-4 border-[#e4d2bf]">
        <div className="px-3 py-1 bg-[#2220] border border-[#fcfcfc28] w-max rounded-full text-[#646464]">
          Informações gerais
        </div>
        <div className="flex flex-col gap-2 text-[#646464] px-4 py-4">
          <div className="flex gap-2">
            <Mail />
            <p>{patient.email}</p>
          </div>
          <div className="flex gap-2">
            <Cake />
            <p>{new Date(patient.birth_date).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
