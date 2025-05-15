"use client";

import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import GlassBackground from "@/components/ui/GlassBackground";
import LogoutButton from "@/components/Logout";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Add/remove body scroll lock when sidebar opens/closes on mobile
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup function to ensure body scroll is restored when component unmounts
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isSidebarOpen]);

  return (
    <>
      
      <GlassBackground />
      <div className="min-h-screen bg-black/50 backdrop-blur-sm">
        {!isSidebarOpen && (
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="sticky top-4 left-4 z-50 p-2 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 shadow-lg hover:bg-white/10 transition-colors"
          >
            <Menu className="w-6 h-6 text-white" />
          </button>
        )}

        {/* Sidebar */}
        <div className="hidden lg:inline lg:fixed h-full lg:w-64">
          <AdminSidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />
        </div>

        {/* Mobile Sidebar */}
        <div className="lg:hidden fixed z-50 overflow-hidden">
          <AdminSidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />
        </div>

        {/* Main Content */}
        <main
          className={`transition-all duration-300 ${
            isSidebarOpen ? "lg:ml-64" : ""
          }`}
        >
          <div className="p-4 sm:p-6 lg:p-8 pt-20">{children}</div>
        </main>
        <LogoutButton />
      </div>
    </>
  );
}
