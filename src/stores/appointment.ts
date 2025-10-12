import { create } from "zustand";

export interface Appointments {
  _id: string;
  status: "disponivel" | "agendado" | "cancelado" | "concluido";
  startTime: string;
  endTime: string;
  duration: number;
  intendedFor?: {
    name: string;
    _id: string;
    avatar?: {
      url: string;
      public_id: string;
    };
  };
}

export interface AppointmentsScheduled {
  _id: string;
  status: "disponivel" | "agendado" | "cancelado" | "concluido";
  startTime: string;
  endTime: string;
  duration: number;
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

interface AppointmentsScheduledStore {
  appointments: AppointmentsScheduled[];
  setAppointments: (appointments: AppointmentsScheduled[]) => void;
  clearAppointments: () => void;
}

export const useAppointmentsStore = create<AppointmentsStore>((set) => ({
  appointments: [],
  setAppointments: (appointments) => set({ appointments }),
  clearAppointments: () => set({ appointments: [] }),
}));

export const useAppointmentsScheduleStore = create<AppointmentsScheduledStore>(
  (set) => ({
    appointments: [],
    setAppointments: (appointments) => set({ appointments }),
    clearAppointments: () => set({ appointments: [] }),
  })
);
