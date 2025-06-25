export interface Employee {
  _id: string;
  name: string;
  email: string;
  birthday: string;
  rg: string;
  cpf: string;
  phone: string;
  address: string;
  remuneration: number;
  patients: Array<object>;
  employee_of: {
    _id: string;
    name: string;
  };
  hireDate: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  avatar?: {
    url: string;
    public_id: string;
  };
}
