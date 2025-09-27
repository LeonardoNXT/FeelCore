import { CircleX } from "lucide-react";
import CloseButtonComponent from "./closeButton";
import { motion } from "framer-motion";
interface Props {
  errorContent: {
    error: string;
    message?: string;
  };
  onClick: () => void;
  bg?: string;
  display?: "absolute" | "fixed";
}

export default function ErrorComponent({
  errorContent,
  onClick,
  bg = "bg-[#ffffff05]",
  display = "absolute",
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`${display} top-25 md:top-30 w-full max-w-[500px] px-4 md:px-0 z-30 left-1/2 translate-x-[-50%]`}
    >
      <div
        className={`w-full py-2 px-2 ${bg} rounded-3xl shadow-inner shadow-[#00000050] backdrop-blur-2xl`}
      >
        <div className="flex justify-between">
          <div className="flex gap-2 px-3 py-2 rounded-full bg-[#e7e7e74f] shadow-inner shadow-[#00000067] text-[#444]">
            <CircleX className="text-[#ee3a3a]" />
            <p className="mr-1 text-[#bd2222]">{errorContent.error}</p>
          </div>
          <CloseButtonComponent onClick={onClick} />
        </div>
        <div className="px-2 md:py-2 text-2xl rounded-full text-[#444] my-5">
          {errorContent.message}
        </div>
      </div>
    </motion.div>
  );
}
