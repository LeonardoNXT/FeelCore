import { AppointmentsScheduled } from "@/stores/appointment";
import BoxOfInitialPagesComponent from "./boxOfInitialComponents";
import { getInitials } from "./getInitials";
import { Dispatch, SetStateAction, useState } from "react";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import InsideBoxPadronizedFirshScheduledAppointments from "./boxInsidePadronizedScheduledAppointments";
import { ChooseOptionProps } from "./confirmPastAppointmentsComponent";
import PDFbuttonComponent from "./PDFbuttonComponent";

type Props = {
  firstAppointment: AppointmentsScheduled;
  setChooseOption: Dispatch<SetStateAction<ChooseOptionProps>>;
  setId: Dispatch<SetStateAction<string | null>>;
};

export default function FirshPastScheduledAppointment({
  firstAppointment,
  setId,
  setChooseOption,
}: Props) {
  const [hover, setHover] = useState<string | null>(null);
  return (
    <BoxOfInitialPagesComponent
      title="Agendamentos não concluídos"
      summary="Aqui, você pode encontrar os agendamentos que ainda não foram concluídos. Você pode alterar o estado do agendamento acessando a opção abaixo."
      icon
      urlImage={firstAppointment.intendedFor.avatar?.url}
      fallbackImage={getInitials(firstAppointment.intendedFor.name)}
    >
      <InsideBoxPadronizedFirshScheduledAppointments
        firstAppointment={firstAppointment}
      >
        <div className=" absolute bottom-0">
          {hover && (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{
                duration: 0.5,
                ease: "circInOut",
                type: "spring",
              }}
              className="absolute left-1/2 shadow translate-x-[-50%] w-max px-[10px] border-1 border-[#333] py-[5px] top-[-20px] bg-[#222] text-[13px] text-[#bbb] rounded-[12px] overflow-hidden text-nowrap"
            >
              {hover}
            </motion.div>
          )}
          <div className="px-2 py-2 shadow-2xl bg-[#111] shadow-[#000000] justify-between rounded-t-3xl mt-4 flex gap-4">
            <div
              onMouseEnter={() =>
                setHover("Clicando no 'X', você cancelará o agendamento.")
              }
              onMouseLeave={() => setHover(null)}
              onClick={() => {
                setId(firstAppointment._id);
                setChooseOption("CANCEL");
              }}
              className="border-1 border-[#333] rounded-full h-10 w-10 p-2 duration-200 hover:text-[#333] hover:bg-[#ffd6d6] cursor-pointer hover:rotate-90"
            >
              <X className="w-full h-full" />
            </div>
            <div
              onMouseEnter={() =>
                setHover("Clicando em 'PDF', você pode baixar o agendamento.")
              }
              onMouseLeave={() => setHover(null)}
            >
              <PDFbuttonComponent id={firstAppointment._id} />
            </div>
            <div
              className="border-1 border-[#333] rounded-full h-10 w-10 p-2 duration-200 hover:text-[#333] hover:bg-[#eaffd6] cursor-pointer hover:rotate-[-25deg]"
              onMouseEnter={() =>
                setHover("Clicando no '✓', você finalizará o agendamento.")
              }
              onMouseLeave={() => setHover(null)}
              onClick={() => {
                setId(firstAppointment._id);
                setChooseOption("COMPLETE");
              }}
            >
              <Check className="w-full h-full" />
            </div>
          </div>
        </div>
      </InsideBoxPadronizedFirshScheduledAppointments>
    </BoxOfInitialPagesComponent>
  );
}
