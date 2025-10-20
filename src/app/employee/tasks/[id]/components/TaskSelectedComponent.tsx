import { Tasks } from "@/types/TasksReceive";
import { AnimatePresence, motion } from "framer-motion";
import { Dispatch, SetStateAction, useState } from "react";
import VideoPlayer from "../../components/VideoPlayer";
import PDFDownloaderComponent from "../../components/PDFdownloaderComponent";
import { ErrorAPI } from "../../../appointments/hooks/useSetError";
import ContentOfResponseTask from "./contentOfResponse";

interface Props {
  setError: Dispatch<SetStateAction<ErrorAPI | null>>;
  task: Tasks;
}

export default function TaskSelectedComponent({ task, setError }: Props) {
  const [open, setOpen] = useState<boolean>(false);

  const isContentResponse = () => {
    if (task.content_of_response) {
      if (open) {
        return "h-max";
      } else {
        return "h-[0vh]";
      }
    } else {
      return "h-max";
    }
  };
  return (
    <AnimatePresence>
      <div
        className={`w-full md:w-[800px] h-max min-h-screen px-4 md:px-4 py-30 md:py-45 text-[#0a0a0a] border-l-1 border-r-1 border-[#3333333a] border-dashed`}
      >
        <div className="w-full text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <p className="tracking-widest text-[#fff]">Título</p>
            <p className="text-[#eee] text-4xl ">{task.title}</p>
          </motion.div>
        </div>
        <motion.div className={`${isContentResponse()} overflow-hidden`}>
          {task.archive && task.archive.archive_type === "video" && (
            <VideoPlayer
              src={task.archive.url}
              title="Vídeo relacionado à tarefa."
            />
          )}
          {task.archive && task.archive.archive_type === "pdf" && (
            <PDFDownloaderComponent
              url={task.archive.url}
              title={task.title}
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
              <p className="text-[18px] text-justify">{task.description}</p>
            </motion.div>
            <div className="mt-4 w-full h-[1px] mb-4 bg-[#3333333a]"></div>
            {task.steps && (
              <>
                <p className="tracking-widest mt-4 mb-2">Lista da Tarefa</p>
                <div className="w-full px-4">
                  {task.steps.style === "ordered" ? (
                    <ol className="list-decimal pl-5 flex flex-col gap-3">
                      {task.steps.list?.map((item, i) => (
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
                      {task.steps.list?.map((item, i) => (
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
          </div>
        </motion.div>
        <div className="mt-6 w-full h-[1px] mb-4 bg-[#3333333a]"></div>
        {task.content_of_response && (
          <div>
            <div
              className="text-[#eee] w-full flex justify-center select-none cursor-pointer duration-300 hover:text-[#fff]"
              onClick={() => setOpen(!open)}
            >
              {open ? "Ver menos" : "Ver mais"}
            </div>
            <div className="mt-4 w-full h-[1px] bg-[#3333333a]"></div>
          </div>
        )}

        {task.content_of_response ? (
          <ContentOfResponseTask task={task} />
        ) : (
          <div className="text-[18px] grid place-items-center w-full">
            <p className="mt-10 px-4 border-[#2525257c] py-2 border w-max rounded-full text-[#fff]">
              Aguardando resposta do paciente.
            </p>
          </div>
        )}
      </div>
    </AnimatePresence>
  );
}
