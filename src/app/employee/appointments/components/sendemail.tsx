import { MoveUpRight } from "lucide-react";

export default function SendEmailToRemember() {
  return (
    <div className="px-2 flex items-center gap-3 mb-3 mt-5">
      <div className="px-3 py-2 bg-gradient-to-br from-[#010101] to-[#241e0f] w-max flex gap-2 items-center rounded-3xl border-1 border-[#333]">
        <p className="text-[#c9c4b6fb] text-[13px] rounded-2xl poppins ">
          Enviar email
        </p>
        <MoveUpRight className="text-[#c9c4b6fb] w-4" />
      </div>
      <div className="w-3 h-3 rounded-full bg-amber-200"></div>
    </div>
  );
}
