import Image from "next/image";
import { Dispatch, SetStateAction, useEffect } from "react";
import { motion } from "framer-motion";
import { Patient } from "./useStateSetPatients";

interface Props {
  patients: Patient[] | null;
  setPatients: Dispatch<SetStateAction<Patient[] | null>>;
  patientSelected: Patient | null;
  setPatientSelected: Dispatch<SetStateAction<Patient | null>>;
  title: string;
}
export default function SetPatientComponent({
  patients,
  setPatients,
  patientSelected,
  setPatientSelected,
  title,
}: Props) {
  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await fetch("/api/customers/all", {
          method: "POST",
          credentials: "include",
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData || "Ocorreu um erro");
        }
        const data = await response.json();
        setPatients(data.customers);
        console.log(data);
      } catch (err) {
        console.log(err);
      }
    };
    getUsers();
  }, [setPatients]);

  const activePatients = patients?.filter(
    (patient) => patient.status == "Ativo"
  );

  const [noSelectedPatient, selectedPatient] = [
    `bg-[#00] h-40`,
    `bg-[#dfd4c4] h-40 px-5 py-3`,
  ];

  return (
    <div className="w-full">
      <div className="w-full md:h-[600px] px-2 py-2 bg-gradient-to-r from-[#000000] to-[#252525a1] rounded-[30px] border-1 border-[#333] md:flex">
        <div className="md:w-1/2 flex flex-col relative">
          <div className="flex justify-between items-center px-2 py-2">
            <p className="text-[17px] text-[#646464] bg-[#1b1b1b] py-1 px-2  border-1 rounded-2xl md:absolute md:top-2">
              Selecione um paciente
            </p>
          </div>
          <div className="px-4 text-[#757575] mb-7 mt-2 text-[20px] md:flex-1 md:flex md:justify-center md:items-center md:mt-0 md:mb-0">
            {title}
          </div>
        </div>
        <div className="relative rounded-3xl overflow-hidden md:w-1/2">
          <div className="w-full h-50 md:h-full bg-gradient-to-br from-[#ddd9c4] to-[#e9e9e9] rounded-3xl border-1 border-[#7c7c7c6c] flex flex-col gap-2 px-4 py-6 overflow-y-scroll relative scroll-create">
            {activePatients && activePatients?.length > 0 ? (
              activePatients.map((paciente, i) => (
                <div
                  key={i}
                  className="w-full px-2 py-2 bg-gradient-to-r from-[#181818] relative to-[#4d4a43] border-4 shadow-2xl border-[#817a70] hover:border-[#ddfdff] duration-300 rounded-full flex  items-center cursor-pointer"
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
                    <div className="w-[50px] aspect-square bg-[#333] rounded-full border-4 border-[#ebebeb] grid place-items-center">
                      <p className="text-[#cfcfcf]">
                        {" "}
                        {paciente.name.split("")[0] +
                          paciente.name
                            .split(" ")
                            [paciente.name.split(" ").length - 1].split("")[0]}
                      </p>
                    </div>
                  )}
                  <p className=" text-[#fff8e462] ml-3">{paciente.name}</p>
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
      <div className="w-full px-2 py-2 bg-gradient-to-r from-[#000000] to-[#252525a1] mt-2 rounded-[30px] border-1 border-[#333]">
        <div className="flex justify-between items-center px-2 py-2">
          <p className="text-[17px] text-[#646464] bg-[#1b1b1b] py-1 px-2  border-1 rounded-2xl">
            Paciente selecionado
          </p>
        </div>
        <div className="px-4 text-[#757575] text-[20px] mb-7 mt-2">
          O paciente selecionado aparecerá logo após a seleção do usuário acima.
        </div>
        <div
          className={`w-full ${
            patientSelected ? selectedPatient : noSelectedPatient
          } rounded-3xl border-1 border-[#333] duration-500 flex justify-center items-center`}
        >
          {patientSelected ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="flex items-center gap-3 bg-[#2c2c2c] w-full px-2 py-2 rounded-full border-4 border-[#746859] shadow-2xl"
            >
              {patientSelected.avatar ? (
                <Image
                  src={patientSelected.avatar.url}
                  width={50}
                  height={50}
                  alt="foto do paciente"
                  className="rounded-full border-4 border-[#ebebeb]"
                />
              ) : (
                <div className="w-[50px] aspect-square bg-[#333] rounded-full border-4 border-[#ebebeb] grid place-items-center">
                  <p className="text-[#cfcfcf]">
                    {" "}
                    {patientSelected.name.split("")[0] +
                      patientSelected.name
                        .split(" ")
                        [patientSelected.name.split(" ").length - 1].split(
                          ""
                        )[0]}
                  </p>
                </div>
              )}
              <p className="text-[#a19e94]">{patientSelected.name}</p>
            </motion.div>
          ) : (
            <div className="w-full h-full text-center text-[#333] relative grid grid-cols-3 place-items-center overflow-hidden">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-[1px] h-full bg-[#313131]"></div>
              ))}
              <div className="w-full h-[1px] absolute bg-[#313131]"></div>
              <p className="absolute text-[20px] text-[#f76c6c]">
                Nenhum paciente selecionado
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
