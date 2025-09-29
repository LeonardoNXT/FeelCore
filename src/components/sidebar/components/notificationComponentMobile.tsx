import NotificationBarComponent from "./notificationComponent";
import { motion } from "framer-motion";

export default function NotificationComponentMobile() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="absolute w-full h-full bg-[#fff] top-0 left-0 rounded-4xl pt-20"
    >
      <NotificationBarComponent />
    </motion.div>
  );
}
