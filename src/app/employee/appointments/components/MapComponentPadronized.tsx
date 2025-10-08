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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: (index + 5) / 10 }}
      className={`w-[350px] md:w-[450px] h-full bg-gradient-to-br from-[#ffffff] to-[#ffffff25] ${
        center ? "flex justify-center items-center" : ""
      } rounded-3xl relative`}
    >
      {children}
    </motion.div>
  );
}
