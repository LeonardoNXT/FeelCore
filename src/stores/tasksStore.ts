import { TasksPending } from "@/types/TasksReceive";
import { create } from "zustand";

interface TasksStore {
  tasks: TasksPending;
  setTasks: (data: Partial<TasksPending>) => void;
  resetTasks: () => void;
}

export const useTasksStore = create<TasksStore>((set) => ({
  tasks: {
    message: "",
    pendingTasks: [],
  },
  setTasks: (data) =>
    set((state) => ({
      tasks: {
        ...state.tasks,
        ...data,
      },
    })),
  resetTasks: () =>
    set({
      tasks: {
        message: "",
        pendingTasks: [],
      },
    }),
}));
