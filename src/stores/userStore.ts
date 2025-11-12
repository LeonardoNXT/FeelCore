import { MoodDiaryEntry } from "@/app/employee/patients/[id]/components/getMoodDiary";
import { create } from "zustand";

export interface Customer {
  _id: string;
  name: string;
  email: string;
  birth_date: string;
  is_minor: boolean;
  avatar?: {
    url: string;
    public_id: string;
  };
  patient_of: {
    _id: string;
    name: string;
    email: string;
  };
  client_of: {
    _id: string;
    name: string;
  };
  anamnese_pdf?: {
    public_id: string;
    url: string;
  };
  status: "Ativo" | "Inativo";
  mood_diary: MoodDiaryEntry[];

  medical_history: {
    previous_health_problems: string[];
    current_medical_conditions: string[];
    current_medications: string[];
    allergies: string[];
    surgeries: string[];
    hospitalizations: string[];
  };
  assessment: {
    family_history: {
      mental_health_family: string[];
      medical_family_history: string[];
    };
    psychiatric_history: {
      previous_treatments: string[];
      previous_medications: string[];
      previous_hospitalizations: string[];
    };
  };
  treatment_objectives: {
    short_term_goals: string[];
    long_term_goals: string[];
    success_criteria: string[];
  };
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Employee {
  _id: string;
  name: string;
  email: string;
  birthday: string;
  rg?: string;
  cpf?: string;
  phone: string;
  address: string;
  remuneration: number;
  patients: Customer[]; // ou Customer[] se populado
  employee_of: string; // ou Organization se populado
  hireDate: Date;
  avatar?: {
    url?: string;
    public_id?: string;
  };
  status: "Ativo" | "Inativo";
  userfoundOut: false | true;
}

export interface Organization {
  _id: string;
  name: string;
  email: string;
  avatar?: {
    url: string;
    public_id: string;
  };
  employees: Employee[]; // Array de objetos Employee populados
  customers: Customer[]; // Array de objetos Customer populados
}

interface UserState {
  user: Organization | null;
  setUser: (user: Organization) => void;
  clearUser: () => void;
}

interface EmployeeState {
  user: Employee | null;
  setUser: (user: Employee) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));

export const useEmployeeStore = create<EmployeeState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));
