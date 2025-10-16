import { Appointments, AppointmentsScheduled } from "@/stores/appointment";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import CardPadronizedComponent from "./cardPadronized";
import FirshPastScheduledAppointment from "./firshPastScheduledAppointment";
import OtherScheduledAppointmentsPadronizedComponent from "./otherAppoitmentsScheduledPadronized";
import ConfirmAndCancelComponent from "./confirmAndCancel";
import { ConfirmWarmingBoxProps, WarningBox } from "../hooks/useWarmingBox";
import PdfOnBoxInsideConteiner from "./PDFonBoxInsideConteiner";

type Data = {
  message: string;
  appointments: AppointmentsScheduled[];
};

export type ChooseOptionProps = "COMPLETE" | "CANCEL" | null;

export default function ConfirmPastAppointmentsComponent({
  setWarmingBox,
  setConfirm,
  confirm,
}: {
  setWarmingBox: Dispatch<SetStateAction<WarningBox | null>>;
  warmingBox: WarningBox | null;
  setConfirm: Dispatch<SetStateAction<ConfirmWarmingBoxProps>>;
  confirm: ConfirmWarmingBoxProps;
}) {
  const [pastScheduledAppointments, setPastScheduledAppointments] = useState<
    AppointmentsScheduled[] | null
  >(null);
  const [firstAppointment, setFirstAppointment] =
    useState<AppointmentsScheduled | null>(null);
  const [otherAppointmentsScheduled, setOtherAppointmentsScheduled] = useState<
    AppointmentsScheduled[] | null
  >(null);
  const [chooseOption, setChooseOption] = useState<ChooseOptionProps>(null);
  const [id, setId] = useState<string | null>(null);
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
    if (!id || !chooseOption) return;

    let route = null;
    let summary = null;
    let title = null;
    switch (chooseOption) {
      case "COMPLETE":
        route = "appointments/complete";
        title = "Concluir agendamento";
        summary = "Clicando em confirmar, você concluirá o agendamento.";
        break;
      case "CANCEL":
        route = "appointments/cancel";
        title = "Cancelar agendamento";
        summary = "Clicando em confimar, você cancelará o agendamento.";
        break;
    }
    if (!route || !summary || !title) return;
    setWarmingBox({
      id,
      route,
      summary,
      title,
    });
    setConfirm({
      status: false,
      type: "PAST CONFIRM SCHEDULE",
    });
    setId(null);
  }, [id, chooseOption, setWarmingBox, setConfirm]);

  useEffect(() => {
    const fetchToApi = async () => {
      try {
        const response = await fetch("/api/appointments/all/past/schedule", {
          method: "POST",
          credentials: "include",
        });
        console.log("Realizou o Fetch");
        if (!response.ok) {
          const data = await response.json();
          console.error("[ERROR] : ", data);
          throw new Error(data || "Houve um erro interno");
        }
        const data = (await response.json()) as Data;

        setPastScheduledAppointments(null);

        setPastScheduledAppointments(
          data.appointments.sort(
            (a: AppointmentsScheduled, b: AppointmentsScheduled) =>
              new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
          )
        );
      } catch (err) {
        console.log(err);
      } finally {
        setConfirm({
          status: false,
          type: null,
        });
      }
    };
    if (confirm.status && confirm.type === "PAST CONFIRM SCHEDULE") {
      fetchToApi();
    }
  }, [confirm, setConfirm]);

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

  useEffect(() => {
    console.log(
      "🌀 Atualizou otherAppointmentsScheduled:",
      otherAppointmentsScheduled
    );
  }, [otherAppointmentsScheduled]);

  if (!pastScheduledAppointments) return;
  return (
    <section className="w-full">
      <CardPadronizedComponent
        to="#a6be6e"
        title="Agendamentos não concluídos"
        arrayOfItems={pastScheduledAppointments as Appointments[]}
      />
      <PdfOnBoxInsideConteiner
        title="PDF - Agendamentos não concluídos"
        summary="Aqui, você pode visualizar os agendamentos que foram confirmados e cuja data e horário de início já passaram. Essa lista serve como histórico de compromissos realizados, permitindo acompanhar o que já foi concluído. Use as opções abaixo para consultar detalhes ou gerar relatórios."
        color="#a6be6e"
        pdfEndpoint="/appointments/pdf/past/confirm"
      />
      <div className="mt-2"></div>
      {firstAppointment && (
        <FirshPastScheduledAppointment
          firstAppointment={firstAppointment}
          setChooseOption={setChooseOption}
          setId={setId}
        />
      )}
      <div className="mt-2"></div>
      {otherAppointmentsScheduled && (
        <OtherScheduledAppointmentsPadronizedComponent
          title="Outros agendamentos não concluídos"
          summary="Aqui, você pode encontrar outros agendamentos que ainda não foram concluídos. Você pode alterar o estado do agendamento acessando a opção abaixo."
          otherAppointmentsScheduled={otherAppointmentsScheduled}
        >
          <ConfirmAndCancelComponent
            setChooseOption={setChooseOption}
            setId={setId}
          />
        </OtherScheduledAppointmentsPadronizedComponent>
      )}
    </section>
  );
}
