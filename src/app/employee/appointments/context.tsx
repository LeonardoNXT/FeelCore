"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import { Appointments } from "@/stores/appointment";
import ButtonPushRouteComponent from "../components/buttonPushRoute";
import useWarmingBox from "./hooks/useWarmingBox";

// ⏳ Lazy-load de componentes pesados
const PendingComponent = dynamic(() => import("./components/peding"));
const FirshPedingAppoitmentComponent = dynamic(
  () => import("./components/firshPedingAppointment")
);
const OtherPendingAppointmentsComponent = dynamic(
  () => import("./components/otherPendingAppointments")
);
const ScheduleAppointmentComponent = dynamic(
  () => import("./components/scheduleAppointmentsComponent")
);
const CardPadronizedComponent = dynamic(
  () => import("./components/cardPadronized")
);
const ConfirmPastAppointmentsComponent = dynamic(
  () => import("./components/confirmPastAppointmentsComponent")
);
const WarningBoxComponent = dynamic(
  () => import("./components/warningBoxComponent")
);
const GetAppointmentsComponentPadronized = dynamic(
  () => import("./components/completeAppointments")
);

export default function AppointmentsPageContext() {
  const [appointments, setAppointments] = useState<Appointments[] | null>(null);
  const [otherAppointments, setOtherAppointments] = useState<
    Appointments[] | null
  >(null);
  const { warningBox, setWarningBox, confirmWarmingBox, setConfirmWarmingBox } =
    useWarmingBox();
  const [appointmentPendingSeleted, setAppointmentPendingSeleted] =
    useState<Appointments | null>(null);
  const [changePage, setChangePage] = useState(false);

  useEffect(() => {
    const fetchApiAppointments = async () => {
      const response = await fetch("/api/appointments/availability/all", {
        method: "POST",
        credentials: "include",
      });
      const data = await response.json();
      setAppointments(data.appointments);
    };
    fetchApiAppointments();
  }, [setAppointments]);

  useEffect(() => {
    if (!appointments) return;

    setOtherAppointments(appointments.filter((_, i) => i > 0));
  }, [appointments]);

  return (
    <AnimatePresence>
      {!changePage && (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full min-h-screen bg-[url('/background.jpg')] bg-fixed bg-cover relative"
        >
          <AnimatePresence>
            {warningBox && (
              <WarningBoxComponent
                warningBox={warningBox}
                setWarningBox={setWarningBox}
                setConfirm={setConfirmWarmingBox}
              />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {appointmentPendingSeleted && (
              <PendingComponent
                appointmentPendingSeleted={appointmentPendingSeleted}
                setAppointmentPendingSeleted={setAppointmentPendingSeleted}
              />
            )}
          </AnimatePresence>

          <div className="w-full md:flex md:justify-center min-h-screen backdrop-blur-3xl backdrop-sepia-50 relative">
            <div className="w-full md:w-[800px] px-3 py-25 md:py-35">
              <ButtonPushRouteComponent
                title="Criar Agendamento"
                route="/employee/appointments/create"
                setChangePage={setChangePage}
              />

              <div className="w-full">
                <ConfirmPastAppointmentsComponent
                  warmingBox={warningBox}
                  setWarmingBox={setWarningBox}
                  confirm={confirmWarmingBox}
                  setConfirm={setConfirmWarmingBox}
                />

                <ScheduleAppointmentComponent
                  setWarningBox={setWarningBox}
                  setConfirm={setConfirmWarmingBox}
                />

                {appointments && appointments.length > 0 && (
                  <>
                    <CardPadronizedComponent
                      title="Agendamentos pendentes"
                      arrayOfItems={appointments}
                    />
                    <FirshPedingAppoitmentComponent
                      appointment={appointments[0]}
                      setAppointmentSeleted={setAppointmentPendingSeleted}
                    />
                    <AnimatePresence>
                      {otherAppointments && (
                        <OtherPendingAppointmentsComponent
                          otherAppointments={otherAppointments}
                          setAppointmentSeleted={setAppointmentPendingSeleted}
                        />
                      )}
                    </AnimatePresence>
                  </>
                )}

                <GetAppointmentsComponentPadronized
                  title="Agendamentos concluídos"
                  titlePdf="PDF - Agendamentos concluídos"
                  summaryPdf="Gere um PDF com todos os agendamentos já concluídos."
                  summary="Visualize todos os agendamentos finalizados."
                  color="#746DFF"
                  pdfEndpoint="appointments/pdf/complete"
                  endpoint="appointments/complete/all"
                  buttons={{ cancel: false, pdf: true }}
                />

                <GetAppointmentsComponentPadronized
                  title="Agendamentos cancelados"
                  titlePdf="PDF - Agendamentos cancelados"
                  summaryPdf="Gere um PDF com todos os agendamentos cancelados."
                  summary="Visualize todos os agendamentos cancelados."
                  color="#FF6D6D"
                  pdfEndpoint="appointments/pdf/canceled"
                  endpoint="appointments/all/canceled"
                  buttons={{ cancel: false, pdf: true }}
                />
              </div>
            </div>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
