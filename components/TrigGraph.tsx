import React, { useMemo, useRef, useEffect, useState } from 'react';
import { ActiveFunctions } from './TrigSimulation';

interface Props {
  angle: number;
  activeFunctions: ActiveFunctions;
  isExpanded?: boolean;
}

export default function TrigGraph({ angle, activeFunctions, isExpanded = false }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [aspectRatio, setAspectRatio] = useState(2);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        if (height > 0) {
          setAspectRatio(width / height);
        }
      }
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

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

  const xMin = -0.3;
  const xMax = 2 * Math.PI + 0.5;
  const dataWidth = xMax - xMin;
  const dataHeight = 3.0; // -1.5 to 1.5
  
  let vbX = xMin;
  let vbY = -1.5;
  let vbW = dataWidth;
  let vbH = dataHeight;

  const dataAspect = dataWidth / dataHeight;

  if (aspectRatio > dataAspect) {
    vbW = dataHeight * aspectRatio;
    vbX = xMin - (vbW - dataWidth) / 2;
  } else {
    vbH = dataWidth / Math.max(aspectRatio, 0.5); // Prevent extreme vertical stretching on very narrow screens
    vbY = -1.5 - (vbH - dataHeight) / 2;
  }

  const strokeScale = Math.max(vbW / 10, 0.6);
  const pointRadius = 0.08 * strokeScale;

  return (
    <div ref={containerRef} className="w-full h-full flex items-center justify-center">
      <svg 
        viewBox={`${vbX} ${vbY} ${vbW} ${vbH}`} 
        className="w-full h-full" 
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <clipPath id="graph-clip">
            <rect x="-10" y="-10" width={angle + 10} height="20" />
          </clipPath>
          <filter id="glow-strong" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={0.05 * strokeScale} result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Grid */}
        <g stroke="#e2e8f0" strokeWidth={0.015 * strokeScale}>
          {/* X Axis */}
          <line x1={vbX} y1="0" x2={vbX + vbW} y2="0" stroke="#64748b" strokeWidth={0.03 * strokeScale} />
          
          {/* Y Axis lines */}
          <line x1={vbX} y1="-1" x2={vbX + vbW} y2="-1" strokeDasharray={`${0.05 * strokeScale} ${0.05 * strokeScale}`} stroke="#cbd5e1" />
          <line x1={vbX} y1="1" x2={vbX + vbW} y2="1" strokeDasharray={`${0.05 * strokeScale} ${0.05 * strokeScale}`} stroke="#cbd5e1" />
          <line x1={vbX} y1="-0.5" x2={vbX + vbW} y2="-0.5" strokeDasharray={`${0.05 * strokeScale} ${0.05 * strokeScale}`} />
          <line x1={vbX} y1="0.5" x2={vbX + vbW} y2="0.5" strokeDasharray={`${0.05 * strokeScale} ${0.05 * strokeScale}`} />
          
          {/* Vertical lines */}
          {[0, Math.PI/2, Math.PI, 3*Math.PI/2, 2*Math.PI].map((x, i) => (
            <line key={i} x1={x} y1={vbY} x2={x} y2={vbY + vbH} strokeDasharray={`${0.05 * strokeScale} ${0.05 * strokeScale}`} stroke={x === 0 ? "#64748b" : "#e2e8f0"} strokeWidth={x === 0 ? 0.03 * strokeScale : 0.015 * strokeScale} />
          ))}
        </g>
        
        {/* Labels */}
        <g fontSize={0.15 * strokeScale} className="fill-slate-500 font-sans font-medium select-none" textAnchor="middle">
          <text x="0" y={1.2}>0</text>
          <text x={Math.PI/2} y={1.2}>π/2</text>
          <text x={Math.PI} y={1.2}>π</text>
          <text x={3*Math.PI/2} y={1.2}>3π/2</text>
          <text x={2*Math.PI} y={1.2}>2π</text>
          
          <text x="-0.1" y="-0.95" textAnchor="end">1</text>
          <text x="-0.1" y="1.05" textAnchor="end">-1</text>
          
          {/* Axis Labels */}
          <text x={2 * Math.PI + 0.2} y="0.15" className="fill-slate-700 font-bold" fontSize={0.18 * strokeScale}>θ</text>
          <text x="-0.1" y="-1.3" className="fill-slate-700 font-bold" fontSize={0.18 * strokeScale}>y</text>
        </g>

        {/* Full Paths (Faded) */}
        <g opacity="0.15">
          {activeFunctions.sin && <path d={sinPath} fill="none" stroke="#10b981" strokeWidth={0.04 * strokeScale} />}
          {activeFunctions.cos && <path d={cosPath} fill="none" stroke="#3b82f6" strokeWidth={0.04 * strokeScale} />}
          {activeFunctions.tan && tanPaths.map((p, i) => <path key={i} d={p} fill="none" stroke="#f97316" strokeWidth={0.04 * strokeScale} />)}
        </g>

        {/* Clipped Paths (Active) */}
        <g clipPath="url(#graph-clip)">
          {activeFunctions.sin && <path d={sinPath} fill="none" stroke="#10b981" strokeWidth={isExpanded ? 0.08 * strokeScale : 0.06 * strokeScale} strokeLinecap="round" strokeLinejoin="round" />}
          {activeFunctions.cos && <path d={cosPath} fill="none" stroke="#3b82f6" strokeWidth={isExpanded ? 0.08 * strokeScale : 0.06 * strokeScale} strokeLinecap="round" strokeLinejoin="round" />}
          {activeFunctions.tan && tanPaths.map((p, i) => <path key={i} d={p} fill="none" stroke="#f97316" strokeWidth={isExpanded ? 0.08 * strokeScale : 0.06 * strokeScale} strokeLinecap="round" strokeLinejoin="round" />)}
        </g>
        
        {/* Current Angle Line */}
        <line x1={angle} y1={vbY} x2={angle} y2={vbY + vbH} stroke="#94a3b8" strokeWidth={0.03 * strokeScale} strokeDasharray={`${0.1 * strokeScale} ${0.1 * strokeScale}`} />
        
        {/* Points */}
        {activeFunctions.sin && <circle cx={angle} cy={-Math.sin(angle)} r={pointRadius * 1.5} fill="#10b981" filter="url(#glow-strong)" />}
        {activeFunctions.cos && <circle cx={angle} cy={-Math.cos(angle)} r={pointRadius * 1.5} fill="#3b82f6" filter="url(#glow-strong)" />}
        {activeFunctions.tan && Math.abs(Math.tan(angle)) <= 5 && <circle cx={angle} cy={-Math.tan(angle)} r={pointRadius * 1.5} fill="#f97316" filter="url(#glow-strong)" />}
      </svg>
    </div>
  );
}
