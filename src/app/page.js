"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { user, login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect logic temporarily disabled so you can preview the UI
    // if (user) {
    //   router.push('/dashboard');
    // }
  }, [user, router]);

  return (
    <div className="min-h-screen bg-[#FEFAF7] text-[#154D57] overflow-hidden relative font-sans">
      {/* Navbar - Only show if not logged in since global Navigation handles the rest */}
      {!user && (
        <nav className="relative z-10 container mx-auto px-6 py-8 flex justify-between items-center">
          <div className="text-3xl font-black tracking-tighter flex items-center gap-3">
            <div className="w-10 h-10 bg-[#154D57] text-[#FEFAF7] rounded-full flex items-center justify-center shadow-lg">
              <span className="text-xl">N</span>
            </div>
            <span className="text-[#154D57]">
              Nirvul
            </span>
          </div>
          <button
            onClick={login}
            className="bg-[#154D57] text-[#FEFAF7] hover:bg-[#1C2321] hover:text-[#FEFAF7] px-8 py-2.5 rounded-full font-bold shadow-lg transition-all duration-300"
          >
            Login
          </button>
        </nav>
      )}

      {/* Hero Section */}
      <main className="relative z-10 container mx-auto px-4 sm:px-6 pt-24 md:pt-40 pb-44 md:pb-32 text-center flex flex-col items-center">
        <div className="inline-block mb-6 md:mb-8 px-6 py-2.5 rounded-full bg-[#154D57]/5 text-[#154D57] shadow-sm border border-[#154D57]/20">
          <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em]">
            The Ultimate SSC MCQ Platform
          </p>
        </div>

        <h1 className="text-5xl sm:text-6xl md:text-8xl font-black mb-6 md:mb-8 leading-[1.15] tracking-tight text-[#154D57]">
          এসএসসি পরীক্ষার <br className="hidden sm:block" />
          <span className="text-[#1C2321]">
            পূর্ণাঙ্গ প্রস্তুতি
          </span>
        </h1>

        <p className="text-lg sm:text-xl md:text-2xl text-[#154D57]/70 mb-10 md:mb-14 max-w-2xl font-medium leading-relaxed px-2">
          মক টেস্ট দাও, নিজের ভুলগুলো শুধরে নাও এবং পরীক্ষার হলের আসল অভিজ্ঞতা
          উপভোগ করো নির্ভুল-এর সাথে।
        </p>

        <div className="flex flex-col sm:flex-row gap-5">
          <button
            onClick={login}
            className="flex items-center justify-center gap-4 bg-[#154D57] hover:bg-[#1C2321] text-[#FEFAF7] font-extrabold text-lg px-10 py-5 rounded-full shadow-[0_15px_30px_rgba(21,77,87,0.2)] transition-all duration-300 transform hover:-translate-y-1 group"
          >
            <svg
              className="w-7 h-7 bg-[#FEFAF7] rounded-full p-1 group-hover:bg-[#FFFFFF] transition-colors"
              viewBox="0 0 48 48"
            >
              <path
                fill="#154D57"
                className="group-hover:fill-[#1C2321] transition-colors"
                d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
              />
              <path
                fill="#154D57"
                className="group-hover:fill-[#1C2321] transition-colors"
                d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
              />
              <path
                fill="#154D57"
                className="group-hover:fill-[#1C2321] transition-colors"
                d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
              />
              <path
                fill="#154D57"
                className="group-hover:fill-[#1C2321] transition-colors"
                d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
              />
              <path fill="none" d="M0 0h48v48H0z" />
            </svg>
            Continue with Google
          </button>
        </div>
      </main>

      {/* Features Showcase */}
      <section className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 pb-44 md:pb-32">
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          <div className="bg-[#FEFAF7] rounded-4xl p-10 hover:-translate-y-2 transition-all duration-300 shadow-[0_15px_40px_rgba(21,77,87,0.08)] border border-[#154D57]/20 group hover:border-[#1C2321]">
            <div className="w-16 h-16 bg-[#154D57] rounded-2xl flex items-center justify-center mb-8 text-[#FEFAF7] shadow-md transition-colors group-hover:bg-[#1C2321]">
              <svg
                className="w-8 h-8"
                fill="currentColor"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-black mb-4 text-[#154D57]">Strict Timing</h3>
            <p className="text-[#154D57]/70 font-medium leading-relaxed transition-colors group-hover:text-[#154D57]">
              পরীক্ষার হলের মতো এক্সাক্ট টাইমার এবং অটো-সাবমিট ফাংশন।
            </p>
          </div>

          <div className="bg-[#FEFAF7] rounded-4xl p-10 hover:-translate-y-2 transition-all duration-300 shadow-[0_15px_40px_rgba(21,77,87,0.08)] border border-[#154D57]/20 group hover:border-[#1C2321]">
            <div className="w-16 h-16 bg-[#154D57] rounded-2xl flex items-center justify-center mb-8 text-[#FEFAF7] shadow-md transition-colors group-hover:bg-[#1C2321]">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-black mb-4 text-[#154D57]">Locked Choices</h3>
            <p className="text-[#154D57]/70 font-medium leading-relaxed transition-colors group-hover:text-[#154D57]">
              একবার উত্তর সিলেক্ট করলে আর পরিবর্তন করার সুযোগ নেই। শতভাগ নির্ভুল
              প্র্যাকটিস।
            </p>
          </div>

          <div className="bg-[#FEFAF7] rounded-4xl p-10 hover:-translate-y-2 transition-all duration-300 shadow-[0_15px_40px_rgba(21,77,87,0.08)] border border-[#154D57]/20 group hover:border-[#1C2321]">
            <div className="w-16 h-16 bg-[#154D57] rounded-2xl flex items-center justify-center mb-8 text-[#FEFAF7] shadow-md transition-colors group-hover:bg-[#1C2321]">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-black mb-4 text-[#154D57]">Instant Feedback</h3>
            <p className="text-[#154D57]/70 font-medium leading-relaxed transition-colors group-hover:text-[#154D57]">
              পরীক্ষা শেষ হওয়ার সাথে সাথেই ভুল-সঠিক বিশ্লেষণ ও লাইভ ড্যাশবোর্ড
              আপডেট।
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
