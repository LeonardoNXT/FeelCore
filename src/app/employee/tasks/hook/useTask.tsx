import { Tasks } from "@/types/TasksReceive";
import { useState } from "react";

export default function useTask() {
  const [otherTasks, setOtherTasks] = useState<Tasks[] | null>(null);
  const [pendingTaskSelected, setPendingTaskSelected] = useState<Tasks | null>(
    null
  );
  const [completeTaskSelected, setCompleteTaskSelected] =
    useState<Tasks | null>(null);

  return {
    otherTasks,
    setOtherTasks,
    pendingTaskSelected,
    setPendingTaskSelected,
    completeTaskSelected,
    setCompleteTaskSelected,
  };
}
