"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import CadastroInicio from "./components/contentInit";
import CadastroEmailSenha from "./components/contentLogin";
import IdentificacaoDoProfissional from "./components/contentIdenfier";
import OutrosReqCadastroProfissional from "./components/contentOthers";
import FotoEConclusaoDoProfissional from "./components/contentFinalPage";

export default function ContentENew() {
  type Pagina = 1 | 2 | 3 | 4 | 5;
  const [pagina, setPagina] = useState<Pagina>(1);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full h-[98vh] rounded-[2vw] relative"
    >
      <Image
        src={"/background5.webp"}
        fill
        alt="background"
        className="w-full h-full absolute top-0 left-0 rounded-[2vw] brightness-[100%] saturate-0"
      />
      <div className="w-full h-full bg-[#33333300] backdrop-blur-[30px] rounded-[2vw] relative p-[1vw] flex justify-center items-center">
        {pagina === 1 && <CadastroInicio setPagina={setPagina} />}
        {pagina === 2 && (
          <CadastroEmailSenha setPagina={setPagina} pagina={pagina} />
        )}
        {pagina === 3 && (
          <IdentificacaoDoProfissional setPagina={setPagina} pagina={pagina} />
        )}
        {pagina === 4 && (
          <OutrosReqCadastroProfissional
            setPagina={setPagina}
            pagina={pagina}
          />
        )}
        {pagina === 5 && <FotoEConclusaoDoProfissional />}
      </div>
    </motion.div>
  );
}
