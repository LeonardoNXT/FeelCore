import { Dispatch, SetStateAction, useState } from "react";
import useSetError, { ErrorAPI } from "../../appointments/hooks/useSetError";
import { validatePassword } from "../../patients/create/components/passwordVerify";
import { validateEmail } from "../../patients/create/components/emailVerify";

export type PasswordConfig = {
  password: string;
  color:
    | "focus:outline-[#b8d7ff] focus:shadow-[#b8d7ff]"
    | "focus:outline-[#ff3737] focus:shadow-[#ff3737]";
};

const isValidPassword = (
  inputContent: string,
  setPassword: Dispatch<SetStateAction<PasswordConfig>>
) => {
  const result = validatePassword(inputContent);

  setPassword({
    password: inputContent,
    color: result.valid
      ? "focus:outline-[#b8d7ff] focus:shadow-[#b8d7ff]"
      : "focus:outline-[#ff3737] focus:shadow-[#ff3737]",
  });

  return result.valid;
};

const isValidEmail = (email: string): boolean => {
  const result = validateEmail(email);
  return result.valid;
};

const isValidName = (name: string) => {
  const parts = name.trim().split(" ");
  return parts.length >= 2 && parts.every((p) => p.length > 1);
};

type ValidFile = {
  selectedFile: File | null;
  setError: Dispatch<SetStateAction<ErrorAPI | null>>;
  setFile: Dispatch<SetStateAction<File | null>>;
};

const isFileValid = ({ selectedFile, setFile, setError }: ValidFile) => {
  if (!selectedFile) return;
  const MB = 1024 * 1024;
  // Validação de tamanho (4MB)
  if (selectedFile.size > 4 * MB) {
    return setError({
      error: "A imagem selecionada é pesada demais.",
      message: "Selecione uma imagem que possua menos de 4MB",
    });
  }

  // Validação de tipo de arquivo
  if (!selectedFile.type.startsWith("image/")) {
    return setError({
      error: "Arquivo inválido.",
      message: "Selecione apenas arquivos de imagem (PNG, JPG, WEBP, etc.)",
    });
  }

  setFile(selectedFile);
};

type CreatePatient = {
  setError: Dispatch<SetStateAction<ErrorAPI | null>>;
  setSucess?: Dispatch<SetStateAction<boolean>>;
  name: string;
  email: string;
  password: string;
  date: string;
  file?: File | null;
};

const isAllValid = ({
  setError,
  name,
  email,
  password,
  date,
}: CreatePatient): boolean => {
  if (!isValidName(name)) {
    setError({
      error: "O nome é inválido.",
      message: "O nome não possuí sobrenome.",
    });
    return false;
  }
  if (!isValidEmail(email)) {
    setError({
      error: "O email é invalido.",
      message: "Certifique-se da válidade do email.",
    });
    return false;
  }
  if (!validatePassword(password).valid) {
    setError({
      error: "A senha não segue os critérios estabelecidos.",
      message: "Certifique-se que a senha segue os padrões exigidos.",
    });
    return false;
  }
  if (date.length === 0) {
    setError({
      error: "Selecione uma data.",
      message: "Certifique-se de selecionar a data de nascimento corretamente.",
    });
    return false;
  }
  return true;
};

const createPatient = async ({
  setSucess,
  setError,
  name,
  email,
  password,
  date,
  file,
}: CreatePatient) => {
  if (!isAllValid({ setError, name, email, password, date })) {
    return console.log("HOUVE UM ERRO AO VALIDAR");
  }
  const form = new FormData();

  form.append("name", name.trim());
  form.append("email", email);
  form.append("password", password);
  form.append("birth_date", date);

  if (file) {
    form.append("avatar", file);
  }

  try {
    const response = await fetch("/api/customers", {
      method: "POST",
      credentials: "include",
      body: form,
    });

    const data = await response.json();
    console.log(data);
    if (!response.ok) {
      throw new Error(data.message);
    }
    if (!setSucess) return;
    setSucess(true);
  } catch (err) {
    const error = err as Error;
    setError({
      error: "Houve um erro interno.",
      message: error.message || "Tente novamente mais tarde.",
    });
  }
};

export default function useCreatePatient() {
  const [sucess, setSucess] = useState<boolean>(false);
  const { error, setError } = useSetError();
  const [inputName, setInputName] = useState<string>("");
  const [inputEmail, setInputEmail] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState<PasswordConfig>({
    password: "",
    color: "focus:outline-[#ff3737] focus:shadow-[#ff3737]",
  });
  const [date, setDate] = useState<string>("");

  return {
    sucess,
    setSucess,
    error,
    setError,
    inputName,
    setInputName,
    inputEmail,
    setInputEmail,
    file,
    setFile,
    password,
    setPassword,
    date,
    setDate,
    isValidPassword,
    createPatient,
    isFileValid,
  };
}
