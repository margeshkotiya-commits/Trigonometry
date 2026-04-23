import React, { useState, useMemo, useEffect } from 'react';
import { ActiveFunctions } from './TrigSimulation';
import { Calculator, Info } from 'lucide-react';
import { SPECIAL_ANGLES_DATA } from '../lib/trig';

interface Props {
  angle: number;
  activeFunctions: ActiveFunctions;
  onExplain?: () => void;
}

const ValuesPanel = React.memo(function ValuesPanel({ angle, activeFunctions, onExplain }: Props) {
  const [unit, setUnit] = useState<'degrees' | 'radians'>('degrees');

  let normalized = angle % (2 * Math.PI);
  if (normalized < 0) normalized += 2 * Math.PI;

  let deg = Math.round(normalized * 180 / Math.PI);
  if (deg === 360) deg = 0;
  
  const specialAngle = useMemo(() => {
    return SPECIAL_ANGLES_DATA.find(a => a.deg === deg);
  }, [deg]);

  const [displaySpecial, setDisplaySpecial] = useState(!!specialAngle);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplaySpecial(!!specialAngle);
    }, 80); // Debounce value updates slightly
    return () => clearTimeout(timer);
  }, [specialAngle]);

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
    <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-3 sm:p-4 md:p-5 w-full max-w-sm flex flex-col gap-2 sm:gap-3 md:gap-5 font-sans border border-slate-100 h-full min-h-[400px]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-2 sm:pb-3 shrink-0">
        <div className="flex items-center gap-2">
          <Calculator className="text-indigo-500 w-5 h-5" />
          <h2 className="text-lg font-bold text-slate-800">Values</h2>
        </div>
        <span className={`px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] sm:text-xs font-bold rounded-full uppercase tracking-wide transition-opacity duration-200 ${displaySpecial ? 'opacity-100' : 'opacity-0'}`}>
          Special Angle
        </span>
      </div>

      {/* Controls: Degrees / Radians Segmented Control */}
      <div className="flex p-1 bg-slate-100 rounded-lg w-full shrink-0">
        <label className={`flex-1 flex items-center justify-center py-1.5 rounded-md cursor-pointer transition-all ${unit === 'degrees' ? 'bg-white shadow-sm border border-slate-200/50' : 'opacity-70 hover:opacity-100'}`}>
          <input type="radio" name="angleUnit" value="degrees" checked={unit === 'degrees'} onChange={() => setUnit('degrees')} className="sr-only" />
          <div className="flex items-center gap-2">
            <span className={`text-sm tabular-nums ${unit === 'degrees' ? 'font-semibold text-slate-800' : 'font-medium text-slate-600'}`}>Degrees</span>
          </div>
        </label>
        <label className={`flex-1 flex items-center justify-center py-1.5 rounded-md cursor-pointer transition-all ${unit === 'radians' ? 'bg-white shadow-sm border border-slate-200/50' : 'opacity-70 hover:opacity-100'}`}>
          <input type="radio" name="angleUnit" value="radians" checked={unit === 'radians'} onChange={() => setUnit('radians')} className="sr-only" />
          <div className="flex items-center gap-2">
            <span className={`text-sm tabular-nums ${unit === 'radians' ? 'font-semibold text-slate-800' : 'font-medium text-slate-600'}`}>Radians</span>
          </div>
        </label>
      </div>

      {/* Angle & Coordinates */}
      <div className="grid grid-cols-[1fr_auto] gap-y-2 items-center px-1 shrink-0">
        <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Angle (θ)</span>
        <span className="text-xl font-bold text-slate-800 text-right tabular-nums w-24">
          {unit === 'degrees' ? `${deg}°` : `${rad} rad`}
        </span>
        
        <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Coordinates</span>
        <span className="font-mono text-sm md:text-base font-medium text-slate-700 text-right break-words whitespace-normal w-32 justify-end">
          ({xStr}, {yStr})
        </span>
      </div>

      <div className="h-px bg-slate-100 w-full shrink-0"></div>

      {/* Trig Values */}
      <div className="flex flex-col gap-2.5 shrink-0">
        <div className={`grid grid-cols-[1fr_auto] items-center px-3 py-2.5 rounded-xl border transition-colors duration-300 ${activeFunctions.cos ? 'bg-blue-50 border-blue-200 shadow-sm' : 'bg-slate-50 border-slate-100 opacity-50'}`}>
          <div className="flex items-baseline gap-2">
            <span className={`font-bold text-lg ${activeFunctions.cos ? 'text-blue-600' : 'text-slate-500'}`}>cos θ</span>
            <span className={`text-sm font-medium ${activeFunctions.cos ? 'text-blue-400' : 'text-slate-400'}`}>= x</span>
          </div>
          <span className={`font-mono font-semibold text-lg text-right w-20 ${activeFunctions.cos ? 'text-blue-700' : 'text-slate-600'}`}>{xStr}</span>
        </div>
        
        <div className={`grid grid-cols-[1fr_auto] items-center px-3 py-2.5 rounded-xl border transition-colors duration-300 ${activeFunctions.sin ? 'bg-green-50 border-green-200 shadow-sm' : 'bg-slate-50 border-slate-100 opacity-50'}`}>
          <div className="flex items-baseline gap-2">
            <span className={`font-bold text-lg ${activeFunctions.sin ? 'text-green-600' : 'text-slate-500'}`}>sin θ</span>
            <span className={`text-sm font-medium ${activeFunctions.sin ? 'text-green-400' : 'text-slate-400'}`}>= y</span>
          </div>
          <span className={`font-mono font-semibold text-lg text-right w-20 ${activeFunctions.sin ? 'text-green-700' : 'text-slate-600'}`}>{yStr}</span>
        </div>

        <div className={`grid grid-cols-[1fr_auto] items-center px-3 py-2.5 rounded-xl border transition-colors duration-300 ${activeFunctions.tan ? 'bg-orange-50 border-orange-200 shadow-sm' : 'bg-slate-50 border-slate-100 opacity-50'}`}>
          <div className="flex items-baseline gap-2">
            <span className={`font-bold text-lg ${activeFunctions.tan ? 'text-orange-600' : 'text-slate-500'}`}>tan θ</span>
            <span className={`text-sm font-medium ${activeFunctions.tan ? 'text-orange-400' : 'text-slate-400'}`}>= y/x</span>
          </div>
          <span className={`font-mono font-semibold text-lg text-right w-20 ${activeFunctions.tan ? 'text-orange-700' : 'text-slate-600'}`}>{tanStr}</span>
        </div>
      </div>

      <div className="h-px bg-slate-100 w-full mt-auto shrink-0"></div>

      {onExplain && (
        <button 
          onClick={onExplain}
          className="mt-2 shrink-0 w-full py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-sm font-semibold transition-all duration-300 active:scale-95 border border-indigo-200 flex items-center justify-center gap-2"
        >
          <Info size={16} />
          Explain This Angle
        </button>
      )}
    </div>
  );
});

export default ValuesPanel;
