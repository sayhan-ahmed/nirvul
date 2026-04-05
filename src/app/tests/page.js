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
} from "react-icons/fi";
import Link from "next/link";

import {
  DUMMY_QUESTIONS,
  CLASSES,
  VERSIONS,
  SUBJECT_DATA,
} from "@/data/testData";

export default function TestsPage() {
  const { user, loading } = useAuth();
  const { showToast } = useToast();
  const { showConfirm } = useModal();
  const router = useRouter();

  // Selection State
  const [currentView, setCurrentView] = useState("CLASSES"); // CLASSES, VERSIONS, SUBJECTS, EXAM, RESULT
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState("science"); // Default to science
  const [selectedSubject, setSelectedSubject] = useState(null);

  // Exam State
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(300);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

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

    // Browser Lock (Back Button & Refresh)
    if (isExamActive) {
      const handleBeforeUnload = (e) => {
        e.preventDefault();
        e.returnValue = ""; // Standard browser warning
      };

      // Push fake state to capture back button
      window.history.pushState(null, null, window.location.pathname);
      const handlePopState = (e) => {
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
        window.dispatchEvent(
          new CustomEvent("toggleNav", { detail: { active: false } }),
        );
      };
    }

    // Cleanup for non-exam views
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
    DUMMY_QUESTIONS.forEach((q) => {
      if (answers[q._id] === q.correctAnswer) currentScore += 1;
    });

    setScore(currentScore);
    setIsSubmitted(true);
    setCurrentView("RESULT");

    // Save to Backend
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/results`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userUid: user.uid,
          subject: selectedSubject?.name || "Unknown Subject",
          score: currentScore,
          totalPoints: DUMMY_QUESTIONS.length,
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
    showToast("Time is up! Your exam has been auto-submitted.", "error");
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
            <h1 className="text-4xl md:text-5xl font-black mb-4">
              Select Class
            </h1>
            <p className="text-lg opacity-60 font-medium">
              Choose your academic level to continue.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
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
                  ${
                    cls.active
                      ? "bg-white border-[#154D57]/30 hover:border-[#154D57] shadow-xl hover:shadow-2xl hover:-translate-y-1"
                      : "bg-gray-50 border-gray-100 cursor-not-allowed opacity-60 grayscale"
                  }`}
              >
                <div>
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${cls.active ? "bg-[#154D57]/10 text-[#154D57]" : "bg-gray-200 text-gray-400"}`}
                  >
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
                  <div className="font-black text-sm uppercase tracking-widest text-[#154D57]/60">
                    Select Version →
                  </div>
                )}
              </button>
            ))}
          </div>

          <div className="text-center max-w-lg mx-auto">
            <p className="text-[#154D57]/40 font-bold text-sm leading-relaxed">
              Stay tuned! We are constantly adding new classes and specialized
              admission tests to our library.
              <br />
              <span className="text-xs mt-1 block font-medium">
                নতুন নতুন ক্লাস ও ভর্তি পরীক্ষার মডেল টেস্ট শীঘ্রই যুক্ত করা
                হবে।
              </span>
            </p>
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
          <button
            onClick={() => setCurrentView("CLASSES")}
            className="flex items-center gap-2 mb-8 text-[#154D57] font-black uppercase tracking-widest text-sm hover:translate-x-[-4px] transition-transform"
          >
            <FiChevronLeft className="w-5 h-5" /> Back to Classes
          </button>
          <div className="mb-12 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-black mb-2">
              Select Version
            </h1>
            <p className="text-lg opacity-60 font-bold">
              Class: {selectedClass?.name}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-6">
            {VERSIONS.map((v) => (
              <button
                key={v.id}
                onClick={() => {
                  if (v.active) {
                    setSelectedVersion(v);
                    setCurrentView("SUBJECTS");
                    setSelectedGroup("science"); // Default to science when entering subjects view
                  }
                }}
                className={`flex-1 p-10 rounded-4xl border-2 transition-all duration-300 text-center flex flex-col items-center gap-4
                  ${
                    v.active
                      ? "bg-white border-[#154D57]/20 hover:border-[#154D57] shadow-xl hover:-translate-y-1"
                      : "bg-gray-50 border-gray-100 cursor-not-allowed opacity-60 grayscale"
                  }`}
              >
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center ${v.active ? "bg-[#154D57]/10 text-[#154D57]" : "bg-gray-200 text-gray-400"}`}
                >
                  <FiGlobe className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black">{v.name}</h3>
                {!v.active && (
                  <span className="text-xs font-black uppercase tracking-widest bg-gray-200 px-3 py-1 rounded-full text-gray-500">
                    Coming Soon
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // TIER 3: Subject Selection
  if (currentView === "SUBJECTS") {
    const versionData =
      SUBJECT_DATA[selectedVersion?.id] || SUBJECT_DATA.bangla;

    return (
      <div className="min-h-screen bg-[#FEFAF7] text-[#154D57] p-6 lg:p-8 pt-0 pb-44 md:pb-32 font-sans relative flex flex-col items-center">
        <div className="h-32 w-full shrink-0"></div>
        <div className="max-w-5xl w-full">
          <button
            onClick={() => setCurrentView("VERSIONS")}
            className="flex items-center gap-2 mb-8 text-[#154D57] font-black uppercase tracking-widest text-sm hover:translate-x-[-4px] transition-transform"
          >
            <FiChevronLeft className="w-5 h-5" /> Back to Versions
          </button>
          <div className="mb-12">
            <div className="flex items-center gap-3 text-sm font-black uppercase tracking-widest opacity-60 mb-2">
              <span>{selectedClass?.name}</span>
              <span>/</span>
              <span>{selectedVersion?.name}</span>
            </div>
            <h1 className="text-4xl font-black">All Subjects</h1>
          </div>

          {/* Common Section */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-[#154D57]/10 flex items-center justify-center text-[#154D57]">
                <FiZap className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-black">Compulsory Subjects</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {versionData.common.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => {
                    if (sub.active) {
                      setSelectedSubject(sub);
                      setCurrentView("EXAM");
                    }
                  }}
                  className={`p-6 rounded-3xl border-2 transition-all text-left flex items-center justify-between group
                    ${sub.active ? "bg-white border-[#154D57]/20 hover:border-[#154D57] shadow-lg" : "bg-gray-50 border-gray-100 opacity-60 cursor-not-allowed"}`}
                >
                  <span
                    className={`text-lg font-bold ${sub.active ? "text-[#154D57]" : "text-gray-400"}`}
                  >
                    {sub.name}
                  </span>
                  {sub.active ? (
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                      →
                    </span>
                  ) : (
                    <FiLock className="text-gray-300" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Group Section with Carousel */}
          <div className="pb-20">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 rounded-xl bg-[#154D57]/10 flex items-center justify-center text-[#154D57]">
                <FiLayers className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-black">Group Subjects</h2>
            </div>

            {/* Carousel Control */}
            <div className="bg-white rounded-4xl p-6 shadow-xl border border-[#154D57]/10 mb-10 flex items-center justify-between">
              <button
                onClick={() => {
                  const idx = versionData.groups.findIndex(
                    (g) => g.id === selectedGroup,
                  );
                  const prevIdx =
                    (idx - 1 + versionData.groups.length) %
                    versionData.groups.length;
                  setSelectedGroup(versionData.groups[prevIdx].id);
                }}
                className="w-12 h-12 rounded-full border-2 border-[#154D57]/20 flex items-center justify-center text-[#154D57] hover:bg-[#154D57] hover:text-white transition-all shadow-md active:scale-90"
              >
                <FiChevronLeft className="w-6 h-6" />
              </button>

              <div className="text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#154D57]/40 mb-1">
                  Select Group
                </p>
                <h3 className="text-2xl font-black text-[#154D57]">
                  {versionData.groups.find((g) => g.id === selectedGroup)?.name}
                </h3>
              </div>

              <button
                onClick={() => {
                  const idx = versionData.groups.findIndex(
                    (g) => g.id === selectedGroup,
                  );
                  const nextIdx = (idx + 1) % versionData.groups.length;
                  setSelectedGroup(versionData.groups[nextIdx].id);
                }}
                className="w-12 h-12 rounded-full border-2 border-[#154D57]/20 flex items-center justify-center text-[#154D57] hover:bg-[#154D57] hover:text-white transition-all shadow-md active:scale-90"
              >
                <FiChevronLeft className="w-6 h-6 rotate-180" />
              </button>
            </div>

            {/* Grid for Active Group */}
            {selectedGroup && versionData.groupSubjects[selectedGroup] ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 animate-in fade-in zoom-in-95 duration-500">
                {versionData.groupSubjects[selectedGroup].map((sub) => (
                  <button
                    key={sub.id}
                    className="p-6 rounded-3xl border-2 border-gray-100 bg-white/50 opacity-60 flex items-center justify-between cursor-not-allowed group transition-colors"
                  >
                    <span className="text-lg font-bold text-gray-400 group-hover:text-gray-500 transition-colors">
                      {sub.name}
                    </span>
                    <FiLock className="text-gray-300" />
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-gray-400 font-bold p-14 border-2 border-dashed border-[#154D57]/10 rounded-4xl text-center bg-gray-50/50">
                Subject list for this stream is currently being updated.
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // TIER 4: Exam View
  if (currentView === "EXAM") {
    return (
      <div className="min-h-screen bg-[#FEFAF7] py-10 px-4 pt-0 pb-44 md:pb-28 font-sans text-[#154D57] relative flex flex-col items-center">
        <div className="h-32 w-full shrink-0"></div>
        <div className="max-w-3xl w-full relative z-10">
          <div className="mb-4 text-[#154D57]/40 font-black uppercase tracking-widest text-[10px] flex items-center gap-2">
            <FiLock className="w-3 h-3" /> Strict Exam Mode Active
          </div>
          <div className="sticky top-28 md:top-36 bg-[#FEFAF7] p-6 rounded-4xl shadow-xl border border-[#154D57]/20 flex justify-between items-center mb-10 z-10">
            <div>
              <h1 className="text-2xl font-black">
                {selectedSubject?.name || "Exam"}
              </h1>
              <p className="text-sm font-bold opacity-60 uppercase">
                Student: {user.displayName}
              </p>
            </div>
            <div className="px-6 py-3 rounded-xl border-2 border-[#154D57]/20 bg-[#154D57]/5 font-black text-2xl tracking-widest">
              {formatTime(timeLeft)}
            </div>
          </div>
          <div className="space-y-8">
            {DUMMY_QUESTIONS.map((q, idx) => {
              const hasAnswered = !!answers[q._id];
              return (
                <div
                  key={q._id}
                  className={`bg-[#FEFAF7] p-8 rounded-4xl transition duration-300 border ${hasAnswered ? "border-[#154D57]/20" : "border-[#154D57]/40 shadow-xl"}`}
                >
                  <h3 className="text-xl font-bold mb-6 flex gap-3">
                    <span className="opacity-40">{idx + 1}.</span>{" "}
                    {q.questionText}
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {q.options.map((opt) => {
                      const isSelected = answers[q._id] === opt;
                      return (
                        <button
                          key={opt}
                          disabled={hasAnswered}
                          onClick={() =>
                            !hasAnswered &&
                            setAnswers({ ...answers, [q._id]: opt })
                          }
                          className={`text-left p-5 rounded-2xl border-2 transition-all ${isSelected ? "bg-[#154D57] border-[#154D57] text-[#FEFAF7] font-bold" : "border-[#154D57]/20 shadow-md"}`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
          <button
            onClick={() =>
              showConfirm(
                "Finish Exam?",
                "Are you sure you want to submit your answers? You cannot change them after proceeding.",
                calculateResults,
              )
            }
            className="mt-14 w-full bg-[#154D57] text-[#FEFAF7] py-6 rounded-full font-black text-xl shadow-2xl hover:bg-[#1C2321] transition-all"
          >
            SUBMIT EXAM
          </button>
        </div>
      </div>
    );
  }

  // RESULT VIEW
  return (
    <div className="min-h-screen bg-[#FEFAF7] py-10 px-4 pt-0 pb-44 md:pb-28 flex flex-col items-center justify-start relative font-sans">
      <div className="h-32 w-full shrink-0"></div>
      <div className="bg-[#FEFAF7] p-10 rounded-4xl shadow-2xl w-full max-w-3xl border border-[#154D57]/20 relative z-10 text-center">
        <FiCheckCircle className="w-20 h-20 text-[#154D57] mx-auto mb-6" />
        <h1 className="text-5xl font-black mb-3">Result</h1>
        <p className="text-2xl font-bold opacity-60 mb-10">
          Your Score:{" "}
          <span className="text-[#154D57] text-4xl font-black">{score}</span> /{" "}
          {DUMMY_QUESTIONS.length}
        </p>
        <div className="space-y-6 text-left mb-12">
          {DUMMY_QUESTIONS.map((q) => (
            <div
              key={q._id}
              className="p-6 rounded-2xl border-2 border-[#154D57]/10"
            >
              <h3 className="font-bold mb-2">{q.questionText}</h3>
              <p className="text-sm font-bold">
                Your Answer:{" "}
                <span
                  className={
                    answers[q._id] === q.correctAnswer
                      ? "text-green-600"
                      : "text-red-500"
                  }
                >
                  {answers[q._id] || "None"}
                </span>
              </p>
              {answers[q._id] !== q.correctAnswer && (
                <p className="text-sm font-bold text-green-600 mt-2">
                  Correct Answer: {q.correctAnswer}
                </p>
              )}
            </div>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">

          <button
            onClick={() => {
              window.dispatchEvent(
                new CustomEvent("toggleNav", { detail: { active: false } }),
              );
              router.push("/dashboard");
            }}
            className="w-full sm:w-auto bg-[#154D57] text-white px-12 py-4 rounded-full font-black hover:bg-[#1C2321] transition-all shadow-xl"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
