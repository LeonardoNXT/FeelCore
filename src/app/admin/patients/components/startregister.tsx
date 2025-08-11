"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useConsumerStore } from "@/stores/consumesStrore";

export default function CadastroInicial({
  onContinuar,
}: {
  onContinuar: () => void;
}) {
  const { consumer, setConsumer } = useConsumerStore();
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  function validarSenha(senha: string) {
    // Pelo menos 8 caracteres, 1 letra maiúscula, 1 número, 1 caractere especial
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-]).{8,}$/;
    return regex.test(senha);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!validarSenha(senha)) {
      setErro(
        "A senha deve ter no mínimo 8 caracteres, incluindo letra maiúscula, número e caractere especial."
      );
      return;
    }

    setErro("");
    // Atualiza a senha no Zustand
    setConsumer({
      ...consumer,
      password: senha,
    });

    onContinuar();
  }

  return (
    <div className="w-full h-[98vh] p-[4vw] flex justify-center items-center flex-col">
      <motion.div
        initial={{ opacity: 0, filter: "blur(10px)" }}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 1 }}
      >
        <h2 className="text-[#242424] text-[80px] leading-[1]">
          Crie um novo paciente
        </h2>
        <p className="text-[#707070] w-full leading-[1] mt-3 mb-5 md:text-center">
          Inicie a jornada de um novo paciente aqui.
        </p>
      </motion.div>
      <motion.form
        initial={{ opacity: 0, filter: "blur(10px)", y: "25px" }}
        animate={{ opacity: 1, filter: "blur(0px)", y: "0px" }}
        transition={{ duration: 0.8 }}
        onSubmit={handleSubmit}
        className="w-full md:w-max flex flex-col gap-5 mt-5 md:flex-row md:items-center justify-center md:px-4 md:py-3 md:border-1 border-[#e7e6e6] rounded-4xl"
      >
        <div>
          <p className="text-[#474747] font-semibold mb-1 pl-2 md:hidden">
            Nome
          </p>
          <input
            type="text"
            value={consumer.name || ""}
            onChange={(e) => setConsumer({ name: e.target.value })}
            className="w-full bg-[#ffffff] border-[#c7c7c713] md:border-[#afafaf3a] border-1 text-[#918e8e] rounded-2xl md:rounded-3xl p-3 duration-300"
            placeholder="Nome:"
            required
          />
        </div>
        <div>
          <p className="text-[#474747] font-semibold mb-1 pl-2 md:hidden">
            Email
          </p>
          <input
            type="email"
            value={consumer.email || ""}
            onChange={(e) =>
              setConsumer({ email: e.target.value.toLowerCase() })
            }
            className="w-full bg-[#ffffff] border-[#c7c7c713] md:border-[#afafaf3a] border-1 text-[#918e8e] rounded-2xl md:rounded-3xl p-3 duration-300"
            placeholder="Email:"
            required
          />
        </div>
        <div>
          <p className="text-[#474747] font-semibold mb-1 pl-2 md:hidden">
            Senha
          </p>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="w-full bg-[#ffffff] border-[#c7c7c713] md:border-[#afafaf3a] border-1 text-[#918e8e] rounded-2xl md:rounded-3xl p-3 duration-300"
            placeholder="Senha:"
            required
          />
        </div>
        <div className="w-full md:w-max flex justify-between items-center">
          <p className="text-[#a5a5a5] py-3 w-max px-5 tracking-widest md:hidden">
            1/3
          </p>
          <button
            type="submit"
            className="text-[#6b6b6b] rounded-2xl md:rounded-3xl py-3 w-max px-5 md:border-[#afafaf3a] border-1 bg-[#ffffff] border-[#dddddd28] text-[15px] duration-300 hover:bg-[#0084ff] hover:text-[#fff]"
          >
            Continuar
          </button>
        </div>
      </motion.form>
      {erro && <p className="text-red-500 mt-4">{erro}</p>}
    </div>
  );
}
