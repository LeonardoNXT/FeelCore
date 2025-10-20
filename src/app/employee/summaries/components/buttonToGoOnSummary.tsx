import { LoaderCircle, MoveUpRight } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { useRouter } from "next/navigation";

export default function ButtonToGoOnSummary({
  route,
  setChangePage,
}: {
  route: string;
  setChangePage: Dispatch<SetStateAction<boolean>>;
}) {
  const router = useRouter();
  const [load, setLoad] = useState<boolean>(false);
  return (
    <div
      className="w-12 h-12 border-1 shadow-inner shadow-[#333] px-3 py-3 rounded-full"
      onClick={() => {
        if (load) return;
        setLoad(true);
        setChangePage(true);
        router.push(route);
      }}
    >
      {!load ? (
        <MoveUpRight className="w-full h-full text-[#333] duration-200 hover:rotate-45 cursor-pointer" />
      ) : (
        <LoaderCircle className="w-full h-full text-[#333] animate-spin cursor-not-allowed" />
      )}
    </div>
  );
}
