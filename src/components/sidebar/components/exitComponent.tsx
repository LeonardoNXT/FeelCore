"use client";
import { LogOut } from "lucide-react";

import { Dispatch, SetStateAction } from "react";

export default function ExitAccountComponent({
  setExitClicked,
  exitClicked,
}: {
  setExitClicked: Dispatch<SetStateAction<boolean>>;
  exitClicked: boolean;
}) {
  console.log("exitAccount");

  const logout = async () => {
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Houve um erro inesperado.");
      }
      const data = await response.json();
      console.log(data);
      setExitClicked(!exitClicked);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      className="absolute bottom-4 left-4 bg-[#000] px-5 py-2 rounded-3xl text-[13px] items-center flex gap-2 cursor-pointer text-[#fff] hover:bg-[#f00] duration-300"
      onClick={() => {
        logout();
      }}
    >
      <p>SAIR</p>
      <LogOut className="w-4" />
    </div>
  );
}
