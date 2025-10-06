import { motion } from "framer-motion";
import { FileText, X } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

type Props = {
  archive: File | null;
  setArchive: Dispatch<SetStateAction<File | null>>;
};

export default function SelectedPDFComponent({ archive, setArchive }: Props) {
  if (archive) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
        layout
        className="w-full"
      >
        <div className="py-0 w-full flex justify-center">
          <div className="flex justify-center items-center gap-2 rounded-3xl md:rounded-3xl h-50 bg-gradient-to-tr from-[#a59370] to-[#7dafbe] md:border-1 border-[#333] w-full flex-col md:flex-row py-2 pt-2 px-5 md:px-3 relative text-[14px]">
            <div
              className="h-10 aspect-square px-2 py-2 bg-[#eee] text-[#333] rounded-full hover:bg-red-400 duration-300 cursor-pointer absolute top-3 right-3"
              onClick={() => setArchive(null)}
            >
              <X className="h-full w-full hover:rotate-180 duration-300" />
            </div>
            <div className="px-3 py-3 rounded-3xl border-1 w-full max-w-[500px] shadow-[#000] shadow-2xl bg-[#111]">
              <div className="flex w-full justify-between items-center text-[#aaa]">
                <div className="flex gap-2 px-2 py-1 border-1 border-[#333] rounded-[10px]">
                  <FileText className="w-[18px]" />
                  <p>{archive.type.split("/")[1].toLocaleUpperCase()}</p>
                </div>
                <p className="px-3 py-1 bg-[#00000000] border-1 border-[#333] rounded-[16px] max-w-40 md:max-w-50 text-nowrap text-ellipsis overflow-hidden text-[#aaa]">
                  {archive.name}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }
}
