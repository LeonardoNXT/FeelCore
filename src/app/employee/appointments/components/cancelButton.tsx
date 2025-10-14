import { X } from "lucide-react";
import { Dispatch, SetStateAction, useRef } from "react";

export default function CancelButtonComponent({
  setId,
}: {
  setId: Dispatch<SetStateAction<string | null>>;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const handleClick = () => {
    const parent = ref.current?.closest("[data-id]");
    const id = parent?.getAttribute("data-id");
    if (id) setId(id);
  };

  return (
    <div className="absolute bottom-4 px-1 py-1 bg-[#111] rounded-full">
      <div
        ref={ref}
        className="h-8 w-8 rounded-full px-2 py-2 flex justify-center items-center duration-200 hover:bg-red-300 hover:rotate-90 cursor-pointer"
        onClick={handleClick}
      >
        <X />
      </div>
    </div>
  );
}
