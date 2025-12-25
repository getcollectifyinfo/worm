export type Direction = 'UP' | 'RIGHT' | 'DOWN' | 'LEFT';

export interface Position {
  x: number;
  y: number;
}

export interface LogEntry {
  id: string;
  message: string;
  timestamp: number;
}

export const GRID_SIZE = 8;
