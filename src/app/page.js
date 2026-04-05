"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

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
    <div className="min-h-screen bg-linear-to-br from-[#0f172a] via-[#1e1b4b] to-[#0f172a] text-white overflow-hidden relative">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-600/20 blur-[120px]"></div>
        <div className="absolute top-[40%] -right-[10%] w-[40%] h-[60%] rounded-full bg-purple-600/20 blur-[120px]"></div>
      </div>

      {/* Navbar */}
      <nav className="relative z-10 container mx-auto px-6 py-6 flex justify-between items-center">
        <div className="text-3xl font-black tracking-tighter flex items-center gap-2">
          <div className="w-8 h-8 bg-linear-to-tr from-blue-500 to-purple-500 rounded-lg shadow-lg flex items-center justify-center">
            <span className="text-white text-xl">N</span>
          </div>
          <span className="bg-clip-text text-transparent bg-linear-to-r from-blue-400 to-purple-400">
            Nirvul
          </span>
        </div>
        <button
          onClick={login}
          className="bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md px-6 py-2 rounded-full font-semibold transition-all duration-300"
        >
          Login
        </button>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 container mx-auto px-6 pt-24 pb-32 text-center flex flex-col items-center">
        <div className="inline-block mb-6 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 backdrop-blur-sm">
          <p className="text-blue-300 text-sm font-semibold uppercase tracking-wider">
            The Ultimate SSC MCQ Platform
          </p>
        </div>

        <h1 className="text-6xl md:text-8xl font-extrabold mb-8 leading-tight tracking-tight">
          এসএসসি পরীক্ষার <br />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 via-purple-400 to-pink-400">
            পূর্ণাঙ্গ প্রস্তুতি
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl font-light">
          মক টেস্ট দাও, নিজের ভুলগুলো শুধরে নাও এবং পরীক্ষার হলের আসল অভিজ্ঞতা
          উপভোগ করো নির্ভুল-এর সাথে।
        </p>

        <div className="flex flex-col sm:flex-row gap-5">
          <button
            onClick={login}
            className="flex items-center justify-center gap-3 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-lg px-10 py-5 rounded-2xl shadow-[0_0_40px_rgba(79,70,229,0.4)] transition-all duration-300 transform hover:-translate-y-1"
          >
            <svg
              className="w-6 h-6 bg-white rounded-full p-1"
              viewBox="0 0 48 48"
            >
              <path
                fill="#EA4335"
                d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
              />
              <path
                fill="#4285F4"
                d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
              />
              <path
                fill="#FBBC05"
                d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
              />
              <path
                fill="#34A853"
                d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
              />
              <path fill="none" d="M0 0h48v48H0z" />
            </svg>
            Continue with Google
          </button>
        </div>
      </main>

      {/* Features Showcase */}
      <section className="relative z-10 w-full max-w-6xl mx-auto px-6 pb-32">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl hover:bg-white/10 transition-colors">
            <div className="w-14 h-14 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6 text-blue-400">
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
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold mb-3">Strict Timing</h3>
            <p className="text-gray-400">
              পরীক্ষার হলের মতো এক্সাক্ট টাইমার এবং অটো-সাবমিট ফাংশন।
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl hover:bg-white/10 transition-colors">
            <div className="w-14 h-14 bg-purple-500/20 rounded-2xl flex items-center justify-center mb-6 text-purple-400">
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
            <h3 className="text-2xl font-semibold mb-3">Locked Choices</h3>
            <p className="text-gray-400">
              একবার উত্তর সিলেক্ট করলে আর পরিবর্তন করার সুযোগ নেই। শতভাগ নির্ভুল
              প্র্যাকটিস।
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl hover:bg-white/10 transition-colors">
            <div className="w-14 h-14 bg-pink-500/20 rounded-2xl flex items-center justify-center mb-6 text-pink-400">
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
            <h3 className="text-2xl font-semibold mb-3">Instant Feedback</h3>
            <p className="text-gray-400">
              পরীক্ষা শেষ হওয়ার সাথে সাথেই ভুল-সঠিক বিশ্লেষণ ও লাইভ ড্যাশবোর্ড
              আপডেট।
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
