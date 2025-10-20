"use client";

import { useState } from "react";
import SetPatientComponent from "../../components/setPatient";
import useSetPatient from "../../components/useStateSetPatients";
import InputComponentPadronized from "../../components/inputComponent";
import useSetError from "../../appointments/hooks/useSetError";
import useButtonFetch from "../../appointments/hooks/useButtonFetch";
import CreationSectionPadronized from "../../components/creationSectionPadrozided";

const CONFIG = {
  INPUT_TEXT: {
    MIN: 10,
    MAX: 80,
  },
  INPUT_TEXTAREA: {
    MIN: 20,
    MAX: 500,
  },
};

export default function SummaryCreateContent() {
  const {
    patients,
    setPatients,
    setPatientSelected,
    patientSelected,
    verifySeletedPatient,
  } = useSetPatient();
  const [inputTitle, setInputTitle] = useState<string>("");
  const [inputDescription, setInputDescription] = useState<string>("");
  const { error, setError } = useSetError();
  const { fetchState, setFetchState, stateButton } = useButtonFetch();
  const [sucess, setSucess] = useState<boolean>(false);

  const verifyPatient = () => {
    if (!verifySeletedPatient(patientSelected)) {
      setError({
        error: "Nenhum Paciente foi selecionado.",
        message: "Selecione um paciente para continuar.",
      });
      setFetchState(null);
      return verifySeletedPatient(patientSelected);
    }
    return verifySeletedPatient(patientSelected);
  };

  const verifyInputs = () => {
    if (inputTitle.length < CONFIG.INPUT_TEXT.MIN) {
      setError({
        error: "O título é muito pequeno.",
        message: `A quantidade mínina é de ${CONFIG.INPUT_TEXT.MIN} caractéres.`,
      });
      setFetchState(null);
      return inputTitle.length <= CONFIG.INPUT_TEXT.MIN;
    }
    if (inputDescription.length <= CONFIG.INPUT_TEXTAREA.MIN) {
      setError({
        error: "A descrição é muito pequena.",
        message: `A quantidade mínina é ${CONFIG.INPUT_TEXTAREA.MIN} de  caractéres.`,
      });
      setFetchState(null);
      return inputDescription.length >= CONFIG.INPUT_TEXTAREA.MIN;
    }
    return true;
  };

  const createSummaryApi = async () => {
    if (verifyPatient() && verifyInputs()) {
      if (!patientSelected) return;

      try {
        const response = await fetch("/api/summaries/create", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: patientSelected._id,
            title: inputTitle,
            description: inputDescription,
          }),
        });
        console.log(await response.json());
        if (!response.ok) {
          throw new Error();
        }
        setSucess(true);
      } catch (err) {
        console.log(err);
        setError({
          error: "Houve um erro interno.",
          message: "Tente novamente mais tarde.",
        });
        setFetchState(null);
      }
    }
  };

  return (
    <CreationSectionPadronized
      error={{ display: "fixed", background: "bg-[#fff]", error, setError }}
      success={{
        display: "fixed",
        state: sucess,
        title: "Resumo criado com sucesso.",
        route: "/employee/summaries",
      }}
    >
      <SetPatientComponent
        patients={patients}
        setPatients={setPatients}
        patientSelected={patientSelected}
        setPatientSelected={setPatientSelected}
        title="Selecione um paciente para o criar um resumo."
      />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setFetchState("pending");
          createSummaryApi();
        }}
        className="w-full flex flex-col gap-2"
      >
        <InputComponentPadronized
          title="Título da tarefa"
          summary="Adicione um título descritivo para facilitar a organização e visualização do resumo."
          placeHolder="Título :"
          setInputTitle={setInputTitle}
          inputTitle={inputTitle}
          typeInput="text"
          maxLength={CONFIG.INPUT_TEXT.MAX}
          minLength={CONFIG.INPUT_TEXT.MIN}
        />
        <InputComponentPadronized
          title="Descrição da tarefa"
          summary="Inclua uma explicação sobre o conteúdo ou propósito da resumo, para orientá-lo durante sua visualização."
          placeHolder="Descrição :"
          setInputTitle={setInputDescription}
          inputTitle={inputDescription}
          typeInput="textarea"
          maxLength={CONFIG.INPUT_TEXTAREA.MAX}
          minLength={CONFIG.INPUT_TEXTAREA.MIN}
        />
        <div className="w-full flex justify-end">
          <button
            type="submit"
            className="px-5 w-full py-3 bg-[#181818] text-[16px] text-[#fff] border-2 hover:border-[#b8d7ff] hover:shadow-2xl hover:shadow-[#b8d7ff] rounded-4xl cursor-pointer duration-300 hover:bg-[#000000b7] hover:text-[#fff]"
          >
            {stateButton(fetchState, {
              pending: "Carregando...",
              completed: "Criado com sucesso",
              null: "Criar Resumo",
            })}
          </button>
        </div>
      </form>
    </CreationSectionPadronized>
  );
}
