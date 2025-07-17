"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import LogoutButton from "@/components/Logout";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex">
      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-transform transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="fixed inset-0  backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)}></div>
        <div className="relative z-10 w-64 h-full">
          <AdminSidebar onClose={() => setIsSidebarOpen(false)} />
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 h-screen sticky top-0">
        <AdminSidebar onClose={() => {}} />
      </div>

      {/* Main Content */}
      <main className="flex-1 transition-all duration-300">
        <div className="p-4 sm:p-6 lg:p-8">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden text-white p-2 mb-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          >
            {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          {children}
        </div>
      </main>
    </div>
  );
}