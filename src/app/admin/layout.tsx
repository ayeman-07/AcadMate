"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import LogoutButton from "@/components/Logout";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isSidebarOpen]);

  return (
    <>

      <div className="min-h-screen bg-black/50 backdrop-blur-sm flex">
        {/* Sidebar */}
        {isSidebarOpen && (
          <div className="fixed lg:static z-50 h-full w-64">
            <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
          </div>
        )}

        {/* Toggle Button */}
        <div
          className={`fixed top-4 left-4 z-[60] p-2 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 shadow-lg transition-colors ${
            isSidebarOpen ? "lg:left-72" : ""
          }`}
        >
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-white hover:bg-white/10 rounded-lg p-1 transition"
          >
            {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Main Content */}
        <main
          className={`flex-1 transition-all duration-300 ${
            isSidebarOpen ? "lg:ml-64" : ""
          }`}
        >
          <div className="p-4 sm:p-6 lg:p-8 pt-20">{children}</div>
          <LogoutButton />
        </main>
      </div>
    </>
  );
}
