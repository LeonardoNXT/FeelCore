import { Calendar, MoveRight, Clock, Timer, CalendarDays } from "lucide-react";
import {
  ChangeEvent,
  Dispatch,
  FormEvent,
  SetStateAction,
  useState,
  useEffect,
  useRef,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { DayPicker } from "react-day-picker";
import TimePicker from "react-time-picker";
import "react-day-picker/dist/style.css";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";
import useGetHours from "../hooks/useGetHours";
import RefreshComponent from "../../components/refresh";
import CloseButtonComponent from "./closeButton";
import ErrorComponent from "./errorComponent";
import { ErrorAPI } from "../hooks/useSetError";
import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";
import { ptBR } from "date-fns/locale";

export default function PendingEditDateComponent({
  setHandleEditDate,
  date,
  id,
  Appointmentduration,
}: {
  setHandleEditDate: Dispatch<SetStateAction<boolean>>;
  date: string;
  id: string;
  Appointmentduration: number;
}) {
  const time = useGetHours(date);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(date));
  const [hours, setHours] = useState<string | null>(time || "09:00");
  const [duration, setDuration] = useState<number>(Appointmentduration);
  const [endTime, setEndTime] = useState<string>("");
  const [error, setError] = useState<ErrorAPI | null>(null);
  const [sucessChange, setSucessChange] = useState<boolean>(false);
  const [showCalendar, setShowCalendar] = useState<boolean>(false);

  const dateRef = useRef<HTMLDivElement>(null);
  const startTimeRef = useRef<HTMLDivElement>(null);
  const durationRef = useRef<HTMLInputElement>(null);
  const endTimeRef = useRef<HTMLDivElement>(null);

  // Calcular endTime quando hours ou duration mudarem
  useEffect(() => {
    if (hours && duration > 0) {
      const [h, m] = hours.split(":");
      const totalMinutes = parseInt(h) * 60 + parseInt(m) + duration;
      const endHours = Math.floor(totalMinutes / 60) % 24;
      const endMinutes = totalMinutes % 60;
      setEndTime(
        `${String(endHours).padStart(2, "0")}:${String(endMinutes).padStart(
          2,
          "0"
        )}`
      );
    }
  }, [hours, duration]);

  // Inicializar Tippy tooltips
  useEffect(() => {
    if (dateRef.current) {
      tippy(dateRef.current, {
        content: "Selecione a data do agendamento",
        placement: "top",
      });
    }
    if (startTimeRef.current) {
      tippy(startTimeRef.current, {
        content: "Horário de início do agendamento",
        placement: "top",
      });
    }
    if (durationRef.current) {
      tippy(durationRef.current, {
        content: "Duração do agendamento em minutos",
        placement: "top",
      });
    }
    if (endTimeRef.current) {
      tippy(endTimeRef.current, {
        content: "Horário final calculado automaticamente",
        placement: "top",
      });
    }
  }, []);

  const validateCalendarAndTime = (e: FormEvent) => {
    e.preventDefault();

    if (!selectedDate || !hours) {
      return setError({
        error: "Campos obrigatórios",
        message: "Selecione uma data e horário válidos.",
      });
    }

    const [h, m] = hours.split(":");
    const dateSelected = new Date(selectedDate);
    dateSelected.setHours(parseInt(h), parseInt(m), 0, 0);

    const dateNowInMiliSeconds = new Date().getTime();
    const dateSelectedInMiliSeconds = dateSelected.getTime();

    if (dateNowInMiliSeconds > dateSelectedInMiliSeconds) {
      return setError({
        error: "A data selecionada é passada",
        message: "Selecione uma data futura para remarcar o agendamento.",
      });
    }

    const calculatedEndTime = new Date(
      dateSelected.getTime() + duration * 60000
    );
    ChangeDateOfAppointment(dateSelected, calculatedEndTime);
  };

  const ChangeDateOfAppointment = async (startDate: Date, endDate: Date) => {
    console.log(startDate, endDate);
    try {
      const response = await fetch(`/api/appointments/availability/update`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          appointmentId: id,
          newStartTime: startDate,
          newDuration: duration,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        const err: ErrorAPI = data;
        throw new Error(err.message);
      }
      setSucessChange(true);
    } catch (err) {
      const error = err as Error;
      setError({
        error: "Houve um erro",
        message: error.message,
      });
      console.log(err);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="absolute top-0 left-0 w-full h-full grid place-items-center px-4 bg-gradient-to-br from-[#f0f0f0] to-[#af987d] z-20 overflow-y-auto py-8"
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

      <div className="z-20 max-w-[600px] w-full bg-[#ffffff60] backdrop-blur-[1000px] rounded-3xl shadow-2xl shadow-[#00000011]">
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
            {/* Calendário personalizado */}
            <div className="mb-4">
              <motion.div
                whileTap={{
                  scale: 1.05,
                  transition: { duration: 0.1, ease: "easeOut" },
                }}
                ref={dateRef}
                className="text-[#333] px-4 py-3 rounded-2xl shadow-[#818181] shadow-inner cursor-pointer hover:bg-[#ffffff5c] duration-100 flex items-center justify-between"
                onClick={() => setShowCalendar(!showCalendar)}
              >
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-5 h-5 text-[#666]" />
                  <span className="text-[15px]">
                    {formatDate(selectedDate)}
                  </span>
                </div>
              </motion.div>

              <AnimatePresence>
                {showCalendar && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 400 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{
                      duration: 0.6,
                      ease: "easeInOut",
                      delay: 0.1,
                    }}
                    layout
                    className="flex justify-center items-center overflow-hidden"
                  >
                    <motion.div
                      initial={{ opacity: 0, scale: 0.75 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.75 }}
                      whileTap={{
                        scale: 1.05,
                        rotateZ: "5deg",
                        transition: { duration: 0.1, ease: "easeOut" },
                      }}
                      transition={{
                        duration: 0.6,
                        ease: "easeInOut",
                        delay: 0.1,
                      }}
                      className="bg-gradient-to-tr from-[#fff] to-[#c9bcabfa] w-full md:w-max rounded-2xl border-1 border-[#c2c2c2] p-4"
                    >
                      <DayPicker
                        mode="single"
                        locale={ptBR}
                        selected={selectedDate}
                        onSelect={(date) => {
                          if (date) {
                            setSelectedDate(date);
                            setShowCalendar(false);
                          }
                        }}
                        disabled={{ before: new Date() }}
                        className="rdp-custom"
                      />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex gap-2 flex-wrap">
              {/* TimePicker para horário inicial */}
              <div ref={startTimeRef} className="relative">
                <TimePicker
                  onChange={(value) => setHours(value as string)}
                  value={hours}
                  format="HH:mm"
                  disableClock
                  clearIcon={null}
                  className="time-picker-custom"
                />
              </div>

              {/* Input de duração */}
              <div className="relative">
                <input
                  ref={durationRef}
                  type="text"
                  inputMode="numeric"
                  value={duration}
                  placeholder="Duração"
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    const value = e.target.value.replace(/\D/g, "");
                    if (
                      value === "" ||
                      (Number(value) >= 1 && Number(value) <= 1440)
                    ) {
                      setDuration(value === "" ? 0 : Number(value));
                    }
                  }}
                  className="text-[#333] px-3 py-2 pr-8 rounded-full focus:outline-2 focus:outline-[#555] shadow-[#818181] shadow-inner text-[15px] cursor-pointer hover:bg-[#ffffff5c] duration-100 w-[110px]"
                  required
                />
                <Timer className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666] pointer-events-none" />
              </div>

              {/* Horário final (readonly) */}
              {endTime && (
                <div ref={endTimeRef} className="relative">
                  <div className="text-[#333] px-6 py-2 rounded-full shadow-[#818181] shadow-inner text-[15px] bg-[#ffffff3c] flex items-center gap-2 hover:cursor-not-allowed">
                    <span>{endTime}</span>
                    <Clock className="w-4 h-4 text-[#666]" />
                  </div>
                </div>
              )}
            </div>

            <div className="w-full flex justify-end">
              <motion.button
                type="submit"
                whileTap={{
                  scale: 2,
                  transition: { duration: 0.1, ease: "circIn" },
                }}
                className="px-3 py-2 mt-4 md:mt-2 bg-[#e4e4e481] shadow-inner cursor-pointer shadow-[#4444446b] rounded-full text-[#444] flex gap-2 items-center justify-center hover:bg-[#f1edc1] duration-300"
              >
                <p>Alterar</p>
                <MoveRight className="w-[20px]" />
              </motion.button>
            </div>
          </form>
        </div>
      </div>

      {/* Estilos customizados inline sem style-jsx */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
      .rdp-custom {
        --rdp-cell-size: 40px;
        --rdp-accent-color: #af987d;
        --rdp-background-color: #f0f0f0;
        font-family: inherit;
        width: 100%;
          --rdp-day_button-width: 80%;
          --rdp-day_button-height: 80%;
        font-size: 14px;

        color: #222; /* Texto preto padrão */
      }

      @media (min-width: 1024px) {
        .rdp-custom {
          --rdp-cell-size: 48px;
          --rdp-accent-color: #8c6e4a;
          --rdp-day_button-width: 100%;
          --rdp-day_button-height: 100%;
          width: max-content;
        }
      }

      .rdp-custom .rdp-day {
        color: #222; /* Preto nos dias normais */
      }

      .rdp-custom .rdp-day_disabled {
        color: #aaa; /* Cinza para dias desativados */
      }

      .rdp-custom .rdp-day_selected {
        background-color: #af987d;
        color: white;
        font-weight: 600;
      }

      .rdp-custom .rdp-day:hover:not(.rdp-day_disabled):not(.rdp-day_selected),
      .rdp-custom .rdp-button:hover:not([disabled]):not(.rdp-day_selected) {
        background-color: #f0f0f0;
        border-radius: 50%;
        transition: 0.3s all;
        color: #000; /* Preto no hover */
      }

      .time-picker-custom .react-time-picker__wrapper {
        border: none;
        background: rgba(129, 129, 129, 0.1);
        border-radius: 9999px;
        padding: 8px 12px;
        box-shadow: inset 0 2px 4px 0 rgba(129, 129, 129, 0.5);
        transition: all 0.1s;
      }

      .rdp-months {
        max-width: 100%;
      }

      .time-picker-custom .react-time-picker__wrapper:hover {
        background: rgba(255, 255, 255, 0.36);
      }

      .time-picker-custom .react-time-picker__inputGroup {
        font-size: 15px;
        color: #222; /* Preto no input */
      }

      .time-picker-custom .react-time-picker__button {
        display: none;
      }

      .time-picker-custom input {
        color: #222;
      }

      .time-picker-custom input::placeholder {
        color: #777; /* Cinza nos placeholders */
      }

      .time-picker-custom input:focus {
        outline: 2px solid #555;
        border-radius: 4px;
      }
    `,
        }}
      />
    </motion.div>
  );
}
