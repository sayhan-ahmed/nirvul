import Link from 'next/link';
import { FiBookOpen, FiActivity, FiUser, FiChevronDown, FiArrowRight, FiSearch, FiCheckSquare } from 'react-icons/fi';

export default function StudentDashboard({ user }) {
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
              <h4 className="text-xl md:text-2xl font-black mb-0.5 md:mb-1">12</h4>
              <p className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-white/40">Tests Taken</p>
            </div>
            <div className="bg-white/5 rounded-2xl md:rounded-3xl p-4 md:p-5 backdrop-blur-sm border border-white/10">
              <h4 className="text-xl md:text-2xl font-black mb-0.5 md:mb-1">82%</h4>
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
        <div className="relative w-full aspect-square flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-full max-w-[200px] md:max-w-[240px]">
            <polygon points="50,5 95,35 77,90 23,90 5,35" fill="none" stroke="#154D57" strokeWidth="0.5" strokeOpacity="0.1" />
            <polygon points="50,20 80,42 67,80 33,80 20,42" fill="none" stroke="#154D57" strokeWidth="0.5" strokeOpacity="0.1" />
            <polygon points="50,10 90,38 72,80 28,85 10,40" fill="#154D57" fillOpacity="0.1" stroke="#154D57" strokeWidth="1.5" />
            <text x="50" y="2" textAnchor="middle" fontSize="3" fontWeight="bold" fill="#154D57">Bangla: 92%</text>
            <text x="96" y="35" textAnchor="start" fontSize="3" fontWeight="bold" fill="#154D57">English: 78%</text>
            <text x="5" y="35" textAnchor="end" fontSize="3" fontWeight="bold" fill="#154D57">Math: 85%</text>
          </svg>
        </div>
      </div>

      {/* --- Right Column (Subject Scores) --- */}
      <div className="lg:col-span-1 bg-white rounded-4xl md:rounded-[2.5rem] p-6 md:p-10 border border-[#154D57]/5 shadow-sm">
        <h3 className="text-lg md:text-xl font-black text-[#154D57] mb-6 md:mb-8">Subject Score</h3>
        <div className="space-y-6 md:space-y-8">
          {[
            { subject: 'Bangla 2nd', score: 92, progress: 92, color: 'bg-emerald-500' },
            { subject: 'English 1st', score: 78, progress: 78, color: 'bg-indigo-500' },
            { subject: 'Mathematics', score: 85, progress: 85, color: 'bg-amber-500' },
            { subject: 'Physics', score: 65, progress: 65, color: 'bg-rose-500' },
          ].map((item, i) => (
            <div key={i}>
               <div className="flex justify-between items-end mb-2">
                  <h4 className="text-xs md:text-sm font-black text-[#154D57]">{item.subject}</h4>
                  <span className="text-[10px] md:text-xs font-black text-[#154D57]/40">{item.score}%</span>
               </div>
               <div className="h-1.5 md:h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color} rounded-full transition-all duration-1000`} style={{ width: `${item.progress}%` }}></div>
               </div>
            </div>
          ))}
        </div>
        <Link href="/results" className="mt-8 md:mt-10 block text-center py-3 md:py-4 border-2 border-[#154D57]/10 rounded-xl md:rounded-2xl text-[#154D57] font-black text-xs md:text-sm hover:bg-[#154D57] hover:text-white transition-all">
          View Detailed Analytics
        </Link>
      </div>

      {/* --- Recent Tests taken --- */}
      <div className="lg:col-span-2 bg-white rounded-4xl md:rounded-[2.5rem] p-6 md:p-10 border border-[#154D57]/5 shadow-sm">
        <div className="flex justify-between items-center mb-8 md:mb-10">
          <h3 className="text-lg md:text-xl font-black text-[#154D57]">Recent Exam Progress</h3>
          <Link href="/tests" className="text-[10px] md:text-xs font-black text-[#154D57] hover:underline">Start New Test →</Link>
        </div>
        <div className="space-y-3 md:space-y-4">
           {[
             { name: 'Bangla 2nd MCQ Model 01', date: 'Oct 24, 2023', score: '18/20', status: 'Passed' },
             { name: 'English 1st Grammar Quiz', date: 'Oct 22, 2023', score: '15/20', status: 'Passed' },
             { name: 'General Science Mock', date: 'Oct 20, 2023', score: '12/20', status: 'Improve' },
           ].map((test, i) => (
             <div key={i} className="flex items-center justify-between p-4 md:p-6 rounded-2xl md:rounded-3xl bg-gray-50/50 border border-gray-100 group hover:border-[#154D57]/20 transition-all">
                <div className="flex items-center gap-3 md:gap-5">
                   <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white flex items-center justify-center text-[#154D57] shadow-sm">
                      <FiActivity className="w-5 h-5 md:w-6 md:h-6" />
                   </div>
                   <div>
                      <h4 className="text-xs md:text-sm font-black text-[#154D57]">{test.name}</h4>
                      <p className="text-[8px] md:text-[10px] font-black uppercase text-gray-400 tracking-widest">{test.date}</p>
                   </div>
                </div>
                <div className="text-right">
                   <p className="text-xs md:text-sm font-black text-[#154D57]">{test.score}</p>
                   <span className={`text-[8px] md:text-[10px] font-black uppercase px-1.5 md:px-2 py-0.5 rounded-md ${test.status === 'Passed' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>{test.status}</span>
                </div>
             </div>
           ))}
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
