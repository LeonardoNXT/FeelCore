import { Appointments } from "@/stores/appointment";
import { Customer } from "@/stores/userStore";
import { motion } from "framer-motion";

export default function CardPadronizedComponent({
  title,
  arrayOfItems,
  from = "#ffffff",
  to = "#beaa6e",
  fontSize = "text-9xl",
  borderSize = "9",
  borderColor = "#141414",
  my = 2,
  mt = 2,
}: {
  title: string;
  fontSize?: string;
  arrayOfItems: Appointments[] | Customer[] | string | number;
  content?: string;
  from?: string;
  to?: string;
  my?: number;
  mt?: number;
  borderSize?: string;
  borderColor?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className={`w-full my-${my} mt-${mt} rounded-4xl border-[${borderColor}] px-3 py-3 relative`}
      style={{
        background: `linear-gradient(45deg,${from} 0%, ${to} 100%)`,
        border: `${borderSize}px solid ${borderColor}`,
      }}
    >
      <div
        className={`absolute top-0 left-1/2 translate-x-[-50%] rounded-b-[10px] text-[15px] px-4 pb-1`}
        style={{ background: borderColor }}
      >
        <p className="text-[#646464] bg-clip-text text-nowrap">{title}</p>
      </div>
      <div className="flex w-full h-full flex-col items-center py-8 px-4 relative">
        <p className={`text-[#222] bg-clip-text ${fontSize}`}>
          {Array.isArray(arrayOfItems)
            ? arrayOfItems.length > 0 && arrayOfItems.length < 10
              ? `0${arrayOfItems.length}`
              : arrayOfItems.length
            : arrayOfItems}
        </p>
      </div>
    </motion.div>
  );
}
