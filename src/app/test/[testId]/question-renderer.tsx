'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Flag, Clock, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

interface Question {
  id: string;
  question_text: string;
  choices: string[];
  correct_answer: string;
  explanation?: string;
}

// Helper function: แปลง correct_answer เป็น index (0-based)
function getCorrectAnswerIndex(correctAnswer: string): number {
  if (!correctAnswer) return -1;
  const trimmed = correctAnswer.trim().toUpperCase();
  if (/^\d+$/.test(trimmed)) {
    const num = parseInt(trimmed);
    return num > 0 ? num - 1 : -1;
  }
  if (/^[A-Z]$/.test(trimmed)) {
    return trimmed.charCodeAt(0) - 65;
  }
  return -1;
}

interface QuestionRendererProps {
  testId: string;
  testTitle?: string;
}

export default function QuestionRenderer({ testId, testTitle }: QuestionRendererProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [loading, setLoading] = useState(true);
  const [showExplanation, setShowExplanation] = useState(false);
  const [explanationExpanded, setExplanationExpanded] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set());
  const [results, setResults] = useState<Record<number, 'correct' | 'incorrect'>>({});
  const [title, setTitle] = useState(testTitle || '');
  
  const router = useRouter();
  const supabase = createClient();

  // โหลดคำถาม
  useEffect(() => {
    const init = async () => {
      try {
        // โหลด Test info ถ้ายังไม่มี title
        if (!testTitle) {
          const { data: testData } = await supabase
            .from('Tests')
            .select('title')
            .eq('id', testId)
            .single();
          if (testData?.title) {
            setTitle(testData.title);
          }
        }

        const { data: questionsData, error: questionsError } = await supabase
          .from('Question')
          .select('*')
          .eq('test_id', testId)
          .order('order_num', { ascending: true });

        if (questionsError || !questionsData || questionsData.length === 0) {
          setLoading(false);
          return;
        }

        const formattedQuestions = questionsData.map(q => ({
          ...q,
          choices: Array.isArray(q.choices) 
            ? q.choices 
            : typeof q.choices === 'string'
            ? q.choices.split(',').map((s: string) => s.trim())
            : []
        }));

        setQuestions(formattedQuestions);
        setAnswers(new Array(formattedQuestions.length).fill(null));

        const { data: attemptData } = await supabase
          .from('TestAttempt')
          .insert({
            test_id: testId,
            total_questions: formattedQuestions.length,
            start_time: new Date().toISOString(),
            is_completed: false
          })
          .select('*')
          .single();

        if (attemptData?.id) {
          setAttemptId(attemptData.id);
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    init();
  }, [testId, testTitle]);

  // Timer
  useEffect(() => {
    if (loading) return;
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [loading]);

  // Format time
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle answer
  const handleAnswer = async (choiceIndex: number) => {
    if (selectedAnswer !== null || !attemptId) return;

    const q = questions[current];
    const correctAnswerIndex = getCorrectAnswerIndex(q.correct_answer);
    const isCorrect = choiceIndex === correctAnswerIndex;

    await supabase.from('UserAnswer').insert({
      attempt_id: attemptId,
      question_id: q.id,
      submitted_choice: choiceIndex,
      is_correct: isCorrect,
    });

    const newAnswers = [...answers];
    newAnswers[current] = choiceIndex;
    setAnswers(newAnswers);
    setSelectedAnswer(choiceIndex);
    setShowExplanation(true);
    setResults(prev => ({
      ...prev,
      [current]: isCorrect ? 'correct' : 'incorrect'
    }));
  };

  // Navigation
  const handleNext = async () => {
    if (current < questions.length - 1) {
      setCurrent(current + 1);
      setShowExplanation(answers[current + 1] !== null);
      setSelectedAnswer(answers[current + 1]);
      setExplanationExpanded(true);
    } else {
      await finishTest();
    }
  };

  const handlePrev = () => {
    if (current > 0) {
      setCurrent(current - 1);
      setShowExplanation(answers[current - 1] !== null);
      setSelectedAnswer(answers[current - 1]);
      setExplanationExpanded(true);
    }
  };

  // Toggle flag
  const toggleFlag = () => {
    setFlaggedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(current)) {
        newSet.delete(current);
      } else {
        newSet.add(current);
      }
      return newSet;
    });
  };

  // Finish test
  const finishTest = async () => {
    if (!attemptId) return;

    const correctCount = Object.values(results).filter(r => r === 'correct').length;
    const scorePercent = Math.round((correctCount / questions.length) * 100);

    await supabase
      .from('TestAttempt')
      .update({
        score: correctCount,
        score_percent: scorePercent,
        correct_answers: correctCount,
        end_time: new Date().toISOString(),
        is_completed: true,
      })
      .eq('id', attemptId);

    router.push(`/result/${attemptId}`);
  };

  // Loading
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-gray-600">กำลังโหลดข้อสอบ...</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500">
        ไม่พบข้อสอบ
      </div>
    );
  }

  const q = questions[current];
  const correctAnswerIndex = getCorrectAnswerIndex(q.correct_answer);
  const isFlagged = flaggedQuestions.has(current);

  // Stats
  const correctCount = Object.values(results).filter(r => r === 'correct').length;
  const incorrectCount = Object.values(results).filter(r => r === 'incorrect').length;
  const leftCount = questions.length - correctCount - incorrectCount;
  const progressPercent = Math.round(((correctCount + incorrectCount) / questions.length) * 100);

  return (
    <div className="fixed inset-0 z-[9999] bg-gray-50 dark:bg-gray-950 flex flex-col">
      
      {/* ============================================ */}
      {/* Fixed Header - Logo + Title + Timer */}
      {/* ============================================ */}
      <header className="flex-shrink-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          {/* Logo - กลับหน้าหลัก */}
          <Link 
            href="/"
            className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text hover:opacity-80 transition-opacity flex-shrink-0"
          >
            E-Korsob.com
          </Link>
          
          {/* Title */}
          <h1 className="text-lg font-bold text-gray-800 dark:text-gray-200 truncate flex-1 text-center">
            {title || 'ข้อสอบ'}
          </h1>
          
          {/* Timer */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full flex-shrink-0">
            <Clock className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <span className="font-mono text-sm font-semibold text-gray-800 dark:text-gray-200">
              {formatTime(timeElapsed)}
            </span>
          </div>
        </div>
      </header>

      {/* ============================================ */}
      {/* Main Content */}
      {/* ============================================ */}
      <main className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto">
          
          {/* Question Header */}
          <div className="flex items-start justify-between mb-4">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Question {current + 1}.
            </span>
            <button 
              onClick={toggleFlag}
              className={`p-2 rounded-lg transition-colors ${
                isFlagged 
                  ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' 
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-400 hover:text-red-500'
              }`}
            >
              <Flag className="w-5 h-5" fill={isFlagged ? "currentColor" : "none"} />
            </button>
          </div>

          {/* Question Text */}
          <h2 className="text-lg text-gray-800 dark:text-gray-100 mb-6 leading-relaxed">
            {q.question_text}
          </h2>

          {/* Options - Compact Style */}
          <div className="space-y-2">
            {q.choices.map((choice, i) => {
              const isSelected = selectedAnswer === i;
              const isCorrectChoice = i === correctAnswerIndex;
              const showResult = showExplanation;

              let optionStyle = '';
              let radioStyle = '';

              if (showResult) {
                if (isCorrectChoice) {
                  optionStyle = 'bg-green-50 dark:bg-green-900/20 border-l-4 border-l-green-500';
                  radioStyle = 'border-green-500 bg-green-500';
                } else if (isSelected && !isCorrectChoice) {
                  optionStyle = 'bg-gray-50 dark:bg-gray-800';
                  radioStyle = 'border-gray-300 dark:border-gray-600';
                } else {
                  optionStyle = 'bg-white dark:bg-gray-900 opacity-60';
                  radioStyle = 'border-gray-300 dark:border-gray-600';
                }
              } else {
                optionStyle = isSelected 
                  ? 'bg-indigo-50 dark:bg-indigo-900/20 border-l-4 border-l-indigo-500' 
                  : 'bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800';
                radioStyle = isSelected 
                  ? 'border-indigo-500 bg-indigo-500' 
                  : 'border-gray-300 dark:border-gray-600';
              }

              return (
                <button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  disabled={showResult}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${optionStyle} ${
                    !showResult ? 'cursor-pointer' : 'cursor-default'
                  }`}
                >
                  {/* Radio circle */}
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${radioStyle}`}>
                    {(isSelected || (showResult && isCorrectChoice)) && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  
                  {/* Option text */}
                  <span className={`text-sm ${
                    showResult && isCorrectChoice 
                      ? 'text-green-700 dark:text-green-400 font-medium' 
                      : 'text-gray-700 dark:text-gray-300'
                  }`}>
                    ({String.fromCharCode(65 + i)}) {choice}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Answer & Explanation Section */}
          {showExplanation && (
            <div className="mt-6 border-l-4 border-gray-200 dark:border-gray-700 pl-4">
              {/* Correct Answer */}
              <p className="text-sm mb-2">
                <span className="text-green-600 dark:text-green-400 font-medium">Correct answer:</span>{' '}
                <span className="text-green-700 dark:text-green-300">
                  ({String.fromCharCode(65 + correctAnswerIndex)}) {q.choices[correctAnswerIndex]}
                </span>
              </p>
              
              {/* Toggle Explanation */}
              {q.explanation && (
                <>
                  <button 
                    onClick={() => setExplanationExpanded(!explanationExpanded)}
                    className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium flex items-center gap-1"
                  >
                    {explanationExpanded ? 'Hide' : 'Show'} Explanation
                    <ChevronDown 
                      className={`w-4 h-4 transition-transform ${explanationExpanded ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {/* Explanation Content */}
                  {explanationExpanded && (
                    <div className="mt-4">
                      <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Detailed Explanation:</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">
                        {q.explanation}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </main>

      {/* ============================================ */}
      {/* Fixed Navigation Buttons */}
      {/* ============================================ */}
      <div className="flex-shrink-0 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={current === 0}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              current === 0
                ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
            Previous
          </button>

          <button
            onClick={handleNext}
            disabled={selectedAnswer === null}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold transition-colors ${
              selectedAnswer === null
                ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            {current >= questions.length - 1 ? 'Finish' : 'Next'}
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* ============================================ */}
      {/* Fixed Footer - Progress Bar */}
      {/* ============================================ */}
      <footer className="flex-shrink-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 px-4 py-3">
        <div className="max-w-3xl mx-auto">
          {/* Progress Bar */}
          <div className="flex items-center gap-4 mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</span>
            <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">{progressPercent}%</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">{correctCount + incorrectCount}/{questions.length}</span>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-6">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              <span className="text-sm text-gray-600 dark:text-gray-400">{correctCount} Correct</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-500"></span>
              <span className="text-sm text-gray-600 dark:text-gray-400">{incorrectCount} Incorrect</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gray-400"></span>
              <span className="text-sm text-gray-600 dark:text-gray-400">{leftCount} Left</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}