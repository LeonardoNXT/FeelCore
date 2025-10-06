import { Appointments } from "@/stores/appointment";
import { MoveRight } from "lucide-react";
import { getInitials } from "./getInitials";
import { getTime } from "./getTime";
import BoxOfInitialPagesComponent from "./boxOfInitialComponents";

export default function FirshPedingAppoitmentComponent({
  appointment,
}: {
  appointment: Appointments;
}) {
  const firshNameOfPedente = appointment.intendedFor.name.split(" ")[0];
  const calendarTime = new Date(appointment.date).toLocaleDateString();
  const dateTime = getTime(appointment.date);
  return (
    <BoxOfInitialPagesComponent
      title="Agendamento pendente"
      summary={`        Você pode enviar um email perguntando ${firshNameOfPedente}
        deseja continuar o agendamento por aqui.`}
      icon={true}
      urlImage={appointment.intendedFor.avatar?.url}
      fallbackImage={getInitials(appointment.intendedFor.name)}
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
      <div className="w-full py-20 bg-gradient-to-br from-[#e2ddb0] to-[#f7eddb] rounded-3xl border-1 border-[#333] flex justify-center items-center flex-col">
        <p className="text-[#696969] font-bold">{calendarTime}</p>
        <div className="flex justify-center items-center gap-2">
          <div className="text-5xl text-[#333] font-bold">{dateTime}</div>
          <div className="text-[#333] font-bold text-3xl">X</div>
          <p className="text-[#333] text-5xl font-bold">{firshNameOfPedente}</p>
        </div>
      </div>
    </BoxOfInitialPagesComponent>
  );
}
