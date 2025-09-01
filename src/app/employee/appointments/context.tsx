"use client";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { User, MoveRight, Users } from "lucide-react";
import Image from "next/image";
import { useAppointmentsStore } from "@/stores/appointment";

export default function AppointmentsPageContext() {
  const { appointments, setAppointments } = useAppointmentsStore();
  useEffect(() => {
    const fetchApiAppointments = async () => {
      const response = await fetch("/api/appointments", {
        method: "POST",
        credentials: "include",
      });
      const data = await response.json();
      console.log(data);
      setAppointments(data.appointments);
    };
    fetchApiAppointments();
  }, [setAppointments]);

  if (appointments.length > 0) {
    const firshNameOfPedente = appointments[0].intendedFor.name.split(" ")[0];
    const date = new Date(appointments[0].date);
    const hours = date.getHours() + ":" + date.getMinutes();

    return (
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 1 }}
        className="w-full min-h-screen bg-[url('/background.jpg')] bg-cover"
      >
        <div className="w-full min-h-screen backdrop-blur-3xl backdrop-sepia-50">
          <div className="w-full px-3 py-25">
            <div className="w-full px-2 py-2 bg-gradient-to-r from-[#010101] to-[#292929ea] rounded-[30px] border-1 border-[#333333]">
              <div className="flex justify-between items-center px-2 py-2">
                <p className="text-[16px] text-[#646464] py-1 px-2 bg-[#161616] border-1 border-[#333] rounded-2xl">
                  Agendamento pendente
                </p>
                <div className=" bg-[#292929] text-[#333] border-1 rounded-full">
                  {appointments[0].intendedFor.avatar?.url ? (
                    <Image
                      src={appointments[0].intendedFor.avatar.url}
                      width={35}
                      height={35}
                      alt="Imagem do paciente"
                      className="rounded-full"
                    />
                  ) : (
                    <User />
                  )}
                </div>
              </div>
              <div className="px-4 text-[#757575] mt-10">
                Você pode enviar um email perguntando {firshNameOfPedente + " "}
                deseja continuar o agendamento por aqui.
              </div>
              <div className="px-2 flex items-center gap-3 mb-3 mt-5">
                <div className="px-3 py-2 bg-gradient-to-br from-[#010101] to-[#241e0f] w-max flex gap-2 items-center rounded-3xl border-1 border-[#333]">
                  <p className="text-[#c9c4b6fb] text-[13px] rounded-2xl poppins ">
                    Enviar email
                  </p>

                  <MoveRight className="text-[#c9c4b6fb] w-4" />
                </div>
                <div className="w-3 h-3 rounded-full bg-amber-200"></div>
              </div>
              <div className="w-full py-20 bg-gradient-to-br from-[#e2ddb0] to-[#f7eddb] rounded-3xl border-1 border-[#333] flex justify-center items-center gap-2">
                <div className="text-5xl text-[#333] font-bold">{hours}</div>
                <div className="text-[#333] font-bold text-3xl">X</div>
                <p className="text-[#333] text-5xl font-bold">
                  {firshNameOfPedente}
                </p>
              </div>
            </div>
            <div className="w-full px-1 py-1 bg-gradient-to-r from-[#e5eaeb] to-[#ffffff6b] mt-2 rounded-[30px]">
              <div className="flex justify-between items-center px-3 py-3">
                <p className="text-[16px] text-[#333333d0] py-1 px-2 bg-[#dbdbdb7e] border-1 rounded-2xl">
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
                <div className="w-full mt-4 px-2 h-60 bg-gradient-to-br from-[#31393b] to-[#0e0e0e] rounded-3xl"></div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>
    );
  }
}
