"use client";

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { FiBookOpen, FiActivity } from 'react-icons/fi';

export default function Dashboard() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <div className="min-h-screen flex items-center justify-center bg-[#FEFAF7] text-[#154D57] font-bold">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#FEFAF7] text-[#154D57] p-6 lg:p-8 pt-32 md:pt-32 pb-44 md:pb-28 font-sans relative">
      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Profile Card */}
        <div className="flex justify-between items-center bg-[#FEFAF7] p-8 rounded-4xl shadow-[0_15px_40px_rgba(21,77,87,0.08)] mb-10 border border-[#154D57]/20">
          <div className="flex items-center gap-6">
            {user.photoURL ? (
              <img src={user.photoURL} alt="Profile" className="w-16 h-16 rounded-full shadow-md border-4 border-[#154D57]" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-[#154D57] flex items-center justify-center text-[#FEFAF7] text-2xl font-bold shadow-md">
                {user.displayName?.charAt(0) || 'U'}
              </div>
            )}
            <div>
              <h2 className="text-3xl font-black text-[#154D57]">Welcome, {user.displayName}</h2>
              <p className="text-[#154D57]/60 font-bold mt-1 tracking-wider">{user.email}</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="md:hidden bg-[#1C2321]/5 text-[#154D57] hover:bg-[#1C2321] hover:text-[#FEFAF7] font-bold py-2 px-4 rounded-xl transition-colors"
          >
            Logout
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          
          {/* Exam Card */}
          <div className="bg-[#FEFAF7] p-8 rounded-4xl shadow-[0_15px_40px_rgba(21,77,87,0.08)] border border-[#154D57]/20 flex flex-col justify-between hover:border-[#154D57] transition-colors group">
            <div>
              <div className="w-14 h-14 bg-[#154D57] rounded-2xl flex items-center justify-center text-[#FEFAF7] mb-6 shadow-md transition-colors group-hover:bg-[#1C2321]">
                 <FiBookOpen className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-black text-[#154D57] mb-3">Bangla 2nd Paper MCQ</h3>
              <p className="text-[#154D57]/70 font-medium mb-8 leading-relaxed">Test your skills with randomized questions. Time limit is strictly monitored and once selected, answers cannot be changed.</p>
            </div>
            <Link href="/tests" className="text-center bg-[#154D57] hover:bg-[#1C2321] text-[#FEFAF7] font-extrabold py-4 px-6 rounded-2xl shadow-lg transition-colors transform hover:-translate-y-1">
              Start Exam Now
            </Link>
          </div>

          {/* Results Card */}
          <div className="bg-[#FEFAF7] p-8 rounded-4xl shadow-[0_15px_40px_rgba(21,77,87,0.08)] border border-[#154D57]/20">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-[#1C2321] rounded-2xl flex items-center justify-center text-[#FEFAF7] shadow-md">
                <FiActivity className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-black text-[#154D57]">Past Results</h3>
            </div>
            {/* We will fetch and display results here later */}
            <div className="bg-[#154D57]/5 border border-[#154D57]/10 rounded-2xl p-8 text-center">
              <p className="text-[#154D57]/50 font-bold">No exam records found yet.</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
