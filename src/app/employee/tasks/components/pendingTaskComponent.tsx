import { Tasks } from "@/types/TasksReceive";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import VideoPlayer from "./VideoPlayer";

interface Props {
  pendingTaskSelected: Tasks | null;
  setPendingTaskSelected: Dispatch<SetStateAction<Tasks | null>>;
}

export default function PendingTaskComponent({
  pendingTaskSelected,
  setPendingTaskSelected,
}: Props) {
  return (
    <AnimatePresence>
      {pendingTaskSelected && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full min-h-screen h-full flex justify-center bg-gradient-to-bl from-[#38422f] to-[#000000] backdrop-blur-[20px] fixed top-0 left-0 z-10 overflow-y-scroll"
        >
          <div className="w-[800px] h-max px-4 md:px-4 py-30 md:py-35 text-[#bbb] border-l-1 border-r-1 border-[#3333333a] border-dashed">
            <div className="w-full text-center">
              <div className="w-full flex justify-center">
                <div
                  className="h-10 w-10 shadow-inner shadow-[#333] rounded-full grid place-items-center px-2 cursor-pointer mb-4"
                  onClick={() => setPendingTaskSelected(null)}
                >
                  <X className="duration-300 hover:rotate-90 hover:text-red-700" />
                </div>
              </div>
              <p className="tracking-widest">Título</p>
              <p className="text-[#eee] text-4xl">
                {pendingTaskSelected.title}
              </p>
            </div>

            {pendingTaskSelected.archive &&
              pendingTaskSelected.archive.archive_type === "video" && (
                <VideoPlayer
                  src={pendingTaskSelected.archive.url}
                  title="Vídeo relacionado à tarefa."
                />
              )}

            <div className="text-[#bbb] mt-4">
              <p className="tracking-widest mb-2">Descrição</p>
              <p className="text-[18px] text-justify">
                {pendingTaskSelected.description}
              </p>
              <div className="mt-4 w-full h-[1px] mb-4 bg-[#3333333a]"></div>
              {pendingTaskSelected.steps && (
                <>
                  <p className="tracking-widest mt-4 mb-2">Lista da Tarefa.</p>
                  <div className="w-full px-4">
                    {pendingTaskSelected.steps.style === "ordered" ? (
                      <ol className="list-decimal pl-5 flex flex-col gap-3'?">
                        {pendingTaskSelected.steps.list?.map((item, i) => (
                          <li className="text-justify" key={i}>
                            {item}
                          </li>
                        ))}
                      </ol>
                    ) : (
                      <ul className="list-disc pl-5 flex flex-col gap-3">
                        {pendingTaskSelected.steps.list?.map((item, i) => (
                          <li className="text-justify" key={i}>
                            {item}
                          </li>
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
