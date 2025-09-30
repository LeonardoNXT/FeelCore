import { Appointments } from "@/stores/appointment";
import Image from "next/image";
import { getTime } from "./getTime";
import { MoveUpRight, Users } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { getInitials } from "./getInitials";

interface Props {
  otherAppointments: Appointments[];
  setIdSelectedComponent: Dispatch<SetStateAction<string | null>>;
  setHandlePedingSelected: Dispatch<SetStateAction<boolean>>;
  handlePedingSelected: boolean;
}

export default function OtherPendingAppointmentsComponent({
  otherAppointments,
  setIdSelectedComponent,
  setHandlePedingSelected,
  handlePedingSelected,
}: Props) {
  return (
    <div className="w-full px-1 py-1 bg-gradient-to-r from-[#e5eaeb] to-[#ffffff6b] mt-2 rounded-[30px]">
      <div className="flex justify-between items-center px-3 py-3">
        <p className="text-[16px] text-[#333333d0] py-1 px-2 bg-[#dbdbdb7e] rounded-2xl shadow-inner shadow-[#a0a0a0]">
          Outros agendamentos pendentes
        </p>
        <div className=" bg-[#b4b4b4b9] text-[#2c2c2c] border-1 px-2 py-2 rounded-full">
          <Users />
        </div>
      </div>
      <div>
        <div className="px-4 text-[#757575] mt-10">
          Aqui você pode ver e gerênciar seus agendamentos pendentes.
        </div>
      </div>
      <div className="px-1 py-1">
        <div className="py-2 pb-4 bg-gradient-to-br from-[#3b3b3b] to-[#111111] rounded-3xl">
          <div
            className={`w-full px-4 py-4 mt-4 overflow-x-scroll flex ${
              otherAppointments.length <= 1 && "justify-center md:py-10"
            } gap-4 relative conteiner-scrollbar`}
          >
            {otherAppointments.map((appointmentUser) => (
              <div
                className="px-2 py-2 rounded-3xl bg-gradient-to-b from-[#fff] to-[#ab9373] shadow-[#141414] shadow-md"
                key={appointmentUser._id}
              >
                <div className="w-[320px] md:w-[450px] flex justify-end">
                  {appointmentUser.intendedFor.avatar ? (
                    <Image
                      src={appointmentUser.intendedFor.avatar.url}
                      width={40}
                      height={40}
                      alt={`Imagem de ${
                        appointmentUser.intendedFor.name.split(" ")[0]
                      } em outros agendamentos.`}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-[40px] aspect-square rounded-full bg-[#333] grid place-items-center">
                      {getInitials(appointmentUser.intendedFor.name)}
                    </div>
                  )}
                </div>
                <div className="w-full flex items-center flex-col font-bold py-3 md:py-7">
                  <p className="text-[#6e6e6e]">
                    {new Date(appointmentUser.date).toLocaleDateString()}
                  </p>
                  <div className="flex gap-2 text-[#333] text-3xl md:text-5xl">
                    <p>{getTime(appointmentUser.date)}</p>
                    <p>X</p>
                    <p>{appointmentUser.intendedFor.name.split(" ")[0]}</p>
                  </div>
                  <p className="text-[#525252] font-normal">
                    {appointmentUser.intendedFor.name}
                  </p>
                </div>
                <div className="w-full flex justify-end">
                  <div
                    className="w-[40px] aspect-square rounded-full bg-[#ffffff21] grid place-items-center cursor-pointer shadow-[#444444] shadow-inner"
                    onClick={() => {
                      setIdSelectedComponent(appointmentUser._id);
                      setHandlePedingSelected(!handlePedingSelected);
                    }}
                  >
                    <MoveUpRight className="text-[#333] duration-300 hover:rotate-[45deg]" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
