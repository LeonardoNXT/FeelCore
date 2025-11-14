import { Dispatch, SetStateAction } from "react";
import CardPadronizedPasswordReset from "../components/CardPadronizedPasswordReset";
import { ResetPasswordComponent } from "../components/password-reset";
import { Pages, UserPasswordFlow } from "../page";

export default function SetPasswordComponent({
  user,
  setPage,
}: {
  user: UserPasswordFlow | null;
  setPage: Dispatch<SetStateAction<Pages>>;
}) {
  if (!user) return;
  return (
    <CardPadronizedPasswordReset
      config={{
        progressNumber: 4,
        title: `${user?.name}, é hora de insirir sua nova senha nos dois campos seguintes.`,
      }}
    >
      <div className="w-full">
        <ResetPasswordComponent setPage={setPage} />
      </div>
    </CardPadronizedPasswordReset>
  );
}
