import { Dispatch, SetStateAction, useState } from "react";
import { motion } from "framer-motion";
import { CircleAlert, X } from "lucide-react";
import { ConfirmWarmingBoxProps, WarningBox } from "../hooks/useWarmingBox";

interface Props {
  warningBox: WarningBox | null;
  setWarningBox: Dispatch<SetStateAction<WarningBox | null>>;
  setConfirm: Dispatch<SetStateAction<ConfirmWarmingBoxProps>>;
  method?: "POST" | "PATCH" | "DELETE";
}

export default function WarningBoxComponent({
  warningBox,
  setWarningBox,
  setConfirm,
  method = "PATCH",
}: Props) {
  const [isLoading, setIsLoading] = useState(false);

  if (!warningBox) return null;

  const confirmAndFetch = async () => {
    if (!warningBox?.id || !warningBox?.route) {
      console.warn("WarningBox incompleto:", warningBox);
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`/api/${warningBox.route}`, {
        method,
        body: JSON.stringify({ id: warningBox.id }),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || "Houve um erro interno");
      }

      // Apenas se sucesso
      setConfirm((prev) => ({ ...prev, status: true }));
      setWarningBox(null);
    } catch (err) {
      console.error("[WarningBox] Erro:", err);
      setWarningBox(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 bg-[#00000042] z-50 grid place-items-center px-4"
    >
      <div className="md:max-w-[500px] w-full p-4 bg-[#010101] border border-[#222] rounded-3xl">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="p-2 border border-[#222] flex items-center gap-2 w-max pr-4 rounded-full text-[#bda37d] text-sm">
            <CircleAlert className="w-5 h-5" />
            <p>{warningBox.title}</p>
          </div>

          <button
            onClick={() => {
              setWarningBox(null);
              setConfirm({ status: false, type: null });
            }}
            className="w-10 h-10 border border-[#333] rounded-full hover:bg-[#0c0c0c] hover:text-red-500 hover:rotate-90 transition-all duration-200 flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <p className="text-[#ddd] px-4 py-10">{warningBox.summary}</p>

        {/* Footer */}
        <div className="flex justify-end gap-2 text-sm">
          <button
            disabled={isLoading}
            onClick={confirmAndFetch}
            className={`px-4 py-2 border border-[#333] rounded-full transition-all select-none ${
              isLoading
                ? "opacity-50 cursor-not-allowed bg-[#111]"
                : "hover:bg-[#fff] hover:text-[#333] bg-[#0a0a0a] text-[#fdfdfd]"
            }`}
          >
            {isLoading ? "Processando..." : "Confirmar"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
