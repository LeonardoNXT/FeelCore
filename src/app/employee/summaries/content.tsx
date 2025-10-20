"use client";

import { useState } from "react";
import ButtonPushRouteComponent from "../components/buttonPushRoute";
import SectionConteinerPadronized from "../components/sectionAndComponentPadronized";
import { AnimatePresence } from "framer-motion";
import MapOfSummaries from "./components/mapOfSummaries";

export default function SummaryContent() {
  const [changePage, setChangePage] = useState<boolean>(false);

  return (
    <AnimatePresence>
      {!changePage && (
        <SectionConteinerPadronized>
          <ButtonPushRouteComponent
            title="Criar resumo"
            route="/employee/summaries/create"
            setChangePage={setChangePage}
          />
          <MapOfSummaries setChangePage={setChangePage} />
        </SectionConteinerPadronized>
      )}
    </AnimatePresence>
  );
}
