/* eslint-disable */
"use client";

import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Smartphone,
  User,
  Pencil,
  Save,
  Loader2,
  Building2,
  Lock,
  Camera,
  X,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
} from "lucide-react";

export default function SettingsPage() {
  // Estados principais
  const [avatar, setAvatar] = useState<string>("");
  const [avatarPublicId, setAvatarPublicId] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [cnpj, setCnpj] = useState<string>("");
  const [telefone, setTelefone] = useState<string>("");

  // Estados para edição
  const [editedName, setEditedName] = useState<string>("");
  const [editedEmail, setEditedEmail] = useState<string>("");
  const [editedCnpj, setEditedCnpj] = useState<string>("");
  const [editedTelefone, setEditedTelefone] = useState<string>("");
  const [editedPassword, setEditedPassword] = useState<string>("");
  const [editedConfirmPassword, setEditedConfirmPassword] =
    useState<string>("");

  // Estados para upload de avatar
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Estados de controle
  const [hasChanges, setHasChanges] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState<boolean>(false);
  const [isDeletingAvatar, setIsDeletingAvatar] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);

  // Validações de senha
  const [passwordValidations, setPasswordValidations] = useState({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });

  useEffect(() => {
    // Buscar dados da organização
    fetch("/api/auth/verify", {
      method: "POST",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data[0]) {
          const org = data[0];
          setName(org.name || "");
          setEmail(org.email || "");
          setCnpj(org.cnpj || "");
          setTelefone(org.telefone || "");
          setAvatar(org.avatar?.url || "");
          setAvatarPublicId(org.avatar?.public_id || "");

          // Inicializar campos editáveis
          setEditedName(org.name || "");
          setEditedEmail(org.email || "");
          setEditedCnpj(org.cnpj || "");
          setEditedTelefone(org.telefone || "");
          setDataLoaded(true);
        }
      })
      .catch((error) => {
        console.error("Erro ao buscar dados:", error);
        alert("Erro ao carregar dados da organização");
      });
  }, []);

  // Validar senha em tempo real
  useEffect(() => {
    if (editedPassword) {
      setPasswordValidations({
        minLength: editedPassword.length >= 8,
        hasUpperCase: /[A-Z]/.test(editedPassword),
        hasLowerCase: /[a-z]/.test(editedPassword),
        hasNumber: /\d/.test(editedPassword),
        hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(editedPassword),
      });
    }
  }, [editedPassword]);

  const handleInputChange = (field: string, value: string) => {
    switch (field) {
      case "name":
        setEditedName(value);
        break;
      case "email":
        setEditedEmail(value);
        break;
      case "cnpj":
        setEditedCnpj(formatCnpj(value));
        break;
      case "telefone":
        setEditedTelefone(formatTelefone(value));
        break;
      case "password":
        setEditedPassword(value);
        break;
      case "confirmPassword":
        setEditedConfirmPassword(value);
        break;
    }
    setHasChanges(true);
  };

  const formatCnpj = (value: string) => {
    const cleanValue = value.replace(/\D/g, "");
    if (cleanValue.length <= 2) return cleanValue;
    if (cleanValue.length <= 5)
      return `${cleanValue.slice(0, 2)}.${cleanValue.slice(2)}`;
    if (cleanValue.length <= 8)
      return `${cleanValue.slice(0, 2)}.${cleanValue.slice(
        2,
        5
      )}.${cleanValue.slice(5)}`;
    if (cleanValue.length <= 12)
      return `${cleanValue.slice(0, 2)}.${cleanValue.slice(
        2,
        5
      )}.${cleanValue.slice(5, 8)}/${cleanValue.slice(8)}`;
    return `${cleanValue.slice(0, 2)}.${cleanValue.slice(
      2,
      5
    )}.${cleanValue.slice(5, 8)}/${cleanValue.slice(8, 12)}-${cleanValue.slice(
      12,
      14
    )}`;
  };

  const formatTelefone = (value: string) => {
    const cleanValue = value.replace(/\D/g, "");
    if (cleanValue.length <= 2) return cleanValue;
    if (cleanValue.length <= 7)
      return `(${cleanValue.slice(0, 2)}) ${cleanValue.slice(2)}`;
    if (cleanValue.length <= 11)
      return `(${cleanValue.slice(0, 2)}) ${cleanValue.slice(
        2,
        7
      )}-${cleanValue.slice(7)}`;
    return `(${cleanValue.slice(0, 2)}) ${cleanValue.slice(
      2,
      7
    )}-${cleanValue.slice(7, 11)}`;
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Por favor, selecione apenas imagens");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert("A imagem deve ter no máximo 5MB");
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleAvatarUpload = async () => {
    if (!selectedFile) return;

    try {
      setIsUploadingAvatar(true);
      const formData = new FormData();
      formData.append("avatar", selectedFile);

      const response = await fetch("/api/organization/avatar", {
        method: "PATCH",
        credentials: "include",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || "Erro ao fazer upload do avatar");
      }

      setAvatar(data.avatar.url);
      setAvatarPublicId(data.avatar.public_id);
      setSelectedFile(null);
      setPreviewUrl("");
      alert("Avatar atualizado com sucesso!");
    } catch (error: any) {
      console.error("Erro ao fazer upload:", error);
      alert(error.message || "Erro ao fazer upload do avatar");
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleAvatarDelete = async () => {
    const confirmDelete = confirm(
      "Tem certeza que deseja remover o avatar? Esta ação não pode ser desfeita."
    );

    if (!confirmDelete) return;

    try {
      setIsDeletingAvatar(true);

      const response = await fetch("/api/organization/avatar", {
        method: "DELETE",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || "Erro ao remover avatar");
      }

      setAvatar("");
      setAvatarPublicId("");
      alert("Avatar removido com sucesso!");
    } catch (error: any) {
      console.error("Erro ao remover avatar:", error);
      alert(error.message || "Erro ao remover avatar");
    } finally {
      setIsDeletingAvatar(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);

      // Validações
      if (editedName.trim().length < 3) {
        alert("O nome deve ter pelo menos 3 caracteres");
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(editedEmail)) {
        alert("Email inválido");
        return;
      }

      // Validação de senha se estiver preenchida
      if (editedPassword) {
        const allValid = Object.values(passwordValidations).every((v) => v);
        if (!allValid) {
          alert("A senha não atende a todos os requisitos de segurança");
          return;
        }

        if (editedPassword !== editedConfirmPassword) {
          alert("As senhas não coincidem");
          return;
        }
      }

      const body: any = {
        name: editedName,
        email: editedEmail,
      };

      if (editedCnpj) body.cnpj = editedCnpj;
      if (editedTelefone) body.telefone = editedTelefone;
      if (editedPassword) {
        body.password = editedPassword;
        body.confirmPassword = editedConfirmPassword;
      }

      const response = await fetch("/api/organization", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || "Erro ao atualizar organização");
      }

      // Atualizar estados locais
      setName(editedName);
      setEmail(editedEmail);
      setCnpj(editedCnpj);
      setTelefone(editedTelefone);
      setEditedPassword("");
      setEditedConfirmPassword("");
      setHasChanges(false);

      alert("Dados atualizados com sucesso!");
    } catch (error: any) {
      console.error("Erro ao salvar:", error);
      alert(error.message || "Erro ao salvar alterações");
    } finally {
      setIsLoading(false);
    }
  };

  const cancelFileSelection = () => {
    setSelectedFile(null);
    setPreviewUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getInitials = () => {
    if (!name) return "O";
    const names = name.split(" ");
    if (names.length === 1) return names[0][0];
    return names[0][0] + names[names.length - 1][0];
  };

  return (
    <div className="w-full min-h-screen h-full p-4 md:p-8">
      <motion.div
        className="mx-auto h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="bg-white h-full rounded-[2vw] md:rounded-3xl shadow-sm">
          {/* Header com Avatar */}
          <div className="relative">
            <div className="w-full h-[200px] bg-gradient-to-br from-[#221616] to-[#b9630000] rounded-t-[2vw] md:rounded-t-3xl"></div>

            <AnimatePresence mode="wait">
              {dataLoaded && (
                <motion.div
                  className="absolute bottom-[-60px] left-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <div className="relative">
                    {previewUrl || avatar ? (
                      <Image
                        src={previewUrl || avatar}
                        alt="Avatar da Organização"
                        width={150}
                        height={150}
                        className="rounded-full border-8 border-white shadow-lg w-[120px] h-[120px] md:w-[150px] md:h-[150px] object-cover"
                      />
                    ) : (
                      <div className="w-[120px] h-[120px] md:w-[150px] md:h-[150px] bg-gradient-to-br from-[#4385ac] to-[#2563eb] rounded-full border-8 border-white shadow-lg flex items-center justify-center text-white text-4xl md:text-5xl font-bold">
                        {getInitials()}
                      </div>
                    )}

                    {/* Botão de Upload/Remover */}
                    {!previewUrl && (
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-0 right-0 bg-[#4385ac] hover:bg-[#3a8eef] text-white p-2 rounded-full shadow-lg transition-all"
                        title="Alterar avatar"
                      >
                        <Camera className="w-5 h-5" />
                      </button>
                    )}

                    {avatar && !previewUrl && (
                      <button
                        onClick={handleAvatarDelete}
                        disabled={isDeletingAvatar}
                        className="absolute bottom-0 left-0 bg-[#eee] hover:bg-red-600 disabled:bg-gray-400 text-[#333] p-2 rounded-full shadow-lg transition-all"
                        title="Remover avatar"
                      >
                        {isDeletingAvatar ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <X className="w-5 h-5" />
                        )}
                      </button>
                    )}

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Preview de upload */}
          <AnimatePresence>
            {previewUrl && (
              <motion.div
                className="mt-20 px-8 py-4 bg-blue-50 border border-blue-200 rounded-xl mx-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-between">
                  <p className="text-[#333] font-semibold">
                    Nova imagem selecionada
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={cancelFileSelection}
                      className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-[#333] rounded-full text-sm transition-all"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleAvatarUpload}
                      disabled={isUploadingAvatar}
                      className="px-4 py-2 bg-[#4385ac] hover:bg-[#3a8eef] disabled:bg-gray-400 text-white rounded-full text-sm transition-all flex items-center gap-2"
                    >
                      {isUploadingAvatar ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Salvar Avatar
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Informações */}
          <motion.div
            className="pt-20 px-8 pb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: dataLoaded ? 1 : 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-[#1a1a1a]">{name}</h2>
              <p className="text-[#666]">{email}</p>
            </div>

            <div className="border-t border-[#e9e9e9] pt-6">
              <h3 className="text-lg font-semibold text-[#333] mb-4">
                Informações da Organização
              </h3>
              <p className="text-[#666] text-sm mb-6">
                Atualize os dados da sua organização abaixo.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Nome */}
                <div>
                  <label className="font-semibold text-[#333] block mb-2">
                    Nome da Organização *
                  </label>
                  <div className="relative">
                    <div className="px-4 py-3 border border-[#e9e9e9] rounded-2xl flex items-center gap-3 focus-within:border-[#4385ac] transition-all">
                      <User className="text-[#666] w-5 h-5" />
                      <input
                        type="text"
                        value={editedName}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        className="flex-1 outline-none text-[15px] text-[#333]"
                        placeholder="Nome da organização"
                      />
                      <Pencil className="text-[#666] w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="font-semibold text-[#333] block mb-2">
                    Email *
                  </label>
                  <div className="relative">
                    <div className="px-4 py-3 border border-[#e9e9e9] rounded-2xl flex items-center gap-3 focus-within:border-[#4385ac] transition-all">
                      <Mail className="text-[#666] w-5 h-5" />
                      <input
                        type="email"
                        value={editedEmail}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        className="flex-1 outline-none text-[15px] text-[#333]"
                        placeholder="email@exemplo.com"
                      />
                      <Pencil className="text-[#666] w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* CNPJ */}
                <div>
                  <label className="font-semibold text-[#333] block mb-2">
                    CNPJ
                  </label>
                  <div className="relative">
                    <div className="px-4 py-3 border border-[#e9e9e9] rounded-2xl flex items-center gap-3 focus-within:border-[#4385ac] transition-all">
                      <Building2 className="text-[#666] w-5 h-5" />
                      <input
                        type="text"
                        value={editedCnpj}
                        onChange={(e) =>
                          handleInputChange("cnpj", e.target.value)
                        }
                        className="flex-1 outline-none text-[15px] text-[#333]"
                        placeholder="00.000.000/0000-00"
                        maxLength={18}
                      />
                      <Pencil className="text-[#666] w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Telefone */}
                <div>
                  <label className="font-semibold text-[#333] block mb-2">
                    Telefone
                  </label>
                  <div className="relative">
                    <div className="px-4 py-3 border border-[#e9e9e9] rounded-2xl flex items-center gap-3 focus-within:border-[#4385ac] transition-all">
                      <Smartphone className="text-[#666] w-5 h-5" />
                      <input
                        type="text"
                        value={editedTelefone}
                        onChange={(e) =>
                          handleInputChange("telefone", e.target.value)
                        }
                        className="flex-1 outline-none text-[15px] text-[#333]"
                        placeholder="(00) 00000-0000"
                        maxLength={15}
                      />
                      <Pencil className="text-[#666] w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Seção de Senha */}
              <div className="mt-8 pt-6 border-t border-[#e9e9e9]">
                <h3 className="text-lg font-semibold text-[#333] mb-4">
                  Alterar Senha
                </h3>
                <p className="text-[#666] text-sm mb-6">
                  Deixe em branco se não deseja alterar a senha.
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Nova Senha */}
                  <div>
                    <label className="font-semibold text-[#333] block mb-2">
                      Nova Senha
                    </label>
                    <div className="relative">
                      <div className="px-4 py-3 border border-[#e9e9e9] rounded-2xl flex items-center gap-3 focus-within:border-[#4385ac] transition-all">
                        <Lock className="text-[#666] w-5 h-5" />
                        <input
                          type={showPassword ? "text" : "password"}
                          value={editedPassword}
                          onChange={(e) =>
                            handleInputChange("password", e.target.value)
                          }
                          className="flex-1 outline-none text-[15px] text-[#333]"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-[#666] hover:text-[#333]"
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Validações de senha */}
                    <AnimatePresence>
                      {editedPassword && (
                        <motion.div
                          className="mt-3 space-y-2"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ValidationItem
                            isValid={passwordValidations.minLength}
                            text="Mínimo de 8 caracteres"
                          />
                          <ValidationItem
                            isValid={passwordValidations.hasUpperCase}
                            text="Pelo menos uma letra maiúscula"
                          />
                          <ValidationItem
                            isValid={passwordValidations.hasLowerCase}
                            text="Pelo menos uma letra minúscula"
                          />
                          <ValidationItem
                            isValid={passwordValidations.hasNumber}
                            text="Pelo menos um número"
                          />
                          <ValidationItem
                            isValid={passwordValidations.hasSpecialChar}
                            text="Pelo menos um caractere especial (!@#$%...)"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Confirmar Senha */}
                  <div>
                    <label className="font-semibold text-[#333] block mb-2">
                      Confirmar Nova Senha
                    </label>
                    <div className="relative">
                      <div className="px-4 py-3 border border-[#e9e9e9] rounded-2xl flex items-center gap-3 focus-within:border-[#4385ac] transition-all">
                        <Lock className="text-[#666] w-5 h-5" />
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          value={editedConfirmPassword}
                          onChange={(e) =>
                            handleInputChange("confirmPassword", e.target.value)
                          }
                          className="flex-1 outline-none text-[15px] text-[#333]"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="text-[#666] hover:text-[#333]"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <AnimatePresence mode="wait">
                      {editedPassword &&
                        editedConfirmPassword &&
                        editedPassword !== editedConfirmPassword && (
                          <motion.p
                            className="mt-2 text-red-500 text-sm flex items-center gap-1"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <XCircle className="w-4 h-4" />
                            As senhas não coincidem
                          </motion.p>
                        )}

                      {editedPassword &&
                        editedConfirmPassword &&
                        editedPassword === editedConfirmPassword && (
                          <motion.p
                            className="mt-2 text-green-600 text-sm flex items-center gap-1"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            As senhas coincidem
                          </motion.p>
                        )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {/* Botão Salvar */}
              <AnimatePresence>
                {hasChanges && (
                  <motion.div
                    className="flex justify-end mt-8 pt-6 border-t border-[#e9e9e9]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <button
                      onClick={handleSave}
                      disabled={isLoading}
                      className="flex items-center gap-2 bg-[#4385ac] hover:bg-[#3a8eef] disabled:bg-gray-400 text-white px-8 py-4 rounded-full shadow-lg transition-all transform hover:scale-105 disabled:hover:scale-100"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Salvando...
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5" />
                          Salvar Alterações
                        </>
                      )}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

// Componente auxiliar para validações
function ValidationItem({ isValid, text }: { isValid: boolean; text: string }) {
  return (
    <motion.div
      className="flex items-center gap-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      {isValid ? (
        <CheckCircle2 className="w-4 h-4 text-green-600" />
      ) : (
        <XCircle className="w-4 h-4 text-red-500" />
      )}
      <span
        className={`text-sm ${isValid ? "text-green-600" : "text-red-500"}`}
      >
        {text}
      </span>
    </motion.div>
  );
}
