import { ErrorAPI } from "@/app/employee/appointments/hooks/useSetError";
import BaseCreateBoxComponent from "@/app/employee/components/baseCreateBox";
import { X } from "lucide-react";
import Image from "next/image";
import { Dispatch, SetStateAction, useState } from "react";

type Props = {
  file: File | null;
  setFile: Dispatch<SetStateAction<File | null>>;
  setError: Dispatch<SetStateAction<ErrorAPI | null>>;
};

const MB = 1024 * 1024;

export default function CreatePatientInputProfile({
  file,
  setFile,
  setError,
}: Props) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (selectedFile: File | null) => {
    if (!selectedFile) return;

    // Validação de tamanho (4MB)
    if (selectedFile.size > 4 * MB) {
      return setError({
        error: "A imagem selecionada é pesada demais.",
        message: "Selecione uma imagem que possua menos de 4MB",
      });
    }

    // Validação de tipo de arquivo
    if (!selectedFile.type.startsWith("image/")) {
      return setError({
        error: "Arquivo inválido.",
        message: "Selecione apenas arquivos de imagem (PNG, JPG, WEBP, etc.)",
      });
    }

    setFile(selectedFile);
  };

  return (
    <BaseCreateBoxComponent
      title="Imagem do paciente"
      summary="Defina a imagem do paciente opcionalmente de até 4MB para o cadastro no sistema."
    >
      {!file ? (
        <div
          className={`w-full transition ${
            isDragging ? "scale-[0.98]" : "scale-100"
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            const droppedFile = e.dataTransfer.files[0];
            handleFile(droppedFile);
          }}
        >
          <label
            htmlFor="image-patient"
            className={`w-full px-10 py-10 flex flex-col justify-center items-center h-60 rounded-3xl border-4 border-dashed text-2xl cursor-pointer transition hover:bg-[#1a1a1a] hover:border-[#a0c9ff] ${
              isDragging
                ? "bg-[#1a1a1a] border-[#a0c9ff]"
                : "bg-[#111] border-[#333]"
            }`}
          >
            <p className="text-[#d4d4d4]">
              {isDragging
                ? "Solte a imagem aqui"
                : "Selecione uma imagem para o paciente"}
            </p>
            <p className="text-[14px] text-[#555]">
              A imagem pode ser do tipo PNG, WEBP, JPG, JPEG... (até 4MB)
            </p>
          </label>
          <input
            type="file"
            name="image-patient"
            id="image-patient"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const files = e.target.files;
              if (files && files[0]) {
                handleFile(files[0]);
              }
            }}
          />
        </div>
      ) : (
        <div className="w-full flex flex-col gap-4">
          <div className="w-full h-100 relative py-10 bg-[#111] rounded-3xl border-2 border-[#333] flex justify-center items-center overflow-hidden">
            <Image
              src={URL.createObjectURL(file)}
              width={500}
              height={500}
              alt="Preview da imagem do paciente"
              className="max-w-full w-50 h-50 object-cover max-h-full rounded-full border-4 border-[#333]"
            />
            <div className="flex flex-col absolute top-4 left-4">
              <span className="text-[#d4d4d4] text-sm">{file.name}</span>
              <span className="text-[#555] text-xs">
                {(file.size / MB).toFixed(2)} MB
              </span>
            </div>
            <button
              onClick={() => setFile(null)}
              className="px-2 w-10 h-10 py-2 bg-red-400 hover:bg-red-700 text-white transition absolute top-4 right-4 rounded-full hover:rotate-90 cursor-pointer"
            >
              <X className="w-full h-full" />
            </button>
          </div>
        </div>
      )}
    </BaseCreateBoxComponent>
  );
}
