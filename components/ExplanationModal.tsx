import React from 'react';
import { X } from 'lucide-react';
import { SPECIAL_ANGLES_DATA } from '../lib/trig';
import { motion } from 'motion/react';

interface Props {
  angle: number;
  onClose: () => void;
}

export default function ExplanationModal({ angle, onClose }: Props) {
  let normalized = angle % (2 * Math.PI);
  if (normalized < 0) normalized += 2 * Math.PI;
  let deg = Math.round(normalized * 180 / Math.PI);
  if (deg === 360) deg = 0;

  const specialAngle = SPECIAL_ANGLES_DATA.find(a => a.deg === deg);
  
  const sinVal = Math.sin(angle);
  const cosVal = Math.cos(angle);
  const tanVal = Math.tan(angle);

  const xStr = specialAngle ? specialAngle.cos : cosVal.toFixed(3);
  const yStr = specialAngle ? specialAngle.sin : sinVal.toFixed(3);
  const tanStr = specialAngle ? specialAngle.tan : (Math.abs(tanVal) > 100 ? '±∞' : tanVal.toFixed(3));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm pointer-events-auto" onClick={onClose} />
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-4 sm:p-6 max-w-lg w-full relative z-10 pointer-events-auto border border-slate-100 dark:border-slate-700 flex flex-col gap-4 max-h-[90vh] overflow-y-auto transition-colors duration-300">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-full p-1 transition-colors"><X size={20} /></button>
        
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 pr-8">Understanding {deg}°</h2>
        
        <div className="flex flex-col gap-6">
          {/* Step 1 */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col gap-2"
          >
            <h3 className="font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider text-sm">Step 1: The Triangle</h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm">
              Imagine a right triangle inside the unit circle. The hypotenuse (longest side) is always the radius of the circle, which is <strong>1</strong>.
            </p>
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700 flex justify-center transition-colors duration-300">
              <svg viewBox="-1.2 -1.2 2.4 2.4" className="w-32 h-32 overflow-visible">
                <circle cx="0" cy="0" r="1" fill="none" stroke="#cbd5e1" strokeWidth="0.02" />
                <line x1="-1.2" y1="0" x2="1.2" y2="0" stroke="#94a3b8" strokeWidth="0.02" />
                <line x1="0" y1="-1.2" x2="0" y2="1.2" stroke="#94a3b8" strokeWidth="0.02" />
                
                <path d={`M 0 0 L ${cosVal} ${-sinVal} L ${cosVal} 0 Z`} fill="rgba(99, 102, 241, 0.1)" stroke="#6366f1" strokeWidth="0.02" />
                <line x1="0" y1="0" x2={cosVal} y2={-sinVal} stroke="#64748b" strokeWidth="0.03" />
                <line x1={cosVal} y1={0} x2={cosVal} y2={-sinVal} stroke="#22c55e" strokeWidth="0.03" strokeDasharray="0.05 0.05" />
                <line x1="0" y1="0" x2={cosVal} y2="0" stroke="#3b82f6" strokeWidth="0.03" strokeDasharray="0.05 0.05" />
                
                <circle cx={cosVal} cy={-sinVal} r="0.06" fill="#ef4444" />
              </svg>
            </div>
          </motion.div>

          {/* Step 2 */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col gap-2"
          >
            <h3 className="font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider text-sm">Step 2: The Sides</h3>
            <ul className="text-slate-600 dark:text-slate-300 text-sm list-disc pl-5 space-y-1">
              <li><strong>Hypotenuse</strong> = 1 (Radius)</li>
              <li><strong>Opposite</strong> (vertical) = y = <span className="text-green-600 dark:text-green-400 font-mono">{yStr}</span></li>
              <li><strong>Adjacent</strong> (horizontal) = x = <span className="text-blue-600 dark:text-blue-400 font-mono">{xStr}</span></li>
            </ul>
          </motion.div>

          {/* Step 3 */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col gap-2"
          >
            <h3 className="font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider text-sm">Step 3: The Formulas (SOH CAH TOA)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-rose-50 dark:bg-rose-900/30 p-3 rounded-xl border border-rose-100 dark:border-rose-800/50 transition-colors duration-300">
                <div className="font-bold text-rose-700 dark:text-rose-400 mb-1">sin(θ)</div>
                <div className="text-xs text-rose-600 dark:text-rose-500 mb-2">Opposite / Hypotenuse</div>
                <div className="font-mono text-sm text-rose-800 dark:text-rose-300">{yStr} / 1 = <strong>{yStr}</strong></div>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-xl border border-blue-100 dark:border-blue-800/50 transition-colors duration-300">
                <div className="font-bold text-blue-700 dark:text-blue-400 mb-1">cos(θ)</div>
                <div className="text-xs text-blue-600 dark:text-blue-500 mb-2">Adjacent / Hypotenuse</div>
                <div className="font-mono text-sm text-blue-800 dark:text-blue-300">{xStr} / 1 = <strong>{xStr}</strong></div>
              </div>
              <div className="bg-emerald-50 dark:bg-emerald-900/30 p-3 rounded-xl border border-emerald-100 dark:border-emerald-800/50 transition-colors duration-300">
                <div className="font-bold text-emerald-700 dark:text-emerald-400 mb-1">tan(θ)</div>
                <div className="text-xs text-emerald-600 dark:text-emerald-500 mb-2">Opposite / Adjacent</div>
                <div className="font-mono text-sm text-emerald-800 dark:text-emerald-300">{yStr} / {xStr} = <strong>{tanStr}</strong></div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
