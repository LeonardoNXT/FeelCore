import { X } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import SmallPDFcomponent from "./smallPdfComponent";

export default function CancelAndPdfButtonComponent({
  setId,
  cancelButton,
  pdfButton,
}: {
  setId?: Dispatch<SetStateAction<string | null>>;
  cancelButton: boolean;
  pdfButton: boolean;
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
    if (id && setId) setId(id);
  };

  return (
    <div
      className="absolute bottom-4 px-1 py-1 bg-[#111] rounded-full flex gap-2"
      ref={ref}
    >
      {pdfButton && id && <SmallPDFcomponent id={id} />}
      {cancelButton && setId && (
        <div
          className="h-8 w-8 rounded-full px-2 py-2 flex justify-center items-center duration-200 hover:bg-red-300 hover:rotate-90 cursor-pointer"
          onClick={handleClick}
        >
          <X />
        </div>
      )}
    </div>
  );
}
