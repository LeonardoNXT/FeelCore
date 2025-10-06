import { Dispatch, SetStateAction, useState } from "react";
import BaseCreateBoxComponent from "./baseCreateBox";
import { ErrorAPI } from "../appointments/hooks/useSetError";
import { List } from "../tasks/create/context";
import { MoveRight } from "lucide-react";

type Props = {
  title: string;
  summary: string;
  setError: Dispatch<SetStateAction<ErrorAPI | null>>;
  list: List;
  setList: Dispatch<SetStateAction<List>>;
  min: number;
  max: number;
};

export default function ListCreateComponent({
  title,
  summary,
  list,
  setList,
  setError,
  min,
  max,
}: Props) {
  const [listInput, setListInput] = useState<string>("");
  const ListInput = () => {
    if (listInput.length < min) {
      return setError({
        error: `A quantidade mínima de caracter é ${min}`,
        message: `Coloque um valor acima da quantidade mínima: ${min}`,
      });
    }
    setList((prev) => ({
      ...prev,
      list: [...prev.list, listInput],
    }));
    setListInput("");
  };
  const colorLimit = ["text-[#7c2a2a]", "text-[#b8d7ff]", "text-[#333]"];
  function getColor(inputLength: number) {
    if (inputLength < min) return colorLimit[0];
    if (inputLength >= min && inputLength < max) return colorLimit[1];
    if (inputLength === max) return colorLimit[2];
  }
  return (
    <BaseCreateBoxComponent title={title} summary={summary}>
      <div className="w-full flex flex-col gap-2">
        <div className="relative w-full px-1">
          <textarea
            className="bg-[#111] w-full md:w-full h-50 px-4 py-4 border-1 border-[#333] rounded-3xl text-[16px] resize-none focus:outline-2 focus:outline-[#b8d7ff] duration-75 focus:shadow-[#b8d7ff] focus:shadow-lg shadow-2xl shadow-[#000]"
            placeholder="Tarefa :"
            id="textarea"
            value={listInput}
            onChange={(e) => setListInput(e.target.value)}
            maxLength={max}
          ></textarea>
          <div
            className={`text-[14px] absolute ${getColor(
              listInput.length
            )} bottom-4 right-4 duration-300`}
          >
            {listInput.length} / {max}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2 md:gap-0 md:flex-row justify-between items-center px-1 py-1">
        <div className="px-1 w-full py-1 text-nowrap bg-[#222] border-1 border-[#333] duration-300 md:w-max justify-between md:justify-start flex gap-2 rounded-full text-[14px] cursor-pointer relative z-10">
          <p
            className={`px-3 py-2  ${
              list.style == "not ordered"
                ? "bg-[#2b3142]"
                : "bg-[#111] hover:bg-[#222]"
            } rounded-full border-1 border-[#333S]`}
            onClick={() =>
              setList((prev) => ({
                ...prev,
                style: "not ordered",
              }))
            }
          >
            Não ordenado
          </p>
          <p
            className={`px-3 py-2 duration-300 ${
              list.style == "ordered"
                ? "bg-[#2b3142]"
                : "bg-[#111] hover:bg-[#222]"
            } rounded-full border-1 border-[#333S]`}
            onClick={() =>
              setList((prev) => ({
                ...prev,
                style: "ordered",
              }))
            }
          >
            Ordenado
          </p>
        </div>
        <div className="flex-col md:flex-row flex gap-2 w-full justify-between md:w-max md:justify-start">
          <button
            className="px-4 w-full py-2 h-max rounded-full bg-[#eee] text-[#333] text-[16px] flex gap-2 cursor-pointer justify-center hover:text-[#fff] border-2 hover:border-[#88a0e2] hover:bg-[#222] hover:shadow-2xl hover:shadow-[#88a0e2] duration-300  border-[#333] relative z-10"
            onClick={ListInput}
            type="button"
          >
            <span>Listar</span>
            <MoveRight className="w-[20px]" />
          </button>
        </div>
      </div>
    </BaseCreateBoxComponent>
  );
}
