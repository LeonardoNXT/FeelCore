import { MoveUpRight } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

type Props = {
  title: string;
  route: string;
  setChangePage: Dispatch<SetStateAction<boolean>>;
};

export default function ButtonPushRouteComponent({
  title,
  route,
  setChangePage,
}: Props) {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full py-2 px-2 bg-gradient-to-r from-[#000] to-[#000000b7] mb-2 flex justify-between items-center rounded-full border-1 border-[#333]"
    >
      <p className="py-1 px-3 bg-[#161616] border-1 border-[#333] text-[#646464] rounded-full">
        {title}
      </p>
      <div
        className="w-10 h-10 rounded-full bg-[#eee] grid place-items-center px-2 py-2"
        onClick={() => {
          setChangePage(true);
          router.push(route);
        }}
      >
        <MoveUpRight className="text-[#333] w-full h-full duration-300 hover:rotate-45" />
      </div>
    </motion.div>
  );
}
