"use client";

import { useAuth } from "@/context/AuthContext";
import { FiSearch, FiBell, FiChevronDown, FiUser } from "react-icons/fi";

export default function TopBar({ onMenuClick }) {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="flex items-center justify-between px-4 md:px-8 py-3 md:py-4 bg-white/50 backdrop-blur-md sticky top-0 z-30 border-b border-[#154D57]/5">
      {/* Search Bar / Menu Button */}
      <div className="flex items-center gap-4 flex-1">
        {/* Mobile Menu Button */}
        <button
          onClick={onMenuClick}
          className="md:hidden w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-[#154D57] shadow-sm"
        >
          <div className="space-y-1">
            <div className="w-5 h-0.5 bg-current"></div>
            <div className="w-5 h-0.5 bg-current"></div>
            <div className="w-3 h-0.5 bg-current"></div>
          </div>
        </button>

        <div className="relative w-full max-w-[160px] sm:max-w-md group">
          <FiSearch className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5 transition-colors group-hover:text-[#154D57]" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-white border border-gray-100 rounded-xl md:rounded-2xl py-2 md:py-3 pl-9 md:pl-12 pr-4 md:pr-6 text-xs md:text-sm font-medium focus:outline-none focus:border-[#154D57]/20 focus:ring-4 focus:ring-[#154D57]/5 transition-all shadow-sm group-hover:shadow-md"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-6">
        {/* Notifications */}
        <button className="relative w-10 h-10 md:w-12 md:h-12 bg-white rounded-xl md:rounded-2xl border border-gray-100 flex items-center justify-center text-[#154D57] shadow-sm hover:shadow-md active:scale-95 transition-all group shrink-0">
          <FiBell className="w-5 h-5 md:w-6 md:h-6 group-hover:rotate-12 transition-transform" />
          <span className="absolute top-3 right-3 md:top-3.5 md:right-3.5 w-2 h-2 md:w-2.5 md:h-2.5 bg-red-500 rounded-full border-2 md:border-4 border-white"></span>
        </button>

        {/* Profile Quick Access */}
        <div className="flex items-center gap-3 md:gap-4 pl-4 md:pl-6 border-l border-gray-100 group cursor-pointer shrink-0">
          <div className="text-right hidden md:block">
            <h4 className="text-sm font-black text-[#154D57] leading-none mb-1">
              {user.displayName || "John Doe"}
            </h4>
            <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
              {user.role === "admin" ? "Teacher / Admin" : "Student"}
            </p>
          </div>
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl overflow-hidden border-2 border-transparent shadow-lg shrink-0">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-[#154D57] flex items-center justify-center text-white">
                <FiUser className="w-5 h-5 md:w-6 md:h-6" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
