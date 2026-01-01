import React from 'react';

interface CockpitGaugeProps {
  value: number; // 0 to 100
  label: string;
  size?: number;
}

export const CockpitGauge: React.FC<CockpitGaugeProps> = ({ value, label, size = 200 }) => {
  // Clamp value between 0 and 100
  const clampedValue = Math.min(Math.max(value, 0), 100);

  const center = size / 2;
  const radius = (size / 2) * 0.8;
  const strokeWidth = size * 0.1;
  
  // Angles in degrees. 0 is 3 o'clock.
  // We want a gauge from roughly 135deg (bottom left) to 45deg (bottom right) clockwise?
  // Usually gauges go from e.g. 135 to 405 (270 degree span).
  // Let's say -225 deg to -315 deg?
  // Standard: Start at 135 degrees (bottom left), go clockwise to 45 degrees (bottom right).
  // In SVG coords (0 is 3 o'clock, clockwise positive):
  // Start: 135 deg. End: 405 deg. Span: 270 deg.
  
  const startAngle = 135;
  const endAngle = 405;
  const angleRange = endAngle - startAngle;
  
  const currentAngle = startAngle + (clampedValue / 100) * angleRange;

  // Helper to get coordinates
  const getCoords = (angleInDegrees: number, r: number) => {
    const angleInRadians = (angleInDegrees * Math.PI) / 180;
    return {
      x: center + r * Math.cos(angleInRadians),
      y: center + r * Math.sin(angleInRadians),
    };
  };

  const startCoords = getCoords(startAngle, radius);
  const endCoords = getCoords(endAngle, radius);
  
  // Large arc flag: if span > 180, it's 1. Here span is 270, so 1.
  const backgroundPath = `
    M ${startCoords.x} ${startCoords.y}
    A ${radius} ${radius} 0 1 1 ${endCoords.x} ${endCoords.y}
  `;

  // For the colored arc (value)
  const currentCoords = getCoords(currentAngle, radius);
  const isLargeArc = (currentAngle - startAngle) > 180 ? 1 : 0;
  
  const valuePath = `
    M ${startCoords.x} ${startCoords.y}
    A ${radius} ${radius} 0 ${isLargeArc} 1 ${currentCoords.x} ${currentCoords.y}
  `;

  // Ticks
  const ticks = [];
  const tickCount = 11; // 0, 10, ..., 100
  for (let i = 0; i < tickCount; i++) {
    // const tickValue = (i / (tickCount - 1)) * 100; // Unused
    const tickAngle = startAngle + (i / (tickCount - 1)) * angleRange;
    const inner = getCoords(tickAngle, radius - strokeWidth / 2 - 5);
    const outer = getCoords(tickAngle, radius - strokeWidth / 2 + 5);
    ticks.push(
      <line
        key={i}
        x1={inner.x}
        y1={inner.y}
        x2={outer.x}
        y2={outer.y}
        stroke="#6b7280"
        strokeWidth="2"
      />
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="overflow-visible">
          <defs>
            <linearGradient id={`gauge-gradient-${label}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ef4444" /> {/* Red */}
              <stop offset="50%" stopColor="#eab308" /> {/* Yellow */}
              <stop offset="100%" stopColor="#22c55e" /> {/* Green */}
            </linearGradient>
          </defs>
          
          {/* Background Arc */}
          <path
            d={backgroundPath}
            fill="none"
            stroke="#374151" // Gray-700
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Value Arc */}
          <path
            d={valuePath}
            fill="none"
            stroke={`url(#gauge-gradient-${label})`}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Ticks */}
          {ticks}

          {/* Needle */}
          {/* We can use a simple line or a fancy polygon */}
          <g transform={`rotate(${currentAngle}, ${center}, ${center})`}>
             <line 
                x1={center - 10} 
                y1={center} 
                x2={center + radius - 10} 
                y2={center} 
                stroke="white" 
                strokeWidth="2"
                transform="rotate(180, 0, 0) translate(0,0)" // Adjust logic if needed, but rotate handles angle
             />
             {/* Let's draw a proper needle pointing to 0 deg (3 o'clock) then rotated */}
             {/* Center is pivot. Needle points to right. */}
             <path d={`M ${center - 10} ${center} L ${center + radius - 10} ${center} L ${center - 10} ${center} Z`} stroke="white" strokeWidth="2" />
             <circle cx={center} cy={center} r={6} fill="#1f2937" stroke="white" strokeWidth="2" />
             {/* Actually simpler: just a line from center to edge */}
             <line
                x1={center}
                y1={center}
                x2={center + radius - 5}
                y2={center}
                stroke="white"
                strokeWidth="2"
             />
          </g>
          
          {/* Value Text */}
          <text
            x={center}
            y={center + size * 0.25}
            textAnchor="middle"
            className="fill-white text-3xl font-bold font-mono"
            style={{ fontSize: size * 0.15 }}
          >
            {Math.round(value)}
          </text>
          
          {/* Label */}
          <text
            x={center}
            y={center - size * 0.1}
            textAnchor="middle"
            className="fill-gray-400 text-sm font-bold uppercase tracking-wider"
            style={{ fontSize: size * 0.08 }}
          >
            {label}
          </text>
        </svg>
      </div>
    </div>
  );
};
