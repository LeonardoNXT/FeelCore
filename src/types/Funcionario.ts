// types/Funcionario.ts
export interface Funcionario {
  name: string;
  email: string;
  birthday: string;
  rg: string;
  cpf: string;
  phone: string;
  address: string;
  remuneration: number;
  avatar?: {
    url?: string;
    public_id?: string;
  };
  status: "Ativo" | "Inativo";
  hiredata?: string;
}
