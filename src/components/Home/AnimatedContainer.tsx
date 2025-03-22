"use client";

import { motion } from "framer-motion";

interface AnimatedContainerProps {
  children: React.ReactNode;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export function AnimatedContainer({ children }: AnimatedContainerProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-7xl mx-auto text-center"
    >
      {children}
    </motion.div>
  );
}
