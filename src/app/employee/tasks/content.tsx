"use client";
import dynamic from "next/dynamic";
import { useState } from "react";
import SectionConteinerPadronized from "../components/sectionAndComponentPadronized";
import useSetError from "../appointments/hooks/useSetError";
const ErrorComponent = dynamic(
  () => import("../appointments/components/errorComponent"),
  { ssr: false }
);
import ButtonPushRouteComponent from "../components/buttonPushRoute";
import { AnimatePresence } from "framer-motion";
const TasksContentPadronizedComponent = dynamic(
  () => import("./components/tasksComponent"),
  { ssr: false }
);

const CONFIG_PAGE = [
  {
    ENDING_POINT: "completed",
    FIRSH_TASK: {
      title: "Primeira tarefa concluída",
      summary:
        "Revise as tarefas que já foram finalizadas e acompanhe seu progresso.",
      from: "#eee",
      to: "#74CFC9",
    },
    OTHER_TASKS: {
      title: "Outras tarefas concluídas",
      summary:
        "Revise as tarefas que já foram finalizadas. Mantenha o histórico organizado e celebre suas conquistas.",
      from: "#FDFFFC",
      to: "#598B96",
    },
  },
  {
    ENDING_POINT: "pending",
    FIRSH_TASK: {
      title: "Primeira tarefa pendente",
      summary:
        "Visualize e acompanhe todas as tarefas que ainda precisam ser concluídas.",
      from: "#eee",
      to: "#CF8F74",
    },
    OTHER_TASKS: {
      title: "Outras tarefas pendentes",
      summary:
        "Visualize e acompanhe todas as tarefas que ainda precisam ser concluídas. Mantenha o foco e organize suas prioridades.",
      from: "#FDFFFC",
      to: "#967C59",
    },
  },
];

export default function TaskContent() {
  const { error, setError } = useSetError();
  const [changePage, setChangePage] = useState<boolean>(false);

  return (
    <AnimatePresence>
      {!changePage && (
        <SectionConteinerPadronized>
          {error && (
            <ErrorComponent
              errorContent={error}
              onClick={() => setError(null)}
            />
          )}
          <ButtonPushRouteComponent
            title="Criar nova tarefa"
            route="/employee/tasks/create"
            setChangePage={setChangePage}
          />
          {CONFIG_PAGE.map((component) => (
            <TasksContentPadronizedComponent
              key={component.ENDING_POINT}
              endPoint={component.ENDING_POINT}
              firshTaskComponentContent={component.FIRSH_TASK}
              otherTasksContent={component.OTHER_TASKS}
              setError={setError}
            />
          ))}
        </SectionConteinerPadronized>
      )}
    </AnimatePresence>
  );
}
