import { Dispatch, SetStateAction } from "react";
import BaseCreateBoxComponent from "./baseCreateBox";

type Props = {
  title: string;
  summary: string;
  date: string;
  setDate: Dispatch<SetStateAction<string>>;
  minDate: string;
  hours?: string;
  setHours?: Dispatch<SetStateAction<string>>;
};

export default function InputDatePadronized({
  title,
  summary,
  date,
  setDate,
  minDate,
  setHours,
  hours,
}: Props) {
  return (
    <BaseCreateBoxComponent title={title} summary={summary}>
      <div className="flex gap-2 text-[14px] ml-1 mb-1">
        <input
          type="date"
          id="input-white-date"
          value={date}
          className="px-3 py-2  bg-[#222] border-1 border-[#333] rounded-full text-[#aaa] focus:outline-2 focus:outline-[#b8d7ff] duration-75 focus:text-[#fff] focus:shadow-[#b8d7ff] focus:shadow-lg"
          min={minDate}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        {setHours && (
          <input
            className="px-3 py-2  bg-[#222] border-1 border-[#333] rounded-full text-[#aaa] focus:outline-2 focus:outline-[#b8d7ff] duration-75 focus:text-[#fff] focus:shadow-[#b8d7ff] focus:shadow-lg"
            type="time"
            id="input-white-date"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            required
          />
        )}
      </div>
    </BaseCreateBoxComponent>
  );
}
