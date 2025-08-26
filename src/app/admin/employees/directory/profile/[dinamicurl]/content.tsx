/* eslint-disable */
"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  Calendar1,
  Cake,
  Mail,
  Smartphone,
  House,
  Wallet,
  User,
  Pencil,
} from "lucide-react";

export default function ProfileContent({ employeerId }: any) {
  const [icon, setIcon] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [birthday, setBirthday] = useState<string>("");
  const [cpf, setCpf] = useState<string>("");
  const [createdAt, setCreatedAt] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [hireDate, setHireDate] = useState<string>("");
  const [patients, setPatients] = useState<any[]>([]); // Inicialize como array vazio
  const [phone, setPhone] = useState<string>("");
  const [remuneration, setRemuneration] = useState<number>(0);
  const [rg, setRg] = useState<string>("");
  const [status, setStatus] = useState<string>("");

  console.log(employeerId);
  useEffect(() => {
    fetch(`/api/employees/${employeerId}`, {
      method: "POST",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.employee.avatar) {
          setIcon(data.employee.avatar?.url);
        }
        setName(data.employee.name);
        setAddress(data.employee.address);
        setBirthday(
          new Date(data.employee.birthday).toLocaleDateString("pt-br")
        );
        setCpf(data.employee.cpf);
        setCreatedAt(
          new Date(data.employee.createdAt).toLocaleDateString("pt-br")
        );
        setEmail(data.employee.email);
        setHireDate(
          new Date(data.employee.hireDate).toLocaleDateString("pt-br")
        );
        setPatients(data.employee.patients);
        setPhone(data.employee.phone);
        setRemuneration(data.employee.remuneration);
        setRg(data.employee.rg);
        setStatus(data.employee.status);
      });
  }, [employeerId]);
  console.log(hireDate);
  return (
    <div className="w-full bg-[#f8f8f8] rounded-[2vw]">
      <div className="w-full h-[45vw] md:h-[30vh] relative  bg-gradient-to-br from-[#f9fabb] to-[#d29dfd] border-1 border-[#fff] rounded-[5vw] md:rounded-[0vw] md:rounded-tl-[2vw] md:rounded-tr-[2vw]">
        {icon ? ( // se a imagem não existir ele vai pegar as inicias do nome
          <Image
            src={`${icon}`}
            alt="Imagem do Profissional"
            width={500}
            height={500}
            className="rounded-full duration-300 absolute bottom-[-25%] md:w-[200px] md:ml-[1vw]"
          />
        ) : (
          <div className="h-[100px] w-[100px] bg-[#000] rounded-full absolute bottom-[-25%] md:w-[200px] md:h-[200px] md:ml-[1vw] flex justify-center items-center text-4xl border-8 md:border-[20px] border-[#ffffff] md:text-5xl">
            {name.split(" ")[0].split("")[0] +
              name.split(" ")[name.split(" ").length - 1].split("")[0] || "X"}
          </div>
        )}
      </div>
      <div className="flex mt-[8vh] px-[2vw]">
        <p className="text-[#1a1a1a] font-semibold  text-2xl">
          {name.split(" ")[0] +
            " " +
            name.split(" ")[name.split(" ").length - 1] || "Desconhecido"}
        </p>
        <div
          className={`${
            status == "Ativo" ? "bg-[#e7fdd4]" : "bg-[#ffdada]"
          } px-[3vw] flex relative border-1 border-[#d3d3d3bb] rounded-2xl items-center ml-[2vw] md:px-[0.5vw] md:ml-[0.5vw] font-semibold`}
        >
          <p className="text-[#333] text-[14px]  text-center w-full">
            {status || "Desconhecido"}
          </p>
        </div>
      </div>
      <div className="px-[2vw]">
        <p className="text-[#1a1a1a]">{email || "Desconhecido"}</p>
        <p className="text-[16px] mt-[4vw] md:mt-[10px] text-[#333] font-bold">
          Informações pessoais
        </p>
        <p className="text-[#333] w-full text-[14px]">
          Você pode alterar algumas informações
          {name ? ` de ${name.split(" ")[0]}` : ""} por aqui.
        </p>
      </div>
      <div className="w-full">
        <div className="text-[#333] bg-[#fffffff3] text-[14px] mt-[5vw] md:mt-[50px]  px-[4vw] md:px-[2vw] md:py-[2vw] py-[4vw] rounded-[5vw] md:rounded-[2vw] md:grid md:grid-cols-3 md:gap-5">
          <div>
            <div>
              <p className="font-[600] tracking-wide">Nome Completo</p>
              <div className="px-[3vw] md:px-[20px] py-[3vw] md:py-[10px] border-1 mt-[1vw] border-[#f3f3f3] rounded-3xl flex gap-[2vw]">
                <User className="text-[#333] w-[22px]" />
                <p className="text-[15px]">{name || "Desconhecido"}</p>
              </div>
            </div>
            <div className="mt-[5vw] md:mt-[20px]">
              <p className="font-semibold tracking-wide">Endereço de Email</p>
              <div className="px-[3vw] md:px-[20px] py-[3vw] md:py-[10px] border-1 mt-[1vw] border-[#f3f3f3] rounded-3xl flex gap-[2vw] relative">
                <Mail className="text-[#333] w-[22px]" />
                <Pencil className="text-[#333] w-[18px] absolute right-[4vw] md:right-[1.0vw]" />
                <p className="text-[15px] w-full mr-[25px]">
                  {email || "Desconhecido"}
                </p>
              </div>
            </div>
            <div className="mt-[5vw] md:mt-[20px]">
              <p className="font-semibold tracking-wide">Número de Celular</p>{" "}
              <div className="px-[3vw] md:px-[20px] py-[3vw] md:py-[10px] border-1 mt-[1vw] border-[#f3f3f3] rounded-3xl flex gap-[2vw] relative">
                <Smartphone className="text-[#333] w-[22px]" />
                <Pencil className="text-[#333] w-[18px] absolute right-[4vw] md:right-[1.0vw]" />
                <p className="text-[15px]">{phone || "Desconhecido"}</p>
              </div>
            </div>
            <div className="mt-[5vw] md:mt-[20px]">
              <p className="font-semibold tracking-wide">Endereço Completo</p>
              <div className="px-[3vw] md:px-[20px] py-[3vw] md:py-[10px] border-1 mt-[1vw] border-[#f3f3f3] rounded-3xl flex gap-[2vw] relative">
                <House className="text-[#333] w-[22px]" />
                <Pencil className="text-[#333] w-[18px] absolute right-[4vw] md:right-[1.0vw]" />
                <p className="text-[15px]  mr-[25px]">
                  {address || "Desconhecido"}
                </p>
              </div>
            </div>
          </div>
          <div>
            <div className="w-full h-[1px] bg-[#e9e9e9] mt-[4vw] md:hidden"></div>
            <div className="mt-[5vw] md:mt-[0px]">
              <p className="font-semibold tracking-wide">Data de Contratação</p>
              <div className="px-[3vw] md:px-[20px] py-[3vw] md:py-[10px] border-1 mt-[1vw] border-[#f3f3f3] rounded-3xl flex gap-[2vw] relative">
                <Calendar1 className="text-[#333] w-[22px]" />
                <p className="text-[15px]">{hireDate || "Desconhecido"}</p>
              </div>
            </div>
            <div className="mt-[5vw] md:mt-[20px]">
              <p className="font-semibold tracking-wide">
                Adicionado ao Sistema
              </p>
              <div className="px-[3vw] md:px-[20px] py-[3vw] md:py-[10px] border-1 mt-[1vw] border-[#f3f3f3] rounded-3xl flex gap-[2vw] relative">
                <Wallet className="text-[#333] w-[22px]" />
                <p className="text-[15px]">{createdAt || "Desconhecido"}</p>
              </div>
            </div>
            <div className="mt-[5vw] md:mt-[20px]">
              <p className="font-semibold tracking-wide">Remuneração</p>
              <div className="px-[3vw] md:px-[20px] py-[3vw] md:py-[10px] border-1 mt-[1vw] border-[#f3f3f3] rounded-3xl flex gap-[2vw] relative">
                <Pencil className="text-[#333] w-[18px] absolute right-[4vw] md:right-[1.0vw]" />
                <Wallet className="text-[#333] w-[22px]" />
                <p className="text-[15px]">
                  {"R$" + " " + remuneration || "Desconhecido"}
                </p>
              </div>
            </div>
          </div>
          <div>
            <div className="w-full h-[1px] bg-[#e9e9e9] mt-[4vw] md:hidden"></div>
            <div className="mt-[5vw] md:mt-[0px]">
              <p className="font-semibold tracking-wide">Data de Nascimento</p>
              <div className="px-[3vw] md:px-[20px] py-[3vw] md:py-[10px] border-1 mt-[1vw] border-[#f3f3f3] rounded-3xl flex gap-[2vw] relative">
                <Cake className="text-[#333] w-[22px]" />
                <p className="text-[15px]">{birthday || "Desconhecido"}</p>
              </div>
            </div>
            <div className="mt-[5vw] md:mt-[20px]">
              <p className="font-semibold tracking-wide">
                Cadastro de Pessoa Física
              </p>
              <div className="px-[3vw] md:px-[20px] py-[3vw] md:py-[10px] border-1 mt-[1vw] border-[#f3f3f3] rounded-3xl flex gap-[2vw] relative">
                <p className="text-[#333] w-[22px] font-bold">CPF</p>
                <p className="text-[15px]">{cpf || "Desconhecido"}</p>
              </div>
            </div>
            <div className="mt-[5vw] md:mt-[20px]">
              <p className="font-semibold tracking-wide">Registro Geral</p>
              <div className="px-[3vw] md:px-[20px] py-[3vw] md:py-[10px] border-1 mt-[1vw] border-[#f3f3f3] rounded-3xl flex gap-[2vw] relative">
                <p className="text-[#333] w-[22px] font-bold">RG</p>
                <p className="text-[15px]">{rg || "Desconhecido"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
