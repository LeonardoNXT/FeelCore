import { Tasks } from "@/types/TasksReceive";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import VideoPlayer from "./VideoPlayer";
import PDFDownloaderComponent from "./PDFdownloaderComponent";
import { ErrorAPI } from "../../appointments/hooks/useSetError";

interface Props {
  pendingTaskSelected: Tasks | null;
  setPendingTaskSelected: Dispatch<SetStateAction<Tasks | null>>;
  setError: Dispatch<SetStateAction<ErrorAPI | null>>;
}

export default function PendingTaskComponent({
  pendingTaskSelected,
  setPendingTaskSelected,
  setError,
}: Props) {
  return (
    <AnimatePresence>
      {pendingTaskSelected && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full min-h-screen h-full flex justify-center bg-gradient-to-bl from-[#30362f] to-[#000000] backdrop-blur-[20px] z-10 overflow-y-scroll"
        >
          <div className=" w-full md:w-[800px] h-max px-4 md:px-4 py-30 md:py-35 text-[#0a0a0a] border-l-1 border-r-1 border-[#3333333a] border-dashed">
            <div className="w-full text-center">
              <div className="w-full flex justify-center">
                <div
                  className="h-10 w-10 shadow-inner shadow-[#333] rounded-full grid place-items-center px-2 cursor-pointer mb-4 text-[#fff]"
                  onClick={() => setPendingTaskSelected(null)}
                >
                  <X className="duration-300 hover:rotate-90 hover:text-red-700" />
                </div>
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
              >
                <p className="tracking-widest text-[#fff]">Título</p>
                <p className="text-[#eee] text-4xl ">
                  {pendingTaskSelected.title}
                </p>
              </motion.div>
            </div>

            {pendingTaskSelected.archive &&
              pendingTaskSelected.archive.archive_type === "video" && (
                <VideoPlayer
                  src={pendingTaskSelected.archive.url}
                  title="Vídeo relacionado à tarefa."
                />
              )}
            {pendingTaskSelected.archive &&
              pendingTaskSelected.archive.archive_type === "pdf" && (
                <PDFDownloaderComponent
                  url={pendingTaskSelected.archive.url}
                  title={pendingTaskSelected.title}
                  setError={setError}
                />
              )}

            <div className="text-[#bbb] mt-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.1 }}
              >
                <p className="tracking-widest mb-2">Descrição</p>
                <p className="text-[18px] text-justify">
                  {pendingTaskSelected.description}
                </p>
              </motion.div>
              <div className="mt-4 w-full h-[1px] mb-4 bg-[#3333333a]"></div>
              {pendingTaskSelected.steps && (
                <>
                  <p className="tracking-widest mt-4 mb-2">Lista da Tarefa</p>
                  <div className="w-full px-4">
                    {pendingTaskSelected.steps.style === "ordered" ? (
                      <ol className="list-decimal pl-5 flex flex-col gap-3">
                        {pendingTaskSelected.steps.list?.map((item, i) => (
                          <motion.li
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1, delay: (i + 1) / 10 }}
                            className="text-justify"
                            key={i}
                          >
                            {item}
                          </motion.li>
                        ))}
                      </ol>
                    ) : (
                      <ul className="list-disc pl-5 flex flex-col gap-3">
                        {pendingTaskSelected.steps.list?.map((item, i) => (
                          <motion.li
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1, delay: (i + 1) / 10 }}
                            className="text-justify"
                            key={i}
                          >
                            {item}
                          </motion.li>
                        ))}
                      </ul>
                    )}
                  </div>
                </>
              )}
              <div className="mt-6 w-full h-[1px] mb-4 bg-[#3333333a]"></div>

              <div className="text-[18px] grid place-items-center w-full">
                <p className="mt-10 px-4 border-[#2525257c] py-2 border w-max rounded-full">
                  Aguardando resposta do paciente.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
