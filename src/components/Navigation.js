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
  const dropdownRef = useRef(null);

  useEffect(() => {
    const idx = NAV_ITEMS.findIndex((item) =>
      item.path === "/" ? pathname === "/" : pathname.startsWith(item.path),
    );
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

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const hideOnRoutes = ["/dashboard"];
  if (!user || hideOnRoutes.includes(pathname)) return null;

  const today = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });

  return (
    <>
      {/* ======= MOBILE TOP HEADER ======= */}
      <div className="md:hidden fixed top-0 left-0 w-full z-100 bg-white px-6 py-4 flex items-center border-b border-gray-100 shadow-sm">
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
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <h2 className="text-[#1A1A1A] text-xl font-extrabold tracking-tight leading-none mb-1.5">
            Hello, {user.displayName?.split(" ")[0] || "User"}
          </h2>
          <p className="text-gray-400 text-md font-medium tracking-tight">
            Today {today}.
          </p>
        </div>

        {/* Notifications (Right) */}
        <button className="relative w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center text-[#154D57] bg-white shadow-sm transition-all hover:bg-gray-50 active:scale-90 shrink-0">
          <FiBell className="w-6 h-6 stroke-[1.5]" />
          <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white shadow-sm"></span>
        </button>
      </div>
      {/* ======= DESKTOP NAVIGATION ======= */}
      <div className="hidden md:flex fixed top-8 left-0 w-full px-8 justify-center z-100">
        <div className="w-full max-w-6xl bg-[#FEFAF7] p-2 rounded-full flex items-center justify-between shadow-[0_15px_30px_rgba(21,77,87,0.06)] border border-[#154D57]/20 relative">
          {/* Left Side: Logo & Links */}
          <div className="flex items-center gap-6 pl-2">
            <div
              className="w-12 h-12 bg-[#FEFAF7] rounded-full flex items-center justify-center shadow-md cursor-pointer hover:shadow-lg transition-all overflow-hidden border-2 border-[#154D57]"
              onClick={() => router.push("/")}
            >
              <img
                src="/logo.svg"
                alt="Logo"
                className="w-[80%] h-[80%] object-contain"
              />
            </div>

            {/* Nav Links */}
            <div className="flex items-center gap-2 ml-2 pl-4 border-l border-[#154D57]/20">
              {NAV_ITEMS.map((item, index) => {
                const isActive = index === activeIndex;
                return (
                  <button
                    key={item.path + "-desktop"}
                    onClick={() => router.push(item.path)}
                    className={`font-bold text-base transition-all duration-300 px-6 py-2.5 rounded-full ${
                      isActive
                        ? "bg-[#154D57]/10 text-[#154D57]"
                        : "text-[#154D57]/80 hover:text-[#154D57] hover:bg-[#1C2321]/5"
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
          <div className="relative bg-[#1C2321] h-14 w-full rounded-4xl flex items-center justify-around shadow-2xl overflow-visible border border-[#154D57]/10">
            {[
              ...NAV_ITEMS,
              {
                path: "/dashboard",
                label: "Dashboard",
                icon: <FiLayout className="w-5 h-5" />,
              },
            ].map((item, index) => {
              const isActive =
                item.path === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.path);

              return (
                <button
                  key={item.path + "-mobile"}
                  onClick={() => router.push(item.path)}
                  className="relative z-20 flex-1 flex flex-col items-center justify-center p-2 h-full outline-none group"
                >
                  <div
                    className={`absolute transition-all duration-300 ease-out flex items-center justify-center rounded-full
                      ${
                        isActive
                          ? "-translate-y-5 bg-[#FEFAF7] text-[#154D57] w-14 h-14 border-[5px] border-[#FEFAF7] shadow-xl"
                          : "translate-y-0 bg-transparent text-[#FEFAF7]/50 w-12 h-12 border-0 group-hover:text-[#FEFAF7]"
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
