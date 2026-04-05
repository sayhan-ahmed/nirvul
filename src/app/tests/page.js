"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import {
  FiBook,
  FiChevronLeft,
  FiLock,
  FiZap,
  FiLayers,
  FiCheckCircle,
} from "react-icons/fi";

// Mock Exam Data (Only Bangla 2nd is active)
const DUMMY_QUESTIONS = [
  {
    _id: "q1",
    questionText: "কোনটি খাঁটি বাংলা উপসর্গ?",
    options: ["প্র", "পরা", "অজ", "সু"],
    correctAnswer: "অজ",
  },
  {
    _id: "q2",
    questionText: "ধ্বনি নির্দেশক চিহ্নকে কী বলে?",
    options: ["অক্ষর", "বর্ণ", "শব্দ", "বাক্য"],
    correctAnswer: "বর্ণ",
  },
  {
    _id: "q3",
    questionText: "কোন দুটি স্বরধ্বনির মিলে ‘ঐ’ হয়?",
    options: ["অ + ই", "অ + উ", "আ + উ", "অ + এ"],
    correctAnswer: "অ + ই",
  },
  {
    _id: "q4",
    questionText: "‘গবেষণা’ শব্দের সঠিক সন্ধি বিচ্ছেদ কোনটি?",
    options: ["গো + এষণা", "গবে + ষণা", "গব + এষণা", "গো + ষণা"],
    correctAnswer: "গো + এষণা",
  },
];

const CLASSES = [
  { id: "class8", name: "Class 8", active: false },
  { id: "class9", name: "Class 9", active: false },
  { id: "ssc", name: "SSC (Class 10)", active: true },
  { id: "hsc", name: "HSC (Class 11-12)", active: false },
  { id: "admission", name: "Admission", active: false },
];

const SSC_COMMON_SUBJECTS = [
  { id: "bangla1", name: "Bangla 1st", active: false },
  { id: "bangla2", name: "Bangla 2nd", active: true },
  { id: "english1", name: "English 1st", active: false },
  { id: "english2", name: "English 2nd", active: false },
  { id: "math", name: "General Math", active: false },
  { id: "ict", name: "ICT", active: false },
];

const GROUPS = [
  { id: "science", name: "Science", active: true },
  { id: "humanities", name: "Humanities", active: true },
  { id: "commerce", name: "Business Studies", active: true },
];

const GROUP_SUBJECTS = {
  science: [
    { id: "physics", name: "Physics", active: false },
    { id: "chemistry", name: "Chemistry", active: false },
    { id: "biology", name: "Biology", active: false },
    { id: "higher_math", name: "Higher Math", active: false },
  ],
  humanities: [
    { id: "civics", name: "Civics", active: false },
    { id: "geography", name: "Geography", active: false },
    { id: "history", name: "History", active: false },
  ],
  commerce: [
    { id: "accounting", name: "Accounting", active: false },
    { id: "finance", name: "Finance", active: false },
    { id: "management", name: "Business Ent.", active: false },
  ],
};

