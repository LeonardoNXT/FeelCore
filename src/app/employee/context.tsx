"use client";

import { useEmployeeStore } from "@/stores/userStore";
import {
  User,
  CalendarDays,
  CornerDownRight,
  Cog,
  BookOpenCheck,
  Notebook,
} from "lucide-react";

export default function MainRouteOfEmployeeConteiner() {
  const { user } = useEmployeeStore();
  const firstAndLastName =
    user?.name.split(" ")[0] +
    " " +
    user?.name.split(" ")[user.name.split(" ").length - 1];
  const [dia, mes] = new Date().toLocaleDateString("pt-br").split("/");
  const hoje = new Date();

  const diasDaSemana = [
    "Domingo",
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado",
  ];
  const diaAtual = diasDaSemana[hoje.getDay()];

  const activePatients = user?.patients.filter(
    (patient) => patient.status == "Ativo"
  );

  const ThreeFirstPatients = activePatients?.splice(0, 3);

  return (
    <section className="w-full min-h-screen relative bg-[#000] bg-[url('/background.jpg')] bg-cover bg-center">
      <div className="w-full min-h-full absolute top-0 backdrop-blur-2xl backdrop-sepia-90">
        <div className="px-5 py-40">
          <p className="text-5xl">Bem-vindo, é bom te ver aqui!</p>
          <p className="text-2xl text-[#fff8e2]">
            {dia}.{mes} - {diaAtual}
          </p>
        </div>
      </div>
    </section>
  );
}
