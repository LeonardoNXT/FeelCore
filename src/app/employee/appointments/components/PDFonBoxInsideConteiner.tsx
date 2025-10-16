"use client";
import { useState } from "react";
import BoxOfInitialPagesComponent from "./boxOfInitialComponents";
import { LoaderCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function PdfOnBoxInsideConteiner({
  title,
  summary,
  color,
  pdfEndpoint,
}: {
  title: string;
  summary: string;
  color: string;
  pdfEndpoint: string;
}) {
  const [load, setLoad] = useState<boolean>(false);

  const getPdf = async () => {
    try {
      const response = await fetch(`/api/${pdfEndpoint}`, {
        method: "POST",
        credentials: "include",
      });
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `agendamento_${Date.now}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setLoad(false);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (err) {
      console.error(err);
    }
  };

  console.log("[ pdfEndpoint ]", pdfEndpoint);
  return (
    <BoxOfInitialPagesComponent title={title} summary={summary} icon={false}>
      <div
        className="mt-10 w-full h-50 rounded-3xl flex justify-center items-center px-10"
        style={{
          background: `linear-gradient(45deg,#FFFFFF 0%, ${color} 100%)`,
        }}
      >
        <div className="w-full md:max-w-[400px] px-2 py-2 bg-gradient-to-br from-[#ffff] rounded-full flex justify-between items-center">
          <div className="h-10 w-10 rounded-full flex justify-center items-center text-[#eee] text-[10px] bg-[#111]">
            PDF
          </div>
          <motion.div
            layout
            transition={{ duration: 0.8, ease: "easeInOut", type: "tween" }}
            className={`h-10 py-1 bg-[#222] rounded-full text-[#bbb] text-[12px] border-1 tracking-wider duration-200 select-none flex justify-center items-center ${
              load
                ? "cursor-not-allowed w-10 px-2"
                : "hover:bg-[#111] hover:text-[#fff] w-20 cursor-pointer px-3"
            }`}
            onClick={() => {
              if (load) return;
              setLoad(true);
              getPdf();
            }}
          >
            {load ? (
              <LoaderCircle className="h-full w-full animate-spin" />
            ) : (
              "Exportar"
            )}
          </motion.div>
        </div>
      </div>
    </BoxOfInitialPagesComponent>
  );
}
