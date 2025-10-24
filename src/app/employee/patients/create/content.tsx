"use client";
import CreatePatientContentForm from "./components/CreatePatientContent";

export const PSYCHOLOGIST_CREATE_PATIENT_CONFIG = {
  INPUT_NAME: {
    TITLE: "Nome do paciente",
    SUMMARY:
      "Informe o nome completo do paciente para prosseguir com o cadastro no sistema.",
    PLACEHOLDER: "Nome do paciente :",
    MIN_LENGTH: 5,
    MAX_LENGTH: 50,
  },
  INPUT_EMAIL: {
    TITLE: "E-mail do paciente",
    SUMMARY:
      "Informe o e-mail do paciente para prosseguir com o cadastro no sistema.",
    PLACEHOLDER: "E-mail do paciente :",
    MIN_LENGTH: 10,
    MAX_LENGTH: 100,
  },
  INPUT_DATE: {
    TITLE: "Data de nascimento do paciente",
    SUMMARY:
      "Informe a data de nascimento do paciente corretamente para garantir o registro adequado.",
  },
  INPUT_PASSWORD: {
    TITLE: "Senha do paciente",
    SUMMARY:
      "Defina uma senha segura para o paciente, contendo no mínimo 8 caracteres, com pelo menos uma letra maiúscula, um número e um caractere especial.",
    PLACEHOLDER: "Senha do paciente :",
  },
  BUTTON_TEXT: "Cadastrar paciente",
  ROUTE: "/employee/patients",
};

export default function CreatePatientContent() {
  return (
    <CreatePatientContentForm config={PSYCHOLOGIST_CREATE_PATIENT_CONFIG} />
  );
}
