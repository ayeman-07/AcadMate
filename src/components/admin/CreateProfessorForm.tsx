"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, Building2, Briefcase } from "lucide-react";
import { FormInput } from "../ui/FormInput";

export default function CreateProfessorForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const professorData = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      department: formData.get("department"),
      designation: formData.get("designation"),
    };

    try {
      const response = await fetch("/api/user-mgmt/professor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(professorData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create professor");
      }

      router.push("/admin/users/professors");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create professor");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl mx-auto bg-white/5 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/10"
      >
        <h1 className="text-3xl font-bold text-white mb-8 text-center">
          Create New Professor
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              id="name"
              name="name"
              type="text"
              label="Full Name"
              placeholder="Enter professor's full name"
              icon={User}
              required
            />

            <FormInput
              id="email"
              name="email"
              type="email"
              label="Email"
              placeholder="Enter professor's email"
              icon={Mail}
              required
            />

            <FormInput
              id="password"
              name="password"
              type="password"
              label="Password"
              placeholder="Enter password"
              icon={Lock}
              required
            />

            <FormInput
              id="department"
              name="department"
              type="text"
              label="Department"
              placeholder="e.g., CSE, ECE"
              icon={Building2}
              required
            />

            <FormInput
              id="designation"
              name="designation"
              type="text"
              label="Designation"
              placeholder="e.g., Assistant Professor, Professor"
              icon={Briefcase}
              required
            />
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-red-400 text-center"
            >
              {error}
            </motion.p>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Creating..." : "Create Professor"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
} 