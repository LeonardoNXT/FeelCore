"use client";

import { useEmployeeStore } from "@/stores/userStore";
import {
  User,
  CalendarDays,
  CornerDownRight,
  Cog,
  BookOpenCheck,
  Notebook,
} from "lucide-react";
import Image from "next/image";

export default function MainRouteOfEmployeeConteiner() {
  const { user } = useEmployeeStore();

  const activePatients = user?.patients.filter(
    (patient) => patient.status == "Ativo"
  );

  const ThreeFirstPatients = activePatients?.splice(0, 3);

  return (
    <section className="w-full bg-gradient-to-tr from-[#ffffff] via-[#f3ddff] to-[#ffffff]">
      <div className="w-full px-4 pt-20 pb-10">
        <p className="text-[#333] text-[80px] md:text-8xl leading-[1]">
          Olá, <br />
          <span className="font-bold">{user?.name.split(" ")[0]}!</span>
        </p>
        <div className="flex mt-3 items-center gap-3">
          <div className="text-[#4f724b] px-4 py-1 bg-[#bee6ba] w-max rounded-2xl border-1 border-[#cfecc4]">
            {user?.status}
          </div>
          <div className="flex text-[#333] ">
            <User />
            <p>{user?.patients.length}</p>
          </div>
        </div>
      </div>
      <div className="w-full px-4 relative">
        <div className="w-full px-4 py-4 flex gap-5 bg-[#ffffff5b] rounded-[40px] relative overflow-hidden mb-5 border-1 border-[#ebebeb]">
          {ThreeFirstPatients &&
            ThreeFirstPatients.map((patient, i) => (
              <div key={i} className="h-[50px]">
                {patient.avatar ? (
                  <Image
                    src={`${patient.avatar?.url}`}
                    width={200}
                    height={200}
                    alt={`Foto do(a) paciente ${patient.name.split(" ")[0]}`}
                    className="w-[50px] rounded-full absolute border-5 border-[#acce93] z-10"
                  />
                ) : (
                  <div></div>
                )}
              </div>
            ))}
          <p className="text-[#0f277525] absolute top-[45%] right-[-30%] translate-y-[-50%] text-[80px] leading-[0.6]">
            Pacientes
          </p>
          <button className="text-[#333] absolute top-1/2 right-5 translate-y-[-50%] flex justify-center items-center bg-[#ffffff09] backdrop-blur-[4px] border-1 border-[#dddcdc] py-2 px-4 rounded-4xl gap-2 z-20">
            <User />
            Pacientes
          </button>
          <div className="w-[10%] h-full absolute right-0 top-0 bg-gradient-to-l from-[#fff] to-[#fff0]"></div>
        </div>
        <div className="w-full px-4 py-4 flex gap-5 bg-[#ffffff5b] rounded-[40px] relative overflow-hidden mt-4 mb-4 border-1 border-[#ebebeb] h-[80px]">
          <p className="text-[#74570a25] absolute top-[45%] right-[-10%] translate-y-[-50%] text-[80px] leading-[0.6]">
            Tarefas
          </p>
          <BookOpenCheck className="w-[120px] h-[120px] absolute text-[#ececec] left-[0%]" />
          <button className="text-[#333] absolute top-1/2 left-5 translate-y-[-50%] flex justify-center items-center bg-[#ffffff09] backdrop-blur-[4px] border-1 border-[#dddcdc] py-2 px-4 rounded-4xl gap-2 z-20">
            <BookOpenCheck />
            Tarefas
          </button>
          <div className="w-[10%] h-full absolute right-0 top-0 bg-gradient-to-l from-[#fff] to-[#fff0]"></div>
        </div>
        <div className="w-full px-4 py-4 flex gap-5 bg-[#ffffff5b] rounded-[40px] relative overflow-hidden mt-4 mb-4 border-1 border-[#ebebeb] h-[80px]">
          <p className="text-[#740a4b25] absolute top-[45%] right-[-40%] translate-y-[-50%] text-[80px] leading-[0.6]">
            Anotações
          </p>
          <Notebook className="w-[120px] h-[120px] absolute text-[#ececec] left-[0%]" />
          <button className="text-[#333] absolute top-1/2 right-5 translate-y-[-50%] flex justify-center items-center bg-[#ffffff09] backdrop-blur-[4px] border-1 border-[#dddcdc] py-2 px-4 rounded-4xl gap-2 z-20">
            <Notebook />
            Anotações
          </button>
          <div className="w-[10%] h-full absolute right-0 top-0 bg-gradient-to-l from-[#fff] to-[#fff0]"></div>
        </div>
        <div className="w-full px-5 py-5 bg-[#ffffff5b] rounded-[40px] mb-2 relative border-1 border-[#ebebeb]">
          <div className="w-full flex justify-between items-center mb-4">
            <div className="flex gap-2">
              <CalendarDays className="text-[#333]" />
              <p className="text-[#333] font-bold">Agendamentos</p>
            </div>
            <button className="flex justify-center items-center gap-2 bg-[#5775ad] px-3 py-2 rounded-3xl">
              <span className="text-[#fff] pl-2">Consultar</span>
              <CornerDownRight className="text-[#fff] w-[20px]" />
            </button>
          </div>
          <div className="px-2 w-full mb-4 flex gap-2">
            <p className="text-[#bb8f01] bg-[#f3dd94] px-4 py-1 rounded-2xl border-1">
              Em andamento
            </p>

            <p className="text-[#338000] bg-[#b7f394] px-4 py-1 rounded-2xl border-1">
              Agendado
            </p>
          </div>
          <div className="w-full px-4 py-4 gap-3 bg-[#ffffff6b] rounded-[25px] border-1 border-[#ebebeb] grid grid-cols-4 relative">
            <div className="bg-[#b7f394] w-full text-center px-3 py-4 rounded-2xl border-1">
              <p className="text-[#000] text-[20px] font-bold leading-[0.9]">
                AGO
              </p>
              <p className="text-[#3f3f3ff8] leading-[1] text-[15px] mt-[2px]">
                2
              </p>
            </div>
            <div className="bg-[#b7f394] w-full text-center px-3 py-4 rounded-2xl border-1">
              <p className="text-[#000] text-[20px] font-bold leading-[0.9]">
                AGO
              </p>
              <p className="text-[#3f3f3ff8] leading-[1] text-[15px] mt-[2px]">
                24
              </p>
            </div>
            <div className="bg-[#f3dd94] w-full text-center px-3 py-4 rounded-2xl border-1">
              <p className="text-[#000] text-[20px] font-bold leading-[0.9]">
                AGO
              </p>
              <p className="text-[#3f3f3ff8] leading-[1] text-[15px] mt-[2px]">
                2
              </p>
            </div>
            <div className="bg-[#b7f394] w-full text-center px-3 py-4 rounded-2xl border-1">
              <p className="text-[#000] text-[20px] font-bold leading-[0.9]">
                AGO
              </p>
              <p className="text-[#3f3f3ff8] leading-[1] text-[15px] mt-[2px]">
                24
              </p>
            </div>
            <div className="bg-[#f3dd94] w-full text-center px-3 py-4 rounded-2xl border-1">
              <p className="text-[#000] text-[20px] font-bold leading-[0.9]">
                AGO
              </p>
              <p className="text-[#3f3f3ff8] leading-[1] text-[15px] mt-[2px]">
                2
              </p>
            </div>
            <div className="bg-[#b7f394] w-full text-center px-3 py-4 rounded-2xl border-1">
              <p className="text-[#000] text-[20px] font-bold leading-[0.9]">
                AGO
              </p>
              <p className="text-[#3f3f3ff8] leading-[1] text-[15px] mt-[2px]">
                24
              </p>
            </div>
            <div className="bg-[#f3dd94] w-full text-center px-3 py-4 rounded-2xl border-1">
              <p className="text-[#000] text-[20px] font-bold leading-[0.9]">
                AGO
              </p>
              <p className="text-[#3f3f3ff8] leading-[1] text-[15px] mt-[2px]">
                2
              </p>
            </div>
            <div className="bg-[#b7f394] w-full text-center px-3 py-4 rounded-2xl border-1">
              <p className="text-[#000] text-[20px] font-bold leading-[0.9]">
                AGO
              </p>
              <p className="text-[#3f3f3ff8] leading-[1] text-[15px] mt-[2px]">
                24
              </p>
            </div>
          </div>
        </div>
        <div className="w-full py-4 flex">
          <div className="w-1/2 bg-[#fff] flex items-center flex-col px-2 py-8 rounded-4xl border-1 border-[#ebebeb]">
            {user?.avatar ? (
              <Image
                src={`${user.avatar.url}`}
                width={200}
                height={200}
                alt={`Foto do(a) Funcionário(a) ${user.name.split(" ")[0]}`}
                className="w-[100px] rounded-full"
              ></Image>
            ) : (
              <div></div>
            )}
            <div className="flex text-[#333] items-center mt-3 gap-1 underline">
              <Cog className="text-[#333]" />
              <p className="text-2xl">Config.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
