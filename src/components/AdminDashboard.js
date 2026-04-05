import {
  FiArrowRight,
  FiBookOpen,
  FiSearch,
  FiChevronDown,
} from "react-icons/fi";
import Link from "next/link";

export default function AdminDashboard({ user }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
      {/* --- Main Feature Card (Left Column) --- */}
      <div className="lg:col-span-1 space-y-6 md:space-y-8">
        <div className="bg-[#154D57] rounded-4xl md:rounded-[2.5rem] p-6 md:p-10 text-white relative overflow-hidden shadow-2xl h-full flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
          <div>
            <div className="w-14 h-14 md:w-16 md:h-16 bg-white/10 rounded-2xl md:rounded-3xl flex items-center justify-center mb-6 md:mb-8 backdrop-blur-md">
              <FiBookOpen className="w-7 h-7 md:w-8 md:h-8" />
            </div>
            <h2 className="text-2xl md:text-3xl font-black mb-3 md:mb-4 leading-tight">
              Information Class systems
            </h2>
            <p className="text-white/60 text-xs md:text-sm font-medium leading-relaxed mb-8 md:mb-10 max-w-[200px]">
              Integrate technology with business processes and focusing on
              databases.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            <div className="bg-white/5 rounded-2xl md:rounded-3xl p-4 md:p-5 backdrop-blur-sm border border-white/10">
              <h4 className="text-xl md:text-2xl font-black mb-0.5 md:mb-1">
                1.209
              </h4>
              <p className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-white/40">
                Active Students
              </p>
            </div>
            <div className="bg-white/5 rounded-2xl md:rounded-3xl p-4 md:p-5 backdrop-blur-sm border border-white/10">
              <h4 className="text-xl md:text-2xl font-black mb-0.5 md:mb-1">
                340
              </h4>
              <p className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-white/40">
                Active Courses
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* --- Middle Content (Skill Graph) --- */}
      <div className="lg:col-span-1 bg-white rounded-4xl md:rounded-[2.5rem] p-6 md:p-10 border border-[#154D57]/5 shadow-sm flex flex-col items-center justify-center">
        <div className="w-full mb-6">
          <h3 className="text-lg md:text-xl font-black text-[#154D57]">
            Skill Graph
          </h3>
          <p className="text-gray-400 text-[10px] md:text-xs font-bold">
            Latest performance overview
          </p>
        </div>
        <div className="relative w-full aspect-square flex items-center justify-center">
          <svg
            viewBox="0 0 100 100"
            className="w-full max-w-[200px] md:max-w-[240px]"
          >
            <polygon
              points="50,5 95,35 77,90 23,90 5,35"
              fill="none"
              stroke="#154D57"
              strokeWidth="0.5"
              strokeOpacity="0.1"
            />
            <polygon
              points="50,20 80,42 67,80 33,80 20,42"
              fill="none"
              stroke="#154D57"
              strokeWidth="0.5"
              strokeOpacity="0.1"
            />
            <line
              x1="50"
              y1="50"
              x2="50"
              y2="5"
              stroke="#154D57"
              strokeWidth="0.5"
              strokeOpacity="0.1"
            />
            <line
              x1="50"
              y1="50"
              x2="95"
              y2="35"
              stroke="#154D57"
              strokeWidth="0.5"
              strokeOpacity="0.1"
            />
            <line
              x1="50"
              y1="50"
              x2="77"
              y2="90"
              stroke="#154D57"
              strokeWidth="0.5"
              strokeOpacity="0.1"
            />
            <line
              x1="50"
              y1="50"
              x2="23"
              y2="90"
              stroke="#154D57"
              strokeWidth="0.5"
              strokeOpacity="0.1"
            />
            <line
              x1="50"
              y1="50"
              x2="5"
              y2="35"
              stroke="#154D57"
              strokeWidth="0.5"
              strokeOpacity="0.1"
            />
            <polygon
              points="50,15 85,40 70,85 40,75 15,30"
              fill="#154D57"
              fillOpacity="0.1"
              stroke="#154D57"
              strokeWidth="1.5"
            />
            <text
              x="50"
              y="2"
              textAnchor="middle"
              fontSize="3"
              fontWeight="bold"
              fill="#154D57"
            >
              Intro to IS: 15
            </text>
            <text
              x="96"
              y="35"
              textAnchor="start"
              fontSize="3"
              fontWeight="bold"
              fill="#154D57"
            >
              Analysis: 18
            </text>
            <text
              x="5"
              y="35"
              textAnchor="end"
              fontSize="3"
              fontWeight="bold"
              fill="#154D57"
            >
              Web Dev: 17
            </text>
          </svg>
        </div>
      </div>

      {/* --- Right Column (Member List) --- */}
      <div className="lg:col-span-1 bg-white rounded-4xl md:rounded-[2.5rem] p-6 md:p-10 border border-[#154D57]/5 shadow-sm overflow-hidden">
        <div className="relative mb-6 md:mb-8">
          <FiSearch className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search member..."
            className="w-full bg-transparent border-b border-gray-100 py-2 md:py-3 pl-8 text-xs md:text-sm focus:outline-none focus:border-[#154D57]/20"
          />
        </div>
        <div className="space-y-5 md:space-y-6">
          {[
            {
              name: "Budiarti rohman",
              score: 96,
              color: "bg-purple-100 text-purple-600",
            },
            {
              name: "Ningrum Lea",
              score: 85,
              color: "bg-blue-100 text-blue-600",
            },
            {
              name: "Michael mart",
              score: 54,
              color: "bg-orange-100 text-orange-600",
            },
            {
              name: "Fikrie tonic",
              score: 30,
              color: "bg-red-100 text-red-600",
            },
            {
              name: "Lucky Minals",
              score: 20,
              color: "bg-gray-100 text-gray-600",
            },
          ].map((member, i) => (
            <div
              key={i}
              className="flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-3 md:gap-4">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-100 border-2 border-white shadow-sm overflow-hidden group-hover:scale-110 transition-transform"></div>
                <h4 className="text-xs md:text-sm font-bold text-[#154D57] group-hover:translate-x-1 transition-transform">
                  {member.name}
                </h4>
              </div>
              <span
                className={`text-[8px] md:text-[10px] font-black px-2 md:px-3 py-1 rounded-lg ${member.color}`}
              >
                {member.score}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* --- Lower Grid (Statistics) --- */}
      <div className="lg:col-span-2 bg-white rounded-4xl md:rounded-[2.5rem] p-6 md:p-10 border border-[#154D57]/5 shadow-sm">
        <div className="flex justify-between items-center mb-8 md:mb-10">
          <h3 className="text-lg md:text-xl font-black text-[#154D57]">
            Exam progress statistics
          </h3>
          <div className="flex items-center gap-2 md:gap-3 bg-gray-50 px-3 md:px-4 py-1.5 md:py-2 rounded-xl text-[10px] md:text-xs font-bold text-gray-500 cursor-pointer">
            Exam <FiChevronDown />
          </div>
        </div>
        <div className="h-48 md:h-64 flex items-end gap-3 md:gap-6 px-2 md:px-4">
          {[40, 70, 50, 90, 80, 60, 45].map((h, i) => (
            <div
              key={i}
              className="flex-1 flex flex-col items-center gap-2 md:gap-3 group"
            >
              <div
                className="w-full bg-[#154D57]/5 rounded-t-lg md:rounded-t-xl relative overflow-hidden"
                style={{ height: "100%" }}
              >
                <div
                  className="absolute bottom-0 w-full bg-[#154D57] rounded-t-lg md:rounded-t-xl transition-all duration-1000 group-hover:brightness-125"
                  style={{ height: `${h}%` }}
                ></div>
              </div>
              <span className="text-[8px] md:text-[10px] font-bold text-gray-400">
                Wk {i + 1}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* --- Learning Spotlight --- */}
      <div className="lg:col-span-1 bg-white rounded-4xl md:rounded-[2.5rem] overflow-hidden border border-[#154D57]/5 shadow-sm flex flex-col">
        <div className="relative h-40 md:h-48 group">
          <img
            src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop"
            alt="Learning"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-linear-to-t from-[#154D57]/60 to-transparent"></div>
        </div>
        <div className="p-6 md:p-8">
          <h4 className="text-lg md:text-xl font-black text-[#154D57] mb-1 md:mb-2 leading-tight">
            Mastering the Art of Learning
          </h4>
          <p className="text-gray-400 text-[10px] md:text-xs font-medium leading-relaxed mb-5 md:mb-6">
            Whether you're picking up a new hobby, aiming to advance your
            career, or simply curious...
          </p>
          <button className="w-full py-3 md:py-4 bg-[#154D57]/5 hover:bg-[#154D57] hover:text-white text-[#154D57] rounded-xl md:rounded-2xl font-black text-xs md:text-sm transition-all group">
            Read More{" "}
            <FiArrowRight className="inline ml-1 md:ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
