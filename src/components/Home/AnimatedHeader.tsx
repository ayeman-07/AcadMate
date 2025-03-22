"use client";

import { motion } from "framer-motion";

export function AnimatedHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-20"
    >
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-medium text-slate-800 dark:text-slate-100 mb-6 font-montserrat tracking-tight">
        Welcome to{" "}
        <span className="text-indigo-600 dark:text-indigo-400 font-medium">
          AcadMate
        </span>
      </h1>
      
    </motion.div>
  );
}
