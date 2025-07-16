"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  { title: "Dashboard", icon: LayoutDashboard, href: "/admin" },
  {
    title: "User",
    icon: Users,
    href: "/admin/users/students",
    subItems: [
      { title: "Students", href: "/admin/users/students" },
      { title: "Professors", href: "/admin/users/professors" },
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
  { title: "Messaging", icon: MessageSquare, href: "/admin/messaging" },
  { title: "Settings & Profile", icon: Settings, href: "/admin/settings" },
];

interface AdminSidebarProps {
  onClose: () => void;
}

export default function AdminSidebar({ onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  useEffect(() => {
    const activeItem = sidebarItems.find((item) =>
      item.subItems?.some((sub) => pathname.startsWith(sub.href))
    );
    setExpandedItem(activeItem ? activeItem.title : null);
  }, [pathname]);

  const handleItemClick = (
    e: React.MouseEvent,
    title: string,
    hasSubItems: boolean
  ) => {
    if (hasSubItems) {
      e.preventDefault();
      setExpandedItem(expandedItem === title ? null : title);
    } else {
      if (window.innerWidth < 1024) {
        onClose();
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-black border-r border-white/30">
      <div className="p-6 border-b border-white/10 flex items-center justify-between">
        <h1 className="text-xl font-bold text-white font-montserrat">
          Admin Panel
        </h1>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-blue-500/80 transition-colors lg:hidden"
        >
          <X className="w-5 h-5 text-white" />
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-4">
          {sidebarItems.map((item) => (
            <li key={item.title}>
              <Link
                href={item.href}
                onClick={(e) => handleItemClick(e, item.title, !!item.subItems)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  (pathname.startsWith(item.href) && !item.subItems) ||
                  (expandedItem === item.title && item.subItems)
                    ? "text-white"
                    : "text-gray-300 hover:bg-white/5 hover:text-white"
                } ${
                  pathname.startsWith(item.href) && !item.subItems
                    ? "bg-blue-600/50"
                    : ""
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.title}</span>
                {item.subItems && (
                  <span className="ml-auto">
                    <ChevronRight
                      className={`w-4 h-4 transition-transform duration-200 ${
                        expandedItem === item.title ? "rotate-90" : ""
                      }`}
                    />
                  </span>
                )}
              </Link>
              {item.subItems && expandedItem === item.title && (
                <ul className="mt-1 space-y-1 pl-8 py-2">
                  {item.subItems.map((subItem) => (
                    <li key={subItem.title}>
                      <Link
                        href={subItem.href}
                        onClick={() => {
                          if (window.innerWidth < 1024) onClose();
                        }}
                        className={`block px-4 py-2 rounded-lg text-sm transition-colors ${
                          pathname.startsWith(subItem.href)
                            ? "bg-white/10 text-white"
                            : "text-gray-300 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        {subItem.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}