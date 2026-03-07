import { CheckCircle, XCircle, BookOpen } from 'lucide-react';
import { Question } from '../types';

interface QuestionDisplayProps {
  question: Question | null;
  showAnswer: boolean;
  onAnswer?: (answerIndex: number) => void;
  participant?: boolean;
  answered?: boolean;
}

export function QuestionDisplay({ 
  question, 
  showAnswer, 
  onAnswer, 
  participant = false,
  answered = false 
}: QuestionDisplayProps) {
  if (!question) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <BookOpen className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <h3 className="text-xl font-semibold text-gray-700">No question selected</h3>
        <p className="text-gray-500">Waiting for admin to select a question...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-semibold mb-2">
            <BookOpen className="w-4 h-4 mr-2" />
            {question.book}
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mt-2">{question.text}</h2>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">Points</div>
          <div className="text-3xl font-bold text-blue-600">{question.points}</div>
        </div>
      </div>

      <div className="space-y-4 mb-8">
        {question.options.map((option, index) => {
          const isCorrect = index === question.correctAnswer;
          const showCorrect = showAnswer && isCorrect;
          const showIncorrect = showAnswer && !isCorrect && answered && participant;
          
          return (
            <button
              key={index}
              onClick={() => onAnswer && onAnswer(index)}
              disabled={!participant || answered || showAnswer}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                showCorrect
                  ? 'border-green-500 bg-green-50'
                  : showIncorrect
                  ? 'border-red-500 bg-red-50'
                  : answered && participant
                  ? 'border-gray-300 bg-gray-100'
                  : 'border-gray-200 hover:border-blue-500 hover:bg-blue-50'
              } ${!participant ? 'cursor-default' : ''}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full mr-4 ${
                    showCorrect
                      ? 'bg-green-500 text-white'
                      : showIncorrect
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className={`text-lg ${
                    showCorrect
                      ? 'font-semibold text-green-700'
                      : showIncorrect
                      ? 'text-red-700'
                      : 'text-gray-700'
                  }`}>
                    {option}
                  </span>
                </div>
                {showCorrect && <CheckCircle className="w-6 h-6 text-green-500" />}
                {showIncorrect && <XCircle className="w-6 h-6 text-red-500" />}
              </div>
            </button>
          );
        })}
      </div>

      {question.answered && (
        <div className="mt-6 p-4 bg-gray-50 rounded-xl">
          <div className="text-sm text-gray-600">Answered by: <span className="font-semibold">{question.answeredBy}</span></div>
        </div>
      )}

      {showAnswer && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
          <div className="flex items-center">
            <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
            <div>
              <div className="font-semibold text-green-800">Correct Answer: {question.options[question.correctAnswer]}</div>
              <div className="text-sm text-green-600 mt-1">This answer has been revealed to all participants</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}