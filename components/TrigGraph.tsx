import React, { useMemo } from 'react';
import { ActiveFunctions } from './TrigSimulation';

interface Props {
  angle: number;
  activeFunctions: ActiveFunctions;
}

export default function TrigGraph({ angle, activeFunctions }: Props) {
  const { sinPath, cosPath, tanPaths } = useMemo(() => {
    const sinPts = [];
    const cosPts = [];
    const tanPtsArray = [];
    let currentTanPts = [];
    
    for (let x = 0; x <= 2 * Math.PI; x += 0.05) {
      sinPts.push(`${x},${-Math.sin(x)}`);
      cosPts.push(`${x},${-Math.cos(x)}`);
      
      const tanY = Math.tan(x);
      if (tanY > 5 || tanY < -5) {
        if (currentTanPts.length > 0) {
          tanPtsArray.push(currentTanPts.join(' L '));
          currentTanPts = [];
        }
      } else {
        currentTanPts.push(`${x},${-tanY}`);
      }
    }
    
    // Add the last point exactly at 2PI
    sinPts.push(`${2 * Math.PI},${-Math.sin(2 * Math.PI)}`);
    cosPts.push(`${2 * Math.PI},${-Math.cos(2 * Math.PI)}`);
    currentTanPts.push(`${2 * Math.PI},${-Math.tan(2 * Math.PI)}`);
    
    if (currentTanPts.length > 0) {
      tanPtsArray.push(currentTanPts.join(' L '));
    }

    return {
      sinPath: `M ${sinPts.join(' L ')}`,
      cosPath: `M ${cosPts.join(' L ')}`,
      tanPaths: tanPtsArray.map(pts => `M ${pts}`)
    };
  }, []);

  return (
    <svg 
      viewBox="-0.5 -2.5 7.5 5" 
      className="w-full h-full" 
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <clipPath id="graph-clip">
          <rect x="0" y="-3" width={angle} height="6" />
        </clipPath>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="0.1" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Grid */}
      <g stroke="#e2e8f0" strokeWidth="0.02">
        <line x1="0" y1="0" x2={2 * Math.PI} y2="0" stroke="#94a3b8" />
        <line x1="0" y1="-2" x2={2 * Math.PI} y2="-2" strokeDasharray="0.1 0.1" />
        <line x1="0" y1="2" x2={2 * Math.PI} y2="2" strokeDasharray="0.1 0.1" />
        <line x1="0" y1="-1" x2={2 * Math.PI} y2="-1" strokeDasharray="0.05 0.05" />
        <line x1="0" y1="1" x2={2 * Math.PI} y2="1" strokeDasharray="0.05 0.05" />
        
        {[0, Math.PI/2, Math.PI, 3*Math.PI/2, 2*Math.PI].map((x, i) => (
          <line key={i} x1={x} y1="-2.5" x2={x} y2="2.5" strokeDasharray="0.1 0.1" />
        ))}
      </g>
      
      {/* Labels */}
      <g fontSize="0.2" className="fill-slate-400 font-sans select-none" textAnchor="middle">
        <text x="0" y="2.4">0</text>
        <text x={Math.PI/2} y="2.4">π/2</text>
        <text x={Math.PI} y="2.4">π</text>
        <text x={3*Math.PI/2} y="2.4">3π/2</text>
        <text x={2*Math.PI} y="2.4">2π</text>
        
        <text x="-0.2" y="-0.9" textAnchor="end">1</text>
        <text x="-0.2" y="-1.9" textAnchor="end">2</text>
        <text x="-0.2" y="1.1" textAnchor="end">-1</text>
        <text x="-0.2" y="2.1" textAnchor="end">-2</text>
      </g>

      {/* Full Paths (Faded) */}
      <g opacity="0.2">
        {activeFunctions.sin && <path d={sinPath} fill="none" stroke="#10b981" strokeWidth="0.04" />}
        {activeFunctions.cos && <path d={cosPath} fill="none" stroke="#3b82f6" strokeWidth="0.04" />}
        {activeFunctions.tan && tanPaths.map((p, i) => <path key={i} d={p} fill="none" stroke="#f97316" strokeWidth="0.04" />)}
      </g>

      {/* Clipped Paths (Active) */}
      <g clipPath="url(#graph-clip)">
        {activeFunctions.sin && <path d={sinPath} fill="none" stroke="#10b981" strokeWidth="0.06" />}
        {activeFunctions.cos && <path d={cosPath} fill="none" stroke="#3b82f6" strokeWidth="0.06" />}
        {activeFunctions.tan && tanPaths.map((p, i) => <path key={i} d={p} fill="none" stroke="#f97316" strokeWidth="0.06" />)}
      </g>
      
      {/* Current Angle Line */}
      <line x1={angle} y1="-2.5" x2={angle} y2="2.5" stroke="#94a3b8" strokeWidth="0.03" strokeDasharray="0.1 0.1" />
      
      {/* Points */}
      {activeFunctions.sin && <circle cx={angle} cy={-Math.sin(angle)} r="0.08" fill="#10b981" filter="url(#glow)" />}
      {activeFunctions.cos && <circle cx={angle} cy={-Math.cos(angle)} r="0.08" fill="#3b82f6" filter="url(#glow)" />}
      {activeFunctions.tan && Math.abs(Math.tan(angle)) <= 5 && <circle cx={angle} cy={-Math.tan(angle)} r="0.08" fill="#f97316" filter="url(#glow)" />}
    </svg>
  );
}
