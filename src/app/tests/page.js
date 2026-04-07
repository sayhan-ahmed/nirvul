"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { useModal } from "@/context/ModalContext";
import {
  FiBook,
  FiCheckCircle,
  FiChevronLeft,
  FiLock,
  FiZap,
  FiLayers,
  FiGlobe,
  FiUser
} from "react-icons/fi";
import Link from "next/link";

import {
  DUMMY_QUESTIONS,
  CLASSES,
  VERSIONS,
  SUBJECT_DATA,
  EXAM_STRUCTURE,
} from "@/data/testData";

export default function TestsPage() {
  const { user, loading } = useAuth();
  const { showToast } = useToast();
  const { showConfirm } = useModal();
  const router = useRouter();

  // Selection State
  const [currentView, setCurrentView] = useState("CLASSES"); // CLASSES, VERSIONS, SUBJECTS, RULES, EXAM, RESULT
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState("science"); 
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [selectedTest, setSelectedTest] = useState(null);

  // Exam State
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(2100);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);

  // Auth Check
  useEffect(() => {
    if (!loading && !user) router.push("/");
  }, [user, loading, router]);

  // Navigation Control for Exam Mode
  useEffect(() => {
    const isExamActive = currentView === "EXAM" || currentView === "RESULT";
    window.dispatchEvent(
      new CustomEvent("toggleNav", { detail: { active: isExamActive } }),
    );

    if (isExamActive) {
      const handleBeforeUnload = (e) => {
        e.preventDefault();
        e.returnValue = ""; 
      };

      window.history.pushState(null, null, window.location.pathname);
      const handlePopState = () => {
        if (currentView === "EXAM" || currentView === "RESULT") {
          window.history.pushState(null, null, window.location.pathname);
          showToast(
            "Examination is active. You must submit your answers before leaving.",
            "warning",
          );
        }
      };

      window.addEventListener("beforeunload", handleBeforeUnload);
      window.addEventListener("popstate", handlePopState);

      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
        window.removeEventListener("popstate", handlePopState);
      };
    }

    return () => {
      window.dispatchEvent(
        new CustomEvent("toggleNav", { detail: { active: false } }),
      );
    };
  }, [currentView]);

  // Timer Effect
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
  const calculateResults = async () => {
    let currentScore = 0;
    shuffledQuestions.forEach((q) => {
      if (answers[q._id] === q.correctAnswer) currentScore += 1;
    });

    setScore(currentScore);
    setIsSubmitted(true);
    setCurrentView("RESULT");

    const examName = `${selectedSubject?.name}${selectedChapter ? ` (${selectedChapter.name})` : ' (Comprehensive)'} - ${selectedTest?.name || ''}`;

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/results`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userUid: user.uid,
          subject: examName,
          score: currentScore,
          totalPoints: shuffledQuestions.length,
        }),
      });
      showToast("Exam submitted successfully!", "success");
    } catch (err) {
      console.error("Error saving result to backend:", err);
      showToast("Failed to save results. Please check connection.", "error");
    }
  };

  const handleAutoSubmit = () => {
    calculateResults();
  };

  const handleSubjectSelect = (subject) => {
    // If we want subjects to unlock just by having exam structure
    const hasData = !!EXAM_STRUCTURE[subject.id];
    
    if (!subject.active && !hasData) return;
    
    // Even if subject.active is false, if it has EXAM_STRUCTURE data, let user enter
    if (hasData) {
      setSelectedSubject(subject);
      setSelectedChapter(null);
      setSelectedTest(null);
      setCurrentView("CHAPTERS");
    } else {
      if (subject.active) {
         showToast("Exam questions are not available for this subject yet.", "warning");
      }
    }
  };

  const handleChapterSelect = (chapter) => {
    if (!chapter.active) return;
    setSelectedChapter(chapter);
    setCurrentView("CHAPTER_TESTS");
  };

  const handleTestSelect = (test) => {
    if (!test.active) return;
    setSelectedTest(test);
    setCurrentView("RULES");
  };

  const handleRulesBack = () => {
    if (selectedChapter) {
      setCurrentView("CHAPTER_TESTS");
    } else if (EXAM_STRUCTURE[selectedSubject?.id]) {
      setCurrentView("CHAPTERS");
    } else {
      setCurrentView("SUBJECTS");
    }
  };

  const startExam = () => {
    // Shuffle questions before starting
    const shuffled = [...DUMMY_QUESTIONS].sort(() => Math.random() - 0.5);
    setShuffledQuestions(shuffled);
    
    setTimeLeft(2100);
    setAnswers({});
    setIsSubmitted(false);
    setCurrentView("EXAM");
  };

  const handleAnswerSelect = (questionId, option) => {
    if (answers[questionId]) {
      showToast("Answer already locked for this question.", "warning");
      return;
    }
    
    setAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));
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

  // TIER 1: Class Selection
  if (currentView === "CLASSES") {
    return (
      <div className="min-h-screen bg-[#FEFAF7] text-[#154D57] p-6 lg:p-8 pt-0 pb-44 md:pb-32 font-sans relative flex flex-col items-center">
        <div className="h-32 w-full shrink-0"></div>
        <div className="max-w-4xl w-full">
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-black mb-4 text-[#154D57]">Select Class</h1>
            <p className="text-lg opacity-60 font-medium">Choose your academic level to continue.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CLASSES.map((cls) => (
              <button
                key={cls.id}
                onClick={() => {
                  if (cls.active) {
                    setSelectedClass(cls);
                    setCurrentView("VERSIONS");
                  }
                }}
                className={`relative group p-8 rounded-4xl border-2 transition-all duration-300 text-left h-48 flex flex-col justify-between
                  ${cls.active ? "bg-white border-[#154D57]/30 hover:border-[#154D57] shadow-xl hover:shadow-2xl hover:-translate-y-1" : "bg-gray-50 border-gray-100 cursor-not-allowed opacity-60 grayscale"}`}
              >
                <div>
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${cls.active ? "bg-[#154D57]/10 text-[#154D57]" : "bg-gray-200 text-gray-400"}`}>
                    <FiBook className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-black">{cls.name}</h3>
                </div>
                {!cls.active ? (
                  <span className="text-xs font-black uppercase tracking-widest bg-gray-200 px-3 py-1 rounded-full text-gray-500 w-fit">Coming Soon</span>
                ) : (
                  <div className="font-black text-sm uppercase tracking-widest text-[#154D57]/60">Select Version →</div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // TIER 2: Version Selection
  if (currentView === "VERSIONS") {
    return (
      <div className="min-h-screen bg-[#FEFAF7] text-[#154D57] p-6 lg:p-8 pt-0 pb-44 md:pb-32 font-sans relative flex flex-col items-center">
        <div className="h-32 w-full shrink-0"></div>
        <div className="max-w-3xl w-full">
          <button onClick={() => setCurrentView("CLASSES")} className="flex items-center gap-2 mb-8 text-[#154D57] font-black uppercase tracking-widest text-sm hover:translate-x-[-4px] transition-transform">
            <FiChevronLeft className="w-5 h-5" /> Back to Classes
          </button>
          <div className="mb-12 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-black mb-2 text-[#154D57]">Select Version</h1>
            <p className="text-lg opacity-60 font-bold">Class: {selectedClass?.name}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-6">
            {VERSIONS.map((v) => (
              <button
                key={v.id}
                onClick={() => {
                  if (v.active) {
                    setSelectedVersion(v);
                    setCurrentView("SUBJECTS");
                    setSelectedGroup("science");
                  }
                }}
                className={`flex-1 p-10 rounded-4xl border-2 transition-all duration-300 text-center flex flex-col items-center gap-4
                  ${v.active ? "bg-white border-[#154D57]/20 hover:border-[#154D57] shadow-xl hover:-translate-y-1" : "bg-gray-50 border-gray-100 cursor-not-allowed opacity-60 grayscale"}`}
              >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${v.active ? "bg-[#154D57]/10 text-[#154D57]" : "bg-gray-200 text-gray-400"}`}>
                  <FiGlobe className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black">{v.name}</h3>
                {!v.active && <span className="text-xs font-black uppercase tracking-widest bg-gray-200 px-3 py-1 rounded-full text-gray-500">Coming Soon</span>}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // TIER 3: Subject Selection
  if (currentView === "SUBJECTS") {
    const versionData = SUBJECT_DATA[selectedVersion?.id] || SUBJECT_DATA.bangla;
    return (
      <div className="min-h-screen bg-[#FEFAF7] text-[#154D57] p-6 lg:p-8 pt-0 pb-44 md:pb-32 font-sans relative flex flex-col items-center">
        <div className="h-32 w-full shrink-0"></div>
        <div className="max-w-5xl w-full">
          <button onClick={() => setCurrentView("VERSIONS")} className="flex items-center gap-2 mb-8 text-[#154D57] font-black uppercase tracking-widest text-sm hover:translate-x-[-4px] transition-transform">
            <FiChevronLeft className="w-5 h-5" /> Back to Versions
          </button>
          <div className="mb-12">
            <div className="flex items-center gap-3 text-sm font-black uppercase tracking-widest opacity-60 mb-2">
              <span>{selectedClass?.name}</span><span>/</span><span>{selectedVersion?.name}</span>
            </div>
            <h1 className="text-4xl font-black text-[#154D57]">All Subjects</h1>
          </div>

          {/* Common Section */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-[#154D57]/10 flex items-center justify-center text-[#154D57]"><FiZap className="w-5 h-5" /></div>
              <h2 className="text-2xl font-black text-[#154D57]">Compulsory Subjects</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {versionData.common.map((subject) => {
                const hasData = !!EXAM_STRUCTURE[subject.id];
                const isActive = subject.active || hasData;
                return (
                  <button
                    key={subject.id}
                    onClick={() => handleSubjectSelect(subject)}
                    className={`p-6 rounded-3xl border-2 transition-all text-left flex items-center justify-between group
                      ${isActive ? "bg-white border-[#154D57]/20 hover:border-[#154D57] shadow-lg" : "bg-gray-50 border-gray-100 opacity-60 cursor-not-allowed"}`}
                  >
                    <span className={`text-lg font-bold ${isActive ? "text-[#154D57]" : "text-gray-400"}`}>{subject.name}</span>
                    {isActive ? <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span> : <FiLock className="text-gray-300" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Group Section */}
          <div className="pb-20">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 rounded-xl bg-[#154D57]/10 flex items-center justify-center text-[#154D57]"><FiLayers className="w-5 h-5" /></div>
              <h2 className="text-2xl font-black text-[#154D57]">Group Subjects</h2>
            </div>
            <div className="bg-white rounded-4xl p-6 shadow-xl border border-[#154D57]/10 mb-10 flex items-center justify-between">
              <button onClick={() => {
                const idx = versionData.groups.findIndex(g => g.id === selectedGroup);
                const prevIdx = (idx - 1 + versionData.groups.length) % versionData.groups.length;
                setSelectedGroup(versionData.groups[prevIdx].id);
              }} className="w-12 h-12 rounded-full border-2 border-[#154D57]/20 flex items-center justify-center text-[#154D57] hover:bg-[#154D57] hover:text-white transition-all shadow-md active:scale-90">
                <FiChevronLeft className="w-6 h-6" />
              </button>
              <div className="text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#154D57]/40 mb-1">Select Group</p>
                <h3 className="text-2xl font-black text-[#154D57]">{versionData.groups.find(g => g.id === selectedGroup)?.name}</h3>
              </div>
              <button onClick={() => {
                const idx = versionData.groups.findIndex(g => g.id === selectedGroup);
                const nextIdx = (idx + 1) % versionData.groups.length;
                setSelectedGroup(versionData.groups[nextIdx].id);
              }} className="w-12 h-12 rounded-full border-2 border-[#154D57]/20 flex items-center justify-center text-[#154D57] hover:bg-[#154D57] hover:text-white transition-all shadow-md active:scale-90">
                <FiChevronLeft className="w-6 h-6 rotate-180" />
              </button>
            </div>
            {selectedGroup && versionData.groupSubjects[selectedGroup] && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 animate-in fade-in zoom-in-95 duration-500">
                {versionData.groupSubjects[selectedGroup].map((sub) => {
                  const hasData = !!EXAM_STRUCTURE[sub.id];
                  const isActive = sub.active || hasData;
                  return (
                    <button
                      key={sub.id}
                      onClick={() => handleSubjectSelect(sub)}
                      className={`p-6 rounded-3xl border-2 transition-all text-left flex items-center justify-between group
                        ${isActive ? "bg-white border-[#154D57]/20 hover:border-[#154D57] shadow-lg" : "bg-gray-50 border-gray-100 opacity-60 cursor-not-allowed"}`}
                    >
                      <span className={`text-lg font-bold ${isActive ? "text-[#154D57]" : "text-gray-400"}`}>{sub.name}</span>
                      {isActive ? <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span> : <FiLock className="text-gray-300" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // TIER 3.5: Chapter Selection
  if (currentView === "CHAPTERS") {
    const structure = EXAM_STRUCTURE[selectedSubject.id] || { comprehensive: [], chapters: [] };
    const mixTests = structure.comprehensive;
    const chapterTests = structure.chapters;

    const renderTestButton = (test) => (
      <button
        key={test.id}
        onClick={() => {
          setSelectedChapter(null);
          handleTestSelect(test);
        }}
        className={`p-6 rounded-3xl border-2 transition-all text-left flex items-center justify-between group
          ${test.active 
            ? "bg-[#154D57] text-white border-[#154D57] shadow-xl hover:-translate-y-1" 
            : "bg-gray-50 border-gray-100 opacity-60 cursor-not-allowed"}`}
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white">
            <FiZap className="w-5 h-5" />
          </div>
          <span className={`text-lg font-bold ${test.active ? "text-white" : "text-gray-400"}`}>
            {test.name}
          </span>
        </div>
        {test.active ? (
          <span className={`opacity-0 group-hover:opacity-100 transition-opacity text-white`}>→</span>
        ) : (
          <FiLock className="text-gray-300" />
        )}
      </button>
    );

    const renderChapterButton = (chapter) => (
      <button
        key={chapter.id}
        onClick={() => handleChapterSelect(chapter)}
        className={`p-6 rounded-3xl border-2 transition-all text-left flex items-center justify-between group
          ${chapter.active 
            ? "bg-white border-[#154D57]/20 hover:border-[#154D57] shadow-lg text-[#154D57]" 
            : "bg-gray-50 border-gray-100 opacity-60 cursor-not-allowed"}`}
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-[#154D57]/10 flex items-center justify-center text-[#154D57]">
            <FiBook className="w-5 h-5" />
          </div>
          <span className={`text-lg font-bold ${chapter.active ? "text-[#154D57]" : "text-gray-400"}`}>
            {chapter.name}
          </span>
        </div>
        {chapter.active ? (
          <span className={`opacity-0 group-hover:opacity-100 transition-opacity`}>→</span>
        ) : (
          <FiLock className="text-gray-300" />
        )}
      </button>
    );

    return (
      <div className="min-h-screen bg-[#FEFAF7] text-[#154D57] p-6 lg:p-8 pt-0 pb-44 md:pb-32 font-sans relative flex flex-col items-center">
        <div className="h-32 w-full shrink-0"></div>
        <div className="max-w-5xl w-full">
          <button onClick={() => setCurrentView("SUBJECTS")} className="flex items-center gap-2 mb-8 text-[#154D57] font-black uppercase tracking-widest text-sm hover:translate-x-[-4px] transition-transform">
            <FiChevronLeft className="w-5 h-5" /> Back to Subjects
          </button>
          
          <div className="mb-12">
            <div className="flex items-center gap-3 text-sm font-black uppercase tracking-widest opacity-60 mb-2">
              <span>{selectedClass?.name}</span><span>/</span><span>{selectedVersion?.name}</span><span>/</span><span>{selectedSubject?.name}</span>
            </div>
            <h1 className="text-4xl font-black text-[#154D57]">Select Topic</h1>
            <p className="text-lg mt-2 opacity-80 font-bold">You can select a specific chapter or take a Mix Model Test.</p>
          </div>

          {/* Mix Model Test Category */}
          {mixTests.length > 0 && (
            <div className="mb-16">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-[#154D57]/10 flex items-center justify-center text-[#154D57]"><FiZap className="w-5 h-5" /></div>
                <h2 className="text-2xl font-black text-[#154D57]">Comprehensive Test</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {mixTests.map(renderTestButton)}
              </div>
            </div>
          )}

          {/* Chapter-wise Tests Category */}
          {chapterTests.length > 0 && (
            <div className="pb-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-[#154D57]/10 flex items-center justify-center text-[#154D57]"><FiLayers className="w-5 h-5" /></div>
                <h2 className="text-2xl font-black text-[#154D57]">Chapter-wise Tests</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {chapterTests.map(renderChapterButton)}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // TIER 3.8: Chapter Tests Selection
  if (currentView === "CHAPTER_TESTS") {
    return (
      <div className="min-h-screen bg-[#FEFAF7] text-[#154D57] p-6 lg:p-8 pt-0 pb-44 md:pb-32 font-sans relative flex flex-col items-center">
        <div className="h-32 w-full shrink-0"></div>
        <div className="max-w-5xl w-full">
          <button onClick={() => setCurrentView("CHAPTERS")} className="flex items-center gap-2 mb-8 text-[#154D57] font-black uppercase tracking-widest text-sm hover:translate-x-[-4px] transition-transform">
            <FiChevronLeft className="w-5 h-5" /> Back to Topics
          </button>
          
          <div className="mb-12">
            <div className="flex items-center gap-3 text-sm font-black uppercase tracking-widest opacity-60 mb-2">
              <span>{selectedSubject?.name}</span><span>/</span><span>{selectedChapter?.name}</span>
            </div>
            <h1 className="text-4xl font-black text-[#154D57]">Select Test</h1>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {selectedChapter?.tests?.map((test) => (
              <button
                key={test.id}
                onClick={() => handleTestSelect(test)}
                className={`p-6 rounded-3xl border-2 transition-all text-left flex items-center justify-between group
                  ${test.active 
                    ? "bg-white border-[#154D57]/20 hover:border-[#154D57] shadow-lg text-[#154D57]" 
                    : "bg-gray-50 border-gray-100 opacity-60 cursor-not-allowed"}`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#154D57]/10 flex items-center justify-center text-[#154D57]">
                    <FiBook className="w-5 h-5" />
                  </div>
                  <span className={`text-lg font-bold ${test.active ? "text-[#154D57]" : "text-gray-400"}`}>
                    {test.name}
                  </span>
                </div>
                {test.active ? (
                  <span className={`opacity-0 group-hover:opacity-100 transition-opacity`}>→</span>
                ) : (
                  <FiLock className="text-gray-300" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // TIER 4: Rules View
  if (currentView === "RULES") {
    return (
      <div className="min-h-screen bg-[#FEFAF7] p-6 lg:p-8 pt-0 pb-44 md:pb-32 font-sans relative flex flex-col items-center">
        <div className="h-32 w-full shrink-0"></div>
        <div className="max-w-2xl w-full">
          <button onClick={handleRulesBack} className="flex items-center gap-2 mb-8 text-[#154D57] font-black uppercase tracking-widest text-sm hover:translate-x-[-4px] transition-transform">
            <FiChevronLeft className="w-5 h-5" /> Back
          </button>
          
          <div className="bg-white p-10 rounded-4xl shadow-xl border border-[#154D57]/10">
            <h1 className="text-3xl font-black mb-6 text-[#154D57]">Exam Rules</h1>
          <ul className="space-y-5 text-[#154D57]/80 font-medium mb-10 pl-2">
            <li className="flex items-start gap-4">
              <span className="text-red-500 font-black shrink-0 mt-1">•</span>
              <span className="flex-1 leading-relaxed">Total duration for this exam is <b>35 Minutes</b> (2100 seconds).</span>
            </li>
            <li className="flex items-start gap-4">
              <span className="text-red-500 font-black shrink-0 mt-1">•</span>
              <span className="flex-1 leading-relaxed">Once you select an answer, it is <b className="text-[#154D57]">LOCKED</b> and cannot be changed.</span>
            </li>
            <li className="flex items-start gap-4">
              <span className="text-red-500 font-black shrink-0 mt-1">•</span>
              <span className="flex-1 leading-relaxed">The exam will automatically submit when the timer reaches zero.</span>
            </li>
            <li className="flex items-start gap-4">
              <span className="text-red-500 font-black shrink-0 mt-1">•</span>
              <span className="flex-1 leading-relaxed">Do not refresh the page or navigate away during the exam.</span>
            </li>
            <li className="flex items-start gap-4">
              <span className="text-red-500 font-black shrink-0 mt-1">•</span>
              <span className="flex-1 leading-relaxed">Ensure you have a stable internet connection for smooth experience.</span>
            </li>
          </ul>
          <button onClick={startExam} className="w-full bg-[#154D57] text-white py-4 rounded-full font-black hover:bg-[#1C2321] transition-all shadow-lg active:scale-95">START EXAM</button>
          </div>
        </div>
      </div>
    );
  }

  // TIER 5: Exam View
  if (currentView === "EXAM") {
    return (
      <div className="min-h-screen bg-[#FEFAF7] py-10 px-4 pt-0 pb-44 md:pb-28 font-sans text-[#154D57] relative flex flex-col items-center">
        <div className="h-32 w-full shrink-0"></div>
        <div className="max-w-3xl w-full relative z-10">
          <div className="mb-4 text-[#154D57]/40 font-black uppercase tracking-widest text-[10px] flex items-center gap-2"><FiLock className="w-3 h-3" /> Strict Exam Mode Active</div>
          <div className="sticky top-6 md:top-10 bg-[#FEFAF7] p-6 rounded-4xl shadow-xl border border-[#154D57]/20 flex justify-between items-center mb-10 z-10">
            <div>
              <h1 className="text-xl md:text-2xl font-black text-[#154D57]">
                {selectedSubject?.name || "Exam"}
                {selectedChapter && selectedChapter.id !== "mix" && <span className="opacity-70 text-lg"> - {selectedChapter.name}</span>}
                {selectedChapter && selectedChapter.id === "mix" && <span className="text-orange-500 text-lg"> (Mix)</span>}
              </h1>
              <p className="text-sm font-bold opacity-60 uppercase mt-1">Student: {user.displayName}</p>
            </div>
            <div className="px-6 py-3 rounded-xl border-2 border-[#154D57]/20 bg-[#154D57]/5 font-black text-2xl tracking-widest">{formatTime(timeLeft)}</div>
          </div>

          <div className="space-y-8">
            {shuffledQuestions.map((q, idx) => {
              const hasAnswered = !!answers[q._id];
              return (
                <div key={q._id} className={`bg-white p-8 rounded-4xl transition-all border ${hasAnswered ? "border-[#154D57]/10" : "border-[#154D57]/20 shadow-lg"}`}>
                  <div className="flex justify-between items-center mb-6">
                    <span className="bg-[#154D57]/5 text-[#154D57] px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">Question {idx + 1}</span>
                    {hasAnswered && <span className="flex items-center gap-1.5 text-orange-500 font-bold text-xs uppercase tracking-wider"><FiLock className="w-3.5 h-3.5" /> Selection Locked</span>}
                  </div>
                  <h3 className="text-xl md:text-2xl font-black text-[#1A1A1A] mb-8 leading-tight">{q.questionText}</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {q.options.map((option) => {
                      const isSelected = answers[q._id] === option;
                      return (
                        <button
                          key={option}
                          disabled={hasAnswered}
                          onClick={() => handleAnswerSelect(q._id, option)}
                          className={`p-5 rounded-2xl text-left font-bold transition-all border-2 
                            ${isSelected ? "bg-[#154D57] border-[#154D57] text-white shadow-xl shadow-[#154D57]/20" : hasAnswered ? "bg-gray-50 border-gray-100 text-gray-300 opacity-60 cursor-not-allowed" : "bg-white border-gray-100 text-gray-600 hover:border-[#154D57]/30 hover:bg-[#154D57]/5"}`}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
          <button onClick={() => showConfirm("Finish Exam?", "Are you sure you want to submit your answers?", calculateResults)} className="mt-14 w-full bg-[#154D57] text-white py-6 rounded-full font-black text-xl shadow-2xl hover:bg-[#1C2321] transition-all active:scale-95">SUBMIT EXAM</button>
        </div>
      </div>
    );
  }

  // TIER 6: Result View
  if (currentView === "RESULT") {
    return (
      <div className="min-h-screen bg-[#FEFAF7] py-10 px-4 pt-0 pb-44 md:pb-28 font-sans text-[#154D57] relative flex flex-col items-center">
        <div className="h-32 w-full shrink-0"></div>
        <div className="max-w-3xl w-full bg-white p-10 md:p-14 rounded-5xl shadow-2xl border border-[#154D57]/10 text-center animate-in fade-in zoom-in-95 duration-700">
          <div className="w-24 h-24 bg-green-500/10 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8"><FiCheckCircle className="w-12 h-12" /></div>
          <h1 className="text-4xl font-black mb-4 text-[#154D57]">Exam Completed!</h1>
          <p className="text-xl font-medium text-[#154D57]/60 mb-10">
            Great job! You've finished the <b>{selectedSubject?.name} {selectedChapter && selectedChapter.id !== "mix" ? `- ${selectedChapter.name}` : ""}</b> exam.
          </p>

          <div className="grid grid-cols-2 gap-6 mb-12">
            <div className="bg-[#154D57]/5 p-8 rounded-4xl border border-[#154D57]/10">
              <p className="text-sm font-black uppercase tracking-widest opacity-40 mb-2">
                Your Score
              </p>
              <h2 className="text-5xl font-black text-[#154D57]">
                {score}
                <span className="text-2xl opacity-30 ml-1">
                  /{shuffledQuestions.length}
                </span>
              </h2>
            </div>
            <div className="bg-[#154D57]/5 p-8 rounded-4xl border border-[#154D57]/10">
              <p className="text-sm font-black uppercase tracking-widest opacity-40 mb-2">
                Accuracy
              </p>
              <h2 className="text-5xl font-black text-[#154D57]">
                {Math.round((score / shuffledQuestions.length) * 100)}%
              </h2>
            </div>
          </div>

          <div className="space-y-6 text-left mb-12">
            <h3 className="text-xl font-black px-2 text-[#154D57]">Detailed Results</h3>
            {shuffledQuestions.map((q) => (
              <div key={q._id} className="p-6 rounded-3xl border-2 border-[#154D57]/10 bg-[#FEFAF7]/50">
                <h3 className="font-bold text-lg mb-3 text-[#1A1A1A]">{q.questionText}</h3>
                <p className="text-sm font-bold">Your Answer: <span className={answers[q._id] === q.correctAnswer ? "text-green-600" : "text-red-500"}>{answers[q._id] || "No Answer"}</span></p>
                {answers[q._id] !== q.correctAnswer && <p className="text-sm font-bold text-green-600 mt-2 p-3 bg-green-50 rounded-xl border border-green-100">Correct Answer: {q.correctAnswer}</p>}
              </div>
            ))}
          </div>
          <button onClick={() => {
            window.dispatchEvent(new CustomEvent("toggleNav", { detail: { active: false } }));
            router.push("/dashboard");
          }} className="w-full bg-[#154D57] text-white py-5 rounded-full font-black text-lg shadow-xl hover:shadow-2xl transition-all active:scale-95">Go back to Dashboard</button>
        </div>
      </div>
    );
  }

  return null;
}
