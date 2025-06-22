// stores/funcionarioStore.ts
import { create } from "zustand";
import { Funcionario } from "@/types/Funcionario";

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
