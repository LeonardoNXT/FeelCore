import { AppointmentsScheduled } from "@/stores/appointment";
import { getTime } from "./getTime";

type Props = {
  children?: React.ReactNode;
  firstAppointment: AppointmentsScheduled;
  from?: string;
  to?: string;
};

export default function InsideBoxPadronizedFirshScheduledAppointments({
  children,
  firstAppointment,
  to = "#a6be6e",
  from = "#ffffff",
}: Props) {
  return (
    <div
      className="w-full mt-10 h-70 rounded-3xl flex flex-col justify-center items-center relative"
      style={{ background: `linear-gradient(45deg,${from} 0%, ${to} 100%)` }}
      data-id={firstAppointment._id}
    >
      <div className="flex gap-2 text-[#444]">
        <p>{getTime(firstAppointment.startTime)}</p>
        <p>-</p>
        <p>{getTime(firstAppointment.endTime)}</p>
        <p>|</p>
        <p>{new Date(firstAppointment.startTime).toLocaleDateString()}</p>
      </div>
      <div className="flex gap-2 text-[#333] text-4xl md:text-5xl font-bold">
        <p>{firstAppointment.intendedFor.name.split(" ")[0]}</p>
        <p>—</p>
        <p>{firstAppointment.duration} minutos</p>
      </div>
      <p className="text-[#444]">{firstAppointment.intendedFor.name}</p>
      {children}
    </div>
  );
}
