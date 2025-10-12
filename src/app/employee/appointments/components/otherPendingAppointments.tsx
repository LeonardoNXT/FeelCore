import { Appointments } from "@/stores/appointment";
import { getTime } from "./getTime";
import { MoveUpRight, Search, Users } from "lucide-react";
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import { AnimatePresence, motion, spring } from "framer-motion";

interface Props {
  otherAppointments: Appointments[];
  setAppointmentSeleted: Dispatch<SetStateAction<Appointments | null>>;
}

export default function OtherPendingAppointmentsComponent({
  otherAppointments,
  setAppointmentSeleted,
}: Props) {
  const [research, setResearch] = useState<Appointments[]>(otherAppointments);

  const handleResearch = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length === 0) return setResearch(otherAppointments);

    const filteredOtherAppointments = otherAppointments.filter(
      (appointments) =>
        new Date(appointments.startTime)
          .toLocaleDateString()
          .includes(e.target.value) ||
        getTime(appointments.startTime).includes(e.target.value) ||
        getTime(appointments.endTime).includes(e.target.value) ||
        appointments.duration.toString().includes(e.target.value)
    );
    setResearch(filteredOtherAppointments);
  };

  return (
    <AnimatePresence>
      <motion.div
        layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full px-1 py-1 h-auto bg-gradient-to-r from-[#e5eaeb] to-[#ffffff6b] mt-2 rounded-[30px] overflow-hidden"
      >
        <div className="flex justify-between items-center px-3 py-3">
          <p className="text-[16px] text-[#333333d0] py-1 px-2 bg-[#dbdbdb7e] rounded-2xl shadow-inner shadow-[#a0a0a0]">
            Outros agendamentos pendentes
          </p>
          <div className=" bg-[#b4b4b4b9] text-[#2c2c2c] border-1 px-2 py-2 rounded-full">
            <Users />
          </div>
        </div>
        <div>
          <div className="px-4 text-[#757575] my -10">
            Aqui você pode ver e gerênciar seus agendamentos pendentes.
          </div>
        </div>
        <div className="px-2 my-2 mt-6 relative w-[70%] md:w-1/2 ">
          <motion.input
            whileTap={{
              scale: 1.1,
              background: "#555",
              transition: { type: spring, duration: 0.3, ease: "circInOut" },
            }}
            type="text"
            placeholder="Pesquisar por data:"
            className="px-4 py-2 border-1 border-[#cecece] bg-[#333] w-full rounded-full outline-2 hover:bg-[#444] focus:outline-blue-400 duration-300 text-[#eee]"
            onChange={(e) => handleResearch(e)}
          />
          <Search className="absolute right-2 top-1/2 translate-[-50%] text-[#bbb] cursor-pointer" />
        </div>
        <AnimatePresence>
          <motion.div layout className="px-1 py-1">
            <motion.div
              layout
              className="py-2 pb-4 bg-gradient-to-br from-[#3b3b3b] to-[#111111] rounded-3xl"
            >
              <div
                className={`w-full px-4 py-4 mt-4 overflow-x-scroll flex ${
                  research.length <= 1 && "justify-center md:py-10"
                } gap-4 relative conteiner-scrollbar`}
              >
                {research.length > 0 ? (
                  research.map((appointmentUser) => (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      transition={{
                        duration: 0.3,
                        type: "spring",
                        ease: "circInOut",
                      }}
                      layout
                      className="px-2 py-2 rounded-3xl bg-gradient-to-b from-[#fff] to-[#ab9373] shadow-[#141414] shadow-md"
                      key={appointmentUser._id}
                    >
                      <div className="w-[320px] md:w-[450px] flex justify-end text-center"></div>
                      <div className="w-full flex items-center flex-col font-bold py-3 md:py-7">
                        <div className="py-5 pt-15">
                          <p className="text-[#6e6e6e] text-center">
                            {new Date(
                              appointmentUser.startTime
                            ).toLocaleDateString()}
                          </p>
                          <div className="flex gap-2 text-[#333] px-5 text-3xl md:text-5xl">
                            <p>{getTime(appointmentUser.startTime)}</p>
                            <p>X</p>
                            <p>{getTime(appointmentUser.endTime)}</p>
                          </div>
                          <p className="text-[#6e6e6e] text-center">
                            {appointmentUser.duration} minutos
                          </p>
                        </div>
                      </div>
                      <div className="w-full flex justify-end">
                        <div
                          className="w-[40px] aspect-square rounded-full bg-[#ffffff21] grid place-items-center cursor-pointer shadow-[#444444] shadow-inner"
                          onClick={() => setAppointmentSeleted(appointmentUser)}
                        >
                          <MoveUpRight className="text-[#333] duration-300 hover:rotate-[45deg]" />
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    className="my-25 text-2xl text-center text-[#bbb]"
                  >
                    Não foi encontrado agendamento algum.
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}
