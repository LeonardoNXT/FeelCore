import { Dispatch, SetStateAction, useEffect, useState } from "react";
import BoxOfInitialPagesComponent from "./boxOfInitialComponents";
import {
  AppointmentsScheduled,
  useAppointmentsScheduleStore,
} from "@/stores/appointment";
import { MoveRight } from "lucide-react";
import CardPadronizedComponent from "./cardPadronized";
import InsideBoxPadronizedFirshScheduledAppointments from "./boxInsidePadronizedScheduledAppointments";
import OtherScheduledAppointmentsPadronizedComponent from "./otherAppoitmentsScheduledPadronized";
import { ConfirmWarmingBoxProps, WarningBox } from "../hooks/useWarmingBox";
import LargeCancelButtonComponent from "./cancelAndPDFButtonLarge";
import CancelAndPdfButtonComponent from "./cancelAndPdfButton";
import PdfOnBoxInsideConteiner from "./PDFonBoxInsideConteiner";

export default function ScheduleAppointmentComponent({
  setWarningBox,
  setConfirm,
}: {
  setWarningBox: Dispatch<SetStateAction<WarningBox | null>>;
  setConfirm: Dispatch<SetStateAction<ConfirmWarmingBoxProps>>;
}) {
  const [firsh, setFirsh] = useState<AppointmentsScheduled | null>(null);
  const [otherAppointmentsScheduled, setOtherAppointmentsScheduled] = useState<
    AppointmentsScheduled[] | null
  >(null);
  const { setAppointments, appointments } = useAppointmentsScheduleStore();
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    const scheduledAppointments = async () => {
      try {
        const response = await fetch("/api/appointments/all/schedule", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-type": "application/json",
          },
        });
        const data = await response.json();
        console.log("[DATA SCHEDULED] :", data);
        setAppointments(data.appointments);
      } catch (err) {
        console.log(err);
      }
    };
    scheduledAppointments();
  }, [setAppointments]);

  useEffect(() => {
    if (appointments.length > 0) {
      setFirsh(appointments[0]);

      if (appointments.length >= 2) {
        setOtherAppointmentsScheduled(appointments.filter((_, i) => i > 0));
      }
    }
  }, [appointments]);

  useEffect(() => {
    if (!id) return;
    setWarningBox({
      title: "Cancelar agendamento.",
      summary:
        "Clicando em confirmar você pode cancelar o agendamento confirmado.",
      id: id,
      route: "appointments/cancel",
    });
    setConfirm({
      status: false,
      type: "CONFIRM SCHEDULE",
    });
    setId(null);
  }, [id, setWarningBox, setConfirm]);

  if (appointments.length > 0) {
    return (
      <div className="mb-2 w-full">
        {firsh && (
          <div className="w-full">
            <CardPadronizedComponent
              title="Agendamentos Confirmados"
              arrayOfItems={appointments}
              to="#bce1e2"
            />
            <PdfOnBoxInsideConteiner
              title="PDF - Agendamentos Confirmados"
              summary="Aqui, você pode visualizar todos os agendamentos que já foram confirmados. Essa lista permite acompanhar os compromissos que estão oficialmente marcados e prontos para serem realizados. Para mais detalhes ou ações, utilize as opções disponíveis abaixo."
              color="#bce1e2"
              pdfEndpoint="appointments/pdf/confirm"
            />
            <BoxOfInitialPagesComponent
              title="Agendamento confirmado"
              summary={`O próximo agendamento confirmado é o de ${
                firsh.intendedFor.name.split(" ")[0]
              }. Você pode relembrar ela de sua consula pelo envio por email, logo abaixo.`}
              icon
              urlImage={firsh.intendedFor.avatar?.url}
              fallbackImage={firsh.intendedFor.name}
            >
              <div className="w-full mt-10">
                <div className="px-2 flex items-center gap-3 mb-3 mt-5">
                  <div className="px-3 py-2 bg-gradient-to-br from-[#010101] to-[#241e0f] w-max flex gap-2 items-center rounded-3xl border-1 border-[#333]">
                    <p className="text-[#c9c4b6fb] text-[13px] rounded-2xl poppins ">
                      Enviar email
                    </p>
                    <MoveRight className="text-[#c9c4b6fb] w-4" />
                  </div>
                  <div className="w-3 h-3 rounded-full bg-amber-200"></div>
                </div>
                <InsideBoxPadronizedFirshScheduledAppointments
                  firstAppointment={firsh}
                  to="#bce1e2"
                >
                  <LargeCancelButtonComponent setId={setId} />
                </InsideBoxPadronizedFirshScheduledAppointments>
              </div>
            </BoxOfInitialPagesComponent>
            <div className="mt-2"></div>
            {otherAppointmentsScheduled && (
              <OtherScheduledAppointmentsPadronizedComponent
                title="Outros Agendamentos Confirmados"
                summary="Aqui, você pode encontrar outros agendamentos foram confirmados. Você pode alterar o estado do agendamento acessando a opção abaixo."
                to="#bce1e2"
                otherAppointmentsScheduled={otherAppointmentsScheduled}
              >
                <CancelAndPdfButtonComponent
                  setId={setId}
                  cancelButton={true}
                  pdfButton={true}
                />
              </OtherScheduledAppointmentsPadronizedComponent>
            )}
          </div>
        )}
      </div>
    );
  }
}
