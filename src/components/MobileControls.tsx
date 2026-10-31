import React, { useState } from 'react';

interface MobileControlsProps {
  onInteract: () => void;
  onExit: () => void;
  onJumpStart: () => void;
  onJumpEnd: () => void;
  onMoveLeftStart: () => void;
  onMoveLeftEnd: () => void;
  onMoveRightStart: () => void;
  onMoveRightEnd: () => void;
}

export const MobileControls: React.FC<MobileControlsProps> = ({
  onInteract,
  onExit,
  onJumpStart,
  onJumpEnd,
  onMoveLeftStart,
  onMoveLeftEnd,
  onMoveRightStart,
  onMoveRightEnd,
}) => {
  const [activeSlice, setActiveSlice] = useState<string | null>(null);
  const [activeDir, setActiveDir] = useState<'left' | 'right' | null>(null);

  // SVG parameters for 1/3 circular cluster
  const size = 180;
  const center = size / 2;
  const rOuter = 84;
  const rInner = 26;

  // Function to create an annular sector SVG path
  const makeSectorPath = (startAngleDeg: number, endAngleDeg: number, gapDeg = 2.5) => {
    const toRad = (deg: number) => ((deg - 90) * Math.PI) / 180;
    const a1 = toRad(startAngleDeg + gapDeg);
    const a2 = toRad(endAngleDeg - gapDeg);

    const x1Out = center + rOuter * Math.cos(a1);
    const y1Out = center + rOuter * Math.sin(a1);
    const x2Out = center + rOuter * Math.cos(a2);
    const y2Out = center + rOuter * Math.sin(a2);

    const x1In = center + rInner * Math.cos(a2);
    const y1In = center + rInner * Math.sin(a2);
    const x2In = center + rInner * Math.cos(a1);
    const y2In = center + rInner * Math.sin(a1);

    return `M ${x1Out} ${y1Out} A ${rOuter} ${rOuter} 0 0 1 ${x2Out} ${y2Out} L ${x1In} ${y1In} A ${rInner} ${rInner} 0 0 0 ${x2In} ${y2In} Z`;
  };

  // Center point for label placement
  const getSectorLabelPos = (midAngleDeg: number, radiusRatio = 0.65) => {
    const toRad = (deg: number) => ((deg - 90) * Math.PI) / 180;
    const rMid = rInner + (rOuter - rInner) * radiusRatio;
    const a = toRad(midAngleDeg);
    return {
      x: center + rMid * Math.cos(a),
      y: center + rMid * Math.sin(a),
    };
  };

  // 3 equal 120-degree slices:
  // 1. JUMP: Top slice (300° to 60°, centered at 0° / 360°)
  // 2. INTERACT: Bottom-Right slice (60° to 180°, centered at 120°)
  // 3. EXIT: Bottom-Left slice (180° to 300°, centered at 240°)
  const jumpPos = getSectorLabelPos(0);
  const interactPos = getSectorLabelPos(120);
  const exitPos = getSectorLabelPos(240);

  return (
    <div className="pointer-events-none fixed inset-0 z-40 select-none touch-none">
      {/* Left side: Horizontal movement D-Pad */}
      <div className="pointer-events-auto absolute bottom-4 left-4 sm:bottom-6 sm:left-6 flex gap-3">
        <button
          type="button"
          aria-label="Move Left"
          onPointerDown={(e) => {
            e.preventDefault();
            setActiveDir('left');
            onMoveLeftStart();
          }}
          onPointerUp={(e) => {
            e.preventDefault();
            setActiveDir(null);
            onMoveLeftEnd();
          }}
          onPointerLeave={() => {
            if (activeDir === 'left') {
              setActiveDir(null);
              onMoveLeftEnd();
            }
          }}
          className={`flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-xl border-2 transition-all active:scale-95 shadow-lg backdrop-blur-md ${
            activeDir === 'left'
              ? 'border-cyan-400 bg-cyan-500/40 text-cyan-200 shadow-[0_0_15px_rgba(0,255,255,0.6)]'
              : 'border-cyan-500/50 bg-[#0d1527]/80 text-cyan-400 hover:border-cyan-400'
          }`}
        >
          <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24">
            <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z" />
          </svg>
        </button>

        <button
          type="button"
          aria-label="Move Right"
          onPointerDown={(e) => {
            e.preventDefault();
            setActiveDir('right');
            onMoveRightStart();
          }}
          onPointerUp={(e) => {
            e.preventDefault();
            setActiveDir(null);
            onMoveRightEnd();
          }}
          onPointerLeave={() => {
            if (activeDir === 'right') {
              setActiveDir(null);
              onMoveRightEnd();
            }
          }}
          className={`flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-xl border-2 transition-all active:scale-95 shadow-lg backdrop-blur-md ${
            activeDir === 'right'
              ? 'border-cyan-400 bg-cyan-500/40 text-cyan-200 shadow-[0_0_15px_rgba(0,255,255,0.6)]'
              : 'border-cyan-500/50 bg-[#0d1527]/80 text-cyan-400 hover:border-cyan-400'
          }`}
        >
          <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
          </svg>
        </button>
      </div>

      {/* Bottom right corner: 1/3 Circular Cluster (Interact, Exit, Jump) */}
      <div className="pointer-events-auto absolute bottom-3 right-3 sm:bottom-6 sm:right-6">
        <div className="relative flex items-center justify-center">
          <svg
            viewBox={`0 0 ${size} ${size}`}
            className="w-36 h-36 sm:w-44 sm:h-44 md:w-48 md:h-48 drop-shadow-[0_0_16px_rgba(0,255,255,0.3)]"
          >
            {/* Background disc glow ring */}
            <circle
              cx={center}
              cy={center}
              r={rOuter + 3}
              fill="none"
              stroke="rgba(0, 255, 255, 0.2)"
              strokeWidth="2"
              strokeDasharray="4 4"
            />

            {/* SLICE 1: JUMP (300° to 60° = 120° sector) */}
            <g
              className="cursor-pointer transition-transform"
              onPointerDown={(e) => {
                e.preventDefault();
                setActiveSlice('jump');
                onJumpStart();
              }}
              onPointerUp={(e) => {
                e.preventDefault();
                setActiveSlice(null);
                onJumpEnd();
              }}
              onPointerLeave={() => {
                if (activeSlice === 'jump') {
                  setActiveSlice(null);
                  onJumpEnd();
                }
              }}
            >
              <path
                d={makeSectorPath(300, 420)}
                fill={activeSlice === 'jump' ? '#00e5ff' : 'rgba(16, 25, 48, 0.88)'}
                stroke="#00ffff"
                strokeWidth={activeSlice === 'jump' ? '3' : '2'}
                className="transition-colors"
              />
              <text
                x={jumpPos.x}
                y={jumpPos.y - 7}
                textAnchor="middle"
                dominantBaseline="central"
                fill={activeSlice === 'jump' ? '#030308' : '#00ffff'}
                className="font-bold text-[13px] font-mono pointer-events-none"
              >
                ▲
              </text>
              <text
                x={jumpPos.x}
                y={jumpPos.y + 7}
                textAnchor="middle"
                dominantBaseline="central"
                fill={activeSlice === 'jump' ? '#030308' : '#e0f7ff'}
                className="font-bold text-[10px] sm:text-[11px] font-mono pointer-events-none tracking-wider"
              >
                JUMP
              </text>
            </g>

            {/* SLICE 2: INTERACT (60° to 180° = 120° sector) */}
            <g
              className="cursor-pointer transition-transform"
              onPointerDown={(e) => {
                e.preventDefault();
                setActiveSlice('interact');
                onInteract();
              }}
              onPointerUp={(e) => {
                e.preventDefault();
                setActiveSlice(null);
              }}
              onPointerLeave={() => {
                if (activeSlice === 'interact') setActiveSlice(null);
              }}
            >
              <path
                d={makeSectorPath(60, 180)}
                fill={activeSlice === 'interact' ? '#ff9900' : 'rgba(28, 20, 38, 0.88)'}
                stroke="#ffaa00"
                strokeWidth={activeSlice === 'interact' ? '3' : '2'}
                className="transition-colors"
              />
              <text
                x={interactPos.x}
                y={interactPos.y - 7}
                textAnchor="middle"
                dominantBaseline="central"
                fill={activeSlice === 'interact' ? '#030308' : '#ffaa00'}
                className="font-bold text-[13px] font-mono pointer-events-none"
              >
                ⚡
              </text>
              <text
                x={interactPos.x}
                y={interactPos.y + 7}
                textAnchor="middle"
                dominantBaseline="central"
                fill={activeSlice === 'interact' ? '#030308' : '#ffe8c2'}
                className="font-bold text-[9px] sm:text-[10px] font-mono pointer-events-none tracking-wider"
              >
                INTERACT
              </text>
            </g>

            {/* SLICE 3: EXIT (180° to 300° = 120° sector) */}
            <g
              className="cursor-pointer transition-transform"
              onPointerDown={(e) => {
                e.preventDefault();
                setActiveSlice('exit');
                onExit();
              }}
              onPointerUp={(e) => {
                e.preventDefault();
                setActiveSlice(null);
              }}
              onPointerLeave={() => {
                if (activeSlice === 'exit') setActiveSlice(null);
              }}
            >
              <path
                d={makeSectorPath(180, 300)}
                fill={activeSlice === 'exit' ? '#ff3366' : 'rgba(38, 16, 26, 0.88)'}
                stroke="#ff3366"
                strokeWidth={activeSlice === 'exit' ? '3' : '2'}
                className="transition-colors"
              />
              <text
                x={exitPos.x}
                y={exitPos.y - 7}
                textAnchor="middle"
                dominantBaseline="central"
                fill={activeSlice === 'exit' ? '#030308' : '#ff3366'}
                className="font-bold text-[13px] font-mono pointer-events-none"
              >
                ✕
              </text>
              <text
                x={exitPos.x}
                y={exitPos.y + 7}
                textAnchor="middle"
                dominantBaseline="central"
                fill={activeSlice === 'exit' ? '#030308' : '#ffd4de'}
                className="font-bold text-[10px] sm:text-[11px] font-mono pointer-events-none tracking-wider"
              >
                EXIT
              </text>
            </g>

            {/* Center Nexus Hub */}
            <circle
              cx={center}
              cy={center}
              r={rInner - 2}
              fill="#080c18"
              stroke="#00ffff"
              strokeWidth="2"
            />
            <circle
              cx={center}
              cy={center}
              r={6}
              fill="#00ffff"
              className="animate-pulse"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};
