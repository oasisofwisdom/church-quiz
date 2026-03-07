import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { QuizProvider } from './context/QuizContext';
import { AdminPage } from './pages/Admin';
import { ParticipantPage } from './pages/Participant';
import { Shield, Users, BookOpen, Trophy } from 'lucide-react';

function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 mb-6 shadow-lg">
            <BookOpen className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-gray-800 mb-4">BBC 7.0</h1>
          <h2 className="text-2xl font-semibold text-blue-700 mb-2">Back to the Bible Challenge</h2>
          <p className="text-xl text-gray-600 mb-4">2026 Edition</p>
          <div className="inline-block bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 px-6 py-3 rounded-full font-semibold">
            Walking in Covenant Perfection (Matt 5:48)
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <span className="px-4 py-2 bg-blue-600 text-white rounded-full font-semibold shadow">
              BBC! The Word in my heart and acts.
            </span>
            <span className="px-4 py-2 bg-green-600 text-white rounded-full font-semibold shadow">
              BB&C! Believing and behaving the Bible!
            </span>
          </div>
        </div>

        {/* Role Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Link
            to="/participant"
            className="group bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-gray-100"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mb-6 group-hover:scale-110 transition">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Participant</h3>
              <p className="text-gray-600 mb-6">
                Join the quiz with your fellowship. Answer questions, compete with others, and see live leaderboard updates.
              </p>
              <div className="w-full bg-green-50 rounded-xl p-4">
                <div className="text-sm font-medium text-green-800 mb-2">Features:</div>
                <ul className="text-sm text-green-700 space-y-1 text-left">
                  <li>• Easy fellowship login</li>
                  <li>• Real-time quiz participation</li>
                  <li>• Live leaderboard tracking</li>
                  <li>• Instant answer feedback</li>
                </ul>
              </div>
              <div className="mt-6 w-full bg-green-600 text-white py-3 rounded-xl font-semibold group-hover:bg-green-700 transition">
                Enter as Participant
              </div>
            </div>
          </Link>

          <Link
            to="/admin"
            className="group bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-gray-100"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-6 group-hover:scale-110 transition">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Admin</h3>
              <p className="text-gray-600 mb-6">
                Control the entire quiz experience. Manage questions, control timers, and monitor participant progress.
              </p>
              <div className="w-full bg-blue-50 rounded-xl p-4">
                <div className="text-sm font-medium text-blue-800 mb-2">Controls:</div>
                <ul className="text-sm text-blue-700 space-y-1 text-left">
                  <li>• Question management</li>
                  <li>• Timer control (15s)</li>
                  <li>• Live participant monitoring</li>
                  <li>• Leaderboard management</li>
                </ul>
              </div>
              <div className="mt-6 w-full bg-blue-600 text-white py-3 rounded-xl font-semibold group-hover:bg-blue-700 transition">
                Enter as Admin
              </div>
            </div>
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl shadow-lg p-6 max-w-2xl mx-auto">
            <p className="text-gray-600 mb-2">
              <span className="font-semibold">Powered by</span>
            </p>
            <p className="text-xl font-bold text-blue-700">Oasis of Wisdom Bible Church</p>
            <div className="mt-4 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-yellow-500 mr-2" />
              <span className="text-sm text-gray-500">Built with free, open-source technology for church communities</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function App() {
  return (
    <QuizProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/participant" element={<ParticipantPage />} />
        </Routes>
      </BrowserRouter>
    </QuizProvider>
  );
}
