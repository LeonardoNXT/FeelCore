"use client";

import BoxOfInitialPagesComponent from "../appointments/components/boxOfInitialComponents";
import SectionConteinerPadronized from "../components/sectionAndComponentPadronized";

export default function TaskContent() {
  return (
    <SectionConteinerPadronized>
      <BoxOfInitialPagesComponent
        title="Tarefas Pendentes"
        summary="Visualize e acompanhe todas as tarefas que ainda precisam ser concluídas. Mantenha o foco e organize suas prioridades."
        icon={false}
      >
        <div className="w-full mt-10 h-60 bg-gradient-to-tr from-[#616161] to-amber-100 rounded-3xl"></div>
      </BoxOfInitialPagesComponent>
    </SectionConteinerPadronized>
  );
}
