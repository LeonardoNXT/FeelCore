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
  User,
  Pencil,
  Save,
  Loader2,
  Trash2,
  Briefcase,
  AlertCircle,
  Users,
  MapPin,
} from "lucide-react";

export default function CustomerProfileContent({ customerId }: any) {
  const [icon, setIcon] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [birthday, setBirthday] = useState<string>("");
  const [createdAt, setCreatedAt] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [profession, setProfession] = useState<string>("");
  const [address, setAddress] = useState<any>({});
  const [emergencyContact, setEmergencyContact] = useState<string>("");
  const [emergencyName, setEmergencyName] = useState<string>("");
  const [patientOf, setPatientOf] = useState<string>("");
  const [disorders, setDisorders] = useState<string[]>([]);

  // Estados para edição
  const [editedEmail, setEditedEmail] = useState<string>("");
  const [editedPhone, setEditedPhone] = useState<string>("");
  const [editedProfession, setEditedProfession] = useState<string>("");
  const [editedZipCode, setEditedZipCode] = useState<string>("");
  const [editedStreet, setEditedStreet] = useState<string>("");
  const [editedNumber, setEditedNumber] = useState<string>("");
  const [editedNeighborhood, setEditedNeighborhood] = useState<string>("");
  const [editedCity, setEditedCity] = useState<string>("");
  const [editedState, setEditedState] = useState<string>("");
  const [editedComplement, setEditedComplement] = useState<string>("");
  const [editedEmergencyContact, setEditedEmergencyContact] =
    useState<string>("");
  const [editedEmergencyName, setEditedEmergencyName] = useState<string>("");
  const [hasChanges, setHasChanges] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isLoadingCep, setIsLoadingCep] = useState<boolean>(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<boolean>(false);

  useEffect(() => {
    fetch(`/api/customers/${customerId}`, {
      method: "POST",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.customer.avatar) {
          setIcon(data.customer.avatar?.url);
        }
        setName(data.customer.name);
        setAddress(data.customer.address || {});
        setBirthday(
          new Date(data.customer.birth_date).toLocaleDateString("pt-br")
        );
        setCreatedAt(
          new Date(data.customer.createdAt).toLocaleDateString("pt-br")
        );
        setEmail(data.customer.email);
        setPhone(data.customer.contacts?.phone || "");
        setStatus(data.customer.status);
        setProfession(data.customer.profession || "");
        setEmergencyContact(data.customer.contacts?.emergency_contact || "");
        setEmergencyName(data.customer.contacts?.emergency_name || "");
        setPatientOf(data.customer.patient_of?.name || "");
        setDisorders(data.customer.disorders || []);

        // Inicializar campos editáveis
        setEditedEmail(data.customer.email);
        setEditedPhone(data.customer.contacts?.phone || "");
        setEditedProfession(data.customer.profession || "");
        setEditedZipCode(data.customer.address?.zip_code || "");
        setEditedStreet(data.customer.address?.street || "");
        setEditedNumber(data.customer.address?.number || "");
        setEditedNeighborhood(data.customer.address?.neighborhood || "");
        setEditedCity(data.customer.address?.city || "");
        setEditedState(data.customer.address?.state || "");
        setEditedComplement(data.customer.address?.complement || "");
        setEditedEmergencyContact(
          data.customer.contacts?.emergency_contact || ""
        );
        setEditedEmergencyName(data.customer.contacts?.emergency_name || "");
      });
  }, [customerId]);

  const handleInputChange = (field: string, value: string) => {
    switch (field) {
      case "email":
        setEditedEmail(value);
        break;
      case "phone":
        setEditedPhone(value);
        break;
      case "profession":
        setEditedProfession(value);
        break;
      case "zipCode":
        setEditedZipCode(value);
        break;
      case "street":
        setEditedStreet(value);
        break;
      case "number":
        setEditedNumber(value);
        break;
      case "neighborhood":
        setEditedNeighborhood(value);
        break;
      case "city":
        setEditedCity(value);
        break;
      case "state":
        setEditedState(value);
        break;
      case "complement":
        setEditedComplement(value);
        break;
      case "emergencyContact":
        setEditedEmergencyContact(value);
        break;
      case "emergencyName":
        setEditedEmergencyName(value);
        break;
    }
    setHasChanges(true);
  };

  const handleCepBlur = async () => {
    const cep = editedZipCode.replace(/\D/g, "");

    if (cep.length !== 8) return;

    try {
      setIsLoadingCep(true);
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (data.erro) {
        alert("CEP não encontrado");
        return;
      }

      setEditedStreet(data.logradouro);
      setEditedNeighborhood(data.bairro);
      setEditedCity(data.localidade);
      setEditedState(data.uf);
      setHasChanges(true);
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
      alert("Erro ao buscar CEP");
    } finally {
      setIsLoadingCep(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);

      const response = await fetch(`/api/customers/${customerId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: editedEmail,
          contacts: {
            phone: editedPhone,
            emergency_contact: editedEmergencyContact,
            emergency_name: editedEmergencyName,
          },
          profession: editedProfession,
          address: {
            zip_code: editedZipCode,
            street: editedStreet,
            number: editedNumber,
            neighborhood: editedNeighborhood,
            city: editedCity,
            state: editedState,
            complement: editedComplement,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao atualizar paciente");
      }

      // Atualizar estados locais
      setEmail(editedEmail);
      setPhone(editedPhone);
      setProfession(editedProfession);
      setEmergencyContact(editedEmergencyContact);
      setEmergencyName(editedEmergencyName);
      setAddress({
        zip_code: editedZipCode,
        street: editedStreet,
        number: editedNumber,
        neighborhood: editedNeighborhood,
        city: editedCity,
        state: editedState,
        complement: editedComplement,
      });
      setHasChanges(false);

      alert("Paciente atualizado com sucesso!");
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

      const response = await fetch(`/api/customers/${customerId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao deletar paciente");
      }

      alert("Paciente deletado com sucesso!");
      window.location.href = "/admin/directory";
    } catch (error: any) {
      console.error("Erro ao deletar:", error);
      alert(error.message || "Erro ao deletar paciente");
    } finally {
      setIsDeleting(false);
    }
  };

  const formatCep = (value: string) => {
    const cleanValue = value.replace(/\D/g, "");
    if (cleanValue.length <= 5) return cleanValue;
    return `${cleanValue.slice(0, 5)}-${cleanValue.slice(5, 8)}`;
  };

  const handleToggleStatus = async () => {
    const newStatus = status === "Ativo" ? "Inativo" : "Ativo";

    try {
      setIsUpdatingStatus(true);

      const response = await fetch(`/api/customers/${customerId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao atualizar status");
      }

      setStatus(newStatus);
      alert(`Status alterado para ${newStatus} com sucesso!`);
    } catch (error: any) {
      console.error("Erro ao alterar status:", error);
      alert(error.message || "Erro ao alterar status");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  return (
    <div className="w-full bg-[#f8f8f8] rounded-[2vw] relative">
      <div className="w-full h-[45vw] md:h-[30vh] relative bg-gradient-to-br from-[#221616] to-[#9dd4fd] border-1 border-[#fff] rounded-[5vw] md:rounded-[0vw] md:rounded-tl-[2vw] md:rounded-tr-[2vw]">
        {icon ? (
          <Image
            src={`${icon}`}
            alt="Imagem do Paciente"
            width={500}
            height={500}
            className="rounded-full duration-300 absolute bottom-[-25%] w-[150px] md:w-[200px] md:ml-[1vw]"
          />
        ) : (
          <div className="h-[100px] w-[100px] bg-[#000] rounded-full absolute bottom-[-25%] md:w-[200px] md:h-[200px] md:ml-[1vw] flex justify-center items-center text-4xl border-8 md:border-[20px] border-[#ffffff] md:text-5xl">
            {name.split(" ")[0].split("")[0] +
              name.split(" ")[name.split(" ").length - 1].split("")[0] || "X"}
          </div>
        )}
      </div>
      <div className="flex mt-[8vh] px-[2vw] items-center">
        <p className="text-[#1a1a1a] font-semibold text-2xl">
          {name.split(" ")[0] +
            " " +
            name.split(" ")[name.split(" ").length - 1] || "Desconhecido"}
        </p>
        <button
          onClick={handleToggleStatus}
          disabled={isUpdatingStatus}
          className={`${
            status == "Ativo"
              ? "bg-[#e7fdd4] hover:bg-[#d4fcc0]"
              : "bg-[#ffdada] hover:bg-[#ffc9c9]"
          } px-[3vw] flex relative border-1 border-[#d3d3d3bb] rounded-2xl items-center ml-[2vw] md:px-[0.5vw] md:ml-[0.5vw] font-semibold transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
          title={`Clique para alterar para ${
            status === "Ativo" ? "Inativo" : "Ativo"
          }`}
        >
          {isUpdatingStatus ? (
            <Loader2 className="w-5 h-5 animate-spin text-[#333]" />
          ) : (
            <p className="text-[#333] text-[14px] text-center w-full">
              {status || "Desconhecido"}
            </p>
          )}
        </button>
      </div>
      <div className="px-[2vw]">
        <p className="text-[#1a1a1a]">{email || "Desconhecido"}</p>
        {patientOf && (
          <p className="text-[#666] text-[14px] mt-1">
            Responsável: {patientOf}
          </p>
        )}
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
        className="flex items-center my-4 mx-6 gap-2 text-[14px] bg-[#00000002] disabled:bg-gray-400 text-[#333] px-4 py-3 rounded-full shadow-lg transition-all cursor-pointer border-1 border-[#bbb]"
      >
        {isDeleting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Deletando...
          </>
        ) : (
          <>
            <Trash2 className="w-4 h-4" />
            Deletar Paciente
          </>
        )}
      </button>
      <div className="w-full">
        <div className="text-[#333] bg-[#fffffff3] text-[14px] mt-[5vw] md:mt-[20px] px-[4vw] md:px-[2vw] md:py-[2vw] py-[4vw] rounded-[5vw] md:rounded-[2vw]">
          <div className="md:grid md:grid-cols-3 md:gap-5">
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
                    className="text-[15px] bg-transparent outline-none w-full mr-[25px]"
                  />
                </div>
              </div>

              {/* Profissão - EDITÁVEL */}
              <div className="mt-[5vw] md:mt-[20px]">
                <p className="font-semibold tracking-wide">Profissão</p>
                <div className="px-[3vw] md:px-[20px] py-[3vw] md:py-[10px] border-1 mt-[1vw] border-[#f3f3f3] rounded-3xl flex gap-[2vw] relative">
                  <Briefcase className="text-[#333] w-[22px]" />
                  <Pencil className="text-[#333] w-[18px] absolute right-[4vw] md:right-[1.0vw]" />
                  <input
                    type="text"
                    value={editedProfession}
                    onChange={(e) =>
                      handleInputChange("profession", e.target.value)
                    }
                    className="text-[15px] bg-transparent outline-none w-full mr-[25px]"
                  />
                </div>
              </div>
            </div>

            <div>
              <div className="w-full h-[1px] bg-[#e9e9e9] mt-[4vw] md:hidden"></div>

              {/* Adicionado ao Sistema - NÃO EDITÁVEL */}
              <div className="mt-[5vw] md:mt-[0px]">
                <p className="font-semibold tracking-wide">
                  Adicionado ao Sistema
                </p>
                <div className="px-[3vw] md:px-[20px] py-[3vw] md:py-[10px] border-1 mt-[1vw] border-[#f3f3f3] rounded-3xl flex gap-[2vw] relative">
                  <Calendar className="text-[#333] w-[22px]" />
                  <p className="text-[15px]">{createdAt || "Desconhecido"}</p>
                </div>
              </div>

              {/* Data de Nascimento - NÃO EDITÁVEL */}
              <div className="mt-[5vw] md:mt-[20px]">
                <p className="font-semibold tracking-wide">
                  Data de Nascimento
                </p>
                <div className="px-[3vw] md:px-[20px] py-[3vw] md:py-[10px] border-1 mt-[1vw] border-[#f3f3f3] rounded-3xl flex gap-[2vw] relative">
                  <Cake className="text-[#333] w-[22px]" />
                  <p className="text-[15px]">{birthday || "Desconhecido"}</p>
                </div>
              </div>

              {/* Contato de Emergência - Nome - EDITÁVEL */}
              <div className="mt-[5vw] md:mt-[20px]">
                <p className="font-semibold tracking-wide">
                  Nome - Contato de Emergência
                </p>
                <div className="px-[3vw] md:px-[20px] py-[3vw] md:py-[10px] border-1 mt-[1vw] border-[#f3f3f3] rounded-3xl flex gap-[2vw] relative">
                  <Users className="text-[#333] w-[22px]" />
                  <Pencil className="text-[#333] w-[18px] absolute right-[4vw] md:right-[1.0vw]" />
                  <input
                    type="text"
                    value={editedEmergencyName}
                    onChange={(e) =>
                      handleInputChange("emergencyName", e.target.value)
                    }
                    className="text-[15px] bg-transparent outline-none w-full mr-[25px]"
                  />
                </div>
              </div>

              {/* Contato de Emergência - Telefone - EDITÁVEL */}
              <div className="mt-[5vw] md:mt-[20px]">
                <p className="font-semibold tracking-wide">
                  Telefone - Contato de Emergência
                </p>
                <div className="px-[3vw] md:px-[20px] py-[3vw] md:py-[10px] border-1 mt-[1vw] border-[#f3f3f3] rounded-3xl flex gap-[2vw] relative">
                  <AlertCircle className="text-[#333] w-[22px]" />
                  <Pencil className="text-[#333] w-[18px] absolute right-[4vw] md:right-[1.0vw]" />
                  <input
                    type="text"
                    value={editedEmergencyContact}
                    onChange={(e) =>
                      handleInputChange("emergencyContact", e.target.value)
                    }
                    className="text-[15px] bg-transparent outline-none w-full mr-[25px]"
                  />
                </div>
              </div>
            </div>

            <div>
              <div className="w-full h-[1px] bg-[#e9e9e9] mt-[4vw] md:hidden"></div>

              {/* CEP - EDITÁVEL */}
              <div className="mt-[5vw] md:mt-[0px]">
                <p className="font-semibold tracking-wide select-none">CEP</p>
                <div className="px-[3vw] md:px-[20px] py-[3vw] md:py-[10px] border-1 mt-[1vw] border-[#f3f3f3] rounded-3xl flex gap-[2vw] relative select-none">
                  <MapPin className="text-[#333] w-[22px]" />
                  {isLoadingCep && (
                    <Loader2 className="text-[#333] w-[18px] absolute right-[4vw] md:right-[1.0vw] animate-spin" />
                  )}
                  <Pencil className="text-[#333] w-[18px] absolute right-[4vw] md:right-[1.0vw]" />
                  <input
                    type="text"
                    value={editedZipCode}
                    onChange={(e) =>
                      handleInputChange("zipCode", formatCep(e.target.value))
                    }
                    onBlur={handleCepBlur}
                    maxLength={9}
                    placeholder="00000-000"
                    className="text-[15px] mr-[25px] bg-transparent outline-none w-full"
                  />
                </div>
              </div>

              {/* Rua - EDITÁVEL */}
              <div className="mt-[5vw] md:mt-[20px]">
                <p className="font-semibold tracking-wide select-none">Rua</p>
                <div className="px-[3vw] md:px-[20px] py-[3vw] md:py-[10px] border-1 mt-[1vw] border-[#f3f3f3] rounded-3xl flex gap-[2vw] relative select-none">
                  <Home className="text-[#333] w-[22px]" />
                  <input
                    type="text"
                    disabled
                    value={editedStreet}
                    onChange={(e) =>
                      handleInputChange("street", e.target.value)
                    }
                    className="text-[15px] mr-[25px] bg-transparent outline-none w-full cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Número e Complemento */}
              <div className="mt-[5vw] md:mt-[20px] grid grid-cols-2 gap-2">
                <div>
                  <p className="font-semibold tracking-wide select-none">
                    Número
                  </p>
                  <div className="px-[3vw] md:px-[10px] py-[3vw] md:py-[10px] border-1 mt-[1vw] border-[#f3f3f3] rounded-3xl flex gap-[2vw] relative">
                    <Pencil className="text-[#333] w-[18px] absolute right-[4vw] md:right-[1.0vw]" />
                    <input
                      type="text"
                      value={editedNumber}
                      onChange={(e) =>
                        handleInputChange("number", e.target.value)
                      }
                      className="text-[15px] bg-transparent outline-none w-full"
                    />
                  </div>
                </div>
                <div>
                  <p className="font-semibold tracking-wide select-none">
                    Complemento
                  </p>
                  <div className="px-[3vw] md:px-[10px] py-[3vw] md:py-[10px] border-1 mt-[1vw] border-[#f3f3f3] rounded-3xl flex gap-[2vw] relative">
                    <Pencil className="text-[#333] w-[18px] absolute right-[4vw] md:right-[1.0vw]" />
                    <input
                      type="text"
                      value={editedComplement}
                      onChange={(e) =>
                        handleInputChange("complement", e.target.value)
                      }
                      className="text-[15px] bg-transparent outline-none w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Bairro - EDITÁVEL */}
              <div className="mt-[5vw] md:mt-[20px]">
                <p className="font-semibold tracking-wide select-none">
                  Bairro
                </p>
                <div className="px-[3vw] md:px-[20px] py-[3vw] md:py-[10px] border-1 mt-[1vw] border-[#f3f3f3] rounded-3xl flex gap-[2vw]">
                  <input
                    type="text"
                    disabled
                    value={editedNeighborhood}
                    onChange={(e) =>
                      handleInputChange("neighborhood", e.target.value)
                    }
                    className="text-[15px] bg-transparent outline-none w-full cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Cidade e Estado */}
              <div className="mt-[5vw] md:mt-[20px] grid grid-cols-2 gap-2">
                <div>
                  <p className="font-semibold tracking-wide select-none">
                    Cidade
                  </p>
                  <div className="px-[3vw] md:px-[10px] py-[3vw] md:py-[10px] border-1 mt-[1vw] border-[#f3f3f3] rounded-3xl flex gap-[2vw]">
                    <input
                      type="text"
                      value={editedCity}
                      disabled
                      onChange={(e) =>
                        handleInputChange("city", e.target.value)
                      }
                      className="text-[15px] bg-transparent outline-none w-full cursor-not-allowed"
                    />
                  </div>
                </div>
                <div>
                  <p className="font-semibold tracking-wide select-none">
                    Estado
                  </p>
                  <div className="px-[3vw] md:px-[10px] py-[3vw] md:py-[10px] border-1 mt-[1vw] border-[#f3f3f3] rounded-3xl flex gap-[2vw]">
                    <input
                      type="text"
                      disabled
                      value={editedState}
                      onChange={(e) =>
                        handleInputChange("state", e.target.value)
                      }
                      maxLength={2}
                      className="text-[15px] bg-transparent outline-none w-full uppercase cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Transtornos */}
          {disorders.length > 0 && (
            <div className="mt-[5vw] md:mt-[20px]">
              <p className="font-semibold tracking-wide">Transtornos</p>
              <div className="px-[3vw] md:px-[20px] py-[3vw] md:py-[10px] border-1 mt-[1vw] border-[#f3f3f3] rounded-3xl">
                <div className="flex flex-wrap gap-2">
                  {disorders.map((disorder, index) => (
                    <span
                      key={index}
                      className="bg-[#e4f1ff] text-[#2563eb] px-3 py-1 rounded-full text-[13px]"
                    >
                      {disorder}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {hasChanges && (
            <div className="flex w-full justify-end mt-6">
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
