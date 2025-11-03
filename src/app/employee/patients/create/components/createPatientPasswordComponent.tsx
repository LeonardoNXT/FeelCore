import BaseCreateBoxComponent from "@/app/employee/components/baseCreateBox";
import useCreatePatient, {
  PasswordConfig,
} from "@/app/employee/tasks/hook/useCreatePatient";
import { Dispatch, SetStateAction } from "react";

type Props = {
  title: string;
  summary: string;
  placeholder: string;
  password: PasswordConfig;
  setPassword: Dispatch<SetStateAction<PasswordConfig>>;
};

export default function CreatePatientPasswordComponent({
  title,
  summary,
  placeholder,
  password,
  setPassword,
}: Props) {
  const { isValidPassword } = useCreatePatient();
  return (
    <BaseCreateBoxComponent required title={title} summary={summary}>
      <input
        type="password"
        value={password.password}
        onChange={(e) => isValidPassword(e.target.value, setPassword)}
        placeholder={placeholder}
        minLength={8}
        maxLength={40}
        required
        className={`w-full text-[16px] bg-[#161616] px-4 pr-4 py-2 border outline-0 border-[#333] shadow-2xl shadow-[#000] rounded-full text-[#fff] focus:outline-2 ${password.color} duration-200 focus:shadow-lg`}
      />
    </BaseCreateBoxComponent>
  );
}
