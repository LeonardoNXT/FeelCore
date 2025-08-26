"use client";
import { useState } from "react";
import CadastroInicial from "./components/startregister";
import CadastroSelect from "./components/selectregister";
import CadastroLastStep from "./components/laststepregister";
import EndingCadastroPatient from "./components/endingPage";

export default function Cadastro() {
  const [pagina, setPagina] = useState(1);
  const [id, setId] = useState<string | null>(null);

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
          backPage={() => setPagina(2)}
          onContinuar={() => setPagina(4)}
          setId={setId}
        />
      )}
      {pagina === 4 &&
        id && ( // Só renderiza se id existir
          <EndingCadastroPatient backPage={() => setPagina(3)} id={id} />
        )}
    </>
  );
}
