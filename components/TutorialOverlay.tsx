import React from 'react';
import { X, ChevronRight, Check } from 'lucide-react';

interface Props {
  step: number;
  setStep: (step: number) => void;
}

const TUTORIAL_STEPS = [
  {
    title: "Welcome to Interactive Trig!",
    content: "This simulation helps you visualize how trigonometric functions work on the Unit Circle and their corresponding graphs.",
  },
  {
    title: "The Unit Circle",
    content: "This circle has a radius of 1. You can drag the red point around the circle to change the angle (θ).",
  },
  {
    title: "Trigonometric Values",
    content: "The coordinates of the point (x, y) correspond to (cos θ, sin θ). Watch how these values change as you move the point.",
  },
  {
    title: "Graph Synchronization",
    content: "The graphs below plot the values of sin, cos, and tan as the angle increases from 0 to 360° (2π radians).",
  },
  {
    title: "Controls",
    content: "Use these controls to toggle functions on/off, show special angles, or play an automatic animation.",
  }
];

export default function TutorialOverlay({ step, setStep }: Props) {
  if (step === 0 || step > TUTORIAL_STEPS.length) return null;

  const currentStep = TUTORIAL_STEPS[step - 1];
  const isLast = step === TUTORIAL_STEPS.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none p-4">
      <div className="absolute inset-0 bg-slate-900/40 pointer-events-auto backdrop-blur-sm transition-opacity" onClick={() => setStep(0)} />
      
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6 max-w-md w-full relative z-10 pointer-events-auto border border-slate-100 dark:border-slate-700 transform transition-all duration-300">
        <button 
          onClick={() => setStep(0)}
          className="absolute top-4 right-4 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-full p-1 transition-colors"
        >
          <X size={20} />
        </button>
        
        <div className="mb-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm uppercase tracking-wider">
          Step {step} of {TUTORIAL_STEPS.length}
        </div>
        
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3">{currentStep.title}</h3>
        <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
          {currentStep.content}
        </p>
        
        <div className="flex justify-between items-center">
          <div className="flex gap-1.5">
            {TUTORIAL_STEPS.map((_, i) => (
              <div key={i} className={`h-2 rounded-full transition-all ${i + 1 === step ? 'w-6 bg-indigo-600 dark:bg-indigo-500' : 'w-2 bg-slate-200 dark:bg-slate-600'}`} />
            ))}
          </div>
          
          <button 
            onClick={() => setStep(isLast ? 0 : step + 1)}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 dark:bg-indigo-500 text-white rounded-xl font-medium hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors shadow-sm shadow-indigo-200 dark:shadow-indigo-900/50"
          >
            {isLast ? (
              <>Finish <Check size={18} /></>
            ) : (
              <>Next <ChevronRight size={18} /></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
