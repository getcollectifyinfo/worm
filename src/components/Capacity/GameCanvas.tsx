import React, { useEffect, useRef } from 'react';
import type { CapacitySettings } from './types';

interface Obstacle {
    y: number;
    leftX: number;
    rightX: number;
    passed: boolean;
    hit: boolean;
    processed: boolean;
}

interface GameCanvasProps {
    gameState: string;
    isPaused: boolean;
    settings: CapacitySettings;
    onFail: () => void;
    flightFails: number;
    totalObstacles: number;
    onObstaclePassed?: () => void;
    onFireStart?: () => void;
    onFireEnd?: () => void;
}

const GameCanvas: React.FC<GameCanvasProps> = ({ 
    gameState, 
    isPaused, 
    settings, 
    onFail, 
    flightFails, 
    totalObstacles, 
    onObstaclePassed, 
    onFireStart, 
    onFireEnd 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number | null>(null);
  const planePosRef = useRef(0.5); // 0.0 to 1.0 (relative to width)
  const obstaclesRef = useRef<Obstacle[]>([]);
  const keysPressed = useRef<{[key: string]: boolean}>({});
  const lastTimeRef = useRef(0);
  const lastSpawnTimeRef = useRef(0);
  const pathCenterRef = useRef(0.5); // Center of the path (0.0 to 1.0)
  
  // Gamepad Fire Tracking
  const prevFirePressedRef = useRef(false);
  
  // Callback Refs to avoid stale closures in loop
  const onFireStartRef = useRef(onFireStart);
  const onFireEndRef = useRef(onFireEnd);

  useEffect(() => {
      onFireStartRef.current = onFireStart;
      onFireEndRef.current = onFireEnd;
  }, [onFireStart, onFireEnd]);

  // Game state refs
  const isRedRef = useRef(false);
  const redTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const failCountRef = useRef(0); // Local ref for immediate drawing
  
  // Stats Refs (from props)
  const statsRef = useRef({ flightFails: 0, totalObstacles: 0 });
  useEffect(() => {
      statsRef.current = { flightFails, totalObstacles };
      failCountRef.current = flightFails; 
  }, [flightFails, totalObstacles]);
  
  // Settings Refs (to access latest in loop)
  const settingsRef = useRef(settings);
  useEffect(() => {
      settingsRef.current = settings;
  }, [settings]);
  
  // Colors
  const COLOR_ORANGE = '#FF9F43';
  const COLOR_BLUE = '#2E86DE';
  
  // Handle Game State in Ref to access inside animation loop
  const gameStateRef = useRef(gameState);
  useEffect(() => {
      gameStateRef.current = gameState;
  }, [gameState]);

  // Handle Paused State in Ref
  const isPausedRef = useRef(isPaused);
  useEffect(() => {
      isPausedRef.current = isPaused;
      if (!isPaused) {
          // Reset lastTime to prevent big deltaTime jump on resume
          lastTimeRef.current = 0;
      }
  }, [isPaused]);

  const triggerFail = React.useCallback(() => {
      failCountRef.current += 1;
      onFail(); // Notify App
      
      // Flash Red
      isRedRef.current = true;
      if (redTimeoutRef.current) clearTimeout(redTimeoutRef.current);
      redTimeoutRef.current = setTimeout(() => {
          isRedRef.current = false;
      }, 500); // 500ms red flash
  }, [onFail]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;
    
    // Resize handler
    const handleResize = () => {
      const parent = canvas.parentElement;
      if (parent) {
          canvas.width = parent.clientWidth;
          canvas.height = parent.clientHeight;
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize(); 
    
    // Input handling
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current[e.code] = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.code] = false;
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    const update = (deltaTime: number, width: number, height: number) => {
        // Only update if game is running and NOT paused
        if (gameStateRef.current !== 'running' || isPausedRef.current) return;

        const { planeSpeed, spawnRate, scrollSpeed } = settingsRef.current;
        const SCROLL_SPEED = scrollSpeed || 0.1; // Use setting or default

        // Gamepad Polling
        const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
        const gp = gamepads[0]; // Assume first controller
        
        if (gp) {
            // Axis 0 (Left Stick X)
            const axisX = gp.axes[0];
            if (Math.abs(axisX) > 0.1) { // Deadzone
                // Move plane
                const moveAmount = axisX * planeSpeed * deltaTime * 2.0; // 2x multiplier for good feel
                planePosRef.current = Math.max(0.1, Math.min(0.9, planePosRef.current + moveAmount));
            }

            // Button 0 (A/Cross) or Button 1 (B/Circle) or Triggers - Trigger Fire
            // Buttons: 0 (A), 1 (B), 2 (X), 3 (Y), 4 (LB), 5 (RB), 6 (LT), 7 (RT)
            const isPressed = gp.buttons.some((b, i) => (i === 0 || i === 1 || i === 2 || i === 3 || i === 5 || i === 7) && b.pressed);
            
            if (isPressed && !prevFirePressedRef.current) {
                if (onFireStartRef.current) onFireStartRef.current();
            } else if (!isPressed && prevFirePressedRef.current) {
                if (onFireEndRef.current) onFireEndRef.current();
            }
            prevFirePressedRef.current = isPressed;
        }

        // Move Plane (Keyboard)
        if (keysPressed.current['ArrowLeft']) {
          planePosRef.current = Math.max(0.1, planePosRef.current - planeSpeed * deltaTime);
        }
        if (keysPressed.current['ArrowRight']) {
          planePosRef.current = Math.min(0.9, planePosRef.current + planeSpeed * deltaTime);
        }
        
        // Spawn Obstacles
        if (lastTimeRef.current - lastSpawnTimeRef.current > spawnRate) {
          const gapWidth = settingsRef.current.gapWidth || 0.25; 
          
          // Smooth Path Logic: Move center slightly from previous position
          const maxShift = 0.08; 
          const randomShift = (Math.random() * 2 - 1) * maxShift;
          let newCenter = pathCenterRef.current + randomShift;
          
          // Clamp center to keep gap within screen bounds
          const margin = 0.1; 
          const minCenter = (gapWidth / 2) + margin;
          const maxCenter = 1 - (gapWidth / 2) - margin;
          
          if (newCenter < minCenter) newCenter = minCenter;
          if (newCenter > maxCenter) newCenter = maxCenter;
          
          pathCenterRef.current = newCenter;
          
          obstaclesRef.current.push({
            y: -50, 
            leftX: newCenter - gapWidth / 2, 
            rightX: newCenter + gapWidth / 2, 
            passed: false,
            hit: false,
            processed: false
          });
          
          lastSpawnTimeRef.current = lastTimeRef.current;
        }
        
        // Move Obstacles
        const pixelsMove = SCROLL_SPEED * deltaTime;
        obstaclesRef.current.forEach(obs => {
          obs.y += pixelsMove;
        });
        
        // Remove off-screen obstacles
        obstaclesRef.current = obstaclesRef.current.filter(obs => obs.y < height + 50);
        
        // Collision & Passing Logic
        const planeX = planePosRef.current * width;
        const planeY = height - 180;
        
        obstaclesRef.current.forEach(obs => {
          if (obs.hit) return; // Already hit this one

          const circleRadius = 12;
          const planeRadius = 15;
          
          // Check Collision with Circles
          const leftCircleX = obs.leftX * width;
          const leftCircleY = obs.y;
          const distLeft = Math.hypot(planeX - leftCircleX, planeY - leftCircleY);
          
          const rightCircleX = obs.rightX * width;
          const rightCircleY = obs.y;
          const distRight = Math.hypot(planeX - rightCircleX, planeY - rightCircleY);
          
          if (distLeft < planeRadius + circleRadius || distRight < planeRadius + circleRadius) {
             obs.hit = true;
             triggerFail();
             
             // Count as encountered obstacle even if hit
             if (!obs.processed) {
                 obs.processed = true;
                 if (onObstaclePassed) onObstaclePassed();
             }
             return;
          }
          
          // Check Passing Logic
          if (obs.y > planeY && !obs.passed) {
              obs.passed = true;
              
              // Increment total obstacles passed (regardless of success/fail)
              if (!obs.processed) {
                  obs.processed = true;
                  if (onObstaclePassed) onObstaclePassed();
              }

              if (planeX < leftCircleX || planeX > rightCircleX) {
                  // Failed to stay between
                  obs.hit = true; // Mark as hit/failed so we don't count again
                  triggerFail();
              }
          }
        });
    };

    const draw = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
        ctx.clearRect(0, 0, width, height);
        
        // Draw Stats (Top Left)
        const { flightFails, totalObstacles } = statsRef.current;
        const successCount = Math.max(0, totalObstacles - flightFails);
        const successRate = totalObstacles > 0 
            ? Math.round((successCount / totalObstacles) * 100) 
            : 100;

        ctx.fillStyle = 'black';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'left';
        
        ctx.fillText(`Total: ${totalObstacles}`, 20, 30);
        ctx.fillText(`Fail: ${flightFails}`, 20, 55);
        ctx.fillText(`Success: ${successRate}%`, 20, 80);

        // Draw Plane
        const planeX = planePosRef.current * width;
        const planeY = height - 180;
        
        ctx.save();
        ctx.translate(planeX, planeY);
        
        // Plane Icon
        ctx.fillStyle = isRedRef.current ? 'red' : 'black';
        ctx.beginPath();
        ctx.moveTo(0, -20);
        ctx.lineTo(5, -5);
        ctx.lineTo(20, 5); 
        ctx.lineTo(5, 5);
        ctx.lineTo(5, 15);
        ctx.lineTo(10, 20); 
        ctx.lineTo(-10, 20); 
        ctx.lineTo(-5, 15);
        ctx.lineTo(-5, 5);
        ctx.lineTo(-20, 5); 
        ctx.lineTo(-5, -5);
        ctx.closePath();
        ctx.fill();
        
        ctx.restore();
        
        // Draw Obstacles
        obstaclesRef.current.forEach(obs => {
          // Left (Orange)
          ctx.beginPath();
          ctx.fillStyle = COLOR_ORANGE;
          ctx.arc(obs.leftX * width, obs.y, 12, 0, Math.PI * 2);
          ctx.fill();
          
          // Right (Blue)
          ctx.beginPath();
          ctx.fillStyle = COLOR_BLUE;
          ctx.arc(obs.rightX * width, obs.y, 12, 0, Math.PI * 2);
          ctx.fill();
        });
    };
    
    // Game Loop
    const animate = (time: number) => {
      if (lastTimeRef.current === 0 || isPausedRef.current) {
        lastTimeRef.current = time;
      }
      
      let deltaTime = time - lastTimeRef.current;
      if (isPausedRef.current) deltaTime = 0;
      
      lastTimeRef.current = time;
      
      update(deltaTime, canvas.width, canvas.height);
      draw(context, canvas.width, canvas.height);
      
      requestRef.current = requestAnimationFrame(animate);
    };
    
    requestRef.current = requestAnimationFrame(animate);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [onObstaclePassed, triggerFail]); // Empty dependency array as we use refs for changing props
  
  return (
    <canvas 
      ref={canvasRef}
      style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%',
        zIndex: 1
      }}
    />
  );
};

export default GameCanvas;
