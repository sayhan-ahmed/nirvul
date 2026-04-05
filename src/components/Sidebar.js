"use client";

import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { 
  FiLayout, 
  FiBookOpen, 
  FiFileText, 
  FiUsers, 
  FiPieChart, 
  FiSettings, 
  FiMessageSquare,
  FiLogOut,
  FiArrowLeft
} from "react-icons/fi";
import Link from "next/link";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  if (!user) return null;

  const isAdmin = user.role === 'admin';

  const NAV_ITEMS = isAdmin ? [
    { id: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: <FiLayout className="w-5 h-5" /> },
    { id: 'questions', label: 'Questions', path: '/admin/questions', icon: <FiBookOpen className="w-5 h-5" /> },
    { id: 'subjects', label: 'Subjects', path: '/admin/subjects', icon: <FiFileText className="w-5 h-5" /> },
    { id: 'users', label: 'Members', path: '/admin/users', icon: <FiUsers className="w-5 h-5" /> },
    { id: 'stats', label: 'Statistics', path: '/admin/stats', icon: <FiPieChart className="w-5 h-5" /> },
    { id: 'settings', label: 'Settings', path: '/admin/settings', icon: <FiSettings className="w-5 h-5" /> },
  ] : [
    { id: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: <FiLayout className="w-5 h-5" /> },
    { id: 'tests', label: 'My Tests', path: '/tests', icon: <FiBookOpen className="w-5 h-5" /> },
    { id: 'results', label: 'Results', path: '/results', icon: <FiPieChart className="w-5 h-5" /> },
    { id: 'suggestions', label: 'Suggestions', path: '/suggestions', icon: <FiMessageSquare className="w-5 h-5" /> },
    { id: 'profile', label: 'My Profile', path: '/profile', icon: <FiSettings className="w-5 h-5" /> },
  ];

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <div className="fixed top-0 left-0 h-full w-64 bg-white border-r border-[#154D57]/5 flex flex-col py-8 px-6 z-50">
      {/* Brand Logo */}
      <div className="flex items-center gap-3 mb-12 px-2">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-[#154D57] rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
             <img src="/logo.svg" alt="Nirvul" className="w-[70%] h-[70%] brightness-20 invert" />
          </div>
          <span className="text-2xl font-black text-[#154D57] tracking-tighter">Nirvul</span>
        </Link>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 space-y-2">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.id}
              href={item.path}
              className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold transition-all group ${
                isActive 
                  ? 'bg-[#154D57] text-white shadow-xl shadow-[#154D57]/20 scale-105' 
                  : 'text-gray-400 hover:bg-[#154D57]/5 hover:text-[#154D57]'
              }`}
            >
              <div className={`${isActive ? 'text-white' : 'text-[#154D57]/40 group-hover:text-[#154D57]'}`}>
                {item.icon}
              </div>
              <span className="text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="mt-auto space-y-4">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold text-red-500 hover:bg-red-50 transition-all group"
        >
          <FiLogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm">Logout</span>
        </button>

        <div className="p-4 bg-gray-50 rounded-3xl border border-gray-100 mt-4">
          <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2">Support</p>
          <button className="flex items-center gap-2 text-xs font-bold text-[#154D57] hover:underline">
            Leave Feedback →
          </button>
        </div>
      </div>
    </div>
  );
}
