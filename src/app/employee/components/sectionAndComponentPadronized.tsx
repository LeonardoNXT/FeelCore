import { motion } from "framer-motion";

export default function SectionConteinerPadronized({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className={`w-full min-h-screen bg-[url('/background.jpg')] bg-fixed bg-cover bg-center relative`}
    >
      <div className="w-full min-h-screen flex justify-center backdrop-blur-3xl py-25 md:py-35 px-1 backdrop-sepia-50 relative">
        <div className="w-full md:w-[800px] px-3 flex flex-col gap-2 relative">
          {children}
        </div>
      </div>
    </motion.section>
  );
}
