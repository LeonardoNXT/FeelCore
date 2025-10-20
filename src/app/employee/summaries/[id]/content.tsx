"use client";

import { Summary } from "@/types/summaries";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function SummaryDetailContent({ id }: { id: string }) {
  const [load, setLoad] = useState<boolean>(true);
  const [summary, setSummary] = useState<Summary | null>(null);
  useEffect(() => {
    const getSummaryPerId = async () => {
      try {
        const response = await fetch(`/api/summaries/get/${id}`, {
          method: "POST",
          credentials: "include",
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Houve um erro interno.");
        }

        setSummary(data.data);
        setLoad(false);
      } catch (err) {
        console.log(err);
        setLoad(false);
      }
    };
    getSummaryPerId();
  }, [id]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full h-full bg-gradient-to-tr from-[#111] to-[#382324] flex justify-center"
    >
      <AnimatePresence>
        {!load ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="min-h-screen h-full md:max-w-[800px] w-full border-l-1 border-r-1 border-dashed px-4"
          >
            {summary ? (
              <div className="w-full py-25 md:py-35">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1, delay: 0.3 }}
                >
                  <span className="w-full flex justify-center tracking-widest">
                    Título
                  </span>
                  <h1 className="text-3xl text-center">{summary.title}</h1>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1, delay: 0.6 }}
                >
                  <p className="mt-10 mb-2 tracking-widest">Descrição</p>
                  <p className="text-justify">{summary.description}</p>
                </motion.div>
              </div>
            ) : (
              <div className="w-full h-screen flex justify-center items-center text-3xl text-center flex-col">
                <p className="text-9xl">404</p>
                Resumo não encontrado.
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full h-screen flex justify-center items-center"
          >
            Carregando...
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
