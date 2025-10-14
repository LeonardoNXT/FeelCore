"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Appointments, useAppointmentsStore } from "@/stores/appointment";
import PendingComponent from "./components/peding";
import useGetHours from "./hooks/useGetHours";
import FirshPedingAppoitmentComponent from "./components/firshPedingAppointment";
import OtherPendingAppointmentsComponent from "./components/otherPendingAppointments";
import ScheduleAppointmentComponent from "./components/scheduleAppointmentsComponent";
import CardPadronizedComponent from "./components/cardPadronized";
import ButtonPushRouteComponent from "../components/buttonPushRoute";
import ConfirmPastAppointmentsComponent from "./components/confirmPastAppointmentsComponent";
import WarningBoxComponent from "./components/warningBoxComponent";
import useWarmingBox from "./hooks/useWarmingBox";

export default function AppointmentsPageContext() {
  const { appointments, setAppointments } = useAppointmentsStore();
  const { warningBox, setWarningBox, confirmWarmingBox, setConfirmWarmingBox } =
    useWarmingBox();
  const [appointmentPendingSeleted, setAppointmentPendingSeleted] =
    useState<Appointments | null>(null);
  const [changePage, setChangePage] = useState<boolean>(false);

  useEffect(() => {
    const fetchApiAppointments = async () => {
      const response = await fetch("/api/appointments/availability/all", {
        method: "POST",
        credentials: "include",
      });
      const data = await response.json();
      console.log(data);
      setAppointments(data.appointments);
    };
    fetchApiAppointments();
  }, [setAppointments]);

  let otherAppointments = null;

  const conditionalOfAppointments = appointments.length > 0;
  const dateTime = useGetHours(
    conditionalOfAppointments ? appointments[0].startTime : null
  );

  if (conditionalOfAppointments) {
    console.log(dateTime);
    otherAppointments = appointments.filter((_, index) => index > 0);
    console.log(otherAppointments);
  }

  useEffect(() => {
    console.log("[confirmWarmingBox]", confirmWarmingBox);
  }, [confirmWarmingBox]);

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
                title="Criar agendamento"
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
                {appointments.length > 0 && (
                  <CardPadronizedComponent
                    title="Agendamentos pendentes"
                    arrayOfItems={appointments}
                  />
                )}
                {appointments.length > 0 && (
                  <FirshPedingAppoitmentComponent
                    appointment={appointments[0]}
                    setAppointmentSeleted={setAppointmentPendingSeleted}
                  />
                )}
                <AnimatePresence>
                  {otherAppointments && otherAppointments.length > 0 && (
                    <OtherPendingAppointmentsComponent
                      otherAppointments={otherAppointments}
                      setAppointmentSeleted={setAppointmentPendingSeleted}
                    />
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
