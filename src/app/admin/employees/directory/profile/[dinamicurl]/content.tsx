/* eslint-disable */
"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  Calendar,
  Cake,
  Mail,
  Smartphone,
  Home,
  Wallet,
  User,
  Pencil,
  Eye,
  EyeOff,
  Save,
  Loader2,
  Trash2,
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
  const [patients, setPatients] = useState<any[]>([]);
  const [phone, setPhone] = useState<string>("");
  const [remuneration, setRemuneration] = useState<number>(0);
  const [rg, setRg] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [handleCPFVisible, setHandleCPFVisible] = useState<boolean>(false);

  // Estados para edição
  const [editedEmail, setEditedEmail] = useState<string>("");
  const [editedPhone, setEditedPhone] = useState<string>("");
  const [editedRemuneration, setEditedRemuneration] = useState<string>("");
  const [editedAddress, setEditedAddress] = useState<string>("");
  const [hasChanges, setHasChanges] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [errors, setErrors] = useState<{
    email?: string;
    phone?: string;
    remuneration?: string;
  }>({});

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

        // Inicializar campos editáveis
        setEditedEmail(data.employee.email);
        setEditedPhone(data.employee.phone);
        setEditedRemuneration(data.employee.remuneration.toString());
        setEditedAddress(data.employee.address);
      });
  }, [employeerId]);

  const handleInputChange = (field: string, value: string) => {
    switch (field) {
      case "email":
        setEditedEmail(value);
        break;
      case "phone":
        setEditedPhone(value);
        break;
      case "remuneration":
        setEditedRemuneration(value);
        break;
      case "address":
        setEditedAddress(value);
        break;
    }
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);

      const response = await fetch(`/api/employees/${employeerId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: editedEmail,
          phone: editedPhone,
          remuneration: parseFloat(editedRemuneration),
          address: editedAddress,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao atualizar funcionário");
      }

      // Atualizar estados locais
      setEmail(editedEmail);
      setPhone(editedPhone);
      setRemuneration(parseFloat(editedRemuneration));
      setAddress(editedAddress);
      setHasChanges(false);

      alert("Funcionário atualizado com sucesso!");
    } catch (error: any) {
      console.error("Erro ao salvar:", error);
      alert(error.message || "Erro ao salvar alterações");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = confirm(
      `Tem certeza que deseja deletar ${
        name.split(" ")[0]
      }? Esta ação não pode ser desfeita.`
    );

    if (!confirmDelete) return;

    try {
      setIsDeleting(true);

      const response = await fetch(`/api/employees/${employeerId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao deletar funcionário");
      }

      alert("Funcionário deletado com sucesso!");
      window.location.href = "/employees"; // Redirecionar para lista de funcionários
    } catch (error: any) {
      console.error("Erro ao deletar:", error);
      alert(error.message || "Erro ao deletar funcionário");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="w-full bg-[#f8f8f8] rounded-[2vw] relative">
      <div className="w-full h-[45vw] md:h-[30vh] relative bg-gradient-to-br from-[#f9fabb] to-[#d29dfd] border-1 border-[#fff] rounded-[5vw] md:rounded-[0vw] md:rounded-tl-[2vw] md:rounded-tr-[2vw]">
        {icon ? (
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
        <p className="text-[#1a1a1a] font-semibold text-2xl">
          {name.split(" ")[0] +
            " " +
            name.split(" ")[name.split(" ").length - 1] || "Desconhecido"}
        </p>
        <div
          className={`${
            status == "Ativo" ? "bg-[#e7fdd4]" : "bg-[#ffdada]"
          } px-[3vw] flex relative border-1 border-[#d3d3d3bb] rounded-2xl items-center ml-[2vw] md:px-[0.5vw] md:ml-[0.5vw] font-semibold`}
        >
          <p className="text-[#333] text-[14px] text-center w-full">
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
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="flex items-center my-4 mx-6 gap-2 text-[14px] bg-[#00000002 disabled:bg-gray-400 text-[#333] px-4 py-3 rounded-full shadow-lg transition-all cursor-pointer border-1 border-[#bbb]"
      >
        {isDeleting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Deletando...
          </>
        ) : (
          <>
            <Trash2 className="w-4  h-4 " />
            Deletar Funcionário
          </>
        )}
      </button>
      <div className="w-full">
        <div className="text-[#333] bg-[#fffffff3] text-[14px] mt-[5vw] md:mt-[20px] px-[4vw] md:px-[2vw] md:py-[2vw] py-[4vw] rounded-[5vw] md:rounded-[2vw] md:grid md:grid-cols-3 md:gap-5">
          <div>
            {/* Nome - NÃO EDITÁVEL */}
            <div>
              <p className="font-[600] tracking-wide">Nome Completo</p>
              <div className="px-[3vw] md:px-[20px] py-[3vw] md:py-[10px] border-1 mt-[1vw] border-[#f3f3f3] rounded-3xl flex gap-[2vw]">
                <User className="text-[#333] w-[22px]" />
                <p className="text-[15px]">{name || "Desconhecido"}</p>
              </div>
            </div>

            {/* Email - EDITÁVEL */}
            <div className="mt-[5vw] md:mt-[20px]">
              <p className="font-semibold tracking-wide">Endereço de Email</p>
              <div className="px-[3vw] md:px-[20px] py-[3vw] md:py-[10px] border-1 mt-[1vw] border-[#f3f3f3] rounded-3xl flex gap-[2vw] relative">
                <Mail className="text-[#333] w-[22px]" />
                <Pencil className="text-[#333] w-[18px] absolute right-[4vw] md:right-[1.0vw]" />
                <input
                  type="email"
                  value={editedEmail}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="text-[15px] w-full mr-[25px] bg-transparent outline-none"
                />
              </div>
            </div>

            {/* Telefone - EDITÁVEL */}
            <div className="mt-[5vw] md:mt-[20px]">
              <p className="font-semibold tracking-wide">Número de Celular</p>
              <div className="px-[3vw] md:px-[20px] py-[3vw] md:py-[10px] border-1 mt-[1vw] border-[#f3f3f3] rounded-3xl flex gap-[2vw] relative">
                <Smartphone className="text-[#333] w-[22px]" />
                <Pencil className="text-[#333] w-[18px] absolute right-[4vw] md:right-[1.0vw]" />
                <input
                  type="text"
                  value={editedPhone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="text-[15px] bg-transparent outline-none"
                />
              </div>
            </div>
          </div>

          <div>
            <div className="w-full h-[1px] bg-[#e9e9e9] mt-[4vw] md:hidden"></div>

            {/* Data de Contratação - NÃO EDITÁVEL */}
            <div className="mt-[5vw] md:mt-[0px]">
              <p className="font-semibold tracking-wide">Data de Contratação</p>
              <div className="px-[3vw] md:px-[20px] py-[3vw] md:py-[10px] border-1 mt-[1vw] border-[#f3f3f3] rounded-3xl flex gap-[2vw] relative">
                <Calendar className="text-[#333] w-[22px]" />
                <p className="text-[15px]">{hireDate || "Desconhecido"}</p>
              </div>
            </div>

            {/* Adicionado ao Sistema - NÃO EDITÁVEL */}
            <div className="mt-[5vw] md:mt-[20px]">
              <p className="font-semibold tracking-wide">
                Adicionado ao Sistema
              </p>
              <div className="px-[3vw] md:px-[20px] py-[3vw] md:py-[10px] border-1 mt-[1vw] border-[#f3f3f3] rounded-3xl flex gap-[2vw] relative">
                <Wallet className="text-[#333] w-[22px]" />
                <p className="text-[15px]">{createdAt || "Desconhecido"}</p>
              </div>
            </div>

            {/* Remuneração - EDITÁVEL */}
            <div className="mt-[5vw] md:mt-[20px]">
              <p className="font-semibold tracking-wide">Remuneração</p>
              <div className="px-[3vw] md:px-[20px] py-[3vw] md:py-[10px] border-1 mt-[1vw] border-[#f3f3f3] rounded-3xl flex gap-[2vw] relative">
                <Pencil className="text-[#333] w-[18px] absolute right-[4vw] md:right-[1.0vw]" />
                <Wallet className="text-[#333] w-[22px]" />
                <input
                  type="number"
                  value={editedRemuneration}
                  onChange={(e) =>
                    handleInputChange("remuneration", e.target.value)
                  }
                  className="text-[15px] bg-transparent outline-none"
                  step="0.01"
                  min="0"
                />
              </div>
            </div>
          </div>

          <div>
            <div className="w-full h-[1px] bg-[#e9e9e9] mt-[4vw] md:hidden"></div>

            {/* Data de Nascimento - NÃO EDITÁVEL */}
            <div className="mt-[5vw] md:mt-[0px]">
              <p className="font-semibold tracking-wide">Data de Nascimento</p>
              <div className="px-[3vw] md:px-[20px] py-[3vw] md:py-[10px] border-1 mt-[1vw] border-[#f3f3f3] rounded-3xl flex gap-[2vw] relative">
                <Cake className="text-[#333] w-[22px]" />
                <p className="text-[15px]">{birthday || "Desconhecido"}</p>
              </div>
            </div>

            {/* CPF - NÃO EDITÁVEL */}
            <div className="mt-[5vw] md:mt-[20px]">
              <p className="font-semibold tracking-wide">
                Cadastro de Pessoa Física
              </p>
              <div className="px-[3vw] md:px-[20px] py-[3vw] md:py-[10px] border-1 mt-[1vw] border-[#f3f3f3] rounded-3xl flex gap-[2vw] relative">
                <p className="text-[#333] w-[22px] font-bold">CPF</p>
                <p className="text-[15px]">
                  {handleCPFVisible ? (
                    cpf
                  ) : (
                    <span className="tracking-widest">***.***.***-**</span>
                  )}
                </p>
                <div className="absolute right-4 cursor-pointer">
                  {handleCPFVisible ? (
                    <Eye onClick={() => setHandleCPFVisible(false)} />
                  ) : (
                    <EyeOff onClick={() => setHandleCPFVisible(true)} />
                  )}
                </div>
              </div>
            </div>

            {/* Endereço - EDITÁVEL */}
            <div className="mt-[5vw] md:mt-[20px]">
              <p className="font-semibold tracking-wide select-none">
                Endereço Completo
              </p>
              <div className="px-[3vw] md:px-[20px] py-[3vw] md:py-[10px] border-1 mt-[1vw] border-[#f3f3f3] rounded-3xl flex gap-[2vw] relative select-none">
                <Home className="text-[#333] w-[22px]" />
                <Pencil className="text-[#333] w-[18px] absolute right-[4vw] md:right-[1.0vw]" />
                <input
                  type="text"
                  value={editedAddress}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  className="text-[15px] mr-[25px] bg-transparent outline-none w-full"
                />
              </div>
            </div>
          </div>
          {hasChanges && (
            <div className="flex w-full col-span-3 justify-end bottom-8 right-8 z-50">
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="flex items-center gap-2 bg-[#4385ac] text-[14px] hover:bg-[#3a8eef] disabled:bg-gray-400 text-white px-6 py-3 rounded-full shadow-lg transition-all transform cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Salvar Alterações
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
