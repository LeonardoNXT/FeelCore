import { Dispatch, SetStateAction } from "react";
import CloseButtonComponent from "./closeButton";
import { Appointments } from "@/stores/appointment";

type Props = {
  children: React.ReactNode;
  setAppointmentSeleted: Dispatch<SetStateAction<Appointments | null>>;
};

export default function ModalOfCardPadronizedComponent({
  children,
  setAppointmentSeleted,
}: Props) {
  return (
    <div className="px-2 py-2 border-1 border-[#ececec1e] bg-[#e2e2e257] rounded-full flex items-center gap-2 mt-4 shadow-lg">
      {children}
      <CloseButtonComponent
        onClick={() => {
          setAppointmentSeleted(null);
        }}
      />
    </div>
  );
}
