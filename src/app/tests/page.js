"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

// Dummy questions for UI testing (later to be fetched from backend)
const DUMMY_QUESTIONS = [
  {
    _id: 'q1',
    questionText: 'কোনটি খাঁটি বাংলা উপসর্গ?',
    options: ['প্র', 'পরা', 'অজ', 'সু'],
    correctAnswer: 'অজ'
  },
  {
    _id: 'q2',
    questionText: 'ধ্বনি নির্দেশক চিহ্নকে কী বলে?',
    options: ['অক্ষর', 'বর্ণ', 'শব্দ', 'বাক্য'],
    correctAnswer: 'বর্ণ'
  },
  {
    _id: 'q3',
    questionText: 'কোন দুটি স্বরধ্বনির মিলে ‘ঐ’ হয়?',
    options: ['অ + ই', 'অ + উ', 'আ + উ', 'অ + এ'],
    correctAnswer: 'অ + ই'
  },
  {
    _id: 'q4',
    questionText: '‘গবেষণা’ শব্দের সঠিক সন্ধি বিচ্ছেদ কোনটি?',
    options: ['গো + এষণা', 'গবে + ষণা', 'গব + এষণা', 'গো + ষণা'],
    correctAnswer: 'গো + এষণা'
  }
];

export default function ExamPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // State
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes (300 seconds)
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Authentication Check
  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  // Timer Countdown Effect
  useEffect(() => {
    if (isSubmitted || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isSubmitted]);

  // Handlers
  const handleSelectOption = (questionId, option) => {
    // Only allow selection if not already answered
    if (!answers[questionId]) {
      setAnswers(prev => ({
        ...prev,
        [questionId]: option
      }));
    }
  };

  const calculateResults = () => {
    let currentScore = 0;
    DUMMY_QUESTIONS.forEach(q => {
      if (answers[q._id] === q.correctAnswer) {
        currentScore += 1;
      }
    });
    setScore(currentScore);
    setIsSubmitted(true);
  };

  const handleSubmit = () => {
    if(confirm("Are you sure you want to submit your exam now?")) {
      calculateResults();
    }
  };

  const handleAutoSubmit = () => {
    calculateResults();
    alert("Time is up! Your exam has been auto-submitted.");
  };

  // Formatting time limit
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (loading || !user) return <div className="min-h-screen flex items-center justify-center bg-[#FEFAF7] text-[#154D57] font-bold">Loading...</div>;

  // View: Exam Result
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#FEFAF7] py-10 px-4 pt-32 pb-44 md:pb-28 flex justify-center items-start relative font-sans">
        <div className="bg-[#FEFAF7] p-10 rounded-4xl shadow-[0_15px_40px_rgba(21,77,87,0.1)] w-full max-w-3xl border border-[#154D57]/20 relative z-10">
          <div className="text-center mb-10 border-b border-[#154D57]/20 pb-8">
            <h1 className="text-5xl font-black text-[#154D57] mb-3">Result</h1>
            <p className="text-xl text-[#154D57]/70 font-semibold">You scored <span className="font-black text-[#154D57] text-3xl ml-2">{score}</span> <span className="text-sm">out of {DUMMY_QUESTIONS.length}</span></p>
          </div>

          <div className="space-y-6">
            {DUMMY_QUESTIONS.map((q, idx) => {
              const selected = answers[q._id];
              const isCorrect = selected === q.correctAnswer;
              
              return (
                <div key={q._id} className={`p-6 rounded-2xl border-2 ${isCorrect ? 'bg-[#154D57]/10 border-[#154D57]/30' : 'bg-[#1C2321]/5 border-[#154D57]/20'} transition-all`}>
                  <h3 className="font-bold text-lg text-[#154D57] mb-4">{idx + 1}. {q.questionText}</h3>
                  <div className="text-sm font-medium">
                    <p className="mb-2 text-[#154D57]/80">Your Answer: <span className={`font-bold px-3 py-1.5 rounded-md ${isCorrect ? 'bg-[#154D57]/20 text-[#154D57]' : 'bg-[#1C2321]/10 text-[#154D57]'}`}>{selected || "Not Answered"}</span></p>
                    {!isCorrect && (
                      <p className="text-[#154D57]/80 mt-3">Correct Answer: <span className="font-bold text-[#154D57] bg-[#154D57]/20 px-3 py-1.5 rounded-md">{q.correctAnswer}</span></p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-12 flex justify-center">
            <Link href="/dashboard" className="bg-[#154D57] hover:bg-[#1C2321] text-[#FEFAF7] px-10 py-4 rounded-full font-black text-lg shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 block">
              Return to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // View: Active Exam
  return (
    <div className="min-h-screen bg-[#FEFAF7] py-10 pt-32 pb-44 md:pb-28 px-4 font-sans text-[#154D57] relative">
      <div className="max-w-3xl mx-auto relative z-10">
        
        {/* Header / Timer Component */}
        <div className="sticky top-28 md:top-36 bg-[#FEFAF7] p-6 rounded-4xl shadow-xl border border-[#154D57]/20 flex justify-between items-center mb-10 z-10">
          <div>
            <h1 className="text-2xl font-black text-[#154D57]">Bangla 2nd Paper</h1>
            <p className="text-sm text-[#154D57]/70 font-bold mt-1 tracking-wide">Candidate: {user.displayName}</p>
          </div>
          <div className={`px-6 py-3 rounded-xl flex items-center gap-3 transition-colors border ${timeLeft < 60 ? 'bg-[#1C2321]/10 border-[#1C2321]/30' : 'bg-[#154D57]/5 border-[#154D57]/20'}`}>
             <svg className={`w-6 h-6 ${timeLeft < 60 ? 'text-[#1C2321] animate-pulse' : 'text-[#154D57]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
             <span className={`text-2xl font-black tracking-widest ${timeLeft < 60 ? 'text-[#1C2321]' : 'text-[#154D57]'}`}>
               {formatTime(timeLeft)}
             </span>
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-8">
          {DUMMY_QUESTIONS.map((q, idx) => {
            const hasAnswered = !!answers[q._id];
            
            return (
              <div key={q._id} className={`bg-[#FEFAF7] p-8 rounded-4xl transition duration-300 ${hasAnswered ? 'border border-[#154D57]/20 shadow-sm' : 'border border-[#154D57]/30 shadow-xl hover:border-[#154D57]'}`}>
                <h3 className="text-xl font-bold text-[#154D57] mb-6 flex gap-3">
                  <span className="text-[#1C2321] font-black">{idx + 1}.</span> 
                  {q.questionText}
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

        {/* Submit Action */}
        <div className="mt-14 text-center pb-20">
          <button 
            onClick={handleSubmit}
            className="bg-[#154D57] hover:bg-[#1C2321] text-[#FEFAF7] px-12 py-5 rounded-full font-black text-xl shadow-xl transition-all transform hover:-translate-y-1 block mx-auto"
          >
            Submit Exam
          </button>
        </div>

      </div>
    </div>
  );
}
