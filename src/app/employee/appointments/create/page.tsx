"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import ErrorComponent from "../components/errorComponent";
import RefreshComponent from "../../components/refresh";

interface Error {
  error: string;
  message: string;
}

interface ErrorResponse {
  error: string;
  message?: string;
}

export default function CreateAppointments() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [duration, setDuration] = useState<string>("");
  const [error, setError] = useState<Error | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);

  const dateButtonRef = useRef<HTMLButtonElement | null>(null);
  const durationRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setTimeout(() => {
      if (dateButtonRef.current) {
        tippy(dateButtonRef.current, {
          content: "📅 Clique para selecionar a data",
          placement: "top",
          animation: "scale",
          theme: "light",
        });
      }
      if (durationRef.current) {
        tippy(durationRef.current, {
          content: "⏱️ Digite a duração em minutos (ex: 40)",
          placement: "top",
          animation: "scale",
          theme: "light",
        });
      }
    }, 100);
  }, []);

  const formatDate = (date: Date | undefined) => {
    if (!date) return "Selecionar data";
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      if (!selectedDate || !selectedTime || !duration) {
        setError({
          error: "Campos obrigatórios",
          message: "Por favor, preencha todos os campos antes de continuar.",
        });
        setIsSubmitting(false);
        return;
      }

      const durationNum = parseInt(duration);
      if (isNaN(durationNum) || durationNum <= 0) {
        setError({
          error: "Duração inválida",
          message: "A duração deve ser um número positivo em minutos.",
        });
        setIsSubmitting(false);
        return;
      }

      const [hours, minutes] = selectedTime.split(":");
      const selectedDateTime = new Date(selectedDate);
      selectedDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      const now = new Date();

      if (selectedDateTime <= now) {
        setError({
          error: "Selecione uma data válida",
          message:
            "A data selecionada antecede o tempo atual. Escolha uma data futura.",
        });
        setIsSubmitting(false);
        return;
      }

      const startTime = selectedDateTime.toISOString();

      const body = JSON.stringify({
        startTime,
        duration: durationNum,
      });

      const response = await fetch("/api/appointments/availability/create", {
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
            "Houve um erro no servidor. Por favor, tente novamente mais tarde."
        );
      }

      await response.json();
      setSuccess(true);
    } catch (err) {
      const error = err as Error;
      try {
        const errorResponse = JSON.parse(error.message) as ErrorResponse;
        setError({
          error: errorResponse.error || "Houve um erro inesperado",
          message: errorResponse.message || "Erro não especificado.",
        });
      } catch {
        setError({
          error: "Erro de conexão",
          message: error.message || "Não foi possível conectar ao servidor.",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full min-h-screen bg-[url('/background.jpg')] bg-cover relative"
    >
      <AnimatePresence>
        {error && (
          <ErrorComponent
            errorContent={error}
            onClick={() => setError(null)}
            display="fixed"
            bg="bg-[#fff]"
          />
        )}
      </AnimatePresence>
      {success && (
        <AnimatePresence>
          <RefreshComponent
            title="Agendado com sucesso"
            route="/employee/appointments"
            display="fixed"
          />
        </AnimatePresence>
      )}
      <div className="w-full min-h-screen backdrop-blur-2xl backdrop-sepia-50 flex justify-center items-center relative">
        <div className="w-full max-w-[1000px] px-4 flex justify-center flex-col items-center">
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-white/80 mb-2 text-center"
          >
            Gerencie sua agenda de forma simples e eficiente
          </motion.p>

          <motion.p
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.6, type: "spring" }}
            className="text-5xl md:text-7xl text-white mb-8 text-center font-bold"
          >
            Adicionar disponibilidade
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="w-full md:w-max px-2 py-2 md:border-1 md:border-[#dfdfdf46] md:rounded-full"
          >
            <div className="flex flex-col md:flex-row gap-2 items-center relative">
              <div className="relative w-full">
                <motion.button
                  ref={dateButtonRef}
                  onClick={() => setShowDatePicker(!showDatePicker)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="px-4 py-2 bg-[#000] text-[#eee] border-1 rounded-full outline-none focus:ring-2 focus:ring-white/50 min-w-[200px] text-left w-full"
                >
                  {formatDate(selectedDate)}
                </motion.button>

                <AnimatePresence>
                  {showDatePicker && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute  top-full mt-2 z-50"
                    >
                      <DayPicker
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => {
                          setSelectedDate(date);
                          setShowDatePicker(false);
                        }}
                        disabled={{ before: new Date() }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="time-picker-wrapper w-full"
              >
                <TimePicker
                  onChange={setSelectedTime}
                  value={selectedTime}
                  disableClock
                  clearIcon={null}
                  className="px-4 py-2 bg-[#000] text-[#eee] border-1 rounded-full outline-none focus:ring-2 focus:ring-white/50 w-full text-center"
                  format="HH:mm"
                />
              </motion.div>

              <motion.input
                ref={durationRef}
                type="number"
                min="1"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                whileFocus={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="px-4 py-2 border-1 rounded-full w-full md:w-[300px] outline-none focus:ring-2 focus:ring-gray-400"
                placeholder="Duração da sessão em minutos"
              />

              <motion.button
                onClick={handleSubmit}
                disabled={isSubmitting}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400 }}
                className={`px-4 py-2 border-1 rounded-full shadow-inner shadow-[#333] ${
                  isSubmitting
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-white/10"
                }`}
              >
                {isSubmitting ? (
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="inline-block"
                  >
                    ⏳
                  </motion.span>
                ) : (
                  "Registrar"
                )}
              </motion.button>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-white/60 text-center text-sm mt-4"
          >
            {selectedDate && selectedTime && duration && (
              <>
                Criando disponibilidade para{" "}
                <strong className="text-white">
                  {formatDate(selectedDate)}
                </strong>{" "}
                às <strong className="text-white">{selectedTime}</strong> com
                duração de{" "}
                <strong className="text-white">{duration} min</strong>
              </>
            )}
          </motion.p>
        </div>
      </div>

      <style jsx>{`
        :global(.time-picker-wrapper .react-time-picker) {
          background: #000;
          border-radius: 9999px;
          padding: 0.45rem 1rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.2s ease;
        }
        :global(.time-picker-wrapper .react-time-picker:hover) {
          border-color: rgba(255, 255, 255, 0.25);
          background: #111;
        }
        :global(.time-picker-wrapper .react-time-picker__wrapper) {
          border: none;
        }
        :global(.time-picker-wrapper .react-time-picker__inputGroup) {
          color: #f1f1f1;
          font-weight: 500;
        }
        :global(.time-picker-wrapper .react-time-picker__inputGroup__input) {
          color: #fff;
          background: transparent;
        }

        :global(.rdp) {
          ----rdp-selected-border: #fff;
          --rdp-accent-color: #fff !important;
          --rdp-background-color: #0a0a0a;
          background: linear-gradient(145deg, #0a0a0a, #0f0f0f);
          color: #f9f9f9;
          border-radius: 1rem;
          padding: 1.5rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);
          transition: all 0.3s ease;
        }

        :global(.rdp-months) {
          display: flex;
          justify-content: center;
        }

        :global(.rdp-month) {
          background: #000;
          padding: 10px;
          border-radius: 16px;
        }

        :global(.rdp-nav button) {
          color: #f9f9f9;
          border-radius: 9999px;
          transition: all 0.2s ease;
        }
        :global(.rdp-nav button:hover) {
          background: rgba(255, 255, 255, 0.1);
          transform: scale(1.05);
        }
        :global(.rdp-chevron) {
          fill: #fff;
        }

        :global(.rdp-caption_label) {
          color: #fff;
          font-weight: 600;
          text-transform: capitalize;
          letter-spacing: 0.5px;
        }

        :global(.rdp-head_cell) {
          color: rgba(255, 255, 255, 0.4);
          font-size: 0.85rem;
          font-weight: 500;
        }

        :global(.rdp-day) {
          color: #f2f2f2;
          border-radius: 8px;
          font-weight: 400;
          transition: all 0.15s ease-in-out;
        }
        :global(.rdp-day:hover) {
          background: rgba(255, 255, 255, 0.08) !important;
          color: #fff !important;
          transform: scale(1.05);
        }

        :global(.rdp-day_selected) {
          background: #fff !important;
          color: #000 !important;
          font-weight: 600;
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.4);
        }

        :global(.rdp-day_disabled) {
          color: #444 !important;
          opacity: 0.4;
          cursor: not-allowed;
          text-decoration: line-through;
        }

        :global(.rdp-day_today) {
          border: 1px solid rgba(255, 255, 255, 0.4);
          font-weight: 600;
          color: #fff;
        }

        :global(.rdp-day:focus-visible) {
          outline: 2px solid #fff;
          outline-offset: 2px;
        }
      `}</style>
    </motion.section>
  );
}
