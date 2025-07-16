"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FileText,
  Calendar,
  BookOpen,
  Bell,
  Settings,
  X,
  LucideIcon,
} from "lucide-react";

// Interface for a sidebar navigation item
interface SidebarItem {
  title: string;
  icon: LucideIcon;
  href: string;
}

// Updated, flattened list of sidebar items
const sidebarItems: SidebarItem[] = [
  { title: "Dashboard", icon: LayoutDashboard, href: "/admin" },
  { title: "Students", icon: Users, href: "/admin/users/students" },
  { title: "Professors", icon: Users, href: "/admin/users/professors" },
  { title: "Exam", icon: FileText, href: "/admin/exams" },
  { title: "Results", icon: FileText, href: "/admin/results" },
  {
    title: "Attendance Reports",
    icon: Calendar,
    href: "/admin/attendance",
  },
  { title: "Subject Allotment", icon: BookOpen, href: "/admin/allotment" },
  { title: "Settings & Profile", icon: Settings, href: "/admin/settings" },
];

interface AdminSidebarProps {
  onClose: () => void;
}

export default function AdminSidebar({ onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  // Closes sidebar on item click on smaller screens
  const handleItemClick = () => {
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <div className="flex flex-col h-full bg-black border-r border-white/30 text-gray-300 overflow-y-auto">
      {/* Sidebar Header */}
      <div className="p-6 border-b border-white/10 flex items-center justify-between">
        <h1 className="text-xl font-bold text-white font-montserrat">
          Admin Panel
        </h1>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-blue-500/80 transition-colors lg:hidden"
          aria-label="Close sidebar"
        >
          <X className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-4">
          {sidebarItems.map((item) => (
            <li key={item.title}>
              <Link
                href={item.href}
                onClick={handleItemClick}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  pathname === item.href
                    ? "bg-blue-600/50 text-white"
                    : "hover:bg-white/5 hover:text-white"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
