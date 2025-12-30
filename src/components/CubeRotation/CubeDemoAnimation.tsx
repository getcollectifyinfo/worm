import React, { useEffect, useState } from 'react';

interface CubeDemoAnimationProps {
  mode?: 'demo' | 'left' | 'right' | 'front' | 'back';
}

export const CubeDemoAnimation: React.FC<CubeDemoAnimationProps> = ({ mode = 'demo' }) => {
  const [step, setStep] = useState(0); 
  // 0: Center
  // 1: Left
  // 2: Center
  // 3: Right
  // 4: Center
  // 5: Front (Forward)
  // 6: Center
  // 7: Back (Backward)

  useEffect(() => {
    // Reset step when mode changes
    // Using setTimeout to avoid synchronous state update warning, 
    // though the best practice is often key-based reset in parent.
    setTimeout(() => setStep(0), 0);

    const interval = setInterval(() => {
      setStep(prev => {
        if (mode === 'demo') {
            return (prev + 1) % 8;
        } else if (mode === 'left') {
            // 0 -> 1 -> 2 -> 0...
            // Actually let's just do 0 -> 1 -> 0 -> 1
            // 0: Center, 1: Left
            return prev === 0 ? 1 : 0;
        } else if (mode === 'right') {
            // 0 -> 3 -> 0
            // 0: Center, 3: Right
            return prev === 0 ? 3 : 0;
        } else if (mode === 'front') {
             // 0 -> 5 -> 0
             return prev === 0 ? 5 : 0;
        } else if (mode === 'back') {
             // 0 -> 7 -> 0
             return prev === 0 ? 7 : 0;
        }
        return 0;
      });
    }, 2500);
    return () => clearInterval(interval);
  }, [mode]);

  const getTransform = () => {
    // Add a static perspective rotation (Isometric-ish view)
    // rotateX(-25deg) shows the top face
    // rotateY(-35deg) shows the right face
    const baseRotation = 'rotateX(-25deg) rotateY(-35deg)';
    
    switch(step) {
        case 1: return `${baseRotation} rotateZ(-90deg)`; // Left
        case 3: return `${baseRotation} rotateZ(90deg)`;  // Right
        case 5: return `${baseRotation} rotateX(-90deg)`; // Front (Forward) - Note: In CSS 3D, rotating X negative usually tilts top away
        // Let's check coordinate system.
        // rotateX(90deg) brings bottom to front? 
        // We want "Forward" roll. Top goes to Front. Front goes to Bottom.
        // That is rotateX(-90deg).
        case 7: return `${baseRotation} rotateX(90deg)`;  // Back (Backward) - Top goes to Back. Back goes to Bottom.
        default: return `${baseRotation} rotateZ(0deg) rotateX(0deg)`;
    }
  };

  const getLabel = () => {
    switch(step) {
        case 1: return "Sola Yatırıldı (LEFT)";
        case 3: return "Sağa Yatırıldı (RIGHT)";
        case 5: return "Öne Yatırıldı (FRONT)";
        case 7: return "Arkaya Yatırıldı (BACK)";
        default: return "Başlangıç";
    }
  };

  const getDescription = () => {
    switch(step) {
        case 1: return "RIGHT → TOP, FRONT → Sola döndü";
        case 3: return "LEFT → TOP, FRONT → Sağa döndü";
        case 5: return "TOP → FRONT, FRONT → Alta indi";
        case 7: return "FRONT → TOP, TOP → Arkaya indi";
        default: return "FRONT (Yüz), TOP (Üst), RIGHT (Sağ)";
    }
  };

  // Cube size
  const size = 120;
  const half = size / 2;

  // Face styles
  const faceStyle: React.CSSProperties = {
    position: 'absolute',
    width: `${size}px`,
    height: `${size}px`,
    border: '2px solid rgba(255, 255, 255, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    fontWeight: 'bold',
    color: 'white',
    backfaceVisibility: 'visible', // We want to see backs of faces if transparency allows, or hidden if opaque.
    // Let's make them semi-transparent to see structure, or opaque for clear labeling.
    // User description implies reading text, so opaque is better.
    backgroundColor: 'rgba(30, 41, 59, 0.9)', // Slate-800-ish
    boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)',
  };

  return (
    <div className="flex flex-col items-center gap-12 py-12">
      <div 
        className="relative" 
        style={{ 
          width: size, 
          height: size, 
          perspective: '1000px' 
        }}
      >
        <div
          className="relative w-full h-full transition-transform duration-1000 ease-in-out"
          style={{
            transformStyle: 'preserve-3d',
            transform: getTransform(),
          }}
        >
          {/* FRONT */}
          <div style={{ ...faceStyle, transform: `translateZ(${half}px)` }}>
            FRONT
          </div>

          {/* BACK */}
          <div style={{ ...faceStyle, transform: `rotateY(180deg) translateZ(${half}px)` }}>
            BACK
          </div>

          {/* RIGHT */}
          <div style={{ ...faceStyle, transform: `rotateY(90deg) translateZ(${half}px)`, backgroundColor: 'rgba(59, 130, 246, 0.9)' }}>
            RIGHT
          </div>

          {/* LEFT */}
          <div style={{ ...faceStyle, transform: `rotateY(-90deg) translateZ(${half}px)`, backgroundColor: 'rgba(239, 68, 68, 0.9)' }}>
            LEFT
          </div>

          {/* TOP */}
          <div style={{ ...faceStyle, transform: `rotateX(90deg) translateZ(${half}px)`, backgroundColor: 'rgba(16, 185, 129, 0.9)' }}>
            TOP
          </div>

          {/* BOTTOM */}
          <div style={{ ...faceStyle, transform: `rotateX(-90deg) translateZ(${half}px)` }}>
            BOTTOM
          </div>
        </div>
      </div>

      <div className="text-center space-y-1">
        <div className="text-lg font-bold text-white">
          {getLabel()}
        </div>
        <div className="text-sm text-gray-400">
            {getDescription()}
        </div>
      </div>
    </div>
  );
};
