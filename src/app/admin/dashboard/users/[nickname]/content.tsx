"use client";
import { SectionCards } from "@/components/cards/cardsADM";
import { ChartAreaInteractive } from "@/components/graphic/graphicADM";
import { ChartPieDonutText } from "@/components/graphic/graphicADMCHARTAGE";
import { ChartBarInteractive } from "@/components/graphic/graphicADMUSERS";
import { ChartRadarDefault } from "@/components/graphic/graphicRadar";
import { motion } from "framer-motion";

export default function ContentDashboardUsers() {
  return (
    <div className="p-2 sm:p-4 lg:p-[1vw] bg-[#0e0e0e] rounded-lg lg:rounded-[1vw]">
      <motion.div
        className="w-full bg-[#0c0c0c] rounded-lg lg:rounded-[1vw]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <motion.div
          className="border-b border-[#555555] pb-3 sm:pb-4 lg:pb-[0.8vw]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.2 }}
        >
          <p className="font-medium text-lg sm:text-xl lg:text-[1vw] text-white">
            Dashboard
          </p>
        </motion.div>
      </motion.div>

      <motion.div
        className="w-full border-b border-[#333] pb-3 pt-3 sm:pb-4 sm:pt-4 lg:pb-[0.8vw] lg:pt-[0.8vw]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        <p className="text-sm sm:text-base text-[#333]">Gráfico dos usuários</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.3 }}
      >
        <SectionCards />
      </motion.div>

      <motion.div
        className="w-full mt-4 lg:mt-[1vw]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.3 }}
      >
        <ChartAreaInteractive />
      </motion.div>

      <motion.div
        className="w-full mt-4 lg:mt-[1vw] flex flex-col lg:flex-row items-stretch gap-2 lg:gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.3 }}
      >
        {/* Gráfico de barras */}
        <div className="w-full lg:w-1/2 h-auto mb-4 lg:mb-0">
          <ChartBarInteractive />
        </div>

        {/* Container dos outros gráficos - flex-col em mobile, flex-row em desktop */}
        <div className="w-full lg:w-1/2 flex flex-col lg:flex-row justify-between gap-2">
          <div className="w-full mb-4 lg:mb-0">
            <ChartRadarDefault />
          </div>
          <div className="w-full">
            <ChartPieDonutText />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
