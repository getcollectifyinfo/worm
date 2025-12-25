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

export interface MissionStep {
  id: string;
  text: string;
  actions: string[]; // Expected keys e.g. ['ArrowLeft', ' ']
}

export type GameMode = 'PRACTISE' | 'EXAM';
export type ExamState = 'IDLE' | 'SHOWING_INSTRUCTIONS' | 'WAITING_BETWEEN_INSTRUCTIONS' | 'SELECTION' | 'RESULT' | 'SESSION_FINISHED';

export interface ExamOption {
  id: string;
  snakePosition: Position;
  snakeRotation: number;
  targetPosition: Position;
  isCorrect: boolean;
}

export type DifficultyLevel = 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT';

export const DIFFICULTY_SETTINGS: Record<DifficultyLevel, { min: number; max: number; label: string }> = {
  EASY: { min: 3, max: 5, label: 'Easy (3-5 Steps)' },
  MEDIUM: { min: 6, max: 9, label: 'Medium (6-9 Steps)' },
  HARD: { min: 10, max: 12, label: 'Hard (10-12 Steps)' },
  EXPERT: { min: 13, max: 15, label: 'Expert (13-15 Steps)' },
};

export const GRID_SIZE = 8;
