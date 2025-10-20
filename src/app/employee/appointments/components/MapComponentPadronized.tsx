import React from "react";
import { motion } from "framer-motion";

export default function MapComponentPadronized({
  children,
  center,
  index,
}: {
  children: React.ReactNode;
  center: boolean;
  index: number;
}) {
  return (
    <motion.div
      whileHover={{
        scale: 1.02,
        transition: { duration: 0.3, type: "spring", ease: "circInOut" },
      }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
      layout
      key={index}
      transition={{ duration: 0.3, type: "spring", ease: "circInOut" }}
      className={`min-w-[350px] md:min-w-[450px] h-full bg-gradient-to-br from-[#ffffff] to-[#ffffff25] ${
        center ? "flex justify-center items-center" : ""
      } rounded-3xl relative`}
    >
      {children}
    </motion.div>
  );
}
