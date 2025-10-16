import { LoaderCircle } from "lucide-react";
import { useState } from "react";

export default function SmallPDFcomponent({ id }: { id: string }) {
  const [load, setLoad] = useState<boolean>(false);
  const getPDF = async () => {
    try {
      const response = await fetch(`/api/appointments/pdf/${id}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `agendamento_${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setLoad(false);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (err) {
      console.log("[ERROR TO GET PDF]", err);
      setLoad(false);
    }
  };
  return (
    <a
      className={`h-8 w-8 px-2 py-2 border-1 rounded-full text-[10px] flex justify-center items-center duration-200 ${
        !load
          ? "hover:bg-red-500 text-[#eee] cursor-pointer"
          : "cursor-not-allowed"
      }`}
      onClick={() => {
        setLoad(true);
        getPDF();
      }}
    >
      {load ? <LoaderCircle className="w-full h-full animate-spin" /> : "PDF"}
    </a>
  );
}
