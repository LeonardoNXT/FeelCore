"use client";
import { useUserStore } from "@/stores/userStore";

export default function WelcomeDashboard() {
  const { user } = useUserStore();
  return (
    <div>
      <h1 className="text-[4vw] font-bold">Olá, {user?.name}.</h1>
    </div>
  );
}
