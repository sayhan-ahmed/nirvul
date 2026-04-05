"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { FiMessageSquare, FiArrowLeft } from "react-icons/fi";

export default function SuggestionsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center bg-[#FEFAF7] text-[#154D57] font-bold p-20">
        Loading...
      </div>
    );
  }

  return (
    <div className="bg-[#FEFAF7] text-[#154D57] p-6 lg:p-8 pt-0 pb-44 md:pb-32 font-sans relative flex flex-col items-center text-center">
      {/* Top Spacer for Fixed Nav */}
      <div className="h-40 w-full shrink-0"></div>

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Icon Container */}
        <div className="mb-10 inline-flex items-center justify-center w-24 h-24 bg-[#154D57] text-[#FEFAF7] rounded-[2.5rem] shadow-[0_20px_40px_rgba(21,77,87,0.2)] animate-bounce">
          <FiMessageSquare className="w-10 h-10" />
        </div>

        {/* Text Content */}
        <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight text-[#154D57]">
          Suggestions <br />
          <span className="text-[#1C2321]">Coming Soon</span>
        </h1>

        <p className="text-xl md:text-2xl text-[#154D57]/70 mb-12 font-medium leading-relaxed">
          আমরা কাজ করছি আপনাকে সেরা সাজেশন এবং গাইডলাইন দেওয়ার জন্য। খুব শীঘ্রই
          এখানে পরীক্ষার জন্য গুরুত্বপূর্ণ টপিক এবং বিশেষজ্ঞ পরামর্শ পাওয়া যাবে।
        </p>

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/dashboard"
            className="flex items-center justify-center gap-3 bg-[#154D57] hover:bg-[#1C2321] text-[#FEFAF7] font-extrabold text-lg px-10 py-4 rounded-full shadow-xl transition-all transform hover:-translate-y-1"
          >
            <FiArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </Link>
        </div>

        {/* Decorative Elements */}
        <div className="mt-16 pt-8 border-t border-[#154D57]/10">
          <p className="text-[#154D57]/40 font-bold uppercase tracking-[0.3em] text-xs">
            Refining the best experience for you
          </p>
        </div>
      </div>
    </div>
  );
}
