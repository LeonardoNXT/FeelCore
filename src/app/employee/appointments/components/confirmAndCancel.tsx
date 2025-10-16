import { Check, X } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { ChooseOptionProps } from "./confirmPastAppointmentsComponent";
import SmallPDFcomponent from "./smallPdfComponent";

export default function ConfirmAndCancelComponent({
  setChooseOption,
  setId,
}: {
  setChooseOption: Dispatch<SetStateAction<ChooseOptionProps>>;
  setId: Dispatch<SetStateAction<string | null>>;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [id, setIdToPdf] = useState<string | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    const parent = ref.current?.closest("[data-id]");
    const id = parent?.getAttribute("data-id");

    if (id) setIdToPdf(id);
  }, [ref]);

  const handleClick = () => {
    const parent = ref.current?.closest("[data-id]");
    const id = parent?.getAttribute("data-id");
    if (id) setId(id);
  };

  return (
    <div
      className="flex absolute bottom-4 px-1 gap-4 rounded-full py-1 bg-[#1f1f1f]"
      ref={ref}
    >
      <div
        className="h-8 w-8 px-2 py-2 flex justify-center items-center rounded-full duration-200 hover:bg-red-300 hover:rotate-90 cursor-pointer"
        onClick={() => {
          setChooseOption("CANCEL");
          handleClick();
        }}
      >
        <X />
      </div>
      {id && <SmallPDFcomponent id={id} />}
      <div
        className="h-8 w-8 px-2 py-2 flex justify-center items-center rounded-full duration-200 hover:bg-green-300 hover:rotate-[-20deg] cursor-pointer"
        onClick={() => {
          setChooseOption("COMPLETE");
          handleClick();
        }}
      >
        <Check />
      </div>
    </div>
  );
}
