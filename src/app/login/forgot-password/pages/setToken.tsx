import { Dispatch, SetStateAction } from "react";
import CardPadronizedPasswordReset from "../components/CardPadronizedPasswordReset";
import { OTPForm } from "../components/otp-from";
import { Pages, UserPasswordFlow } from "../page";

export default function SetTokenComponent({
  setPage,
  user,
}: {
  setPage: Dispatch<SetStateAction<Pages>>;
  setUser: Dispatch<SetStateAction<UserPasswordFlow | null>>;
  user: UserPasswordFlow | null;
}) {
  return (
    <CardPadronizedPasswordReset
      config={{
        progressNumber: 3,
        title: `Olá, ${user?.name}! Para mudar sua senha, siga as instruções abaixo.`,
      }}
    >
      <div className="w-full">
        {user && user.email && user.role && (
          <OTPForm email={user.email} role={user.role} setPage={setPage} />
        )}
      </div>
    </CardPadronizedPasswordReset>
  );
}
