"use client";
import { useConsumerStore } from "@/stores/consumesStrore";
import { useEffect, useState, useRef } from "react";
import {
  User,
  Mail,
  KeyRound,
  Zap,
  UserCheck,
  SquareUserRound,
} from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

interface Employee {
  _id: string;
  name: string;
  avatar?: {
    url: string;
    public: string;
  };
}

export default function CadastroLastStep({
  backPage,
}: {
  backPage: () => void;
}) {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const { consumer } = useConsumerStore();
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const handleClick = () => {
    inputRef.current?.click(); // dispara o clique no input escondido
  };
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
  };
  useEffect(() => {
    if (!consumer.patient_of) {
      backPage();
    }
    fetch(`/api/employees/${consumer.patient_of}`, {
      method: "post",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => setEmployee(data.employee));
  });
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, filter: "blur(10px)" }}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.5 }}
        className="p-2 pl-6 mt-20 mb-0"
      >
        <div className="px-3 py-2 bg-gradient-to-br from-[#26bfd3] to-[#03c4ff00] text-[14px] text-[#ffffff] rounded-[13px] w-max flex items-center">
          <p></p>
          <Zap className="text-[#fff] w-[13px] mr-2" />
          <p>Último Passo</p>
        </div>
        <div className="text-[#2b2b2b] text-[75px] font-bold leading-[1]">
          <p>{consumer.name?.split(" ")[0]}</p>
          <div className="flex items-center gap-3">
            <p className="w-max">
              {consumer.name?.split(" ")[consumer.name.split(" ").length - 1]}
            </p>
            <p className="text-[40px] text-[#84f8f871]">✦</p>
          </div>
        </div>
      </motion.div>
      <div className="p-4">
        {employee && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="bg-[#ffffff17] px-4 py-4 rounded-[35px] border-1 border-[#dddbdb7c] "
          >
            <div className="flex">
              <UserCheck className="text-[#333] w-[20px] mb-5" />
              <p className="text-[#333] ml-2 font-semibold">
                Funcionário Selecionado
              </p>
            </div>
            <div className="flex w-full items-center">
              {employee.avatar ? (
                <Image
                  src={employee.avatar.url}
                  alt="imagem do psicologo"
                  width={200}
                  height={200}
                  className="rounded-full h-[80px] w-[80px] border-[#4c4285] border-5"
                ></Image>
              ) : (
                <div className="w-[80px] h-[80px] rounded-full bg-[#000] border-[#4c4285] border-5 flex justify-center items-center text-[#ebebeb] font-bold text-[30px]">
                  {employee?.name.split(" ")[0].split("")[0] +
                    (employee?.name
                      .split(" ")
                      [employee.name.split(" ").length - 1].split("")[0] || "")}
                </div>
              )}
              <p className="text-[#333] font-semibold flex-1 w-auto text-center">
                {employee?.name}
              </p>
            </div>
          </motion.div>
        )}
      </div>
      <motion.div
        initial={{ opacity: 0, filter: "blur(10px)" }}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.5 }}
        className=" px-6 py-4 rounded-[20px] items-center mt-[5px]"
      >
        <div className="flex items-center gap-4 justify-stretch w-full mt-1">
          <User className="text-[#7a7a7a] w-[20px]" />
          <div className="text-[#7a7a7a] px-4 py-2 border-1 border-[#c0c0c046] rounded-2xl flex-1 w-auto">
            {consumer.name}
          </div>
        </div>
        <div className="flex items-center gap-4 justify-stretch w-full mt-4">
          <Mail className="text-[#7a7a7a] w-[20px]" />
          <div className="text-[#7a7a7a] px-4 py-2 border-1 border-[#c0c0c046] rounded-2xl flex-1 w-auto">
            {consumer.email}
          </div>
        </div>
        <div className="flex items-center gap-4 justify-stretch w-full mt-4">
          <KeyRound className="text-[#7a7a7a] w-[20px]" />
          <div className="text-[#7a7a7a] px-4 py-2 border-1 border-[#c0c0c046] rounded-2xl flex-1 w-auto">
            ------------
          </div>
        </div>
      </motion.div>
      <div className="p-4">
        <motion.div
          initial={{ opacity: 0, filter: "blur(10px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.5 }}
          className="p-4 border-1 border-[#9e9e9e2a] rounded-[30px]"
        >
          <div className="flex">
            <SquareUserRound className="text-[#333] w-[20px] mb-5" />
            <p className="text-[#333] ml-2 font-semibold">Imagem de Perfil</p>
          </div>
          <div className="flex w-full">
            <div className="flex items-end w-1/2">
              {/* Botão estilizado */}
              <button
                onClick={handleClick}
                className="px-[20px] py-[10] text-[#464646] font-bold text-[14px] rounded-[20px] cursor-pointer border-dashed border-[#a8be7f] border-1"
              >
                Adicionar imagem
              </button>

              {/* Input escondido */}
              <input
                type="file"
                accept="image/*"
                ref={inputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
            </div>
            <div className="w-1/2 flex justify-end">
              {preview ? (
                <Image
                  src={preview}
                  width={80}
                  height={80}
                  alt="Preview"
                  className="w-[80px] aspect-square rounded-full border-4 border-[#4ca5ac7c] object-cover"
                />
              ) : (
                consumer.name && (
                  <div className="w-[80px] aspect-square bg-[#000] rounded-full border-4 border-[#4ca5ac7c] flex justify-center items-center font-bold text-[30px] text-white">
                    {consumer?.name.split(" ")[0][0] +
                      (consumer?.name.split(" ")[
                        consumer.name.split(" ").length - 1
                      ][0] || "")}
                  </div>
                )
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
