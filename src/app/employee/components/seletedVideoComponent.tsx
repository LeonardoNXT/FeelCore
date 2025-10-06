import { File, Video, X } from "lucide-react";
import { PropsFileSeleted } from "./selectedInputFile";
import { AnimatePresence, motion } from "framer-motion";

export default function SeletedVideoComponent({
  archive,
  setArchive,
}: PropsFileSeleted) {
  if (archive) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="px-2 w-full">
            <div className="w-full flex justify-between">
              <div className="flex w-max rounded-[10px] text-[#a8a8a8] gap-1 px-2 py-1 bg-[#111] border-1 mb-2">
                <File className="w-[15px]" />
                {(archive.size / (1024 * 1024)).toFixed(2)}MB / 50MB
              </div>
              <div className="flex gap-2 items-center mb-2">
                <div className="flex w-max rounded-[10px] text-[#a8a8a8] gap-1 px-2 py-1 bg-[#111] border-1  max-w-[80px] md:max-w-[220px]">
                  <Video className="w-[15px]" />
                  <p className="w-full text-ellipsis overflow-hidden text-nowrap">
                    {archive.name}
                  </p>
                </div>
                <div className="px-2 py-1 bg-[#eee] h-max text-[#333] text-[14px] rounded-[5px] border-1 border-[#bbb]">
                  {archive.type.split("/")[1].toUpperCase()}
                </div>
              </div>
            </div>
          </div>
          <div className="w-full relative">
            <div
              className="h-10 w-10 px-2 py-2 bg-[#ffffffbd] backdrop-blur-2xl shadow-inner shadow-[#000] rounded-full text-[#333] absolute top-2 right-2 z-10 cursor-pointer"
              onClick={() => setArchive(null)}
            >
              <X className="w-full h-full hover:rotate-90 duration-300" />
            </div>
            <video
              src={URL.createObjectURL(archive)}
              className="rounded-3xl w-full border-1 shadow-2xl shadow-[#000000] border-[#70707038]"
              controls
            ></video>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }
}
