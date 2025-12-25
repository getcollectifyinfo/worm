import React, { useEffect, useState, useRef } from 'react';

interface GaugeProps {
  size?: number;
  initialValue?: number; // 0 to 100
}

export const Gauge: React.FC<GaugeProps> = ({ size = 200, initialValue = 50 }) => {
  // Value is 0-100. 0 is min (left), 100 is max (right)
  const [value, setValue] = useState(initialValue);
  const targetValueRef = useRef(initialValue);
  const animationSpeedRef = useRef(0.5); // steps per frame

  useEffect(() => {
    let animationFrameId: number;

    const update = () => {
      // 1. Check if we reached the target
      if (Math.abs(value - targetValueRef.current) < 1) {
        // Pick a new random target (0-100)
        targetValueRef.current = Math.random() * 100;
        // Pick a new random speed (0.2 to 1.5)
        animationSpeedRef.current = 0.2 + Math.random() * 1.3;
      }

      // 2. Move towards target
      setValue(prev => {
        const diff = targetValueRef.current - prev;
        const step = animationSpeedRef.current;
        
        if (Math.abs(diff) < step) return targetValueRef.current;
        return prev + (diff > 0 ? step : -step);
      });

      animationFrameId = requestAnimationFrame(update);
    };

    animationFrameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationFrameId);
  }, [value]); // Depend on value to trigger re-renders, but ref logic handles continuity

  // Gauge Drawing Math
  // Start angle: 135 degrees (bottom left)
  // End angle: 405 degrees (bottom right) -> Total sweep 270 degrees
  const radius = size / 2;
  const center = radius;
  const strokeWidth = size * 0.15;
  const innerRadius = radius - strokeWidth;

  // Calculate needle rotation
  // 0 -> 225deg (bottom left)
  // 100 -> 495deg (bottom right)
  // Range is 270 degrees.
  const rotation = 225 + (value / 100) * 270;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background Circle (Dark Gray/Black border) */}
        <circle
          cx={center}
          cy={center}
          r={radius - strokeWidth / 2}
          fill="#333"
          stroke="#000"
          strokeWidth="4"
        />

        {/* Colored Arcs */}
        {/* Green Segment (0-25%) */}
        <path
          d={describeArc(center, center, innerRadius, 225, 292.5)}
          fill="none"
          stroke="#22c55e" // Green-500
          strokeWidth={strokeWidth}
        />
        {/* Yellow Segment (25-50%) */}
        <path
          d={describeArc(center, center, innerRadius, 292.5, 360)}
          fill="none"
          stroke="#eab308" // Yellow-500
          strokeWidth={strokeWidth}
        />
        {/* Orange Segment (50-75%) */}
        <path
          d={describeArc(center, center, innerRadius, 360, 427.5)}
          fill="none"
          stroke="#f97316" // Orange-500
          strokeWidth={strokeWidth}
        />
        {/* Red Segment (75-100%) */}
        <path
          d={describeArc(center, center, innerRadius, 427.5, 495)}
          fill="none"
          stroke="#ef4444" // Red-500
          strokeWidth={strokeWidth}
        />

        {/* Needle */}
        <g transform={`rotate(${rotation}, ${center}, ${center})`}>
            {/* Needle Line */}
            <path
                d={`M ${center} ${center + strokeWidth} L ${center} ${strokeWidth + 10} L ${center} ${center + strokeWidth} Z`} 
                // Simple tapering line? No, let's draw a proper needle
                // Pointing UP (0 degrees) initially, then rotated.
                // Tip is at (center, padding). Base is at (center, center).
            />
             <line
              x1={center}
              y1={center}
              x2={center}
              y2={strokeWidth + 10} // Just inside the arc
              stroke="black"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <line
              x1={center}
              y1={center}
              x2={center}
              y2={strokeWidth + 10} // Just inside the arc
              stroke="black"
              strokeWidth="2" // Thinner tip visual?
              strokeLinecap="round"
            />
        </g>
        
        {/* Pivot Point */}
        <circle cx={center} cy={center} r={strokeWidth * 0.4} fill="black" />
      </svg>
    </div>
  );
};

// Helper for SVG Arcs
function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
}

function describeArc(x: number, y: number, radius: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return [
    "M", start.x, start.y,
    "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
  ].join(" ");
}
