export type BeadValue = 0 | 1;

export interface AbacusColumn {
  upper: number; // 0 or 1 (representing 0 or 5)
  lower: number; // 0 to 4
}

export interface LessonStep {
  text: string;
  targetValue?: number;
  highlightColumn?: number;
  autoMove?: {
    column: number;
    upper: number;
    lower: number;
  };
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  steps: LessonStep[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIdx: number;
  explanation: string;
}

export interface CipherProblem {
  expression: string;
  answer: number;
  consonant: string;
}

export interface CipherMissionData {
  problems: CipherProblem[];
  finalWord: string;
  hint: string;
}
