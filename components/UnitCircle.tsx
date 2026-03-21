import React, { useRef, useState } from 'react';
import { ActiveFunctions, Options } from './TrigSimulation';
import { SPECIAL_ANGLES_DATA, Mode } from '../lib/trig';

interface Props {
  angle: number;
  setAngle: (angle: number) => void;
  activeFunctions: ActiveFunctions;
  options: Options;
  mode: Mode;
}

const SPECIAL_ANGLES_RAD = SPECIAL_ANGLES_DATA.map(a => a.deg * Math.PI / 180);

export default function UnitCircle({ angle, setAngle, activeFunctions, options, mode }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    updateAngle(e.clientX, e.clientY);
    (e.target as Element).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDragging) {
      updateAngle(e.clientX, e.clientY);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    (e.target as Element).releasePointerCapture(e.pointerId);
  };

  const updateAngle = (clientX: number, clientY: number) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const x = clientX - centerX;
    const y = centerY - clientY; // invert Y
    
    let newAngle = Math.atan2(y, x);
    if (newAngle < 0) newAngle += 2 * Math.PI;
    
    if (options.specialAngles || mode === 'concept') {
      const snapThreshold = 0.08; // radians
      for (const special of SPECIAL_ANGLES_RAD) {
        // Handle wrap around for 0 and 2PI
        let diff = Math.abs(newAngle - special);
        if (diff > Math.PI) diff = 2 * Math.PI - diff;
        
        if (diff < snapThreshold) {
          newAngle = special;
          break;
        }
      }
    }
    setAngle(newAngle);
  };

  const r = 1;
  const x = r * Math.cos(angle);
  const y = r * Math.sin(angle);

  const getArcPath = () => {
    const arcR = 0.2;
    const arcX = arcR * Math.cos(angle);
    const arcY = -arcR * Math.sin(angle);
    const largeArcFlag = angle > Math.PI ? 1 : 0;
    if (angle === 0) return '';
    if (angle >= 2 * Math.PI - 0.001) {
      return `M ${arcR} 0 A ${arcR} ${arcR} 0 1 0 -${arcR} 0 A ${arcR} ${arcR} 0 1 0 ${arcR} 0`;
    }
    return `M ${arcR} 0 A ${arcR} ${arcR} 0 ${largeArcFlag} 0 ${arcX} ${arcY}`;
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Concept Mode Explanations */}
      {mode === 'concept' && (
        <div className="absolute top-0 left-0 right-0 flex flex-col gap-2 pointer-events-none z-10 p-2">
          {activeFunctions.sin && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-3 py-2 rounded-lg text-xs sm:text-sm shadow-sm transition-opacity duration-300">
              <strong className="font-mono">sin(θ)</strong> is the vertical distance (y-coordinate)
            </div>
          )}
          {activeFunctions.cos && (
            <div className="bg-blue-50 border border-blue-200 text-blue-700 px-3 py-2 rounded-lg text-xs sm:text-sm shadow-sm transition-opacity duration-300">
              <strong className="font-mono">cos(θ)</strong> is the horizontal distance (x-coordinate)
            </div>
          )}
        </div>
      )}

      <svg 
        ref={svgRef}
        viewBox="-1.5 -1.5 3 3" 
        className="max-w-full max-h-full aspect-square touch-none select-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
      {/* Grid */}
      {options.grid && (
        <g className="text-slate-100" strokeWidth="0.02" stroke="currentColor">
          {[-1, -0.5, 0.5, 1].map(val => (
            <React.Fragment key={val}>
              <line x1="-1.5" y1={val} x2="1.5" y2={val} />
              <line x1={val} y1="-1.5" x2={val} y2="1.5" />
            </React.Fragment>
          ))}
        </g>
      )}
      
      {/* Axes */}
      <g className="text-slate-300" strokeWidth="0.02" stroke="currentColor">
        <line x1="-1.5" y1="0" x2="1.5" y2="0" />
        <line x1="0" y1="-1.5" x2="0" y2="1.5" />
      </g>
      
      {/* Circle */}
      <circle cx="0" cy="0" r="1" fill="none" stroke="#94a3b8" strokeWidth="0.02" />
      
      {/* Special Angles Markers */}
      {options.specialAngles && (
        <g className="text-slate-300" strokeWidth="0.01" stroke="currentColor">
          {SPECIAL_ANGLES_RAD.map((rad, i) => (
            <line key={i} x1="0" y1="0" x2={Math.cos(rad)} y2={-Math.sin(rad)} strokeDasharray="0.02 0.02" />
          ))}
        </g>
      )}
      
      {/* Angle Arc */}
      <path d={getArcPath()} fill="none" stroke="#3b82f6" strokeWidth="0.03" />
      <path d={`M 0 0 L 0.2 0 ${getArcPath().replace('M 0.2 0 ', '')} Z`} fill="rgba(59, 130, 246, 0.1)" />
      
      {/* Triangle */}
      {(options.triangle || mode === 'concept') && (
        <g>
          {/* hypotenuse */}
          <line x1="0" y1="0" x2={x} y2={-y} stroke="#475569" strokeWidth="0.02" />
          {/* sin line */}
          {activeFunctions.sin && <line x1={x} y1="0" x2={x} y2={-y} stroke="#10b981" strokeWidth={mode === 'concept' ? "0.04" : "0.03"} className="transition-all duration-300" />}
          {/* cos line */}
          {activeFunctions.cos && <line x1="0" y1="0" x2={x} y2="0" stroke="#3b82f6" strokeWidth={mode === 'concept' ? "0.04" : "0.03"} className="transition-all duration-300" />}
        </g>
      )}

      {/* Tangent Line */}
      {activeFunctions.tan && Math.abs(Math.tan(angle)) <= 10 && (
        <g>
          {/* Tangent segment at x=1 */}
          <line x1="1" y1="0" x2="1" y2={-Math.tan(angle)} stroke="#f97316" strokeWidth="0.03" />
          {/* Extended radius to tangent */}
          <line x1="0" y1="0" x2="1" y2={-Math.tan(angle)} stroke="#f97316" strokeWidth="0.01" strokeDasharray="0.04 0.04" />
        </g>
      )}
      
      {/* Point */}
      <circle 
        cx={x} 
        cy={-y} 
        r={isDragging ? "0.1" : "0.08"} 
        fill="#ef4444" 
        className={`cursor-grab active:cursor-grabbing transition-all duration-200 ${mode === 'concept' ? 'drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]' : ''}`} 
        style={{ filter: mode === 'concept' ? 'drop-shadow(0 0 8px rgba(239,68,68,0.8))' : 'drop-shadow(0 0 4px rgba(239,68,68,0.5))' }}
      />

      {/* Point Coordinates */}
      {options.labels && (
        <text 
          x={x + (x > 0 ? 0.12 : -0.12)} 
          y={-y + (y > 0 ? -0.12 : 0.12)} 
          fontSize="0.08" 
          className="fill-slate-700 font-mono select-none"
          textAnchor={x > 0 ? "start" : "end"}
          dominantBaseline="middle"
        >
          ({x.toFixed(2)}, {y.toFixed(2)})
        </text>
      )}

      {/* Labels */}
      {options.labels && mode !== 'concept' && (
        <g fontSize="0.1" className="fill-slate-500 font-medium select-none" textAnchor="middle" dominantBaseline="middle">
          <text x="1.15" y="0">0</text>
          <text x="0" y="-1.15">π/2</text>
          <text x="-1.15" y="0">π</text>
          <text x="0" y="1.15">3π/2</text>
          {/* x and y labels */}
          <text x="1.4" y="0.1">x</text>
          <text x="0.1" y="-1.4">y</text>
        </g>
      )}
    </svg>
    </div>
  );
}
