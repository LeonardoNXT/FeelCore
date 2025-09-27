import { X } from "lucide-react";

export default function CloseButtonComponent({
  onClick,
}: {
  onClick: () => void;
}) {
  return (
    <div
      className=" px-2 py-2 shadow-[#777777] shadow-inner rounded-full z-10 text-[#444]"
      onClick={onClick}
    >
      <X className="w-6 h-6 hover:rotate-90 hover:text-[#913737] duration-300" />
    </div>
  );
}
