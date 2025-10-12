import { Appointments } from "@/stores/appointment";
import { Dispatch, SetStateAction, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import PendingEditDateComponent from "./pedingEditDate";
import CloseButtonComponent from "./closeButton";
import PendingUncheckComponent from "./pedingUncheck";
import FixedPageOnStateSelectedContent from "./fixedPageOnStateSelected";

export default function PendingComponent({
  appointmentPendingSeleted,
  setAppointmentPendingSeleted,
}: {
  appointmentPendingSeleted: Appointments;
  setAppointmentPendingSeleted: Dispatch<SetStateAction<Appointments | null>>;
}) {
  const [handleEditDate, setHandleEditDate] = useState<boolean>(false);
  const [handleUncheck, setHandleUncheck] = useState<boolean>(false);

  if (!appointmentPendingSeleted) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full h-screen fixed top-0 left-0 bg-gradient-to-br from-[#f0f0f0] to-[#af987d] z-5 flex items-center justify-center"
      >
        <div className="text-center">
          <p className="text-[#333] text-2xl">Houve algum erro por aqui...</p>
          <CloseButtonComponent
            onClick={() => {
              console.log("buttom");
              setAppointmentPendingSeleted(null);
            }}
          />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full h-screen fixed top-0 left-0 bg-gradient-to-br from-[#f0f0f0] to-[#af987d] z-5"
    >
      <AnimatePresence>
        {handleEditDate && (
          <PendingEditDateComponent
            Appointmentduration={appointmentPendingSeleted.duration}
            setHandleEditDate={setHandleEditDate}
            date={appointmentPendingSeleted.startTime}
            id={appointmentPendingSeleted._id}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {handleUncheck && (
          <PendingUncheckComponent
            id={appointmentPendingSeleted._id}
            setHandleUncheck={setHandleUncheck}
          />
        )}
      </AnimatePresence>
      <FixedPageOnStateSelectedContent
        appointmentPendingSeleted={appointmentPendingSeleted}
        handleUncheck={handleUncheck}
        handleEditDate={handleEditDate}
        setAppointmentPendingSeleted={setAppointmentPendingSeleted}
        setHandleEditDate={setHandleEditDate}
        setHandleUncheck={setHandleUncheck}
      />
    </motion.div>
  );
}
