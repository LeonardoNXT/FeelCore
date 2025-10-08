// stores/funcionarioStore.ts
import { create } from "zustand";
import { Funcionario } from "@/types/Funcionario";
import { Tasks, TasksPending } from "@/types/TasksReceive";

interface FuncionarioStore {
  funcionario: Partial<Funcionario>;
  setFuncionario: (data: Partial<Funcionario>) => void;
  resetFuncionario: () => void;
}

export const useFuncionarioStore = create<FuncionarioStore>((set) => ({
  funcionario: {},
  setFuncionario: (data) =>
    set((state) => ({
      funcionario: {
        ...state.funcionario,
        ...data,
      },
    })),
  resetFuncionario: () => set({ funcionario: {} }),
}));

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
