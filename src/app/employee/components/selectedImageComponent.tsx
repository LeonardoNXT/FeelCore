import { File, ImageDown, X } from "lucide-react";
import Image from "next/image";
import { Dispatch, SetStateAction } from "react";
import { motion } from "framer-motion";

type Props = {
  archive: File | null;
  setArchive: Dispatch<SetStateAction<File | null>>;
};

export default function SeletedImageComponent({ archive, setArchive }: Props) {
  if (archive) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
        layout
        className="w-full flex-col"
      >
        <div className="w-full flex justify-center items-center flex-col bg-gradient-to-tr from-[#a59370] to-[#7dafbe] md:py-8 md:pb-20 rounded-3xl border-1 border-[#333] pb-1 px-1">
          <div className="w-max py-5">
            <div className="w-full flex justify-between gap-2 px-2 py-2 text-[14px]">
              <div className="flex w-max rounded-[10px] text-[#a8a8a8] gap-1 px-2 py-1 bg-[#111] border-1">
                <File className="w-[15px]" />
                {(archive.size / (1024 * 1024)).toFixed(2)}MB / 50MB
              </div>
              <div className="flex gap-2 items-center">
                <div className="flex w-max rounded-[10px] text-[#a8a8a8] gap-1 px-2 py-1 bg-[#111] border-1  max-w-[80px] md:max-w-[220px]">
                  <ImageDown className="w-[15px]" />
                  <p className="w-full text-ellipsis overflow-hidden text-nowrap">
                    {archive.name}
                  </p>
                </div>
                <div className="px-2 py-1 bg-[#eee] h-max text-[#333] rounded-[10px] border-1 border-[#bbb]">
                  {archive.type.split("/")[1].toUpperCase()}
                </div>
              </div>
            </div>
          </div>
          <div className="w-auto relative">
            <div className="h-10 aspect-square px-2 py-2 absolute top-2 right-2 bg-[#ffffffda] text-[#333] rounded-full shadow-inner shadow-[#33333385]  duration-300 hover:bg-[#ff6b6b]">
              <X
                className="h-full w-full hover:rotate-90 duration-300"
                onClick={() => setArchive(null)}
              />
            </div>
            <Image
              src={URL.createObjectURL(archive)}
              width={1920}
              height={1080}
              alt=""
              className="object-cover md:h-100 w-auto rounded-[20px] md:rounded-2xl border-1 border-[#a7a7a74b] shadow-[#333] shadow-2xl"
            />
          </div>
        </div>
      </motion.div>
    );
  }
}
