import { Dispatch, SetStateAction } from "react";
import { Pages, UserPasswordFlow } from "../page";
import CardPadronizedPasswordReset from "../components/CardPadronizedPasswordReset";

export default function SetRoleComponent({
  setPage,
  setUser,
}: {
  setPage: Dispatch<SetStateAction<Pages>>;
  setUser: Dispatch<SetStateAction<UserPasswordFlow | null>>;
}) {
  return (
    <CardPadronizedPasswordReset
      config={{
        title: "Selecione um nível de acesso. Abaixo há duas opções.",
        progressNumber: 1,
      }}
    >
      <p
        className="w-1/2 text-center border-1 border-[#e9e9e9] py-4 rounded-full bg-[#fff] hover:bg-[#eeeeee] duration-150 cursor-pointer"
        onClick={() => {
          setUser((prev) => ({
            ...prev,
            role: "Organization",
          }));
          setPage("setEmail");
        }}
      >
        Organizações
      </p>
      <p
        className="w-1/2 text-center border-1 border-[#e9e9e9] py-4 rounded-full bg-[#fff] hover:bg-[#eeeeee] duration-150 cursor-pointer"
        onClick={() => {
          setUser((prev) => ({
            ...prev,
            role: "Employee",
          }));
          setPage("setEmail");
        }}
      >
        Psicólogos
      </p>
    </CardPadronizedPasswordReset>
  );
}
