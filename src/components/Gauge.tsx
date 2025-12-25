import React, { useEffect, useState, useRef } from 'react';

interface GaugeProps {
  size?: number;
  initialValue?: number; // 0 to 100
  isLockedInRed?: boolean;
  onRedZoneEnter?: () => void;
}

export const Gauge: React.FC<GaugeProps> = ({ 
  size = 200, 
  initialValue = 50,
  isLockedInRed = false,
  onRedZoneEnter
}) => {
  // Value is 0-100. 0 is min (left), 100 is max (right)
  const [value, setValue] = useState(initialValue);
  const targetValueRef = useRef(initialValue);
  const animationSpeedRef = useRef(0.5); // steps per frame
  const isLockedInRedRef = useRef(isLockedInRed);
  const wasInRedRef = useRef(initialValue >= 75);

  // Update ref when prop changes
  useEffect(() => {
    isLockedInRedRef.current = isLockedInRed;
    // If we are unlocked and currently in red, force a move out
    if (!isLockedInRed && value >= 75) {
       targetValueRef.current = Math.random() * 70; // Target somewhere safe
    }
  }, [isLockedInRed, value]);

  useEffect(() => {
    let animationFrameId: number;

    const update = () => {
      // Check Red Zone Entry
      const inRed = value >= 75;
      if (inRed && !wasInRedRef.current) {
        if (onRedZoneEnter) onRedZoneEnter();
      }
      wasInRedRef.current = inRed;

      // 1. Check if we reached the target
      if (Math.abs(value - targetValueRef.current) < 1) {
        // Pick a new random target (0-100)
        let newTarget = Math.random() * 100;
        
        // If locked in red, ensure target is in red (75-100)
        if (isLockedInRedRef.current && inRed) {
             newTarget = 75 + Math.random() * 25;
        } 
        // If NOT locked but currently in red, we probably want to get out? 
        // The natural random * 100 will eventually take us out. 
        // But if we just got unlocked, the useEffect above handles the immediate force-out.
        // So here we just behave normally, unless we are locked.

        targetValueRef.current = newTarget;
        
        // Pick a new random speed (lower speed as requested)
        animationSpeedRef.current = 0.1 + Math.random() * 0.4;
      }
      
      // Enforce lock if we are in red: Don't let target be outside red
      if (isLockedInRedRef.current && inRed && targetValueRef.current < 75) {
          targetValueRef.current = 75 + Math.random() * 25;
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
  }, [value, onRedZoneEnter]); // Depend on value to trigger re-renders, but ref logic handles continuity

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
        {/* Dark Green Segment (0-12.5%) */}
        <path
          d={describeArc(center, center, innerRadius, 225, 258.75)}
          fill="none"
          stroke="#166534" // Green-800
          strokeWidth={strokeWidth}
        />
        {/* Light Green Segment (12.5-25%) */}
        <path
          d={describeArc(center, center, innerRadius, 258.75, 292.5)}
          fill="none"
          stroke="#4ade80" // Green-400
          strokeWidth={strokeWidth}
        />
        {/* Dark Yellow Segment (25-37.5%) */}
        <path
          d={describeArc(center, center, innerRadius, 292.5, 326.25)}
          fill="none"
          stroke="#854d0e" // Yellow-800
          strokeWidth={strokeWidth}
        />
        {/* Light Yellow Segment (37.5-50%) */}
        <path
          d={describeArc(center, center, innerRadius, 326.25, 360)}
          fill="none"
          stroke="#facc15" // Yellow-400
          strokeWidth={strokeWidth}
        />
        {/* Orange Segment (50-62.5%) */}
        <path
          d={describeArc(center, center, innerRadius, 360, 393.75)}
          fill="none"
          stroke="#fb923c" // Orange-400
          strokeWidth={strokeWidth}
        />
        {/* Dark Orange Segment (62.5-75%) */}
        <path
          d={describeArc(center, center, innerRadius, 393.75, 427.5)}
          fill="none"
          stroke="#ea580c" // Orange-600
          strokeWidth={strokeWidth}
        />
        {/* Red Segment (75-87.5%) */}
        <path
          d={describeArc(center, center, innerRadius, 427.5, 461.25)}
          fill="none"
          stroke="#f87171" // Red-400
          strokeWidth={strokeWidth}
        />
        {/* Dark Red Segment (87.5-100%) */}
        <path
          d={describeArc(center, center, innerRadius, 461.25, 495)}
          fill="none"
          stroke="#991b1b" // Red-800
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
