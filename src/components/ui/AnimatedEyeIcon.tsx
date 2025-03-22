"use client";

import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";

interface AnimatedEyeIconProps {
  isVisible: boolean;
  onClick: () => void;
  className?: string;
}

export function AnimatedEyeIcon({
  isVisible,
  onClick,
  className = "",
}: AnimatedEyeIconProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      className={`relative p-1 rounded-full hover:bg-white/5 transition-colors ${className}`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        initial={false}
        animate={{
          rotate: isVisible ? 0 : 180,
          scale: isVisible ? 1 : 0.8,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="relative"
      >
        <Eye className="w-5 h-5 text-gray-400" />
        <motion.div
          initial={false}
          animate={{
            height: isVisible ? "100%" : "0%",
            opacity: isVisible ? 1 : 0,
          }}
          transition={{ duration: 0.2, delay: 0.1 }}
          className="absolute inset-0 overflow-hidden"
        >
          <EyeOff className="w-5 h-5 text-gray-400" />
        </motion.div>
      </motion.div>
    </motion.button>
  );
}
