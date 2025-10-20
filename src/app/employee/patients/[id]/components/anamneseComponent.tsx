import { Customer } from "@/stores/userStore";
import { FileText, Link, NotepadText, Upload } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import { ErrorAPI } from "@/app/employee/appointments/hooks/useSetError";

export default function AnamneseComponent({
  patient,
  setPatient,
  setError,
}: {
  patient: Customer;
  setError: Dispatch<SetStateAction<ErrorAPI | null>>;
  setPatient: Dispatch<SetStateAction<Customer | null>>;
}) {
  const [helper, setHelper] = useState<string | null>(null);
  const validadeFile = (e: ChangeEvent<HTMLInputElement>): boolean => {
    const { files } = e.target;

    if (!files || files.length === 0) {
      setError({
        error: "Nenhum arquivo foi selecionado.",
        message: "Selecione um arquivo para continuar.",
      });
      return false;
    }

    const file = files[0];

    if (file.type !== "application/pdf") {
      setError({
        error: `O tipo do arquivo não é permitido: ${file.type}`,
        message: "Para anexar uma fixa Anamnese é necessário um arquivo PDF.",
      });
      return false;
    }

    if (file.size / (1024 * 1024) > 20) {
      setError({
        error: "O arquivo é pesado demais.",
        message: "Escolha um arquivo de até 20MB(MEGAS).",
      });
      return false;
    }
    return true;
  };

  const createNewAnamneseRecord = async (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;

    if (!files || files.length === 0) return;

    const file = files[0];
    const isValid = validadeFile(e);

    if (!isValid) return;

    const form = new FormData();

    form.append("anamnese", file);
    form.append("id", patient._id);

    try {
      const response = await fetch("/api/customers/anamnese/add", {
        method: "POST",
        credentials: "include",
        body: form,
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Houve um erro inesperado.");
      }
      setPatient(data.data);
    } catch (err) {
      console.log(err);
      const error = err as Error;
      setError({
        error: "Houve um erro interno.",
        message: error.message || "Tente novamente mais tarde.",
      });
    }
  };

  return (
    <div className="w-full h-100 md:h-full md:row-span-2 bg-gradient-to-tr from-[#ffffff93] to-[#d3b094] rounded-4xl border-4 border-[#e4d2bf] relative">
      {patient.anamnese_pdf ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full h-full flex justify-center items-center relative"
        >
          <div className="absolute top-2 left-2 px-4 py-[6px] border-1 border-[#f5f5f565] bg-[#ffffff3f] rounded-full text-[#0303037e]">
            Ficha Anamnese
          </div>
          <NotepadText className="w-40 h-40 text-[#fcecd9ee]" />
        </motion.div>
      ) : (
        <div className="w-full h-full flex justify-center items-center text-[#333] text-2xl px-4 text-center">
          Não há ficha anamnese vinculada a este usuário.
        </div>
      )}
      <div className="absolute left-1/2 translate-x-[-50%] bottom-2 rounded-full flex gap-2 border-1 border-[#eeeeee54] px-1 py-1">
        <AnimatePresence>
          {helper && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.3, type: "spring", ease: "circInOut" }}
              className="absolute w-max left-1/2 translate-x-[-50%] top-[-38px] px-3 py-[4px] bg-[#ffffff98] rounded-full text-[#646464] text-[14px] border-1 border-[#eee]"
            >
              {helper}
            </motion.div>
          )}
        </AnimatePresence>
        <motion.a
          onMouseEnter={() =>
            setHelper("Clique e baixe um modelo de ficha Anamnese!")
          }
          onMouseLeave={() => setHelper(null)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          href="/FeelSystemPDF.pdf"
          className="w-12 h-12 flex px-3 py-3 bg-[#ffffff93] rounded-full duration-200 hover:rotate-25 hover:bg-[#fff]"
          download
          whileTap={{
            scale: 0.8,
            transition: { duration: 0.2, ease: "circInOut", type: "spring" },
          }}
        >
          <FileText className="text-[#646464] w-full h-full" />
        </motion.a>
        <motion.label
          onMouseEnter={() => setHelper("Clique e insira a ficha Anamnese!")}
          onMouseLeave={() => setHelper(null)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          whileTap={{
            scale: 0.8,
            transition: { duration: 0.2, ease: "circInOut", type: "spring" },
          }}
          htmlFor="file-pdf"
          className="text-[#646464] w-12 h-12 flex justify-center items-center bg-[#ffffff93] rounded-full cursor-pointer text-[15px] aspect-square duration-200 hover:rotate-[-25deg] hover:bg-[#fff]"
        >
          <div className="w-full h-full">
            <Upload className="w-full h-full px-3 py-3" />
          </div>
        </motion.label>
        <input
          onChange={(e) => createNewAnamneseRecord(e)}
          type="file"
          accept="application/pdf"
          id="file-pdf"
          className="hidden"
        />
        {patient.anamnese_pdf && (
          <motion.a
            onMouseEnter={() =>
              setHelper("Clique e visualize a ficha Anamnese!")
            }
            onMouseLeave={() => setHelper(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            whileTap={{
              scale: 0.8,
              transition: { duration: 0.2, ease: "circInOut", type: "spring" },
            }}
            className="w-12 h-12 bg-[#ffffff93] rounded-full text-[#646464] px-3 py-3cursor-pointer duration-200 hover:rotate-25 hover:bg-[#fff]"
            target="_blank"
            href={patient.anamnese_pdf.url}
          >
            <Link className="w-full h-full" />
          </motion.a>
        )}
      </div>
    </div>
  );
}
