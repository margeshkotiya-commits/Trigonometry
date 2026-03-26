'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import UnitCircle from './UnitCircle';
import TrigGraph from './TrigGraph';
import Controls from './Controls';
import ValuesPanel from './ValuesPanel';
import GamePanel from './GamePanel';
import TutorialOverlay from './TutorialOverlay';
import ExplanationModal from './ExplanationModal';
import { Gamepad2, Compass, Maximize2, Minimize2 } from 'lucide-react';
import { Mode } from '../lib/trig';

export type ActiveFunctions = { sin: boolean; cos: boolean; tan: boolean };
export type Options = { specialAngles: boolean; labels: boolean; grid: boolean; triangle: boolean };

export default function TrigSimulation() {
  const [isMounted, setIsMounted] = useState(false);
  const [angle, setAngle] = useState(Math.PI / 4); // 45 degrees
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed] = useState(0.5); // radians per second
  const [activeFunctions, setActiveFunctions] = useState<ActiveFunctions>({ sin: true, cos: true, tan: false });
  const [options, setOptions] = useState<Options>({ specialAngles: true, labels: true, grid: true, triangle: true });
  const [tutorialStep, setTutorialStep] = useState(0);
  const [mode, setMode] = useState<Mode>('explore');
  const [showExplanation, setShowExplanation] = useState(false);
  const [isGraphExpanded, setIsGraphExpanded] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    const animate = (time: number) => {
      if (isPlaying) {
        const deltaTime = time - lastTime;
        setAngle((prev) => {
          let newAngle = prev + (speed * deltaTime) / 1000;
          if (newAngle >= 2 * Math.PI) newAngle -= 2 * Math.PI;
          return newAngle;
        });
      }
      lastTime = time;
      animationFrameId = requestAnimationFrame(animate);
    };

    if (isPlaying && mode !== 'practice') {
      animationFrameId = requestAnimationFrame(animate);
    }

    return () => cancelAnimationFrame(animationFrameId);
  }, [isPlaying, speed, mode]);

  useEffect(() => {
    if (mode === 'practice') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsPlaying(false);
    }
  }, [mode]);

  if (!isMounted) {
    return (
      <div className="h-screen w-screen bg-[#f4f1de] flex items-center justify-center overflow-hidden">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <div className="text-slate-500 font-medium">Loading simulation...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#f4f1de] p-2 sm:p-3 md:p-4 font-sans text-slate-800 flex flex-col gap-2 sm:gap-3 md:gap-4">
      <header className="shrink-0 flex justify-between items-center bg-white rounded-2xl shadow-md p-2 sm:p-3 md:p-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <Image src="https://i.postimg.cc/vmPQhdZC/SEZ_1_(1).png" alt="Logo" width={48} height={48} className="h-8 sm:h-10 md:h-12 w-auto object-contain" referrerPolicy="no-referrer" />
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800 truncate">Interactive Trigonometry</h1>
        </div>
        <div className="flex gap-1 sm:gap-2 shrink-0">
          <button 
            onClick={() => setMode('explore')}
            className={`px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm md:text-base font-medium transition-colors flex items-center gap-1 sm:gap-2 ${mode === 'explore' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            <Compass className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Explore</span>
          </button>
          <button 
            onClick={() => setMode('practice')}
            className={`px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm md:text-base font-medium transition-colors flex items-center gap-1 sm:gap-2 ${mode === 'practice' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            <Gamepad2 className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Practice</span>
          </button>
          <button 
            onClick={() => setTutorialStep(1)}
            className="px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-slate-100 text-slate-600 rounded-xl text-xs sm:text-sm md:text-base font-medium hover:bg-slate-200 transition-colors"
          >
            Tutorial
          </button>
        </div>
      </header>
      
      <div className="flex-grow min-h-0 flex flex-col gap-2 sm:gap-3 md:gap-4">
        {/* Top Section */}
        <div className={`${isGraphExpanded ? 'hidden' : 'flex-[5]'} min-h-0 grid grid-cols-2 grid-rows-[minmax(0,3fr)_minmax(0,2fr)] lg:grid-cols-12 lg:grid-rows-1 gap-2 sm:gap-3 md:gap-4`}>
          {/* Left Panel */}
          <div className="col-span-1 lg:col-span-3 bg-white rounded-2xl shadow-md p-2 sm:p-3 md:p-4 min-h-0 overflow-y-auto flex flex-col order-2 lg:order-1 relative">
            {mode === 'practice' ? (
              <GamePanel setAngle={setAngle} setActiveFunctions={setActiveFunctions} />
            ) : (
              <ValuesPanel angle={angle} activeFunctions={activeFunctions} onExplain={() => setShowExplanation(true)} />
            )}
          </div>
          
          {/* Center Circle */}
          <div className="col-span-2 lg:col-span-6 bg-white rounded-2xl shadow-md p-2 sm:p-3 md:p-4 flex items-center justify-center min-h-0 min-w-0 order-1 lg:order-2">
            <UnitCircle angle={angle} setAngle={setAngle} activeFunctions={activeFunctions} options={options} />
          </div>

          {/* Right Panel */}
          <div className="col-span-1 lg:col-span-3 bg-white rounded-2xl shadow-md p-2 sm:p-3 md:p-4 min-h-0 overflow-y-auto flex flex-col order-3 lg:order-3 relative">
            <Controls 
              isPlaying={isPlaying} 
              setIsPlaying={setIsPlaying}
              activeFunctions={activeFunctions}
              setActiveFunctions={setActiveFunctions}
              options={options}
              setOptions={setOptions}
              setAngle={setAngle}
            />
          </div>
        </div>

        {/* Bottom Graph Panel */}
        <div className={`${isGraphExpanded ? 'fixed inset-2 sm:inset-4 z-50 shadow-2xl' : 'flex-[4] shadow-md'} min-h-0 bg-white rounded-2xl p-2 sm:p-3 md:p-4 flex flex-col transition-all duration-300`}>
          <div className="flex justify-between items-center mb-1 sm:mb-2 shrink-0">
            <h2 className="text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-wider">Graphs</h2>
            <button 
              onClick={() => setIsGraphExpanded(!isGraphExpanded)}
              className="px-2 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              {isGraphExpanded ? (
                <><Minimize2 className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Collapse Graph</span></>
              ) : (
                <><Maximize2 className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Expand Graph</span></>
              )}
            </button>
          </div>
          <div className="flex-grow min-h-0 overflow-hidden relative rounded-xl border border-slate-100 bg-slate-50/50 w-full h-full flex items-center justify-center">
            <TrigGraph angle={angle} activeFunctions={activeFunctions} isExpanded={isGraphExpanded} />
            
            {/* Mini Unit Circle when expanded */}
            {isGraphExpanded && (
              <div className="absolute top-2 right-2 sm:top-4 sm:right-4 w-28 h-28 sm:w-48 sm:h-48 bg-white/90 backdrop-blur-md rounded-xl border border-slate-200 shadow-lg p-1 sm:p-2 z-10">
                <UnitCircle angle={angle} setAngle={setAngle} activeFunctions={activeFunctions} options={{...options, labels: false}} />
              </div>
            )}
          </div>
        </div>
        
        {/* Backdrop for expanded mode */}
        {isGraphExpanded && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40" onClick={() => setIsGraphExpanded(false)} />
        )}
      </div>

      {tutorialStep > 0 && (
        <TutorialOverlay step={tutorialStep} setStep={setTutorialStep} />
      )}
      
      {showExplanation && (
        <ExplanationModal angle={angle} onClose={() => setShowExplanation(false)} />
      )}
    </div>
  );
}
