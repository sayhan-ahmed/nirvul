"use client";

import { useAuth } from "@/context/AuthContext";
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
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

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
      <div className="flex flex-col lg:flex-row gap-8 pb-10 animate-in fade-in duration-1000">
        {/* --- LEFT & CENTER CONTENT (Grid of Cards) --- */}
        <div className="flex-1 space-y-8 order-2 lg:order-1">
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

            {/* 3. Attempt Analysis (Ultra-Professional) */}
            <div className="bg-white border border-slate-100 border-b-4 rounded-4xl p-7 shadow-sm flex flex-col hover:border-[#154D57]/20 transition-all duration-300">
              {/* Header Section */}
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500 border border-indigo-100/50 shadow-sm">
                  <FiHelpCircle className="w-6 h-6 stroke-2" />
                </div>
                <div>
                  <h3 className="text-[10px] font-extrabold text-[#154D57]/50 uppercase tracking-[0.2em] mb-1">
                    Attempt Analysis
                  </h3>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-black text-[#154D57] tracking-tighter">
                      {data?.attemptAnalysis?.totalQuestionsAttempted || 0}
                    </span>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">
                      <span className="text-teal-600 font-black mr-1">
                        +{data?.attemptAnalysis?.last7DaysTrend || 0}
                      </span>{" "}
                      New
                    </p>
                  </div>
                </div>
              </div>

              {/* Stats Grid - 2x2 */}
              <div className="grid grid-cols-2 gap-3">
                {/* Correct */}
                <div className="bg-slate-50/50 border border-slate-100/50 px-4 py-3 rounded-2xl flex items-center justify-between group hover:bg-white hover:border-green-100 transition-all shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-green-50 text-green-500 flex items-center justify-center border border-green-100/50">
                      <FiCheckCircle className="w-4 h-4 stroke-2" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      Correct
                    </span>
                  </div>
                  <span className="text-[13px] font-black text-[#154D57]">
                    {data?.attemptAnalysis?.totalCorrect || 0}
                  </span>
                </div>

                {/* Incorrect */}
                <div className="bg-slate-50/50 border border-slate-100/50 px-4 py-3 rounded-2xl flex items-center justify-between group hover:bg-white hover:border-red-100 transition-all shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center border border-red-100/50">
                      <FiXCircle className="w-4 h-4 stroke-2" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      Incorrect
                    </span>
                  </div>
                  <span className="text-[13px] font-black text-[#154D57]">
                    {data?.attemptAnalysis?.totalIncorrect || 0}
                  </span>
                </div>

                {/* Accuracy */}
                <div className="bg-slate-50/50 border border-slate-100/50 px-4 py-3 rounded-2xl flex items-center justify-between group hover:bg-white hover:border-blue-100 transition-all shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100/50">
                      <FiTarget className="w-4 h-4 stroke-2" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      Accuracy
                    </span>
                  </div>
                  <span className="text-[13px] font-black text-[#154D57]">
                    {data?.attemptAnalysis?.accuracy || 0}%
                  </span>
                </div>

                {/* Speed */}
                <div className="bg-slate-50/50 border border-slate-100/50 px-4 py-3 rounded-2xl flex items-center justify-between group hover:bg-white hover:border-yellow-100 transition-all shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-yellow-50 text-yellow-500 flex items-center justify-center border border-yellow-100/50">
                      <FiZap className="w-4 h-4 stroke-2" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      Speed
                    </span>
                  </div>
                  <span className="text-[13px] font-black text-[#154D57]">
                    ---
                  </span>
                </div>
              </div>
            </div>

            {/* 4. Engagement Analysis (Ultra-Professional) */}
            <div className="bg-white border border-slate-100 border-b-4 rounded-4xl p-7 shadow-sm flex flex-col hover:border-[#154D57]/20 transition-all duration-300">
              <h3 className="text-[10px] font-extrabold text-[#154D57]/50 uppercase tracking-[0.2em] mb-8">
                Engagement
              </h3>
              <div className="h-44 flex items-center justify-center relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={65}
                      paddingAngle={8}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <p className="text-[9px] font-black text-gray-300 uppercase">
                    Total
                  </p>
                  <h4 className="text-xl font-black text-[#154D57]">
                    {stats?.totalTests * 2 || 0}h
                  </h4>
                </div>
              </div>
            </div>
          </div>

          {/* 5. Performance History (Ultra-Professional Table) */}
          <div className="bg-white border border-slate-100 border-b-4 rounded-[2.5rem] p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-[#154D57] tracking-tight">
                Performance History
              </h3>
              <button className="text-[10px] font-black text-slate-300 hover:text-[#154D57] transition-colors uppercase tracking-[0.2em]">
                Full Report
              </button>
            </div>
            <div className="overflow-x-auto ring-1 ring-slate-100 rounded-2xl overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50/80">
                  <tr>
                    <th className="px-6 py-5 text-[9px] font-extrabold text-[#154D57]/50 uppercase tracking-[0.2em]">
                      Assignment
                    </th>
                    <th className="px-6 py-5 text-[9px] font-extrabold text-[#154D57]/50 uppercase tracking-[0.2em]">
                      Date
                    </th>
                    <th className="px-6 py-5 text-[9px] font-extrabold text-[#154D57]/50 uppercase tracking-[0.2em] text-center">
                      Score
                    </th>
                    <th className="px-6 py-5 text-[9px] font-extrabold text-[#154D57]/50 uppercase tracking-[0.2em] text-right">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {allTests && allTests.length > 0 ? (
                    allTests.map((test, index) => (
                      <tr
                        key={index}
                        className="hover:bg-slate-50/40 transition-colors group"
                      >
                        <td className="px-6 py-5">
                          <div className="flex flex-col">
                            <span className="text-xs font-black text-[#154D57] group-hover:text-teal-600 transition-colors">
                              {test.name}
                            </span>
                            <span className="text-[9px] font-bold text-slate-300 uppercase tracking-wider mt-0.5">
                              {test.version}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className="text-xs font-bold text-slate-500">
                            {test.date}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-center">
                          <span className="inline-flex items-center px-3 py-1 rounded-lg bg-slate-100 text-[#154D57] text-[10px] font-black">
                            {test.score}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <span
                            className={`inline-flex items-center px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                              test.percentage >= 80
                                ? "bg-teal-50 text-teal-600 border border-teal-100/30"
                                : test.percentage >= 50
                                  ? "bg-indigo-50 text-indigo-600 border border-indigo-100/30"
                                  : "bg-rose-50 text-rose-600 border border-rose-100/30"
                            }`}
                          >
                            {test.percentage >= 80
                              ? "Mastery"
                              : test.percentage >= 50
                                ? "Passed"
                                : "Review"}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-20 text-center">
                        <div className="flex flex-col items-center opacity-10">
                          <FiClipboard className="w-10 h-10 mb-2" />
                          <p className="text-[10px] font-black uppercase tracking-widest">
                            No Records
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 6. Active Courses */}
            <div className="bg-white rounded-4xl p-8 border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-black text-[#154D57]">
                  Sedang Berlangsung
                </h3>
                <span className="text-[10px] font-black text-gray-300">
                  6 kursus aktif
                </span>
              </div>
              <div className="space-y-4">
                {allTests?.slice(0, 3).map((test, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 p-3 rounded-2xl border border-gray-50 hover:bg-gray-50 transition-all group"
                  >
                    <div
                      className={`w-8 h-12 rounded-lg bg-current ${i % 2 === 0 ? "text-[#154D57]" : "text-[#FF7F50]"} opacity-20`}
                    ></div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-black text-[#154D57] truncate">
                        {test.name}
                      </h4>
                      <p className="text-[8px] font-bold text-gray-400">
                        {test.date}
                      </p>
                    </div>
                    <FiChevronRight className="text-gray-200 group-hover:translate-x-1 transition-transform" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Row (Teacher & Reward) */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            <div className="md:col-span-3 bg-white rounded-4xl p-8 border border-gray-100 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="font-black text-[#154D57] mb-6">
                  Riwayat Pengajar
                </h3>
                <div className="flex flex-wrap gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex flex-col items-center gap-1">
                      <div className="w-12 h-12 rounded-2xl bg-gray-100 overflow-hidden border-2 border-white shadow-sm ring-1 ring-gray-100">
                        <img
                          src={`https://i.pravatar.cc/150?u=${i + 20}`}
                          alt="teacher"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-[9px] font-bold text-gray-400">
                        Sir {i}
                      </span>
                    </div>
                  ))}
                  <div className="w-12 h-12 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-100 flex items-center justify-center text-gray-300">
                    +
                  </div>
                </div>
              </div>
            </div>
            <div className="md:col-span-2 bg-white rounded-4xl p-8 border border-gray-100 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="font-black text-[#154D57] mb-6">Reward</h3>
                <div className="grid grid-cols-5 gap-2">
                  {achievements?.map((ach, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-lg bg-[#154D57]/5 flex items-center justify-center text-[16px] border border-gray-50 hover:scale-110 transition-transform cursor-help grayscale hover:grayscale-0"
                      title={ach.title}
                    >
                      {ach.icon}
                    </div>
                  ))}
                  <div className="w-8 h-8 rounded-lg border border-dashed border-gray-200 flex items-center justify-center text-gray-200 text-xs">
                    ?
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- RIGHT SIDEBAR (Unified Profile Card) --- */}
        <div className="w-full lg:w-80 order-1 lg:order-2">
          <div className="bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-xl flex flex-col">
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
