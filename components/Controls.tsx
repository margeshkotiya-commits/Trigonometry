import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Settings2 } from 'lucide-react';
import { ActiveFunctions, Options } from './TrigSimulation';

interface Props {
  isPlaying: boolean;
  setIsPlaying: (val: boolean) => void;
  activeFunctions: ActiveFunctions;
  setActiveFunctions: (val: ActiveFunctions) => void;
  options: Options;
  setOptions: (val: Options) => void;
  angle: number;
  setAngle: (val: number) => void;
}

export default function Controls({ isPlaying, setIsPlaying, activeFunctions, setActiveFunctions, options, setOptions, angle, setAngle }: Props) {
  const [inputUnit, setInputUnit] = useState<'degrees' | 'radians'>('degrees');
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (isFocused) return;
    let normalized = angle % (2 * Math.PI);
    if (normalized < 0) normalized += 2 * Math.PI;

    if (inputUnit === 'degrees') {
      let deg = Math.round(normalized * 180 / Math.PI);
      if (deg === 360) deg = 0;
      setInputValue(deg.toString());
    } else {
      setInputValue(normalized.toFixed(3));
    }
  }, [angle, inputUnit, isFocused]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    const val = parseFloat(e.target.value);
    if (!isNaN(val)) {
      if (inputUnit === 'degrees') {
        setAngle(val * Math.PI / 180);
      } else {
        setAngle(val);
      }
    }
  };

  return (
    <div className="flex flex-col gap-3 sm:gap-4 md:gap-6 h-full">
      {/* Angle Input */}
      <div className="shrink-0">
        <h2 className="text-xs sm:text-sm font-semibold text-slate-500 mb-2 sm:mb-3 uppercase tracking-wider">Set Angle</h2>
        <div className="flex flex-col gap-2">
          <div className="flex p-1 bg-slate-100 rounded-lg w-full">
            <label className={`flex-1 flex items-center justify-center py-1 rounded-md cursor-pointer transition-all ${inputUnit === 'degrees' ? 'bg-white shadow-sm border border-slate-200/50' : 'opacity-70 hover:opacity-100'}`}>
              <input type="radio" name="controlsAngleUnit" value="degrees" checked={inputUnit === 'degrees'} onChange={() => setInputUnit('degrees')} className="sr-only" />
              <span className={`text-xs sm:text-sm ${inputUnit === 'degrees' ? 'font-semibold text-slate-800' : 'font-medium text-slate-600'}`}>Degrees</span>
            </label>
            <label className={`flex-1 flex items-center justify-center py-1 rounded-md cursor-pointer transition-all ${inputUnit === 'radians' ? 'bg-white shadow-sm border border-slate-200/50' : 'opacity-70 hover:opacity-100'}`}>
              <input type="radio" name="controlsAngleUnit" value="radians" checked={inputUnit === 'radians'} onChange={() => setInputUnit('radians')} className="sr-only" />
              <span className={`text-xs sm:text-sm ${inputUnit === 'radians' ? 'font-semibold text-slate-800' : 'font-medium text-slate-600'}`}>Radians</span>
            </label>
          </div>
          <div className="relative">
            <input 
              type="number" 
              value={inputValue}
              onChange={handleInputChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm sm:text-base rounded-xl px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all font-mono"
              placeholder={inputUnit === 'degrees' ? "e.g. 45" : "e.g. 0.785"}
              step="any"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-sm pointer-events-none">
              {inputUnit === 'degrees' ? '°' : 'rad'}
            </div>
          </div>
        </div>
      </div>

      <hr className="border-slate-100 shrink-0" />

      {/* Playback */}
      <div className="shrink-0">
        <h2 className="text-xs sm:text-sm font-semibold text-slate-500 mb-2 sm:mb-3 uppercase tracking-wider">Playback</h2>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex-1 flex items-center justify-center gap-1 sm:gap-2 py-1.5 sm:py-2.5 rounded-xl text-sm sm:text-base font-medium transition-colors ${isPlaying ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
          >
            {isPlaying ? <><Pause size={16} className="sm:w-[18px] sm:h-[18px]" /> Pause</> : <><Play size={16} className="sm:w-[18px] sm:h-[18px]" /> Play</>}
          </button>
          <button 
            onClick={() => { setIsPlaying(false); setAngle(0); }}
            className="p-1.5 sm:p-2.5 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-colors"
            title="Reset to 0"
          >
            <RotateCcw size={16} className="sm:w-[18px] sm:h-[18px]" />
          </button>
        </div>
      </div>

      <hr className="border-slate-100 shrink-0" />

      {/* Functions */}
      <div className="shrink-0">
        <h2 className="text-xs sm:text-sm font-semibold text-slate-500 mb-2 sm:mb-3 uppercase tracking-wider">Functions</h2>
        <div className="flex flex-col gap-1.5 sm:gap-2">
          <Toggle 
            label="Sine (sin)" 
            color="bg-green-500" 
            active={activeFunctions.sin} 
            onClick={() => setActiveFunctions({ ...activeFunctions, sin: !activeFunctions.sin })} 
          />
          <Toggle 
            label="Cosine (cos)" 
            color="bg-blue-500" 
            active={activeFunctions.cos} 
            onClick={() => setActiveFunctions({ ...activeFunctions, cos: !activeFunctions.cos })} 
          />
          <Toggle 
            label="Tangent (tan)" 
            color="bg-orange-500" 
            active={activeFunctions.tan} 
            onClick={() => setActiveFunctions({ ...activeFunctions, tan: !activeFunctions.tan })} 
          />
        </div>
      </div>

      <hr className="border-slate-100 shrink-0" />

      {/* Display Options */}
      <div className="shrink-0 pb-1">
        <h2 className="text-xs sm:text-sm font-semibold text-slate-500 mb-2 sm:mb-3 uppercase tracking-wider flex items-center gap-1.5 sm:gap-2">
          <Settings2 size={14} className="sm:w-4 sm:h-4" /> Display
        </h2>
        <div className="flex flex-col gap-2 sm:gap-3">
          <Checkbox 
            label="Special Angles" 
            checked={options.specialAngles} 
            onChange={(c: boolean) => setOptions({ ...options, specialAngles: c })} 
          />
          <Checkbox 
            label="Show Triangle" 
            checked={options.triangle} 
            onChange={(c: boolean) => setOptions({ ...options, triangle: c })} 
          />
          <Checkbox 
            label="Show Grid" 
            checked={options.grid} 
            onChange={(c: boolean) => setOptions({ ...options, grid: c })} 
          />
          <Checkbox 
            label="Show Labels" 
            checked={options.labels} 
            onChange={(c: boolean) => setOptions({ ...options, labels: c })} 
          />
        </div>
      </div>
    </div>
  );
}

function Toggle({ label, color, active, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center justify-between px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border transition-all ${active ? 'bg-slate-50 border-slate-200 shadow-sm' : 'bg-transparent border-transparent opacity-60 hover:bg-slate-50'}`}
    >
      <span className="font-medium text-sm sm:text-base text-slate-700">{label}</span>
      <div className={`w-8 sm:w-10 h-4 sm:h-5 rounded-full p-0.5 sm:p-1 transition-colors ${active ? color : 'bg-slate-300'}`}>
        <div className={`w-3 h-3 rounded-full bg-white transition-transform ${active ? 'translate-x-4 sm:translate-x-5' : 'translate-x-0'}`} />
      </div>
    </button>
  );
}

function Checkbox({ label, checked, onChange }: any) {
  return (
    <label className="flex items-center gap-2 sm:gap-3 cursor-pointer group">
      <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded border flex items-center justify-center transition-colors ${checked ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300 group-hover:border-indigo-400'}`}>
        {checked && <svg className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
      </div>
      <input type="checkbox" className="hidden" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="text-sm sm:text-base text-slate-600 font-medium select-none">{label}</span>
    </label>
  );
}
