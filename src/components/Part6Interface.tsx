// src/components/Part6Interface.tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';

// ===============================
// TYPES
// ===============================
interface PassageQuestion {
  id: string;
  blank_number: number;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  explanation?: string;
}

interface Passage {
  id: string;
  passage_number: number;
  content: string;
  questions: PassageQuestion[];
}

interface Part6InterfaceProps {
  examTitle: string;
  passages: Passage[];
  timeLimit: number;
  onSubmit: (answers: Record<string, string>, timeUsed: number) => void;
}

// ===============================
// TIMER COMPONENT
// ===============================
function Timer({
  timeRemaining,
  setTimeRemaining,
  onTimeUp,
}: {
  timeRemaining: number;
  setTimeRemaining: React.Dispatch<React.SetStateAction<number>>;
  onTimeUp: () => void;
}) {
  useEffect(() => {
    if (timeRemaining <= 0) {
      onTimeUp();
      return;
    }
    const timer = setInterval(() => {
      setTimeRemaining((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeRemaining, setTimeRemaining, onTimeUp]);

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const isLowTime = timeRemaining <= 300;

  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-mono font-bold ${
      isLowTime ? 'bg-red-500 text-white' : 'bg-white text-slate-700 border border-slate-200'
    }`}>
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</span>
    </div>
  );
}

// ===============================
// QUESTION CARD COMPONENT
// ===============================
function QuestionCard({
  question,
  questionNumber,
  selectedAnswer,
  isSubmitted,
  isActive,
  onSelectAnswer,
  onSubmit,
  onActivate,
}: {
  question: PassageQuestion;
  questionNumber: number;
  selectedAnswer?: string;
  isSubmitted: boolean;
  isActive: boolean;
  onSelectAnswer: (answer: string) => void;
  onSubmit: () => void;
  onActivate: () => void;
}) {
  const isCorrect = selectedAnswer === question.correct_answer;
  const options = [
    { key: 'A', value: question.option_a },
    { key: 'B', value: question.option_b },
    { key: 'C', value: question.option_c },
    { key: 'D', value: question.option_d },
  ];

  return (
    <div
      onClick={onActivate}
      className={`rounded-xl border p-4 transition-all cursor-pointer ${
        isActive 
          ? 'border-blue-400 bg-blue-50 shadow-sm' 
          : 'border-slate-200 bg-white hover:border-slate-300'
      } ${isSubmitted && isCorrect ? 'border-emerald-400 bg-emerald-50' : ''}
        ${isSubmitted && !isCorrect ? 'border-red-300 bg-red-50' : ''}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
          isSubmitted && isCorrect ? 'bg-emerald-500 text-white' :
          isSubmitted && !isCorrect ? 'bg-red-500 text-white' :
          isActive ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-600'
        }`}>
          {questionNumber}
        </span>
        {isSubmitted && (
          <span className={`text-xs font-medium ${isCorrect ? 'text-emerald-600' : 'text-red-600'}`}>
            {isCorrect ? '✓ Correct' : `✗ Answer: ${question.correct_answer}`}
          </span>
        )}
      </div>

      {/* Options */}
      <div className="grid grid-cols-2 gap-2">
        {options.map(({ key, value }) => {
          const isSelected = selectedAnswer === key;
          const isCorrectOption = question.correct_answer === key;

          let style = 'bg-white border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-blue-50';
          if (isSubmitted) {
            if (isCorrectOption) style = 'bg-emerald-500 border-emerald-500 text-white';
            else if (isSelected) style = 'bg-red-100 border-red-300 text-red-700';
            else style = 'bg-slate-50 border-slate-100 text-slate-400';
          } else if (isSelected) {
            style = 'bg-blue-500 border-blue-500 text-white';
          }

          return (
            <button
              key={key}
              onClick={(e) => { e.stopPropagation(); if (!isSubmitted) onSelectAnswer(key); }}
              disabled={isSubmitted}
              className={`flex items-center gap-2 p-2.5 rounded-lg border text-left text-sm transition-all ${style}`}
            >
              <span className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${
                isSelected || (isSubmitted && isCorrectOption) ? 'bg-white/20' : 'bg-slate-100'
              }`}>{key}</span>
              <span className="flex-1 leading-tight">{value}</span>
            </button>
          );
        })}
      </div>

      {/* Submit */}
      {!isSubmitted && selectedAnswer && isActive && (
        <button
          onClick={(e) => { e.stopPropagation(); onSubmit(); }}
          className="w-full mt-3 py-2 rounded-lg bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-all"
        >
          Submit
        </button>
      )}

      {/* Explanation */}
      {isSubmitted && question.explanation && (
        <div className={`mt-3 p-3 rounded-lg text-xs ${isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-50 text-amber-800'}`}>
          <strong>Explanation:</strong> {question.explanation}
        </div>
      )}
    </div>
  );
}

