import CardPadronizedPasswordReset from "../components/CardPadronizedPasswordReset";
import { UserPasswordFlow } from "../page";

export default function SetPasswordComponent({
  user,
}: {
  user: UserPasswordFlow;
}) {
  return (
    <CardPadronizedPasswordReset
      config={{
        progressNumber: 4,
        title: "Insira a sua nova senha nos dois campos seguintes.",
      }}
    >
      <div>{user && user.name}</div>
    </CardPadronizedPasswordReset>
  );
}
