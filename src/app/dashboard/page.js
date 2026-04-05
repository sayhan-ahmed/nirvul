"use client";

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function Dashboard() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm mb-8">
          <div className="flex items-center gap-4">
            {user.photoURL && <img src={user.photoURL} alt="Profile" className="w-12 h-12 rounded-full shadow" />}
            <div>
              <h2 className="text-2xl font-bold">Welcome, {user.displayName}</h2>
              <p className="text-gray-500 text-sm">{user.email}</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="bg-red-50 text-red-600 hover:bg-red-100 font-semibold py-2 px-4 rounded-lg transition"
          >
            Logout
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-blue-600 mb-2">Bangla 2nd Paper MCQ</h3>
              <p className="text-gray-600 mb-6">Test your skills with randomized questions. Time limit is strictly monitored and once selected, answers cannot be changed.</p>
            </div>
            <Link href="/exam" className="text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition shadow-md">
              Start Exam Now
            </Link>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Past Results</h3>
            {/* We will fetch and display results here later */}
            <div className="border-t pt-4">
              <p className="text-gray-500 text-center py-4">No exam records found yet.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