// ===============================
// MAIN COMPONENT
// ===============================
export default function Part6Interface({
  examTitle,
  passages,
  timeLimit,
  onSubmit,
}: Part6InterfaceProps) {
  const [currentPassageIndex, setCurrentPassageIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeRemaining, setTimeRemaining] = useState(timeLimit * 60);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedQuestions, setSubmittedQuestions] = useState<Record<string, boolean>>({});
  const [activeBlankNumber, setActiveBlankNumber] = useState<number>(1);

  const currentPassage = passages[currentPassageIndex];
  const totalPassages = passages.length;
  const totalQuestions = passages.reduce((sum, p) => sum + p.questions.length, 0);
  const submittedCount = Object.keys(submittedQuestions).length;

  const getQuestionNumber = (passageIndex: number, blankNumber: number) => {
    let start = 1;
    for (let i = 0; i < passageIndex; i++) start += passages[i].questions.length;
    return start + blankNumber - 1;
  };

  const handleSelectAnswer = (questionId: string, answer: string) => {
    if (submittedQuestions[questionId]) return;
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmitQuestion = (questionId: string) => {
    if (!answers[questionId]) return;
    setSubmittedQuestions((prev) => ({ ...prev, [questionId]: true }));
    const curr = currentPassage.questions.find((q) => q.id === questionId);
    if (curr) {
      const next = currentPassage.questions.find((q) => q.blank_number > curr.blank_number && !submittedQuestions[q.id]);
      if (next) setActiveBlankNumber(next.blank_number);
    }
  };

  const handleSubmitAll = async () => {
    const answeredCount = Object.keys(answers).length;
    if (answeredCount < totalQuestions) {
      if (!window.confirm(`You've answered ${answeredCount}/${totalQuestions} questions.\nSubmit anyway?`)) return;
    }
    setIsSubmitting(true);
    await onSubmit(answers, timeLimit * 60 - timeRemaining);
  };

  const handleTimeUp = () => {
    alert('Time is up!');
    handleSubmitAll();
  };

  const parsedParagraphs = useMemo(() => {
    return (currentPassage.content || '').split(/\n\n+/).filter(p => p.trim());
  }, [currentPassage.content]);

  return (
    <div className="fixed inset-0 z-[9999] bg-gradient-to-br from-slate-100 via-slate-50 to-blue-50 flex flex-col">
      
      {/* ===== HEADER ===== */}
      <header className="flex-shrink-0 py-4 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold text-rose-500 hover:text-rose-600 transition-colors">
            E-Korsob.com
          </Link>

          {/* Passage Tabs */}
          <div className="flex items-center gap-2">
            {passages.map((_, idx) => {
              const pq = passages[idx].questions;
              const submitted = pq.filter(q => submittedQuestions[q.id]).length;
              const complete = submitted === pq.length;
              const current = idx === currentPassageIndex;

              return (
                <button
                  key={idx}
                  onClick={() => { setCurrentPassageIndex(idx); setActiveBlankNumber(1); }}
                  className={`w-10 h-10 rounded-full font-bold text-sm transition-all ${
                    current ? 'bg-blue-600 text-white shadow-lg scale-110' :
                    complete ? 'bg-emerald-500 text-white' :
                    submitted > 0 ? 'bg-amber-400 text-white' :
                    'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          {/* Progress & Timer */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500 hidden sm:block">
              {submittedCount}/{totalQuestions} done
            </span>
            <Timer timeRemaining={timeRemaining} setTimeRemaining={setTimeRemaining} onTimeUp={handleTimeUp} />
          </div>
        </div>
      </header>

      {/* ===== MAIN CONTENT ===== */}
      <main className="flex-1 overflow-hidden px-6 pb-6">
        <div className="max-w-6xl mx-auto h-full flex gap-6">
          
          {/* LEFT: PASSAGE */}
          <div className="w-3/5 flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Passage Header */}
            <div className="flex-shrink-0 px-6 py-4 bg-slate-800 text-white flex justify-between items-center">
              <span className="font-semibold">Passage {currentPassage.passage_number}</span>
              <span className="text-slate-300 text-sm">
                Q{getQuestionNumber(currentPassageIndex, 1)}–{getQuestionNumber(currentPassageIndex, currentPassage.questions.length)}
              </span>
            </div>
            
            {/* Passage Body - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6">
              {parsedParagraphs.map((p, i) => (
                <p key={i} className="mb-4 text-slate-700 leading-relaxed">{p}</p>
              ))}
            </div>
          </div>

          {/* RIGHT: QUESTIONS */}
          <div className="w-2/5 flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Questions Header */}
            <div className="flex-shrink-0 px-6 py-4 border-b border-slate-100">
              <span className="font-semibold text-slate-800">Answer Choices</span>
            </div>

            {/* Questions Body - Scrollable */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {currentPassage.questions
                .sort((a, b) => a.blank_number - b.blank_number)
                .map((q) => (
                  <QuestionCard
                    key={q.id}
                    question={q}
                    questionNumber={getQuestionNumber(currentPassageIndex, q.blank_number)}
                    selectedAnswer={answers[q.id]}
                    isSubmitted={!!submittedQuestions[q.id]}
                    isActive={activeBlankNumber === q.blank_number}
                    onSelectAnswer={(ans) => handleSelectAnswer(q.id, ans)}
                    onSubmit={() => handleSubmitQuestion(q.id)}
                    onActivate={() => setActiveBlankNumber(q.blank_number)}
                  />
                ))}
            </div>

            {/* Navigation */}
            <div className="flex-shrink-0 p-4 border-t border-slate-100 flex gap-3">
              <button
                onClick={() => { setCurrentPassageIndex((p) => Math.max(0, p - 1)); setActiveBlankNumber(1); }}
                disabled={currentPassageIndex === 0}
                className="flex-1 py-2.5 rounded-lg border border-slate-300 text-slate-600 font-semibold text-sm hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                ← Previous
              </button>
              {currentPassageIndex === totalPassages - 1 ? (
                <button
                  onClick={handleSubmitAll}
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 rounded-lg bg-emerald-500 text-white font-semibold text-sm hover:bg-emerald-600 disabled:opacity-50 transition-all"
                >
                  {isSubmitting ? 'Submitting...' : '✓ Submit All'}
                </button>
              ) : (
                <button
                  onClick={() => { setCurrentPassageIndex((p) => p + 1); setActiveBlankNumber(1); }}
                  className="flex-1 py-2.5 rounded-lg bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-all"
                >
                  Next →
                </button>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}