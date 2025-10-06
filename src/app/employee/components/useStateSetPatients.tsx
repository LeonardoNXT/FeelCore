import { useState } from "react";

export interface Patient {
  _id: string;
  name: string;
  avatar?: {
    url: string;
    public_id: string;
  };
  status: "Ativo" | "Inativo";
}

const functions = {
  verifySeletedPatient(patient: Patient | null) {
    return patient !== null;
  },
};

export default function useSetPatient() {
  const [patients, setPatients] = useState<Patient[] | null>(null);
  const [patientSelected, setPatientSelected] = useState<Patient | null>(null);

  return {
    patients,
    setPatients,
    patientSelected,
    setPatientSelected,
    ...functions,
  };
}
