"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false }); // prevent default redirect
    router.push("/"); // manual redirect to home
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleLogout}
      className="flex items-center justify-center bg-neutral-400 text-black gap-2 px-4 py-2 hover:bg-neutral-300 rounded-md transition z-50 font-semibold text-base sm:text-lg md:text-lg cursor-pointer shadow-md mx-auto mb-4 w-[90%] max-w-xs sm:max-w-sm md:max-w-md"
    >
      <LogOut className="w-5 h-5 sm:w-6 sm:h-6" />
      <span className="truncate">Logout</span>
    </motion.button>
  );
}
