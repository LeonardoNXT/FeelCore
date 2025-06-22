"use client";
import { SectionCards } from "@/components/cards/cardsADM";
import { ChartAreaInteractive } from "@/components/graphic/graphicADM";
import { ChartPieDonutText } from "@/components/graphic/graphicADMCHARTAGE";
import { ChartBarInteractive } from "@/components/graphic/graphicADMUSERS";
import { ChartRadarDefault } from "@/components/graphic/graphicRadar";
import { motion } from "framer-motion";
export default function ContentDashboardUsers() {
  return (
    <div className="p-[1vw] bg-[#0e0e0e] rounded-[1vw]">
      <motion.div
        className="w-full bg-[#0c0c0c] rounded-[1vw] ]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <motion.div
          className="border-b border-[#555555] pb-[0.8vw]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.2 }}
        >
          <p className="font-medium text-[1vw] text-white">Dashboard</p>
        </motion.div>
      </motion.div>

      <motion.div
        className="w-full border-b-[1px] pb-[0.8vw] pt-[0.8vw] border-[#333]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        <p className="text-[#333]">Gráfico dos usuários</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.3 }}
      >
        <SectionCards />
      </motion.div>

      <motion.div
        className="w-full mt-[1vw]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.3 }}
      >
        <ChartAreaInteractive />
      </motion.div>

      <motion.div
        className="w-full mt-[1vw] flex items-stretch gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.3 }}
      >
        <div className="w-1/2 h-auto">
          <ChartBarInteractive />
        </div>
        <div className="w-1/2 flex justify-between gap-2">
          <ChartRadarDefault />
          <ChartPieDonutText />
        </div>
      </motion.div>
    </div>
  );
}
