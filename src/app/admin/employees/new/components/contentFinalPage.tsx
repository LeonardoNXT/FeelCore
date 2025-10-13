"use client";
import { useFuncionarioStore } from "@/stores/funcionarioStore";
import { useEffect, useState, useRef } from "react";
import { gsap } from "gsap/gsap-core";

type Pagina = 1 | 2 | 3 | 4 | 5;

interface Props {
  setPagina: (number: Pagina) => void;
}

export default function FotoEConclusaoDoProfissional({ setPagina }: Props) {
  const { funcionario, setFuncionario } = useFuncionarioStore();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const sucessText = useRef<HTMLParagraphElement>(null);
  const divSucess = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Handle both File objects and cloud storage objects
    if (funcionario.avatar) {
      if (funcionario.avatar instanceof File) {
        const url = URL.createObjectURL(funcionario.avatar);
        setAvatarPreview(url);
        // Cleanup da URL quando o componente desmontar
        return () => URL.revokeObjectURL(url);
      } else if (
        typeof funcionario.avatar === "object" &&
        funcionario.avatar.url
      ) {
        // If it's a cloud storage object with URL
        setAvatarPreview(funcionario.avatar.url);
      }
    }
  }, [funcionario.avatar]);

  // Função para lidar com a seleção de arquivo
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar se é uma imagem
    if (!file.type.startsWith("image/")) {
      alert("Por favor, selecione apenas arquivos de imagem.");
      return;
    }

    // Validar tamanho do arquivo (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("O arquivo deve ter no máximo 5MB.");
      return;
    }

    // Criar URL para preview
    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);

    // Armazenar o File no store do funcionário
    setFuncionario({
      ...funcionario,
      avatar: file,
    });
  };

  // Validar dados antes do envio
  const validateData = () => {
    const requiredFields = [
      "password",
      "name",
      "email",
      "birthday",
      "cpf",
      "phone",
      "address",
      "remuneration",
    ];

    const missingFields = requiredFields.filter((field) => {
      const value = funcionario[field as keyof typeof funcionario];
      return !value || value === "";
    });

    if (missingFields.length > 0) {
      alert(`Campos obrigatórios não preenchidos: ${missingFields.join(", ")}`);
      return false;
    }

    // Validar senha
    if (funcionario.password && funcionario.password.length < 6) {
      alert("A senha deve ter pelo menos 6 caracteres.");
      return false;
    }

    // Validar email
    if (funcionario.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(funcionario.email)) {
        alert("Formato de email inválido.");
        return false;
      }
    }

    return true;
  };

  // Função para enviar dados para o backend
  const handleSubmit = async () => {
    // Validar dados antes do envio
    if (!validateData()) {
      return;
    }

    setIsLoading(true);

    try {
      // Criar FormData para enviar arquivo
      const formData = new FormData();

      // Mapear e adicionar todos os dados do funcionário
      Object.keys(funcionario).forEach((key) => {
        const value = funcionario[key as keyof typeof funcionario];
        if (value !== null && value !== undefined && value !== "") {
          if (key === "avatar") {
            if (value instanceof File) {
              formData.append("avatar", value);
            }
          } else {
            // Mapear nomes de campos do frontend para backend se necessário
            let fieldName = key;

            // Mapeamento de campos se houver diferenças entre frontend e backend
            const fieldMapping: Record<string, string> = {};

            fieldName = fieldMapping[key] || key;
            formData.append(fieldName, String(value));
          }
        }
      });

      // Log para debug - veja os dados que estão sendo enviados
      console.log("Dados sendo enviados:");
      for (const [key, value] of formData.entries()) {
        // Não mostrar a senha no console por segurança
        if (key === "password") {
          console.log(`${key}: [HIDDEN]`);
        } else {
          console.log(`${key}:`, value);
        }
      }

      // Obter token de autenticação (ajuste conforme sua implementação)
      const token =
        localStorage.getItem("authToken") ||
        sessionStorage.getItem("authToken");

      const headers: HeadersInit = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch("/api/employees", {
        method: "POST",
        credentials: "include", // Importante para enviar cookies de autenticação
        headers,
        body: formData, // Não definir Content-Type - o browser define automaticamente para multipart/form-data
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Erro da API:", errorData);

        // Mostrar erro mais específico
        if (errorData.missing_fields) {
          const missingFieldsText = Object.keys(errorData.missing_fields)
            .filter((field) => errorData.missing_fields[field])
            .join(", ");
          throw new Error(
            `Campos obrigatórios não preenchidos: ${missingFieldsText}`
          );
        }

        throw new Error(errorData.error || `Erro HTTP: ${response.status}`);
      }

      const result = await response.json();
      console.log("Funcionário cadastrado com sucesso:", result);

      // Salvar token se retornado
      if (result.token) {
        localStorage.setItem("employeeToken", result.token);
      }

      const tl = gsap.timeline();
      tl.to(divSucess.current, 0.3, {
        opacity: 1,
      }).to(sucessText.current, 0.3, {
        opacity: 1,
        onComplete: () => {},
      });

      // Opcionalmente limpar o store ou redirecionar
      // setFuncionario(initialState);;

      // Ou redirecionar para uma página de listagem
      // window.location.href = '/funcionarios';
    } catch (error) {
      console.error("Erro ao enviar dados:", error);

      // Mostrar erro mais específico se possível
      const errorMessage =
        error instanceof Error ? error.message : "Erro desconhecido";
      alert(`Erro ao cadastrar funcionário: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Função para voltar à página anterior
  const handleGoBack = () => {
    setPagina(4);
  };

  // Verificar se todos os dados obrigatórios estão preenchidos
  const isDataComplete = () => {
    const requiredFields = [
      "password",
      "name",
      "email",
      "birthday",
      "cpf",
      "phone",
      "address",
      "remuneration",
    ];

    return requiredFields.every((field) => {
      const value = funcionario[field as keyof typeof funcionario];
      return value && value !== "";
    });
  };

  return (
    <div className="h-full flex flex-col lg:flex-row-reverse">
      <div
        className="w-full h-full absolute top-0 left-0 bg-[#fff] flex justify-center items-center opacity-0 pointer-events-none"
        ref={divSucess}
      >
        <p className="text-[6vw] lg:text-[4vw] text-[#000]" ref={sucessText}>
          O email foi enviado com sucesso
        </p>
      </div>
      <div className="w-[100vw] flex flex-col justify-center items-center h-full">
        <div className="w-[50vw] lg:w-[15%] aspect-square border-1 rounded-full mb-10 flex justify-center items-center overflow-hidden">
          {avatarPreview ? (
            <img
              src={avatarPreview}
              alt="Avatar do funcionário"
              className="w-full h-full object-cover"
            />
          ) : (
            funcionario.name && (
              <p className="uppercase text-7xl font-bold">{`${
                funcionario.name.split(" ")[0].split("")[0]
              }${funcionario.name.split(" ")[1]?.split("")[0] || ""}`}</p>
            )
          )}
        </div>

        <div className="flex flex-col lg:flex-row rounded-[8vw] lg:rounded-[2vw] gap-4 px-[2vw] py-[3vw] lg:px-[1vw] lg:py-[1vw]  border-1">
          <button
            onClick={handleGoBack}
            className="px-6 py-3 border-1 rounded-4xl hover:bg-gray-100 text-[#fff] hover:text-[#333] transition-colors cursor-pointer"
            disabled={isLoading}
          >
            Voltar
          </button>

          <input
            type="file"
            id="fileInput"
            className="hidden"
            accept="image/*"
            onChange={handleFileSelect}
          />
          <label
            htmlFor="fileInput"
            className="cursor-pointer px-6 py-4 border rounded-4xl bg-white text-[#333] hover:bg-gray-50 transition-colors mb-0"
          >
            {avatarPreview ? "Alterar foto" : "Escolher arquivo"}
          </label>

          {/* Aviso se dados incompletos */}
          {!isDataComplete() && (
            <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 rounded-lg">
              <p className="text-yellow-800 text-sm">
                ⚠️ Alguns campos obrigatórios não foram preenchidos. Verifique
                os dados antes de finalizar.
              </p>
            </div>
          )}
          <button
            onClick={handleSubmit}
            className="px-6 py-3 border-1 text-[#fff] rounded-4xl hover:bg-[#fff] cursor-pointer hover:text-[#000] transition-colors disabled:opacity-50"
            disabled={isLoading || !isDataComplete()}
          >
            {isLoading ? "Enviando..." : "Finalizar Cadastro"}
          </button>
        </div>
      </div>
    </div>
  );
}
