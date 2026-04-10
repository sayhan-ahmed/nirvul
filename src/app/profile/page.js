"use client";

import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "@/components/DashboardLayout";
import { useState, useEffect } from "react";
import { 
  FiUser, FiMail, FiCalendar, FiAward, FiBook, 
  FiTrendingUp, FiChevronRight, FiMapPin, FiBriefcase,
  FiHome, FiSmartphone, FiMessageSquare, FiActivity, FiSearch
} from "react-icons/fi";
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis
} from 'recharts';

export default function ProfilePage() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchProfileData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/results/dashboard/${user.uid}`);
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
  const radarData = subjectStats?.map(s => ({
    subject: s.subject,
    A: s.score,
    fullMark: 100,
  })) || [
    { subject: 'Math', A: 80, fullMark: 100 },
    { subject: 'English', A: 65, fullMark: 100 },
    { subject: 'Science', A: 90, fullMark: 100 },
    { subject: 'History', A: 70, fullMark: 100 },
    { subject: 'Art', A: 85, fullMark: 100 },
  ];

  const pieData = [
    { name: 'Online', value: 70, color: '#154D57' },
    { name: 'Self', value: 30, color: '#FF7F50' },
  ];

  return (
    <DashboardLayout>
      <div className="flex flex-col lg:flex-row gap-8 pb-10 animate-in fade-in duration-1000">
        
        {/* --- LEFT & CENTER CONTENT (Grid of Cards) --- */}
        <div className="flex-1 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* 1. Soft Skill (Radar Chart) */}
                <div className="bg-white rounded-4xl p-8 border border-gray-100 shadow-sm flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-black text-[#154D57]">Soft Skill</h3>
                        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-300">
                            <FiActivity className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                <PolarGrid stroke="#e5e7eb" />
                                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fontWeight: 800, fill: '#6b7280' }} />
                                <Radar
                                    name="Score"
                                    dataKey="A"
                                    stroke="#154D57"
                                    fill="#154D57"
                                    fillOpacity={0.4}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 2. Bidang Minat (Horizontal Progress) */}
                <div className="bg-white rounded-4xl p-8 border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-black text-[#154D57]">Bidang Minat</h3>
                        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-300">
                            <FiTrendingUp className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="space-y-6">
                        {subjectStats?.map((s, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between text-[10px] font-black uppercase text-gray-500">
                                    <span>{s.subject}</span>
                                    <span>{s.score}%</span>
                                </div>
                                <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full transition-all duration-1000 ${i % 2 === 0 ? 'bg-[#154D57]' : 'bg-[#154D57]/40'}`} 
                                        style={{ width: `${s.score}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 3. Waktu Belajar (Donut) */}
                <div className="bg-white rounded-4xl p-8 border border-gray-100 shadow-sm relative overflow-hidden">
                    <h3 className="font-black text-[#154D57] mb-6">Waktu Belajar</h3>
                    <div className="h-48 flex items-center justify-center relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={70}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <p className="text-[10px] font-black text-gray-400 uppercase">Total</p>
                            <h4 className="text-xl font-black text-[#154D57]">{stats?.totalTests * 2 || 0} jam</h4>
                        </div>
                    </div>
                    <div className="flex justify-center gap-6 mt-4">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-[#154D57]"></div>
                            <span className="text-[10px] font-black uppercase text-gray-400">Online</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-[#FF7F50]"></div>
                            <span className="text-[10px] font-black uppercase text-gray-400">Offline</span>
                        </div>
                    </div>
                </div>

                {/* 4. Sedang Berlangsung (Active Tests) */}
                <div className="bg-white rounded-4xl p-8 border border-gray-100 shadow-sm overflow-hidden">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-black text-[#154D57]">Sedang Berlangsung</h3>
                        <span className="text-[10px] font-black text-gray-300">6 kursus aktif</span>
                    </div>
                    <div className="space-y-4">
                        {allTests?.slice(0, 3).map((test, i) => (
                            <div key={i} className="flex items-center gap-4 p-3 rounded-2xl border border-gray-50 hover:bg-gray-50 transition-all group">
                                <div className={`w-8 h-12 rounded-lg bg-current ${i % 2 === 0 ? 'text-[#154D57]' : 'text-[#FF7F50]'} opacity-20`}></div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-xs font-black text-[#154D57] truncate">{test.name}</h4>
                                    <p className="text-[8px] font-bold text-gray-400">{test.date}</p>
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
                        <h3 className="font-black text-[#154D57] mb-6">Riwayat Pengajar</h3>
                        <div className="flex flex-wrap gap-4">
                            {[1,2,3,4].map(i => (
                                <div key={i} className="flex flex-col items-center gap-1">
                                    <div className="w-12 h-12 rounded-2xl bg-gray-100 overflow-hidden border-2 border-white shadow-sm ring-1 ring-gray-100">
                                        <img src={`https://i.pravatar.cc/150?u=${i+20}`} alt="teacher" className="w-full h-full object-cover" />
                                    </div>
                                    <span className="text-[9px] font-bold text-gray-400">Sir {i}</span>
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
                                <div key={i} className="w-8 h-8 rounded-lg bg-[#154D57]/5 flex items-center justify-center text-[16px] border border-gray-50 hover:scale-110 transition-transform cursor-help grayscale hover:grayscale-0" title={ach.title}>
                                    {ach.icon}
                                </div>
                             ))}
                             <div className="w-8 h-8 rounded-lg border border-dashed border-gray-200 flex items-center justify-center text-gray-200 text-xs">?</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* --- RIGHT SIDEBAR (Identity) --- */}
        <div className="w-full lg:w-80 space-y-8">
            {/* Identity Card */}
            <div className="bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-xl p-8 text-center space-y-6">
                <div className="relative inline-block">
                    <div className="w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-[#154D57]/5 overflow-hidden mx-auto">
                        <img 
                            src={user.photoURL || `https://i.pravatar.cc/150?u=${user.uid}`} 
                            alt={user.displayName} 
                            className="w-full h-full object-cover" 
                        />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-[#154D57] text-white rounded-xl flex items-center justify-center border-4 border-white">
                        <FiStar className="w-4 h-4" />
                    </div>
                </div>

                <div>
                    <h2 className="text-xl font-black text-[#154D57]">{user.displayName}</h2>
                    <p className="text-xs font-bold text-gray-400">{user.email}</p>
                </div>

                <div className="pt-4 space-y-4 text-left">
                    <div className="flex items-center gap-4 text-xs font-bold text-[#154D57]">
                        <div className="w-8 h-8 rounded-xl bg-[#154D57]/5 text-[#154D57] flex items-center justify-center">
                            <FiCalendar className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[8px] uppercase text-gray-400 tracking-widest">Joined Date</span>
                            <span>{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-bold text-[#154D57]">
                        <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                            <FiBriefcase className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[8px] uppercase text-gray-400 tracking-widest">Education</span>
                            <span className={!user.institution ? 'text-gray-300 italic' : ''}>
                                {user.institution || 'No institution set'}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-bold text-[#154D57]">
                        <div className="w-8 h-8 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
                            <FiMapPin className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[8px] uppercase text-gray-400 tracking-widest">Location</span>
                            <span className={!user.location ? 'text-gray-300 italic' : ''}>
                                {user.location || 'Location not specified'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* About Me */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm space-y-4">
                <h3 className="font-black text-[#154D57]">Tentang Saya</h3>
                <p className="text-[11px] font-bold leading-relaxed text-gray-400">
                    Hi! Saya {user.displayName?.split(' ')[0]}. Saya খুব পছন্দ করি নতুন নতুন বিষয় শিখতে এবং আমার জ্ঞান বৃদ্ধি করতে। এই প্ল্যাটফর্মটি আমাকে আমার দক্ষতার মান যাচাই করতে সাহায্য করছে।
                </p>
            </div>

            {/* Guardian Card */}
            <div className="bg-[#154D57] rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-all"></div>
                <h3 className="font-black text-sm mb-6">Wali Murid</h3>
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 overflow-hidden">
                        <img src="https://i.pravatar.cc/150?u=guardian" alt="guardian" />
                    </div>
                    <div>
                        <h4 className="text-xs font-black">Ny. Adriana Ramha</h4>
                        <p className="text-[9px] text-white/40 font-bold">@rahmaadr</p>
                    </div>
                </div>
            </div>
        </div>

      </div>
    </DashboardLayout>
  );
}

const FiStar = ({ className }) => (
  <svg className={className} stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
);
