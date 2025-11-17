// src/components/PakKorTestInterface.tsx
'use client';

import { useState } from 'react';
import Timer from './Timer';

interface Question {
  id: string;
  order_num: number;
  part: string;
  passage?: string | null;
  question_text: string;
  blank_number?: number | null;
  choice_a: string;
  choice_b: string;
  choice_c: string;
  choice_d: string;
  correct_answer: string;
  explanation?: string | null;
}

interface PakKorTestInterfaceProps {
  examTitle: string;
  questions: Question[];
  timeLimit: number;
  onSubmit: (answers: Record<string, string>, timeUsed: number) => void;
}

export default function PakKorTestInterface({
  examTitle,
  questions,
  timeLimit,
  onSubmit,
}: PakKorTestInterfaceProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submittedAnswers, setSubmittedAnswers] = useState<Record<string, boolean>>({});
  const [timeRemaining, setTimeRemaining] = useState(timeLimit * 60);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showExplanation, setShowExplanation] = useState(true);

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;

  // แปลง 1,2,3,4 เป็น A,B,C,D
  const convertNumberToLetter = (answer: string): string => {
    const mapping: Record<string, string> = { '1': 'A', '2': 'B', '3': 'C', '4': 'D' };
    return mapping[answer] || answer;
  };

  const correctAnswerLetter = convertNumberToLetter(currentQuestion.correct_answer);
  const userAnswer = answers[currentQuestion.id];
  const isCurrentSubmitted = submittedAnswers[currentQuestion.id];
  const isCorrect = userAnswer === correctAnswerLetter;

  // สถิติ
  const correctCount = Object.entries(answers).filter(([qId, ans]) => {
    const q = questions.find(question => question.id === qId);
    return ans === convertNumberToLetter(q?.correct_answer || '');
  }).length;

  const incorrectCount = Object.entries(submittedAnswers).filter(([qId]) => {
    const ans = answers[qId];
    const q = questions.find(question => question.id === qId);
    return ans !== convertNumberToLetter(q?.correct_answer || '');
  }).length;

  const answeredCount = Object.keys(submittedAnswers).length;
  const progressPercent = Math.round((answeredCount / totalQuestions) * 100);

  // เลือกคำตอบ
  const handleSelectAnswer = (answer: string) => {
    if (isCurrentSubmitted) return;
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: answer }));
    setSubmittedAnswers(prev => ({ ...prev, [currentQuestion.id]: true }));
  };

  // Navigation
  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Submit
  const handleSubmit = async () => {
    if (answeredCount < totalQuestions) {
      const confirmSubmit = window.confirm(
        `คุณทำได้เพียง ${answeredCount}/${totalQuestions} ข้อ\nต้องการส่งคำตอบหรือไม่?`
      );
      if (!confirmSubmit) return;
    }

    setIsSubmitting(true);
    const timeUsed = timeLimit * 60 - timeRemaining;

    const convertedAnswers: Record<string, string> = {};
    const answerMap: Record<string, string> = { 'A': '1', 'B': '2', 'C': '3', 'D': '4' };
    Object.entries(answers).forEach(([qId, answer]) => {
      convertedAnswers[qId] = answerMap[answer] || answer;
    });

    await onSubmit(convertedAnswers, timeUsed);
  };

  const handleTimeUp = () => {
    alert('หมดเวลา! ระบบจะส่งคำตอบอัตโนมัติ');
    handleSubmit();
  };

  // Render Passage
  const renderPassage = () => {
    if (!currentQuestion.passage) return null;

    if (currentQuestion.part.includes('Part 1') && currentQuestion.blank_number) {
      const lines = currentQuestion.passage.split('\n');
      return (
        <div className="space-y-0.5 font-mono text-xs sm:text-sm leading-relaxed">
          {lines.map((line, index) => {
            const blankPattern = new RegExp(`_+\\(${currentQuestion.blank_number}\\.\\)_+`, 'g');
            const hasCurrentBlank = blankPattern.test(line);
            return (
              <div
                key={index}
                className={`${
                  hasCurrentBlank
                    ? 'bg-amber-50 dark:bg-amber-900/20 border-l-2 border-amber-400 pl-2 sm:pl-3 py-0.5 font-medium text-amber-900 dark:text-amber-100'
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                {line}
              </div>
            );
          })}
        </div>
      );
    }

    return (
      <div className="whitespace-pre-wrap text-xs sm:text-sm leading-relaxed text-gray-700 dark:text-gray-300">
        {currentQuestion.passage}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-32">
      {/* Fixed Top Bar */}
      <div className="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
        <div className="px-3 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="hidden sm:block w-1 h-6 sm:h-8 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full"></div>
              <h1 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
                {examTitle}
              </h1>
            </div>

            <Timer
              timeRemaining={timeRemaining}
              setTimeRemaining={setTimeRemaining}
              onTimeUp={handleTimeUp}
            />
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        {/* Main Question Card */}
        <div className="bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800">
          {/* Question Header */}
          <div className="px-4 sm:px-5 lg:px-6 pt-4 sm:pt-5 lg:pt-6 pb-3 sm:pb-4 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                <span className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  {currentQuestion.part}
                </span>
                <div className="w-px h-3 sm:h-4 bg-gray-300 dark:bg-gray-700"></div>
                <span className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {currentQuestionIndex + 1}
                </span>
                <span className="text-xs sm:text-sm text-gray-400">/ {totalQuestions}</span>
              </div>
              
              {/* Status */}
              {isCurrentSubmitted && (
                <div className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-medium whitespace-nowrap ${
                  isCorrect 
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' 
                    : 'bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400'
                }`}>
                  <span className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-current"></span>
                  <span className="hidden sm:inline">{isCorrect ? 'Correct' : 'Incorrect'}</span>
                  <span className="sm:hidden">{isCorrect ? '✓' : '✗'}</span>
                </div>
              )}
            </div>
          </div>

          <div className="p-4 sm:p-5 lg:p-6 space-y-4 sm:space-y-5 lg:space-y-6">
            {/* Passage */}
            {currentQuestion.passage && (
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-5 border border-gray-200 dark:border-gray-700">
                {renderPassage()}
              </div>
            )}

            {/* Question Text */}
            <div>
              <p className="text-sm sm:text-base leading-relaxed text-gray-900 dark:text-gray-100">
                {currentQuestion.question_text}
              </p>
            </div>

            {/* Answer Choices */}
            <div className="space-y-2 sm:space-y-2.5">
              {['A', 'B', 'C', 'D'].map((option) => {
                const optionKey = `choice_${option.toLowerCase()}` as keyof Question;
                const optionText = currentQuestion[optionKey] as string;
                const isSelected = userAnswer === option;
                const isCorrectChoice = option === correctAnswerLetter;

                let containerClass = '';
                let badgeClass = '';
                let icon = null;

                if (isCurrentSubmitted) {
                  if (isCorrectChoice) {
                    containerClass = 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-300 dark:border-emerald-800';
                    badgeClass = 'bg-emerald-500 text-white';
                    icon = <span className="text-emerald-600 dark:text-emerald-400 text-base sm:text-lg">✓</span>;
                  } else if (isSelected) {
                    containerClass = 'bg-rose-50 dark:bg-rose-900/10 border-rose-300 dark:border-rose-800';
                    badgeClass = 'bg-rose-500 text-white';
                    icon = <span className="text-rose-600 dark:text-rose-400 text-base sm:text-lg">✗</span>;
                  } else {
                    containerClass = 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-800 opacity-40';
                    badgeClass = 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400';
                  }
                } else {
                  if (isSelected) {
                    containerClass = 'bg-indigo-50 dark:bg-indigo-900/10 border-indigo-400 dark:border-indigo-600';
                    badgeClass = 'bg-indigo-500 text-white';
                  } else {
                    containerClass = 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-800 hover:border-indigo-300 dark:hover:border-indigo-700 active:scale-[0.98]';
                    badgeClass = 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
                  }
                }

                return (
                  <button
                    key={option}
                    onClick={() => handleSelectAnswer(option)}
                    disabled={isCurrentSubmitted}
                    className={`w-full text-left p-3 sm:p-4 rounded-lg sm:rounded-xl border transition-all ${containerClass} ${
                      isCurrentSubmitted ? 'cursor-not-allowed' : 'cursor-pointer'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 sm:gap-3">
                      <span className={`flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 rounded-md flex items-center justify-center text-xs sm:text-sm font-semibold ${badgeClass}`}>
                        {option}
                      </span>
                      <span className="flex-1 text-xs sm:text-sm text-gray-900 dark:text-gray-100 leading-relaxed">
                        {optionText}
                      </span>
                      {icon}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Explanation */}
            {isCurrentSubmitted && currentQuestion.explanation && (
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <button
                  onClick={() => setShowExplanation(!showExplanation)}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between text-left hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5 sm:gap-2">
                    <span className="text-sm sm:text-base">💡</span>
                    Explanation
                  </span>
                  <svg
                    className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-400 transition-transform ${showExplanation ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {showExplanation && (
                  <div className="px-3 sm:px-4 pb-3 sm:pb-4">
                    <p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 mb-2 font-medium">
                      Correct: {correctAnswerLetter} • {currentQuestion[`choice_${correctAnswerLetter.toLowerCase()}` as keyof Question] as string}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      {currentQuestion.explanation}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Navigation Bar */}
          <div className="px-4 sm:px-5 lg:px-6 py-3 sm:py-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-3">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
            >
              ← <span className="hidden sm:inline">Previous</span>
            </button>

            {currentQuestionIndex === totalQuestions - 1 && answeredCount === totalQuestions ? (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-4 sm:px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-xs sm:text-sm font-semibold rounded-lg transition-all disabled:opacity-50 shadow-sm active:scale-95"
              >
                {isSubmitting ? 'Submitting...' : '✓ Submit Test'}
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={currentQuestionIndex === totalQuestions - 1}
                className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm active:scale-95"
              >
                <span className="hidden sm:inline">Next</span> →
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Fixed Bottom Progress Bar */}
      <div className="fixed bottom-0 inset-x-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 shadow-lg">
        <div className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
          {/* Progress Bar */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100">
                Progress
              </span>
              <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                <span className="font-bold text-indigo-600 dark:text-indigo-400">
                  {progressPercent}%
                </span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-500 dark:text-gray-400">
                  {answeredCount}/{totalQuestions}
                </span>
              </div>
            </div>
            <div className="relative h-2 sm:h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 ease-out rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Stats Pills */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
              <span className="text-[10px] sm:text-xs font-medium text-emerald-700 dark:text-emerald-400">
                {correctCount} Correct
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-rose-50 dark:bg-rose-900/20 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div>
              <span className="text-[10px] sm:text-xs font-medium text-rose-700 dark:text-rose-400">
                {incorrectCount} Incorrect
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
              <span className="text-[10px] sm:text-xs font-medium text-gray-600 dark:text-gray-400">
                {totalQuestions - answeredCount} Left
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}