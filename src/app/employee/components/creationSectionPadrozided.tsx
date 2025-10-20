import React, { Dispatch, SetStateAction } from "react";
import ErrorComponent from "../appointments/components/errorComponent";
import RefreshComponent from "./refresh";
import { ErrorAPI } from "../appointments/hooks/useSetError";
import { motion } from "framer-motion";

interface Props {
  children: React.ReactNode;
  error: {
    display: "absolute" | "fixed";
    background: string;
    error: ErrorAPI | null;
    setError: Dispatch<SetStateAction<ErrorAPI | null>>;
  };
  success: {
    state: boolean;
    title: string;
    display: "flex" | "absolute" | "fixed";
    route: string;
  };
}

export default function CreationSectionPadronized({
  children,
  error,
  success,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full min-h-screen h-full bg-[url('/background.jpg')] bg-center bg-cover bg-fixed relative"
    >
      {success.state && (
        <RefreshComponent
          title={success.title}
          display={success.display}
          route={success.route}
        />
      )}
      {error.error && (
        <ErrorComponent
          display={error.display}
          bg={error.background}
          errorContent={error.error}
          onClick={() => error.setError(null)}
        />
      )}

      <div className="w-full h-full flex justify-center backdrop-blur-2xl backdrop-sepia-50">
        <div className="max-w-[900px] w-full px-4 md:px-0 py-30 flex items-center flex-col gap-2">
          {children}
        </div>
      </div>
    </motion.div>
  );
}
