"use client"; // Adicione esta linha no topo
import Image from "next/image";
import { motion } from "framer-motion";

export default function DashboardPage() {
  return (
    <motion.div
      className="bg-[#000000] w-full md:h-[98vh] h-[100vh] flex md:rounded-[2vw] overflow-hidden relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <Image
        src="/background.jpg"
        alt="Background image"
        fill
        className="object-cover sepia-50"
      />
      <div className="w-full h-full relative z-10 backdrop-blur-2xl"></div>
    </motion.div>
  );
}
