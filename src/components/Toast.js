"use client";

import React, { useEffect, useState } from 'react';
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from 'react-icons/fi';

const TOAST_THEMES = {
  success: {
    bg: 'bg-[#154D57]/90',
    accent: 'bg-emerald-400',
    icon: <FiCheckCircle className="w-5 h-5" />,
    label: 'SUCCESS',
    gradient: 'from-[#154D57] to-[#1a5f6b]'
  },
  error: {
    bg: 'bg-rose-600/90',
    accent: 'bg-white',
    icon: <FiAlertCircle className="w-5 h-5" />,
    label: 'ERROR',
    gradient: 'from-rose-600 to-rose-500'
  },
  warning: {
    bg: 'bg-amber-500/90',
    accent: 'bg-white',
    icon: <FiAlertCircle className="w-5 h-5" />,
    label: 'ATTENTION',
    gradient: 'from-amber-600 to-amber-500'
  },
  info: {
    bg: 'bg-sky-500/90',
    accent: 'bg-white',
    icon: <FiInfo className="w-5 h-5" />,
    label: 'INFO',
    gradient: 'from-sky-600 to-sky-500'
  }
};

export default function Toast({ message, type = 'info', onClose, duration = 3000 }) {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(100);
  const theme = TOAST_THEMES[type] || TOAST_THEMES.info;

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 10);
    
    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.max(0, prev - (100 / (duration / 100))));
    }, 100);

    const autoClose = setTimeout(() => {
      handleClose();
    }, duration);

    return () => {
      clearTimeout(timer);
      clearTimeout(autoClose);
      clearInterval(progressInterval);
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 400); 
  };

  return (
    <div 
      className={`fixed top-8 right-8 z-10000 transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1) flex flex-col overflow-hidden min-w-[320px] max-w-[90vw] rounded-3xl backdrop-blur-2xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.2)]
        ${isVisible ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-12 opacity-0 scale-90'}
        ${theme.bg} text-white`}
    >
      <div className={`absolute inset-0 bg-linear-to-r ${theme.gradient} opacity-20`} />
      
      <div className="relative flex items-center gap-4 px-6 py-4">
        <div className={`p-2.5 rounded-xl ${theme.accent} bg-opacity-20 flex items-center justify-center`}>
          <div className={theme.type === 'success' ? 'text-emerald-400' : 'text-white'}>
            {theme.icon}
          </div>
        </div>
        
        <div className="flex-1">
          <h4 className="text-[9px] font-black uppercase tracking-[0.2em] opacity-50 leading-none mb-1.5 font-mono">
            {theme.label}
          </h4>
          <p className="text-[13px] font-bold leading-tight tracking-tight">{message}</p>
        </div>

        <button 
          onClick={handleClose}
          className="p-1.5 hover:bg-white/10 rounded-lg transition-colors group"
        >
          <FiX className="w-4 h-4 opacity-50 group-hover:opacity-100" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="h-[3px] w-full bg-white/10 absolute bottom-0 left-0">
        <div 
          className={`h-full ${theme.accent} transition-all duration-100 linear`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
