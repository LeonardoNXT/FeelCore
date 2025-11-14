"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { Pages, UserPasswordFlow } from "../page";
import CardPadronizedPasswordReset from "../components/CardPadronizedPasswordReset";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function SetEmailComponent({
  setPage,
  setUser,
  user,
}: {
  setPage: Dispatch<SetStateAction<Pages>>;
  setUser: Dispatch<SetStateAction<UserPasswordFlow | null>>;
  user: UserPasswordFlow | null;
}) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleNext = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setError("Email inválido, insira um email válido para continuar.");
      return;
    }
    setError("");
    setUser((prev) => ({
      ...prev,
      email: email,
    }));
    forgotPassword();
  };

  const forgotPassword = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          role: user.role,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Houve um erro interno");
      }
      console.log("Chegamos até aqui");
      setUser((prev) => ({
        ...prev,
        name: data.name,
      }));
      setPage("setToken");
    } catch (err) {
      const error = err as Error;
      console.log(error.message);
      setError(error.message || "Houve um erro interno.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CardPadronizedPasswordReset
      config={{
        title: "Insira o seu email de cadastro.",
        progressNumber: 2,
      }}
    >
      <div className="w-full flex flex-col gap-4">
        <div className="w-full">
          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="text-red-500 text-sm mt-1 ml-4 mb-4"
            >
              {error}
            </motion.p>
          )}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-1 border-[#eee] rounded-full px-4 py-2 w-full outline-transparent outline-2 duration-200 focus:outline-blue-400"
            placeholder="Adicione seu email : "
          />
        </div>
        <div className="w-full flex justify-between gap-4">
          <button
            onClick={() => setPage("setRole")}
            className="px-4 py-2 border-1 border-[#eee] text-[#666] rounded-full cursor-pointer"
            disabled={loading}
          >
            Voltar
          </button>
          <button
            onClick={handleNext}
            className="px-4 py-2 border-1 duration-150 hover:bg-gray-100 border-[#eee] text-[#666] rounded-full cursor-pointer flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Próximo
          </button>
        </div>
      </div>
    </CardPadronizedPasswordReset>
  );
}
