"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { FormInput } from "@/components/ui/FormInput";
import { GraduationCap, Lock, User } from "lucide-react";
import { motion } from "framer-motion";

export default function StudentLoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const roll = formData.get("roll") as string;
    const password = formData.get("password") as string;

    try {
      const result = await signIn("credentials", {
        roll: roll.toUpperCase(),
        password,
        role: "student",
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid roll number or password");
        return;
      }

      router.push("/student");
      router.refresh();
    } catch (error) {
      console.error("Login error:", error);
      setError("Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
      onSubmit={onSubmit}
      className="space-y-6"
    >
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 text-sm text-red-400 bg-red-950/50 rounded-lg border border-red-900"
        >
          {error}
        </motion.div>
      )}

      <FormInput
        id="roll"
        name="roll"
        type="text"
        label="Roll Number"
        placeholder="Enter your roll number"
        icon={GraduationCap}
        required
        autoComplete="off"
      />

      <FormInput
        id="password"
        name="password"
        type="password"
        label="Password"
        placeholder="Enter your password"
        icon={Lock}
        required
      />

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        disabled={isLoading}
        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
            />
            Signing in...
          </>
        ) : (
          <>
            <User className="w-5 h-5" />
            Sign in
          </>
        )}
      </motion.button>
    </motion.form>
  );
}
