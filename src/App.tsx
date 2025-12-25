import { useState, useEffect, useCallback, useRef } from 'react';
import { Grid } from './components/Grid';
import { Controls } from './components/Controls';
import { LogPanel } from './components/LogPanel';
import { MissionPanel } from './components/MissionPanel';
import { GRID_SIZE } from './types';
import type { Position, LogEntry } from './types';

function App() {
  // Game State
  const [position, setPosition] = useState<Position>(() => {
    const startX = Math.floor(Math.random() * GRID_SIZE);
    const startY = Math.floor(Math.random() * GRID_SIZE);
    return { x: startX, y: startY };
  });
  const [rotation, setRotation] = useState<number>(() => Math.floor(Math.random() * 4) * 90);
  const [targetPosition, setTargetPosition] = useState<Position | undefined>(undefined);
  const [missionInstructions, setMissionInstructions] = useState<string[]>([]);
  
  // UI State
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [pressedKey, setPressedKey] = useState<string | null>(null);

  // Helper to get normalized rotation (0, 90, 180, 270)
  const getNormalizedRotation = (rot: number) => ((rot % 360) + 360) % 360;

  // BFS to find shortest path instructions
  const findShortestPath = (startPos: Position, startRot: number, targetPos: Position) => {
    // Queue stores: { x, y, rot, instructions }
    // Visited stores: "x,y,normalizedRot"
    const queue = [{
      x: startPos.x,
      y: startPos.y,
      rot: startRot,
      instructions: [] as string[]
    }];
    
    const visited = new Set<string>();
    visited.add(`${startPos.x},${startPos.y},${getNormalizedRotation(startRot)}`);

    while (queue.length > 0) {
      const current = queue.shift()!;
      
      // Check if reached target
      if (current.x === targetPos.x && current.y === targetPos.y) {
        return current.instructions;
      }

      // Possible moves:
      // 1. Move Forward ("GO AHEAD")
      // 2. Turn Left + Move Forward ("TURN TO THE LEFT AND GO AHEAD")
      // 3. Turn Right + Move Forward ("TURN TO THE RIGHT AND GO AHEAD")

      const moves = [
        { rotOffset: 0, label: "GO AHEAD" },
        { rotOffset: -90, label: "TURN TO THE LEFT AND GO AHEAD" },
        { rotOffset: 90, label: "TURN TO THE RIGHT AND GO AHEAD" }
      ];

      for (const move of moves) {
        const nextRot = current.rot + move.rotOffset;
        const nextNormRot = getNormalizedRotation(nextRot);
        
        let dx = 0;
        let dy = 0;
        if (nextNormRot === 0) dy = -1; // UP
        else if (nextNormRot === 90) dx = 1; // RIGHT
        else if (nextNormRot === 180) dy = 1; // DOWN
        else if (nextNormRot === 270) dx = -1; // LEFT

        const nextX = current.x + dx;
        const nextY = current.y + dy;

        // Check bounds
        if (nextX >= 0 && nextX < GRID_SIZE && nextY >= 0 && nextY < GRID_SIZE) {
          const stateKey = `${nextX},${nextY},${nextNormRot}`;
          if (!visited.has(stateKey)) {
            visited.add(stateKey);
            queue.push({
              x: nextX,
              y: nextY,
              rot: nextRot,
              instructions: [...current.instructions, move.label]
            });
          }
        }
      }
    }
    return null; // No path found
  };

  // Generate a random mission
  const generateMission = (startPos: Position, startRot: number) => {
    // Retry to find a target that has a decent path
    for (let attempt = 0; attempt < 100; attempt++) {
        const targetX = Math.floor(Math.random() * GRID_SIZE);
        const targetY = Math.floor(Math.random() * GRID_SIZE);
        
        // Skip if target is same as start
        if (targetX === startPos.x && targetY === startPos.y) continue;

        const targetPos = { x: targetX, y: targetY };
        
        // Find shortest path
        const instructions = findShortestPath(startPos, startRot, targetPos);
        
        // Use this mission if path is found and has between 5 and 8 steps (inclusive)
        if (instructions && instructions.length >= 5 && instructions.length <= 8) {
            setTargetPosition(targetPos);
            setMissionInstructions(instructions);
            return;
        }
    }
    console.warn("Could not generate a valid mission after multiple attempts");
  };

  // Initialize random position and direction on mount
  const initialized = useRef(false);
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // Generate mission from initial state
    setTimeout(() => {
        generateMission(position, rotation);
    }, 0);
  }, []);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, {
      id: Math.random().toString(36).substr(2, 9),
      message,
      timestamp: Date.now()
    }]);
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Prevent default scrolling for arrows and space
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
      e.preventDefault();
    }

    // Update pressed key visual
    setPressedKey(e.key);

    if (e.repeat) return;

    switch (e.key) {
      case 'ArrowLeft':
        setRotation(prev => prev - 90);
        addLog("TURN TO THE LEFT");
        break;
      case 'ArrowRight':
        setRotation(prev => prev + 90);
        addLog("TURN TO THE RIGHT");
        break;
      case 'ArrowDown':
        setRotation(prev => prev + 180);
        addLog("TURN BACK");
        break;
      case ' ':
        addLog("GO AHEAD");
        // We calculate the new position based on CURRENT rotation state
        setPosition(prev => {
            const { x, y } = prev;
            let dx = 0;
            let dy = 0;
            
            const normalizedRotation = getNormalizedRotation(rotation);

            if (normalizedRotation === 0) dy = -1;
            else if (normalizedRotation === 90) dx = 1;
            else if (normalizedRotation === 180) dy = 1;
            else if (normalizedRotation === 270) dx = -1;
            
            const newX = Math.max(0, Math.min(GRID_SIZE - 1, x + dx));
            const newY = Math.max(0, Math.min(GRID_SIZE - 1, y + dy));
            
            // Check win condition
            if (targetPosition && newX === targetPosition.x && newY === targetPosition.y) {
                 // Victory! We can handle this later (e.g. generate new mission)
                 addLog("TARGET REACHED! 🎉");
                 // Generate new mission from new pos and rotation
                 // Small delay to let render happen
                 setTimeout(() => {
                     // We pass rotation because state update might be pending, but actually rotation doesn't change on move
                     generateMission({ x: newX, y: newY }, rotation);
                 }, 500);
            }

            return { x: newX, y: newY };
        });
        break;
    }
  }, [rotation, targetPosition]); // Added targetPosition dependency for win check

  const handleKeyUp = useCallback(() => {
    setPressedKey(null);
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4 md:p-8 font-sans">
        <h1 className="text-3xl font-bold mb-8 text-gray-800 tracking-tight">Snake Exam Mode</h1>
        
        <div className="flex flex-col xl:flex-row gap-8 items-start justify-center w-full max-w-7xl">
            {/* Left Column: Mission */}
            <div className="w-full xl:w-80 h-96 xl:h-[600px]">
                <MissionPanel instructions={missionInstructions} />
            </div>

            {/* Middle Column: Grid */}
            <div className="flex-1 w-full flex justify-center">
                <Grid 
                    snakePosition={position} 
                    snakeRotation={rotation} 
                    targetPosition={targetPosition}
                />
            </div>
            
            {/* Right Column: Controls & Logs */}
            <div className="flex flex-col gap-6 w-full xl:w-80">
                <Controls pressedKey={pressedKey} />
                <div className="h-64 xl:h-[400px] w-full">
                    <LogPanel logs={logs} />
                </div>
            </div>
        </div>
        
        <div className="mt-8 text-gray-500 text-sm">
          Use <kbd className="bg-gray-200 px-1 rounded">←</kbd> <kbd className="bg-gray-200 px-1 rounded">→</kbd> to rotate, <kbd className="bg-gray-200 px-1 rounded">↓</kbd> to turn back, and <kbd className="bg-gray-200 px-1 rounded">Space</kbd> to move.
        </div>
    </div>
  );
}

export default App;
