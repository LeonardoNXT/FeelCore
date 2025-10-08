"use client";
import { motion } from "framer-motion";

export default function MainRouteOfEmployeeConteiner() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 1 }}
      className="w-full min-h-screen relative bg-[#000] bg-[url('/background.jpg')] bg-cover bg-center flex justify-center"
    ></motion.section>
  );
}
