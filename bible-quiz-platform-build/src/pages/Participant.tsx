import { useState, useEffect } from 'react';
import { Timer } from '../components/Timer';
import { Leaderboard } from '../components/Leaderboard';
import { QuestionDisplay } from '../components/QuestionDisplay';
import { useQuiz } from '../context/QuizContext';
import { Users, Clock, BookOpen, LogIn } from 'lucide-react';

export function ParticipantPage() {
  const { state, dispatch } = useQuiz();
  const [fellowshipName, setFellowshipName] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [hasAnswered, setHasAnswered] = useState(false);

  const currentQuestion = state.questions.find(q => q.id === state.currentQuestionId);

  useEffect(() => {
    // Check if already logged in from localStorage
    const savedName = localStorage.getItem('bbc-fellowship-name');
    if (savedName) {
      setFellowshipName(savedName);
      setLoggedIn(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (fellowshipName.trim()) {
      localStorage.setItem('bbc-fellowship-name', fellowshipName.trim());
      setLoggedIn(true);
      
      // Add to leaderboard if not already present
      const existing = state.leaderboard.find(f => f.name === fellowshipName.trim());
      if (!existing) {
        const newLeaderboard = [...state.leaderboard, { 
          name: fellowshipName.trim(), 
          score: 0, 
          id: fellowshipName.trim() 
        }];
        dispatch({ type: 'UPDATE_LEADERBOARD', leaderboard: newLeaderboard });
      }
    }
  };

  const handleAnswer = (answerIndex: number) => {
    if (!loggedIn || !currentQuestion || hasAnswered || state.showAnswer) return;
    
    setHasAnswered(true);
    
    // Submit answer to quiz state
    dispatch({ 
      type: 'ANSWER_QUESTION', 
      questionId: currentQuestion.id, 
      fellowship: fellowshipName.trim(),
      answerIndex 
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('bbc-fellowship-name');
    setLoggedIn(false);
    setFellowshipName('');
    setHasAnswered(false);
  };

  if (!loggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-green-600 to-emerald-700 mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Welcome to BBC 7.0</h1>
            <p className="text-gray-600 mt-2">Back to the Bible Challenge • 2026 Edition</p>
            <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
              <p className="text-sm font-medium text-gray-800">Theme: Walking in Covenant Perfection (Matt 5:48)</p>
              <div className="mt-2 flex flex-wrap justify-center gap-2">
                <span className="text-xs font-semibold bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  BBC! The Word in my heart and acts.
                </span>
                <span className="text-xs font-semibold bg-green-100 text-green-800 px-2 py-1 rounded">
                  BB&C! Believing and behaving the Bible!
                </span>
              </div>
            </div>
          </div>
          
          <form onSubmit={handleLogin}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fellowship Name
              </label>
              <input
                type="text"
                value={fellowshipName}
                onChange={(e) => setFellowshipName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                placeholder="Enter your fellowship name"
                autoFocus
              />
              <p className="text-sm text-gray-500 mt-2">
                This will be displayed on the leaderboard
              </p>
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-600 to-emerald-700 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition"
            >
              <LogIn className="w-5 h-5 inline mr-2" />
              Enter Quiz Platform
            </button>
          </form>
          
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Powered by Oasis of Wisdom Bible Church</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 p-4 md:p-8">
      {/* Header */}
      <header className="mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">BBC 7.0 - Back to the Bible Challenge</h1>
              <p className="text-gray-600 mt-2">Walking in Covenant Perfection (Matt 5:48) • 2026 Edition</p>
              <div className="flex items-center mt-2">
                <span className="text-sm font-semibold bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 px-3 py-1 rounded-full">
                  BBC! The Word in my heart and acts.
                </span>
                <span className="mx-2 text-gray-300">•</span>
                <span className="text-sm font-semibold bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 px-3 py-1 rounded-full">
                  BB&C! Believing and behaving the Bible!
                </span>
              </div>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="flex items-center">
                <div className="text-right mr-4">
                  <div className="text-sm text-gray-500">Logged in as</div>
                  <div className="font-bold text-gray-800">{fellowshipName}</div>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm text-red-600 hover:text-red-800 font-medium border border-red-200 rounded-xl hover:bg-red-50 transition"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content: Question Display */}
        <div className="lg:col-span-2 space-y-8">
          {/* Waiting Screen */}
          {!state.showQuestion && !state.showAnswer && (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 mb-6">
                <Clock className="w-12 h-12 text-blue-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Waiting for Quiz to Begin</h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                The quiz will start shortly. Please wait for the administrator to begin.
                Questions and timer will appear here when the quiz starts.
              </p>
              <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl inline-block">
                <div className="flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-blue-600 mr-3" />
                  <span className="font-semibold text-blue-800">Current Round: {state.activeBook || 'Not Started'}</span>
                </div>
              </div>
            </div>
          )}

          {/* Question Display (when shown) */}
          {(state.showQuestion || state.showAnswer) && currentQuestion && (
            <QuestionDisplay
              question={currentQuestion}
              showAnswer={state.showAnswer}
              onAnswer={handleAnswer}
              participant={true}
              answered={hasAnswered}
            />
          )}

          {/* Instructions */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Instructions</h2>
            <ul className="space-y-3">
              <li className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center mr-3 mt-0.5">
                  1
                </div>
                <span className="text-gray-700">Wait for the admin to show the question</span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center mr-3 mt-0.5">
                  2
                </div>
                <span className="text-gray-700">Select your answer before the timer runs out</span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center mr-3 mt-0.5">
                  3
                </div>
                <span className="text-gray-700">Points are awarded only for correct answers</span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center mr-3 mt-0.5">
                  4
                </div>
                <span className="text-gray-700">Leaderboard updates in real-time</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column: Timer and Leaderboard */}
        <div className="space-y-8">
          {/* Timer */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Timer</h2>
            <div className="flex justify-center">
              <Timer
                duration={15}
                active={state.timerActive}
                onComplete={() => console.log('Time\'s up!')}
              />
            </div>
            <div className="mt-6 text-center">
              <div className="text-sm text-gray-600">
                {state.timerActive 
                  ? 'Time is running! Answer quickly!' 
                  : state.timer === 0 
                    ? 'Time\'s up!' 
                    : 'Waiting for timer to start'}
              </div>
            </div>
          </div>

          {/* Leaderboard */}
          <Leaderboard leaderboard={state.leaderboard} />

          {/* Your Status */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Your Status</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                <span className="text-gray-700">Fellowship</span>
                <span className="font-bold text-gray-800">{fellowshipName}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                <span className="text-gray-700">Your Score</span>
                <span className="text-2xl font-bold text-green-600">
                  {state.leaderboard.find(f => f.name === fellowshipName)?.score || 0}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                <span className="text-gray-700">Current Rank</span>
                <span className="text-2xl font-bold text-blue-600">
                  #{state.leaderboard.findIndex(f => f.name === fellowshipName) + 1 || '-'}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                <span className="text-gray-700">Questions Answered</span>
                <span className="font-bold text-gray-800">
                  {state.questions.filter(q => q.answeredBy === fellowshipName).length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}