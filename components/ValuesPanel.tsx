import React, { useState } from 'react';
import { ActiveFunctions } from './TrigSimulation';
import { Calculator, Info } from 'lucide-react';
import { SPECIAL_ANGLES_DATA } from '../lib/trig';

interface Props {
  angle: number;
  activeFunctions: ActiveFunctions;
  onExplain?: () => void;
}

export default function ValuesPanel({ angle, activeFunctions, onExplain }: Props) {
  const [unit, setUnit] = useState<'degrees' | 'radians'>('degrees');

  let normalized = angle % (2 * Math.PI);
  if (normalized < 0) normalized += 2 * Math.PI;

  let deg = Math.round(normalized * 180 / Math.PI);
  if (deg === 360) deg = 0;
  
  const specialAngle = SPECIAL_ANGLES_DATA.find(a => a.deg === deg);

  const rad = specialAngle ? specialAngle.rad : (normalized / Math.PI).toFixed(3) + 'π';

  const sinVal = Math.sin(angle);
  const cosVal = Math.cos(angle);
  const tanVal = Math.tan(angle);

  const xStr = specialAngle ? specialAngle.cos : cosVal.toFixed(3);
  const yStr = specialAngle ? specialAngle.sin : sinVal.toFixed(3);
  const tanStr = specialAngle ? specialAngle.tan : (Math.abs(tanVal) > 100 ? '±∞' : tanVal.toFixed(3));

  const getQuadrant = () => {
    if (deg === 0 || deg === 90 || deg === 180 || deg === 270) return 'Axis';
    if (deg > 0 && deg < 90) return 'I';
    if (deg > 90 && deg < 180) return 'II';
    if (deg > 180 && deg < 270) return 'III';
    return 'IV';
  };

  const quad = getQuadrant();

  const cosSign = cosVal >= 0 ? '+' : '-';
  const sinSign = sinVal >= 0 ? '+' : '-';
  const tanSign = tanVal >= 0 ? '+' : '-';

  return (
    <div className="bg-white rounded-2xl shadow-md p-3 sm:p-4 md:p-5 w-full max-w-sm flex flex-col gap-2 sm:gap-3 md:gap-5 font-sans border border-slate-100 h-full">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-2 sm:pb-3 shrink-0">
        <div className="flex items-center gap-2">
          <Calculator className="text-indigo-500 w-5 h-5" />
          <h2 className="text-lg font-bold text-slate-800">Values</h2>
        </div>
        {specialAngle && (
          <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] sm:text-xs font-bold rounded-full uppercase tracking-wide animate-pulse">
            Special Angle
          </span>
        )}
      </div>

      {/* Controls: Degrees / Radians Segmented Control */}
      <div className="flex p-1 bg-slate-100 rounded-lg w-full">
        <label className={`flex-1 flex items-center justify-center py-1.5 rounded-md cursor-pointer transition-all ${unit === 'degrees' ? 'bg-white shadow-sm border border-slate-200/50' : 'opacity-70 hover:opacity-100'}`}>
          <input type="radio" name="angleUnit" value="degrees" checked={unit === 'degrees'} onChange={() => setUnit('degrees')} className="sr-only" />
          <div className="flex items-center gap-2">
            <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${unit === 'degrees' ? 'border-indigo-500' : 'border-slate-400'}`}>
              {unit === 'degrees' && <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>}
            </div>
            <span className={`text-sm ${unit === 'degrees' ? 'font-semibold text-slate-800' : 'font-medium text-slate-600'}`}>Degrees</span>
          </div>
        </label>
        <label className={`flex-1 flex items-center justify-center py-1.5 rounded-md cursor-pointer transition-all ${unit === 'radians' ? 'bg-white shadow-sm border border-slate-200/50' : 'opacity-70 hover:opacity-100'}`}>
          <input type="radio" name="angleUnit" value="radians" checked={unit === 'radians'} onChange={() => setUnit('radians')} className="sr-only" />
          <div className="flex items-center gap-2">
            <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${unit === 'radians' ? 'border-indigo-500' : 'border-slate-400'}`}>
              {unit === 'radians' && <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>}
            </div>
            <span className={`text-sm ${unit === 'radians' ? 'font-semibold text-slate-800' : 'font-medium text-slate-600'}`}>Radians</span>
          </div>
        </label>
      </div>

      {/* Angle & Coordinates */}
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-baseline">
          <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Angle (θ)</span>
          <span className="text-xl font-bold text-slate-800">
            {unit === 'degrees' ? `${deg}°` : `${rad} rad`}
          </span>
        </div>
        <div className="flex justify-between items-baseline">
          <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Coordinates</span>
          <span className="font-mono text-base font-medium text-slate-700">({xStr}, {yStr})</span>
        </div>
      </div>

      <div className="h-px bg-slate-100 w-full"></div>

      {/* Trig Values */}
      <div className="flex flex-col gap-2.5">
        {/* Cosine */}
        <div className={`flex justify-between items-center px-3 py-2.5 rounded-xl border transition-colors ${activeFunctions.cos ? 'bg-blue-50/80 border-blue-100/50' : 'bg-slate-50 border-slate-100 opacity-50'}`}>
          <div className="flex items-baseline gap-2">
            <span className={`font-bold text-lg ${activeFunctions.cos ? 'text-blue-600' : 'text-slate-500'}`}>cos θ</span>
            <span className={`text-sm font-medium ${activeFunctions.cos ? 'text-blue-400/80' : 'text-slate-400'}`}>= x</span>
          </div>
          <span className={`font-mono font-semibold text-lg ${activeFunctions.cos ? 'text-blue-700' : 'text-slate-600'}`}>{xStr}</span>
        </div>
        
        {/* Sine */}
        <div className={`flex justify-between items-center px-3 py-2.5 rounded-xl border transition-colors ${activeFunctions.sin ? 'bg-rose-50/80 border-rose-100/50' : 'bg-slate-50 border-slate-100 opacity-50'}`}>
          <div className="flex items-baseline gap-2">
            <span className={`font-bold text-lg ${activeFunctions.sin ? 'text-rose-600' : 'text-slate-500'}`}>sin θ</span>
            <span className={`text-sm font-medium ${activeFunctions.sin ? 'text-rose-400/80' : 'text-slate-400'}`}>= y</span>
          </div>
          <span className={`font-mono font-semibold text-lg ${activeFunctions.sin ? 'text-rose-700' : 'text-slate-600'}`}>{yStr}</span>
        </div>

        {/* Tangent */}
        <div className={`flex justify-between items-center px-3 py-2.5 rounded-xl border transition-colors ${activeFunctions.tan ? 'bg-emerald-50/80 border-emerald-100/50' : 'bg-slate-50 border-slate-100 opacity-50'}`}>
          <div className="flex items-baseline gap-2">
            <span className={`font-bold text-lg ${activeFunctions.tan ? 'text-emerald-600' : 'text-slate-500'}`}>tan θ</span>
            <span className={`text-sm font-medium ${activeFunctions.tan ? 'text-emerald-400/80' : 'text-slate-400'}`}>= y/x</span>
          </div>
          <span className={`font-mono font-semibold text-lg ${activeFunctions.tan ? 'text-emerald-700' : 'text-slate-600'}`}>{tanStr}</span>
        </div>
      </div>

      <div className="h-px bg-slate-100 w-full mt-auto"></div>

      {/* Quadrant & Signs */}
      <div className="flex flex-col gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] text-slate-400 uppercase tracking-widest font-bold">Location</span>
            <span className="font-semibold text-slate-700 text-sm">Quadrant {quad}</span>
          </div>
          <div className="flex flex-col gap-1.5 text-right">
            <span className="text-[11px] text-slate-400 uppercase tracking-widest font-bold">Signs (c, s, t)</span>
            <div className="flex gap-1.5 justify-end">
              <span className={`w-6 h-6 flex items-center justify-center rounded-md text-sm font-bold ${cosSign === '+' ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-600'}`} title="Cosine sign">{cosSign}</span>
              <span className={`w-6 h-6 flex items-center justify-center rounded-md text-sm font-bold ${sinSign === '+' ? 'bg-rose-100 text-rose-700' : 'bg-slate-200 text-slate-600'}`} title="Sine sign">{sinSign}</span>
              <span className={`w-6 h-6 flex items-center justify-center rounded-md text-sm font-bold ${tanSign === '+' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`} title="Tangent sign">{tanSign}</span>
            </div>
          </div>
        </div>
        
        {/* ASTC Rule */}
        <div className="mt-2 pt-2 border-t border-slate-200 flex justify-between text-xs font-medium text-slate-500">
          <span className={quad === 'I' ? 'text-indigo-600 font-bold' : ''}>All (+)</span>
          <span className={quad === 'II' ? 'text-indigo-600 font-bold' : ''}>Sin (+)</span>
          <span className={quad === 'III' ? 'text-indigo-600 font-bold' : ''}>Tan (+)</span>
          <span className={quad === 'IV' ? 'text-indigo-600 font-bold' : ''}>Cos (+)</span>
        </div>
      </div>

      {onExplain && (
        <button 
          onClick={onExplain}
          className="mt-auto w-full py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-sm font-semibold transition-colors border border-indigo-200 flex items-center justify-center gap-2"
        >
          <Info size={16} />
          Explain This Angle
        </button>
      )}
      
    </div>
  );
}
