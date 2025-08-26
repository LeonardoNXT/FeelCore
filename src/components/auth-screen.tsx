"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Iridescence from "@/blocks/Backgrounds/Beams/Beams";

export default function AuthScreen({ endpoint }: { endpoint: string }) {
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

      const response = await fetch(`/api/${endpoint}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg);
      }

      const data = await response.json();
      const userRole = data.user.role;
      switch (userRole) {
        case "adm":
          router.push("/admin/");
          break;
        case "patient":
          router.push("/patient/");
          break;
        case "employee":
          router.push("/employee/");
          break;
      }
    } catch (err) {
      if (button.current) {
        button.current.textContent = "Entrar";
        button.current.disabled = false;
      }
      if (erro.current) {
        erro.current.textContent =
          err instanceof Error ? err.message : String(err);
        erro.current.classList.remove("opacity-0", "h-0");
        erro.current.classList.add("opacity-100", "h-auto", "p-2");
      }
    }
  }

  return (
    <div className="w-full h-screen flex justify-center items-center relative">
      <div className="w-full h-full absolute saturate-[30%]">
        <Iridescence />
      </div>
      <div className="relative z-10 flex flex-col bg-[#f5f5f5] rounded-2xl w-[90%] max-w-sm sm:max-w-md md:max-w-lg lg:w-[28vw] lg:rounded-[1vw] border border-[#c7bdbd] p-6 sm:p-8 lg:pb-[3vw] lg:pt-[3vw] lg:pl-[2vw] lg:pr-[2vw] mx-4">
        <div
          className="bg-[#fd7373ee] opacity-0 h-0 overflow-hidden rounded-lg lg:rounded-[0.5vw] transition-all duration-300"
          ref={erro}
        >
          <p className="p-4 lg:p-[1vw]"></p>
        </div>
        <form
          action=""
          className="flex gap-4 lg:gap-[1vw] flex-col pt-6 pb-6 lg:pt-[2vw] lg:pb-[2vw]"
          onSubmit={fetchToApi}
        >
          <input
            placeholder="Email"
            type="email"
            className="outline-none border-0 border-b w-full border-b-[#d1d1d1] text-lg lg:text-[1.2rem] text-[#000000] mb-6 lg:mb-[40px] pt-2 pb-2 lg:pt-[0.5vw] lg:pb-[0.5vw] bg-transparent"
            required
            onInput={validateForm}
            ref={email}
          />
          <input
            placeholder="Senha"
            type="password"
            className="outline-none border-0 border-b w-full border-b-[#d1d1d1] text-lg lg:text-[1.2rem] text-[#000] pt-2 pb-2 lg:pt-[0.5vw] lg:pb-[0.5vw] bg-transparent"
            required
            onInput={validateForm}
            ref={senha}
          />
          <p className="text-sm lg:text-[0.8rem] text-center uppercase mb-4 lg:mb-[10px] text-[#8a8a8a] px-2">
            Digite todos os dados corretamente para entrar
          </p>
          <button
            ref={button}
            disabled={!isFormValid}
            className="outline-none border-0 bg-[#000000] p-3 lg:p-[0.5vw] text-base lg:text-[1rem] rounded-lg lg:rounded-[2vw] cursor-pointer transition-all duration-200 disabled:bg-[#ffffff] disabled:text-[#c5c5c5] disabled:border disabled:border-[#ffffff] disabled:cursor-not-allowed"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
