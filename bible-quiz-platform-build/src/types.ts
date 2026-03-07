export type Book = 'Joshua' | '1 Kings' | 'Proverbs' | 'Romans' | 'James' | 'General Bible Knowledge';

export interface Question {
  id: string;
  book: Book;
  text: string;
  options: string[];
  correctAnswer: number; // index of correct answer
  points: number;
  answered?: boolean;
  answeredBy?: string; // fellowship name
}

export interface Fellowship {
  name: string;
  score: number;
  id: string;
}

export interface QuizState {
  currentQuestionId: string | null;
  showQuestion: boolean;
  showAnswer: boolean;
  timer: number; // seconds remaining
  timerActive: boolean;
  leaderboard: Fellowship[];
  books: Book[];
  questions: Question[];
  activeBook: Book | null;
  adminPass: string;
}

export type AdminAction = 
  | { type: 'SET_CURRENT_QUESTION'; questionId: string }
  | { type: 'SHOW_QUESTION' }
  | { type: 'HIDE_QUESTION' }
  | { type: 'SHOW_ANSWER' }
  | { type: 'HIDE_ANSWER' }
  | { type: 'START_TIMER'; duration: number }
  | { type: 'STOP_TIMER' }
  | { type: 'UPDATE_LEADERBOARD'; leaderboard: Fellowship[] }
  | { type: 'ANSWER_QUESTION'; questionId: string; fellowship: string; answerIndex: number }
  | { type: 'LOAD_QUESTIONS'; questions: Question[] }
  | { type: 'SET_ACTIVE_BOOK'; book: Book }
  | { type: 'NEXT_QUESTION' }
  | { type: 'PREV_QUESTION' };