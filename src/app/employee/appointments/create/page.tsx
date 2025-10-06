"use client";
import { FormEvent, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import RefreshComponent from "../../components/refresh";
import ErrorComponent from "../components/errorComponent";
import SetPatientComponent from "../../components/setPatient";
import useSetPatient from "../../components/useStateSetPatients";
interface Error {
  error: string;
  message: string;
}

export default function CreateAppointments() {
  const [limitDate, setLimitDate] = useState<string | null>(null);
  const [limitTime, setLimitTime] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [sucess, setSucess] = useState<boolean>(false);
  const dia = 86400000;

  const timeSelected = useRef<HTMLInputElement | null>(null);
  const dateSelected = useRef<HTMLInputElement | null>(null);
  const { patients, setPatients, patientSelected, setPatientSelected } =
    useSetPatient();

  interface ErrorResponse {
    error: string;
    message?: string;
  }

  useEffect(() => {
    const dateLimit = new Date(new Date().getTime() - dia)
      .toISOString()
      .split("T")[0];
    const timeOfNow = new Date().toISOString().split("T")[1].slice(0, 5);
    setLimitDate(dateLimit);
    setLimitTime(timeOfNow);
  }, []);

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
            <SetPatientComponent
              title="Para começar, selecione um paciente que você deseja para
                    criar um agendamento. Toque para selecionar."
              patientSelected={patientSelected}
              setPatientSelected={setPatientSelected}
              patients={patients}
              setPatients={setPatients}
            />
            <form
              onSubmit={(e) => {
                handleSubmit(e);
              }}
            >
              <div className="w-full px-2 py-2 bg-gradient-to-r from-[#000000] to-[#252525a1] mt-2 rounded-[30px] border-1 border-[#333]">
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
