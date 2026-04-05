"use client";

import React, { useEffect, useState } from 'react';
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from 'react-icons/fi';

const TOAST_THEMES = {
  success: {
    bg: 'bg-emerald-500/90',
    icon: <FiCheckCircle className="w-5 h-5" />,
    label: 'Success'
  },
  error: {
    bg: 'bg-rose-500/90',
    icon: <FiAlertCircle className="w-5 h-5" />,
    label: 'Error'
  },
  warning: {
    bg: 'bg-amber-500/90',
    icon: <FiAlertCircle className="w-5 h-5" />,
    label: 'Attention'
  },
  info: {
    bg: 'bg-sky-500/90',
    icon: <FiInfo className="w-5 h-5" />,
    label: 'Notification'
  }
};

export default function Toast({ message, type = 'info', onClose }) {
  const [isVisible, setIsVisible] = useState(false);
  const theme = TOAST_THEMES[type] || TOAST_THEMES.info;

  useEffect(() => {
    // Entrance animation delay to ensure component mount
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 400); // Wait for exit animation
  };

  return (
    <div 
      className={`fixed top-10 left-1/2 -translate-x-1/2 z-999 transition-all duration-500 ease-out flex items-center gap-4 px-6 py-4 rounded-3xl backdrop-blur-xl border border-white/20 shadow-2xl min-w-[300px] max-w-[90vw]
        ${isVisible ? 'translate-y-0 opacity-100 scale-100' : '-translate-y-10 opacity-0 scale-95'}
        ${theme.bg} text-white`}
    >
      <div className="flex items-center gap-4 flex-1">
        <div className="bg-white/20 p-2 rounded-xl">
          {theme.icon}
        </div>
        <div>
          <h4 className="text-[10px] font-black uppercase tracking-widest opacity-60 leading-none mb-1">
            {theme.label}
          </h4>
          <p className="text-sm font-bold leading-tight">{message}</p>
        </div>
      </div>
      <button 
        onClick={handleClose}
        className="p-1 hover:bg-white/20 rounded-lg transition-colors"
      >
        <FiX className="w-4 h-4" />
      </button>
    </div>
  );
}
