import { useState, useEffect } from 'react';
import { Timer } from '../components/Timer';
import { Leaderboard } from '../components/Leaderboard';
import { QuestionDisplay } from '../components/QuestionDisplay';
import { QuestionList } from '../components/QuestionList';
import { useQuiz } from '../context/QuizContext';
import { Play, Pause, Eye, EyeOff, CheckCircle, SkipForward, SkipBack, Download, Upload } from 'lucide-react';

export function AdminPage() {
  const { state, dispatch } = useQuiz();
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [importData, setImportData] = useState('');

  useEffect(() => {
    // Auto-authenticate for demo purposes
    if (state.adminPass === 'bbcadmin2026') {
      setAuthenticated(true);
    }
  }, [state.adminPass]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === state.adminPass) {
      setAuthenticated(true);
    } else {
      alert('Incorrect password');
    }
  };

  const currentQuestion = state.questions.find(q => q.id === state.currentQuestionId);

  const handleStartTimer = () => {
    dispatch({ type: 'START_TIMER', duration: 15 });
  };

  const handleStopTimer = () => {
    dispatch({ type: 'STOP_TIMER' });
  };

  const handleShowQuestion = () => {
    dispatch({ type: 'SHOW_QUESTION' });
  };

  const handleHideQuestion = () => {
    dispatch({ type: 'HIDE_QUESTION' });
  };

  const handleShowAnswer = () => {
    dispatch({ type: 'SHOW_ANSWER' });
  };

  const handleHideAnswer = () => {
    dispatch({ type: 'HIDE_ANSWER' });
  };

  const handleNextQuestion = () => {
    dispatch({ type: 'NEXT_QUESTION' });
  };

  const handlePrevQuestion = () => {
    dispatch({ type: 'PREV_QUESTION' });
  };

  const handleSelectQuestion = (questionId: string) => {
    dispatch({ type: 'SET_CURRENT_QUESTION', questionId });
  };

  const handleSelectBook = (book: any) => {
    dispatch({ type: 'SET_ACTIVE_BOOK', book });
  };

  const handleImportQuestions = () => {
    try {
      const parsed = JSON.parse(importData);
      if (Array.isArray(parsed)) {
        dispatch({ type: 'LOAD_QUESTIONS', questions: parsed });
        alert(`Imported ${parsed.length} questions successfully!`);
        setImportData('');
      }
    } catch (e) {
      alert('Invalid JSON format');
    }
  };

  const handleCSVImport = (csvText: string) => {
    try {
      const lines = csvText.trim().split('\n');
      if (lines.length < 2) {
        alert('CSV must have header row and at least one question');
        return;
      }
      
      // Parse CSV (basic parser)
      const parseCSVLine = (line: string) => {
        const result = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          
          if (char === '"') {
            inQuotes = !inQuotes;
          } else if (char === ',' && !inQuotes) {
            result.push(current.trim().replace(/^"|"$/g, ''));
            current = '';
          } else {
            current += char;
          }
        }
        result.push(current.trim().replace(/^"|"$/g, ''));
        return result;
      };
      
      const questions = [];
      
      for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]);
        if (values.length >= 8) {
          const book = values[0] as any;
          const text = values[1];
          const opt1 = values[2];
          const opt2 = values[3];
          const opt3 = values[4];
          const opt4 = values[5];
          const correctAnswer = parseInt(values[6]);
          const points = parseInt(values[7]) || 10;
          
          if (book && text && opt1 && opt2 && opt3 && opt4 && !isNaN(correctAnswer)) {
            const id = `${book.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}-${i}`;
            questions.push({
              id,
              book,
              text,
              options: [opt1, opt2, opt3, opt4],
              correctAnswer,
              points
            });
          }
        }
      }
      
      if (questions.length > 0) {
        dispatch({ type: 'LOAD_QUESTIONS', questions });
        alert(`Imported ${questions.length} questions from CSV!`);
      } else {
        alert('No valid questions found in CSV format');
      }
    } catch (e) {
      alert('Error parsing CSV: ' + (e instanceof Error ? e.message : 'Unknown error'));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (file.name.endsWith('.csv')) {
        handleCSVImport(content);
      } else if (file.name.endsWith('.json')) {
        setImportData(content);
      }
    };
    reader.readAsText(file);
  };

  const handleExportQuestions = () => {
    const dataStr = JSON.stringify(state.questions, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'bbc-questions.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Admin Login</h1>
            <p className="text-gray-600 mt-2">Enter password to access admin controls</p>
          </div>
          <form onSubmit={handleLogin}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="Enter admin password"
                autoFocus
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition"
            >
              Enter Admin Dashboard
            </button>
          </form>
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Default password: bbcadmin2026</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-8">
      {/* Header */}
      <header className="mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">BBC 7.0 - Admin Dashboard</h1>
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
              <div className="text-right">
                <div className="text-sm text-gray-500">Logged in as Admin</div>
                <button
                  onClick={() => setAuthenticated(false)}
                  className="mt-2 text-sm text-red-600 hover:text-red-800 font-medium"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Question Display & Controls */}
        <div className="lg:col-span-2 space-y-8">
          {/* Question Display */}
          <QuestionDisplay
            question={currentQuestion || null}
            showAnswer={state.showAnswer}
          />

          {/* Control Panel */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Quiz Controls</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <button
                onClick={handleShowQuestion}
                disabled={state.showQuestion}
                className="flex flex-col items-center justify-center p-4 rounded-xl bg-blue-50 border-2 border-blue-200 hover:border-blue-400 disabled:opacity-50 transition"
              >
                <Eye className="w-8 h-8 text-blue-600 mb-2" />
                <span className="font-medium text-blue-800">Show Question</span>
              </button>
              
              <button
                onClick={handleHideQuestion}
                disabled={!state.showQuestion}
                className="flex flex-col items-center justify-center p-4 rounded-xl bg-gray-50 border-2 border-gray-200 hover:border-gray-400 disabled:opacity-50 transition"
              >
                <EyeOff className="w-8 h-8 text-gray-600 mb-2" />
                <span className="font-medium text-gray-800">Hide Question</span>
              </button>
              
              <button
                onClick={handleShowAnswer}
                disabled={state.showAnswer}
                className="flex flex-col items-center justify-center p-4 rounded-xl bg-green-50 border-2 border-green-200 hover:border-green-400 disabled:opacity-50 transition"
              >
                <CheckCircle className="w-8 h-8 text-green-600 mb-2" />
                <span className="font-medium text-green-800">Show Answer</span>
              </button>
              
              <button
                onClick={handleHideAnswer}
                disabled={!state.showAnswer}
                className="flex flex-col items-center justify-center p-4 rounded-xl bg-gray-50 border-2 border-gray-200 hover:border-gray-400 disabled:opacity-50 transition"
              >
                <EyeOff className="w-8 h-8 text-gray-600 mb-2" />
                <span className="font-medium text-gray-800">Hide Answer</span>
              </button>
            </div>

            {/* Timer Controls */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Timer Controls</h3>
              <div className="flex items-center justify-center space-x-6">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handleStartTimer}
                    disabled={state.timerActive}
                    className="flex items-center px-6 py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 disabled:opacity-50 transition"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Start Timer (15s)
                  </button>
                  <button
                    onClick={handleStopTimer}
                    disabled={!state.timerActive}
                    className="flex items-center px-6 py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 disabled:opacity-50 transition"
                  >
                    <Pause className="w-5 h-5 mr-2" />
                    Stop Timer
                  </button>
                </div>
              </div>
            </div>

            {/* Question Navigation */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Question Navigation</h3>
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={handlePrevQuestion}
                  className="flex items-center px-6 py-3 rounded-xl bg-white border-2 border-gray-300 text-gray-700 hover:border-gray-400 font-semibold transition"
                >
                  <SkipBack className="w-5 h-5 mr-2" />
                  Previous
                </button>
                <button
                  onClick={handleNextQuestion}
                  className="flex items-center px-6 py-3 rounded-xl bg-white border-2 border-gray-300 text-gray-700 hover:border-gray-400 font-semibold transition"
                >
                  Next
                  <SkipForward className="w-5 h-5 ml-2" />
                </button>
              </div>
            </div>

            {/* Import/Export */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Question Management</h3>
              
              {/* File Upload */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload File (CSV or JSON)
                </label>
                <input
                  type="file"
                  accept=".csv,.json"
                  onChange={handleFileUpload}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <p className="text-sm text-gray-500 mt-2">
                  CSV format: Book, Question, Option1, Option2, Option3, Option4, CorrectAnswer(0-3), Points
                </p>
              </div>
              
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <textarea
                    value={importData}
                    onChange={(e) => setImportData(e.target.value)}
                    placeholder="Or paste JSON questions here..."
                    className="w-full h-32 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                  <button
                    onClick={handleImportQuestions}
                    className="mt-2 w-full flex items-center justify-center px-4 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                  >
                    <Upload className="w-5 h-5 mr-2" />
                    Import from Text
                  </button>
                </div>
                <div className="flex-1">
                  <div className="h-32 flex items-center justify-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                    <div className="text-center">
                      <Download className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <div className="text-gray-600">Export all questions as JSON</div>
                    </div>
                  </div>
                  <button
                    onClick={handleExportQuestions}
                    className="mt-2 w-full flex items-center justify-center px-4 py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Export Questions
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Timer, Leaderboard, Question List */}
        <div className="space-y-8">
          {/* Timer */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Timer</h2>
            <div className="flex justify-center">
              <Timer
                duration={15}
                active={state.timerActive}
                onComplete={() => console.log('Timer completed')}
              />
            </div>
            <div className="mt-6 text-center">
              <div className="text-sm text-gray-600">Time remaining: {state.timer} seconds</div>
            </div>
          </div>

          {/* Leaderboard */}
          <Leaderboard leaderboard={state.leaderboard} />

          {/* Question List */}
          <QuestionList
            questions={state.questions}
            currentQuestionId={state.currentQuestionId}
            activeBook={state.activeBook}
            onSelectQuestion={handleSelectQuestion}
            onSelectBook={handleSelectBook}
            onNext={handleNextQuestion}
            onPrev={handlePrevQuestion}
          />
        </div>
      </div>
    </div>
  );
}