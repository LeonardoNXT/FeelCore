import { Dispatch, SetStateAction, useEffect, useState } from "react";
import BoxOfInitialPagesComponent from "../../appointments/components/boxOfInitialComponents";
import FirstTaskContent from "./firstTaskComponent";
import { Tasks } from "@/types/TasksReceive";
import { getInitials } from "../../appointments/components/getInitials";
import OtherTasksComponent from "./otherTasksComponent";
import { ErrorApi } from "@/types/ErrorApi";

type BoxOfInitialPagesComponent = {
  title: string;
  summary: string;
  from: string;
  to: string;
};

interface Props {
  endPoint: string;
  firshTaskComponentContent: BoxOfInitialPagesComponent;
  otherTasksContent: {
    title: string;
    summary: string;
    from: string;
    to: string;
  };
  setError: Dispatch<SetStateAction<ErrorApi | null>>;
}

export default function TasksContentPadronizedComponent({
  firshTaskComponentContent,
  otherTasksContent,
  setError,
  endPoint,
}: Props) {
  const [tasks, setTasks] = useState<Tasks[] | null>(null);
  const [first, setFirstTask] = useState<Tasks | null>(null);
  const [otherTasks, setOtherTasks] = useState<Tasks[] | null>(null);

  useEffect(() => {
    const fetchAPITEST = async () => {
      try {
        const response = await fetch(`/api/tasks/${endPoint}`, {
          method: "POST",
          credentials: "include",
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error();
        }
        setTasks(data.data);
        console.log("[GET] : TAREFAS LISTADAS COM SUCESSO", data);
      } catch (err) {
        console.error("[ERRO] :", err);
        setError({
          error: "Houve um erro interno.",
          message: "Tente novamente mais tarde.",
        });
      }
    };
    fetchAPITEST();
  }, [setError, endPoint]);

  useEffect(() => {
    if (!tasks) return;
    if (tasks.length > 0) {
      setFirstTask(tasks[0]);
      setOtherTasks(tasks.slice(1));
      console.log("[TASKS] :", {
        content: tasks,
        total: tasks.length,
        endpoint: endPoint,
      });
    } else {
      setOtherTasks([]);
      console.log("[TASKS] : NÃO HÁ TAREFAS PENDENTES.");
    }
  }, [tasks, endPoint]);

  return (
    <div className="w-full flex flex-col gap-2">
      <BoxOfInitialPagesComponent
        title={firshTaskComponentContent.title}
        summary={firshTaskComponentContent.summary}
        icon
        urlImage={first?.intendedFor.avatar?.url}
        fallbackImage={getInitials(first?.intendedFor.name)}
      >
        <FirstTaskContent
          first={first}
          firshContent={firshTaskComponentContent}
        />
      </BoxOfInitialPagesComponent>

      <OtherTasksComponent
        otherTasks={otherTasks}
        otherTasksContent={otherTasksContent}
      />
    </div>
  );
}
