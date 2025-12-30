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

export type GameMode = 'PRACTISE' | 'EXAM' | 'IPP';
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

export type Page = 
  | 'MARKETING' 
  | 'LANDING' 
  | 'WORM' 
  | 'IPP' 
  | 'VIGI' 
  | 'CAPACITY' 
  | 'VIGI1' 
  | 'CUBE'
  | 'CAP'
  | 'STATISTICS' 
  | 'SKYTEST_PRODUCT' 
  | 'SKYTEST_BLOG_1' 
  | 'SKYTEST_PEGASUS_BLOG' 
  | 'SKYTEST_PREPARATION_BLOG'
  | 'MOLLYMAWK_BLOG_1' 
  | 'MOLLYMAWK_PRODUCT'
  | 'PRIVACY_POLICY'
  | 'TERMS_OF_SERVICE'
  | 'LEGAL_DISCLAIMER';
