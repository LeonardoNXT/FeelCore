import { Dispatch, SetStateAction } from "react";
import { routes } from "./routes";
import { useRouter } from "next/navigation";

interface Props {
  setOpen: Dispatch<SetStateAction<boolean>>;
  open: boolean;
}

export default function EmployeeLinksComponent({ setOpen, open }: Props) {
  const router = useRouter();
  return (
    <div className="px-4 h-full justify-center flex flex-col gap-2">
      {routes.map((route, i) => (
        <p
          key={i}
          className="text-[#333] text-4xl cursor-pointer after:block after:w-0 after:bg-[#c0c0c0] after:h-[1px] hover:after:w-full transition-all after:duration-300 duration-300 hover:tracking-wide hover:text-[#000] w-max"
          onClick={() => {
            setOpen(!open);
            router.push(route.path);
          }}
        >
          {route.name}
        </p>
      ))}
    </div>
  );
}
