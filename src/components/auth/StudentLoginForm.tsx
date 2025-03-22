"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export function StudentLoginForm() {
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

      router.push("/dashboard/student");
      router.refresh();
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {error && (
        <div className="p-3 text-sm text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-950/50 rounded-lg">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <label
          htmlFor="roll"
          className="text-sm font-medium text-slate-700 dark:text-slate-200"
        >
          Roll Number
        </label>
        <input
          id="roll"
          name="roll"
          type="text"
          autoComplete="off"
          required
          className="w-full px-3 py-2 text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
          placeholder="Enter your roll number"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="password"
          className="text-sm font-medium text-slate-700 dark:text-slate-200"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="w-full px-3 py-2 text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
          placeholder="Enter your password"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
