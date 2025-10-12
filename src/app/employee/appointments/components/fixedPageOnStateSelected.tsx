import { Appointments } from "@/stores/appointment";
import useGetHours from "../hooks/useGetHours";
import ModalOfCardPadronizedComponent from "./modalOfCardPadronized";
import { Calendar, CalendarOff } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { getTime } from "./getTime";

type Props = {
  setAppointmentPendingSeleted: Dispatch<SetStateAction<Appointments | null>>;
  appointmentPendingSeleted: Appointments;
  handleUncheck: boolean;
  handleEditDate: boolean;
  setHandleUncheck: Dispatch<SetStateAction<boolean>>;
  setHandleEditDate: Dispatch<SetStateAction<boolean>>;
};

export default function FixedPageOnStateSelectedContent({
  appointmentPendingSeleted,
  handleUncheck,
  handleEditDate,
  setHandleUncheck,
  setHandleEditDate,
  setAppointmentPendingSeleted,
}: Props) {
  const dateTime = useGetHours(appointmentPendingSeleted.startTime || null);
  return (
    <div className="w-full h-full text-[#333] flex-col flex justify-center items-center relative">
      <div className="flex gap-2 items-center md:text-2xl">
        <p className="">{appointmentPendingSeleted.duration} minutos</p>
        <p>|</p>
        <p>
          {
            new Date(appointmentPendingSeleted.startTime)
              .toLocaleString()
              .split(",")[0]
          }
        </p>
      </div>
      <div className="flex text-4xl md:text-8xl items-center gap-4 px-4">
        <p>{dateTime}</p>
        <p className="text-2xl">X</p>
        <p className="text-center">
          {getTime(appointmentPendingSeleted.endTime)}
        </p>
      </div>

      <ModalOfCardPadronizedComponent
        setAppointmentSeleted={setAppointmentPendingSeleted}
      >
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
      </ModalOfCardPadronizedComponent>
    </div>
  );
}
