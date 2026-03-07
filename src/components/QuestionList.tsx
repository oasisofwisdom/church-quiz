import { CheckCircle, Circle, BookOpen, ChevronRight, ChevronLeft } from 'lucide-react';
import { Question, Book } from '../types';

interface QuestionListProps {
  questions: Question[];
  currentQuestionId: string | null;
  activeBook: Book | null;
  onSelectQuestion: (questionId: string) => void;
  onSelectBook: (book: Book) => void;
  onNext: () => void;
  onPrev: () => void;
}

export function QuestionList({
  questions,
  currentQuestionId,
  activeBook,
  onSelectQuestion,
  onSelectBook,
  onNext,
  onPrev,
}: QuestionListProps) {
  const books: Book[] = ['Joshua', '1 Kings', 'Proverbs', 'Romans', 'James', 'General Bible Knowledge'];
  
  const filteredQuestions = activeBook 
    ? questions.filter(q => q.book === activeBook)
    : questions;

  const currentIndex = filteredQuestions.findIndex(q => q.id === currentQuestionId);
  const totalQuestions = filteredQuestions.length;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Question Bank</h2>
      
      {/* Book Filter */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onSelectBook(null as any)}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              !activeBook
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Books
          </button>
          {books.map((book) => (
            <button
              key={book}
              onClick={() => onSelectBook(book)}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                activeBook === book
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {book}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-xl">
        <button
          onClick={onPrev}
          disabled={currentIndex <= 0}
          className="flex items-center px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-5 h-5 mr-2" />
          Previous
        </button>
        
        <div className="text-center">
          <div className="text-sm text-gray-600">Current Question</div>
          <div className="text-lg font-bold text-gray-800">
            {currentIndex + 1} of {totalQuestions}
          </div>
        </div>
        
        <button
          onClick={onNext}
          disabled={currentIndex >= totalQuestions - 1}
          className="flex items-center px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
          <ChevronRight className="w-5 h-5 ml-2" />
        </button>
      </div>

      {/* Questions List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredQuestions.map((question) => (
          <button
            key={question.id}
            onClick={() => onSelectQuestion(question.id)}
            className={`w-full text-left p-4 rounded-xl border transition-all ${
              question.id === currentQuestionId
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {question.answered ? (
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-300 mr-3" />
                )}
                <div>
                  <div className="font-medium text-gray-800">{question.text}</div>
                  <div className="flex items-center mt-1">
                    <BookOpen className="w-3 h-3 text-gray-400 mr-1" />
                    <span className="text-sm text-gray-500">{question.book}</span>
                    <span className="mx-2 text-gray-300">•</span>
                    <span className="text-sm font-medium text-blue-600">{question.points} pts</span>
                  </div>
                </div>
              </div>
              {question.answered && (
                <div className="text-sm text-gray-600">
                  by {question.answeredBy}
                </div>
              )}
            </div>
          </button>
        ))}
        
        {filteredQuestions.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No questions found for this book.</p>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-gray-800">{questions.length}</div>
            <div className="text-sm text-gray-600">Total Questions</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {questions.filter(q => q.answered).length}
            </div>
            <div className="text-sm text-gray-600">Answered</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-600">
              {questions.filter(q => !q.answered).length}
            </div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
        </div>
      </div>
    </div>
  );
}