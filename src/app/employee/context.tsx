"use client";

import { useEmployeeStore } from "@/stores/userStore";
import {
  MoveUpRight,
  Calendar1,
  MoveRight,
  Users,
  Calendar,
} from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function MainRouteOfEmployeeConteiner() {
  const { user } = useEmployeeStore();
  const patients = user?.patients
    .filter((patient) => patient.status == "Ativo")
    .slice(0, 3);
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
  const imageTest2 = user?.patients[2].avatar?.url;

  if (user) {
    return (
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 1 }}
        className="w-full min-h-screen relative bg-[#000] bg-[url('/background.jpg')] bg-cover bg-center flex justify-center"
      >
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
          <div className="px-4 mt-4">
            <div className="bg-gradient-to-r from-[#222222] to-[#0f0f0f] h-20 rounded-full border-1 border-[#333] relative flex justify-between items-stretchs">
              <div className="flex w-1/2relative items-center gap-[20] ml-4 h-full">
                <p className="px-3 py-2 bg-[#1a1919] rounded-2xl border-1 border-[#333] text-[#a1a1a1]">
                  Agendamentos
                </p>
              </div>
              <div className="w-1/2 h-full px-3 py-3 flex justify-end">
                <div className="w-max h-full bg-[#161616] border-1 border-[#333] rounded-3xl flex gap-2 justify-between items-center text-[#333] px-1">
                  <div className="w-10 aspect-square grid place-items-center rounded-full">
                    {user?.avatar?.url && (
                      <Image
                        src={user.avatar.url}
                        width={50}
                        height={50}
                        className={`rounded-full w-12 h-12 aspect-square absolute top-1/2 translate-y-[-50%] shadow-2xl`}
                        alt="Paciente com consulta marcada"
                      />
                    )}
                  </div>
                  <div className="w-10 aspect-square grid place-items-center rounded-full">
                    <Calendar />
                  </div>
                  <div className="w-10 aspect-square bg-[#fff] grid place-items-center rounded-full">
                    <MoveRight />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex w-full overflow-x-scroll px-4 gap-3 mt-3">
            <div className="flex gap-2">
              <div className=" bg-gradient-to-br from-[#222222] to-[#2c2c2c] rounded-3xl border-1 border-[#333] px-1 py-1">
                <div className="w-full px-2 flex items-center">
                  <div className="px-1 py-1 bg-[#1d1d1d] rounded-3xl border-1 border-[#333] flex justify-between items-center flex-1">
                    <div className="w-3 ml-1 aspect-square bg-green-500 rounded-full"></div>
                    {imageTest && (
                      <Image
                        src={imageTest}
                        width={30}
                        height={30}
                        className="rounded-full h-auto aspect-square"
                        alt="Paciente com consulta marcada"
                      />
                    )}
                  </div>
                  <div className="h-auto">
                    <div className="w-[48px] aspect-square py-2 ml-1">
                      <div className="bg-gradient-to-r from-[#8dcc92] to-[#cc7524] w-full h-full rounded-full grid place-items-center text-[#333]">
                        <MoveUpRight />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-[200px] h-[120px] flex justify-center flex-col items-center text-[#ebebeb] bg-gradient-to-br from-[#010101] border-1 border-[#333] rounded-2xl">
                  <p className="text-5xl font-bold">29</p>
                  <p className="text-[15px]">AGO</p>
                </div>
              </div>
              <div className=" bg-gradient-to-br from-[#222222] to-[#2c2c2c] rounded-3xl border-1 border-[#333] px-1 py-1">
                <div className="w-full px-2 flex items-center">
                  <div className="px-1 py-1 bg-[#1d1d1d] rounded-3xl border-1 border-[#333] flex justify-between items-center flex-1">
                    <div className="w-3 ml-1 aspect-square bg-yellow-500 rounded-full"></div>
                    {imageTest2 && (
                      <Image
                        src={imageTest2}
                        width={30}
                        height={30}
                        className="rounded-full h-auto aspect-square"
                        alt="Paciente com consulta marcada"
                      />
                    )}
                  </div>
                  <div className="h-auto">
                    <div className="w-[48px] aspect-square py-2 ml-1">
                      <div className="bg-gradient-to-r from-[#8dcc92] to-[#cc7524] w-full h-full rounded-full grid place-items-center text-[#333]">
                        <MoveUpRight />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-[200px] h-[120px] flex justify-center flex-col items-center text-[#ebebeb] bg-gradient-to-br from-[#010101] border-1 border-[#333] rounded-2xl">
                  <p className="text-5xl font-bold">30</p>
                  <p className="text-[15px]">AGO</p>
                </div>
              </div>
              <div className=" bg-gradient-to-br from-[#222222] to-[#2c2c2c] rounded-3xl border-1 border-[#333] px-1 py-1">
                <div className="w-full px-2 flex items-center">
                  <div className="px-1 py-1 bg-[#1d1d1d] rounded-3xl border-1 border-[#333] flex justify-between items-center flex-1">
                    <div className="w-3 ml-1 aspect-square bg-green-500 rounded-full"></div>
                    {imageTest && (
                      <Image
                        src={imageTest}
                        width={30}
                        height={30}
                        className="rounded-full h-auto aspect-square"
                        alt="Paciente com consulta marcada"
                      />
                    )}
                  </div>
                  <div className="h-auto">
                    <div className="w-[48px] aspect-square py-2 ml-1">
                      <div className="bg-gradient-to-r from-[#8dcc92] to-[#cc7524] w-full h-full rounded-full grid place-items-center text-[#333]">
                        <MoveUpRight />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-[200px] h-[120px] flex justify-center flex-col items-center text-[#ebebeb] bg-gradient-to-br from-[#010101] border-1 border-[#333] rounded-2xl">
                  <p className="text-5xl font-bold">01</p>
                  <p className="text-[15px]">SET</p>
                </div>
              </div>
            </div>
            <div className="flex gap-2">{}</div>
          </div>
          <div className="px-4 mt-4">
            <div className="bg-gradient-to-r from-[#222222] to-[#0f0f0f] h-20 rounded-full border-1 border-[#333] relative flex justify-between items-stretchs">
              <div className="flex w-1/2 relative gap-[20] ml-4 h-full">
                {patients &&
                  patients.map((patient, i) => (
                    <div key={i}>
                      {patient.avatar ? (
                        <Image
                          src={patient.avatar.url}
                          width={50}
                          height={50}
                          className={`rounded-full w-12 h-12 aspect-square absolute top-1/2 translate-y-[-50%] shadow-2xl`}
                          alt="Paciente com consulta marcada"
                        />
                      ) : (
                        <div></div>
                      )}
                    </div>
                  ))}
              </div>
              <div className="w-1/2 h-full px-3 py-3 flex justify-end">
                <div className="w-max h-full bg-[#161616] border-1 border-[#333] rounded-3xl flex gap-2 justify-between items-center text-[#333] px-1">
                  <div className="w-10 aspect-square grid place-items-center rounded-full">
                    {user?.avatar?.url && (
                      <Image
                        src={user.avatar.url}
                        width={50}
                        height={50}
                        className={`rounded-full w-12 h-12 aspect-square absolute top-1/2 translate-y-[-50%] shadow-2xl`}
                        alt="Paciente com consulta marcada"
                      />
                    )}
                  </div>
                  <div className="w-10 aspect-square grid place-items-center rounded-full">
                    <Users />
                  </div>
                  <div className="w-10 aspect-square bg-[#fff] grid place-items-center rounded-full">
                    <MoveRight />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex w-full overflow-x-scroll px-4 gap-3">
            <div className="flex gap-2">
              <div className="w-[300px] rounded-[25px] bg-[#141414] mt-4 relative border-1 border-[#333]">
                <div className="px-5 py-5">
                  <div className="flex gap-2 justify-center items-stretch">
                    <div className="h-auto w-[20%] ">
                      {imageTest2 && (
                        <Image
                          src={imageTest2}
                          width={50}
                          height={50}
                          className="rounded-full py-1 px-1 h-auto aspect-square"
                          alt="Paciente com consulta marcada"
                        />
                      )}
                    </div>
                    <div className=" text-[#dad9d9] w-[80%] text-[16px] px-4 py-2 bg-[#202020] rounded-[20px] border-1 border-[#444444] text-nowrap overflow-hidden flex justify-center items-center relative">
                      <p className="absolute left-3">
                        Conte sobre sua história
                      </p>
                      <div className="w-[100%] h-full bg-gradient-to-l from-[#333] to-[#fff00] absolute top-0 right-0"></div>
                    </div>
                  </div>
                  <p className="text-[#a0a0a0] ml-2 mt-6">
                    Olá, meu nome é Liza e vou contar um pouco de minha
                    história!
                  </p>
                  <div className="h-12 relative flex justify-between items-center mt-4">
                    <div className="px-4 py-2 bg-[#1d1d1d] rounded-2xl border-1 border-[#333] text-[14px] text-[#666666] flex justify-center items-center gap-2">
                      <div className="w-3 h-max aspect-square rounded-full bg-green-500"></div>
                      <p>29/08</p>
                    </div>
                    <div className="h-full aspect-square bg-[#fff] grid place-items-center rounded-full">
                      <MoveUpRight className="text-[#333] h-7 w-7" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="w-[300px] rounded-[25px] bg-[#141414] mt-4 relative border-1 border-[#333]">
                <div className="px-5 py-5">
                  <div className="flex gap-2 justify-center items-stretch">
                    <div className="h-auto w-[20%]">
                      {imageTest && (
                        <Image
                          src={imageTest}
                          width={50}
                          height={50}
                          className="rounded-full py-1 px-1 h-auto aspect-square"
                          alt="Paciente com consulta marcada"
                        />
                      )}
                    </div>
                    <div className=" text-[#dad9d9] w-[80%] text-[16px] px-4 py-2 bg-[#202020] rounded-[15px] border-1 border-[#444444] text-nowrap overflow-hidden flex justify-center items-center relative">
                      <p className="absolute left-3">
                        Como você acha que pode melhorar
                      </p>
                      <div className="w-[100%] h-full bg-gradient-to-l from-[#333] to-[#fff00] absolute top-0 right-0"></div>
                    </div>
                  </div>
                  <p className="text-[#a0a0a0] ml-2 mt-6">
                    Melhorar é a base da vontade de aprender a ser melhor.
                  </p>
                  <div className="h-12 relative flex justify-between items-center mt-4">
                    <div className="px-4 py-2 bg-[#1d1d1d] rounded-2xl border-1 border-[#333] text-[14px] text-[#666666] flex justify-center items-center gap-2">
                      <div className="w-3 h-max aspect-square rounded-full bg-green-500"></div>
                      <p>28/08</p>
                    </div>
                    <div className="h-full aspect-square bg-[#fff] grid place-items-center rounded-full">
                      <MoveUpRight className="text-[#333] h-7 w-7" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>
    );
  } else {
    return <div>Aguarde</div>;
  }
}
