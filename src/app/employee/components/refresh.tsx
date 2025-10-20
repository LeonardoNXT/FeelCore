"use client";
import { useRef } from "react";
import { motion } from "framer-motion";
import useRefreshAnimation from "./useRefreshAnimation";

export default function RefreshComponent({
  title,
  route,
  display,
  zIndex = "10",
  auxiliarFunction,
}: {
  title: string;
  route: string;
  display: string;
  zIndex?: string;
  auxiliarFunction?: () => void | null;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  useRefreshAnimation(ref, route, auxiliarFunction);

  return (
    <motion.div
      ref={ref}
      className={`${display} top-0 left-0 z-${zIndex} w-full h-screen`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="w-full h-full bg-[#000] grid place-items-center">
        <p className="text-4xl md:text-6xl text-[#ebebeb] opacity-0 relative text-center">
          {title}
        </p>
      </div>
    </motion.div>
  );
}
