import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { ErrorAPI } from "../../appointments/hooks/useSetError";
import { FileArchiveIcon } from "lucide-react";
import { motion } from "framer-motion";
import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/scale.css";

type Props = {
  url: string;
  title: string;
  setError: Dispatch<SetStateAction<ErrorAPI | null>>;
};

type PDF = {
  file: File;
  URL: string;
};

export default function PDFDownloaderComponent({
  url,
  title,
  setError,
}: Props) {
  const [pdf, setPDF] = useState<PDF | null>(null);
  const TITLE_OF_ARCHIVE = title.split(" ").join("_");

  useEffect(() => {
    const fetchPdf = async () => {
      try {
        const response = await fetch(url);
        const blob = await response.blob();
        const file = new File([blob], TITLE_OF_ARCHIVE, {
          type: "application/pdf",
          lastModified: Date.now(),
        });
        setPDF({
          file,
          URL: URL.createObjectURL(file),
        });
      } catch (err) {
        console.error(err);
        setError({
          error: "Houve um erro interno.",
          message: "Tente novamente mais tarde.",
        });
      }
    };

    fetchPdf();
  }, [url, TITLE_OF_ARCHIVE, setError]);

  useEffect(() => {
    if (pdf) {
      tippy("#link-tippy", {
        content: "Clique para baixar",
        animation: "scale",
        theme: "dark-pdf",
        placement: "top",
        arrow: true,
        delay: [100, 0],
        duration: [300, 200],
      });
    }
  }, [pdf]);

  if (!pdf) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
    >
      <a
        id="link-tippy"
        href={pdf.URL}
        download={`${TITLE_OF_ARCHIVE}.pdf`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full relative px-4 py-4 flex my-10 bg-[#0c0c0c] rounded-4xl hover:bg-[#111] border-1 border-dashed border-[#333] hover:border-[#85ffa0] duration-300 text-[#bbb] transition-all"
      >
        <div className="w-full flex relative justify-between items-center">
          <div className="flex items-center gap-2 border-1 border-[#444] px-3 py-1 rounded-full">
            <FileArchiveIcon className="w-4 h-4 text-[#85ffa0]" />
            <p className="text-[14px]">PDF</p>
          </div>
          <p className="w-[200px] text-ellipsis overflow-hidden px-4 py-1 border-1 rounded-full">{`${TITLE_OF_ARCHIVE}.pdf`}</p>
        </div>
      </a>
    </motion.div>
  );
}
