import { Appointments } from "@/stores/appointment";
import { MoveUpRight } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

type Props = {
  firshName?: string;
  calendarTime: string;
  dateTime: string;
  date: string;
  setAppointmentSeleted?: Dispatch<SetStateAction<Appointments | null>>;
  appointment?: Appointments;
  from?: string;
  to?: string;
  setHandlePedingSelected?: Dispatch<SetStateAction<boolean>>;
};

export default function BoxOfAppointmentsPadronizedInside({
  calendarTime,
  dateTime,
  firshName,
  appointment,
  setAppointmentSeleted,
  date,
  from = "#e2ddb0",
  to = "#f7eddb",
}: Props) {
  return (
    <div
      className="w-full py-20 rounded-3xl border border-[#333] flex justify-center items-center flex-col relative"
      style={{
        backgroundImage: `linear-gradient(to bottom right, ${from}, ${to})`,
      }}
    >
      {!firshName && <p className="text-[#696969] font-bold">{date}</p>}
      <div className="flex justify-center items-center gap-2">
        <div className="text-5xl text-[#333] font-bold">{dateTime}</div>
        <div className="text-[#333] font-bold text-3xl">X</div>
        <p className="text-[#333] text-5xl font-bold">
          {firshName ? firshName : calendarTime}
        </p>
      </div>
      {setAppointmentSeleted && appointment && (
        <div
          className="w-10 h-10 shadow-inner shadow-[#333] rounded-full absolute bottom-2 right-2 px-2 py-2 text-[#333] cursor-pointer"
          onClick={() => {
            setAppointmentSeleted(appointment);
          }}
        >
          <MoveUpRight className="w-full h-full duration-300 hover:rotate-45" />
        </div>
      )}
    </div>
  );
}
