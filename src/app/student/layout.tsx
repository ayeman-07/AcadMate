"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import LogoutButton from "@/components/Logout";
import {
  FileBarChart2,
  CalendarCheck,
  FileText,
  BookOpen,
  User,
  LogOut,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/student", icon: FileBarChart2 },
  { name: "Results", href: "/student/results", icon: FileBarChart2 },
  { name: "Attendance", href: "/student/attendance", icon: CalendarCheck },
  { name: "Assignments", href: "/student/assignments", icon: FileText },
  { name: "Syllabus", href: "/student/syllabus", icon: BookOpen },
  { name: "Profile", href: "/student/profile", icon: User },
];

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-black/30 backdrop-blur-lg border-r border-white/10 p-4 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-xl font-bold">Student Portal</h1>
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

            <div className="absolute bottom-4 left-4 right-4">
              <LogoutButton />
            </div>
          </nav>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
}
