import { Calendar, MoveRight } from "lucide-react";
import {
  ChangeEvent,
  Dispatch,
  FormEvent,
  SetStateAction,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import useGetHours from "../hooks/useGetHours";
import RefreshComponent from "../../components/refresh";
import CloseButtonComponent from "./closeButton";
import ErrorComponent from "./errorComponent";

interface Error {
  error: string;
  message?: string;
}

export default function PendingEditDateComponent({
  setHandleEditDate,
  date,
  id,
}: {
  setHandleEditDate: Dispatch<SetStateAction<boolean>>;
  date: string;
  id: string;
}) {
  const time = useGetHours(date);
  const minCalendar = new Date(new Date().getTime() - 86400000)
    .toISOString()
    .split("T")[0];
  const calendarDate = new Date(date)
    .toLocaleString()
    .split(",")[0]
    .split("/")
    .reverse()
    .join("-");

  console.log(calendarDate);
  const [hours, setHours] = useState<string | null | undefined>(time);
  const [calendar, setCalendar] = useState<string | null | undefined>(
    calendarDate
  );
  const [error, setError] = useState<Error | null>(null);
  const [sucessChange, setSucessChange] = useState<boolean>(false);
  const validateCalendarAndTime = (e: FormEvent) => {
    e.preventDefault();
    const dateSelected = calendar + "T" + hours + ":00";
    const dateNowInMiliSeconds = new Date().getTime();
    const dateSelectedInMiliSeconds = new Date(dateSelected).getTime();

    if (dateNowInMiliSeconds > dateSelectedInMiliSeconds) {
      return setError({
        error: "A data selecionada é passada",
        message: "Selecione uma data futura para remarcar o agendamento.",
      });
    }
    ChangeDateOfAppointment(new Date(dateSelected));
  };
  const ChangeDateOfAppointment = async (date: Date) => {
    console.log(date);
    try {
      const response = await fetch(`/api/appointments/reschedule/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ date }),
      });
      const data = await response.json();
      if (!response.ok) {
        console.log(data);
        throw new Error("Houve um erro inesperado");
      }
      setSucessChange(true);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="absolute top-0 left-0 w-full h-full grid place-items-center px-4  bg-gradient-to-br from-[#f0f0f0] to-[#af987d] z-20"
    >
      <AnimatePresence>
        {sucessChange && (
          <RefreshComponent
            title="Reagendado com Sucesso"
            zIndex="30"
            display="absolute"
            route="/employee/appointments"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {error && (
          <ErrorComponent errorContent={error} onClick={() => setError(null)} />
        )}
      </AnimatePresence>

      <div className="z-20 max-w-[500px] w-full bg-[#ffffff60] backdrop-blur-[1000px] rounded-3xl shadow-2xl shadow-[#00000011]">
        <div className="pt-4 px-4">
          <div className="flex justify-between">
            <div className="px-4 py-2 shadow-inner rounded-full shadow-[#777777] text-[#444] flex gap-2">
              <p>Alterar data</p>
              <Calendar className="w-[20px] h-auto" />
            </div>
            <CloseButtonComponent onClick={() => setHandleEditDate(false)} />
          </div>
          <p className="py-7 text-[#333] px-2 text-2xl">
            Por aqui, você pode alterar a data e hora para o tempo que desejar.
            No entanto, lembre-se de coloca-la em um momento no futuro.
          </p>
          <form className="pb-3" onSubmit={(e) => validateCalendarAndTime(e)}>
            <div className="flex gap-2 ">
              {calendar && (
                <input
                  type="date"
                  value={calendar}
                  min={minCalendar}
                  className="text-[#333] px-3 focus:outline-2 focus:outline-[#555] py-2 rounded-full shadow-[#818181] shadow-inner cursor-pointer text-[15px] hover:bg-[#ffffff5c] duration-100"
                  required
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setCalendar(e.target.value)
                  }
                />
              )}
              {hours && (
                <input
                  type="time"
                  value={hours}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setHours(e.target.value)
                  }
                  className="text-[#333] px-3 py-2 rounded-full focus:outline-2 focus:outline-[#555] shadow-[#818181] shadow-inner text-[15px] cursor-pointer hover:bg-[#ffffff5c] duration-100"
                />
              )}
            </div>
            <div className="w-full flex justify-end">
              <button className="px-3 py-2 mt-4 md:mt-2 bg-[#e4e4e481] shadow-inner cursor-pointer shadow-[#4444446b] rounded-full text-[#444] flex gap-2 items-center justify-center hover:bg-[#f1edc1] duration-300">
                <p>Alterar</p>
                <MoveRight className="w-[20px]" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
}
