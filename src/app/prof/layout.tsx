"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  BookOpen,
  BarChart2,
  Users,
  Settings,
  LogOut,
  Home,
} from "lucide-react";
import LogoutButton from "@/components/Logout";

const navigation = [
  { name: "Dashboard", href: "/prof/dashboard", icon: Home },
  { name: "Marks Entry", href: "/prof/marks/selection", icon: BookOpen },
  { name: "Results", href: "/prof/results/selection", icon: BarChart2 },
  { name: "Students", href: "/prof/students", icon: Users },
  { name: "Settings", href: "/prof/settings", icon: Settings },
];

export default function ProfessorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <LogoutButton /> 

      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-black/30 backdrop-blur-lg border-r border-white/10 p-4">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-xl font-bold">Professor Portal</h1>
          </div>
          <nav className="space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.name} href={item.href}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                      isActive
                        ? "bg-indigo-600 text-white"
                        : "text-gray-300 hover:bg-white/5"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </motion.div>
                </Link>
              );
            })}
          </nav>
          
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
} 