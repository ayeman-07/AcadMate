"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  FileText,
  Calendar,
  BookOpen,
  Bell,
  BookMarked,
  BarChart3,
  MessageSquare,
  Settings,
  ChevronDown,
  ChevronRight,
  X,
  LucideIcon,
} from "lucide-react";

interface SidebarItem {
  title: string;
  icon: LucideIcon;
  href: string;
  subItems?: {
    title: string;
    href: string;
  }[];
}

const sidebarItems: SidebarItem[] = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin",
  },
  {
    title: "User",
    icon: Users,
    href: "/admin/users",
    subItems: [
      { title: "Students", href: "/admin/users/students" },
      { title: "Teachers", href: "/admin/users/teachers" },
      { title: "Staff", href: "/admin/users/staff" },
    ],
  },
  {
    title: "Exam & Results",
    icon: FileText,
    href: "/admin/exams",
    subItems: [
      { title: "Create Exam", href: "/admin/exams/create" },
      { title: "Results", href: "/admin/exams/results" },
      { title: "Grade Reports", href: "/admin/exams/reports" },
    ],
  },
  {
    title: "Attendance ",
    icon: Calendar,
    href: "/admin/attendance",
    subItems: [
      { title: "Mark Attendance", href: "/admin/attendance/mark" },
      { title: "Attendance Reports", href: "/admin/attendance/reports" },
    ],
  },
  {
    title: "Syllabus & Materials",
    icon: BookOpen,
    href: "/admin/syllabus",
    subItems: [
      { title: "Manage Syllabus", href: "/admin/syllabus/manage" },
      { title: "Study Materials", href: "/admin/syllabus/materials" },
    ],
  },
  {
    title: "Events & Notices",
    icon: Bell,
    href: "/admin/events",
    subItems: [
      { title: "Create Event", href: "/admin/events/create" },
      { title: "Announcements", href: "/admin/events/announcements" },
    ],
  },
  {
    title: "Assignments",
    icon: BookMarked,
    href: "/admin/assignments",
    subItems: [
      { title: "Create Assignment", href: "/admin/assignments/create" },
      { title: "Submissions", href: "/admin/assignments/submissions" },
    ],
  },
  {
    title: "Reports & Analytics",
    icon: BarChart3,
    href: "/admin/reports",
    subItems: [
      { title: "Performance Reports", href: "/admin/reports/performance" },
      { title: "Analytics", href: "/admin/reports/analytics" },
    ],
  },
  {
    title: "Messaging",
    icon: MessageSquare,
    href: "/admin/messaging",
  },
  {
    title: "Settings & Profile",
    icon: Settings,
    href: "/admin/settings",
  },
];

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleItem = (title: string) => {
    setExpandedItems((prev) => {
      // If clicking the same item, close it
      if (prev.includes(title)) {
        return [];
      }
      // Otherwise, open only this item
      return [title];
    });
  };

  return (
    <div className="h-[100vh]">
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay - Only on mobile */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden h-[100vh]"
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 20, stiffness: 100 }}
              className="fixed inset-y-0 left-0 w-64 h-[100vh] bg-white/5 backdrop-blur-sm border-r border-white/10 shadow-lg z-50 lg:relative lg:translate-x-0 lg:shadow-none lg:border-r-0"
            >
              {/* Sidebar Content */}
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                  <h1 className="text-xl font-bold text-white font-montserrat">
                    Admin Panel
                  </h1>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-lg hover:bg-white/5 transition-colors lg:hidden"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-4">
                  <ul className="space-y-1 px-4">
                    {sidebarItems.map((item) => (
                      <li key={item.title}>
                        <div>
                          <Link
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                              pathname === item.href
                                ? "bg-white/10 text-white"
                                : "text-gray-300 hover:bg-white/5 hover:text-white"
                            }`}
                          >
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium">{item.title}</span>
                            {item.subItems && (
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  toggleItem(item.title);
                                }}
                                className="ml-auto p-2 rounded-full hover:bg-white/5 transition-colors cursor-pointer"
                              >
                                <motion.div
                                  animate={{
                                    rotate: expandedItems.includes(item.title)
                                      ? 180
                                      : 0,
                                  }}
                                  transition={{ duration: 0.3 }}
                                >
                                  {expandedItems.includes(item.title) ? (
                                    <ChevronDown className="w-4 h-4" />
                                  ) : (
                                    <ChevronRight className="w-4 h-4" />
                                  )}
                                </motion.div>
                              </button>
                            )}
                          </Link>
                        </div>

                        {/* Sub-items */}
                        {item.subItems &&
                          expandedItems.includes(item.title) && (
                            <motion.ul
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{
                                height: { duration: 0.3, ease: "easeInOut" },
                                opacity: { duration: 0.2 },
                              }}
                              className="mt-1 space-y-1 pl-12"
                            >
                              {item.subItems.map((subItem) => (
                                <motion.li
                                  key={subItem.title}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, x: -20 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <Link
                                    href={subItem.href}
                                    className={`block px-4 py-2 rounded-lg text-sm transition-colors ${
                                      pathname === subItem.href
                                        ? "bg-white/10 text-white"
                                        : "text-gray-300 hover:bg-white/5 hover:text-white"
                                    }`}
                                  >
                                    {subItem.title}
                                  </Link>
                                </motion.li>
                              ))}
                            </motion.ul>
                          )}
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
