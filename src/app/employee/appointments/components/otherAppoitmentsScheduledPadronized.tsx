import { AppointmentsScheduled } from "@/stores/appointment";
import BoxOfInitialPagesComponent from "./boxOfInitialComponents";
import { getTime } from "./getTime";

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
  return (
    <BoxOfInitialPagesComponent icon={false} title={title} summary={summary}>
      <div
        className="w-full py-4 mt-10 rounded-3xl"
        style={{ background: `linear-gradient(45deg, ${from} 0%, ${to} 100%)` }}
      >
        <div
          className={` w-full h-70 flex ${
            otherAppointmentsScheduled.length === 1 &&
            "justify-center items-center"
          }  overflow-x-scroll gap-4 py-4`}
        >
          {otherAppointmentsScheduled.map((otherAppointments, i) => (
            <div
              className="w-[350px] md:w-[400px] rounded-3xl bg-gradient-to-tl from-[#ffffff] to-[#fcfcfc00] h-full flex flex-col justify-center items-center relative"
              key={i}
            >
              <div className="flex gap-2 text-[#646464]">
                <p>{getTime(otherAppointments.startTime)}</p>
                <p>-</p>
                <p>{getTime(otherAppointments.endTime)}</p>
                <p>|</p>
                <p>
                  {new Date(otherAppointments.startTime).toLocaleDateString()}
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
            </div>
          ))}
        </div>
      </div>
    </BoxOfInitialPagesComponent>
  );
}
