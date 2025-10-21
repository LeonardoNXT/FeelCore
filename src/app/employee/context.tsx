"use client";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import useWarmingBox from "./appointments/hooks/useWarmingBox";
import { useState } from "react";
import ButtonPushRouteComponent from "./components/buttonPushRoute";
import useSetError from "./appointments/hooks/useSetError";
const WarningBoxComponent = dynamic(
  () => import("./appointments/components/warningBoxComponent")
);
const ErrorComponent = dynamic(
  () => import("./appointments/components/errorComponent")
);
const ScheduleAppointmentComponent = dynamic(
  () => import("./appointments/components/scheduleAppointmentsComponent")
);
const TasksContentPadronizedComponent = dynamic(
  () => import("./tasks/components/tasksComponent")
);
const MapOfSummaries = dynamic(
  () => import("./summaries/components/mapOfSummaries")
);

export default function MainRouteOfEmployeeConteiner() {
  const { error, setError } = useSetError();
  const [changePage, setChangePage] = useState(false);
  const { warningBox, setWarningBox, setConfirmWarmingBox } = useWarmingBox();

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
            {error && (
              <ErrorComponent
                errorContent={error}
                bg="bg-[#fff]"
                display="fixed"
                onClick={() => setError(null)}
              />
            )}
          </AnimatePresence>

          <div className="w-full md:flex md:justify-center min-h-screen backdrop-blur-3xl backdrop-sepia-50 relative">
            <div className="w-full md:w-[800px] px-3 py-25 md:py-35 flex flex-col gap-2">
              <div>
                <div>
                  <ButtonPushRouteComponent
                    title="Agendamentos"
                    route="/employee/appointments"
                    setChangePage={setChangePage}
                  />
                  <ScheduleAppointmentComponent
                    setWarningBox={setWarningBox}
                    setConfirm={setConfirmWarmingBox}
                  />
                </div>
                <div>
                  <ButtonPushRouteComponent
                    title="Tarefas"
                    route="/employee/tasks"
                    setChangePage={setChangePage}
                  />
                  <TasksContentPadronizedComponent
                    endPoint="completed"
                    firshTaskComponentContent={{
                      from: "#eee",
                      to: "#A5CF74",
                      title: "Primeira tarefa concluída",
                      summary:
                        "Revise as tarefas que já foram finalizadas e acompanhe o progresso do paciente.",
                    }}
                    otherTasksContent={{
                      from: "#eee",
                      to: "#74CF7F",
                      title: "Outras tarefas concluídas",
                      summary:
                        "Revise as tarefas que já foram finalizadas. Mantenha o histórico organizado e celebre as conquistas de seus pacientes.",
                    }}
                    setError={setError}
                  />
                </div>
              </div>
              <div>
                <ButtonPushRouteComponent
                  title="Resumos"
                  route="/employee/summaries"
                  setChangePage={setChangePage}
                />
                <MapOfSummaries setChangePage={setChangePage} />
              </div>
            </div>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
