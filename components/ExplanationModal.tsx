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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-none">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm pointer-events-auto" 
        onClick={onClose} 
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-2xl shadow-2xl px-6 py-5 max-w-lg w-full relative z-10 pointer-events-auto border border-blue-700/50 flex flex-col gap-5 max-h-[90vh] overflow-y-auto"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white hover:bg-white/10 rounded-full p-1.5 transition-colors">
          <X size={20} />
        </button>
        
        <h2 className="text-xl font-bold text-white pr-8">Understanding {deg}°</h2>
        
        <div className="flex flex-col gap-6">
          {/* Step 1 */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col gap-2.5"
          >
            <h3 className="font-bold text-blue-300 uppercase tracking-wide text-xs">Step 1: The Triangle</h3>
            <p className="text-gray-200 text-sm leading-relaxed">
              Imagine a right triangle inside the unit circle. The hypotenuse (longest side) is always the radius of the circle, which is <strong>1</strong>.
            </p>
            <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex justify-center backdrop-blur-md shadow-inner">
              <svg viewBox="-1.2 -1.2 2.4 2.4" className="w-32 h-32 overflow-visible">
                <circle cx="0" cy="0" r="1" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.02" />
                <line x1="-1.2" y1="0" x2="1.2" y2="0" stroke="rgba(255,255,255,0.2)" strokeWidth="0.02" />
                <line x1="0" y1="-1.2" x2="0" y2="1.2" stroke="rgba(255,255,255,0.2)" strokeWidth="0.02" />
                
                <path d={`M 0 0 L ${cosVal} ${-sinVal} L ${cosVal} 0 Z`} fill="rgba(255, 255, 255, 0.1)" stroke="white" strokeWidth="0.02" />
                <line x1="0" y1="0" x2={cosVal} y2={-sinVal} stroke="rgba(255,255,255,0.6)" strokeWidth="0.03" />
                <line x1={cosVal} y1={0} x2={cosVal} y2={-sinVal} stroke="#4ade80" strokeWidth="0.03" strokeDasharray="0.05 0.05" />
                <line x1="0" y1="0" x2={cosVal} y2="0" stroke="#60a5fa" strokeWidth="0.03" strokeDasharray="0.05 0.05" />
                
                <circle cx={cosVal} cy={-sinVal} r="0.06" fill="#f87171" style={{ filter: 'drop-shadow(0 0 6px rgba(248,113,113,0.8))' }} />
              </svg>
            </div>
          </motion.div>

          {/* Step 2 */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col gap-2.5"
          >
            <h3 className="font-bold text-blue-300 uppercase tracking-wide text-xs">Step 2: The Sides</h3>
            <ul className="text-gray-200 text-sm list-disc pl-5 space-y-1.5 marker:text-blue-400">
              <li><strong>Hypotenuse</strong> = 1 (Radius)</li>
              <li><strong>Opposite</strong> (vertical) = y = <span className="text-green-400 font-mono font-medium">{yStr}</span></li>
              <li><strong>Adjacent</strong> (horizontal) = x = <span className="text-blue-400 font-mono font-medium">{xStr}</span></li>
            </ul>
          </motion.div>

          {/* Step 3 */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col gap-3"
          >
            <h3 className="font-bold text-blue-300 uppercase tracking-wide text-xs">Step 3: The Formulas (SOH CAH TOA)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-white/5 p-3 rounded-xl border border-white/10 flex flex-col items-center text-center">
                <div className="font-bold text-white mb-1">sin(θ)</div>
                <div className="text-[10px] uppercase tracking-wider text-blue-300 mb-2 font-semibold">Opp / Hyp</div>
                <div className="font-mono text-sm text-green-300">{yStr} / 1 = <strong className="text-green-400 text-base">{yStr}</strong></div>
              </div>
              <div className="bg-white/5 p-3 rounded-xl border border-white/10 flex flex-col items-center text-center">
                <div className="font-bold text-white mb-1">cos(θ)</div>
                <div className="text-[10px] uppercase tracking-wider text-blue-300 mb-2 font-semibold">Adj / Hyp</div>
                <div className="font-mono text-sm text-blue-300">{xStr} / 1 = <strong className="text-blue-400 text-base">{xStr}</strong></div>
              </div>
              <div className="bg-white/5 p-3 rounded-xl border border-white/10 flex flex-col items-center text-center">
                <div className="font-bold text-white mb-1">tan(θ)</div>
                <div className="text-[10px] uppercase tracking-wider text-blue-300 mb-2 font-semibold">Opp / Adj</div>
                <div className="font-mono text-sm text-orange-300">{yStr} / {xStr} = <strong className="text-orange-400 text-base">{tanStr}</strong></div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
