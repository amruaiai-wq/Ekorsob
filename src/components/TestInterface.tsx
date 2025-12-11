// src/components/TestInterface.tsx
'use client';

import { useState, useEffect } from 'react';
import { Flag } from 'lucide-react';

interface Question {
  id: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  explanation?: string;
}

interface TestInterfaceProps {
  examTitle: string;
  questions: Question[];
  timeLimit?: number; // เวลาในหน่วยนาที (optional สำหรับ practice mode)
  onSubmit?: (answers: Record<string, string>, timeUsed: number) => void;
  mode?: 'practice' | 'exam'; // โหมดการทำข้อสอบ
}

export default function TestInterface({
  examTitle,
  questions,
  timeLimit,
  onSubmit,
  mode = 'practice'
}: TestInterfaceProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [submittedAnswers, setSubmittedAnswers] = useState<Record<string, boolean>>({});
  const [showExplanation, setShowExplanation] = useState<Record<string, boolean>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<string>>(new Set());
  const [results, setResults] = useState<Record<string, 'correct' | 'incorrect'>>({});

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;

  // นับจำนวนถูก/ผิด/เหลือ
  const correctCount = Object.values(results).filter(r => r === 'correct').length;
  const incorrectCount = Object.values(results).filter(r => r === 'incorrect').length;
  const leftCount = totalQuestions - correctCount - incorrectCount;
  const progressPercent = Math.round(((correctCount + incorrectCount) / totalQuestions) * 100);

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format time
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // เลือกคำตอบ
  const handleSelectAnswer = (option: string) => {
    if (submittedAnswers[currentQuestion.id]) return; // ถ้าส่งแล้วไม่ให้เปลี่ยน
    
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: option
    }));

    // ใน practice mode ส่งคำตอบทันทีเมื่อเลือก
    if (mode === 'practice') {
      const isCorrect = option === currentQuestion.correct_answer;
      setResults(prev => ({
        ...prev,
        [currentQuestion.id]: isCorrect ? 'correct' : 'incorrect'
      }));
      setSubmittedAnswers(prev => ({
        ...prev,
        [currentQuestion.id]: true
      }));
      setShowExplanation(prev => ({
        ...prev,
        [currentQuestion.id]: true
      }));
    }
  };

  // Toggle flag
  const toggleFlag = () => {
    setFlaggedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(currentQuestion.id)) {
        newSet.delete(currentQuestion.id);
      } else {
        newSet.add(currentQuestion.id);
      }
      return newSet;
    });
  };

  // Toggle explanation
  const toggleExplanation = () => {
    setShowExplanation(prev => ({
      ...prev,
      [currentQuestion.id]: !prev[currentQuestion.id]
    }));
  };

  // ไปข้อถัดไป
  const goToNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  // ไปข้อก่อนหน้า
  const goToPrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const isCurrentSubmitted = submittedAnswers[currentQuestion.id];
  const currentResult = results[currentQuestion.id];
  const isFlagged = flaggedQuestions.has(currentQuestion.id);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Fixed Header - Timer */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
        <div className="flex items-center justify-center py-3">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-mono text-lg font-semibold text-gray-800">
              {formatTime(timeElapsed)}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-16 pb-24 px-4 overflow-y-auto">
        <div className="max-w-3xl mx-auto py-6">
          {/* Question Header */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <span className="text-sm font-medium text-gray-500">Question {currentQuestionIndex + 1}.</span>
            </div>
            <button 
              onClick={toggleFlag}
              className={`p-2 rounded-lg transition-colors ${
                isFlagged 
                  ? 'bg-red-100 text-red-600' 
                  : 'bg-gray-100 text-gray-400 hover:text-red-500'
              }`}
              title="Flag this question"
            >
              <Flag className="w-5 h-5" fill={isFlagged ? "currentColor" : "none"} />
            </button>
          </div>

          {/* Question Text */}
          <h2 className="text-lg text-gray-800 mb-6 leading-relaxed">
            {currentQuestion.question_text}
          </h2>

          {/* Options */}
          <div className="space-y-2">
            {['A', 'B', 'C', 'D'].map((option) => {
              const optionKey = `option_${option.toLowerCase()}` as keyof Question;
              const optionText = currentQuestion[optionKey] as string;
              const isSelected = answers[currentQuestion.id] === option;
              const isCorrect = option === currentQuestion.correct_answer;
              
              let optionStyle = '';
              let radioStyle = '';
              
              if (isCurrentSubmitted) {
                if (isCorrect) {
                  optionStyle = 'bg-green-50 border-l-4 border-l-green-500';
                  radioStyle = 'border-green-500 bg-green-500';
                } else if (isSelected && !isCorrect) {
                  optionStyle = 'bg-gray-50';
                  radioStyle = 'border-gray-300';
                } else {
                  optionStyle = 'bg-white opacity-60';
                  radioStyle = 'border-gray-300';
                }
              } else {
                optionStyle = isSelected 
                  ? 'bg-blue-50 border-l-4 border-l-blue-500' 
                  : 'bg-white hover:bg-gray-50';
                radioStyle = isSelected 
                  ? 'border-blue-500 bg-blue-500' 
                  : 'border-gray-300';
              }

              return (
                <button
                  key={option}
                  onClick={() => handleSelectAnswer(option)}
                  disabled={isCurrentSubmitted}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${optionStyle} ${
                    !isCurrentSubmitted ? 'cursor-pointer' : 'cursor-default'
                  }`}
                >
                  {/* Radio circle */}
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${radioStyle}`}>
                    {(isSelected || (isCurrentSubmitted && isCorrect)) && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  
                  {/* Option text */}
                  <span className={`text-sm ${
                    isCurrentSubmitted && isCorrect 
                      ? 'text-green-700 font-medium' 
                      : 'text-gray-700'
                  }`}>
                    ({option}) {optionText}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Answer & Explanation Section */}
          {isCurrentSubmitted && (
            <div className="mt-6 border-l-4 border-gray-200 pl-4">
              {/* Correct Answer */}
              <p className="text-sm mb-2">
                <span className="text-green-600 font-medium">Correct answer:</span>{' '}
                <span className="text-green-700">
                  ({currentQuestion.correct_answer}) {currentQuestion[`option_${currentQuestion.correct_answer.toLowerCase()}` as keyof Question]}
                </span>
              </p>
              
              {/* Toggle Explanation */}
              <button 
                onClick={toggleExplanation}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
              >
                {showExplanation[currentQuestion.id] ? 'Hide' : 'Show'} Explanation
                <svg 
                  className={`w-4 h-4 transition-transform ${showExplanation[currentQuestion.id] ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Explanation Content */}
              {showExplanation[currentQuestion.id] && currentQuestion.explanation && (
                <div className="mt-4 space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Detailed Explanation:</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {currentQuestion.explanation}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={goToPrev}
              disabled={currentQuestionIndex === 0}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                currentQuestionIndex === 0
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>

            <button
              onClick={goToNext}
              disabled={currentQuestionIndex === totalQuestions - 1}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                currentQuestionIndex === totalQuestions - 1
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Next
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </main>

      {/* Fixed Bottom Progress Bar */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="max-w-3xl mx-auto px-4 py-3">
          {/* Progress Bar */}
          <div className="flex items-center gap-4 mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-sm font-medium text-blue-600">{progressPercent}%</span>
            <span className="text-sm text-gray-500">{correctCount + incorrectCount}/{totalQuestions}</span>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-6">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              <span className="text-sm text-gray-600">{correctCount} Correct</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              <span className="text-sm text-gray-600">{incorrectCount} Incorrect</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gray-400"></span>
              <span className="text-sm text-gray-600">{leftCount} Left</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}