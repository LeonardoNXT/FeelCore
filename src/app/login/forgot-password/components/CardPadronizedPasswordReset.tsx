import { motion } from "framer-motion";

type Props = {
  children: React.ReactNode;
  config: {
    progressNumber: number;
    title: string;
  };
};

export default function CardPadronizedPasswordReset({
  children,
  config,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full h-full flex justify-center items-center relative"
    >
      <div className="w-full md:max-w-[500px] backdrop-blur-1xl rounded-4xl bg-[#ffffff34] border-1 border-[#ebebebbb]">
        <div className="px-2 py-2 w-full rounded-4xl text-[#333]">
          <p className="px-5 py-2 border-1 w-max rounded-full tracking-widest text-[14px]">
            Etapa {config.progressNumber}/4
          </p>
          <p className="text-2xl px-2 py-4">{config.title}</p>
        </div>
        <div className="w-full px-4 py-4 bg-[#ffffff] rounded-b-4xl flex justify-between gap-4 text-[#333333]">
          {children}
        </div>
      </div>
    </motion.div>
  );
}
