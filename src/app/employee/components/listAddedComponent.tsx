import { Dispatch, SetStateAction } from "react";
import { List } from "../tasks/create/context";
import { AnimatePresence, motion } from "framer-motion";
import BaseCreateBoxComponent from "./baseCreateBox";
import { X } from "lucide-react";

interface Props {
  title: string;
  summary: string;
  list: List;
  setList: Dispatch<SetStateAction<List>>;
}

export default function ListAddedComponent({
  title,
  summary,
  list,
  setList,
}: Props) {
  const removeItem = (i: number) => {
    setList((prev) => ({
      ...prev,
      list: prev.list.filter((_, index) => index !== i),
    }));
  };
  return (
    <BaseCreateBoxComponent title={title} summary={summary}>
      <div className="w-full max-h-100 min-h-35 bg-[#111] rounded-3xl border-1 border-[#333] relative p-2 md:px-2 overflow-y-scroll flex flex-col gap-2">
        <AnimatePresence mode="popLayout">
          {list.list.length > 0 ? (
            list.list.map((item, i) => (
              <motion.div
                key={i}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="px-3 py-3 bg-[#00000027] border-1 rounded-3xl w-full"
              >
                <div className="px-3 py-2 bg-[#eee] border-1 w-max flex gap-3 rounded-2xl text-[#494949]">
                  <p className="w-max rounded-[10px]">{"Item " + (i + 1)}</p>
                  <X
                    className="hover:rotate-180 duration-300 cursor-pointer hover:text-red-600"
                    onClick={() => removeItem(i)}
                  />
                </div>
                <div className="my-3 mb-2 py-3 px-3 bg-[#0f0f0f] rounded-2xl ">
                  <p className="text-[25px] pb-2 text-[#9c9090]">Conteúdo</p>
                  <p className="w-full break-words text-[18px] text-justify">
                    {item}
                  </p>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#333] text-[20px] text-nowrap text-center"
            >
              Nenhum item foi inserido
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </BaseCreateBoxComponent>
  );
}
