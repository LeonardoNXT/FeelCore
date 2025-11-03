"use client";
import { SectionCards } from "@/components/cards/cardsADM";
import { ChartAreaInteractive } from "@/components/graphic/graphicADM";
import { ChartPieDonutText } from "@/components/graphic/graphicADMCHARTAGE";
import { ChartBarInteractive } from "@/components/graphic/graphicADMUSERS";
import { motion } from "framer-motion";

export default function ContentDashboardUsers() {
  return (
    <div className="p-2 sm:p-4 lg:p-[1vw] border-1  rounded-lg lg:rounded-[1vw]">
      <motion.div
        className="w-full rounded-lg lg:rounded-[1vw]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <motion.div
          className="border-b border-[#acacac42] pb-3 sm:pb-4 lg:pb-[0.8vw]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.2 }}
        >
          <p className="text-lg font-semibold sm:text-xl lg:text-[1vw] text-[#333]">
            Gráfico de Usuário
          </p>
        </motion.div>
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
          <div className="w-full">
            <ChartPieDonutText />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
