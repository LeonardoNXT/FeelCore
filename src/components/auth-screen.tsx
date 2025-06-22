"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Iridescence from "@/blocks/Backgrounds/Beams/Beams";

export default function AuthScreen() {
  const router = useRouter();
  const email = useRef<HTMLInputElement>(null);
  const senha = useRef<HTMLInputElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const erro = useRef<HTMLDivElement>(null);

  const [isFormValid, setIsFormValid] = useState(false);

  function validateForm() {
    const emailValue = email.current?.value || "";
    const senhaValue = senha.current?.value || "";

    const isEmailValid = emailValue.includes("@") && emailValue.length > 5;
    const isPasswordValid = senhaValue.length >= 6;

    setIsFormValid(isEmailValid && isPasswordValid);
  }

  async function fetchToApi(
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> {
    e.preventDefault();

    if (!email.current || !senha.current || !button.current || !erro.current) {
      return;
    }

    const user = {
      email: email.current.value.toLowerCase(),
      password: senha.current.value,
    };

    try {
      button.current.textContent = "Entrando...";
      button.current.disabled = true;

      const response = await fetch("http://127.0.0.1:3005/auth/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      // Redireciona para /admin/ após login bem-sucedido
      router.push("/admin/");
    } catch (err) {
      if (button.current) {
        button.current.textContent = "Entrar";
        button.current.disabled = false;
      }
      if (erro.current) {
        erro.current.textContent =
          err instanceof Error ? err.message : String(err);
        erro.current.classList.remove("opacity-0", "h-0");
        erro.current.classList.add("opacity-100", "h-auto");
      }
    }
  }

  return (
    <div className="w-full h-screen flex justify-center items-center relative">
      <div className="w-full h-full absolute saturate-0 invert-100">
        <Iridescence />
      </div>
      <div className="relative z-10 flex-col bg-[#0f0f0f] rounded-[1vw] w-[28vw] border-[1px] border-[#222121] pb-[3vw] pt-[3vw] pl-[2vw] pr-[2vw]">
        <div
          className="bg-[#fd7373ee] opacity-0 h-0 overflow-hidden rounded-[0.5vw] transition-all duration-300"
          ref={erro}
        >
          <p className="p-[1vw]"></p>
        </div>
        <form
          action=""
          className="flex gap-[1vw] flex-col pt-[2vw] pb-[2vw]"
          onSubmit={fetchToApi}
        >
          <input
            placeholder="Email"
            type="email"
            className="outline-none border-0 border-b-[1px] w-full border-b-[#333] text-[1.2rem] text-[#fff] mb-[40px] pt-[0.5vw] pb-[0.5vw]"
            required
            onInput={validateForm}
            ref={email}
          />
          <input
            placeholder="Senha"
            type="password"
            className="outline-none border-0 border-b-[1px] w-full border-b-[#333] text-[1.2rem] text-[#fff] pt-[0.5vw] pb-[0.5vw]"
            required
            onInput={validateForm}
            ref={senha}
          />
          <p className="text-[0.8rem] text-center uppercase mb-[10px] text-[#8a8a8a]">
            Digite todos os dados corretamente para entrar
          </p>
          <button
            ref={button}
            disabled={!isFormValid}
            className="outline-none border-0 bg-[#c5c5c5] p-[0.5vw] text-[1rem] rounded-[2vw] cursor-pointer transition-[0.2s] disabled:bg-[#141414] disabled:text-[#c5c5c5] disabled:border-[1px] disabled:border-[#202020]"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
