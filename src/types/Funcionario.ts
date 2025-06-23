// types/Funcionario.ts
export interface Funcionario {
  password: string;
  name: string;
  email: string;
  birthday: string;
  rg: string;
  cpf: string;
  phone: string;
  address: string;
  remuneration: number;
  avatar?: File | { url?: string; public_id?: string } | null;
  status: "Ativo" | "Inativo";
  hiredata?: string;
}
