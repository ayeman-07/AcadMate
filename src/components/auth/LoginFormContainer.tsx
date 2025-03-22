"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface LoginFormContainerProps {
  children: ReactNode;
  role: string;
}

export default function LoginFormContainer({
  children,
  role,
}: LoginFormContainerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full max-w-md p-8 bg-white/5 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/10"
    >
      <div className="mb-8 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
          className="text-3xl font-bold text-white mb-2 font-montserrat tracking-tight"
        >
          Welcome back
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-gray-300 text-sm"
        >
          Sign in to your {role} account
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.6, ease: "easeOut" }}
      >
        {children}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="mt-6 text-center"
      >
        <button className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
          Forgot password?
        </button>
      </motion.div>
    </motion.div>
  );
}
