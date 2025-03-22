"use client";

import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { AnimatedEyeIcon } from "./AnimatedEyeIcon";

interface FormInputProps {
  id: string;
  name: string;
  type: string;
  label: string;
  placeholder: string;
  icon: LucideIcon;
  required?: boolean;
  autoComplete?: string;
  error?: string;
}

export function FormInput({
  id,
  name,
  type,
  label,
  placeholder,
  icon: Icon,
  required = false,
  autoComplete,
  error,
}: FormInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-2"
    >
      <label
        htmlFor={id}
        className="text-sm font-medium text-gray-300 flex items-center gap-2"
      >
        <Icon className="w-4 h-4" />
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={name}
          type={isPassword && !showPassword ? "password" : "text"}
          required={required}
          autoComplete={autoComplete}
          className={`w-full pl-10 pr-12 py-2.5 text-white bg-white/5 backdrop-blur-sm border ${
            error ? "border-red-500/50" : "border-white/10"
          } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all duration-200 placeholder-gray-400`}
          placeholder={placeholder}
        />
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        {isPassword && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <AnimatedEyeIcon
              isVisible={showPassword}
              onClick={() => setShowPassword(!showPassword)}
            />
          </div>
        )}
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-red-400"
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  );
}
