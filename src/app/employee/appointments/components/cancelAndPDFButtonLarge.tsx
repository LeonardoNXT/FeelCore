import { X } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import PDFButtonComponent from "./PDFbuttonComponent";

export default function LargeCancelButtonComponent({
  setId,
}: {
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
      className="absolute bottom-0 px-2 py-2 bg-[#111] rounded-t-3xl flex gap-2"
      ref={ref}
    >
      {id && <PDFButtonComponent id={id} />}
      <div
        className="h-10 w-10 px-2 py-2 border-1 rounded-full flex justify-center items-center duration-300 hover:rotate-90 hover:bg-red-300 cursor-pointer"
        onClick={handleClick}
      >
        <X className="w-full h-full " />
      </div>
    </div>
  );
}
