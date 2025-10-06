import { Dispatch, SetStateAction } from "react";
import { ErrorAPI } from "../appointments/hooks/useSetError";
import { motion } from "framer-motion";

type Props = {
  isDragging: boolean;
  setIsDragging: Dispatch<SetStateAction<boolean>>;
  setArchive: Dispatch<SetStateAction<File | null>>;
  setError: Dispatch<SetStateAction<ErrorAPI | null>>;
};

const MB = 1024 * 1024;

export default function InputFileContent({
  isDragging,
  setIsDragging,
  setArchive,
  setError,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className={`w-full h-[200px] rounded-3xl border-2 border-dashed flex justify-center items-center transition hover:bg-[#1a1a1a] hover:border-[#a0c9ff] ${
        isDragging
          ? "bg-[#1a1a1a] border-[#a0c9ff]"
          : "bg-[#111] border-[#424242]"
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file && file.size > 50 * MB) {
          return setError({
            error: "O arquivo selecionado é pesado demais.",
            message: "Selecione um arquivo que possua menos de 50MB",
          });
        }
        setArchive(file);
      }}
    >
      <label
        htmlFor="file"
        className="w-full h-full cursor-pointer flex justify-center items-center flex-col hover:shadow-2xl hover:shadow-[#aec4ff] duration-100 rounded-3xl"
      >
        <div className="text-[20px] flex gap-2 justify-center items-center text-[#aec4ff]">
          <span>Adicione um arquivo</span>
        </div>
        <span className="text-[15px] text-[#555]">
          Apenas arquivos do tipo imagem, vídeo ou PDF
        </span>
      </label>
      <input
        type="file"
        name="file"
        id="file"
        className="hidden"
        accept="video/*,image/*,application/pdf"
        onChange={(e) => {
          const files = e.target.files;
          if (files && files[0]) {
            if (files[0].size > 50 * MB) {
              return setError({
                error: "O arquivo selecionado é pesado demais.",
                message: "Selecione um arquivo que possua menos de 50MB",
              });
            }
            return setArchive(files[0]);
          }
        }}
      />
    </motion.div>
  );
}
