import { useState } from "react";

export interface WarningBox {
  route: string;
  id: string;
  title: string;
  summary: string;
}

function getRouteByType(type: ConfirmWarmingBoxProps["type"]) {
  return routes.find((r) => r.type === type)?.route || null;
}

const routes = [
  {
    type: "PAST CONFIRM SCHEDULE",
    route: "appointments/all/schedule",
  },
  {
    type: "CONFIRM SCHEDULE",
    route: "appointments/all/past/schedule",
  },
];

export interface ConfirmWarmingBoxProps {
  status: boolean;
  type: "PAST CONFIRM SCHEDULE" | "CONFIRM SCHEDULE" | null;
}

export default function useWarmingBox() {
  const [warningBox, setWarningBox] = useState<WarningBox | null>(null);
  const [confirmWarmingBox, setConfirmWarmingBox] =
    useState<ConfirmWarmingBoxProps>({
      status: false,
      type: null,
    });

  return {
    warningBox,
    setWarningBox,
    confirmWarmingBox,
    setConfirmWarmingBox,
    routes,
    getRouteByType,
  };
}
