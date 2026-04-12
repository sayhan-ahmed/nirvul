"use client";

import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState, useRef } from "react";
import {
  FiHome,
  FiFileText,
  FiMessageSquare,
  FiUser,
  FiChevronDown,
  FiLayout,
  FiLogOut,
  FiBell,
} from "react-icons/fi";
import Link from "next/link";

const NAV_ITEMS = [
  {
    path: "/",
    label: "Home",
    icon: <FiHome className="w-5 h-5" />,
  },
  {
    path: "/tests",
    label: "All Tests",
    icon: <FiFileText className="w-5 h-5" />,
  },
  {
    path: "/suggestions",
    label: "Suggestions",
    icon: <FiMessageSquare className="w-5 h-5" />,
  },
];

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const [activeIndex, setActiveIndex] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isExamActive, setIsExamActive] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    let idx = NAV_ITEMS.findIndex((item) =>
      item.path === "/" ? pathname === "/" : pathname.startsWith(item.path),
    );
    if (pathname.startsWith("/dashboard")) {
      idx = NAV_ITEMS.length; // Dashboard is the last item in the mobile list
    }
    setActiveIndex(idx !== -1 ? idx : -1);
  }, [pathname]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleToggle = (e) => setIsExamActive(e.detail.active);
    window.addEventListener("toggleNav", handleToggle);
    return () => window.removeEventListener("toggleNav", handleToggle);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const isAuthPage = pathname === "/login" || pathname === "/signup";
  if (isExamActive || isAuthPage) return null;

  const dashboardRoutes = ["/dashboard", "/profile", "/tests", "/suggestions", "/results", "/admin"];
  const isDashboardRoute = dashboardRoutes.some(route => pathname.startsWith(route));

  const today = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });

  // ======= RENDER: LOGGED OUT (CLEAN LANDING) =======
  if (!user) {
    return (
      <div className="fixed top-8 left-0 w-full px-8 flex justify-between items-center z-100 max-w-7xl mx-auto -translate-x-1/2">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm cursor-pointer hover:shadow-md transition-all overflow-hidden border border-[#154D57]/20 group-hover:rotate-12">
            <img
              src="/logo.svg"
              alt="Logo"
              className="w-[70%] h-[70%] object-contain"
            />
          </div>
        </Link>
        <button 
          onClick={login}
          className="bg-[#154D57] px-8 py-3 rounded-full text-white font-black uppercase tracking-widest text-xs hover:bg-[#1a5f6b] shadow-xl shadow-[#154D57]/20 transition-all active:scale-95"
        >
          Login
        </button>
      </div>
    );
  }

  return (
    <>
      {/* ======= MOBILE TOP HEADER ======= */}
      {!isDashboardRoute && (
        <div className="md:hidden fixed top-0 left-0 w-full z-100 bg-white px-6 py-4 flex items-center border-b border-gray-100 shadow-sm transition-all duration-300">
        {/* Profile Pic (Left) */}
        <Link
          href="/dashboard"
          className="w-12 h-12 rounded-full overflow-hidden shadow-sm bg-gray-50 border border-gray-100 shrink-0"
        >
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-[#154D57] flex items-center justify-center text-[#FEFAF7]">
              <FiUser className="w-7 h-7" />
            </div>
          )}
        </Link>

        {/* Text Area (Centered) */}
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
          <h2 className="text-[#1A1A1A] text-lg font-extrabold tracking-tight leading-none mb-1 line-clamp-1">
            {user.displayName?.split(" ")[0] || "Student"}
          </h2>
          <p className="text-gray-400 text-xs font-medium tracking-tight">
            {today}
          </p>
        </div>

        {/* Notifications (Right) */}
        <button className="relative w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center text-[#154D57] bg-white shadow-sm transition-all hover:bg-gray-50 active:scale-90 shrink-0">
          <FiBell className="w-6 h-6 stroke-[1.5]" />
          <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white shadow-sm"></span>
        </button>
        </div>
      )}

      {/* ======= DESKTOP FLOATING NAVIGATION ======= */}
      <div className="hidden md:flex fixed top-8 left-0 w-full px-8 justify-center z-100 transition-all duration-500 animate-in fade-in slide-in-from-top-4">
        <div className="w-full max-w-6xl bg-[#FEFAF7]/80 backdrop-blur-md p-2 rounded-full flex items-center justify-between shadow-[0_20px_50px_rgba(21,77,87,0.1)] border border-[#154D57]/10 relative">
          {/* Left Side: Logo & Links */}
          <div className="flex items-center gap-6 pl-2">
            <div
              className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm cursor-pointer hover:shadow-md transition-all overflow-hidden border border-[#154D57]/20"
              onClick={() => router.push("/")}
            >
              <img
                src="/logo.svg"
                alt="Logo"
                className="w-[70%] h-[70%] object-contain"
              />
            </div>

            {/* Nav Links */}
            <div className="flex items-center gap-2 ml-2 pl-4 border-l border-[#154D57]/10">
              {NAV_ITEMS.map((item, index) => {
                const isActive = item.path === "/" ? pathname === "/" : pathname.startsWith(item.path);
                return (
                  <button
                    key={item.path + "-desktop"}
                    onClick={() => router.push(item.path)}
                    className={`font-bold text-base transition-all duration-300 px-6 py-2.5 rounded-full ${
                      isActive
                        ? "bg-[#154D57] text-white shadow-lg shadow-[#154D57]/20"
                        : "text-[#154D57]/70 hover:text-[#154D57] hover:bg-[#154D57]/5"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Side: Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="bg-[#154D57] pl-3 pr-5 py-2 rounded-full shadow-lg text-base font-bold text-[#FEFAF7] flex items-center gap-3 cursor-pointer hover:bg-[#1C2321] transition-colors group"
            >
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="Profile"
                  className="w-8 h-8 rounded-full border border-[#FEFAF7]/20 object-cover"
                />
              ) : (
                <div className="bg-[#FEFAF7] p-2 rounded-full text-[#154D57] group-hover:text-[#1A1A1B] transition-colors">
                  <FiUser className="w-4 h-4" />
                </div>
              )}
              <span>{user.displayName || "Student"}</span>
              <FiChevronDown
                className={`w-4 h-4 transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-4 w-56 bg-[#FEFAF7] rounded-2xl shadow-xl border border-[#154D57]/20 overflow-hidden py-2 animate-in fade-in slide-in-from-top-4 duration-200">
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    router.push("/dashboard");
                  }}
                  className="w-full text-left px-5 py-3 hover:bg-[#1C2321]/5 text-[#154D57] font-bold flex items-center gap-3 transition"
                >
                  <FiLayout className="w-5 h-5 text-[#154D57]" />
                  Dashboard
                </button>
                <div className="h-px bg-[#154D57]/10 my-1 w-full relative"></div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-5 py-3 hover:bg-[#1C2321]/5 text-red-500 font-bold flex items-center gap-3 transition"
                >
                  <FiLogOut className="w-5 h-5" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ======= MOBILE NAVIGATION ======= */}
      <div className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-center">
        <div className="bg-transparent relative pb-5 px-6 pt-3 w-full max-w-[24rem]">
          <div className="relative bg-[#1C2321] h-14 w-full rounded-4xl flex items-center justify-around shadow-2xl overflow-visible border border-[#154D57]/20">
            {[
              ...NAV_ITEMS,
              {
                path: "/dashboard",
                label: "Dashboard",
                icon: <FiLayout className="w-5 h-5" />,
              },
            ].map((item, index) => {
              const isActive = index === activeIndex;

              return (
                <button
                  key={item.path + "-mobile"}
                  onClick={() => router.push(item.path)}
                  className="relative flex-1 flex flex-col items-center justify-center p-2 h-full outline-none group"
                >
                  <div
                    className={`absolute transition-all duration-300 ease-out flex items-center justify-center rounded-full
                      ${
                        isActive
                          ? "-translate-y-3 bg-[#FEFAF7] text-[#154D57] w-14 h-14 border-[5px] border-[#1C2321] shadow-2xl scale-110"
                          : "translate-y-0 bg-transparent text-[#FEFAF7]/40 w-12 h-12 border-0 group-hover:text-[#FEFAF7]"
                      }
                    `}
                  >
                    {item.icon}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
