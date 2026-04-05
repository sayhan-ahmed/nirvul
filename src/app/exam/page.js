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

  if (loading || !user) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  // View: Exam Result
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 py-10 px-4 flex justify-center items-start">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-3xl">
          <div className="text-center mb-8 border-b pb-6">
            <h1 className="text-4xl font-extrabold text-blue-600 mb-2">Exam Result</h1>
            <p className="text-xl text-gray-700">You scored <span className="font-bold text-blue-600">{score}</span> out of {DUMMY_QUESTIONS.length}</p>
          </div>

          <div className="space-y-6">
            {DUMMY_QUESTIONS.map((q, idx) => {
              const selected = answers[q._id];
              const isCorrect = selected === q.correctAnswer;
              
              return (
                <div key={q._id} className={`p-5 rounded-xl border-l-4 ${isCorrect ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}`}>
                  <h3 className="font-semibold text-lg text-gray-800 mb-3">{idx + 1}. {q.questionText}</h3>
                  <div className="text-sm">
                    <p className="mb-1 text-gray-600">Your Answer: <span className={`font-semibold ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>{selected || "Not Answered"}</span></p>
                    {!isCorrect && (
                      <p className="font-semibold text-green-600">Correct Answer: {q.correctAnswer}</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-8 flex justify-center">
            <Link href="/dashboard" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-bold shadow-lg transition">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // View: Active Exam
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        
        {/* Header / Timer Component */}
        <div className="sticky top-4 bg-white p-4 rounded-xl shadow-lg border-t-4 border-blue-600 flex justify-between items-center mb-8 z-10">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Bangla 2nd Paper</h1>
            <p className="text-sm text-gray-500">Student: {user.displayName}</p>
          </div>
          <div className="bg-blue-50 px-5 py-2 rounded-lg flex items-center gap-3">
             <svg className={`w-6 h-6 ${timeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-blue-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
             <span className={`text-2xl font-black tracking-wider ${timeLeft < 60 ? 'text-red-500' : 'text-blue-700'}`}>
               {formatTime(timeLeft)}
             </span>
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-8">
          {DUMMY_QUESTIONS.map((q, idx) => {
            const hasAnswered = !!answers[q._id];
            
            return (
              <div key={q._id} className={`bg-white p-6 rounded-2xl shadow-sm transition duration-300 ${hasAnswered ? 'border border-blue-100 ring-2 ring-blue-50 ring-opacity-50' : 'border border-gray-100'}`}>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex gap-2">
                  <span className="text-blue-600">{idx + 1}.</span> 
                  {q.questionText}
                </h3>
                
                <div className="grid sm:grid-cols-2 gap-3">
                  {q.options.map((opt, oIdx) => {
                    const isSelected = answers[q._id] === opt;
                    
                    return (
                      <button
                        key={oIdx}
                        disabled={hasAnswered}
                        onClick={() => handleSelectOption(q._id, opt)}
                        className={`text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                          isSelected 
                            ? 'bg-blue-600 border-blue-600 text-white shadow-md transform scale-[1.02]' 
                            : hasAnswered
                              ? 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed opacity-70'
                              : 'bg-white border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 ${isSelected ? 'border-white' : 'border-gray-300'}`}>
                            {isSelected && <div className="w-2.5 h-2.5 bg-white rounded-full"></div>}
                          </div>
                          <span className="font-medium">{opt}</span>
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
        <div className="mt-12 text-center pb-20">
          <button 
            onClick={handleSubmit}
            className="bg-green-600 hover:bg-green-700 text-white px-10 py-4 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition transform hover:-translate-y-1"
          >
            Submit Exam
          </button>
        </div>

      </div>
    </div>
  );
}
