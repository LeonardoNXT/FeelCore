"use client";

import { useEmployeeStore } from "@/stores/userStore";
import { MoveUpRight, Calendar1 } from "lucide-react";
import Image from "next/image";

export default function MainRouteOfEmployeeConteiner() {
  const { user } = useEmployeeStore();
  const [dia, mes] = new Date().toLocaleDateString("pt-br").split("/");
  const hoje = new Date();

  const diasDaSemana = [
    "Domingo",
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado",
  ];
  const diaAtual = diasDaSemana[hoje.getDay()];

  const imageTest = user?.patients[0].avatar?.url;

  return (
    <section className="w-full min-h-screen relative bg-[#000] bg-[url('/background.jpg')] bg-cover bg-center">
      <div className="w-full min-h-screen top-0 backdrop-blur-2xl backdrop-sepia-90">
        <div className="px-5 pt-40">
          <p className="text-5xl">Bem-vindo, é bom te ver aqui!</p>
          <p className="text-2xl text-[#fff8e2]">
            {dia}.{mes} - {diaAtual}
          </p>
        </div>
        <div className="px-4 mt-10">
          <div className="w-full px-2 py-2 bg-amber-100 border-1 relative rounded-[40px] text-[#333] flex justify-between overflow-hidden">
            <div className="flex border-1 border-[#af8d5b] rounded-full bg-[#0a0a0a]">
              <div className="w-15 leading-[0.9] flex justify-center items-center flex-col text-[13px] rounded-full text-[#ebebeb]">
                <Calendar1 className="text-[#e4dbb6]" />
              </div>
              <div className="flex border-1 border-[#4d4d4d42] rounded-full bg-[#0a0a0a]">
                <div className="flex">
                  {imageTest && (
                    <Image
                      src={imageTest}
                      width={50}
                      height={50}
                      className="rounded-full py-1 px-1 h-full w-14 aspect-square"
                      alt="Paciente com consulta marcada"
                    />
                  )}
                </div>
                <div className="w-16 leading-[1] flex justify-center items-center flex-col text-[13px] text-[#ebebeb]">
                  <p className="font-bold text-[#fff]">AGO</p>
                  <p>29</p>
                </div>
                <div className="w-16 leading-[0.9] flex justify-center items-center flex-col text-[13px] text-[#ebebeb] relative">
                  <p className="font-bold text-[#868581ec]">14:30</p>
                  <div className="w-[1px] h-[50%] bg-[#7c7777] absolute left-0 top-1/2 translate-y-[-50%]"></div>
                </div>
              </div>
            </div>
            <div className="h-auto w-min relative right-1">
              <div className="p-4 h-full w-auto aspect-square bg-[#000] rounded-full flex justify-center items-center">
                <MoveUpRight className="text-[#ebebeb]" />
              </div>
            </div>
          </div>
        </div>
        <div className="flex w-full overflow-x-scroll px-4">
          <div className="flex gap-2">
            <div className="w-[300px] px-2 py-25 rounded-[25px] bg-[#141414] mt-4"></div>
            <div className="w-[300px] px-2 py-25 rounded-[25px] bg-[#141414] mt-4"></div>
            <div className="w-[300px] px-2 py-25 rounded-[25px] bg-[#2d2d3d] mt-4"></div>
          </div>
        </div>
        <div className="px-4 mt-4">
          <div className="py-34 bg-[#f5e8bd] rounded-4xl"></div>
        </div>
      </div>
    </section>
  );
}
