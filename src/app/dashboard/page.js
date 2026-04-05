"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import StudentDashboard from "@/components/StudentDashboard";
import AdminDashboard from "@/components/AdminDashboard";

import DashboardLayout from "@/components/DashboardLayout";

export default function Dashboard() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FEFAF7]">
        <div className="w-12 h-12 border-4 border-[#154D57]/10 border-t-[#154D57] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="mb-6 md:mb-10 pl-1 text-center md:text-left">
          <h1 className="text-2xl md:text-5xl font-black text-[#1C2321] tracking-tight">
            Welcome Back,{" "}
            <span className="text-[#154D57]">
              {user.displayName?.split(" ")[0]}!
            </span>
          </h1>
          <p className="text-sm md:text-base text-[#154D57]/40 font-bold mt-2 tracking-wide">
            {user.role === "admin"
              ? "Manage your exams and student progress."
              : "Your next goal is just one test away."}
          </p>
        </div>

        {user.role === "admin" ? (
          <AdminDashboard user={user} logout={logout} />
        ) : (
          <StudentDashboard user={user} logout={logout} />
        )}
      </div>
    </DashboardLayout>
  );
}