export default function TestsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Navigation State
  const [currentView, setCurrentView] = useState("CLASSES"); // CLASSES, SUBJECTS, EXAM, RESULT
  const [selectedGroup, setSelectedGroup] = useState(null);

  // Exam State
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(300);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Authentication Check
  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  // Timer Countdown Effect
  useEffect(() => {
    if (currentView !== "EXAM" || isSubmitted || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isSubmitted, currentView]);

  // Handlers
  const handleSelectOption = (questionId, option) => {
    if (!answers[questionId]) {
      setAnswers((prev) => ({
        ...prev,
        [questionId]: option,
      }));
    }
  };

  const calculateResults = () => {
    let currentScore = 0;
    DUMMY_QUESTIONS.forEach((q) => {
      if (answers[q._id] === q.correctAnswer) {
        currentScore += 1;
      }
    });
    setScore(currentScore);
    setIsSubmitted(true);
    setCurrentView("RESULT");
  };

  const handleSubmit = () => {
    if (confirm("Are you sure you want to submit your exam now?")) {
      calculateResults();
    }
  };

  const handleAutoSubmit = () => {
    calculateResults();
    alert("Time is up! Your exam has been auto-submitted.");
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  if (loading || !user)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FEFAF7] text-[#154D57] font-bold">
        Loading...
      </div>
    );

  // VIEW: Class Selection
  if (currentView === "CLASSES") {
    return (
      <div className="min-h-screen bg-[#FEFAF7] text-[#154D57] p-6 lg:p-8 pt-0 pb-44 md:pb-32 font-sans relative flex flex-col items-center">
        {/* Top Spacer for Fixed Nav */}
        <div className="h-32 w-full shrink-0"></div>
        <div className="max-w-4xl w-full">
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-black mb-4">Select Class</h1>
            <p className="text-lg opacity-60 font-medium">
              Choose your academic level to see available tests.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CLASSES.map((cls) => (
              <button
                key={cls.id}
                onClick={() => cls.active && setCurrentView("SUBJECTS")}
                className={`relative group p-8 rounded-4xl border-2 transition-all duration-300 text-left h-48 flex flex-col justify-between
                  ${
                    cls.active
                      ? "bg-[#FEFAF7] border-[#154D57]/30 hover:border-[#154D57] shadow-xl hover:shadow-2xl hover:-translate-y-1"
                      : "bg-gray-50 border-gray-100 cursor-not-allowed opacity-60 grayscale"
                  }`}
              >
                <div>
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-colors ${cls.active ? 'bg-[#154D57]/10 text-[#154D57]' : 'bg-gray-200 text-gray-400'}`}>
                    <FiBook className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-black">{cls.name}</h3>
                </div>
                {!cls.active && (
                  <span className="text-xs font-black uppercase tracking-widest bg-gray-200 px-3 py-1 rounded-full text-gray-500 w-fit">
                    Coming Soon
                  </span>
                )}
                {cls.active && (
                  <div className="flex items-center gap-2 text-[#154D57] font-black text-sm uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                    Explore Tests →
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // VIEW: Subject Selection (SSC)
  if (currentView === "SUBJECTS") {
    return (
      <div className="min-h-screen bg-[#FEFAF7] text-[#154D57] p-6 lg:p-8 pt-0 pb-44 md:pb-32 font-sans relative flex flex-col items-center">
        {/* Top Spacer for Fixed Nav */}
        <div className="h-32 w-full shrink-0"></div>
        <div className="max-w-5xl w-full">
          <button
            onClick={() => setCurrentView("CLASSES")}
            className="flex items-center gap-2 mb-8 text-[#154D57] font-black uppercase tracking-widest text-sm hover:translate-x-[-4px] transition-transform"
          >
            <FiChevronLeft className="w-5 h-5" /> Back to Classes
          </button>

          <div className="mb-12">
            <h1 className="text-4xl font-black mb-2">SSC Subjects</h1>
            <p className="text-[#154D57]/60 font-bold">Select a subject to start your MCQ practice.</p>
          </div>

          {/* Common Subjects Section */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-[#154D57]/10 flex items-center justify-center text-[#154D57]">
                <FiZap className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-black">Common Subjects</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {SSC_COMMON_SUBJECTS.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => sub.active && setCurrentView("EXAM")}
                  className={`p-6 rounded-3xl border-2 transition-all text-left flex items-center justify-between group
                    ${sub.active 
                      ? "bg-white border-[#154D57]/20 hover:border-[#154D57] shadow-lg hover:shadow-xl hover:-translate-y-1" 
                      : "bg-gray-50 border-gray-100 cursor-not-allowed opacity-60"
                    }`}
                >
                  <span className={`text-lg font-bold ${sub.active ? 'text-[#154D57]' : 'text-gray-400'}`}>
                    {sub.name}
                  </span>
                  {!sub.active ? (
                    <FiLock className="text-gray-300 w-5 h-5" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#154D57]/5 flex items-center justify-center text-[#154D57] opacity-0 group-hover:opacity-100 transition-opacity">
                       →
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Group Sections */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-[#154D57]/10 flex items-center justify-center text-[#154D57]">
                <FiLayers className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-black">Choose Your Group</h2>
            </div>
            
            {/* Group Tabs */}
            <div className="flex flex-wrap gap-4 mb-10">
              {GROUPS.map((group) => (
                <button
                  key={group.id}
                  onClick={() => setSelectedGroup(selectedGroup === group.id ? null : group.id)}
                  className={`px-8 py-3 rounded-full font-black uppercase tracking-widest text-sm transition-all border-2
                    ${selectedGroup === group.id 
                      ? "bg-[#154D57] border-[#154D57] text-[#FEFAF7] shadow-lg" 
                      : "bg-white border-[#154D57]/30 text-[#154D57] hover:border-[#154D57]"
                    }`}
                >
                  {group.name}
                </button>
              ))}
            </div>

            {/* Group Subjects List */}
            {selectedGroup && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 animate-in fade-in slide-in-from-top-4 duration-300">
                {GROUP_SUBJECTS[selectedGroup].map((sub) => (
                  <button
                    key={sub.id}
                    disabled
                    className="p-6 rounded-3xl border-2 border-gray-100 bg-gray-50 opacity-60 transition-all text-left flex items-center justify-between cursor-not-allowed"
                  >
                    <span className="text-lg font-bold text-gray-400">{sub.name}</span>
                    <FiLock className="text-gray-300 w-5 h-5" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // VIEW: Exam Active
  if (currentView === "EXAM") {
    return (
      <div className="min-h-screen bg-[#FEFAF7] py-10 pt-0 pb-44 md:pb-28 px-4 font-sans text-[#154D57] relative">
        <div className="h-32 w-full shrink-0"></div>
        <div className="max-w-3xl mx-auto relative z-10">
          
          <button
            onClick={() => setCurrentView("SUBJECTS")}
            className="flex items-center gap-2 mb-8 text-[#154D57] font-black uppercase tracking-widest text-sm"
          >
            <FiChevronLeft className="w-5 h-5" /> Quit Exam
          </button>

          <div className="sticky top-28 md:top-36 bg-[#FEFAF7] p-6 rounded-4xl shadow-xl border border-[#154D57]/20 flex justify-between items-center mb-10 z-10">
            <div>
              <h1 className="text-2xl font-black text-[#154D57]">Bangla 2nd Paper</h1>
              <p className="text-sm text-[#154D57]/70 font-bold mt-1 tracking-wide uppercase">Student: {user.displayName}</p>
            </div>
            <div className={`px-6 py-3 rounded-xl flex items-center gap-3 transition-colors border ${timeLeft < 60 ? 'bg-[#1C2321]/10 border-[#1C2321]/30' : 'bg-[#154D57]/5 border-[#154D57]/20'}`}>
               <span className={`text-2xl font-black tracking-widest ${timeLeft < 60 ? 'text-[#1C2321]' : 'text-[#154D57]'}`}>
                 {formatTime(timeLeft)}
               </span>
            </div>
          </div>

          <div className="space-y-8">
            {DUMMY_QUESTIONS.map((q, idx) => {
              const hasAnswered = !!answers[q._id];
              return (
                <div key={q._id} className={`bg-[#FEFAF7] p-8 rounded-4xl transition duration-300 ${hasAnswered ? 'border border-[#154D57]/20 shadow-sm' : 'border border-[#154D57]/30 shadow-xl hover:border-[#154D57]'}`}>
                  <h3 className="text-xl font-bold text-[#154D57] mb-6 flex gap-3">
                    <span className="text-[#1C2321] font-black">{idx + 1}.</span> {q.questionText}
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {q.options.map((opt, oIdx) => {
                      const isSelected = answers[q._id] === opt;
                      return (
                        <button
                          key={oIdx}
                          disabled={hasAnswered}
                          onClick={() => handleSelectOption(q._id, opt)}
                          className={`text-left p-5 rounded-2xl border-2 transition-all duration-200 shadow-sm ${
                            isSelected 
                              ? 'bg-[#154D57] border-[#154D57] text-[#FEFAF7] transform scale-[1.02] shadow-md font-bold' 
                              : hasAnswered
                                ? 'bg-[#FEFAF7] border-[#154D57]/20 text-[#154D57]/40 cursor-not-allowed opacity-60'
                                : 'bg-[#FEFAF7] border-[#154D57]/40 text-[#154D57] hover:border-[#1C2321] font-bold hover:shadow-md'
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 ${isSelected ? 'border-[#FEFAF7]' : 'border-[#154D57]/40'}`}>
                              {isSelected && <div className="w-2.5 h-2.5 bg-[#FEFAF7] rounded-full"></div>}
                            </div>
                            <span className="text-[1.05rem]">{opt}</span>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-14 text-center pb-20">
            <button 
              onClick={handleSubmit}
              className="bg-[#154D57] hover:bg-[#1C2321] text-[#FEFAF7] px-12 py-5 rounded-full font-black text-xl shadow-xl transition-all transform hover:-translate-y-1 block mx-auto uppercase tracking-widest"
            >
              Submit Exam
            </button>
          </div>
        </div>
      </div>
    );
  }

  // VIEW: Results
  return (
    <div className="min-h-screen bg-[#FEFAF7] py-10 px-4 pt-0 pb-44 md:pb-28 flex flex-col items-center justify-start relative font-sans">
      <div className="h-32 md:h-48 w-full shrink-0"></div>
      <div className="bg-[#FEFAF7] p-10 rounded-4xl shadow-[0_15px_40px_rgba(21,77,87,0.1)] w-full max-w-3xl border border-[#154D57]/20 relative z-10 text-center">
        <div className="mb-10 flex flex-col items-center">
          <div className="w-20 h-20 bg-[#154D57]/10 rounded-full flex items-center justify-center text-[#154D57] mb-6">
            <FiCheckCircle className="w-10 h-10" />
          </div>
          <h1 className="text-5xl font-black text-[#154D57] mb-3">Exam Result</h1>
          <p className="text-xl text-[#154D57]/70 font-semibold uppercase tracking-widest">
            Score: <span className="text-[#154D57] font-black text-4xl">{score}</span> / {DUMMY_QUESTIONS.length}
          </p>
        </div>

        <div className="space-y-6 text-left">
          {DUMMY_QUESTIONS.map((q, idx) => {
            const selected = answers[q._id];
            const isCorrect = selected === q.correctAnswer;
            return (
              <div key={q._id} className={`p-6 rounded-2xl border-2 ${isCorrect ? 'bg-[#154D57]/10 border-[#154D57]/30' : 'bg-[#1C2321]/5 border-[#154D57]/20'}`}>
                <h3 className="font-bold text-lg text-[#154D57] mb-4">{idx + 1}. {q.questionText}</h3>
                <div className="text-sm font-bold flex flex-col gap-2">
                  <p className="text-[#154D57]/60">Your Answer: <span className={isCorrect ? 'text-[#154D57]' : 'text-[#1C2321]'}>{selected || "None"}</span></p>
                  {!isCorrect && <p className="text-[#154D57]">Correct: <span className="bg-[#154D57]/10 px-2 py-0.5 rounded">{q.correctAnswer}</span></p>}
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => {
              setAnswers({});
              setIsSubmitted(false);
              setTimeLeft(300);
              setCurrentView("SUBJECTS");
            }}
            className="bg-[#154D57] hover:bg-[#1C2321] text-[#FEFAF7] px-10 py-4 rounded-full font-black text-lg transition-all"
          >
            Back to Subjects
          </button>
          <Link href="/dashboard" className="border-2 border-[#154D57]/20 hover:border-[#154D57] text-[#154D57] px-10 py-4 rounded-full font-black text-lg transition-all">
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

