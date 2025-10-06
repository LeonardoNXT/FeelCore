import { Dispatch, SetStateAction } from "react";
import BaseCreateBoxComponent from "./baseCreateBox";

interface Props {
  title: string;
  inputTitle: string;
  setInputTitle: Dispatch<SetStateAction<string>>;
  typeInput: "text" | "textarea";
  placeHolder: string;
  summary: string;
  maxLength: number;
  minLength: number;
}

export default function InputComponentPadronized({
  title,
  maxLength,
  minLength,
  setInputTitle,
  inputTitle,
  typeInput,
  summary,
  placeHolder,
}: Props) {
  const colorLimit = ["text-[#7c2a2a]", "text-[#b8d7ff]", "text-[#333]"];
  const positionsLimit = ["top-1/2 translate-y-[-50%]", "bottom-4"];
  const inputLength = inputTitle.length;

  function getPosition() {
    if (typeInput == "text") return positionsLimit[0];
    else if (typeInput == "textarea") return positionsLimit[1];
  }

  function getColor(inputLength: number) {
    if (inputLength < minLength) return colorLimit[0];
    if (inputLength >= minLength && inputLength < maxLength)
      return colorLimit[1];
    if (inputLength === maxLength) return colorLimit[2];
  }
  return (
    <BaseCreateBoxComponent title={title} summary={summary}>
      <div className="pt-2 w-full">
        <div className={`w-full relative ${typeInput == "textarea" && "h-50"}`}>
          {typeInput == "text" ? (
            <input
              type={typeInput}
              className="w-full text-[16px] bg-[#161616] px-4 pr-20 py-2 border-1 border-[#333] shadow-2xl shadow-[#000] rounded-full text-[#fff] focus:outline-2 focus:outline-[#b8d7ff] duration-75 focus:shadow-[#b8d7ff] focus:shadow-lg"
              placeholder={placeHolder}
              maxLength={maxLength}
              onChange={(e) => setInputTitle(e.target.value)}
              required
            />
          ) : (
            <textarea
              className="w-full bg-[#161616] px-4 py-4 pb-10 rounded-3xl border-1 border-[#333] h-50 resize-none text-[16px] shadow-2xl shadow-[#000] focus:outline-2 focus:outline-[#b8d7ff] duration-75 focus:shadow-[#b8d7ff] focus:shadow-lg"
              placeholder={placeHolder}
              maxLength={maxLength}
              onChange={(e) => setInputTitle(e.target.value)}
              required
            ></textarea>
          )}
          <div
            className={`absolute right-4 ${getPosition()}  duration-200 ${getColor(
              inputLength
            )} text-[14px]`}
          >
            {`${inputLength} / ${maxLength}`}
          </div>
        </div>
      </div>
    </BaseCreateBoxComponent>
  );
}
