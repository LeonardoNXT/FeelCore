import { Appointments } from "@/stores/appointment";
import { MoveRight } from "lucide-react";
import { getTime } from "./getTime";
import BoxOfInitialPagesComponent from "./boxOfInitialComponents";
import BoxOfAppointmentsPadronizedInside from "./boxOfAppointmentsPadronizedInside";
import { Dispatch, SetStateAction } from "react";

export default function FirshPedingAppoitmentComponent({
  appointment,
  setAppointmentSeleted,
}: {
  appointment: Appointments;
  setAppointmentSeleted?: Dispatch<SetStateAction<Appointments | null>>;
}) {
  const calendarTime = getTime(appointment.endTime);
  const dateTime = getTime(appointment.startTime);
  const date = new Date(appointment.startTime).toLocaleDateString();

  return (
    <BoxOfInitialPagesComponent
      title="Agendamento pendente"
      summary={`Aqui se encontra o próximo agendamento disponível próximo de expirar`}
      icon={false}
    >
      <div className="px-4 text-[#757575] mt-10"></div>
      <div className="px-2 flex items-center gap-3 mb-3 mt-5">
        <div className="px-3 py-2 bg-gradient-to-br from-[#010101] to-[#241e0f] w-max flex gap-2 items-center rounded-3xl border-1 border-[#333]">
          <p className="text-[#c9c4b6fb] text-[13px] rounded-2xl poppins ">
            Enviar email
          </p>
          <MoveRight className="text-[#c9c4b6fb] w-4" />
        </div>
        <div className="w-3 h-3 rounded-full bg-amber-200"></div>
      </div>
      <BoxOfAppointmentsPadronizedInside
        calendarTime={calendarTime}
        dateTime={dateTime}
        appointment={appointment}
        date={date}
        setAppointmentSeleted={setAppointmentSeleted}
      />
    </BoxOfInitialPagesComponent>
  );
}
