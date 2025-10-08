import { motion } from "framer-motion";
import HeaderOfBoxInitialComponent from "./headerOfBoxInitialComponent";

type Props = {
  title: string;
  summary: string;
  urlImage?: string | undefined;
  icon: boolean;
  fallbackImage?: string;
  children: React.ReactNode;
};

export default function BoxOfInitialPagesComponent({
  title,
  summary,
  icon,
  urlImage,
  fallbackImage,
  children,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full px-2 py-2 bg-gradient-to-r from-[#010101] to-[#292929ea] rounded-[30px] border-1 border-[#333333]"
    >
      <HeaderOfBoxInitialComponent
        title={title}
        icon={icon}
        urlImage={urlImage}
        fallbackImage={fallbackImage}
      />
      <div className="px-4 text-[#757575] mt-10">{summary}</div>
      {children}
    </motion.div>
  );
}
