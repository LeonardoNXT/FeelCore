import { AppointmentsScheduled } from "@/stores/appointment";
import BoxOfInitialPagesComponent from "./boxOfInitialComponents";
import { getTime } from "./getTime";
import { ChangeEvent, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search } from "lucide-react";

type Props = {
  title: string;
  summary: string;
  from?: string;
  to?: string;
  otherAppointmentsScheduled: AppointmentsScheduled[];
  children?: React.ReactNode;
};

export default function OtherScheduledAppointmentsPadronizedComponent({
  otherAppointmentsScheduled,
  children,
  title,
  summary,
  from = "#fff",
  to = "#a6be6e",
}: Props) {
  const [filteredOtherAppointments, setFilteredOtherAppointments] = useState<
    AppointmentsScheduled[]
  >(otherAppointmentsScheduled);

  const filterArray = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length < 1) {
      return setFilteredOtherAppointments(otherAppointmentsScheduled);
    }
    const inputValue = e.target.value;
    const filterArray = otherAppointmentsScheduled.filter(
      (appointment) =>
        appointment.intendedFor.name.includes(inputValue) ||
        new Date(appointment.startTime)
          .toLocaleDateString()
          .includes(inputValue) ||
        new Date(appointment.endTime)
          .toLocaleDateString()
          .includes(inputValue) ||
        getTime(appointment.startTime).includes(inputValue) ||
        getTime(appointment.endTime).includes(inputValue) ||
        appointment.duration.toString().includes(inputValue)
    );
    setFilteredOtherAppointments(filterArray);
  };

  return (
    <BoxOfInitialPagesComponent icon={false} title={title} summary={summary}>
      <div className="w-[70%] md:w-1/2 relative">
        <input
          type="text"
          className="mt-10 mb-4 px-4 w-full py-2 border-1 rounded-full outline-2 outline-[#111] bg-[#000000] duration-200 shadow-2xl focus:outline-blue-300 focus:shadow-blue-200"
          placeholder="Procure o agendamento por: data, nome, duração..."
          onChange={(e) => filterArray(e)}
        />
        <Search className="w-10 absolute top-1/2 right-2 bg-[#000000]" />
      </div>
      <div
        className="w-full py-4 rounded-3xl"
        style={{ background: `linear-gradient(45deg, ${from} 0%, ${to} 100%)` }}
      >
        <div
          className={` w-full h-70 flex ${
            filteredOtherAppointments.length === 1 &&
            "justify-center items-center"
          }  overflow-x-scroll gap-4 py-4 px-4`}
        >
          <AnimatePresence mode="wait">
            {filteredOtherAppointments.length > 0 ? (
              filteredOtherAppointments.map((otherAppointments, i) => (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  layout
                  className="min-w-[350px] md:min-w-[400px] rounded-3xl bg-gradient-to-tl from-[#ffffff] to-[#fcfcfc00] h-full flex flex-col justify-center items-center relative"
                  key={i}
                >
                  <div className="flex gap-2 text-[#646464]">
                    <p>{getTime(otherAppointments.startTime)}</p>
                    <p>-</p>
                    <p>{getTime(otherAppointments.endTime)}</p>
                    <p>|</p>
                    <p>
                      {new Date(
                        otherAppointments.startTime
                      ).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex"></div>
                  <div className="flex gap-2 text-3xl font-bold text-[#333]">
                    <p>{otherAppointments.intendedFor.name.split(" ")[0]}</p>
                    <p>—</p>
                    <p>{otherAppointments.duration} minutos</p>
                  </div>
                  <p className="text-[#646464]">
                    {otherAppointments.intendedFor.name}
                  </p>
                  {children}
                </motion.div>
              ))
            ) : (
              <motion.div
                key={"nosearch"}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="w-full h-full grid place-items-center text-[#333] text-2xl md:text-3xl"
              >
                Não foi encontrado agendamento algum
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </BoxOfInitialPagesComponent>
  );
}
