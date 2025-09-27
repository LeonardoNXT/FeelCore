import { useAppointmentsStore } from "@/stores/appointment";
import { Dispatch, SetStateAction, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, CalendarOff } from "lucide-react";
import useGetHours from "../hooks/useGetHours";
import PendingEditDateComponent from "./pedingEditDate";
import CloseButtonComponent from "./closeButton";
import PendingUncheckComponent from "./pedingUncheck";

export default function PendingComponent({
  id,
  setIdSelectedComponent,
  setHandlePedingSelected,
  handlePedingSelected,
}: {
  id: string;
  setIdSelectedComponent: Dispatch<SetStateAction<string | null>>;
  setHandlePedingSelected: Dispatch<SetStateAction<boolean>>;
  handlePedingSelected: boolean;
}) {
  const { appointments } = useAppointmentsStore();
  const appointment = appointments.filter(
    (appointment) => appointment._id == id
  );
  const [handleEditDate, setHandleEditDate] = useState<boolean>(false);
  const [handleUncheck, setHandleUncheck] = useState<boolean>(false);
  const dateTime = useGetHours(appointment[0].date || null);

  return (
    <AnimatePresence>
      {handlePedingSelected && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full h-screen fixed top-0 left-0 bg-gradient-to-br from-[#f0f0f0] to-[#af987d] z-5"
        >
          {appointment ? (
            <div className="w-full h-full">
              <AnimatePresence>
                {handleEditDate && (
                  <PendingEditDateComponent
                    setHandleEditDate={setHandleEditDate}
                    date={appointment[0].date}
                    id={appointment[0]._id}
                  />
                )}
              </AnimatePresence>
              <AnimatePresence>
                {handleUncheck && (
                  <PendingUncheckComponent
                    id={appointment[0]._id}
                    setHandleUncheck={setHandleUncheck}
                  />
                )}
              </AnimatePresence>
              <div className="w-full h-full text-[#333] flex-col flex justify-center items-center relative">
                <div className="flex gap-2 items-center md:text-2xl">
                  <p className="">{appointment[0].intendedFor.name}</p>
                  <p>|</p>
                  <p>
                    {
                      new Date(appointment[0].date)
                        .toLocaleString()
                        .split(",")[0]
                    }
                  </p>
                </div>
                <div className="flex text-4xl md:text-8xl items-center gap-4 px-4">
                  <p>{dateTime}</p>
                  <p className="text-2xl">X</p>
                  <p className="text-center">
                    {appointment[0].intendedFor.name.split(" ")[0] +
                      " " +
                      appointment[0].intendedFor.name.split(" ")[
                        appointment[0].intendedFor.name.split(" ").length - 1
                      ]}
                  </p>
                </div>
                <div className="px-2 py-2 border-1 border-[#ececec1e] bg-[#e2e2e257] rounded-full flex items-center gap-2 mt-4 shadow-lg">
                  <div
                    className="text-[#444] flex gap-2 px-4 py-2 rounded-3xl shadow-inner shadow-[#7e7e7ec5] duration-300 hover:bg-[#fadddd5c] cursor-pointer"
                    onClick={() => setHandleUncheck(!handleUncheck)}
                  >
                    <p>Desmarcar</p>
                    <CalendarOff className="w-[20px]" />
                  </div>
                  <div
                    className="px-4 py-2 rounded-3xl flex gap-2 shadow-inner shadow-[#7e7e7ec5] text-[#444] duration-300 hover:bg-[#faf5dd5c] cursor-pointer"
                    onClick={() => setHandleEditDate(!handleEditDate)}
                  >
                    <p className="">Alterar data</p>
                    <Calendar className="w-[20px]" />
                  </div>
                  <CloseButtonComponent
                    onClick={() => {
                      console.log("buttom");
                      setHandlePedingSelected(!handlePedingSelected);
                      setTimeout(() => {
                        setIdSelectedComponent(null);
                      }, 300);
                    }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="absolute top-1/2 left-1/2 translate-[-50%]">
              <p className="text-[#333] text-2xl">
                Houve algum erro por aqui...
              </p>
              <CloseButtonComponent
                onClick={() => {
                  console.log("buttom");
                  setHandlePedingSelected(!handlePedingSelected);
                  setTimeout(() => {
                    setIdSelectedComponent(null);
                  }, 300);
                }}
              />
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
