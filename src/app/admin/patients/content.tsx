"use client";
import { useState } from "react";
import CadastroInicial from "./components/startregister";
import CadastroSelect from "./components/selectregister";
import CadastroLastStep from "./components/laststepregister";

export default function Cadastro() {
  const [pagina, setPagina] = useState(1);

  return (
    <>
      {pagina === 1 && <CadastroInicial onContinuar={() => setPagina(2)} />}
      {pagina === 2 && (
        <CadastroSelect
          backPage={() => setPagina(1)}
          onContinuar={() => setPagina(3)}
        />
      )}
      {pagina === 3 && (
        <CadastroLastStep
          backPage={() => setPagina(1)}
          onContinuar={() => setPagina(3)}
        />
      )}
    </>
  );
}
