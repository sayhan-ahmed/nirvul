"use client";

import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import DashboardLayout from "@/components/DashboardLayout";
import { useState, useEffect } from "react";
import {
  FiUser,
  FiMail,
  FiCalendar,
  FiAward,
  FiBook,
  FiTrendingUp,
  FiChevronRight,
  FiMapPin,
  FiBriefcase,
  FiHome,
  FiSmartphone,
  FiMessageSquare,
  FiActivity,
  FiSearch,
  FiCheckCircle,
  FiXCircle,
  FiTarget,
  FiZap,
  FiHelpCircle,
  FiClipboard,
  FiFileText,
} from "react-icons/fi";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const { showToast } = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [profileForm, setProfileForm] = useState({
    institution: "",
    location: "",
    bio: "",
    guardianName: "",
    guardianContact: "",
  });

  useEffect(() => {
    if (!user) return;

    const fetchProfileData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/results/dashboard/${user.uid}`,
        );
        if (response.ok) {
          const result = await response.json();
          setData(result);
        }
      } catch (err) {
        console.error("Error fetching profile data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [user]);

  // Sync form with user data
  useEffect(() => {
    if (user) {
      setProfileForm({
        institution: user.institution || "",
        location: user.location || "",
        bio: user.bio || "",
        guardianName: user.guardianName || "",
        guardianContact: user.guardianContact || "",
      });
    }
  }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${user.uid}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileForm),
      });

      if (!response.ok) throw new Error("Update failed");

      // Refresh global user state to sync other components (like sidebar)
      await refreshUser();
      
      setSaved(true);
      showToast("Profile updated successfully!", "success");
      
      // Clear form fields as requested
      setProfileForm({
        institution: "",
        location: "",
        bio: "",
        guardianName: "",
        guardianContact: "",
      });

      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error("Failed to update profile:", err);
      showToast("Failed to update profile. Please try again.", "error");
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  const { stats, achievements, subjectStats, allTests } = data || {};

  // Mock data for charts if API data is thin
  const radarData = subjectStats?.map((s) => ({
    subject: s.subject,
    A: s.score,
    fullMark: 100,
  })) || [
    { subject: "Math", A: 80, fullMark: 100 },
    { subject: "English", A: 65, fullMark: 100 },
    { subject: "Science", A: 90, fullMark: 100 },
    { subject: "History", A: 70, fullMark: 100 },
    { subject: "Art", A: 85, fullMark: 100 },
  ];

  const pieData = [
    { name: "Online", value: 70, color: "#154D57" },
    { name: "Self", value: 30, color: "#FF7F50" },
  ];

  return (
    <DashboardLayout>
      {/* Main Layout */}
      <div className="flex flex-col lg:flex-row lg:items-stretch gap-8 pb-10 animate-in fade-in duration-1000">
        {/* Left: Cards + Form */}
        <div className="flex-1 flex flex-col gap-8 order-2 lg:order-1">
          {/* Top 2 cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 1. Learning Streak (Restored Layout) */}
            <div className="bg-white border border-slate-100 border-b-4 rounded-4xl p-6 shadow-sm flex flex-col justify-center min-h-[160px] transition-all duration-300">
              <div className="w-full flex justify-between items-center mb-6">
                <h3 className="text-sm font-extrabold text-[#154D57] uppercase tracking-wide leading-none">
                  Weekly Activity
                </h3>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-orange-50 rounded-full border border-orange-100/30">
                  <span className="text-[10px] font-black text-orange-600 uppercase tracking-tight">
                    <span className="text-xs mr-0.5">🔥</span>Streak:{" "}
                    {data?.stats?.currentStreak || 0}{" "}
                    {data?.stats?.currentStreak === 1 ? "Day" : "Days"}
                  </span>
                </div>
              </div>

              <div className="w-full flex justify-between items-center gap-2 px-1">
                {data?.streak?.map((day, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center gap-3 flex-1"
                  >
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all shadow-sm ${day.active ? "bg-[#154D57] text-white shadow-[#154D57]/20" : "bg-slate-50 text-slate-300 border border-slate-100/50 hover:bg-white"}`}
                    >
                      <FiBook className="w-4 h-4 stroke-2" />
                    </div>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-tighter ${day.active ? "text-[#154D57]" : "text-slate-300"}`}
                    >
                      {day.day}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            {/* 2. Points & XP Summary */}
            <div className="relative bg-white border border-slate-100 border-b-4 rounded-4xl p-7 flex flex-col shadow-sm transition-all duration-300 overflow-hidden">
              {/* Coming Soon Ribbon */}
              <div className="absolute top-5 -right-8 w-32 rotate-45 bg-linear-to-r from-amber-400 to-orange-400 py-1 flex items-center justify-center shadow-md">
                <span className="text-[8px] font-black text-white uppercase tracking-[0.15em]">Coming Soon</span>
              </div>

              <div className="flex items-center gap-6 mb-6 opacity-60">
                {/* Medal Icon */}
                <div className="relative">
                  <div className="w-16 h-16 rounded-[1.25rem] bg-orange-50 flex items-center justify-center text-4xl shadow-inner border border-orange-100/50">
                    🏅
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100">
                    <FiAward className="w-3 h-3 text-orange-500" />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-3xl font-black text-amber-600 tracking-tighter">2400 XP</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold text-amber-500/70 uppercase tracking-widest">Point</span>
                    <span className="text-[9px] font-black text-slate-300 bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded-md uppercase tracking-wider">Locked</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons — Disabled */}
              <div className="flex gap-3">
                <button disabled className="flex-1 py-2 px-4 rounded-xl border-2 border-slate-100 text-[10px] font-black text-slate-300 cursor-not-allowed uppercase tracking-wider select-none">
                  Redeem
                </button>
                <button disabled className="flex-2 py-2 px-6 rounded-xl bg-linear-to-r from-amber-400/40 to-orange-400/40 text-[10px] font-black text-white/70 cursor-not-allowed uppercase tracking-wider select-none">
                  Collect Point
                </button>
              </div>
            </div>
          </div>

          {/* Edit Profile Form */}
          <form
            onSubmit={handleProfileUpdate}
            className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-xl flex flex-col flex-1"
          >
            {/* Form Header */}
            <div className="px-6 pt-6 pb-4 border-b border-slate-100">
              <h2 className="text-2xl font-black text-[#154D57] tracking-tight">Edit Profile</h2>
              <p className="text-sm font-bold text-slate-400 mt-1">Update your personal information</p>
            </div>

            {/* Form Fields */}
            <div className="px-6 py-5 space-y-5 flex-1">

              {/* Institution + Location side by side */}
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-xs font-extrabold text-[#154D57]/60 uppercase tracking-widest">
                    <FiBriefcase className="w-3.5 h-3.5" /> Institution
                  </label>
                  <input
                    type="text"
                    value={profileForm.institution}
                    onChange={(e) => setProfileForm({ ...profileForm, institution: e.target.value })}
                    placeholder="School or college"
                    className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50/50 text-sm font-bold text-[#154D57] placeholder:text-slate-300 focus:outline-none focus:border-[#154D57]/30 focus:bg-white transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-xs font-extrabold text-[#154D57]/60 uppercase tracking-widest">
                    <FiMapPin className="w-3.5 h-3.5" /> Location
                  </label>
                  <input
                    type="text"
                    value={profileForm.location}
                    onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                    placeholder="City, Country"
                    className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50/50 text-sm font-bold text-[#154D57] placeholder:text-slate-300 focus:outline-none focus:border-[#154D57]/30 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-xs font-extrabold text-[#154D57]/60 uppercase tracking-widest">
                  <FiMessageSquare className="w-3.5 h-3.5" /> About Me
                </label>
                <textarea
                  value={profileForm.bio}
                  onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                  placeholder="Write a short bio..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50/50 text-sm font-bold text-[#154D57] placeholder:text-slate-300 focus:outline-none focus:border-[#154D57]/30 focus:bg-white transition-all resize-none"
                />
              </div>

              {/* Guardian section */}
              <div className="pt-4 border-t border-slate-100">
                <p className="text-xs font-extrabold text-[#154D57]/60 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <FiUser className="w-3.5 h-3.5" /> Guardian Info
                </p>
                <div className="grid grid-cols-2 gap-5">
                  <input
                    type="text"
                    value={profileForm.guardianName}
                    onChange={(e) => setProfileForm({ ...profileForm, guardianName: e.target.value })}
                    placeholder="Guardian's name"
                    className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50/50 text-sm font-bold text-[#154D57] placeholder:text-slate-300 focus:outline-none focus:border-[#154D57]/30 focus:bg-white transition-all"
                  />
                  <input
                    type="text"
                    value={profileForm.guardianContact}
                    onChange={(e) => setProfileForm({ ...profileForm, guardianContact: e.target.value.replace(/[^0-9]/g, "") })}
                    placeholder="Phone number"
                    className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50/50 text-sm font-bold text-[#154D57] placeholder:text-slate-300 focus:outline-none focus:border-[#154D57]/30 focus:bg-white transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="px-6 pb-6 mt-auto">
              <button
                type="submit"
                disabled={saving}
                className={`w-full py-4 rounded-xl text-xs font-black uppercase tracking-[0.2em] transition-all duration-300 ${
                  saved
                    ? "bg-green-500 text-white shadow-lg shadow-green-100"
                    : "bg-[#154D57] text-white hover:bg-[#1a5f6b] shadow-lg shadow-[#154D57]/20 active:scale-95"
                } disabled:opacity-60 disabled:cursor-not-allowed`}
              >
                {saving ? "Saving..." : saved ? "✓ Saved Successfully" : "Save Changes"}
              </button>
            </div>
          </form>
        </div>

        {/* Right Sidebar — Profile Card */}
        <div className="w-full lg:w-80 order-1 lg:order-2">
          <div className="bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-xl flex flex-col h-full">
            {/* 1. Identity Header */}
            <div className="p-8 text-center space-y-6">
              <div className="relative inline-block">
                <div className="w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-[#154D57]/5 overflow-hidden mx-auto">
                  <img
                    src={
                      user.photoURL || `https://i.pravatar.cc/150?u=${user.uid}`
                    }
                    alt={user.displayName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-[#154D57] text-white rounded-xl flex items-center justify-center border-4 border-white">
                  <FiAward className="w-4 h-4" />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-black text-[#154D57]">
                  {user.displayName}
                </h2>
                <p className="text-xs font-bold text-gray-400">{user.email}</p>
              </div>
            </div>

            {/* Divider Line */}
            <div className="px-8">
              <div className="h-px bg-gray-200 w-full"></div>
            </div>

            {/* 2. Detailed Info List */}
            <div className="p-5 space-y-5">
              <div className="flex items-center gap-4 text-sm font-bold text-[#154D57]">
                <div className="w-8 h-8 rounded-xl bg-[#154D57]/5 text-[#154D57] flex items-center justify-center">
                  <FiCalendar className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase text-gray-400 tracking-widest">
                    Joined Date
                  </span>
                  <span>
                    {new Date().toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm font-bold text-[#154D57]">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <FiBriefcase className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase text-gray-400 tracking-widest">
                    Education
                  </span>
                  <span
                    className={
                      !user.institution
                        ? "text-gray-300 italic font-medium"
                        : ""
                    }
                  >
                    {user.institution || "No institution set"}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm font-bold text-[#154D57]">
                <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                  <FiMapPin className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase text-gray-400 tracking-widest">
                    Location
                  </span>
                  <span
                    className={
                      !user.location ? "text-gray-300 italic font-medium" : ""
                    }
                  >
                    {user.location || "Location not specified"}
                  </span>
                </div>
              </div>
            </div>

            {/* Divider Line */}
            <div className="px-8">
              <div className="h-px bg-gray-200 w-full"></div>
            </div>

            {/* 3. About Me Section */}
            <div className="p-8 space-y-1">
              <h3 className="font-black text-[#154D57] text-sm uppercase tracking-wider">
                About Me
              </h3>
              <p
                className={`text-[13px] font-bold leading-relaxed ${!user.bio ? "text-gray-300" : "text-gray-400"}`}
              >
                {user.bio ||
                  `Hi! I'm ${user.displayName?.split(" ")[0]}. I haven't added a bio yet, but I'm excited to share my journey with you soon!`}
              </p>
            </div>

            {/* 4. Guardian Info */}
            <div className="mt-auto bg-gray-50 p-8 border-t border-gray-100 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#154D57]/5 flex items-center justify-center text-[#154D57] shadow-sm border border-gray-100 italic">
                <FiUser className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[11px] text-gray-400 font-extrabold uppercase tracking-widest leading-none mb-1">
                  Guardian
                </p>
                <h4
                  className={`text-md font-black ${!user.guardianName ? "text-gray-300" : "text-[#154D57]"}`}
                >
                  {user.guardianName || "Guardian not added"}
                </h4>
                <p className="text-[10px] text-gray-400 font-bold">
                  {user.guardianContact || "Contact not specified"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

const FiStar = ({ className }) => (
  <svg
    className={className}
    stroke="currentColor"
    fill="none"
    strokeWidth="2"
    viewBox="0 0 24 24"
    strokeLinecap="round"
    strokeLinejoin="round"
    height="1em"
    width="1em"
    xmlns="http://www.w3.org/2000/svg"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);
