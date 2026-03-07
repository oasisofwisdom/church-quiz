import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { QuizState, AdminAction } from '../types';
import { sampleQuestions } from '../data/questions';

const initialState: QuizState = {
  currentQuestionId: null,
  showQuestion: false,
  showAnswer: false,
  timer: 15,
  timerActive: false,
  leaderboard: [],
  books: ['Joshua', '1 Kings', 'Proverbs', 'Romans', 'James', 'General Bible Knowledge'],
  questions: sampleQuestions,
  activeBook: null,
  adminPass: 'bbcadmin2026', // default password
};

function quizReducer(state: QuizState, action: AdminAction): QuizState {
  switch (action.type) {
    case 'SET_CURRENT_QUESTION':
      return { ...state, currentQuestionId: action.questionId };
    case 'SHOW_QUESTION':
      return { ...state, showQuestion: true, showAnswer: false };
    case 'HIDE_QUESTION':
      return { ...state, showQuestion: false };
    case 'SHOW_ANSWER':
      return { ...state, showAnswer: true };
    case 'HIDE_ANSWER':
      return { ...state, showAnswer: false };
    case 'START_TIMER':
      return { ...state, timer: action.duration, timerActive: true };
    case 'STOP_TIMER':
      return { ...state, timerActive: false };
    case 'UPDATE_LEADERBOARD':
      return { ...state, leaderboard: action.leaderboard };
    case 'ANSWER_QUESTION': {
      const { questionId, fellowship, answerIndex } = action;
      const question = state.questions.find(q => q.id === questionId);
      if (!question) return state;
      
      const isCorrect = answerIndex === question.correctAnswer;
      const points = isCorrect ? question.points : 0;
      
      // Update leaderboard
      const existingFellowship = state.leaderboard.find(f => f.name === fellowship);
      let newLeaderboard = [...state.leaderboard];
      if (existingFellowship) {
        newLeaderboard = newLeaderboard.map(f => 
          f.name === fellowship ? { ...f, score: f.score + points } : f
        );
      } else {
        newLeaderboard.push({ name: fellowship, score: points, id: fellowship });
      }
      // Sort leaderboard
      newLeaderboard.sort((a, b) => b.score - a.score);
      
      // Mark question as answered
      const newQuestions = state.questions.map(q => 
        q.id === questionId ? { ...q, answered: true, answeredBy: fellowship } : q
      );
      
      return { 
        ...state, 
        leaderboard: newLeaderboard,
        questions: newQuestions,
      };
    }
    case 'LOAD_QUESTIONS':
      return { ...state, questions: action.questions };
    case 'SET_ACTIVE_BOOK':
      return { ...state, activeBook: action.book };
    case 'NEXT_QUESTION': {
      const currentIndex = state.questions.findIndex(q => q.id === state.currentQuestionId);
      const nextIndex = currentIndex + 1;
      if (nextIndex < state.questions.length) {
        return { ...state, currentQuestionId: state.questions[nextIndex].id };
      }
      return state;
    }
    case 'PREV_QUESTION': {
      const currentIndex = state.questions.findIndex(q => q.id === state.currentQuestionId);
      const prevIndex = currentIndex - 1;
      if (prevIndex >= 0) {
        return { ...state, currentQuestionId: state.questions[prevIndex].id };
      }
      return state;
    }
    default:
      return state;
  }
}

interface QuizContextType {
  state: QuizState;
  dispatch: React.Dispatch<AdminAction>;
  syncState: (newState: QuizState) => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export function QuizProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(quizReducer, initialState);

  // Load state from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('bbc-quiz-state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Only load questions if there are any saved
        if (parsed.questions && parsed.questions.length > 0) {
          dispatch({ type: 'LOAD_QUESTIONS', questions: parsed.questions });
        }
        // Load other state properties if needed
      } catch (e) {
        console.error('Failed to load state from localStorage', e);
      }
    }
  }, []);

  // Save state to localStorage on change
  useEffect(() => {
    localStorage.setItem('bbc-quiz-state', JSON.stringify(state));
  }, [state]);

  // Sync state across tabs using storage event
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'bbc-quiz-state' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          // Avoid infinite loop by comparing with current state
          if (JSON.stringify(state) !== e.newValue) {
            dispatch({ type: 'LOAD_QUESTIONS', questions: parsed.questions || [] });
          }
        } catch (e) {
          console.error('Failed to sync state from storage event', e);
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [state]);

  const syncState = useCallback((newState: QuizState) => {
    // This would be used to broadcast state changes to other tabs
    localStorage.setItem('bbc-quiz-state', JSON.stringify(newState));
    // Trigger storage event for same window
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'bbc-quiz-state',
      newValue: JSON.stringify(newState),
    }));
  }, []);

  return (
    <QuizContext.Provider value={{ state, dispatch, syncState }}>
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
}