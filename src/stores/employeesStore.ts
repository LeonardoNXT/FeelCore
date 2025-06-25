import { create } from "zustand";
import { Employee } from "@/types/EmplooyesReceive";

interface EmployeesState {
  employees: Employee[];
  total: number;
  setEmployees: (data: { employees: Employee[]; total: number }) => void;
  hasFetched: boolean;
  setHasFetched: (value: boolean) => void;
}

export const useEmployeesStore = create<EmployeesState>((set) => ({
  employees: [],
  total: 0,
  hasFetched: false,
  setEmployees: ({ employees, total }) => set({ employees, total }),
  setHasFetched: (value) => set({ hasFetched: value }),
}));
