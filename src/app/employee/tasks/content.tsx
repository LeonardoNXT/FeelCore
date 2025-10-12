"use client";

import { useEffect, useState } from "react";
import BoxOfInitialPagesComponent from "../appointments/components/boxOfInitialComponents";
import SectionConteinerPadronized from "../components/sectionAndComponentPadronized";
import { useTasksStore } from "@/stores/tasksStore";
import useSetError from "../appointments/hooks/useSetError";
import ErrorComponent from "../appointments/components/errorComponent";
import { Tasks } from "@/types/TasksReceive";
import useTask from "./hook/useTask";
import PendingTaskComponent from "./components/pendingTaskComponent";
import OtherTasksComponent from "./components/otherTasksComponent";
import { getInitials } from "../appointments/components/getInitials";
import FirstPendingTaskContent from "./components/firstTaskComponent";

export default function TaskContent() {
  const { tasks, setTasks } = useTasksStore();
  const { error, setError } = useSetError();
  const [first, setFirstTask] = useState<Tasks | null>(null);
  const {
    otherTasks,
    setOtherTasks,
    pendingTaskSelected,
    setPendingTaskSelected,
  } = useTask();

  useEffect(() => {
    const fetchAPITEST = async () => {
      try {
        const response = await fetch("/api/tasks/pending", {
          method: "POST",
          credentials: "include",
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error();
        }
        setTasks(data);
        console.log("[GET] : TAREFAS LISTADAS COM SUCESSO");
      } catch (err) {
        console.error("[ERRO] :", err);
        setError({
          error: "Houve um erro interno.",
          message: "Tente novamente mais tarde.",
        });
      }
    };
    fetchAPITEST();
  }, [setTasks, setError]);

  useEffect(() => {
    const pending = tasks.pendingTasks;
    if (pending.length > 0) {
      setFirstTask(pending[0]);
      setOtherTasks(pending.slice(1));
      console.log("[TASKS] :", {
        content: pending,
        total: pending.length,
      });
    } else {
      console.log("[TASKS] : NÃO HÁ TAREFAS PENDENTES.");
    }
  }, [tasks, setOtherTasks]);

  if (pendingTaskSelected) {
    return (
      <PendingTaskComponent
        pendingTaskSelected={pendingTaskSelected}
        setPendingTaskSelected={setPendingTaskSelected}
        setError={setError}
      />
    );
  } else {
    return (
      <SectionConteinerPadronized>
        {error && (
          <ErrorComponent errorContent={error} onClick={() => setError(null)} />
        )}

        <BoxOfInitialPagesComponent
          title="Primeira tarefa pendente"
          summary="Visualize e acompanhe todas as tarefas que ainda precisam ser concluídas."
          icon
          urlImage={first?.intendedFor.avatar?.url}
          fallbackImage={getInitials(first?.intendedFor.name)}
        >
          <FirstPendingTaskContent
            first={first}
            setPendingTaskSelected={setPendingTaskSelected}
          />
        </BoxOfInitialPagesComponent>

        <OtherTasksComponent
          otherTasks={otherTasks}
          setPendingTaskSelected={setPendingTaskSelected}
        />
      </SectionConteinerPadronized>
    );
  }
}
