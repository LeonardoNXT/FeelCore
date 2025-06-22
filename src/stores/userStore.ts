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
  password: string;
  age: number;
  patient_of: string; // ObjectId do Employee (ou Employee populado)
  client_of: string; // ObjectId da Organization
  disorders: string[];
  mood_diary: MoodDiaryEntry[];
}

interface Employee {
  _id: string;
  name: string;
  email: string;
  age: number;
  remuneration: number;
  patients: string[]; // Array de ObjectIds dos Customers (ou Customers populados)
  employee_of: string; // ObjectId da Organization
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

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));
