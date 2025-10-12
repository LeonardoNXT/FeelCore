import { AnimatePresence, motion } from "framer-motion";
import { Dispatch, SetStateAction, useState } from "react";
import CloseButtonComponent from "./closeButton";
import { CalendarOff, MoveRight } from "lucide-react";
import RefreshComponent from "../../components/refresh";
export default function PendingUncheckComponent({
  id,
  setHandleUncheck,
}: {
  id: string;
  setHandleUncheck: Dispatch<SetStateAction<boolean>>;
}) {
  const [sucessUncheck, setSucessUncheck] = useState<boolean>(false);
  const uncheckAppointment = async () => {
    try {
      const response = await fetch(`/api/appointments/availability/delete`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({
          appointmentId: id,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Houve um erro interno, Tente novamente mais tarde");
      }
      setSucessUncheck(true);
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
        {sucessUncheck && (
          <RefreshComponent
            route="/employee/appointments"
            title="Desmarcado com sucesso."
            display="absolute"
            zIndex="20"
          />
        )}
      </AnimatePresence>
      <div className="w-full max-w-[500px] px-4 py-4 rounded-4xl bg-[#ffffff34] shadow-2xl shadow-[#0000001f]">
        <div className="flex justify-between text-[#444]">
          <div className="px-3 py-2 shadow-inner shadow-[#818181] rounded-full flex gap-2">
            <p>Desmarcar</p>
            <CalendarOff className="w-[20px]" />
          </div>
          <CloseButtonComponent onClick={() => setHandleUncheck(false)} />
        </div>
        <p className="text-[#333] mt-4 px-2 text-2xl">
          Abaixo, você pode desmarcar a consulta. Lembre-se de que está ação
          será irreversível.
        </p>
        <div className="w-full flex justify-end mt-4">
          <button
            className="px-3 py-2 shadow-inner shadow-[#464545a9] rounded-full text-[#444] flex justify-center items-center bg-[#ffc1c162] gap-2 hover:bg-[#ffa2a262] duration-300 cursor-pointer"
            onClick={uncheckAppointment}
          >
            <span>Desmarcar</span>
            <MoveRight />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
