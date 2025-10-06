import { Dispatch, SetStateAction, useState } from "react";
import React from "react";
import { AnimatePresence } from "framer-motion";
import BaseCreateBoxComponent from "./baseCreateBox";
import InputFileContent from "./InputFileContent";
import SelectedFileInputComponent from "./selectedInputFile";
import { ErrorAPI } from "../appointments/hooks/useSetError";

type Props = {
  title: string;
  archive: File | null;
  setArchive: Dispatch<SetStateAction<File | null>>;
  setError: Dispatch<SetStateAction<ErrorAPI | null>>;
};

export default React.memo(function InputFileComponent({
  title,
  archive,
  setArchive,
  setError,
}: Props) {
  const [isDragging, setIsDragging] = useState<boolean>(false);

  return (
    <BaseCreateBoxComponent
      title={title}
      summary="Adicione um arquivo à tarefa para o paciente."
    >
      <SelectedFileInputComponent archive={archive} setArchive={setArchive} />
      <AnimatePresence>
        {!archive && (
          <InputFileContent
            isDragging={isDragging}
            setIsDragging={setIsDragging}
            setArchive={setArchive}
            setError={setError}
          />
        )}
      </AnimatePresence>
    </BaseCreateBoxComponent>
  );
});
