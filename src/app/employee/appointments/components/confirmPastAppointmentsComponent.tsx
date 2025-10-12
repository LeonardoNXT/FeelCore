import { Appointments, AppointmentsScheduled } from "@/stores/appointment";
import { useEffect, useState } from "react";
import CardPadronizedComponent from "./cardPadronized";
import FirshPastScheduledAppointment from "./firshPastScheduledAppointment";
import { Check, X } from "lucide-react";
import OtherScheduledAppointmentsPadronizedComponent from "./otherAppoitmentsScheduledPadronized";

type Data = {
  message: string;
  appointments: AppointmentsScheduled[];
};

export default function ConfirmPastAppointmentsComponent() {
  const [pastScheduledAppointments, setPastScheduledAppointments] = useState<
    AppointmentsScheduled[] | null
  >(null);
  const [firstAppointment, setFirstAppointment] =
    useState<AppointmentsScheduled | null>(null);
  const [otherAppointmentsScheduled, setOtherAppointmentsScheduled] = useState<
    AppointmentsScheduled[] | null
  >(null);
  useEffect(() => {
    const fetchToApi = async () => {
      try {
        const response = await fetch("/api/appointments/all/past/schedule", {
          method: "POST",
          credentials: "include",
        });
        if (!response.ok) {
          const data = await response.json();
          console.error("[ERROR] : ", data);
          throw new Error(data || "Houve um erro interno");
        }
        const data = (await response.json()) as Data;

        setPastScheduledAppointments(
          data.appointments.sort(
            (a: AppointmentsScheduled, b: AppointmentsScheduled) =>
              new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
          )
        );
      } catch (err) {
        console.log(err);
      }
    };
    fetchToApi();
  }, []);
  useEffect(() => {
    if (pastScheduledAppointments && pastScheduledAppointments.length > 0) {
      setFirstAppointment(pastScheduledAppointments[0]);
      if (pastScheduledAppointments.length > 1) {
        setOtherAppointmentsScheduled(
          pastScheduledAppointments.filter((_, i) => i > 0)
        );
      }
    }
  }, [pastScheduledAppointments]);

  if (!pastScheduledAppointments) return;
  return (
    <section className="w-full">
      <CardPadronizedComponent
        to="#a6be6e"
        title="Agendamentos não concluídos"
        arrayOfItems={pastScheduledAppointments as Appointments[]}
      />
      {firstAppointment && (
        <FirshPastScheduledAppointment firstAppointment={firstAppointment} />
      )}
      <div className="mt-2"></div>
      {otherAppointmentsScheduled && (
        <OtherScheduledAppointmentsPadronizedComponent
          title="Outros agendamentos não concluídos"
          summary="Aqui, você pode encontrar outros agendamentos que ainda não foram concluídos. Você pode alterar o estado do agendamento acessando a opção abaixo."
          otherAppointmentsScheduled={otherAppointmentsScheduled}
        >
          <div className="flex absolute bottom-4 px-1 gap-4 rounded-full py-1 bg-[#1f1f1f]">
            <div className="h-8 w-8 px-2 py-2 flex justify-center items-center rounded-full duration-200 hover:bg-red-300 hover:rotate-90 cursor-pointer">
              <X />
            </div>
            <div className="h-8 w-8 px-2 py-2 flex justify-center items-center rounded-full duration-200 hover:bg-green-300 hover:rotate-[-20deg] cursor-pointer">
              <Check />
            </div>
          </div>
        </OtherScheduledAppointmentsPadronizedComponent>
      )}
    </section>
  );
}
