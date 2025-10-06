import { Dispatch, SetStateAction } from "react";
import SeletedVideoComponent from "./seletedVideoComponent";
import { AnimatePresence } from "framer-motion";
import SeletedImageComponent from "./selectedImageComponent";
import SelectedPDFComponent from "./selectedPDFComponent";

export type PropsFileSeleted = {
  archive: File | null;
  setArchive: Dispatch<SetStateAction<File | null>>;
};

export default function SelectedFileInputComponent({
  archive,
  setArchive,
}: PropsFileSeleted) {
  function startWithArchive(type: string) {
    if (!archive) return;
    return archive.type.split("/")[0] === type;
  }
  if (archive) {
    return (
      <AnimatePresence>
        {startWithArchive("video") && (
          <SeletedVideoComponent archive={archive} setArchive={setArchive} />
        )}
        {startWithArchive("image") && (
          <SeletedImageComponent archive={archive} setArchive={setArchive} />
        )}
        {startWithArchive("application") && (
          <SelectedPDFComponent archive={archive} setArchive={setArchive} />
        )}
      </AnimatePresence>
    );
  }
}
