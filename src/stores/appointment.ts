import { create } from "zustand";

export interface Appointments {
  _id: string;
  status: "pendente" | "concluido" | "cancelado" | "agendado";
  date: string;
  intendedFor: {
    name: string;
    _id: string;
    avatar?: {
      url: string;
      public_id: string;
    };
  };
}

interface AppointmentsStore {
  appointments: Appointments[];
  setAppointments: (appointments: Appointments[]) => void;
  clearAppointments: () => void;
}

export const useAppointmentsStore = create<AppointmentsStore>((set) => ({
  appointments: [],
  setAppointments: (appointments) => set({ appointments }),
  clearAppointments: () => set({ appointments: [] }),
}));
