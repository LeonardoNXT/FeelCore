import { Appointments } from "@/stores/appointment";
import { motion } from "framer-motion";

export default function CardPadronizedComponent({
  title,
  arrayOfItems,
  from = "#ffffff",
  to = "#beaa6e",
}: {
  title: string;
  arrayOfItems: Appointments[];
  from?: string;
  to?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full my-2 rounded-4xl border-9 border-[#141414] px-3 py-3 relative"
      style={{ background: `linear-gradient(45deg,${from} 0%, ${to} 100%)` }}
    >
      <div className="absolute top-0 left-1/2 translate-x-[-50%] rounded-b-[10px] bg-[#141414] text-[15px] px-4 pb-1">
        <p className="text-[#646464] bg-clip-text text-nowrap">{title}</p>
      </div>
      <div className="flex w-full h-full flex-col items-center py-8 px-4 relative">
        <p className="text-[#222] bg-clip-text text-9xl">
          {arrayOfItems.length > 0 && arrayOfItems.length < 10
            ? `0${arrayOfItems.length}`
            : arrayOfItems.length}
        </p>
      </div>
    </motion.div>
  );
}
