import { create } from "zustand";

interface MoodDiaryEntry {
  emotion:
    | "Feliz"
    | "Perfeito"
    | "Triste"
    | "Horrível"
    | "Neutro"
    | "Irritante"
    | "Estressante"
    | "Cansativo"
    | "Chocante"
    | "Ruim"
    | "Intenso";
  intensity: number;
  description: string;
  date: string; // ISO string format
  _id?: string; // MongoDB adiciona automaticamente
}

interface Customer {
  _id: string;
  name: string;
  email: string;
  avatar?: {
    url: string;
    public_id: string;
  };
  password: string;
  age: number;
  patient_of: string; // ObjectId do Employee (ou Employee populado)
  client_of: string; // ObjectId da Organization
  disorders: string[];
  status: "Ativo" | "Inativo";
  mood_diary: MoodDiaryEntry[];
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

interface User {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  employees: Employee[]; // Array de objetos Employee populados
  customers: Customer[]; // Array de objetos Customer populados
}

interface UserState {
  user: User | null;
  setUser: (user: User) => void;
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
