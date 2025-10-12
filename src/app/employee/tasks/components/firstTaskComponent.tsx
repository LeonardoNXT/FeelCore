import { Tasks } from "@/types/TasksReceive";
import { MoveUpRight } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { getTime } from "../../appointments/components/getTime";
import { AnimatePresence, motion } from "framer-motion";

type Props = {
  first: Tasks | null;
  setPendingTaskSelected: Dispatch<SetStateAction<Tasks | null>>;
};

export default function FirstPendingTaskContent({
  first,
  setPendingTaskSelected,
}: Props) {
  return (
    <AnimatePresence mode="wait">
      {first ? (
        <motion.div
          key="with-task"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full h-70 mt-10 bg-gradient-to-br from-[#a08b5e] to-[#eee] rounded-3xl flex flex-col justify-center items-center text-[#333] relative"
        >
          <div className="flex gap-2">
            {first.archive && (
              <div className="text-[#444] text-[14px] w-full flex justify-center">
                <p className="px-2 bg-[#eeeeee00] w-max border-1 border-[#22222249] rounded-[10px]">
                  {first.archive.archive_type.toLocaleUpperCase()}
                </p>
              </div>
            )}
            <p className="text-[#555]">
              {first.completionDate
                .split("T")[0]
                .split("-")
                .reverse()
                .join("/")}
            </p>
          </div>
          <div className="flex gap-2 text-4xl md:text-5xl font-bold">
            <p>{getTime(first.completionDate)} </p>
            <p>X</p>
            <p>{first.intendedFor.name.split(" ")[0]}</p>
          </div>
          <p className="text-[#666]">{first.intendedFor.name}</p>
          <div
            className="w-10 h-10 shadow-inner shadow-[#333] rounded-full absolute right-2 bottom-2 grid place-items-center px-2 py-2 hover:bg-[#fff] cursor-pointer"
            onClick={() => {
              setPendingTaskSelected(first);
              window.scrollTo({ top: 0 });
            }}
          >
            <MoveUpRight className="w-full h-full duration-300 hover:rotate-45" />
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="no-task"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full h-70 mt-10 bg-gradient-to-br from-[#a08b5e] to-[#eee] rounded-3xl flex flex-col justify-center items-center text-[#333] text-2xl"
        >
          Não há tarefa relacionada.
        </motion.div>
      )}
    </AnimatePresence>
  );
}
