import { LoaderCircle } from "lucide-react";
import { memo, useState } from "react";

function PDFButtonComponent({ id }: { id: string }) {
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
    }
  };

  return (
    <button
      className={`h-10 w-10 px-2 py-2 border-1 rounded-full flex justify-center items-center duration-300 hover:text-[#eee] ${
        !load ? "hover:bg-red-600 cursor-pointer" : "cursor-not-allowed"
      }  text-[12px]`}
      onClick={() => {
        setLoad(true);
        getPDF();
      }}
    >
      {load ? <LoaderCircle className="w-full h-full animate-spin" /> : "PDF"}
    </button>
  );
}

export default memo(PDFButtonComponent);
