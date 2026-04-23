import React, { useRef, useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import { ActiveFunctions, Options } from './TrigSimulation';
import { SPECIAL_ANGLES_DATA } from '../lib/trig';

interface Props {
  angle: number;
  setAngle: (angle: number) => void;
  activeFunctions: ActiveFunctions;
  options: Options;
  isDark?: boolean;
}

const SPECIAL_ANGLES_RAD = SPECIAL_ANGLES_DATA.map(a => a.deg * Math.PI / 180);

const UnitCircle = forwardRef(function UnitCircle({ angle, setAngle, activeFunctions, options, isDark = false }: Props, ref) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Animation refs
  const pointRef = useRef<SVGCircleElement>(null);
  const sinRef = useRef<SVGLineElement>(null);
  const cosRef = useRef<SVGLineElement>(null);
  const hypRef = useRef<SVGLineElement>(null);
  const tanLineRef = useRef<SVGLineElement>(null);
  const tanExtRef = useRef<SVGLineElement>(null);
  const arcRef = useRef<SVGPathElement>(null);
  const arcFillRef = useRef<SVGPathElement>(null);
  const coordsRef = useRef<SVGTextElement>(null);

  const getArcPathStr = (a: number) => {
    const arcR = 0.2;
    const arcX = arcR * Math.cos(a);
    const arcY = -arcR * Math.sin(a);
    const largeArcFlag = a > Math.PI ? 1 : 0;
    if (a === 0) return '';
    if (a >= 2 * Math.PI - 0.001) {
      return `M ${arcR} 0 A ${arcR} ${arcR} 0 1 0 -${arcR} 0 A ${arcR} ${arcR} 0 1 0 ${arcR} 0`;
    }
    return `M ${arcR} 0 A ${arcR} ${arcR} 0 ${largeArcFlag} 0 ${arcX} ${arcY}`;
  };

  useImperativeHandle(ref, () => ({
    updateAngle: (newAngle: number) => {
      const x = Math.cos(newAngle);
      const y = Math.sin(newAngle);
      
      if (pointRef.current) {
        pointRef.current.setAttribute('cx', x.toString());
        pointRef.current.setAttribute('cy', (-y).toString());
      }
      if (sinRef.current) {
        sinRef.current.setAttribute('x1', x.toString());
        sinRef.current.setAttribute('x2', x.toString());
        sinRef.current.setAttribute('y2', (-y).toString());
      }
      if (cosRef.current) {
        cosRef.current.setAttribute('x2', x.toString());
      }
      if (hypRef.current) {
        hypRef.current.setAttribute('x2', x.toString());
        hypRef.current.setAttribute('y2', (-y).toString());
      }
      if (tanLineRef.current && tanExtRef.current) {
         const tY = Math.tan(newAngle);
         if (Math.abs(tY) <= 10) {
            tanLineRef.current.setAttribute('y2', (-tY).toString());
            tanLineRef.current.setAttribute('opacity', '1');
            tanExtRef.current.setAttribute('y2', (-tY).toString());
            tanExtRef.current.setAttribute('opacity', '1');
         } else {
            tanLineRef.current.setAttribute('opacity', '0');
            tanExtRef.current.setAttribute('opacity', '0');
         }
      }
      if (arcRef.current && arcFillRef.current) {
         const path = getArcPathStr(newAngle);
         arcRef.current.setAttribute('d', path);
         arcFillRef.current.setAttribute('d', `M 0 0 L 0.2 0 ${path.replace('M 0.2 0 ', '')} Z`);
      }
      if (coordsRef.current) {
         coordsRef.current.textContent = `(${x.toFixed(2)}, ${y.toFixed(2)})`;
         coordsRef.current.setAttribute('x', (x + (x > 0 ? 0.12 : -0.12)).toString());
         coordsRef.current.setAttribute('y', (-y + (y > 0 ? -0.12 : 0.12)).toString());
         coordsRef.current.setAttribute('text-anchor', x > 0 ? 'start' : 'end');
      }
    }
  }));

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
    
    if (options.specialAngles) {
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

  return (
    <div className="relative w-full h-full flex items-center justify-center p-0 md:p-2 lg:p-4 bg-slate-50 shadow-inner rounded-xl overflow-hidden">
      {/* Subtle radial gradient background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-100/30 via-slate-50/10 to-transparent pointer-events-none"></div>

      {/* Quadrants overlaid on top */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[8%] right-[8%] transform translate-x-1/2 -translate-y-1/2 bg-white/40 backdrop-blur-sm rounded px-2 py-0.5 text-slate-400 font-bold text-sm lg:text-base border border-white/20 shadow-sm">I</div>
        <div className="absolute top-[8%] left-[8%] transform -translate-x-1/2 -translate-y-1/2 bg-white/40 backdrop-blur-sm rounded px-2 py-0.5 text-slate-400 font-bold text-sm lg:text-base border border-white/20 shadow-sm">II</div>
        <div className="absolute bottom-[8%] left-[8%] transform -translate-x-1/2 translate-y-1/2 bg-white/40 backdrop-blur-sm rounded px-2 py-0.5 text-slate-400 font-bold text-sm lg:text-base border border-white/20 shadow-sm">III</div>
        <div className="absolute bottom-[8%] right-[8%] transform translate-x-1/2 translate-y-1/2 bg-white/40 backdrop-blur-sm rounded px-2 py-0.5 text-slate-400 font-bold text-sm lg:text-base border border-white/20 shadow-sm">IV</div>
      </div>

      <svg 
        ref={svgRef}
        viewBox="-1.3 -1.3 2.6 2.6" 
        className="w-[98%] h-[98%] max-w-full max-h-full aspect-square touch-none select-none z-10"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <defs>
          <filter id="point-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="0.04" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Grid */}
        {options.grid && (
          <g className={isDark ? "text-slate-800" : "text-slate-200"} strokeWidth="0.015" stroke="currentColor">
            {[-1, -0.5, 0.5, 1].map(val => (
              <React.Fragment key={val}>
                <line x1="-1.3" y1={val} x2="1.3" y2={val} />
                <line x1={val} y1="-1.3" x2={val} y2="1.3" />
              </React.Fragment>
            ))}
          </g>
        )}
        
        {/* Axes */}
        <g className={isDark ? "text-slate-600" : "text-slate-300"} strokeWidth="0.025" stroke="currentColor">
          <line x1="-1.3" y1="0" x2="1.3" y2="0" />
          <line x1="0" y1="-1.3" x2="0" y2="1.3" />
        </g>
        
        {/* Circle */}
        <circle cx="0" cy="0" r="1" fill="none" stroke={isDark ? "#475569" : "#64748b"} strokeWidth="0.03" />
        
        {/* Special Angles Markers */}
        {options.specialAngles && (
          <g className={isDark ? "text-slate-700" : "text-slate-300"} strokeWidth="0.015" stroke="currentColor">
            {SPECIAL_ANGLES_RAD.map((rad, i) => (
              <line key={i} x1="0" y1="0" x2={Math.cos(rad)} y2={-Math.sin(rad)} strokeDasharray="0.03 0.03" />
            ))}
          </g>
        )}
        
        {/* Angle Arc */}
        <path ref={arcRef} d={getArcPathStr(angle)} fill="none" stroke="#3b82f6" strokeWidth="0.04" />
        <path ref={arcFillRef} d={`M 0 0 L 0.2 0 ${getArcPathStr(angle).replace('M 0.2 0 ', '')} Z`} fill="rgba(59, 130, 246, 0.15)" />
        
        {/* Triangle */}
        {options.triangle && (
          <g>
            {/* hypotenuse */}
            <line ref={hypRef} x1="0" y1="0" x2={x} y2={-y} stroke="#475569" strokeWidth="0.03" />
            {/* sin line */}
            {activeFunctions.sin && <line ref={sinRef} x1={x} y1="0" x2={x} y2={-y} stroke="#10b981" strokeWidth="0.04" />}
            {/* cos line */}
            {activeFunctions.cos && <line ref={cosRef} x1="0" y1="0" x2={x} y2="0" stroke="#3b82f6" strokeWidth="0.04" />}
          </g>
        )}

        {/* Tangent Line */}
        {activeFunctions.tan && (
          <g>
            {/* Tangent segment at x=1 */}
            <line ref={tanLineRef} x1="1" y1="0" x2="1" y2={Math.abs(Math.tan(angle)) <= 10 ? -Math.tan(angle) : 0} stroke="#f97316" strokeWidth="0.04" opacity={Math.abs(Math.tan(angle)) <= 10 ? 1 : 0} />
            {/* Extended radius to tangent */}
            <line ref={tanExtRef} x1="0" y1="0" x2="1" y2={Math.abs(Math.tan(angle)) <= 10 ? -Math.tan(angle) : 0} stroke="#f97316" strokeWidth="0.02" strokeDasharray="0.04 0.04" opacity={Math.abs(Math.tan(angle)) <= 10 ? 1 : 0} />
          </g>
        )}
        
        {/* Point */}
        <circle 
          ref={pointRef}
          cx={x} 
          cy={-y} 
          r={isDragging ? "0.12" : "0.09"} 
          fill="#ef4444" 
          className="cursor-grab active:cursor-grabbing transition-[r] duration-200" 
          filter="url(#point-glow)"
        />

        {/* Point Coordinates */}
        {options.labels && (
          <text 
            ref={coordsRef}
            x={x + (x > 0 ? 0.12 : -0.12)} 
            y={-y + (y > 0 ? -0.12 : 0.12)} 
            fontSize="0.09" 
            className={`${isDark ? "fill-slate-300" : "fill-slate-800"} font-mono select-none font-bold`}
            textAnchor={x > 0 ? "start" : "end"}
            dominantBaseline="middle"
          >
            ({x.toFixed(2)}, {y.toFixed(2)})
          </text>
        )}

        {/* Labels */}
        {options.labels && (
          <g fontSize="0.12" className={`${isDark ? "fill-slate-400" : "fill-slate-500"} font-medium select-none`} textAnchor="middle" dominantBaseline="middle">
            <text x="1.15" y="0">0</text>
            <text x="0" y="-1.15">π/2</text>
            <text x="-1.15" y="0">π</text>
            <text x="0" y="1.15">3π/2</text>
            {/* x and y labels */}
            <text x="1.25" y="0.12">x</text>
            <text x="0.12" y="-1.25">y</text>
          </g>
        )}
      </svg>
    </div>
  );
});

export default UnitCircle;
