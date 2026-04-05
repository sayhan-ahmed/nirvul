"use client";

import React, { useEffect, useState } from 'react';
import { FiAlertCircle, FiX } from 'react-icons/fi';

export default function ConfirmationModal({ title, message, onConfirm, onClose }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div className={`fixed inset-0 z-1000 flex items-center justify-center p-4 transition-all duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#0A1A1F]/60 backdrop-blur-sm"
        onClick={handleClose}
      ></div>

      {/* Modal Box */}
      <div 
        className={`relative w-full max-w-md bg-white rounded-[2.5rem] p-8 md:p-10 shadow-2xl transition-all duration-300 border border-[#154D57]/10
          ${isVisible ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-8 scale-95 opacity-0'}`}
      >
        <button 
          onClick={handleClose}
          className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"
        >
          <FiX className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-[#154D57]/5 rounded-3xl flex items-center justify-center text-[#154D57] mb-6">
            <FiAlertCircle className="w-10 h-10" />
          </div>
          
          <h3 className="text-2xl font-black text-[#154D57] mb-3">{title || "Confirm Action"}</h3>
          <p className="text-gray-500 font-medium leading-relaxed mb-10">
            {message || "Are you sure you want to proceed with this action? This cannot be undone."}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <button 
              onClick={handleClose}
              className="flex-1 py-4 rounded-2xl border-2 border-gray-100 text-gray-400 font-black text-sm hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button 
              onClick={onConfirm}
              className="flex-1 py-4 rounded-2xl bg-[#154D57] text-white font-black text-sm shadow-xl shadow-[#154D57]/20 hover:bg-[#0A1A1F] hover:-translate-y-0.5 transition-all"
            >
              Proceed
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
