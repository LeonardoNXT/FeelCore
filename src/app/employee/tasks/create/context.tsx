"use client";
import { useEffect, useState } from "react";
import useSetPatient from "../../components/useStateSetPatients";
import InputComponentPadronized from "../../components/inputComponent";
import useSetError from "../../appointments/hooks/useSetError";
import InputDatePadronized from "../../components/InputDatePadronized";
import useSetDate from "../../appointments/hooks/useSetHours";
import useButtonFetch from "../../appointments/hooks/useButtonFetch";
import CreationSectionPadronized from "../../components/creationSectionPadrozided";
import dynamic from "next/dynamic";
const SetPatientComponent = dynamic(
  () => import("../../components/setPatient")
);
const ListCreateComponent = dynamic(
  () => import("../../components/listComponent")
);
const ListAddedComponent = dynamic(
  () => import("../../components/listAddedComponent")
);
const InputFileComponent = dynamic(
  () => import("../../components/inputFileComponent")
);

export interface List {
  list: string[] | [];
  style: "not ordered" | "ordered";
}

const LIMIT_DATE = new Date().toISOString().split("T")[0]; // hoje
const CONFIG = {
  INPUT_TEXT: {
    MIN: 10,
    MAX: 60,
  },
  INPUT_TEXTAREA: {
    MIN: 20,
    MAX: 999,
  },
  INPUT_LIST: {
    MIN: 5,
    MAX: 500,
  },
};

export default function CreateTasksContent() {
  const { date, setDate, hours, setHours, verifyFutureDate, getTime } =
    useSetDate();
  const { fetchState, setFetchState, stateButton } = useButtonFetch();
  const [inputTitle, setInputTitle] = useState<string>("");
  const [list, setList] = useState<List>({ list: [], style: "not ordered" });
  const [inputDescription, setInputDescription] = useState<string>("");
  const { error, setError } = useSetError();
  const {
    patients,
    setPatients,
    patientSelected,
    setPatientSelected,
    verifySeletedPatient,
  } = useSetPatient();
  const [sucess, setSucess] = useState<boolean>(false);
  const [archive, setArchive] = useState<File | null>(null);

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
    if (
      inputTitle.length < CONFIG.INPUT_TEXT.MIN ||
      inputDescription.length < CONFIG.INPUT_TEXTAREA.MIN
    ) {
      setError({
        error:
          "Os itens 'Título' ou 'Descrição' não foram preenchidos corretamente.",
        message: `Confira a quantidade mínima de caractéres conforme o estipulado.`,
      });
      setFetchState(null);
      return false;
    }
    return true;
  };

  const verifyDate = (): boolean => {
    if (date === null || hours === null) {
      setFetchState(null);
      setError({
        error: "Data indefida ou data invalida.",
        message: "Insira uma data válida nos campos.",
      });
      return false;
    }

    if (!verifyFutureDate(date, hours)) {
      setFetchState(null);
      setError({
        error: "A data definida é passada.",
        message:
          "Insira uma data futura para que a tarefa possa ser agendada corretamente.",
      });
      return false;
    }
    return true;
  };

  const createTaskApi = async () => {
    if (verifyDate() && verifyPatient() && verifyInputs()) {
      const formData = new FormData();
      formData.append("intendedFor", String(patientSelected?._id));
      formData.append("title", inputTitle);
      formData.append("description", inputDescription);
      formData.append("completionDate", String(getTime(date, hours)));
      if (list.list.length > 0) {
        console.log("steps");
        formData.append("steps", JSON.stringify(list));
      }
      if (archive) {
        formData.append("archive", archive);
      }
      try {
        const response = await fetch("/api/tasks/create", {
          method: "POST",
          credentials: "include",
          body: formData,
        });
        if (!response.ok) {
          throw new Error();
        }
        setError(null);
        setSucess(true);
      } catch (err) {
        console.log(err);
        setError({
          error: "Houve um erro interno.",
          message: "Tente novamente mais tarde.",
        });
      }
    }
  };
  useEffect(() => {
    console.log(patientSelected?._id);
  }, [patientSelected]);

  return (
    <CreationSectionPadronized
      error={{
        background: "bg-[#fff]",
        display: "fixed",
        error: error,
        setError: setError,
      }}
      success={{
        display: "fixed",
        route: "/employee/tasks",
        state: sucess,
        title: "Tarefa criada com sucesso.",
      }}
    >
      <SetPatientComponent
        patients={patients}
        setPatients={setPatients}
        patientSelected={patientSelected}
        setPatientSelected={setPatientSelected}
        title="Para registrar uma nova tarefa, selecione um paciente."
      />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setFetchState("pending");
          createTaskApi();
        }}
        className="w-full flex flex-col gap-2"
      >
        <InputFileComponent
          title="Anexar Arquivo"
          archive={archive}
          setArchive={setArchive}
          setError={setError}
        />
        <InputComponentPadronized
          title="Título da tarefa"
          summary="Adicione um título descritivo para facilitar a organização e visualização da tarefa."
          placeHolder="Título :"
          setInputTitle={setInputTitle}
          inputTitle={inputTitle}
          typeInput="text"
          maxLength={CONFIG.INPUT_TEXT.MAX}
          minLength={CONFIG.INPUT_TEXT.MIN}
        />
        <InputComponentPadronized
          title="Descrição da tarefa"
          summary="Inclua uma explicação sobre o conteúdo ou propósito da tarefa, para orientar o paciente durante sua execução."
          placeHolder="Descrição :"
          setInputTitle={setInputDescription}
          inputTitle={inputDescription}
          typeInput="textarea"
          maxLength={CONFIG.INPUT_TEXTAREA.MAX}
          minLength={CONFIG.INPUT_TEXTAREA.MIN}
        />
        <ListCreateComponent
          title="Lista da Tarefa"
          summary="Insira tarefas a serem realizadas pelo paciente."
          list={list}
          setList={setList}
          setError={setError}
          min={CONFIG.INPUT_LIST.MIN}
          max={CONFIG.INPUT_LIST.MAX}
        />
        <ListAddedComponent
          title="Item da lista"
          summary="Adicione os itens que compõem a tarefa, detalhando cada passo que o paciente deve seguir para concluí-la corretamente."
          list={list}
          setList={setList}
        />
        <InputDatePadronized
          title={"Data da tarefa"}
          summary={
            "Informe o prazo previsto para que o paciente visualize quando precisa finalizar a tarefa."
          }
          date={date}
          setDate={setDate}
          minDate={LIMIT_DATE}
          hours={hours}
          setHours={setHours}
        />
        <div className="w-full flex justify-end">
          <button
            type="submit"
            className="px-5 w-full py-3 bg-[#181818] text-[16px] text-[#fff] border-2 hover:border-[#b8d7ff] hover:shadow-2xl hover:shadow-[#b8d7ff] rounded-4xl cursor-pointer duration-300 hover:bg-[#000000b7] hover:text-[#fff]"
          >
            {stateButton(fetchState, {
              pending: "Carregando...",
              completed: "Criado com sucesso",
              null: "Criar Tarafa",
            })}
          </button>
        </div>
      </form>
    </CreationSectionPadronized>
  );
}
