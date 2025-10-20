import { LoaderCircle, MoveUpRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function MoveUpRightAndLoadingComponent({ id }: { id: string }) {
  const [load, setLoad] = useState<boolean>(false);
  const router = useRouter();
  if (!load) {
    return (
      <MoveUpRight
        className="w-full h-full text-[#555] duration-200 hover:rotate-45 cursor-pointer"
        onClick={() => {
          setLoad(true);
          router.push(`/employee/patients/${id}`);
        }}
      />
    );
  } else {
    return (
      <LoaderCircle className="w-full h-full text-[#555] duration-200 hover:rotate-45 cursor-not-allowed animate-spin" />
    );
  }
}
