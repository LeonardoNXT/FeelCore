"use client";

import CreationSectionPadronized from "@/app/employee/components/creationSectionPadrozided";
import InputComponentPadronized from "@/app/employee/components/inputComponent";
import CreatePatientPasswordComponent from "./createPatientPasswordComponent";
import CreatePatientInputProfile from "./createinputFileComponent";
import InputDatePadronized from "@/app/employee/components/InputDatePadronized";
import useCreatePatient from "@/app/employee/tasks/hook/useCreatePatient";

export type CreatePatientConfig = {
  INPUT_NAME: {
    TITLE: string;
    SUMMARY: string;
    PLACEHOLDER: string;
    MIN_LENGTH: number;
    MAX_LENGTH: number;
  };
  INPUT_EMAIL: {
    TITLE: string;
    SUMMARY: string;
    PLACEHOLDER: string;
    MIN_LENGTH: number;
    MAX_LENGTH: number;
  };
  INPUT_DATE: {
    TITLE: string;
    SUMMARY: string;
  };
  INPUT_PASSWORD: {
    TITLE: string;
    SUMMARY: string;
    PLACEHOLDER: string;
  };
  BUTTON_TEXT: string;
  ROUTE: string;
};

type CreatePatientContentProps = {
  config: CreatePatientConfig;
};

export default function CreatePatientContentForm({
  config,
}: CreatePatientContentProps) {
  const {
    sucess,
    setSucess,
    error,
    setError,
    inputName,
    setInputName,
    inputEmail,
    setInputEmail,
    file,
    setFile,
    password,
    setPassword,
    date,
    setDate,
    createPatient,
  } = useCreatePatient();

  return (
    <CreationSectionPadronized
      success={{
        display: "fixed",
        route: config.ROUTE,
        state: sucess,
        title: "Solicitação criada com sucesso.",
      }}
      error={{ background: "bg-[#fff]", display: "fixed", error, setError }}
    >
      <form
        className="w-full flex flex-col gap-2"
        onSubmit={(e) => {
          e.preventDefault();

          createPatient({
            name: inputName,
            date,
            email: inputEmail,
            password: password.password,
            setError,
            file,
            setSucess,
          });
        }}
      >
        {/* Nome */}
        <InputComponentPadronized
          title={config.INPUT_NAME.TITLE}
          summary={config.INPUT_NAME.SUMMARY}
          placeHolder={config.INPUT_NAME.PLACEHOLDER}
          typeInput="text"
          inputTitle={inputName}
          setInputTitle={setInputName}
          maxLength={config.INPUT_NAME.MAX_LENGTH}
          minLength={config.INPUT_NAME.MIN_LENGTH}
          required
        />

        {/* Email */}
        <InputComponentPadronized
          title={config.INPUT_EMAIL.TITLE}
          summary={config.INPUT_EMAIL.SUMMARY}
          placeHolder={config.INPUT_EMAIL.PLACEHOLDER}
          typeInput="text"
          inputTitle={inputEmail}
          setInputTitle={setInputEmail}
          maxLength={config.INPUT_EMAIL.MAX_LENGTH}
          minLength={config.INPUT_EMAIL.MIN_LENGTH}
          required
        />

        {/* Senha */}
        <CreatePatientPasswordComponent
          password={password}
          setPassword={setPassword}
          title={config.INPUT_PASSWORD.TITLE}
          summary={config.INPUT_PASSWORD.SUMMARY}
          placeholder={config.INPUT_PASSWORD.PLACEHOLDER}
        />

        {/* Foto de Perfil */}
        <CreatePatientInputProfile
          file={file}
          setFile={setFile}
          setError={setError}
        />

        {/* Data de nascimento */}
        <InputDatePadronized
          title={config.INPUT_DATE.TITLE}
          summary={config.INPUT_DATE.SUMMARY}
          date={date}
          setDate={setDate}
          maxDate={new Date().toISOString().split("T")[0]}
        />

        {/* Botão */}
        <button
          type="submit"
          className="mt-3 py-2 rounded-lg bg-[#b8d7ff] text-black font-medium hover:bg-[#9bc9ff] transition"
        >
          {config.BUTTON_TEXT}
        </button>
      </form>
    </CreationSectionPadronized>
  );
}
