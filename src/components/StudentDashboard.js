"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiBookOpen, FiActivity, FiUser, FiChevronDown, FiArrowRight, FiSearch, FiCheckSquare, FiLoader } from 'react-icons/fi';

export default function StudentDashboard({ user }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/results/dashboard/${user.uid}`);
        const result = await res.json();
        setData(result);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.uid) {
      fetchDashboardData();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-[#154D57]">
        <FiLoader className="w-10 h-10 animate-spin mb-4" />
        <p className="font-bold">Loading your progress...</p>
      </div>
    );
  }

  // Fallback for new users
  const stats = data?.stats || { totalTests: 0, averageScore: 0 };
  const subjectStats = data?.subjectStats || [];
  const recentTests = data?.recentTests || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
      {/* --- Performance Summary (Left Column) --- */}
      <div className="lg:col-span-1 space-y-6 md:space-y-8">
        <div className="bg-[#154D57] rounded-4xl md:rounded-[2.5rem] p-6 md:p-10 text-white relative overflow-hidden shadow-2xl h-full flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
          <div>
            <div className="w-14 h-14 md:w-16 md:h-16 bg-white/10 rounded-2xl md:rounded-3xl flex items-center justify-center mb-6 md:mb-8 backdrop-blur-md">
              <FiCheckSquare className="w-7 h-7 md:w-8 md:h-8" />
            </div>
            <h2 className="text-2xl md:text-3xl font-black mb-3 md:mb-4 leading-tight">Your Academic Excellence</h2>
            <p className="text-white/60 text-xs md:text-sm font-medium leading-relaxed mb-8 md:mb-10 max-w-[200px]">Track your progress and prep for the next big exam.</p>
          </div>
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            <div className="bg-white/5 rounded-2xl md:rounded-3xl p-4 md:p-5 backdrop-blur-sm border border-white/10">
              <h4 className="text-xl md:text-2xl font-black mb-0.5 md:mb-1">{stats.totalTests}</h4>
              <p className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-white/40">Tests Taken</p>
            </div>
            <div className="bg-white/5 rounded-2xl md:rounded-3xl p-4 md:p-5 backdrop-blur-sm border border-white/10">
              <h4 className="text-xl md:text-2xl font-black mb-0.5 md:mb-1">{stats.averageScore}%</h4>
              <p className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-white/40">Avg. Score</p>
            </div>
          </div>
        </div>
      </div>

      {/* --- Middle Content (Subject Proficiency) --- */}
      <div className="lg:col-span-1 bg-white rounded-4xl md:rounded-[2.5rem] p-6 md:p-10 border border-[#154D57]/5 shadow-sm flex flex-col items-center justify-center">
        <div className="w-full mb-6">
          <h3 className="text-lg md:text-xl font-black text-[#154D57]">Proficiency Graph</h3>
          <p className="text-gray-400 text-[10px] md:text-xs font-bold">Subject-wise strength</p>
        </div>
        <div className="relative w-full aspect-square flex items-center justify-center p-2">
          {subjectStats.length > 0 ? (
            <svg viewBox="-15 -15 130 130" className="w-full h-full max-w-[280px] md:max-w-[320px]">
              {/* Background Concentric Polygons (Grid) */}
              {[1.0, 0.75, 0.5, 0.25].map((factor, idx) => (
                <polygon
                  key={idx}
                  points={subjectStats.map((_, i) => {
                    const angle = (i * 2 * Math.PI) / Math.max(subjectStats.length, 3);
                    const radius = 50 * factor;
                    const x = 50 + radius * Math.sin(angle);
                    const y = 50 - radius * Math.cos(angle);
                    return `${x},${y}`;
                  }).join(' ')}
                  fill="none"
                  stroke="#154D57"
                  strokeWidth="0.5"
                  strokeOpacity={0.15}
                />
              ))}

              {/* Radial Lines (Spokes) */}
              {subjectStats.map((_, i) => {
                const angle = (i * 2 * Math.PI) / Math.max(subjectStats.length, 3);
                const x = 50 + 50 * Math.sin(angle);
                const y = 50 - 50 * Math.cos(angle);
                return (
                  <line key={i} x1="50" y1="50" x2={x} y2={y} stroke="#154D57" strokeWidth="0.5" strokeOpacity={0.1} />
                );
              })}

              {/* Data Polygon */}
              <polygon 
                points={subjectStats.map((s, i) => {
                  const angle = (i * 2 * Math.PI) / Math.max(subjectStats.length, 3);
                  const radius = Math.max((s.score / 100) * 50, 3); // Minimum radius for visibility
                  const x = 50 + radius * Math.sin(angle);
                  const y = 50 - radius * Math.cos(angle);
                  return `${x},${y}`;
                }).join(' ')} 
                fill="#154D57" fillOpacity="0.2" stroke="#154D57" strokeWidth="2" 
              />

              {/* Labels */}
              {subjectStats.map((s, i) => {
                  const angle = (i * 2 * Math.PI) / Math.max(subjectStats.length, 3);
                  const radius = 62; // Distance from center for text
                  const x = 50 + radius * Math.sin(angle);
                  const y = 50 - radius * Math.cos(angle);
                  
                  return (
                    <text 
                      key={i} 
                      x={x} 
                      y={y} 
                      textAnchor="middle" 
                      fontSize="5" 
                      fontWeight="900" 
                      fill="#154D57"
                      dominantBaseline="middle"
                    >
                      <tspan x={x} dy="-0.2em">{s.subject.split(' ')[0]}</tspan>
                      <tspan x={x} dy="1.2em" fillOpacity="0.5" fontSize="4">{s.score}%</tspan>
                    </text>
                  );
              })}
            </svg>
          ) : (
            <div className="text-center p-10 bg-gray-50 rounded-full w-40 h-40 flex items-center justify-center border-2 border-dashed border-[#154D57]/10">
              <p className="text-[10px] font-bold text-gray-400">Not enough data for graph</p>
            </div>
          )}
        </div>
      </div>

      {/* --- Right Column (Subject Scores) --- */}
      <div className="lg:col-span-1 bg-white rounded-4xl md:rounded-[2.5rem] p-6 md:p-10 border border-[#154D57]/5 shadow-sm flex flex-col">
        <h3 className="text-lg md:text-xl font-black text-[#154D57] mb-6 md:mb-8">Subject Score</h3>
        <div className="space-y-6 md:space-y-8">
          {subjectStats.length > 0 ? subjectStats.slice(0, 5).map((item, i) => (
            <div key={i}>
               <div className="flex justify-between items-end mb-2">
                  <h4 className="text-xs md:text-sm font-black text-[#154D57]">{item.subject}</h4>
                  <span className="text-[10px] md:text-xs font-black text-[#154D57]/40">{item.score}%</span>
               </div>
               <div className="h-1.5 md:h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full ${item.score > 80 ? 'bg-emerald-500' : item.score > 50 ? 'bg-amber-500' : 'bg-rose-500'} rounded-full transition-all duration-1000`} style={{ width: `${item.score}%` }}></div>
               </div>
            </div>
          )) : (
            <p className="text-center py-10 text-gray-300 font-bold">Assessments needed</p>
          )}
        </div>
      </div>

      {/* --- Recent Tests taken --- */}
      <div className="lg:col-span-2 bg-white rounded-4xl md:rounded-[2.5rem] p-6 md:p-10 border border-[#154D57]/5 shadow-sm">
        <div className="flex justify-between items-center mb-8 md:mb-10">
          <h3 className="text-lg md:text-xl font-black text-[#154D57]">Recent Exam Progress</h3>
        </div>
        <div className="space-y-3 md:space-y-4">
           {recentTests.length > 0 ? recentTests.map((test, i) => (
             <div key={i} className="flex items-center justify-between p-4 md:p-6 rounded-2xl md:rounded-3xl bg-gray-50/50 border border-gray-100 group hover:border-[#154D57]/20 transition-all">
                <div className="flex items-center gap-3 md:gap-5">
                   <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white flex items-center justify-center text-[#154D57] shadow-sm">
                      <FiActivity className="w-5 h-5 md:w-6 md:h-6" />
                   </div>
                   <div>
                      <h4 className="text-xs md:text-sm font-black text-[#154D57]">{test.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-[8px] md:text-[10px] font-black uppercase text-gray-400 tracking-widest">{test.date}</p>
                        <span className="text-[7px] md:text-[8px] font-black px-1.5 py-0.5 rounded-sm bg-gray-100 text-gray-500 border border-gray-200">{test.version}</span>
                      </div>
                   </div>
                </div>
                <div className="text-right">
                   <p className="text-xs md:text-sm font-black text-[#154D57]">{test.score}</p>
                </div>
             </div>
           )) : (
             <div className="p-10 text-center border-2 border-dashed border-gray-100 rounded-3xl">
                <p className="text-gray-400 font-bold">Your recent performance will appear here</p>
             </div>
           )}
        </div>
      </div>

      {/* --- Quick Learning Card --- */}
      <div className="lg:col-span-1 bg-white rounded-4xl md:rounded-[2.5rem] overflow-hidden border border-[#154D57]/5 shadow-sm flex flex-col">
        <div className="relative h-40 md:h-48 group">
          <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop" alt="Learning" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
          <div className="absolute inset-0 bg-linear-to-t from-[#154D57]/60 to-transparent"></div>
        </div>
        <div className="p-6 md:p-8">
          <h4 className="text-lg md:text-xl font-black text-[#154D57] mb-1 md:mb-2 leading-tight">Mastering MCQs</h4>
          <p className="text-gray-400 text-[10px] md:text-xs font-medium leading-relaxed mb-5 md:mb-6">Learn the shortcuts and logical patterns to solve MCQs faster and more accurately.</p>
          <button className="w-full py-3 md:py-4 bg-[#154D57]/5 hover:bg-[#154D57] hover:text-white text-[#154D57] rounded-xl md:rounded-2xl font-black text-xs md:text-sm transition-all group">
            Start Learning <FiArrowRight className="inline ml-1 md:ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
