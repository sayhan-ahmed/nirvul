"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";

export default function SuggestionsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push("/");
  }, [user, loading, router]);

  if (loading || !user) return null;

  return (
    <div className="min-h-screen bg-[#FEFAF7] text-[#154D57] font-sans flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full">
        <h1 className="text-4xl md:text-5xl font-light mb-6 tracking-tight">
          Suggestions
        </h1>
        <p className="text-sm md:text-lg font-bold uppercase tracking-[0.4em] opacity-30 mb-12">
          Coming Soon
        </p>

        <Link
          href="/dashboard"
          className="inline-flex bg-[#154D57] text-[#FEFAF7] items-center gap-2 hover:bg-[#1C2321] transition-colors duration-300 font-bold uppercase tracking-widest text-[11px] md:text-[13px] px-5 py-3 rounded-full"
        >
          <FiArrowLeft className="w-3 h-3 md:w-4 md:h-4" />
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
