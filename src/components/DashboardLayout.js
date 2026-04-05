"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import { useAuth } from "@/context/AuthContext";
import { FiX } from "react-icons/fi";

export default function DashboardLayout({ children }) {
  const { user, loading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#FEFAF7]">
      <div className="w-16 h-16 border-4 border-[#154D57]/10 border-t-[#154D57] rounded-full animate-spin"></div>
    </div>
  );

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#FEFAF7] font-sans flex overflow-hidden relative">
      {/* --- DESKTOP SIDEBAR --- */}
      <div className="hidden md:block w-64 h-screen shrink-0 border-r border-[#154D57]/5">
        <Sidebar role={user.role} />
      </div>

      {/* --- MOBILE SIDEBAR (Drawer) --- */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-100 md:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-[#154D57]/40 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
          
          {/* Sidebar Panel */}
          <div className="absolute top-0 left-0 h-full w-72 bg-white shadow-2xl animate-in slide-in-from-left duration-300">
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="absolute top-6 right-6 w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-[#154D57] active:scale-90 transition-transform"
            >
              <FiX className="w-6 h-6" />
            </button>
            <Sidebar role={user.role} />
          </div>
        </div>
      )}

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Bar inside content area */}
        <TopBar onMenuClick={() => setIsSidebarOpen(true)} />

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-10 bg-[#f8f9fa] relative">
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#154D57_1px,transparent_1px)] bg-size-[40px_40px]"></div>
          
          <div className="relative z-10 w-full max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
