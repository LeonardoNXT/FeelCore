"use client";
import Image from "next/image";
import { FormEvent, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import RefreshComponent from "../../components/refresh";
import ErrorComponent from "../components/errorComponent";

interface Patient {
  _id: string;
  name: string;
  avatar?: {
    url: string;
    public_id: string;
  };
  status: "Ativo" | "Inativo";
}

interface Error {
  error: string;
  message: string;
}

export default function CreateAppointments() {
  const [patients, setPatients] = useState<Patient[] | null>(null);
  const [patientSelected, setPatientSelected] = useState<Patient | null>(null);
  const [limitDate, setLimitDate] = useState<string | null>(null);
  const [limitTime, setLimitTime] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [sucess, setSucess] = useState<boolean>(false);
  const dia = 86400000;

  const timeSelected = useRef<HTMLInputElement | null>(null);
  const dateSelected = useRef<HTMLInputElement | null>(null);

  const [noSelectedPatient, selectedPatient] = [
    `bg-[#dda5a5] h-20`,
    `bg-[#dfd4c4] h-40`,
  ];

  interface ErrorResponse {
    error: string;
    message?: string;
  }

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

    const dateLimit = new Date(new Date().getTime() - dia)
      .toISOString()
      .split("T")[0];
    const timeOfNow = new Date().toISOString().split("T")[1].slice(0, 5);
    setLimitDate(dateLimit);
    setLimitTime(timeOfNow);
  }, []);
  const activePatients = patients?.filter(
    (patient) => patient.status == "Ativo"
  );

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // verifica se há algum paciente selecionado
    if (!patientSelected) {
      setError({
        error: "Selecione um paciente",
        message: "Para continuar será necessário adicionar um paciente.",
      });
      return;
    }
    const timeOfNow = new Date().getTime();
    console.log(timeOfNow);
    // verifica se a hora selecionada não antecede a hora atual.
    if (timeSelected.current && dateSelected.current) {
      const dateSelectedMiliSecond = new Date(
        dateSelected.current.value + "T" + timeSelected.current.value + ":00"
      ).getTime();

      console.log(dateSelectedMiliSecond);
      if (timeOfNow > dateSelectedMiliSecond) {
        console.log("passou por aqui");
        setError({
          error: "Selecione uma data valida",
          message:
            "A data selecionada antecede o tempo atual. Escolha uma data futura.",
        });
        return;
      }
      const patientId = patientSelected._id;
      const date = new Date(
        dateSelected.current.value + "T" + timeSelected.current.value + ":00"
      );

      CreateAppointmentAPI(patientId, date);
    }
  };

  const CreateAppointmentAPI = async (patientId: string, date: Date) => {
    const body = JSON.stringify({
      patientId: patientId,
      date: date,
    });
    console.log(body);

    try {
      const response = await fetch("/api/appointments/create", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: body,
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(
          errorData ||
            "Houve um erro no servidor.Por favor, tente novamente mais tarde."
        );
      }

      const data = await response.json();
      console.log(data);
      setSucess(true);
    } catch (err) {
      const error = err as Error;
      const errorResponse = JSON.parse(error.message) as ErrorResponse;
      setError({
        error: errorResponse.error || "Houve um erro inesperado",
        message: `${errorResponse.message}` || "Erro não especificado.",
      });
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 1 }}
      className="w-full min-h-screen bg-[url('/background.jpg')] bg-cover relative"
    >
      <AnimatePresence>
        {error && (
          <ErrorComponent
            errorContent={error}
            onClick={() => setError(null)}
            display="fixed"
            bg="bg-[#f0f0f0]"
          />
        )}
      </AnimatePresence>
      {sucess && (
        <AnimatePresence>
          <RefreshComponent
            title="Agendado com sucesso"
            route="/employee/appointments"
            display="fixed"
            zIndex="5"
          />
        </AnimatePresence>
      )}
      <div className="w-full min-h-screen backdrop-blur-2xl flex justify-center items-center relative">
        <div className="w-full max-w-[1000px]">
          <div className="px-3 pt-25 pb-10 md:pb-30 md:pt-[140px]">
            <div className="w-full md:h-[600px] px-2 py-2 bg-gradient-to-r from-[#000000] to-[#252525] rounded-[30px] border-1 border-[#333] md:flex">
              <div className="md:w-1/2 flex flex-col relative">
                <div className="flex justify-between items-center px-2 py-2">
                  <p className="text-[17px] text-[#646464] bg-[#1b1b1b] py-1 px-2  border-1 rounded-2xl md:absolute md:top-2">
                    Selecione um paciente
                  </p>
                </div>
                <div className="px-4 text-[#757575] mb-7 mt-2 text-[20px] md:flex-1 md:flex md:justify-center md:items-center md:mt-0 md:mb-0">
                  Para começar, selecione um paciente que você deseja para criar
                  um agendamento. Toque para selecionar.
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
                                  [paciente.name.split(" ").length - 1].split(
                                    ""
                                  )[0]}
                            </p>
                          </div>
                        )}
                        <p className=" text-[#fff8e462] ml-3">
                          {paciente.name}
                        </p>
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
            <div className="w-full px-2 py-2 bg-gradient-to-r from-[#000000] to-[#252525] mt-2 rounded-[30px] border-1 border-[#333]">
              <div className="flex justify-between items-center px-2 py-2">
                <p className="text-[17px] text-[#646464] bg-[#1b1b1b] py-1 px-2  border-1 rounded-2xl">
                  Paciente selecionado
                </p>
              </div>
              <div className="px-4 text-[#757575] mb-7 mt-2">
                O paciente selecionado aparecerá logo após a seleção do usuário
                acima.
              </div>
              <div
                className={`w-full px-5 py-3 ${
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
                              [
                                patientSelected.name.split(" ").length - 1
                              ].split("")[0]}
                        </p>
                      </div>
                    )}
                    <p className="text-[#a19e94]">{patientSelected.name}</p>
                  </motion.div>
                ) : (
                  <div className="w-full text-center text-[#333] relative">
                    <p>Nenhum paciente selecionado</p>
                  </div>
                )}
              </div>
            </div>
            <form
              onSubmit={(e) => {
                handleSubmit(e);
              }}
            >
              <div className="w-full px-2 py-2 bg-gradient-to-r from-[#000000] to-[#252525] mt-2 rounded-[30px] border-1 border-[#333]">
                <div className="flex justify-between items-center px-2 py-2">
                  <p className="text-[17px] text-[#646464] bg-[#1b1b1b] py-1 px-2  border-1 rounded-2xl">
                    Selecione a data
                  </p>
                </div>
                <div className="px-4 text-[#757575] mb-2 mt-2">
                  Selecione abaixo a data de agendamento do paciente.
                </div>
                <div className="w-full px-3 py-4 flex gap-2">
                  {limitDate && (
                    <input
                      type="date"
                      ref={dateSelected}
                      min={limitDate}
                      className="bg-[#e0e0e0] text-[#333] px-4 py-[10px] rounded-2xl text-[15px]"
                      required
                    />
                  )}
                  {limitTime && (
                    <input
                      type="time"
                      ref={timeSelected}
                      className="bg-[#c2ae8f] text-[#333] px-4 py-[10px] rounded-2xl text-[15px]"
                      required
                    />
                  )}
                </div>
              </div>
              <div className="w-full mt-4 flex justify-end">
                <button
                  type="submit"
                  className="bg-[#ceceb3] px-7 py-4 text-[#333] rounded-2xl text-[16px] w-full hover:bg-[#cbe9e6] duration-300 cursor-pointer"
                >
                  Agendar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
