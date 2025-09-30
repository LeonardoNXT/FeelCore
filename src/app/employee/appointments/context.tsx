"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { useAppointmentsStore } from "@/stores/appointment";
import PendingComponent from "./components/peding";
import useGetHours from "./hooks/useGetHours";

import FirshPedingAppoitmentComponent from "./components/firshPedingAppointment";
import OtherPendingAppointmentsComponent from "./components/otherPendingAppointments";

export default function AppointmentsPageContext() {
  const { appointments, setAppointments } = useAppointmentsStore();
  const [idPedingSelectedComponent, setIdSelectedComponent] = useState<
    string | null
  >(null);
  const [handlePedingSelected, setHandlePedingSelected] =
    useState<boolean>(false);

  useEffect(() => {
    const fetchApiAppointments = async () => {
      const response = await fetch("/api/appointments/pending", {
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
    conditionalOfAppointments ? appointments[0].date : null
  );
  if (conditionalOfAppointments) {
    console.log(dateTime);
    otherAppointments = appointments.filter((_, index) => index > 0);
    console.log(otherAppointments);
  }
  useEffect(() => {
    console.log(idPedingSelectedComponent);
  }, [idPedingSelectedComponent]);
  return (
    <AnimatePresence>
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full min-h-screen bg-[url('/background.jpg')] bg-fixed bg-cover relative"
      >
        {idPedingSelectedComponent && (
          <PendingComponent
            id={idPedingSelectedComponent}
            setIdSelectedComponent={setIdSelectedComponent}
            setHandlePedingSelected={setHandlePedingSelected}
            handlePedingSelected={handlePedingSelected}
          />
        )}
        <div className="w-full md:flex md:justify-center min-h-screen backdrop-blur-3xl backdrop-sepia-50 relative">
          <div className="w-full md:w-[800px] px-3 py-25 md:py-35">
            {conditionalOfAppointments && (
              <div className="w-full">
                <FirshPedingAppoitmentComponent appointment={appointments[0]} />
                {otherAppointments && otherAppointments.length > 0 && (
                  <OtherPendingAppointmentsComponent
                    otherAppointments={otherAppointments}
                    handlePedingSelected={handlePedingSelected}
                    setHandlePedingSelected={setHandlePedingSelected}
                    setIdSelectedComponent={setIdSelectedComponent}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </motion.section>
    </AnimatePresence>
  );
}
