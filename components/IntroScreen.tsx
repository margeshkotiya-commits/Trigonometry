import React, { useEffect, useState } from 'react';
import Image from 'next/image';

interface Props {
  onStart: () => void;
}

export default function IntroScreen({ onStart }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  return (
    <div className="h-screen w-screen bg-[#0B1B3D] flex flex-col items-center justify-center relative overflow-hidden font-sans">
      {/* Background Graphic */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.07]">
        <svg viewBox="0 0 100 100" className="w-[150vmin] h-[150vmin] sm:w-[100vmin] sm:h-[100vmin]">
          <circle cx="50" cy="50" r="40" fill="none" stroke="#FFD700" strokeWidth="0.5" />
          <line x1="10" y1="50" x2="90" y2="50" stroke="#FFD700" strokeWidth="0.5" />
          <line x1="50" y1="10" x2="50" y2="90" stroke="#FFD700" strokeWidth="0.5" />
          <circle cx="50" cy="50" r="20" fill="none" stroke="#FFD700" strokeWidth="0.5" strokeDasharray="2 2" />
          <path d="M 50 50 L 78.28 21.72" stroke="#FFD700" strokeWidth="0.5" />
          <path d="M 50 50 L 21.72 21.72" stroke="#FFD700" strokeWidth="0.5" />
          <path d="M 50 50 L 21.72 78.28" stroke="#FFD700" strokeWidth="0.5" />
          <path d="M 50 50 L 78.28 78.28" stroke="#FFD700" strokeWidth="0.5" />
          
          {/* Animated Radius */}
          <g style={{ transformOrigin: '50px 50px', animation: 'spin 25s linear infinite reverse' }}>
            <line x1="50" y1="50" x2="90" y2="50" stroke="#FFD700" strokeWidth="1" />
            <circle cx="90" cy="50" r="1.5" fill="#FFD700" />
          </g>
        </svg>
      </div>

      <div 
        className={`z-10 flex flex-col items-center text-center px-6 max-w-3xl transition-all duration-[1200ms] ease-out ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="mb-8 sm:mb-10">
          <Image 
            src="https://i.postimg.cc/vmPQhdZC/SEZ_1_(1).png" 
            alt="Shreeji Education Zone" 
            width={160} 
            height={160} 
            className="w-28 h-28 sm:w-36 sm:h-36 object-contain drop-shadow-2xl"
            referrerPolicy="no-referrer"
            priority
          />
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-white mb-4 sm:mb-6 tracking-tight leading-tight">
          Master Trigonometry Visually
        </h1>
        
        <h2 className="text-lg sm:text-xl md:text-2xl font-medium text-[#FFD700] mb-6 sm:mb-8">
          Understand the Unit Circle through Interactive Simulation
        </h2>
        
        <p className="text-sm sm:text-base md:text-lg text-slate-200/90 mb-10 sm:mb-12 max-w-2xl leading-relaxed">
          Explore angles, sine, cosine, and tangent by moving around the unit circle and connecting them to graphs.
        </p>

        <button 
          onClick={onStart}
          className="bg-[#FFD700] text-[#0B1B3D] px-8 sm:px-12 py-3.5 sm:py-4 rounded-2xl font-bold text-lg sm:text-xl transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(255,215,0,0.4)] active:scale-95 flex items-center justify-center gap-2"
        >
          Start Learning
        </button>

        <p className="mt-8 text-xs sm:text-sm text-slate-400 font-medium tracking-wide">
          Practice and graph mode unlock as you explore
        </p>
      </div>
    </div>
  );
}
