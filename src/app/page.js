"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FiClock, FiLock, FiCheckCircle } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";

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
            <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg overflow-hidden border-2 border-[#154D57] bg-[#FEFAF7]">
              <img src="/logo.svg" alt="Nirvul Logo" className="w-[80%] h-[80%] object-contain" />
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
      <main className={`relative z-10 container mx-auto px-4 sm:px-6 text-center flex flex-col items-center transition-all duration-500 ${
        user ? 'pt-32 md:pt-40 pb-24 md:pb-32' : 'pt-12 md:pt-14 pb-24 md:pb-32'
      }`}>
        <div className="inline-block mb-6 md:mb-8 px-6 py-2.5 rounded-full bg-[#154D57]/5 text-[#154D57] shadow-sm border border-[#154D57]/20">
          <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em]">
            The Ultimate MCQ Practice Platform
          </p>
        </div>

        <h1 className="text-5xl sm:text-6xl md:text-8xl font-black mb-6 md:mb-8 leading-[1.15] tracking-tight text-[#154D57]">
          এমসিকিউ পরীক্ষার <br className="hidden sm:block" />
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
            className="flex items-center justify-center gap-4 bg-[#154D57] hover:bg-[#1C2321] text-[#FEFAF7] font-extrabold text-lg px-10 py-4 rounded-full shadow-[0_15px_30px_rgba(21,77,87,0.2)] transition-all duration-300 transform hover:-translate-y-1 group"
          >
            <div className="bg-white rounded-full p-[2px] shadow-sm flex items-center justify-center">
              <FcGoogle className="w-6 h-6" />
            </div>
            Continue with Google
          </button>
        </div>
      </main>

      {/* Features Showcase */}
      <section className={`relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 transition-all duration-500 ${
        user ? 'pb-44 md:pb-32' : 'pb-24 md:pb-32'
      }`}>
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          <div className="bg-[#FEFAF7] rounded-4xl p-10 hover:-translate-y-2 transition-all duration-300 shadow-[0_15px_40px_rgba(21,77,87,0.08)] border border-[#154D57]/20 group hover:border-[#1C2321]">
            <div className="w-16 h-16 bg-[#154D57] rounded-2xl flex items-center justify-center mb-8 text-[#FEFAF7] shadow-md transition-colors group-hover:bg-[#1C2321]">
              <FiClock className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black mb-4 text-[#154D57]">Strict Timing</h3>
            <p className="text-[#154D57]/70 font-medium leading-relaxed transition-colors group-hover:text-[#154D57]">
              পরীক্ষার হলের মতো এক্সাক্ট টাইমার এবং অটো-সাবমিট ফাংশন।
            </p>
          </div>

          <div className="bg-[#FEFAF7] rounded-4xl p-10 hover:-translate-y-2 transition-all duration-300 shadow-[0_15px_40px_rgba(21,77,87,0.08)] border border-[#154D57]/20 group hover:border-[#1C2321]">
            <div className="w-16 h-16 bg-[#154D57] rounded-2xl flex items-center justify-center mb-8 text-[#FEFAF7] shadow-md transition-colors group-hover:bg-[#1C2321]">
              <FiLock className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black mb-4 text-[#154D57]">Locked Choices</h3>
            <p className="text-[#154D57]/70 font-medium leading-relaxed transition-colors group-hover:text-[#154D57]">
              একবার উত্তর সিলেক্ট করলে আর পরিবর্তন করার সুযোগ নেই। শতভাগ নির্ভুল
              প্র্যাকটিস।
            </p>
          </div>

          <div className="bg-[#FEFAF7] rounded-4xl p-10 hover:-translate-y-2 transition-all duration-300 shadow-[0_15px_40px_rgba(21,77,87,0.08)] border border-[#154D57]/20 group hover:border-[#1C2321]">
            <div className="w-16 h-16 bg-[#154D57] rounded-2xl flex items-center justify-center mb-8 text-[#FEFAF7] shadow-md transition-colors group-hover:bg-[#1C2321]">
              <FiCheckCircle className="w-8 h-8" />
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
